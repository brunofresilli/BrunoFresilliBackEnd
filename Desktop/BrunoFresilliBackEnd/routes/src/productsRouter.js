const express = require('express');
const router = express.Router();
const ProductManager = require('../../ProductManager.js'); 


const filePath = './products.json'; 
const productManager = new ProductManager(filePath);


router.get('/', (req, res) => {
    const products = productManager.getProducts();
    res.json(products);
});


router.get('/:pid', (req, res) => {
    const productId = req.params.pid;
    const product = productManager.getProductById(productId);
    if (!product) {
        console.log('Producto no encontrado en la base de datos:', productId);
        res.status(404).json({ error: 'Producto no encontrado' });
    } else {
        console.log('Producto encontrado en la base de datos:', product);
        res.json(product);
    }
});

router.post('/', (req, res) => {
    const productData = req.body;
    try {
        const newProduct = productManager.addProduct(productData);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router.put('/:pid', (req, res) => {
    const productId = req.params.pid;
    const updatedData = req.body;
    try {
        const updatedProduct = productManager.updateProduct(productId, updatedData);
        if (updatedProduct === null) {
            res.status(404).json({ error: 'Producto no encontrado' });
        } else {
            res.json(updatedProduct);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router.delete('/:pid', (req, res) => {
    const productId = req.params.pid;
    const deletedProduct = productManager.deleteProduct(productId);
    if (!deletedProduct) {
        res.status(404).json({ error: 'Producto no encontrado' });
    } else {
        res.json({ message: 'Producto eliminado correctamente' });
    }
});

module.exports = router;
