const Cart = require('../dao/models/cart.js');

class CartDAO {
    async create() {
        return await Cart.create({ products: [] });
    }

    async getCartById(cartId) {
        return await Cart.findById(cartId).populate('products.product');
    }

    async updateCart(cartId, products) {
        return await Cart.findByIdAndUpdate(cartId, { products }, { new: true }).populate('products.product');
    }

    
  async addCart(cartId, productId, quantity) {
    const cart = await Cart.findOne({ _id: cartId });
    if (!cart) throw new Error(`Cart with ID ${cartId} not found`);

    const existingProduct = cart.products.find(
      (product) => product.product.toString() === productId
    );
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    return cart;
  }
}

module.exports = new CartDAO();
