# Bike Service Timeline — polish 3 handoff

- Work order: `bike-service-timeline-polish-3`
- Repair commit: `6f7913e1c10739048b00d206ddc5b10c34eec0b5`
- Deployed production URL: <https://bike-service-timeline.sociobot.in>
- Deployment: Static Web Apps production deployment `b97acca9-ef28-42ba-8830-c6898e1a4078`

## Done

Resolved every review finding. The core multi-bike promise has its own real-data
claim and browser test. The root metadata now says `Track service across all
bikes`. The designed 404 uses literal error/recovery copy. Build identity is
`polish-3`. The product remains an offline, local-first PWA with its paper
workshop visual system intact.

The full per-ID mapping is in [`.factory/polish-3.md`](./polish-3.md). The
catalog description is verb-first and 68 characters long.

## Verification

- Clean clone: `/tmp/bike-service-timeline-clean.tioGQe` at repair commit
  `6f7913e`; `npm ci`, `npm test` (9 passed), and `npm run build` passed.
- Every one of the 15 exact commands in `.factory/claims.json` passed from that
  clone with `set -e`, including `@claim:multi-bike-history`.
- Local full browser suite: 35 passed and 5 intentional mobile skips; it covers
  dialog focus, metadata, all-route Axe scans, offline reload, demo isolation,
  exports, routing, privacy requests, print, and mobile targets.
- The same full suite passed against production using
  `PLAYWRIGHT_BASE_URL=https://bike-service-timeline.sociobot.in npm run test:e2e`.
- `verify-url.sh` cold checks for [root](./evidence/polish-3/live-root/verify.json)
  and [direct `?demo=1`](./evidence/polish-3/live-demo/verify.json) report no
  console errors, one h1, main, `lang=en`, and no missing alt text.
- Live `GET /does-not-exist` returned HTTP 404 with [literal recovery copy](./evidence/polish-3/live-404.html).
- Live headers confirm CSP, Permissions Policy, nosniff, referrer policy,
  manifest/AVIF MIME types, and immutable cache headers for fingerprinted files.
- [Lighthouse](./evidence/polish-3/lighthouse-live.json) on production scored
  Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s,
  LCP 1.5 s, CLS 0, TBT 0 ms.

## Run and deploy

```sh
npm ci
npm test
npm run test:e2e
npm run build
```

Deploy `dist/` as the configured static site. The build output includes the
manifest, service worker, legal pages, designed 404, and Static Web Apps config.

## Known gaps

None. There are no unresolved review findings or unsupported visitor-facing
claims.
