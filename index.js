const playerOneText = document.getElementById("playerOne");
const playerTwoText = document.getElementById("playerTwo");

// Factory to represent the board
function GameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    // Create board with Cell object for each cell
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    // Neatly print the board to the console
    function printBoard() {
        for (let i = 0; i < rows; i++) {
            let rowString = "";
            for (let j = 0; j < columns; j++) {
                rowString += board[i][j].getCellValue().toString() + " ";
            }
            console.log(rowString.trim()); // Add a newline after each row
        }
    }

    function resetBoard() {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                board[i][j].changeCellValue("-");
            }
        }
    }

    // Getters for Board, Rows and Columns;
    const getBoard = () => board;
    const getRows = () => rows;
    const getColumns = () => columns;

    return { printBoard, resetBoard, getBoard, getRows, getColumns };
}

// Factory to represent each cell inside the board
function Cell() {
    let value = "-"; // Value used to represent an empty cell

    // Not too sure how the Cell object will play into the code just yet, but
    // Let's just keep it as is for now
    const getCellValue = () => value;
    
    function changeCellValue (cellValue) {
        value = cellValue;
    }

    return { getCellValue, changeCellValue };
}

function Player(playerName, playerToken) {
    let playerTurn = false;
    let playerScore = 0;

    function changeTurnStatus() {
        if (playerTurn) {
            playerTurn = false;
        } else {
            playerTurn = true;
        }
    }

    getPlayerTurn = () => playerTurn;
    getPlayerScore = () => playerScore;
    incrementPlayerScore = () => playerScore++;
    getName = () => playerName;
    getToken = () => playerToken;

    return { changeTurnStatus, incrementPlayerScore, getPlayerScore, getPlayerTurn, getName, getToken };
}

function GameController(playerOneName, playerTwoName) {
    const gameBoard = GameBoard();

    // Create players
    const playerOne = Player(playerOneName, "X");
    const playerTwo = Player(playerTwoName, "O");

    playerOne.changeTurnStatus();  // Make playerOne start the game

    function swapTurns() {
        playerOne.changeTurnStatus();
        playerTwo.changeTurnStatus();
    }

    function incrementAndReset() {
        if (playerOne.getPlayerTurn()) {
            playerOne.incrementPlayerScore();
            playerOneText.textContent = "Player One: " + playerOne.getPlayerScore().toString();
        } else {
            playerTwo.incrementPlayerScore();
            playerTwoText.textContent = "Player Two: " + playerTwo.getPlayerScore().toString();
        }

        gameBoard.resetBoard();
    }

    function assignProperSelection(cellType) {
        const upperBound = gameBoard.getRows() - 1;
        const lowerBound = 0;

        // Prompt the user for a cell selection checking for the bounds
        while (true) {
            const selection = prompt(`Please select a ${cellType} [0, 1, 2]`);

            // Set the bounds for the selection process
            if (selection > upperBound || selection < lowerBound || selection == null) {
                console.log(`Invalid ${cellType} selection!`);
            } else {
                return selection;
            }
        }
    }

    // Have a player select which cell they'd like to choose. If the cell was already chosen prompt them to choose
    // a different cell until they've selected a valid cell.
    function selectCell() {
        while (true) {
            // Let the User select a row and column
            const row = assignProperSelection("row");
            const col = assignProperSelection("col");

            // Store the selected cells value
            const cellValue = gameBoard.getBoard()[row][col].getCellValue();

            // Check if the cell is free, else it's not and the player must choose again
            if (cellValue == "-") {
                if (playerOne.getPlayerTurn()) {
                    gameBoard.getBoard()[row][col].changeCellValue("X");

                } else {
                    gameBoard.getBoard()[row][col].changeCellValue("O");
                }

                gameBoard.printBoard();
                checkForWin();
                swapTurns();
                break;
            } else {
                console.log("Cell is already occupied!")
                continue;
            }
        }
    }

    function checkForWin() {
        const quickGrab = gameBoard.getBoard();

        // Check if any row has a winning condition
        for (let i = 0; i < gameBoard.getRows() - 1; i++) {
            const cellValue = quickGrab[i][0].getCellValue();

            // If the first cell of the row is '-' the row can't be a winning condition
            if (cellValue == "-") {
                continue;
            }

            // Check each row for cells of the same value
            if (quickGrab[i][1].getCellValue() == cellValue && quickGrab[i][2].getCellValue() == cellValue) {
                console.log("Row winning condition met");
                incrementAndReset();
            }
        }

        // Check if any column has a winning condition
        for (let i = 0; i < gameBoard.getColumns() - 1; i++) {
            const cellValue = quickGrab[0][i].getCellValue();

            // if the first cell of the column is '-' the column can't be a winning condition
            if (cellValue == "-") {
                continue;
            }

            // Check each column for cells of the same value
            if (quickGrab[1][i].getCellValue() == cellValue && quickGrab[2][i].getCellValue() == cellValue) {
                console.log("Column winning condition met");
                incrementAndReset();
            }
        }

        // Check for any diagonal winning condition
        const middleCellValue = quickGrab[1][1].getCellValue();

        // If the middle isn't occupied no diagonal winning condition can be met
        if (middleCellValue == "-") {
            // Do nothing
        } else if (middleCellValue == quickGrab[0][0].getCellValue() && middleCellValue == quickGrab[2][2].getCellValue()) {
            console.log("Diagonal winning condition met");
            incrementAndReset();
        } else if (middleCellValue == quickGrab[2][0].getCellValue() && middleCellValue == quickGrab[0][2].getCellValue()) {
            console.log("Diagonal winning condition met");
            incrementAndReset();
        }

        // We'll use this as a way to see if the board was filled with a tie condition if it was then we reset the board and
        // don't increment any of the scores
        checkForFilledBoard();
    }

    // Complete dog shit waste of time to write the code for this with console manual prompts
    // Do filled board later as it takes too much time to manually write out this stuff
    // function checkForFilledBoard() {
    //     let upperBound = gameBoard.getRows() * gameBoard.getColumns();

    //     for (let i = 0; i < gameBoard.getRows() - 1; i++) {
    //         for (let j = 0; j < gameBoard.getColumns() - 1; j++) {
    //             if (gameBoard.getBoard()[i][j].getCellValue() != "-") {
    //                 upperBound--;
    //             }
    //         }
    //     }

    //     if (upperBound == 0) {
    //         console.log("Players Tied")
    //     } else {
    //         console.log("Board not filled");
    //     }
    // }

    return { selectCell }
}


const game = GameController("Player One", "Player Two");

function writeCell() {
    game.selectCell();
}