/* ==========================================================================
   COUNTERS — Animate any statistic number when it should be shown
   Hero stats count immediately after the intro (part of the load-in
   sequence); any other counter (e.g. the education CGPA) counts up when
   it scrolls into view. Both paths share the same animateCounter core.
   ========================================================================== */

import { prefersReducedMotion } from './utilities.js';

function animateCounter(el) {
  const raw = el.dataset.value || el.textContent;
  const numeric = parseFloat(raw);
  const suffix = raw.replace(String(numeric), '');
  const decimals = raw.includes('.') ? 1 : 0;

  if (prefersReducedMotion()) {
    el.textContent = numeric.toFixed(decimals) + suffix;
    return;
  }

  const duration = 1200;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = (numeric * eased).toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = numeric.toFixed(decimals) + suffix;
  }
  requestAnimationFrame(step);
}

/** Called once by main.js right after the intro finishes. */
export function playHeroCounters() {
  document.querySelectorAll('.hero-stats .stat-num').forEach(animateCounter);
}

/* ---- Any other counter (e.g. the education CGPA) counts up on scroll ---- */
const scrollCounters = document.querySelectorAll('.counter-num');
if (scrollCounters.length) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  scrollCounters.forEach((el) => counterObserver.observe(el));
}
