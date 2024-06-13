const cartService = require('../services/cartService');
const CustomError = require('../services/errors/CustomError');
const { ErrorCodes } = require('../services/errors/enums');
const { generateCartErrorInfo } = require('../services/errors/info'); 

class CartController {
    async createCart(req, res, next) {
        try {
            const { products } = req.body;
            const newCart = await cartService.createCart(products);
            res.status(201).json(newCart);
        } catch (error) {
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
                throw CustomError.createError({
                    name: 'Cart Not Found',
                    cause: `Cart with ID ${cartId} not found`,
                    message: 'Cart not found',
                    code: ErrorCodes.CART_OPERATION_ERROR,
                });
            }
            res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }

    async addProductToCart(req, res, next) {
        try {
            const cartId = req.params.id;
            const { productId, quantity } = req.body;
            const result = await cartService.addProductToCart(cartId, productId, quantity);
            res.status(200).json(result);
        } catch (error) {
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
                throw CustomError.createError({
                    name: 'Cart Not Found',
                    cause: `Cart with ID ${cartId} not found`,
                    message: 'Cart not found',
                    code: ErrorCodes.CART_OPERATION_ERROR,
                });
            }
            res.status(200).json(updatedCart);
        } catch (error) {
            next(error);
        }
    }

    async updateProductQuantity(req, res, next) {
        try {
            const cartId = req.params.id;
            const { productId } = req.params;
            const { quantity } = req.body;
            const result = await cartService.updateProductQuantity(cartId, productId, quantity);
            res.status(200).json(result);
        } catch (error) {
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
                throw CustomError.createError({
                    name: 'Cart Not Found',
                    cause: `Cart with ID ${cartId} not found`,
                    message: 'Cart not found',
                    code: ErrorCodes.CART_OPERATION_ERROR,
                });
            }
            res.status(200).json({ message: 'Cart deleted successfully' });
        } catch (error) {
            next(error);
        }
    }

    async removeProductFromCart(req, res, next) {
        try {
            const cartId = req.params.id;
            const { productId } = req.params;
            const result = await cartService.removeProductFromCart(cartId, productId);
            if (!result) {
                throw CustomError.createError({
                    name: 'Product Not Found in Cart',
                    cause: `Product with ID ${productId} not found in cart`,
                    message: 'Product not found in cart',
                    code: ErrorCodes.CART_OPERATION_ERROR,
                });
            }
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CartController();
