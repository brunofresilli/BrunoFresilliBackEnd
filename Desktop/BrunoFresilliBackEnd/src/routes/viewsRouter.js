const { Router } = require('express');
const  { productModel } = require ('../dao/models/product.js')
const authorize = require('../middlewares/authJWT.js');
const ProductController = require('../controllers/productController');
const { generateFakeProduct } = require('../utils/fakerUtil.js')
const passport = require ('passport')





const router = Router();

router.get("/products",   
    passport.authenticate("jwt", { session: false }),
    authorize("user"),
    async (req, res) => {
    console.log('User JWT:', req.user)
    
    let page = parseInt(req.query.page);
    if (!page) page = 1;

    const result = await productModel.paginate({}, { page, limit: 5, lean: true });
    const baseURL = "http://localhost:8080/products/";
    result.prevLink = result.hasPrevPage ? `${baseURL}?page=${result.prevPage}` : "";
    result.nextLink = result.hasNextPage ? `${baseURL}?page=${result.nextPage}` : "";
    result.isValid = !(page <= 0 || page > result.totalPages);

    res.render('products', {
        loggedIn: true, 
        username: req.user.email,
        title: 'ProductosHome',
        style: 'style.css',
        result
    });
});

module.exports = router;



router.get("/login", (req, res) => {
    res.render(
        'login',
        {
            title: 'login',
            style: 'style.css',
            failLogin: req.session.failLogin ?? false
        }
    )
});

router.get("/register", (req, res) => {
    res.render(
        'register',
        {
            title: 'register',
            style: 'style.css',
            failRegister: req.session.failRegister ?? false
        }
    )
});

router.get('/realTimeProducts',
    passport.authenticate("jwt", { session: false }),
    authorize("admin"), async (req, res) => {
    try {
        const products = await ProductController.getProducts(req, res);
        res.render('realTimeProducts', {
            title: 'realTimeProducts',
            style: 'style.css',
            products: products
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener productos en tiempo real');
    }
});

router.get("/unauthorized", (req, res) => {
    res.status(401).render("unauthorized", {
      title: "Unauthorized",
      style: "index.css",
    });
  });


router.get('/mockingproducts', (req, res) => {
    const products = [];

    for (let i = 0; i < 100; i++) {
        products.push(generateFakeProduct());
    }

    res.send({
        status: 'success',
        payload: products
    });
});

module.exports = router;