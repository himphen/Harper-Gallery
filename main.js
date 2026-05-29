import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { artworks } from "./artworks.js";

const app = document.getElementById("app");
const hud = document.getElementById("hud");
const overlay = document.getElementById("overlay");
const overlayImage = document.getElementById("overlay-image");
const overlayTitle = document.getElementById("overlay-title");
const overlayYear = document.getElementById("overlay-year");
const overlayDescription = document.getElementById("overlay-description");
const overlayCloseButton = document.getElementById("overlay-close");
const fullscreenToggleButton = document.getElementById("fullscreen-toggle");
const joystick = document.getElementById("joystick");
const joystickBase = document.getElementById("joystick-base");
const joystickStick = document.getElementById("joystick-stick");
const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x141311);
scene.fog = new THREE.Fog(0x141311, 16, 42);
const overallExposure = 1.12;
const spotlightIntensityBoost = 1.08;

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 2, 8.5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = overallExposure;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
app.appendChild(renderer.domElement);
renderer.domElement.style.touchAction = "none";

if (hud) {
  hud.textContent = isCoarsePointer
    ? "Touch Drag: Look Around | Pinch: Zoom | Joystick: Move | Tap Artwork: Details"
    : "WASD or Arrow Keys: Move | Mouse Drag: Look Around | Click Artwork: Details";
}

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.rotateSpeed = 0.8;
controls.minDistance = 1.2;
controls.maxDistance = 8.5;
controls.maxPolarAngle = Math.PI / 2 - 0.05;
controls.target.set(0, 1.6, 2.8);

scene.add(new THREE.AmbientLight(0xfff2df, 0.5));
scene.add(new THREE.HemisphereLight(0xfff7ea, 0x463831, 0.34));

const roomWidth = 24;
const roomDepth = 18;
const roomHeight = 5.2;

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

  context.fillStyle = "#cfab84";
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 85; i += 1) {
    const y = (i / 85) * canvas.height;
    const alpha = 0.08 + (i % 3) * 0.04;
    context.fillStyle = `rgba(133, 101, 73, ${alpha})`;
    context.fillRect(0, y, canvas.width, 5);
  }

  for (let i = 0; i < 170; i += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    context.fillStyle = `rgba(236, 205, 168, ${0.08 + Math.random() * 0.15})`;
    context.fillRect(x, y, 22 + Math.random() * 28, 2 + Math.random() * 3);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 6);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(roomWidth, roomDepth),
  new THREE.MeshStandardMaterial({
    color: 0xdabd98,
    map: createWoodTexture(),
    roughness: 0.78,
    metalness: 0.05
  })
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
room.add(floor);

const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xebe5db, roughness: 0.9, side: THREE.DoubleSide });
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

// Front wall with a central entrance for a more realistic gallery layout.
const frontEntranceWidth = 3.8;
const frontEntranceHeight = 2.7;
const frontSideWidth = (roomWidth - frontEntranceWidth) / 2;
const frontTopHeight = roomHeight - frontEntranceHeight;

const frontLeftWall = new THREE.Mesh(new THREE.PlaneGeometry(frontSideWidth, roomHeight), wallMaterial);
frontLeftWall.position.set(-(frontEntranceWidth / 2 + frontSideWidth / 2), roomHeight / 2, roomDepth / 2);
room.add(frontLeftWall);

const frontRightWall = new THREE.Mesh(new THREE.PlaneGeometry(frontSideWidth, roomHeight), wallMaterial);
frontRightWall.position.set(frontEntranceWidth / 2 + frontSideWidth / 2, roomHeight / 2, roomDepth / 2);
room.add(frontRightWall);

const frontTopWall = new THREE.Mesh(new THREE.PlaneGeometry(frontEntranceWidth, frontTopHeight), wallMaterial);
frontTopWall.position.set(0, frontEntranceHeight + frontTopHeight / 2, roomDepth / 2);
room.add(frontTopWall);

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
createBaseboard(frontSideWidth, 0.08, -(frontEntranceWidth / 2 + frontSideWidth / 2), 0.07, roomDepth / 2 - 0.03);
createBaseboard(frontSideWidth, 0.08, frontEntranceWidth / 2 + frontSideWidth / 2, 0.07, roomDepth / 2 - 0.03);

