import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js";

const artworks = [
  { file: "artworks/art1.jpg", title: "Artwork 1", year: "2026", description: "Sample description for artwork 1." },
  { file: "artworks/art2.jpg", title: "Artwork 2", year: "2026", description: "Sample description for artwork 2." },
  { file: "artworks/art3.jpg", title: "Artwork 3", year: "2026", description: "Sample description for artwork 3." },
  { file: "artworks/art4.jpg", title: "Artwork 4", year: "2026", description: "Sample description for artwork 4." },
  { file: "artworks/art5.jpg", title: "Artwork 5", year: "2026", description: "Sample description for artwork 5." },
  { file: "artworks/art6.jpg", title: "Artwork 6", year: "2026", description: "Sample description for artwork 6." },
  { file: "artworks/art7.jpg", title: "Artwork 7", year: "2026", description: "Sample description for artwork 7." },
  { file: "artworks/art8.jpg", title: "Artwork 8", year: "2026", description: "Sample description for artwork 8." }
];

const app = document.getElementById("app");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlay-title");
const overlayYear = document.getElementById("overlay-year");
const overlayDescription = document.getElementById("overlay-description");
const overlayCloseButton = document.getElementById("overlay-close");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x101012);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.7, 6.5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
app.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 2.5;
controls.maxDistance = 18;
controls.maxPolarAngle = Math.PI / 2 - 0.08;
controls.target.set(0, 1.5, 0);

scene.add(new THREE.AmbientLight(0xfff4e8, 0.45));

const spot = new THREE.SpotLight(0xfff2de, 1.4, 20, Math.PI / 5, 0.4, 1.2);
spot.position.set(0, 3.8, 0);
spot.castShadow = true;
spot.shadow.mapSize.set(1024, 1024);
spot.target.position.set(0, 1.2, 0);
scene.add(spot, spot.target);

const room = new THREE.Group();
scene.add(room);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(14, 10),
  new THREE.MeshStandardMaterial({ color: 0x5a4231, roughness: 0.75, metalness: 0.05 })
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
room.add(floor);

const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xe9e4dc, roughness: 0.9 });

const backWall = new THREE.Mesh(new THREE.PlaneGeometry(14, 4), wallMaterial);
backWall.position.set(0, 2, -5);
room.add(backWall);

const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 4), wallMaterial);
leftWall.rotation.y = Math.PI / 2;
leftWall.position.set(-7, 2, 0);
room.add(leftWall);

const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 4), wallMaterial);
rightWall.rotation.y = -Math.PI / 2;
rightWall.position.set(7, 2, 0);
room.add(rightWall);

const ceiling = new THREE.Mesh(
  new THREE.PlaneGeometry(14, 10),
  new THREE.MeshStandardMaterial({ color: 0xddd8cf, roughness: 1 })
);
ceiling.rotation.x = Math.PI / 2;
ceiling.position.y = 4;
room.add(ceiling);

const textureLoader = new THREE.TextureLoader();
const clickableArtworks = [];

function createArtworkPanel(artwork) {
  const group = new THREE.Group();

  const matBoard = new THREE.Mesh(
    new THREE.PlaneGeometry(1.6, 1.2),
    new THREE.MeshStandardMaterial({ color: 0xf8f8f5, roughness: 0.92 })
  );
  group.add(matBoard);

  const textureMaterial = new THREE.MeshStandardMaterial({ color: 0x8f8f8f, roughness: 0.7 });
  const painting = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.8), textureMaterial);
  painting.position.z = 0.01;
  painting.userData = { artwork };
  clickableArtworks.push(painting);
  group.add(painting);

  const frame = new THREE.Mesh(
    new THREE.RingGeometry(0.86, 0.92, 4),
    new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.45, metalness: 0.2 })
  );
  frame.rotation.z = Math.PI / 4;
  frame.position.z = 0.02;
  group.add(frame);

  textureLoader.load(
    artwork.file,
    (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      textureMaterial.map = texture;
      textureMaterial.color.setHex(0xffffff);
      textureMaterial.needsUpdate = true;
    },
    undefined,
    () => {
      textureMaterial.map = null;
      textureMaterial.color.setHex(0x9a9a9a);
      textureMaterial.needsUpdate = true;
    }
  );

  return group;
}

function addArtworks() {
  const y = 1.8;
  const zPositions = [-3.3, -1.1, 1.1, 3.3];

  for (let i = 0; i < artworks.length; i += 1) {
    const panel = createArtworkPanel(artworks[i]);
    const isLeft = i < 4;
    const zIndex = i % 4;
    panel.position.set(isLeft ? -6.92 : 6.92, y, zPositions[zIndex]);
    panel.rotation.y = isLeft ? Math.PI / 2 : -Math.PI / 2;
    room.add(panel);
  }
}

addArtworks();

const bench = new THREE.Mesh(
  new THREE.BoxGeometry(2.2, 0.35, 0.7),
  new THREE.MeshStandardMaterial({ color: 0x2e2e31, roughness: 0.8 })
);
bench.position.set(0, 0.4, 0.8);
bench.castShadow = true;
bench.receiveShadow = true;
room.add(bench);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function openOverlay(artwork) {
  overlayTitle.textContent = artwork.title;
  overlayYear.textContent = artwork.year;
  overlayDescription.textContent = artwork.description;
  overlay.classList.remove("hidden");
}

function closeOverlay() {
  overlay.classList.add("hidden");
}

overlayCloseButton.addEventListener("click", closeOverlay);

renderer.domElement.addEventListener("pointerdown", (event) => {
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
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
