// models/user.js
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
    }
});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
