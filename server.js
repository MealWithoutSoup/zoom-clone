import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
  console.log("A new client connected ✅");
  sockets.push(socket);
  socket["nickname"] = "Anonymous";
  socket.on("close", () => {
    console.log("Disconnected from the client ❌");
  });
  socket.on("message", (message) => {
    const parsedMessage = JSON.parse(message);
    switch (parsedMessage.type) {
      case "message":
        sockets.forEach((aSocket) => {
          if (aSocket !== socket) {
            aSocket.send(`${socket.nickname}: ${parsedMessage.payload}`);
          }
        });
        break;
      case "nickname":
        socket["nickname"] = parsedMessage.payload;
        break;
    }
    console.log(parsedMessage);
  });
});

server.listen(3000, handleListen);
