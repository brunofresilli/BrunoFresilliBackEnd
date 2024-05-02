const { Router } = require('express');
const  productModel = require ('../dao/models/product.js')
const  auth  = require ('../middlewares/auth.js');


const ProductManager = require('../dao/ProductManager.js');

const ProductService = new ProductManager();

const router = Router();

router.get("/products", auth, async (req, res) => {
    console.log('Logged in:', req.session.loggedIn, 'Username:', req.session.username );
    let page = parseInt(req.query.page);
    if (!page) page = 1

    const result = await productModel.paginate({}, {page, limit: 5, lean: true});
    //console.log(result);

    const baseURL = "http://localhost:8080/products/";
    result.prevLink = result.hasPrevPage ? `${baseURL}?page=${result.prevPage}` : "";
    result.nextLink = result.hasNextPage ? `${baseURL}?page=${result.nextPage}` : "";
    result.isValid = !(page <= 0 || page > result.totalPages);
    res.render('products', {

        loggedIn: req.session.loggedIn,

        username: req.session.username,


        title: 'ProductosHome',
        style: 'style.css',
        result
    });

});

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

router.get('/realtimeproducts', async (req, res) => {
    res.render(
        'realTimeProducts',
        {
            title: 'realTimeProductos',
            style: 'style.css',
            products: await ProductService.getProducts()
        }
    )
});

module.exports = router;