function addSpotlight(position, targetPosition, intensity = 1.1) {
  const light = new THREE.SpotLight(
    0xffefda,
    intensity * spotlightIntensityBoost,
    16,
    Math.PI / 5.8,
    0.35,
    1.15
  );
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

addSpotlight(
  new THREE.Vector3(-roomWidth * 0.32, roomHeight - 0.25, -roomDepth * 0.3),
  new THREE.Vector3(-roomWidth / 2 + 1.2, 2.1, -roomDepth * 0.3),
  1.1
);
addSpotlight(
  new THREE.Vector3(-roomWidth * 0.32, roomHeight - 0.25, roomDepth * 0.3),
  new THREE.Vector3(-roomWidth / 2 + 1.2, 2.1, roomDepth * 0.3),
  1.1
);
addSpotlight(
  new THREE.Vector3(roomWidth * 0.32, roomHeight - 0.25, -roomDepth * 0.3),
  new THREE.Vector3(roomWidth / 2 - 1.2, 2.1, -roomDepth * 0.3),
  1.1
);
addSpotlight(
  new THREE.Vector3(roomWidth * 0.32, roomHeight - 0.25, roomDepth * 0.3),
  new THREE.Vector3(roomWidth / 2 - 1.2, 2.1, roomDepth * 0.3),
  1.1
);
addSpotlight(
  new THREE.Vector3(0, roomHeight - 0.25, -roomDepth * 0.34),
  new THREE.Vector3(0, 2.15, -roomDepth / 2 + 0.2),
  1.2
);

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

  context.fillStyle = "#f5f2eb";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "rgba(95, 84, 69, 0.18)";
  context.fillRect(0, 0, canvas.width, 12);
  context.fillRect(0, canvas.height - 10, canvas.width, 10);

  context.fillStyle = "#4c443a";
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

const DEFAULT_ART_ASPECT = 1.36 / 0.86;
const MIN_ART_ASPECT = 0.55;
const MAX_ART_ASPECT = 1.9;
const BASE_ART_AREA = 1.36 * 0.86;
const MAT_PADDING_X = 0.18;
const MAT_PADDING_Y = 0.15;
const FRAME_PADDING_X = 0.07;
const FRAME_PADDING_Y = 0.08;

function getPanelDimensions(aspectRatio) {
  const safeAspect = THREE.MathUtils.clamp(aspectRatio || DEFAULT_ART_ASPECT, MIN_ART_ASPECT, MAX_ART_ASPECT);
  const artWidth = Math.sqrt(BASE_ART_AREA * safeAspect);
  const artHeight = BASE_ART_AREA / artWidth;
  const matWidth = artWidth + MAT_PADDING_X * 2;
  const matHeight = artHeight + MAT_PADDING_Y * 2;

  return {
    artWidth,
    artHeight,
    matWidth,
    matHeight,
    frameOuterWidth: matWidth + FRAME_PADDING_X * 2,
    frameOuterHeight: matHeight + FRAME_PADDING_Y * 2
  };
}

function resizePlaneMesh(mesh, width, height) {
  mesh.geometry.dispose();
  mesh.geometry = new THREE.PlaneGeometry(width, height);
}

function disposeFrameBars(frameBars) {
  frameBars.traverse((child) => {
    if (!child.isMesh) {
      return;
    }
    child.geometry.dispose();
  });
}

function createArtworkPanel(artwork) {
  const group = new THREE.Group();

  const matBoard = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshStandardMaterial({
      color: 0xf9f8f3,
      roughness: 0.95,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1
    })
  );
  matBoard.position.z = 0.02;
  matBoard.castShadow = false;
  matBoard.receiveShadow = false;
  matBoard.renderOrder = 1;
  group.add(matBoard);

  const artMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.67,
    metalness: 0.03,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1
  });
  const painting = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), artMaterial);
  painting.position.z = 0.03;
  painting.userData = { artwork };
  painting.castShadow = false;
  painting.receiveShadow = false;
  painting.renderOrder = 2;
  clickableArtworks.push(painting);
  group.add(painting);

  const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x121212, roughness: 0.45, metalness: 0.2 });
  let frameBars = null;

  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(0.78, 0.2),
    new THREE.MeshStandardMaterial({
      color: 0xf7f4ee,
      map: createLabelTexture(artwork),
      roughness: 0.68,
      metalness: 0.04,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2
    })
  );
  label.position.set(0.02, -0.88, 0.03);
  label.castShadow = false;
  label.receiveShadow = false;
  label.renderOrder = 4;
  group.add(label);

  function applyPanelDimensions(aspectRatio) {
    const dimensions = getPanelDimensions(aspectRatio);

    resizePlaneMesh(matBoard, dimensions.matWidth, dimensions.matHeight);
    resizePlaneMesh(painting, dimensions.artWidth, dimensions.artHeight);

    if (frameBars) {
      group.remove(frameBars);
      disposeFrameBars(frameBars);
    }
    frameBars = createFrameBars(dimensions.frameOuterWidth, dimensions.frameOuterHeight, 0.08, frameMaterial);
    frameBars.position.z = 0.035;
    group.add(frameBars);

    label.position.set(0.02, -dimensions.frameOuterHeight / 2 - 0.22, 0.03);
  }

  applyPanelDimensions(DEFAULT_ART_ASPECT);

  textureLoader.load(
    artwork.file,
    (texture) => {
      const image = texture.image;
      const aspectRatio =
        image && image.width > 0 && image.height > 0
          ? image.width / image.height
          : DEFAULT_ART_ASPECT;
      applyPanelDimensions(aspectRatio);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      artMaterial.map = texture;
      artMaterial.color.setHex(0xffffff);
      artMaterial.needsUpdate = true;
    },
    undefined,
    () => {
      applyPanelDimensions(DEFAULT_ART_ASPECT);
      artMaterial.map = createFallbackTexture(artwork);
      artMaterial.color.setHex(0xffffff);
      artMaterial.needsUpdate = true;
    }
  );

  return group;
}

