/* ==========================================================================
   SCROLL — Section reveal, timeline progress, subtle scroll parallax
   ========================================================================== */

import { clamp } from './utilities.js';

/* ---- Auto-stagger: give each group of sibling .reveal elements a --i
   index (0, 1, 2…) so components share one timing system without
   hardcoded "-delay-1/2/3/4" classes. Hero elements set their own --i
   inline (see index.html) since their order matters for the load-in
   sequence, so they're skipped here. ---- */
const groups = new Map();
document.querySelectorAll('.reveal:not(.reveal-hero)').forEach((el) => {
  const parent = el.parentElement;
  if (!groups.has(parent)) groups.set(parent, []);
  groups.get(parent).push(el);
});
groups.forEach((siblings) => {
  siblings.forEach((el, i) => el.style.setProperty('--i', i));
});

/* ---- Generic reveal-on-scroll for any .reveal element (excluding hero,
   which is revealed once by main.js right after the intro finishes) ---- */
const revealEls = document.querySelectorAll('.reveal:not(.reveal-hero)');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14, rootMargin: '0px 0px -40px 0px' }
);
revealEls.forEach((el) => revealObserver.observe(el));

/* ---- Timeline: glowing dots light up + connecting line fills as you scroll ---- */
const timeline = document.querySelector('.timeline');
if (timeline) {
  const dots = timeline.querySelectorAll('.timeline-dot');
  let progressLine = timeline.querySelector('.timeline-progress');
  if (!progressLine) {
    progressLine = document.createElement('div');
    progressLine.className = 'timeline-progress';
    timeline.appendChild(progressLine);
  }

  const dotObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('in-view');
      });
    },
    { threshold: 0.6 }
  );
  dots.forEach((dot) => dotObserver.observe(dot));

  const updateProgress = () => {
    const rect = timeline.getBoundingClientRect();
    const viewportCenter = window.innerHeight * 0.6;
    const total = rect.height;
    const scrolled = clamp(viewportCenter - rect.top, 0, total);
    progressLine.style.height = `${(scrolled / total) * 100}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* ---- Hero: subtle parallax drift on the grid overlay while scrolling ---- */
const heroGrid = document.querySelector('.hero-grid-overlay');
if (heroGrid) {
  window.addEventListener(
    'scroll',
    () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroGrid.style.transform = `translateY(${y * 0.15}px)`;
      }
    },
    { passive: true }
  );
}
