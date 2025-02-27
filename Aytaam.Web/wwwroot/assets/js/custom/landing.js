"use strict";


var KTLandingPage = function () {
    // Private methods

    var initTyped = function () {
        var typed = new Typed("#kt_landing_hero_text", {
            strings: ["أَهْلًا وَسَهْلًا بِكُم فِي مَوْقِع أيتام"],
            typeSpeed: 20,
            loop: true,
            loopCount: Infinity,
        });
    }

    return {
        init: function () {
            initTyped();
            document.documentElement.setAttribute("data-bs-theme", "light");

        }
    }
}();

// Webpack support
if (typeof module !== 'undefined') {
    module.exports = KTLandingPage;
}

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTLandingPage.init();
});
