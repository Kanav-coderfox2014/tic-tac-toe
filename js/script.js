const cells = document.querySelectorAll(".cell");

const statusText =
    document.getElementById("status");

const restartButton =
    document.getElementById("restart-btn");

const popupRestartButton =
    document.getElementById("popup-restart-btn");

const winnerPopup =
    document.getElementById("winner-popup");

const winnerTitle =
    document.getElementById("winner-title");

const winnerMessage =
    document.getElementById("winner-message");

const winningLine =
    document.getElementById("winning-line");

const confettiContainer =
    document.getElementById("confetti-container");


/* =========================
   GAME VARIABLES
========================= */

let board = [
    "", "", "",
    "", "", "",
    "", "", ""
];


let currentPlayer = "X";

let gameActive = true;


/*
    X = YOU
    O = COMPUTER
*/


const winningCombinations = [

    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    // Columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    // Diagonals
    [0, 4, 8],
    [2, 4, 6]

];


/* =========================
   PLAYER CLICK
========================= */

cells.forEach((cell) => {

    cell.addEventListener(
        "click",
        handlePlayerMove
    );

});


function handlePlayerMove(event) {

    const clickedIndex =
        Number(event.target.dataset.index);


    /*
        Don't allow:
        - Clicking occupied squares
        - Playing after game ends
        - Clicking while computer is playing
    */

    if (
        board[clickedIndex] !== "" ||
        !gameActive ||
        currentPlayer !== "X"
    ) {

        return;
    }


    // Player makes move

    makeMove(
        clickedIndex,
        "X"
    );


    // Check result

    if (checkResult()) {

        return;
    }


    // Computer's turn

    currentPlayer = "O";

    statusText.textContent =
        "Computer is thinking...";


    /*
        Small delay makes the computer
        feel more natural.
    */

    setTimeout(
        computerMove,
        500
    );
}


/* =========================
   MAKE MOVE
========================= */

function makeMove(index, player) {

    board[index] = player;

    cells[index].textContent = player;

}


/* =========================
   COMPUTER MOVE
========================= */

function computerMove() {

    if (!gameActive) {

        return;
    }


    const move =
        getComputerMove();


    makeMove(
        move,
        "O"
    );


    // Check if computer won

    if (checkResult()) {

        return;
    }


    // Give turn back to player

    currentPlayer = "X";

    statusText.textContent =
        "Your turn (X)";
}


/* =========================
   COMPUTER AI
========================= */

/*
    The computer is intentionally
    NOT perfect.

    Around 55% of the time it makes
    a sensible move.

    Around 45% of the time it chooses
    a random empty square.

    This makes it beatable.
*/

function getComputerMove() {

    const emptyCells =
        getEmptyCells();


    /*
        45% chance:
        Make a completely random move.
    */

    if (Math.random() < 0.45) {

        return randomChoice(
            emptyCells
        );
    }


    /*
        55% chance:
        Make a smarter move.
    */


    // First, see if computer can win

    const winningMove =
        findWinningMove("O");


    if (
        winningMove !== null &&
        Math.random() < 0.75
    ) {

        return winningMove;
    }


    // Sometimes block the player

    const blockingMove =
        findWinningMove("X");


    if (
        blockingMove !== null &&
        Math.random() < 0.70
    ) {

        return blockingMove;
    }


    /*
        Sometimes take the center.
    */

    if (
        board[4] === "" &&
        Math.random() < 0.60
    ) {

        return 4;
    }


    /*
        Sometimes choose a corner.
    */

    const corners = [
        0,
        2,
        6,
        8
    ];


    const availableCorners =
        corners.filter(
            index => board[index] === ""
        );


    if (
        availableCorners.length > 0 &&
        Math.random() < 0.60
    ) {

        return randomChoice(
            availableCorners
        );
    }


    /*
        Otherwise choose any empty square.
    */

    return randomChoice(
        emptyCells
    );
}


/* =========================
   FIND WINNING MOVE
========================= */

function findWinningMove(player) {

    for (
        let i = 0;
        i < board.length;
        i++
    ) {

        if (board[i] !== "") {

            continue;
        }


        // Temporarily place the symbol

        board[i] = player;


        const winner =
            getWinner();


        // Undo temporary move

        board[i] = "";


        if (winner === player) {

            return i;
        }
    }


    return null;
}


/* =========================
   GET EMPTY CELLS
========================= */

function getEmptyCells() {

    const emptyCells = [];


    for (
        let i = 0;
        i < board.length;
        i++
    ) {

        if (board[i] === "") {

            emptyCells.push(i);
        }
    }


    return emptyCells;
}


/* =========================
   RANDOM CHOICE
========================= */

function randomChoice(array) {

    return array[
        Math.floor(
            Math.random() * array.length
        )
    ];
}


/* =========================
   GET WINNER
========================= */

