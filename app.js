const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-link");
const filterButtons = document.querySelectorAll(".filter-btn");
const packageCards = document.querySelectorAll(".package-card");
const packageSearch = document.getElementById("package-search");
const packageEmpty = document.getElementById("package-empty");
const destinationButtons = document.querySelectorAll(".destination-btn");
const packageButtons = document.querySelectorAll(".package-btn");
const packageInfoButtons = document.querySelectorAll(".package-info-btn");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalText = document.getElementById("modal-text");
const modalClose = document.querySelector("#modal .modal-close");
const modalInfoButton = document.querySelector(".modal-info-btn");
let activeDestination = null;

const AGENCY_WHATSAPP = "593959509052";

const packageModal = document.getElementById("package-modal");
const packageModalTitle = document.getElementById("package-modal-title");
const packageModalDuration = document.getElementById("package-modal-duration");
const packageModalPrice = document.getElementById("package-modal-price");
const packageModalDesc = document.getElementById("package-modal-desc");
const packageModalIframe = document.getElementById("package-modal-iframe");
const packageModalWhatsapp = document.getElementById("package-modal-whatsapp");
const packageModalCloseButtons = document.querySelectorAll(".package-modal-close");
 
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
 
let activeFilter = "todos";

function applyPackageFilters() {
  const query = packageSearch.value.trim().toLowerCase();
  let visibleCount = 0;

  packageCards.forEach((card) => {
    const matchesCategory = activeFilter === "todos" || card.dataset.category === activeFilter;
    const matchesQuery = !query || card.dataset.name.toLowerCase().includes(query);
    const shouldShow = matchesCategory && matchesQuery;

    card.classList.toggle("hidden", !shouldShow);
    if (shouldShow) {
      visibleCount += 1;
    }
  });

  packageEmpty.classList.toggle("hidden", visibleCount > 0);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    applyPackageFilters();
  });
});

packageSearch.addEventListener("input", applyPackageFilters);
 
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
    modalInfoButton.href = `Registro.html?interes=${encodeURIComponent(detail.interest)}`;
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
  });
});
 
packageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const interes = encodeURIComponent(button.dataset.package);
    window.location.href = `Registro.html?interes=${interes}`;
  });
});

function openPackageModal(card) {
  const name = card.dataset.name;
  const duration = card.querySelector(".badge-duration").textContent;
  const price = card.querySelector(".price strong").textContent;
  const description = card.querySelector(".package-body p").textContent;
  const location = card.dataset.map;

  packageModalTitle.textContent = name;
  packageModalDuration.textContent = duration;
  packageModalPrice.textContent = price;
  packageModalDesc.textContent = description;
  packageModalIframe.src = `https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`;

  const mensaje = `Hola, quiero información sobre el paquete "${name}".`;
  packageModalWhatsapp.href = `https://wa.me/${AGENCY_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;

  packageModal.classList.remove("hidden");
  packageModal.setAttribute("aria-hidden", "false");
}

function closePackageModal() {
  packageModal.classList.add("hidden");
  packageModal.setAttribute("aria-hidden", "true");
  packageModalIframe.src = "";
}

packageInfoButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".package-card");
    openPackageModal(card);
  });
});

packageModalCloseButtons.forEach((button) => {
  button.addEventListener("click", closePackageModal);
});

packageModal.addEventListener("click", (event) => {
  if (event.target === packageModal) {
    closePackageModal();
  }
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

modalInfoButton.addEventListener("click", closeModal);

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }

  if (!modal.classList.contains("hidden")) {
    closeModal();
  }

  if (!packageModal.classList.contains("hidden")) {
    closePackageModal();
  }
});
 