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
})