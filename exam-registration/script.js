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

// function to validate user uploaded files
function validateFile(file, required=false){
    if (!file){
        if (required){
            showMessage("Please upload the document.", "error");
            return false;
        }
        return true;
    }
    // allowed file types
    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowed.includes(file.type)){
        showMessage(`${file.name}: JPEG, PNG or PDF file formats are allowed.`, "error");
        return false;
    }
    // check upoladed file meets limit
    if (file.size > MAX_FILE_SIZE){
        showMessage(`${file.name}: File cannot be more than 250kb.`, "error");
        return false;
    }
    return true;
}

// function to convert file to base64 object
function fileToBase64(file){
    return new Promise((resolve, reject) => {
        if (!file){
            resolve(null);
            return;
        }
        // new instance to read file
        const reader = new FileReader();
        reader.onload = () => {
            resolve({
                name: file.name,
                type: file.type,
                size: file.size,
                data: reader.result
            });
        };
        // rejected
        reader.onerror = () => {
            reject("File cannot be read.");
        }; 
    });
}

// function to validate user form input
function validateForm(){
    // get reference to html elements
    const name = document.getElementById("studentName").value.trim();
    const symbol = document.getElementById("symbolNo").value.trim();
    const program = document.getElementById("program").value;
    const semester = document.getElementById("semester").value;
    const phone = document.getElementById("phone").value.trim();
    const examType = document.getElementById("examType").value;
    const selected = document.querySelectorAll("#subjectList input:checked");
    // check for empty and display error message
    if (!name){
        showMessage("Please add your name.", "error");
        return false;
    }
    if (!symbol){
        showMessage("Please add symbol no.", "error");
        return false;
    }
    if (!program){
        showMessage("Please add course of study.", "error");
        return false;
    }
    if (!semester){
        showMessage("Please add your semester.", "error");
        return false;
    }
    // validate Nepal mobile number
    if (!/^07|98\d{8}$/.test(phone)){
        showMessage("Please enter valid Nepal phone number.", "error");
        return false;
    }
    if (!examType){
        showMessage("Please select exam type.", "error");
        return false;
    }
    if (selected.length === 0){
        showMessage("Please select atleast 1 subject.", "error");
        return false;
    }
    return true;
}
// trigger when exam registration for submitted
document.getElementById("examForm").addEventListener("submit", async function(event){
    event.preventDefault();
    if (!validateForm()){
        return;
    }
    // get file input using reference to html elements
    const photo = document.getElementById("photo").files[0];
    const citizenship = document.getElementById("citizenship").files[0];
    const gradesheet = document.getElementById("gradesheet").files[0];
    const character = document.getElementById("character").files[0];
    // validate the files
    if (!validateFile(photo, true)){
        return;
    }
    if (!validateFile(citizenship, true)){
        return;
    }
    if (!validateFile(gradesheet, true)){
        return;
    }
    if (!validateFile(character, true)){
        return;
    }
    // convert all files to base64
    const uploadDocuments = {
        photo: await fileToBase64(photo),
        citizenship: await fileToBase64(citizenship),
        gradesheet: await fileToBase64(gradesheet),
        character: await fileToBase64(character)
    }
    // get subjects selected by user
    const selectedSubjects = [];
    document.querySelectorAll("#subjectList input:checked").forEach(input => {
        selectedSubjects.push(input.value);
    });
    // registration object with all details
    const registration = {
        id: Date.now(),
        studentName: document.getElementById("studentName").value.trim(),
        symbolNo: document.getElementById("symbolNo").value.trim(),
        program: document.getElementById("program").value,
        dob: document.getElementById("dob").value,
        phone: document.getElementById("phone").value.trim(),
        email: document.getElementById("email").value.trim(),
        examType: document.getElementById("examType").value,
        subjects: selectedSubjects,
        documents: uploadDocuments,
        fee: selectedSubjects.length * FEE_PER_SUBJECT,
        status: "Pending",
        adminRemark: "",
        approvedAt: null,
        entranceCardNo: null,
        registeredAt: new Date().toLocaleString("en-NP")
    };
    // get registrations from borwser storage else return empty array
    let registrations = JSON.parse(localStorage.getItem("registrations") || []);
    registrations.push(registration);
    // save registrations to borwser storage
    try{
        localStorage.setItem("registrations", JSON.stringify(registrations));
    } catch(error){
        showMessage("Unable to save student registration.", "error");
        return;
    }
    // successful registration reset the fields and display list
    showMessage("Application has been successfully submitted.", "success");
    displayRegistrations();
    this.reset();
    document.getElementById("subjectList").innerHTML = "<p>Please select course of study first.</p>";
    calculateFee();
});

// function for messages whether success or error
function showMessage(message, type){
    const box = document.getElementById("message");
    box.style.display = "block";
    box.textContent = message;
    // css styling based on success or error
    if (type === "success"){
        box.style.background = "#dcf0e0";
        box.style.color = "#155724";
    } else{
        box.style.background = "#f6d7da";
        box.style.color = "#831923";
    }
    // hide message after 3s
    setTimeout(() => {
        box.style.display = "none";
    }, 3000);
}   