function addArtworksToRoom() {
  const placement = [
    { wall: "left", offset: -4.6 },
    { wall: "left", offset: -1.4 },
    { wall: "left", offset: 1.8 },
    { wall: "back", offset: -6.2 },
    { wall: "back", offset: -2.0 },
    { wall: "back", offset: 2.2 },
    { wall: "right", offset: -3.2 },
    { wall: "right", offset: 3.2 }
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
  new THREE.MeshStandardMaterial({ color: 0xf2eee6, roughness: 0.85, metalness: 0.02 })
);
bench.position.set(0, 0.44, 2.0);
bench.castShadow = true;
bench.receiveShadow = true;
room.add(bench);

const benchLegMaterial = new THREE.MeshStandardMaterial({ color: 0xe8e2d7, roughness: 0.86, metalness: 0.02 });
for (const x of [-1.1, 1.1]) {
  for (const z of [-0.32, 0.32]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.34, 0.08), benchLegMaterial);
    leg.position.set(x, 0.19, 2.0 + z);
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

function createGirlCharacter() {
  const root = new THREE.Group();

  const skinMaterial = new THREE.MeshStandardMaterial({ color: 0xf8d8c0, roughness: 0.62 });
  const hairMaterial = new THREE.MeshStandardMaterial({ color: 0x2f241f, roughness: 0.55 });
  const dressMaterial = new THREE.MeshStandardMaterial({ color: 0xe59db8, roughness: 0.7 });
  const collarMaterial = new THREE.MeshStandardMaterial({ color: 0xf1bfd1, roughness: 0.72 });
  const fabricMaterial = new THREE.MeshStandardMaterial({ color: 0xf0e6dd, roughness: 0.9 });
  const shoeMaterial = new THREE.MeshStandardMaterial({ color: 0x2a2a2e, roughness: 0.4, metalness: 0.1 });

  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.33, 0.68, 30), dressMaterial);
  torso.position.y = 1.08;
  root.add(torso);

  const upperBody = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 26, 18, 0, Math.PI * 2, 0, Math.PI * 0.58),
    dressMaterial
  );
  upperBody.position.set(0, 1.28, 0);
  upperBody.scale.set(1.02, 0.8, 0.86);
  root.add(upperBody);

  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.205, 0.02, 24, 64), collarMaterial);
  collar.position.set(0, 1.35, 0);
  collar.rotation.x = Math.PI / 2;
  root.add(collar);

  const headRig = new THREE.Group();
  headRig.position.set(0, 1.66, 0);
  root.add(headRig);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 20), skinMaterial);
  headRig.add(head);

  const hairCap = new THREE.Mesh(
    new THREE.SphereGeometry(0.206, 24, 20, 0, Math.PI * 2, 0, Math.PI * 0.68),
    hairMaterial
  );
  hairCap.position.y = 0.012;
  headRig.add(hairCap);

  const shortBackHair = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.28, 6, 12), hairMaterial);
  shortBackHair.position.set(0, -0.16, -0.16);
  shortBackHair.rotation.x = Math.PI * 0.08;
  shortBackHair.scale.set(1.06, 1.2, 0.9);
  headRig.add(shortBackHair);

  const leftArmPivot = new THREE.Group();
  leftArmPivot.position.set(-0.245, 1.26, 0);
  const leftArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.28, 6, 10), skinMaterial);
  leftArm.position.y = -0.19;
  leftArmPivot.add(leftArm);
  root.add(leftArmPivot);

  const rightArmPivot = new THREE.Group();
  rightArmPivot.position.set(0.245, 1.26, 0);
  const rightArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.28, 6, 10), skinMaterial);
  rightArm.position.y = -0.19;
  rightArmPivot.add(rightArm);
  root.add(rightArmPivot);

  const leftShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.09, 22, 16), dressMaterial);
  leftShoulder.position.set(-0.21, 1.28, 0);
  leftShoulder.scale.set(1.0, 0.82, 0.85);
  root.add(leftShoulder);

  const rightShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.09, 22, 16), dressMaterial);
  rightShoulder.position.set(0.21, 1.28, 0);
  rightShoulder.scale.set(1.0, 0.82, 0.85);
  root.add(rightShoulder);

  const leftLegPivot = new THREE.Group();
  leftLegPivot.position.set(-0.11, 0.58, 0);
  const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.46, 0.14), fabricMaterial);
  leftLeg.position.y = -0.24;
  leftLegPivot.add(leftLeg);
  const leftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.09, 0.24), shoeMaterial);
  leftShoe.position.set(0, -0.5, 0.04);
  leftLegPivot.add(leftShoe);
  root.add(leftLegPivot);

  const rightLegPivot = new THREE.Group();
  rightLegPivot.position.set(0.11, 0.58, 0);
  const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.46, 0.14), fabricMaterial);
  rightLeg.position.y = -0.24;
  rightLegPivot.add(rightLeg);
  const rightShoe = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.09, 0.24), shoeMaterial);
  rightShoe.position.set(0, -0.5, 0.04);
  rightLegPivot.add(rightShoe);
  root.add(rightLegPivot);

  root.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return {
    root,
    torso,
    collar,
    headRig,
    leftArmPivot,
    rightArmPivot,
    leftLegPivot,
    rightLegPivot
  };
}

