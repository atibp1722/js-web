// enforce strict mode
'use strict';

// geographic coordinates of Nepal object
const NEPAL_COORDS = {
    minLat: 26.0,
    maxLat: 31.0,
    minLon: 80.0,
    maxLon: 89.0
};

// object for api endpoints 
const API = {
    USGS: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php",
    FLOODS: "https://flood-api.open-meteo.com/v1/flood",
    AIR: "https://air-quality-api.open-meteo.com/v1/air-quality",
    NOMINATIM: "https://nominatim.openstreetmap.org/search"
};

// array of famous major rivers
const RIVERS = [
    {name: "Koshi (Chatara)", lat: 26.85, lon: 87.15, system: "Himalayan"},
    {name: "Karnali (Chispani)", lat: 28.65, lon: 81.28, system: "Himalayan"},
    {name: "Narayani (Devghat)", lat: 27.70, lon: 84.42, system: "Himalayan"},
    {name: "Mahakali (Kanchanpur)", lat: 29.00, lon: 80.20, system: "Himalayan"},
    {name: "Babai (Rajapur)", lat: 28.45, lon: 81.35, system: "Himalayan"},
    {name: "Rapti (Bhalubang)", lat: 27.75, lon: 82.55, system: "Mahabharat"},
    {name: "Bagmati (Karmaiya)", lat: 27.46, lon: 85.25, system: "Mahabharat"},
    {name: "Kamala (Jaleshwar)", lat: 27.25, lon: 85.95, system: "Mahabharat"},
    {name: "Kankai (Domalal)", lat: 26.40, lon: 87.40, system: "Mahabharat"},
    {name: "Mechi (Kakarbhitta)", lat: 26.35, lon: 88.05, system: "Mahabharat"}
];

// array of famous major lakes
const LAKES = [
    {name: "Phewa Lake", lat: 28.21, lon: 83.95, city: "Pokhara"},
    {name: "Begna Lake", lat: 28.18, lon: 84.10, city: "Pokhara"},
    {name: "Rupa Lake", lat: 28.16, lon: 84.12, city: "Pokhara"},
    {name: "Rara Lake", lat: 29.53, lon: 82.08, city: "Mugu"},
    {name: "Tilicho Lake", lat: 28.68, lon: 83.85, city: "Annapurna"},
    {name: "Shey Phoksundo", lat: 29.20, lon: 82.95, city: "Dolpa"},
    {name: "Tso Rolpa", lat: 27.83, lon: 85.47, city: "Rolwaling"},
    {name: "Imjo Lake", lat: 27.98, lon: 85.93, city: "Everest"},
    {name: "Gokyo Lake", lat: 27.95, lon: 87.68, city: "Everest"}
];

// variable declaration
let earthquakes = [];
let rivers = [];
let map, eqLayer, riverLayer, cityMarker;
let currentCity = null;

// get reference to html elements having id
const $ = (id) => document.getElementById(id);

// function to set status
function setStatus(state, text){
    const dot = $("statusDot");
    dot.className = "dot";
    if (state === "loading"){
        dot.classList.add("loading");
    } else if (state === "error"){
        dot.classList.add("error");
    }
    $("statusText").textContent = text || state;
}

// function to convert date to format 5m, 2h, 3d
function timeAgo(iso){
    if (!iso) return;
    // elapsed time in seconds
    const d = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (d < 60) return `${d}s`;
    if (d < 3600) return `${Math.floor(d / 60)}m`;
    if (d < 86400) return `${Math.floor(d / 3600)}h`;
    return `${Math.floor(d / 86400)}d`;
}

