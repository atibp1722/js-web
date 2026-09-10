// all the objects needed for the game
const CONSTANT = {
    // empty game cell
    UNASSIGNED: 0,
    // 9x9 game grid
    GRID_SIZE: 9,
    // 3x3 game box
    BOX_SIZE: 3,
    // numbers that can be entered in box
    NUMBERS: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    // game difficulty
    LEVEL_NAME: ["Easy", "Medium", "Hard", "Very Hard", "Insane", "God"],
    // game grids that are filled based on difficulty
    LEVEL: [29, 38, 47, 56, 65, 74],
};

// getting the HTML elements
// game screen elements
const start_screen = document.querySelector("#start-screen");
const game_screen = document.querySelector("#game-screen");
const pause_screen = document.querySelector("#pause-screen");
const result_screen = document.querySelector("#result-screen");
// game play elements
const cells = document.querySelectorAll(".main-grid-cell");
const name_input = document.querySelector("#input-name");
const number_inputs = document.querySelectorAll(".number");
const player_name = document.querySelector("#player-name");
const game_level = document.querySelector("#game-level");
const game_time = document.querySelector("#game-time");
const result_time = document.querySelector("#result-time");

// set default diffculty
let level_index = 0;
let level = CONSTANT.LEVEL[level_index];

// game elements for refresh, pause and seconds elapsed
let timer = null;
let pause = false;
let seconds = 0;

// default as no puzzle generated (store generated puzzle)
let su = undefined;
// default as no solution (store solution)
let su_answer = undefined;

// no cell currently selected
let selected_cell = -1;

// creating a new game grid
const newGrid = (size) => {
    // creating rows for the game grid
    let arr = new Array(size);
    for(let i=0; i<size; i++){
        arr[i] = new Array(size);
    }
    // fill the rows
    for(let i=0; i<Math.pow(size, 2); i++){
        // gives the rows and columns of the game grid
        arr[Math.floor(i / size)][i % size] = CONSTANT.UNASSIGNED;
    }
    return arr;
};

// check if duplicates exist in column
const isColSafe = (grid, col, value) => {
    // iterate through every row
    for(let row=0; row<CONSTANT.GRID_SIZE; row++){
        // if value already exist cannot repeat at the location
        if (grid[row][col] === value) return false;
    }
    return true;
};

// check if duplicates exist in row
const isRowSafe = (grid, row, value) => {
    // iterate through every column
    for(let col=0; col<CONSTANT.GRID_SIZE; col++){
        if (grid[row][col] === value) return false;
    }
    return true;
};

// check if duplicates exist in 3x3 box
const isBoxSafe = (grid, box_row, box_col, value) => {
    // iterate through rows and columns inside the box
    for(let row=0; row<CONSTANT.BOX_SIZE; row++){
        for(let col=0; col<CONSTANT.BOX_SIZE; col++){
            if (grid[row + box_row][col + box_col] === value) return false;
        }
    }
    return true;
};

// check if number can be placed in a cell
const isSafe = (grid, row, col, value) => {
    // check value does not exist in row, column or box
    return(
        isColSafe(grid, col, value)&&
        isRowSafe(grid, row, value)&&
        isBoxSafe(grid, row - (row%3), col - (col%3), value)&&
        // box number also cannot be assigned 0
        value != CONSTANT.UNASSIGNED
    );
};

// find unassigned empty cell
const findUnassignedPos = (grid, pos) => {
    // iterate through every row and column 
    for(let row=0; row<CONSTANT.GRID_SIZE; row++){
        for(let col=0; col<CONSTANT.GRID_SIZE; col++){
            // check if current position empty
            if (grid[row][col] === CONSTANT.UNASSIGNED){
                // save row and column number
                pos.row = row;
                pos.col = col;
                return true;
            }
        }
    }
    return false;
};

// shuffle the game grid
const shuffleArray = (arr) => {
    let curr_index = arr.length;

    // run until all positions have been shuffled
    while(curr_index !== 0){
        let rand_index = Math.floor(Math.random() * curr_index);
        // move back 1 position
        curr_index--;

        // perform shuffle using temp variable
        // swap current index with random index 
        let temp = arr[curr_index];
        arr[curr_index] = arr[rand_index];
        arr[rand_index] = temp;
    }
    return arr;
};

