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

