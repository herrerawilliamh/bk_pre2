/*IMPORTS*/
const express = require('express');
const path = require('path');
const handlebars = require('express-handlebars');
const http = require('http');
const socketIO = require('socket.io');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const Swal = require("sweetalert2");

const app = express();
const server =http.createServer(app);
const io = new Server(server);

/*ROUTES*/
const productsRouter = require('./routes/products.router.js');
const cartsRouter = require('./routes/carts.router.js');
const viewsRouter = require('./routes/views.router.js');
const usersRouter = require('./routes/users.router.js');
const chatRouter = require('./routes/chat.router.js')

/*DAO*/
const ProductManager = require('./dao/ProductManager.js');
const ChatManager = require('./dao/ChatManager.js');

/*VARS*/
const PORT = 8080;
const productManager = new ProductManager();
const chatManager = new ChatManager();

/*HANDLEBARS START*/
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));


/*Manager Public Folder*/
app.use(express.static(path.join(__dirname, 'public')));

/*RENDER*/
app.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('home', {title: "WILLY Ecommerce", products: products});
});

app.get('/api/chat', async (req, res) => {
    const chats = await chatManager.getMessages();
    res.render('chat', {title: "WILLY Ecommerce - Contacto", chats: chats})
})

/*USERS APLICATION*/
const users = {};
/*SOCKET*/
io.on("connection", async (socket) =>{
    console.log("Usuario conectado");
    socket.on("newUser", (username) => {
        users[socket.id]=username
        io.emit("userConnected", username)
    })
    socket.on("chatMessage", async (message) => {
        const username = users[socket.id]
        await chatManager.saveMessage(username, message)
        io.emit("message", {username: username, message: message})
    })
    socket.on("disconnect", () => {
        console.log("Usuario desconectado")
    })
    socket.emit('productsUpdated', productManager.getProducts());
    try {
        const messages = await chatManager.getMessages();
        socket.emit("load messages", messages);
    } catch (error) {
        console.log("Error al emitir el evento load messages", error);
    }
})

/*Middlewars*/
app.use(express.json());
app.use(express.urlencoded({extended: true}));

/*Routes*/
app.use("/", productsRouter);
app.use("/", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/users", usersRouter);
app.use("/api/chat", chatRouter);

/*Configuración de Mongoose*/
mongoose.connect("mongodb+srv://herrerawilliamh:ydGbNCY5mXBYPU1w@cluster0.ncftrzr.mongodb.net/?retryWrites=true&w=majority")
.then(() => {
    console.log("Conectado a la Base de datos");
})
.catch((error) => {
    console.log("Error al conectarse a la base de datos",error);
});

/*Respuesta del Puerto*/
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = server;
module.exports = io;