/**
 * Simple services list renderer for services.html.
 * Loads the JSON file and fills the service cards on the page.
 */

const DATA_URL = "data/services-details.json";

// Turn text into safe HTML text before adding to the page
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Create the link to the service template page with the right id
function getServiceLink(service) {
  return `service-template.html?id=${encodeURIComponent(service.id)}`;
}

// Build the HTML for a single service card on the services page
function cardHtml(service) {
  const href = getServiceLink(service);
  const title = service.title || "Service";
  const description = service.lede || service.description || "";
  const image = service.cardImage || service.heroImage || (service.images && service.images[0]) || "images/services.svg";

  return `
    <div class="service-card">
      <div class="service-image">
        <img src="${escapeHtml(image)}" alt="${escapeHtml(title)}">
      </div>
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(description)}</p>
      <a href="${escapeHtml(href)}" class="service-link">
        Learn More
        <span>→</span>
      </a>
    </div>`;
}

// Observe service card visibility and add animation classes when they appear
function observeCards(root) {
  const cards = root.querySelectorAll(".service-card");
  if (!("IntersectionObserver" in window)) {
    cards.forEach((card) => card.classList.add("show"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const card = entry.target;
        const delay = Number(card.dataset.delay || 0);
        setTimeout(() => card.classList.add("show"), delay);
        observer.unobserve(card);
      });
    },
    { threshold: 0.15 }
  );

  cards.forEach((card, index) => {
    card.dataset.delay = String((index % 4) * 120);
    observer.observe(card);
  });
}

// Load the services list from the JSON file
function loadServices() {
  return fetch(DATA_URL)
    .then((res) => res.json())
    .then((data) => data.services || []);
}

// Render the services page by loading data and inserting cards
function renderServices() {
  const grid = document.querySelector(".services-grid");
  if (!grid) return;

  loadServices()
    .then((services) => {
      grid.innerHTML = services.map(cardHtml).join("");
      observeCards(grid);
    })
    .catch((err) => {
      console.error("Failed to load services:", err);
    });
}

document.addEventListener("DOMContentLoaded", renderServices);

