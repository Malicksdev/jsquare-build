import './scene.js';
import './style.css';


document.addEventListener('DOMContentLoaded', () => {
    const exploreButton = document.querySelector('.explore-button');
    
    // Optional: log to ensure the button is found
    console.log('Explore button found:', exploreButton);
  
    exploreButton.addEventListener('click', () => {
      console.log('Explore button clicked!');
      window.location.href = 'explore.html';
    });
  });
  