import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js";

const artworks = [
  {
    file: "artworks/art1.jpg",
    title: "Evening Bloom",
    year: "2026",
    description: "A warm composition with soft movement and layered textures."
  },
  {
    file: "artworks/art2.jpg",
    title: "City Whisper",
    year: "2026",
    description: "A quiet urban moment rendered with playful contrast."
  },
  {
    file: "artworks/art3.jpg",
    title: "Golden Window",
    year: "2026",
    description: "Sunlit geometry and gentle shadows shape this scene."
  },
  {
    file: "artworks/art4.jpg",
    title: "Small Stories",
    year: "2026",
    description: "Narrative fragments gathered from daily family life."
  },
  {
    file: "artworks/art5.jpg",
    title: "Floating Garden",
    year: "2026",
    description: "A dreamy landscape balancing calm colors and open space."
  },
  {
    file: "artworks/art6.jpg",
    title: "Blue Echo",
    year: "2026",
    description: "Cool tones and rhythmic strokes create a meditative mood."
  },
  {
    file: "artworks/art7.jpg",
    title: "Paper Sky",
    year: "2026",
    description: "A light-hearted abstraction inspired by folded forms."
  },
  {
    file: "artworks/art8.jpg",
    title: "Little Horizon",
    year: "2026",
    description: "A calm closing piece with distant depth and soft light."
  }
];

const app = document.getElementById("app");
const overlay = document.getElementById("overlay");
const overlayImage = document.getElementById("overlay-image");
const overlayTitle = document.getElementById("overlay-title");
const overlayYear = document.getElementById("overlay-year");
const overlayDescription = document.getElementById("overlay-description");
const overlayCloseButton = document.getElementById("overlay-close");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x141311);
scene.fog = new THREE.Fog(0x141311, 12, 30);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 2, 8.5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
app.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 3.5;
controls.maxDistance = 15;
controls.maxPolarAngle = Math.PI / 2 - 0.03;
controls.target.set(0, 1.85, 0);

scene.add(new THREE.AmbientLight(0xfff2df, 0.42));
scene.add(new THREE.HemisphereLight(0xfff7ea, 0x463831, 0.28));

const roomWidth = 14;
const roomDepth = 10;
const roomHeight = 4.2;

const room = new THREE.Group();
scene.add(room);

function createWoodTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const context = canvas.getContext("2d");
  if (!context) {
    return null;
  }

  context.fillStyle = "#6f533f";
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 85; i += 1) {
    const y = (i / 85) * canvas.height;
    const alpha = 0.08 + (i % 3) * 0.04;
    context.fillStyle = `rgba(43, 31, 24, ${alpha})`;
    context.fillRect(0, y, canvas.width, 5);
  }

  for (let i = 0; i < 170; i += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    context.fillStyle = `rgba(133, 97, 73, ${0.08 + Math.random() * 0.15})`;
    context.fillRect(x, y, 22 + Math.random() * 28, 2 + Math.random() * 3);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(roomWidth, roomDepth),
  new THREE.MeshStandardMaterial({
    color: 0x6a4f3a,
    map: createWoodTexture(),
    roughness: 0.8,
    metalness: 0.05
  })
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
room.add(floor);

const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xebe5db, roughness: 0.9 });
const ceilingMaterial = new THREE.MeshStandardMaterial({ color: 0xe4ded3, roughness: 1 });
const baseboardMaterial = new THREE.MeshStandardMaterial({ color: 0x222225, roughness: 0.45, metalness: 0.2 });

const backWall = new THREE.Mesh(new THREE.PlaneGeometry(roomWidth, roomHeight), wallMaterial);
backWall.position.set(0, roomHeight / 2, -roomDepth / 2);
room.add(backWall);

const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(roomDepth, roomHeight), wallMaterial);
leftWall.rotation.y = Math.PI / 2;
leftWall.position.set(-roomWidth / 2, roomHeight / 2, 0);
room.add(leftWall);

const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(roomDepth, roomHeight), wallMaterial);
rightWall.rotation.y = -Math.PI / 2;
rightWall.position.set(roomWidth / 2, roomHeight / 2, 0);
room.add(rightWall);