const girl = createGirlCharacter();
girl.root.position.set(0, 0, 3.25);
room.add(girl.root);

const moveState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  sprint: false
};

const joystickInput = {
  x: 0,
  y: 0
};

const movementBounds = {
  minX: -roomWidth / 2 + 0.75,
  maxX: roomWidth / 2 - 0.75,
  minZ: -roomDepth / 2 + 0.75,
  maxZ: roomDepth / 2 - 0.75
};

const cameraBounds = {
  minX: -roomWidth / 2 + 0.18,
  maxX: roomWidth / 2 - 0.18,
  minY: 1.02,
  maxY: roomHeight - 0.12,
  minZ: -roomDepth / 2 + 0.18,
  maxZ: roomDepth / 2 - 0.18
};

const collisionObstacles = [
  { x: 0, z: 2.0, radius: 1.75 },
  { x: 0, z: -0.9, radius: 1.05 }
];

const worldUp = new THREE.Vector3(0, 1, 0);
const cameraForward = new THREE.Vector3();
const cameraRight = new THREE.Vector3();
const movementDirection = new THREE.Vector3();
const desiredVelocity = new THREE.Vector3();
const currentVelocity = new THREE.Vector3();
const candidatePosition = new THREE.Vector3();
const followTarget = new THREE.Vector3();
const previousTarget = new THREE.Vector3();
const targetShift = new THREE.Vector3();
const clock = new THREE.Clock();
let walkPhase = 0;

