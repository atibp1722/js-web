// get single and multiple elements from the same dom
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

// different waste type info
const wasteTypes = new Map([
    ["general",
        {
            name: "General Waste",
            base: 350,
            perBag: 50
        }
    ],
    ["recycle",
        {
            name: "Recyclable Waste",
            base: 200,
            perBag: 50
        }
    ],
    ["electronic",
        {
            name: "Electronic Waste",
            base: 500,
            perBag: 150
        }
    ],
    ["bulk",
        {
            name: "Heavy Waste",
            base: 750,
            perBag: 250
        }
    ]
]);

// max capacity per location
const routeCapacity = new Map([
    ["Koteswore", 10],
    ["Baneswore", 20],,
    ["Mid Baneswore", 20],
    ["Old Baneswore", 20],
    ["Kamaladi", 15],
    ["Maharajgunj", 25],
    ["Thamel", 30],
    ["Lainchaur", 20],
    ["Pulchowk", 25],
    ["Kalimati", 15],
    ["Balaju", 10],
    ["Bhaktapur", 30]
]);

// service fee for each location
const serviceLocations = new Map([
    ["Koteswore", 30],
    ["Baneswore", 35],,
    ["Mid Baneswore", 35],
    ["Old Baneswore", 35],
    ["Kamaladi", 40],
    ["Maharajgunj", 50],
    ["Thamel", 60],
    ["Lainchaur", 50],
    ["Pulchowk", 50],
    ["Kalimati", 50],
    ["Balaju", 60],
    ["Bhaktapur", 60]
]);

// all available time slots
const timeSlots = new Map([
    ["7AM - 9AM", 25],
    ["9AM - 11AM", 50],
    ["11AM - 1PM", 50],
    ["2PM - 4PM", 50],
    ["4PM - 6PM", 75]
]);

// frequency of service with discount
const frequencies = new Map([
    ["one-time",
        {
            name: "One=time pickup",
            discount: 0
        }
    ],
    ["weekly",
        {
            name: "Weekly pickup",
            discount: 15
        }
    ],
    ["monthly",
        {
            name: "Monthly pickup",
            discount: 10
        }
    ],
]);

// different status of customer booking
const bookingStatus = [
    "Scheduled",
    "Confirmed",
    "Assigned",
    "On the way",
    "Picked up"
]

// collectors info
const collectors = [
    {
        id: "EMP-10",
        name: "Ram Kumar",
        vehicle: "BA 25 PA 4266"
    },
    {
        id: "EMP-238",
        name: "Sundar Bista",
        vehicle: "BA 32 JHA 3271"
    },
    {
        id: "EMP-187",
        name: "Geeta Khatri",
        vehicle: "BA 30 PA 8730"
    },
    {
        id: "EMP-169",
        name: "Ravi SHrestha",
        vehicle: "LU 30 KA 7179"
    }
];

// default configuration parameters
const config = {
    currency: "Rs.",
    minPrice: 499,
    maxBags: 25,
    capacityWarning: 0.75,
    demandThreshold: 0.80
};

// get bookings from browser storage
let bookings = JSON.parse(localStorage.getItem("safaKathmanduBookings")) || [];

// function to save booking to browser storage
function saveBookings(){
    localStorage.setItem("safaKathmanduBookings", JSON.stringify(bookings));
}

// function to generate unique booking id
function generateBookingID(){
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `CK-${timestamp}-${random}`;
}

// function to get and trim user input from form
function getFormData(){
    return{
        name: $("#name").value.trim(),
        phone: $("#phone").value.trim(),
        area: $("#area").value,
        wasteType: $("#wasteType").value,
        date: $("#date").value,
        time: $("#time").value,
        frequency: $("#frequency").value,
        bags: $("#bags").value,
        address: $("#address").value.trim(),
    };
}

