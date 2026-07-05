// Layered parallax for the home hero.
// Each layer moves at a different rate of scroll -> depth illusion.
document.addEventListener("DOMContentLoaded", () => {
  const layers = [
    { el: document.querySelector("#layer-sky"),  rate: 0.15 },
    { el: document.querySelector("#layer-far"),  rate: 0.35 },
    { el: document.querySelector("#layer-near"), rate: 0.6  }
  ].filter(l => l.el);

  const hero = document.querySelector(".hero");
  if (!hero || !layers.length) return;

  let ticking = false;

  function update() {
    const scrollY = window.scrollY;
    const heroHeight = hero.offsetHeight;
    // Fade + translate while the hero is in view; stop once scrolled past.
    const progress = Math.min(scrollY / heroHeight, 1);

    layers.forEach(({ el, rate }) => {
      el.style.transform = `translate3d(0, ${scrollY * rate}px, 0)`;
    });

    const copy = document.querySelector(".hero-copy");
    if (copy) {
      copy.style.opacity = String(1 - progress * 1.2);
      copy.style.transform = `translate3d(0, ${progress * 40}px, 0)`;
    }
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  });

  // Subtle mouse-parallax on top of the scroll parallax, desktop only.
  if (window.matchMedia("(pointer:fine)").matches) {
    hero.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 12;
      layers.forEach(({ el, rate }, i) => {
        const depth = (i + 1) * 0.6;
        el.style.marginLeft = `${x * depth * 0.1}px`;
      });
    });
  }

  update();
});
