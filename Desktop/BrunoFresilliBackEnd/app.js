const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
const filePath = 'products.json'; 
const manager = new ProductManager(filePath);


app.use(express.json());


app.get('/products', (req, res) => {
  const limit = req.query.limit;
  let products = manager.getProducts();
  if (limit) {
    products = products.slice(0, parseInt(limit));
  }
  res.json(products);
});


app.get('/products/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = manager.getProductById(productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
