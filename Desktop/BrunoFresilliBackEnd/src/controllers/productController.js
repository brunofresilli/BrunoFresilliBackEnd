const productService = require('../services/productService.js');

class ProductController {

    async getProducts(req, res) {
        try {
            const products = await productService.getProducts();
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener productos' });
        }
    }

    async getProductById(req, res) {
        try {
            const productId = req.params.id;
            const product = await productService.getProductById(productId);
            if (!product) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener producto por ID' });
        }
    }

    async getProductByCode(req, res) {
        try {
            const code = req.params.code;
            const product = await productService.getProductByCode(code);
            if (!product) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener producto por código' });
        }
    }

    async addProduct(req, res) {
        try {
            const productData = req.body;
            const newProduct = await productService.addProduct(productData);
            res.status(201).json(newProduct);
        } catch (error) {
            res.status(500).json({ error: 'Error al agregar producto' });
        }
    }

    async updateProduct(req, res) {
        try {
            const productId = req.params.id;
            const updatedProductData = req.body;
            await productService.updateProduct(productId, updatedProductData);
            res.status(200).json({ message: 'Producto actualizado correctamente' });
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar el producto' });
        }
    }

    async deleteProduct(req, res) {
        try {
            const productId = req.params.id;
            await productService.deleteProduct(productId);
            res.status(200).json({ message: 'Producto eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar producto' });
        }
    }
}

module.exports = new ProductController();
