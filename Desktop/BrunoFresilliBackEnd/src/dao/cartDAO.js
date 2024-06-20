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

    async addCart(cartid, productId, quantity) {
        try {
          
            const cart = await Cart.findOne({ _id: cartid });
            if (!cart) {
                throw new Error(`Cart with ID ${cartid} not found`);
            }
    
           
            const product = await Product.findById(productId);
            if (!product) {
                throw new Error(`Product with ID ${productId} not found`);
            }
    
         
            const existingProduct = cart.products.find(
                (item) => item.product.toString() === productId.toString()
            );
    
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }
    
           
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error adding product to cart:", error);
            throw new Error("Error adding product to cart");
        }
    }}
    


module.exports = new CartDAO();
