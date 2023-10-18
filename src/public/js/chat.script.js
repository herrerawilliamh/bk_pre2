const socket = io();
 
document.getElementById("username-form").style.display = "block"
    document.getElementById("chat-form").style.display = "none"
document.getElementById("chat-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const messageInput = document.getElementById("message")
    const message = messageInput.value
    messageInput.value = ""
    socket.emit("chatMessage", message);
})

socket.on("message", (data) => {
    const chatMessage = document.getElementById("chat-messages")
    const messageElement = document.createElement("div")
    messageElement.innerHTML = `<strong>${data.username}: </strong> ${data.message}`
    chatMessage.appendChild(messageElement)
})

socket.on("load messages", (messages) => {
    const ul = document.getElementById("chat-record");
    for (let message of messages) {
      const li = document.createElement("li");
      li.id = message._id;
      li.innerHTML = `<p><strong>${message.username}: </strong> ${message.message}</p>`;
      ul.appendChild(li);
    }
  });

document.getElementById("username-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const usernameInput = document.getElementById("username")
    const username = usernameInput.value
    socket.emit("newUser", username)
    
    Swal.fire({
        icon: "success",
        title: "Bienvnid@ al chat",
        text: `Estás conectado como ${username}`
    })

    document.getElementById("username-form").style.display = "none"
    document.getElementById("chat-form").style.display = "block"

})