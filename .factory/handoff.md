# Bike Service Timeline — polish round 2 handoff

- Work order: `bike-service-timeline-polish-2`
- Date: 2026-08-29 UTC
- Live URL: <https://bike-service-timeline.sociobot.in>
- Repair commits: `50236f3`, `ed1c69c`, `9bbacfc`
- Deployed build ID: `polish-2`

## Done

Closed every finding in `.factory/review-1.md` and
`.factory/review-2.md`. The per-finding map is in
[`polish-2.md`](./polish-2.md).

The release now has:

- a job-first landing screen for people who maintain several bikes;
- one-click `/demo` and `?demo=1` entry with three useful histories;
- separate demo IndexedDB, reset, and Start for real deletion;
- no demo access to real license storage and no license network path;
- parsed CSV and complete JSON claim tests, including escaping and an attachment;
- direct history and backup routes with titles, metadata, h1 focus, reload, back,
  and forward behavior;
- matching app, legal, and 404 shells with one `polish-2` build ID;
- a real HTTP 404, complete 404 metadata, correct MIME types, browser headers,
  and immutable hashed-asset caching;
- 390 px layouts without horizontal overflow and 44 px navigation/legal targets;
- a service worker that precaches public files only and works on Azure Static
  Web Apps;
- plain-word landing, app, legal, README, and catalog copy.

The production billing product is not enabled, and the repository contract does
not authorize billing infrastructure changes. Following F-2-1's accepted repair
path, the broken offer, two-bike gate, attachment gate, pass route, checkout,
license storage, and verification code were removed. The working record,
attachment, export, and offline features remain available.

## Verification

Local final commands:

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

Results:

- Vitest: 9 passed.
- Playwright: 33 passed, 5 intentional cross-viewport skips.
- Build: `dist/index.html` produced.
- Initial JS: 42.02 KB raw / 13.44 KB gzip.
- CSS: 23.64 KB raw / 6.04 KB gzip.
- All-route axe sweep: zero serious or critical findings.
- Local Lighthouse mobile: performance 99, accessibility 100, best practices
  100, SEO 100; LCP 1.8 s, CLS 0, total blocking time 70 ms.
- Live Lighthouse mobile: performance 100, accessibility 100, best practices
  100, SEO 100; LCP 1.4 s, CLS 0, total blocking time 10 ms.

Every command in `.factory/claims.json` was run from clean remote clone
`/tmp/bst-polish-2-clean.bEm8fV` at `9bbacfcfa4723f551ffe700d8841ea26f0f875df`.
The 14 registered claims each have exactly one tagged test and all passed. The
browser claim suite was also pointed at production: 12 Chromium claim tests and
the 390 px mobile-target claim passed.

Production checks:

- factory `verify-url.sh` passed cold root and `?demo=1` loads with zero
  console errors, one h1, `lang=en`, a main landmark, and complete image labels;
- `/`, `/demo`, `/history`, `/backup`, `/privacy/`, `/terms/`, and
  `/404.html` return 200;
- an unknown path and removed `/pass` return HTTP 404;
- `manifest.webmanifest` is `application/manifest+json`;
- AVIF is `image/avif`;
- hashed JS, CSS, and images use `max-age=31536000, immutable`;
- `sw.js` uses `no-cache`;
- root responses include CSP, Permissions Policy, nosniff, and Referrer Policy;
- CSP limits `connect-src` to `'self'`;
- the live service worker installed after excluding the deployment-only config;
- offline reload plus offline CSV and JSON export passed against the live site;
- the social image is 1200×630;
- the catalog description is 72 characters and starts with “Track”.

Evidence:

- [Live root report](./evidence/polish-2/live-root/verify.json)
- [Live demo report](./evidence/polish-2/live-demo/verify.json)
- [Live demo desktop](./evidence/polish-2/live-demo/screenshot-desktop.png)
- [Live demo mobile](./evidence/polish-2/live-demo/screenshot-mobile.png)
- [Local 404 mobile](./evidence/polish-2/local-404-mobile.png)
- [Live Lighthouse JSON](./evidence/polish-2/lighthouse-live.json)

## Run and deploy

```sh
npm ci
npm test
npm run test:e2e
npm run build
# deploy dist/ as the static artifact
```

## Known gaps and next steps

No acceptance finding remains. A paid tier can be considered later only after
the Sociobot product is registered and purchase, restore, revocation, and demo
isolation have observable claim tests. It is not advertised or gated in this
release.
