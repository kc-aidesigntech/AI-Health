/**
 * Simple client-side preview gate for index.html.
 *
 * SECURITY: Credentials in this file are visible to anyone. This only keeps
 * casual visitors out. For a public launch, remove the overlay HTML from
 * index.html and stop loading this script—or use real server-side auth.
 *
 * Change USERNAME and PASSWORD below before sharing the preview URL.
 */
(function () {
    var USERNAME = 'aiha';
    var PASSWORD = 'preview';
    var SESSION_KEY = 'aiha_site_unlocked';

    function isUnlocked() {
        try {
            return sessionStorage.getItem(SESSION_KEY) === '1';
        } catch (e) {
            return false;
        }
    }

    function unlock() {
        try {
            sessionStorage.setItem(SESSION_KEY, '1');
        } catch (e) { /* ignore */ }
        document.documentElement.classList.add('site-auth-ready');
    }

    function init() {
        var overlay = document.getElementById('site-login-overlay');
        var form = document.getElementById('site-login-form');
        var err = document.getElementById('site-login-error');
        if (!overlay || !form) return;

        if (isUnlocked() || document.documentElement.classList.contains('site-auth-ready')) {
            unlock();
            return;
        }

        var userInput = document.getElementById('site-login-user');
        if (userInput) {
            setTimeout(function () {
                userInput.focus();
            }, 0);
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var u = (document.getElementById('site-login-user') || {}).value || '';
            var p = (document.getElementById('site-login-pass') || {}).value || '';
            if (u === USERNAME && p === PASSWORD) {
                if (err) err.hidden = true;
                unlock();
                var first = document.querySelector('main a, main button, [data-include="navbar"] a');
                if (first) first.focus({ preventScroll: true });
            } else {
                if (err) err.hidden = false;
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
