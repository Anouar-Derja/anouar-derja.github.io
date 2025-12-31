 /* ===============================
   MOBILE NAVBAR ELEMENTS
================================ */
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");


/* ===============================
   PAGE NAVIGATION + HISTORY
================================ */
const links = document.querySelectorAll(".nav-links a");
const pages = document.querySelectorAll(".page");

function showPage(pageId) {
  pages.forEach(page => page.classList.remove("active"));
  links.forEach(link => link.classList.remove("active"));

  const targetPage = document.getElementById(pageId);
  const targetLink = document.querySelector(`[data-page="${pageId}"]`);

  if (targetPage) targetPage.classList.add("active");
  if (targetLink) targetLink.classList.add("active");
   // FORCE reveal when page becomes active
  const reveals = targetPage?.querySelectorAll(".reveal");
  reveals?.forEach(el => el.classList.add("active"));
  // Close mobile menu after click
  if (navLinks) navLinks.classList.remove("show");
}

links.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const pageId = link.dataset.page;
    history.pushState({ page: pageId }, "", `#${pageId}`);
    showPage(pageId);
  });
});

window.addEventListener("popstate", () => {
  const page = location.hash.replace("#", "") || "home";
  showPage(page);
});

document.addEventListener("DOMContentLoaded", () => {
  const page = location.hash.replace("#", "") || "home";
  showPage(page);
});


/* ===============================
   MOBILE MENU TOGGLE
================================ */
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });
}
