const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.products = [];
        this.loadProducts();
    }

    loadProducts() {
        try {
            
            const data = fs.readFileSync(this.filePath, 'utf8');
            this.products = JSON.parse(data);
            
        } catch (error) {
            if (error.code === 'ENOENT') {
                
                this.saveProducts();
            } else {
                console.log("Error al cargar productos:", error.message);
            }
        }
    }
    saveProducts() {
        try {
            
            fs.writeFileSync(this.filePath, JSON.stringify(this.products, null, 2));
            console.log("Productos guardados correctamente.");
        } catch (error) {
            console.log("Error al guardar productos:", error.message);
        }
    }

    addProduct(productData) {
      
        const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
        for (const field of requiredFields) {
            if (!productData[field]) {
                throw new Error(`El campo ${field} es obligatorio`);
            }
        }
    
      
        const newProductId = this.getNextId();
    
       
        const newProduct = {
            id: newProductId,
            title: productData.title,
            description: productData.description,
            code: productData.code,
            price: productData.price,
            status: true, 
            stock: productData.stock,
            category: productData.category,
            thumbnails: productData.thumbnails || []     
        };
    
        
        this.products.push(newProduct);
    
        this.saveProducts();
    
        return newProduct;
    }

    getProducts() {
        
        return this.products;
    }

    getProductById(id) {
        return this.products.find(product => product.id == id);
    }
    getProductByCode(code) {
        return this.products.find(product => product.code === code);
    }
    updateProduct(id, updatedProduct) {
        const index = this.products.findIndex(product => product.id == id);
        if (index !== -1) {
            updatedProduct.id = id;
            this.products[index] = updatedProduct;
            this.saveProducts();
            return true;
        }
        return false;
    }

    deleteProduct(id) {
        const index = this.products.findIndex(product => product.id == id);
        if (index !== -1) {
            this.products.splice(index, 1);
            this.saveProducts();
            return true;
        }
        return false;
    }

    getNextId() {
        const maxId = this.products.reduce((max, product) => Math.max(max, product.id), 0);
        return maxId + 1;
    }
}

module.exports = ProductManager;