function getWinner() {

    for (
        let combination of winningCombinations
    ) {

        const a = combination[0];

        const b = combination[1];

        const c = combination[2];


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
   CHECK RESULT
========================= */

function checkResult() {

    let winningCombination = null;


    for (
        let combination of winningCombinations
    ) {

        const a = combination[0];

        const b = combination[1];

        const c = combination[2];


        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            winningCombination =
                combination;

            break;
        }
    }


    /* =====================
       WIN
    ===================== */

    if (winningCombination) {

        gameActive = false;


        if (currentPlayer === "X") {

            statusText.textContent =
                "You win! 🎉";

            winnerTitle.textContent =
                "You Win!";

            winnerMessage.textContent =
                "Amazing! You beat the computer!";

            createConfetti();

        }

        else {

            statusText.textContent =
                "Computer wins!";

            winnerTitle.textContent =
                "Computer Wins!";

            winnerMessage.textContent =
                "The computer got you this time!";

        }


        // Draw correct winning line

        drawWinningLine(
            winningCombination
        );


        // Show popup

        showWinnerPopup();


        return true;
    }


    /* =====================
       DRAW
    ===================== */

    if (!board.includes("")) {

        gameActive = false;


        statusText.textContent =
            "It's a draw!";


        winnerTitle.textContent =
            "It's a Draw!";


        winnerMessage.textContent =
            "Nobody wins this round!";


        winnerPopup.classList.add(
            "show"
        );


        return true;
    }


    return false;
}


/* =========================
   DRAW WINNING LINE
========================= */

function drawWinningLine(
    combination
) {

    const boardElement =
        document.getElementById("board");


    const firstCell =
        cells[combination[0]];


    const lastCell =
        cells[combination[2]];


    /*
        Get the positions of the board
        and the winning cells.
    */

    const boardRect =
        boardElement.getBoundingClientRect();


    const firstRect =
        firstCell.getBoundingClientRect();


    const lastRect =
        lastCell.getBoundingClientRect();


    /*
        Find the CENTER of the first cell.
    */

    const startX =
        firstRect.left +
        firstRect.width / 2 -
        boardRect.left;


    const startY =
        firstRect.top +
        firstRect.height / 2 -
        boardRect.top;


    /*
        Find the CENTER of the last cell.
    */

    const endX =
        lastRect.left +
        lastRect.width / 2 -
        boardRect.left;


    const endY =
        lastRect.top +
        lastRect.height / 2 -
        boardRect.top;


    /*
        Calculate distance between
        the two points.
    */

    const deltaX =
        endX - startX;


    const deltaY =
        endY - startY;


    const length =
        Math.sqrt(
            deltaX * deltaX +
            deltaY * deltaY
        );


    /*
        Calculate the angle.

        This is what makes the line
        horizontal, vertical, or diagonal.
    */

    const angle =
        Math.atan2(
            deltaY,
            deltaX
        ) *
        180 /
        Math.PI;


    /*
        Position the line.
    */

    winningLine.style.left =
        `${startX}px`;


    winningLine.style.top =
        `${startY}px`;


    winningLine.style.width =
        `${length}px`;


    /*
        Rotate the line to the
        correct winning direction.
    */

    winningLine.style.transform =
        `rotate(${angle}deg)`;


    winningLine.style.display =
        "block";
}


/* =========================
   WINNER POPUP
========================= */

function showWinnerPopup() {

    winnerPopup.classList.add(
        "show"
    );
}


/* =========================
   CONFETTI
========================= */

function createConfetti() {

    confettiContainer.innerHTML =
        "";


    for (
        let i = 0;
        i < 120;
        i++
    ) {

        const piece =
            document.createElement(
                "div"
            );


        piece.classList.add(
            "confetti"
        );


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


        // Random speed

        piece.style.animationDuration =
            `${Math.random() * 2 + 2}s`;


        // Random delay

        piece.style.animationDelay =
            `${Math.random() * 0.5}s`;


        confettiContainer.appendChild(
            piece
        );
    }


    // Remove confetti after 5 seconds

    setTimeout(() => {

        confettiContainer.innerHTML =
            "";

    }, 5000);
}


/* =========================
   RESTART GAME
========================= */

function restartGame() {

    board = [

        "", "", "",
        "", "", "",
        "", "", ""

    ];


    currentPlayer = "X";

    gameActive = true;


    // Clear board

    cells.forEach((cell) => {

        cell.textContent = "";

    });


    // Reset status

    statusText.textContent =
        "Your turn (X)";


    // Hide winning line

    winningLine.style.display =
        "none";


    winningLine.style.transform =
        "none";


    // Hide popup

    winnerPopup.classList.remove(
        "show"
    );


    // Clear confetti

    confettiContainer.innerHTML =
        "";
}


/* =========================
   BUTTON EVENTS
========================= */

restartButton.addEventListener(
    "click",
    restartGame
);


popupRestartButton.addEventListener(
    "click",
    restartGame
);