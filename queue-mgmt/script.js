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

// process and remove customer from queue
function serveCustomer(){
    // get customer front of queue
    const customer = queue.dequeue();
    // check if no customer in queue
    if (customer === null){
        alert("No one to serve, empty queue!!");
        return;
    }
    // show which customer was just served
    document.getElementById("served").textContent = `Served: ${customer.name} (Token ${customer.token})`;
    displayQueue();
}

// clear the queue
function clearQueue(){
    // clear all items from queue
    queue.clear();
    displayQueue();
    // update the page 
    document.getElementById("served").textContent = "Queue now clear!!";
}

function displayQueue(){
    // get reference to the html element
    const queueList = document.getElementById("queueList");
    queueList.innerHTML = "";
    // iterate every customer in array
    queue.items.forEach(function(customer, index){
        // new <li> element for customer
        const li = document.createElement("li");
        // check if customer is priority
        if(customer.priority){
            // custom style for priority
            li.classList.add("priority");
            li.textContent = `🚨 Priority | Position ${index + 1} | Token ${customer.token} | ${customer.name}`;
        } else{
            // normal customer
            li.textContent = `Position ${index + 1} | Token ${customer.token} | ${customer.name}`
        }
        // append it to DOM
        queueList.appendChild(li);
    });
    // number of customers in queue
    document.getElementById("queueSize").textContent = `Queue Size: ${queue.size()}`;
    // look at next customer without removing it
    const nextCustomer = queue.peek();
    // if customer is in queue
    if (nextCustomer !== null){
        // if the person has priority
        if (nextCustomer.priority){
            document.getElementById("next").textContent = `Next Customer: 🚨 ${nextCustomer.name} (Priority)`;
        } else{
            document.getElementById("next").textContent = `Next Customer: ${nextCustomer.name}`;
        }
    } else{
        // queue is empty
        document.getElementById("next").textContent = "Next Customer: NONE";
    }
}

displayQueue();