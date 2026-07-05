/* ==========================================================================
   PARTICLES — Ambient deep-space background
   Stars + drifting nodes + neural constellation lines + slow aurora wash.
   ========================================================================== */

import { prefersReducedMotion } from './utilities.js';

const canvas = document.getElementById('particles-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const reduced = prefersReducedMotion();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let W, H, particles, stars;
  let mouseX = 0.5, mouseY = 0.5; // normalized, for parallax

  function resize() {
    W = canvas.width = window.innerWidth * dpr;
    H = canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    buildField();
  }

  function buildField() {
    const density = window.innerWidth < 700 ? 0.00004 : 0.00007;
    const count = Math.min(120, Math.floor(W * H * density));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: (Math.random() * 1.4 + 0.5) * dpr,
      alpha: Math.random() * 0.5 + 0.15,
      hue: Math.random() > 0.5 ? 'cyan' : 'violet',
    }));

    const starCount = Math.min(80, Math.floor(W * H * 0.00003));
    stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1 * dpr,
      twinkle: Math.random() * Math.PI * 2,
    }));
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX / window.innerWidth;
    mouseY = e.clientY / window.innerHeight;
  });

  resize();

  let auroraShift = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Slow aurora wash
    auroraShift += 0.0015;
    const parallaxX = (mouseX - 0.5) * 40 * dpr;
    const parallaxY = (mouseY - 0.5) * 40 * dpr;
    const aurora = ctx.createRadialGradient(
      W * 0.3 + Math.sin(auroraShift) * 60 * dpr + parallaxX * 0.3,
      H * 0.25 + parallaxY * 0.3,
      0,
      W * 0.3,
      H * 0.25,
      W * 0.6
    );
    aurora.addColorStop(0, 'rgba(155,107,255,0.05)');
    aurora.addColorStop(1, 'rgba(3,3,3,0)');
    ctx.fillStyle = aurora;
    ctx.fillRect(0, 0, W, H);

    const aurora2 = ctx.createRadialGradient(
      W * 0.75 - parallaxX * 0.2,
      H * 0.7 - parallaxY * 0.2,
      0,
      W * 0.75,
      H * 0.7,
      W * 0.5
    );
    aurora2.addColorStop(0, 'rgba(79,227,255,0.04)');
    aurora2.addColorStop(1, 'rgba(3,3,3,0)');
    ctx.fillStyle = aurora2;
    ctx.fillRect(0, 0, W, H);

    // Distant stars (subtle twinkle, gentle parallax)
    stars.forEach((s) => {
      s.twinkle += 0.02;
      const a = 0.3 + Math.sin(s.twinkle) * 0.25;
      ctx.beginPath();
      ctx.arc(s.x + parallaxX * 0.15, s.y + parallaxY * 0.15, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(210,225,255,${a})`;
      ctx.fill();
    });

    // Drifting nodes
    particles.forEach((p) => {
      if (!reduced) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
      }
      const color = p.hue === 'cyan' ? '79,227,255' : '155,107,255';
      ctx.beginPath();
      ctx.arc(p.x + parallaxX * 0.4, p.y + parallaxY * 0.4, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color},${p.alpha})`;
      ctx.fill();
    });

    // Neural constellation lines between nearby nodes
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 110 * dpr;
        if (dist < maxDist) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x + parallaxX * 0.4, particles[i].y + parallaxY * 0.4);
          ctx.lineTo(particles[j].x + parallaxX * 0.4, particles[j].y + parallaxY * 0.4);
          ctx.strokeStyle = `rgba(120,190,255,${0.07 * (1 - dist / maxDist)})`;
          ctx.lineWidth = 0.6 * dpr;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
}
