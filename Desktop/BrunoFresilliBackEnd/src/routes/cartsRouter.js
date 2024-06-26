const { Router } = require('express');
const passport = require('passport');
const authorize = require('../middlewares/authJWT');
const CartController = require('../controllers/cartController.js');
const logger = require('../utils/logger');

const router = Router();
const cartController = new CartController();

router.post('/', 
    passport.authenticate('jwt', { session: false }),
    authorize('user'),
    (req, res) => cartController.createCart(req, res)
);

router.get('/:cid', 
    passport.authenticate('jwt', { session: false }),
    authorize('user'),
    (req, res) => cartController.getCartProducts(req, res)
);

router.post("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;
  
    try {
      await cartController.addProductToCart(cartId, productId, quantity);
      res.send({
        status: "success",
        message: "Product has been added successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(400).send({
        status: "error",
        error: "There was an error adding the product to the cart",
      });
    }
  });

router.put('/:cid', 
    passport.authenticate('jwt', { session: false }),
    authorize('user'),
    (req, res) => cartController.updateCart(req, res)
);

router.put("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;
    try {
      await cartController.updateProductQuantity(cartId, productId, quantity);
      res.send({ status: "success", message: "Quantity changed" });
    } catch (error) {
      console.error(error);
      res.status(400).send({
        status: "error",
        error: "There was an error updating the product quantity",
      });
    }
  });

router.delete('/:cid', 
    passport.authenticate('jwt', { session: false }),
    authorize('user'),
    (req, res) => cartController.deleteCart(req, res)
);

router.delete('/:cid/products/:productId', 
    passport.authenticate('jwt', { session: false }),
    authorize('user'),
    (req, res) => cartController.removeProductFromCart(req, res)
);

module.exports = router;
