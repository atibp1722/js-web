// characters and their corresponding morse code value
const morseCode = {
    A: ".-",
    B: "-...",
    C: "-.-.",
    D: "-..",
    E: ".",
    F: "..-.",
    G: "--.",
    H: "....",
    I: "..",
    J: ".---",
    K: "-.-",
    L: ".-..",
    M: "--",
    N: "-.",
    O: "---",
    P: ".--.",
    Q: "--.-",
    R: ".-.",
    S: "...",
    T: "-",
    U: "..-",
    V: "...-",
    W: ".--",
    X: "-..-",
    Y: "-.--",
    Z: "--..",
    0: "-----",
    1: ".----",
    2: "..---",
    3: "...--",
    4: "....-",
    5: ".....",
    6: "-....",
    7: "--...",
    8: "---..",
    9: "----.",
    ".": ".-.-.-",
    ",": "--..--",
    "?": "..--..",
    "'": ".----.",
    "!": "-.-.--",
    "/": "-..-.",
    "(": "-.--.",
    ")": "-.--.-",
    "&": ".-...",
    ":": "---...",
    ";": "-.-.-.",
    "=": "-...-",
    "+": ".-.-.",
    "-": "-....-",
    _: "..--.-",
    '"': ".-..-.",
    $: "...-..-",
    "@": ".--.-.",
    " ": "/",
};

// empty object to store morse code keys
const reverseMorseCode = {};

// loop through all morse code
// encoding and deconding the morse code
for (const i in morseCode){
    // check if it belongs to morse code object
    if(morseCode.hasOwnProperty(i)){
        // get corresponding value and reverse to its morse code value
        const value = morseCode[i];
        reverseMorseCode[value] = i;
    }
}

// get matching id value for each element
const inputField = document.getElementById("input");
const translateBtn = document.getElementById("translate");
const outputField = document.getElementById("output");

translateBtn.addEventListener("click", ()=> {
    const inputTxt = inputField.value.trim.toUpperCase();
    // check if field empty
    if(inputField === ""){
        outputField.textContent = "Sorry, please provide input for translation!!";
        return;
    }

    // if input is dot
    if(inputTxt.includes(".")){
        const morseWords = inputTxt.split("/");
        // convert each to normal text
        const translateWords = morseWords.map((morseWord) => {
            // convert to an array
            const morseChars = morseWord.split(" ");
            return morseChars
                .map((morseChar) => {
                    // if morse code not found, keep original character
                    return reverseMorseCode[morseChar] || morseChar;
            })
            .join("");
        });
        // join all the translated words
        outputField.textContent = translateWords.join(" ");
    }
});