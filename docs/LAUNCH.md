# Launch & SEO checklist

Canonical URLs, Open Graph, JSON-LD, `robots.txt`, and `sitemap.xml` use:

**`https://www.andersonislandhealth.org`**

If your live site uses the **apex** domain only (`https://andersonislandhealth.org`) or **non-www**, search the repo for `www.andersonislandhealth.org` and replace with your chosen canonical host, then redeploy.

## After first deploy

1. **HTTPS** — Confirm the padlock; fix any mixed-content (HTTP assets on HTTPS).
2. **Google Search Console** — Add property for your domain, verify (DNS or HTML file), submit `https://www.andersonislandhealth.org/sitemap.xml`.
3. **Hard refresh** — After DNS or file changes, use `Cmd+Shift+R` / `Ctrl+Shift+R` to avoid stale cached JSON or JS.

## Construction vs live homepage

- **`index.html`** — Full public site (current default).
- **`under-construction.html`** — Standalone “Under Construction” page with favicon. To show it at `/`, rename/swap files on the host (keep a backup of the full `index.html` as **`index.html.finished`** in the repo).

## Files added for SEO & crawlers

| File | Purpose |
|------|---------|
| [robots.txt](../robots.txt) | Allow crawlers; points to sitemap |
| [sitemap.xml](../sitemap.xml) | Homepage + major on-page section anchors (`#mission`, `#plans`, etc.) for Search Console |
| [llms.txt](../llms.txt) | Optional policy blurb for AI crawlers |
| [404.html](../404.html) | Custom not-found if your host supports it |
| [assets/favicon/favicon-512.png](../assets/favicon/favicon-512.png) | Favicon / social image (copy of white square logo) |

## Verification

- Run **Lighthouse** (Chrome DevTools) on `/` and one inner page: Performance, Accessibility, SEO, Best Practices.
- Click through nav, donate (Zeffy), volunteer modal, and external PCHS links.
- **Console** — No uncaught errors on home and [plans.html](../plans.html).

## Local testing

See [LOCAL_TESTING.md](LOCAL_TESTING.md).
