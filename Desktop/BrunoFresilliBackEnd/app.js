const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose'); 
const Product = require('./src/models/product.js'); 
const ProductManager = require('./ProductManager.js');

mongoose.connect('mongodb://localhost:27017/Productos').then(() => {
    console.log('Conectado a MongoDB');
}).catch((error) => {
    console.error('Error conectando a MongoDB:', error);
});

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const productManager = new ProductManager(Product);

const exphbs = require("express-handlebars");
const path = require('path');

const hbs = exphbs.create(); 
app.engine('handlebars', hbs.engine); 
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


const cartsRouter = require('./routes/cartsRouter.js');
const productsRouter = require('./routes/productsRouter.js');
app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);

app.set('views', path.join(__dirname, 'src', 'views'));
app.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts(); 
    res.render('home', { title: 'Home', products }); 
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ status: 'error', error: 'Error al obtener productos' });
  }
});

app.get('/realtimeproducts', async (req, res) => {
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

  socket.on('agregar_producto', async (productData) => {
    try {
      
        const existingProduct = await productManager.getProductByCode(productData.code);
        
        if (existingProduct) {
            socket.emit('error_agregar_producto', 'Ya existe un producto con el mismo código');
        } else {
           
            await productManager.addProduct(productData);
            console.log('Producto agregado:', productData);

            
            const products = await productManager.getProducts();
            io.emit('actualizar_productos', products);
        }
    } catch (error) {
        console.error('Error al agregar producto:', error.message);
        socket.emit('error_agregar_producto', error.message);
    }
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

