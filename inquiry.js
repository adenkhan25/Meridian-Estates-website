// Populates the property dropdown from LISTINGS, pre-selects the
// property if the page was reached via ?id=..., and simulates a
// form submission (no backend wired up — swap the TODO for a real
// fetch() call to your API when you have one).
document.addEventListener("DOMContentLoaded", () => {
  const propertySel = document.querySelector("#property");
  const form = document.querySelector("#inquiry-form");
  const status = document.querySelector("#form-status");

  LISTINGS.forEach(item => {
    const o = document.createElement("option");
    o.value = item.id;
    o.textContent = `${item.title} — ${formatPrice(item.price)}`;
    propertySel.appendChild(o);
  });

  const params = new URLSearchParams(window.location.search);
  const preselect = params.get("id");
  if (preselect) propertySel.value = preselect;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const property = propertySel.value;

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !emailOk || !property) {
      status.className = "form-status error";
      status.textContent = "Please add your name, a valid email, and choose a property before sending.";
      return;
    }

    // TODO: replace with a real request, e.g.
    // await fetch("/api/inquiries", { method: "POST", body: JSON.stringify({...}) });

    status.className = "form-status ok";
    status.textContent = `Thanks, ${name} — we've received your inquiry and an agent will reach out shortly.`;
    form.reset();
  });
});
