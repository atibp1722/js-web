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
    "BSC CSIT": ["English", "Physics", "Mathematics", 
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
    if (!subjectList) return;
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
                            ${index + 1}. ${subject}
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
        reader.readAsDataURL(file);
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
    let registrations = JSON.parse(localStorage.getItem("registrations") || "[]");
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
    if (!box) return;
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

// function to display registrations in table
function displayRegistrations(){
    // reference to html element
    const container = document.getElementById("registrationTable");
    const search = document.getElementById("search").value.toLowerCase();
    // get registration records
    let registrations = JSON.parse(localStorage.getItem("registrations") || []);
    // filter by name or symbol number
    registrations = registrations.filter(reg => 
        reg.studentName.toLowerCase().includes(search) || reg.symbolNo.toLowerCase().includes(search)
    );
    // default message
    if (registrations.length === 0){
        container.innerHTML = "<p>No application to show.</p>";
        return;
    }
    // dynamic table for records
    let html = `<table>
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Symbol No.</th>
                            <th>Course</th>
                            <th>Semester</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
               </table>`;
    // iterate for individual row for each regisration rcord
    registrations.forEach(reg => {
        // css styling for status
        const statusClass = reg.status === "Approved" ? "status-approved" : reg.status === "Rejected" ? "status-rejected" : "status-pending";
        html += `<tr>
                    <td>${escapeHTML(reg.studentName)}</td>
                    <td>${escapeHTML(reg.symbolNo)}</td>
                    <td>${escapeHTML(reg.program)}</td>
                    <td>${escapeHTML(reg.semester)}</td>
                    <td><span class="status ${statusClass}">${reg.status}</span></td>
                    <td><button onclick="viewRegistration(${reg.id})">View</button>
                        ${reg.status === "Approved" ? `<button class="success" onclick="showApprovedCard(${reg.id})">
                        Entrance Card</button>` : ""}
                    </td>
                </tr>`;
    });
    html += `</tbody>
            </table>`;
    // add table to the container
    container.innerHTML = html;
}

// function to see registered records and load id card for approved
function viewRegistration(id){
    const registrations = JSON.parse(localStorage.getItem("registrations") || []);
    // each record has unique id
    const reg = registrations.find(item => item.id === id);
    if (!reg) return;
    let message = `Student: ${reg.studentName}
                   Symbol No: ${reg.symbolNo}
                   Program: ${reg.program}
                   Semester: ${reg.semester}
                   Exam Type: ${reg.examType}
                   Status: ${reg.status}
                   Subjects: ${(reg.subjects || []).join("\n")}`;
    if (reg.adminComment) {
        message += `Admin Comment: ${reg.adminComment}`;
    }
    if (reg.status === "Approved"){
        message += `Entrance Card: ${reg.entranceCardNo}
                    Approved At: ${reg.approvedAt}`;
    }
    alert(message);
    // smooth scroll action if entrance card is approved
    if (reg.status === "Approved"){
        generateEntranceCard(reg);
        document.getElementById("entranceCard").scrollIntoView({behavior: "smooth"});
    }
                    
}

// function to validate admin credentials
function adminLogin(){
    // reference from html elements
    const username = document.getElementById("adminUsername").value;
    const password = document.getElementById("adminPassword").value;
    // save login satte in session
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD){
        // show panel
        sessionStorage.setItem("adminLoggedIn", "true");
        document.getElementById("adminPanel").classList.remove("hidden");
        // populate application list
        displayAdminApplications();
        showMessage("Successful admin login.", "success");
    } else{
        showMessage("Invalid login credentials.", "error");
    }
}

// function logout admin
function adminLogout(){
    // clear data and hide panel
    sessionStorage.removeItem("adminLoggedIn");
    document.getElementById("adminPanel").classList.add("hidden");
    document.getElementById("adminUsername").value="";
    document.getElementById("adminPassword").value="";
}

// function to display admin panel with applications
function displayAdminApplications(){
    // check login
    if (sessionStorage.getItem("adminLoggedIn") !== true){
        return;
    }
    const container = document.getElementById("adminApplications");
    if (!container) return;
    let registrations = JSON.parse(localStorage.getItem("registrations") || []);
    const pending = registrations.filter(reg => reg.status === "Pending");
    // update pending count
    document.getElementById("pendingCount").textContent = pending.length;
    if (registrations.length === 0){
        container.innerHTML = "<p>No applications to show.</p>";
        return;
    }
    let html = `<table>
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Symbol No.</th>
                            <th>Course</th>
                            <th>Semester</th>
                            <th>Documents</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                </table>`;
    registrations.forEach(reg => {
        const statusClass = reg.status === "Approved" ? "status-approved" : reg.status === "Rejected" ? "status-rejected" : "status-pending";
        html += `<tr>
                    <td>${escapeHTML(reg.studentName)}</td>
                    <td>${escapeHTML(reg.symbolNo)}</td>
                    <td>${escapeHTML(reg.program)}</td>
                    <td>${escapeHTML(reg.semester)}</td>
                    <td><button onclick="viewDocuments(${reg.id}">View Documents</button></td>
                    <td><span class="status ${statusClass}">${reg.status}</span></td>
                    <td>
                        ${reg.status === "Pending" ? `<button class="status" onclick="approveApplication(${reg.id}">Approve</button>
                        <button class="danger" onclick="rejectApplication(${reg.id}">Reject</button>` : 
                        `<button onclick="adminViewApplication(${reg.id}">View</button>`}
                    </td>
                </tr>`;
    })
    html += `</tbody>
            </table>`;
    container.innerHTML = html;
}

