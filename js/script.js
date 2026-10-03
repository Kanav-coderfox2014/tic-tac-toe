/* =========================
   ELEMENTS
========================= */

const cells =
    document.querySelectorAll(".cell");


const statusText =
    document.getElementById("status");


const restartButton =
    document.getElementById("restart-btn");


const popupRestartButton =
    document.getElementById(
        "popup-restart-btn"
    );


const winnerPopup =
    document.getElementById(
        "winner-popup"
    );


const winnerTitle =
    document.getElementById(
        "winner-title"
    );


const winnerMessage =
    document.getElementById(
        "winner-message"
    );


const winningLine =
    document.getElementById(
        "winning-line"
    );


const confettiContainer =
    document.getElementById(
        "confetti-container"
    );


const onePlayerButton =
    document.getElementById(
        "one-player-btn"
    );


const twoPlayerButton =
    document.getElementById(
        "two-player-btn"
    );


const easyButton =
    document.getElementById(
        "easy-btn"
    );


const mediumButton =
    document.getElementById(
        "medium-btn"
    );


const hardButton =
    document.getElementById(
        "hard-btn"
    );


const difficultySection =
    document.getElementById(
        "difficulty-section"
    );


/* SCORE ELEMENTS */

const winsText =
    document.getElementById(
        "wins"
    );


const lossesText =
    document.getElementById(
        "losses"
    );


const drawsText =
    document.getElementById(
        "draws"
    );


/* =========================
   GAME VARIABLES
========================= */

let board = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
];


let currentPlayer =
    "X";


let gameActive =
    true;


let gameMode =
    "one-player";


let difficulty =
    "easy";


/* =========================
   SCORE
========================= */

let wins = 0;

let losses = 0;

let draws = 0;


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
   CELL EVENTS
========================= */

cells.forEach(
    (cell) => {

        cell.addEventListener(
            "click",
            handleCellClick
        );

    }
);


/* =========================
   CELL CLICK
========================= */

function handleCellClick(event) {

    const clickedIndex =
        Number(
            event.target.dataset.index
        );


    if (
        board[clickedIndex] !== "" ||
        !gameActive
    ) {

        return;

    }


    /* COMPUTER CANNOT BE CLICKED */

    if (
        gameMode === "one-player" &&
        currentPlayer === "O"
    ) {

        return;

    }


    /* MAKE MOVE */

    makeMove(
        clickedIndex,
        currentPlayer
    );


    /* CHECK RESULT */

    if (
        checkResult()
    ) {

        return;

    }


    /* ONE PLAYER */

    if (
        gameMode === "one-player"
    ) {

        currentPlayer =
            "O";


        statusText.textContent =
            "Computer is thinking...";


        setTimeout(
            computerMove,
            500
        );


        return;

    }


    /* TWO PLAYERS */

    currentPlayer =
        currentPlayer === "X"
            ? "O"
            : "X";


    statusText.textContent =
        `Player ${currentPlayer}'s turn`;

}


/* =========================
   MAKE MOVE
========================= */

function makeMove(
    index,
    player
) {

    board[index] =
        player;


    cells[index].textContent =
        player;

}


/* =========================
   COMPUTER MOVE
========================= */

function computerMove() {

    if (
        !gameActive
    ) {

        return;

    }


    const move =
        getComputerMove();


    makeMove(
        move,
        "O"
    );


    if (
        checkResult()
    ) {

        return;

    }


    currentPlayer =
        "X";


    statusText.textContent =
        "Your turn (X)";

}


/* =========================
   COMPUTER DIFFICULTY
========================= */

function getComputerMove() {

    const emptyCells =
        getEmptyCells();


    /* EASY */

    if (
        difficulty === "easy"
    ) {

        if (
            Math.random() < 0.55
        ) {

            return randomChoice(
                emptyCells
            );

        }


        return getSmartMove(
            0.45
        );

    }


    /* MEDIUM */

    if (
        difficulty === "medium"
    ) {

        if (
            Math.random() < 0.10
        ) {

            return randomChoice(
                emptyCells
            );

        }


        return getSmartMove(
            0.90
        );

    }


    /* HARD */

    if (
        difficulty === "hard"
    ) {

        /*
        Hard is still the strongest
        difficulty, but it has a
        7% chance of making a
        random move.
        */

        if (
            Math.random() < 0.07
        ) {

            return randomChoice(
                emptyCells
            );

        }


        return getSmartMove(
            0.93
        );

    }


    return randomChoice(
        emptyCells
    );

}


