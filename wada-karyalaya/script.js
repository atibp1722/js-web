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