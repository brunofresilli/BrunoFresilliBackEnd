const CartDAO = require('../dao/cartDAO.js');
const CartDTO = require('../dao/dto/cartDTO.js');
const logger = require('../utils/logger.js'); // Asegúrate de ajustar la ruta según la ubicación de tu configuración de logger

class CartRepository {
    async createCart() {
        try {
            return await CartDAO.create();
        } catch (error) {
            logger.error(`Error creating cart: ${error.message}`);
            throw new Error("Error creating cart");
        }
    }

    async getCartById(cartId) {
        try {
            return await CartDAO.getCartById(cartId);
        } catch (error) {
            logger.error(`Error fetching cart with ID ${cartId}: ${error.message}`);
            throw new Error(`Error fetching cart with ID ${cartId}`);
        }
    }

    

    async addCart(cartId, productId, quantity) {
        const cart = await CartDAO.findOne({ _id: cartId });
        if (!cart) {
            throw new Error(`Cart with ID ${cartId} not found`);
        }

        const existingProduct = cart.products.find(
            (product) => product.product.toString() === productId.toString()
        );

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await cart.save();
        return cart;
    }

    async updateCart(cartId, products) {
        try {
            return await CartDAO.updateCart(cartId, products);
        } catch (error) {
            logger.error(`Error updating cart with ID ${cartId}: ${error.message}`);
            throw new Error(`Error updating cart with ID ${cartId}`);
        }
    }

    async deleteCart(cartId) {
        try {
            return await Cart.findByIdAndDelete(cartId);
        } catch (error) {
            logger.error(`Error deleting cart with ID ${cartId}: ${error.message}`);
            throw new Error(`Error deleting cart with ID ${cartId}`);
        }
    }
}

module.exports = new CartRepository();
