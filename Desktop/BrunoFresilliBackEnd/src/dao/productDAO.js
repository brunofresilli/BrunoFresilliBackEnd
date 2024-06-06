const Product = require('./models/product.js');

class ProductDAO {
    async findAll() {
        return await Product.find().lean();
    }

    async findById(id) {
        return await Product.findById(id).lean();
    }

    async findByCode(code) {
        return await Product.findOne({ code }).lean();
    }

    async create(productData) {
        const newProduct = new Product(productData);
        await newProduct.save();
        return newProduct;
    }

    async update(id, updatedProductData) {
        return await Product.updateOne({ _id: id }, updatedProductData);
    }

    async delete(id) {
        await Product.findByIdAndDelete(id).exec();
        return true;
    }
}

module.exports = new ProductDAO();
