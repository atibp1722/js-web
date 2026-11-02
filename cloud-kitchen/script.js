// enforce strict mode
'use strict';

// configuration object holding restaurant details
const CONFIG = {
    brand: "Himalicious Kitchen",
    currency: "Rs.",
    whatsapp: "9779800000000",
    viber: "9779800000000",
    phone: "9779800000000",
    messenger: "himalicious",
    address: "Koteswore, Kathmandu (--pickups only)",
    hours: {open: 9 * 60, close: 22 * 60 + 30},
    minDeliveryOrder: 500,
    freeDeliveryOrder: 1500,
    zones: [
        {id: "ktm", name: "Kathmandu (Core)", fee: 75, eta: "30-45 mins"},
        {id: "ptn", name: "Patan / Lalitpur", fee: 100, eta: "40-50 mins"},
        {id: "bkt", name: "Bhaktapur / Suryabinayak", fee: 150, eta: "45-75 mins"},
        {id: "ktm1", name: "Balaju / Kirtipur / Budhanilkantha", fee: 125, eta: "50-60 mins"}
    ],
    // default daily restaurant specials
    defaultSpecial: {"Sukuti Choila": 250, "Chyangra Thakali": null},
    // staff dashboard timeout
    staffSession: 15
};

// food categories
const CATEGORIES = [
    {id: "momo", label: "Momo", pic: "🥟"},
    {id: "thali", label: "Khana Set", pic: "🍛"},
    {id: "newari", label: "Newa Kitchen", pic: "🍝"},
    {id: "himalayan", label: "Himalayan", pic: "🍜"},
    {id: "sweets", label: "Sweets", pic: "🍰"},
    {id: "snacks", label: "Snacks & Sides", pic: "🍟"},
    {id: "drinks", label: "Cold & Hot", pic: "🫖"}
];

// convert tags to readable format
const TAGS = {
    diet: {vegan: "Vegan", gf: "Gluten-Free", dairy: "Contains Dairy"},
    culture: {newari: "Newari", thakali: "Thakali", tibetian: "Tibetian", pahadi: "Pahadi", festive: "Festive"}
};

// diet filters for selection
const DIET_FILTERS = [
    {key: "veg", label: "🟢 Vegetarian"},
    {key: "vegan", label: "Vegan"},
    {key: "gf", label: "Gluten-Free"},
    {key: "mild", label: "Mild (no heat)"}
];

