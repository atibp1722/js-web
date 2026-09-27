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

// security function for escape user input
function escapeHTML(value){
    const div = document.createElement("div");
    // return to empty string if null
    div.textContent = value ?? "";
    // return html string
    return div.innerHTML;
}

// function for url fetch
async function fetchJson(url){
    const response = await fetch(url);
    if (!response.ok){
        throw new Error(`Request attempt failed (${response.status})`);
    }
    // parse and return as json
    return response.json();
}

// function for meals that match user ingredients
async function findPotentialMeals(){
    // map each ingredient to create requests
    const requests = STATE.ingredients.map(async ingredient => {
        const url = `${API}/filter.php?i=${encodeURIComponent(ingredient)}`;
        try{
            const data = await fetchJson(url);
            // retrun if none match
            return data.meals || [];
        } catch{
            // return error
            return [];
        }
    });
    // wait for requests to complete
    const groups = await Promise.all(requests);
    // duplicate prevention
    const meals = new Map();
    // store each with their unique id
    groups.flat().forEach(meal => {
        if (!meals.has(meal.idMeal)){
            meals.set(meal.idMeal, meal);
        }
    });
    // convert mapped values to array
    return [...meals.values()];
}

// function for meal ingredient and measurement for recipe
function getRecipeIngredients(meal){
    const ingredients = [];
    // get 20 ingredients from mealDB api
    for(let i=1; i<=20; i++){
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
            if (ingredient && ingredient.trim()){
                // push to he final array
                ingredients.push({
                    name: normalizeUserInput(ingredient), 
                    measure: (measure || "").trim()
            });
        }
    }
    return ingredients;
}

// function for how well recipe matches user ingredient list
function calculateMatch(meal){
    // get ingredients for the meal
    const recipeIngredients = getRecipeIngredients(meal);
    const recipeNames = recipeIngredients.map(item => item.name);
    // filter user ingredient that match the meal recipe
    const matched = STATE.ingredients.filter(userIngredient => 
        recipeNames.some(recipeIngredient => 
            recipeIngredient.includes(userIngredient) || userIngredient.includes(recipeIngredient)
        )
    );
    // metrics for calculation of percentage
    return {
        count: matched.length,
        total: STATE.ingredients.length,
        // prevent divide by 0 error
        percent: total > 0 ? Math.round(matched.length / STATE.ingredients.length * 100) : 0, matched 
    };
}

// function for potential meal recipes from ingredients
async function getMealDetails(potentials){
    const meals = [];
    // iterate all potential meals
    for(const potential of potentials.slice(0, 30)){
        try{
            // get detail info from the mealDB api
            const data = await fetchJson(`${API}/lookup.php?i=${potential.idMeal}`);
            if (data.meals?.[0]){
                // add new object to array
                meals.push(data.meals[0]);
            }
        } catch{

        }
    }
    // return meal with details
    return meals;
}