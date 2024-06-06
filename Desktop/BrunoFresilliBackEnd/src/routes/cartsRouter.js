const authorize = require('../middlewares/authJWT.js');
const express = require('express');
const cartController = require('../controllers/cartController');

const router = express.Router();

router.post('/', authorize('user'), (req, res) => {
    cartController.createCart(req, res);
});

router.get('/:id', authorize('user'), (req, res) => {
    cartController.getCartProducts(req, res);
});

router.post('/:id/products', authorize('user'), (req, res) => {
    cartController.addProductToCart(req, res);
});

router.put('/:id', authorize('user'), (req, res) => {
    cartController.updateCart(req, res);
});

router.put('/:id/products/:productId', authorize('user'), (req, res) => {
    cartController.updateProductQuantity(req, res);
});

router.delete('/:id', authorize('user'), (req, res) => {
    cartController.deleteCart(req, res);
});

router.delete('/:id/products/:productId', authorize('user'), (req, res) => {
    cartController.removeProductFromCart(req, res);
});

module.exports = router;