// menu containing restaurant items
const MENU = [
    // momo related items
    {id: "momo-chicken", cat: "momo", name: "Chicken Momo Steam", np: "", price: 200, pic: "🥟", spice: 1, diet: [], culture: ["newari", "tibetian"], desc: ""},
    {id: "momo-buff", cat: "momo", name: "Buff Momo Steam", np: "", price: 200, pic: "", spice: 1, diet: [], culture: ["newari", "tibetian"], desc: ""},
    {id: "momo-veg", cat: "momo", name: "Veg Momo Steam", np: "", price: 200, pic: "", spice: 1, diet: ["vegan", "gf"], culture: ["newari", "tibetian"], desc: ""},
    {id: "momo-jhol", cat: "momo", name: "Chicken Momo Jhol", np: "", price: 200, pic: "", spice: 2, diet: [], culture: ["newari", "tibetian"], desc: ""},
    {id: "momo-fry", cat: "momo", name: "Buff Momo Kothey", np: "", price: 200, pic: "", spice: 1, diet: [], culture: ["newari", "tibetian"], desc: ""},
    // thakali related items
    {id: "thakali-veg", cat: "thali", name: "Veg Thakali Khana", np: "", price: 300, pic: "🍛", spice: 1, diet: ["veg", "dairy"], culture: ["thakali"], desc: ""},
    {id: "thakali-chicken", cat: "thali", name: "Chicken Thakali Khana", np: "", price: 300, pic: "🍛", spice: 1, diet: [], culture: ["thakali"], desc: ""},
    {id: "thakali-mutton", cat: "thali", name: "Mutton Thakali Khana", np: "", price: 300, pic: "🍛", spice: 1, diet: [], culture: ["thakali"], desc: ""},
    {id: "thakali-fish", cat: "thali", name: "Fish Thakali Khana", np: "", price: 300, pic: "🍛", spice: 1, diet: [], culture: ["thakali"], desc: ""},
    // newari related items
    {id: "choila", cat: "newari", name: "Mushroom Choila", np: "", price: 300, pic: "🍝", spice: 2, diet: ["veg", "gf", "mild"], culture: ["newari"], desc: ""},
    {id: "chatamari", cat: "newari", name: "Chatamari", np: "", price: 300, pic: "🍝", spice: 1, diet: ["veg"], culture: ["newari"], desc: ""},
    {id: "bara", cat: "newari", name: "Egg & Keema Bara", np: "", price: 300, pic: "🍝", spice: 1, diet: [], culture: ["newari"], desc: ""},
    {id: "yomari", cat: "newari", name: "Chaku (Molasses) Yomari", np: "", price: 300, pic: "🍝", spice: 1, diet: ["veg"], culture: ["newari"], desc: ""},
    //himalayan related items
    {id: "thupka-chicken", cat: "himalayan", name: "Boiled Chicken Thupka", np: "", price: 300, pic: "🍜", spice: 1, diet: ["dairy"], culture: ["tibetian"], desc: ""},
    {id: "thupka-veg", cat: "himalayan", name: "Steamed Veg Thupka", np: "", price: 300, pic: "🍜", spice: 1, diet: ["veg", "vegan"], culture: ["tibetian"], desc: ""},
    {id: "thupka-vegan", cat: "himalayan", name: "Wheat-less Noodle Thupka", np: "", price: 300, pic: "🍜", spice: 1, diet: ["veg", "vegan"], culture: ["tibetian"], desc: ""},
    {id: "syabale", cat: "himalayan", name: "Deep Fried Mince Filled Pastry", np: "", price: 300, pic: "🍜", spice: 1, diet: [], culture: ["tibetian"], desc: ""},
    // sweets related items
    {id: "juju-dhau", cat: "sweets", name: "Juju Dhau", np: "", price: 300, pic: "🍰", spice: 1, diet: ["veg", "dairy"], culture: ["newari"], desc: ""},
    {id: "kheer", cat: "sweets", name: "Rice & Coconut Kheer", np: "", price: 300, pic: "🍰", spice: 1, diet: ["veg", "dairy"], culture: ["festive"], desc: ""},
    {id: "anarsa", cat: "sweets", name: "Fried Rice Biscuit", np: "", price: 300, pic: "🍰", spice: 1, diet: ["veg"], culture: ["festive"], desc: ""},
    // snacks related items
    {id: "mustang-aloo", cat: "snacks", name: "Deep Fried Spicy Potato Wedges", np: "", price: 300, pic: "🍟", spice: 3, diet: ["veg", "vegan"], culture: ["himalayan"], desc: ""},
    {id: "potato-fries", cat: "snacks", name: "Classic Salted Fries", np: "", price: 300, pic: "🍟", spice: 1, diet: ["veg", "vegan"], culture: ["newari"], desc: ""},
    {id: "aloo-char", cat: "snacks", name: "Spicy Potato Pickle", np: "", price: 300, pic: "🍟", spice: 3, diet: ["veg", "vegan"], culture: ["pahadi"], desc: ""},
    {id: "chatpatey", cat: "snacks", name: "Spiced Puffed Wheat Salad", np: "", price: 300, pic: "🍟", spice: 3, diet: ["veg"], culture: ["pahadi"], desc: ""},
    // drink related items
    {id: "chiya", cat: "drinks", name: "Classic Milk Tea", np: "", price: 300, pic: "🫖", spice: 1, diet: ["vegan", "dairy"], culture: ["pahadi"], desc: ""},
    {id: "tongba", cat: "drinks", name: "Millet Based Alcoholic Beverage", np: "", price: 300, pic: "🧉", spice: 1, diet: ["vegan"], culture: ["festive", "tibetian"], desc: ""},
    {id: "coffee", cat: "drinks", name: "Classic Milk Tea", np: "", price: 300, pic: "☕", spice: 1, diet: ["veg", "vegan"], culture: ["pahadi"], desc: ""},
    {id: "lemonade", cat: "drinks", name: "Nepali Style Lemonade", np: "", price: 300, pic: "🍋", spice: 1, diet: [], culture: ["festive"], desc: ""},
    {id: "chiso", cat: "drinks", name: "Coke / Fanta / Sprite", np: "", price: 300, pic: "🥤", spice: 1, diet: [], culture: ["pahadi"], desc: ""}
];

// map id with their objects
const BY_ID = new Map(MENU.map(m => [m.id, m]));
// function for whether item is veg or vegan
const isVeg = m => m.diet.includes("veg") || m.diet.includes("vegan");

// iterate menu item to generate words for search and filter
for(const m of MENU){
    const syn = [
        isVeg(m) ? "vegetarian veg" : "nonveg meat",
        m.diet.includes("vegan") ? "vegan" : "",
        m.diet.includes("gf") ? "gluten free glutenfree" : "",
        m.diet.includes("dairy") ? "dairy" : "",
        m.spice >= 2 ? "spicy hot" : "mild",
        m.culture.map(c => TAGS.culture[c].join("")),
        CATEGORIES.find(c => c.id === m.cat).label
    ].join("");
    // parse and split into arrays
    m_words = `${m.name} ${m.np} ${m.desc} ${syn}`.toLowerCase().split(/[^a-z0-9\u0900-\u097f]+/).filter(Boolean);
}

// wrapper for error handling
const store = {
    prefix: "hh:",
    // retrieve and parse json data
    get(key, fallback){
        try{
            const v = localStorage.getItem(this.prefix + key);
            return v ? JSON.parse(v) : fallback;
        } catch{
            return false;
        }
    // stringify and save data    
    }, set(key, val){
        try{
            localStorage.setItem(this.prefix + key, JSON.stringify(val));
            return true;
        } catch{
            return false;
        }
    }
}

// state holding restaurant objects and their parameters
const STATE = {
    query: "", 
    cat: "all", 
    diet: new Set(), 
    culture: "all", 
    sort: "default", 
    hideSold: false,
    cart: store.get("cart", {}),
    overrides: store.get("overrides", {}),
    specials: store.get("specials", {Date: null, items: {}})
};