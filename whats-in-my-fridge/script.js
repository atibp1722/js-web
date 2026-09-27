// mealDB api reference for ingredient and recipe
const API = "https://www.themealdb.com/api/json/v1/1";
// handle ingredinet, possible meals and user ratings
const STATE = {
    ingredients: [],
    meals: [],
    ratings: JSON.parse(localStorage.getItem("mealRatings") || "{}")
};

// get reference to the html elements
const input = document.getElementById("ingredientInput");
const ingredientList = document.getElementById("ingredientList");
const error = document.getElementById("error");
const results = document.getElementById("results");
const status = document.getElementById("status");
const dialog = document.getElementById("dialog");
const recipeContent = document.getElementById("recipeContent");

// normalize user input remove whitespace and convert all to lowercase
function normalizeUserInput(value){
    return value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ")
}

// function for add new ingredient
function addIngredient(){
    const value = normalizeUserInput(input.value);
    // clear previous errors
    error.textContent = "";
    // check input field empty
    if (!value){
        error.textContent = "Ingredient needs to be entered first.";
        input.focus();
        return;
    }
    // check input contain other than letters
    if (!/^[a-zA-Z0-9 '&.-]+$/.test(value)){
        error.textContent = "Ingredient name not valid.";
        return;
    }
    // check user input single value
    if (value.length < 2){
        error.textContent = "Ingredient cannot be single character long.";
        return;
    }
    // check duplicate ingredient entry
    if (STATE.ingredients.includes(value)){
        error.textContent = "Ingredient already added.";
        return;
    }
    // add ingredient to list
    STATE.ingredients.push(value);
    // clear input box
    input.value = "";
    // show ingredient on webpage
    renderIngredients();
    input.focus();
}

// function for remove ingredient
function removeIngredient(index){
    STATE.ingredients.splice(index, 1);
    renderIngredients();
}

// function for display ingredient list on webpage
function renderIngredients(){
    ingredientList.innerHTML = "";
    // iterate each ingredient for individual reference
    STATE.ingredients.forEach((ingredient, index) => {
        const tag = document.createElement("div");
        tag.className = "ingredient";
        tag.innerHTML = `<span>${escapeHTML(ingredient)}</span>
                        <button type="button" aria-label="Remove ${escapeHTML(ingredient)}"
                        onclick="removeIngredient(${index})">X</button>`;
        // put individual items on final list 
        ingredientList.appendChild(tag);
    });
}

// security function for escape user iput
function escapeHTML(value){
    const div = document.createElement("div");
    // return to empty string if null
    div.textContent = value ?? "";
    // return html string
    return div.innerHTML;
}
