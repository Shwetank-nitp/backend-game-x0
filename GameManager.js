const CrossAndZero = require("./CrossAndZero.js");

class GameManager {
  io;
  playerOnHold;
  constructor(io) {
    this.io = io;
    this.playerOnHold = null;
    this.games = new Map();
  }

  startNewPair(socketid) {
    try {
      if (this.findGame(socketid)) {
        this.io.to(socketid).emit("error", "already in a game!!");
        return;
      }

      if (!this.playerOnHold) {
        this.playerOnHold = socketid;
        this.io
          .to(socketid)
          .emit("waiting", { status: "waiting", socketid: socketid });
        return;
      }

      if (this.playerOnHold === socketid) {
        return;
      }

      const game = new CrossAndZero(this.playerOnHold, socketid);
      this.games.set(`${this.playerOnHold}/${socketid}`, game);
      this.io.to(socketid).emit("GameStarted", {
        opponent: this.playerOnHold,
        playerId: socketid,
        your_mark: game.players[1].type,
        opp_mark: game.players[0].type,
      });
      this.io.to(this.playerOnHold).emit("GameStarted", {
        opponent: socketid,
        playerId: this.playerOnHold,
        your_mark: game.players[0].type,
        opp_mark: game.players[1].type,
      });
      this.playerOnHold = null;
    } catch (error) {
      throw error;
    }
  }
  // find the game and gameID form the hashmap of games
  findGame(searchParam = "") {
    const gameID = [...this.games.keys()].find((key) =>
      key.includes(searchParam)
    );
    return gameID ? { game: this.games.get(gameID), gameID } : undefined;
  }

  moveManager(position, socketId) {
    try {
      const { game, gameID } = this.findGame(socketId);
      if (!game) {
        this.io.to(socketId).emit("error", "game not found");
        return;
      }

      const palyer = gameID?.split("/").find((item) => item === socketId);
      const opponent = gameID?.split("/").find((item) => item !== socketId);

      if (!palyer || !opponent) {
        this.io.to(socketId).emit("error", "palyer not found");
        console.log(games, " ", socketId);
        this.quitGame(palyer || opponent);
      }

      const { symbol } = game.players.find((item) => item.socketID === palyer);

      if (!symbol) {
        this.io.to(palyer).emit("error", "system error!!");
        console.log(games, " ", socketId);
        return;
      }

      if (!game.checkFairPlay(symbol)) {
        this.io
          .to(socketId)
          .emit(
            "fairPlayError",
            "You have already made the move wait for your turn"
          );
        return;
      }

      game
        .makeMove(symbol, position)
        .then((symbol) => (game.prevPlay = symbol))
        .catch((error) => {
          console.log(error);
        });

      this.io.to(palyer).emit("getBoard", game.board);
      this.io.to(opponent).emit("getBoard", game.board);

      if (game.checkWin()) {
        this.io.to(palyer).emit("winner", "you have won");
        this.io.to(opponent).emit("looser", "you loose the game");
        this.games.delete(gameID);
        return;
      }

      if (game.checkDraw()) {
        console.log("draw");
        this.io.to(palyer).emit("draw", "Match draw!!");
        this.io.to(opponent).emit("draw", "Match draw!!");
        this.games.delete(gameID);
      }
    } catch (error) {
      throw error;
    }
  }

  quitGame(socketId) {
    console.log(socketId);
    console.log(this.games);
    const { gameID } = this.findGame(socketId);
    try {
      if (!gameID) {
        this.io.to(socketId).emit("error", "game not found");
        throw new Error("game not found");
      }
    } catch (error) {
      throw error;
    }
    const [opponent] = gameID
      .split("/")
      .filter((socket) => socket !== socketId);
    this.io.to(socketId).emit("quit", "you quitted the game");
    this.io.to(opponent).emit("gameAborted", "your opponent quit, you won");

    this.games.delete(gameID);
  }
}

module.exports = GameManager;
