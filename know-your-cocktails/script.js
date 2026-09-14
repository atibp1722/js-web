// get the html elements reference
let result = document.getElementById("result");
let searchBtn = document.getElementById("search-btn");
let url = "https://thecocktaildb.com/api/json/v1/1/search.php?s=";
// user search for drink
let getInfo = () => {
    // get and validate user input
    let userInp = document.getElementById("user-inp").value;
    if (userInp.length === 0){
        result.innerHTML = `<h3 class="msg">Sorry, this field cannot be empty!!</h3>`;
    } else{
        // request to cocktaldb api
        fetch(url + userInp)
        // convert request to json
            .then((response) => (response).json())
            .then((data) => {
                document.getElementById("user-inp").value="";
                console.log(data);
                // display first drink from return
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

                for (let i in myDrink){
                    // temp variables
                    let ingredient = "";
                    let measure = "";
                    // validate current property value
                    if (i.startsWith("strIngredient") && myDrink[i]){
                        // get ingredient name and corresponding measurement
                        ingredient = myDrink[i];
                        if (myDrink[`strMeasure` + count]){
                            measure = myDrink[`strMeasure` + count];
                        } else{
                            measure = "";
                        }
                        count += 1;
                        // combine and add to the final array list
                        ingredients.push(`${measure} ${ingredient}`);
                    }
                }
                console.log(ingredients);
            })
            // if anything goes wrong while fetching data from the api
            .catch((e) => {
                console.log(e);
            });
    }

}