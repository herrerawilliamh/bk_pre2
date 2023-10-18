const mongoose = require("mongoose");
const { messageModel } = require("./models/message.model");

class ChatManager{
    constructor(){
        this.messages = [];
    }
    async saveMessage(username, message){
        try {
            const messageData = {
                username,
                message
            };
            const savedMessage = await messageModel.create(messageData);
            console.log("Mensaje creado exitosamente", savedMessage);
            return savedMessage;
        } catch (error) {
            console.log("Error al crear el mensaje", error);
            throw error;
        }
    }
    async getMessages(){
        try {
            const messages = await messageModel.find({});
            //console.log("Mensajes obtenidos exitosamente", messages);
            console.log("Mensajes obtenidos exitosamente");
            return messages;
        } catch (error) {
            console.log("Error al obtener los mensajes", error);
            throw error;
        }
    }
}

module.exports = ChatManager;