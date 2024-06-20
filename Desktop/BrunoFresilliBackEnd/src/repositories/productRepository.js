const ProductDAO = require('../dao/productDAO.js');
const ProductDTO = require('../dao/dto/productDTO.js');
const logger = require('../utils/logger.js'); // Asegúrate de ajustar la ruta según la ubicación de tu configuración de logger

class ProductRepository {
    async getAllProducts() {
        try {
            const products = await ProductDAO.findAll();
            return products.map(product => new ProductDTO(product));
        } catch (error) {
            logger.error(`Error fetching all products: ${error.message}`);
            throw new Error("Error fetching all products");
        }
    }

    async getProductById(id) {
        try {
            const product = await ProductDAO.findById(id);
            return product ? new ProductDTO(product) : null;
        } catch (error) {
            logger.error(`Error fetching product with ID ${id}: ${error.message}`);
            throw new Error(`Error fetching product with ID ${id}`);
        }
    }

    async getProductByCode(code) {
        try {
            const product = await ProductDAO.findByCode(code);
            return product ? new ProductDTO(product) : null;
        } catch (error) {
            logger.error(`Error fetching product with code ${code}: ${error.message}`);
            throw new Error(`Error fetching product with code ${code}`);
        }
    }

    async addProduct(productData) {
        try {
            const newProduct = await ProductDAO.create(productData);
            return new ProductDTO(newProduct);
        } catch (error) {
            logger.error(`Error adding product: ${error.message}`);
            throw new Error("Error adding product");
        }
    }

    async updateProduct(id, updatedProductData) {
        try {
            await ProductDAO.update(id, updatedProductData);
        } catch (error) {
            logger.error(`Error updating product with ID ${id}: ${error.message}`);
            throw new Error(`Error updating product with ID ${id}`);
        }
    }

    async deleteProduct(id) {
        try {
            await ProductDAO.delete(id);
        } catch (error) {
            logger.error(`Error deleting product with ID ${id}: ${error.message}`);
            throw new Error(`Error deleting product with ID ${id}`);
        }
    }
}

module.exports = new ProductRepository();
