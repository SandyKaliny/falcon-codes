const DATA_URL = "data/services-details.json";

// Read the service id from the page URL query string
function getServiceId() {
  return new URLSearchParams(window.location.search).get("id");
}

// Load the service data and fill the page for a specific service
fetch(DATA_URL)
  // Convert the response into JavaScript data from JSON format.
  .then((res) => res.json())
  .then((data) => {
    // Get the service id from the URL, for example ?id=web-dev.
    const id = getServiceId();
    // Find the matching service in the JSON list.
    const service = (data.services || []).find((item) => item.id === id);
    // If the service is not found, stop here and show an error in the console.
    if (!service) {
      console.error("Service not found:", id);
      return;
    }

    document.querySelector("[data-bind='title']").textContent = service.title;
    document.querySelector("[data-bind='headline']").textContent =
      service.headline?.before + " " + service.headline?.accent;
    document.querySelector("[data-bind='description']").textContent =
      service.lede || service.description;
    document.querySelector("[data-bind='hero-image']").src = service.images?.[0] || "";
  })
  .catch((err) => console.error("Failed to load service data:", err));