import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {origin: "*"}
});


io.on("connection", (socket) => {
  console.log(`socket ${socket.id} connected`);

  socket.emit("foo", "bar");

  socket.on("foobar", () => {
  
  });


  socket.on("disconnect", (reason) => {
    console.log(`socket ${socket.id} disconnected due to ${reason}`);
  });
});


server.listen(3000, () => console.log("Server 3000 portunda"));