// function to calculate price
function calculatePrice(data){
    const waste = wasteTypes.get(data.wasteType);
    const locationFee = serviceLocations.get(data.area) || 0;
    const timeFee = timeSlots.get(data.time) || 0;
    const frequency = frequencies.get(data.frequency);
    if (!waste || !frequency){
        throw new Error("Invalid data.");
    }
    const bagCost = data.bags * waste.perBag;
    const subTotal = waste.base + bagCost + locationFee + timeFee;
    let demandSurcharge = 0;
    // check route capacity to apply demand surcharge
    if (data.area && data.time && data.date){
        const capacity = getRouteCapacity(data.area, data.time, data.date);
        const utilization = capacity.used / capacity.maximum;
        if (utilization >= config.demandThreshold){
            demandSurcharge = 100;
        }
    }
    const discount = subTotal * frequency.discount;
    // final price ensure doesnot fall below minimum price
    const total = Math.max(Math.round(subTotal + demandSurcharge - discount), config.minPrice);
    return{
        base: waste.base,
        bagCost,
        locationFee,
        timeFee,
        demandSurcharge,
        subTotal,
        discount: Math.round(discount),
        total,
        currency: config.currency
    };
}

// function to track capacity pf each location
function getRouteKey(area, time, date){
    return `${area}::${time}::${date}`;
}

// function to get bookings for certain area
function getRouteBookings(area, time, date){
    return bookings.filter(booking => {
        return(
            booking.pickup.area === area &&
            booking.pickup.time === time &&
            booking.pickup.date === date &&
            booking.status !== "Cancelled"
        );
    });
}

// function to get route capacity
function getRouteCapacity(area, time, date){
    const maximum = routeCapacity.get(area) || 10;
    const used = getRouteBookings(area, time, date).length;
    // remaining slots in route
    return{
        maximum, used, remaining: Math.max(maximum - used, 0)
    };
}

// function to check route has pickup slot remaining
function hasCapacity(data){
    const capacity = getRouteCapacity(data.area, data.time, data.date);
    return capacity.remaining > 0;
}

// function to update capacity and display on webpage
function renderCapacity(){
    // get information
    const area = $("#area").value;
    const date = $("#date").value;
    const time = $("#time").value;
    const container = $("#capacityInfo");
    // check whether any field empty
    if (!area || !time || !date){
        container.className = "capacity-info";
        container.innerHTML = `Please select your area and time for route capacity`;
        return;
    }
    const capacity = getRouteCapacity(area, time, date);
    const percent = Math.round((capacity.used / capacity.maximum) * 100);
    let stateClass = "";
    // update css styling
    if (capacity.remaining === 0){
        stateClass = "full";
    } else if (percent >= 75){
        stateClass = "warning";
    }
    container.className = `capacity-info ${stateClass}`;
    // upadte container with new details
    container.innerHTML = `<strong>
                                Pickup Capacity
                           </strong>
                           <span>
                                ${capacity.remaining} of ${capacity.maximum} slots remaining.
                           </span>
                           <div class="capacity-bar">
                                <div style="width: ${percent}%"></div>
                           </div>
                           <small>
                                ${percent}% of route capacity is currently booked.
                           </small>`;
}

