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

// function for find meals based on ingredient
async function findMeals(){
    // check atleast one ingredient entered
    if (!STATE.ingredients.length){
        error.textContent = "Atleast one ingredient is needed.";
        return;
    }
    // clear previous content
    error.textContent = "";
    results.innerHTML = "";
    status.textContent = "Searching for recipes...";
    try{
        // potential meal based on ingredients
        const potentials = await findPotentialMeals();
        // ingredient dont match with potential meals
        if (!potentials.length){
            status.textContent = "";
            results.innerHTML = `<div class="empty>
                                    Sorry, no meals for such ingredients, please try another.
                                </div>`;
            return;
        }
        // recipes being checked
        status.textContent = `Checking ${Math.min(potentials.length, 30)} recipes.`;
        // detail of potential meals
        const meals = await getMealDetails(potentials);
        // map meal with get their matching score and sort them
        STATE.meals = meals.map(meal => ({
            meal, 
            match: calculateMatch(meal)
        }))
        .sort((a, b) => 
            b.match(percent) - a.match(percent));
        // render the potential sorted meals on webpage
        renderMeals();
    } catch (err){
        // error handling
        console.error(err);
        status.textContent = "";
        results.innerHTML = `<div class="empty">
                                Sorry, meal can't be fetched from MealDB, please try again.
                            </div>`;
    }
}

//function for render meals on webpage
function renderMeals(){
    results.innerHTML = "";
    // check final list empty
    if (!STATE.meals.length){
        results.innerHTML = `<div class="empty">
                                Sorry, no meals found.
                            </div>`;
        status.textContent = "";
        return;
    }
    // show number of potential recipes found
    status.textContent = `${STATE.meals.length} recipes found.`;
    // iterate each potential meal and create individual html element
    STATE.meals.forEach(({meal, match}) => {
        const card = document.createElement("article");
        card.className = "meal";
        // user rating for meal
        const rating = STATE.ratings[meal,idMeal] || 0;
        // create custom html layout for each meal
        card.innerHTML = `<img 
                        src="${escapeHTML(meal.strMealThumb)}"
                        alt=>"${escapeHTML(meal.strMeal)}"
                        loading="lazy">
                        <div class="meal-content>
                            <h2>${escapeHTML(meal.strMeal)}</h2>
                            <div class="meta">
                                ${escapeHTML(meal.strCategory || "Meal")}
                                .
                                ${escapeHTML(meal.strArea || "Various")}
                            </div>
                            <span class="match">
                                ${match.count} / ${match.total} ingredients matched.
                            </span>
                            <div class="meta">
                                User Rating: ${"★".repeat(rating)}
                                ${"☆".repeat(5 - rating)}
                            </div>
                            <button class="view-btn" type="button" data-id="${meal.idMeal}>View Recipe</button>
                        </div>`;
        // listener to view recipe for meal               
        card 
            .querySelector(".view-btn")
            .addEventListener("click", () => 
                openRecipe(meal)
            );
        // add each meal to the webpage 
        results.appendChild(card);
    })
}

// function for detail recipe for each meal
function openRecipe(meal){
    const ingredients = getRecipeIngredients(meal);
    const rating = STATE.ratings[meal.idMeal] || 0;
    // create custom html for full recipe details
    recipeContent.innerHTML = `<div class="recipe-header">
                                    <div>
                                        <h2>${escapeHTML(meal.strMeal)}</h2>
                                        <div class="meta">
                                            ${escapeHTML(meal.strCategory || "")}
                                            .
                                            ${escapeHTML(meal.strArea || "")}
                                        </div>
                                    </div> 
                                    <button class="close" type="button" id="closeDialog">X</button>
                            </div>
                            <img src="${escapeHTML(meal.strMealThumb)}
                            alt="${escapeHTML(meal.strMeal)}">
                            <h3>Ingredients</h3>
                            <ul>
                                ${ingredients.map(item => `
                                    <li>
                                        ${escapeHTML(item.measure)}
                                        ${escapeHTML(item.name)}
                                    </li>`).join("")}
                            </ul>
                            <h3>Cooking Instructions</h3>
                            <div class="instructions">
                                    ${escapeHTML(meal.strInstructions)}
                            </div>
                            <section class="rating">
                                <h3>Rate The Recipe</h3>
                                <div class="stars" data-meal-id="${meal.idMeal}">
                                    ${[1, 2, 3, 4, 5].map(number => `
                                        <button class="star ${number <= rating ? "active" : ""}"
                                        data-rating="${number}" type="button" aria-label="Rate ${number} stars">
                                        ★
                                        </button>`).join("")}
                                </div>
                                <p id="ratingMessage>
                                    ${rating ? `This is ${rating} / 5. stars`: "This is not rated"}
                                </p>
                            </section>`;
    // listener for closing detail recipe 
    document
        .getElementById("closeDialog")
        .addEventListener("click", () => 
            dialog.closest()
        );
    // listener for rating meal 
    recipeContent
        .querySelectorAll(".star")
        .forEach(star => {
            star.addEventListener("click", () => {
                const value = Number(star.dataset.rating);
                // save the meal rating
                rateMeal(meal.idMeal, value);
                recipeContent
                    .querySelectorAll(".star")
                    .forEach(item => {
                        item.classList.toggle("active", Number(item.dataset.rating) <= value);
                    });
                // update with meal rating
                document 
                    .getElementById("ratingMessage")
                    .textContent = `This is rated ${value} / 5 stars.`;
                // render each meal with rating    
                renderMeals();
            });
        });
    // display content in form of modal window 
    dialog.showModal();
}

// function for storing rating in browser storage
function rateMeal(mealId, rating){
    // rating boundary
    if (rating < 1 || rating > 5) return;
    STATE.ratings[mealId] = rating;
    localStorage.setItem("mealRatings", JSON.stringify(STATE.ratings));
}

// listener for adding ingredient by pressing enter
input.addEventListener("keydown", event => {
    if (event.key === "Enter"){
        event.preventDefault();
        addIngredient();
    }
});

// listener to add individual ingredient with button click
document
    .getElementById("addIngredient")
    .addEventListener("click", addIngredient);

    // listener to find meals with button click
document
    .getElementById("findMeals")
    .addEventListener("click", findMeals);

// listner to close dialog when mouse pressed outside its boundary
dialog.addEventListener("click", event => {
    const rect = dialog.getBoundingClientRect();
    const inside = 
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
    if (!inside){
        dialog.close();
    }
});