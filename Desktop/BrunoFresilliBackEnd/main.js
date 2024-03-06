const ProductManager = require('./ProductManager');

const filePath = 'products.json'; 
const manager = new ProductManager(filePath);

manager.addProduct({
    title: "Producto 1",
    description: "Descripción del producto 1",
    price: 10.99,
    img: "imagen1.jpg",
    code: "ABC123",
    stock: 100
});
manager.addProduct({
    title: "Producto 2",
    description: "Descripción del producto 2",
    price: 20.99,
    img: "imagen2.jpg",
    code: "DEF456",
    stock: 50
});
manager.addProduct({
    title: "Producto 3",
    description: "Descripción del producto 3",
    price: 30.99,
    img: "imagen3.jpg",
    code: "GHI789",
    stock: 30
});

console.log(ProductManager.getProducts());

manager.updateProduct(1, {
    title: "Producto 1 Modificado",
    description: "Descripción modificada del producto 1",
    price: 15.99,
    img: "imagen1_modificada.jpg",
    code: "ABC123",
    stock: 80
});

console.log(ProductManager.getProductById(1));

manager.deleteProduct(2);
