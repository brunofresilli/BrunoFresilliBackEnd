const Product = require('./models/product.js');

class ProductManager {
    
    constructor(Product) {
        this.Product = Product;
    }

    async getProducts() {
        try {
            const products = await Product.find().lean();
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
            const product = await this.Product.findOne({ code }); 
            return product; 
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
            const result = await Product.updateOne({_id: productId}, updatedProductData);

            return result;
        } catch(error) {
            console.error(error.message);
            throw new Error('Error al actualizar el producto');
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
