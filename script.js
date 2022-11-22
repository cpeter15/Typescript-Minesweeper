// Beginner: 8x8, 10 Mines
// Intermediate: 16x16 40 Mines
// Expert: 30x16 99 Mines 

let gameBoard;
let gameStats;
let difficulty;

document.body.onmousedown = (e) => {
    if (e.button === 1) {
        e.preventDefault();
        return false;
    }
}

const makeBoard = (x, y, numMines) => {
    // tests if there are too many mines to fit into the board
    if (numMines > (x * y)) {
        alert("too many mines");
        return null;
    }
    let board = [];
    let numFlagged = 0;
    let numRevealed = 0;
    let gameDiv = document.querySelector("#gameDiv");
    const boardSection = document.createElement("section");
    boardSection.setAttribute("id", "board");
    gameDiv.style.width = (x * 50) + 'px';
    boardSection.style.width = (x * 50) + 'px';
    gameDiv.appendChild(boardSection);

    for (let i = 0; i < y; i++) {
        let arr = [];
        for (let j = 0; j < x; j++) {
            let space = crateSpace(j, i, board);
            arr.push(space);
            boardSection.appendChild(space.button);
        }
        board.push(arr);
    }

    armBoard(board, numMines);

    const clearBoard = () => {
        console.log("clearing board");
        board = null;
        boardSection.remove();
        gameDiv.remove();
    }

    const revealBombs = () => {
        board.forEach((arr) => {
            arr.forEach((space) => {
                if (space.getBomb()) {
                    // space.button.style.backgroundImage = "none";
                    // space.button.textContent = "bomb";
                    space.button.setAttribute("class", "spaces spaces-bomb");
                }
            })
        })
    }

    const checkWinCondition = () => {
        if ((gameBoard.flagged === numMines) && (gameBoard.flagged + gameBoard.revealed === (x * y))) {
            gameOver(true);
        }
    }

    const gameOver = (win) => {
        gameStats.stopTimer();
        document.querySelectorAll(".spaces").forEach((space) => {
            space.replaceWith(space.cloneNode(true));
        })
        let gameOverMenu = document.createElement("div");
        let gameOverHeader = document.createElement("h2");
        let gameOverPara = document.createElement("p");
        gameOverMenu.setAttribute("id", "game-over-menu");
        if (win) {
            // setTimeout(() => alert("You Won"), 10);
            gameOverHeader.textContent = "You Won!";
            if (difficulty.value === "custom") {
                gameOverPara.textContent = `You completed Minesweeper on custom difficulty with Width: ${difficulty.custom.x}, Height: ${difficulty.custom.y}, and Mines: ${difficulty.custom.mines} in ${gameStats.gameTime} seconds`;
            } else {
                gameOverPara.textContent = `You completed Minesweeper on ${difficulty.value} difficulty in ${gameStats.gameTime} seconds`;
            }
        } else {
            // setTimeout(() => alert("Game Over"), 10);
            gameOverHeader.textContent = "Game Over";
            gameOverPara.textContent = "You revealed a mine";
        }

        gameOverMenu.appendChild(gameOverHeader);
        gameOverMenu.appendChild(gameOverPara);

        let gameOverButton = document.createElement("button");
        gameOverButton.textContent = "Play again?";

        gameOverButton.addEventListener("click", () => {
            clearBoard();
            gameOverMenu.remove();
            startMenu();
        })

        gameOverMenu.appendChild(gameOverButton);

        document.querySelector("#gameDiv").appendChild(gameOverMenu);

    }

    return {
        board: board,
        revealed: numRevealed,
        flagged: numFlagged,
        check: checkWinCondition,
        revealBombs: revealBombs,
        gameOver: gameOver
    }
}


