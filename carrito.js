import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
}
from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


// ================= FIREBASE =================

const firebaseConfig = {
  apiKey: "AIzaSyAlCunDxQE0WI2Wk2qKATwxzB8mf20Mlfg",
  authDomain: "ecuatours-d42ae.firebaseapp.com",
  projectId: "ecuatours-d42ae",
  storageBucket: "ecuatours-d42ae.firebasestorage.app",
  messagingSenderId: "336658956433",
  appId: "1:336658956433:web:b60cc6f1d2608704edff30"
};

const db = getFirestore(initializeApp(firebaseConfig));


// ================= CONFIGURACIÓN =================

const CART_KEY = "ecuatours_carrito";
const WHATSAPP = "593959509052";

const PRECIOS = {
  guia: 35,
  comida: 15,
  transporte: 25,
  merch: 20
};

const $ = id => document.getElementById(id);

const items = $("cart-items");
const empty = $("cart-empty");
const totalHTML = $("cart-total");
const form = $("checkout-form");
const mensaje = $("checkout-message");
const confirmar = $("checkout-btn");
const cancelar = $("cancel-order-btn");


// ================= CARRITO =================

const getCart = () =>
  JSON.parse(localStorage.getItem(CART_KEY)) || [];

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  render();
}

const money = n => `$${Number(n || 0).toFixed(2)}`;

function dias(valor) {
  return Number(String(valor || "1").match(/\d+/)?.[0] || 1);
}

function fechaBonita(fecha) {
  if (!fecha) return "Por seleccionar";

  return new Date(`${fecha}T12:00:00`)
    .toLocaleDateString("es-EC", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
}

function manana() {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + 1);

  return fecha.toISOString().split("T")[0];
}


// ================= CALCULAR =================

function calcular(item) {

  const personas = Math.max(1, Number(item.personas || 1));
  const duracion = dias(item.duracion);
  const base = Number(item.precioBase || 0) * personas;

  const guia =
    item.guia ? PRECIOS.guia * duracion : 0;

  const alimentacion =
    item.extras?.alimentacion
      ? PRECIOS.comida * personas * duracion
      : 0;

  const transporte =
    item.extras?.transporte
      ? PRECIOS.transporte * personas
      : 0;

  const merch =
    item.extras?.merch
      ? PRECIOS.merch * personas
      : 0;

  item.costos = {
    base,
    guia,
    alimentacion,
    transporte,
    merch
  };

  item.total =
    base + guia + alimentacion + transporte + merch;

  item.precio = item.total;

  return item;
}


// ================= ACTUALIZAR =================

function actualizar(index, campo, valor) {

  const cart = getCart();
  const item = cart[index];

  if (!item) return;

  item.extras ||= {};

  if (campo === "fecha")
    item.fecha = valor;

  if (campo === "personas")
    item.personas = Math.max(1, Number(valor));

  if (campo === "guia")
    item.guia = valor === "si";

  if (["alimentacion", "transporte", "merch"].includes(campo))
    item.extras[campo] = valor;

  calcular(item);

  saveCart(cart);
}


// ================= MOSTRAR CARRITO =================

