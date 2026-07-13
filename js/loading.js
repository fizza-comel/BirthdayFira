/**
 * loading.js
 * Handles the cinematic loading screen animation.
 * Simulates loading progress with cycling messages,
 * then fades out and shows the intro section.
 */

(function () {
  'use strict';

  // ── Config ──────────────────────────────────────────────
  const LOADING_MESSAGES = [
    'Loading your memories...',
    'Preparing something special...',
    'Gathering all the stars...',
    'Wrapping it with love...',
    'Almost ready for you...',
  ];

  // Duration of each message in ms
  const MSG_INTERVAL = 800;
  // Total loading animation time in ms
  const TOTAL_DURATION = 3200;

  // ── DOM references ───────────────────────────────────────
  const loadingScreen  = document.getElementById('loadingScreen');
  const progressBar    = document.getElementById('progressBar');
  const loadingPercent = document.getElementById('loadingPercent');
  const loadingTitle   = document.getElementById('loadingTitle');
  const introSection   = document.getElementById('introSection');

  let msgIndex = 0;
  let startTime = null;
  let rafId = null;

  /**
   * Animate the progress bar using requestAnimationFrame.
   * @param {DOMHighResTimeStamp} timestamp
   */
  function animateProgress(timestamp) {
    if (!startTime) startTime = timestamp;

    const elapsed  = timestamp - startTime;
    const progress = Math.min(elapsed / TOTAL_DURATION, 1);
    const pct      = Math.floor(progress * 100);

    // Update progress bar width
    progressBar.style.width = pct + '%';
    // Update percentage text
    loadingPercent.textContent = pct + '%';

    if (progress < 1) {
      rafId = requestAnimationFrame(animateProgress);
    } else {
      // Loading complete → transition to intro
      finishLoading();
    }
  }

  /**
   * Cycle through loading messages at intervals.
   */
  function cycleMessages() {
    const interval = setInterval(function () {
      msgIndex = (msgIndex + 1) % LOADING_MESSAGES.length;

      // Fade out → change text → fade in
      loadingTitle.style.opacity = '0';
      loadingTitle.style.transform = 'translateY(-8px)';

      setTimeout(function () {
        loadingTitle.textContent = LOADING_MESSAGES[msgIndex];
        loadingTitle.style.opacity = '1';
        loadingTitle.style.transform = 'translateY(0)';
      }, 300);
    }, MSG_INTERVAL);

    // Clear interval once loading is done
    setTimeout(() => clearInterval(interval), TOTAL_DURATION);
  }

  /**
   * Called when progress reaches 100%.
   * Fades out the loading screen and shows the intro.
   */
  function finishLoading() {
    // Short pause at 100% for dramatic effect
    setTimeout(function () {
      // Fade out loading screen
      loadingScreen.style.transition = 'opacity 1s ease';
      loadingScreen.style.opacity = '0';

      setTimeout(function () {
        // Hide loading screen completely
        loadingScreen.style.display = 'none';

        // Show intro section
        introSection.classList.remove('hidden');
        introSection.style.opacity = '0';

        // Fade intro in
        requestAnimationFrame(function () {
          introSection.style.transition = 'opacity 1s ease';
          introSection.style.opacity = '1';
        });

        // Initialize sparkles / petals / stars in intro
        if (typeof initIntroEffects === 'function') {
          initIntroEffects();
        }

        // Initialize AOS for when main content is revealed
        if (typeof AOS !== 'undefined') {
          AOS.init({
            duration: 900,
            easing: 'ease-out-cubic',
            once: true,
            offset: 80,
          });
        }
      }, 1000); // wait for fade-out animation
    }, 400);
  }

  /**
   * Entry point — called on DOMContentLoaded.
   */
  function init() {
    // Apply transition to loading title for smooth cycling
    loadingTitle.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

    // Start progress animation
    requestAnimationFrame(animateProgress);

    // Start message cycling (after a short initial delay)
    setTimeout(cycleMessages, 500);
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();