/**
 * gallery.js
 * Handles photo gallery interactions:
 *   - Polaroid click → opens lightbox
 *   - Lightbox close on backdrop click or button
 *   - Keyboard navigation (Escape to close)
 *   - Optional: dynamic gallery population from data array
 *
 * To add real photos:
 *   1. Place images in /images/ folder.
 *   2. Edit the GALLERY_PHOTOS array below.
 */

(function () {
  'use strict';

  // ── Photo Data ────────────────────────────────────────────
  // Add your real photos here. If 'src' is empty, placeholder emoji is shown.
   const GALLERY_PHOTOS = [
  {
    src: 'Foto/foto1.jpg',
    caption: 'Awal dari banyak cerita indah 🤍',
    rotation: -3
  },
  {
    src: 'Foto/foto2.jpg',
    caption: 'Ketawa sampai lupa waktu 😂',
    rotation: 2
  },
  {
    src: 'Foto/foto3.jpg',
    caption: 'Satu lagi kenangan yang nggak akan terlupakan.',
    rotation: -1.5
  },
  {
    src: 'Foto/foto11.jpg',
    caption: 'Terima kasih sudah selalu ada. 💕',
    rotation: 3.5
  },
  {
    src: 'Foto/foto12.jpg',
    caption: 'Persahabatan yang semoga nggak pernah selesai.',
    rotation: -2
  },
  {
    src: 'Foto/foto13.jpg',
    caption: 'Bersama kamu, momen sederhana terasa spesial.',
    rotation: 1
  },
  {
    src: 'Foto/foto14.jpg',
    caption: 'Semoga senyum ini selalu ada di setiap harimu.',
    rotation: -2.5
  },
  {
    src: 'Foto/foto15.jpg',
    caption: 'Happy 20th Birthday, Fira! 🤍',
    rotation: 2
  }
];

  // ── DOM references ────────────────────────────────────────
  let lightbox, lightboxImgWrap, lightboxCaption;
  let currentPhotoIndex = -1;

  // ── Init ──────────────────────────────────────────────────

  function init() {
    lightbox         = document.getElementById('lightbox');
    lightboxImgWrap  = document.getElementById('lightboxImgWrap');
    lightboxCaption  = document.getElementById('lightboxCaption');

    if (!lightbox) return;

    // Attach events to existing polaroids in HTML
    attachPolaroidEvents();

    // Keyboard events
    document.addEventListener('keydown', onKeyDown);
  }

  // ── Attach click events to polaroid cards ─────────────────

  function attachPolaroidEvents() {
    const polaroids = document.querySelectorAll('.polaroid');

    polaroids.forEach(function (el, index) {
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      el.setAttribute('aria-label', 'View photo ' + (index + 1));

      el.addEventListener('click', function () {
        openLightbox(index, el);
      });

      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(index, el);
        }
      });
    });
  }

  // ── Lightbox ──────────────────────────────────────────────

  /**
   * Open the lightbox for a given polaroid.
   * @param {number} index - Photo index.
   * @param {HTMLElement} el - The polaroid element clicked.
   */
 function openLightbox(index, el) {
  if (!lightbox) return;

  currentPhotoIndex = index;

  const caption = el.querySelector('.polaroid-caption');
  const img = el.querySelector('img');

  lightboxImgWrap.innerHTML = '';

  if (img) {
    const lbImg = document.createElement('img');
    lbImg.src = img.src;
    lbImg.alt = caption ? caption.textContent : '';
    lightboxImgWrap.appendChild(lbImg);
  }

  lightboxCaption.textContent = caption ? caption.textContent : '';

  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';

  lightbox.focus();
}

  /**
   * Close the lightbox.
   */
  window.closeLightbox = function () {
    if (!lightbox) return;

    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    currentPhotoIndex = -1;
  };

  // ── Keyboard events ───────────────────────────────────────

  function onKeyDown(e) {
    if (!lightbox || !lightbox.classList.contains('active')) return;

    switch (e.key) {
      case 'Escape':
        window.closeLightbox();
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        navigateLightbox(1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        navigateLightbox(-1);
        break;
    }
  }

  /**
   * Navigate between photos in lightbox.
   * @param {number} dir - 1 for next, -1 for prev.
   */
  function navigateLightbox(dir) {
    const polaroids = document.querySelectorAll('.polaroid');
    if (!polaroids.length) return;

    currentPhotoIndex = (currentPhotoIndex + dir + polaroids.length) % polaroids.length;
    openLightbox(currentPhotoIndex, polaroids[currentPhotoIndex]);
  }

  // ── Prevent lightbox close when clicking inner content ─────

  function onLightboxInnerClick(e) {
    e.stopPropagation();
  }

  // ── Start ─────────────────────────────────────────────────

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      init();
      // Attach stop-propagation to lightbox inner
      const inner = document.getElementById('lightboxInner');
      if (inner) inner.addEventListener('click', onLightboxInnerClick);
    });
  } else {
    init();
    const inner = document.getElementById('lightboxInner');
    if (inner) inner.addEventListener('click', onLightboxInnerClick);
  }

})();