// application configuration settings
const MAX_MSG_LENGTH = 100;
// emojis added
const ALLOWED_PATTERN = /^[a-zA-Z0-9\s.,!?@#%&*()_+\-=[\]{};':"\\|<>\/~`^😀😂😍👍🙏🔥❤️🎉😎🤔😢👏💯✨😅🙌]*$/;
const UNSAFE_HTML = /[<>]/g;
// map to store messages
const messageMap = new Map();
// message order queue
const messageQueue = [];
// validation rules map
const validationRules = new Map([
    ['maxLength', (text) => text.length <= MAX_MSG_LENGTH],
    ['allowedChars', (text) => ALLOWED_PATTERN.test(text)],
    ['notEmpty', (text) => text.trim().length > 0],
    ['noUnsafeHTML', (text) => !/[<>]/.test(text)]
]);

// get reference to elements
const messageContainer = document.getElementById("messageContainer");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendButton");
const errorMessageEl = document.getElementById("errorMessage");
// newly created element references
const msgCountBadge = document.getElementById("msgCountBadge");
const charCounter = document.getElementById("charCounter");
const soundToggle = document.getElementById("soundToggle");
const searchToggle = document.getElementById("searchToggle");
const searchBar = document.getElementById("searchBar");
const searchInput = document.getElementById("searchInput");
const searchCount = document.getElementById("searchCount");
const clearChatBtn = document.getElementById("clearChat");
const typingIndicator = document.getElementById("typingIndicator");
const emojiToggle = document.getElementById("emojiToggle");
const emojiPanel = document.getElementById("emojiPanel");

// app setting configurations
const APP_SETTINGS = {
    soundEnabled: true,
    searchActive: true,
    searchTerm: "",
    totalSent: 0,
    totalRecieved: 0
};

// function to generate ID using date
function generateID(){
    return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 10)}`;
}

// function to prevent cross site attacks by escaping html tags
function sanitizeText(raw){
    return raw.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// fucntion to convert timestamp into a time format
function formatTime(timestamp){
    return new Date(timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
}

// function to validate user message
function validateMessage(text){
    const errors = [];
    // iterate all rules in rule map
    for(const [ruleName, ruleFn] of validationRules.entries()){
        if (!ruleFn(text)){
            // find which rule has been violated
            if (ruleName === 'maxLength') errors.push(`Message exceeds ${MAX_MSG_LENGTH} characters.`);
            else if (ruleName === 'allowedChars') errors.push('Message contains invalid characters.');
            else if (ruleName === 'notEmpty') errors.push('Message cannot be empty.');
            else if (ruleName === 'noUnsafeHTML') errors.push('HTML tags not allowed in messages..');
            else errors.push(`Validation failed: ${ruleName}`);
        } 
    }
    // return validity and error list
    return{
        valid: errors.length === 0, 
        errors
    };
}

// function to queue message
function enqueueMessage(rawText, sender = "self"){
    // raw message and sender to queue
    messageQueue.push({
        raw: rawText,
        sender: sender,
        enqueueAt: Date.now()
    });
    processQueue();
}

// function to process messages
function processQueue(){
    while(messageQueue.length > 0){
        // get next message from front of queue
        const item = messageQueue.shift();
        const {raw, sender} = item;
        // check message empty
        if (raw.trim() === ""){
            if (sender === "self"){
                showError("Message cannot be empty.");
            }
            // skip procesing is empty
            continue;
        }
        // validate with validation rules
        const validation = validateMessage(raw);
        if (!validation.valid){
            if (sender === "self"){
                showError(validation.errors.join(" "));
            }
            // skip as validation fails
            continue;
        }
        // clean message and put id and timestamp
        const cleanText = sanitizeText(raw.trim());
        const messageID = generateID();
        const timestamp = Date.now();
        // new messafe object
        const messageObject = {
            id: messageID,
            text: cleanText,
            originalText: raw.trim(),
            sender: sender,
            timestamp: timestamp,
            status: sender === "self" ? "sending" : "delivered",
            reaction: null
        };
        // only 50 messages allowed remove old ones
        if (messageMap.size >= 50){
            const firstkey = messageMap.keys().next().value;
            // return matching element
            const node = messageContainer.querySelector(`[data-id="${firstkey}"]`);
            // remove if matching exist
            if (node) node.remove();
            // delete using its key
            messageMap.delete(firstkey);
        }
        // store message in map and display stats on webpage
        messageMap.set(messageID, messageObject);
        if (sender === "self"){
            APP_SETTINGS.totalSent++;
        } else{
            APP_SETTINGS.totalRecieved++;
        }
        updateBadge();
        renderMessage(messageObject);
        // messages sent by user
        if (sender === "self"){
            setTimeout(() => {
                const m = messageMap.get(messageID);
                if (m){
                    m.status = "sent";
                    const statusEl = messageContainer.querySelector(`[data-id="${messageID}"].message-status`);
                    if (statusEl){
                        statusEl.textContent = "✔️";
                    }
                }
            }, 400);
            simulateReply(cleanText);
        }
    }
}

// function to display message on webpage
function renderMessage(message){
    const {id, text, sender, timestamp, status, reaction} = message;
    // message display div
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender === "self" ? "message-self" : "message-other"}`;
    messageDiv.dataset.id = id;
    // message body div
    const textSpan = document.createElement("div");
    textSpan.className = "message-text";
    textSpan.textContent = text;
    // message status and timestamp div
    const metaDiv = document.createElement("div");
    metaDiv.className = `message-meta`;
    if (sender === "self"){
        const statusSpan = document.createElement("span");
        statusSpan.className = "message-status";
        statusSpan.textContent = status === "sending" ? "⏳" : "✔️";
        metaDiv.appendChild(statusSpan);
    }
    const timeSpan = document.createElement("span");
    timeSpan.textContent = formatTime(timestamp)
    metaDiv.appendChild(timeSpan);
    // add child to their parent element
    messageDiv.appendChild(textSpan);
    messageDiv.appendChild(metaDiv);
    // reaction element append if exist
    if (reaction){
        const reactionEl = document.createElement("span");
        reactionEl.className = "reaction";
        reaction.textContent = "🆗";
        reactionEl.title = "Remove reaction";
        reactionEl.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleReaction(id);
        });
        messageDiv.appendChild(reactionEl);
    }
    // double click message to toggle reaction
    messageDiv.addEventListener("dblclick", () => toggleReaction(id));
    messageContainer.appendChild(messageDiv);
    // scroll to latest message
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

