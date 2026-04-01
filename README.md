# Anderson Island Health — website

Public marketing and fundraising site for **Anderson Island Healthcare Advocates (AIHA)**, a Washington nonprofit (501(c)(3)) that **facilitates access to health care** on Anderson Island—not a medical provider itself. The current program focus is **Phase 1**: community-supported **fundraising** and partnership with **Peninsula Community Health Services (PCHS)** for a **mobile medical van** serving the island.

**Live site:** [https://www.andersonislandhealth.org](https://www.andersonislandhealth.org)

---

## Purpose & audience

| Goal | How the site supports it |
|------|---------------------------|
| Explain AIHA’s role | Mission/“Our Purpose,” FAQs, partnership clarity (AIHA vs PCHS) |
| Drive donations | Zeffy links/embed, fundraising copy, goal/thermometer data |
| Recruit volunteers | Volunteer CTA, modal with embedded Google Form |
| Build trust | Board/community framing, events, contact channels, charity/tax disclaimer |

---

## Major themes & design

- **Visual identity:** Teal/coral/sand palette, rounded CTAs, hero gradients, Adobe Fonts (**Congenial** + system Helvetica stack). Logo and photography live under `assets/`.
- **Tone:** Community-led, transparent, non-clinical (AIHA facilitates care; PCHS provides clinical services).
- **Key partners named on-site:** PCHS (mobile clinic), Zeffy (donations / progress).

---

## Architecture (high level)

```
Visitors → DNS (Network Solutions) → Netlify (static hosting, HTTPS)
                    │
                    └── MX / TXT → email provider (e.g. Google Workspace) — independent of the website
```

### Network Solutions (domain & DNS)

The **domain** (e.g. `andersonislandhealth.org`) is registered and **DNS is managed** in **Network Solutions** (or NS points to the same records).

Typical responsibilities:

| Record type | Purpose |
|-------------|---------|
| **A / ALIAS / ANAME** (apex) | Point `@` to Netlify’s load balancer IP or use NS’s “forwarding” only if Netlify docs allow; many setups use **Netlify DNS** or apex ALIAS to Netlify. |
| **CNAME** (`www`) | `www` → your Netlify site hostname (e.g. `something.netlify.app` or Netlify’s assigned target). |
| **MX** | **Mail only** — points to your mail host (Google, Microsoft, Proton, etc.). **Do not** point MX at Netlify. |
| **TXT** | SPF/DKIM/DMARC for mail deliverability; domain verification for Google Search Console, etc. |

**Important:** Web traffic (A/CNAME) and **email (MX)** are separate. Changing A/CNAME for the website must **not** remove MX unless you are intentionally moving email.

### Netlify (hosting)

- **Role:** Serves the **static** HTML/CSS/JS and assets from this repo (deploy via Git connect, CLI, or manual upload depending on your workflow).
- **HTTPS:** Managed by Netlify (Let’s Encrypt).
- **Custom domain:** Add the domain in Netlify; use the DNS targets Netlify shows in Network Solutions.
- **404 page:** `404.html` is used if the host is configured to serve it for unknown paths (Netlify does this by default for SPAs/static sites when `404.html` exists at the publish root).

There is **no server-side application** in this repository—no Node API, no database. Forms and payments are **third-party** (Zeffy, Google Forms).

### Email (MX) setup

- **Website** does not host mail.
- **MX records** stay in DNS (Network Solutions or wherever DNS is delegated) and target your **email provider’s** servers.
- Common pattern: **Google Workspace** or **Microsoft 365** MX records + SPF/DKIM in TXT.
- Published addresses on the site (e.g. `info@`, `giving@`) must match the provider you configure.

---

## Repository layout

| Path | Role |
|------|------|
| `index.html` | Main homepage (hero, mission, plans, fundraising, events, FAQs, contact) |
| `archive/` | Draft HTML (`wellness`, `plans`, `support`, `about`) — **not** part of the live site or sitemap; see `archive/README.md` |
| `404.html` | Not-found page |
| `optional/index-under-construction.html` | Standalone “under construction” page (copy/rename on deploy if needed; see docs) |
| `partials/navbar.html` | Shared **navigation**; injected at runtime |
| `style.css` | Global styles |
| `script.js` | Behavior: navbar, nav, sticky header, scroll reveal, parallax, events, fundraising, volunteer modal, **footer copyright year** (`[data-copyright-year]`), etc. |
| `optional/site-login-gate/` | **Optional** client-side preview login (not wired into `index.html` by default); see `README.md` in that folder |
| `events.json` | **Events list** consumed by the homepage |
| `giving-progress.json` | **Fundraising goal** numbers for thermometers / labels |
| `assets/` | Images, logos, favicon package |
| `robots.txt` / `sitemap.xml` | Crawlers & SEO |
| `llms.txt` | Short policy blurb for AI crawlers |
| `docs/LAUNCH.md` | SEO checklist, Search Console, construction vs live |
| `docs/SEO_AND_AIO.md` | SEO + AI/LLM crawler guidance, structured data, post-launch tuning |
| `docs/LOCAL_TESTING.md` | Local server, optional login gate notes, deploy |

---

## How features work (maintenance)

### Navigation (`partials/navbar.html`)

- Loaded by **`script.js`** via `fetch('partials/navbar.html')` into `[data-include="navbar"]`.
- **Requires HTTP(S)** — opening `index.html` as `file://` uses a **fallback** navbar baked into `script.js`.
- **Edit links once** here; every page that includes the partial stays aligned.

### Donations (Zeffy)

- **URLs and iframe** live in `index.html` (fundraising section). Update if Zeffy changes the campaign slug or form URL.
- Embedded iframe may show **third-party console warnings** (CSP); that’s on Zeffy’s side.

### Fundraising numbers & thermometers

- Edit **`giving-progress.json`**: `goal`, `current`, `updated`, optional `tickLabelOffset`, `divisions`.
- Redeploy after changes; script uses `fetch` with `no-cache`.

### Events list

- Edit **`events.json`**: array of `{ title, date, displayDate, location, description }`.
- Homepage renders `[data-events]` automatically.

### Volunteer form

- Modal + iframe embed in `index.html`; update the Google Form URL if the form changes.

### Optional preview login

- Stored under **`optional/site-login-gate/`** (script + reactivation steps). Not enabled on the live `index.html` by default.

### SEO & social

- **Canonical** and **Open Graph** URLs assume **`https://www.andersonislandhealth.org`** — update globally if the canonical host changes (`grep` the repo).
- **`sitemap.xml`** & **`robots.txt`** reference the same host.
- **JSON-LD** Organization/WebSite is inline in `index.html`.

### Favicon & PWA

- Package under **`assets/favicon/`** (`favicon.ico`, SVG, PNGs, `site.webmanifest`).
- Linked from HTML; manifest `name`/`short_name` should match branding decisions.

### Parallax banner

- Homepage ferry image: `.parallax-banner` in `style.css` + `initParallaxBanner()` in `script.js` (`--parallax-y`).

---

## Local development

Static files must be served over **http://** so `fetch()` works for the navbar and JSON files.

```bash
cd "/path/to/AI Health"
python3 -m http.server 8765
# Open http://127.0.0.1:8765/index.html
```

Details and **construction page swap**: see **[docs/LOCAL_TESTING.md](docs/LOCAL_TESTING.md)** (optional login gate is documented there too).

Post-deploy SEO and Search Console: **[docs/LAUNCH.md](docs/LAUNCH.md)**.

---

## Deploy checklist (short)

1. Test on **localhost** over HTTP, not only `file://`.
2. Confirm **`index.html`** is the deployed homepage (or intentionally swap for construction page).
3. HTTPS, mixed content, Zeffy + volunteer links work.
4. Submit **`sitemap.xml`** in Google Search Console.
5. Run **Lighthouse** on `/` (and on `404.html` if you deploy it).
6. If you **re-enable** the optional preview login, set credentials in `optional/site-login-gate/site-auth.js`.

---

## License / ownership

Site content and design are for **Anderson Island Healthcare Advocates**. Footer credits reference **AI Design Tech** for web/logo work—keep in sync with stakeholder agreements.

---

*Last updated to match repo layout and docs — adjust DNS/Netlify provider-specific steps against your live dashboards.*
