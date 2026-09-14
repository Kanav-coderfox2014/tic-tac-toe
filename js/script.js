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

// X = YOU
// O = COMPUTER


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


// ==========================================
// PLAYER CLICK
// ==========================================

cells.forEach((cell) => {

    cell.addEventListener("click", handlePlayerMove);

});


function handlePlayerMove(event) {

    const clickedCell = event.target;

    const clickedIndex =
        Number(clickedCell.dataset.index);


    // Don't allow moves if:
    // 1. The cell is already occupied
    // 2. The game is over
    // 3. It is currently the computer's turn

    if (
        board[clickedIndex] !== "" ||
        !gameActive ||
        currentPlayer !== "X"
    ) {
        return;
    }


    // Player makes their move

    makeMove(clickedIndex, "X");


    // Check if player won

    const result = checkResult();

    if (result) {
        return;
    }


    // Switch to computer

    currentPlayer = "O";

    statusText.textContent =
        "Computer is thinking...";


    // Small delay so the computer doesn't
    // instantly appear after your move

    setTimeout(computerMove, 500);
}


// ==========================================
// MAKE A MOVE
// ==========================================

function makeMove(index, player) {

    board[index] = player;

    cells[index].textContent = player;
}


// ==========================================
// COMPUTER MOVE
// ==========================================

function computerMove() {

    if (!gameActive) {
        return;
    }


    // Find the best possible move

    const bestMove = getBestMove();


    makeMove(bestMove, "O");


    // Check if computer won

    const result = checkResult();

    if (result) {
        return;
    }


    // Back to player

    currentPlayer = "X";

    statusText.textContent =
        "Your turn (X)";
}


// ==========================================
// SMART COMPUTER
// ==========================================

function getBestMove() {

    let bestScore = -Infinity;

    let move;


    for (let i = 0; i < board.length; i++) {

        if (board[i] === "") {

            board[i] = "O";


            let score =
                minimax(board, 0, false);


            board[i] = "";


            if (score > bestScore) {

                bestScore = score;

                move = i;
            }
        }
    }


    return move;
}


// ==========================================
// MINIMAX AI
// ==========================================

function minimax(boardState, depth, isMaximizing) {

    const result =
        getWinner(boardState);


    // Computer wins

    if (result === "O") {
        return 10 - depth;
    }


    // Player wins

    if (result === "X") {
        return depth - 10;
    }


    // Draw

    if (!boardState.includes("")) {
        return 0;
    }


    // COMPUTER'S TURN

    if (isMaximizing) {

        let bestScore = -Infinity;


        for (let i = 0; i < boardState.length; i++) {

            if (boardState[i] === "") {

                boardState[i] = "O";


                let score =
                    minimax(
                        boardState,
                        depth + 1,
                        false
                    );


                boardState[i] = "";


                bestScore =
                    Math.max(
                        score,
                        bestScore
                    );
            }
        }


        return bestScore;
    }


    // PLAYER'S TURN

    else {

        let bestScore = Infinity;


        for (let i = 0; i < boardState.length; i++) {

            if (boardState[i] === "") {

                boardState[i] = "X";


                let score =
                    minimax(
                        boardState,
                        depth + 1,
                        true
                    );


                boardState[i] = "";


                bestScore =
                    Math.min(
                        score,
                        bestScore
                    );
            }
        }


        return bestScore;
    }
}


// ==========================================
// CHECK WINNER
// ==========================================

function getWinner(boardState) {

    for (let combination of winningCombinations) {

        const a = combination[0];

        const b = combination[1];

        const c = combination[2];


        if (
            boardState[a] !== "" &&
            boardState[a] === boardState[b] &&
            boardState[a] === boardState[c]
        ) {

            return boardState[a];
        }
    }


    return null;
}


// ==========================================
// CHECK GAME RESULT
// ==========================================

function checkResult() {

    let winningCombination = null;


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


    // ======================================
    // WIN
    // ======================================

    if (winningCombination) {

        gameActive = false;


        statusText.textContent =
            `${currentPlayer === "X"
                ? "You win!"
                : "Computer wins!"
            }`;


        // Draw winning strike

        drawWinningLine(
            winningCombination
        );


        // Show popup

        showWinnerPopup();


        // Confetti only when YOU win

        if (currentPlayer === "X") {

            createConfetti();

        }


        return true;
    }


    // ======================================
    // DRAW
    // ======================================

    if (!board.includes("")) {

        gameActive = false;


        statusText.textContent =
            "It's a draw!";


        winnerTitle.textContent =
            "It's a Draw!";


        winnerPopup.classList.add("show");


        return true;
    }


    return false;
}


// ==========================================
// WINNING LINE
// ==========================================

function drawWinningLine(combination) {

    const firstCell =
        cells[combination[0]];

    const lastCell =
        cells[combination[2]];


    const boardElement =
        document.getElementById("board");


    const boardRect =
        boardElement.getBoundingClientRect();


    const firstRect =
        firstCell.getBoundingClientRect();


    const lastRect =
        lastCell.getBoundingClientRect();


    const startX =
        firstRect.left +
        firstRect.width / 2 -
        boardRect.left;


    const startY =
        firstRect.top +
        firstRect.height / 2 -
        boardRect.top;


    const endX =
        lastRect.left +
        lastRect.width / 2 -
        boardRect.left;


    const endY =
        lastRect.top +
        lastRect.height / 2 -
        boardRect.top;


    const deltaX =
        endX - startX;


    const deltaY =
        endY - startY;


    const length =
        Math.sqrt(
            deltaX * deltaX +
            deltaY * deltaY
        );


    const angle =
        Math.atan2(
            deltaY,
            deltaX
        ) * 180 / Math.PI;


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


// ==========================================
// WINNER POPUP
// ==========================================

function showWinnerPopup() {

    if (currentPlayer === "X") {

        winnerTitle.textContent =
            "You Win!";

    } else {

        winnerTitle.textContent =
            "Computer Wins!";

    }


    winnerPopup.classList.add("show");
}


// ==========================================
// CONFETTI
// ==========================================

function createConfetti() {

    confettiContainer.innerHTML = "";


    for (let i = 0; i < 120; i++) {

        const piece =
            document.createElement("div");


        piece.classList.add("confetti");


        piece.style.left =
            `${Math.random() * 100}%`;


        const size =
            Math.random() * 8 + 6;


        piece.style.width =
            `${size}px`;


        piece.style.height =
            `${size * 1.6}px`;


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


// ==========================================
// RESTART GAME
// ==========================================

function restartGame() {

    board = [
        "", "", "",
        "", "", "",
        "", "", ""
    ];


    currentPlayer = "X";

    gameActive = true;


    cells.forEach((cell) => {

        cell.textContent = "";

    });


    statusText.textContent =
        "Your turn (X)";


    winningLine.style.display =
        "none";


    winnerPopup.classList.remove(
        "show"
    );


    confettiContainer.innerHTML = "";
}


// ==========================================
// RESTART BUTTONS
// ==========================================

restartButton.addEventListener(
    "click",
    restartGame
);


popupRestartButton.addEventListener(
    "click",
    restartGame
);