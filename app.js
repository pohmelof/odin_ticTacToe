const gameboard = (function () {
  const board = [];
  const boardEl = document.querySelector(".gameboard");
  const gameStats = document.querySelector(".game-stats");

  const _fillBoard = function () {
    for (let i = 0; i < 9; i++) {
      board.push(`<div class='cell' data-index='${i}'></div>`);
    }
  };

  const renderStats = function () {
    gameStats.innerHTML = `
        <h2 class="player1-name">
          <button class="rename p1">&#x270E</button> ${player1.name} wins:
          <span class="p1-wins">${player1.winCount}</span>
        </h2>
        <h2 class="player2-name">
          <button class="rename p2">&#x270E;</button> ${player2.name} wins:
          <span class="p2-wins">${player2.winCount}</span>
        </h2>
    `;
    document.querySelectorAll(".rename").forEach((item) =>
      item.addEventListener("click", () => {
        if (item.classList.contains("p1")) {
          player1.rename();
        } else {
          player2.rename();
        }
        game.resetGame();
        gameboard.renderStats();
        gameboard.renderBoard();
        game.renderPlayerTurn();
      })
    );
  };

  const renderBoard = function () {
    _fillBoard();
    boardEl.innerHTML = board.join("");
  };

  const updateBoard = function (index, element) {
    board[index] = element;
  };

  return { board, boardEl, renderBoard, updateBoard, renderStats };
})();

const player = function (name, mark) {
  return {
    name,
    mark,
    winCount: 0,
    makeAMove: function (e) {
      e.target.innerText = this.mark;
    },
    rename: function () {
      this.name = prompt("Please enter a name", "Player");
      if (this.name === null) {
        this.name = `Player ${this.mark}`;
      }
    },
  };
};

const player1 = player("Player 1", "x");
const player2 = player("Player 2", "o");

const game = (function () {
  let turn = 1;
  let currentPlayer = player1.name;
  let lines = [];
  const { board, boardEl, updateBoard } = gameboard;
  const messageEl = document.querySelector(".message");
  const player1turn = document.querySelector(".player1-turn");
  const player2turn = document.querySelector(".player2-turn");

  const _determineCurrentPlayer = function () {
    turn % 2 === 0
      ? (currentPlayer = player2.name)
      : (currentPlayer = player1.name);
  };

  const renderPlayerTurn = function () {
    _determineCurrentPlayer();
    player1turn.innerText = `${player1.name} turn`;
    player2turn.innerText = `${player2.name} turn`;
    if (currentPlayer === player1.name) {
      player2turn.classList.add("transparent");
      player1turn.classList.remove("transparent");
    } else {
      player1turn.classList.add("transparent");
      player2turn.classList.remove("transparent");
    }
  };

  const _fillLines = function (arr) {
    lines = [
      // horizontal lines
      [arr[0].innerText, arr[1].innerText, arr[2].innerText],
      [arr[3].innerText, arr[4].innerText, arr[5].innerText],
      [arr[6].innerText, arr[7].innerText, arr[8].innerText],
      // vertical lines
      [arr[0].innerText, arr[3].innerText, arr[6].innerText],
      [arr[1].innerText, arr[4].innerText, arr[7].innerText],
      [arr[2].innerText, arr[5].innerText, arr[8].innerText],
      // cross lines
      [arr[0].innerText, arr[4].innerText, arr[8].innerText],
      [arr[2].innerText, arr[4].innerText, arr[6].innerText],
    ];
  };

  const _determineWinner = function () {
    if (
      lines.filter((item) => item.every((a) => a === player1.mark)).length > 0
    ) {
      player1.winCount++;
      endGame(player1.name);
      gameboard.renderStats();
    } else if (
      lines.filter((item) => item.every((a) => a === player2.mark)).length > 0
    ) {
      player2.winCount++;
      endGame(player2.name);
      gameboard.renderStats();
    } else if (turn > 9) {
      endGame("Draw");
    }
  };

  const playTurn = function (e) {
    if (e.target.innerText !== "") return;
    if (currentPlayer === player1.name) {
      player1.makeAMove(e);
    } else if (currentPlayer === player2.name) {
      player2.makeAMove(e);
    }

    turn++;
    renderPlayerTurn();
    updateBoard(e.target.dataset.index, e.target);

    _fillLines(board);

    _determineWinner();
  };

  const endGame = function (name) {
    boardEl.removeEventListener("click", playTurn);
    player2turn.classList.add("transparent");
    player1turn.classList.add("transparent");
    messageEl.classList.add("accent-color");
    if (name === "Draw") {
      messageEl.innerText = `Its a Draw`;
    } else {
      messageEl.innerText = `${name} has won`;
    }
  };

  const resetGame = function () {
    turn = 1;
    board.length = 0;
    boardEl.addEventListener("click", playTurn);
    messageEl.classList.remove("accent-color");
    messageEl.innerText = ``;
  };

  return { renderPlayerTurn, resetGame };
})();

document.querySelector(".new-game").addEventListener("click", () => {
  game.resetGame();
  gameboard.renderStats();
  gameboard.renderBoard();
  game.renderPlayerTurn();
});
