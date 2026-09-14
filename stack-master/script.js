// get the reference to the html game elements
const game = document.getElementById("game");
const scoreElement = document.getElementById("score");
const message = document.getElementById("message");
const finalScore = document.getElementById("finalScore");

// game dimension settings
const gameWidth = 400;
const blockHeight = 30;
const startWidth = 150;
const startSpeed = 3;

// global game variables
// holds the game blocks
let stack;
// current block that move on screen
let currentBlock;
// player score
let score;
// speed of movement
let speed;
// move left or right
let direction;
// whether game is in progress or not
let gameRunning;
// animation for game loop
let animationId;

// create game block
function createBlock(x, width, y){
    const element = document.createElement("div");
    element.className = "block";

    // block position and stylings
    element.style.left = x + "px";
    element.style.top = y + "px";
    element.style.width = width + "px";
    // generate dynamic color
    element.style.background = `hsl(${score *25 % 360}, 70%, 55%)`;

    game.appendChild(element);

    // return object of coordinates of speed and dimension
    return{
        x, y, width, element
    };
}

// function to start a new game
function startGame(){
    // clear game screen when starting
    game.querySelectorAll(".block").forEach(block => {
        block.remove();
    });

    stack = [];
    score = 0;
    speed = startSpeed;
    direction = 1;
    gameRunning = true;

    // hide/show game message
    message.style.display = "none";
    scoreElement.textContent = score;

    // create block that sits on the very bottom layer
    const baseBlock = createBlock(
        (gameWidth - startWidth) / 2,
        startWidth,
        gameHeight()
    );

    // add block to game screen
    // start game animation
    stack.push(baseBlock);
    createNextBlock();
    animationId = requestAnimationFrame(gameLoop);
}

// function for y coordinate of base
function gameHeight(){
    return 600 - blockHeight;
}

// create a new game block
function createNextBlock(){
    // get block on top
    const top = stack[stack.length - 1];
    // create new block above previous one
    currentBlock = createBlock (0, top.width, top.y - blockHeight);
    // move its position to the left of game screen
    currentBlock.x = 0;
    currentBlock.element.style.left = "0px";
}

// continuous running game loop
function gameLoop(){
    // check game no longer in progress
    if (!gameRunning) return;
    // move the game block
    currentBlock.x += speed * direction;
    currentBlock.element.style.left = currentBlock.x + "px";
    // update block position
    if(currentBlock.x + currentBlock.width >= gameWidth){
        direction = -1;
    }
    if(currentBlock.x <= 0){
        direction = 1;
    }
    // game loop animation
    animationId = requestAnimationFrame(gameLoop);
}

// control block movement
function moveBlock(){
    // move block horizontally
    currentBlock.x += speed * direction;
    // check if block goes beyond the game wall on right side
    // then move left
    if (currentBlock.x + currentBlock.width >= gameWidth){
        currentBlock.x = gameWidth - currentBlock.width;
        direction = -1;
    }
    // check if block goes beyond the game wall on left side
    // then move right
    if (currentBlock.x <= 0){
        currentBlock.x = 0;
        direction = -1;
    }
    // update the coordinate
    currentBlock.element.style.left = currentBlock.x + "px";
}

// drop block on the block stack below it
function dropBlock(){
    // game currently in progress
    if (!gameRunning) return;

    // use top block as the reference
    const previous = stack[stack.length - 1];

    // coordinates of current and previous game blocks
    const currentLeft = currentBlock.x;
    const currentRight = previous.x + previous.width;

    const previousLeft = previous.x;
    const previousRight = previous.x + previous.width;

    // calculate when game block overlap whien dropped
    const overlapLeft = Math.max(currentLeft, previousLeft);
    const overlapRight = Math.min(currentRight, previousRight);
    const overlapWidth = overlapRight - overlapLeft;

    // no overlap means end game
    if (overlapWidth <= 0){
        endGame();
        return;
    }

    // trim block to match with only overlapped portion
    currentBlock.x = overlapLeft;
    currentBlock.width = overlapWidth;

    currentBlock.element.style.left = overlapLeft + "px";
    currentBlock.element.style.width = overlapWidth + "px";

    // push the block on game stack
    stack.push(currentBlock);

    // update the score
    // increase game difficulty
    score++;
    scoreElement.textCont
    ent = score;
    speed += 0.25
    // not allow stack to become too tall
    if (stack.length > 12){
        moveStack();
    }
    // next game block
    createNextBlock();
}

function moveStack(){
    for(const block of stack){
        block.y += blockHeight;
        block.element.style.top = block.y + "px";
    }
    currentBlock.y += blockHeight;
    currentBlock.element.style.top = currentBlock.y + "px";
}

function endGame(){
    gameRunning = false;
    cancelAnimationFrame(animationId);
    finalScore.textContent = score;
    message.style.display = "flex";
}

function restartGame(){
    startGame();
}

document.addEventListener("keydown", event => {
    if (event.code === "Space"){
        event.preventDefault();
        dropBlock();
    }
});

game.addEventListener("click", () => {
    dropBlock();
});

startGame();
