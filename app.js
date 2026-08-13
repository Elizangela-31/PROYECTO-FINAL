const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

const CART_KEY = "ecuatours_carrito";


// ==========================================
// PAQUETES
// ==========================================

const paquetes = [
  {
    nombre: "Ruta volcanes y cascadas",
    categoria: "aventura",
    duracion: "3 días",
    precio: 180,
    mapa: "Cotopaxi, Ecuador",
    imagen: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1000&q=80",
    descripcion: "Transporte, guía, alojamiento y actividades al aire libre entre volcanes y cascadas."
  },
  {
    nombre: "Quito y ciudades patrimoniales",
    categoria: "cultura",
    duracion: "2 días",
    precio: 95,
    mapa: "Centro Histórico de Quito, Ecuador",
    imagen: "https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&w=1000&q=80",
    descripcion: "Historia, gastronomía, miradores y recorridos guiados por el centro histórico."
  },
  {
    nombre: "Costa y descanso frente al mar",
    categoria: "relax",
    duracion: "4 días",
    precio: 260,
    mapa: "Manta, Ecuador",
    imagen: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
    descripcion: "Hotel, traslados, alimentación y actividades suaves frente al mar."
  },
  {
    nombre: "Selva y kayak amazónico",
    categoria: "aventura",
    duracion: "3 días",
    precio: 210,
    mapa: "Tena, Ecuador",
    imagen: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=85",
    descripcion: "Navegación en kayak, caminatas guiadas y noches en lodge ecológico."
  },
  {
    nombre: "Cuenca colonial y artesanías",
    categoria: "cultura",
    duracion: "2 días",
    precio: 110,
    mapa: "Cuenca, Ecuador",
    imagen: "https://www.galakiwi.com/blog/wp-content/uploads/2025/10/pexels-davegarcia-30785381-scaled.jpg",
    descripcion: "Arquitectura republicana, talleres de artesanos y mercados tradicionales."
  },
  {
    nombre: "Galápagos costa y snorkel",
    categoria: "relax",
    duracion: "5 días",
    precio: 650,
    mapa: "Puerto Ayora, Galápagos, Ecuador",
    imagen: "https://artralux.co.th/wp-content/uploads/2022/04/cover-%E0%B8%AB%E0%B8%A1%E0%B8%B9%E0%B9%88%E0%B9%80%E0%B8%81%E0%B8%B2%E0%B8%B0-%E0%B8%81%E0%B8%B2%E0%B8%A5%E0%B8%B2%E0%B8%9B%E0%B8%B2%E0%B8%81%E0%B8%AD%E0%B8%AA-1-768x384.jpg",
    descripcion: "Playas volcánicas, snorkel y navegación entre islas a ritmo tranquilo."
  },
  {
    nombre: "Refugio de Vida Silvestre Pasochoa",
    categoria: "aventura",
    duracion: "1 día",
    precio: 45,
    mapa: "Refugio de Vida Silvestre Pasochoa, Ecuador",
    imagen: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=80",
    descripcion: "Caminata guiada por bosque andino con avistamiento de aves."
  },
  {
    nombre: "Rutas en cuadrón",
    categoria: "aventura",
    duracion: "1 día",
    precio: 20,
    mapa: "Rumipamba, Rumiñahui, Ecuador",
    imagen: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80",
    descripcion: "Recorrido en cuadrón por senderos rurales y miradores de Rumipamba."
  },
  {
    nombre: "Truchas y turismo rural en Rumipamba",
    categoria: "relax",
    duracion: "1 día",
    precio: 35,
    mapa: "Rumipamba, Rumiñahui, Ecuador",
    imagen: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80",
    descripcion: "Visita a criaderos de truchas, cabalgatas y paisajes andinos."
  }
];


// ==========================================
// DESTINOS
// ==========================================

const destinos = {
  costa: {
    titulo: "Costa",
    texto: "Playas, manglares, surf, gastronomía marina y descanso frente al mar.",
    lugares: ["Manta", "Salinas", "Montañita", "Puerto López"]
  },
  galapagos: {
    titulo: "Galápagos",
    texto: "Fauna única, playas volcánicas, snorkel y navegación entre islas.",
    lugares: ["Santa Cruz", "Isabela", "San Cristóbal", "Bartolomé"]
  },
  sierra: {
    titulo: "Sierra",
    texto: "Volcanes, lagunas, mercados andinos y ciudades históricas.",
    lugares: ["Quito", "Cotopaxi", "Quilotoa", "Cuenca", "Baños"]
  },
  amazonia: {
    titulo: "Amazonía",
    texto: "Ríos, selva, comunidades locales y naturaleza.",
    lugares: ["Tena", "Puyo", "Misahuallí", "Yasuní"]
  }
};