// function to calculate km distance between coordinates
function distanceInKm(lat1, lon1, lat2, lon2){
    // earth total radius
    const R = 6371;
    // lat and lon difference converted to radian values
    const dLat = (lat2 -lat1) * Math.PI / 180;
    const dLon = (lon2 -lon1) * Math.PI / 180;
    // haversine formula
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    // final distance kn km
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// function categorize earthquake risk
function magRiskClass(mag){
    if (mag >= 6) return "high";
    if (mag >= 4.5) return "medium";
    return "low";
}

// function to assign css class to conditional risk values
function magValueClass(mag){
    if (mag >= 6) return "val-high";
    if (mag >= 4.5) return "val-medium";
    return "val-low";
}

// function categorize flood risk
function floodRiskClass(ratio){
    if (ratio >= 0.85) return "high";
    if (ratio >= 0.6) return "medium";
    return "low";
}

// function to assign css class to conditional flood values
function floodValueClass(ratio){
    if (ratio >= 0.85) return "val-high";
    if (ratio >= 0.6) return "val-medium";
    return "val-low";
}

// function to intialize map using leaflet
function initMap(){
    // Nepal map at zoom level 6 
    map = L.map("map").setView([28.3, 84.1], 6);
    // map key attributes
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: "&copy; OSM &copy; CARTO",
        subdomains: "abcd",
        maxZoom: 19
    }).addTo(map);
    // add earthquake and river layer to map
    eqLayer = L.layerGroup.addTo(map);
    riverLayer = L.layerGroup.addTo(map);
}

// function to update map based on earthquake and river 
function updateMapMarkers(){
    if (!map) return;
    eqLayer.clearLayers();
    // iterate 50 latest earthquakes
    earthquakes.slice(0, 50).forEach((f) => {
        // extract lat and lon coordinates
        const [lon, lat] = f.geometry.coordinates;
        // extract earthquake properties
        const p = f.properties;
        // color based on magnitude value
        const color = p.mag >= 6 ? "#f44336" : p.mag >= 4.5 ? "#ff9800" : "#4caf50";
        // radius marker based on magnitude
        const radius = Math.max(3, Math.min(10, (p.mag || 1) * 1.8));
        L.circleMarker([lat, lon], {
            radius, color, 
            fillColor: color,
            fillOpacity: 0.4,
            weight: 1
        // bind popup info with earthquake layer
        }).bindPop(`<b>${p.place}</b><br>` + `M${p.mag?.toFixed(1)}.${timeAgo(new Date(p.time).toISOString())} ago`).addTo(eqLayer);
    });
    riverLayer.clearLayers();
    // iterate rivers
    rivers.forEach((rv) => {
        // calculate discharge ration
        const ratio = rv.discharge && rv.maxDischarge ? rv.discharge / rv.maxDischarge : 0;
        // color based on discharge ratio
        const color = ratio >= 0.85 ? "#f44336" : ratio >= 0.6 ? "#ff9800" : "#4caf50";
        L.circleMarker([rv.lat, rv.lon], {
            radius: 6,
            color,
            fillColor: color,
            fillOpacity: 0.7,
            weight: 2
        // bind popup info with river layer    
        }).bindPop(`<b>${rv.name}</b><br>` + `${rv.discharge?.toFixed(0) || "?"}m³/s`).addTo(riverLayer);
    });
}

// function to get earthquakes data from api
async function fetchEarthquakes(){
    setStatus("loading", "Seismic...");
    // fetch data from api
    try{
        const res = await fetch(API.USGS);
        if (!res.ok){
            throw new Error(`HTTP ${res.status}`);
        }
        // parse response as json
        const data = await res.json();
        // filter using Nepal coordinates
        earthquakes = (data.features || []).filter((f) => {
            const [lon, lat] = f.geometry.coordinates;
            return(
                lat >= NEPAL_COORDS.minLat &&
                lat <= NEPAL_COORDS.maxLat && 
                lon >= NEPAL_COORDS.minLon &&
                lon <= NEPAL_COORDS.maxLon 
            );
        // sort latest earthquakes     
        }).sort((a, b) => b.properties.time - a.properties.time);
        renderEarthquakes();
        // update map markers with earthquakes
        updateMapMarkers();
        // if still loading switch to live
        if ($("statusDot").classList.contains("loading")){
            setStatus("ok", "Live");
        }
    // catch errors and display them    
    } catch(err){
        console.error("Error fetching earthquakes", err);
        $("eqList").innerHTML = `<div class="error-msg">${err.message}</div>`;
        setStatus("error", "Seismic error");
    }
}

