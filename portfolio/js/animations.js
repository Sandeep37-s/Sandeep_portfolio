/* ==========================================================================
   ANIMATIONS (JS) — 3D card tilt + hero spotlight + skill badge stagger
   ========================================================================== */

import { hasFinePointer, applyTilt } from './utilities.js';

// Give each badge inside a skill category a --badge-i index so
// components.css can fade + float them in one-by-one.
document.querySelectorAll('.skill-badges').forEach((group) => {
  group.querySelectorAll('.badge').forEach((badge, i) => {
    badge.style.setProperty('--badge-i', i);
  });
});

if (hasFinePointer()) {
  /* ---- 3D tilt for skill & stat cards (project cards: see projectCards.js) ---- */
  document.querySelectorAll('.skill-category, .stat-card').forEach((card) => applyTilt(card));

  /* ---- Hero spotlight follows the mouse ---- */
  const hero = document.getElementById('hero');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      hero.style.setProperty('--spot-x', x + '%');
      hero.style.setProperty('--spot-y', y + '%');
    });
  }
}
