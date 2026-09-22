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
    timer = null;
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
            machine.job = queue.shift();
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

// function log log activities
function logActivity(message){
    // push new object to log
    activityLog.push({
        time: clock,
        message: message
    });
    // remove old logs
    if (activityLog.length > 100){
        activityLog.shift();
    }
    renderActivityLog();
}
// function for activity log UI
function renderActivityLog(){
    // get reference to html element
    const element = document.getElementById("activityLog");
    // map entry to html block
    element.innerHTML = activityLog.map(entry => {
        let className = "";
        // assign new css class for each activity phase
        if (entry.message.includes("completed")){
            className = "complete";
        }
        if (entry.message.includes("time expired")){
            className = "warning";
        }
        // html for individual entry
        return `
                <div class="log-entry ${className}">
                    <span class="time">
                        [T = ${entry.time}]
                    </span>
                    ${entry.message}
                </div>`;
    // join all mapped html blocks
    }).join("");
    // scroll down to show latest entry
    element.scrollTop = element.scrollHeight;
}

// function for render machines in UI 
function renderFactory(){
    // get html reference to the element
    const factory = document.getElementById("factory");
    factory.innerHTML = "";
    // iterate each object in array
    machines.forEach(machine => {
        // create and assign new css class
        const div = document.createElement("div");
        div.className = "machine";
        // active job assigned
        if (machine.job){
            div.classList.add("running");
        }
        // job to determine display in webpage
        if (machine.job){
            // dynamically render card with details
            const job = machine.job;
            div.innerHTML = `
                            <h3>Machine ${machine.id}</h3>
                            <div>
                                <strong>${job.name}</strong>
                            </div>
                            <hr>
                            <div>
                                Time Remaining: ${job.remaining}
                            </div>
                            <div>
                                Time Quantum: ${job.quantUsed}
                            </div>
                            <div>
                                Burst Time: ${job.burst}
                            </div>`;
        // if no job display idle message
        } else{
            div.innerHTML = `
                            <h3>Machine ${machine.id}</h3>
                            <div>
                                ⏳Idle
                            </div>`;
        }
        // add div to parent container
        factory.appendChild(div);
    });
}

// function for render jobs in queue UI
function renderQueue(){
    // get reference to the html element
    const element = document.getElementById("queue");
    // check queue empty
    if (queue.length === 0){
        element.innerHTML = `<div class="empty">Queue currently empty.</div>`;
        return;
    }
    // map each object in array to its individual html block and join
    element.innerHTML = queue.map(job => `
                                        <div class="job">
                                            <strong>${job.name}</strong>
                                            |
                                            Time Remaining: ${job.remaining}
                                            |
                                            Burst Time: ${job.burst}
                                        </div>
                                        `).join("");
}

// function for render all completed jobs in table
function renderComplete(){
    const element = document.getElementById("completed");
    // placeholder when final array empty
    if (completed.length === 0){
        element.innerHTML = `<div class="empty">No completed jobs to show.</div>`;
        return;
    }
    // dynamic table to show details of job
    element.innerHTML = `
                        <table>
                            <tr>
                                <th>Job</th>
                                <th>Burst</th>
                                <th>Arrival</th>
                                <th>Start</th>
                                <th>Finish</th>
                                <th>Turnaround</th>
                                <th>Waiting</th>
                            </tr>
                            ${completed.map(job => {
                                const turnaround = job.finish - job.arrival;
                                const waiting = turnaround - job.burst;
                                return `
                                        <tr>
                                            <td>${job.name}</td>
                                            <td>${job.burst}</td>
                                            <td>${job.arrival}</td>
                                            <td>${job.start}</td>
                                            <td>${job.finish}</td>
                                            <td>${turnaround}</td>
                                            <td>${waiting}</td>
                                        </tr>`;
                            }).join("")
                        }
                        </table>`;
}

// function for render job statistics on webpage
function renderStats(){
    const element = document.getElementById("stats");
    let totalWait = 0;
    let totalTurnaround = 0;
    completed.forEach(job => {
        // iterate all complete jobs for total time
        const turnaround = job.finish - job.arrival;
        const waiting = turnaround - job.burst;
        totalTurnaround += turnaround;
        totalWait += waiting;
    });
    // calculcate average waiting and turnaround time
    const count = completed.length;
    const avgWaiting = count > 0 ? totalWait / count : 0;
    const avgTurnaround = count > 0 ? totalTurnaround / count : 0;
    // machines with active jobs assigned
    const activeMachines = machines.filter(machine => machine.job).length;
    // fill stats on the webpage
    element.innerHTML = `
                        <div class="stat">
                            Time: <strong>${clock}</strong>
                        </div>
                        <div class="stat">
                            Queue Size: ${queue.length}
                        </div>
                        <div class="stat">
                            Active Machines: <strong>${activeMachines} / ${COUNT}</strong>
                        </div>
                        <div class="stat">
                            Jobs Completed: ${count}
                        </div>
                        <div class="stat">
                            Avg. Wait Time: <strong>${avgWaiting.toFixed(2)}</strong>
                        </div>
                        <div class="stat">
                            Avg. Turnaround Time: <strong>${avgTurnaround.toFixed(2)}</strong>
                        </div>`;
}

// function for all events
function render(){
    renderFactory();
    renderQueue();
    renderComplete();
    renderStats();
    renderActivityLog();
}

// initiate machine with jobs
initializeMachines();
// create a job batch
for (let i=0; i<6; i++){
    const burst = Math.floor(Math.random() * 15) + 5;
    const job = createJob("Job "+jobNumber, burst);
    queue.push(job);
}
logActivity("Processing started with 6 jobs");
render();