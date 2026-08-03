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
  if (event.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});
 