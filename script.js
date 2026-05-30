/* ============================================================
   MENTORIA AFILIADO DO ZERO — Premium JavaScript
   Maiane Bastos | Vanilla JS
   ============================================================ */

'use strict';

/* ─────────────────────────────────────────────
   1. PARTICLES CANVAS
   ───────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles, animFrame;

  const COLORS = ['rgba(123,47,255,', 'rgba(255,79,216,', 'rgba(155,89,255,'];
  const COUNT  = window.innerWidth < 600 ? 40 : 70;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     Math.random() * 1.8 + 0.3,
      dx:    (Math.random() - 0.5) * 0.4,
      dy:    (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.1,
      color
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;

      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;
    });
    animFrame = requestAnimationFrame(draw);
  }

  init();
  draw();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); }, 200);
  });
})();

/* ─────────────────────────────────────────────
   2. URGENCY BAR CLOSE
   ───────────────────────────────────────────── */
(function initUrgencyBar() {
  const bar   = document.getElementById('urgency-bar');
  const close = document.getElementById('urgency-close');
  if (!bar || !close) return;

  close.addEventListener('click', () => {
    bar.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    bar.style.opacity    = '0';
    bar.style.transform  = 'translateY(-100%)';
    setTimeout(() => bar.remove(), 350);
  });
})();

/* ─────────────────────────────────────────────
   3. SCROLL REVEAL (IntersectionObserver)
   ───────────────────────────────────────────── */
(function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.reveal-up, .reveal-card, .reveal-left, .reveal-right'
  );

  if (!targets.length) return;

  // Staggered delay for cards inside grids
  function applyStagger(el, index) {
    if (el.classList.contains('reveal-card')) {
      el.style.transitionDelay = (index * 0.08) + 's';
    }
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  // Group cards by parent for stagger calculation
  const cardGroups = {};
  targets.forEach(el => {
    if (el.classList.contains('reveal-card')) {
      const parent = el.parentElement;
      if (!cardGroups[parent]) cardGroups[parent] = [];
      cardGroups[parent].push(el);
    }
  });

  Object.values(cardGroups).forEach(group => {
    group.forEach((el, i) => applyStagger(el, i));
  });

  targets.forEach(el => io.observe(el));
})();

/* ─────────────────────────────────────────────
   4. FAB — Floating Action Button Visibility
   ───────────────────────────────────────────── */
(function initFAB() {
  const fab  = document.getElementById('fab');
  const hero = document.getElementById('hero');
  if (!fab || !hero) return;

  let lastY = 0;

  function onScroll() {
    const heroBottom = hero.getBoundingClientRect().bottom;
    const currentY   = window.scrollY;
    const scrollingDown = currentY > lastY;
    lastY = currentY;

    if (heroBottom < 0) {
      fab.classList.add('fab-visible');
    } else {
      fab.classList.remove('fab-visible');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ─────────────────────────────────────────────
   5. RIPPLE EFFECT on CTA Buttons
   ───────────────────────────────────────────── */
(function initRipple() {
  const buttons = document.querySelectorAll('.btn-primary, .btn-final, .fab');

  buttons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect   = btn.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.left = x + 'px';
      ripple.style.top  = y + 'px';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });
})();

/* ─────────────────────────────────────────────
   6. MAGNETIC BUTTON EFFECT
   ───────────────────────────────────────────── */
(function initMagnetic() {
  // Only on non-touch devices
  if ('ontouchstart' in window) return;

  const btns = document.querySelectorAll('.btn-primary, .btn-final');
  btns.forEach(btn => {
    btn.addEventListener('mousemove', function (e) {
      const rect   = btn.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) * 0.3;
      const dy     = (e.clientY - cy) * 0.3;
      btn.style.transform = `translate(${dx}px, ${dy}px) scale(1.04)`;
    });

    btn.addEventListener('mouseleave', function () {
      btn.style.transform = '';
    });
  });
})();

/* ─────────────────────────────────────────────
   7. SMOOTH PARALLAX (subtle)
   ───────────────────────────────────────────── */
(function initParallax() {
  if ('ontouchstart' in window) return;

  const orbs = document.querySelectorAll('.hero-orb');
  if (!orbs.length) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    orbs.forEach((orb, i) => {
      const speed = (i + 1) * 0.08;
      orb.style.transform = `translateY(${y * speed}px)`;
    });
  }, { passive: true });
})();

/* ─────────────────────────────────────────────
   8. CURSOR GLOW (desktop only)
   ───────────────────────────────────────────── */
