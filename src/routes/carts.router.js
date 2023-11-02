/*IMPORTS*/
const express = require('express');
const CartManager = require('../dao/CartManager.js');
const ProductManager = require('../dao/ProductManager.js');
const { cartModel } = require('../dao/models/carts.model');

/*VARS*/
const router = express.Router();
const products = new ProductManager();
const cartManager = new CartManager(products);

router.post('/carts', async (req,res) => {
  const cart = await cartManager.createCart();
  if (typeof cart === "object") {
    res.status(200).json(cart);
  }else{
    res.status(404).json({message: cart});
  }
});

router.get('/carts/:cid', async (req, res) => {
  const cid = req.params.cid;
  const cart = await cartManager.getCartById(cid);
  if (cart) {
    await cart.populate('products.id');
    if (req.xhr) {
      res.status(200).json(cart);
    } else {
      res.render('cart', {title: "WILLY Ecommerce - Cart", products: cart.products});
    }
  } else {
    res.status(404).send('Cart not found');
  }
});


router.post('/carts/:cid/product/:pid', async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const cart = await cartManager.addProductToCart(cid, pid);
  if (cart) {
    res.status(200).json(cart);
  } else {
    res.status(404).json({message: 'Cart or product not found'});
  }
});

router.delete('/carts/:cid/product/:pid', async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const cart = await cartManager.removeProductFromCart(cid, pid);
  if (cart) {
    res.status(200).json(cart);
  } else {
    res.status(404).json({message: 'Cart or product not found'});
  }
});

router.put('/carts/:cid', async (req, res) => {
  const cid = req.params.cid;
  const products = req.body.products;
  const cart = await cartManager.updateCart(cid, products);
  if (cart) {
    res.status(200).json(cart);
  } else {
    res.status(404).json({message: 'Cart not found'});
  }
});

router.put('/carts/:cid/product/:pid', async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const quantity = req.body.quantity;
  const cart = await cartManager.updateProductQuantity(cid, pid, quantity);
  if (cart) {
    res.status(200).json(cart);
  } else {
    res.status(404).json({message: 'Cart or product not found'});
  }
});

router.delete('/carts/:cid', async (req, res) => {
  const cid = req.params.cid;
  const cart = await cartManager.emptyCart(cid);
  if (cart) {
    res.status(200).json(cart);
  } else {
    res.status(404).json({message: 'Cart not found'});
  }
});

module.exports = router;