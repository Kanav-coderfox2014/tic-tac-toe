
/* =====================================================
   TIC-TAC-TOE — COMPLETE JAVASCRIPT
   Features:
   - 1 Player and 2 Players
   - Easy, Medium, and Hard difficulties
   - Almost unbeatable Hard AI using Minimax
   - Scoreboard for 1 Player mode only
   - Winner popup and confetti
   - Correct winning line for rows, columns, diagonals
   - Restart game and play again
===================================================== */


/* =========================
   ELEMENTS
========================= */

const cells = document.querySelectorAll(".cell");

const statusText = document.getElementById("status");
const restartButton = document.getElementById("restart-btn");
const popupRestartButton = document.getElementById("popup-restart-btn");

const winnerPopup = document.getElementById("winner-popup");
const winnerTitle = document.getElementById("winner-title");
const winnerMessage = document.getElementById("winner-message");

const winningLine = document.getElementById("winning-line");
const confettiContainer = document.getElementById("confetti-container");

const onePlayerButton = document.getElementById("one-player-btn");
const twoPlayerButton = document.getElementById("two-player-btn");

const easyButton = document.getElementById("easy-btn");
const mediumButton = document.getElementById("medium-btn");
const hardButton = document.getElementById("hard-btn");

const difficultySection = document.getElementById("difficulty-section");

const scoreboard = document.getElementById("scoreboard");
const winsText = document.getElementById("wins");
const lossesText = document.getElementById("losses");
const drawsText = document.getElementById("draws");


/* =========================
   GAME VARIABLES
========================= */

let board = Array(9).fill("");

let currentPlayer = "X";
let gameActive = true;

let gameMode = "one-player";
let difficulty = "easy";

let wins = 0;
let losses = 0;
let draws = 0;

let computerMoveTimeout = null;


/* =========================
   WINNING COMBINATIONS
========================= */

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


/* =========================
   CELL CLICK EVENTS
========================= */

cells.forEach((cell) => {
    cell.addEventListener("click", handleCellClick);
});


/* =========================
   HANDLE CELL CLICK
========================= */

function handleCellClick(event) {
    const clickedIndex = Number(event.currentTarget.dataset.index);

    if (!gameActive || board[clickedIndex] !== "") {
        return;
    }

    // In one-player mode, the human can only play X.
    if (gameMode === "one-player" && currentPlayer !== "X") {
        return;
    }

    makeMove(clickedIndex, currentPlayer);

    if (checkResult()) {
        return;
    }

    if (gameMode === "one-player") {
        currentPlayer = "O";
        gameActive = true;

        statusText.textContent = "Computer is thinking...";

        computerMoveTimeout = setTimeout(() => {
            computerMoveTimeout = null;
            computerMove();
        }, 350);

        return;
    }

    // Two-player mode: alternate between X and O.
    currentPlayer = currentPlayer === "X" ? "O" : "X";

    statusText.textContent = `Player ${currentPlayer}'s turn`;
}


/* =========================
   MAKE A MOVE
========================= */

function makeMove(index, player) {
    board[index] = player;

    cells[index].textContent = player;

    cells[index].style.color =
        player === "X" ? "#2563eb" : "#e11d48";

    cells[index].disabled = true;
}


/* =========================
   COMPUTER MOVE
========================= */

function computerMove() {
    if (!gameActive || gameMode !== "one-player") {
        return;
    }

    const emptyCells = getEmptyCells();

    if (emptyCells.length === 0) {
        checkResult();
        return;
    }

    const move = getComputerMove();

    if (move === undefined || move === null) {
        return;
    }

    makeMove(move, "O");

    if (checkResult()) {
        return;
    }

    currentPlayer = "X";
    statusText.textContent = "Your turn (X)";
}


/* =========================
   COMPUTER DIFFICULTY
========================= */

function getComputerMove() {
    const emptyCells = getEmptyCells();

    if (emptyCells.length === 0) {
        return null;
    }

    // HARD: optimal play using Minimax.
    if (difficulty === "hard") {
        return getBestHardMove();
    }

    // EASY: frequently makes random moves.
    if (difficulty === "easy") {
        if (Math.random() < 0.55) {
            return randomChoice(emptyCells);
        }

        return getSmartMove(0.45);
    }

    // MEDIUM: usually smart, but sometimes makes mistakes.
    if (Math.random() < 0.10) {
        return randomChoice(emptyCells);
    }

    return getSmartMove(0.90);
}


/* =========================
   HARD MODE: MINIMAX AI
========================= */

function getBestHardMove() {
    let bestScore = -Infinity;
    let bestMoves = [];

    for (const index of getEmptyCells()) {
        board[index] = "O";

        const score = minimax(board, 0, false);

        board[index] = "";

        if (score > bestScore) {
            bestScore = score;
            bestMoves = [index];
        } else if (score === bestScore) {
            bestMoves.push(index);
        }
    }

    // If multiple moves are equally good, choose randomly.
    return randomChoice(bestMoves);
}


/* =========================
   MINIMAX SEARCH
========================= */

