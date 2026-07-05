// Populates the filter dropdowns from LISTINGS and re-renders the grid
// whenever a filter changes. All filtering happens client-side.
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector("#listings-grid");
  const countEl = document.querySelector("#results-count");
  const emptyState = document.querySelector("#empty-state");

  const locationSel = document.querySelector("#f-location");
  const typeSel = document.querySelector("#f-type");
  const bedsSel = document.querySelector("#f-beds");
  const priceSel = document.querySelector("#f-price");
  const resetBtn = document.querySelector("#reset-filters");

  // Build unique option lists from the data itself
  const locations = [...new Set(LISTINGS.map(l => l.location))].sort();
  const types = [...new Set(LISTINGS.map(l => l.type))].sort();
  locations.forEach(loc => {
    const o = document.createElement("option");
    o.value = loc; o.textContent = loc;
    locationSel.appendChild(o);
  });
  types.forEach(t => {
    const o = document.createElement("option");
    o.value = t; o.textContent = t;
    typeSel.appendChild(o);
  });

  function render() {
    const loc = locationSel.value;
    const type = typeSel.value;
    const minBeds = Number(bedsSel.value);
    const maxPrice = Number(priceSel.value);

    const filtered = LISTINGS.filter(item => {
      if (loc && item.location !== loc) return false;
      if (type && item.type !== type) return false;
      if (item.beds < minBeds) return false;
      if (maxPrice > 0 && item.price > maxPrice) return false;
      return true;
    });

    countEl.textContent = `${filtered.length} of ${LISTINGS.length} homes`;
    grid.innerHTML = "";
    emptyState.style.display = filtered.length ? "none" : "block";

    filtered.forEach(item => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <div class="card-media">${propertySVG(item.title.length)}</div>
        <div class="card-body">
          ${item.tag ? `<div class="card-tag" style="position:static;display:inline-block;margin-bottom:8px;">${item.tag}</div>` : ""}
          <div class="card-price mono">${formatPrice(item.price)}</div>
          <h3>${item.title}</h3>
          <p style="font-size:.9rem;">${item.blurb}</p>
          <div class="card-specs">
            <span>${item.beds} bd</span><span>${item.baths} ba</span><span>${item.sqft.toLocaleString()} sqft</span>
          </div>
          <div class="card-links">
            <a href="tour.html?id=${item.id}">3D Tour</a>
            <a href="floorplan.html?id=${item.id}">Floor Plan</a>
            <a href="inquiry.html?id=${item.id}">Inquire</a>
          </div>
        </div>`;
      grid.appendChild(card);
    });
  }

  [locationSel, typeSel, bedsSel, priceSel].forEach(sel =>
    sel.addEventListener("change", render)
  );
  resetBtn.addEventListener("click", () => {
    locationSel.value = ""; typeSel.value = ""; bedsSel.value = "0"; priceSel.value = "0";
    render();
  });

  render();
});
