const passport = require('passport');
const GitHubStrategy = require('passport-github2');
const local = require('passport-local');
const userModel = require('../models/user.js');
const  { createHash, isValidPassword }  = require ('../../utils/functionsUtils.js')

const localStratergy = local.Strategy;
const initializePassport = () => {
    const CLIENT_ID = "Iv1.474deadc803b08da";
    const SECRET_ID = "cb9365cd3ebee378af6065c93653f448c1412c92";
    const CALLBACK_URL = 'http://localhost:8080/api/sessions/githubcallback'

    passport.use('register', new localStratergy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        },
        async (req, username, password, done) => {
            const { first_name, last_name, email} = req.body;

            try {
                let user = await userModel.findOne({ email: username}).lean();
                if (user) {
                    console.log("User already exist!");
                    return done(null, false);
                }

                const newUser = { first_name, last_name, email, password: createHash(password)}
                const result = await userModel.create(newUser);

                return done(null, result);
            } catch (error) {
                return done(error.message);
            }
        }
    ));
    
    passport.use('login', new  localStratergy(
        {
            usernameField: 'email'
        },
        async (email, password, done) => {
            try {
                console.log('Email:', email);
                const user = await userModel.findOne({ email: email }).lean();
                console.log('User:', user);
                if (!user || !isValidPassword(user, password)) {
                    console.log('Authentication failed');
                    return done(null, false);
                }
                console.log('Authentication successful');
                return done(null, user);
            } catch (error) {
                console.error('Error during authentication:', error);
                return done(error);
            }
        }
    ));
    


    passport.use('github', new GitHubStrategy({
        
        clientID: CLIENT_ID,
        clientSecret: SECRET_ID,
        callbackURL: CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile); 
            let user = await userModel.findOne({ first_name: profile._json.login });
            if (!user) {
                let newUser = {
                    first_name: profile._json.login,
                    last_name: '',
                }
                let result = await userModel.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);
        done(null, user);
    });
};

module.exports = initializePassport;