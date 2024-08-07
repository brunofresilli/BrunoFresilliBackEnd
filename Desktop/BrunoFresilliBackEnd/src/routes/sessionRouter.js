const {Router} = require ('express');
const passport = require ('passport');
const { generateToken } = require('../utils/jwtUtils.js');
const cartController = require('../controllers/cartController');
const { restoreRequest, restoreConfirm } = require('../controllers/sessionController.js');
const User = require ('../dao/models/user.js');



const router = Router();

router.post("/login", (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
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
        
        try {
            // Obtener el usuario desde la base de datos
            const dbUser = await User.findById(user._id);
            if (!dbUser) {
                console.error('Usuario no encontrado en la base de datos');
                return res.redirect('/login');
            }

            // Actualizar el campo `last_connection`
            dbUser.last_connection = new Date();
            await dbUser.save(); // Guarda el usuario actualizado
            
            // Iniciar sesión
            req.logIn(user, (err) => {
                if (err) {
                    console.error('Error al iniciar sesión:', err);
                    req.session.failLogin = true;
                    return res.redirect('/login');
                }

                const token = generateToken(user);
                res.cookie("access_token", token);
                res.redirect("/products");
                console.log('user :', user);

                req.session.user = user;
                req.session.loggedIn = true;
                req.session.username = user.first_name;
            });
        } catch (saveError) {
            console.error('Error al actualizar el campo last_connection:', saveError);
            // Aunque el campo last_connection no se actualice, proceder con el inicio de sesión
            req.logIn(user, (err) => {
                if (err) {
                    console.error('Error al iniciar sesión:', err);
                    req.session.failLogin = true;
                    return res.redirect('/login');
                }

                const token = generateToken(user);
                res.cookie("access_token", token);
                res.redirect("/products");
                console.log('user :', user);

                req.session.user = user;
                req.session.loggedIn = true;
                req.session.username = user.first_name;
            });
        }
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

     
        if (user.email === 'adminCoder@coder.com') {
            user.role = 'admin';
            await user.save();
        }

   
        try {
            const cart = await cartController.createCart(); 
            user.cart = cart._id,
            console.log(user.cart);
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

router.post('/restore', restoreRequest);
router.post('/restoreConfirm', restoreConfirm);



module.exports = router ;