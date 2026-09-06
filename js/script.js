const cells = document.querySelectorAll(".cell");

const statusText = document.getElementById("status");

const restartButton = document.getElementById("restart-btn");

const popupRestartButton =
    document.getElementById("popup-restart-btn");

const winnerPopup =
    document.getElementById("winner-popup");

const winnerTitle =
    document.getElementById("winner-title");

const winningLine =
    document.getElementById("winning-line");

const confettiContainer =
    document.getElementById("confetti-container");


let board = [
    "", "", "",
    "", "", "",
    "", "", ""
];


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

    const clickedIndex =
        Number(clickedCell.dataset.index);


    // Don't allow clicking an occupied cell
    // or playing after the game has ended

    if (
        board[clickedIndex] !== "" ||
        !gameActive
    ) {
        return;
    }


    // Put player's symbol on the board

    board[clickedIndex] = currentPlayer;

    clickedCell.textContent = currentPlayer;


    checkResult();
}


function checkResult() {

    let winningCombination = null;


    // Check every possible winning combination

    for (let combination of winningCombinations) {

        const a = combination[0];
        const b = combination[1];
        const c = combination[2];


        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            winningCombination = combination;

            break;
        }
    }


    // =========================
    // SOMEONE WON
    // =========================

    if (winningCombination) {

        gameActive = false;


        statusText.textContent =
            `Player ${currentPlayer} wins!`;


        // Draw the winning strike

        drawWinningLine(winningCombination);


        // Show winner popup

        showWinnerPopup();


        // Launch confetti

        createConfetti();


        return;
    }


    // =========================
    // DRAW
    // =========================

    if (!board.includes("")) {

        gameActive = false;

        statusText.textContent =
            "It's a draw!";

        return;
    }


    // =========================
    // NEXT PLAYER
    // =========================

    currentPlayer =
        currentPlayer === "X"
            ? "O"
            : "X";


    statusText.textContent =
        `Player ${currentPlayer}'s turn`;
}


/* ==================================
   DRAW WINNING STRIKE
================================== */

function drawWinningLine(combination) {

    const firstCell =
        cells[combination[0]];

    const lastCell =
        cells[combination[2]];


    const boardRect =
        document
            .getElementById("board")
            .getBoundingClientRect();


    const firstRect =
        firstCell.getBoundingClientRect();


    const lastRect =
        lastCell.getBoundingClientRect();


    // Find the centre of first cell

    const startX =
        firstRect.left +
        firstRect.width / 2 -
        boardRect.left;


    const startY =
        firstRect.top +
        firstRect.height / 2 -
        boardRect.top;


    // Find the centre of last cell

    const endX =
        lastRect.left +
        lastRect.width / 2 -
        boardRect.left;


    const endY =
        lastRect.top +
        lastRect.height / 2 -
        boardRect.top;


    // Calculate line length

    const deltaX = endX - startX;

    const deltaY = endY - startY;


    const length =
        Math.sqrt(
            deltaX * deltaX +
            deltaY * deltaY
        );


    // Calculate angle

    const angle =
        Math.atan2(deltaY, deltaX) *
        180 /
        Math.PI;


    // Position the line

    winningLine.style.left =
        `${startX}px`;

    winningLine.style.top =
        `${startY}px`;

    winningLine.style.width =
        `${length}px`;

    winningLine.style.transform =
        `rotate(${angle}deg)`;


    winningLine.style.display =
        "block";
}


/* ==================================
   WINNER POPUP
================================== */

function showWinnerPopup() {

    winnerTitle.textContent =
        `Player ${currentPlayer} Wins!`;


    winnerPopup.classList.add("show");
}


/* ==================================
   CONFETTI
================================== */

function createConfetti() {

    // Clear old confetti

    confettiContainer.innerHTML = "";


    // Create 120 confetti pieces

    for (let i = 0; i < 120; i++) {

        const piece =
            document.createElement("div");


        piece.classList.add("confetti");


        // Random horizontal position

        piece.style.left =
            `${Math.random() * 100}%`;


        // Random size

        const size =
            Math.random() * 8 + 6;


        piece.style.width =
            `${size}px`;

        piece.style.height =
            `${size * 1.6}px`;


        // Random color

        const colors = [
            "#ff3b30",
            "#ffcc00",
            "#34c759",
            "#007aff",
            "#af52de",
            "#ff9500"
        ];


        piece.style.background =
            colors[
                Math.floor(
                    Math.random() *
                    colors.length
                )
            ];


        // Random animation speed

        piece.style.animationDuration =
            `${Math.random() * 2 + 2}s`;


        // Random delay

        piece.style.animationDelay =
            `${Math.random() * 0.5}s`;


        confettiContainer.appendChild(piece);
    }


    // Remove confetti after animation

    setTimeout(() => {

        confettiContainer.innerHTML = "";

    }, 5000);
}


/* ==================================
   RESTART GAME
================================== */

function restartGame() {

    board = [
        "", "", "",
        "", "", "",
        "", "", ""
    ];


    currentPlayer = "X";


    gameActive = true;


    // Clear all cells

    cells.forEach((cell) => {

        cell.textContent = "";

    });


    // Reset status

    statusText.textContent =
        "Player X's turn";


    // Hide winning line

    winningLine.style.display =
        "none";


    // Hide winner popup

    winnerPopup.classList.remove("show");


    // Clear confetti

    confettiContainer.innerHTML = "";
}


/* ==================================
   RESTART BUTTONS
================================== */

restartButton.addEventListener(
    "click",
    restartGame
);


popupRestartButton.addEventListener(
    "click",
    restartGame
);