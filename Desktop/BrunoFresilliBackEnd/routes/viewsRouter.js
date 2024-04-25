const { Router } = require('express');

const  auth  = require ('../src/middlewares/auth');

const router = Router();

router.get("/products", auth, (req, res) => {
    res.render(
        'products',
        {
            title: 'products',
            style: 'custom.css',
            user: req.session.user
        }
    )
});

router.get("/login", (req, res) => {
    res.render(
        'login',
        {
            title: 'login',
            style: 'custom.css',
            failLogin: req.session.failLogin ?? false
        }
    )
});

router.get("/register", (req, res) => {
    res.render(
        'register',
        {
            title: 'register',
            style: 'custom.css',
            failRegister: req.session.failRegister ?? false
        }
    )
});

module.exports = router;