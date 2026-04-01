# SEO & AIO (AI-oriented optimization)

This document describes how **search engines** and **AI/LLM crawlers** see the Anderson Island Health site, what was optimized for launch, and how to maintain it.

**AIO** here means making the site easy for **answer engines, chatbots, and AI crawlers** to summarize accurately—via clear facts, `llms.txt`, structured data, and consistent naming (not “gaming” rankings).

---

## Current strengths

| Area | Implementation |
|------|----------------|
| **Canonical host** | `https://www.andersonislandhealth.org` — used in canonicals, OG URLs, JSON-LD, sitemap |
| **Unique titles & descriptions** | Homepage `<title>` and `meta name="description"` on `index.html` |
| **Open Graph + Twitter** | Homepage: `og:title`, `og:description`, `og:image` (512×512), `twitter:card` = `summary_large_image` |
| **Structured data** | Homepage: `Organization` + `NonprofitOrganization`, `nonprofitStatus` (501(c)(3)), `WebSite` with `@id`, `WebPage` with `about` / `isPartOf` |
| **Crawling** | `robots.txt` allows `/` and references `sitemap.xml` |
| **Sitemap** | Homepage and major **on-page section anchors** (`#mission`, `#plans`, `#giving`, etc.) — no separate HTML subpages in production |
| **AI policy file** | Root **`llms.txt`**: org role, homepage + anchors, contacts, “not a clinic” rule, sitemap link |
| **Heading hierarchy** | One primary `<h1>` on the homepage; sections use `<h2>`/`h3>` in logical order |
| **Archived drafts** | `archive/wellness.html`, `plans.html`, `support.html`, `about.html` are **not** deployed or listed in sitemap/`llms.txt` |
| **Non-indexed noise** | `404.html` uses `noindex` |

---

## Gaps & ongoing work (post-launch)

1. **Social preview image** — The default share image is the **logo mark** (`web-app-manifest-512x512.png`). For richer previews, add a **1200×630** branded image, upload to `assets/`, and point `og:image` / `twitter:image` to it on `index.html`.
2. **Google Business Profile / sameAs** — If you create a GBP or official social profiles, add `"sameAs": [ ... ]` to the Organization JSON-LD on `index.html`.
3. **Search Console** — Submit `sitemap.xml`, monitor coverage, and fix any “Discovered / not indexed” issues after deploy.
4. **Performance** — Run Lighthouse (Performance, SEO, Accessibility); lazy-load below-the-fold images (many already use `loading="lazy"`).
5. **`logo_survey/`** — Internal/survey HTML; keep `noindex` if exposed publicly, or exclude from deploy.

---

## File reference

| File | Role |
|------|------|
| `robots.txt` | Allow rules + sitemap URL |
| `sitemap.xml` | URLs for Google/Bing |
| `llms.txt` | Machine-readable site summary for AI crawlers that honor it |
| `index.html` | Richest JSON-LD graph; keep Organization/WebSite/WebPage in sync with copy |

---

## Maintaining accuracy (SEO + AIO)

- **One legal name** in titles/OG/schema: **Anderson Island Healthcare Advocates**; keep “Anderson Island Health” as a consumer-facing short name where appropriate.
- When **Phase 1** dates or fundraising numbers change, update **visible copy**, **`giving-progress.json`**, and any FAQ that states targets—search and AI both quote on-page text.
- After **URL or domain** changes, `grep` the repo for `andersonislandhealth.org` and update canonicals, JSON-LD, sitemap, `llms.txt`, and OG tags together.

---

## Verification checklist

- [ ] Live URL returns **200** for `/`, `/robots.txt`, `/sitemap.xml`, `/llms.txt`
- [ ] **HTTPS** everywhere; no mixed-content images or scripts
- [ ] **Rich Results Test** / Schema validator on `index.html` (Organization + WebPage)
- [ ] **Facebook Sharing Debugger** / **Twitter Card Validator** on the homepage after changing OG image
- [ ] **Search Console** sitemap submitted and no critical errors

---

*Aligned with repo state as of 2026-04. Pair with [LAUNCH.md](LAUNCH.md) and [LOCAL_TESTING.md](LOCAL_TESTING.md).*
