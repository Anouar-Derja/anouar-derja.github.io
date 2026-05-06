 /* ===============================
   MOBILE NAVBAR ELEMENTS
================================ */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

/* ===============================
   SMOOTH SCROLL NAVIGATION
================================ */
const links = document.querySelectorAll(".nav-links a");

links.forEach(link => 
  link.addEventListener("click", e => {
    e.preventDefault();
    const targetId = link.getAttribute("data-page");
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
      // Scroll to the section with offset for the fixed navbar
      window.scrollTo({
        top: targetSection.offsetTop - 80, 
        behavior: "smooth"
      });
    }

    // Close mobile menu after clicking a link
    if (navLinks) navLinks.classList.remove("show");
  })
);
window.addEventListener("scroll", () => {
  const timeline = document.querySelector(".timeline-container");
  const fill = document.getElementById("timelineFill");
  
  if (!timeline || !fill) return;

  const rect = timeline.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // Calculate how much of the timeline is visible
  // Starts filling when the top hits 80% of the screen
  const start = windowHeight * 0.8;
  const progress = start - rect.top;
  const totalHeight = rect.height;

  let percentage = (progress / totalHeight) * 100;

  // Constrain between 0% and 100%
  percentage = Math.max(0, Math.min(100, percentage));

  fill.style.height = `${percentage}%`;
});
/* ===============================
   UPDATE ACTIVE LINK ON SCROLL
================================ */
window.addEventListener("scroll", () => {
  let current = "";
  const sections = document.querySelectorAll("section");
  const scrollY = window.pageYOffset;

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });

  // 🔥 FIX: if user is at bottom → force last section (CONTACT)
  if ((window.innerHeight + scrollY) >= document.body.offsetHeight - 10) {
    current = "contact";
  }

  links.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("data-page") === current) {
      link.classList.add("active");
    }
  });
});

/* ===============================
   MOBILE MENU TOGGLE
================================ */
menuToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  navLinks.classList.toggle("show");
});
/* ===============================
   REVEAL ANIMATION ON SCROLL
   (Fixes invisible skill cards)
================================ */
const observerOptions = {
  threshold: 0.15 // Trigger when 15% of the element is visible
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Adds the 'active' class which triggers the CSS opacity/transform
      entry.target.classList.add("active");
    }
  });
}, observerOptions);

// Select all elements with the 'reveal' class (like your skill cards)
document.querySelectorAll('.reveal').forEach(el => {
  observer.observe(el);
});
// Close menu if user clicks anywhere else on the screen
document.addEventListener("click", (e) => {
  if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
    navLinks.classList.remove("show");
  }
});
// Prevent menu from closing if user clicks inside the menu bar
navLinks.addEventListener("click", (e) => {
  e.stopPropagation();
});

const roles = [
  "Backend Developer",
  ".NET Developer",
  "Full-Stack Developer"
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typingElement = document.getElementById("typing");

function typeEffect() {
  const fullText = roles[roleIndex];

  // typing or deleting
  if (isDeleting) {
    charIndex--;
  } else {
    charIndex++;
  }

  typingElement.textContent = fullText.substring(0, charIndex);

  let speed = isDeleting ? 40 : 70; // faster & smoother

  // when word is complete
  if (!isDeleting && charIndex === fullText.length) {
    isDeleting = true;
    speed = 800; // shorter pause (fix lag feeling)
  }

  // when fully deleted
  else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    speed = 200;
  }

  setTimeout(typeEffect, speed);
}

typeEffect();