// check if game grid is full
const isFullGrid = (grid) => {
    // every row and column have met conditions and cannot be 0
    return grid.every((row, i) => {
        return row.every((value, j) => {
            return value !== CONSTANT.UNASSIGNED;
        });
    });
};

// backtracking to solve a game grid
const sudokuCreate = (grid) => {
    // object to store position of empty cell
    let unassigned_pos = {
        row: -1,
        col: -1,
    };

    //find empty cell in the grid
    if (!findUnassignedPos(grid, unassigned_pos)) return true;
    // shuffle the numbers in the array
    let number_list = shuffleArray([...CONSTANT.NUMBERS]);

    // get row and column of empty cell
    let row = unassigned_pos.row;
    let col = unassigned_pos.col;

    // try and check if a number can be put safely at current position 
    number_list.forEach((num, i) => {
        if (isSafe(grid, row, col, num)){
            // place number in empty cell
            grid[row][col] = num;
            // check if game grid is full
            if (isFullGrid(grid)){
                // then puzzle is complete
                return true;
            } else {
                if (sudokuCreate(grid)){
                    return true;
                }
            }
            // if number is not correct then remove from cell
            grid[row][col] = CONSTANT.UNASSIGNED
        }
    });
    return isFullGrid(grid);
};

// function to check if a game can be sucessfully solved
const sudokuCheck = (grid) => {
    let unassigned_pos = {
        row: -1,
        col: -1,
    };

    // find empty position
    if (!findUnassignedPos(grid, unassigned_pos)) return true;

    // iterate each row and check number is ok  
    grid.forEach((row, i) => {
        row.forEach((num, j) => {
            if (isSafe(grid, i, j, num)){
                if (isFullGrid(grid)){
                    return true;
                } else {
                    if (sudokuCreate(grid)){
                        return true;
                    }
                }
            }
        });
    });
    return isFullGrid(grid);
};

const rand = () => Math.floor(Math.random() * CONSTANT.GRID_SIZE);

// remove cells from completed game
const removeCells = (grid, level) => {
    let res = [...grid];
    // number of cells to remove
    let attempts = level;
    // keep removing cells until all attempts exhausted
    while (attempts > 0){
        // random row and column 
        let row = rand();
        let col = rand();
        // do not choose cell already removed
        while (res[row][col] === 0){
            row = rand();
            col = rand();
        }
        res[row][col] =CONSTANT.UNASSIGNED;
    }
    return res;
};

// generate a game grid based on difficulty level
const sudokuGen = (level) => {
    let sudoku = newGrid(CONSTANT.GRID_SIZE);
    let check = sudokuCreate(sudoku);
    if (check){
        // remove cells based on difficulty 
        let question = removeCells(sudoku, level);
        return {
            // show both current and completed puzzle
            original: sudoku,
            question: question,
        };
    }
    return undefined;
};

// visualizing the game grid
const initGameGrid = () => {
    let index = 0;

    // get which row and column cell belong to
    for(let i=0; i<Math.pow(CONSTANT.GRID_SIZE, 2); i++){
        let row = Math.floor(i / CONSTANT.GRID_SIZE);
        let col = i % CONSTANT.GRID_SIZE;
        // separate the boxes by adding some margin in row and column
        if (row === 2 || row === 5) cells[index].style.marginBottom = "10px";
        if (col === 2 || col === 5) cells[index].style.marginRight = "10px";

        // move to next cell
        index++;
    }
};

// set and get player name
const setPlayerName = (name) => localStorage.setItem("player_name", name);
const getPlayerName = () => localStorage.getItem("player_name");

// convert to time to be displayed
const showTime = (seconds) => 
    new Date(seconds * 1000).toString().substring(11, 8);

// clear the game board
const clearSudoku = () => {
    for(let i=0; i<Math.pow(CONSTANT.GRID_SIZE, 2); i++){
        // remove content
        cells[i].innerHTML = "";
        // make cell editable
        cells[i].classList.remove("filled");
        // remove cell highlight
        cells[i].classList.remove("selected");
    }
};

