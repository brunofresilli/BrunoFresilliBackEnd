const cartService = require('../services/cartService');
const CustomError = require('../services/errors/CustomError');
const { ErrorCodes } = require('../services/errors/enums');
const { generateCartErrorInfo } = require('../services/errors/info');
const logger = require('../utils/logger');

class CartController {

    async createCart(req, res, next) {
        try {
            const newCart = await cartService.createCart();
            logger.info('Cart created successfully', { cartId: newCart._id });
            res.status(201).json(newCart);
        } catch (error) {
            logger.error('Error creating cart', { error });
            next(CustomError.createError({
                name: 'Database Error',
                cause: error,
                message: 'Error creating cart',
                code: ErrorCodes.DATABASE_ERROR,
            }));
        }
    }

    async getCartProducts(req, res, next) {
        try {
            const cartId = req.params.id;
            const products = await cartService.getCartProducts(cartId);
            if (!products) {
                logger.warn(`Cart not found: ${cartId}`);
                throw CustomError.createError({
                    name: 'Cart Not Found',
                    cause: `Cart with ID ${cartId} not found`,
                    message: 'Cart not found',
                    code: ErrorCodes.CART_OPERATION_ERROR,
                });
            }
            logger.info('Products retrieved successfully', { cartId });
            res.status(200).json(products);
        } catch (error) {
            logger.error('Error retrieving cart products', { error });
            next(error);
        }
    }

    async addProductToCart(req, res, next) {
        try {
            const cartId = req.params.id;
            const { productId } = req.params;
            const { quantity } = req.body || 1;
            logger.info(`Adding product to cart`, { cartId, productId, quantity });
            const updatedCart = await cartService.addProductToCart(cartId, productId, quantity);
            res.status(200).json(updatedCart);
        } catch (error) {
            logger.error('Error adding product to cart', { error });
            next(CustomError.createError({
                name: 'Database Error',
                cause: error,
                message: 'Error adding product to cart',
                code: ErrorCodes.DATABASE_ERROR,
            }));
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

    async deleteCart(req, res, next) {
        try {
            const cartId = req.params.id;
            const result = await cartService.deleteCart(cartId);
            if (!result) {
                logger.warn(`Cart not found: ${cartId}`);
                throw CustomError.createError({
                    name: 'Cart Not Found',
                    cause: `Cart with ID ${cartId} not found`,
                    message: 'Cart not found',
                    code: ErrorCodes.CART_OPERATION_ERROR,
                });
            }
            logger.info('Cart deleted successfully', { cartId });
            res.status(200).json({ message: 'Cart deleted successfully' });
        } catch (error) {
            logger.error('Error deleting cart', { error });
            next(error);
        }
    }

    async removeProductFromCart(req, res, next) {
        try {
            const cartId = req.params.id;
            const { productId } = req.params;
            const result = await cartService.removeProductFromCart(cartId, productId);
            if (!result) {
                logger.warn(`Product not found in cart: ${cartId}, productId: ${productId}`);
                throw CustomError.createError({
                    name: 'Product Not Found in Cart',
                    cause: `Product with ID ${productId} not found in cart`,
                    message: 'Product not found in cart',
                    code: ErrorCodes.CART_OPERATION_ERROR,
                });
            }
            logger.info('Product removed from cart successfully', { cartId, productId });
            res.status(200).json(result);
        } catch (error) {
            logger.error('Error removing product from cart', { error });
            next(error);
        }
    }
}

module.exports = CartController;
