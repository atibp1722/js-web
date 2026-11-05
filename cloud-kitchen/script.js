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
        m.culture.map(c => TAGS.culture[c] || []).join(""),
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

// shorthands for selectors
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
// prevent cross scripting attack
const escapeHTML = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
// price in Nepalese format
const money = n => `${CONFIG.currency} ${Number(n).toLocaleString('en-NP')}`;
// limit function triggering
const debounce = (fn, ms = 150) => {let t; return (...a) => {clearTimeout(t); t = setTimeout(() => fn(...a), ms);};};
// lookup for delivery zone
const zoneID = id => CONFIG.zones.find(z => z.id === id) || CONFIG.zones[0];

// function to format time to Nepal time
function liveTime(){
    const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kathmandu",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    }).formatToParts(new Date());
    // extract specific date/time part
    const g = t => parts.find(p => p.type === t).value;
    return {
        // YYYY-MM-DD format
        date: `${g("year")}-${g("month")}-${g("day")}`,
        // minutes elapsed
        minutes: (+g("hour") % 24) * 60 + +g("minute") 
    };
}

// function to format time in AM or PM
const formatTime = m => {
    const h = Math.floor(m / 60), mm = String(m % 60).padStart(2, "0");
    return `${((h + 11) % 12) + 1}:${mm} ${h < 12 ? "AM" : "PM"}`;
}

let toastTimer;
// function to set toast content
function toast(msg){
    const t = $("#toast");
    // toast message
    t.textContent = msg;
    // display notification
    t.classList.add("show");
    // clear after 3s
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        // hide toast
        t.classList.remove("show")
    }, 3000);
}

// async function to copy text
async function textCopy(text){
    // get text from clipboard
    try{
        await navigator.clipboard.writeText(text);
        return true;
    } catch{
        // fallback using textarea
        const ta = Object.assign(document.createElement("textarea"), {value: text});
        ta.style.cssText = "position: fixed; opacity: 0;";
        document.body.appendChild(ta);
        ta.select();
        let ok = false;
        try{
            ok = document.execCommand("copy");
        } catch{

        }
        // clean textarea
        document.body.removeChild(ta);
        return ok;
    }
}

// check if special exist for current date if no fallback to default specials
const activeSpecials = () => STATE.specials.date === liveTime().date ? STATE.specials.items : CONFIG.defaultSpecial;

// function to process object and make ready for display
function view(m){
    // get soldout overrides
    const o = STATE.overrides[m.id] || {};
    // base price
    const base = Number.isFinite(o.price) ? o.price : m.price;
    // current day specials
    const sp = activeSpecials();
    // menu item is current day special
    const isSpecial = m.id in sp;
    // spcial price only if it is special
    const sPrice = isSpecial && Number.isFinite(sp[m.id]) ? sp[m.id] : null;
    // return object with all properties
    return {...m, base, isSpecial, 
        price: sPrice ?? base, 
        soldOut: !!o.soldOut
    };
}

// function to highlight text from search
function highlight(text, tokens){
    if (!tokens.length){
        return escapeHTML(text);
    } 
    // regular expression to match search query and escape regex characters
    const regex = new RegExp('(' + tokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'gi');
    // split and pattern matching using regex
    return text.split(regex).map((part, i) => i % 2 ? `<mark>${escapeHTML(part)}</mark>` : escapeHTML(part)).join("");
}

// function to create dynamic menu card
function cardHTML(v, tokens = []){
    // quantity in cart
    const qty = STATE.cart[v.id] || 0;
    // diet tags
    const tags = [
        ...v.diet.filter(d => TAGS.diet[d]).map(d => `<span class="tag diet">${escapeHTML(TAGS.diet[d])}</span>`),
        ...v.culture.map(c => `<span class="tag cult">${escapeHTML(TAGS.culture[c])}</span>`)
    ].join("");
    // create helper for spice level visualization
    const spice = v.spice ? `<span class="spice" role="img" aria-label="Spice Level ${v.spice} of 3">${"🌶️".repeat(v.spice)}</span>` : "";
    // price display to cross put base price and show discounted price
    const price = v.isSpecial && v.price < v.base ? `<span class="price"><s>${money(v.base)}</s>${money(v.price)}</span>` : `<span class="price">${money(v.price)}</span>`;
    let action;
    // if item sold out
    if (v.soldOut){
        action = `<button class="btn" disabled>Sold Out</button>`;
    } else if (qty){
        // quanity "+/-" button
        action = `<span class="stepper"><button data-act="dec" data-id="${v.id}" aria-label="Remove ${escapeHTML(v.name)}">-</button><span aria-live="polite">${qty}</span><button data-act="inc" data-id="${v.id}" aria-label="Add One More ${escapeHTML(v.name)}">+</button></span>`;
    } else{
        // "+" button if item not in cart
        action = `<button class="btn" data-act="add" data-id="${v.id}">Add +</button>`;
    }
    // template string literal for menu card
    return `<article class="card ${v.soldOut ? "sold" : ""}" data-cat="${v.cat}">
                ${v.soldOut ? '<span class="badge sold">Sold out today</span>' : v.isSpecial ? '<span class="badge">⭐ Today\'s Special</span>' : ""}
                <div class="thumb" aria-hidden="true">${v.pic}</div>
                <div class="body">
                    <div class="top">
                        <span class="dot ${isVeg(v) ? "veg" : "nonveg"}" title="${isVeg(v) ? "Vegetarian" : "Non-Vegetarian"}"></span>
                        <h3>${highlight(v.name, tokens)}</h3>
                    </div>
                    <div class="np" lang="ne">${highlight(v.np, tokens)}</div>
                    <p class="desc">${highlight(v.desc, tokens)}</p>
                    <div class="tags">${tags} ${spice}</div>
                    <div class="foot">${price} ${action}</div>
                </div>
            </article>`;
}