function render() {

  const cart = getCart().map(calcular);

  localStorage.setItem(CART_KEY, JSON.stringify(cart));

  items.innerHTML = "";

  empty.classList.toggle("hidden", cart.length > 0);

  confirmar.disabled = cart.length === 0;
  cancelar.disabled = cart.length === 0;


  cart.forEach((item, index) => {

    items.innerHTML += `

      <article class="checkout-item-card">

        <div class="checkout-item-top">

          <div>
            <span class="checkout-type">
              ${item.tipo || "Paquete"}
            </span>

            <h3>${item.nombre}</h3>

            <p>${item.descripcion || ""}</p>
          </div>

          <button
            class="cart-remove"
            data-index="${index}">
            Quitar
          </button>

        </div>


        <div class="cart-edit-grid">

          <label class="cart-edit-field">
            <span>Fecha</span>

            <input
              class="cart-date"
              data-index="${index}"
              type="date"
              min="${manana()}"
              value="${item.fecha || ""}">
          </label>


          <label class="cart-edit-field">
            <span>Personas</span>

            <input
              class="cart-people"
              data-index="${index}"
              type="number"
              min="1"
              max="20"
              value="${item.personas || 1}">
          </label>


          <label class="cart-edit-field">
            <span>Duración</span>

            <input
              type="text"
              value="${item.duracion || "1 día"}"
              disabled>
          </label>


          <label class="cart-edit-field">
            <span>Guía</span>

            <select
              class="cart-guide"
              data-index="${index}">

              <option
                value="no"
                ${!item.guia ? "selected" : ""}>
                No
              </option>

              <option
                value="si"
                ${item.guia ? "selected" : ""}>
                Sí (+$${PRECIOS.guia}/día)
              </option>

            </select>

          </label>

        </div>


        <div class="cart-extra-box">

          <h4>Servicios adicionales</h4>

          <label>
            <input
              class="cart-extra"
              data-extra="alimentacion"
              data-index="${index}"
              type="checkbox"
              ${item.extras?.alimentacion ? "checked" : ""}>

            Alimentación
            (+$${PRECIOS.comida} persona/día)
          </label>


          <label>
            <input
              class="cart-extra"
              data-extra="transporte"
              data-index="${index}"
              type="checkbox"
              ${item.extras?.transporte ? "checked" : ""}>

            Transporte adicional
            (+$${PRECIOS.transporte} persona)
          </label>


          <label>
            <input
              class="cart-extra"
              data-extra="merch"
              data-index="${index}"
              type="checkbox"
              ${item.extras?.merch ? "checked" : ""}>

            Merch / recuerdo
            (+$${PRECIOS.merch} persona)
          </label>

        </div>


        <div class="item-itinerary">

          <h4>Resumen del viaje</h4>

          <div class="flash-itinerary">

            <p>
              📅 <strong>Fecha:</strong>
              ${fechaBonita(item.fecha)}
            </p>

            <p>
              👥 <strong>Personas:</strong>
              ${item.personas}
            </p>

            <p>
              🧭 <strong>Guía:</strong>
              ${item.guia ? "Sí" : "No"}
            </p>

            <p>
              🍽️ <strong>Alimentación:</strong>
              ${item.extras?.alimentacion ? "Sí" : "No"}
            </p>

            <p>
              🚐 <strong>Transporte:</strong>
              ${item.extras?.transporte ? "Sí" : "No"}
            </p>

            <p>
              🎁 <strong>Merch:</strong>
              ${item.extras?.merch ? "Sí" : "No"}
            </p>

          </div>


          <div class="item-cost-lines">

            <div>
              <span>Base</span>
              <strong>${money(item.costos.base)}</strong>
            </div>

            <div>
              <span>Guía</span>
              <strong>${money(item.costos.guia)}</strong>
            </div>

            <div>
              <span>Alimentación</span>
              <strong>${money(item.costos.alimentacion)}</strong>
            </div>

            <div>
              <span>Transporte</span>
              <strong>${money(item.costos.transporte)}</strong>
            </div>

            <div>
              <span>Merch</span>
              <strong>${money(item.costos.merch)}</strong>
            </div>

          </div>

        </div>


        <div class="item-total">
          <span>Total referencial</span>
          <strong>${money(item.total)}</strong>
        </div>

      </article>

    `;

  });


  eventos();
  totales(cart);
}


// ================= EVENTOS =================

