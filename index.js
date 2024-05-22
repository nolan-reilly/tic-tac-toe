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

    function resetBoard() {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                board[i][j].changeCellValue(null);
            }
        }
    }

    // Getters for Board, Rows and Columns;
    const getBoard = () => board;
    const getRows = () => rows;
    const getColumns = () => columns;

    return { resetBoard, getBoard, getRows, getColumns };
}

// Factory to represent each cell inside the board
function Cell() {
    let value = null; // Value used to represent an empty cell

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

    function playerString() {
        return playerName + ": " + playerScore;
    }

    getPlayerTurn = () => playerTurn;
    getPlayerScore = () => playerScore;
    incrementPlayerScore = () => playerScore++;
    getName = () => playerName;
    getToken = () => playerToken;

    return { changeTurnStatus, incrementPlayerScore, getPlayerScore, getPlayerTurn, getName, getToken, playerString };
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
        } else {
            playerTwo.incrementPlayerScore();
        }

        gameBoard.resetBoard();
    }

    // Have a player select which cell they'd like to choose. If the cell was already chosen prompt them to choose
    // a different cell until they've selected a valid cell.
    function selectCell(row, col) {
        // Store the selected cells value
        const cellValue = gameBoard.getBoard()[row][col].getCellValue();

        // Check if the cell is free, else it's not and the player must choose again
        if (cellValue == null) {
            if (playerOne.getPlayerTurn()) {
                gameBoard.getBoard()[row][col].changeCellValue("X");

            } else {
                gameBoard.getBoard()[row][col].changeCellValue("O");
            }

            checkForWin();
            swapTurns();
        } else {
            console.log("Cell is already occupied!")
        }
    }

    function checkForWin() {
        const quickGrab = gameBoard.getBoard();

        // Check if any row has a winning condition
        for (let i = 0; i < gameBoard.getRows() - 1; i++) {
            const cellValue = quickGrab[i][0].getCellValue();

            // If the first cell of the row is '-' the row can't be a winning condition
            if (cellValue == null) {
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
            if (cellValue == null) {
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
        if (middleCellValue == null) {
            // Do nothing
        } else if (middleCellValue == quickGrab[0][0].getCellValue() && middleCellValue == quickGrab[2][2].getCellValue()) {
            console.log("Diagonal winning condition met");
            incrementAndReset();
        } else if (middleCellValue == quickGrab[2][0].getCellValue() && middleCellValue == quickGrab[0][2].getCellValue()) {
            console.log("Diagonal winning condition met");
            incrementAndReset();
        }

        // If no winning condition is met check if the board has any squares left
        checkForFilledBoard();
    }

    // Check for tie
    function checkForFilledBoard() {
        let upperBound = gameBoard.getRows() * gameBoard.getColumns();

        for (let i = 0; i < gameBoard.getRows(); i++) {
            for (let j = 0; j < gameBoard.getColumns(); j++) {
                if (gameBoard.getBoard()[i][j].getCellValue() != null) {
                    upperBound--;
                }
            }
        }

        if (upperBound == 0) {
            console.log("Players Tied")
            gameBoard.resetBoard();
        }
    }

    return {
        selectCell,
        getRows: gameBoard.getRows,
        getColumns: gameBoard.getColumns,
        getBoard: gameBoard.getBoard,
        playerOne,
        playerTwo,
    };
}

function ScreenController() {
    // Create the game controller
    const game = GameController("Player One", "Player Two");
    const boardDiv = document.getElementById("board");
    const scoreDiv = document.getElementById("score");

    // Store preset rows and columns variables
    const rows = game.getRows();
    const columns = game.getColumns();

    function updateScreen() {
        boardDiv.innerHTML = "";  // Clear the board
        scoreDiv.innerHTML = "";

        for (let i = 0; i < rows; i++) {
            const boardRow = document.createElement("div");  // Create a row div
            boardRow.classList.add("row");

            // Add each column to the row
            for (let j = 0; j < columns; j++) {
                // Create a button to represent each cell
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell-btn");
                cellButton.classList.add(`cell${i}${j}`)
                cellButton.addEventListener("click", function(e) {
                    game.selectCell(i, j);
                    updateScreen();
                });
                
                cellButton.textContent = game.getBoard()[i][j].getCellValue();

                boardRow.appendChild(cellButton);
            }
            
            boardDiv.appendChild(boardRow);
        }

        // Add scores to the webpage
        const playerOneScore = document.createElement("h1");
        playerOneScore.textContent = game.playerOne.playerString();
        playerOneScore.classList = "player";

        const playerTwoScore = document.createElement("h1");
        playerTwoScore.textContent = game.playerTwo.playerString();
        playerTwoScore.classList = "player";

        scoreDiv.appendChild(playerOneScore);
        scoreDiv.appendChild(playerTwoScore);
    }

    updateScreen();
}

ScreenController();