const ceiling = new THREE.Mesh(
  new THREE.PlaneGeometry(roomWidth, roomDepth),
  ceilingMaterial
);
ceiling.rotation.x = Math.PI / 2;
ceiling.position.y = roomHeight;
room.add(ceiling);

function createBaseboard(width, depth, x, y, z, rotationY = 0) {
  const board = new THREE.Mesh(new THREE.BoxGeometry(width, 0.14, depth), baseboardMaterial);
  board.position.set(x, y, z);
  board.rotation.y = rotationY;
  room.add(board);
}

createBaseboard(roomWidth, 0.08, 0, 0.07, -roomDepth / 2 + 0.03);
createBaseboard(roomDepth, 0.08, -roomWidth / 2 + 0.03, 0.07, 0, Math.PI / 2);
createBaseboard(roomDepth, 0.08, roomWidth / 2 - 0.03, 0.07, 0, Math.PI / 2);

function createCityTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  if (!context) {
    return null;
  }

  const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#081228");
  gradient.addColorStop(1, "#22314e");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 220; i += 1) {
    context.fillStyle = `rgba(255, 230, 175, ${0.25 + Math.random() * 0.7})`;
    const x = Math.random() * canvas.width;
    const y = 80 + Math.random() * (canvas.height - 120);
    context.fillRect(x, y, 2, 2);
  }

  for (let i = 0; i < 24; i += 1) {
    const buildingWidth = 18 + Math.random() * 42;
    const height = 60 + Math.random() * 170;
    const x = i * 45 + Math.random() * 20;
    const y = canvas.height - height;
    context.fillStyle = `rgba(17, 26, 42, ${0.65 + Math.random() * 0.3})`;
    context.fillRect(x, y, buildingWidth, height);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const windowGroup = new THREE.Group();
windowGroup.position.set(0, 2.25, -roomDepth / 2 + 0.01);
room.add(windowGroup);

const windowView = new THREE.Mesh(
  new THREE.PlaneGeometry(2.4, 1.25),
  new THREE.MeshBasicMaterial({ map: createCityTexture(), toneMapped: false })
);
windowView.position.z = -0.02;
windowGroup.add(windowView);

const windowFrame = new THREE.Mesh(
  new THREE.BoxGeometry(2.58, 1.42, 0.06),
  new THREE.MeshStandardMaterial({ color: 0x19191a, roughness: 0.45, metalness: 0.4 })
);
windowFrame.position.z = 0.03;
windowGroup.add(windowFrame);

function addSpotlight(position, targetPosition, intensity = 1.1) {
  const light = new THREE.SpotLight(0xffefda, intensity, 16, Math.PI / 5.8, 0.35, 1.15);
  light.position.copy(position);
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  light.shadow.camera.near = 0.6;
  light.shadow.camera.far = 22;
  light.shadow.bias = -0.00035;
  light.target.position.copy(targetPosition);
  scene.add(light, light.target);

  const fixture = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.18, 0.1, 24),
    new THREE.MeshStandardMaterial({
      color: 0x332f29,
      roughness: 0.5,
      metalness: 0.35,
      emissive: 0x261e12,
      emissiveIntensity: 0.42
    })
  );
  fixture.position.copy(position);
  room.add(fixture);
}

addSpotlight(new THREE.Vector3(-4.4, roomHeight - 0.25, -2.8), new THREE.Vector3(-5.95, 1.9, -2.6), 1.1);
addSpotlight(new THREE.Vector3(-4.4, roomHeight - 0.25, 2.6), new THREE.Vector3(-5.95, 1.9, 2.5), 1.1);
addSpotlight(new THREE.Vector3(4.4, roomHeight - 0.25, -2.8), new THREE.Vector3(5.95, 1.9, -2.6), 1.1);
addSpotlight(new THREE.Vector3(4.4, roomHeight - 0.25, 2.6), new THREE.Vector3(5.95, 1.9, 2.5), 1.1);
addSpotlight(new THREE.Vector3(0, roomHeight - 0.25, -3.4), new THREE.Vector3(0, 2, -roomDepth / 2 + 0.2), 1.2);

