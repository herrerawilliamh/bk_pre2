/*IMPORTS*/
/*const fs = require('fs');
const path = require('path');*/
const mongoose = require("mongoose");
const { productModel } = require("./models/products.model");

/*VARS*/
//const dataPath = path.join(path.resolve(__dirname, '..','data', 'data.json'));

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
        /*const code_found = this.products.find((product)=>product.code===product.code)
        if(code_found){
            console.log("Código de producto encontrado, debes cambiar el Código de producto")
            return false;
        }*/
        const code_found = await productModel.findOne({code: code})
        if(code_found){
            console.log("Código de producto encontrado, debes cambiar el Código de producto")
            return false;
        }
        //const products = this.getProducts()
        //const last_id = products[products.length - 1].id
        //const product_id = last_id + 1
        const product={
            //id:product_id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }
        //products.push(product)
        //const new_data = JSON.stringify(products, null, 2);
        //fs.writeFileSync(dataPath, new_data);
        await productModel.create(product)
    }
    async getProducts(){
        try {
            /*const data_reading = fs.readFileSync(dataPath, "utf-8")
            const data_products = JSON.parse(data_reading)*/
            const data_products = await productModel.find()
            return this.products = data_products
        } catch (error) {
            console.error("Error de lectura", error);
        }   
    }
    async getProductsById(id){
        /*const data_reading = this.getProducts()
        const product_found = data_reading.find((product)=>product.id===+id)*/
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
        //const data_reading = this.getProductsById(id);
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
        /*let product_found = this.getProducts();
        product_found = product_found.map((p) => {
            if(p.id === id){
                return data_reading
            }
            return p
        });
        fs.writeFileSync(dataPath, JSON.stringify(product_found, null, 2));
        console.log("Producto actualizado exitosamente");
        return product_found*/
        await data_reading.save();
        console.log("Producto actualizado exitosamente")
    }
    async deleteProduct(id){
        /*const data_reading = this.getProductsById(id);
        let product_found = this.getProducts();
        if(!data_reading){
            console.log("Product Not Found. El producto no existe.")
            return
        }
        product_found = product_found.filter((p) => p.id !== id);
        fs.writeFileSync(dataPath, JSON.stringify(product_found, null, 2))
        console.log("Producto eliminado exitosamente")*/
        try {
            await productModel.findByIdAndDelete(id);
            console.log("Producto eliminado exitosamente")
        } catch (error) {
            console.error("Error al eliminar el producto", error);
        }
    }

}

module.exports = ProductManager;