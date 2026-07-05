/* =========================================================
   MERIDIAN ESTATES — shared property data
   In a real build this would come from an API / CMS.
   ========================================================= */
const LISTINGS = [
  {
    id: "azure-ridge",
    title: "Azure Ridge Residence",
    price: 4250000,
    location: "Hillcrest",
    type: "Villa",
    beds: 5,
    baths: 6,
    sqft: 6200,
    tag: "New",
    blurb: "A cliffside villa wrapped in glass, with a cantilevered pool over the valley."
  },
  {
    id: "linden-court",
    title: "Linden Court",
    price: 2180000,
    location: "Old Town",
    type: "Townhouse",
    beds: 4,
    baths: 3,
    sqft: 3400,
    tag: "Popular",
    blurb: "A restored 1920s townhouse with brass fixtures and a private courtyard."
  },
  {
    id: "harbor-loft",
    title: "Harbor Loft No. 9",
    price: 1490000,
    location: "Marina District",
    type: "Loft",
    beds: 2,
    baths: 2,
    sqft: 1950,
    tag: "New",
    blurb: "Industrial-glass loft with double-height ceilings looking over the harbor."
  },
  {
    id: "meridian-estate",
    title: "The Meridian Estate",
    price: 6890000,
    location: "Hillcrest",
    type: "Estate",
    beds: 7,
    baths: 8,
    sqft: 9800,
    tag: "Signature",
    blurb: "Our flagship listing — a modernist estate with a private screening room and vineyard."
  },
  {
    id: "birchwood-house",
    title: "Birchwood House",
    price: 1875000,
    location: "Northgate",
    type: "House",
    beds: 4,
    baths: 3,
    sqft: 2900,
    tag: "",
    blurb: "A quiet timber-framed family house bordered by century-old birch trees."
  },
  {
    id: "canal-house",
    title: "Canal House 12",
    price: 2650000,
    location: "Old Town",
    type: "Townhouse",
    beds: 3,
    baths: 3,
    sqft: 2600,
    tag: "",
    blurb: "Waterside townhouse with a private mooring and a rooftop terrace."
  }
];

function formatPrice(n){
  return "$" + n.toLocaleString("en-US");
}

// Simple deterministic SVG "elevation sketch" per property so every
// card/tour references the same brass line-drawing motif without images.
function propertySVG(seed, opts){
  opts = opts || {};
  const stroke = opts.stroke || "#A9834E";
  const bg = opts.bg || "#EDE8E0";
  const h = 12 + (seed % 5) * 6;
  return `
  <svg viewBox="0 0 220 160" xmlns="http://www.w3.org/2000/svg">
    <rect width="220" height="160" fill="${bg}"/>
    <polyline points="20,120 20,${60-h} 70,${30-h} 120,${60-h} 120,120"
      fill="none" stroke="${stroke}" stroke-width="1.4"/>
    <line x1="10" y1="120" x2="200" y2="120" stroke="${stroke}" stroke-width="1.4"/>
    <rect x="35" y="80" width="18" height="26" fill="none" stroke="${stroke}" stroke-width="1"/>
    <rect x="90" y="80" width="18" height="26" fill="none" stroke="${stroke}" stroke-width="1"/>
    <circle cx="170" cy="60" r="14" fill="none" stroke="${stroke}" stroke-width="1"/>
  </svg>`;
}