controls.target.set(girl.root.position.x, 1.3, girl.root.position.z);
camera.position.set(girl.root.position.x + 0.3, 2.55, girl.root.position.z + 4.4);
controls.update();

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let pointerDown = { x: 0, y: 0, time: 0 };

function openOverlay(artwork) {
  overlayTitle.textContent = artwork.title;
  overlayYear.textContent = artwork.year;
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

function applyMovementBounds(position) {
  position.x = THREE.MathUtils.clamp(position.x, movementBounds.minX, movementBounds.maxX);
  position.z = THREE.MathUtils.clamp(position.z, movementBounds.minZ, movementBounds.maxZ);
}

function resolveObstacleCollisions(position) {
  for (const obstacle of collisionObstacles) {
    const dx = position.x - obstacle.x;
    const dz = position.z - obstacle.z;
    const distanceSquared = dx * dx + dz * dz;
    const safeDistance = obstacle.radius;

    if (distanceSquared < safeDistance * safeDistance) {
      const distance = Math.sqrt(distanceSquared) || 0.0001;
      const push = safeDistance - distance;
      position.x += (dx / distance) * push;
      position.z += (dz / distance) * push;
    }
  }
}

function updateWalkPose(targetSwing, blend) {
  const intensity = Math.min(1, currentVelocity.length() / 2.8);
  const armSwing = targetSwing * 0.55 * intensity;
  const legSwing = targetSwing * 0.75 * intensity;
  const torsoTilt = targetSwing * 0.08 * intensity;
  const bodyBob = Math.abs(Math.sin(walkPhase)) * 0.05 * intensity;
  const headBob = Math.sin(walkPhase * 2) * 0.018 * intensity;
  const headNod = Math.sin(walkPhase) * 0.05 * intensity;
  const sideSway = Math.sin(walkPhase * 0.5) * 0.025 * intensity;

  girl.leftArmPivot.rotation.x = THREE.MathUtils.lerp(girl.leftArmPivot.rotation.x, armSwing, blend);
  girl.rightArmPivot.rotation.x = THREE.MathUtils.lerp(girl.rightArmPivot.rotation.x, -armSwing, blend);
  girl.leftLegPivot.rotation.x = THREE.MathUtils.lerp(girl.leftLegPivot.rotation.x, -legSwing, blend);
  girl.rightLegPivot.rotation.x = THREE.MathUtils.lerp(girl.rightLegPivot.rotation.x, legSwing, blend);
  girl.torso.rotation.z = THREE.MathUtils.lerp(girl.torso.rotation.z, torsoTilt, blend);
  girl.torso.position.y = THREE.MathUtils.lerp(girl.torso.position.y, 1.08, blend);
  girl.collar.position.y = THREE.MathUtils.lerp(girl.collar.position.y, 1.35 + bodyBob * 0.28, blend);
  girl.headRig.position.y = THREE.MathUtils.lerp(girl.headRig.position.y, 1.66 + bodyBob * 0.8 + headBob, blend);
  girl.headRig.rotation.x = THREE.MathUtils.lerp(girl.headRig.rotation.x, headNod, blend);
  girl.root.position.y = THREE.MathUtils.lerp(girl.root.position.y, bodyBob * 0.62, blend);
  girl.root.rotation.z = THREE.MathUtils.lerp(girl.root.rotation.z, sideSway, blend);
}

function normalizeAngle(angle) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

function updateCharacter(delta) {
  const keyboardHorizontal = (moveState.right ? 1 : 0) - (moveState.left ? 1 : 0);
  const keyboardVertical = (moveState.forward ? 1 : 0) - (moveState.backward ? 1 : 0);
  const horizontal = THREE.MathUtils.clamp(keyboardHorizontal + joystickInput.x, -1, 1);
  const vertical = THREE.MathUtils.clamp(keyboardVertical + joystickInput.y, -1, 1);
  const isMoving = Math.abs(horizontal) > 0.001 || Math.abs(vertical) > 0.001;
  const blend = Math.min(1, delta * 10);

  desiredVelocity.set(0, 0, 0);

  if (isMoving) {
    camera.getWorldDirection(cameraForward);
    cameraForward.y = 0;
    cameraForward.normalize();
    cameraRight.crossVectors(cameraForward, worldUp).normalize();

    movementDirection
      .copy(cameraForward)
      .multiplyScalar(vertical)
      .addScaledVector(cameraRight, horizontal);

    if (movementDirection.lengthSq() > 0) {
      movementDirection.normalize();
    }

    const speed = moveState.sprint ? 3.7 : 2.5;
    desiredVelocity.copy(movementDirection).multiplyScalar(speed);
    currentVelocity.lerp(desiredVelocity, Math.min(1, delta * 8));
    candidatePosition.copy(girl.root.position).addScaledVector(currentVelocity, delta);

    applyMovementBounds(candidatePosition);
    resolveObstacleCollisions(candidatePosition);
    girl.root.position.copy(candidatePosition);

    const turnDirection = currentVelocity.lengthSq() > 0.0006 ? currentVelocity : movementDirection;
    const targetYaw = Math.atan2(turnDirection.x, turnDirection.z);
    const yawDelta = normalizeAngle(targetYaw - girl.root.rotation.y);
    const maxTurnSpeed = (moveState.sprint ? 5.2 : 3.6) * delta;
    const limitedTurn = THREE.MathUtils.clamp(yawDelta, -maxTurnSpeed, maxTurnSpeed);
    girl.root.rotation.y += limitedTurn;

    const velocityRatio = Math.min(1.4, currentVelocity.length() / 2.5);
    walkPhase += delta * (6 + 5 * velocityRatio);
    updateWalkPose(Math.sin(walkPhase), blend);
  } else {
    currentVelocity.lerp(desiredVelocity, Math.min(1, delta * 7));
    candidatePosition.copy(girl.root.position).addScaledVector(currentVelocity, delta);
    applyMovementBounds(candidatePosition);
    resolveObstacleCollisions(candidatePosition);
    girl.root.position.copy(candidatePosition);

    walkPhase = 0;
    updateWalkPose(0, blend);
  }

  previousTarget.copy(controls.target);
  followTarget.set(girl.root.position.x, 1.25, girl.root.position.z);
  controls.target.lerp(followTarget, Math.min(1, delta * 8));
  targetShift.copy(controls.target).sub(previousTarget);
  camera.position.add(targetShift);
}

function constrainCameraInsideRoom() {
  camera.position.x = THREE.MathUtils.clamp(camera.position.x, cameraBounds.minX, cameraBounds.maxX);
  camera.position.y = THREE.MathUtils.clamp(camera.position.y, cameraBounds.minY, cameraBounds.maxY);
  camera.position.z = THREE.MathUtils.clamp(camera.position.z, cameraBounds.minZ, cameraBounds.maxZ);
}

function setMoveAction(action, pressed) {
  if (action === "forward") {
    moveState.forward = pressed;
  } else if (action === "backward") {
    moveState.backward = pressed;
  } else if (action === "left") {
    moveState.left = pressed;
  } else if (action === "right") {
    moveState.right = pressed;
  } else if (action === "sprint") {
    moveState.sprint = pressed;
  }
}

function updateKeyState(event, pressed) {
  let handled = true;

  switch (event.code) {
    case "KeyW":
    case "ArrowUp":
      setMoveAction("forward", pressed);
      break;
    case "KeyS":
    case "ArrowDown":
      setMoveAction("backward", pressed);
      break;
    case "KeyA":
    case "ArrowLeft":
      setMoveAction("left", pressed);
      break;
    case "KeyD":
    case "ArrowRight":
      setMoveAction("right", pressed);
      break;
    case "ShiftLeft":
    case "ShiftRight":
      setMoveAction("sprint", pressed);
      break;
    case "Escape":
      if (pressed) {
        closeOverlay();
      }
      break;
    default:
      handled = false;
      break;
  }

  if (handled) {
    event.preventDefault();
  }
}

overlayCloseButton.addEventListener("click", closeOverlay);

function updateFullscreenButtonLabel() {
  if (!fullscreenToggleButton) {
    return;
  }
  fullscreenToggleButton.textContent = document.fullscreenElement ? "Exit Full Screen" : "Full Screen";
}

async function toggleFullScreen() {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
  } catch (error) {
    console.warn("Fullscreen request failed:", error);
  } finally {
    updateFullscreenButtonLabel();
  }
}