// load a new game grid
const initSudoku = () => {
    clearSudoku();

    resetBg();
    su = sudokuGen(level);
    // create copy (not of the original)
    su_answer = su.question.map((row) => [...row]);
    seconds = 0;
    // iterate all the game cells
    for(let i=0; i<Math.pow(CONSTANT.GRID_SIZE, 2); i++){
        let row = Math.floor(i / CONSTANT.GRID_SIZE);
        let col = i % CONSTANT.GRID_SIZE;
        // retrieve the cell's value
        cells[i].setAttribute("data-value", su.question[row][col]);
        // check whether cell already filled
        if (su.question[row][col] !==0 ){
            cells[i].classList.add("filled");
            // display number inside the cell 
            cells[i].innerHTML = su.question[row][col];
        }
    }
};

// highlight the game cells
const hoverBg = (index) => {
    // row and column position of the cell
    let row = Math.floor(index / CONSTANT.GRID_SIZE);
    let col = index % CONSTANT.GRID_SIZE;
    // positions in a 3x3 box
    let box_start_row = row - (row%3);
    let box_start_col = col - (col%3);
    // highlight 3x3 box
    for(let i=0; i<CONSTANT.BOX_SIZE; i++){
        for(let j=0; j<CONSTANT.BOX_SIZE; j++){
            let cell = cells[9 * (box_start_row+i) + (box_start_col+j)];
            cell.classList.add("hover");
        }
    }
    // highlight cells above
    let step = 9;
    // keep moving 1 row upward
    while (index-step >= 0){
        cells[index - step].classList.add("hover");
        step += 9;
    }
    // highlight cells below
    step = 9;
    // do not go beyond 80 cells
    // move 1 row downward
    while (index+step < 81){
        cells[index + step].classList.add("hover");
        step += 9;
    }
    // highlight left cells
    step = 1;
    // move 1 step left
    while (index - step >= 9 * row ){
        cells[index - step].classList.add("hover");
        step += 1;
    }
    // highlight right cells
    step = 1;
    // move 1 step rght
    while (index + step < 9 * row+9 ){
        cells[index + step].classList.add("hover");
        step += 1;
    }
};

// remove all highlights and revert to normal
const resetBg = () => {
    cells.forEach((e) => e.classList.remove("hover"));
};

// check for duplicates
const checkErr = (value) => {
    // check one cell at a time
    const addErr = (cell) => {
        // convert string to number
        // refresh error after half second
        if (parseInt(cell.getAttribute("data-value")) === value){
            cell.classList.add("err");
            cell.classList.add("cell-err");
            setTimeout(() => {
                cell.classList.remove("err");
            }, 500);
        }
    };

    // get current cell
    let index = selected_cell;

    // find its row and colum position
    let row = Math.floor(index / CONSTANT.GRID_SIZE);
    let col = index % CONSTANT.GRID_SIZE;

    // finds its position within 3x3 box
    let box_start_row = row - (row%3);
    let box_start_col = col - (col%3);

    // check the box
    for(let i=0; i<CONSTANT.BOX_SIZE; i++){
        for(let j=0; j<CONSTANT.BOX_SIZE; j++){
            // dont mark the selected cell
            let cell = cells[9 * (box_start_row + i) + (box_start_col + j)];
            if (!cell.classList.contains("selected")) addErr(cell);
        }
    }

    // check above
    let step = 9;
    while (index - step >= 0){
        addErr(cells[index - step]);
        step += 9;
    }

    // check below
    step = 9;
    while (index + step < 81){
        addErr(cells[index + step]);
        step += 9;
    }

    // check left
    step = 1;
    while (index - step >= 9 * row ){
        addErr(cells[index - step]);
        step += 1;
    }

    // check right
    step = 1;
    while (index + step < 9 * row+9 ){
        addErr(cells[index + step]);
        step += 1;
    }
};

// check whether game is won
const isGameWin = () => sudokuCheck(su_answer);

// show the result screen
const showResult = () => {
    // stop timer
    clearInterval(timer);
    // activate result screen
    result_screen.classList.add("active");
    // show time taken to complete game
    result_time.innerHTML = showTime(seconds);
};

// number input event handler
const initNumberInputEvent = () => {
    number_inputs.forEach((e, index) => {
        e.addEventListener("click", () => {
            // cell cannot be filled
            if (!cells[selected_cell].classList.contains("filled")){
                // show the number
                cells[selected_cell].innerHTML = index + 1;
                // store the number
                cells[selected_cell].setAttribute("data-value", index + 1);
                // find the number's row and column position
                let row = Math.floor(selected_cell / CONSTANT.GRID_SIZE);
                let col = selected_cell % CONSTANT.GRID_SIZE;
                // save the user number answer
                su_answer[row][col] = index + 1;
                removeErr();
                checkErr(index + 1);
                // add effect
                cells[selected_cell].classList.add("zoom-in");
                setTimeout(() => {
                    cells[selected_cell].classList.remove("zoom-in");
                }, 500);

                // check if game solved
                if (isGameWin()){
                    removeGameInfo();
                    showResult();
                }
            }
        });
    });
}; 

