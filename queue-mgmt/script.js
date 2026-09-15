class Queue{
    // initialize constructor to store the elements
    constructor(){
        this.items = [];
    }
    // add element at start of array
    enqueue(customer){
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