// function to handle filter by diet, culture
function getFiltered(){
    // search query convert and split
    const tokens = STATE.query.toLowerCase().split(/\s+/).filter(Boolean);
    // map to view state and filter
    let list = MENU.map(view).filter(v => {
        // exclusion conditions
        if (STATE.cat !== "all" && v.cat !== STATE.cat) return false;
        if (STATE.hideSold && v.soldOut) return false;
        if (STATE.culture !== "all" && !v.culture.includes(STATE.culture)) return false;
        // iterate all diet restrictions
        for(const d of STATE.diet){
            if (d === "veg" && !isVeg(v)) return false;
            if (d === "vegan" && !v.diet.includes("vegan")) return false;
            if (d === "gf" && !v.diet.includes("gf")) return false;
            if (d === "mild" && v.spice > 1) return false;
        }
        // search query matching
        return tokens.every(t => v._words.some(w => w.startsWith(t)));
    });
    // sorters
    const sorters = {
        priceAsc: (a, b) => a.price - b.price, 
        priceDesc: (a, b) => b.price - a.price,
        spice: (a, b) => b.spice - a.spice,
        name: (a, b) => a.name.localeCompare(b.name)
    };
    // valid sorter trigger
    if (sorters[STATE.sort]){
        list.sort(sorters[STATE.sort]);
    }
    // return filtered list and search query
    return {list, tokens};
}

// function for filter chip (category, diet and culture)
function renderControls(){
    // display category filters
    $("#catChips").innerHTML = [
        {id: "all", label: "All"},
        ...CATEGORIES.map(c => ({id: c.id, label: `${c.pic} ${c.label}`}))
    ].map(c => `<button class="chip" data-cat="${c.id}" aria-pressed="${STATE.cat === c.id}">${escapeHTML(c.label)}</button>`).join("");
    // display dietary filters
    $("#dietChips").innerHTML = DIET_FILTERS.map(f => `<button class="chip" data-diet="${f.key}" aria-pressed="${STATE.diet.has(f.key)}">${escapeHTML(f.label)}</button>`).join("");
    // display cultural filters
    $("#cultChips").innerHTML = [
        ["all", "All Cuisines"],
        ...Object.entries(TAGS.culture)
    ].map(([k, l]) => `<button class="chip cult" data-cult="${k}" aria-pressed="${STATE.culture === k}">${escapeHTML(l)}</button>`).join("");
}

// function to display menu
function renderMenu(){
    // get filtered list and search query
    const {list, tokens} = getFiltered();
    // item count indicator
    $("#count").textContent = `${list.length} dish${list.length === 1 ? "" : "es"}`;
    // clear button based on true/false return
    $("#clearQ").hidden = !STATE.query;
    const root = $("#menuRoot");
    // if no items match with searc query
    if (!list.length){
        root.innerHTML = `<div class="empty">
                                <div class="big">🔎</div>
                                <h3>No matching items found.</h3>
                                <p>Try a different word or clear the filters.</p>
                                <button class="btn dark" data-act="resetFilters">Reset Filters</button>
                          </div>`;
        return;
    }
    // display items by category
    root.innerHTML = CATEGORIES.map(c => {
        const items = list.filter(v => v.cat === c.id);
        // only display if category has item
        return items.length ? `<div class="section-title">
                                    <h2>${c.pic} ${esc(c.label)}</h2><small>${items.length}</small>
                               </div>
                               <div class="grid">
                                    ${items.map(v => cardHTML(v, tokens)).join('')}
                               </div>` : "";
    }).join("");
}

// function render current day special items
function renderSpecials(){
    // get cuurent day special item
    const sp = activeSpecials();
    // menu include only item present in special
    const items = MENU.filter(m => m.id in sp).map(view);
    // hide if no specials for the day
    $("#specialsWrap").hidden = !items.length;
    // display special item card grid
    $("#specialsGrid").innerHTML = items.map(v => cardHTML(v)).join("");
    // format date to Nepal time
    $("#specialsDate").textContent = new Date().toLocaleString('en-GB',{
        weekday: "long",
        day: "numeric",
        month: "long",
        timeZone: "Asia/Kathmandu"
    });
}

