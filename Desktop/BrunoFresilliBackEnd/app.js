const express = require('express');
const session = require('express-session');
const exphbs = require("express-handlebars");
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const mongoStore = require('connect-mongo');
const passport = require('passport');
const path = require('path');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const config = require('./config.js');
const websocket = require('./websocket.js');
const cartsRouter = require('./src/routes/cartsRouter.js');
const productsRouter = require('./src/routes/productsRouter.js');
const viewsRouter = require('./src/routes/viewsRouter.js');
const sessionsRouter = require('./src/routes/sessionRouter.js');
const initializatePassport = require('./src/config/passportConfig.js');
const errorHandler = require('./src/middlewares/errors/index.js');

const app = express();

const mongoUrl = "mongodb+srv://BrunoFresilli:nerfxnephipls11@cluster0.kouwtog.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const PORT = 8080;

app.use(session({
    store: mongoStore.create({
        mongoUrl: mongoUrl ,
        ttl: 20
    }),
    secret: 'secretPhrase',
    resave: false,
    saveUninitialized: false
}));

//Mongo atlas connect
async function connectToDatabase() {
    try {
        await mongoose.connect(mongoUrl, {
           
            dbName: 'Productos'
        });
        console.log('Conexión a MongoDB Atlas establecida.');
    } catch (error) {
        console.error('Error al conectar a MongoDB Atlas:', error);
    }
}


connectToDatabase();

initializatePassport();
app.use(passport.initialize());
app.use(passport.session());
//handlebars
const hbs = exphbs.create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src', 'views'));

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());


//router

app.use('/api/sessions', sessionsRouter);
app.use('/login', sessionsRouter);
app.use('/', viewsRouter);
app.use('/products', viewsRouter);
app.use('/realTimeProducts', viewsRouter);
app.use ('/mockingproducts',viewsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);

app.use(errorHandler);


const httpServer = app.listen(PORT, () => {
    console.log(`Start server in PORT ${PORT}`);
});

const io = new Server(httpServer);

websocket(io, httpServer);
