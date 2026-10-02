// variable for "admin" credentiald
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "test";
// max file size limit
const MAX_FILE_SIZE = 250 * 1024;

// variables for fee calculation
const FEE_PER_SUBJECT = 300;
const LATE_FEE = 500;

// subjects belonging to each program
const SUBJECTS = {
    "BCA": ["C Programming", "English", "Mathematics", 
           "Digital Logic", "Computer Fundamentals"],
    "BBA": ["Principles of Mgmt", "Professional Accouting", 
           "Economics", "English", "Computer Fundamentals"],
    "BS CSIT": ["English", "Physics", "Mathematics", 
               "C Programming", "Digital Logic"],
    "BBS": ["Accouting", "Business English", "Macroeconomics", 
           "Business Mathematics", "Management Principles"],
    "BIT": ["Introduction to Programming", "Mathematics", 
           "Computer Fundamentals", "Digital Logic", "Technical English"]
};

// load subjects when user toggles various programs
document.getElementById("program").addEventListener("change", loadSubjects);

// function to load subject based on program
function loadSubjects(){
    // get reference to html element
    const program = document.getElementById("program").value;
    const subjectList = document.getElementById("subjectList");
    subjectList.innerHTML = "";
    // check program selected
    if (!program){
        subjectList.innerHTML = "<p>Please select course of study first.</p>";
        calculateFee();
        return;
    }
    // iterate all subjects for chosen program
    SUBJECTS[program].forEach((subject, index) => {
        // create individual element dynamically
        const div = document.createElement("div");
        div.className = "subject";
        // add custom content inside created element
        div.innerHTML = `<label>
                            <input type="checkbox" value=${subject} onchange="calculateFee()">
                            ${index + 1}.${subject}
                        </label>`;
        // add new element to parent
        subjectList.appendChild(div);
    });
    calculateFee();      
}

// function to handle fees
function calculateFee(){
    // get reference to box selected by user
    const selected = document.querySelectorAll("#subjectList input[type='checkbox']:checked");
    // count subjects
    const count = selected.length;
    const examFee = count * FEE_PER_SUBJECT;
    // get current date
    const today = new Date();
    // late fee if date is greater than 20th day of the current month
    const lateFee = today.getDate() > 20 ? LATE_FEE : 0;
    const total = examFee + lateFee;
    // update html elements with updated fees
    document.getElementById("subjectCount").textContent = count;
    document.getElementById("examFee").textContent = examFee;
    document.getElementById("lateFee").textContent = lateFee;
    document.getElementById("totalFee").textContent = total;
}