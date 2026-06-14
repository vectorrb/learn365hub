# Learn365Hub (MVP)

Learn365Hub is a JSON-driven Angular learning resource platform where students can explore curated chapter notes and open PDF resources hosted on Google Drive.

This MVP includes:
- Physics Class 11
- Physics Class 12
- Chemistry Class 11
- Chemistry Class 12

The architecture is designed so you can add new subjects (Mathematics, Biology, Programming, etc.) by adding JSON files only.

## Tech Stack 

- Angular (Standalone Components + Lazy Routes)
- Angular Material
- RxJS
- Static JSON data in assets
- No backend
- No database

## Features

- Responsive card-based home page with all subjects
- Subject-specific notes page
- Notes with external PDF links (Google Drive)
- JSON-driven content loading
- Google Ads-ready integration (global script, reusable component, `ads.txt`)
- Responsive ad layout: two side columns on desktop, one on medium screens, horizontal row on mobile
- Brand logo in header with responsive sizing
- Custom favicon from assets
- Static hosting friendly build (no backend, no database)

## Project Structure

```text
learn365hub/

src/
|
+- app/
|  |
|  +- core/
|  |  +- services/
|  |     +- resource-data.service.ts
|  |     +- google-ads.service.ts
|  |
|  +- shared/
|  |  +- models/
|  |  |  +- subject.model.ts
|  |  |  +- note.model.ts
|  |  +- components/
|  |     +- subject-card/
|  |     +- note-card/
|  |     +- ad-slot/
|  |
|  +- features/
|  |  +- home/
|  |  +- subject/
|  |  +- notes/
|  |
|  +- app.routes.ts
|  +- app.ts
|  +- app.html
|  +- app.scss
|
+- assets/
|  +- data/
|  |  +- subjects.json
|  |  +- physics-11.json
|  |  +- physics-12.json
|  |  +- chemistry-11.json
|  |  +- chemistry-12.json
|  +- img/
|     +- home-page-logo.png
|     +- favicon.png
|
+- styles.scss

public/
+- ads.txt
```

## Routes

- `/` : Home page (all subjects)
- `/subject/physics-11` : Physics Class 11 notes
- `/subject/physics-12` : Physics Class 12 notes
- `/subject/chemistry-11` : Chemistry Class 11 notes
- `/subject/chemistry-12` : Chemistry Class 12 notes

## JSON Data Format

### `src/assets/data/subjects.json`

```json
[
  {
    "id": "physics-11",
    "title": "Physics Class 11",
    "description": "Notes and resources for Class 11 Physics.",
    "subject": "Physics",
    "tags": ["Mechanics", "Units", "Motion"]
  }
]
```

### `src/assets/data/<subject-id>.json`

```json
[
  {
    "id": 1,
    "title": "Units and Measurements",
    "description": "Complete chapter notes",
    "tags": ["chapter1"],
    "downloadLink": "https://drive.google.com/file/d/FILE_ID/view"
  }
]
```

## How to Add a New Subject (No Code Change)

1. Create a new file in `src/assets/data/`.
2. Example: `mathematics-11.json`.
3. Add a matching entry in `src/assets/data/subjects.json` with `id: "mathematics-11"`.
4. Refresh/rebuild app.

No route file or component changes are needed.

## Google Ads Integration (Ready)

Ads-ready code and files are included:

- Global script placeholder in `src/index.html`
- Programmatic ad script loader in `src/app/core/services/google-ads.service.ts`
- Reusable `<app-ad-slot>` component in `src/app/shared/components/ad-slot/`
- `public/ads.txt` for AdSense ownership validation

### Ad placement layout

| Screen width | Ad layout |
|---|---|
| > 1279px (wide desktop) | Left + right vertical columns |
| 1025–1279px (medium desktop) | Left vertical column only |
| 769–1024px (tablet) | No side columns |
| < 768px (mobile) | Horizontal row below content |
| Home page (all widths) | Extra horizontal row below subject cards |

### Replace these placeholders before production

- `ca-pub-XXXXXXXXXXXXXXXX` in `src/index.html` and `src/app/core/services/google-ads.service.ts`
- Ad slot IDs in template usages (currently placeholder strings like `'3001002001'`)
- `pub-XXXXXXXXXXXXXXXX` in `public/ads.txt`

## Security and Performance Notes

- HTTPS should be enforced by hosting provider
- External links use `noopener noreferrer`
- Pure static hosting reduces attack surface
- Lazy-loaded routes optimize initial bundle load

## Responsive Design

- Mobile-first responsive CSS
- Material cards/chips/buttons
- CSS Grid and Flex layout patterns
- Works across mobile, tablet, desktop

## Local Development

```bash
npm install
npm start
```

App runs at default Angular dev server URL.

## Build

```bash
npm run build
```

Output folder:

```text
dist/learn365hub
```

## Deployment (Static Hosting)

Deploy the build output from `dist/learn365hub/browser` to:

- GitHub Pages
- Netlify
- Vercel

No backend setup required.

See [HOSTING.md](HOSTING.md) for step-by-step deployment instructions, custom domain setup, and Angular routing fix for each platform.

## ZIP Packaging

To create ZIP manually:

```powershell
Compress-Archive -Path .\learn365hub\* -DestinationPath .\learn365hub.zip -Force
```

## Testing

```bash
npm test
```

## Notes

- Keep JSON files valid and consistent with interfaces.
- If a subject ID does not have a matching JSON file, notes will not load for that subject.
