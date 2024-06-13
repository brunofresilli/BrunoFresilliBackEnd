const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productCollection = "Product";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    thumbnails: {
        type: [String],
        default: []
    }
});
productSchema.plugin(mongoosePaginate);
const productModel = mongoose.model(productCollection, productSchema);

function isValidProductData(productData) {
    // Verificar que todos los campos requeridos estén presentes y tengan los tipos correctos
    if (!productData ||
        typeof productData.title !== 'string' ||
        typeof productData.description !== 'string' ||
        typeof productData.code !== 'string' ||
        typeof productData.price !== 'number' ||
        typeof productData.status !== 'boolean' ||
        typeof productData.stock !== 'number' ||
        typeof productData.category !== 'string') {
        return false;
    }

    // Puedes agregar validaciones adicionales según tus necesidades, como verificar la unicidad del código, etc.

    return true;
}


module.exports ={ productModel , isValidProductData} ;
