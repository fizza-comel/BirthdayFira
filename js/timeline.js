/**
 * timeline.js
 * Handles scroll-triggered timeline animations and
 * animated counters for the stats/countdown section.
 */

(function () {
  'use strict';

  // ── Animated Number Counter ───────────────────────────────

  /**
   * Animate a number from 0 to a target value.
   * @param {HTMLElement} el     - Element to update.
   * @param {number}      target - Final value.
   * @param {number}      duration - Animation duration in ms.
   * @param {string}      suffix - Optional suffix (e.g. '+').
   */
  function animateCounter(el, target, duration = 2000, suffix = '') {
    const startTime  = performance.now();
    const startValue = 0;

    function ease(t) {
      // Ease out cubic
      return 1 - Math.pow(1 - t, 3);
    }

    function update(timestamp) {
      const elapsed  = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current  = Math.floor(ease(progress) * target);

      el.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  // ── Intersection Observer for counters ────────────────────

  function initCounters() {
    const yearsEl  = document.getElementById('yearsCount');
    const daysEl   = document.getElementById('daysCount');
    const hoursEl  = document.getElementById('hoursCount');

    if (!yearsEl || !daysEl || !hoursEl) return;

    const counterSection = document.getElementById('countdownSection');
    if (!counterSection) return;

    let triggered = false;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !triggered) {
          triggered = true;

          // Animate the three counters
          animateCounter(yearsEl,  20,      1800);
          animateCounter(daysEl,   7300,    2400);
          animateCounter(hoursEl,  175200,  2800);

          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(counterSection);
  }

  // ── Timeline Scroll Animations ────────────────────────────
  // AOS handles most of this, but we enhance with custom
  // intersection logic for the timeline line drawing effect.

  function initTimelineLine() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    const line = timeline.querySelector('::before');
    // CSS pseudo-element, can't animate directly via JS easily
    // Instead we animate each item as it enters viewport (AOS does this)
    // We add an additional class for the connecting line progress
    const timelineEl = document.getElementById('timeline');
    if (!timelineEl) return;

    let triggered = false;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !triggered) {
          triggered = true;
          // Add progressive line reveal
          timelineEl.classList.add('timeline-revealed');
        }
      });
    }, { threshold: 0.1 });

    observer.observe(timelineEl);
  }

  // ── Timeline item stagger animation ──────────────────────

  function initTimelineItems() {
    const items = document.querySelectorAll('.timeline-item');
    if (!items.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('timeline-item-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

    items.forEach(item => observer.observe(item));
  }

  // ── Scroll progress indicator (optional, subtle) ─────────

  function initScrollProgress() {
    const scrollBar = document.createElement('div');
    scrollBar.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      height: 3px;
      background: linear-gradient(90deg, #F8AFC7, #D9A5B3);
      z-index: 9999;
      width: 0%;
      transition: width 0.1s linear;
      box-shadow: 0 0 8px rgba(248,175,199,0.6);
      pointer-events: none;
    `;
    document.body.appendChild(scrollBar);

    window.addEventListener('scroll', function () {
      const scrollTop    = window.scrollY || document.documentElement.scrollTop;
      const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollBar.style.width = Math.min(scrollPercent, 100) + '%';
    }, { passive: true });
  }

  // ── Init ──────────────────────────────────────────────────

  function init() {
    initCounters();
    initTimelineLine();
    initTimelineItems();
    initScrollProgress();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();