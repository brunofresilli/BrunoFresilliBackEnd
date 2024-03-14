const express = require('express');
const cartManager = require('../../cartManager.js');

const router = express.Router();


router.post('/', (req, res) => {
  const { products } = req.body;
  const newCart = cartManager.createCart(products);
  res.status(201).json(newCart);
});


router.get('/:cid', (req, res) => {
  const { cid } = req.params;
  const cartProducts = cartManager.getCartProducts(cid);
  if (!cartProducts) {
    return res.status(404).json({ message: 'Carrito no encontrado' });
  }
  res.json(cartProducts);
});


router.post('/:cid/product/:pid', (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  const result = cartManager.addProductToCart(cid, pid, quantity);
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }
  res.status(201).json({ message: result.message });
});

module.exports = router;