// function to render earthquakes on webpage
function renderEarthquakes(){
    // update count
    $("eqCount").textContent = earthquakes.length;
    // show message and exit if none found
    if (!earthquakes.length){
        $("eqList").innerHTML = '<div class="placeholder">No earthquakes in the region.</div>';
        return;
    }
    // map earthquakes into cards and join 
    $("eqList").innerHTML = earthquakes.slice(0, 15).map((f) => {
        const p = f.properties;
        return `
               <div class="data-item ${magRiskClass(p.mag)}">
                    <div class="item-main">
                        <div class="item-title">${p.place || "Unknown"}</div>
                        <div class="item-meta">
                            ${timeAgo(new Date(p.time).toISOString())} ago
                        </div>
                    </div>
                    <div class="item-value ${magValueClass(p.mag)}">
                        M${p.mag?.toFixed(1) || "?"}
                    </div>
               </div>`;
    }).join("");
}

// function to get river data from api
async function fetchRivers(){
    setStatus("loading", "Rivers...");
    // store river data
    const results = [];
    // iterate each river object
    for (const rv of RIVERS){
        try{
            // url parameters for flood api
            const params = new URLSearchParams({
                latitude: rv.lat,
                longitude: rv.lon,
                daily: "river_discharge",
                forecast_days: 7,
                timezone: "auto"
            });
            // discharge info from river coordinates
            const res = await fetch(`${API.FLOODS}?${params}`);
            if (!res.ok) continue;
            const data = await res.json();
            // filter null values 
            const vals = (data.daily?.river_discharge || []).filter((v) => v != null);
            if (!vals.length) continue;
            // push data into array
            results.push({
                ...rv, 
                discharge: vals[0],
                maxDischarge: Math.max(...vals)
            });
        // catch error without breaking iteration cycle    
        } catch (err){
            console.warn(`${rv.name} river data fetch failed.`, err);
        }
    }
    // array data into variable
    rivers = results;
    renderRivers();
    // update map markers with rivers
    updateMapMarkers();
    if ($("statusDot").classList.contains("loading")){
        setStatus("ok", "Live")
    }
}

// function to render river on webpage
function renderRivers(){
    // update count
    $("riverCount").textContent = rivers.length;
    // show message and exit if no data found
    if (!rivers.length){
        $("riverList").innerHTML = `<div class="placeholder">No river data available.</div>`;
        return;
    }
    // map river object into card and join
    $("riverList").innerHTML = rivers.map((rv) => {
        // ratio of current discharge to max discharge
        const ratio = rv.discharge && rv.maxDischarge ? rv.discharge / rv.maxDischarge : 0;
        return `
               <div class="data-item ${floodRiskClass(ratio)}">
                    <div class="item-main">
                        <div class="item_title">${rv.name}</div>
                        <div class="item_meta">${rv.system}</div>
                    </div>
                    <div class="item-value ${floodValueClass(ratio)}">
                        ${rv.discharge?.toFixed(0) || "?"} m³/s
                    </div>
               </div>`;
    }).join("");
}

// function to take Nepal city name and return its coordinates
async function geocodeCity(name){
    // params for nominatim request
    const params = new URLSearchParams({
        q: `${name}, Nepal`,
        format: 'json',
        limit: 1,
        addressdetails: 1
    });
    // fetch data with english language
    const res = await fetch (`${API.NOMINATIM}?${params}`, {
        headers: {'Accept-Language': "en"}
    });
    if (!res.ok){
        throw new Error("Geocding service unavailable.");
    }
    // parse into json
    const data = await res.json();
    // error if nothhing found
    if (!data.length){
        throw new Error("No such city in Nepal.");
    }
    // return city coordinates
    return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        displayName: data[0].display_name.split(",")[0]
    };
}

