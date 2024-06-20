const CartRepository = require('../repositories/cartRepository');
const logger = require('../utils/logger.js'); // Importar el logger configurado

class CartService {
    
    async getCartProducts(cartId) {
        try {
            const cart = await CartRepository.getCartById(cartId);
            return cart ? cart.products : null;
        } catch (error) {
            logger.error('Error al obtener productos del carrito', { cartId, error });
            throw error; // Propagar el error para manejarlo en niveles superiores
        }
    }

    async addProductToCart(cartid, productId, quantity) {
        try {
            logger.info(`Agregando producto ${productId} al carrito ${cartid} con cantidad ${quantity}`);
            return await CartRepository.addProductToCart(cartid, productId, quantity);
        } catch (error) {
            logger.error('Error al agregar producto al carrito', { cartid, productId, quantity, error });
            throw new Error('Error al agregar producto al carrito');
        }
    }

    async createCart() {
        try {
            const newCart = await CartRepository.createCart();
            logger.info('Carrito creado correctamente', { newCart });
            return newCart;
        } catch (error) {
            logger.error('Error al crear carrito', { error });
            throw new Error('Error al crear carrito');
        }
    }

    async updateCart(cartId, products) {
        try {
            const updatedCart = await CartRepository.updateCart(cartId, products);
            logger.info('Carrito actualizado correctamente', { cartId });
            return updatedCart;
        } catch (error) {
            logger.error('Error al actualizar carrito', { cartId, error });
            throw new Error('Error al actualizar carrito');
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await CartRepository.getCartById(cartId);
            if (!cart) {
                return null;
            }

            const productIndex = cart.products.findIndex(p => p.product._id.toString() === productId);
            if (productIndex === -1) {
                return null;
            }

            cart.products[productIndex].quantity = quantity;
            const updatedCart = await CartRepository.updateCart(cart._id, cart.products);
            logger.info('Cantidad de producto actualizada en el carrito', { cartId, productId, quantity });
            return updatedCart;
        } catch (error) {
            logger.error('Error al actualizar cantidad de producto en el carrito', { cartId, productId, quantity, error });
            throw new Error('Error al actualizar cantidad de producto en el carrito');
        }
    }

    async deleteCart(cartId) {
        try {
            const deletedCart = await CartRepository.deleteCart(cartId);
            logger.info('Carrito eliminado correctamente', { cartId });
            return deletedCart;
        } catch (error) {
            logger.error('Error al eliminar carrito', { cartId, error });
            throw new Error('Error al eliminar carrito');
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await CartRepository.getCartById(cartId);
            if (!cart) {
                return null;
            }

            cart.products = cart.products.filter(p => p.product._id.toString() !== productId);
            const updatedCart = await CartRepository.updateCart(cart._id, cart.products);
            logger.info('Producto eliminado del carrito correctamente', { cartId, productId });
            return updatedCart;
        } catch (error) {
            logger.error('Error al eliminar producto del carrito', { cartId, productId, error });
            throw new Error('Error al eliminar producto del carrito');
        }
    }
}

module.exports = new CartService();
