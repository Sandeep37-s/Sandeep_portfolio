/* ==========================================================================
   NAVBAR — Shrink on scroll + active link highlighting
   ========================================================================== */

const nav = document.querySelector('nav');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = Array.from(navLinks)
  .map((a) => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

function onScroll() {
  if (!nav) return;
  nav.classList.toggle('scrolled', window.scrollY > 60);

  let activeIndex = -1;
  sections.forEach((section, i) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.35) activeIndex = i;
  });

  navLinks.forEach((a, i) => a.classList.toggle('active', i === activeIndex));
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
