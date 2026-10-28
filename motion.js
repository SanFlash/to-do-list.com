(() => {
  'use strict';
  const reduced = () => document.documentElement.classList.contains('motion-reduced')
    || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ready = fn => document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', fn, { once: true }) : fn();

  ready(() => {
    const body = document.body;
    if (!body || body.dataset.motionReady === 'true') return;
    body.dataset.motionReady = 'true';

    // Decorative canvas: low-cost gold/iris particles connected by faint threads.
    const canvas = document.createElement('canvas');
    canvas.className = 'motion-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    body.prepend(canvas);
    const ctx = canvas.getContext('2d', { alpha: true });
    const particles = [];
    let width = 0, height = 0, raf = 0, pointer = { x: -1000, y: -1000 };
    const mobile = () => window.matchMedia('(max-width: 760px)').matches;
    const density = () => Math.min(mobile() ? 28 : 58, Math.max(18, Math.floor(window.innerWidth / 25)));

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      canvas.style.width = width + 'px'; canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles.length = 0;
      for (let i = 0; i < density(); i++) particles.push({
        x: Math.random() * width, y: Math.random() * height,
        vx: (Math.random() - .5) * .19, vy: (Math.random() - .5) * .19,
        r: Math.random() * 1.8 + .45, phase: Math.random() * Math.PI * 2
      });
    }
    function draw(time) {
      if (reduced() || document.hidden) { raf = 0; ctx.clearRect(0, 0, width, height); return; }
      ctx.clearRect(0, 0, width, height);
      const linkDistance = mobile() ? 95 : 135;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < -8) p.x = width + 8; if (p.x > width + 8) p.x = -8;
        if (p.y < -8) p.y = height + 8; if (p.y > height + 8) p.y = -8;
        const pulse = .42 + (Math.sin(time * .0007 + p.phase) + 1) * .2;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(220, 190, 130,' + pulse + ')'; ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j], dx = p.x - q.x, dy = p.y - q.y, dist = Math.hypot(dx, dy);
          if (dist < linkDistance) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = 'rgba(191, 177, 142,' + ((1 - dist / linkDistance) * .11) + ')';
            ctx.lineWidth = .65; ctx.stroke();
          }
        }
      }
      // A quiet cursor aura adds depth without stealing input focus.
      if (!mobile() && pointer.x > 0 && pointer.y > 0) {
        const glow = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 125);
        glow.addColorStop(0, 'rgba(214,183,122,.045)'); glow.addColorStop(1, 'rgba(214,183,122,0)');
        ctx.fillStyle = glow; ctx.fillRect(pointer.x - 125, pointer.y - 125, 250, 250);
      }
      raf = requestAnimationFrame(draw);
    }
    function start() { if (!reduced() && !raf) raf = requestAnimationFrame(draw); }
    function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; if (ctx) ctx.clearRect(0,0,width,height); }
    resize(); start();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', e => { pointer.x = e.clientX; pointer.y = e.clientY; }, { passive: true });
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); });
    const motionObserver = new MutationObserver(() => {
      if (reduced()) {
        stop();
        if (window.gsap) window.gsap.globalTimeline.pause();
      } else {
        start();
        if (window.gsap) window.gsap.globalTimeline.resume();
      }
    });
    motionObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    // The legacy app keeps its persisted reduced-motion preference on body.
    const bodyMotionObserver = new MutationObserver(() => {
      if (reduced()) {
        stop();
        if (window.gsap) window.gsap.globalTimeline.pause();
      } else {
        start();
        if (window.gsap) window.gsap.globalTimeline.resume();
      }
    });
    bodyMotionObserver.observe(body, { attributes: true, attributeFilter: ['class'] });

    // The animation layer is deliberately additive: no task state or app controls are changed.
    if (!reduced() && window.gsap) {
      if (window.gsap.registerPlugin && window.Flip) window.gsap.registerPlugin(window.Flip);
      const gsap = window.gsap;
      gsap.to('.ambient-one', { x: -35, y: 30, scale: 1.12, duration: 8, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      gsap.to('.ambient-two', { x: 45, y: -25, scale: 1.18, duration: 10, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      gsap.to('.hero-art-glow', { scale: 1.15, opacity: .8, duration: 3.8, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      gsap.to('.crystal-core', { scale: 1.18, opacity: .82, duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      gsap.to('.focus-ring.ring-one', { rotation: 28, scale: 1.1, duration: 9, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      gsap.to('.focus-ring.ring-two', { rotation: -22, scale: .92, duration: 7, yoyo: true, repeat: -1, ease: 'sine.inOut' });

      // Subtle perspective response, disabled for touch devices and reduced-motion users.
      const art = document.querySelector('.hero-art');
      if (art && !mobile()) {
        art.addEventListener('pointermove', e => {
          if (reduced()) return;
          const r = art.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - .5;
          const py = (e.clientY - r.top) / r.height - .5;
          gsap.to('.hero-crystal', { rotateY: 18 + px * 14, rotateX: -12 - py * 12, duration: .5, overwrite: true, ease: 'power2.out' });
        });
        art.addEventListener('pointerleave', () => gsap.to('.hero-crystal', { rotateY: 0, rotateX: 0, duration: .7, ease: 'power3.out' }));
      }

      // Stagger entrance on view changes, while honoring the app's own reduced-motion switch.
      document.addEventListener('click', e => {
        const control = e.target.closest('[data-view], [data-project]');
        if (!control || reduced()) return;
        requestAnimationFrame(() => {
          const visible = document.querySelector('.view-panel:not([hidden])');
          if (visible) gsap.fromTo(visible.querySelectorAll('.page-intro > *, .section-heading, .stat-card, .settings-card, .date-group'), 
            { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: .38, stagger: .045, ease: 'power2.out', clearProps: 'transform' });
        });
      });

      // Glow feedback for primary actions; actual task actions remain in script.js.
      document.addEventListener('pointerover', e => {
        const b = e.target.closest('.primary-button, .add-task-button, .quick-add > button');
        if (b && !reduced()) gsap.to(b, { y: -1, duration: .16, overwrite: true, ease: 'power1.out' });
      });
      document.addEventListener('pointerout', e => {
        const b = e.target.closest('.primary-button, .add-task-button, .quick-add > button');
        if (b && !reduced()) gsap.to(b, { y: 0, duration: .2, overwrite: true, ease: 'power1.out' });
      });
    }
  });
})();