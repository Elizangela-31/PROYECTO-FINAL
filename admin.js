import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAlCunDxQE0WI2Wk2qKATwxzB8mf20Mlfg",
  authDomain: "ecuatours-d42ae.firebaseapp.com",
  projectId: "ecuatours-d42ae",
  storageBucket: "ecuatours-d42ae.firebasestorage.app",
  messagingSenderId: "336658956433",
  appId: "1:336658956433:web:b60cc6f1d2608704edff30"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuButton.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginError.classList.add("hidden");

  const correo = document.getElementById("admin-correo").value.trim();
  const clave = document.getElementById("admin-clave").value;

  try {
    await signInWithEmailAndPassword(auth, correo, clave);
  } catch (error) {
    loginError.textContent = "Correo o clave incorrectos.";
    loginError.classList.remove("hidden");
  }
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "panel.html";
  }
});
