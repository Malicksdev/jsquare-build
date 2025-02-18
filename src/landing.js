// landing.js
export function initLandingPage() {
    // Select all landing page sections
    const sections = document.querySelectorAll(".content-section");
  
    // Function to return a background color based on section index
    function getBgColor(index) {
      const colors = ["#F2FCE2", "#FEF7CD", "#FDE1D3", "#E5DEFF"];
      return colors[index] || "#F2FCE2";
    }
  
    // Scroll event handler: update background color based on current section
    function handleScroll() {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          document.body.style.backgroundColor = getBgColor(index);
        }
      });
    }
  
    window.addEventListener("scroll", handleScroll);
  
    // Set the initial background color and transition
    document.body.style.backgroundColor = getBgColor(0);
    document.body.style.transition = "background-color 0.8s ease-in-out";
  }
  