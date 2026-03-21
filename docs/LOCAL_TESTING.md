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
| **`index.html.construction`** | Standalone “Under Construction” page (large logo + message). Edit the paragraph inside that file. |

**Go live:** deploy/rename so **`index.html`** is your main entry (keep `index.html.construction` in the repo as a backup).

**Show construction:** replace the deployed **`index.html`** with the contents of **`index.html.construction`** (or rename/swap as your host allows). Keep a backup of the real homepage (e.g. `index.html.live` or git).

---

## Optional: Live Server in VS Code / Cursor

Use **Live Server** and open `index.html` — it serves over **http://** automatically.

---

## Checklist before deploy

- [ ] Test over **http://localhost** (not only `file://`).
- [ ] Confirm the correct **`index.html`** is what your host will serve at `/`.
