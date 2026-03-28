/* ============================================================
   FINPILOT — script.js
   Handles: scroll animations, parallax orbs, impact counters
   ============================================================ */

/* ─── 1. Scroll-triggered card reveals ─────────────────────
   Adds the .visible class to animated elements when they
   enter the viewport, staggering siblings by 100ms each.
   ────────────────────────────────────────────────────────── */
   const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
  
        const el       = entry.target;
        const siblings = el.parentElement.querySelectorAll(
          '.feature-card, .impact-item, .step, .audience-card'
        );
        const index = Array.from(siblings).indexOf(el);
  
        setTimeout(() => el.classList.add('visible'), index * 100);
        cardObserver.unobserve(el);
      });
    },
    { threshold: 0.12 }
  );
  
  document
    .querySelectorAll('.feature-card, .impact-item, .step, .audience-card')
    .forEach((el) => cardObserver.observe(el));
  
  
  /* ─── 2. Mouse-parallax on background orbs ─────────────────
     Orbs shift gently in response to cursor position, each
     at a slightly different factor to create depth.
     ────────────────────────────────────────────────────────── */
  document.addEventListener('mousemove', (e) => {
    const xRatio = e.clientX / window.innerWidth  - 0.5;   // -0.5 → 0.5
    const yRatio = e.clientY / window.innerHeight - 0.5;
  
    document.querySelectorAll('.bg-orb').forEach((orb, i) => {
      const factor = (i + 1) * 0.4;
      orb.style.transform =
        `translate(${xRatio * 20 * factor}px, ${yRatio * 20 * factor}px) scale(1)`;
    });
  });
  
  
  /* ─── 3. Impact numbers entrance animation ──────────────────
     Triggers a fadeUp animation on each .impact-num when it
     scrolls into view (separate from the card observer so the
     timing can be tuned independently).
     ────────────────────────────────────────────────────────── */
  const numObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.style.animation = 'fadeUp 0.8s ease both';
        numObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );
  
  document
    .querySelectorAll('.impact-num')
    .forEach((el) => numObserver.observe(el));
  
  
  /* ─── 4. Smooth nav background on scroll ───────────────────
     Slightly increases nav opacity once the user scrolls
     past the hero, giving a cleaner reading experience.
     ────────────────────────────────────────────────────────── */
  const nav = document.querySelector('nav');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.style.background = 'rgba(250, 248, 244, 0.92)';
      nav.style.boxShadow  = '0 2px 20px rgba(0,0,0,0.06)';
    } else {
      nav.style.background = 'rgba(250, 248, 244, 0.75)';
      nav.style.boxShadow  = 'none';
    }
  });
  
  
  /* ─── 5. Button ripple effect ───────────────────────────────
     Creates a brief radial ripple on .btn-primary clicks
     for a tactile micro-interaction.
     ────────────────────────────────────────────────────────── */
  document.querySelectorAll('.btn-primary').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect   = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
  
      const size = Math.max(rect.width, rect.height);
      const x    = e.clientX - rect.left  - size / 2;
      const y    = e.clientY - rect.top   - size / 2;
  
      Object.assign(ripple.style, {
        position:        'absolute',
        width:           `${size}px`,
        height:          `${size}px`,
        left:            `${x}px`,
        top:             `${y}px`,
        background:      'rgba(255,255,255,0.25)',
        borderRadius:    '50%',
        transform:       'scale(0)',
        animation:       'rippleAnim 0.55s ease-out forwards',
        pointerEvents:   'none',
        zIndex:          '2',
      });
  
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
  
  /* Inject ripple keyframe dynamically (avoids adding it to CSS) */
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    @keyframes rippleAnim {
      to { transform: scale(2.5); opacity: 0; }
    }
  `;
  document.head.appendChild(rippleStyle);