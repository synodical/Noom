import http from "http";
//import { WebSocketServer } from 'ws';
import SocketIO from "socket.io";
import express from "express";
const app = express();
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000/`);

const httpServer = http.createServer(app); // http server
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
    socket.onAny((event) => {
        console.log(`Socket Event: ${event}`);
    });
    socket.on("enter_room", (roomName, done) => { // emit과 on은 same name
        socket.join(roomName);
        done();
        socket.to(roomName).emit("Welcome");
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => socket.to(room).emit("bye"));
    });
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", msg);
        done();
    });
});

//const wss = new WebSocketServer({ server });

/*
const sockets = [];

wss.on("connection", (socket) => { // socket means connected browser
    sockets.push(socket); // 연결된 브라우저를 배열에 넣음
    socket["nickname"] = "Anonymous";
    console.log("Connected to browser");
    socket.on("close", () => console.log("Disconnected from the browser"));
    socket.on("message", (roomName) => { // FE로부터 도착하면 user에게 보냄
        const message = JSON.parse(roomName); // turns string into JS obj
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
*/
httpServer.listen(3000, handleListen);


