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

