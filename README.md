# frayge.com

Static marketing website, Apple legal/support pages, and Universal Links manifest for **Frayge** (`com.sculptcoat.snip35`), ready for zero-build **GitHub Pages** hosting with Squarespace DNS.

## Included Routes & Apple Files

- `/` — Landing page with Ceramic / Obsidian finish toggle, interactive 4-look Hero stage (`Pop Art`, `Torn Edge`, `Diagonal`, `Ripped Up`), craft walkthrough, on-device privacy pillar, and StoreKit-aligned pricing.
- `/privacy/` (and `/privacy.html`) — App Store Privacy Policy (`Data Not Collected`, 100% on-device).
- `/terms/` (and `/terms.html`) — Terms of Use + Guideline 3.1.2 auto-renewable subscription disclosure + Apple Standard EULA reference.
- `/support/` (and `/support.html`) — App Store Support URL + FAQ + `support@frayge.com`.
- `/.well-known/apple-app-site-association` — Apple Universal Links & Web Credentials manifest (`66255589F8.com.sculptcoat.snip35`).
- `CNAME` (`frayge.com`), `.nojekyll`, `robots.txt`, `sitemap.xml`, `assets/og-card.jpg`, `assets/apple-touch-icon.png`.

## Deploy to GitHub Pages

1. Create a public GitHub repo (for example `snip35-site`).
2. Push this directory as `main`:
   ```bash
   git remote add origin https://github.com/<your-username>/snip35-site.git
   git push -u origin main
   ```
3. In GitHub repo **Settings → Pages**:
   - **Source**: Deploy from a branch → `main` / `/ (root)`.
   - **Custom domain**: `frayge.com` (auto-populated from `CNAME`).
   - Check **Enforce HTTPS** once DNS propagates (~5–15 minutes).

## Squarespace Domains DNS Records (`frayge.com`)

In **Squarespace Domains → frayge.com → DNS → DNS Settings**, remove any default Squarespace parking records and add:

| Host | Type | Data |
| --- | --- | --- |
| `@` | `A` | `185.199.108.153` |
| `@` | `A` | `185.199.109.153` |
| `@` | `A` | `185.199.110.153` |
| `@` | `A` | `185.199.111.153` |
| `www` | `CNAME` | `<your-username>.github.io` |

Also enable **Email Forwarding** in Squarespace Domains for `support@frayge.com` → your personal inbox.

## Once App Store Connect ID is Ready

1. Uncomment `<meta name="apple-itunes-app" content="app-id=YOUR_APP_STORE_ID" />` in `index.html`.
2. Replace the `#download` CTA link in `index.html` with `https://apps.apple.com/app/idYOUR_APP_STORE_ID`.
3. In App Store Connect, set:
   - **Privacy Policy URL**: `https://frayge.com/privacy/`
   - **Support URL**: `https://frayge.com/support/`
   - **Marketing URL**: `https://frayge.com/`