(function initCursorGlow() {
  if ('ontouchstart' in window) return;

  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  Object.assign(glow.style, {
    position:     'fixed',
    width:        '300px',
    height:       '300px',
    borderRadius: '50%',
    background:   'radial-gradient(circle, rgba(123,47,255,0.06) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex:       '1',
    transform:    'translate(-50%, -50%)',
    transition:   'left 0.15s ease, top 0.15s ease',
    left:         '-500px',
    top:          '-500px',
  });
  document.body.appendChild(glow);

  window.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
})();

/* ─────────────────────────────────────────────
   9. URGENCY BAR scroll compensation
   ───────────────────────────────────────────── */
(function adjustScrollOffset() {
  const bar = document.getElementById('urgency-bar');
  if (!bar) return;

  function setOffset() {
    const h = bar.offsetHeight || 0;
    document.documentElement.style.scrollPaddingTop = h + 'px';
  }

  setOffset();
  window.addEventListener('resize', setOffset, { passive: true });
})();

/* ─────────────────────────────────────────────
   10. COUNTER ANIMATION (hero social proof)
   ───────────────────────────────────────────── */
(function initCounters() {
  function animateValue(el, from, to, duration) {
    let start = null;
    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = '+' + Math.floor(from + (to - from) * ease).toLocaleString('pt-BR');
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const sp = document.getElementById('social-proof');
  if (!sp) return;

  let counted = false;
  const io = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !counted) {
      counted = true;
      const strong = sp.querySelector('strong');
      if (strong) {
        strong.textContent = '+0';
        animateValue(strong, 0, 1200, 1800);
      }
    }
  }, { threshold: 0.5 });

  io.observe(sp);
})();

/* ─────────────────────────────────────────────
   11. YOUTUBE AUDIO TOGGLE
   ───────────────────────────────────────────── */
(function initAudioToggle() {
  const btn       = document.getElementById('audio-toggle-btn');
  const label     = document.getElementById('audio-label');
  const iconMuted = document.getElementById('icon-muted');
  const iconSound = document.getElementById('icon-sound');
  const frame     = document.getElementById('video-frame');

  if (!btn || !frame) return;

  let isMuted   = true;
  const VIDEO_ID = 'uo_O3cs-RQ0';

  const baseParams = 'autoplay=1&loop=1&playlist=' + VIDEO_ID +
                     '&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&playsinline=1&enablejsapi=1';

  function buildSrc(muted) {
    return 'https://www.youtube.com/embed/' + VIDEO_ID + '?' + baseParams + '&mute=' + (muted ? '1' : '0');
  }

  function setMuteState(muted) {
    isMuted = muted;

    // Recarrega o iframe com mute diferente (forma mais confiável cross-browser)
    const iframe = frame.querySelector('iframe');
    if (iframe) {
      iframe.src = buildSrc(muted);
    }

    // Atualiza ícones
    if (muted) {
      iconMuted.style.display = '';
      iconSound.style.display = 'none';
      label.textContent = 'Toque para ativar o áudio';
      btn.classList.remove('is-unmuted');
      btn.setAttribute('aria-label', 'Ativar áudio do vídeo');
    } else {
      iconMuted.style.display = 'none';
      iconSound.style.display = '';
      label.textContent = 'Áudio ativado — toque para silenciar';
      btn.classList.add('is-unmuted');
      btn.setAttribute('aria-label', 'Silenciar vídeo');
    }
  }

  btn.addEventListener('click', function () {
    setMuteState(!isMuted);
  });
})();


/* ─────────────────────────────────────────────
   11. HOTJAR / ANALYTICS PLACEHOLDER
       (Activate by replacing IDs below)
   ───────────────────────────────────────────── */
// window._hjSettings = { hjid: YOUR_HOTJAR_ID, hjsv: 6 };
// (Google Analytics tag can be added in <head>)

/* ─────────────────────────────────────────────
   12. PAGE LOAD FADE-IN
   ───────────────────────────────────────────── */
(function initPageLoad() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });
})();

/* ─────────────────────────────────────────────
   13. CTA TRACKING (console log for analytics)
   ───────────────────────────────────────────── */
(function initCTATracking() {
  const ctaIds = ['btn-hero', 'btn-final', 'fab'];
  ctaIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click', () => {
      console.log('[CTA Click]', id, new Date().toISOString());
      // Push to dataLayer for GTM:
      // window.dataLayer = window.dataLayer || [];
      // window.dataLayer.push({ event: 'cta_click', cta_id: id });
    });
  });
})();