// function to validate user input
function validateBooking(data){
    // check missing input field
    if (!data.name || !data.phone || !data.area || !data.date || !data.time || !data.address){
        return {
            valid: false,
            message: "Sorry, form fields cannot be empty."
        };
    }
    // validate Nepal based phone number
    const phone = data.phone.replace(/\s/g,"");
    if (!/^(97|98)\d{8}$/.test(phone)){
        return{
            valid: false,
            message: "Phone number is not valid."
        };
    }
    // validate bag min and max limit
    if (data.bags < 1 || data.bags > config.maxBags){
        return{
            valid: false,
            message: `No. of bags must be between 1 and ${config.maxBags}`
        };
    }
    // current date to string
    const selectedDate = new Date(`${data.date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // validate date so past date not allowed
    if (selectedDate < today){
        return{
            valid: false,
            message: "Pickup date cannot be past."
        };
    }
    // check route has remaining capacity
    if (!hasCapacity(data)){
        return{
            valid: false,
            message: "Sorry, this time and route is fully booked."
        };
    }
    return{
        valid: true
    };
}

// function to create booking object and assign collector
function createBooking(data){
    if (!hasCapacity(data)){
        throw new Error("Sorry, route already full.");
    }
    const pricing = calculatePrice(data);
    // assign collector at random
    const collector = assignCollector(data.area);
    // create new booking object
    const booking = {
        id: generateBookingID(),
        customer: {
            name: data.name,
            phone: data.phone,
            address: data.address
        },
        pickup: {
            area: data.area,
            date: data.date,
            time: data.time,
            frequency: data.frequency
        },
        waste: {
            type: data.wasteType,
            bags: data.bags
        }, pricing, collector, status: "Scheduled",
        statusHistory: [{
            status: "Scheduled",
            timestamp: new Date().toISOString()
        }],
        createAt: new Date().toISOString()
    };
    // add new booking object
    bookings.push(booking);
    saveBookings();
    return booking;
}

// function to assing collector at random
function assignCollector(area){
    if (collectors.length === 0){
        return null;
    }
    // pick random collector index
    const index = Math.floor(Math.random() * collectors.length);
    return collectors[index]
}

// fucntion to update status through pickup process
function updateBookingStatus(bookingId, newStatus){
    const booking = bookings.find(item => item.id === bookingId);
    if (!booking) return;
    if (!bookingStatuses.includes(newStatus)){
        return;
    }
    // update with current status
    // record time of change
    booking.status = newStatus;
    booking.statusHistory.push({
        status: newStatus,
        timestamp: new Date().toISOString()
    });
    // save and display changes in respective areas
    saveBookings();
    renderBookings();
    updateAnalytics();
}

// function to visualize pickup status tracker
function renderStatusTracker(booking){
    // index booking's current status
    const currentIndex = bookingStatus.indexOf(booking.status);
    // dynamic render of tracker
    return `<div class="status-tracker">
                ${bookingStatus.map((status, index) => `<div class="status-step${index <= currentIndex ? "completed": ""}">
                                                            <div class="status-dot">
                                                                ${index <= currentIndex ? "✔️" : index+1}
                                                            </div>
                                                            <small>${status}</small>
                                                        </div>`).join("")}
            </div>`;

}

// function to convert date to readable string
function formatDate(date){
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-NP",{
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

// function to filter bookings that are not cancelled 
function getUpcomingBookings(){
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // check for cancelled bookings
    return bookings.filter(booking => {
        if (booking.status === "Cancelled"){
            return false;
        }
        // keep today date
        return new Date(`${booking.pickup.date}T00:00:00`) >= today;
    }).sort((a, b) => {
        // sort nearest date
        return(new Date(a.pickup.date) - new Date(b.pickup.date));
    });
}

// function to get bookings that are not cancelled
function getFilteredBookings(){
    // get and trim user search query
    const query = $("#bookingSearch").value.toLowerCase().trim();
    if (!query) return getUpcomingBookings();
    // bookings not cancelled which includes search query
    return getUpcomingBookings().filter(booking => {
        const waste = wasteTypes.get(booking.waste.type);
        const searchable = [
            booking.id,
            booking.customer.name,
            booking.pickup.area,
            waste.name,
            booking.status
        ].join("").toLocaleLowerCase();
        return searchable.includes(query);
    });
}

// function to display filtered bookings on webpage
function renderBookings(){
    const container = $("#pickupList");
    // get filtereed bookings list
    const list = getFilteredBookings();
    // default message
    if (list.length === 0){
        container.innerHTML = `<p style="text-align: center; color: #66736c; padding: 30px">
                                    Sorry, no matching pickup found.
                              </p>`;
        return;
    }
    // returned array to render in container
    container.innerHTML = list.map(booking => renderBooking(booking)).join("");
}

// function to display card for individual pickup on webpage
function renderBooking(booking){
    // get waste, frequency and collector detail
    const waste = wasteTypes.get(booking.waste.type);
    const frequency = frequencies.get(booking.pickup.frequency);
    const collector = booking.collector;
    // dynamic literal to create individual card
    return `<div class="pickup-card">
                <div class="pickup-header">
                    <div>
                        <h3>${waste.name}</h3>
                        <span class="pickup-id">${booking.id}</span>
                    </div>
                    <span class="pickup-status">${booking.status}</span>
                </div>
                <div class="pickup-details">
                    <div>📅 ${formatDate(booking.pickup.date)}</div>
                    <div>🕐 ${booking.pickup.time}</div>
                    <div>📍${booking.pickup.area}</div>
                    <div>🗑 ${booking.waste.bags} bags</div>
                    <div>🔝 ${frequency.name} bags</div>
                    <div>💵 Rs. ${booking.pricing.total} bags</div>
                    <div>👤 ${collector ? collector.name : "Unassigned"} bags</div>
                    <div>🛵 ${collector ? collector.vehicle : "NA"} bags</div>
                </div>
                ${renderStatusTracker(booking)}
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    ${booking.status !== "Picked up" ? `<button class="btn-secondary" onclick=advanceBooking('${booking.id}')>Advance Pickup</button>` : ""}
                    ${booking.status !== "Cancelled" && booking.status !== "Picked up" ? `<button class="btn-danger" onclick=cancelBooking('${booking.id}')>Cancel Pickup</button>` : ""}
                </div>
            </div>`;
}

// function to advance current status of pickup
function advanceBooking(bookingId){
    // get id of the booking
    const booking = bookings.find(item => item.id === bookingId);
    if (!booking) return;
    // get index of current status then update to next
    const currentIndex = bookingStatus.indexOf(booking.status);
    const nextStatus = bookingStatus[currentIndex + 1];
    if (!nextStatus) return;
    // update the cuurent status to next 
    updateBookingStatus(bookingId, nextStatus);
    // success message
    showToast(`Pickup status updated to "${nextStatus}".`);
}

function cancelBooking(bookingId){
    // get id of the booking
    const booking = bookings.find(item => item.id === bookingId);
    if (!booking) return;
    // prompt user with message
    if (!confirm("Cancel this pickup?")) return;
    // directly update status to cancelled
    booking.status = "Cancelled"
    // log cancellation details
    booking.statusHistory.push({
        status: "Cancelled",
        timestamp: new Date().toISOString()
    });
    saveBookings();
    // update bookings on the webpage
    renderBookings();
    renderCapacityAnalytics();
    // successful message
    showToast(`Pickup sucessfully cancelled.`);
}

// fucntion to get frequent routes and demand score for frequent routes
function getRecurringRoutes(){
    const routeMap = new Map();
    // filter pickups that have been cancelled
    bookings.filter(booking => booking.status !== "Cancelled").forEach(booking => {
        const area = booking.pickup.area;
        const time = booking.pickup.time;
        const key = `${area}::${time}`;
        // initialize a route
        if (!routeMap.has(key)){
            routeMap.set(
                key, {
                    area, time, totalBookings: 0, recurringBookings: 0, demandScore: 0
                }
            );
        }
        const route = routeMap.get(key);
        route.totalBookings++;
        // demand score based on frequency
        // high, medium and default score for respective frequency
        if (booking.pickup.frequency === "weekly"){
            route.recurringBookings++;
            route.demandScore += 3;
        } else if(booking.pickup.frequency === "monthly"){
            route.recurringBookings++;
            route.demandScore += 2;
        } else {
            route.demandScore += 1;
        }
    });
    // convert map to array and sort based on high demand score
    return [...routeMap.values()].sort((a, b) => 
        b.demandScore - a.demandScore
    );
}

// function to get most frequent routes
function getTopRoutes(limit = 5){
    return getRecurringRoutes().slice(0, limit);
}

// function to get stats to show on dashboard
function getDashboardStats(){
    // filter the cancelled bookings
    const active = bookings.filter(booking => booking.status !== "Cancelled");
    // filter booking having one off plan
    const recurring = active.filter(booking => booking.pickup.frequency !== "one-time");
    const routes = getTopRoutes();
    // return object with necessary statistics
    return{
        totalBookings: bookings.length,
        activeBookings: active.length,
        recurringBookings: recurring.length,
        topRoute: routes.length ? routes[0] : null
    }
}

// function to update stats 
function updateAnalytics(){
    const stats = getDashboardStats();
    // update elements with latest stats
    $("#totalBookings").textContent = stats.totalBookings;
    $("#activeBookings").textContent = stats.activeBookings;
    $("#recurringBookings").textContent = stats.recurringBookings;
    $("#topRoute").textContent = stats.topRoute ? stats.topRoute.area : "NA";
    // display stats on webpage
    renderTopRoutes();
    renderCapacityAnalytics();
}

// function to display most frequented routes on webpage
function renderTopRoutes(){
    // get top routes and display element
    const routes = getTopRoutes();
    const container = $("#topRoutes");
    // check if route list empty
    if (routes.length === 0){
        // message to create a booking first
        container.innerHTML = `<p stytle="color: #66736c; padding: 20px 0;">
                                Create booking first before routes can appear. 
                              </p>`;
        return;
    }
    // map each route and create card
    container.innerHTML = routes.map((route, index) => `
                        <div class="route-item">
                            <div class="route-rank">${index + 1}</div>
                            <div class="route-info">
                                <strong>${route.area}</strong><br>
                                <strong>
                                    ${route.time}<br>
                                    ${route.recurringBookings} recurring pickups
                                </strong>
                            </div>
                            <div class="route-score">Score: ${route.demandScore}</div>
                        </div>`).join("");
}

// function to calculate capacity utilization of pickups
function renderCapacityAnalytics(){
    // get display element
    const container = $("#capacityAnalytics");
    // get current date
    const today = new Date().toISOString().split("T")[0];
    // initialize empty route array
    const routes = [];
    // iterate each location
    serviceLocations.forEach((fee, area) => {
        let totalMax = 0;
        let totalUsed = 0;
        // iterate to get limit of all locations for current date
        timeSlots.forEach((timeFee, time) => {
            const capacity = getRouteCapacity(area, time, today);
            totalMax += capacity.maximum;
            totalUsed += capacity.used;
        });
        // push utilization metrics to route array
        routes.push({
            area, 
            maximum: totalMax,
            used: totalUsed,
            utilization: totalMax ? (totalUsed / totalMax) * 100 : 0,
        });
    });
    // sort to display in desending order
    routes.sort((a, b) => b.utilization - a.utilization);
    // display 6 of the most frequented routes on webpage
    container.innerHTML = routes.slice(0, 6).map(route => `
                        <div style="margin-bottom: 15px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                <strong>${route.area}</strong>
                                <small>${Math.round(route.utilization)}%</small>
                            </div>
                            <div class="capacity-bar">
                                <div style="width: ${Math.min(route.utilization, 100)}%;"></div>
                            </div>
                        </div>`).join("");
}

// function to display pricing breakdown on webpage
function renderPriceBreakDown(price){
    // dynamically insert info into html elements
    $("#priceBreakdown").innerHTML = `<div class="price-row">
                                        <span>Standard Pickup</span>
                                        <strong>Rs. {price.base}</strong>
                                      </div>
                                      <div class="price-row">
                                        <span>Waste Volume</span>
                                        <strong>Rs. {price.bagCost}</strong>
                                      </div>
                                      <div class="price-row">
                                        <span>Service Location</span>
                                        <strong>Rs. {price.areaFee}</strong>
                                      </div>
                                      <div class="price-row">
                                        <span>Service Timings</span>
                                        <strong>Rs. {price.timeFee}</strong>
                                      </div>
                                      ${
                                        price.demandSurcharge > 0 ? `
                                        <div class="price-row">
                                            <span>Demand Surcharge</span>
                                            <strong>Rs. {price.demandSurcharge}</strong>
                                        </div>` : ""
                                      }
                                      <div class="price-row discount">
                                        <span>Recurring Discount</span>
                                        <strong> - Rs.${price.discount}</strong>
                                      </div>
                                      <div class="price-row total">
                                        <span>Total Amount</span>
                                        <strong>Rs.${price.total}</strong>
                                      </div>`;
}

// function to calculate updated price based on user input
function updatePrice(){
    // get user form data
    const data = getFormData();
    if (!data.wasteType || !data.frequency) return;
    // calculate price based on user input
    const price = calculatePrice(data);
    // primary estimate
    $("#estimate").textContent = `${price.currency} ${price.total.toLocaleString()}`;
    // frequency info
    const frequency = frequencies.get(data.frequency);
    // update price with discount based on frequency selected
    $("#frequencyText").textContent = `${frequency.name} . ${frequency.discount * 100}% recurring discount`;
    // display detailed price on webpage
    renderPriceBreakDown(price);
    renderCapacity();
}

// function to select pickup plan
function selectPickupPlan(frequency){
    // assign frequency value
    $("#frequency").value = frequency;
    // update the price
    updatePrice();
    scrollToBooking();
    // toast notification with frequency selection message
    showToast(
        frequency === "weekly" ? "Weekly plan selected." : 
        frequency === "monthly" ? "Monthly plan selected." :
        "One-time pickup selected."
    );
}

// function to scroll smoohtly to booking element
function scrollToBooking(){
    $("#booking").scrollIntoView({
        behavior: "smooth"
    });
}

// listener for submit form
$("#bookingForm").addEventListener("submit", event => {
    // prevent default action
    event.preventDefault();
    // get and validate user form data
    const data = getFormData();
    const validation = validateBooking(data);
    // check validation fail
    if (!validation.valid){
        showToast(validation.message);
        return;
    }
    try{
        // create new booking object and assign data
        const booking = createBooking(data);
        // successful creation toask notification
        showToast(`Pickup ID: ${booking.id} scheduled succesfully.`);
        // reset to default
        event.target.reset();
        $("#bags").value = 2;
        // call functions to refresh with latest booking
        updatePrice();
        renderBookings();
        updateAnalytics();
        renderCapacity();
        $("#myPickups").scrollIntoView({
            behavior: "smooth"
        });
    } catch (error){
        // catch any errors
        showToast(error.message);
    }
});

// function for toast notification
let toastTimer;
function showToast(message){
    const toast = $("#toast");
    toast.textContent = message;
    // add show css class
    toast.classList.add("show");
    clearTimeout(toastTimer);
    // 3 second timer to remove show css class
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

// iterate all form elements and attach listener for change and input events 
["wasteType", "bags", "area", "time", "frequency", "date"].forEach(id => {
    $(`#${id}`).addEventListener("change", updatePrice);
    $(`#${id}`).addEventListener("input", updatePrice);
});

