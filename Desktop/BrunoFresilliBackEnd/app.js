const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const productsRouter = require('./routes/productsRouter.js');
const cartsRouter = require('./routes/cartsRouter.js');
const ProductManager = require('./ProductManager.js');
const exphbs = require("express-handlebars");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const path = require('path'); 

const filePath = './products.json';
const productManager = new ProductManager(filePath);


const hbs = exphbs.create(); 
app.engine('handlebars', hbs.engine); 
app.set('view engine', 'handlebars');


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);


app.set('views', path.join(__dirname, 'src', 'views'));
app.get('/', (req, res) => {
  const products = productManager.getProducts();
  console.log("Productos obtenidos en el enrutador de prueba:", products); 
  res.render('home', { title: 'Home', products }); 
});


app.get('/realtimeproducts', (req, res) => {
  const products = productManager.getProducts(); 
  res.render('realTimeProducts', { title: 'Real Time Products', products }); 
});


io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');
  const products = productManager.getProducts();
  socket.emit('productos_iniciales', products);

  socket.on('agregar_producto', (productData) => {
    const existingProduct = productManager.getProductByCode(productData.code);
    if (existingProduct) {
        socket.emit('error_agregar_producto', 'Ya existe un producto con el mismo código');
    } else {
        try {
            productManager.addProduct(productData);
            console.log('Producto agregado:', productData);
            const products = productManager.getProducts();
            io.emit('actualizar_productos', products);
        } catch (error) {
            console.error('Error al agregar producto:', error.message);
            socket.emit('error_agregar_producto', error.message);
        }
    }
});

  socket.on('eliminar_producto', (productoId) => {
    productManager.deleteProduct(productoId); 
    const products = productManager.getProducts(); 
    io.emit('actualizar_productos', products); 
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
