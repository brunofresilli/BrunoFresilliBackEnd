const ProductDAO = require('../dao/productDAO.js');
const ProductDTO = require('../dao/dto/productDTO.js');

class ProductRepository {
    async getAllProducts() {
        const products = await ProductDAO.findAll();
        return products.map(product => new ProductDTO(product));
    }

    async getProductById(id) {
        const product = await ProductDAO.findById(id);
        return product ? new ProductDTO(product) : null;
    }

    async getProductByCode(code) {
        const product = await ProductDAO.findByCode(code);
        return product ? new ProductDTO(product) : null;
    }

    async addProduct(productData) {
        const newProduct = await ProductDAO.create(productData);
        return new ProductDTO(newProduct);
    }

    async updateProduct(id, updatedProductData) {
        await ProductDAO.update(id, updatedProductData);
    }

    async deleteProduct(id) {
        await ProductDAO.delete(id);
    }
}

module.exports = new ProductRepository();