// function to update restaurant open & close time
function renderStatus(){
    // get minutes and data from CONFIG object
    const {minutes} = liveTime(), {open, close} = CONFIG.hours;
    // check if it fits threhold
    const isOpen = minutes >= open && minutes < close;
    const el = $("#status");
    // toggle "close" class
    el.classList.toggle("closed", !isOpen);
    // content with formatted open & close hours
    el.textContent = isOpen ? `Open 󠁯•󠁏 until ${formatTime(close)}` : `Close 󠁯•󠁏 opens ${formatTime(open)}`;
}

// save current cart state
const saveCart = () => store.set("cart", STATE.cart);

// function to update item quantities in cart
function changeQty(id, delta){
    // get menu by id
    const m = BY_ID.get(id);
    if (!m) return;
    const v = view(m);
    // increment not allowed if item sold out
    if (v.soldOut && delta > 0){
        return toast(`${m.name} is sold out today.`);
    }
    // new quantity (20 max limit)
    const qty = Math.min(20, (STATE.cart[id] || 0) + delta);
    // remove item from cart if quantity below 0
    if (qty <= 0){
        delete STATE.cart[id];
    } else{
        // update cart quantity
        STATE.cart[id] = qty;
    }
    // update cart
    saveCart();
    renderAll();
    // newly added item notification
    if (delta > 0 && qty === 1){
        toast(`Added Item: ${m.name}`);
    }
}

// function to into active cart items by filtering out invalid id
function cartLines(){
    return Object.entries(STATE.cart).map(([id, qty]) => BY_ID.has(id) ? {v: view(BY_ID.get(id)), qty} : null).filter(Boolean);
}

// function to calculate total price
function totals(){
    const f = $("#checkoutForm");
    const mode = f.mode.value;
    const zone = zoneID(f.zone.value);
    const lines = cartLines();
    // price of cart items
    const sub = lines.reduce((s, l) => s + l.v.price * l.qty, 0);
    // delivery fee of cart items
    const fee = mode === "delivery" && sub > 0 ? (sub >= CONFIG.freeDeliveryOrder ? 0 : zone.fee) : 0;
    // return total
    return {lines, sub, fee, 
        total: sub + fee, 
        mode, zone
    };
}

// function display cart with details
function renderCart(){
    const t = totals;
    // quantity of items in cart
    const count = t.lines.reduce((s, l) => s + l.qty, 0);
    // update count
    $("#cartCount").textContent = count;
    // update total price
    $("#cartTotal").textContent = count ? money(t.sub) : "";
    // display cart line & handle if no items in cart
    $("#cartLines").innerHTML = t.lines.length ? t.lines.map(({v, qty}) => 
                                `<div class="line">
                                    <span class="dot ${isVeg(v) ? "veg" : "nonveg"}"></span>
                                    <div class="info">
                                        <b>${escapeHTML(v.name)}</b>
                                        <small>${money(v.price)} each${v.soldOut ? ' ⬩ <span class="warn">Sold Out -- Remove to Continue</span>' : ""}</small>
                                    </div>
                                    <span class="stepper">
                                        <button data-act="dec" data-id="${v.id}" aria-label="Decrease">−</button><span>${qty}</span><button data-act="inc" data-id="${v.id}" aria-label="Increase">+</button>
                                    </span>
                                    <b>${money(v.price * qty)}</b>
                                    <button class="icon" data-act="remove" data-id="${v.id}" aria-label="Remove ${escapeHTML(v.name)}">🗑️</button>
                                </div>`).join("") : `<div class="empty">
                                                        <div class="big">🧺</div>
                                                        <p>Cart is empty.<br>Add something delicious!</p>
                                                     </div>`;
    // check whether order is eligible for free delivery                                                 
    const free = t.mode === "delivery" && t.sub > 0 && t.sub >= CONFIG.freeDeliveryOrder;
    // display order summary with subtotal and final total
    $("#cartSummary").innerHTML = t.lines.length ? `<div class="summary">
                                                        <div>
                                                            <span>Subtotal:</span><span>${money(t.sub)}</span>
                                                        </div>
                                                        <div>
                                                            <span>${t.mode === 'delivery' ? `Delivery (${escapeHTML(t.zone.name)})` : 'Pickup'}</span><span>${free ? 'FREE' : money(t.fee)}</span>
                                                        </div>
                                                        <div class="total">
                                                            <span>Total</span><span>${money(t.total)}</span>
                                                        </div>
                                                    </div>
                                                    ${t.mode === "delivery" && !free ? `<p class="hint">Free delivery on orders escedding ${money(CONFIG.freeDeliveryOrder)}. Estimated time: ${escapeHTML(t.zone.eta)}.</p>` : ""}` : "";
    // apply order constraints                                                 
    const problems = [];
    if (t.lines.some(l => l.v.soldOut)){
        problems.push("Remove sold out items to continue.");
    }
    if (t.mode === "delivery" && t.sub > 0 && t.sub < CONFIG.minDeliveryOrder){
        problems.push(`Minimum order amount is ${money(CONFIG.minDeliveryOrder)}.`);
    }
    // restaurant currently closed
    const closed = $("#status").classList.contains("closed");
    // warning message when restaurant closed
    $("#sendNotice").innerHTML = problems.map(p => `<div class="notice err">${escapeHTML(p)}</div>`).join("") + (closed ? `<div class="notice">We're closed right now — your order will be confirmed when we open at' ${fmtTime(CONFIG.hours.open)}.</div>` : '');
    // disable send button if cart empty
    const blocked = !t.lines.length || problems.length > 0;
    $$("[data-send]").forEach(b => b.disabled = blocked);
}

