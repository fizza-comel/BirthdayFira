/**
 * confetti.js
 * Canvas-based confetti system with realistic physics.
 * Launches a burst of colorful confetti pieces.
 *
 * API:
 *   launchConfetti(options)  — single burst
 *   startConfettiRain()      — continuous rain
 *   stopConfettiRain()       — stop continuous
 */

(function () {
  'use strict';

  // ── Config ────────────────────────────────────────────────
  const COLORS = [
    '#F8AFC7', '#F6C6D8', '#D9A5B3',
    '#FFD6E7', '#FFB3C6', '#FFC8DD',
    '#FF85A1', '#FFCCD5', '#FFA0B4',
    '#FFECD2', '#FFD6A5', '#FFF0F3',
    '#C9B1FF', '#B5E8E0', '#CAFFBF'  // extra pop colors
  ];

  const SHAPES = ['circle', 'rect', 'triangle', 'ribbon'];

  // ── State ─────────────────────────────────────────────────
  let canvas, ctx;
  let pieces = [];
  let animId  = null;
  let isRaining = false;

  // ── Confetti Piece class ──────────────────────────────────

  class ConfettiPiece {
    constructor(opts = {}) {
      this.x     = opts.x || Math.random() * window.innerWidth;
      this.y     = opts.y || -10;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      this.size  = 6 + Math.random() * 8;
      this.vx    = (Math.random() - 0.5) * 5;
      this.vy    = 2 + Math.random() * 4;
      this.rotation     = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 8;
      this.opacity      = 1;
      this.gravity      = 0.08 + Math.random() * 0.05;
      this.drag         = 0.99;
      this.wobble       = 0;
      this.wobbleSpeed  = 0.05 + Math.random() * 0.1;
      this.wobbleAmp    = 2 + Math.random() * 3;
      this.lifespan     = 180 + Math.random() * 120; // frames
      this.age          = 0;
    }

    update() {
      this.age++;
      this.wobble += this.wobbleSpeed;
      this.x  += this.vx + Math.sin(this.wobble) * this.wobbleAmp;
      this.y  += this.vy;
      this.vy += this.gravity;
      this.vx *= this.drag;
      this.rotation += this.rotationSpeed;

      // Fade out near end of life
      const lifeFraction = this.age / this.lifespan;
      if (lifeFraction > 0.7) {
        this.opacity = 1 - ((lifeFraction - 0.7) / 0.3);
      }

      return this.age < this.lifespan && this.y < window.innerHeight + 50;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.fillStyle   = this.color;
      ctx.strokeStyle = this.color;
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);

      switch (this.shape) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'rect':
          ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
          break;

        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(0, -this.size / 2);
          ctx.lineTo(this.size / 2, this.size / 2);
          ctx.lineTo(-this.size / 2, this.size / 2);
          ctx.closePath();
          ctx.fill();
          break;

        case 'ribbon':
          ctx.beginPath();
          ctx.ellipse(0, 0, this.size / 2, this.size / 6, 0, 0, Math.PI * 2);
          ctx.fill();
          break;
      }

      ctx.restore();
    }
  }

  // ── Canvas Setup ─────────────────────────────────────────

  function ensureCanvas() {
    if (canvas) return;

    canvas = document.getElementById('confettiCanvas');

    if (!canvas) {
      // Create and insert if not present
      canvas = document.createElement('canvas');
      canvas.id = 'confettiCanvas';
      canvas.style.cssText = `
        position: fixed; inset: 0;
        width: 100%; height: 100%;
        pointer-events: none;
        z-index: 900;
      `;
      document.body.appendChild(canvas);
    }

    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // ── Animation Loop ────────────────────────────────────────

  function loop() {
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw each piece
    pieces = pieces.filter(piece => {
      const alive = piece.update();
      if (alive) piece.draw(ctx);
      return alive;
    });

    // Continue if there are pieces OR it's raining
    if (pieces.length > 0 || isRaining) {
      animId = requestAnimationFrame(loop);
    } else {
      animId = null;
    }
  }

  function startLoop() {
    if (!animId) {
      animId = requestAnimationFrame(loop);
    }
  }

  // ── Public API ────────────────────────────────────────────

  /**
   * Launch a confetti burst from a position.
   * @param {Object} opts
   * @param {number} opts.count  - Number of pieces (default: 120)
   * @param {number} opts.x      - Spawn x (default: center)
   * @param {number} opts.y      - Spawn y (default: -10 top)
   * @param {boolean} opts.spread - Wide spread from center if true
   */
  window.launchConfetti = function (opts = {}) {
    ensureCanvas();

    const count  = opts.count || 120;
    const cx     = opts.x !== undefined ? opts.x : window.innerWidth / 2;
    const cy     = opts.y !== undefined ? opts.y : -10;
    const spread = opts.spread !== false;

    for (let i = 0; i < count; i++) {
      const piece = new ConfettiPiece({
        x: spread ? cx + (Math.random() - 0.5) * window.innerWidth * 0.8 : cx,
        y: cy
      });

      if (spread) {
        // Some pieces shoot from the sides too
        if (Math.random() < 0.2) piece.x = 0;
        if (Math.random() < 0.2) piece.x = window.innerWidth;
      }

      pieces.push(piece);
    }

    startLoop();
  };

  /**
   * Start continuous confetti rain from the top.
   */
  window.startConfettiRain = function () {
    ensureCanvas();
    isRaining = true;

    const rainInterval = setInterval(function () {
      if (!isRaining) {
        clearInterval(rainInterval);
        return;
      }
      // Add a few pieces per frame
      for (let i = 0; i < 3; i++) {
        pieces.push(new ConfettiPiece({
          x: Math.random() * window.innerWidth,
          y: -10
        }));
      }
    }, 50);

    startLoop();
  };

  /**
   * Stop confetti rain.
   */
  window.stopConfettiRain = function () {
    isRaining = false;
  };

  /**
   * Shoot confetti from both bottom corners upward (party style).
   */
  window.partyConfetti = function () {
    ensureCanvas();
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Left corner burst
    for (let i = 0; i < 80; i++) {
      const piece = new ConfettiPiece({ x: 0, y: h });
      piece.vx = 3 + Math.random() * 8;
      piece.vy = -(5 + Math.random() * 10);
      pieces.push(piece);
    }

    // Right corner burst
    for (let i = 0; i < 80; i++) {
      const piece = new ConfettiPiece({ x: w, y: h });
      piece.vx = -(3 + Math.random() * 8);
      piece.vy = -(5 + Math.random() * 10);
      pieces.push(piece);
    }

    startLoop();
  };

})();