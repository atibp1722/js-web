// configuration settings
const COUNT = 3;
const SPEED = 500;
// variables declaration
let machines = [];
let queue = [];
let completed = [];
let activityLog = [];
// activity related flags
let running = false;
let timer = null;
let clock = 0;
let jobNumber = 1;

// create a job to be assigned
function createJob(name, burst){
    return{
        id: jobNumber++,
        name: name,
        burst: burst,
        remaining: burst,
        arrival: clock,
        start: null,
        finish: null
    };
}

// singular job
function addJob(){
    // generate random burst time
    const burst = Math.floor(Math.random() * 15) + 5;
    // create job object using function
    const job = createJob("Job "+jobNumber, burst);
    // add job to queue
    queue.push(job);
    logActivity(`${job.name} created with burst time ${burst}`);
    // refresh the webpage
    render();
}
// multiple jobs at once
function addMultipleJobs(){
    // iterate to create a batch
    for (let i=0; i<5; i++){
        const burst = Math.floor(Math.random() * 15) + 5;
        const job = createJob("Job "+jobNumber, burst);
        queue.push(job);
        logActivity(`${job.name} created with burst time ${burst}`);
    }
    render();
}

// function to initialize machines
// clear machine array
function initializeMachines(){
    machines = [];
    // create objects for processing
    for (let i=0; i<COUNT; i++){
        machines.push({
            id: i + 1,
            job: null,
            quantUsed: 0
        });
    }
}

// function to start processing process
function startProcess(){
    // if already started
    if (running){
        return;
    }
    // change the state
    running = true;
    logActivity("Processing has been started.");
    // main function trigger
    timer = setInterval(roundRobin, SPEED);
    render();
}

// function to stop processing
function stopProcess(){
    // if already stopped
    if (!running){
        return;
    }
    // change the state
    running = false;
    // clear time reference variables
    clearInterval(timer);
    timer = null;
    logActivity("Processing now stopped.");
    render();
}

// function to reset processing
function resetProcess(){
    // clear time reference and chnage state
    clearInterval(timer);
    timer = false;
    running = false;
    // clear all variable values
    machines = [];
    queue = [];
    completed = [];
    activityLog = [];
    clock = 0;
    jobNumber = 1;
    logActivity("All processing now reset.");
    render();
}