// display booking list with user search query
$("#bookingSearch").addEventListener("input", renderBookings);

// toggle the various service provided in home page
$$(".filter-buttons button").forEach(button => {
    button.addEventListener("click", () => {
            // remove active css class
            $$(".filter-buttons button").forEach(btn => 
                btn.classList.remove("active")
            );
            // add active class to selected button
            button.classList.add("active");
            // get target category using filter
            const filter = button.dataset.filter;
            // iterate and toggle visibilty baed on category filter
            $$("#service-card").forEach(service => {
                const category = service.dataset.category;
                service.style.display = filter === "all" || category === filter ? "block" : "none";
            });
        }
    );
});

// menu for mobile
$("#menuBtn").addEventListener("click", () => {
    $("#navLinks").classList.toggle("show");
    const open = $("#navLinks").classList.contains("show");
    $("#menuBtn").textContent = open ? "❌" : "☰";
});
// close menu when link clicked
$$("#navLinks a").forEach(link => {
    link.addEventListener("click", () => {
        $("#navLinks").classList.remove("show");
        $("#menuBtn").textContent = "☰";
    });
});

// function for stats info animation
function animateCounters(){
    // get h3 elements having stat class
    $$(".stat h3").forEach(counter => {
        // get final number
        const target = Number(counter.dataset.count);
        let current = 0;
        // step size for increment
        const increment = Math.max(1, Math.ceil(target / 60));
        // animation function
        function update(){
            current += increment;
            if (current > target){
                current = target;
            }
            // output formatting based on stat field
            counter.textContent = target === 95 ? `${current}%` : `${current}+`;
            // update the next frame
            if (current < target){
                requestAnimationFrame(update);
            }
        }
        update();
    });
}


// intersection object for animating elements
const statsObserver = new IntersectionObserver(entries => {
    // check element is in view
        if (entries[0].isIntersecting){
            // trigger and run animation only once
            animateCounters();
            statsObserver.disconnect();
        }
    // trigger when element 50% in view
    }, {threshold: 0.5}
);
statsObserver.observe($(".stats"))

// prevent selcting date of past
$("#date").min = new Date().toISOString().split("T")[0];
// get current year for copyright element
$("#year").textContent = new Date().getFullYear();

// call the functions
renderBooking();
updateAnalytics();
updatePrice();
renderCapacity();