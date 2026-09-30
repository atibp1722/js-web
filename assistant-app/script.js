// urls of api to be used
const API = {
    weather: "https://api.open-meteo.com/v1/forecast",
    geocode: "https://geocoding-api.open-meteo.com/v1/search",
    news: "https://gnews.io/api/v4",
    stocks: "https://finnhub.io/api/v1"
};

// function to save user api keys in browser storage
function saveKeys(){
    // get reference to key elements
    localStorage.setItem("gNewsKey", document.getElementById("newsKey").value.trim());
    localStorage.setItem("gWeatherKey", document.getElementById("weatherKey").value.trim());
    localStorage.setItem("gStockKey", document.getElementById("stockKey").value.trim());
    alert("API keys sucessfully saved.");
}

// function to load saved keys in fields
function loadKeys(){
    // fallback to show empty instead of null
    document.getElementById("newsKey").value = localStorage.getItem("gNewsKey") || "";
    document.getElementById("weatherKey").value = localStorage.getItem("gWeatherKey") || "";
    document.getElementById("stockKey").value = localStorage.getItem("gStockKey") || "";
}

// function to update clock every second
function updateClock(){
    const now = new Date();
    document.getElementById("clock").textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// function to convert into latitude and longitude 
async function geoCode(city){
    const url = `${API.geocode}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const response = await fetch(url);
    // check successful or not
    if (!response.ok){
        throw new Error("Failed to retrieve location.");
    }
    // prase response to json
    const data = await response.json();
    if (!data.results?.length){
        throw new Error("Location cannot be found.");
    }
    // return first that match
    return data.results[0];
}

// function to fetch weather data
async function loadWeather(cityOverride = null){
    // override parameter to determine city name
    const city = cityOverride || document.getElementById("weatherCity").value.trim();
    if (!city) return;
    // loading state message
    const container = document.getElementById("weatherResult");
    container.innerHTML = `<p class="loading">Loading Weather...</p>`;
    try{
        // geocode for latitide/longitude
        const location = await geoCode(city);
        // open-meteo api parameters
        const params = new URLSearchParams({
            latitude: location.latitude,
            longitude: location.longitude,
            current:
                "temperature_2m," + 
                "relative_humidity_2m," +
                "apparent_temperature," +
                "percipitation," +
                "weather_code," +
                "wind_speed_10m",
            daily:
                "weather_code" +
                "temperature_2m_max," +
                "temperature_2m_min," +
                "percipitation_probability_max," +
                "sunrise," +
                "sunset",
            timezone: "auto",
            forecast_days: 7
        });
        // fetch data using the parameters
        const response = await fetch(`${API.weather}?${params}`);
        if (!response.ok){
            throw new Error("Failed to get weather request.")
        }
        const data = await response.json();
        renderWeather(location, data);
    // catch any errors
    } catch(error){
        container.innerHTML = `<p>${escapeHTML(error.message)}</p>`;
    }
}

// fucntion to get weather decription and map them to readable text
function weatherDescription(code){
    // codes for weather description
    const map = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Rime fog",
        51: "Light drizzle",
        53: "Drizzle",
        55: "Dense drizzle",
        61: "Light rain",
        63: "Rain",
        65: "Heavy rain",
        71: "Light snow",
        73: "Snow",
        75: "Heavy snow",
        80: "Rain showers",
        81: "Rain showers",
        82: "Heavy showers",
        95: "Thunderstorm",
        96: "Thunderstorm",
        99: "Thunderstorm"
    };
    return map[code] || "Unknown";
}

// function to generate custom html to display weather info on webpage
function renderWeather(location, data){
    // reference to current weather object
    const c = data.current;
    // reference to forecast array objects
    const d = data.daily;
    // custom cards to display info on webpage
    let html = `<div class="card">
                    <h3>${escapeHTML(location.name)},
                    ${escapeHTML(location.country)}</h3>
                    <div class="big-number">
                        ${c.temperature_2m}°C
                    </div>
                    <p>${weatherDescription(c.weather_code)}</p>
                    <div class="weather-current">
                        <div class="weather-stat">
                            🌡️Feels Like: ${c.apparent_temperature_2m}°C
                        </div>
                        <div class="weather-stat">
                            💧Humidity: ${c.relative_humidity_2m}%
                        </div>
                        <div class="weather-stat">
                            🍃Wind: ${c.wind_speed_10m}km/h
                        </div>
                        <div class="weather-stat">
                            🌧️Rainfall: ${c.wind_speed_10m}mm
                        </div>
                    </div>
                </div>
                <h3>🌦️7-Day Weather Forecast</h3>
                <div class="forecast">`;
    // iterate all days to build forecast cards for individual day
    d.time.forEach((date, i) => {
        html +=   `<div class="forecast-day">
                        <strong>${formatDate(date)}</strong>
                        <p>${weatherDescription(d.weather_code[i])}</p>
                        <strong>${d.temperature_2m_max[i]}</strong> / ${d.temperature_2m_min[i]}°C
                        <p>🌧️${d.percipitation_probability_max[i]}</p>
                        <small>🌄${formatTime(d.sunrise[i])}</small><br/>
                        <small>🌇${formatTime(d.sunset[i])}</small>
                   </div>`;
    });
    html += `</div>`;
    // put the custom html in webpage uby getting reference to its element
    document.getElementById("weatherResult").innerHTML = html;
}

// function to get news article based on user selected options
async function loadNews(queryOverride = null){
    const key = localStorage.getItem("gNewsKey");
    // api key entered check
    if (!key){
        document.getElementById("newsResult").innerHTML = "<p>Add news API first.</p>";
        return;
    }
    // override param for search query
    const query = queryOverride || document.getElementById("newsQuery").value.trim();
    // get reference to html elements
    const category = document.getElementById("newsCategory").value;
    const country = document.getElementById("newsCountry").value;
    const language = document.getElementById("newsLanguage").value;
    // map with params from news api
    const params = new URLSearchParams({
        lang: language,
        country, 
        category, 
        max: 10, 
        apikey: key
    });
    if (query)
        params.set("q", query);
    const container = document.getElementById("newsResult");
    container.innerHTML = `<p class="loading">Loading News...</p>`;
    try{
        // send request to news api
        const response = await fetch(`${API.news}/top-headlines?${params}`);
        // check successful or not
        if (!response.ok){
            throw new Error("Failed, to get news, API error.");
        }
        // parse response to json
        const data = await response.json();
        renderNews(data.articles || []);
    } catch(error){
        container.innerHTML = `<p>${escapeHTML(error.message)}</p>`;
    }
}

// function to render news article on webpage
function renderNews(articles){
    const container = document.getElementById("newsResult");
    // check number of article returned
    if (!articles.length){
        container.innerHTML = "<p>No articles found.</p>";
        return;
    }
    // map article to create indiviudal card for each
    container.innerHTML = articles.map(article => 
            `<div class="card-article">
                <img src="${safeURL(article.image)}"
                alt="" onerror="this.style.display='none'">
                <div>
                    <h3>${escapeHTML(article.title || "")}</h3>
                    <p>${escapeHTML(article.description || "")}</p>
                    <small>${escapeHTML(article.source?.name || "")}</small><br/>
                    <a href="${safeURL(article.url)}" target="_blank" rel="noopener noreferrer">Read More-></a>
                </div>
            </div>`
    // combine all to form single html string        
    ).join("");
}

// function to get stock data using symbol
async function getStock(symbol){
    const key = localStorage.getItem("gStockKey");
    if (!key){
        throw new Error("Please enter API first.");
    }
    // stock api connection using params
    const url = `${API.stocks}/quote` + `?symbol=${encodeURIComponent(symbol)}` + `&token=${encodeURIComponent(key)}`;
    const response = await fetch(url);
    if (!response.ok){
        throw new Error("Failed to process request.");
    }
    // parse to json
    const data = await response.json();
    // return current stock price
    if (!data.c){
        throw new Error("Cannot process the request for the stock.")
    }
    return data;
}

// function to display stock info on webpage 
async function loadStock(symbolOverride = null){
    // overrirde param for search
    const symbol = (symbolOverride || document.getElementById("stockSymbol").value.trim().toUpperCase());
    if (!symbol){
        return;
    }
    document.getElementById("stockResults").innerHTML = `<p class="loading">Loading Stocks...</p>`;
    try{
        // wait for stock fetch
        const data = await getStock(symbol);
        // variables for closing and percent change
        const change = Number(data.d || 0);
        const percent = Number(data.dp || 0);
        // css class for display
        const color = change >= 0 ? "positive" : "negative";
        // custom html for stock card
        document.getElementById("stockResults").innerHTML = `<div class="card">
                                                                <h3>${symbol}</h3>
                                                                <div class="big-number">
                                                                    $${Number(data.c).toFixed(2)}
                                                                </div>
                                                                <p class="${color}">
                                                                    ${change >= 0 ? "+" : ""}
                                                                    ${change.toFixed(2)}
                                                                    ${percent >= 0 ? "+" : ""}
                                                                    ${percent.toFixed(2)}
                                                                </p>
                                                                <div class="weather-current">
                                                                    <div class="weather-stat">
                                                                        Previous Close: $${Number(data.pc).toFixed(2)}
                                                                    </div>
                                                                    <div class="weather-stat">
                                                                        High: $${Number(data.h).toFixed(2)}
                                                                    </div>
                                                                    <div class="weather-stat">
                                                                        Low: $${Number(data.l).toFixed(2)}
                                                                    </div>
                                                                    <div class="weather-stat">
                                                                        Open: $${Number(data.o).toFixed(2)}
                                                                    </div>
                                                                </div>
                                                                <br/>
                                                                <button onclick="addToWatchlist('${symbol}')">🔍Add</button>
                                                            </div>`;
    } catch{
        document.getElementById("stockResults").innerHTML = `<p>${escapeHTML(error.message)}</p>`;
    }
}

// function to search for company based on user query
async function searchCompany(){
    const query = document.getElementById("stockSymbol").value.trim();
    const key = localStorage.getItem("gStockKey");
    if (!key){
        document.getElementById("companyResults").innerHTML = "<p>Please enter API first.</p>";
        return;
    }
    if (!query) return;
    try{
        // request to stock api
        const response = await fetch(`${API.stocks}/search?q=${encodeURIComponent(query)}&token=${encodeURIComponent(key)}`);
        const data = await response.json();
        // show search sugeestions
        const results = (data.result || []).filter(x => x.type === "Common stock").slice(0, 5);
        // map info into clickable cards 
        document.getElementById("companyResults").innerHTML = results.map(company => 
            `<div class="card">
                <strong>${escapeHTML(company.symbol)}</strong> - ${escapeHTML(company.description)}
                <button style="float:right" onclick="loadStock('${escapeHTML(company.symbol)}')">View</button>
            </div>`
        ).join("");
    } catch(error){
        document.getElementById("companyResults").innerHTML = `<p>${escapeHTML(error.message)}</p>`;
    }
}
