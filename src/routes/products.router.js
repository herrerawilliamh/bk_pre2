/*IMPORTS*/
const express = require('express');
const ProductManager = require('../dao/ProductManager.js');
const server = require('../app');
const io = require('socket.io')(server);

/*VARS*/
const router = express.Router();
const productManager = new ProductManager();

router.get("/products", async (req, res) => {
    const products = await productManager.getProducts();
    const limit = req.query.limit || products.length;
    res.json(products.slice(0, limit));
})

router.get("/products/:pid", async (req, res) => {
    //const idProduct = parseInt(req.params.pid);
    const idProduct = req.params.pid;
    const product = await productManager.getProductsById(idProduct);
    if(!product) return res.send({error: "Producto no encontrado"});
    res.send({ product });
})

router.post("/products", (req, res)=>{
    const {title, description, price, thumbnail, code, stock} = req.body;
    const empty = Object.keys(req.body).length === 0;
    if (!empty) {
        const result = productManager.addProduct(title, description, price, thumbnail, code, stock);
        if(result){
            io.sockets.emit('productsUpdated', productManager.getProducts());
            res.send("Producto agregado exitosamente");
        }else{
            res.status(400).json({error: "No se pudo crear el producto"});
        }
    } else {
        res.send("No se han enviado datos por el método post");
    }
})

router.put("/products/:pid", async (req, res) => {
    //const idProduct = parseInt(req.params.pid);
    const idProduct = req.params.pid;
    const product = await productManager.getProductsById(idProduct);
    if(!product) return res.send({error: "Producto no encontrado"});
    const {campo, dato} = req.body;
    const empty = Object.keys(req.body).length === 0;
    if(!empty){
        productManager.updateProduct(idProduct, campo, dato);
        res.send("Producto actualizado exitosamente");
    }else{
        res.send("No se han enviado datos por el método put");
    }
})

router.delete("/products/:pid", async (req, res) => {
    //const idProduct = parseInt(req.params.pid);
    const idProduct = req.params.pid;
    try {
        const product = await productManager.getProductsById(idProduct);
        if(!product) return res.status(404).send({error: "Producto no encontrado"}); 
        await productManager.deleteProduct(idProduct);
        io.sockets.emit('productsUpdated', productManager.getProducts());
        res.send("Producto eliminado exitosamente");
    } catch (error) {
        res.status(500).send(error.message);
    }
})


module.exports = router;