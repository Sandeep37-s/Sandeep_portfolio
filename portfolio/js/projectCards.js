/* ==========================================================================
   PROJECT CARDS — 3D tilt (shared helper) + tag stagger indices
   Border glow, top gradient line, and shine sweep are handled purely by
   the shared .glass-card CSS (see components.css) — no duplicate CSS here.
   ========================================================================== */

import { hasFinePointer, applyTilt } from './utilities.js';

const cards = document.querySelectorAll('.project-card');

// Give each tag inside a card a --tag-i index so components.css can
// stagger them in together with the card's own scroll reveal.
cards.forEach((card) => {
  card.querySelectorAll('.project-tag').forEach((tag, i) => {
    tag.style.setProperty('--tag-i', i);
  });
});

if (hasFinePointer()) {
  cards.forEach((card) => applyTilt(card));
}
