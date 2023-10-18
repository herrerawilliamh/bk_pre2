const mongoose = require("mongoose");
const productCollection = "products";
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        max: 20,
        required: true
    },
    description: {
        type: String,
        max: 2000,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        max: 50,
        required: true
    },
    code: {
        type: String,
        max: 20,
        required: true
    },
    stock: {
        type: Number,
        required: true
    }
})

const productModel = mongoose.model(productCollection, productSchema)

module.exports = { productModel }