import { initializeApp } from 'https://gstatic.com/firebasejs/firebase-app.js';
import { getFirestore, collection, addDoc, serverTimeStamp } from 'https://gstatic.com/firebasejs/firebase-app.js';

const firebaseConfig = {
    apiKey: "AIzaSyBFGasfBnyUCIXSPONCz8pPMWB_UwbbYx",
    authDomain: "bookmark-ad5e8.firebaseapp.com",
    projectId: "bookmark-ad5e8",
    storageBucket: "bookmark-ad5e8.appspot.com",
    messagingSenderId: "351258589988",
    appId: "1:351258589988:web:fefbf68350fcbfpf127f21",
};

const app = initializeApp(firebaseConfig);
const db = getFireStore();
const colRef = collection(db, "bookmark");

const addForm = document.querySelector(".add");
addForm.addEventListener("submit", event => {
    event.preventDefault();

    addDoc(colRef, {
        link: addForm.link.value,
        title:addForm.title.value,
        category:addForm.category.value,
        createdAt:serverTimeSyamp()
    })
})

