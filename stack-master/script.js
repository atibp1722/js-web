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

    // reurn object of coordinates of speed and dimension
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

function createNextBlock(){

}