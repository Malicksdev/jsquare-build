import * as THREE from 'three';
import gsap from 'gsap'; // Import GSA

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

const exploreButton = document.querySelector('.explore-button');
const heroSection = document.querySelector('.hero');
const statsContainer = document.querySelector('.stats-container');
const threeContainer = document.querySelector('.three-container'); // Select the *container* of the 3D scene
const canvas = document.getElementById('threejs-canvas'); // Select the canvas element itself

let animationLoopRunning = true; // Flag to control the animation loop

exploreButton.addEventListener('click', () => {
    gsap.to([heroSection, statsContainer], { // Animate only hero and stats
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
            heroSection.style.display = 'none';
            statsContainer.style.display = 'none';
            
            document.body.style.overflowY = 'auto';

            addServicesSection();
            addPortfolioSection();

        }
    });

    gsap.to(threeContainer, { // Animate the threeContainer
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
            animationLoopRunning = false; // Stop animation loop *after* threeContainer fades
            renderer.clear(); // Clear the renderer
            renderer.forceContextLoss(); // Force context loss

            if (canvas.parentNode) {
                canvas.parentNode.removeChild(canvas); // Remove canvas from DOM
            }
        }
    })
});

function addServicesSection() {
    const servicesSection = document.createElement('section');
    servicesSection.id = "services";
    servicesSection.classList.add("services"); // Add your CSS class
    servicesSection.innerHTML = `
        <div class="container">
            <h2>Our Services</h2>
            <div class="service-grid">
                <div class="service">
                    <i class="fas fa-code"></i>  <h3>Web Development</h3>
                    <p>We build modern, responsive websites tailored to your business needs.</p>
                </div>
                <div class="service">
                    <i class="fas fa-design"></i> <h3>UI/UX Design</h3>
                    <p>We create intuitive and visually appealing user interfaces.</p>
                </div>
                <div class="service">
                    <i class="fas fa-bullhorn"></i> <h3>Digital Marketing</h3>
                    <p>We help you reach your target audience through effective marketing strategies.</p>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(servicesSection);
}

function addPortfolioSection() {
    const portfolioSection = document.createElement('section');
    portfolioSection.id = "portfolio";
    portfolioSection.classList.add("portfolio");
    portfolioSection.innerHTML = `
        <div class="container">
            <h2>Portfolio</h2>
            <div class="portfolio-grid">
                <div class="portfolio-item">
                    <img src="placeholder.jpg" alt="Project 1">
                    <h3>Project 1</h3>
                    <p>Short description of project 1.</p>
                </div>
                </div>
        </div>
    `;
    document.body.appendChild(portfolioSection);
}

function animate() {
    if (animationLoopRunning) { // Only run if the flag is true
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
}

animate();