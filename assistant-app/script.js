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
    document.getElementById("newsKey").value = localStorage.getItem("gNewsKey") || "";
    document.getElementById("weatherKey").value = localStorage.getItem("gWeatherKey") || "";
    document.getElementById("stockKey").value = localStorage.getItem("gStockKey") || "";
}

function updateClock(){
    const now = new Date();
    document.getElementById("clock").textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();