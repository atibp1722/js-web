// initializing the game
function initGameState({width, height, minesCount}){
    // initial game states
    const STATE = {
        // total game mines
        minesCount,
        // mines left in game
        minesLeft: minesCount,
        // game over or not
        isGameOver: false,
        // game cells to left to be revealed
        fieldsLeft: width * height - minesCount,
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
    const size = STATE.fields.length * STATE.fields[0].length;
    // set for storing mine positions
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
}

// generate number around new mine
function updateMineNeighbors(STATE, mineX, mineY){
    const {fields} = STATE;
    
    // number of row and columns
    const height = fields.length;
    const width = fields[0].length;

    // start column left of the mine
    const startX = Math.max(0, mineX - 1);
    // start one row above mine
    const startY = Math.max(0, mineY - 1);

    // start one column right of mine
    const endX = Math.min(width - 1, mineX + 1);
    // start one row below mine
    const endY = Math.min(height - 1, mineY + 1);

    // iterate through each row and column
    for(let y = startY; y <= endY; y++){
        for(let x = startX; x <= endX; x++){
            // increase mine number neighboring the game cell
            if(fields[y][x] !== -1){
                fields[y][x]++;
            }
        }
    }
}

// create the game buttons
function createFieldButtons(view, STATE){
    // add elements to DOM
    const fragment = new DocumentFragment();

    // get rows and columns
    const height = STATE.fields.length;
    const width = STATE.fields[0].length;

    // loop all rows and columns
    for(let y = 0; y < height; y++){
        for(let x = 0; x < width; x++){
            // create new button
            const button = document.createElement("button");
            // store x and y coordinates
            button.dataset.x = x;
            button.dataset.y = y;

            fragment.append(button);
        }
    }
    // how many rows and columns in game board
    view.grid.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
    view.grid.style.gridTemplateRows = `repeat(${height}, 1fr)`;
    // add all to the game grid
    view.grid.append(fragment);
}

// get x and y coordinates of buttons
// convert string value to numbers
function getButtonPos(button){
    return{
        x: Number(button.dataset.x),
        y: Number(button.dataset.y),
    };
}

function initView(view, STATE){
    // revert to default
    view.smiley.removeAttribute("class");
    // number of mines left
    view.minesLeft.innerText =
        `${STATE.minesLeft}`.padStart(3, '0');
    view.timer.innerText = "000";

    // iterate every button on game grid
    // remove all text
    // enable button
    // remove any previous stylings
    for(const button of view.grid.children){
        button.innerText = "";
        button.disabled = false;
        button.removeAttribute("class");
    }
}

// start a completely new game
function restartGame(view, STATE){
    // stop timer from previous game
    clearInterval(STATE.timerInterval);
    // create new game using previous game dimensions
    const newState = initGameState({
        width: STATE.fields[0].length,
        height: STATE.fields.length,
        minesCount: STATE.minesCount,
    });
    // copy properties of new object into already existing object
    Object.assign(STATE, newState);
    // reset game interface
    initView(view, STATE);
}

// handle game timer
function ensureTimerStarted(view, STATE){
    // timer already running
    if(STATE.timerInterval){
        return;
    }
    STATE.timerStart = Date.now();
    // refresh the timer every second
    // calculate seconds elapsed since timer started
    // display elapsed time
    STATE.timerInterval = setInterval(() => {
        const secondsElapsed = Math.floor(
            (Date.now() - STATE.timerStart) / 1000
        );
        view.timer.innerText =
            `${secondsElapsed}`.padStart(3, '0');
    }, 1000);
}

// handle the game events
function handleGameEvents(view, STATE){
    // when smiley clicked restart game
    view.smiley.addEventListener("click", () => {
        restartGame(view, STATE);
    });
    // prevent right click menu from appearing on screen
    view.grid.addEventListener("contextmenu", (event) => {
        event.preventDefault();
    });
    // click on game board
    view.grid.addEventListener("mousedown", (event) => {
        // prevent user action on board after game ends
        if(STATE.isGameOver){
            return;
        }
        // whether clicked is a button
        const button = event.target;
        if(button.tagName !== "BUTTON"){
            return;
        }
        // handle right/left click action
        if(event.button === 2){
            // right click actual playing button
            handleFieldFlag(view, STATE, button);
        }else if(event.button === 0){
            // don't start timer when clicking a flagged cell
            if(button.classList.contains("flagged")){
                return;
            }
            // start timer only when left clicking
            ensureTimerStarted(view, STATE);
            // left click reveals the game cell
            handleFieldReveal(view, STATE, button);
        }
    });
}

// handle filled game cell
function handleFieldFlag(view, STATE, button){
    if(button.disabled){
        return;
    }
    // check whether cell is already flagged
    const isFlagged = button.classList.contains("flagged");

    // prevent adding more flags than available mines
    if(!isFlagged && STATE.minesLeft === 0){
        return;
    }
    // toggle action if already exist or not
    button.classList.toggle("flagged");
    // flag added: remaining mine count decrease
    // flag removed: remaining mine count increase
    STATE.minesLeft += isFlagged ? 1 : -1;
    // update info on game screen
    view.minesLeft.innerText =
        `${STATE.minesLeft}`.padStart(3, '0');
}


// handle what the game cell holds
function handleFieldReveal(view, STATE, button){
    // get coordinates of button clicked
    const {x, y} = getButtonPos(button);
    // don't reveal flagged cell
    if(button.classList.contains("flagged")){
        return;
    }
    // don't reveal already revealed cell
    if(button.disabled){
        return;
    }
    // check the game cell
    switch(STATE.fields[y][x]){
        // contains mine
        // switch to game over
        // end game
        case -1:
            if(revealField(STATE, button)){
                button.classList.add("exploded");
                view.smiley.className = "lost";
                gameOver(view, STATE);
            }
            return;
        // no neighboring mines
        case 0:
            // reveal empty area
            revealEmptyArea(view.grid, STATE, x, y);
            break;
        // reveal a numbered cell
        default:
            revealField(STATE, button);
    }
    // no more playable cells
    // user won the game
    if(STATE.fieldsLeft === 0){
        view.smiley.className = "won";
        gameOver(view, STATE);
    }
}

// reveal cell field
function revealField(STATE, button){
    if(button.disabled){
        return false;
    }
    // don't reveal flagged cell
    if(button.classList.contains("flagged")){
        return false;
    }
    // disable button to not allow to click
    button.disabled = true;

    // get button coordinates
    // get value in cell
    const {x, y} = getButtonPos(button);
    const value = STATE.fields[y][x];

    switch(value){
        // contains mine
        case -1:
            button.className = "mine";
            break;
        // empty cell
        case 0:
            STATE.fieldsLeft--;
            break;
        // cell contains a number
        default:
            button.className = `value-${value}`;
            button.innerText = value;
            STATE.fieldsLeft--;
    }
    return true;
}

// when game is over
function gameOver(view, STATE){
    // stop timer
    clearInterval(STATE.timerInterval);

    // reset timer interval
    STATE.timerInterval = undefined;
    STATE.isGameOver = true;

    // show all mines on game board
    for(const button of view.grid.children){
        // get button coordinates
        const {x, y} = getButtonPos(button);
        // check whether cell contains mine
        // show mine
        if(STATE.fields[y][x] === -1){
            // remove flag before showing mine
            button.classList.remove("flagged");
            // disable the mine button
            button.disabled = true;
            // show the mine
            button.classList.add("mine");
        }
    }
}

// open empty area when cell contains 0
function revealEmptyArea(grid, STATE, x, y){
    // get game board rows and columns
    const height = STATE.fields.length;
    const width = STATE.fields[0].length;

    // all cells that have been visited
    // set prevents visiting same cell again
    const visited = new Set();

    // visit a cell and explore neighbors
    function visit(i, j){
        // stay within game coordinates
        if(i < 0 || i >= width || j < 0 || j >= height){
            return;
        }
        // convert into single index
        const index = j * width + i;
        // already visited cell
        if(visited.has(index)){
            return;
        }
        // get corresponding button
        const button = grid.children[index];
        // don't reveal flagged cell
        if(button.classList.contains("flagged")){
            return;
        }
        // don't reveal already revealed cell
        if(button.disabled){
            return;
        }
        // mark visited
        visited.add(index);
        // reveal button
        // correspond to button in DOM
        revealField(STATE, button);
        // if cell not empty don't visit neighbors
        if(STATE.fields[j][i] !== 0){
            return;
        }
        // visit left cell
        visit(i - 1, j);
        // visit right cell
        visit(i + 1, j);
        // visit above cell
        visit(i, j - 1);
        // visit below cell
        visit(i, j + 1);
    }
    visit(x, y);
}

// function to create initial game state
function main(){
    const STATE = initGameState({
        width: 10,
        height: 12,
        minesCount: 12,
    });
    // get reference to all html elements
    const view = {
        minesLeft: document.getElementById("mines-left"),
        smiley: document.getElementById("smiley"),
        timer: document.getElementById("timer"),
        grid: document.getElementById("grid"),
    };

    // create game buttons, board and handle game events
    createFieldButtons(view, STATE);
    initView(view, STATE);
    handleGameEvents(view, STATE);
}

// start the game
main();