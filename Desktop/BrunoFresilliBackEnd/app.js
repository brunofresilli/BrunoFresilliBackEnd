const express = require('express');
const session = require('express-session');
const http = require('http');
const exphbs = require("express-handlebars");
const {Server} = require('socket.io');
const mongoose = require('mongoose');
const mongoStore = require ('connect-mongo'); 
const passport = require ('passport');
const path = require('path');

const config = require ('./config.js');
const websocket = require ('./websocket.js');
const cartsRouter = require('./src/routes/cartsRouter.js');
const productsRouter = require('./src/routes/productsRouter.js');
const viewsRouter = require ( './src/routes/viewsRouter.js');
const sessionsRouter = require ('./src/routes/sessionRouter.js')
const initializatePassport = require ('./src/dao/config/passportConfig.js');

const app = express();

const mongoUrl = config.mongodbUri;
const PORT = config.port;

app.use(session(
    {
        store: mongoStore.create(
            {
                mongoUrl: mongoUrl,
                ttl: 20 
            }
        ),
        secret: 'secretPhrase',
        resave: true,
        saveUninitialized: true
    }
));





//Mongo atlas connect
async function connectToDatabase() {
    const dbURI = mongoUrl;
    const options = {
        dbName: "Productos", 
    };

    try {
        await mongoose.connect(dbURI, options);
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
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));



//router
app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);
app.use('/products', viewsRouter);
app.use('/', viewsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/realTimeProducts', viewsRouter);





const httpServer = app.listen(PORT, () => {
    console.log(`Start server in PORT ${PORT}`);
});

const io = new Server(httpServer);

websocket(io);