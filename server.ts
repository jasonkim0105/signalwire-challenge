import { Socket } from "socket.io";

const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const fs = require("fs");

app.get("/", function (req, res) {
  res.sendFile(
    path.join(__dirname, "index.html")
  );
});

io.on("connection", (socket: Socket) => {
  console.log("new connection: " + socket.id)

  socket.on("new message", (msg:any) => {
    console.log('new message on the server: ', msg);
    fs.appendFile('log.txt', `RECV:<${msg}>\n`, function (err: Error) {
      if (err) throw err;
      console.log('Saved')
    })
    socket.broadcast.emit("incoming", msg);
    fs.appendFile('log.txt', `SEND:<${msg}>\n`, function (err: Error) {
      if (err) throw err;
      console.log('Saved')
    })
  })

  socket.on("disconnect", () => {
    console.log('disconnected');
  })
})

server.listen(3000, () =>{
  console.log('started server')
});