import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

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
const db = getFirestore(firebaseApp);

const authErrorMessages = {
  "auth/email-already-in-use": "Este correo ya está registrado.",
  "auth/invalid-email": "Ingresa un correo electrónico válido.",
  "auth/weak-password": "La clave debe tener mínimo 6 caracteres."
};

const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-link");
const filterButtons = document.querySelectorAll(".filter-btn");
const packageCards = document.querySelectorAll(".package-card");
const destinationButtons = document.querySelectorAll(".destination-btn");
const packageButtons = document.querySelectorAll(".package-btn");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalText = document.getElementById("modal-text");
const modalClose = document.querySelector(".modal-close");
const modalInfoButton = document.querySelector(".modal-info-btn");
const form = document.getElementById("formulario");
const respuesta = document.getElementById("respuesta");
const interes = document.getElementById("interes");
let activeDestination = null;
 
const destinationDetails = {
  costa: {
    title: "Costa",
    text: "La Costa combina playas, manglares, avistamiento de ballenas, surf y gastronomia marina. Es ideal para viajeros que buscan descanso, sol y experiencias frente al mar.",
    interest: "Costa y descanso frente al mar"
  },
  galapagos: {
    title: "Galapagos",
    text: "Galapagos ofrece fauna unica, playas volcanicas, snorkel, buceo y recorridos entre islas. Es una region perfecta para turismo de naturaleza y fotografia.",
    interest: "Galapagos naturaleza unica"
  },
  sierra: {
    title: "Sierra",
    text: "La Sierra muestra volcanes, lagunas, pueblos patrimoniales, mercados andinos y ciudades historicas como Quito y Cuenca.",
    interest: "Sierra volcanes y cultura"
  },
  amazonia: {
    title: "Amazonia",
    text: "La Amazonia ecuatoriana permite navegar por rios, caminar por senderos de selva, visitar comunidades locales y observar aves exoticas.",
    interest: "Amazonia selva y comunidades"
  }
};
 
menuButton.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
});
 
navItems.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
 
    navItems.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  });
});
 
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
 
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
 
    packageCards.forEach((card) => {
      const shouldShow = filter === "todos" || card.dataset.category === filter;
      card.classList.toggle("hidden", !shouldShow);
    });
  });
});
 
destinationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const destination = button.dataset.destination;
    const detail = destinationDetails[destination];
 
    if (!detail) {
      return;
    }
 
    modalTitle.textContent = detail.title;
    modalText.textContent = detail.text;
    activeDestination = detail;
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
  });
});
 
packageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    interes.value = button.dataset.package;
    document.getElementById("registro").scrollIntoView({ behavior: "smooth" });
    document.getElementById("nombre").focus({ preventScroll: true });
  });
});
 
function closeModal() {
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
}
 
modalClose.addEventListener("click", closeModal);
 
modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});
 
modalInfoButton.addEventListener("click", () => {
  if (activeDestination) {
    interes.value = activeDestination.interest;
  }
 
  closeModal();
});
 
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});
 
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  respuesta.classList.remove("error");
 
  if (!form.checkValidity()) {
    respuesta.textContent = "Completa tu nombre, correo válido y clave.";
    respuesta.classList.add("error");
    form.reportValidity();
    return;
  }
 
  const submitButton = form.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = "Guardando...";
  respuesta.textContent = "";

  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const clave = document.getElementById("clave").value;
  const interesSeleccionado = interes.value;

  try {
    const credencial = await createUserWithEmailAndPassword(auth, correo, clave);

    await addDoc(collection(db, "usuarios"), {
      uid: credencial.user.uid,
      nombre,
      correo,
      interes: interesSeleccionado,
      creadoEn: serverTimestamp()
    });

    respuesta.textContent = "Registro guardado correctamente. Ya puedes iniciar sesión.";
    form.reset();
  } catch (error) {
    respuesta.textContent = authErrorMessages[error.code] || "No se pudo guardar el registro.";
    respuesta.classList.add("error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Guardar registro";
  }
});
 