/// function for when cart open or closed
function setDrawer(open){
    const d = $("#cart");
    // toggle css class
    d.classList.toggle("open", open);
    d.inert = !open;
    $("#scrim").hidden = !open;
    // body scrolling diabled when cart open
    document.body.style.overflow = open ? "hidden" : "";
    if (open){
        // refresh cart
        renderCart();
        $("[data-act=closeCart]", d).focus();
    } else{
        $("#openCart").focus();
    }
}

// function sync fields for delivery
function syncMode(){
    const f = $("#checkoutForm"), delivery = f.mode.value === "delivery";
    $("#deliveryFields").hidden = !delivery;
    // address required if a mode selected
    f.address.required = delivery;
}

// function to initialize checkout form
function initCheckoutForm(){
    const f = $("#checkoutForm");
    // delivery zone dropdowns add
    f.zone.innerHTML = CONFIG.zones.map(z => `<option value="${z.id}">${escapeHTML(z.name)} -- ${money(z.fee)}</option>`).join("");
    // get previous checkout data
    const saved = store.get("checkout", {});
    // restore saved values if they exist
    for(const k of ["name", "contact", "address", "note", "pay", "zone"]){
        if (saved[k] && f.elements[k]){
            f.elements[k].value = saved[k];
        }
    }
    // restore delivery mode
    if (saved.mode){
        $$("input[name=mode]", f).forEach(r => r.checked = r.value === saved.mode);
    }
    syncMode();
    // listen for changes in checkout form
    f.addEventListener("input", () => {
        syncMode();
        // save current status
        store.set('checkout', {mode: f.mode.value, zone: f.zone.value, name: f.elements.name.value, contact: f.contact.value, address: f.address.value, note: f.note.value, pay: f.pay.value});
        // update cart with new details
        renderCart();
    });
}

// function to create complete order message
function buildMessage(t){
    const f = $("#checkoutForm");
    // unique reference code
    const ref = "HH-" + Date.now().toString(36).slice(-5).toUpperCase();
    // whether it is delivery or restaurant pickup
    const where = t.mode === "delivery" ? `Delivery - ${t.zone.name}\nAddress: ${f.address.value.trim()}` : "Restaurant Pickup";
    // map each cart item to create readable price line
    const lines = t.lines.map(l => `${l.qty} 𝐗 ${l.v.name} -- ${money(l.v.price * l.qty)}`).join("\n");
    // final order message format
    return [
        `🏞️ *New Order ${ref} -- ${CONFIG.brand}`,
        `Name: ${f.elements.name.value.trim()}`,
        `Phone: ${f.phone.value.trim()}`, where, '', lines, '',
        `Sub-Total: ${money(t.sub)}`, 
        `Delivery: ${t.mode === "delivery" ? (t.fee ? money(t.fee) : "FREE") : "--"}`,
        `*Total: ${money(t.total)}`,
        `Payment: $${f.pay.value}`,
        f.note.value.trim() ? `Note: ${f.note.value.trim()}` : ""
        // remove empty lines
    ].filter((l, i, a) => l !== "" || a[i - 1] !== "").join("\n").trim();
}

// function to send order based on user selection
function sendOrder(channel){
    const f = $("#checkoutForm");
    // fetch cart and total
    const t = totals();
    if (!t.lines.length) return;
    syncMode();
    // stop if not validated 
    if (!f.reportValidity()) return;
    // final message order
    const msg = buildMessage(t);
    const enc = encodeURIComponent(msg);
    if (channel === "whatsapp"){
        // whatsapp message in new tab 
        window.open(`https://wa.me/${CONFIG.whatsapp}?text=${enc}`, '_blank', 'noopener');
        toast("Opening WhatsApp...");
    } else if (channel === "viber"){
        // copy text for viber
        textCopy(msg);
        window.location.href = `viber://chat?number=%2B${CONFIG.viber}`;
        toast("Order copied -- paste it in Viber.");
    } else if (channel === "messenger"){
        // copy text for messenger
        textCopy(msg);
        window.open(`https://m.me/${CONFIG.messenger}`, '_blank', 'noopener');
        toast("Order copied -- paste it in Messenger.");
    } else{
        // fallback message
        textCopy(msg).then(ok => toast(ok ? "Order copied to clipboard." : "Sorry, please select text manually."));
    }
}

