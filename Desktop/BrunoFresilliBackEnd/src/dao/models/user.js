const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;


const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
