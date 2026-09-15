class Queue{
    // initialize constructor to store the elements
    constructor(){
        this.items = [];
    }
    // add element at start of array
    enqueue(customer){
        this.items.push(customer);
    }
    // element added to start (priority)
    enqueuePriority(customer){
        this.items.unshift(customer);
    }
    dequeue(){
        // if there is nothing to remove
        if (this.isEmpty()){
            return null;
        }
        // remove oldest element from the array
        return this.items.shift();
    }
    // see the last element in the array
    peek(){
        // empty array
        if (this.isEmpty()){
            return null;
        }
        // element to be removed next
        return this.items[this.items.length - 1];
    }
    // true/false on whether array empty or not
    isEmpty(){
        return this.items.length === 0;
    }
    // total elements currently in array
    size(){
        return this.items.length;
    }
    // clear the array
    clear(){
        this.items = [];
    }
}

// instance of class
const queue = new Queue();
// unique number to be assigned to each customer
let tokenNumber = 1;

// add regular customer
function addCustomer(){
    // get reference to html element
    const nameInput = document.getElementById("name");
    const name = nameInput.value.trim();
    // validate name field
    if (name === ""){
        alert("Sorry, name cannot be empty.");
        return;
    }
    // customer object with repsective field assignments
    const customer = {
        token: tokenNumber++,
        name: name,
        priority: false
    };
    // add customer to queue
    queue.enqueue(customer);
    // reset to blank for next entry
    nameInput.value = "";
    // show updated queue on page
    displayQueue();
}

// add priority customer (at front of queue)
function addPriorityCustomer(){
    const nameInput = document.getElementById("name");
    const name = nameInput.value.trim();

    if (name === ""){
        alert("Sorry, name cannot be empty.");
        return;
    }
    // customer object with priority true
    const customer = {
        token: tokenNumber++,
        name: name,
        priority: true
    };
    // add customer at front of queue
    queue.enqueuePriority(customer);
    nameInput.value = "";
    displayQueue();
}

function serveCustomer(){
    
}