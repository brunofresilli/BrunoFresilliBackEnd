const { Router } = require('express');
const userModel = require('../src/models/user');
const { createHash, isValidPassword } = require ('../src/utils/functionsUtils')


const router = Router();

router.post("/register", async (req, res) => {
    try {
        req.session.failRegister = false;

        if (!req.body.email || !req.body.password) throw new Error("Register error!");

        const newUser = {
            first_name: req.body.first_name ?? "",
            last_name: req.body.last_name ?? "",
            email: req.body.email,
            age: req.body.age ?? "",
            password: createHash(req.body.password)
        }
        await userModel.create(newUser);
        res.redirect("/login");
    } catch (e) {
        console.log(e.message);
        req.session.failRegister = true;
        res.redirect("/register");
    }
});
router.post("/login", async (req, res) => {
    try {
        req.session.failLogin = false;
        const result = await userModel.findOne({ email: req.body.email }).lean();
        if (!result) {
            req.session.failLogin = true;
            return res.redirect("/login");
        }

        
        if (!isValidPassword(result, req.body.password)) {
            req.session.failLogin = true;
            return res.redirect("/login");
        }

        
        delete result.password;

        
        req.session.user = result;

        
        req.session.loggedIn = true;
console.log('Usuario ha iniciado sesión correctamente:', req.session.user);


req.session.username = result.first_name;
console.log('Nombre de usuario:', req.session.username);


        
        return res.redirect("/products");
    } catch (e) {
        console.error('Error al iniciar sesión:', e);
        req.session.failLogin = true;
        return res.redirect("/login");
    }
});

module.exports = router;