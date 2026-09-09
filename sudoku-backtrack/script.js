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

