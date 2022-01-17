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
    socket["nickname"] = "Anonymous";
    console.log("Connected to browser");
    socket.on("close", () => console.log("Disconnected from the browser"));
    socket.on("message", (msg) => { // FE로부터 도착하면 user에게 보냄
        const message = JSON.parse(msg); // turns string into JS obj
        switch (message.type) {
            case "new_message":
                sockets.forEach((aSocket) =>
                    aSocket.send(`${socket.nickname}: ${message.payload}`)
                ); // each broser = aSocket
            // send message to each socket
            case "nickname":
                socket["nickname"] = message.payload;
        }
    });
}); // socket이 어느상태인지 알기쉽다

server.listen(3000, handleListen);