function eventos() {

  document.querySelectorAll(".cart-date").forEach(input =>
    input.onchange = () =>
      actualizar(+input.dataset.index, "fecha", input.value)
  );


  document.querySelectorAll(".cart-people").forEach(input =>
    input.onchange = () =>
      actualizar(+input.dataset.index, "personas", input.value)
  );


  document.querySelectorAll(".cart-guide").forEach(select =>
    select.onchange = () =>
      actualizar(+select.dataset.index, "guia", select.value)
  );


  document.querySelectorAll(".cart-extra").forEach(check =>
    check.onchange = () =>
      actualizar(
        +check.dataset.index,
        check.dataset.extra,
        check.checked
      )
  );


  document.querySelectorAll(".cart-remove").forEach(btn => {

    btn.onclick = () => {

      const cart = getCart();

      cart.splice(+btn.dataset.index, 1);

      saveCart(cart);
    };

  });

}


// ================= TOTALES =================

function totales(cart) {

  const t = {
    base: 0,
    guia: 0,
    alimentacion: 0,
    transporte: 0,
    merch: 0,
    total: 0
  };


  cart.forEach(item => {

    Object.keys(t).forEach(k => {

      if (k === "total")
        t.total += item.total || 0;

      else
        t[k] += item.costos?.[k] || 0;

    });

  });


  $("sum-base").textContent = money(t.base);
  $("sum-guide").textContent = money(t.guia);
  $("sum-food").textContent = money(t.alimentacion);
  $("sum-transport").textContent = money(t.transporte);
  $("sum-merch").textContent = money(t.merch);

  totalHTML.textContent = money(t.total);
}


// ================= CANCELAR =================

cancelar.onclick = () => {

  if (!getCart().length) return;

  if (confirm("¿Deseas vaciar el carrito?")) {

    localStorage.removeItem(CART_KEY);

    location.href = "index.html#paquetes";
  }

};


// ================= CONFIRMAR =================

confirmar.onclick = async () => {

  mensaje.textContent = "";

  const cart = getCart().map(calcular);


  if (!cart.length) {
    mensaje.textContent = "El carrito está vacío.";
    return;
  }


  if (cart.some(item => !item.fecha)) {

    mensaje.textContent =
      "Selecciona una fecha para todos los paquetes.";

    return;
  }


  if (!form.checkValidity()) {

    mensaje.textContent =
      "Completa correctamente tus datos.";

    form.reportValidity();

    return;
  }


  const nombre = $("nombre").value.trim();
  const correo = $("correo").value.trim();
  const telefono = $("telefono").value.trim();
  const metodoPago = $("metodo-pago").value;

  const total =
    cart.reduce((s, item) => s + item.total, 0);


  confirmar.disabled = true;
  confirmar.textContent = "Guardando...";


  try {

    await addDoc(
      collection(db, "solicitudes"),
      {
        nombre,
        correo,
        telefono,
        metodoPago,

        interes:
          cart.map(i => i.nombre).join(", "),

        servicios: cart,
        total,
        estado: "pendiente",
        origen: "carrito",

        creadoEn:
          serverTimestamp()
      }
    );


    const detalle = cart.map((item, i) => `

${i + 1}. ${item.nombre}
Fecha: ${fechaBonita(item.fecha)}
Personas: ${item.personas}
Duración: ${item.duracion}
Guía: ${item.guia ? "Sí" : "No"}
Alimentación: ${item.extras?.alimentacion ? "Sí" : "No"}
Transporte: ${item.extras?.transporte ? "Sí" : "No"}
Merch: ${item.extras?.merch ? "Sí" : "No"}
Total: ${money(item.total)}

    `).join("\n");


    const texto = `
Hola EcuaTours.

Soy ${nombre}.

Quiero confirmar mi reserva:

${detalle}

Método de pago: ${metodoPago}

TOTAL: ${money(total)}

Teléfono: ${telefono}
Correo: ${correo}
    `;


    localStorage.removeItem(CART_KEY);


    location.href =
      `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;


  } catch (error) {

    console.error(error);

    mensaje.textContent =
      "No se pudo guardar la solicitud.";

    confirmar.disabled = false;

    confirmar.textContent =
      "Confirmar compra por WhatsApp";
  }

};


// ================= INICIO =================

render();