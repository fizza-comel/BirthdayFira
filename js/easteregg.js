/**
 * easteregg.js
 * Secret popup appears when clicking the number 20.
 */

(function () {
    'use strict';

    function init() {

        const secretNumber = document.getElementById("secretTwenty");

        if (!secretNumber) return;

        secretNumber.style.cursor = "pointer";

        secretNumber.addEventListener("click", function () {

            showEasterEgg();

        });

    }

    function showEasterEgg() {

        const popup = document.getElementById("easterEggPopup");

        if (!popup) return;

        popup.classList.add("active");

        if (typeof window.launchConfetti === "function") {
            window.launchConfetti({
                count: 80
            });
        }

    }

    window.closeEasterEgg = function () {

        const popup = document.getElementById("easterEggPopup");

        if (popup) {
            popup.classList.remove("active");
        }

    };

    document.addEventListener("DOMContentLoaded", init);

})();