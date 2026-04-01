# Optional site login gate (homepage preview)

This folder holds a **client-side** username/password overlay for `index.html`. It is **not** loaded by default; the live homepage opens with no login.

## What’s here

| File | Purpose |
|------|---------|
| `site-auth.js` | Compares credentials, sets `sessionStorage`, toggles `html.site-auth-ready` |
| This README | How to turn the gate back on |

Styles for the overlay live in the main **`style.css`** (search for `.site-login-` and `site-auth-ready`). No extra CSS file is required unless you remove those rules later.

**Scroll lock while the gate is active:** add this back to `style.css` (see comment above `.site-login-overlay`):

```css
html:not(.site-auth-ready) body {
    overflow: hidden;
}
```

## Reactivate the gate

1. In **`index.html`**, immediately **before** `</head>`, add:

```html
    <script>
    try {
        if (sessionStorage.getItem('aiha_site_unlocked') === '1') {
            document.documentElement.classList.add('site-auth-ready');
        }
    } catch (e) { }
    </script>
```

2. In **`index.html`**, as the **first** child of `<body>` (before the navbar include), add:

```html
    <div id="site-login-overlay" class="site-login-overlay" role="dialog" aria-modal="true" aria-labelledby="site-login-title">
        <div class="site-login-card">
            <p class="site-login-brand">Anderson Island Health</p>
            <h1 id="site-login-title">Preview access</h1>
            <p class="site-login-lead">Enter the username and password to view this site.</p>
            <form id="site-login-form" novalidate>
                <label class="site-login-label" for="site-login-user">Username</label>
                <input class="site-login-input" id="site-login-user" name="username" type="text" autocomplete="username" required>
                <label class="site-login-label" for="site-login-pass">Password</label>
                <input class="site-login-input" id="site-login-pass" name="password" type="password" autocomplete="current-password" required>
                <p class="site-login-error" id="site-login-error" hidden role="alert">That username or password doesn’t match.</p>
                <button class="site-login-submit" type="submit">View website</button>
            </form>
        </div>
    </div>
```

3. Before **`script.js`**, add (path is relative to site root):

```html
    <script src="optional/site-login-gate/site-auth.js"></script>
```

   Alternatively, copy `site-auth.js` to the project root and use `<script src="site-auth.js"></script>`.

4. Edit **`USERNAME`** and **`PASSWORD`** at the top of `site-auth.js`.

## Turn the gate off again

Remove the head script, the overlay markup, and the `site-auth.js` script tag from `index.html`. You can leave this folder and `style.css` rules in place for next time.
