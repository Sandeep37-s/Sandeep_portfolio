/* ==========================================================================
   INTRO — "Neural Singularity" cinematic loading sequence
   Particles (neural nodes) spiral into a glowing singularity, then the
   singularity flashes and expands to reveal the portfolio underneath.
   ========================================================================== */

import { prefersReducedMotion, clamp, lerp } from './utilities.js';

const PHASE_SCATTER_END = 900;    // ms — nodes fade in, drifting freely
const PHASE_COLLAPSE_END = 3400;  // ms — nodes spiral inward
const PHASE_FLASH_END = 4300;     // ms — singularity flashes & expands

export function runIntro() {
  return new Promise((resolve) => {
    const loader = document.getElementById('loader');
    const canvas = document.getElementById('intro-canvas');
    const skipBtn = document.getElementById('skip-intro');
    const controller = { cancelled: false };
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      controller.cancelled = true;
      canvas.style.transition = 'opacity 0.5s ease';
      canvas.style.opacity = '0';
      skipBtn.style.opacity = '0';
      skipBtn.style.pointerEvents = 'none';
      setTimeout(() => {
        canvas.remove();
        skipBtn.remove();
        resolve();
      }, 500);
    };

    // Reduced motion / no-canvas-support: skip straight to content.
    if (prefersReducedMotion() || !canvas || !canvas.getContext) {
      loader?.remove();
      canvas?.remove();
      skipBtn?.remove();
      resolve();
      return;
    }

    // Minimum loader time so it doesn't just flash.
    setTimeout(() => {
      loader.style.transition = 'opacity 0.35s ease';
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 350);
      startCanvasIntro(canvas, finish, controller);
    }, 500);

    skipBtn.addEventListener('click', finish, { once: true });
  });
}

function startCanvasIntro(canvas, onDone, controller) {
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W, H, cx, cy;

  function resize() {
    W = canvas.width = window.innerWidth * dpr;
    H = canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    cx = W / 2;
    cy = H / 2;
  }
  resize();
  window.addEventListener('resize', resize);

  const NODE_COUNT = window.innerWidth < 700 ? 90 : 180;
  const nodes = Array.from({ length: NODE_COUNT }, () => {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * Math.max(W, H) * 0.55 + 40;
    return {
      angle,
      radius,
      baseRadius: radius,
      speed: 0.15 + Math.random() * 0.3,
      size: Math.random() * 1.8 + 0.6,
      alpha: 0,
      twinkle: Math.random() * Math.PI * 2,
    };
  });

  const start = performance.now();
  let rafId;

  function frame(now) {
    if (controller.cancelled) {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      return;
    }

    const t = now - start;
    ctx.clearRect(0, 0, W, H);

    // Deep space vignette base
    ctx.fillStyle = '#030303';
    ctx.fillRect(0, 0, W, H);

    if (t < PHASE_SCATTER_END) {
      drawScatter(t / PHASE_SCATTER_END);
    } else if (t < PHASE_COLLAPSE_END) {
      drawCollapse((t - PHASE_SCATTER_END) / (PHASE_COLLAPSE_END - PHASE_SCATTER_END));
    } else if (t < PHASE_FLASH_END) {
      drawFlash((t - PHASE_COLLAPSE_END) / (PHASE_FLASH_END - PHASE_COLLAPSE_END));
    } else {
      onDone();
      return;
    }

    rafId = requestAnimationFrame(frame);
  }

  function drawScatter(p) {
    nodes.forEach((n) => {
      n.alpha = clamp(p * 1.4, 0, 0.85);
      n.twinkle += 0.03;
      const x = cx + Math.cos(n.angle) * n.radius;
      const y = cy + Math.sin(n.angle) * n.radius;
      const flicker = 0.6 + Math.sin(n.twinkle) * 0.4;
      drawNode(x, y, n.size, n.alpha * flicker);
    });
  }

  function drawCollapse(p) {
    const eased = 1 - Math.pow(1 - p, 3); // ease-out-cubic
    const connections = [];

    nodes.forEach((n) => {
      n.radius = lerp(n.baseRadius, 0, eased);
      n.angle += n.speed * (0.02 + eased * 0.35); // spiral faster as it collapses
      const x = cx + Math.cos(n.angle) * n.radius;
      const y = cy + Math.sin(n.angle) * n.radius;
      n.x = x; n.y = y;
      drawNode(x, y, n.size + eased * 1.2, 0.85);
      connections.push([x, y]);
    });

    // Neural-network connective lines between nearby nodes (early collapse only)
    if (p < 0.6) {
      ctx.lineWidth = 1;
      for (let i = 0; i < connections.length; i += 3) {
        const [x1, y1] = connections[i];
        const [x2, y2] = connections[(i + 3) % connections.length];
        const dist = Math.hypot(x2 - x1, y2 - y1);
        if (dist < W * 0.12) {
          ctx.strokeStyle = `rgba(79,227,255,${0.12 * (1 - p)})`;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }
    }

    // Growing singularity core + accretion glow
    const coreRadius = lerp(2, 46, eased) * dpr;
    const glowRadius = coreRadius * 5;
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius);
    glow.addColorStop(0, `rgba(155,107,255,${0.55 * eased})`);
    glow.addColorStop(0.4, `rgba(79,227,255,${0.28 * eased})`);
    glow.addColorStop(1, 'rgba(3,3,3,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#050505';
    ctx.beginPath();
    ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2 * dpr;
    ctx.strokeStyle = `rgba(255,255,255,${0.6 * eased})`;
    ctx.stroke();
  }

  function drawFlash(p) {
    const eased = p * p; // ease-in
    const maxDim = Math.max(W, H) * 1.4;
    const radius = lerp(46 * dpr, maxDim, eased);
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    glow.addColorStop(0, `rgba(255,255,255,${1 - eased * 0.4})`);
    glow.addColorStop(0.15, `rgba(180,225,255,${0.9 - eased * 0.5})`);
    glow.addColorStop(0.5, `rgba(79,227,255,${0.4 * (1 - eased)})`);
    glow.addColorStop(1, 'rgba(3,3,3,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawNode(x, y, size, alpha) {
    ctx.beginPath();
    ctx.arc(x, y, size * dpr, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(150,220,255,${alpha})`;
    ctx.fill();
  }

  rafId = requestAnimationFrame(frame);
}