// function for admin to view applications
function adminViewApplication(id){
    const registrations = JSON.parse(localStorage.getItem("registrations") || []);
    const reg = registrations.find(item => item.id === id);
    if (!reg) return;
    alert(`Student: ${reg.studentName}
           Symbol No: ${reg.symbolNo}
           Program: ${reg.program}
           Semester: ${reg.semester}
           Exam Type: ${reg.examType}
           Status: ${reg.status}
           Admin Comment: ${reg.adminComment || "None"}
           Entrance Card: ${reg.entranceCardNo || "None"}`);
}

// function for admin to view uploaded documents
function viewDocuments(id){
    const registrations = JSON.parse(localStorage.getItem("registrations") || []);
    const reg = registrations.find(item => item.id === id);
    if (!reg || !reg.documents){
        alert("No documents uploaded.");
        return;
    }
    const content = document.getElementById("adminApps");
    let html = `<div class="document-box">
                    <h3>Documents: ${escapeHTML(reg.studentName)}</h3>`;
    // iterate each document type object
    Object.entries(reg.documents).forEach(([type, file]) => {
        if (!file) return;
        html += `<div class="document-box">
                    <strong>${formatDocumentName(type)}</strong>
                    <p>File: ${escapeHTML(file.name)}</p>
                    <p>Size: ${escapeHTML(file.size)}</p>
                    <div class="document-actions">
                        <a href="${file.data}" target="_blank"><button>View</button></a>
                    </div>`;
        // add previews if type is image
        if (file.type.startsWith("image/")){
            html += `<img src="${file.data}" alt="${escapeHTML(file.name)}">`;
        }
        html += `</div>`;
                
    });
    html += `<button class="secondary" onclick="displayAdminApplications()">Close</button>
        </div>`;
    // put the view box at top of container
    content.insertAdjacentElement("afterbegin", html)
}

// function to approve student application
function approveApplication(id){
    // check admin login
    if (sessionStorage.getItem("adminLoggedIn") !== true){
        alert("Admin login is needed.");
        return;
    }
    // get all registrations
    let registrations = JSON.parse(localStorage.getItem("registrations") || []);
    const registration = registrations.find(reg => reg.id === id);
    // exit if none found or not in pending status
    if (!registration) return;
    if (registration.status !== "Pending") return;
    // prompt admin for approve confirmation
    const cofirmApproval = confirm(`Approve registration for ${registration.studentName}?`);
    if (!cofirmApproval) return;
    // update the fields
    registration.status = "Approved";
    registration.approvedAt = new Date().toLocaleString("en-NP");
    registration.adminComment = "Application approved.";
    // create new entrace card
    registration.entranceCardNo = "EC" + new Date().getFullYear() + "-" + String(registration.id).slice(-6);
    // save apporved registration
    localStorage.setItem("registrations", JSON.stringify(registrations));
    alert(`${registration.studentName}'s application is appovied.`);
    // refresh admin panel and applications
    displayAdminApplications();
    displayRegistrations();
    generateEntranceCard(registration);
    // view new entrance id card
    document.getElementById("entranceCard").scrollIntoView({behavior: "smooth"});
}

// function to reject student application
function rejectApplication(id){
    if (sessionStorage.getItem("adminLoggedIn") !== true){
        alert("Admin login is needed.");
        return;
    }
    // prompt admin for rejection reason
    const reason = prompt("Enter reason for rejection: ");
    if (!reason) return;
    let registrations = JSON.parse(localStorage.getItem("registrations") || []);
    const registration = registrations.find(reg => reg.id === id);
    if (!registration) return;
    // update with reason given by admin
    registration.status = "Rejected";
    registration.adminComment = reason;
    localStorage.setItem("registrations", JSON.stringify(registrations));
    alert("Application rejected.");
    // refresh admin panel and registration
    displayAdminApplications();
    displayRegistrations();
}

