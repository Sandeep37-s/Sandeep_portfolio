/* ==========================================================================
   MAIN — Application entry point
   Runs the intro sequence, then reveals the site and boots every module.
   Feature modules below self-initialize on import.
   ========================================================================== */

import { runIntro } from './intro.js';

import './particles.js';
import './cursor.js';
import './typing.js';
import './scroll.js';
import './navbar.js';
import { playHeroCounters } from './counters.js';
import './animations.js';
import './projectCards.js';

const mainContent = document.getElementById('main-content');
const heroRevealEls = document.querySelectorAll('.reveal-hero');

runIntro().then(() => {
  if (mainContent) {
    mainContent.classList.add('revealed');
  }
  // Hero elements use the same .reveal/.visible system as the rest of the
  // site, but are triggered manually here (once, right after the intro)
  // instead of by the IntersectionObserver in scroll.js, since they're
  // already inside the viewport and would otherwise fire immediately.
  heroRevealEls.forEach((el) => el.classList.add('visible'));
  playHeroCounters();
});
