// process information
class ProcessNode{
    constructor(pid, arrivalTime, burstTime){
        this.pid = pid;
        this.arrivalTime = arrivalTime;
        this.burstTime = burstTime;
        // timing variables
        this.completionTime = 0;
        this.turnAroundTime = 0;
        this.waitTime = 0;
        // pointer to next node
        this.next = null;
    }
}

// manage nodes in a list
class ProcessList{
    constructor(){
        // pointer to first node in list
        this.head = null;
        // pointer to last node in list
        this.tail = null;
    }
    // add new process at end of list
    add(process){
        if (this.head === null){
            // empyty list
            // new node is both head and tail
            this.head = process;
            this.tail = process;
        } else{
            // element already in list
            // put node at tail and update tail pointer
            this.tail.next = process;
            this.tail = process;
        }
    }
    // remove a particular process
    remove(pid){
        let currentNode = this.head;
        let previousNode = null;

        while(currentNode !== null){
            if (currentNode.pid === pid){
                if (previousNode === null){
                    // remove head node
                    this.head = currentNode.next;
                }
                else{
                    // remove node at tail or arbitary position
                    previousNode.next = currentNode.next;
                }
                // update tail pointer if node deleted was last
                if (currentNode === this.tail){
                    this.tail = previousNode;
                }
                return;
            }
            previousNode = currentNode;
            currentNode = currentNode.next;
        }
    }
    // list to an array
    // move until list ends
    // add current to array and move to next node
    toArray(){
        let array = [];
        let currentNode = this.head;

        while (currentNode !== null){
            array.push(currentNode);
            currentNode = currentNode.next;
        }
        return array;
    }
    // clear all the nodes
    clear(){
        this.head = null;
        this.tail = null;
    }
}

const processList = new ProcessList();

function addProcess(){
    // get reference to the html elements
    const pid = document.getElementById("id").value.trim();
    const arrival = document.getElementById("arrival").value;
    const burst = document.getElementById("burst").value;

    if (pid === "" || arrival < 0 || burst <= 0){
        alert("Sorry, cannot process the process!!");
        return;
    }

    const processes = processList.toArray();

    if (processes.some(p => p.pid === pid)){
        alert("Sorry, duplicate process not allowed!!");
        return;
    }

    const process = new ProcessNode(pid, arrival, burst);
    processList.add(process);
    displayProcess();

    document.getElementById("id").value = "";
    document.getElementById("arrival").value = "";
    document.getElementById("burst").value = "";
}
