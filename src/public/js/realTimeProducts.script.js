const socket = io();
socket.on('product-created', (product) => {
    const li = document.createElement("li");
    li.id = product.id;
    li.textContent = `${product.name} - ${product.price}`;
    const list = document.getElementById("products-list");
    list.appendChild(li);
});
socket.on('product-deleted', (id)=>{
    const li = document.getElementById(id);
    if(li){
        li.remove();
    }
});
function deleteProduct(id){
    socket.emit('delete-product', id);
}
function createProduct(e){
    e.preventDefault(); //Evitar que el formulario se envíe por HTTP
    const formData = new FormData(e.target);
    const product = Object.fromEntries(formData.entries());
    socket.emit('create-product', product);
    e.target.reset();
}
const deleteForm = document.getElementById("delete-product-form");
deleteForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const productId = document.getElementById("product-id").value;
    deleteProduct(productId);
    e.target.reset();
})