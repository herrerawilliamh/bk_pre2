/*IMPORTS*/
/*const fs = require('fs');
const path = require('path');*/
const ProductManager = require('./ProductManager');
const { cartModel } = require('./models/carts.model');

/*VARS*/
//const cartPath = path.join(path.resolve(__dirname, '..',__dirname, 'data', 'cart.json'));
const products = new ProductManager();

class CartManager{
    constructor(products){
        this.carts = [];
    }
    async createCart(products=[]){
        /*const carts = this.getCart();
        const last_id = carts[carts.length -1].id;
        const cart_id = last_id+1;

        carts.push(cart);
        const new_data = JSON.stringify(carts, null, 2);
        fs.writeFileSync(cartPath, new_data);
        return cart;*/
        try {
            const cart = new cartModel({products});
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al crear el carrito", error);
            return "Error al crear el carrito";
        }
    }
    async getCart(){
        try {
            /*const data_reading = fs.readFileSync(cartPath, "utf-8")
            const data_cart = JSON.parse(data_reading)
            return data_cart*/
            const carts = await cartModel.find();
            return carts;
        } catch (error) {
            console.error("Error al obtener los carritos", error);
            return [];
        }
        //return this.carts
    }
    async getCartById(id) {
        /*const data_reading = this.getCart()
        const cart_found = data_reading.find((cart) => cart.id === +id);
        if (cart_found) {
            return cart_found;
        }else{
            return "Cart not found";
        }*/
        try {
            const cart = await cartModel.findById(id);
            if (cart) {
                return cart;
            }else{
                return "Carrito no encontrado";
            }
        } catch (error) {
            console.error("Error al obtener el carrito por id", error);
            return "Carrito no encontrado";
        }
    }
    async addProductToCart(cid, pid) {
        /*const cart = this.getCartById(cid)
        const product = this.products.getProductsById(pid);
        if (cart && product) {
            const item = cart.products.find(i => i.product === pid);
            if (!item) {
                cart.products.push({product: pid, quantity: 1});
            }else{
                item.quantity++;
            }
            const data = fs.readFileSync(cartPath, 'utf8')
            const carts = JSON.parse(data)
            const index = carts.findIndex(c => c.id === +cid)
            carts[index] = cart
            const new_data = JSON.stringify(carts, null, 2)
            fs.writeFileSync(cartPath, new_data)
            console.log('Carrito actualizado')
            return cart;
        }else{
            return "Cart or product not found";
        }*/
        try {
            const cart = await this.getCartById(cid);
            const product = await products.getProductsById(pid);
            if (cart && product) {
                const item = cart.products.find(i => i.id === pid);
                if (!item) {
                    cart.products.push({id: pid, quantity: 1});
                }else{
                    item.quantity++;
                }
                await cart.save(); 
                console.log('Carrito actualizado')
                return cart; 
            }else{
                return "Carrito o producto no encontrado";
            }
        } catch (error) {
            console.error("Error al añadir producto al carrito", error);
            return "Carrito o producto no encontrado";
        }
    }
    /*saveCart(cart) {
        const cartJSON = JSON.stringify(cart, null, 2);
        fs.writeFileSync(cartPath, cartJSON);
    }*/
}

module.exports = CartManager;