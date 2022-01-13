const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");
const socket = new WebSocket(`ws://${window.location.host}`); // socket = connnection to server

//메세지== 이벤트 받기
socket.addEventListener("open", () => {
    console.log("Connected to server");
});

socket.addEventListener("message", (message) => {
    console.log("New message: ", message.data, "from the server");
});

socket.addEventListener("close", () => {
    console.log("disconnected to server x");
});

function handleSubmit(event) {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(input.value);
    input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);