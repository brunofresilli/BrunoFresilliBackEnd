const Cart = require('../dao/models/cart.js');

class CartDAO {
    async createCart(products) {
        const cart = new Cart({ products });
        await cart.save();
        return cart;
    }

    async getCartById(cartId) {
        return await Cart.findById(cartId).populate('products.product');
    }

    async updateCart(cartId, products) {
        return await Cart.findByIdAndUpdate(cartId, { products }, { new: true }).populate('products.product');
    }
}

module.exports = new CartDAO();