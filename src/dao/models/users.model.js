const mongoose = require('mongoose');
const userCollection = "users";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        max:20,
        required: true
    },
    last_name: {
        type: String,
        max:20,
        required: true
    },
    email: {
        type: String,
        max: 50,
        required: true,
        unique: true
    }/*,
    password: {
        type: String,
        min:8,
        required: true
    },
    role: {
        type: String,
        max: 20,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    cart: {
        type: Array,
    },
    phone: {
        type: String,
        max: 11,
        required: true
    },
    profile_picture: {
        type: String,
        required: true
    }*/
});

const userModel = mongoose.model(userCollection, userSchema);

module.exports = { userModel }