/* =========================
   SMART MOVE
========================= */

function getSmartMove(
    smartness
) {

    const emptyCells =
        getEmptyCells();


    /* WIN */

    const winningMove =
        findWinningMove("O");


    if (
        winningMove !== null &&
        Math.random() < smartness
    ) {

        return winningMove;

    }


    /* BLOCK */

    const blockingMove =
        findWinningMove("X");


    if (
        blockingMove !== null &&
        Math.random() < smartness
    ) {

        return blockingMove;

    }


    /* CENTER */

    if (
        board[4] === "" &&
        Math.random() < smartness
    ) {

        return 4;

    }


    /* CORNERS */

    const corners = [
        0,
        2,
        6,
        8
    ];


    const availableCorners =
        corners.filter(
            index =>
                board[index] === ""
        );


    if (
        availableCorners.length > 0 &&
        Math.random() < smartness
    ) {

        return randomChoice(
            availableCorners
        );

    }


    return randomChoice(
        emptyCells
    );

}


/* =========================
   FIND WINNING MOVE
========================= */

function findWinningMove(
    player
) {

    for (
        let i = 0;
        i < board.length;
        i++
    ) {

        if (
            board[i] !== ""
        ) {

            continue;

        }


        board[i] =
            player;


        const winner =
            getWinner();


        board[i] =
            "";


        if (
            winner === player
        ) {

            return i;

        }

    }


    return null;

}


/* =========================
   EMPTY CELLS
========================= */

function getEmptyCells() {

    const emptyCells = [];


    for (
        let i = 0;
        i < board.length;
        i++
    ) {

        if (
            board[i] === ""
        ) {

            emptyCells.push(i);

        }

    }


    return emptyCells;

}


/* =========================
   RANDOM CHOICE
========================= */

function randomChoice(
    array
) {

    return array[
        Math.floor(
            Math.random() *
            array.length
        )
    ];

}


/* =========================
   GET WINNER
========================= */