// main function to handle geocoding, get info, update map and webpage details
async function searchCity(){
    // get user input
    const input = $("cityInput").value.trim();
    if (!input) return;
    $("cityResultContainer").style.display = "none";
    setStatus("loading", "Geocoding...");
    try{
        // wait geocoding results
        const city = await geocodeCity(input);
        currentCity = city;
        // update webpage with details
        $("cityName").textContent = city.displayName;
        $("cityCoords").textContent = `${city.lat.toFixed(3)}°N, ${city.lon.toFixed(3)}°E`;
        $("cityResultContainer").style.display = "block";
        // variables for river near city
        let nearestRiver = null;
        let minDist = Infinity;
        // iterate rivers to find minimum distance from city coordinates
        rivers.forEach((rv) => {
            const d = distanceInKm(city.lat, city.lon, rv.lat, rv.lon);
            if (d < minDist){
                minDist = d;
                nearestRiver = rv;
            }
        });
        // when found update ratio and category
        if (nearestRiver){
            const ratio = nearestRiver.discharge && nearestRiver.maxDischarge ? nearestRiver.discharge / nearestRiver.maxDischarge : 0;
            let label, labelClass;
            // risk based on discharge ration
            if (ratio >= 0.85){
                label = "High Risk";
                labelClass = "warn-text";
            } else if (ratio >= 0.6){
                label = "Elevated";
                labelClass = "mid-text";
            } else{
                label = "Ok";
                labelClass = "ok-text";
            }
            // put info into its dom
            $("nearestRiverBox").innerHTML = `
                                             <div class="big-num ${labelClass}">${label}</div>
                                             <div class="sub">${nearestRiver.name}</div>
                                             <div class="sub" style="margin-top: 0.3rem;">
                                                Distance: ${minDist.toFixed(1)} km ⬩ ${nearestRiver.discharge.toFixed() || "?"} m³/s (${(ratio * 100).toFixed(0)}% of peak)
                                             </div>
                                             <div class="sub">System: ${nearestRiver.system}</div>`;
        } else{
            // error messsage if none found
            $("nearestRiverBox").innerHTML = '<span class="sub">No river data available</span>';
        }
        // get earthquakes within 100km of user entered city
        const nearbyEarthquakes = earthquakes.filter((f) => {
            const [lon, lat] = f.geometry.coordinates;
            return (
                distanceInKm(city.lat, city.lon, lat, lon) <= 100
            );
        }).slice(0, 5);
        // get nearby earthquakes
        if (nearbyEarthquakes.length){
            $("nearbyEqBox").innerHTML = nearbyEarthquakes.map((f) => {
                const p = f.properties;
                const [lon, lat] = f.geometry.coordinates;
                const d = distanceInKm(city.lat, city.lon, lat, lon);
                const cls = p.mag >= 5 ? "warn-text" : "";
                return `
                       <div class="nearby-item">
                            <span class="name ${cls}">
                                M${p.mag?.toFixed(1)}
                            </span>
                            <span class="dist">
                                ${d.toFixed(0)} km ⬩ ${timeAgo(new Date(p.time).toISOString())} ago
                            </span>
                       </div>`
            }).join("");
        } else{
            // error message if none found
            $("nearbyEqBox").innerHTML = '<span class="ok-text" style="font-size: 0.75rem;">' + 'No earthquakes within 100 kms.</span>';
        }
        // get aqi data for user entered city
        try{
            const aqParams = new URLSearchParams({
                latitude: city.lat,
                longitude: city.lon,
                current: 'pm2_5,us_aqi',
                timezone: 'auto'
            });
            const aqRes = await fetch (`${API.AIR}?${aqParams}`);
            if (aqRes.ok){
                const aqData = await aqRes.json();
                const pm25 = aqData.current?.pm2_5;
                const aqi = aqData.current?.us_aqi;
                // aqi categorization labels
                let aqiLabel = "Good";
                let aqiClass = "ok-text";
                if (aqi > 150){
                    aqiLabel = "Unhealthy";
                    aqiClass = "warn-text";
                } else if (aqi > 100){
                    aqiLabel = "Sensetive";
                    aqiClass = "mid-text";
                } else if (aqi > 50){
                    aqiLabel = "Moderate";
                    aqiClass = "ok-text";
                }
                // put info into its dom
                $("aqBox").innerHTML = `
                                       <div class="big-num ${aqiClass}">${aqiClass ?? "?"}</div>
                                       <div class="sub">AQI: ${aqiLabel}</div>
                                       <div class="sub">PM2.5: ${pm25 ?? "?"}</div>`;
            } else{
                $("aqBox").innerHTML = '<span class="sub">AQI data unavaiable.</span>';
            }
        } catch (err){
            $("aqBox").innerHTML = '<span class="sub">AQI data unavaiable.</span>';
        }
        // get lakes within 50km of user entered city
        const nearbyLakes = LAKES.filter((lk) => distanceInKm(city.lat, city.lon, lk.lat, lk.lon) <= 50);
        if (nearbyLakes.length){
            $("lakeBox").innerHTML = '<div class="sub" style="margin-bottom: 0.2rem; font-weight: 500;">' + 
                                     'Nearby Lakes: </div>' + 
                                     nearbyLakes.map((lk) => {
                                        const d = distanceInKm(city.lat, city.lon, lk.lat, lk.lon);
                                        return `
                                               <div class="nearby-item">
                                                    <span class="name">${lk.name}</span>
                                                    <span class="dist">${d.toFixed(0)} km</span>
                                               </div>`;
                                     }).join("");
        } else{
            $("lakeBox").innerHTML = '<span class="sub" style="font-size: 0.7rem;">No lakes within 50km.</span>';
        }
        // remove existing city marker
        if (cityMarker) map.removeLayer(cityMarker);
        // new marker for user entered city
        cityMarker = L.marker([city.lat, city.lon]).addTo(map).bindPop(`<b>${city.displayName}</b><br>Your search location`).openPopup();
        // zoom to new city
        map.setView([city.lat, city.lon], 9);
        setStatus("ok", "Live");
    } catch (err){
        // handle errors
        console.error("Error searching city.", err);
        $("cityName").textContent = "Not Found";
        $("cityCoords").textContent = "";
        $("cityResultContainer").style.display = "block";
        $("nearestRiverBox").innerHTML = `<span class="warn-text" style="font-size: 0.75rem">${err.message}</span>`;
        $("nearestEqBox").innerHTML = "";
        $("aqBox").innerHTML = "";
        $("lakeBox").innerHTML = "";
        setStatus("error", "City error");
    }
}

