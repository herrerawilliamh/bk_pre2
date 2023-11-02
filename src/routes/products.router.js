/*IMPORTS*/
const express = require('express');
const ProductManager = require('../dao/ProductManager.js');
const server = require('../app');
const io = require('socket.io')(server);

/*VARS*/
const router = express.Router();
const productManager = new ProductManager();

router.get("/products", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort;
    const query = req.query.query;
    const offset = (page - 1) * limit;
    const options = {};
    if (sort) {
        options.sort = { price: sort === 'asc' ? 1 : -1 };
    }
    if (query) {
        const filter = {};
            if (query.category) {
            filter.category = query.category;
            }
            if (query.available) {
                filter.available = query.available === "true";
              }
              options.filter = filter;
    }
    try {
        const products = await productManager.getProducts({offset, limit});
        const total = await productManager.countProducts();

        const totalPages = Math.ceil(total / limit);
        const prevPage = page > 1 ? page - 1 : null;
        const nextPage = page < totalPages ? page + 1 : null;
        const hasPrevPage = prevPage !== null;
        const hasNextPage = nextPage !== null;

        const prevLink = hasPrevPage
          ? `/products?limit=${limit}&page=${prevPage}`
          : null;
        const nextLink = hasNextPage
          ? `/products?limit=${limit}&page=${nextPage}`
          : null;

        res.render('products', {
            title: "WILLY Ecommerce - Productos",
            products: products,
            prevPage: prevPage,
            nextPage: nextPage,
            totalPages: totalPages,
            currentPage: page,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevLink: prevLink,
            nextLink: nextLink
        });
    } catch (error) {
        console.log(error);
        res.render('error', {message: error.message});
    }
});

router.get("/products/:pid", async (req, res) => {
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