/*IMPORTS*/
const mongoose = require("mongoose");
const { productModel } = require("./models/products.model");

/*VARS*/

class ProductManager{
    constructor(){
        this.products=[]
        this.path
    }
    async addProduct(title, description, price, thumbnail, code, stock){
        if(!thumbnail){
            thumbnail = ""
        }
        const required_fields = [title, description, price, code, stock].includes("")
        if(required_fields){
            console.log("Debes completar todos los campos")
            return false;
        }
        const code_found = await productModel.findOne({code: code})
        if(code_found){
            console.log("Código de producto encontrado, debes cambiar el Código de producto")
            return false;
        }
        const product={
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }
        await productModel.create(product)
    }
    async getProducts({offset, limit}){
        try {
            const data_products = await productModel.find().skip(offset).limit(limit);
            return data_products
        } catch (error) {
            console.error("Error de lectura", error);
        }   
    }
    async getProductsById(id){
        try {
            const product_found = await productModel.findById(id)
            if(!product_found){
                console.log("Product Not Found")
                return
            }
            return product_found
        } catch (error) {
            console.error("Error al buscar el producto por id", error);
        }
    }
    async updateProduct(id, campo, dato){
        const data_reading = await productModel.findById(id)
        if(!data_reading){
            console.log("Product Not Found. No se pudo actualizar el producto.")
            return
        }
        if (data_reading[campo] === dato) {
            console.log("Es el mismo dato. No se necesita actualizar el producto.");
            return
        }
        data_reading[campo] = dato;
        await data_reading.save();
        console.log("Producto actualizado exitosamente")
    }
    async deleteProduct(id){
        try {
            await productModel.findByIdAndDelete(id);
            console.log("Producto eliminado exitosamente")
        } catch (error) {
            console.error("Error al eliminar el producto", error);
        }
    }
    async countProducts(options) {
        const count = await productModel.countDocuments(options);
        return count;
    }
}

module.exports = ProductManager;