const { Router } = require('express');
const ChatManager = require('../dao/ChatManager');
const { messageModel } = require('../dao/models/message.model');

const router = Router();
const chatManager = new ChatManager(messageModel);
/*GET*/
router.get('/', async (req, res) => {
    try {
        const messages = await chatManager.getMessages();
        res.json({ status: "success", payload: messages })
    } catch (error) {
        console.log("Error al acceder al historial de mensajes", error)
        res.json({ status: "error", error: error.message })
    }
})
/*POST*/
router.post('/', async (req, res) => {
    try {
        const { username, message } = req.body;
        if(!username || !message){
            res.json({ status: "error", error: "Faltan datos" })
        }
        const savedMessage = await chatManager.saveMessage(username, message)
        res.json({ status: "success", payload: savedMessage })
    } catch (error) {
        console.log("Error al guardar el mensaje", error)
        res.json({ status: "error", error: error.message })
    }
})

module.exports = router;