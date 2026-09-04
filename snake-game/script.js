// get canvas and use context to 2d context render
const canvas = document.getElementById("game")
const ctx = canvas.getContext('2d');

// indiviual snake block taht is to be incremented as game progresses
class SnakePart{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

// let snake refresh 7 times per second
let speed = 7;

// variables for positioning and size
let tileCount = 20;
let tileSize = canvas.width/tileCount - 2;
let headX= 10;
let headY = 10;
// array for snake part
const snakeParts = [];
// initial snake length
let tailLength = 2;

// starting position of the apple
let appleX = 5;
let appleY = 5;

// control snake movement
let xVelocity = 0;
let yVelocity = 0;

// game loop
function drawGame(){
    clearScreen();
    changeSnakePosition();
    checkAppleCollision();
    drawApple();
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

    ctx.fillStyle = 'green';
    // loop through snake and draw additional body
    for(let i=0; i<snakeParts.length; i++){
        let part = snakeParts[i];
        ctx.fillRect(part.x*tileCount, part.y*tileCount, tileSize, tileSize);
    }

    // add current position
    snakeParts.push(new SnakePart(headX, headY));
    // remove if larger than allowed length
    if(snakeParts.length>tailLength){
        snakeParts.shift();
    }
}

function drawApple(){
    ctx.fillStyle = 'red';
    ctx.fillRect(appleX*tileCount, appleY*tileCount, tileSize, tileSize);
}

// check if snake is same tile as apple
function checkAppleCollision(){
    if(appleX===headX && appleY===headY){
        // move apple to a random psition on the canvas
        appleX = Math.floor(Math.random()*tileCount);
        appleY = Math.floor(Math.random()*tileCount);
        tailLength++;
    }
}

function changeSnakePosition(){
    // move the snake horizontally (left/right)
    // 1: move right
    // -1: move left
    headX = headX + xVelocity;
    // move the snake vertically (up/down)
    // 1: move down
    // -1: move up
    headY = headY + yVelocity;
}

document.body.addEventListener("keydown", keyDown);

// function to listen to key pressed
function keyDown(event){
    // up arrow pressed
    if(event.keyCode == 38){
        if(yVelocity == 1)
            return;
        // move up
        yVelocity = -1;
        // stop horizontal movement
        xVelocity = 0;
    }
    // down arrow pressed
    if(event.keyCode == 40){
        if(yVelocity == -1)
            return;
        yVelocity = 1;
        xVelocity = 0;
    }
    // left arrow pressed
    if(event.keyCode == 37){
        if(xVelocity == 1)
            return;
        // stop vertical movement
        yVelocity = 0;
        // move left
        xVelocity = -1;
    }
    // right arrow pressed
     if(event.keyCode == 39){
        if(xVelocity == -1)
            return;
        yVelocity = 0;
        xVelocity = 1;
    }

}

drawGame();