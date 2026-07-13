/**
 * typing.js
 * Creates a realistic typewriter effect for the birthday letter.
 * Shows blinking cursor, variable typing speed, and supports
 * line breaks for a natural feel.
 *
 * Usage:
 *   startTyping(targetElement, text, options)
 */

(function () {
  'use strict';

  // ── Letter Content ────────────────────────────────────────
  // Edit the letter text here — \n creates a new paragraph
 window.LETTER_TEXT = `Happy Birthday, Firaaaaaaaaaaaaaaaaaaaa!! 🎉💗🌸

Akhirnya hari yang ditunggu-tunggu datang juga, yaa. Selamat ulang tahun yang ke-20, cukk! 🌸

Yeayyy, sekarang lu udah resmi kepala dua! Semoga di umur yang baru ini semua doa dan harapan lu satu per satu bisa terwujud. Semoga selalu diberikan kesehatan, kebahagiaan, rezeki yang melimpah, dimudahkan dalam setiap langkah, dan dikelilingi oleh orang-orang yang selalu sayang sama lu.

Terima kasih yaa karena sudah menjadi my BEST BEST FRIENDDDD selama ini. Makasih udah selalu ada, udah jadi tempat cerita, tempat ketawa, jangan sampe muak ya sama aku cuk wkwkwk. Banyak banget kenangan yang udah kita lewatin bareng, dari mulai alay bangEt bjir.

Semoga persahabatan kita tetap awet sampai nanti. Mau sesibuk apa pun kita, semoga tetap saling ingat, tetap saling dukung, dan tetap jadi teman yang bisa diandalkan satu sama lain.

Pokoknya hari ini harus bahagia yaa! Jangan lupa banyak senyum, banyak makan yang enak, dan nikmatin hari ini dan seterusnya. LU pantas mendapatkan semua hal baik di dunia ini. 🤍

Once again...

Happy 20th Birthday, Firaaaaaa!! 🥳🌷`;


  // ── Typing speed configuration ────────────────────────────
  const BASE_SPEED      = 28;  // ms per character (base)
  const PUNCTUATION_PAUSE = 280; // ms pause after . ! ?
  const COMMA_PAUSE     = 120;  // ms pause after ,
  const NEWLINE_PAUSE   = 500;  // ms pause at \n
       


  // ── State ─────────────────────────────────────────────────
  let isTyping   = false;
  let typingTimer = null;

  /**
   * Creates and inserts the blinking cursor element.
   * @param {HTMLElement} el - Container element.
   * @returns {HTMLSpanElement} cursor
   */
  function createCursor(el) {
    const cursor = document.createElement('span');
    cursor.className = 'typed-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    el.appendChild(cursor);
    return cursor;
  }

  /**
   * Returns the typing speed for a given character.
   * @param {string} char
   * @returns {number} delay in ms
   */
  function getDelay(char) {
    if (char === '\n') return NEWLINE_PAUSE;
    if ('.!?'.includes(char)) return PUNCTUATION_PAUSE;
    if (',;:'.includes(char)) return COMMA_PAUSE;
    // Add slight randomness for natural feel
    return BASE_SPEED + Math.random() * 20;
  }

  /**
   * Recursively types one character at a time.
   * @param {HTMLElement} container - Where text is inserted.
   * @param {HTMLElement} cursor - The blinking cursor element.
   * @param {string}      text   - Full text to type.
   * @param {number}      index  - Current position.
   * @param {Function}    onDone - Callback when typing finishes.
   */
  function typeChar(container, cursor, text, index, onDone) {
    if (!isTyping || index >= text.length) {
      if (onDone) onDone();
      return;
    }

    const char = text[index];

    if (char === '\n') {
  const br = document.createElement('br');
  container.insertBefore(br, cursor);
} else {
  container.insertBefore(document.createTextNode(char), cursor);
}

    typingTimer = setTimeout(function () {
      typeChar(container, cursor, text, index + 1, onDone);
    }, getDelay(char));
  }

  /**
   * Public API: Start the typing animation.
   * @param {HTMLElement} targetEl - Container for typed text.
   * @param {string}      text     - Text to type.
   * @param {Object}      opts     - Optional: { onDone }
   */
  window.startTyping = function (targetEl, text, opts = {}) {
    if (isTyping) return;

    // Clear any previous content
    targetEl.innerHTML = '';
    isTyping = true;

    // Insert cursor
    const cursor = createCursor(targetEl);

    // Slight initial delay before starting
    setTimeout(function () {
      typeChar(targetEl, cursor, text, 0, function () {
        isTyping = false;
        if (opts.onDone) opts.onDone(cursor);
      });
    }, 300);
  };

  /**
   * Stop any ongoing typing.
   */
  window.stopTyping = function () {
    isTyping = false;
    if (typingTimer) clearTimeout(typingTimer);
  };

})();


/**
 * Envelope open + letter reveal logic.
 * Called from index.html onclick.
 */
function openEnvelope() {
  const envelope   = document.getElementById('envelope');
  const letterWrap = document.getElementById('letterWrap');
  const letterBody = document.getElementById('typedLetter');

  // Don't re-open if already open
  if (envelope.classList.contains('open')) return;

  // 1. Play envelope open animation
  envelope.classList.add('open');

  // 2. After short delay, reveal letter
  setTimeout(function () {
    letterWrap.classList.add('visible');

    // 3. Begin typing after letter slides into view
    setTimeout(function () {
      if (window.startTyping && window.LETTER_TEXT) {
        window.startTyping(letterBody, window.LETTER_TEXT, {
          onDone: function (cursor) {
            // Keep cursor blinking after done (already blinking via CSS)
            console.log('Letter typing complete 💌');
          }
        });
      }
    }, 600);
  }, 700);
}