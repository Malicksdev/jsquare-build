document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section");
  let lastBg = null;
  
  // Set initial background color from the first section
  if (sections.length > 0) {
    lastBg = sections[0].getAttribute("data-bg");
    document.body.style.backgroundColor = lastBg;
    // Also update container colors for the first section
    const initialContainerColor = sections[0].getAttribute("data-container-bg");
    if (initialContainerColor) {
      sections[0].querySelectorAll(".paragraph-container").forEach(container => {
        container.style.backgroundColor = initialContainerColor;
      });
    }
  }
  
  // Function to update background colors based on scroll position
  const handleScroll = () => {
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        // Update body background color
        const newColor = section.getAttribute("data-bg");
        if (newColor && newColor !== lastBg) {
          document.body.style.backgroundColor = newColor;
          lastBg = newColor;
        }
        
        // Update paragraph container backgrounds for the active section
        const containerColor = section.getAttribute("data-container-bg");
        if (containerColor) {
          section.querySelectorAll(".paragraph-container").forEach(container => {
            container.style.backgroundColor = containerColor;
          });
        }
      }
    });
  };
  
  window.addEventListener("scroll", handleScroll);
  
  // Enhance section transitions with GSAP ScrollTrigger
  gsap.utils.toArray("section").forEach((section) => {
    gsap.fromTo(
      section,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          end: "top 25%",
          scrub: true,
        },
      }
    );
  });
  
  // Title Snap to Top Left & Content Scroll Effect
  gsap.utils.toArray(".section-title").forEach((title) => {
    gsap.to(title, {
      scrollTrigger: {
        trigger: title,
        start: "top 10%",
        end: "top 5%",
        scrub: true,
        pin: true,
        pinSpacing: false,
      },
    });
  });
  
  // Horizontal scrolling for the portfolio gallery using GSAP ScrollTrigger
gsap.to(".portfolio-gallery", {
  x: () => -(
    document.querySelector(".portfolio-gallery").scrollWidth -
    document.querySelector(".portfolio-wrapper").offsetWidth
  ),
  ease: "none",
  scrollTrigger: {
    trigger: ".portfolio-wrapper", // Use the portfolio wrapper as the trigger
    start: "top top",               // When the top of the wrapper hits the top of the viewport
    end: () => "+=" + (
      document.querySelector(".portfolio-gallery").scrollWidth -
      document.querySelector(".portfolio-wrapper").offsetWidth
    ),
    scrub: true,
    pin: ".portfolio-wrapper",      // Explicitly pin the wrapper, not the entire section
    anticipatePin: 1,
    markers: true, // Remove or comment out markers when debugging is complete
  }
});




});