/*IMPORTS*/
const express = require('express');
const ProductManager = require('../dao/ProductManager.js');
const server = require('../app');
const io = require('socket.io')(server);

/*VARS*/
const router = express.Router();
const productManager = new ProductManager();

router.get("/products", async (req, res) => {
    const { limit = 10, page = 1, sort = null, query = null } = req.query;
    const options = {};
    options.limit = limit;
    options.page = page;
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
        const result = await productManager.getProducts(options);
        const count = await productManager.countProducts(options.filter);
        // Calculamos el número total de páginas según el límite
        const totalPages = Math.ceil(count / limit);
        // Determinamos si hay página previa y siguiente
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;
        // Creamos los links para la página previa y siguiente
        const prevLink = hasPrevPage
          ? `/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}`
          : null;
        const nextLink = hasNextPage
          ? `/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}`
          : null;
        // Creamos el objeto de respuesta con el formato solicitado
        const response = {
          status: "success",
          payload: result,
          totalPages: totalPages,
          prevPage: page - 1,
          nextPage: page + 1,
          page: page,
          hasPrevPage: hasPrevPage,
          hasNextPage: hasNextPage,
          prevLink: prevLink,
          nextLink: nextLink,
        };
        // Enviamos el objeto de respuesta como JSON
        res.json(response);
    } catch (error) {
        // Si hay algún error, lo manejamos con el middleware de errores
        console.log(error);
    }
})

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