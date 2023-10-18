const mongoose = require("mongoose");
const cartCollection = "carts";
const cartSchema = new mongoose.Schema({
    products: [{
        id: {type: String, required: true},
        //title: {type: String, required: true, max: 100},
        //description: {type: String, required: true, max: 100},
        //code: {type: String, required: true, max: 100},
        //thumbnail: {type: String, required: true, max: 100},
        //price: {type: Number, required: true},
        //stock: {type: Number, required: true},
        quantity: {type: Number, required: true}
    }]
});

const cartModel = mongoose.model(cartCollection, cartSchema)

module.exports = { cartModel }