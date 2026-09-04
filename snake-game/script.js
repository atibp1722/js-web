// get canvas and use context to 2d context render
const canvas = document.getElementById("game")
const ctx = canvas.getContext('2d');

// let snake refresh 7 times per second
let speed = 7;

// variables for positioning and size
let tileCount = 20;
let tileSize = canvas.width/tileCount - 2;
let headX= 10;
let headY = 10;

// control snake movement
let xVelocity = 0;
let yVelocity = 0;

// game loop
function drawGame(){
    clearScreen();
    changeSnakePosition();
    drawSnake();
    setTimeout(drawGame, 1000/speed);
}

function clearScreen(){
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake(){
    // put the snake in the middle of the canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(headX*tileCount, headY*tileCount, tileSize, tileSize);
}

function changeSnakePosition(){
    // move the snake horizontally (left/right)
    // 1: move right
    // -1: move left
    headX = headX + xVelocity;
    // move the snake vertically (up/down)
    // 1: move down
    // -1: move up
    headX = headY + yVelocity;
}

document.body.addEventListener("keydown", keyDown);

// function to listen to key pressed
function keyDown(event){
    // up arrow pressed
    if(event.keyCode == 38){
        // move up
        yVelocity = -1;
        // stop horizontal movement
        xVelocity = 0;
    }
    // down arrow pressed
    if(event.keyCode == 40){
        yVelocity = 1;
        xVelocity = 0;
    }
    // left arrow pressed
    if(event.keyCode == 37){
        // stop vertical movement
        yVelocity = 0;
        // move left
        xVelocity = -1;
    }
    // right arrow pressed
     if(event.keyCode == 39){
        yVelocity = 0;
        xVelocity = 1;
    }

}

drawGame();