function minimax(position, depth, isMaximizing) {
    const winner = getWinner();

    // Prefer faster computer wins.
    if (winner === "O") {
        return 10 - depth;
    }

    // Prefer delaying a loss.
    if (winner === "X") {
        return depth - 10;
    }

    if (!position.includes("")) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;

        for (const index of getEmptyCells()) {
            position[index] = "O";

            const score = minimax(position, depth + 1, false);

            position[index] = "";

            bestScore = Math.max(bestScore, score);
        }

        return bestScore;
    }

    let bestScore = Infinity;

    for (const index of getEmptyCells()) {
        position[index] = "X";

        const score = minimax(position, depth + 1, true);

        position[index] = "";

        bestScore = Math.min(bestScore, score);
    }

    return bestScore;
}


/* =========================
   EASY / MEDIUM SMART MOVES
========================= */

function getSmartMove(smartness) {
    const emptyCells = getEmptyCells();

    if (emptyCells.length === 0) {
        return null;
    }

    // Try to win.
    const winningMove = findWinningMove("O");

    if (winningMove !== null && Math.random() < smartness) {
        return winningMove;
    }

    // Try to block the human.
    const blockingMove = findWinningMove("X");

    if (blockingMove !== null && Math.random() < smartness) {
        return blockingMove;
    }

    // Try the centre.
    if (board[4] === "" && Math.random() < smartness) {
        return 4;
    }

    // Try an available corner.
    const corners = [0, 2, 6, 8];

    const availableCorners = corners.filter(
        (index) => board[index] === ""
    );

    if (
        availableCorners.length > 0 &&
        Math.random() < smartness
    ) {
        return randomChoice(availableCorners);
    }

    return randomChoice(emptyCells);
}


/* =========================
   FIND A WINNING MOVE
========================= */

function findWinningMove(player) {
    for (let index = 0; index < board.length; index++) {
        if (board[index] !== "") {
            continue;
        }

        board[index] = player;

        const winner = getWinner();

        board[index] = "";

        if (winner === player) {
            return index;
        }
    }

    return null;
}


/* =========================
   GET EMPTY CELLS
========================= */

function getEmptyCells() {
    const emptyCells = [];

    for (let index = 0; index < board.length; index++) {
        if (board[index] === "") {
            emptyCells.push(index);
        }
    }

    return emptyCells;
}


/* =========================
   RANDOM CHOICE
========================= */

function randomChoice(array) {
    if (!array || array.length === 0) {
        return null;
    }

    return array[Math.floor(Math.random() * array.length)];
}


/* =========================
   GET WINNER
========================= */

function getWinner() {
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {
            return board[a];
        }
    }

    return null;
}


/* =========================
   CHECK GAME RESULT
========================= */

function checkResult() {
    let winningCombination = null;

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {
            winningCombination = combination;
            break;
        }
    }

    // Someone has won.
    if (winningCombination) {
        gameActive = false;

        if (computerMoveTimeout !== null) {
            clearTimeout(computerMoveTimeout);
            computerMoveTimeout = null;
        }

        const winner = board[winningCombination[0]];

        if (gameMode === "one-player") {
            if (winner === "X") {
                wins++;
                updateScore();

                statusText.textContent = "You win! 🎉";
                winnerTitle.textContent = "You Win!";
                winnerMessage.textContent =
                    "Amazing! You beat the computer!";

                createConfetti();
            } else {
                losses++;
                updateScore();

                statusText.textContent = "Computer wins!";
                winnerTitle.textContent = "Computer Wins!";
                winnerMessage.textContent =
                    "The computer got you this time!";
            }
        } else {
            statusText.textContent = `Player ${winner} wins! 🎉`;
            winnerTitle.textContent = `Player ${winner} Wins!`;
            winnerMessage.textContent =
                `Congratulations, Player ${winner}!`;

            createConfetti();
        }

        drawWinningLine(winningCombination);
        showWinnerPopup();

        return true;
    }

    // Draw.
    if (!board.includes("")) {
        gameActive = false;

        if (gameMode === "one-player") {
            draws++;
            updateScore();
        }

        statusText.textContent = "It's a draw!";
        winnerTitle.textContent = "It's a Draw!";
        winnerMessage.textContent = "Nobody wins this round!";

        showWinnerPopup();

        return true;
    }

    return false;
}


/* =========================
   UPDATE SCOREBOARD
========================= */

function updateScore() {
    winsText.textContent = wins;
    lossesText.textContent = losses;
    drawsText.textContent = draws;
}


/* =========================
   DRAW WINNING LINE
========================= */

function drawWinningLine(combination) {
    const boardElement = document.getElementById("board");

    const firstCell = cells[combination[0]];
    const lastCell = cells[combination[2]];

    const boardRect = boardElement.getBoundingClientRect();
    const firstRect = firstCell.getBoundingClientRect();
    const lastRect = lastCell.getBoundingClientRect();

    const startX =
        firstRect.left + firstRect.width / 2 - boardRect.left;

    const startY =
        firstRect.top + firstRect.height / 2 - boardRect.top;

    const endX =
        lastRect.left + lastRect.width / 2 - boardRect.left;

    const endY =
        lastRect.top + lastRect.height / 2 - boardRect.top;

    const deltaX = endX - startX;
    const deltaY = endY - startY;

    const length = Math.sqrt(
        deltaX * deltaX + deltaY * deltaY
    );

    const angle =
        Math.atan2(deltaY, deltaX) * 180 / Math.PI;

    winningLine.style.left = `${startX}px`;
    winningLine.style.top = `${startY}px`;
    winningLine.style.width = `${length}px`;
    winningLine.style.transform = `rotate(${angle}deg)`;
    winningLine.style.display = "block";
}


