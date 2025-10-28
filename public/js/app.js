const messageList = document.querySelector("#messageList");
const messageForm = document.querySelector("#message");
const nickForm = document.querySelector("#nick");
const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload) {
    const msg = { type, payload };
    return JSON.stringify(msg);
}

nickForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = nickForm.querySelector("input");
    const nickname = input.value;
    socket.send(makeMessage("nickname",nickname));
});

socket.addEventListener("open", () => {
    console.log("Connected to server ✅");
});

socket.addEventListener("message", (message) => {
    console.log("New Message from server:", message.data);
});

socket.addEventListener("close", () => {
    console.log("Disconnected from server ❌");
});

messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    const message = input.value;
    socket.send(makeMessage("message", message));
    input.value = "";
});

socket.addEventListener("message", (message) => {
    const li = document.createElement("li");
    li.className = "bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200";
    li.textContent = message.data;
    messageList.appendChild(li);
    messageList.parentElement.scrollTop = messageList.parentElement.scrollHeight;
});