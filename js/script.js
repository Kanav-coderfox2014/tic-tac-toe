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


/* =================================
   DIFFICULTY BUTTONS
================================= */

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


/* =================================
   GAME VARIABLES
================================= */

let board = [

    "", "", "",

    "", "", "",

    "", "", ""

];


let currentPlayer = "X";


let gameActive = true;


/*
    Default difficulty
*/

let difficulty = "easy";


/* =================================
   WINNING COMBINATIONS
================================= */

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


/* =================================
   PLAYER CLICK
================================= */

cells.forEach((cell) => {

    cell.addEventListener(
        "click",
        handlePlayerMove
    );

});


function handlePlayerMove(event) {

    const clickedIndex =
        Number(
            event.target.dataset.index
        );


    /*
        Don't allow moves when:

        - Square is occupied
        - Game is finished
        - Computer is playing
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


    setTimeout(

        computerMove,

        500

    );

}


/* =================================
   MAKE MOVE
================================= */

function makeMove(
    index,
    player
) {

    board[index] = player;

    cells[index].textContent =
        player;

}


/* =================================
   COMPUTER MOVE
================================= */

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


    // Check result

    if (checkResult()) {

        return;
    }


    // Player's turn

    currentPlayer = "X";


    statusText.textContent =
        "Your turn (X)";
}


/* =================================
   COMPUTER AI
================================= */

function getComputerMove() {

    const emptyCells =
        getEmptyCells();


    /*
       EASY
       ----

       Mostly random.

       Sometimes makes a smart move.
    */

    if (
        difficulty === "easy"
    ) {

        // 55% random

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


    /*
       MEDIUM
       ------

       Usually smart.

       But still makes mistakes.
    */

    if (
        difficulty === "medium"
    ) {

        // 20% random

        if (
            Math.random() < 0.20
        ) {

            return randomChoice(
                emptyCells
            );
        }


        return getSmartMove(
            0.80
        );
    }


    /*
       HARD
       ----

       Extremely smart.

       Very small chance of making
       a mistake.

       Still technically beatable.
    */

    if (
        difficulty === "hard"
    ) {

        // Only 3% random

        if (
            Math.random() < 0.03
        ) {

            return randomChoice(
                emptyCells
            );
        }


        return getSmartMove(
            0.97
        );
    }


    return randomChoice(
        emptyCells
    );
}


/* =================================
   SMART MOVE
================================= */

function getSmartMove(
    smartness
) {

    const emptyCells =
        getEmptyCells();


    /*
       Try to WIN.

       The computer doesn't always
       take the winning move on
       lower difficulties.
    */

    const winningMove =
        findWinningMove("O");


    if (
        winningMove !== null &&
        Math.random() < smartness
    ) {

        return winningMove;
    }


    /*
       Try to BLOCK the player.
    */

    const blockingMove =
        findWinningMove("X");


    if (
        blockingMove !== null &&
        Math.random() < smartness
    ) {

        return blockingMove;
    }


    /*
       Take center.
    */

    if (
        board[4] === "" &&
        Math.random() < smartness
    ) {

        return 4;
    }


    /*
       Take a corner.
    */

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


    /*
       Otherwise pick an empty square.
    */

    return randomChoice(
        emptyCells
    );
}


/* =================================
   FIND WINNING MOVE
================================= */

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


        board[i] = player;


        const winner =
            getWinner();


        board[i] = "";


        if (
            winner === player
        ) {

            return i;
        }
    }


    return null;
}


/* =================================
   GET EMPTY CELLS
================================= */

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


/* =================================
   RANDOM CHOICE
================================= */

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


/* =================================
   GET WINNER
================================= */

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


/* =================================
   CHECK RESULT
================================= */

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


    /* ==============================
       WIN
    ============================== */

    if (
        winningCombination
    ) {

        gameActive = false;


        if (
            currentPlayer === "X"
        ) {

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


        /*
           Draw the line BEFORE
           showing the popup.
        */

        drawWinningLine(
            winningCombination
        );


        showWinnerPopup();


        return true;
    }


    /* ==============================
       DRAW
    ============================== */

    if (
        !board.includes("")
    ) {

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


/* =================================
   WINNING LINE
================================= */

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


    /*
       CENTER OF FIRST CELL
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
       CENTER OF LAST CELL
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
       Distance
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
       Angle

       This handles:

       →
       ↓
       ↘
       ↙
    */

    const angle =
        Math.atan2(
            deltaY,
            deltaX
        ) *
        180 /
        Math.PI;


    /*
       Position line
    */

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


/* =================================
   WINNER POPUP
================================= */

function showWinnerPopup() {

    winnerPopup.classList.add(
        "show"
    );
}


/* =================================
   CONFETTI
================================= */

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


/* =================================
   CHANGE DIFFICULTY
================================= */

function changeDifficulty(
    newDifficulty
) {

    difficulty =
        newDifficulty;


    /*
       Change screen theme
    */

    document.body.classList.remove(

        "easy-theme",

        "medium-theme",

        "hard-theme"

    );


    document.body.classList.add(

        `${newDifficulty}-theme`

    );


    /*
       Remove active from
       all buttons
    */

    easyButton.classList.remove(
        "active"
    );

    mediumButton.classList.remove(
        "active"
    );

    hardButton.classList.remove(
        "active"
    );


    /*
       Highlight selected button
    */

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


    /*
       Start a fresh game when
       difficulty changes.
    */

    restartGame();
}


/* =================================
   DIFFICULTY BUTTON EVENTS
================================= */

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


/* =================================
   RESTART
================================= */

function restartGame() {

    board = [

        "", "", "",

        "", "", "",

        "", "", ""

    ];


    currentPlayer = "X";


    gameActive = true;


    /*
       Clear cells
    */

    cells.forEach(
        (cell) => {

            cell.textContent =
                "";

        }
    );


    statusText.textContent =
        "Your turn (X)";


    /*
       Hide winning line
    */

    winningLine.style.display =
        "none";


    winningLine.style.transform =
        "none";


    /*
       Hide popup
    */

    winnerPopup.classList.remove(
        "show"
    );


    /*
       Clear confetti
    */

    confettiContainer.innerHTML =
        "";
}


/* =================================
   RESTART BUTTONS
================================= */

restartButton.addEventListener(
    "click",
    restartGame
);


popupRestartButton.addEventListener(
    "click",
    restartGame
);