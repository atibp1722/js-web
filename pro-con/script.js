// user topic submission function
function submitTopic(){
    // get the elements through their id
    const topicInput = document.getElementById("topicInput");
    const topic = topicInput.value.trim();

    // basic validation if topic field empty
    if(topic===""){
        alert("Sorry, topic cannot be empty.");
        return;
    }
    // show and hide the appropiate sections
    document.getElementById("topicSection").style.display = "none";
    document.getElementById("appContent").style.display = "block";
    // show the title entered by user
    document.getElementById("topicTitle").style.display = topic;
}

// function to add new item
function addItem(type){
    const input = document.getElementById("itemInput");
    const text = input.value.trim();

    // stop function if empty
    if(text==="") return;
    // display item on page
    renderItem(text, type);
    // clear inout box
    input.value="";
    updateScore();
}

// function to display new item on the page
function renderItem(text, type){
    const li = document.createElement("li");
    li.textContent = text;
    // create a new delete button
    const deleteBtn = document.createElement("button");

    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");

    // code when button cliked
    deleteBtn.onclick = () => {
        li.remove();
        updateScore();
    };
    // add delete button inside <li> element
    li.appendChild(deleteBtn);
    // add new item to the matching list
    document.getElementById(type+"List").appendChild(li);
}

// function to update score 
function updateScore(){
    // count items inside each list
    const proCount = document.getElementById("prosList").children.length();
    const conCount = document.getElementById("consList").children.length();
    const scoreboard = document.getElementById("scoreboard");

    // default verdict
    let verdict = "You Decide";

    // condition for which side win/loss or tie 
    if (proCount > conCount) verdict = "Pro side wins!";
    else if (conCount > proCount) verdict = "Con side wins!";
    else if (proCount === conCount) verdict = "It's a tie!";

    // dispaly score and verdict
    scoreboard.innerHTML = `Pros: ${prosCount}| Cons: ${consCount}<br> ${verdict}`
}