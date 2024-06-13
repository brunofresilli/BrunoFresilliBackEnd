const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authorize  = require('../middlewares/authJWT.js'); 

router.post('/', authorize('user'), async (req, res) => {
    try {
        await cartController.createCart(req, res);
    } catch (error) {
        if (error.code === 'DATABASE_ERROR') {
            res.status(500).json({ error: 'Error al crear el carrito en la base de datos' });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
});

router.get('/:cid', authorize('user'), async (req, res) => {
    try {
        await cartController.getCartProducts(req, res);
    } catch (error) {
        if (error.code === 'DATABASE_ERROR') {
            res.status(500).json({ error: 'Error al obtener productos del carrito desde la base de datos' });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
});

router.post('/:cid/products/:pid', authorize('user'), async (req, res) => {
    try {
        await cartController.addProductToCart(req, res);
    } catch (error) {
        if (error.code === 'INVALID_TYPES_ERROR' || error.code === 'DATABASE_ERROR') {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
});

router.put('/:cid', authorize('user'), async (req, res) => {
    try {
        await cartController.updateCart(req, res);
    } catch (error) {
        if (error.code === 'DATABASE_ERROR') {
            res.status(500).json({ error: 'Error al actualizar el carrito en la base de datos' });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
});

router.put('/:cid/products/:productId', authorize('user'), async (req, res) => {
    try {
        await cartController.updateProductQuantity(req, res);
    } catch (error) {
        if (error.code === 'DATABASE_ERROR') {
            res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito en la base de datos' });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
});

router.delete('/:cid', authorize('user'), async (req, res) => {
    try {
        await cartController.deleteCart(req, res);
    } catch (error) {
        if (error.code === 'DATABASE_ERROR') {
            res.status(500).json({ error: 'Error al eliminar el carrito desde la base de datos' });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
});

router.delete('/:cid/products/:productId', authorize('user'), async (req, res) => {
    try {
        await cartController.removeProductFromCart(req, res);
    } catch (error) {
        if (error.code === 'DATABASE_ERROR') {
            res.status(500).json({ error: 'Error al eliminar el producto del carrito desde la base de datos' });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
});

module.exports = router;
