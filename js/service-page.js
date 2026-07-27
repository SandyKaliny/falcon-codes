/**
 * Simple service page loader for service-template.html.
 * Loads the service data from JSON and fills the page.
 */

const DATA_URL = "data/services-details.json";

// Read the service id from the URL query string, e.g. ?id=web-dev
function getServiceId() {
  return new URLSearchParams(window.location.search).get("id");
}

// Safely convert text to HTML-safe content before adding to the page
function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Set text content for every element matching the selector
function setText(selector, value) {
  document.querySelectorAll(selector).forEach((el) => {
    el.textContent = value || "";
  });
}

// Set image source and alt text for matching image elements
function setImg(selector, src, alt) {
  if (!src) return;
  document.querySelectorAll(selector).forEach((el) => {
    el.setAttribute("src", src);
    el.setAttribute("alt", alt || "");
  });
}

// Show the service headline with an accented word or phrase
function renderHeadline(service) {
  const el = document.querySelector('[data-bind="headline"]');
  if (!el) return;

  const before = service.headline?.before || "";
  const accent = service.headline?.accent || "";

  el.innerHTML = `${escapeHtml(before)}${accent ? ` <span>${escapeHtml(accent)}</span>` : ""}`;
}

// Build the feature cards section for the service page
function renderFeatures(service) {
  const grid = document.querySelector('[data-bind="features"]');
  if (!grid || !Array.isArray(service.features)) return;

  const icons = [
    "fa-solid fa-briefcase",
    "fa-solid fa-layer-group",
    "fa-solid fa-gears",
    "fa-solid fa-rocket",
  ];
  const tones = ["", "purple", "blue", "pink"];

  grid.innerHTML = service.features
    .map((item, index) => {
      const title = escapeHtml(item.title || "");
      const description = escapeHtml(item.description || "");
      const tone = item.tone ? ` ${escapeHtml(item.tone)}` : ` ${tones[index % tones.length]}`;
      const icon = item.icon || icons[index % icons.length];
      const iconHtml = item.iconType === "img"
        ? `<img src="${escapeHtml(icon)}" alt="${title}">`
        : `<i class="${escapeHtml(icon)}"></i>`;

      return `
        <div class="service-card">
          <div class="icon${tone}">
            ${iconHtml}
          </div>
          <h3>${title}</h3>
          <p>${description}</p>
        </div>`;
    })
    .join("");
}

// Build the process timeline section for the service page
function renderProcess(service) {
  const root = document.querySelector('[data-bind="process"]');
  if (!root || !Array.isArray(service.process)) return;

  root.innerHTML = `
    <div class="timeline-line"></div>
    ${service.process
      .map((step, index) => {
        const number = escapeHtml(step.number || String(index + 1).padStart(2, "0"));
        return `
          <div class="step${index === 0 ? " active" : ""}">
            <div class="circle">${number}</div>
            <h4>${escapeHtml(step.title || "")}</h4>
            <p>${escapeHtml(step.description || "")}</p>
          </div>`;
      })
      .join("")}
  `;
}

// Build the tools/technology list section for the service page
function renderTools(service) {
  const root = document.querySelector('[data-bind="tools"]');
  if (!root || !Array.isArray(service.tools)) return;

  root.innerHTML = service.tools
    .map((tool) => {
      const name = escapeHtml(tool.name || "");
      const image = escapeHtml(tool.image || "");
      const visual = image
        ? `<img src="${image}" alt="${name}">`
        : `<span class="tool-label">${name}</span>`;

      return `
      <div class="tech-item">
        ${visual}
      </div>`;
    })
    .join("");
}

// Show an error message when the requested service cannot be loaded
function showError(message) {
  setText('[data-bind="title"]', "Service not found");
  setText('[data-bind="description"]', message || "Unable to load this service.");
}

// Fill the page with the service data from JSON
function bindService(service) {
  setText('[data-bind="title"]', service.title);
  renderHeadline(service);
  // Show the full description on the service page; fall back to the short lede if description is missing
  setText('[data-bind="description"]', service.description || service.lede || "");
  setImg('[data-bind="hero-image"]', service.heroImage || service.images?.[0] || "images/ويب.png", service.title);

  setText('[data-bind="features-title"]', service.featuresSectionTitle || "What We Build");
  renderFeatures(service);

  setText('[data-bind="process-title"]', service.processSectionTitle || "Our Development Process");
  renderProcess(service);

  setText('[data-bind="tools-title"]', service.toolsSectionTitle || "Technologies We Use");
  renderTools(service);

  setText('[data-bind="slogan"]', service.slogan || "Ready To Build A Website That Works As Hard As You Do?");
  setText('[data-bind="cta-support"]', service.ctaSupport || "Let's build something amazing together.");
  setImg('[data-bind="cta-image"]', service.ctaImage || service.images?.[1] || service.images?.[0] || "images/Modern Solutions.png", service.title);
}

// Start the service page logic when the page is ready
function init() {
  const serviceId = getServiceId();
  if (!serviceId) {
    showError("...");
    return;
  }

  fetch(DATA_URL)
    .then((res) => res.json())
    .then((data) => {
      const services = data.services || [];
      const service = services.find((item) => item.id === serviceId);
      if (!service) {
        showError(`Service '${serviceId}' was not found.`);
        return;
      }
      bindService(service);
    })
    .catch((err) => {
      console.error("Failed to load service data:", err);
      showError("Unable to load service details.");
    });
}

document.addEventListener("DOMContentLoaded", init);

