const Cart = require('../dao/models/cart.js');

class CartService {
    
    async createCart(products) {
        try {
            const newCart = await Cart.create({ products });
            return newCart;
        } catch (error) {
            throw new Error('Error creating cart: ' + error.message);
        }
    }

    async getCartProducts(cartId) {
        try {
            const cart = await Cart.findById(cartId);
            return cart ? cart.products : null;
        } catch (error) {
            throw new Error('Error getting cart products: ' + error.message);
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        try {
            let cart = await Cart.findById(cartId);

            if (!cart) {
                cart = await this.createCart([]);
            }

            const existingProductIndex = cart.products.findIndex(product => product.productId.toString() === productId);
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += parseInt(quantity);
            } else {
                cart.products.push({ productId, quantity: parseInt(quantity) });
            }

            await cart.save();

            return { message: 'Product added to cart' };
        } catch (error) {
            throw new Error('Error adding product to cart: ' + error.message);
        }
    }
}

module.exports = new CartService();