/* =========================
   WINNER POPUP
========================= */

function showWinnerPopup() {
    winnerPopup.classList.add("show");
}


/* =========================
   CONFETTI
========================= */

function createConfetti() {
    confettiContainer.innerHTML = "";

    const colors = [
        "#ff3b30",
        "#ffcc00",
        "#34c759",
        "#007aff",
        "#af52de",
        "#ff9500"
    ];

    for (let i = 0; i < 120; i++) {
        const piece = document.createElement("div");

        piece.classList.add("confetti");

        piece.style.left = `${Math.random() * 100}%`;

        const size = Math.random() * 8 + 6;

        piece.style.width = `${size}px`;
        piece.style.height = `${size * 1.6}px`;

        piece.style.background =
            randomChoice(colors);

        piece.style.animationDuration =
            `${Math.random() * 2 + 2}s`;

        piece.style.animationDelay =
            `${Math.random() * 0.5}s`;

        confettiContainer.appendChild(piece);
    }

    setTimeout(() => {
        confettiContainer.innerHTML = "";
    }, 5000);
}


/* =========================
   CHANGE GAME MODE
========================= */

function changeGameMode(newMode) {
    gameMode = newMode;

    document.body.classList.remove(
        "one-player",
        "two-player-theme",
        "easy-theme",
        "medium-theme",
        "hard-theme"
    );

    if (newMode === "one-player") {
        document.body.classList.add("one-player");
        document.body.classList.add(`${difficulty}-theme`);

        scoreboard.style.display = "block";
        difficultySection.style.display = "block";

        onePlayerButton.classList.add("active");
        twoPlayerButton.classList.remove("active");

        statusText.textContent = "Your turn (X)";
    } else {
        document.body.classList.add("two-player-theme");

        scoreboard.style.display = "none";
        difficultySection.style.display = "none";

        twoPlayerButton.classList.add("active");
        onePlayerButton.classList.remove("active");

        statusText.textContent = "Player X's turn";
    }

    restartGame();
}


/* =========================
   CHANGE DIFFICULTY
========================= */

function changeDifficulty(newDifficulty) {
    difficulty = newDifficulty;

    if (gameMode !== "one-player") {
        return;
    }

    document.body.classList.remove(
        "easy-theme",
        "medium-theme",
        "hard-theme"
    );

    document.body.classList.add(`${newDifficulty}-theme`);

    easyButton.classList.remove("active");
    mediumButton.classList.remove("active");
    hardButton.classList.remove("active");

    if (newDifficulty === "easy") {
        easyButton.classList.add("active");
    } else if (newDifficulty === "medium") {
        mediumButton.classList.add("active");
    } else if (newDifficulty === "hard") {
        hardButton.classList.add("active");
    }

    restartGame();
}


/* =========================
   MODE BUTTON EVENTS
========================= */

onePlayerButton.addEventListener("click", () => {
    changeGameMode("one-player");
});

twoPlayerButton.addEventListener("click", () => {
    changeGameMode("two-player");
});


/* =========================
   DIFFICULTY BUTTON EVENTS
========================= */

easyButton.addEventListener("click", () => {
    changeDifficulty("easy");
});

mediumButton.addEventListener("click", () => {
    changeDifficulty("medium");
});

hardButton.addEventListener("click", () => {
    changeDifficulty("hard");
});


/* =========================
   RESTART GAME
========================= */

function restartGame() {
    if (computerMoveTimeout !== null) {
        clearTimeout(computerMoveTimeout);
        computerMoveTimeout = null;
    }

    board = Array(9).fill("");

    currentPlayer = "X";
    gameActive = true;

    cells.forEach((cell) => {
        cell.textContent = "";
        cell.disabled = false;
        cell.style.color = "";
    });

    if (gameMode === "one-player") {
        statusText.textContent = "Your turn (X)";
    } else {
        statusText.textContent = "Player X's turn";
    }

    winningLine.style.display = "none";
    winningLine.style.transform = "none";
    winningLine.style.width = "0";

    winnerPopup.classList.remove("show");
    confettiContainer.innerHTML = "";
}


/* =========================
   RESTART BUTTON EVENTS
========================= */

restartButton.addEventListener("click", restartGame);

popupRestartButton.addEventListener("click", restartGame);


/* =========================
   INITIAL SETUP
========================= */

updateScore();

scoreboard.style.display = "block";
difficultySection.style.display = "block";

onePlayerButton.classList.add("active");
twoPlayerButton.classList.remove("active");

easyButton.classList.add("active");
mediumButton.classList.remove("active");
hardButton.classList.remove("active");

document.body.classList.add("one-player", "easy-theme");