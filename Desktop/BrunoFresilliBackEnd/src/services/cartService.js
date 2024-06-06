const CartRepository = require('../repositories/cartRepository');
const User = require('../dao/models/user.js');

class CartService {
    async createCart(userId) {
        const cart = await CartRepository.createCart([]);
        await User.findByIdAndUpdate(userId, { cart: cart._id });
        return cart;
    }

    async getCartProducts(cartId) {
        const cart = await CartRepository.getCartById(cartId);
        return cart ? cart.products : null;
    }

    async addProductToCart(userId, productId, quantity = 1) {
        let user = await User.findById(userId).populate('cart');

        if (!user.cart) {
            user.cart = await this.createCart(userId);
        }

        const cart = await CartRepository.addProductToCart(user.cart._id, productId, quantity);
        return cart;
    }

    async updateCart(cartId, products) {
        return await CartRepository.updateCart(cartId, products);
    }

    async updateProductQuantity(cartId, productId, quantity) {
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
        return updatedCart;
    }

    async deleteCart(cartId) {
        return await CartRepository.deleteCart(cartId);
    }

    async removeProductFromCart(cartId, productId) {
        const cart = await CartRepository.getCartById(cartId);
        if (!cart) {
            return null;
        }

        cart.products = cart.products.filter(p => p.product._id.toString() !== productId);
        const updatedCart = await CartRepository.updateCart(cart._id, cart.products);
        return updatedCart;
    }
}

module.exports = new CartService();