// function for floating chat buttons
function initChatShortcuts(){
    // default greeting
    const hello = encodeURIComponent("Namaste, I would like to place an order.");
    // create folating elements
    $("#fabMenu").innerHTML = `
                                <a class="wa" href="https://wa.me/${CONFIG.whatsapp}?text=${hello}" target="_blank" rel="noopener">WhatsApp</a>
                                <a class="vb" href="viber://chat?number=%2B${CONFIG.viber}">Viber</a>
                                <a class="me" href="https://m.me/${CONFIG.messenger}" target="_blank" rel="noopener">Messenger</a>
                                <a class="tel" href="tel:${CONFIG.phone.replace(/[^+\d]/g, '')}">📞 Call</a>`;
    // toggle open/close of float elements
    const toggle = open => {
        $("#fab").classList.toggle("open", open); 
        $("#fabBtn").setAttribute("aria-expanded", open);
    };
    // listener to switch state on click
    $("#fabBtn").addEventListener("click", () => toggle(!$("#fab").classList.contains("open")));
    // open chat shortcut mneu
    $("#heroChat").addEventListener("click", () => toggle(true));
}

// security handling object
const AUTH = {
    // hasg pin with random salt
    async hash(salt, pin){
        // encode string to bytes
        const data = new TextEncoder().encode(salt + ":" + pin);
        // web crypto api
        if (crypto?.subtle){
            const buf = await crypto.subtle.digest("SHA-256", data);
            return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
        }
        // fallback if web crypto fails
        let h = 2166136261;
        for(const b of data){
            h ^= b;
            h = Math.imul(h, 16777619) >>> 0;
        }
        return "f" + h.toString(16);
    }, 
    // get authenticaton record
    record: () => store.get("auth", null),
    // set new pin using random salt and hash
    async setPIN(pin){
        const salt = [...crypto.getRandomValues(new Uint8Array(12))].map(b => b.toString(16).padStart(2, "0")).join("");
        store.set("auth", {salt, hash: await this.hash(salt, pin)});
    }, 
    // verify pin against record hash
    async verify(pin){
        const r = this.record();
        return !!r && (await this.hash(r.salt, pin)) === r.hash;
    },
    // current staff session valid or not
    isStaff: () => +sessionStorage.getItem("hh:until") > Date.now(),
    // start staff session
    touch: () => sessionStorage.setItem("hh:until", Date.now() + CONFIG.staffSession * 60000),
    // clear timestamp for logout
    logout: () => sessionStorage.removeItem("hh:until"),
    // consecutive failed attempts to login
    fails: 0,
    // login locked due to too many fals
    lockUntil: 0
};

const dlg = $("#staffDlg"); 
const staffBody = $("#staffBody");

// function for staff modal dialog
function openStaff(){
    renderStaff();
    if (!dlg.open){
        dlg.showModal();
    }
}

// function to display content inside staff element
function renderStaff(){
    // if already authenticated jump to dashboard 
    if (AUTH.isStaff()){
        return renderDashboard();
    }
    // pin created previously
    const hasPIN = !!AUTH.record();
    // form template literal
    staffBody.innerHTML = `
                          <form class="auth" id="authForm" autocomplete="off">
                                <h3>${hasPIN ? "Staff Login" : "Create Staff PIN"}</h3>
                                <p class="hint">${hasPIN ? "Enter PIN to manage menu." : "First time: choose 6 digit PIN code. Only for staff."}</p>
                                <input type="password" id="pin1" placeholder="${hasPIN ? 'PIN' : 'New PIN (6 characters)'}" minlength="${hasPIN ? 1:6}" required autocomplete="${hasPIN ? 'current-password' : 'new-password'}">
                                ${hasPIN ? "" : '<input type="password" id="pin2" placeholder="Re-enter PIN" required autocomplete="new-password">'}
                                <div id="authMsg" class="notice err" hidden></div>
                                <button class="btn dark" type="submit">${hasPIN ? "Login" : "Save PIN & Continue"}</button>
                          </form>`;
    $("#pin1").focus();
}

// function to ensure pin verfification
async function handleAuth(e){
    e.preventDefault();
    const msg = $("#authMsg");
    // error message inside form 
    const show = t => {
        msg.textContent = t; 
        msg.hidden = false;
    };
    const pin = $("#pin1").value;
    // if no pin exists
    if (!AUTH.record()){
        if (pin.length < 6){
            return show("Must be 6 characters long.");
        }
        if (pin !== $("#pin2").value){
            return show("PINS don't match.");
        }
        await AUTH.setPIN(pin);
        AUTH.touch();
        toast("PIN saved.");
        return renderDashboard();
    }
    // prevent brute-force attempt
    if (Date.now() < AUTH.lockUntil){
        return show(`Too many login attempts. Please wait for ${Math.ceil((AUTH.lockUntil - Date.now()) / 1000)}s.`);
    }
    // login attempt with existing pin
    if (await AUTH.verify(pin)){
        AUTH.fails = 0;
        AUTH.touch();
        return renderDashboard();
    }
    // increment counter and lockout after consecutive failures  
    if (++AUTH.fails >= 5){
        AUTH.lockUntil = Date.now() + 30000;
        AUTH.fails = 0;
    }
    show("Incorrect PIN");
}