const crateSpace = (x, y, board) => {
    const space = document.createElement("button");
    space.textContent = "";
    space.setAttribute("class", "spaces");

    let isBomb = false;
    let isRevealed = false;
    let isFlaged = false;

    const chooseColor = (num) => {
        let color = "pink";
        switch (num) {
            case 0:
                color = "white";
                break;
            case 1:
                color = "blue";
                break;
            case 2:
                color = "green";
                break;
            case 3:
                color = "red";
                break;
            case 4:
                color = "purple";
                break;
            case 5:
                color = "maroon";
                break;
            case 6:
                color = "turquoise";
                break;
            case 7:
                color = "black";
                break;
            case 8:
                color = "gray";
                break;
            default:
                console.log("color defaulted");
                break;
        }
        return color;
    }

    const revealSpace = () => {
        if (isFlaged) {
            // space.style.backgroundImage = "none";
            gameBoard.flagged--;
            isFlaged = false;
            gameStats.updateFlagCounter();
        }
        if (isBomb) {
            space.style.backgroundColor = "red";
            gameBoard.revealBombs();
            gameBoard.gameOver(false)
        } else if (!isRevealed) {
            let count = 0;
            if (board[y - 1] && board[y - 1][x - 1] && board[y - 1][x - 1].getBomb()) {
                count++;
            }
            if (board[y - 1] && board[y - 1][x] && board[y - 1][x].getBomb()) {
                count++;
            }
            if (board[y - 1] && board[y - 1][x + 1] && board[y - 1][x + 1].getBomb()) {
                count++;
            }
            if (board[y][x - 1] && board[y][x - 1].getBomb()) {
                count++;
            }
            if (board[y][x + 1] && board[y][x + 1].getBomb()) {
                count++;
            }
            if (board[y + 1] && board[y + 1][x - 1] && board[y + 1][x - 1].getBomb()) {
                count++;
            }
            if (board[y + 1] && board[y + 1][x] && board[y + 1][x].getBomb()) {
                count++;
            }
            if (board[y + 1] && board[y + 1][x + 1] && board[y + 1][x + 1].getBomb()) {
                count++;
            }
            isRevealed = true;
            gameBoard.revealed += 1;
            // console.log("revealed " + gameBoard.revealed);
            if (count !== 0) {
                space.textContent = count;
            } else {
                space.textContent = "";
            }
            space.style.color = chooseColor(count);
            space.setAttribute("class", "spaces-reveled");
            if (count === 0) {
                if (board[y - 1] && board[y - 1][x - 1]) {
                    board[y - 1][x - 1].revealSpace();
                }
                if (board[y - 1] && board[y - 1][x]) {
                    board[y - 1][x].revealSpace();
                }
                if (board[y - 1] && board[y - 1][x + 1]) {
                    board[y - 1][x + 1].revealSpace();
                }
                if (board[y] && board[y][x - 1]) {
                    board[y][x - 1].revealSpace();
                }
                if (board[y] && board[y][x + 1]) {
                    board[y][x + 1].revealSpace();
                }
                if (board[y + 1] && board[y + 1][x - 1]) {
                    board[y + 1][x - 1].revealSpace();
                }
                if (board[y + 1] && board[y + 1][x]) {
                    board[y + 1][x].revealSpace();
                }
                if (board[y + 1] && board[y + 1][x + 1]) {
                    board[y + 1][x + 1].revealSpace();
                }
            }
            gameBoard.check();
        }


    }
    const flagSpace = () => {
        if (!isFlaged && !isRevealed) {
            // space.style.backgroundImage = "url('https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Minesweeper_flag.svg/76px-Minesweeper_flag.svg.png')";
            // space.style.backgroundSize = "contain";
            space.setAttribute("class", "spaces spaces-flagged")
            // console.log("flagged");
            isFlaged = true;
            gameBoard.flagged++;
        } else if (isFlaged && !isRevealed) {
            // space.style.backgroundImage = "none";
            space.setAttribute("class", "spaces");
            isFlaged = false;
            gameBoard.flagged--;
        }
        gameStats.updateFlagCounter();
        gameBoard.check();
    }

    space.addEventListener("contextmenu", e => {
        e.preventDefault();
    })
    space.addEventListener("click", revealSpace);
    space.addEventListener("auxclick", auxclick = (e) => {
        if (e.button == 2) {
            flagSpace();
        }
        else if (e.button == 1) {
            console.log("middle click");
        }
    });

    const makeBomb = () => {
        isBomb = true;
        space.textContent = "";
    }

    const getBomb = () => {
        return isBomb;
    }

    return {
        button: space,
        x: x,
        y: y,
        placeBomb: makeBomb,
        getBomb: getBomb,
        revealSpace: revealSpace
    };
}

