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
            // increase mine number neighboring the game cell
            if (fields[y][x] !== -1){
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
    for(let y=0; y<height; y++){
        for(let x=0; x<width; x++){
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
    view.minesLeft.innerText = `${STATE.minesLeft}`.padStart(3, '0');
    view.timer.innerText = "000";

    // iterate very button on game grid
    // remove all text
    // enable button
    // remove any previous stylings
    for (const button of view.grid.children){
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

    // copy properties of new object into already exisitng object
    Object.assign(STATE, newState);
    // reset game interface
    initView(view, STATE);
}

// handle game timer
function ensureTimerStarted(view, STATE){
    // timer already running
    if (STATE.timerInterval){
        return;
    }

    STATE.timerStart = new Date();
    // refresh the timer every second
    // calculate seconds elapsed since timer started
    // display elapsed time
    STATE.timerInterval = setInterval(() => {
        const secondsElapsed = Math.floor(
            (new Date() - STATE.timerStart) / 1000
        );
        view.timer.innerText = `${secondsElapsed}`.padStart(3, '0');
    }, 1000);
}

// handle the game events
function handleGameEvents(view, STATE){
    // when smilry clicked restart game
    view.smiley.addEventListener("click", () => {
        restartGame(view, STATE)
    });
    // prevent right click menu from appearing on screen
    view.grid.addEventListener("contextmenu", (event) => {
        event.preventDefault()
    });

    // click on game board
    view.grid.addEventListener("mousedown", (event) => {
        // prevent user action on board after game ends
        if (STATE.isGameOver){
            return;
        }
        // whether clicked is a button
        const button = event.target;
        if (button.tagName !== "Button"){
            return;
        }
        // hanlde right/left click action
        ensureTimerStarted(view, STATE);
        if (event.button === 2){
            // right click actual playing button
            handleFieldFlag(view, STATE, button);
        } else{
            // left click reveals the game cell
            handleFieldReveal(view, STATE, button);
        }
    });
}

// handle filled game cell
function handleFieldFlag(view, STATE, button){
    if (button.disabled){
        return;
    }
    // toggle action if already exist or not
    const isFlagged = button.classList.toggle("flagged");
    // flag removed remaining mine count decrease
    STATE.minesLeft += isFlagged ? -1 : 1;
    // update info on game screen
    view.minesLeft.innerText = `${STATE.minesLeft}`.padStart(3, '0');
}

// handle what the game cell holds
function handleFieldReveal(view, STATE, button){
    // get coordinates of button clicked
    const {x, y} = getButtonPos(button);
    // dont reveal flagged cell
    if (button.classList.contains("flagged")){
        return;
    }
    // check the game cell
    switch(STATE.fields[y][x]){
        // contains mine
        // switch to game over
        // end game
        case -1:
            if (revealField(STATE, button)){
                button.classList.add("exploded");
                view.smiley.className = "lost";
                gameOver(view, STATE);
            }
            break;
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
    if (STATE.fieldsLeft === 0){
        view.smiley.classname = "won";
        gameOver(view, STATE);
    }
}

// reveal cell field
function revealField(STATE, button){
    if (button.disabled){
        return false;
    }
    // disable button to not allow to click
    button.disabled = true;
    button.classList.remove("flagged");

    // get button coordinates
    // get value in cell
    const {x, y} = getButtonPosition(button);
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
            button.classname = `value-${value}`;
            button.innerText = value;
            STATE.fieldsLeft--;
    }
    return true;
}

// when game is over
function gameOver(view, STATE){
    // stop timer
    clearInterval(STATE.timerInterval);
    STATE.isGameOver = true;

    // show all mines on game board
    for (const button of view.grid.children){
        // get button coordinates
        const {x, y} = getButtonPos(button);
        
        // check whether cell contains mine
        // show mine
        if(STATE.field[y][x] === -1){
            revealField(STATE, button);
        }
    }
}

