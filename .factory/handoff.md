# Bike Service Timeline — build handoff

- Work order: `bike-service-timeline-build-1`
- Completed: 2026-08-28
- Deploy type: static PWA
Deploy root: `dist/` (`dist/index.html` is present)

## What was built

- A complete local-first bike maintenance record using TypeScript, Vite, and
  native IndexedDB. Users can add/edit/delete bikes, manage component baselines
  and custom time/distance intervals, and log dated work with mileage, cost,
  workshop, notes, photos, or receipts.
- A calculated all-bike next-service bench and one searchable chronological
  history with bike filtering, CSV download, and print styling. Interval copy
  explicitly says reminders are not safety certification.
- Full JSON backup, merge/replace restore, and local deletion behavior. Import
  validates the product/schema and resolves matching IDs by latest `updatedAt`.
- Installable offline PWA with 192/512 maskable icons, a versioned generated
  precache, navigation fallback, asset caching, install splash colours, and an
  in-app update prompt. Offline viewing and new local records do not depend on
  a server.
- A genuinely useful two-bike free tier. The US$19 one-time Workshop Pass uses
  the required slug-based Sociobot checkout, return-token storage, background
  daily verification, cached offline verdict, restore-license form, and quiet
  invalid-license notice. It unlocks unlimited bikes and file attachments;
  accessibility, safety copy, CSV, print, and JSON backup are never gated.
- Product-specific light/dark paper-cut workshop UI with original generated
  art, responsive 390 px layout, keyboard-native dialogs/forms, focus states,
  reduced-motion behavior, empty/error/offline/update states, and semantic
  landmarks.
- Privacy and terms pages, full README, MIT license, manifest, robots file, and
  sitemap. No analytics, remote fonts, runtime CDNs, accounts, or sync.

## Verification

Commands run from `/work/repo`:

```sh
npm test
npm run test:e2e
npm run build
npm audit
```

Results:

- Unit tests: 4 passed (service-date/distance calculations, CSV escaping,
  backup validation).
- Playwright 1.58.2: desktop Chromium and 390 px mobile creation → component →
  service → reload flow passed; offline reload passed on both; JSON
  export/delete/restore passed; axe WCAG A/AA scans found no serious or critical
  violations in empty and populated timeline states.
- Production build: successful; initial app JS 38.47 KB raw / 12.15 KB gzip,
  CSS 22.52 KB raw / 5.87 KB gzip. Hero variants: AVIF 47 KB, WebP 78 KB,
  JPEG 151 KB (all under the 300 KB requirement). No font payload.
- Lighthouse mobile, local production preview: Performance **99**,
  Accessibility **100**, Best Practices **100**, SEO **100**. FCP 1.0 s, LCP
  2.0 s, total blocking time 0 ms, CLS 0.
- Console smoke test on desktop and 390 px empty states: zero errors, exactly
  one `h1`, and one `main`.
- `npm audit`: 0 vulnerabilities after updating Vite and Vitest to patched
  versions.

Exact production command: `npm run build`. It type-checks, builds all three
HTML entries, and generates the versioned `dist/sw.js` precache.

## Known gaps and release steps

- The factory must register the `bike-service-timeline` paid product and its
  return URL in the Sociobot billing engine before checkout can complete. No
  product ID or payment secret is embedded in this repository.
- License verification was implemented to contract and failure-tested through
  the resilient free state, but a real hosted purchase could not be completed
  without that external product registration.
- Records intentionally do not sync between devices. JSON backup/restore is the
  supported portability path; clearing browser storage without a backup cannot
  be recovered by the service.
- Cost is stored as a user-entered number without imposing a currency because
  this local utility has no account locale or billing profile.

## Next step

Deploy `dist/`, register the paid product/return URL, then run one checkout in
the billing sandbox to confirm the production hostname’s CORS and redirect
configuration.
