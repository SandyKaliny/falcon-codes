/**
 * Service detail page loader for service-template.html.
 * Loads data/services-details.json and fills hero, features, process, tools,
 * related services, and other services from the mapped JSON fields.
 */

const DATA_URL = "data/services-details.json";

function getServiceId() {
  return new URLSearchParams(window.location.search).get("id");
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function setText(selector, value) {
  document.querySelectorAll(selector).forEach((el) => {
    el.textContent = value || "";
  });
}

function setImg(selector, src, alt) {
  if (!src) return;
  document.querySelectorAll(selector).forEach((el) => {
    el.setAttribute("src", src);
    el.setAttribute("alt", alt || "");
  });
}

function getServiceLink(service) {
  return `service-template.html?id=${encodeURIComponent(service.id)}`;
}

function renderHeadline(service) {
  const el = document.querySelector('[data-bind="headline"]');
  if (!el) return;

  const before = service.headline?.before || "";
  const accent = service.headline?.accent || "";

  el.innerHTML = `${escapeHtml(before)}${accent ? ` <span>${escapeHtml(accent)}</span>` : ""}`;
}

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
      const useImageIcon =
        item.iconType === "img" || /\.(png|jpe?g|svg|webp|gif)$/i.test(icon);
      const iconHtml = useImageIcon
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

/** Allowed grid layout classes driven by JSON `toolsGridClass` */
const TOOLS_GRID_CLASSES = new Set(["tech-grid", "tech-grid1"]);

function applyToolsGridClass(root, service) {
  const requested = String(service.toolsGridClass || "tech-grid").trim();
  const gridClass = TOOLS_GRID_CLASSES.has(requested) ? requested : "tech-grid";

  // Keep data-bind; swap layout class from JSON
  root.classList.remove("tech-grid", "tech-grid1");
  root.classList.add(gridClass);

  const cols = Number(service.toolsGridColumns);
  if (Number.isFinite(cols) && cols > 0) {
    root.style.setProperty("--tools-cols", String(Math.min(Math.max(cols, 2), 6)));
  } else {
    root.style.removeProperty("--tools-cols");
  }

  root.dataset.toolsGrid = gridClass;
}

function getToolValue(tool, keys) {
  if (!tool || typeof tool !== "object") return "";

  for (const key of keys) {
    const value = tool[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function normalizeTool(tool) {
  return {
    name: getToolValue(tool, ["name", "title", "label"]),
    description: getToolValue(tool, ["desc", "description", "details", "summary"]),
    image: getToolValue(tool, ["img", "image", "icon", "src"]),
  };
}

function renderTools(service) {
  const root = document.querySelector('[data-bind="tools"]');
  if (!root || !Array.isArray(service.tools)) return;

  applyToolsGridClass(root, service);

  const itemClass = root.classList.contains("tech-grid1") ? "tech-item1" : "tech-item";
  const serviceClassName = typeof service.id === "string" && service.id.trim() ? service.id.trim() : "";
  const wrapperClass = serviceClassName ? `${itemClass} ${serviceClassName}` : itemClass;

  root.innerHTML = service.tools
    .map((tool) => {
      const toolData = normalizeTool(tool);
      const name = escapeHtml(toolData.name || "");
      const description = escapeHtml(toolData.description || "");
      const image = escapeHtml(toolData.image || "");
      const altText = escapeHtml(toolData.name || toolData.description || "Tool");
      const visual = image
        ? `<img src="${image}" alt="${altText}">`
        : toolData.name
          ? `<span class="tool-label">${name}</span>`
          : toolData.description
            ? `<span class="tool-label">${description}</span>`
            : "";
      const titleHtml = toolData.name ? `<h3>${name}</h3>` : "";
      const descriptionHtml = toolData.description ? `<p class="tool-desc">${description}</p>` : "";

      if (itemClass === "tech-item1") {
        return `
      <div class="${wrapperClass}">
        ${visual}
        ${titleHtml}
        ${descriptionHtml}
      </div>`;
      }

      return `
      <div class="${wrapperClass}">
        ${visual}
        ${toolData.name && !toolData.image ? `<span class="tool-label">${name}</span>` : ""}
        ${toolData.description && !toolData.image ? descriptionHtml : ""}
        ${toolData.name && toolData.image ? `<span class="tool-label">${name}</span>` : ""}
        ${toolData.description && toolData.image ? descriptionHtml : ""}
      </div>`;
    })
    .join("");
}

/** Build a compact related / other service card */
function moreCardHtml(service) {
  const href = getServiceLink(service);
  const title = escapeHtml(service.title || "Service");
  const description = escapeHtml(service.lede || service.description || "");
  const image = escapeHtml(
    service.cardImage ||
      service.heroImage ||
      (service.images && service.images[0]) ||
      "images/Modern Solutions.png"
  );

  return `
    <a class="svc-more-card" href="${escapeHtml(href)}">
      <div class="svc-more-card-media">
        <img src="${image}" alt="${title}" loading="lazy">
      </div>
      <div class="svc-more-card-body">
        <h3>${title}</h3>
        <p>${description}</p>
        <span class="svc-more-card-link">Learn more <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span>
      </div>
    </a>`;
}

/**
 * Resolve id list from the current service against the full catalog.
 * relatedServices / otherServices are id arrays mapped in the JSON.
 */
function resolveByIds(allServices, ids) {
  if (!Array.isArray(ids) || !ids.length) return [];
  const byId = new Map(allServices.map((s) => [s.id, s]));
  return ids.map((id) => byId.get(id)).filter(Boolean);
}

/** Show a couple of items per pane (related / others) */
const MORE_LIMIT = 2;

function renderMoreList(selector, services) {
  const root = document.querySelector(selector);
  if (!root) return;

  const pane = root.closest(".svc-more-pane");
  const couple = services.slice(0, MORE_LIMIT);

  if (!couple.length) {
    if (pane) pane.hidden = true;
    root.innerHTML = "";
    return;
  }

  if (pane) pane.hidden = false;
  root.innerHTML = couple.map(moreCardHtml).join("");
}

function showError(message) {
  setText('[data-bind="title"]', "Service not found");
  setText('[data-bind="description"]', message || "Unable to load this service.");
  document.body.classList.remove("is-loading");
}

function applyServiceSectionVisibility(service) {
  const isCostAccounting = service.id === "cost-accounting";
  const isPaidAds = service.id === "paid-ads";
  const isSeo = service.id === "seo";
  const isEcommerce = service.id === "ecommerce";
  const isUiux = service.id === "ui-ux";
  document.body.classList.toggle("is-cost-accounting", isCostAccounting);
  
  const pageService = document.querySelector('.page-service');
  if (pageService) {
    pageService.classList.toggle("is-cost-accounting", isCostAccounting);
    pageService.classList.toggle("is-paid-ads", isPaidAds);
    pageService.classList.toggle("is-seo", isSeo);
    pageService.classList.toggle("is-ecommerce", isEcommerce);
    pageService.classList.toggle("is-uiux", isUiux);
  }

  const techSection = document.querySelector('.technologies');
  if (techSection) {
    techSection.hidden = isCostAccounting;
  }

  const moreSection = document.querySelector('.svc-more');
  if (moreSection) {
    moreSection.hidden = true;
  }
}

function bindService(service, allServices) {
  document.title = `${service.title || "Service"} | Falcon Codes`;

  applyServiceSectionVisibility(service);

  setText('[data-bind="title"]', service.title);
  renderHeadline(service);
  setText('[data-bind="description"]', service.description || service.lede || "");
  setImg(
    '[data-bind="hero-image"]',
    service.heroImage || service.images?.[0] || service.cardImage || "images/Modern Solutions.png",
    service.title
  );

  setText('[data-bind="features-title"]', service.featuresSectionTitle || "What We Build");
  renderFeatures(service);

  setText('[data-bind="process-title"]', service.processSectionTitle || "Our Development Process");
  renderProcess(service);

  setText('[data-bind="tools-title"]', service.toolsSectionTitle || "Technologies We Use");
  const techSection = document.querySelector('.technologies');
  if (techSection) {
    techSection.classList.remove('cashflow');
    if (service.id === 'cashflow') {
      techSection.classList.add('cashflow');
    }
  }
  renderTools(service);

  setText('[data-bind="related-title"]', service.relatedSectionTitle || "Related Services");
  setText('[data-bind="other-title"]', service.otherSectionTitle || "Other Services");
  renderMoreList('[data-bind="related"]', resolveByIds(allServices, service.relatedServices));
  renderMoreList('[data-bind="others"]', resolveByIds(allServices, service.otherServices));

  setText(
    '[data-bind="slogan"]',
    service.slogan || "Ready To Build A Website That Works As Hard As You Do?"
  );
  setText(
    '[data-bind="cta-support"]',
    service.ctaSupport || "Let's build something amazing together."
  );

  document.body.classList.remove("is-loading");
}

function init() {
  const serviceId = getServiceId();
  if (!serviceId) {
    showError("Missing service id. Open this page as service-template.html?id=web-dev");
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
      bindService(service, services);
    })
    .catch((err) => {
      console.error("Failed to load service data:", err);
      showError("Unable to load service details.");
    });
}

document.addEventListener("DOMContentLoaded", init);
