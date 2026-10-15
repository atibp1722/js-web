// for strict mode
'use strict';

// webpage application objects
const STATE = {
    currentPage: 'home',
    theme: localStorage.getItem('bkt-theme') || 'light',
    notifications: JSON.parse(localStorage.getItem('bkt-notifications') || '[]'),
    notices: JSON.parse(localStorage.getItem('bkt-notices') || 'null'),
    decisions: JSON.parse(localStorage.getItem('bkt-decisions') || 'null'),
    tenders: JSON.parse(localStorage.getItem('bkt-tenders') || 'null'),
    feedback: JSON.parse(localStorage.getItem('bkt-feedback') || '[]'),
    filters: {notices: 'all', decisions: 'all', tenders: 'all'}
};

// populating notice, tender and decision content
if (!STATE.notices){
    STATE.notices = [
        {id: uid(), title: "Vaccination program", body: "All people residing in Ward 3 and 4 are requested to bring their children for vaccination program at PHC near Ganesh temple.", category: 'Notice', priority: 'High', date: Date.now() - 3600_000},
        {id: uid(), title: "Property tax deadline", body: "All property owners (house, land) are requested to submit their tax filing within 7 days of notice, late filing will incur 5% fine.", category: 'Notice', priority: 'High', date: Date.now() - 3600_000},
        {id: uid(), title: "Volunteer request", body: "As mandated by government of Nepal, Ward #4 is lookng for candidates willing to volunteer for upcoming cultural program. Please note that this is a paid position and payment will be as per ward guidelines.", category: 'Press Release', priority: 'Medium', date: Date.now() - 86400_000},
        {id: uid(), title: "Road maintainence", body: "Due to the damage caused by heavy rains, major roads of Ward #3 will be under going maintainence. All people are requested to use alternate routes, we are very sorry for any incovinience caused.", category: 'Notice', priority: 'Medium', date: Date.now() + 2 * 3600_000},
        {id: uid(), title: "Free health camp", body: "Bhaktapur Red Cross is organizing a free health camp on campus ground premises from 9AM - 3PM, all citizens are welcome", category: 'Notice', priority: 'Low', date: Date.now() - 4 * 86400_000}
    ];
    persist.notices();
}

if (!STATE.tenders){
    STATE.tenders = [
        {id: uid(), title: "PHC construction in Ward #5", ref:'BKT/TND-2083-1', category:'Infrastructure', budget: 850000, deadline: Date.now() + 15 * 86400_000, status: 'Open', bidders: 3, summary: "Construction of PHC building in Ward #5, temporary office with 3 rooms including cold storage."},
        {id: uid(), title: "Annual office stationaries", ref:'BKT/TND-2083-34', category:'Administration', budget: 450000, status: 'Awarded', bidders: 5, summary: "Stationary item related annual contract for Ward #3 and #4 has been awarded to Mira Office Supplies Pvt. Ltd.."},
        {id: uid(), title: "Annual medical supplies", ref:'BKT/TND-2083-67', category:'Health', budget: 1000000, status: 'Closed', bidders: 2, summary: "Annual medical supplies and equipment for Ward #5 health department has been closed, please contact the financial department for any queries."}
    ];
    persist.tenders();
}

if (!STATE.decisions){
    STATE.decisions = [
        {id: uid(), title: "Approval of 2083/84 annual budget", ref:'EXE/BKT-2083-1', department:'Executive Committee', decision: 'Approved', status: 'Implemented', date: Date.now() - 4 * 86400_000, summary: "The executive committee has approved the annual budget of Rs.73 million for the fiscal year 2083/84."},
        {id: uid(), title: "Tender approval for annual stationary supplies", ref:'BKT/TND-2083-57', department:'Executive Committe', decision: 'Approved', status: 'Implemented', date: Date.now() - 7 * 86400_000, summary: "Contract for annual stationary has been awarde to Mira Office Supplies Pvt. Ltd. for the amount of Rs. 850000."},
        {id: uid(), title: "New leave management system", ref:'BKT/TND-2083-21', department:'Administration', decision: 'Pending', status: 'Under Review', date: Date.now() - 2 * 86400_000, summary: "Digital leave management system integration with existing system for managing leave efficiently is offically under review."}
    ];
    persist.decisions();
}

