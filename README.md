# Imperio Construction — Website

Fast, SEO-optimized **multi-page** static site (plain HTML/CSS/JS — no build step, no framework).
All pages use **root-absolute paths** (`/styles.css`, `/images/...`), so they work at the
domain root and the `/services/` subfolder alike.

## Pages
- `/` — Home (hero + quote form, services preview, reviews, CTA)
- `/services.html` — Services hub
- `/services/roofing.html`, `new-construction.html`, `remodeling.html`,
  `storm-restoration.html`, `gutters-siding.html`, `property-inspections.html` — service sub-pages
- `/work.html` — project gallery
- `/about.html` — about/company
- `/reviews.html` — testimonials + FAQ
- `/contact.html` — contact info, map, quote form

Shared files: `styles.css`, `script.js`, `robots.txt`, `sitemap.xml`, `site.webmanifest`, `CNAME`, `images/`.

## ⚠️ Before this goes live

1. **Swap in your GoHighLevel forms.**
   Each quote form is marked with a `GHL FORM PLACEHOLDER` comment (homepage hero +
   `/contact.html`). Replace the `<form class="lead-form">…</form>` block with your GHL
   embed code. Until then, the placeholder opens the visitor's email app pre-filled, so
   no lead is lost during preview.

2. **Replace the placeholder stats & reviews with REAL ones.**
   - Stats ("15+ years", "500+ projects") on Home and About → your real numbers.
   - Reviews on Home and `/reviews.html` (Maria G., Javier R., etc.) are samples → swap
     for real testimonials. Don't publish fake review counts (Google penalizes it).

3. **Fix the Facebook link** — `https://www.facebook.com/profile.php` is a placeholder.
   (Instagram @imperioconst956 is correct.)

4. **Set up the free Google tools** (this is what drives local leads):
   - Google Business Profile (most important for a local contractor)
   - Google Search Console → submit `https://imperioconstructionllc.com/sitemap.xml`
   - Google Analytics 4 (paste snippet before `</head>` — can add to all pages)

## Edit the pages
The HTML is generated from `scratchpad/gen.py` (header/footer/services defined once).
You can either edit the `.html` files directly, or edit `gen.py` and re-run it to
regenerate every page consistently. To add/rename a service, edit the `SERVICES` list
in `gen.py` and re-run.

## Deploy
Static files — host anywhere (Surge, Netlify, Cloudflare Pages, GitHub Pages):
```
npm i -g surge
cd "Imperio Construction"
surge . imperioconstructionllc.com
```

## Preview locally
```
cd "Imperio Construction"
python3 -m http.server 4178
# open http://localhost:4178
```
