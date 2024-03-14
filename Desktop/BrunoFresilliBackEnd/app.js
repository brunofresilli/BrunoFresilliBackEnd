const express = require('express');
const productsRouter = require('./routes/src/productsRouter.js');
const cartsRouter = require('./routes/src/cartsRouter.js'); // Importa cartsRouter
const ProductManager = require('./ProductManager.js');
const app = express();
const filePath = './products.json';
const productManager = new ProductManager(filePath); 


app.use(express.json());

app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});

