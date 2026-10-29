// enforce strict mode
'use strict';

// geographic coordinates of Nepal object
const NEPAL_COORDS = {
    minLat: 26.0,
    maxLat: 31.0,
    minLon: 80.0,
    maxLOn: 89.0
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