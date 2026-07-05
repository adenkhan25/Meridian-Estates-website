// =========================================================
// MERIDIAN ESTATES — rotating 3D floor plan
// Plain Three.js (r128), custom turntable controls (no
// OrbitControls dependency needed).
// =========================================================
(function () {
  const canvasArea = document.querySelector(".plan-canvas-area");
  const canvas = document.querySelector("#plan-canvas");
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xF6F3EC);

  const camera = new THREE.PerspectiveCamera(
    45, canvasArea.clientWidth / canvasArea.clientHeight, 0.1, 200
  );
  let camDistance = 24;
  let camTilt = 0.85; // radians above horizontal

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvasArea.clientWidth, canvasArea.clientHeight);

  function resize() {
    const w = canvasArea.clientWidth, h = canvasArea.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener("resize", resize);

  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const sun = new THREE.DirectionalLight(0xffffff, 0.6);
  sun.position.set(8, 20, 10);
  scene.add(sun);

  // ---------- Rooms ----------
  // Each room is an outlined footprint (low wall) + tinted floor,
  // laid out on a shared grid so the whole thing reads as one plan.
  const ROOMS = [
    { name: "Entry",       tag: "01", color: 0xEDE8E0, x: 0,   z: -6,  w: 5,  d: 3.4 },
    { name: "Kitchen",     tag: "02", color: 0xE6D9C3, x: -6,  z: -1,  w: 6,  d: 6   },
    { name: "Living Room", tag: "03", color: 0xD9E0DA, x: 1.5, z: -1,  w: 7,  d: 6   },
    { name: "Bathroom",    tag: "04", color: 0xD7E3E7, x: 7.5, z: -3.2,w: 3.4,d: 3.6 },
    { name: "Bedroom",     tag: "05", color: 0xE3D6D9, x: 7.5, z: 2.4, w: 6,  d: 5.6 }
  ];

  const planGroup = new THREE.Group();
  scene.add(planGroup);
  const roomMeshes = {};

  ROOMS.forEach(r => {
    const floorMat = new THREE.MeshStandardMaterial({ color: r.color, roughness: 1 });
    const floorMesh = new THREE.Mesh(new THREE.BoxGeometry(r.w, 0.2, r.d), floorMat);
    floorMesh.position.set(r.x, 0.1, r.z);
    planGroup.add(floorMesh);

    const wallMat = new THREE.MeshStandardMaterial({ color: 0xA9834E, roughness: 0.6 });
    const wallHeight = 1.6;
    const wallThickness = 0.12;
    const edges = [
      { w: r.w, d: wallThickness, x: r.x, z: r.z - r.d / 2 },
      { w: r.w, d: wallThickness, x: r.x, z: r.z + r.d / 2 },
      { w: wallThickness, d: r.d, x: r.x - r.w / 2, z: r.z },
      { w: wallThickness, d: r.d, x: r.x + r.w / 2, z: r.z }
    ];
    const wallGroup = new THREE.Group();
    edges.forEach(e => {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(e.w, wallHeight, e.d), wallMat);
      wall.position.set(e.x, wallHeight / 2 + 0.2, e.z);
      wall.material = wallMat.clone();
      wallGroup.add(wall);
    });
    planGroup.add(wallGroup);

    roomMeshes[r.name] = { floor: floorMesh, walls: wallGroup, base: r.color };
  });

  // Center the whole plan
  planGroup.position.set(-1, 0, 0);

  // ---------- Room list sidebar ----------
  const listEl = document.querySelector("#room-list");
  ROOMS.forEach(r => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${r.name}</span><span class="tag mono">${r.tag}</span>`;
    li.addEventListener("mouseenter", () => highlightRoom(r.name));
    li.addEventListener("mouseleave", () => highlightRoom(null));
    li.addEventListener("click", () => {
      listEl.querySelectorAll("li").forEach(el => el.classList.remove("active"));
      li.classList.add("active");
    });
    listEl.appendChild(li);
  });

  function highlightRoom(name) {
    Object.entries(roomMeshes).forEach(([key, mesh]) => {
      const active = key === name;
      mesh.floor.material.color.set(active ? 0xA9834E : mesh.base);
      mesh.walls.children.forEach(w => w.material.color.set(active ? 0x14181C : 0xA9834E));
    });
  }

  // ---------- Turntable controls (custom, no extra library) ----------
  let rotY = -0.6, targetRotY = -0.6;
  let dragging = false, lastX = 0, lastY = 0;

  canvas.addEventListener("mousedown", e => { dragging = true; lastX = e.clientX; lastY = e.clientY; });
  window.addEventListener("mouseup", () => dragging = false);
  window.addEventListener("mousemove", e => {
    if (!dragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    targetRotY += dx * 0.006;
    camTilt = Math.max(0.25, Math.min(1.4, camTilt - dy * 0.004));
    lastX = e.clientX; lastY = e.clientY;
  });
  canvas.addEventListener("touchstart", e => {
    dragging = true; lastX = e.touches[0].clientX; lastY = e.touches[0].clientY;
  }, { passive: true });
  canvas.addEventListener("touchmove", e => {
    if (!dragging) return;
    const dx = e.touches[0].clientX - lastX, dy = e.touches[0].clientY - lastY;
    targetRotY += dx * 0.006;
    camTilt = Math.max(0.25, Math.min(1.4, camTilt - dy * 0.004));
    lastX = e.touches[0].clientX; lastY = e.touches[0].clientY;
  }, { passive: true });
  canvas.addEventListener("touchend", () => dragging = false);

  canvas.addEventListener("wheel", e => {
    e.preventDefault();
    camDistance = Math.max(10, Math.min(40, camDistance + e.deltaY * 0.02));
  }, { passive: false });

  // ---------- 2D / 3D toggle ----------
  let mode3D = true;
  document.querySelector("#view-3d").addEventListener("click", () => {
    mode3D = true; camTilt = 0.85; camDistance = 24;
  });
  document.querySelector("#view-2d").addEventListener("click", () => {
    mode3D = false; camTilt = 1.55; camDistance = 26;
  });

  function updateCamera() {
    rotY += (targetRotY - rotY) * 0.08;
    const x = Math.sin(rotY) * Math.cos(camTilt) * camDistance;
    const z = Math.cos(rotY) * Math.cos(camTilt) * camDistance;
    const y = Math.sin(camTilt) * camDistance;
    camera.position.set(x, y, z);
    camera.lookAt(0, 0, 0);
  }

  function animate() {
    requestAnimationFrame(animate);
    updateCamera();
    renderer.render(scene, camera);
  }
  resize();
  animate();
})();
