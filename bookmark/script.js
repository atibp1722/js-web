// initialize and connection function to firebase 
import { initializeApp } from 'https://gstatic.com/firebasejs/firebase-app.js';
// import the necessary functions
import { getFirestore, collection, getDoc, addDoc, serverTimeStamp } from 'https://gstatic.com/firebasejs/firebase-app.js';

// project configuration settings
const firebaseConfig = {
    apiKey: "AIzaSyBFGasfBnyUCIXSPONCz8pPMWB_UwbbYx",
    authDomain: "bookmark-ad5e8.firebaseapp.com",
    projectId: "bookmark-ad5e8",
    storageBucket: "bookmark-ad5e8.appspot.com",
    messagingSenderId: "351258589988",
    appId: "1:351258589988:web:fefbf68350fcbfpf127f21",
};

const app = initializeApp(firebaseConfig);
// connect to database
const db = getFireStore();
// adding elements to collection
const colRef = collection(db, "bookmark");

// add new event as user press the button
const addForm = document.querySelector(".add");
addForm.addEventListener("submit", event => {
    event.preventDefault();

    // get values enetered by the user
    addDoc(colRef, {
        link: addForm.link.value,
        title:addForm.title.value,
        category:addForm.category.value,
        createdAt:serverTimeStamp();
    })
    // reset form after successful completion
    .then( ()=> {
        addForm.reset();
        showCard();
    }) 
});

// each instance new div is created when new info is added
function generateTemplate(response, id){
    return  `<div class="card">
                <p class="title">${response.title}</p>
                    <div class="sub-info">
                        <p>
                            <span class="category" ${response.category}> ${response.category[0].toUpperCase()}${response.category.slice(1)}</span>
                        </p>
                        <a href="${response.link}" target="_blank"><i class="bi bi-box-arrow-up-right website"></i></a>
                        <a href="https://www.google.com/search?q=${response.title}" target="_blank"><i class="bi bi-google search"></i></a>
                        <span><i class="bi bi-trash delete" data-id="${id}"></i></span>
                    </div>
            </div>`;
}

// dispalying the cards
const cards = document.querySelector(".cards");

// get the bookmarks and show them
function showCard(){
    cards.innerHTML="";
    // get actual docs from the collection
    getDoc(colRef)
    // when succesfull run contains all documents
    .then( data => {
        data.docs.forEach(document => {
            // add each newly card
            cards.innerHTML += generateTemplate(document.data(), document.id);
        })
    })
    .catch(error => {
        console.log(error);
    })
}

showCard();