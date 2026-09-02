// initialize and connection function to firebase 
import { initializeApp } from 'https://gstatic.com/firebasejs/firebase-app.js';
// import the necessary functions
import { getFirestore, collection, getDoc, addDoc, deleteDoc, doc, query, where, serverTimeStamp } from 'https://gstatic.com/firebasejs/firebase-app.js';

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

// function to call when deleting a bookmark
function deleteEvent(){
        // all elements having delete button    
        const deleteBtn = document.querySelector("i.delete");
        // loop through each
        // delete using the reference id
        deleteBtn.forEach(button => {
        button.addEventListener("click", event => {
            const deleteRef = doc(db, "bookmark", button.dataset.id);
            deleteDoc(deleteRef)
                .then(() => {
                    // remove entire card by moving up one parent block at a time 
                    button.parentElement.parentElement.parentElement.remove();
                })
        })
    });
}

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
        });
        // call delete function here as without loading card first delete button is not seen
        deleteEvent();
    })
    .catch(error => {
        console.log(error);
    })
}

showCard();

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

function filteredCard(category){
    // if all selected show everything
    if (category === "all"){
        showCard();
    }else{
        // get reference of category that matches with desired category
        const qRef = query(colRef, where("category", "==", category));
        cards.innerHTML = "";
        // get all matching the reference
        getDoc(qRef)
            .then( data => {
                // loop through and create card for every matching
                data.docs.forEach(document => {
                    cards.innerHTML += generateTemplate(document.data(), document.id);
            });
            deleteEvent();
        })
        .catch(error => {
            console.log(error);
        })
    }
}

const catList = document.querySelector(".category-list");
// span needed to make active the clicked one
const catSpan = document.querySelector(".category-list span")

catList.addEventListener("click", event=> {
    if (event.target.tagName === "span"){
        filteredCard(event.tag,innerText.toLowerCase());
        // remove active status from each category
        catSpan.forEach(span => span.classList.remove("active"));
        // make active the category user has just clicked
        event.target.classList.add("active");
    }
});