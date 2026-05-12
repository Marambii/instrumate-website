// src/main.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ThreeMpPose } from './RPMThreeMpPose.js';

let camera, scene, renderer, controls, skeleton;
let mpPose = new ThreeMpPose();

// --- Basic Three.js setup ---
scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

// Standard camera setup
camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 8); // start farther back

renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false; // optional: no panning

// Light
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

// --- Load Mixamo/RPM avatar ---
const loader = new GLTFLoader();
loader.load('/female.glb', (gltf) => {
  // Optional: scale avatar if very small/large
  // gltf.scene.scale.set(100, 100, 100);

  scene.add(gltf.scene);

  // find skeleton
  gltf.scene.traverse((o) => {
    if (o.isSkinnedMesh) {
      skeleton = o.skeleton;
    }
  });

  // --- AUTO-FRAME AVATAR (corrected) ---
  const box = new THREE.Box3().setFromObject(gltf.scene);
  const size = new THREE.Vector3();
  box.getSize(size);
  const center = new THREE.Vector3();
  box.getCenter(center);

  console.log('Avatar size:', size, 'center:', center);

  // Move controls target to pelvis/mid-body area
  controls.target.set(center.x, center.y * 0.5, center.z);

  // Compute ideal distance from size
  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);
  let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));

  // Pull back more to see entire avatar
  cameraZ *= 2.0; // instead of 1.5

  // Center camera at full body height
  camera.position.set(center.x, center.y, cameraZ);

  // Aim at the true center of the avatar
  camera.lookAt(center);
  controls.update();
});

// --- Load a MediaPipe JSON frame (or array of frames) ---
let mediapipeData = null;
fetch('/BETTER_smoothed_frozen.json')
  .then(r => r.json())
  .then(data => {
    mediapipeData = data;
  });

// --- Animation loop ---
let frameIndex = 0;
function animate() {
  requestAnimationFrame(animate);

  if (skeleton && mediapipeData) {
    const mpFrame = mediapipeData[frameIndex];

    mpPose.updateMpLandmarks(mpFrame);
    mpPose.transformToWorld(camera, 0.1, new THREE.Vector3(0, -1, 0)); 
    // ^ optional offset down to counter frozen hips

    mpPose.add3dJointsForMixamo();
    mpPose.rigSolverForMixamo(skeleton);

    frameIndex = (frameIndex + 1) % mediapipeData.length;
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
