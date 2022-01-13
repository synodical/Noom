import http from "http";
import { WebSocketServer } from 'ws';
import express from "express";
const app = express();
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000/`);

const server = http.createServer(app); // http server
const wss = new WebSocketServer({ server });

const sockets = [];

wss.on("connection", (socket) => { // socket means connected browser
    sockets.push(socket); // 연결된 브라우저를 배열에 넣음
    console.log("Connected to browser");
    socket.on("close", () => console.log("Disconnected from the browser"));
    socket.on("message", (message) => { // FE로부터 도착하면 user에게 보냄
        sockets.forEach(aSocket => aSocket.send(message.toString())); // each broser = aSocket
        // send message to each socket
    });
}); // socket이 어느상태인지 알기쉽다

server.listen(3000, handleListen);


