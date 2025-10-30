import WebSocket from "ws";
import http from "http";
import express from "express";
// import SockketIo from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app);
// const wsServer = new SocketIo(httpServer);


const wss = new WebSocket.Server({ server: httpServer });

// previous WebSocket code commented out
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

httpServer.listen(3000, handleListen);
