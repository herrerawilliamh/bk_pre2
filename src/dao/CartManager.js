/*IMPORTS*/
const ProductManager = require('./ProductManager');
const { cartModel } = require('./models/carts.model');

/*VARS*/
const products = new ProductManager();

class CartManager{
    constructor(products){
        this.carts = [];
    }
    async createCart(products=[]){
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
            const carts = await cartModel.find();
            return carts;
        } catch (error) {
            console.error("Error al obtener los carritos", error);
            return [];
        }
        //return this.carts
    }
    async getCartById(id) {
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

    async removeProductFromCart(cid, pid) {
        try {
          const cart = await this.getCartById(cid);
          if (cart) {
            const index = cart.products.findIndex(i => i.id === pid);
            if (index !== -1) {
              cart.products.splice(index, 1);
              await cart.save();
              console.log('Producto eliminado del carrito');
              return cart.populate('products.id').execPopulate();
            }else{
              return "Producto no encontrado en el carrito";
            }
          }else{
            return "Carrito no encontrado";
          }
        } catch (error) {
          console.error("Error al eliminar producto del carrito", error);
          return "Carrito o producto no encontrado";
        }
    }
    
    async updateCart(cid, products) {
        try {
          const cart = await this.getCartById(cid);
          if (cart) {
            cart.products = products;
            await cart.save();
            console.log('Carrito actualizado');
            //return cart.populate('products.id').execPopulate();
          }else{
            return "Carrito no encontrado";
          }
        } catch (error) {
          console.error("Error al actualizar el carrito", error);
          return "Carrito no encontrado";
        }
    }
    
    async updateProductQuantity(cid, pid, quantity) {
        try {
          const cart = await this.getCartById(cid);
          if (cart) {
            const item = cart.products.find(i => i.id === pid);
            if (item) {
              item.quantity = quantity;
              await cart.save();
              console.log('Cantidad de producto actualizada');
              return cart.populate('products.id').execPopulate();
            }else{
              return "Producto no encontrado en el carrito";
            }
          }else{
            return "Carrito no encontrado";
          }
        } catch (error) {
          console.error("Error al actualizar la cantidad de producto", error);
          return "Carrito o producto no encontrado";
        }
    }
    
    async emptyCart(cid) {
        try {
          const cart = await this.getCartById(cid);
          if (cart) {
            cart.products = [];
            await cart.save();
            console.log('Carrito vaciado');
            return cart;
          }else{
            return "Carrito no encontrado";
          }
        } catch (error) {
          console.error("Error al vaciar el carrito", error);
          return "Carrito no encontrado";
        }
    }
    
}

module.exports = CartManager;