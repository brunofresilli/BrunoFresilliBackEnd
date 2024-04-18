const Product = require('./src/models/product.js');

class ProductManager {
    constructor(Product) {
        this.Product = Product;
    }

    async loadProducts() {
        try {
            this.products = await this.Product.find().exec();
            console.log("Productos cargados correctamente desde la base de datos.");
        } catch (error) {
            console.error("Error al cargar productos desde la base de datos:", error);
            throw error;
        }
    }

    async saveProducts() {
        try {
            const Product = require('./src/models/product.js'); // Requerir el modelo dentro del método
            await Promise.all(this.products.map(product => product.save()));
            console.log("Productos guardados correctamente en la base de datos.");
        } catch (error) {
            console.error("Error al guardar productos en la base de datos:", error);
            throw error;
        }
    }
    async getProducts() {
        try {
            const products = await Product.find().exec();
            return products;
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
        }
    }

    async getProductById(productId) {
        try {
            const product = await Product.findById(productId).exec();
            return product;
        } catch (error) {
            console.error('Error al obtener producto por ID:', error);
            throw error;
        }
    }
    async getProductByCode(code) {
        try {
            const product = await this.Product.findOne({ code }); // Corregir this.productModel a this.Product
            return product; // Devuelve el producto si se encuentra
        } catch (error) {
            console.error('Error al obtener el producto por código:', error);
            throw error;
        }
    }
    async addProduct(productData) {
        try {
            if (!productData.code) {
                throw new Error('El campo "code" es requerido.');
            }
    
            const newProduct = new Product({
                title: productData.title,
                description: productData.description,
                code: productData.code,
                price: productData.price,
                status: true, 
                stock: productData.stock,
                category: productData.category,
                thumbnails: productData.thumbnails || []     
            });
            await newProduct.save();
            console.log("Producto agregado correctamente.");
            return newProduct;
        } catch (error) {
            console.error('Error al agregar producto:', error);
            throw error;
        }
    }
    async updateProduct(productId, updatedProductData) {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(productId, updatedProductData, { new: true }).exec();
            console.log("Producto actualizado correctamente.");
            return updatedProduct;
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            throw error;
        }
    }
    
    async deleteProduct(productId) {
        try {
            await Product.findByIdAndDelete(productId).exec();
            console.log("Producto eliminado correctamente.");
            return true;
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            throw error;
        }
    }
}

module.exports = ProductManager;
