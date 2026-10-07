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
function updateUpcomingBookings(){
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