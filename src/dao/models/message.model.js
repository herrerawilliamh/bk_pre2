const mongoose = require("mongoose");
const messageCollection = "messages";
const messageSchema = new mongoose.Schema({
    username: { type: String, max: 50, required: true},
    message: { type: String, max: 200, required: true}
})
const messageModel = mongoose.model(messageCollection, messageSchema)

module.exports = { messageModel }