/**
 * Cookie Consent Banner — LSSI-CE / ePrivacy / RGPD
 * Self-injecting: just include <script src="js/cookie-banner.js" defer></script>
 */
(function () {
    'use strict';

    var COOKIE_NAME = 'itc_cookie_consent';
    var COOKIE_DAYS = 365;

    function getCookie(name) {
        var match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
        return match ? decodeURIComponent(match[1]) : null;
    }

    function setCookie(name, value, days) {
        var d = new Date();
        d.setTime(d.getTime() + days * 86400000);
        document.cookie = name + '=' + encodeURIComponent(value) +
            ';expires=' + d.toUTCString() +
            ';path=/;SameSite=Lax';
    }

    if (getCookie(COOKIE_NAME)) return; // already consented

    // ── Inject CSS ──
    var style = document.createElement('style');
    style.textContent =
        '#itcCookieBanner{position:fixed;bottom:0;left:0;right:0;z-index:99999;' +
        'background:#1a1a2e;color:#e0e0e0;padding:1rem 1.5rem;' +
        'display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:1rem;' +
        'font-family:Inter,system-ui,sans-serif;font-size:0.875rem;line-height:1.5;' +
        'box-shadow:0 -2px 12px rgba(0,0,0,.3)}' +
        '#itcCookieBanner a{color:#818cf8;text-decoration:underline}' +
        '#itcCookieBanner .cb-btns{display:flex;gap:0.5rem;flex-shrink:0}' +
        '#itcCookieBanner button{border:none;border-radius:6px;padding:0.5rem 1.2rem;' +
        'font-size:0.85rem;font-weight:600;cursor:pointer;transition:opacity .2s}' +
        '#itcCookieBanner button:hover{opacity:.85}' +
        '#itcCookieBanner .cb-accept{background:#818cf8;color:#fff}' +
        '#itcCookieBanner .cb-reject{background:transparent;color:#e0e0e0;border:1px solid #555}' +
        '@media(max-width:600px){#itcCookieBanner{flex-direction:column;text-align:center;font-size:0.8rem;padding:1rem}}';
    document.head.appendChild(style);

    // ── Inject HTML ──
    var banner = document.createElement('div');
    banner.id = 'itcCookieBanner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Consentimiento de cookies');
    banner.innerHTML =
        '<p style="margin:0;max-width:720px">' +
        'Utilizamos cookies técnicas estrictamente necesarias para el funcionamiento del sitio. ' +
        'No utilizamos cookies de seguimiento ni publicitarias. Algunos recursos se cargan desde CDNs externos (Google Fonts, jsDelivr). ' +
        'Más información en nuestra <a href="cookies.html">Política de Cookies</a> y <a href="privacidad.html">Política de Privacidad</a>.' +
        '</p>' +
        '<div class="cb-btns">' +
        '<button class="cb-accept" id="cbAccept">Aceptar</button>' +
        '<button class="cb-reject" id="cbReject">Solo necesarias</button>' +
        '</div>';
    document.body.appendChild(banner);

    // ── Handlers ──
    document.getElementById('cbAccept').addEventListener('click', function () {
        setCookie(COOKIE_NAME, 'all', COOKIE_DAYS);
        banner.remove();
    });
    document.getElementById('cbReject').addEventListener('click', function () {
        setCookie(COOKIE_NAME, 'essential', COOKIE_DAYS);
        banner.remove();
    });
})();
