import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, collection, query, orderBy, onSnapshot, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

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

const logoutButton = document.getElementById("logout-btn");
const solicitudesGrid = document.getElementById("solicitudes-grid");
const panelEmpty = document.getElementById("panel-empty");
const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

let unsubscribeSolicitudes = null;

logoutButton.addEventListener("click", () => {
  signOut(auth);
});

menuButton.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

function whatsappHref(data) {
  const telefonoLimpio = data.telefono.replace(/\D/g, "").replace(/^0/, "");
  const mensaje = `Hola ${data.nombre}, te escribo de EcuaTours por tu solicitud de "${data.interes}".`;
  return `https://wa.me/593${telefonoLimpio}?text=${encodeURIComponent(mensaje)}`;
}

function createSolicitudCard(id, data) {
  const card = document.createElement("article");
  card.className = "solicitud-card";
  if (data.estado === "contactado") {
    card.classList.add("contactado");
  }

  const estado = document.createElement("span");
  estado.className = "badge-estado";
  estado.textContent = data.estado;
  card.appendChild(estado);

  const nombre = document.createElement("h3");
  nombre.textContent = data.nombre;
  card.appendChild(nombre);

  const interes = document.createElement("p");
  interes.className = "solicitud-interes";
  interes.textContent = data.interes;
  card.appendChild(interes);

  const contacto = document.createElement("p");
  contacto.className = "solicitud-meta";
  contacto.textContent = `${data.correo} · ${data.telefono}`;
  card.appendChild(contacto);

  const fecha = document.createElement("p");
  fecha.className = "solicitud-fecha";
  fecha.textContent = data.creadoEn ? data.creadoEn.toDate().toLocaleString("es-EC") : "";
  card.appendChild(fecha);

  const actions = document.createElement("div");
  actions.className = "solicitud-actions";

  const whatsappLink = document.createElement("a");
  whatsappLink.className = "btn btn-whatsapp";
  whatsappLink.target = "_blank";
  whatsappLink.rel = "noopener noreferrer";
  whatsappLink.textContent = "Responder por WhatsApp";
  whatsappLink.href = whatsappHref(data);
  actions.appendChild(whatsappLink);

  const toggleButton = document.createElement("button");
  toggleButton.className = "btn btn-outline";
  toggleButton.type = "button";
  toggleButton.textContent = data.estado === "contactado" ? "Marcar pendiente" : "Marcar contactado";
  toggleButton.addEventListener("click", () => {
    const nuevoEstado = data.estado === "contactado" ? "pendiente" : "contactado";
    updateDoc(doc(db, "solicitudes", id), { estado: nuevoEstado });
  });
  actions.appendChild(toggleButton);

  card.appendChild(actions);

  return card;
}

function subscribeSolicitudes() {
  const solicitudesQuery = query(collection(db, "solicitudes"), orderBy("creadoEn", "desc"));

  unsubscribeSolicitudes = onSnapshot(solicitudesQuery, (snapshot) => {
    solicitudesGrid.innerHTML = "";
    panelEmpty.classList.toggle("hidden", !snapshot.empty);

    snapshot.forEach((docSnap) => {
      solicitudesGrid.appendChild(createSolicitudCard(docSnap.id, docSnap.data()));
    });
  });
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "admin.html";
    return;
  }

  if (unsubscribeSolicitudes) {
    unsubscribeSolicitudes();
  }

  subscribeSolicitudes();
});
