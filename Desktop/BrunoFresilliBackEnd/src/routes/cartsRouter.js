const { Router } = require('express');
const passport = require('passport');
const authorize = require('../middlewares/authJWT');
const cartController = require('../controllers/cartController.js');
const ticketController = require('../controllers/ticketController.js');
const logger = require('../utils/logger');


const router = Router();


router.post('/', 
    passport.authenticate('jwt', { session: false }),
    authorize('user'),
    (req, res) => cartController.createCart(req, res)
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

router.delete('/:cid/products/:pid', 
    passport.authenticate('jwt', { session: false }),
    authorize('user'),
    async (req, res) => {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      try {
        await cartController.deleteProductFromCart(cartId, productId);
        res.send(`Product ${productId} has been deleted from the cart`);
      } catch (error) {
        console.error(error);
        res.status(400).send({
          status: "error",
          error: "There was an error deleting the product from the cart",
        });
      }
    });
    
    
    router.post('/:cid/purchase', passport.authenticate('jwt', { session: false }), async (req, res) => {
      try {
        const cartId = req.params.cid;
        const purchaser = req.user.email; 
        const result = await cartController.finalizePurchase(cartId, purchaser);
        console.log(result)
    res.redirect(`/purchase/${result.ticket._id}`);
      } catch (error) {
        res.status(400).send({
          status: 'error',
          message: error.message,
        });
      }
    });
module.exports = router;
