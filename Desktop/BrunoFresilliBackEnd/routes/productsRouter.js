const express = require('express');
const router = express.Router();
const ProductManager = require('../src/models/product.js'); 

const filePath = './products.json'; 



router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10; 
        const page = parseInt(req.query.page) || 1; 
        const sort = req.query.sort; 
        const query = req.query.query; 

        
        let filter = {};
        if (query) {
            filter = { $or: [{ category: query }, { availability: query }] };
        }

        
        const totalProducts = await Product.countDocuments(filter);

        
        const totalPages = Math.ceil(totalProducts / limit);
        const skip = (page - 1) * limit;

        
        let productsQuery = Product.find(filter).skip(skip).limit(limit);
        if (sort) {
            productsQuery = productsQuery.sort({ price: sort === 'asc' ? 1 : -1 });
        }
        const products = await productsQuery.exec();

        
        const response = {
            status: 'success',
            payload: products,
            totalPages: totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null,
            page: page,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevLink: page > 1 ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
            nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null
        };

        
        res.json(response);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ status: 'error', error: 'Error al obtener productos' });
    }
});
router.post('/', async (req, res) => {
    const productData = req.body;
    try {
        const newProduct = await productManager.addProduct(productData);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:pid', async (req, res) => {
    const productId = req.params.pid;
    const updatedData = req.body;
    try {
        const updatedProduct = await productManager.updateProduct(productId, updatedData);
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
        const deletedProduct = await productManager.deleteProduct(productId);
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
