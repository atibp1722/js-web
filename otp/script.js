// varaibles for otp
const STATE = {
    otp: null,
    createdAt: null,
    expireAt: null,
    attempts: 3,
    used: false,
    timer: null
};
// select dom elements using id
const $ = id => document.getElementById(id);
// get reference to dom elements
const lengthSelect = $("length");
const expireSelect = $("expiry");
const generateBtn = $("generate");
const verifyBtn = $("verify");
const otpInput = $("otpInput");
const otpDisplay = $("otpDisplay");
const timer = $("timer");
const status = $("status");
const attemptText = $("attemptText");

// function for generate secure random number
function secureRandom(max){
    const array = new Uint32Array(1);
    // browser security API
    crypto.getRandomValues(array);
    return array[0] % max;
}

// function for generate otp based on random numbers above
function generateOtp(length){
    let otp = "";
    for (let i=0; i<length; i++){
        // random digit append
        otp += secureRandom(10);
    }
    return otp;
}

// function for success or error status message
function showStatus(message, type){
    status.textContent = message;
    status.className = `status${type}`;
}
// function for clear the status message
function clearStatus(){
    status.textContent = "";
    status.className = "status";
}
// function for reset values on the webpage 
function resetStatus(){
    clearInterval(STATE.timer);
    STATE.otp = null;
    STATE.createdAt = null;
    STATE.expireAt = null;
    STATE.attempts=  3;
    STATE.used = false;
    attemptText.textContent = STATE.attempts;
    timer.textContent = "No OTP currently active."
    otpDisplay.textContent = "-----------------";
    otpInput.value = "";
    verifyBtn.disabled = false;
}

// function for generate new otp
function generateNewOtp(){
    clearInterval(STATE.timer);
    clearStatus();
    const length = Number(lengthSelect.value);
    const expireSecs = Number(expireSelect.value);
    // update variables with new info
    STATE.otp = generateOtp(length);
    STATE.createdAt = Date.now();
    STATE.expireAt = STATE.createdAt + expireSecs * 1000;
    STATE.attempts=  3;
    STATE.used = false;
    // dispplay new updated info on webpage
    otpDisplay.textContent = STATE.otp;
    attemptText.textContent = STATE.attempts;
    otpInput.value = "";
    // put cursor on input field
    otpInput.focus();
    // call function to start timer
    startTimer();
}

// function for countdown timer
function startTimer(){
    updateTimer();
    // refresh every 250ms
    STATE.timer = setInterval(() => {
        updateTimer();
    }, 250);
}
// function for update timer during countdown
function updateTimer(){
    if (!STATE.expireAt) return;
    // time remaining till countdown over
    const timeRemaining = STATE.expireAt - Date.now();
    // check time expired
    if (timeRemaining <= 0){
        // stop timer
        clearInterval(STATE.timer);
        timer.textContent = "OTP expired!!";
        // activate disable button
        verifyBtn.disabled = true;
        showStatus("OTP expired, please generate new one.", "error");
        return;
    }
    const secs = Math.ceil(timeRemaining / 1000);
    timer.textContent = `Expires in ${secs} seconds${secs === 1 ? "" : "s"}`;
}