// function to display dashboard on webpage
function renderDashboard(){
    const sp = activeSpecials();
    // map over menu to create row for each item
    const rows = MENU.map(m => {
        // dtermine price use override if it is valid else use default
        const o = STATE.overrides[m.id] || {}, 
        price = Number.isFinite(o.price) ? o.price : m.price;
        // check if item exist in specials list
        const isSp = m.id in sp,
        spPrice = isSp && Number.isFinite(sp[m.id]) ? sp[m.id] : "";
        // return template string literal
        return `
               <tr data-id="${m.id}" class=""${o.soldOut ? "is-sold" : ""} data-name="${escapeHTML((m.name + "" + m.np).toLowerCase())}">
                    <td><b>${escapeHTML(m.name)}</b><small>${escapeHTML(CATEGORIES.find(c => c.id === m.cat).label)}</small></td>
                    <td><input type="number" data-f="price" min="0" max="99999" step="5" value="${price}" aria-label="Price for ${escapeHTML(m.name)}">></td>
                    <td><input type="checkbox" data-f="special" ${isSp ? 'checked' : ''} aria-label="${escapeHTML(m.name)} is today's special"></td>
                    <td><input type="number" data-f="specialPrice" min="0" max="99999" step="5" value="${spPrice}" placeholder="same" ${isSp ? '' : 'disabled'} aria-label="Special price for ${escapeHTML(m.name)}"></td>
                    <td><input type="checkbox" data-f="soldOut" ${o.soldOut ? 'checked' : ''} aria-label="${esc(m.name)} is sold out"></td>
               </tr>`
    }).join("");
    // template string literal for staff body
    staffBody.innerHTML = `
                          <div class="stats" id="stats"></div>
                          <div class="dash-tools">
                                <input type="search" id="dashFilter" palceholder="Filter dishes..." aria-label="Filter dishes">
                                <button class="btn ghost" data-act="clearSpecials">Clear Specials</button>
                                <button class="btn ghost" data-act="allAvailable">All Available</button>
                                <button class="btn ghost" data-act="Logout">Logout</button>
                          </div>
                          <div class="table-wrap">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Dish</th>
                                            <th>Price (${CONFIG.currency})</th>
                                            <th>Today's Special</th>
                                            <th>Special Price</th>
                                            <th>Sold Out</th>
                                        </tr>
                                    </thead>
                                    <tbody id="dashRows">${rows}</tbody>
                                </table>
                          </div>
                          <p class="hint">Changes updated instantly, everyday new special item.</p>
                          <details class="box"><summary>Backup &amp; Restore</summary>
                                <div class="dash-tools" style="margin-top: 10px;">
                                    <button class="btn ghost" data-act="export">Export</button>
                                    <label class="btn ghost" style="cursor: pointer;">Import<input type="file" id="importFile" accept="application/json"></label>
                                </div>
                          </details>
                          <details class="box"><summary>Change PIN</summary>
                                <form class="pin-form" id="pinForm" autocomplete="off">
                                    <input type="password" id="currPin" placeholder="Current PIN" required autocomplete="current-password">
                                    <input type="password" id="newPin" placeholder="New PIN (min. 6 chars)" minlength="6" required autocomplete="new-password">
                                    <button class="btn dark" type="submit">Update PIN</button>
                                </form>
                          </details>`;
    updateStats();
}

// function to update item stats
function updateStats(){
    // item count with soldout override
    const sold = Object.values(STATE.overrides).filter(o => o.soldOut).length;
    // count specials
    const sp = Object.keys(activeSpecials()).length;
    const el = $("#stats");
    // if it exist generate stats card
    if (el){
        el.innerHTML = `<div class="stat">
                            <b>${MENU.length}</b>dishes
                        </div>
                        <div class="stat">
                            <b>${sp}</b>specials today
                        </div>
                        <div class="stat">
                            <b>${sold}</b>sold out
                        </div>`;
    }
}

// function to save current menu item & special
function persistAdmin(){
    store.set("overrides", STATE.overrides);
    store.set("overrides", STATE.specials);
    renderAll();
    updateStats();
}

// function to retrieve specials for current day
function ensureTodaySpecials(){
    const today = liveTime().date;
    // check special date does not match current date
    if (STATE.specials.date !== today){
        // reset special object for the day
        STATE.specials = {
            date: today,
            items: {...CONFIG.defaultSpecial}
        };
    }
}

