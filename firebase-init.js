// =============================
// FIREBASE INIT - PERSPIKATIVE
// =============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


// =============================
// CONFIG FIREBASE (À REMPLACER)
// =============================
const firebaseConfig = {
  apiKey: "XXX",
  authDomain: "XXX",
  projectId: "XXX",
  storageBucket: "XXX",
  messagingSenderId: "XXX",
  appId: "XXX"
};


// =============================
// INIT APP
// =============================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


// =============================
// EXPORT GLOBAL (POUR TON SCRIPT COMMENTS)
// =============================
window.__prspkDb = db;

window.__prspkFire = {
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp
};


// =============================
// AUTH (GOOGLE LOGIN SIMPLE)
// =============================
const provider = new GoogleAuthProvider();

// login function (si tu veux un bouton)
window.prspkLogin = function () {
  signInWithPopup(auth, provider).catch(console.error);
};

window.prspkLogout = function () {
  signOut(auth);
};


// =============================
// USER GLOBAL (ULTRA IMPORTANT)
// =============================
onAuthStateChanged(auth, (user) => {
  window.__prspkUser = user;

  document.dispatchEvent(
    new CustomEvent("prspk:auth-ready", {
      detail: { user }
    })
  );
});