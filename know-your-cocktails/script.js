// get the html elements reference
let result = document.getElementById("result");
let searchBtn = document.getElementById("search-btn");
let url = "https://thecocktaildb.com/api/json/v1/1/search.php?s=";

// user search for drink
let getInfo = () => {
    // get and validate user input
    let userInp = document.getElementById("user-inp").value;
    if (userInp.length === 0) {
        result.innerHTML = `<h3 class="msg">Sorry, this field cannot be empty!!</h3>`;
    } else {
        // request to cocktaldb api
        fetch(url + userInp)
        // convert request to json
            .then((response) => (response).json())
            .then((data) => {
                document.getElementById("user-inp").value = "";
                console.log(data);
                // display first drink from return
                if (!data.drinks) {
                    result.innerHTML = `<h3 class="msg">Sorry, drink not found!!</h3>`;
                    return;
                }
                console.log(data.drinks[0]);
                // store first object in variable
                let myDrink = data.drinks[0];

                console.log(myDrink.strDrink);
                console.log(myDrink.strDrinkThumb);
                console.log(myDrink.strInstructions);
                // matching ingredients
                let count = 1;
                // store final list
                let ingredients = [];
                // iterate every key value pair
                for (let i in myDrink) {
                    // temp variables
                    let ingredient = "";
                    let measure = "";
                    // validate current property value
                    if (i.startsWith("strIngredient") && myDrink[i]) {
                        // get ingredient name and corresponding measurement
                        ingredient = myDrink[i];

                        if (myDrink[`strMeasure` + count]) {
                            measure = myDrink[`strMeasure` + count];
                        } else {
                            measure = "";
                        }
                        count += 1;
                        // combine and add to the final array list
                        ingredients.push(`${measure} ${ingredient}`);
                    }
                }
                console.log(ingredients);
                // displaying the result of search
                result.innerHTML = `
                    <img src=${myDrink.strDrinkThumb}>
                    <h2>${myDrink.strDrink}</h2>
                    <h3>Ingredients:</h3>
                    <ul class="ingredients"></ul>
                    <h3>Instructions:</h3>
                    <p>${myDrink.strInstructions}</p>
                `;
                // find the corresponding elements with the class
                let ingredientsCon = document.querySelector(".ingredients");
                // iterate through everi item in array
                ingredients.forEach(item => {
                    // create new li element
                    // put text inside li element
                    // append it to ul element
                    let listItem = document.createElement("li");
                    listItem.innerText = item;
                    ingredientsCon.appendChild(listItem);
                });
            })
            // if anything goes wrong while fetching data from the api
            .catch(() => {
                result.innerHTML = `<h3 class="msg">Sorry, cannot query your search!!</h3>`;
            });
    }
}
// run when page loads
// run when button clicked
window.addEventListener("load", getInfo);
searchBtn.addEventListener("click", getInfo);