const armBoard = (board, mines) => {
    let arr = [];
    board.forEach((arr1) => {
        arr1.forEach((element) => {
            arr.push({
                y: element.y,
                x: element.x
            })
        })
    })

    // console.log(arr)

    for (let i = 0; i < mines; i++) {
        let random = Math.floor((Math.random() * arr.length));
        let space = arr[random];
        board[space.y][space.x].placeBomb();
        arr.splice(random, 1);
        // console.log(`made bomb ${i}`);
    }

}


const startMenu = () => {
    let menu = document.createElement("div");
    menu.setAttribute("class", "menu");
    let form = document.createElement("form");
    form.setAttribute("id", "difficulty-options");

    let beginner = document.createElement("input");
    beginner.setAttribute("type", "radio");
    beginner.setAttribute("name", "difficulty");
    beginner.setAttribute("id", "beginner");
    beginner.setAttribute("value", "beginner");
    beginner.setAttribute("checked", "");
    let label = document.createElement("label");
    label.setAttribute("for", "beginner");
    label.textContent = "Beginner (8x8 Grid with 10 Mines)";
    let inputDiv = document.createElement("div");
    inputDiv.setAttribute("class", "difficulty-option");
    inputDiv.appendChild(beginner);
    inputDiv.appendChild(label);
    form.appendChild(inputDiv);

    let intermediate = document.createElement("input");
    intermediate.setAttribute("type", "radio");
    intermediate.setAttribute("name", "difficulty");
    intermediate.setAttribute("id", "intermediate");
    intermediate.setAttribute("value", "intermediate");
    label = document.createElement("label");
    label.setAttribute("for", "intermediate");
    label.textContent = "Intermediate (16x16 Grid with 40 Mines)";
    inputDiv = document.createElement("div");
    inputDiv.setAttribute("class", "difficulty-option");
    inputDiv.appendChild(intermediate);
    inputDiv.appendChild(label);
    form.appendChild(inputDiv);

    let expert = document.createElement("input");
    expert.setAttribute("type", "radio");
    expert.setAttribute("name", "difficulty");
    expert.setAttribute("id", "expert");
    expert.setAttribute("value", "expert");
    label = document.createElement("label");
    label.setAttribute("for", "expert");
    label.textContent = "Expert (30x16 Grid with 99 Mines)";
    inputDiv = document.createElement("div");
    inputDiv.setAttribute("class", "difficulty-option");
    inputDiv.appendChild(expert);
    inputDiv.appendChild(label);
    form.appendChild(inputDiv);

    let custom = document.createElement("input");
    custom.setAttribute("type", "radio");
    custom.setAttribute("name", "difficulty");
    custom.setAttribute("id", "custom");
    custom.setAttribute("value", "custom");
    label = document.createElement("label");
    label.setAttribute("for", "custom");
    label.textContent = "Custom";
    inputDiv = document.createElement("div");
    inputDiv.setAttribute("class", "difficulty-option");
    let customX = document.createElement("input");
    customX.setAttribute("type", "number");
    customX.setAttribute("name", "customX");
    customX.setAttribute("id", "customX");
    customX.setAttribute("value", "30");
    let labelx = document.createElement("label");
    labelx.setAttribute("for", "customX");
    labelx.setAttribute("class", "custom-inputs");
    labelx.textContent = "Width: ";
    let customY = document.createElement("input");
    customY.setAttribute("type", "number");
    customY.setAttribute("name", "customY");
    customY.setAttribute("id", "customY");
    customY.setAttribute("value", "16");
    let labely = document.createElement("label");
    labely.setAttribute("for", "customY");
    labely.setAttribute("class", "custom-inputs");
    labely.textContent = "Height: ";
    let customMines = document.createElement("input");
    customMines.setAttribute("type", "number");
    customMines.setAttribute("name", "customMines");
    customMines.setAttribute("id", "customMines");
    customMines.setAttribute("value", "99");
    let labelMines = document.createElement("label");
    labelMines.setAttribute("for", "customMines");
    labelMines.setAttribute("class", "custom-inputs");
    labelMines.textContent = "Mines: ";

    inputDiv.appendChild(custom);
    inputDiv.appendChild(label);
    inputDiv.appendChild(labelx);
    inputDiv.appendChild(customX);
    inputDiv.appendChild(labely);
    inputDiv.appendChild(customY);
    inputDiv.appendChild(labelMines);
    inputDiv.appendChild(customMines);
    form.appendChild(inputDiv);

    menu.append(form);
    document.querySelector("#game-window").appendChild(menu);

    let submit = document.createElement("button");
    submit.textContent = "Start Game";

    submit.addEventListener("click", () => {
        let inputDifficulty = {
            value: form.elements["difficulty"].value,
            custom: {
                x: form.elements["customX"].value,
                y: form.elements["customY"].value,
                mines: form.elements["customMines"].value
            }
        }
        menu.remove()
        gameStart(inputDifficulty)
    })

    form.appendChild(submit);


}

