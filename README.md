# Meridian-Estates-website
Meridian Estates is a trusted real estate company offering premium residential, commercial, and investment properties. We connect buyers, sellers, and investors with valuable opportunities through expert guidance, verified listings, and exceptional service, making every property journey smooth, secure, and successful.
# Meridian Estates

A static marketing website for a modern real estate experience. The project includes a home landing page, listings browser, 3D walkthrough, interactive floor plan, and inquiry form.

## Project structure

- `index.html` — homepage with hero section and primary navigation.
- `listings.html` — searchable listing cards with filters for location, type, bedrooms, and price.
- `tour.html` — interactive Three.js walkthrough experience.
- `floorplan.html` — rotating 3D floor plan viewer built with Three.js.
- `inquiry.html` — inquiry form for requesting a property tour.
- `style.css` — shared site styling.
- `nav.js` — shared navigation behavior (scroll background, mobile menu, current year).
- `data.js` — shared property data and utility functions used by the listings and inquiry pages.
- `listings.js` — client-side filtering and listing card rendering.
- `inquiry.js` — property dropdown population, query-string preselection, form validation, and submission simulation.
- `tour.js` — plain Three.js scene for the 3D tour, including day/night mode, hotspots, and camera controls.
- `floorplan.js` — plain Three.js rotating floor plan with room highlights and 2D/3D view toggle.

## Key features

- Responsive navigation with mobile menu toggle.
- Client-side listing filters.
- Shared property data in `data.js` for consistency across pages.
- 3D scene experiences using Three.js (no build tools required).
- Inquiry form with front-end validation and message feedback.

## How to run

### Option 1: Open directly

Open `index.html` in a browser.

### Option 2: Use a local server

For best results, serve the folder with a static web server.

Example (Python):

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`.


## Notes for development

- Add or update listings in `data.js`.
- Replace the simulated inquiry submission in `inquiry.js` with a real API call when ready.
- `tour.html` and `floorplan.html` load Three.js from the CDN at `https://unpkg.com/three@0.128.0/build/three.min.js`.

## Customization ideas

- Add real property images and video content.
- Connect the inquiry form to a back-end endpoint.
- Replace inlined SVG visuals with photos or richer renders.
- Improve accessibility and keyboard navigation.
