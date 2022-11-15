/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

let start = document.getElementById("start-page");
let startBtn = document.getElementById("start-btn");
let gameOngoing = true;

startBtn.addEventListener("click", startGame);

function startGame() {
  start.classList.add("playing");
}

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
// Used suggestion from stackoverflow but amended to meet my requirements after trialling different push options that I could think of (https://stackoverflow.com/questions/9649729/dynamically-create-a-two-dimensional-javascript-array)
function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  for (let i = 0; i < HEIGHT; i++) {
    let emptyArray = [];
    for (let j = 0; j < WIDTH; j++) {
      emptyArray.push(null);
    }
    board.push(emptyArray);
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  let htmlBoard = document.getElementById("board");
  // TODO: add comment for this code
  // The game board is a table in HTML in JS it is represented by the variable htmlBoard. The top row will be where players select the column of play and where the click will be listened for.
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);
  // This section creates the 7 columns in the top row to match the width of the board by having 7 table data cells.
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);
  // This top row of 7 columns is appended to the htmlBoard table as the top row.
  // TODO: add comment for this code
  // This section creates the remaining game board to match the 6 x 7 dimensions by creating 6 more table rows each with 7 td cells to create the columns. Each cell is given an id of row number-cell number(column number). All rows are appended to the htmlBoard table.
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  for (let i = HEIGHT - 1; i >= 0; i--) {
    if (board[i][x] === null) {
      return i;
    } else if (board[0][x] !== null) {
      return null;
    }
  }
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  let piece = document.createElement("div");
  piece.classList.add("piece");
  if (currPlayer === 1) {
    piece.classList.add("player1");
  } else {
    piece.classList.add("player2");
  }
  document.getElementById(`${y}-${x}`).append(piece);
  board[y][x] = currPlayer;
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  alert(msg);
  gameOngoing = false;
  const columnTop = document.querySelector("#column-top");
  columnTop.removeEventListener("click", handleClick);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  placeInTable(y, x);
  document.body.append(
    Object.assign(document.createElement("style"), {
      textContent: `@keyframes drop { from { top: ${
        -350 + (5 - y) * 50
      }px } to { top: 0px}}`,
    })
  );

  // check for win
  if (checkForWin()) {
    let timer;
    timer = setTimeout(() => {
      delay();
    }, 450);
    function delay() {
      clearTimeout(timer);
      console.log("currPlayer in delay", currPlayer);
      return endGame(`Player ${currPlayer} won!`);
    }
    return;
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  for (let i = 0; i < board.length; i++) {
    if (
      board[i].every((cell) => cell !== null) &&
      i === 0
    ) {
      return endGame("It is a tie!");
    }
  }

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  console.log("currPlayer above switch", currPlayer);
  currPlayer === 1 ? (currPlayer = 2) : (currPlayer = 1);
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.
  // Loop over cells to see if 4 consecutive horizontal cells (x++), vertical cells (y++) or diagonal cells to the left(y++ && x--) or right(y++ && x++)are occupied.
  // The _win function for these sets of coordinates(cells) is checked and returns true if the above conditions are also true.
  //  Returns true overall in the checkForWin function which would call the endGame function for the appropriate alert.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      let vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      let diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      let diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];

      if (
        _win(horiz) ||
        _win(vert) ||
        _win(diagDR) ||
        _win(diagDL)
      ) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();

function clearBoard() {
  let clearHTMLBoard = document.querySelector("#game");
  clearHTMLBoard.firstElementChild.innerHTML = "";
  board = [];
}

function makeNewBoard() {
  makeBoard();
  makeHtmlBoard();
}

const restartBtn =
  document.getElementsByClassName("restart-btn")[0];
restartBtn.addEventListener("click", function () {
  clearBoard();
  currPlayer = 1;
  gameOngoing = true;
  makeNewBoard();
});