function setupVirtualJoystick() {
  if (!joystick || !joystickBase || !joystickStick) {
    return;
  }

  const radius = 42;
  let activePointerId = null;

  const resetJoystick = () => {
    joystickInput.x = 0;
    joystickInput.y = 0;
    joystickStick.style.transform = "translate(-50%, -50%)";
  };

  const updateJoystick = (clientX, clientY) => {
    const rect = joystickBase.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const distance = Math.hypot(dx, dy);
    const clampedDistance = Math.min(distance, radius);
    const nx = distance > 0 ? dx / distance : 0;
    const ny = distance > 0 ? dy / distance : 0;
    const offsetX = nx * clampedDistance;
    const offsetY = ny * clampedDistance;

    joystickStick.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
    joystickInput.x = nx * (clampedDistance / radius);
    joystickInput.y = -ny * (clampedDistance / radius);
  };

  joystickBase.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    activePointerId = event.pointerId;
    joystickBase.setPointerCapture(event.pointerId);
    updateJoystick(event.clientX, event.clientY);
  });

  joystickBase.addEventListener("pointermove", (event) => {
    if (event.pointerId !== activePointerId) {
      return;
    }
    event.preventDefault();
    updateJoystick(event.clientX, event.clientY);
  });

  const release = (event) => {
    if (event.pointerId !== activePointerId) {
      return;
    }
    event.preventDefault();
    activePointerId = null;
    resetJoystick();
  };

  joystickBase.addEventListener("pointerup", release);
  joystickBase.addEventListener("pointercancel", release);
  joystickBase.addEventListener("lostpointercapture", release);
}

window.addEventListener("keydown", (event) => updateKeyState(event, true));
window.addEventListener("keyup", (event) => updateKeyState(event, false));

if (fullscreenToggleButton) {
  fullscreenToggleButton.addEventListener("click", toggleFullScreen);
  document.addEventListener("fullscreenchange", updateFullscreenButtonLabel);
  updateFullscreenButtonLabel();
}

setupVirtualJoystick();

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
  const delta = Math.min(0.05, clock.getDelta());
  updateCharacter(delta);
  sculpture.rotation.y += 0.004;
  controls.update();
  constrainCameraInsideRoom();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
