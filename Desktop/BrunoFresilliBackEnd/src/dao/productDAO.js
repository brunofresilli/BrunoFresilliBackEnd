const { productModel } = require('./models/product.js');

class ProductDAO {
    async findAll() {
        return await productModel.find().lean();
    }

    async findById(id) {
        return await productModel.findById(id).lean();
    }

    async findByCode(code) {
        return await productModel.findOne({ code }).lean();
    }

    async create(productData) {
        const newProduct = new Product(productData);
        await newProduct.save();
        return newProduct;
    }

    async update(id, updatedProductData) {
        return await productModel.updateOne({ _id: id }, updatedProductData);
    }

    async delete(id) {
        await productModel.findByIdAndDelete(id).exec();
        return true;
    }
}

module.exports = new ProductDAO();
