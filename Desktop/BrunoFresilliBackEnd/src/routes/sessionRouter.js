const {Router} = require ('express');
const passport = require ('passport');
const { generateToken } = require('../utils/jwtUtils.js');
const CartController = require('../controllers/cartController');


const cartController = new CartController();
const router = Router();


router.post("/login", (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
        if (err) {
            console.error('Error durante el inicio de sesión:', err);
            req.session.failLogin = true;
            return res.redirect('/login');
        }
        if (!user) {
            console.log('Inicio de sesión fallido:', info.message);
            req.session.failLogin = true;
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                console.error('Error al iniciar sesión:', err);
                req.session.failLogin = true;
                return res.redirect('/login');
            }
            const token = generateToken(user);
            res.cookie("access_token", token)
            res.redirect("/products")
            console.log('user :', user);

           
            

            req.session.user = user;
            req.session.loggedIn = true;
            req.session.username = user.first_name;

            
           
        });
    })(req, res, next);
});


router.post("/register", (req, res, next) => {
    passport.authenticate('register', async (err, user, info) => {
        if (err) {
            console.error('Error durante el registro:', err);
            req.session.failRegister = true;
            return res.redirect("/register");
        }
        if (!user) {
            console.log('Registro fallido:', info.message);
            req.session.failRegister = true;
            return res.redirect("/register");
        }
        console.log('Registro exitoso!');

        // Check if the user is an admin (optional step)
        if (user.email === 'adminCoder@coder.com') {
            user.role = 'admin';
            await user.save();
        }

        // Create a cart for the user
        try {
            const cart = await cartController.createCart(); // Create a cart without passing req/res/next
            user.cart = cart._id; // Associate the cart with the user
            await user.save();
            res.redirect("/login");
        } catch (error) {
            console.error('Error al crear carrito:', error);
            req.session.failRegister = true;
            return res.redirect("/register");
        }
    })(req, res, next);
});




router.get("/github", passport.authenticate('github', {scope: ['user:email']}), (req, res) => {
    res.send({
        status: 'success',
        message: 'Success'
    });
});

router.get("/githubcallback", passport.authenticate('github', {failureRedirect: '/login'}), (req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
});



module.exports = router ;