// function to handle dashboard interactions
function handleDashboardChange(e){
    // login still valid
    if (!AUTH.isStaff()){
        toast("Session expired -- login again");
        return renderStaff();
    }
    AUTH.touch();
    // identify element, retrieve attribute, find root
    const input = e.target;
    const f = input.dataset.f;
    const tr = input.closest("tr");
    if (!f || !tr) return;
    // get menu item id
    const id = tr.dataset.id;
    const m = BY_ID.get(id);
    // get override object for menu item
    const o = STATE.overrides[id] = STATE.overrides[id] || {};
    // if changes made to price field
    if (f === "price"){
        const n = Number(input.value);
        if (input.value === "" || !Number.isFinite(n) || n < 0 || n > 99999){
            // reset to previous override in case validation fails
            input.value = Number.isFinite(o.price) ? o.price : m.price;
            return toast("Enter a valid price.");
        }
        if (n === m.price){
            delete o.price;
        } else{
            o.price = Math.round(n);
        }
    // changes made to soldout checkbox
    } else if(f === "soldOut"){
        if (input.checked){
            o.soldOut = true;
        } else{
            delete o.soldOut
        }
        // toggle and switch css class
        tr.classList.toggle("is-sold", input.checked);
    // changes to today special checkbox    
    } else if(f === "special"){
        ensureTodaySpecials();
        const sp = $("[data-f=specialPrice]", tr);
        if (input.checked){
            // set item id to null
            STATE.specials.items[id] = null;
        } else{
            // remove item from specials and clear price
            delete STATE.specials.items[id];
            sp.value = "";
        }
        // enable/disable input based on checkbox
        sp.disabled = !input.checked;
    // changes to special price     
    } else if (f === "specialPrice"){
        ensureTodaySpecials();
        const n = Number(input.value);
        // set price of specials
        STATE.specials.items[id] = input.value === "" || Number.isFinite(n) || n < 0 ? null : Math.round(n);
        if (input.value !== "" && STATE.specials.items[id] === null){
            input.value ="";
        }
    }
    // clean empty override objects
    if (!Object.keys(o).length){
        delete STATE.overrides[id];
    }
    persistAdmin();
    toast("Saved.");
}

// function to handle pin change
async function handlePinChange(e){
    e.preventDefault();
    // verify current pin is correct
    if (!(await AUTH.verify($("#curPin").value))){
        return toast("Curent PIN is incorrect.");
    }
    // update to new pin in form
    await AUTH.setPIN($("#newPin").value);
    toast("PIN updated.");
    e.target.reset();
}

