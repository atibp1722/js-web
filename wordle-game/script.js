let words = [
    "About",
    "Adieu",
    "Admin",
    "Admit",
    "Adopt",
    "After",
    "Album",
    "Alter",
    "Amber",
    "Angel",
    "Anger",
    "Angle",
    "Apart",
    "Argue",
    "Arise",
    "Audio",
    "Avoid",
    "Bacon",
    "Badge",
    "Basic",
    "Beach",
    "Beard",
    "Beast",
    "Begin",
    "Being",
    "Below",
    "Bible",
    "Black",
    "Board",
    "Bored",
    "Brain",
    "Brave",
    "Bread",
    "Carol",
    "Chair",
    "Chaos",
    "Clean",
    "Clear",
    "Clone",
    "Cloud",
    "Coach",
    "Cough",
    "Cream",
    "Cupid",
    "Daily",
    "Daisy",
    "Dance",
    "Death",
    "Death",
    "Dough",
    "Drama",
    "Dream",
    "Drive",
    "Early",
    "Earth",
    "Eight",
    "Equal",
    "Faith",
    "Field",
    "Force",
    "Forum",
    "Fruit",
    "Given",
    "Globe",
    "Glove",
    "Great",
    "Guard",
    "Heart",
    "Honey",
    "Human",
    "Irate",
    "Judge",
    "Knife",
    "Later",
    "Later",
    "Laugh",
    "Layer",
    "Lemon",
    "Light",
    "Liver",
    "Local",
    "Lover",
    "Magic",
    "Major",
    "Mango",
    "Metal",
    "Meter",
    "Money",
    "Mouse",
    "Mouth",
    "Music",
    "Ninja",
    "Noisy",
    "Often",
    "Order",
    "Organ",
    "Other",
    "Pasta",
    "Peach",
    "Phone",
    "Pilot",
    "Pitch",
    "Place",
    "Plain",
    "Plant",
    "Plate",
    "Point",
    "Power",
    "Quran",
    "Range",
    "River",
    "Royal",
    "Scare",
    "Scarf",
    "Shine",
    "Shout",
    "Sight",
    "Smile",
    "Smoke",
    "Solid",
    "Sound",
    "South",
    "Space",
    "Spade",
    "Stone",
    "Sugar",
    "Super",
    "Sushi",
    "Table",
    "Tiger",
    "Toads",
    "Today",
    "Touch",
    "Train",
    "Trend",
    "Tulip",
    "Uncle",
    "Under",
    "Vague",
    "Vegan",
    "Watch",
    "Water",
    "Weary",
    "Whale",
    "White",
    "Woman",
    "Young",
    "Youth",
    "Zebra",
    "Zesty",
];

// select from the HTMl elements
let container = document.querySelector(".container");
let winScreen = document.querySelector(".win-screen");
let submitBtn = document.querySelector(".submit");
// game related variables
let inputCount, inputRow, tryCount;
let backSpaceCount = 0;
let randWord, finalWord;

// detect whether touch device being used
const isTouchDevice = () => {
    try{
        // create a touch event
        document.createEvent("TouchEvent");
        return true;
    } catch(e) {
        return false;
    }
};

// game start function
const startGame = async() => {
    // hide widnow screen 
    winScreen.classList.add("hide");
    // clear the game container
    container.innerHTML = "";
    inputCount = 0;
    successCount = 0;
    tryCount = 0;
    finalWord = "";

    // create the game grid
    for (let i=0; i<6; i++){
        // element for each row
        let inputGroup = document.createElement("div");
        inputGroup.classList.add("input-group");
        // boxes inside the row
        for (let j=0; j<5; j++){
            // add input box on current row
            inputGroup.innerHTML += `<input type="text" class="input-box" onkeyup="checker(event)" maxlength="1" disabled>`;
        }
        // add it to game container window
        await container.appendChild(inputGroup);
    }
    // select all rows
    inputRow = document.querySelectorAll(".input-group");
    // select input box elements
    inputBox = document.querySelectorAll(".input-box");
    // enable first input of first row
    updateDivConfig(inputRow[tryCount].firstChild, false);
    randWord = getRandomWord();
    console.log(randWord);
};    

// get a random word
const getRandomWord = () => 
    words[Math.floor(Math.random() * words.length)].toUpperCase();
    // enable/disable input box 
    const updateDivConfig = (element, disabledStatus) => {
        // set disabled status
        element.disabled = disabledStatus;
        if (!disabledStatus){
            // put coursor focus on input
            element.focus();
    }
};

const 
