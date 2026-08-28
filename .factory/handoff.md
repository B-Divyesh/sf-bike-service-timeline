# Bike Service Timeline — polish 1 handoff

- Work order: `bike-service-timeline-polish-1`
- Repair commits: `5aae0f48816f4f28f34eb46b37e5d6ca7296b5f1`, `03849d4`, `90c733a`
- Live URL: <https://bike-service-timeline.sociobot.in>
- Deployed: 2026-08-28 UTC via `/opt/fleet/lib/deploy-static.sh`

## Done

The PWA now has a one-click `/demo` and `?demo=1` sample path with its own
`demo:bike-service-timeline` IndexedDB database, realistic three-bike sample,
persistent reset/start-real banner, claim registry, real history/backup/pass
URLs, route title/focus announcements, complete metadata, common legal shell,
and product-styled 404. It validates every imported record before replacing or
merging data, clamps month-end reminders, and retains the latest known mileage.

Static Web Apps configuration adds CSP, Permissions Policy, immutable hashed
asset caching, MIME mappings, direct route rewrites, and 404 handling. The
paper-workshop visual system, generated illustration, and local-first model
remain intact. The 1200×630 social image is a crop derived from the existing
product-owned generated workshop art.

## Verification

From a clean dependency install:

```sh
npm ci
npm test                         # 6 passed
npm run build                    # dist/ produced; JS 45.91 KB raw / 14.46 KB gzip
npm run test:e2e                 # 22 passed, 2 intentional skips
npx tsc --noEmit                 # passed via build
```

Every command listed in `.factory/claims.json` was run. The two unit claim
commands passed; all eight Playwright claim commands passed in both configured
desktop and mobile projects. The browser suite includes offline reload,
isolated demo/reset, export downloads, route history, mobile target sizes, and
axe coverage.

Cold live checks after the final deployment:

- `/demo`: title `Demo — Bike Service Timeline`, banner present, sample bike present, and no console errors.
- `/?demo=1`: enters the same isolated sample; `/` stayed empty in the fresh context.
- `/history?demo=1`: title `Service history — Bike Service Timeline`; focus moved to `#main`.
- Live axe WCAG A/AA: **0 serious/critical** violations at 390px.
- `/does-not-exist`: HTTP 404 with the designed product page.
- Hashed JS: `Cache-Control: public, max-age=31536000, immutable`.
- Manifest: `Content-Type: application/manifest+json`; headers include CSP, Permissions Policy, nosniff, and Referrer Policy.
- Screenshots: `.factory/evidence/live-demo-desktop.png`, `.factory/evidence/live-demo-mobile.png`, and `.factory/evidence/live-404-mobile.png`.

## Known external blocker

The required production Sociobot checkout endpoint still returned HTTP 404 on
2026-08-28:

`https://api.sociobot.in/api/v1/products/bike-service-timeline/checkout`

with `{"error":"enabled factory product","status":404}`. The application
uses the required Sociobot URL and has no authority to enable/register that
merchant product. Factory billing registration is required before claiming the
US$19 purchase flow is live; this is the only unresolved acceptance item.