// function to generate exam entrance card
function generateEntranceCard(reg){
    // check status is approved
    if (reg.status !== "Approved"){
        return;
    }
    // gre reference to html element
    const card = document.getElementById("entranceCard");
    const content = document.getElementById("entranceCardContent");
    // default when no photo uploaded
    let photoHTML = `<div class="student-photo">
                        <div class="photo-placeholder">Photo</div>
                    </div>`;
    // when photo attached convert to base64
    if (reg.documents && reg.documents.photo && reg.documents.photo.data){
        photoHTML += `<div class="student-photo">
                        <img src="${reg.documents.photo.data}" alt="Student Photo">
                      </div>`;
    }
    // dynamic student exam entrance card
    content.innerHTML = `<div class="entrance-card">
                            <div class="card-header">
                                <h1>Annapurna Institute of Technology & Management</h1>
                                <p>Kathmandu, Nepal</p>
                                <h2>Student Entrance Card</h2>
                                <p>Academic Year: 2026/27</p>
                            </div>
                            <div class="approval-stamp">Approved</div>
                            <div class="student-info">
                                <table class="table-info">
                                    <tr>
                                        <td>
                                            <strong>Examination ID</strong>
                                        </td>
                                        <td>
                                            <strong>${reg.entranceCardNo}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>Registration ID</strong>
                                        </td>
                                        <td>
                                            <strong>${reg.id}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>Student Name</strong>
                                        </td>
                                        <td>
                                            <strong>${escapeHTML(reg.studentName)}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>Symbol No.</strong>
                                        </td>
                                        <td>
                                            <strong>${escapeHTML(reg.symbolNo)}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>Course</strong>
                                        </td>
                                        <td>
                                            <strong>${escapeHTML(reg.program)}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>Semester</strong>
                                        </td>
                                        <td>
                                            <strong>${escapeHTML(reg.semester)}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>Exam Type</strong>
                                        </td>
                                        <td>
                                            <strong>${escapeHTML(reg.examType)}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>Approved At</strong>
                                        </td>
                                        <td>
                                            <strong>${escapeHTML(reg.approvedAt)}</strong>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            ${photoHTML}
                        </div>
                        <h3 class="card-title">Subjects</h3>
                        <table class="info-table">
                            <thead>
                                <tr>
                                    <th>SNo.</th>
                                    <th>Subjects</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${(reg.subjects || []).map((subject, index) => `
                                        <tr>
                                            <td>${index + 1}</td>
                                            <td>${escapeHTML(subject)}</td>
                                        </tr>`).join("")}
                            </tbody>
                        </table>
                        <h3 class="card-title">Examination Rules & Regulations</h3>
                        <ol>
                            <li>Students must bring the original entrance card for the duration of the examination.</li>
                            <li>Students must carry valid college identification during the examination.</li>
                            <li>Mobile phones and electronic devices are not permitted, if found student will be expelled from examination.</li>
                            <li>Students must enter examination hall 15 minutes before examination starts.</li>
                            <li>All examination rules must be followed by students, failure to comply will result in strict actions.</li>
                        </ol>
                        <div class="signature-area">
                            <div class="signature">Student Signature</div>
                            <div class="signature">Authorized Officer</div>
                            <div class="signature">Campus Chief</div>
                        </div>
                        <p class="center" style="margin-top: 35px;">
                            <strong>This card is valid for the current examination only.</strong>
                        </p>
                    </div>`;
    // show card on webpage                
    card.classList.remove("hidden");    
}

// function to show approved cards
function showApprovedCard(id){
    const registrations = JSON.parse(localStorage.getItem("registrations") || []);
    const reg = registrations.find(item => item.id === id);
    if (!reg) return;
    // not allow card with status pending
    if (reg.status !== "Approved"){
        alert("Entrance card will be avaiable only after approval.");
        return;
    }
    // gnerate card and scroll to its position
    generateEntranceCard(reg);
    document.getElementById("entranceCard").scrollIntoView({behavior: "smooth"});
}

// function to allow print entrance card
function printEntranceCard(){
    const card = document.getElementById("entranceCard");
    // check container hidden or not
    if (card.classList.contains("hidden")){
        alert("No card to print");
        return;
    }
    // trigger print window
    window.print();
}

// function to reset form content
function resetForm(){
    // clear content from html
    document.getElementById("subjectList").innerHTML = "";
    // reset field values to 0
    document.getElementById("subjectCount").textContent = 0;
    document.getElementById("examFee").textContent = 0;
    document.getElementById("lateFee").textContent = 0;
    document.getElementById("totalFee").textContent = 0;
    // hide message box
    document.getElementById("message").style.display = "none";
}

// function to make file size readable
function formatFileSize(bytes){
    // toggle "B" and "Kb" based on file size
    if (bytes < 1024){
        return bytes + " B";
    }
    return((bytes / 1024).toFixed(1) + " Kb.");
}

// function to make uploaded file more readable
function formatDocumentName(name){
    // key value pair for document titles
    const names = {
        photo: "Passport Size Photo",
        citizenship: "Citizenship/NID",
        gradesheet: "Previous Gradesheet",
        character: "Character Certificate"
    };
    // return empty if no match found
    return(names[name] || name);
}

// function to prevent cross scripting attack
function escapeHTML(value){
    // values to escape from
    return String(value).replace(/&/g, "&amp;")
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;")
                        .replace(/"/g, "&quot;")
                        .replace(/'/g, "&#039;")
}

// display existing registrations
displayRegistrations();

// check admin login cuurently active
if (sessionStorage.getItem("adminLoggedIn") === "true"){
    document.getElementById("adminPanel").classList.remove("hidden");
    displayAdminApplications();
}