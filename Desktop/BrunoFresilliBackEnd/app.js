const express = require('express');
const session = require('express-session');
const http = require('http');
const exphbs = require("express-handlebars");
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const mongoStore = require ('connect-mongo'); 

const Product = require('./src/models/product.js'); 
const ProductManager = require('./ProductManager.js');
const path = require('path');

const cartsRouter = require('./routes/cartsRouter.js');
const productsRouter = require('./routes/productsRouter.js');
const usersRouter = require('./routes/usersRouter.js');
const viewsRouter = require ( './routes/viewsRouter.js');

// Importa la clase CartManager
const CartManager = require('./cartManager.js');

const db = "mongodb://localhost:27017/Productos";
mongoose.connect(db);

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const productManager = new ProductManager(Product);
const cartManager = new CartManager(); 

const hbs = exphbs.create(); 
app.engine('handlebars', hbs.engine); 
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));


app.use(session(
    {
        store: mongoStore.create(
            {
                mongoUrl: db,
                ttl: 20
            }
        ),
        secret: 'secretPhrase',
        resave: true,
        saveUninitialized: true
    }
));

app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);

app.use('/api/sessions', usersRouter);
app.use('/products', viewsRouter);
app.use('/', viewsRouter);



app.set('views', path.join(__dirname, 'src', 'views'));
app.get('/products', async (req, res) => {
  try {
      const products = await productManager.getProducts(); 
      res.render('products', { title: 'Products', products }); 
  } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).json({ status: 'error', error: 'Error al obtener productos' });
  }
});

app.get('/realTimeProducts', async (req, res) => {
    try {
        const products = await productManager.getProducts(); 
        res.render('realTimeProducts', { title: 'Real Time Products', products }); 
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ status: 'error', error: 'Error al obtener productos' });
    }
});

io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado');
    try {
        const products = await productManager.getProducts();
        socket.emit('productos_iniciales', products);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        socket.emit('error_obtener_productos', 'Error al obtener productos');
    }
});

io.on('connection', async (socket) => {
    socket.on('agregar_producto', async (productData) => {
        try {
            const products = await productManager.getProducts();
            io.emit('actualizar_productos', products);
        } catch (error) {
            console.error('Error al agregar producto:', error.message);
            socket.emit('error_agregar_producto', error.message);
        }
    });

    io.on('connection', async (socket) => {
        socket.on('agregar_producto_al_carrito', async ({ cartId, productId, quantity }) => {
            try {
                const message = await cartManager.addProductToCart(cartId, productId, quantity);
                socket.emit('producto_agregado_al_carrito', message);
            } catch (error) {
                console.error('Error al agregar producto al carrito:', error.message);
                socket.emit('error_agregar_producto_al_carrito', error.message);
            }
        });
    });

    socket.on('eliminar_producto', async (productoId) => {
        try {
            await productManager.deleteProduct(productoId);
            const products = await productManager.getProducts();
            io.emit('actualizar_productos', products);
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
