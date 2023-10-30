/*IMPORTS*/
const express = require('express');
const CartManager = require('../dao/CartManager.js');
const ProductManager = require('../dao/ProductManager.js');

/*VARS*/
const router = express.Router();
const products = new ProductManager();
const cartManager = new CartManager(products);

router.post('/carts', (req,res) => {
  const cart = cartManager.createCart();
  if (typeof cart === "object") {
    res.status(200).json(cart);
  }else{
    res.status(404).json({message: cart});
  }
});

router.get('/carts/:cid', (req, res) => {
    const cid = req.params.cid;
    const cart = cartManager.getCartById(cid);
    if (cart) {
      res.status(200).json(cart);
    } else {
      res.status(404).json({message: 'Cart not found'});
    }
  });

router.post('/carts/:cid/product/:pid', (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const cart = cartManager.addProductToCart(cid, pid);
  if (cart) {
    res.status(200).json(cart);
  } else {
    res.status(404).json({message: 'Cart or product not found'});
  }
});

router.delete('/carts/:cid/products/:pid', (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const cart = cartManager.removeProductFromCart(cid, pid);
  if (cart) {
    res.status(200).json(cart);
  } else {
    res.status(404).json({message: 'Cart or product not found'});
  }
});

router.put('/carts/:cid', (req, res) => {
  const cid = req.params.cid;
  const products = req.body.products;
  const cart = cartManager.updateCart(cid, products);
  if (cart) {
    res.status(200).json(cart);
  } else {
    res.status(404).json({message: 'Cart not found'});
  }
});

router.put('/carts/:cid/products/:pid', (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const quantity = req.body.quantity;
  const cart = cartManager.updateProductQuantity(cid, pid, quantity);
  if (cart) {
    res.status(200).json(cart);
  } else {
    res.status(404).json({message: 'Cart or product not found'});
  }
});

router.delete('/carts/:cid', (req, res) => {
  const cid = req.params.cid;
  const cart = cartManager.emptyCart(cid);
  if (cart) {
    res.status(200).json(cart);
  } else {
    res.status(404).json({message: 'Cart not found'});
  }
});


module.exports = router;