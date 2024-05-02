const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    products: {
        type: [{
            product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products',
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        }
    }
],
default:[]
    }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
