# SEO Guide

This project now includes a working SEO baseline for Google indexing.

## Current Setup

- Route-specific SEO metadata is managed in `src/app/core/seo/seo.service.ts`
- Site-level constants are defined in `src/app/core/seo/site.config.ts`
- Static SEO assets are published from `public/robots.txt` and `public/sitemap.xml`
- Angular SSR/prerender is enabled for the home page and all subject pages
- The `/view-pdf` route is marked `noindex, nofollow`

## Current Domain

The project is currently configured with:

```ts
https://learn365hub.com
```

If your production domain changes, update all of the following:

1. `src/app/core/seo/site.config.ts`
2. `public/robots.txt`
3. `public/sitemap.xml`

## What Gets Indexed

The build prerenders these routes:

- `/`
- `/subject/physics-11`
- `/subject/physics-12`
- `/subject/chemistry-11`
- `/subject/chemistry-12`

The `/view-pdf` page should not be indexed.

## Metadata Included

Each important page now emits:

- `<title>`
- `<meta name="description">`
- `<meta name="robots">`
- `<link rel="canonical">`
- Open Graph tags
- Twitter card tags

## Google Search Console Steps

1. Deploy the site to your final production domain.
2. Open Google Search Console.
3. Add your domain as a `Domain property`.
4. Complete DNS verification.
5. Submit this sitemap:

```text
https://learn365hub.com/sitemap.xml
```

6. Request indexing for the home page and important subject pages.

## Files Involved

- `src/app/core/seo/site.config.ts`
- `src/app/core/seo/seo.service.ts`
- `src/app/app.routes.ts`
- `src/app/app.routes.server.ts`
- `src/app/features/home/home.page.ts`
- `src/app/features/subject/subject.page.ts`
- `src/app/features/download/download.page.ts`
- `public/robots.txt`
- `public/sitemap.xml`

## When Adding New Data

### If you add a new note inside an existing subject JSON file

Example files:

- `src/assets/data/physics-11.json`
- `src/assets/data/chemistry-12.json`

Expected SEO impact:

- no route changes are required
- no HTML changes are required
- no sitemap change is required
- the note will appear under the existing subject page automatically

What still matters for SEO:

- keep `title` descriptive
- keep `description` meaningful, not generic
- keep `downloadLink` valid

### If you add a brand new subject page

Example: adding `math-11`

You must update these JSON files:

1. `src/assets/data/subjects.json`
	- add a new object with:
	- `id`
	- `title`
	- `description`
	- `subject`
	- `tags`

2. `src/assets/data/math-11.json`
	- create the note list for that subject

You must also update these SEO-related files:

1. `src/app/core/services/resource-data.service.ts`
	- add the new JSON import for server-side/prerender data
	- add the new entry in `notesBySubject`

2. `public/sitemap.xml`
	- add the new route URL such as:
	- `https://learn365hub.com/subject/math-11`

3. Run `npm run build`
	- this confirms the new subject route is included in prerender output

### If you change subject title or description in JSON

Example file:

- `src/assets/data/subjects.json`

Expected SEO impact:

- subject page `<title>` changes automatically
- subject page meta description changes automatically
- Open Graph and canonical tags remain correct
- no HTML edits are required

### If you want richer SEO copy on subject pages

Current subject SEO uses the `description` field from `subjects.json`.

If you want better search visibility, improve the text in:

- `src/assets/data/subjects.json`

If you want longer on-page content visible to users, then update:

- `src/app/features/subject/subject.page.html`

Examples of useful HTML additions:

- short intro paragraph for the subject
- exam-oriented copy
- internal links to related subjects
- chapter summary text above the notes list

### If you add a completely new route type

Example: `/chapter/:id` or `/exam-notes/:id`

Then JSON-only changes are not enough. You must also review:

1. `src/app/app.routes.ts`
	- route title setup

2. `src/app/app.routes.server.ts`
	- prerender or server rendering configuration

3. `src/app/core/seo/seo.service.ts`
	- confirm metadata is being set for the new route

4. `public/sitemap.xml`
	- add the new URLs if they should be indexed

5. route HTML component
	- ensure the page has a good `<h1>` and meaningful visible content

## JSON vs HTML Change Rules

Use this as the quick rule:

- adding notes to an existing subject: JSON only
- changing subject title/description: JSON only
- adding a new subject: JSON + sitemap + server data mapping
- adding new route types: JSON + route config + prerender config + HTML review
- improving ranking content: usually HTML and copy improvements, not just JSON

## Build Validation

Use this command to validate the SEO and prerender setup:

```bash
npm run build
```

Expected outcome:

- browser bundle builds successfully
- server bundle builds successfully
- prerender completes for 5 static routes

## Recommended Next Steps

1. Replace the placeholder AdSense publisher ID with your real one.
2. Add a Google Search Console verification tag in `src/index.html` after Google provides it.
3. Add JSON-LD structured data for the home page and subject pages.
4. Automate `sitemap.xml` generation if you plan to add many more subjects.