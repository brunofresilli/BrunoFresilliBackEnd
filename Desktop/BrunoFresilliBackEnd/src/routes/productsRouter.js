const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const  authorize  = require('../middlewares/authJWT.js');


router.post('/realTimeProducts', authorize('admin'), async (req, res) => {
    const productData = req.body;
    try {
        const newProduct = await productController.addProduct(productData);
        res.status(201).json(newProduct);
    } catch (error) {
        if (error.code === 'INVALID_TYPES_ERROR') {
            res.status(400).json({ error: error.message });
        } else if (error.code === 'DATABASE_ERROR') {
            res.status(500).json({ error: 'Error al agregar producto en la base de datos' });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
});


router.put('/:pid', authorize('admin'), async (req, res) => {
    const productId = req.params.pid;
    const updatedData = req.body;
    try {
        const updatedProduct = await productController.updateProduct(productId, updatedData);
        if (!updatedProduct) {
            res.status(404).json({ error: 'Producto no encontrado' });
        } else {
            res.json(updatedProduct);
        }
    } catch (error) {
        if (error.code === 'INVALID_TYPES_ERROR' || error.code === 'DATABASE_ERROR') {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
});


router.delete('/:pid', authorize('admin'), async (req, res) => {
    const productId = req.params.pid;
    try {
        const deletedProduct = await productController.deleteProduct(productId);
        if (!deletedProduct) {
            res.status(404).json({ error: 'Producto no encontrado' });
        } else {
            res.json({ message: 'Producto eliminado correctamente' });
        }
    } catch (error) {
        if (error.code === 'DATABASE_ERROR') {
            res.status(500).json({ error: 'Error al eliminar producto en la base de datos' });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
});

module.exports = router;