// function to toggle reaction on message
function toggleReaction(id){
    const msg = messageMap.get(id);
    if (!msg) return;
    const node = messageContainer.querySelector(`[data-id="${id}"]`);
    if (!node) return;
    if (msg.reaction){
        msg.reaction= null;
        const exisitng = node.querySelector(".reaction");
        if (exisitng) exisitng.remove();
    } else{
        msg.reaction = "🆗";
        const reactionEl = document.createElement("span");
        reactionEl.className = "reaction";
        reactionEl.textContent = "🆗";
        reactionEl.title = "Remove reaction";
        reactionEl.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleReaction(id);
        });
        node.appendChild(reactionEl);
    }
    playSound(660, 0.95);
}

// function to update message count
function updateBadge(){
    if (msgCountBadge){
        msgCountBadge.textContent = messageMap.size;
    }
}

// function to automatically reply to message
function simulateReply(cleanText){
    const userText = cleanText;
    // different types of automated replies
    const msgTemplates = [
        (t) => `You wrote: "${t.substring(0, 20)}${t.length > 20 ? '...' : ''}"`,
        (t) => `Interesting (${t.length} characters)`,
        (t) => `I recieved: "${t.substring(0, 15)}${t.length > 15 ? '...' : ''}"`,
        (t) => `Echo: ${t}`
    ];
    // reply based on calculated index
    const msgTemplateIndex = (userText.length % msgTemplates.length);
    let replyText = '';
    try{
        replyText = msgTemplates[msgTemplateIndex](userText);
    // fallback message    
    } catch (error){
        replyText = `Recieved: ${userText}`;
    }
    // automated reply within message limit
    if (replyText.length > MAX_MSG_LENGTH){
        replyText = replyText.substring(0, MAX_MSG_LENGTH-3) + '...';
    }
    showTypingIndicator(true);
    // take time before reply
    setTimeout(() => {
        showTypingIndicator(false);
        enqueueMessage(replyText, "other");
        playSound(520, 0.08);
    }, 100 + Math.random() * 600);
}

// function to show/hide typing indicator
function showTypingIndicator(show){
    if (!typingIndicator) return;
    typingIndicator.classList.toggle("active", show);
}

let soundCtx = null;
// function to play sound using audio api
function playSound(freq=600, duration=0.08){
    if (!APP_SETTINGS.soundEnabled) return;
    try{
        if (!soundCtx) soundCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = soundCtx.createOscillator();
        const gain = soundCtx.createGain();
        osc.frequency.value = freq;
        osc.type = "sine";
        gain.gain.setValueAtTime(0.08, soundCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, soundCtx.currentTime + duration);
        osc.connect(gain).connect(soundCtx.destination);
        osc.start();
        osc.stop(soundCtx.currentTime + duration);
    } catch (e){}
}


// function to handle error
function showError(msg){
    errorMessageEl.textContent = msg;
    // clear error if not replaced by new message
    // clear message after 3s
    setTimeout(() => {
        if (errorMessageEl.textContent === msg){
            errorMessageEl.textContent = "";
        }
    }, 3000);
}

// function to handle message send
function handleSend(){
    // get input from user
    const rawText = messageInput.value;
    errorMessageEl.textContent = "";
    // enqueue message to queue
    enqueueMessage(rawText, "self");
    messageInput.value = "";
    messageInput.focus();
}

