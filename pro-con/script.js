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