const makeGameHeader = (numMines) => {
    let statDiv = document.createElement("div");
    statDiv.setAttribute("id", "stat-div");

    let flagCounter = document.createElement("div");
    flagCounter.setAttribute("class", "counter");
    flagCounter.setAttribute("id", "flagCounter");
    flagCounter.textContent = numMines;

    const updateFlagCounter = () => {
        flagCounter.textContent = numMines - gameBoard.flagged
    }

    let timerDiv = document.createElement("div");
    timerDiv.setAttribute("class", "timer");

    let time = 0;

    timerDiv.textContent = time;

    const updateTimer = () => {
        gameStats.gameTime++
        timerDiv.textContent = gameStats.gameTime;
    }

    // starting the interval that will update the timer every second
    let timerInterval = setInterval(() => updateTimer(), 1000);

    const stopTimer = () => {
        clearInterval(timerInterval);
    }

    gameStats = {
        gameTime: time,
        stopTimer: stopTimer,
        updateFlagCounter: updateFlagCounter
    }

    statDiv.appendChild(flagCounter);
    statDiv.appendChild(timerDiv);

    document.querySelector("#gameDiv").appendChild(statDiv);

}

const gameStart = (inputDifficulty) => {

    let gameDiv = document.createElement("div");
    gameDiv.setAttribute("id", "gameDiv");
    document.querySelector("#game-window").appendChild(gameDiv);
    difficulty = inputDifficulty;


    if (difficulty.value === "beginner") {
        makeGameHeader(10);
        gameBoard = makeBoard(8, 8, 10);
    } else if (difficulty.value === "intermediate") {
        makeGameHeader(40);
        gameBoard = makeBoard(16, 16, 40);
    } else if (difficulty.value === "expert") {
        makeGameHeader(99);
        gameBoard = makeBoard(30, 16, 99);
    } else if (difficulty.value === "custom") {
        makeGameHeader(difficulty.custom.mines);
        gameBoard = makeBoard(difficulty.custom.x, difficulty.custom.y, difficulty.custom.mines);
    }
}

startMenu();


