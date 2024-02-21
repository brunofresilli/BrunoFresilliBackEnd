class ProductManager {
    constructor() {
        this.products = [];
        this.nextId = 1;  
    }

    
    addProduct(title, description, price, img, code, stock) {
        
        if (!title || !description || !price || !img || !code || !stock) {
            console.log("Todos los campos son obligatorios.");
            return;
        }

       
        const isCodeDuplicate = this.products.some(product => product.code === code);
        if (isCodeDuplicate) {
            console.log("El código del producto ya está en uso.");
            return;
        }

        const product = {
            id: this.nextId++, 
            title: title,
            description: description,
            price: price,
            img: img,
            code: code,
            stock: stock
        };
        this.products.push(product);
    }

  
    getProducts() {
        return this.products;
    }

   
    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (product) {
            return product;
        } else {
            console.log("Product not found.");
        }
    }
}


const manager = new ProductManager();


manager.addProduct("Producto 1", "Descripción del producto 1", 10.99, "imagen1.jpg", "ABC123", 100);
manager.addProduct("Producto 2", "Descripción del producto 2", 20.99, "imagen2.jpg", "DEF456", 50);
manager.addProduct("Producto 3", "Descripción del producto 3", 50.99, "imagen3.jpg", "KSG200", 60);


console.log(manager.getProducts());


console.log(manager.getProductById(1)); 
console.log(manager.getProductById(10)); 
