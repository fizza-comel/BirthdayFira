/**
 * main.js
 * Core orchestration: cursor glow, particles background,
 * intro enter logic, secret page reveal, night sky,
 * intro sparkle/petal/star effects, and click ripple.
 */

(function () {
  'use strict';

  // ── Cursor glow ───────────────────────────────────────────
  const cursorGlow = document.getElementById('cursorGlow');

  if (cursorGlow) {
    document.addEventListener('mousemove', function (e) {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top  = e.clientY + 'px';
    });

    document.addEventListener('mouseleave', function () {
      cursorGlow.style.opacity = '0';
    });

    document.addEventListener('mouseenter', function () {
      cursorGlow.style.opacity = '1';
    });
  }

  // ── Click ripple ring ─────────────────────────────────────
  document.addEventListener('click', function (e) {
    // Skip clicks on interactive elements
    if (e.target.closest('button, a, input, .polaroid')) return;

    const ring = document.createElement('div');
    ring.className = 'click-ring';
    ring.style.left = e.clientX + 'px';
    ring.style.top  = e.clientY + 'px';
    document.body.appendChild(ring);

    ring.addEventListener('animationend', function () {
      ring.remove();
    });
  });

  // ── Floating particles canvas ─────────────────────────────

  (function initParticles() {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W = window.innerWidth;
    let H = window.innerHeight;

    canvas.width  = W;
    canvas.height = H;

    window.addEventListener('resize', function () {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = W;
      canvas.height = H;
    });

    const NUM_PARTICLES = 50;
    const particles = [];

    for (let i = 0; i < NUM_PARTICLES; i++) {
      particles.push({
        x:    Math.random() * W,
        y:    Math.random() * H,
        r:    1 + Math.random() * 2.5,
        vx:   (Math.random() - 0.5) * 0.3,
        vy:   -0.1 - Math.random() * 0.3,
        a:    Math.random(),
        da:   0.003 + Math.random() * 0.006,
        rising: true,
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, W, H);

      particles.forEach(function (p) {
        // Pulse opacity
        if (p.rising) {
          p.a += p.da;
          if (p.a >= 0.7) p.rising = false;
        } else {
          p.a -= p.da;
          if (p.a <= 0.05) p.rising = true;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.y < -10)  p.y = H + 10;
        if (p.x < -10)  p.x = W + 10;
        if (p.x > W+10) p.x = -10;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.a);
        ctx.fillStyle   = '#F8AFC7';
        ctx.shadowBlur  = 4;
        ctx.shadowColor = '#FFD6E7';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      requestAnimationFrame(drawParticles);
    }

    drawParticles();
  })();

  // ── Intro effects (sparkles, petals, stars) ───────────────

  window.initIntroEffects = function () {
    spawnSparkles();
    spawnPetals();
    spawnStars();
  };

  function spawnSparkles() {
    const layer = document.getElementById('sparkleLayer');
    if (!layer) return;

    function createSparkle() {
      const el = document.createElement('span');
      el.className    = 'sparkle-star';
      el.textContent  = '✦';
      el.style.left   = Math.random() * 100 + '%';
      el.style.top    = Math.random() * 100 + '%';
      el.style.fontSize = (0.6 + Math.random() * 0.8) + 'rem';
      el.style.animationDuration = (2 + Math.random() * 2) + 's';
      el.style.animationDelay   = Math.random() * 3 + 's';
      layer.appendChild(el);

      el.addEventListener('animationend', function () {
        el.remove();
      });
    }

    for (let i = 0; i < 20; i++) createSparkle();

    setInterval(function () {
      const introVisible = document.getElementById('introSection');
      if (!introVisible || introVisible.classList.contains('hidden')) return;
      createSparkle();
    }, 600);
  }

  function spawnPetals() {
    const layer = document.getElementById('petalLayer');
    if (!layer) return;

    const PETALS = ['🌸', '🌺', '✿', '❀'];

    function createPetal() {
      const el = document.createElement('span');
      el.className   = 'petal';
      el.textContent = PETALS[Math.floor(Math.random() * PETALS.length)];
      el.style.left  = Math.random() * 100 + '%';
      el.style.setProperty('--petal-dur',  (5 + Math.random() * 5) + 's');
      el.style.setProperty('--petal-delay', Math.random() * 4 + 's');
      el.style.setProperty('--petal-sway', (2 + Math.random() * 2) + 's');
      el.style.setProperty('--petal-size', (0.7 + Math.random() * 0.6) + 'rem');
      layer.appendChild(el);

      // Remove after a few loops
      setTimeout(function () {
        el.remove();
      }, 14000);
    }

    for (let i = 0; i < 12; i++) {
      setTimeout(createPetal, i * 500);
    }

    setInterval(function () {
      const intro = document.getElementById('introSection');
      if (!intro || intro.classList.contains('hidden')) return;
      createPetal();
    }, 1200);
  }

  function spawnStars() {
    const layer = document.getElementById('starsLayer');
    if (!layer) return;

    for (let i = 0; i < 30; i++) {
      const star = document.createElement('div');
      star.className = 'night-star';

      const size = 1 + Math.random() * 3;
      star.style.width  = size + 'px';
      star.style.height = size + 'px';
      star.style.left   = Math.random() * 100 + '%';
      star.style.top    = Math.random() * 100 + '%';
      star.style.setProperty('--star-dur',   (2 + Math.random() * 3) + 's');
      star.style.setProperty('--star-delay', Math.random() * 4 + 's');
      layer.appendChild(star);
    }
  }

  // ── Night sky canvas (ending section) ────────────────────

  (function initNightSky() {
    const canvas = document.getElementById('nightCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W, H;

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    const stars = [];
    for (let i = 0; i < 120; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        r: 0.5 + Math.random() * 1.5,
        a: Math.random(),
        da: 0.005 + Math.random() * 0.01,
        rising: Math.random() > 0.5,
      });
    }

    function drawSky() {
      ctx.clearRect(0, 0, W, H);

      stars.forEach(function (s) {
        if (s.rising) {
          s.a += s.da;
          if (s.a >= 1) s.rising = false;
        } else {
          s.a -= s.da;
          if (s.a <= 0.1) s.rising = true;
        }

        ctx.save();
        ctx.globalAlpha = s.a;
        ctx.fillStyle   = '#FFFFFF';
        ctx.shadowBlur  = 6;
        ctx.shadowColor = '#F8AFC7';
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      requestAnimationFrame(drawSky);
    }

    drawSky();
  })();

  // ── Intro enter handler ───────────────────────────────────

  window.handleEnter = function () {
    const introSection = document.getElementById('introSection');
    const mainContent  = document.getElementById('mainContent');

    // 1. Launch balloons
    if (typeof window.celebrationBalloons === 'function') {
      window.celebrationBalloons();
    }
      
    // 2. Start background music
    if (typeof window.playBirthdayMusic === 'function') {
      window.playBirthdayMusic();
    }

    // 3. Fade overlay → then switch views
    const overlay = document.createElement('div');
    overlay.className = 'fade-overlay';
    document.body.appendChild(overlay);

    // Trigger fade in
    requestAnimationFrame(function () {
      overlay.classList.add('active');
    });

    setTimeout(function () {
      // Hide intro, show main
      introSection.classList.add('hidden');
      mainContent.classList.remove('hidden');

      // Scroll to top
      window.scrollTo(0, 0);

      // Fade overlay back out
      overlay.classList.remove('active');
      setTimeout(function () {
        overlay.remove();
      }, 900);

      // Fire initial confetti burst
      setTimeout(function () {
        if (typeof window.launchConfetti === 'function') {
          window.launchConfetti({ count: 80 });
        }
      }, 600);

    }, 900);
  };

  // ── Secret page reveal ────────────────────────────────────

  window.goToSecret = function () {
    const secretPage  = document.getElementById('secretPage');
    const mainContent = document.getElementById('mainContent');

    if (!secretPage) return;

    // Fade overlay
    const overlay = document.createElement('div');
    overlay.className = 'fade-overlay';
    document.body.appendChild(overlay);

    requestAnimationFrame(function () {
      overlay.classList.add('active');
    });

    setTimeout(function () {
      mainContent.classList.add('hidden');
      secretPage.classList.remove('hidden');
      window.scrollTo(0, 0);

      overlay.classList.remove('active');
      setTimeout(function () {
        overlay.remove();
      }, 900);

      // Start fireworks
      if (typeof window.startFireworks === 'function') {
        window.startFireworks();
      }

      // Confetti rain
      setTimeout(function () {
        if (typeof window.partyConfetti === 'function') {
          window.partyConfetti();
        }
      }, 1000);

    }, 900);
  };

  // ── Heart click effect (on specific elements) ─────────────

  document.addEventListener('click', function (e) {
    // Only on certain fun elements
    const target = e.target.closest('.gratitude-icon, .stat-icon, .ending-divider, .secret-heart');
    if (!target) return;

    for (let i = 0; i < 5; i++) {
      setTimeout(function () {
        const heart = document.createElement('div');
        heart.className   = 'floating-heart';
        heart.textContent = ['💖', '💕', '❤️', '💗', '💝'][Math.floor(Math.random() * 5)];

        const rect = target.getBoundingClientRect();
        heart.style.left = (rect.left + rect.width / 2 + (Math.random() - 0.5) * 40) + 'px';
        heart.style.top  = (rect.top + window.scrollY) + 'px';
        heart.style.fontSize = (1 + Math.random() * 0.8) + 'rem';

        document.body.appendChild(heart);

        heart.addEventListener('animationend', function () {
          heart.remove();
        });
      }, i * 80);
    }
  });

})();