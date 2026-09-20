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

// store all individual process
const processList = new ProcessList();

function addProcess(){
    // get reference to the html elements
    const pid = document.getElementById("id").value.trim();
    const arrival = document.getElementById("arrival").value;
    const burst = document.getElementById("burst").value;
    // fundamental user input validation
    if (pid === "" || arrival < 0 || burst <= 0){
        alert("Sorry, cannot process the process!!");
        return;
    }
    // convert to array 
    const processes = processList.toArray();
    // handle duplicate process
    if (processes.some(p => p.pid === pid)){
        alert("Sorry, duplicate process not allowed!!");
        return;
    }
    // create new process node and add to list
    const process = new ProcessNode(pid, arrival, burst);
    processList.add(process);
    displayProcess();
    // clear fields for new input
    document.getElementById("id").value = "";
    document.getElementById("arrival").value = "";
    document.getElementById("burst").value = "";
}

// show the process on the webpage
function displayProcess(){
    const table = document.getElementById("processTable");
    table.innerHTML = "";
    let currentNode = processList.head;
    // iterate and add row to table
    while (currentNode !== null){
        table.innerHTML += `
            <tr>
                <td>${currentNode.pid}</td>
                <td>${currentNode.arrivalTime}</td>
                <td>${currentNode.burstTime}</td>
                <td>
                    <button onclick="deleteProcess('${currentNode.pid}')"></button>
                </td>
            </tr>`;
        currentNode = currentNode.next;
    }
}

// delete process using id reference
function deleteProcess(pid){
    processList.remove(pid);
    displayProcess();
}

// first come first serve (FCFS) implementation
function runFCFS(){
    let processes = processList.toArray();
    // process are in list
    if (processes.length === 0){
        alert("Sorry, no process to run!!");
        return;
    }
    // sort using time
    // which ever is earliest gets serve first
    processes.sort(function(a, b){
        return a.arrivalTime - b.arrivalTime
    });
    let currentTime = 0;
    // store time values
    let gantt = [];
    // iterate sorted items
    processes.forEach(function(process){
        // waiting for next process to arrive
        if (currentTime < process.arrivalTime){
            gantt.push({
                pid: "Idle",
                start: currentTime,
                end: process.arrivalTime
            });
            currentTime = process.arrivalTime;
        }
        // time which process execute
        const startTime = currentTime;
        currentTime = currentTime + process.burstTime;
        // scheduling time calculations
        process.completionTime = currentTime;
        // total time taken
        process.turnAroundTime = process.completionTime - process.arrivalTime;
        // total waiting time
        process.waitTime = process.turnAroundTime - process.burstTime;
        // visualizing time details
        gantt.push({
            pid: process.pid,
            start: startTime,
            end: currentTime
        });
    });
    displayGantt(gantt);
    displayResult(processes);
}

// display process gantt chart
function displayGantt(gantt){
    const container = document.getElementById("gantt");
    container.innerHTML = "";
    // iterate every process
    gantt.forEach(function(block){
        // create and add styling to div element
        const div = document.createElement("div");
        div.className = "process";
        // display process detail
        div.innerHTML += `<strong>${block.pid}</strong>
                        <div class="time">
                            ${block.start} -> ${block.end}
                        </div>`;
        // add newly created process
        container.appendChild(div);
    });
}

// function to show process result
function displayResult(processes){
    const table = document.getElementById("resultTable");
    table.innerHTML = "";
    // variables for time calculation
    let totalWT = 0;
    let totalTAT = 0;
    // iterate every process
    processes.forEach(function(process){
        // add time
        totalWT += process.waitTime;
        totalTAT += process.turnAroundTime;
        // create new row with the results
        table.innerHTML += `
                        <tr>
                            <td>${process.pid}</td>
                            <td>${process.arrivalTime}</td>
                            <td>${process.burstTime}</td>
                            <td>${process.completionTime}</td>
                            <td>${process.turnAroundTime}</td>
                            <td>${process.waitTime}</td>
                        </tr>`;
    });
    // average time variables
    const averageWT = totalWT / processes.length;
    const averageTAT = totalTAT / processes.length;
    // display average time variables
    document.getElementById("average").innerHTML += `Average Wait Time: ${averageWT.toFixed(3)}
                                                    <br/> Average Turn-Around Time : ${averageTAT.toFixed(3)}`;
}

// function to clear all process
function clearAll(){
    // clear the list
    processList.clear();
    // clear all the content
    document.getElementById("processTable").innerHTML = "";
    document.getElementById("resultTable").innerHTML = "";
    document.getElementById("gantt").innerHTML = "";
    document.getElementById("average").innerHTML = "";
}