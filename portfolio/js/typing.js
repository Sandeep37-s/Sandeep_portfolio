/* ==========================================================================
   TYPING — Typewriter effect for the hero role line
   ========================================================================== */

import { prefersReducedMotion } from './utilities.js';

const target = document.getElementById('role-text');

const roles = [
  '// AI/ML Engineer · GenAI Developer · CSE Student',
  '// LLM Pipelines · RAG Applications · Multi-Agent AI',
  '// Flask · FastAPI · Computer Vision · NLP',
];

if (target) {
  if (prefersReducedMotion()) {
    target.textContent = roles[0];
  } else {
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let holdTicks = 0;

    const TYPE_SPEED = 42;
    const DELETE_SPEED = 22;
    const HOLD_TICKS = 55;
    const NEXT_DELAY = 280;

    function tick() {
      const current = roles[roleIndex];

      if (holdTicks > 0) {
        holdTicks--;
        setTimeout(tick, TYPE_SPEED);
        return;
      }

      if (!deleting) {
        charIndex++;
        target.textContent = current.slice(0, charIndex);
        if (charIndex >= current.length) {
          deleting = true;
          holdTicks = HOLD_TICKS;
        }
        setTimeout(tick, TYPE_SPEED);
      } else {
        charIndex--;
        target.textContent = current.slice(0, charIndex);
        if (charIndex <= 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(tick, NEXT_DELAY);
        } else {
          setTimeout(tick, DELETE_SPEED);
        }
      }
    }

    setTimeout(tick, 900);
  }
}
