/* ==========================================================================
   CURSOR — Magnetic dot + ring, hover morph, click particle burst
   ========================================================================== */

import { hasFinePointer, lerp } from './utilities.js';

if (hasFinePointer()) {
  document.body.classList.add('has-custom-cursor');

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.append(dot, ring);

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });

  function animateRing() {
    rx = lerp(rx, mx, 0.16);
    ry = lerp(ry, my, 0.16);
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover morph on interactive elements
  const interactiveSelector = 'a, button, input, textarea, .badge, .stat-card, [data-cursor-hover]';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelector)) {
      ring.classList.add('hover-link');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelector)) {
      ring.classList.remove('hover-link');
    }
  });

  // Hide cursor when leaving the viewport
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '0.55';
  });

  // Click particle burst
  document.addEventListener('mousedown', (e) => spawnBurst(e.clientX, e.clientY));

  function spawnBurst(x, y) {
    const count = 8;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      const angle = (Math.PI * 2 * i) / count;
      const dist = 30 + Math.random() * 20;
      p.style.cssText = `
        position:fixed; left:${x}px; top:${y}px;
        width:4px; height:4px; border-radius:50%;
        background: radial-gradient(circle, #4fe3ff, transparent);
        pointer-events:none; z-index:9997;
        transform: translate(-50%,-50%);
        transition: transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease;
      `;
      document.body.appendChild(p);
      requestAnimationFrame(() => {
        p.style.transform = `translate(${Math.cos(angle) * dist - 2}px, ${Math.sin(angle) * dist - 2}px)`;
        p.style.opacity = '0';
      });
      setTimeout(() => p.remove(), 520);
    }
  }

  // Magnetic pull for buttons/nav links — folds the shared hover lift/scale
  // into the same inline transform so magnetic elements move exactly like
  // every other button/card, just with an added pull toward the cursor.
  const magneticEls = document.querySelectorAll('.btn, .nav-links a, .social-link');
  const styles = getComputedStyle(document.documentElement);
  const hoverLift = parseFloat(styles.getPropertyValue('--motion-hover-lift')) || -6;
  const hoverScale = parseFloat(styles.getPropertyValue('--motion-hover-scale')) || 1.03;

  magneticEls.forEach((el) => {
    const isButton = el.classList.contains('btn');
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      const scale = isButton ? ` scale(${hoverScale})` : '';
      el.style.transform = `translate(${relX * 0.18}px, ${relY * 0.28 + hoverLift}px)${scale}`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });

  // Liquid ripple on button click (radial highlight from click point)
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width) * 100;
      const py = ((e.clientY - rect.top) / rect.height) * 100;
      btn.style.setProperty('--rx', px + '%');
      btn.style.setProperty('--ry', py + '%');
      btn.classList.remove('rippling');
      // force reflow so the animation can re-trigger on rapid clicks
      void btn.offsetWidth;
      btn.classList.add('rippling');
    });
  });
}