// list of key people
const KEY_PEOPLE = [
    {id: 'EMP-010', name: 'Ram Kumar Karki', designation: 'Ward Chairperson', department: 'Executive Committe', avatar: 'RK', email: 'exec@bkt.gov.np', contact: 9851098510},
    {id: 'EMP-010', name: 'Kunti Pariyar', designation: 'Ward Member', department: 'Executive Committe', avatar: 'KP', email: 'exec@bkt.gov.np', contact: 9849098460},
    {id: 'EMP-010', name: 'Sambhu Sharma', designation: 'Ward Member', department: 'Executive Committe', avatar: 'SS', email: 'exec@bkt.gov.np', contact: 9851052410},
    {id: 'EMP-010', name: 'Bandana Bista', designation: 'Ward Secretary', department: 'Executive Committe', avatar: 'BS', email: 'exec@bkt.gov.np', contact: 9852078635},
    {id: 'EMP-010', name: 'Ramesh KC', designation: 'Computer Officer', department: 'IT & Admin', avatar: 'RK', email: 'admin@bkt.gov.np', contact: 9863417823},
    {id: 'EMP-010', name: 'Kumar Basnet', designation: 'Computer Operator', department: 'IT & Admin', avatar: 'KB', email: 'admin@bkt.gov.np', contact: 9188254132},
    {id: 'EMP-010', name: 'Dinesh Shakya', designation: 'Account Officer', department: 'Finance & Planning', avatar: 'DS', email: 'planning@bkt.gov.np', contact: 9870265152},
    {id: 'EMP-010', name: 'Gourav KC', designation: 'Health Officer', department: 'Health', avatar: 'GK', email: 'health@bkt.gov.np', contact: 9889324156},
    {id: 'EMP-010', name: 'Kumari Dahal', designation: 'Account Assistant', department: 'Finance & Planning', avatar: 'KD', email: 'planning@bkt.gov.np', contact: 9851098511}
];

// citizen charer list
const citizenCharter = [
    {id: 'c1', service: '', category: '', time: '', fee: '', department: '', summary: ''},
    {id: 'c2', service: '', category: '', time: '', fee: '', department: '', summary: ''},
    {id: 'c3', service: '', category: '', time: '', fee: '', department: '', summary: ''},
    {id: 'c4', service: '', category: '', time: '', fee: '', department: '', summary: ''},
    {id: 'c5', service: '', category: '', time: '', fee: '', department: '', summary: ''},
    {id: 'c6', service: '', category: '', time: '', fee: '', department: '', summary: ''},
    {id: 'c7', service: '', category: '', time: '', fee: '', department: '', summary: ''},
    {id: 'c8', service: '', category: '', time: '', fee: '', department: '', summary: ''},
];

// budget breakdown details
const budgetData = {
    fiscalYear: '2083/84',
    total: 75000000,
    revenue: 62000000,
    categories: [
        {title: 'Cultural Promotion', allocation: 15000000, spend: 10000000},
        {title: 'Infrasructure', allocation: 15000000, spend: 900000},
        {title: 'Health & Sanitation', allocation: 15000000, spend: 7500000},
        {title: 'Administration', allocation: 15000000, spend: 77500000},
        {title: 'Social Welfare', allocation: 15000000, spend: 5000000}
    ]
};

// short hand for dom elements
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
// get reference to variables
const contentArea = $('#contentArea');
const navBar = $('#navBar');
const toastContainer = $('#toastContainer');
const modalOverlay = $('#modalOverlay');
const modalTitle = $('#modalTitle');
const modalBody = $('#modalBody');
const modalFooter = $('#modalFooter');
const notificationPanel = $('#notificationPanel');
const notificationList = $('#notificationList');
const notificationDot = $('#notificationDot');
const searchInput = $('#searchInput');
const saerchResults = $('#saerchResults');
const clockEl = $('#clockEl');

