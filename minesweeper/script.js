// initializing the game
function initGameStart({width, height, minesCount}){
    // initial game states
    const STATE = {
        // total game mines
        minesCount,
        // mines left in game
        minesLeft: minesCount,
        // game over or not
        isGameOver: false,
        // game cells to left to be revealed
        fieldsLeft: width*height,
        // game grid represented as rows and columns
        fields: Array.from({length: height}, () =>
            Array(width).fill(0)),
        timerStart: undefined,
        timerInterval: undefined,
    };
    // add mines in the game board
    insertMines(STATE, minesCount);
    return STATE;
}

// insert mines on the game board
function insertMines(STATE, minesCount){
    // get all the cells on game board
    const size = STATE.fieldsLeft;
    // set for stroing mine positions
    // used as it cannot hold duplicate values
    const indices = new Set();
    // continue until unique positions are gotten
    // add the unique position to set as the index
    while (indices.size < minesCount){
        const index = Math.floor(Math.random() * size);
        indices.add(index);
    }
    // game board width
    const width = STATE.fields[0].length;
    // convert array into a game row (x)
    // calculate column value (y)
    for(const index of indices){
        const y = Math.floor(index / width);
        const x = index % width;
        // put the mine in row and column position
        STATE.fields[y][x] = -1;
        // update the neighboring cells
        updateMineNeighbors(STATE, x, y);
    }
    // reduce number of game cells left by mines
    STATE.fieldsLeft -= minesCount;
}

// generate number around new mine
function updateMineNeighbors(STATE, mineX, mineY){
    const {fields} = STATE;
    // number of row and columns
    const height = fields.length;
    const width = fields[0].length;

    // start column left of the mine
    const startX = Math.max(0, mineX-1);
    // start one row above mine
    const startY = Math.max(0, mineY-1);
    // start one column right of mine
    const endX = Math.min(width-1, mineX+1);
    // start one row below mine
    const endY = Math.min(height, mineY+1);

    // iterate through each row and column
    for(let y=startY; y<=endY; y++){
        for(let x=startX; x<=endX; x++){
            // increase mine neighboring the game cell
            if (fields[y][x] !== -1){
                fields[y][x]++;
            }
        }
    }
}

