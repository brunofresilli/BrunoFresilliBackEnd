const { Router } = require('express');
const  productModel = require ('../dao/models/product.js')
const  auth  = require ('../middlewares/auth.js');
const authorize = require('../middlewares/authJWT.js');
const ProductController = require('../controllers/productController');


const router = Router();

router.get("/products", authorize('user'), async (req, res) => {
    console.log('Logged in:', req.session.loggedIn, 'Username:', req.session.username );
    let page = parseInt(req.query.page);
    if (!page) page = 1;

    
    const token = localStorage.getItem('token');

    
    fetch('/products', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      
    })
    .catch(error => {
      console.error('Error:', error);
    });

    const result = await productModel.paginate({}, {page, limit: 5, lean: true});
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

router.get('/realTimeProducts', async (req, res) => {
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


module.exports = router;