// ==========================================
// CARRITO
// ==========================================

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function updateCartCount() {
  const contador = $("#cart-count");
  if (contador) contador.textContent = getCart().length;
}

function addToCart(paquete) {
  const carrito = getCart();

  if (carrito.some(p => p.nombre === paquete.nombre)) {
    alert(`"${paquete.nombre}" ya está en el carrito.`);
    return;
  }

  carrito.push({
    id: Date.now(),
    nombre: paquete.nombre,
    descripcion: paquete.descripcion,
    tipo: "Paquete",
    precioBase: paquete.precio,
    duracion: paquete.duracion,
    fecha: "",
    personas: 1,
    guia: false,
    extras: {
      alimentacion: false,
      transporte: false,
      merch: false
    },
    costos: {
      base: paquete.precio,
      guia: 0,
      alimentacion: 0,
      transporte: 0,
      merch: 0
    },
    precio: paquete.precio,
    total: paquete.precio
  });

  localStorage.setItem(CART_KEY, JSON.stringify(carrito));
  updateCartCount();

  alert(`"${paquete.nombre}" agregado al carrito 🛒`);
}


// ==========================================
// CREAR PAQUETES
// ==========================================

function showPackages(lista = paquetes) {
  const grid = $("#package-grid");
  if (!grid) return;

  grid.innerHTML = lista.map((p, i) => `
    <article class="package-card"
      data-category="${p.categoria}"
      data-name="${p.nombre}">

      <div class="package-media">
        <img src="${p.imagen}" alt="${p.nombre}">
        <span class="badge badge-duration">${p.duracion}</span>
        <span class="badge badge-category badge-${p.categoria}">
          ${p.categoria}
        </span>
      </div>

      <div class="package-body">
        <h3>${p.nombre}</h3>
        <p>${p.descripcion}</p>

        <div class="package-footer">
          <div class="price">
            <span class="price-label">Desde</span>
            <strong>$${p.precio}</strong>
          </div>

          <div class="package-actions">
            <button class="btn btn-outline info-btn" data-id="${i}">
              Ver más
            </button>

            <button class="btn btn-primary reserve-btn" data-id="${i}">
              Reservar
            </button>
          </div>
        </div>
      </div>

    </article>
  `).join("");

  $(".package-empty")?.classList.toggle("hidden", lista.length > 0);
}


// ==========================================
// FILTRAR Y BUSCAR
// ==========================================

let categoria = "todos";

function filterPackages() {
  const texto = ($("#package-search")?.value || "").toLowerCase();

  const filtrados = paquetes.filter(p =>
    (categoria === "todos" || p.categoria === categoria) &&
    p.nombre.toLowerCase().includes(texto)
  );

  showPackages(filtrados);
}

$$(".filter-btn").forEach(btn => {
  btn.onclick = () => {
    categoria = btn.dataset.filter;

    $$(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    filterPackages();
  };
});

$("#package-search")?.addEventListener("input", filterPackages);


// ==========================================
// BOTONES DE PAQUETES
// ==========================================

$("#package-grid")?.addEventListener("click", e => {

  const reservar = e.target.closest(".reserve-btn");
  const info = e.target.closest(".info-btn");

  if (reservar) {
    addToCart(paquetes[Number(reservar.dataset.id)]);
  }

  if (info) {
    const paquete = paquetes[Number(info.dataset.id)];

    window.location.href =
      `Registro.html?interes=${encodeURIComponent(paquete.nombre)}`;
  }

});


// ==========================================
// DESTINOS
// ==========================================

$$(".destination-btn").forEach(btn => {
  btn.onclick = () => {

    const d = destinos[btn.dataset.destination];
    if (!d) return;

    $("#modal-title").textContent = d.titulo;
    $("#modal-text").textContent = d.texto;

    $("#modal-places").innerHTML =
      d.lugares.map(l => `<li>${l}</li>`).join("");

    $("#modal").classList.remove("hidden");
  };
});

function closeModal() {
  $("#modal")?.classList.add("hidden");
}

$(".modal-close")?.addEventListener("click", closeModal);

$("#modal")?.addEventListener("click", e => {
  if (e.target.id === "modal") closeModal();
});


// ==========================================
// MENÚ
// ==========================================

$(".menu-toggle")?.addEventListener("click", () => {
  $(".nav-links")?.classList.toggle("open");
});

$$(".nav-link").forEach(link => {
  link.onclick = () => {
    $(".nav-links")?.classList.remove("open");

    $$(".nav-link").forEach(l => l.classList.remove("active"));
    link.classList.add("active");
  };
});


// ==========================================
// ESC
// ==========================================

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModal();
});


// ==========================================
// INICIO
// ==========================================

showPackages();
updateCartCount();