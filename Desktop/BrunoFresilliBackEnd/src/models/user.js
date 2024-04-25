const mongoose = require('mongoose');

const userCollection = "users";

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        minLength: 3,
        require: true
    },
    last_name: {
        type: String,
        minLength: 3,
        require: true
    },
    email: {
        type: String,
        minLength: 5,
        require: true,
        unique: true
    },
    password: {
        type: String,
        minLength: 5,
        require: true
    },
});

const user = mongoose.model(userCollection, userSchema);

module.exports = user;