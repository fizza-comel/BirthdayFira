/**
 * music.js
 * Handles background music playback with a smooth fade-in,
 * toggle button, and visual wave indicator.
 *
 * To use your own music:
 *   1. Place your .mp3 file in the /music/ folder.
 *   2. Uncomment and update the <source> tag in index.html.
 *   3. Or call window.setMusicSrc('music/your-file.mp3') from console.
 */

(function () {
  'use strict';

  // ── DOM references ────────────────────────────────────────
  let audio        = null;
  let musicControl = null;
  let musicIcon    = null;
  let isPlaying    = false;
  let fadeInterval = null;

  // ── Init ──────────────────────────────────────────────────

  function init() {
    audio        = document.getElementById('bgMusic');
    musicControl = document.getElementById('musicControl');
    musicIcon    = document.getElementById('musicIcon');

    if (!audio || !musicControl) return;

    // Click to toggle
    musicControl.addEventListener('click', toggleMusic);

    // Update icon if audio state changes externally
    audio.addEventListener('play',  onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onPause); // shouldn't happen (loop), but safety

    // Set initial volume to 0 (for fade-in)
    audio.volume = 0;
  }

  // ── Playback control ──────────────────────────────────────

  /**
   * Toggle play/pause.
   */
  function toggleMusic() {
    if (!audio) return;

    if (isPlaying) {
      fadeOut();
    } else {
      startMusic();
    }
  }

  /**
   * Begin playing with fade-in.
   */
  function startMusic() {
    if (!audio || !audio.src) {
      // No music source — show a gentle hint
      showNoMusicHint();
      return;
    }

    audio.volume = 0;
    audio.play().then(function () {
      isPlaying = true;
      onPlay();
      fadeIn();
    }).catch(function (err) {
      // Autoplay policy may block — user gesture required (click handles this)
      console.warn('Music play failed:', err.message);
    });
  }

  /**
   * Fade in from 0 → target volume.
   */
  function fadeIn(targetVolume = 0.55, duration = 2000) {
    clearInterval(fadeInterval);
    const steps     = 40;
    const stepTime  = duration / steps;
    const stepSize  = targetVolume / steps;

    fadeInterval = setInterval(function () {
      if (audio.volume < targetVolume - stepSize) {
        audio.volume = Math.min(audio.volume + stepSize, targetVolume);
      } else {
        audio.volume = targetVolume;
        clearInterval(fadeInterval);
      }
    }, stepTime);
  }

  /**
   * Fade out from current volume → 0, then pause.
   */
  function fadeOut(duration = 1200) {
    clearInterval(fadeInterval);
    const steps    = 30;
    const stepTime = duration / steps;
    const stepSize = audio.volume / steps;

    fadeInterval = setInterval(function () {
      if (audio.volume > stepSize) {
        audio.volume = Math.max(0, audio.volume - stepSize);
      } else {
        audio.volume = 0;
        audio.pause();
        clearInterval(fadeInterval);
        isPlaying = false;
        onPause();
      }
    }, stepTime);
  }

  // ── UI state updates ──────────────────────────────────────

  function onPlay() {
    isPlaying = true;
    musicControl.classList.add('playing');
    musicControl.title = 'Pause Music';
  }

  function onPause() {
    isPlaying = false;
    musicControl.classList.remove('playing');
    musicControl.title = 'Play Music';
  }

  /**
   * Show a subtle hint when no music file is configured.
   */
  function showNoMusicHint() {
    musicIcon.textContent = '🎵';
    musicControl.style.opacity = '0.5';
    musicControl.title = 'Add music/birthday.mp3 to enable';

    // Bounce the icon briefly
    musicControl.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(1.2)' },
      { transform: 'scale(1)' }
    ], { duration: 300, easing: 'ease-out' });

    setTimeout(() => {
      musicControl.style.opacity = '1';
    }, 2000);
  }

  // ── Public API ────────────────────────────────────────────

  /**
   * Programmatically start music (called after user clicks "Aku Siap").
   * Requires user gesture to work — the button click provides this.
   */
  window.playBirthdayMusic = function () {
    if (!audio) return;
    if (isPlaying) return;

    // Small delay so the gesture is still "fresh"
    setTimeout(startMusic, 300);
  };

  /**
   * Set a new music source dynamically.
   * @param {string} src - Path to audio file.
   */
  window.setMusicSrc = function (src) {
    if (!audio) return;
    audio.src = src;
    audio.load();
  };

  /**
   * Fade out and stop.
   */
  window.stopMusic = function () {
    if (isPlaying) fadeOut();
  };

  // ── Start ─────────────────────────────────────────────────

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();