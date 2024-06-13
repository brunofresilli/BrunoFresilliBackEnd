
const ProductRepository = require('../repositories/productRepository');
const ProductDTO = require('../dao/dto/productDTO.js');

class ProductService {
    
    async getProducts() {
        return await ProductRepository.getAllProducts();
    }

    async getProductById(productId) {
        return await ProductRepository.getProductById(productId);
    }

    async getProductByCode(code) {
        return await ProductRepository.getProductByCode(code);
    }

    async addProduct(productData) {
        const productDTO = new ProductDTO(productData);
        return await ProductRepository.addProduct(productDTO);
    }

    async updateProduct(productId, updatedProductData) {
        await ProductRepository.updateProduct(productId, updatedProductData);
    }

    async deleteProduct(productId) {
        await ProductRepository.deleteProduct(productId);
    }
}

module.exports = new ProductService();
