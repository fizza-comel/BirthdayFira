/**
 * balloon.js
 * Creates floating balloon animations that rise from the bottom
 * of the screen when the user clicks "Aku Siap" on the intro.
 *
 * API:
 *   launchBalloons(count)  — launch a set of balloons
 */

(function () {
  'use strict';

  // ── Config ────────────────────────────────────────────────
  const BALLOON_EMOJIS = ['🎈', '🎀', '🎊', '💖', '🌸', '🎁', '✨', '💝'];

  const BALLOON_COLORS = [
    '#FFB3C6', '#FF85A1', '#FFC8DD',
    '#FFD6E7', '#FFCCD5', '#D9A5B3',
    '#F8AFC7', '#FFE5EC',
  ];

  // ── DOM reference ─────────────────────────────────────────
  let balloonLayer = null;

  function ensureLayer() {
    if (balloonLayer) return;
    balloonLayer = document.getElementById('balloonLayer');
    if (!balloonLayer) {
      balloonLayer = document.createElement('div');
      balloonLayer.id = 'balloonLayer';
      balloonLayer.className = 'balloon-layer';
      document.body.appendChild(balloonLayer);
    }
  }

  // ── Create single balloon ─────────────────────────────────

  /**
   * Creates a single balloon element with physics-based CSS animation.
   * @param {number} index - Used for delay staggering.
   */
  function createBalloon(index) {
    const balloon = document.createElement('div');
    const emoji   = BALLOON_EMOJIS[Math.floor(Math.random() * BALLOON_EMOJIS.length)];
    const size    = 2.5 + Math.random() * 2; // rem
    const leftPct = 5 + Math.random() * 90;  // % from left
    const duration = 5 + Math.random() * 4;  // seconds to float up
    const delay    = index * 0.18;            // stagger delay

    // Sway amplitude
    const swayAmp  = 10 + Math.random() * 20;
    const swayDur  = 2 + Math.random() * 2;

    balloon.textContent = emoji;
    balloon.className   = 'balloon';

    Object.assign(balloon.style, {
      left:          leftPct + '%',
      fontSize:      size + 'rem',
      animationDuration: duration + 's',
      animationDelay:    delay + 's',
      '--balloon-dur':   duration + 's',
      '--balloon-delay': delay + 's',
      '--balloon-size':  size + 'rem',
    });

    // Remove after animation ends
    balloon.addEventListener('animationend', function () {
      balloon.remove();
    });

    return balloon;
  }

  // ── Public API ────────────────────────────────────────────

  /**
   * Launch a batch of balloons from the bottom.
   * @param {number} count - Number of balloons to launch.
   */
  window.launchBalloons = function (count = 20) {
    ensureLayer();

    for (let i = 0; i < count; i++) {
      const balloon = createBalloon(i);
      balloonLayer.appendChild(balloon);
    }
  };

  /**
   * Launch a small celebration set (used at intro enter).
   */
  window.celebrationBalloons = function () {
    window.launchBalloons(24);
  };

})();