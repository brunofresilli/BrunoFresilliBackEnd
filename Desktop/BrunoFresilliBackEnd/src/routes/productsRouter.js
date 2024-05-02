const express = require('express');
const router = express.Router();
const ProductManager = require('../dao/models/product.js'); 

const BASE_URL = 'http://localhost:8080/products';
router.get('/products', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort;
        const query = req.query.query;

        let filter = {};
        if (query) {
            filter = { $or: [{ category: query }, { availability: query }] };
        }

        const options = {
            page: page,
            limit: limit,
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : null
        };

        const products = await ProductManager.paginate({}, { page, limit: 10, lean: true });


        const response = {
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage || null,
            nextPage: products.nextPage || null,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `${BASE_URL}?page=${products.prevPage}` : null,
            nextLink: products.hasNextPage ? `${BASE_URL}?page=${products.nextPage}` : null
        };

        res.json(response);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ status: 'error', error: 'Error al obtener productos' });
    }
});

router.post('/realTimeProducts', async (req, res) => {
    const productData = req.body;
    try {
        const newProduct = await ProductManager.addProduct(productData);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:pid', async (req, res) => {
    const productId = req.params.pid;
    const updatedData = req.body;
    try {
        const updatedProduct = await ProductManager.updateProduct(productId, updatedData);
        if (!updatedProduct) {
            res.status(404).json({ error: 'Producto no encontrado' });
        } else {
            res.json(updatedProduct);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
        const deletedProduct = await ProductManager.deleteProduct(productId);
        if (!deletedProduct) {
            res.status(404).json({ error: 'Producto no encontrado' });
        } else {
            res.json({ message: 'Producto eliminado correctamente' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


module.exports = router;