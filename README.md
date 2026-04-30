# RJU Notes Hub

Free study notes, old questions, and academic resources for **Rajarshi Janak University (RJU)** students.

🌐 **Live site**: https://rjunotes.prachitregmi.com.np/

## Project info

**Lovable Project URL**: https://lovable.dev/projects/01016a33-e828-4939-9d8a-a9afff627ba8

## Tech Stack

- **Vite** + **React** + **TypeScript**
- **shadcn/ui** + **Tailwind CSS**
- **Supabase** (database & storage)
- **react-helmet-async** (per-page SEO)
- **react-router-dom** v6 (SPA routing)
- Deployed on **Vercel** (SPA rewrites configured in `vercel.json`)

---

## How can I edit this code?

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/01016a33-e828-4939-9d8a-a9afff627ba8) and start prompting.

**Use your preferred IDE**

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Step 3: Install dependencies
npm i

# Step 4: Start development server
npm run dev

# Step 5: Build for production
npm run build
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s), click the **Edit** (pencil) icon, make your changes, and commit.

**Use GitHub Codespaces**

- Click the **Code** button → **Codespaces** tab → **New codespace**.

---

## SEO Setup

### Architecture

| File | Purpose |
|------|---------|
| `public/robots.txt` | Allow all crawlers; points to sitemap |
| `public/sitemap.xml` | Static sitemap for main pages |
| `public/site.webmanifest` | PWA / browser metadata |
| `index.html` | Sitewide default meta, JSON-LD schemas (Organization, WebSite, FAQPage) |
| `src/components/SEO.tsx` | Reusable per-page `<Helmet>` wrapper |
| `src/pages/*.tsx` | Each page uses `<SEO>` for page-specific title, description, canonical, and JSON-LD |

### Canonical Base URL

All canonical URLs, OG tags, and JSON-LD schemas use:

```
https://rjunotes.prachitregmi.com.np/
```

### Per-page SEO

Each route renders its own `<SEO>` component (via `react-helmet-async`) which injects:
- Unique `<title>` and `<meta name="description">`
- `<link rel="canonical">`
- Open Graph + Twitter Card tags
- Page-specific JSON-LD (WebPage, CollectionPage, AboutPage, or Article/DigitalDocument for note pages)

---

## Google Search Console (GSC) Setup

### 1. Verify Ownership

1. Go to [Google Search Console](https://search.google.com/search-console/).
2. Click **Add property** → enter `https://rjunotes.prachitregmi.com.np/`.
3. Choose **HTML tag** verification method.
4. Copy the `content` value from the meta tag Google gives you.
5. In `index.html`, update (or confirm) the existing line:
   ```html
   <meta name="google-site-verification" content="YOUR_CODE_HERE" />
   ```
6. Deploy and click **Verify** in GSC.

### 2. Submit the Sitemap

1. In GSC, go to **Sitemaps** (left sidebar).
2. Enter `sitemap.xml` in the input field.
3. Click **Submit**.
4. GSC will crawl `https://rjunotes.prachitregmi.com.np/sitemap.xml` and index the listed URLs.

### 3. Request Indexing for Key Pages

For each important page, go to **URL Inspection** in GSC, paste the URL, and click **Request Indexing**.

Priority pages:
- `https://rjunotes.prachitregmi.com.np/`
- `https://rjunotes.prachitregmi.com.np/notes`
- `https://rjunotes.prachitregmi.com.np/about`

---

## Testing SEO & Crawlability

### robots.txt
```
https://rjunotes.prachitregmi.com.np/robots.txt
```
Expected: `User-agent: *`, `Allow: /`, and `Sitemap:` directive.

### sitemap.xml
```
https://rjunotes.prachitregmi.com.np/sitemap.xml
```
Expected: valid XML listing all main page URLs with the correct canonical base.

### Canonical & Meta Tags

Use the [Rich Results Test](https://search.google.com/test/rich-results) or browser DevTools → Sources to verify:
- `<link rel="canonical">` matches the page URL.
- `<title>` and `<meta name="description">` are page-specific.
- JSON-LD blocks are valid (no errors in the Rich Results Test).

### Open Graph / Twitter Cards

Use [Meta Tags Debugger](https://metatags.io/) or [Twitter Card Validator](https://cards-dev.twitter.com/validator) to preview how the site appears when shared.

### Core Web Vitals

Use [PageSpeed Insights](https://pagespeed.web.dev/) with the live URL to audit performance. Key metrics: LCP, CLS, FID/INP.

---

## How to deploy

Simply open [Lovable](https://lovable.dev/projects/01016a33-e828-4939-9d8a-a9afff627ba8) and click **Share → Publish**.

For a custom domain, navigate to **Project → Settings → Domains** and click **Connect Domain**.
See: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
