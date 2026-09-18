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
let processing = false;

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

// add new element to the queue
function addProduct(){
    // define object with its key value pairings
    const product = {
        id: productId++,
        time: Date.now(),
        value: Math.floor(Math.random() * 45) + 15
    };
    // add element to the queue
    if (enqueue(product)){
        // simulate cost deduction
        money -= 5;
        // log info regarding element
        log(
            `📦 Product #${product.id} at slot ` + 
            `${(rear - 1 + capacity) % capacity}`
        );
        // refresh webpage for changes to take ffect
        render();
    }
}

// take element from queue and processing simulation
// updated every 250ms
function processProduct(){
    // check busy or not
    if (processing){
        log("⚠️ Machine is already working.");
        return;
    }
    // get next element from queue
    const product = dequeue();
    if (!product){
        log("🚨 No products in queue.");
        return;
    }
    // change status and show message
    processing = true;
    document.getElementById("machineStatus").textContent = `Processing Product #${product.id}`;
    // simulate timer based process
    let progress = 0;
    const interval = setInterval(() => {
        progress += 20;
        document.getElementById("progress").textContent = `Progress: ${progress}`;
        // simulate progress reached 100%
        if (progress >= 100){
            clearInterval(interval);
            // free processor
            processing = false;
            // increment counter
            produced++;
            // increment amount
            money += product.value;
            // details regarding above completion
            document.getElementById("machineStatus").textContent = `Finished Product #${product.id}`;
            document.getElementById("progress").textContent = `+ रु${product.value}`;
            log(
                `✅ Product #${product.id} completed ` + 
                `(+${product.value}रु)`
            );
            render();
        }
    }, 250);
    // update webpage when processing function begins
    render();
}

// auto production sim start
function autoProcess(){
    // prevent duplicate interval
    if (autoTimer) return;
    log("▶️ Auto production started!!");
    // set interval every 1.5s
    autoTimer = setInterval(() => {
        // verify if processing and elements in queue are valid
        if (!processing && !isEmpty()){
            processProduct();
        }
    }, 1500);
}

// auto production sim stop
function stopAuto(){
    // clear timer
    clearInterval(autoTimer);
    // reset variable
    autoTimer = null;
    log("⏹️ Auto production stopped!!")
}