// function to generate unique id
function uid(){
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// function to prevent cross site validation attaacks
function escapeHTML(s){
    return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

// function to format money fto readable format
function formatMoney(n){
    return 'NPR ' + (n/1000000).toFixed(2) + 'M';
}

// function format date to readable format
function formatDate(ts){
    return new Date(ts).toLocaleDateString('en-NP', {day: '2-digit', month: 'short', year: 'numeric'});
}

// function to convert time to ease understood past format
function relativeTime(ts){
    const d = Math.floor((Date.now() - ts) / 1000);
    if (d < 60) return 'just now';
    if (d < 3600) return Math.floor(d / 60) + 'm ago';
    if (d < 86400) return Math.floor(d / 3600) + 'h ago';
    if (d < 604800) return Math.floor(d / 86400) + 'ds ago';
    return formatDate(ts);
}

// function to limit trigger 
function debounce(fn, delay=180){
    let t;
    return (...a) => {
        clearTimeout(t);
        t=setTimeout(() => fn(...a), delay);
    };
}

// sync properties to browser storage
const persist = {
    notices: () => localStorage.setItem('bkt-notices', JSON.stringify(STATE.notices)),
    decisions: () => localStorage.setItem('bkt-decisions', JSON.stringify(STATE.decisions)),
    tenders: () => localStorage.setItem('bkt-tenders', JSON.stringify(STATE.tenders)),
    notifications: () => localStorage.setItem('bkt-notifications', JSON.stringify(STATE.notifications)),
    feedback: () => localStorage.setItem('bkt-feedback', JSON.stringify(STATE.feedback)),
    theme: () => localStorage.setItem('bkt-theme', JSON.stringify(STATE.theme))
};

// fucntion to show toast for user feedback
function showToast(msg, type='info', duration=3000){
    const icons = {
        info: 'ℹ️',
        success: '✅',
        error: '❌',
        warning: '⚠️'
    };
    const t = document.createElement("div");
    t.className = 'toast ' + type;
    t.setAttribute('role', 'alert');
    t.innerHTML = '<span>' + (icons[type] || 'ℹ️') + '</span> <span style="flex: 1">' + escapeHTML(msg) + '</span><button class="toast-close" aria-label="Close>X</button>';
    toastContainer.appendChild(t);
    const close = () => {
        t.classList.add("removing");
        setTimeout(() => {
            t.remove()
        },300);
    }
    t.querySelector(".toast-close").addEventListener("click", close);
    setTimeout(close, duration)
}

// function to add new notification 
function addNotification(text, icon='🔔'){
    STATE.notifications.unshift({id: uid(), text, icon, time: Date.now(), read: false});
    if (STATE.notifications.length > 30){
        STATE.notifications = STATE.notifications.slice(0, 30);
    }
    persist.notifications();
    renderNotifications();
}

// function to render notification dropdown 
function renderNotifications(){
    const unread = STATE.notifications.filter(n => !n.read).length;
    notificationDot.style.display = unread > 0 ? "block" : "none";
    if (!STATE.notifications.length){
        notificationList.innerHTML = '<div class="notification-empty">No notifications to show.</div>';
        return;
    }
    notificationList.innerHTML = STATE.notifications.map(n => 
        `<div class=".notification-item ${n.read ? '' : 'unread'}"data-id="${n.id}">
            <div class="notification-icon">${n.icon}</div>
            <div style="flex: 1">
                <div class="notification-text">${escapeHTML(n.text)}</div>
                <div class="notification-time">${relativeTime(n.time)}</div>
            </div>
        </div>`
    ).join("");
    $$('notification-item', notificationList).forEach(el => {
        el.addEventListener("click", () => {
            const n = STATE.notifications.find(x => x.id === el.dataset.id);
            if (n){
                n.read = true;
                persist.notifications();
                renderNotifications();
            }
        });
    });
}

// function to open modal with content
function openModal(title, bodyHTML, footerHTML=""){
    modalTitle.textContent = title;
    modalBody.innerHTML = bodyHTML;
    modalFooter.innerHTML = footerHTML;
    modalOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
}

// function to close modal
function closeModal(){
    modalOverlay.classList.remove("active");
    document.body.style.overflow = "";
}

// close modal by creating close button or pressing outside its boundary
$("#modalCloseBtn").addEventListener("click", closeModal);
modalOverlay.addEventListener("click", e => {
    if (e.target === modalOverlay){
        closeModal();
    }
});

// register the webpages
const pages = [];

// function register and render webpage
function registerPage(id, renderFn, afterRender){
    pages[id] = {
        render: renderFn,
        afterRender
    };
}

// function to dyamically switch view
function navigate(pageID){
    if (!pages[pageID]) return;
    STATE.currentPage = pageID;
    contentArea.innerHTML = pages[pageID].render();
    if (pages[pageID].afterRender){
        pages[pageID].afterRender();
    }
    // activate navigation buttons
    $$('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.page === pageID));
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    if (location.hash.slice(1) !== pageID){
        history.replaceState(null, '', '#' + pageID);
    }
}

$$('.nav-btn').forEach(btn => {
    btn.addEventListener("click", () => navigate(btn.dataset.page));
});

// home page rendering
registerPage('home' ,() => {
    const totalNotices = STATE.notices.length;
    const openTenders = STATE.tenders.filter(t => t.status === "Open").length;
    const implemented = STATE.decisions.filter(d => t.status === "Implemented").length;
    return `
           <h2>Welcome to Bhaktapur</h2>
           <p class="lead">The cultural capital of Nepal, your local government web portal.</p>
           <div class="card-grid">
            <div class="card">
                <h3>👩‍👩‍👧‍👦 Population</h3>
                <div class="stat-number">3571</div>
                <p>as per the latest census</p>
            </div>
            <div class="card">
                <h3>🏘️ Wards</h3>
                <div class="stat-number">5</div>
                <p>admiistrative wards</p>
            </div>
            <div class="card">
                <h3>📢 Notices</h3>
                <div class="stat-number">${totalNotices}</div>
                <p>latest announcements</p>
            </div>
            <div class="card">
                <h3>💼 Tenders</h3>
                <div class="stat-number">${openTenders}</div>
                <p>open tenders</p>
            </div>
            <div class="card">
                <h3>⚖️ Decisions</h3>
                <div class="stat-number">${implemented}</div>
                <p>decisions implemented</p>
            </div>
           </div>
           <div class="section-divider>
            <h3>⚡Quick Actions</h3>
           </div>
           <div class="btn-group>
            <button class="btn" id="qaCharter">📜 Citizen Charter</button>
            <button class="btn" id="qaPeople">👥 People</button>
            <button class="btn" id="qaNotices">📢 Notices</button>
            <button class="btn" id="qaBudget">💰 Budget</button>
            <button class="btn" id="qaTenders">💼 Tenders</button>
            <button class="btn-outline btn" id="qaDecisions">⚖️ Decisions</button>
           </div>
           <div class="section-divider>
            <h3>🕓 Recent Activities</h3>
           </div>
           <div class="notice-list">
            ${STATE.notices.slice(0, 3).map(n => `
                <div class="notice-item">
                    <div>
                        <div class="notice-title">${escapeHTML(n.title)}</div>
                        <div class="notice-meta">${escapeHTML(n.category)} • ${relativeTime(n.date)}</div>
                    </div>
                    <div class="notice-actions">
                        <span class="notice-priority ${n.priority}">${n.priority}</span>
                    </div>
                </div>`).join("")}
           </div>`;
}, () => {
    // listeners for other webpages
    $('qaCharter')?.addEventListener("click", () => navigate('charter'));
    $('qaPeople')?.addEventListener("click", () => navigate('people'));
    $('qaNotices')?.addEventListener("click", () => navigate('notices'));
    $('qaBudget')?.addEventListener("click", () => navigate('budget'));
    $('qaTenders')?.addEventListener("click", () => navigate('tenders'));
    $('qaDecisions')?.addEventListener("click", () => navigate('decisions'));
});

// register charter page on website
registerPage('charter', () => {
    // get unique categories
    const categories = [...new Set(citizenCharter.map(c => c.category))];
    // custom html template
    return `
        <h2>📜 Citizen Charter</h2>   
        <p class="lead">Transparency & Accountability -- our halmark</p>
        <div class="filter-bar">
            <label>Filter</label>
            <input type="text" class="search-mini" id="charterSearch" placeholder="Search service here...">
            <div style="display: flex; gap: 0.4rem; flex-wrap: wrap">
                <button class="filter-chip active" data-cat="all">All</button>
                ${categories.map(c => `<button class="filter-chip" data-cat="${escapeHTML(c)}">${escapeHTML(c)}</button>`).join("")}
            </div>
        </div>
        <div class="charter-section" id="charterList"></div>`;
}, () => {
    // category when page load
    let activeCat = "all";
    let searchTerm = "";
    // display charter on screen
    function renderCharter(){
        const filtered = citizenCharter.filter(c => {
            const matchesCat = activeCat === "all" || c.category === activeCat;
            const matchesSearch = !searchTerm || c.service.toLowerCase().includes(searchTerm.toLowerCase()) || c.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCat && matchesSearch;
        });
        const list = $("#charterList");
        // empty message if none found
        if (!filtered.length){
            list.innerHTML = '<div class="empty-state"><span class="emoji">🔎</span>No services found.</div>';
            return;
        }
        // map card for filtered services
        list.innerHTML = filtered.map(c => `
            <div class="charter-item" data-id="${c.id}">
                <div style="flex: 1; min-width: 220px;">
                    <div class="charter-service">${escapeHTML(c.service)}</div>
                    <div class="charter-desc">${escapeHTML(c.summary)}</div>
                    <div class="charter-meta">
                        <span>🏢 ${escapeHTML(c.department)}</span>
                        <span>🕒 ${escapeHTML(c.time)}</span>
                        <span>💸 ${escapeHTML(c.fee)}</span>
                    </div>
                </div>
                <button class="btn btn-sm byn-outline" data-apply="${c.id}">Apply ➝</button>
            </div>`).join("");
        // listeners on all buttons
        $$(['data-apply'], list).forEach(btn => {
            btn.addEventListener("click", () => {
                const c = citizenCharter.find(x => x.id === btn.dataset.apply);
                showToast("Application started for: " + c.service, "success");
                addNotification("Your application for: " + c.service + "📋"); 
            });
        });
    }
    renderCharter();
    // get search user value
    $("#charterSearch").addEventListener("input", debounce(e => {
        searchTerm = e.target.value.trim();
        renderCharter();
    }, 200));
    // filtering categories
    $$(".filter-chip").forEach(chip => {
        chip.addEventListener("click", () => {
            $$(".filter-chip").forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            activeCat = chip.dataset.cat;
            renderCharter();
        });
    });
});

// register people page on website
registerPage("people", () => {
    // base layout
    return `
            <h2>👥 Key People</h2>
            <p class="lead">Key people -- the difference makers</p>
            <div class="filter-bar">
                <label>Department: </label>
                <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;" id="peopleFilter">
                    <button class="filter-chip active" data-dept="all">All</button>
                </div>
            </div>
            <div> class="people-grid" id="peopleGrid"></div>`;
}, () => {
    // get unique departments
    const depts = [...new Set(KEY_PEOPLE.map(p => p.department))];
    const filterWrap = $("#peopleFilter");
    // append department filter button on page
    depts.forEach(d => {
        const b = document.createElement("button");
        b.className = "filter-chip";
        b.dataset.dept = d;
        b.textContent = d;
        filterWrap.appendChild(b);
    });
    let activeDept = "all";
    function renderPeople(){
        // filter people based on department
        const filtered = KEY_PEOPLE.filter(p => activeDept === "all" || p.department === activeDept);
        const grid = $("#peopleGrid");
        // profile card for person
        grid.innerHTML = filtered.map(p => `
            <div class="person-card" data-id="${p.id}">
                <div class="person-avatar">${escapeHTML(p.avatar)}</div>
                <div class="person-name">${escapeHTML(p.name)}</div>
                <div class="person-designation">${escapeHTML(p.designation)}</div>
                <div class="person-department">${escapeHTML(p.department)}</div>
                <div class="person-contact">${escapeHTML(p.contact)}</div>
            </div>`).join("");
        // detail people card for each person
        $$(".person-card", grid).forEach(card => {
            card.addEventListener("click", () => {
                const p = KEY_PEOPLE.find(x => x.id === card.dataset.id);
                openModal(p.name, `
                    <div style="display: flex; gap: 1.2rem; align-items: center; margin-bottom: 1.2rem flex-wrap: wrap;">
                        <div class="person-avatar" style="margin: 0;">${escapeHTML(p.avatar)}</div>
                        <div>
                            <div style="font-weight: 600; font-size: 1.10rem; color: var(--primary);">${escapeHTML(p.name)}</div>
                            <div style="color: var(--text-muted);">${escapeHTML(p.designation)} -- ${escapeHTML(p.department)}</div>
                        </div>
                    </div>
                    <dl class="detail-grid">
                        <dt>Email</dt><dd><a href="mailto: ${escapeHTML(p.email)}">${escapeHTML(p.email)}</a></dd>
                        <dt>Contact</dt><dd>${escapeHTML(p.contact)}</dd>
                        <dt>Department</dt><dd>${escapeHTML(p.department)}</dd>
                    </dl>`,
                    `<button class="btn btn-outline" onclick="document.getElementById('modalCloseBtn').click()">Close</button>
                    <button class="btn" id="contactPersonBtn">Contact</button>`
                );
                setTimeout(() => {
                    $("#contactPersonBtn")?.addEventListener("click", () => {
                        showToast("Open mail to " + p.email, "success");
                        addNotification("You have mailed " + p.name, "📩");
                    });
                }, 100);
            });
        });
    }
    renderPeople();
    // filter click button
    $$("#peopleFilter .filter-chip").forEach(chip => {
        chip.addEventListener("click", () => {
            $$("#peopleFilter .filter-chip").forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            activeDept = chip.dataset.dept;
            renderPeople();
        });
    });
});

// register notice page on website
registerPage("notices", () => {
    return `
           <h2>📢 Notice & Releases</h2>
           <p class="lead">Notices & Releases -- official communication</p>
           <div class="filter-bar">
                <input type="text" class="search-mini" id="noticeSearch" placeholder="Search notice...">
                <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
                    <button class="filter-chip" data-filter="all">All</button>
                    <button class="filter-chip" data-filter="Notice">Notice</button>
                    <button class="filter-chip" data-filter="Press Release">Press Release</button>
                    <button class="filter-chip" data-filter="High">High Priority</button>
                </div>
           </div>
           <div class="btn-group">
                <button class="btn" id="addNoticeBtn">➕ Add</button>
                <button class="btn-outline btn" idr="exportNoticeBtn">📤 Export</button>
           </div>
           <div class="notice-list" id="noticeList"></div>`;
}, () => {
    let filter = "all";
    let search = "";
    function renderNotices(){
        const filtered = STATE.notices.filter(n => {
            const matchFilter = 
                filter === "all" ? true : 
                filter === "high" ? n.priority === "high" || n.priority === "critical" : 
                n.category === filter;
            const matchesSearch = !search || 
                n.title.toLowerCase().includes(search.toLowerCase()) ||
                n.body.toLowerCase().includes(search.toLowerCase());
            return matchFilter && matchesSearch;
        }).sort((a, b) => b.date - a.date);
        const list = $("#noticeList");
        if (!filtered.length){
            list.innerHTML = '<div class="empty-state"><span class="emoji">🚫</span>No notice found.</div>';
            return;
        }
        // notice item list
        list.innerHTML = filtered.map(n => `
            <div class="notice-item" data-id="${n.id}">
                <div style="flex: 1; min-width: 220px;">
                    <div class="notice-title">${escapeHTML(n.title)}</div>
                    <div class="notice-meta">${escapeHTML(n.categories)} • ${relativeTime(n.date)}</div>
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem;">${escapeHTML(n.body.slice(0, 120))}${n.body.length>120 ? "..." : ""}</div>
                </div>
                <div class="notice-actions">
                    <span class="notice-priority ${n.priority}">${n.priority}</span>
                    <span class="notice-date">${formatDate(n.date)}</span>
                    <button class="btn btn-sm btn-outline" data-view="${n.id}">View</button>
                    <button class="del-btn" data-del="${n.id}" title="Delete">🗑️</button>
                </div>
            </div>`).join("");
        // modal handler for notice
        $$("[data-view]", list).forEach(b => b.addEventListener("click", () => {
            const n = STATE.notices.find(x => x.id === b.dataset.view);
            openModal(n.title, `
                <div style="margin-bottom: 1rem;">
                    <span class="notice-priority ${n.priority}" style="margin-right: 0.5rem;">${n.priority}</span>
                    <span class="notice-date">${n.category}</span>
                    <span class="notice-date">${formatDate(n.date)}</span>
                </div>
                <p style="line-height: 1.5;">${escapeHTML(n.body)}</p>`,
                `<button class="btn btn-outline" onclick="document.getElementById('modalCloseBt').click()">Close</button>
                <button class="btn" id="shareNoticeBtn" title="Share">🔁</button>`
            );
            setTimeout(() => {
                $('#shareNoticeBtn')?.addEventListener("click", () => {
                    showToast("Notice link copied", "success");
                    closeModal();
                });
            }, 100);
        }));
        $$("[data-del]", list).forEach(b => b.addEventListener("click", () => {
            const id = b.dataset.del;
            const n = STATE.notices.find(x => x.id === id);
            openModal("Confirm Delete", `
                    <p>Are you sure you want to delete "<strong>${escapeHTML(n.title)}</strong>?"</p>`
                    `<button class="btn btn-outline" onclick="document.getElementById('modalCloseBtn').click()">Cancel</button>
                    <button class="btn btn-danger" id="confirmDelBtn">Delete</button>`
                );
            setTimeout(() => {
                $("#confirmDelBtn")?.addEventListener("click", () => {
                    STATE.notices = STATE.notices.filter(x => x.id !== id);
                    persist.notices();
                    closeModal();
                    renderNotices();
                    showToast("Notice deleted", "success");
                });
            }, 100);
        }));
    }
    renderNotices();
    // listener for user input search and filter
    $("#noticeSearch").addEventListener("input", debounce(e => {
        search = e.target.value.trim();
        renderNotices();
    }, 200));
    $$(".filter-chip").forEach(chip => {
        chip.addEventListener("click", () => {
            $$(".filter-chip").forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            filter = chip.dataset.filter;
            renderNotices();
        });
    });
    // modal to add new notice
    $("#addNoticeBtn").addEventListener("click", () => {
        openModal("Add New Notice", `
            <div class="form-group">
                <label class="form-label">Title </label>
                <input class="form-input" id="nTitle" placeholder="Notice title">
                <div class="form-error" id="errTitle">Title required</div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Category</label>
                    <select class="form-select" id="nCategory">
                        <option>Notice</option>
                        <option>Press Release</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Priority</label>
                <select class="form-select" id="nPriority">
                    <option value="low">Low</option>
                    <option value="medium" selected>Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Body </label>
                <textarea class="form-textarea" id="nBody" placeholder="Full notice text…"></textarea>
                <div class="form-error" id="errBody">Body required</div>
            </div>`,
            `<button class="btn btn-outline" "document.getElementById('modalCloseBtn').click()">Cancel</button>
            <button class="btn" id="saveNoticeBtn">Save Notice</button>`
        );
        setTimeout(() => {
            $("#saveNoticeBtn")?.addEventListener("click", () => {
                const title = $("#nTitle").value.trim();
                const body = $("#nBody").value.trim();
                let valid = true;
                if (!title){
                    $("#nTitle").classList.add("error");
                    $("#errTitle").classList.add("show");
                    valid = false;
                } else{
                    $("#nTitle").classList.remove("error");
                    $("#errTitle").classList.remove("show");
                }
                if (!body){
                    $("#nBody").classList.add("error");
                    $("#errBody").classList.add("show");
                    valid = false;
                } else{
                    $("#nBody").classList.remove("error");
                    $("#errBody").classList.remove("show");
                }
                if (!valid) return;
                const newNotice = {
                    id: uid(),
                    title, body,
                    category: $("#nCategory").value,
                    priority: $("#nPriority").value,
                    date: Date.now()
                };
                STATE.notices.unshift(newNotice);
                persist.notices();
                addNotification("New "+newNotice.category+": "+ title,"📢");
                closeModal();
                renderNotices();
                showToast("Notices added succesfully.", "success");
            });
        }, 100);
    });
    // export notice as downloadable txt file
    $('#exportNoticesBtn').addEventListener("click", () => {
    const text = STATE.notices.map(n => `[${formatDate(n.date)}] ${n.category} (${n.priority})\n${n.title}\n${n.body}\n---`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bhaktapur-notices.txt';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Notices exported', 'success');
    });
});

registerPage("decisions", () => {
    return `
           <h2>Executive Decisions</h2>
           <p class="lead">Key decisions and resolutions made by the committee.</p>
           <div class="filter-bar">
                <input type="text" class="search-mini" placeholder="Search decisions...">
                <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
                    <button class="filter-chip" data-filter="all">All</button>
                    <button class="filter-chip" data-filter="Implemented">Implemented</button>
                    <button class="filter-chip" data-filter="In Progress">In Progress</button>
                    <button class="filter-chip" data-filter="Under Review">Under Review"</button>
                </div>
           </div>
           <div class="btn-group">
                <button class="btn" id="addDecisionBtn">➕ Add</button>
           </div>
           <div id="decisionList" style="margin-top: 1rem;"></div>`;
}, () => {
    let filterStatus = "all";
    let search = "";
    function renderDecisions(){
        const filtered = STATE.decisions.filter(d => {
            const matchStatus = filterStatus === "all" || d.status === filterStatus; 
            const matchSearch = !search || 
                d.title.toLowerCase().includes(search.toLowerCase()) ||
                d.ref.toLowerCase().includes(search.toLowerCase()) ||
                d.department.toLowerCase().includes(search.toLowerCase());
            return matchStatus && matchSearch;
        }).sort((a, b) => b.date - a.date);
        const list = $("#decisionList");
        if (!filtered.length){
            list.innerHTML = '<div class="empty-state"><span class="emoji">🚫</span>No decisions found.</div>';
            return;
        }
        list.innerHTML = filtered.map(d => `
                        <div class="notice-item" style="border-left-color: var(--text-muted)">
                            <div style="flex: 1; min-width: 220px;">
                                 <div class="notice-title">${escapeHTML(d.title)}</div>
                                <div class="notice-meta">
                                    <strong>${escapeHTML(d.ref)}</strong> • ${relativeTime(d.department)} • ${relativeTime(d.date)}
                                </div>
                                <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem;">${escapeHTML(d.summary.slice(0, 120))}${d.summary.length>120 ? "..." : ""}</div>
                            </div>
                        </div>
                        <div class="notice-actions">
                            <span class="pill ${d.status === 'Implemented' ? 'pill-open' : d.status === 'Under Review' ? 'pill-awarded' : 'pill-pending'}">${d.status}</span>
                            <button class="btn btn-sm btn-outline" data-view="${d.id}">Details</button>
                            <button class="del-btn" data-del="${d.id}" title="Delete">🗑️</button>
                        </div>`),join("");
        $$
    }
})