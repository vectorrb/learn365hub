# Hosting Guide – Learn365Hub

The app is a fully static Angular build. No server or database is required. The build output folder to deploy is:

```
dist/learn365hub/browser
```

---

## Option 1 – GitHub Pages (Free)

### Step-by-step

1. Create a GitHub repository and push your project.
2. Install the deployment helper:
   ```bash
   npm install gh-pages --save-dev
   ```
3. Add a deploy script to `package.json`:
   ```json
   "deploy": "ng build && npx gh-pages -d dist/learn365hub/browser"
   ```
4. Run:
   ```bash
   npm run deploy
   ```
5. In your GitHub repo go to **Settings → Pages** and set the source to the `gh-pages` branch.
6. Your site will be live at `https://<your-username>.github.io/learn365hub/`.

### Angular routing fix (required for GitHub Pages)

GitHub Pages returns a 404 for deep links like `/subject/physics-11`. Fix this by adding a `404.html` that redirects back to the app:

Create `public/404.html` with the following content:

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <script>
      var path = window.location.pathname.replace('/learn365hub', '');
      sessionStorage.setItem('redirect', path);
      window.location.replace('/learn365hub/');
    </script>
  </head>
</html>
```

Then in `src/index.html` add this script inside `<head>` before closing:

```html
<script>
  (function () {
    var redirect = sessionStorage.getItem('redirect');
    if (redirect) {
      sessionStorage.removeItem('redirect');
      history.replaceState(null, '', redirect);
    }
  })();
</script>
```

### Custom domain on GitHub Pages

1. Buy a domain (e.g. `learn365hub.com`) from Namecheap or GoDaddy.
2. In your GitHub repo go to **Settings → Pages → Custom domain** and enter your domain.
3. At your domain registrar, add these DNS records:
   ```
   A    @    185.199.108.153
   A    @    185.199.109.153
   A    @    185.199.110.153
   A    @    185.199.111.153
   CNAME  www  <your-username>.github.io
   ```
4. Enable **Enforce HTTPS** in GitHub Pages settings (free via Let's Encrypt).
5. Update `baseHref` in the build command if deploying to root domain:
   ```bash
   ng build --base-href /
   ```

---

## Option 2 – Netlify (Free tier, Recommended)

### Step-by-step

1. Run `npm run build` locally.
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag and drop the `dist/learn365hub/browser` folder.
4. Done — Netlify gives you a public URL instantly.

### Angular routing fix (required for Netlify)

Create `public/_redirects` with:

```
/*  /index.html  200
```

This file will be copied to the build output automatically.

### Deploy from GitHub (auto-deploy on push)

1. Connect your GitHub repo to Netlify via the dashboard.
2. Set build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist/learn365hub/browser`
3. Every push to `main` triggers a new deployment automatically.

### Custom domain on Netlify

1. In Netlify dashboard go to **Domain settings → Add custom domain**.
2. Add your domain and follow the DNS instructions shown.
3. HTTPS is provisioned automatically for free.

---

## Option 3 – Vercel (Free tier, Best CDN)

### Step-by-step

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **New Project** and import your repository.
3. Set:
   - **Framework preset:** Angular (auto-detected)
   - **Build command:** `npm run build`
   - **Output directory:** `dist/learn365hub/browser`
4. Click **Deploy** — done.

### Angular routing fix (required for Vercel)

Create `public/vercel.json` with:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Custom domain on Vercel

1. In project dashboard go to **Settings → Domains**.
2. Add your domain and update your registrar's DNS to point to Vercel nameservers.
3. HTTPS is automatic.

---

## Comparison

| | GitHub Pages | Netlify | Vercel |
|---|---|---|---|
| Cost | Free | Free tier | Free tier |
| Custom domain | Yes (free HTTPS) | Yes (free HTTPS) | Yes (free HTTPS) |
| Auto-deploy from GitHub | Yes (gh-pages action) | Yes (native) | Yes (native) |
| CDN | Basic | Good | Excellent |
| Angular routing fix | Needs 404.html workaround | `_redirects` file | `vercel.json` rewrite |
| AdSense approval | Custom domain preferred | Custom domain preferred | Custom domain preferred |

---

## Domain Recommendation

| Scenario | Recommendation |
|---|---|
| Testing or sharing | `username.github.io/learn365hub` — free, no purchase needed |
| Real launch | Buy `learn365hub.com` (~₹800–₹1200/year) and point to Netlify or Vercel |
| Best combo | GitHub for code version control + Vercel for hosting + your own `.com` domain |

> Google AdSense requires a custom domain (not a sub-path of github.io) for publisher account approval.

---

## Environment Pre-flight Checklist Before Going Live

- [ ] Replace `ca-pub-XXXXXXXXXXXXXXXX` with real AdSense publisher ID in `src/index.html` and `google-ads.service.ts`
- [ ] Replace placeholder ad slot IDs in `app.html` and `subject.page.html`
- [ ] Update `public/ads.txt` with real publisher ID
- [ ] Replace placeholder Google Drive links in all subject JSON files with real file IDs
- [ ] Enable HTTPS at your hosting provider
- [ ] Test all routes manually: `/`, `/subject/physics-11`, `/subject/chemistry-12`
- [ ] Test on mobile, tablet, and desktop