// function to export data 
function exportData(){
    // bolb initialization with json serialization
    const blob = new Blob([JSON.stringify({
        overrides: STATE.overrides, 
        specials: STATE.specials}, null, 2)], 
        {type: "application/json"});
    // link to download file    
    const a = Object.assign(document.createElement("a"), {
        href: URL.createObjectURL(blob), 
        download: `himalicious-complete-menu-${liveTime().date}.json`
    });
    // trigger download
    a.click();
    // clear object afer 1s
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

// function to import data
function importData(file){
    const reader = new FileReader();
    // file read successfully
    reader.onload = () => {
        try{
            // parse json data
            const d = JSON.parse(reader, result);
            const ov = {}; 
            const items = {};
            // iterate override to clean and validate data
            for(const [id, o] of Object.entries(d.overrides || {})){
                if (!BY_ID.has(id) || typeof o !== "object" || !o) continue;
                const clean = {};
                if (Number.isFinite(o.price) && o.price >= 0 && o.price <= 9999){
                    clean.price = Math.round(o.price);
                }
                if (o.soldOut === true){
                    clean.soldOut = true;
                }
                if (Object.keys(clean).length){
                    ov[id] = clean;
                }
            }
            const s = d.specials || {};
            // iterate special items
            for(const[id, p] of Object.entries(s.items || {})){
                if (BY_ID.has(id)){
                    items[id] = Number.isFinite(p) && p >= 0 ? Math.round(p) : null;
                }
            }
            // update state with clean data
            STATE.overrides = ov;
            STATE.specials = {date: /^\d{4}-\d{2}-\d{2}$/.test(s.date) ? s.date : null, items};
            // save data and show success toast
            persistAdmin();
            renderDashboard();
            toast("Backup imported.");
        } catch{
            // catch any errors
            toast("Sorry, file cannot be backed up.")
        }
    };
    // read file as plain text
    reader.readAsText(file);
}

// function display all components on webpage
function renderAll(){
    renderSpecials();
    renderMenu();
    renderCart();
}

// function to bind all events for website
function bindEvents(){
    const q = $("#q");
    // listener for search bar
    q.addEventListener("input", debounce(() => {
        STATE.query = q.value.trim();
        renderMenu();
    }));
    // listener for clear search button
    $("#clearQ").addEventListener("click", () => {
        q.value = "";
        STATE.query = "";
        renderMenu();
        q.focus();
    });
    // listener for keyboard shortcuts
    document.addEventListener("keydown", e => {
        if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test.document.activeElement.tagName && !dlg.open){
            e.preventDefault();
            e.focus();
        }
        if (e.key === "Escape" && $("#cart").classList.contains("open")){
            setDrawer(false);
        }
    });
    // listener for filter chips
    $("#controls").addEventListener("click", e => {
        const b = target.closest(".chip");
        if (!b) return;
        if (b.dataset.cat){
            STATE.cat = b.dataset.cat;
        }
        if (b.dataset.diet){
            STATE.diet.has(b.dataset.diet) ? STATE.diet.delete(b.dataset.diet) : STATE.diet.add(b.dataet.diet);
        }
        if (b.dataset.cult){
            STATE.culture = b.dataset.cult;
        }
    });
    // listener for sorting based changes
    $("#sort").addEventListener("change", e => {
        STATE.sort = e.target.value;
        renderMenu();
    });
    // listener for hide sold items toggle
    $("#hideSold").addEventListener("change", e => {
        STATE.hideSold = e.target.checked;
        renderMenu();
    });
    // listener for click event delegation
    document.addEventListener("click", e => {
        const el = e.target.closest([data-act]);
        if (!el) return;
        const id = el.dataset.id;
        switch(el.dataset.act){
            // increase cart quantity
            case "add": case "inc": 
                changeQty(id, 1);
                break;
            // decrease cart quantity
            case "dec": 
                changeQty(id, -1);
                break;
            // remove from cart
            case "remove": 
                delete STATE.cart[id]; 
                saveCart(); 
                renderAll(); 
                break;
            // clear entire cart (ask before clearing)
            case "clearCart":
                if (Object.keys(STATE.cart).length && confirm("Empty the cart?")){
                    STATE.cart = {};
                    saveCart();
                    renderAll();
                    break;
                }
            // close cart drawer
            case "closeCart":
                setDrawer(false);
                break;
            // reset filters to default
            case "resetFilters": 
                Object.assign(STATE, {
                    query: "", 
                    cat: "all", 
                    culture: "all", 
                    hideSold: false
                }); 
                STATE.diet.clear();
                $("#q").value = ""; 
                $("#hideSold").checked = false;
                renderControls(); 
                renderMenu(); 
                break;
            // close staff modal
            case "closeStaff": 
                dlg.close(); 
                break;
            // logout staff
            case "logout":
                AUTH.logout();
                renderStaff();
                toast("Logged out.");
                break;
            // clear all special (first check if staff)
            case "clearSpecials":
                if (!AUTH.isStaff()){
                    renderStaff();
                    AUTH.touch();
                }
                STATE.specials = {date: liveTime().date, items: {}};
                persistAdmin();
                renderDashboard();
                toast("Specials cleared.");
                break;
            // mark all items as avialable
            case "allAvailable":
                if (!AUTH.isStaff()){
                    renderStaff();
                    AUTH.touch();
                }
                // remove soldout override from all items
                for(const k of Object.keys(STATE.overrides)){
                    delete STATE.overrides[k].soldOut;
                    if (!Object.keys(STATE.overrides[k]).length){
                        delete STATE.overrides[k];
                    }
                }
                persistAdmin();
                renderDashboard();
                toast("All items marked as available.");
                break;
            case "export":
                if (!AUTH.isStaff()){
                    renderStaff();
                    exportData();
                    break;
                }
        }
    });
    // cart toggle and checkout form listeners
    $("#openCart").addEventListener("click", () => setDrawer(true));
    $("#scrim").addEventListener("click", () => setDrawer(false));
    $$("[data-send]").forEach(b => b.addEventListener("click", () => sendOrder(b.dataset.send)));
    $("#checkoutForm").addEventListener("submit", e => e.preventDefault());
    // url hashing
    $("#openStaff").addEventListener("click", openStaff);
    location.hash === "#staff" && openStaff();
    // listeners for staff body
    staffBody.addEventListener("submit", e => {
        if (e.target.id === "authForm"){
            handleAuth(e);
        }
        if (e.target.id === "pinForm"){
            handlePinChange(e);
        }
    });
    // listner for import files
    staffBody.addEventListener("change", e => {
        if (e.target.id === "importFile"){
            if (AUTH.isStaff() && e.target.files[0]){
                importData(e.target.file[0]);
                return;
            }
        }
    });
    staffBody.addEventListener("input", e => {
        if (e.target.id !== "dashFilter") return;
        const t = e.target.value.toLowerCase().trim();
        $$("#dashRows tr").forEach(tr => tr.hidden = t && !tr.dataset.name.includes(t));
    });
    // synchronization using local storage
    window.addEventListener("storage", e => {
        if (!e.key?.startsWith(store.prefix)) return;
        STATE.cart = store.get("cart", {});
        STATE.overrides = store.get("overrides", {});
        STATE.specials = store.get("specials", {date: null, items: {}});
        renderAll();
    })
}