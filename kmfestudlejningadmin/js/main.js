// Firebase import
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js";

// impoterer funktioner til modulet
window.selectUser = (id, name, brand, alcohol, price, volume, type) =>
  selectUser(id, name, brand, alcohol, price, volume, type);
window.createUser = () => createUser();
window.updateProduct = () => updateProduct();
window.deleteUser = (id) => deleteUser(id);
window.search = (value) => search(value);
window.login = () => login();

// Import CRUD + database
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore.js";

// Import auth + login
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAVoadKWObjeSokbsPBt0l7cIta6tAvFDs",
  authDomain: "km-festudlejning.firebaseapp.com",
  projectId: "km-festudlejning",
  databaseURL: "km-festudlejning.firebaseio.com",
  storageBucket: "km-festudlejning.appspot.com",
  messagingSenderId: "500346358771",
  appId: "1:500346358771:web:9d8d89bab2354e12dea086",
  measurementId: "G-DXQ30604P2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const _db = getFirestore();
const _auth = getAuth();

// Reference til arrays i firebase database
let _produkterRef = collection(_db, "produkter");

// Globale variabler
let _produkter = [];
let _selecetedProduct = "";

onSnapshot(_produkterRef, (snapshot) => {
  _produkter = snapshot.docs.map((doc) => {
    const produkt = doc.data();
    produkt.id = doc.id;
    return produkt;
  });

  _produkter.sort((a, b) => a.name.localeCompare(b.name));

  appendProducts(_produkter);
  console.log(_produkter);
});

function appendProducts(produkter) {
  let htmlTemplate = "";
  for (let produkt of produkter) {
    htmlTemplate += /*html*/ `
      <article>
        <h2>${produkt.name}</h2>
        <p>${produkt.brand}</p>
        <p>${produkt.alcohol}% - ${produkt.price}kr - ${produkt.volume}L</p>
        <button onclick="selectUser('${produkt.id}','${produkt.name}', '${produkt.brand}', '${produkt.alcohol}', '${produkt.price}', '${produkt.volume}', '${produkt.type}')">Rediger</button>
        <button onclick="deleteUser('${produkt.id}')">Slet</button>
      </article>
      `;
  }
  document.querySelector("#user-container").innerHTML = htmlTemplate;
}

// ========== CREATE ==========
function createUser() {
  let nameInput = document.querySelector("#name");
  let brandInput = document.querySelector("#brand");
  let alcoholInput = document.querySelector("#alcohol");
  let priceInput = document.querySelector("#price");
  let volumeInput = document.querySelector("#volume");
  let typeInput = document.querySelector("#type");

  let newUser = {
    name: nameInput.value,
    brand: brandInput.value,
    alcohol: alcoholInput.value,
    price: priceInput.value,
    volume: volumeInput.value,
    type: typeInput.value,
  };

  addDoc(_produkterRef, newUser);
  navigateTo("home");

  nameInput.value = "";
  brandInput.value = "";
  alcoholInput.value = "";
  priceInput.value = "";
  volumeInput.value = "";
}

// ========== UPDATE ==========

function selectUser(id, name, brand, alcohol, price, volume, type) {
  _selecetedProduct = id;
  const produkt = _produkter.find((produkt) => produkt.id == _selecetedProduct);

  let nameInput = document.querySelector("#name-update");
  let brandInput = document.querySelector("#brand-update");
  let alcoholInput = document.querySelector("#alcohol-update");
  let priceInput = document.querySelector("#price-update");
  let volumeInput = document.querySelector("#volume-update");
  let typeInput = document.querySelector("#type-update");
  nameInput.value = name;
  brandInput.value = brand;
  alcoholInput.value = alcohol;
  priceInput.value = price;
  volumeInput.value = volume;
  typeInput.value = type;
  _selecetedProduct = id;
  navigateTo("edit");
}

function updateProduct() {
  let nameInput = document.querySelector("#name-update");
  let brandInput = document.querySelector("#brand-update");
  let alcoholInput = document.querySelector("#alcohol-update");
  let priceInput = document.querySelector("#price-update");
  let volumeInput = document.querySelector("#volume-update");
  let typeInput = document.querySelector("#type-update");

  let userToUpdate = {
    name: nameInput.value,
    brand: brandInput.value,
    alcohol: alcoholInput.value,
    price: priceInput.value,
    volume: volumeInput.value,
    type: typeInput.value,
  };
  const produktRef = doc(_produkterRef, _selecetedProduct);
  updateDoc(produktRef, userToUpdate);
  navigateTo("home");
}

// ========== DELETE ==========
function deleteUser(id) {
  const docRef = doc(_produkterRef, id);
  deleteDoc(docRef);
}
console.log("deleteDoc");

function search(value) {
  value = value.toLowerCase();
  let filteredProdukter = [];
  for (const produkt of _produkter) {
    console.log(produkt);
    let name = produkt.name.toLowerCase();
    if (name.includes(value)) {
      filteredProdukter.push(produkt);
    }
  }
  appendProducts(filteredProdukter);
}

document.querySelector("#btn-login").onclick = () => login();

onAuthStateChanged(_auth, (user) => {
  if (user) {
    navigateTo("home");
  } else {
    navigateTo("login");
  }
});

function login() {
  const mail = document.querySelector("#login-mail").value;
  const password = document.querySelector("#login-password").value;

  signInWithEmailAndPassword(_auth, mail, password)
    .then((userCredential) => {
      const user = userCredential.user;
    })

    .catch((error) => {
      error.message = "Forkerte login-informationer, prøv igen.";
      document.querySelector(".login-error").innerHTML = error.message;
    });
}
