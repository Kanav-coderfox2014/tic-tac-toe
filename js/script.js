const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartButton = document.getElementById("restart-btn");

let board = ["", "", "", "", "", "", "", "", ""];

let currentPlayer = "X";

let gameActive = true;


const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]
];


cells.forEach((cell) => {

    cell.addEventListener("click", handleCellClick);

});


function handleCellClick(event) {

    const clickedCell = event.target;

    const clickedIndex = clickedCell.dataset.index;


    if (board[clickedIndex] !== "" || !gameActive) {
        return;
    }


    board[clickedIndex] = currentPlayer;

    clickedCell.textContent = currentPlayer;


    checkResult();

}


function checkResult() {

    let roundWon = false;


    for (let combination of winningCombinations) {

        const a = combination[0];
        const b = combination[1];
        const c = combination[2];


        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            roundWon = true;

            break;
        }
    }


    if (roundWon) {

        statusText.textContent = `Player ${currentPlayer} wins!`;

        gameActive = false;

        return;
    }


    if (!board.includes("")) {

        statusText.textContent = "It's a draw!";

        gameActive = false;

        return;
    }


    currentPlayer = currentPlayer === "X" ? "O" : "X";

    statusText.textContent = `Player ${currentPlayer}'s turn`;
}


function restartGame() {

    board = ["", "", "", "", "", "", "", "", ""];

    currentPlayer = "X";

    gameActive = true;


    cells.forEach((cell) => {

        cell.textContent = "";

    });


    statusText.textContent = "Player X's turn";
}


restartButton.addEventListener("click", restartGame);