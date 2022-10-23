const gameboard = (function () {
  const board = [];
  const boardEl = document.querySelector(".gameboard");

  const _fillBoard = function () {
    for (let i = 0; i < 9; i++) {
      board.push(`<div class='cell' data-index='${i}'></div>`);
    }
  };

  const _resetBoard = function () {
    board.length = 0;
  };

  const renderBoard = function () {
    _resetBoard();
    _fillBoard();
    boardEl.innerHTML = board.join("");
  };

  const updateBoard = function (index, element) {
    board[index] = element;
  };

  return { board, boardEl, renderBoard, updateBoard };
})();

const game = (function () {
  let turn = 1;
  let currentPlayer = "player1";
  let lines = [];
  const { board, boardEl, updateBoard } = gameboard;

  const _determineCurrentPlayer = function () {
    turn % 2 === 0 ? (currentPlayer = "player2") : (currentPlayer = "player1");
  };

  const renderPlayerTurn = function () {
    _determineCurrentPlayer();
    document.querySelector(".player-turn").innerText = `${currentPlayer} turn`;
  };

  const _fillLines = function (arr) {
    return (lines = [
      // horizontal lines
      [arr[0].innerText, arr[1].innerText, arr[2].innerText],
      [arr[3].innerText, arr[5].innerText, arr[5].innerText],
      [arr[6].innerText, arr[7].innerText, arr[8].innerText],
      // vertical lines
      [arr[0].innerText, arr[3].innerText, arr[6].innerText],
      [arr[1].innerText, arr[4].innerText, arr[7].innerText],
      [arr[2].innerText, arr[5].innerText, arr[8].innerText],
      // cross lines
      [arr[0].innerText, arr[4].innerText, arr[8].innerText],
      [arr[2].innerText, arr[4].innerText, arr[6].innerText],
    ]);
  };

  boardEl.addEventListener("click", (e) => {
    if (e.target.innerText !== "") return;
    e.target.innerText = currentPlayer === "player1" ? "x" : "o";
    turn++;
    renderPlayerTurn();
    updateBoard(e.target.dataset.index, e.target);
    // board[e.target.dataset.index] = e.target;

    _fillLines(board);
    console.log(lines);

    // console.log(lines);
    if (lines.filter((item) => item.every((a) => a === "x")).length > 0) {
      console.log("player1 won");
      turn = 1;
    } else if (
      lines.filter((item) => item.every((a) => a === "o")).length > 0
    ) {
      console.log("player2 won");
      turn = 1;
    } else if (turn > 9) {
      console.log("its a draw");
      turn = 1;
    }
  });
  return { renderPlayerTurn };
})();

document.querySelector(".new-game").addEventListener("click", () => {
  gameboard.renderBoard();
  game.renderPlayerTurn();
});
