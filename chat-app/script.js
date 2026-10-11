// application configuration settings
const MAX_MSG_LENGTH = 100;
const ALLOWED_PATTERN = /^[a-zA-Z0-9\s.,!?@#%&*()_+\-=[\]{};':"\\|<>\/~`^]*$/;
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

// get reference tp html elements
const messageContainer = document.getElementById("messageContainer");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendButton");
const errorMessageEl = document.getElementById("errorMessage");

// function to generate ID using date
function generateID(){
    return `${Date.now().toString(36)}-${Math.random.toString(36).substring(2, 10)}`;
}

// function to prevent cross site attacks by escaping html tags
function sanitizeText(raw){
    return raw.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// fucntion to convert timestamp into a time format
function formatTime(timestamp){
    return new Date(timestamp).toLocaleTimeString([], {hour: '2 digit', minute: '2 digit'});
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
            else if (ruleName === 'NotEmpty') errors.push('Message cannot be empty.');
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
            timestamp: timestamp
        };
        // only 50 messages allowed remove old ones
        if (messageMap.size >= 50){
            const firstkey = messageMap.keys().next().value;
            messageMap.delete(firstkey);
        }
        // store message in map and display on webpage
        messageMap.set(messageID, messageObject);
        renderMessage(messageObject);
        // simulated reply if sender is "self"
        if (sender === "self"){
            simulateReply(cleanText);
        }
    }
}

// function to display message on webpage
function renderMessage(message){
    const {text, sender, timestamp} = message;
    // message display div
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender === "self" ? "self" : "other"}`;
    // message body div
    const textSpan = document.createElement("div");
    textSpan.textContent = text;
    // message timestamp div
    const metaDiv = document.createElement("div");
    metaDiv.className = `message-meta`;
    metaDiv.textContent = formatTime(timestamp);
    // add child to their parent element
    messageDiv.appendChild(textSpan);
    messageDiv.appendChild(metaDiv);
    messageContainer.appendChild(messageDiv);
    // scroll to latest message
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

// function to automatically reply to message
function simulateReply(originalUserMessage){
    const userText = originalUserMessage;
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
    // take time before reply
    setTimeout(() => {
        enqueueMessage(replyText, "other")
    }, 200);
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