// function to auto resize text area based on height
function autoResizeTextarea(){
    messageInput.style.height = "auto";
    messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + "px";
}

// function revert to default size
function resetTextarea(){
    messageInput.style.height = "auto";
}

// function count characters and toggle css styling as per length
function updateCharCounter(){
    const len = messageInput.value.length;
    charCounter.textContent = `${len}/${MAX_MSG_LENGTH}`;
    charCounter.classList.remove("warn", "danger");
    if (len >= MAX_MSG_LENGTH){
        charCounter.classList.add("danger");
    } else if (len > MAX_MSG_LENGTH * 0.8){
        charCounter.classList.add("warn");
    }
}

// function to filter messages based on user query
function search(term){
    APP_SETTINGS.searchTerm = term.toLowerCase();
    let visible = 0;
    const nodes = messageContainer.querySelectorAll(".message");
    nodes.forEach(node => {
        const msg = messageMap.get(node.dataset.id);
        if (!msg) return;
        const match = !term || msg.originalText.toLowerCase().includes(APP_SETTINGS.searchTerm);
        node.classList.toggle("message-hidden", !match);
        if (match) visible++;
    });
    searchCount.textContent = term ? `${visible}/${nodes.length}` : "";
}

// listener to handle send button
sendBtn.addEventListener("click", handleSend);

// listen for keydown event
messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter"){
        e.preventDefault();
        handleSend();
    }
});

// validate user input
messageInput.addEventListener("input", () => {
    const val = messageInput.value;
    autoResizeTextarea();
    updateCharCounter();
    // validate user input
    const tooLong = val.length > MAX_MSG_LENGTH;
    const isEmpty = val.trim().length === 0;
    const hasUnsafe = /[<>]/.test(val);
    // scenario based warning messages when validation fails
    if (tooLong){
        showError(`Message exceeds ${MAX_MSG_LENGTH} characters.`);
    }
    else if (hasUnsafe){
        showError("HTML tags (<>) not allowed.");
    }
    else if (isEmpty && val.length > 0){
        showError("Message cannot be only spaces.");
    } else{
        if (errorMessageEl.textContent) errorMessageEl.textContent = "";
    }
});

// listener to toggle emoji panel
emojiToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    emojiPanel.classList.toggle("active");
});

// insert emoji in message at cursor position
emojiPanel.addEventListener("click", (e) => {
    if (e.target.tagName === "SPAN"){
        const emoji = e.target.textContent;
        const start = messageInput.selectionStart;
        const end = messageInput.selectionEnd;
        const val = messageInput.value;
        messageInput.value = val.substring(0, start) + emoji + val.substring(end);
        messageInput.selectionStart = messageInput.selectionEnd - start + emoji.length;
        messageInput.focus();
        autoResizeTextarea();
        updateCharCounter();
    }
});

// listener to close emoji panel when clicked outside
document.addEventListener("click", (e) => {
    if (!emojiPanel.contains(e.target) && e.target !==emojiToggle){
        emojiPanel.classList.remove("active");
    }
});

// listener to toggle sound
soundToggle.addEventListener("click", () => {
    APP_SETTINGS.soundEnabled = !APP_SETTINGS.soundEnabled;
    soundToggle.classList.toggle("muted", !APP_SETTINGS.soundEnabled);
    soundToggle.textContent = APP_SETTINGS.soundEnabled ? "🔊" : "🔇";
    if (APP_SETTINGS.soundEnabled) playSound(700, 0.06);
});

// listener to toggle search bar
searchToggle.addEventListener("click", () => {
    APP_SETTINGS.searchActive = !APP_SETTINGS.searchActive;
    searchBar.classList.toggle("active", !APP_SETTINGS.searchActive);
    if (APP_SETTINGS.searchActive){
        searchInput.focus();
    } else{
        searchInput.value = "";
        search("");
    }
});

// filter search based on user query
searchInput.addEventListener("input", () => {
    search(searchInput.value.trim());
});

// listener to clear messages
clearChatBtn.addEventListener("click", () => {
    if (!confirm("Clear all messages?")) return;
    messageMap.clear();
    messageContainer.innerHTML = "";
    APP_SETTINGS.totalSent = 0;
    APP_SETTINGS.totalRecieved = 0;
    updateBadge();
    enqueueMessage("All chats cleared , say hi again!", "other");
});

// listener for keys to trigger search and close panel
document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "f"){
        e.preventDefault();
        if (!APP_SETTINGS.searchActive) searchToggle.click();
        else searchInput.focus();
    } 
    if (e.key === "Escape"){
        emojiPanel.classList.remove("active");
        if (APP_SETTINGS.searchActive) searchToggle.click();
    }
});

// function to intialize app
function initChat(){
    updateBadge();
    updateCharCounter();
    const welcomeText = `Your messages are secure but only the latest 50 will be shown.`;
    enqueueMessage(welcomeText, "other");
}

initChat();