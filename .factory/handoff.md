# Bike Service Timeline — polish round 4 handoff

## Result

- Work order: `bike-service-timeline-polish-4`
- Status: **PASS — zero known findings**
- Review source: `09b3cdd0db8e3bedb7add067cb89d3ed7b8e2c3b`
- Final implementation commit: `c974390d5ff60b7d0626b7ca6c58f55e0e79dac3`
- Live URL: <https://bike-service-timeline.sociobot.in>
- Final Static Web Apps deployment: `6b57b394-3dca-4f4f-858c-13cdcd8ecfe9`

## What changed

The shared header now exposes the four useful destinations on every route:
Demo, All history, Back up and export, and Privacy. The wordmark remains the
home link. The first-screen sample action enters exact `/?demo=1` in one click.
Phone navigation now wraps and sizes itself so all four links remain visible,
with 44 px targets and no page overflow. The catalog description is a
64-character verb-first sentence, and the build identity is `polish-4`.

All cumulative work remains intact: the job-first first screen, isolated and
resettable sample database, 15 real claim tests, nested backup validation,
month-end and mileage calculations, complete exports, real route titles and
focus, designed HTTP 404, legal metadata, privacy boundaries, and offline PWA.
The paper-workshop visual identity was preserved.

Every finding-to-change-to-evidence mapping is in
[`polish-4.md`](./polish-4.md).

## Exact verification

- Fresh clone: `/tmp/bike-service-timeline-polish4-final.K0jTHH` at exact SHA
  `c974390d5ff60b7d0626b7ca6c58f55e0e79dac3`.
- `npm ci`: 61 packages, 0 vulnerabilities.
- `npm test`: 9/9 unit and factory-contract tests passed.
- `npm run build`: passed; `dist/index.html` produced with 18 precached files.
- Every one of the 15 exact commands in `.factory/claims.json`: passed.
- Full clean-clone browser schedule: 36 passed; 6 intentional
  viewport-independent mobile duplicates skipped.
- Final local browser schedule: 36 passed; 6 intentional skips.
- Final production browser schedule with `PLAYWRIGHT_BASE_URL`: 36 passed; 6
  intentional skips. This includes Axe scans, request-origin privacy checks,
  offline reload, demo isolation/reset, complete CSV/JSON parsing, route
  title/canonical/focus/history, dialog focus, mobile targets, and unclipped
  header links.
- Cold root, exact `?demo=1`, and 404 verification reports show HTTPS 200, one
  h1, `lang=en`, a main landmark, no missing alt text, and zero console errors.
- Unknown live path `/does-not-exist-polish-4`: HTTP 404 with the designed
  `Page not found` recovery screen.
- Production headers: CSP, Permissions Policy, nosniff, referrer policy,
  manifest/AVIF MIME types, and one-year immutable caching for fingerprinted
  assets all present.
- Payload: initial JS 42.17 KB raw / 13.45 KB gzip; CSS 23.76 KB raw / 6.07 KB
  gzip; both are under budget.
- Live mobile Lighthouse: Performance 98, Accessibility 100, Best Practices
  100, SEO 100; FCP 0.99 s, LCP 1.80 s, TBT 140 ms, CLS 0.
- `npm audit --audit-level=moderate`: 0 vulnerabilities.

Evidence is under [`evidence/polish-4`](./evidence/polish-4/), including final
mobile/desktop screenshots, verifier JSON, response headers, unknown-path body,
and the Lighthouse JSON report.

## Run and deploy

```sh
npm ci
npm test
npm run test:e2e
npm run build
/opt/fleet/lib/deploy-static.sh bike-service-timeline dist
```

Deploy `dist/` as the static PWA. It contains the offline worker, manifest,
legal routes, designed 404, and Static Web Apps configuration.

## Known gaps and next steps

None. No finding of any severity remains unresolved.
