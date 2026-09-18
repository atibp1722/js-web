// queue configuration related variables
const capacity = 8;
let queue = new Array(capacity);
let front = 0;
let rear = 0;
let count = 0;
// factory simulator related variables
let money = 100;
let produced = 0;
let productId = 1;
let autoTimer = null;
let processng = false;

// check if queue in maximum capacity
function isFull(){
    return count === capacity;
}
// check if queue empty
function isEmpty(){
    return count === 0;
}

// add new element to the queue
function enqueue(product){
    // check queue overflow
    if (isFull()){
        log("❌ Queue already full!!");
        return false;
    }
    // place element at rear position
    queue[rear] = product;
    // use modulus such that it comes to 0 when capacity limit reaached
    rear = (rear + 1) % capacity;
    // increase counter
    count++;
    return true;
}
// remove element from queue
function dequeue(){
    // check queue underflow
    if (isEmpty()){
        return null;
    }
    // get element at front of queue
    const product = queue[front];
    // clear any reference to the position
    queue[front] = undefined;
    // sue modulus to circle back to 0 when capacity limit reached 
    front = (front + 1) % capacity;
    // decrease counter
    count--;
    return product;
}

