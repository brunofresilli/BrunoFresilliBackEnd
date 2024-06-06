const CartDAO = require('../dao/cartDAO');

class CartRepository {
    async createCart(products) {
        return await CartDAO.createCart(products);
    }

    async getCartById(cartId) {
        return await CartDAO.getCartById(cartId);
    }

    async addProductToCart(cartId, productId, quantity) {
        const cart = await this.getCartById(cartId);

        if (!cart) {
            const newCart = await this.createCart([{ product: productId, quantity }]);
            return newCart;
        }

        const existingProductIndex = cart.products.findIndex(product => product.product._id.toString() === productId);
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        const updatedCart = await CartDAO.updateCart(cart._id, cart.products);
        return updatedCart;
    }

    async updateCart(cartId, products) {
        return await CartDAO.updateCart(cartId, products);
    }

    async deleteCart(cartId) {
        return await Cart.findByIdAndDelete(cartId);
    }
}

module.exports = new CartRepository();