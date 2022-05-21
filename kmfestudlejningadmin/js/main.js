// Firebase import
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js";

// impoterer funktioner til modulet
window.selectProduct = (id, name, brand, alcohol, price, volume, type) =>
  selectProduct(id, name, brand, alcohol, price, volume, type);
window.createProduct = () => createProduct();
window.updateProduct = () => updateProduct();
window.deleteProduct = (id) => deleteProduct(id);
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
const _auth = getAuth();
const _db = getFirestore();

// Reference til arrays i firebase database
let _productsRef = collection(_db, "produkter");

// Globale variabler
let _products = [];
let _selecetedProduct = "";

onSnapshot(_productsRef, (snapshot) => {
  _products = snapshot.docs.map((doc) => {
    const produkt = doc.data();
    produkt.id = doc.id;
    return produkt;
  });

  _products.sort((a, b) => a.name.localeCompare(b.name));

  appendProducts(_products);
  console.log(_products);
});

function appendProducts(produkter) {
  let htmlTemplate = "";
  for (let produkt of produkter) {
    htmlTemplate += /*html*/ `
      <article>
        <h2>${produkt.name}</h2>
        <p>${produkt.brand}</p>
        <p>${produkt.alcohol}% - ${produkt.price}kr - ${produkt.volume}L</p>
        <button onclick="selectProduct('${produkt.id}','${produkt.name}', '${produkt.brand}', '${produkt.alcohol}', '${produkt.price}', '${produkt.volume}', '${produkt.type}')">Rediger</button>
        <button onclick="deleteProduct('${produkt.id}')">Slet</button>
      </article>
      `;
  }
  document.querySelector("#user-container").innerHTML = htmlTemplate;
}

// ========== CREATE ==========
function createProduct() {
  let nameInput = document.querySelector("#name");
  let brandInput = document.querySelector("#brand");
  let alcoholInput = document.querySelector("#alcohol");
  let priceInput = document.querySelector("#price");
  let volumeInput = document.querySelector("#volume");
  let typeInput = document.querySelector("#type");

  let newProduct = {
    name: nameInput.value,
    brand: brandInput.value,
    alcohol: alcoholInput.value,
    price: priceInput.value,
    volume: volumeInput.value,
    type: typeInput.value,
  };

  addDoc(_productsRef, newProduct);
  navigateTo("home");

  nameInput.value = "";
  brandInput.value = "";
  alcoholInput.value = "";
  priceInput.value = "";
  volumeInput.value = "";
  typeInput.value = "";
}

// ========== UPDATE ==========

function selectProduct(id, name, brand, alcohol, price, volume, type) {
  _selecetedProduct = id;
  const produkt = _products.find((produkt) => produkt.id == _selecetedProduct);

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
  const produktRef = doc(_productsRef, _selecetedProduct);
  updateDoc(produktRef, userToUpdate);
  navigateTo("home");
}

// ========== DELETE ==========
function deleteProduct(id) {
  const docRef = doc(_productsRef, id);
  deleteDoc(docRef);
}
console.log("deleteDoc");

function search(value) {
  value = value.toLowerCase();
  let filteredProdukter = [];
  for (const produkt of _products) {
    console.log(produkt);
    let name = produkt.name.toLowerCase();
    if (name.includes(value)) {
      filteredProdukter.push(produkt);
    }
  }
  appendProducts(filteredProdukter);
}

document.querySelector("#login-btn").onclick = () => login();

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
