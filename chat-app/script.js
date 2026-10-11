// application configuration settings
const MAX_MSG_LENGTH = 100;
const ALLOWED_PATTERN = /^[a-zA-Z0-9\s.,!?@#%&*()_+\-=[\]{};':"\\|<>\/~`^]*$/;
const UNSAFE_HTML = /[<>]/g;
// map to store messages
const mesageMap = new Map();
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

