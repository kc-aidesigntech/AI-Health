# Local testing (quick reference)

Static files need to be served over **http://** for `fetch()` (navbar partial, `events.json`, etc.). Opening `file:///.../index.html` may not load those reliably.

---

## Start a local server

From the project root:

```bash
cd "/path/to/AI Health"
python3 -m http.server 8765
```

Open **http://127.0.0.1:8765/index.html** (or the port you chose). Stop with **Ctrl+C**.

Hard refresh after edits: **Cmd+Shift+R** (Mac) / **Ctrl+Shift+R** (Windows).

---

## Under Construction vs live site (manual)

There is **no** JSON or script toggle. You choose which file is the public homepage by **renaming** (or copying over) on the server:

| File | Role |
|------|------|
| **`index.html`** | Full site (what visitors get when the server looks for `index.html`) |
| **`under-construction.html`** | Standalone “Under Construction” page (large logo + message). Edit the paragraph inside that file. |

**Go live:** deploy/rename so **`index.html`** is your main entry (keep **`index.html.finished`** in the repo as a duplicate backup of the full homepage).

**Show construction:** replace the deployed **`index.html`** with **`under-construction.html`** (or swap filenames on the host). Keep a backup of the full site (e.g. **`index.html.finished`** or git).

---

## Launch, SEO, and Search Console

See **[LAUNCH.md](LAUNCH.md)** for canonical URL notes, sitemap submission, and post-deploy checks.

---

## Optional: Live Server in VS Code / Cursor

Use **Live Server** and open `index.html` — it serves over **http://** automatically.

---

## Preview login (`index.html`)

The homepage can show a **login overlay** (see `site-auth.js`). Default credentials are **`aiha`** / **`preview`**—change `USERNAME` and `PASSWORD` in `site-auth.js` before sharing. Unlock lasts for the **browser session** (`sessionStorage`).

**Remove the gate for public launch:** delete the overlay markup and head script from `index.html`, remove the `<script src="site-auth.js">` tag, and delete or stop loading `site-auth.js` (client-side “passwords” are visible in the file).

---

## Checklist before deploy

- [ ] Test over **http://localhost** (not only `file://`).
- [ ] Confirm the correct **`index.html`** is what your host will serve at `/`.
