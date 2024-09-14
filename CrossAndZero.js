class CrossAndZero {
  players;
  board;

  prevPlay = null;

  constructor(socketID1, socketID2) {
    this.players = [
      {
        socketID: socketID1,
        type: "zero",
        symbol: "0",
      },
      {
        socketID: socketID2,
        type: "cross",
        symbol: "x",
      },
    ];
    this.board = "* * */* * */* * *"; // *** *** *** type of struncture of board
  }

  checkWin() {
    const winCondition = ["000", "xxx"];

    const matrix = this.board.split("/").map((item) => item.split(" "));
    // Split without space for a 3 by 3 matrix

    // Check the matrix row-wise
    for (const row of matrix) {
      const joinTheRows = row.join("");
      if (winCondition.includes(joinTheRows)) {
        return true;
      }
    }

    // Check the matrix column-wise
    for (let i = 0; i < 3; i++) {
      const joinTheCol = matrix[0][i] + matrix[1][i] + matrix[2][i];
      if (winCondition.includes(joinTheCol)) {
        return true;
      }
    }

    // Check the forward diagonal
    const joinForwardDiagonal = matrix[0][0] + matrix[1][1] + matrix[2][2];
    if (winCondition.includes(joinForwardDiagonal)) {
      return true;
    }

    // Check the backward diagonal
    const joinBackwardDiagonal = matrix[0][2] + matrix[1][1] + matrix[2][0];
    if (winCondition.includes(joinBackwardDiagonal)) {
      return true;
    }

    return false;
  }

  checkDraw() {
    return !this.board.includes("*");
  }

  makeMove(symbol, position) {
    return new Promise((resolve, reject) => {
      const matrix = this.board.split("/").map((item) => item.split(" "));
      const [x, y] = position.split(" ").map(Number);

      if (matrix[x][y] === "*") {
        matrix[x][y] = symbol;
        this.board = matrix.map((rows) => rows.join(" ")).join("/");
      } else {
        reject("dublicate placement");
      }
      resolve(symbol);
    });
  }

  checkFairPlay(symbol) {
    return symbol !== this.prevPlay;
  }
}

module.exports = CrossAndZero;
