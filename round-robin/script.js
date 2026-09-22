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