// remove the error styling
const removeErr = () => cells.forEach((e) => e.classList.remove("err"));

// event when user clicks on a game cell
const initCellsEvent = () => {
    // iterate all the game cells
    cells.forEach((e, index) => {
        e.addEventListener("click", () => {
            // only allow editable cells to be selected
            if (!e.classList.contains("filled")){
                cells.forEach((e) => e.classList.remove("selected"));
                // cell that been clicked by user that is not filled
                selected_cell = index;
                // remove previous styling
                e.classList.remove("err");
                e.classList.add("selected");
                // remove highlight from previous game box
                resetBg();
                // highlight the current game box
                hoverBg(index);
            }
        });
    });
};

// start the game
const startGame = () => {
    // hide/show the respective screens
    start_screen.classList.remove("active");
    game_screen.classList.add("active");

    // get and set player name
    player_name.innerHTML = name_input.value.trim();
    setPlayerName(name_input.value.trim());

    // set game difficulty
    game_level.innerHTML = CONSTANT.LEVEL_NAME[level_index];
    // show seconds elapsed
    showTime(seconds);

    // begin game timer
    // refresh every second
    timer = setInterval(() => {
        if (!pause){
            seconds = seconds + 1;
            game_time.innerHTML = showTime(seconds);
        }
    }, 1000);
};

// game start screen based on pause/play
const returnStartScreen = () => {
    // start timer
    clearInterval(timer);
    // reset game state
    pause = false;
    seconds = 0;
    // hide/shoe game screens
    start_screen.classList.add("active");
    game_screen.classList.remove("active");
    pause_screen.classList.remove("active");
    result_screen.classList.remove("active");
};

// connecting game buttons to js functions
document.querySelector("#btn-level").addEventListener("click", (e) => {
    // get diffuclty levels in the game
    level_index = 
        level_index + 1 > CONSTANT.LEVEL.length - 1 ? 0: level_index + 1;
    // cells to be filled based on difficulty
    level = CONSTANT.LEVEL[level_index];
    e.target.innerHTML = CONSTANT.LEVEL_NAME[level_index];
});

// play game buttom
document.querySelector("#btn-play").addEventListener("click", () => {
    // validate name input
    if (name_input.value.trim().length > 0){
        initSudoku();
        startGame();
    } else{
        name_input.classList.add("input-err");
        setTimeout(() => {
            name_input.classList.remove("input-err");
            name_input.focus();
        }, 500);
    }
});

// pause button
document.querySelector("#btn-pause").addEventListener("click", () => {
    // display the pause screen
    // stop the game timer
    pause_screen.classList.add("active");
    pause = true;
});

/// resume buton
document.querySelector("#btn-resume").addEventListener("click", () => {
    // remove the pause screen
    pause_screen.classList.remove("active");
    pause = false;
});

// new game button
// return to a new game screen
document.querySelector("#btn-new-game").addEventListener("click", () => {
    returnStartScreen();
});

document.querySelector("#btn-new-game-2").addEventListener("click", () => {
    returnStartScreen();
});

// delete button
document.querySelector("#btn-delte").addEventListener("click", () => {
    // clear game cell content
    cells[selected_cell].innerHTML = "";
    // revert to empty game cell
    cells[selected_cell].setAttribute("data-value", 0);

    // get the row and column position of the game cell
    let row = Math.floor(selected_cell / CONSTANT.GRID_SIZE);
    let col = selected_cell % CONSTANT.GRID_SIZE;
    // remove the number from user's answer 
    su_answer[row][col] = 0;

    removeErr();
});

// game initialization function
const init = () => {
    // setup game componeents in respective order
    initGameGrid();
    initCellsEvent();
    initNumberInputEvent();

    // get game player's name
    if (getPlayerName()){
        name_input.value = getPlayerName();
    } else{
        name_input.focus();
    }
};

// call function to start playing the game
init();
