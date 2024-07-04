const cartService = require('../services/cartService');
const CustomError = require('../services/errors/CustomError.js');
const { ErrorCodes } = require('../services/errors/enums.js');
const { logger } = require('../utils/logger.js');
const Cart = require ('../dao/models/cart.js');
const Ticket = require ('../dao/models/ticket.js');
const crypto = require ('crypto');



class CartController {

    async createCart() {
        try {
          const newCart = await cartService.createCart();
          return newCart;
        } catch (error) {
          console.error(error.message);
          throw new Error("Error creating cart");
        }
      }

      async getCartProducts(cartId) {
        try {
          console.log('Controller: getCartProducts called');
          const products = await cartService.getCartProducts(cartId);
          return { products: products || [] };
        } catch (error) {
          logger.error('Controller error:', error.message);
          throw new Error(`Products not found in cart ${cartId}`);
        }
      }
  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      return await cartService.addProductToCart(
        cartId,
        productId,
        quantity
      );
    } catch (error) {
      console.error(error.message);
      throw new Error("Error adding product to cart");
    }
  }
    async updateCart(req, res, next) {
        try {
            const cartId = req.params.id;
            const { products } = req.body;
            const updatedCart = await cartService.updateCart(cartId, products);
            if (!updatedCart) {
                logger.warn(`Cart not found: ${cartId}`);
                throw CustomError.createError({
                    name: 'Cart Not Found',
                    cause: `Cart with ID ${cartId} not found`,
                    message: 'Cart not found',
                    code: ErrorCodes.CART_OPERATION_ERROR,
                });
            }
            logger.info('Cart updated successfully', { cartId });
            res.status(200).json(updatedCart);
        } catch (error) {
            logger.error('Error updating cart', { error });
            next(error);
        }
    }

    async updateProductQuantity(req, res, next) {
        try {
            const cartId = req.params.id;
            const { productId } = req.params;
            const { quantity } = req.body;
            const result = await cartService.updateProductQuantity(cartId, productId, quantity);
            logger.info('Product quantity updated successfully', { cartId, productId, quantity });
            res.status(200).json(result);
        } catch (error) {
            logger.error('Error updating product quantity in cart', { error });
            next(CustomError.createError({
                name: 'Database Error',
                cause: error,
                message: 'Error updating product quantity in cart',
                code: ErrorCodes.DATABASE_ERROR,
            }));
        }
    }

   
  async deleteCart(id) {
    try {
      return await cartService.deleteCart(id);
    } catch (error) {
      console.error(error.message);
      throw new Error("Error deleting cart");
    }
  }

        async deleteProductFromCart(cartId, productId) {
            try {
              return await cartService.deleteProductFromCart(cartId, productId);
        } catch (error) {
            logger.error('Error removing product from cart', { error });
            next(error);
        }
    }
    finalizePurchase = async (cartId, purchaser) => {
      try {
        
        const cart = await Cart.findById(cartId).populate('products.product');
        if (!cart) {
          throw new Error('Cart not found');
        }
    
        const productsNotPurchased = [];
        const purchasedProducts = [];
        let totalAmount = 0;
    
        for (const cartProduct of cart.products) {
          const product = cartProduct.product;
          const quantity = cartProduct.quantity;
          if (product.stock >= quantity) {
            product.stock -= quantity;
            await product.save();
            purchasedProducts.push({
              product: product._id,
              quantity,
            });
            totalAmount += product.price * quantity;
          } else {
            productsNotPurchased.push(product._id);
          }
        }
    
        // Genera un código único para el ticket
        const ticketCode = crypto.randomBytes(16).toString('hex');
    
        // Genera un ticket para la compra
        const ticket = await Ticket.create({
          code: ticketCode,
          products: purchasedProducts,
          purchase_datetime: new Date(),
          amount: totalAmount,
          purchaser: purchaser,
        });
    
        // Actualiza el carrito para contener solo los productos que no pudieron comprarse
        cart.products = cart.products.filter(cartProduct => productsNotPurchased.includes(cartProduct.product._id));
        await cart.save();
    
        return {
          status: 'success',
          message: 'Purchase completed',
          ticket,
          productsNotPurchased,
        };
      } catch (error) {
        throw new Error('Error finalizing purchase: ' + error.message);
      }
    };
    }

    
module.exports = new CartController();
