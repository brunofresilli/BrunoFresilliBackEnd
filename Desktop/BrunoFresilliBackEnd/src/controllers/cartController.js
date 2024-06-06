const cartService = require('../services/cartService');

class CartController {
    async createCart(req, res) {
        try {
            const { products } = req.body;
            const newCart = await cartService.createCart(products);
            res.status(201).json(newCart);
        } catch (error) {
            res.status(500).json({ error: 'Error creating cart' });
        }
    }

    async getCartProducts(req, res) {
        try {
            const cartId = req.params.id;
            const products = await cartService.getCartProducts(cartId);
            if (!products) {
                return res.status(404).json({ error: 'Cart not found' });
            }
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: 'Error getting cart products' });
        }
    }

    async addProductToCart(req, res) {
        try {
            const cartId = req.params.id;
            const { productId, quantity } = req.body;
            const result = await cartService.addProductToCart(cartId, productId, quantity);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Error adding product to cart' });
        }
    }

    async updateCart(req, res) {
        try {
            const cartId = req.params.id;
            const { products } = req.body;
            const updatedCart = await cartService.updateCart(cartId, products);
            if (!updatedCart) {
                return res.status(404).json({ error: 'Cart not found' });
            }
            res.status(200).json(updatedCart);
        } catch (error) {
            res.status(500).json({ error: 'Error updating cart' });
        }
    }

    async updateProductQuantity(req, res) {
        try {
            const cartId = req.params.id;
            const { productId } = req.params;
            const { quantity } = req.body;
            const result = await cartService.updateProductQuantity(cartId, productId, quantity);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Error updating product quantity in cart' });
        }
    }

    async deleteCart(req, res) {
        try {
            const cartId = req.params.id;
            const result = await cartService.deleteCart(cartId);
            if (!result) {
                return res.status(404).json({ error: 'Cart not found' });
            }
            res.status(200).json({ message: 'Cart deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Error deleting cart' });
        }
    }

    async removeProductFromCart(req, res) {
        try {
            const cartId = req.params.id;
            const { productId } = req.params;
            const result = await cartService.removeProductFromCart(cartId, productId);
            if (!result) {
                return res.status(404).json({ error: 'Product not found in cart' });
            }
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Error removing product from cart' });
        }
    }
}

module.exports = new CartController();
