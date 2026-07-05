/* ==========================================================================
   UTILITIES — Shared helper functions
   ========================================================================== */

/** Linear interpolation */
export function lerp(start, end, t) {
  return start + (end - start) * t;
}

/** Clamp a value between min and max */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/** Map a value from one range to another */
export function mapRange(value, inMin, inMax, outMin, outMax) {
  return outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);
}

/** Random float between min and max */
export function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

/** Debounce a function call */
export function debounce(fn, delay = 150) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/** True if the user prefers reduced motion */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** True if the primary input is a fine pointer (mouse/trackpad) */
export function hasFinePointer() {
  return window.matchMedia('(pointer: fine)').matches;
}

/**
 * Attach the site's ONE 3D tilt behavior to an element. Used by both
 * js/animations.js (skill/stat cards) and js/projectCards.js (project
 * cards) so the tilt math is defined a single time.
 */
export function applyTilt(el, { maxX = 8, maxY = 10, lift } = {}) {
  const liftPx = lift ?? parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion-hover-lift')) ?? -6;
  el.style.transformStyle = 'preserve-3d';
  el.style.willChange = 'transform';

  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const rotX = clamp(-py * maxX, -maxX, maxX);
    const rotY = clamp(px * maxY, -maxY, maxY);
    el.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(${liftPx}px)`;
  });

  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
}

/** Simple pub/sub event bus used to coordinate the intro -> content handoff */
export const bus = {
  events: {},
  on(name, cb) {
    (this.events[name] ||= []).push(cb);
  },
  emit(name, payload) {
    (this.events[name] || []).forEach((cb) => cb(payload));
  },
};
