const { Router } = require('express');
const passport = require('passport');
const authorize = require('../middlewares/authJWT');
const CartController = require('../controllers/cartController');
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

router.post('/:cid/products/:pid', 
    passport.authenticate('jwt', { session: false }),
    authorize('user'),
    (req, res) => cartController.addProductToCart(req, res)
);

router.put('/:cid', 
    passport.authenticate('jwt', { session: false }),
    authorize('user'),
    (req, res) => cartController.updateCart(req, res)
);

router.put('/:cid/products/:productId', 
    passport.authenticate('jwt', { session: false }),
    authorize('user'),
    (req, res) => cartController.updateProductQuantity(req, res)
);

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