function getWinner() {

    for (
        let combination
        of winningCombinations
    ) {

        const a =
            combination[0];


        const b =
            combination[1];


        const c =
            combination[2];


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

    let winningCombination =
        null;


    for (
        let combination
        of winningCombinations
    ) {

        const a =
            combination[0];


        const b =
            combination[1];


        const c =
            combination[2];


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


    /* =========================
       WINNER
    ========================= */

    if (
        winningCombination
    ) {

        gameActive =
            false;


        /* ONE PLAYER */

        if (
            gameMode === "one-player"
        ) {

            if (
                currentPlayer === "X"
            ) {

                /* PLAYER WON */

                wins++;

                updateScore();


                statusText.textContent =
                    "You win! 🎉";


                winnerTitle.textContent =
                    "You Win!";


                winnerMessage.textContent =
                    "Amazing! You beat the computer!";


                createConfetti();

            } else {

                /* COMPUTER WON */

                losses++;

                updateScore();


                statusText.textContent =
                    "Computer wins!";


                winnerTitle.textContent =
                    "Computer Wins!";


                winnerMessage.textContent =
                    "The computer got you this time!";

            }

        }


        /* TWO PLAYERS */

        else {

            /*
            In 2-player mode:
            X is considered the player
            whose score is displayed.
            */

            if (
                currentPlayer === "X"
            ) {

                wins++;

                updateScore();

            } else {

                losses++;

                updateScore();

            }


            statusText.textContent =
                `Player ${currentPlayer} wins! 🎉`;


            winnerTitle.textContent =
                `Player ${currentPlayer} Wins!`;


            winnerMessage.textContent =
                `Congratulations Player ${currentPlayer}!`;


            createConfetti();

        }


        drawWinningLine(
            winningCombination
        );


        showWinnerPopup();


        return true;

    }


    /* =========================
       DRAW
    ========================= */

    if (
        !board.includes("")
    ) {

        gameActive =
            false;


        draws++;


        updateScore();


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
   UPDATE SCOREBOARD
========================= */

function updateScore() {

    winsText.textContent =
        wins;


    lossesText.textContent =
        losses;


    drawsText.textContent =
        draws;

}


/* =========================
   WINNING LINE
========================= */

function drawWinningLine(
    combination
) {

    const boardElement =
        document.getElementById(
            "board"
        );


    const firstCell =
        cells[
            combination[0]
        ];


    const lastCell =
        cells[
            combination[2]
        ];


    const boardRect =
        boardElement
            .getBoundingClientRect();


    const firstRect =
        firstCell
            .getBoundingClientRect();


    const lastRect =
        lastCell
            .getBoundingClientRect();


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
        ) *
        180 /
        Math.PI;


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


        confettiContainer.appendChild(
            piece
        );

    }


    setTimeout(
        () => {

            confettiContainer.innerHTML =
                "";

        },
        5000
    );

}


/* =========================
   CHANGE GAME MODE
========================= */

function changeGameMode(
    newMode
) {

    gameMode =
        newMode;


    document.body.classList.remove(

        "one-player",

        "two-player-theme",

        "easy-theme",

        "medium-theme",

        "hard-theme"

    );


    if (
        newMode === "one-player"
    ) {

        document.body.classList.add(
            "one-player"
        );


        document.body.classList.add(
            `${difficulty}-theme`
        );


        difficultySection.style.display =
            "block";


        onePlayerButton.classList.add(
            "active"
        );


        twoPlayerButton.classList.remove(
            "active"
        );


        statusText.textContent =
            "Your turn (X)";

    }


    else {

        document.body.classList.add(
            "two-player-theme"
        );


        difficultySection.style.display =
            "none";


        twoPlayerButton.classList.add(
            "active"
        );


        onePlayerButton.classList.remove(
            "active"
        );


        statusText.textContent =
            "Player X's turn";

    }


    restartGame();

}


/* =========================
   CHANGE DIFFICULTY
========================= */

function changeDifficulty(
    newDifficulty
) {

    difficulty =
        newDifficulty;


    if (
        gameMode !== "one-player"
    ) {

        return;

    }


    document.body.classList.remove(

        "easy-theme",

        "medium-theme",

        "hard-theme"

    );


    document.body.classList.add(
        `${newDifficulty}-theme`
    );


    easyButton.classList.remove(
        "active"
    );


    mediumButton.classList.remove(
        "active"
    );


    hardButton.classList.remove(
        "active"
    );


    if (
        newDifficulty === "easy"
    ) {

        easyButton.classList.add(
            "active"
        );

    }


    if (
        newDifficulty === "medium"
    ) {

        mediumButton.classList.add(
            "active"
        );

    }


    if (
        newDifficulty === "hard"
    ) {

        hardButton.classList.add(
            "active"
        );

    }


    restartGame();

}


/* =========================
   MODE EVENTS
========================= */

onePlayerButton.addEventListener(
    "click",
    () => {

        changeGameMode(
            "one-player"
        );

    }
);


twoPlayerButton.addEventListener(
    "click",
    () => {

        changeGameMode(
            "two-player"
        );

    }
);


/* =========================
   DIFFICULTY EVENTS
========================= */

easyButton.addEventListener(
    "click",
    () => {

        changeDifficulty(
            "easy"
        );

    }
);


mediumButton.addEventListener(
    "click",
    () => {

        changeDifficulty(
            "medium"
        );

    }
);


hardButton.addEventListener(
    "click",
    () => {

        changeDifficulty(
            "hard"
        );

    }
);


/* =========================
   RESTART
========================= */

function restartGame() {

    board = [

        "",
        "",
        "",

        "",
        "",
        "",

        "",
        "",
        ""

    ];


    currentPlayer =
        "X";


    gameActive =
        true;


    cells.forEach(
        (cell) => {

            cell.textContent =
                "";

        }
    );


    if (
        gameMode === "one-player"
    ) {

        statusText.textContent =
            "Your turn (X)";

    } else {

        statusText.textContent =
            "Player X's turn";

    }


    winningLine.style.display =
        "none";


    winningLine.style.transform =
        "none";


    winnerPopup.classList.remove(
        "show"
    );


    confettiContainer.innerHTML =
        "";

}


/* =========================
   RESTART BUTTONS
========================= */

restartButton.addEventListener(
    "click",
    restartGame
);


popupRestartButton.addEventListener(
    "click",
    restartGame
);