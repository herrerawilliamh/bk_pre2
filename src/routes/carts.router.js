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

module.exports = router;