// function to toggle between light and dark theme
function toggleTheme(){
    // toggle light class
    document.body.classList.toggle("light");
    // save current theme
    localStorage.setItem('nepalTheme', document.body.classList.contains("light") ? "light" : "dark");
}

// initialization function
async function init(){
    // check light theme previosuly saved and apply it 
    if (localStorage.getItem("nepalTheme") === "light"){
        document.body.classList.add("light");
    }
    // initialize map
    initMap();
    // listener on theme toggle button
    $("themeToggle").addEventListener("click", toggleTheme);
    // listener on city search button
    $("searchCityBtn").addEventListener("click", searchCity);
    // listener to trigger search on enter press
    $("cityInput").addEventListener("keydown", (e) => {
        if (e.key === "Enter"){
            searchCity();
        }
    });
    // get earthquakes and rivers concurrently
    await Promise.allSettled([fetchEarthquakes(), fetchRivers()]);
    // check for error during initialization
    if (!$("statusDot").classList.contains("error")){
        setStatus("ok", "Live");
    }
    // update last updated details
    $("lastUpdated").textContent = `Updated ${new Date().toLocaleTimeString()}`;
    // interval to refresh data every 3 minutes
    setInterval(async () => {
        await Promise.allSettled([fetchEarthquakes(), fetchRivers()]);
        $("lastUpdated").textContent = `Updated ${new Date().toLocaleTimeString()}`;
    }, 3 * 60 * 1000);
}
init();