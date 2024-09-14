// server.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const GameManager = require("./GameManager");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const gameManager = new GameManager(io);

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("startNewGame", () => {
    gameManager.startNewPair(socket.id);
  });

  socket.on("makeMove", (position) => {
    try {
      gameManager.moveManager(position, socket.id);
    } catch (error) {
      console.log("error", error);
    }
  });

  socket.on("quit", () => {
    try {
      gameManager.quitGame(socket.id);
    } catch (error) {
      console.log("error", error);
    }
  });

  socket.on("disconnect", () => {
    try {
      if (gameManager.playerOnHold === socket.id) {
        gameManager.playerOnHold = null;
      } else if (gameManager.findGame(socket.id)) {
        gameManager.quitGame(socket.id);
      }
      console.log("Clinet Disconnercted");
    } catch (error) {
      console.log("error", error);
    }
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
