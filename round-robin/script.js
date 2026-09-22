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

// function for round robin implementation
function roundRobin(){
    clock++;
    // time quantum must be atleast 1 to remain valid
    const quantum = Math.max(1, parseInt(document.getElementById("quantum").value) || 1);
    // assign jobs to idle machines
    for (const machine of machines){
        // machine free and no jobs in queue
        if (machine.job === null && queue.length > 0){
            // shift to next job 
            machine.job = queue.shift;
            // reset counter
            machine.quantUsed = 0;
            // job being processed for first time
            const job = machine.job
            if (job.start === null){
                // store job time
                job.start = clock;
                logActivity(`${job.name} started on machine ${machine.id}`);
            } else{
                // resume normally if not first
                logActivity(`${job.name} resumed on machine ${machine.id}`);
            }
        }
    }
    // jobs running on machines
    for (const machine of machines){
        // skip if machine idle
        if (machine.job === null){
            continue;
        }
        const job = machine.job;
        // decrease time remaining 
        job.remaining--;
        // increment time taken by current machine
        machine.quantUsed++;
        // job finished processing
        if (job.remaining <= 0){
            // store completion time
            job.finish = clock;
            // move finished job to final array
            completed.push(job);
            logActivity(`${job.name} completed on machine ${machine.id}`);
            // new machine for new job
            machine.job = null;
            machine.quantUsed = 0;
            continue;
        }
        // job has exceeded allocated time
        if (machine.quantUsed >= quantum){
            // push it to end of queue
            queue.push(job);
            logActivity(`${job.name} time expired on machine ${machine.id} -> returned to queue`);
            // free the machineand reset counte
            machine.job = null;
            machine.quantUsed = 0;
        }
    }
    render();
    // check queue empty and all processing finished
    if (queue.length === 0 && machines.every(machine => machine.job === null)){
        // change status
        running = false;
        // clear time references
        clearInterval(timer);
        timer = null;
        logActivity("All process finished, no job in queue.");
        render();
    }
}

function logActiviyt(message){
    activityLog.push({
        time: clock,
        message: message
    });
    if (activityLog.length > 100){
        activityLog.shift();
    }
    renderActivityLog();
}

function renderActivityLog(){
    const element = document.getElementById("activityLog");
    element.innerHTML = activityLog.map(entry => {
        let className = "";
        if (entry.message.includes("completed")){
            className = "complete";
        }
        if (entry.message.includes("quantum expired")){
            className = "warning";
        }
        return `
                <div class="log-entry ${className}">
                    <span class="time">
                        [T = ${entry.time}]
                    </span>
                    ${entry.message}
                </div>`;
    }).join("");

    element.scrollTop = element.scrollHeight;
}