const textureLoader = new THREE.TextureLoader();
const clickableArtworks = [];

function createFallbackTexture(artwork) {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 900;
  const context = canvas.getContext("2d");
  if (!context) {
    return null;
  }

  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#7f7568");
  gradient.addColorStop(1, "#61574d");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "rgba(255, 255, 255, 0.15)";
  context.fillRect(80, 80, canvas.width - 160, canvas.height - 160);

  context.fillStyle = "#f4eee6";
  context.font = "600 48px sans-serif";
  context.textAlign = "center";
  context.fillText(artwork.title, canvas.width / 2, canvas.height / 2 - 10);
  context.font = "28px sans-serif";
  context.fillText("Image unavailable", canvas.width / 2, canvas.height / 2 + 44);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createLabelTexture(artwork) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (!context) {
    return null;
  }

  context.fillStyle = "#c19a5a";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "rgba(44, 32, 20, 0.2)";
  context.fillRect(0, 0, canvas.width, 12);
  context.fillRect(0, canvas.height - 10, canvas.width, 10);

  context.fillStyle = "#2f2112";
  context.font = "600 32px serif";
  context.textAlign = "left";
  context.fillText(artwork.title, 24, 52);
  context.font = "24px serif";
  context.fillText(artwork.year, 24, 92);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createFrameBars(frameOuterWidth, frameOuterHeight, depth, material) {
  const bars = new THREE.Group();
  const thickness = 0.06;

  const top = new THREE.Mesh(
    new THREE.BoxGeometry(frameOuterWidth + thickness, thickness, depth),
    material
  );
  top.position.y = frameOuterHeight / 2;

  const bottom = new THREE.Mesh(
    new THREE.BoxGeometry(frameOuterWidth + thickness, thickness, depth),
    material
  );
  bottom.position.y = -frameOuterHeight / 2;

  const left = new THREE.Mesh(
    new THREE.BoxGeometry(thickness, frameOuterHeight - thickness * 2, depth),
    material
  );
  left.position.x = -frameOuterWidth / 2;

  const right = new THREE.Mesh(
    new THREE.BoxGeometry(thickness, frameOuterHeight - thickness * 2, depth),
    material
  );
  right.position.x = frameOuterWidth / 2;

  bars.add(top, bottom, left, right);
  bars.traverse((child) => {
    child.castShadow = true;
  });

  return bars;
}

function createArtworkPanel(artwork) {
  const group = new THREE.Group();

  const frameOuterWidth = 1.86;
  const frameOuterHeight = 1.32;
  const matWidth = 1.72;
  const matHeight = 1.16;
  const artWidth = 1.36;
  const artHeight = 0.86;

  const matBoard = new THREE.Mesh(
    new THREE.PlaneGeometry(matWidth, matHeight),
    new THREE.MeshStandardMaterial({ color: 0xf9f8f3, roughness: 0.95 })
  );
  matBoard.position.z = 0.02;
  group.add(matBoard);

  const artMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.67,
    metalness: 0.03
  });
  const painting = new THREE.Mesh(new THREE.PlaneGeometry(artWidth, artHeight), artMaterial);
  painting.position.z = 0.03;
  painting.userData = { artwork };
  painting.castShadow = true;
  clickableArtworks.push(painting);
  group.add(painting);

  const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x121212, roughness: 0.45, metalness: 0.2 });
  const frameBars = createFrameBars(frameOuterWidth, frameOuterHeight, 0.08, frameMaterial);
  frameBars.position.z = 0.035;
  group.add(frameBars);

  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(0.78, 0.2),
    new THREE.MeshStandardMaterial({
      color: 0xc89f63,
      map: createLabelTexture(artwork),
      roughness: 0.35,
      metalness: 0.32
    })
  );
  label.position.set(0.02, -frameOuterHeight / 2 - 0.22, 0.03);
  group.add(label);

  textureLoader.load(
    artwork.file,
    (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      artMaterial.map = texture;
      artMaterial.color.setHex(0xffffff);
      artMaterial.needsUpdate = true;
    },
    undefined,
    () => {
      artMaterial.map = createFallbackTexture(artwork);
      artMaterial.color.setHex(0xffffff);
      artMaterial.needsUpdate = true;
    }
  );

  return group;
}

