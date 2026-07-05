// =========================================================
// MERIDIAN ESTATES — 3D walkthrough
// Plain Three.js (r128), no build step required.
// =========================================================
(function () {
  const canvas = document.querySelector("#tour-canvas");
  const veil = document.querySelector("#loading-veil");
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60, window.innerWidth / window.innerHeight, 0.1, 200
  );
  camera.position.set(0, 1.65, 6);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ---------- Room geometry ----------
  const ROOM_W = 24, ROOM_D = 16, WALL_H = 5;

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(ROOM_W, ROOM_D),
    new THREE.MeshStandardMaterial({ color: 0xD8CDBA, roughness: 0.9 })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  const wallMat = new THREE.MeshStandardMaterial({ color: 0xEDE8E0, roughness: 1 });
  function makeWall(w, h, x, y, z, rotY) {
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wallMat);
    wall.position.set(x, y, z);
    wall.rotation.y = rotY;
    scene.add(wall);
    return wall;
  }
  makeWall(ROOM_W, WALL_H, 0, WALL_H / 2, -ROOM_D / 2, 0);               // back
  makeWall(ROOM_D, WALL_H, -ROOM_W / 2, WALL_H / 2, 0, Math.PI / 2);     // left
  makeWall(ROOM_D, WALL_H, ROOM_W / 2, WALL_H / 2, 0, -Math.PI / 2);     // right

  // Windows on the back wall: glass planes that glow warm at night
  const windowMat = new THREE.MeshStandardMaterial({
    color: 0xBFE0EA, transparent: true, opacity: 0.55, emissive: 0x000000
  });
  const windows = [];
  [-8, 8].forEach(x => {
    const win = new THREE.Mesh(new THREE.PlaneGeometry(3, 2.4), windowMat.clone());
    win.position.set(x, 2.6, -ROOM_D / 2 + 0.02);
    scene.add(win);
    windows.push(win);
  });

  // Furniture blocks per zone (kept low-poly on purpose)
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x8C6B4A, roughness: 0.8 });
  const fabricMat = new THREE.MeshStandardMaterial({ color: 0x6E7A70, roughness: 1 });
  const bedMat = new THREE.MeshStandardMaterial({ color: 0xC9BEB0, roughness: 1 });

  function box(w, h, d, mat, x, y, z) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    scene.add(m);
    return m;
  }
  // Kitchen (left zone)
  box(4.5, 0.9, 0.8, woodMat, -7.5, 0.45, 3);
  box(1.2, 1.1, 1.2, woodMat, -5, 0.55, 3.4);
  // Living room (center)
  box(3.2, 0.7, 1.3, fabricMat, 0, 0.35, 2.5);
  box(1.2, 0.4, 0.8, woodMat, 0, 0.2, 5);
  // Bedroom nook (right zone)
  box(3.6, 0.6, 2.6, bedMat, 8, 0.3, 2.5);
  box(3.6, 0.9, 0.3, bedMat, 8, 0.6, 1.3);

  // ---------- Lighting (day/night driven) ----------
  const ambient = new THREE.AmbientLight(0xffffff, 0.65);
  scene.add(ambient);
  const sun = new THREE.DirectionalLight(0xfff2df, 1.0);
  sun.position.set(-10, 12, 8);
  scene.add(sun);

  const lamp1 = new THREE.PointLight(0xffb066, 0, 8);
  lamp1.position.set(-6, 2.6, 2);
  scene.add(lamp1);
  const lamp2 = new THREE.PointLight(0xffb066, 0, 8);
  lamp2.position.set(7, 2.6, 2);
  scene.add(lamp2);

  let isNight = false;
  function applyLighting() {
    if (isNight) {
      scene.background = new THREE.Color(0x0B211C);
      ambient.intensity = 0.18;
      ambient.color.set(0x1E4038);
      sun.intensity = 0.12;
      sun.color.set(0x224a63);
      lamp1.intensity = 1.1;
      lamp2.intensity = 1.1;
      windows.forEach(w => { w.material.emissive.set(0x0d1a22); w.material.opacity = 0.35; });
    } else {
      scene.background = new THREE.Color(0xEDE8E0);
      ambient.intensity = 0.65;
      ambient.color.set(0xffffff);
      sun.intensity = 1.0;
      sun.color.set(0xfff2df);
      lamp1.intensity = 0;
      lamp2.intensity = 0;
      windows.forEach(w => { w.material.emissive.set(0x000000); w.material.opacity = 0.55; });
    }
  }
  applyLighting();

  const toggle = document.querySelector("#daynight-toggle");
  const switchEl = document.querySelector("#daynight-switch");
  const label = document.querySelector("#daynight-label");
  function toggleDayNight() {
    isNight = !isNight;
    applyLighting();
    switchEl.classList.toggle("night", isNight);
    label.textContent = isNight ? "Night" : "Day";
  }
  toggle.addEventListener("click", toggleDayNight);
  toggle.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") toggleDayNight(); });

  // ---------- VR-style hotspots ----------
  function labelSprite(text) {
    const c = document.createElement("canvas");
    c.width = 256; c.height = 64;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "rgba(11,14,17,0.75)";
    ctx.roundRect ? ctx.roundRect(0, 8, 256, 48, 8) : ctx.fillRect(0, 8, 256, 48);
    ctx.fill();
    ctx.font = "600 26px Manrope, sans-serif";
    ctx.fillStyle = "#EDE8E0";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 128, 34);
    const tex = new THREE.CanvasTexture(c);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(2.2, 0.55, 1);
    return sprite;
  }

  const HOTSPOTS = [
    {
      name: "Kitchen", tag: "Zone 01",
      marker: new THREE.Vector3(-6, 0.05, 4.5),
      viewpoint: new THREE.Vector3(-6, 1.65, 6),
      lookAt: new THREE.Vector3(-7, 1.4, 2),
      desc: "Custom brass hardware and a book-matched stone island — ready for a crowd."
    },
    {
      name: "Living Room", tag: "Zone 02",
      marker: new THREE.Vector3(0, 0.05, 5.5),
      viewpoint: new THREE.Vector3(0, 1.65, 7),
      lookAt: new THREE.Vector3(0, 1.2, 0),
      desc: "Double-height glazing frames the garden; the sofa faces true north light."
    },
    {
      name: "Bedroom", tag: "Zone 03",
      marker: new THREE.Vector3(8, 0.05, 5.5),
      viewpoint: new THREE.Vector3(8, 1.65, 7),
      lookAt: new THREE.Vector3(8, 1.3, 1),
      desc: "A quiet nook tucked behind the living room, with morning light only."
    }
  ];

  const hotspotMeshes = [];
  HOTSPOTS.forEach(h => {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.35, 0.5, 32),
      new THREE.MeshBasicMaterial({ color: 0xA9834E, side: THREE.DoubleSide, transparent: true, opacity: 0.9 })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.copy(h.marker);
    ring.userData.hotspot = h;
    scene.add(ring);
    hotspotMeshes.push(ring);

    const tag = labelSprite(h.name);
    tag.position.set(h.marker.x, 1.9, h.marker.z);
    scene.add(tag);
  });

  // ---------- Camera flight ----------
  let flight = null; // {from, to, lookFrom, lookTo, t}
  function flyTo(hotspot) {
    flight = {
      from: camera.position.clone(),
      to: hotspot.viewpoint.clone(),
      lookFrom: currentLookTarget(),
      lookTo: hotspot.lookAt.clone(),
      t: 0
    };
    showHotspotCard(hotspot);
  }
  function currentLookTarget() {
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    return camera.position.clone().add(dir.multiplyScalar(5));
  }

  const card = document.querySelector("#hotspot-card");
  const cardTitle = document.querySelector("#hotspot-title");
  const cardDesc = document.querySelector("#hotspot-desc");
  const cardTag = document.querySelector("#hotspot-tag");
  document.querySelector("#hotspot-close").addEventListener("click", () => card.classList.remove("show"));

  function showHotspotCard(h) {
    cardTitle.textContent = h.name;
    cardDesc.textContent = h.desc;
    cardTag.textContent = h.tag;
    card.classList.add("show");
  }

  // ---------- Look + move controls (no pointer lock needed) ----------
  let yaw = -Math.PI / 2 + 0.001, pitch = 0;
  let dragging = false, lastX = 0, lastY = 0, moved = false;

  canvas.addEventListener("mousedown", e => {
    dragging = true; moved = false; lastX = e.clientX; lastY = e.clientY;
  });
  window.addEventListener("mouseup", e => {
    if (dragging && !moved) handleClick(e.clientX, e.clientY);
    dragging = false;
  });
  window.addEventListener("mousemove", e => {
    if (!dragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
    yaw -= dx * 0.0035;
    pitch -= dy * 0.0035;
    pitch = Math.max(-1.1, Math.min(1.1, pitch));
    lastX = e.clientX; lastY = e.clientY;
  });
  // touch support
  canvas.addEventListener("touchstart", e => {
    dragging = true; moved = false;
    lastX = e.touches[0].clientX; lastY = e.touches[0].clientY;
  }, { passive: true });
  canvas.addEventListener("touchmove", e => {
    if (!dragging) return;
    const dx = e.touches[0].clientX - lastX, dy = e.touches[0].clientY - lastY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
    yaw -= dx * 0.0035; pitch -= dy * 0.0035;
    pitch = Math.max(-1.1, Math.min(1.1, pitch));
    lastX = e.touches[0].clientX; lastY = e.touches[0].clientY;
  }, { passive: true });
  canvas.addEventListener("touchend", () => { dragging = false; });

  const raycaster = new THREE.Raycaster();
  function handleClick(clientX, clientY) {
    const mouse = new THREE.Vector2(
      (clientX / window.innerWidth) * 2 - 1,
      -(clientY / window.innerHeight) * 2 + 1
    );
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(hotspotMeshes);
    if (hits.length) flyTo(hits[0].object.userData.hotspot);
  }

  const keys = {};
  window.addEventListener("keydown", e => { keys[e.key.toLowerCase()] = true; });
  window.addEventListener("keyup", e => { keys[e.key.toLowerCase()] = false; });

  const MOVE_SPEED = 4.2; // units per second
  const clock = new THREE.Clock();

  function updateMovement(dt) {
    const forward = new THREE.Vector3(Math.cos(yaw), 0, Math.sin(yaw));
    const right = new THREE.Vector3(-forward.z, 0, forward.x);
    let move = new THREE.Vector3();
    if (keys["w"] || keys["arrowup"]) move.add(forward);
    if (keys["s"] || keys["arrowdown"]) move.sub(forward);
    if (keys["d"] || keys["arrowright"]) move.add(right);
    if (keys["a"] || keys["arrowleft"]) move.sub(right);
    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(MOVE_SPEED * dt);
      camera.position.add(move);
      camera.position.x = Math.max(-ROOM_W / 2 + 1, Math.min(ROOM_W / 2 - 1, camera.position.x));
      camera.position.z = Math.max(-ROOM_D / 2 + 1, Math.min(ROOM_D / 2 - 1, camera.position.z));
      flight = null; // manual movement cancels any auto-flight
    }
  }

  function updateCameraLook() {
    if (flight) return; // during flight, look is driven by the tween
    const dir = new THREE.Vector3(
      Math.cos(pitch) * Math.cos(yaw),
      Math.sin(pitch),
      Math.cos(pitch) * Math.sin(yaw)
    );
    camera.lookAt(camera.position.clone().add(dir));
  }

  function updateFlight(dt) {
    if (!flight) return;
    flight.t = Math.min(1, flight.t + dt / 1.1);
    const ease = flight.t < 0.5 ? 2 * flight.t * flight.t : 1 - Math.pow(-2 * flight.t + 2, 2) / 2;
    camera.position.lerpVectors(flight.from, flight.to, ease);
    const look = new THREE.Vector3().lerpVectors(flight.lookFrom, flight.lookTo, ease);
    camera.lookAt(look);
    if (flight.t >= 1) {
      // sync yaw/pitch to the resting look direction so drag-look continues smoothly
      const dir = look.clone().sub(camera.position).normalize();
      yaw = Math.atan2(dir.z, dir.x);
      pitch = Math.asin(dir.y);
      flight = null;
    }
  }

  // ---------- Render loop ----------
  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    updateMovement(dt);
    updateFlight(dt);
    updateCameraLook();
    hotspotMeshes.forEach(m => { m.rotation.z += dt * 0.4; });
    renderer.render(scene, camera);
  }
  animate();

  setTimeout(() => { veil.style.opacity = "0"; setTimeout(() => veil.style.display = "none", 500); }, 400);
})();
