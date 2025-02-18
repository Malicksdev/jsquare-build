import * as THREE from 'three';
import gsap from 'gsap';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// SCENE SETUP
const scene = new THREE.Scene();
// scene.background = new THREE.Color(0x1a1a2e);

// CAMERA
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

// RENDERER (WebGL 2.0 with better antialiasing)
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: "high-performance",
  alpha:true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// CSS enhancements
Object.assign(renderer.domElement.style, {
  position: 'fixed',
  top: '0',
  left: '0',
  zIndex: '-1',
  pointerEvents: 'none',
//   mixBlendMode: 'exclusion'
});

// CONTROLS (for debugging)
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;

// LIGHTING SYSTEM
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(2048, 2048);
directionalLight.shadow.camera.far = 20;
scene.add(directionalLight);

// CUBE SYSTEM
const cubes = [];
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({
  color: 0x333333,
  metalness: 0.5,
  roughness: 0.4,
});

const cubePositions = [
  { x: -1, y: 0.9, z: 0.4 },
  { x: 0, y: -0.1, z: 1.6 },
  { x: 1, y: -1.4, z: 0.5 }
];

cubePositions.forEach((pos, i) => {
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.set(pos.x, pos.y, pos.z);
  cube.castShadow = cube.receiveShadow = true;
  scene.add(cube);
  cubes.push({
    mesh: cube,
    speed: 0.2 + (i * 0.15),
    axis: new THREE.Vector3(
      Math.sin(i), 
      Math.cos(i * 0.5), 
      Math.sin(i * 0.3)
    ).normalize()
  });
});

// ---------- Add Interactive Cube Rotation Code Here ----------

// Declare variables for interactivity
const raycaster = new THREE.Raycaster();
const mouseVec = new THREE.Vector2();
let isDragging = false;
let selectedCube = null;
let previousMousePos = { x: 0, y: 0 };

// Mouse Down: Start dragging and select a cube if clicked
window.addEventListener('mousedown', (event) => {
  isDragging = true;
  previousMousePos.x = event.clientX;
  previousMousePos.y = event.clientY;

  // Convert mouse position to normalized device coordinates
  mouseVec.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouseVec.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouseVec, camera);

  // Check for intersections with the cubes
  const intersects = raycaster.intersectObjects(cubes.map(cubeObj => cubeObj.mesh));
  if (intersects.length > 0) {
    selectedCube = cubes.find(cubeObj => cubeObj.mesh === intersects[0].object);
  }
});

// Mouse Move: If dragging, rotate the selected cube
window.addEventListener('mousemove', (event) => {
  if (isDragging && selectedCube) {
    const deltaX = event.clientX - previousMousePos.x;
    const deltaY = event.clientY - previousMousePos.y;

    // Adjust rotation sensitivity as needed
    selectedCube.mesh.rotation.y += deltaX * 0.01;
    selectedCube.mesh.rotation.x += deltaY * 0.01;

    // Update previous mouse position for smooth dragging
    previousMousePos.x = event.clientX;
    previousMousePos.y = event.clientY;
  }
});

// Mouse Up: Stop dragging
window.addEventListener('mouseup', () => {
  isDragging = false;
  selectedCube = null;
});


// SPHERE SYSTEM
const spheres = [];
const sphereGeometry = new THREE.SphereGeometry(0.15, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0xf7e733,
  emissive: 0xf7e733,
  emissiveIntensity: 5,
});

for (let i = 0; i < 2; i++) {
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  const light = new THREE.PointLight(0xf7e733, 3, 10);
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  sphere.add(light);
  sphere.castShadow = true;
  scene.add(sphere);
  spheres.push({
    mesh: sphere,
    light,
    phase: i * (Math.PI * 0.5)
  });
}

// PARTICLES BACKGROUND
const particlesGeometry = new THREE.BufferGeometry();
const particleCount = 1000;
const posArray = new Float32Array(particleCount * 3);

for(let i = 0; i < particleCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 10;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.015,
  color: 0xf7e733,
  transparent: true,
  opacity: 0.25,
  depthWrite: false
});
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// ANIMATION SYSTEM
const clock = new THREE.Clock();
let time = 0;

// GSAP ANIMATIONS
gsap.from(camera.position, {
  z: 10,
  duration: 5,
  ease: "power3.out"
});

// RESIZE HANDLER
const debouncedResize = debounce(() => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}, 100);

window.addEventListener('resize', debouncedResize);

// MOUSE INTERACTION
const mouse = new THREE.Vector2();
window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

function animateNumbers() {
  const stats = document.querySelectorAll('.stat-number');
  
  stats.forEach(stat => {
      const target = parseInt(stat.dataset.target);
      const duration = 3; // Seconds
      
      gsap.to(stat, {
          innerText: target,
          duration: duration,
          snap: { innerText: 1 },
          onUpdate: function() {
              stat.innerText = `+${Math.floor(this.targets()[0].innerText)}`;
          },
          ease: "power4.out"
      });
  });
}

// Trigger after page load
window.addEventListener('load', () => {
  setTimeout(animateNumbers, 1000); // 1 second delay
});

function animateHeroText() {
  const heroTitle = document.querySelector('.hero h1');
  
  // Split text into letters for animation
  const text = heroTitle.innerText;
  heroTitle.innerHTML = text.split('').map((char, i) => 
      `<span class="letter" style="opacity:0;display:inline-block">${char}</span>`
  ).join('');

  // GSAP animation
  gsap.to(heroTitle, { opacity: 1, duration: 0.1 }); // reveal container
  gsap.to('.letter', {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.2,
      stagger: 0.03,
      ease: "back.out(1.7)",
      onStart: () => {
          // Add subtle background animation
          gsap.to('.hero::before', {
              opacity: 1,
              duration: 2,
              ease: "power2.out"
          });
      }
  });
}

// ANIMATION LOOP
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  time += delta;

  // Cube rotations
  cubes.forEach((cubeObj) => {
    if (selectedCube && cubeObj.mesh === selectedCube.mesh) return; // Skip if user is interacting
    cubeObj.mesh.rotation.x += cubeObj.speed * delta * cubeObj.axis.x;
    cubeObj.mesh.rotation.y += cubeObj.speed * delta * cubeObj.axis.y;
  });

  // Sphere orbits
  spheres.forEach((sphere, i) => {
    const angle = time * 0.5 + sphere.phase;
    const radius = 2.5 + Math.sin(time * 0.5 + i) * 0.3;
    sphere.mesh.position.set(
      Math.cos(angle) * radius,
      Math.sin(time * 1.2 + i) * 1.5,
      Math.sin(angle) * radius
    );
    sphere.light.intensity = 2 + Math.sin(time * 3 + i) * 1.5;
  });

  // Camera movement
  camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.05;
  camera.position.y += (-mouse.y * 0.5 - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  // controls.update();
  renderer.render(scene, camera);
}

animate();

// UTILITY FUNCTIONS
function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// CLEANUP ON UNLOAD

window.addEventListener('beforeunload', () => {
  renderer.dispose();
  scene.clear();
});

window.addEventListener('load', () => {
  setTimeout(() => {
      animateHeroText();
      animateNumbers(); // Existing number animation
  }, 500); // Start slightly sooner than numbers
});