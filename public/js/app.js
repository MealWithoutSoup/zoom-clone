const socket = io();

const welcome = document.querySelector(".chat-container #welcome");
const enterRoomForm = welcome.querySelector("form");
const room = document.querySelector(".chat-container #room");

room.hidden = true;

let roomName;

function addMessage(message) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function changeRoomNameCount (newCount) {
    const h3 = room.querySelector("#roomTitle");
    h3.innerText = `Room: ${roomName} (${newCount})`;
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#message input");
    const message = input.value;
    socket.emit("new_message", message, roomName, () => {
        addMessage(`You: ${message}`);
    })
    input.value = "";
}

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    changeRoomNameCount(1);
    const msgForm = room.querySelector("#message");
    msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const roomNameInput = enterRoomForm.querySelector("#roomName");
  const nicknameInput = enterRoomForm.querySelector("#nickname");
  const nickname = nicknameInput.value;

  socket.emit("enter_room", { room: roomNameInput.value, nickname }, showRoom);
  roomName = roomNameInput.value;
  roomNameInput.value = "";
  nicknameInput.value = "";
}

enterRoomForm.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (nickname, newCount) => {
    changeRoomNameCount(newCount);
    addMessage(`A new user joined! (${nickname})`);
});

socket.on("bye", (nickname, newCount) => {
    changeRoomNameCount(newCount);
    addMessage(`User ${nickname} left the room.`);
});

socket.on("new_message", (message) => {
    addMessage(message);
});

socket.on("room_change", (rooms) => {
    const roomlist = welcome.querySelector("ul");
    roomlist.innerHTML = "";
    if (rooms.length === 0) {
        return;
    }
    rooms.forEach(room => {
        const li = document.createElement("li");
        li.innerText = room;
        roomlist.append(li);
    });

});