function addArtworksToRoom() {
  const placement = [
    { wall: "left", offset: -2.8 },
    { wall: "left", offset: 0 },
    { wall: "left", offset: 2.8 },
    { wall: "back", offset: -4.2 },
    { wall: "back", offset: 0 },
    { wall: "back", offset: 4.2 },
    { wall: "right", offset: -1.8 },
    { wall: "right", offset: 1.8 }
  ];

  for (let i = 0; i < artworks.length; i += 1) {
    const artwork = artworks[i];
    const slot = placement[i % placement.length];
    const panel = createArtworkPanel(artwork);
    const y = 2;

    if (slot.wall === "left") {
      panel.position.set(-roomWidth / 2 + 0.05, y, slot.offset);
      panel.rotation.y = Math.PI / 2;
    } else if (slot.wall === "right") {
      panel.position.set(roomWidth / 2 - 0.05, y, slot.offset);
      panel.rotation.y = -Math.PI / 2;
    } else {
      panel.position.set(slot.offset, y, -roomDepth / 2 + 0.05);
      panel.rotation.y = 0;
    }

    room.add(panel);
  }
}

addArtworksToRoom();

const bench = new THREE.Mesh(
  new THREE.BoxGeometry(2.8, 0.26, 0.92),
  new THREE.MeshStandardMaterial({ color: 0x2a2a2d, roughness: 0.8, metalness: 0.1 })
);
bench.position.set(0, 0.44, 1.25);
bench.castShadow = true;
bench.receiveShadow = true;
room.add(bench);

const benchLegMaterial = new THREE.MeshStandardMaterial({ color: 0x1b1b1d, roughness: 0.4, metalness: 0.3 });
for (const x of [-1.1, 1.1]) {
  for (const z of [-0.32, 0.32]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.34, 0.08), benchLegMaterial);
    leg.position.set(x, 0.19, 1.25 + z);
    leg.castShadow = true;
    room.add(leg);
  }
}

const plinth = new THREE.Mesh(
  new THREE.CylinderGeometry(0.48, 0.48, 0.7, 28),
  new THREE.MeshStandardMaterial({ color: 0xded6c8, roughness: 0.9 })
);
plinth.position.set(0, 0.35, -0.9);
plinth.receiveShadow = true;
plinth.castShadow = true;
room.add(plinth);

const sculpture = new THREE.Mesh(
  new THREE.IcosahedronGeometry(0.34, 1),
  new THREE.MeshStandardMaterial({ color: 0xb89b73, roughness: 0.34, metalness: 0.35 })
);
sculpture.position.set(0, 0.95, -0.9);
sculpture.castShadow = true;
room.add(sculpture);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let pointerDown = { x: 0, y: 0, time: 0 };

function openOverlay(artwork) {
  overlayTitle.textContent = artwork.title;
  overlayYear.textContent = `Year: ${artwork.year}`;
  overlayDescription.textContent = artwork.description;
  overlayImage.classList.remove("visible");
  overlayImage.alt = artwork.title;
  overlayImage.src = artwork.file;
  overlayImage.onload = () => {
    overlayImage.classList.add("visible");
  };
  overlayImage.onerror = () => {
    overlayImage.classList.remove("visible");
  };
  overlay.classList.remove("hidden");
}

function closeOverlay() {
  overlay.classList.add("hidden");
}

overlayCloseButton.addEventListener("click", closeOverlay);

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeOverlay();
  }
});

renderer.domElement.addEventListener("pointerdown", (event) => {
  pointerDown = { x: event.clientX, y: event.clientY, time: performance.now() };
});

renderer.domElement.addEventListener("pointerup", (event) => {
  const distance = Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y);
  const duration = performance.now() - pointerDown.time;
  if (distance > 6 || duration > 450) {
    return;
  }

  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(clickableArtworks, false);
  if (intersects.length > 0) {
    openOverlay(intersects[0].object.userData.artwork);
  }
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  sculpture.rotation.y += 0.004;
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
