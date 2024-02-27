const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.nextId = 1;
        this.loadProducts();
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf8');
            this.products = JSON.parse(data);
        } catch (error) {
            console.log("Error al cargar productos:", error.message);
            this.products = [];
        }
    }

    saveProducts() {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.log("Error al guardar productos:", error.message);
        }
    }

    addProduct(product) {
        product.id = this.nextId++; 
        this.products.push(product);
        this.saveProducts();
    }

    getProducts() {
        this.loadProducts();
        return this.products;
    }

    getProductById(id) {
        this.loadProducts();
        return this.products.find(product => product.id === id);
    }

    updateProduct(id, updatedProduct) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            updatedProduct.id = id;
            this.products[index] = updatedProduct;
            this.saveProducts();
            return true;
        }
        return false;
    }

    deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
            this.saveProducts();
            return true;
        }
        return false;
    }
}


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


console.log(manager.getProducts());


manager.updateProduct(1, {
    title: "Producto 1 Modificado",
    description: "Descripción modificada del producto 1",
    price: 15.99,
    img: "imagen1_modificada.jpg",
    code: "ABC123",
    stock: 80
});

console.log(manager.getProductById(1));

manager.deleteProduct(2);
