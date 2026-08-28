# Independent product verification — FAIL

- Work order: `bike-service-timeline-verify-1`
- Candidate: `445eafa245297b837202c292d2118d427d9b8fbc`
- Live URL: <https://bike-service-timeline.sociobot.in>
- Verified: 2026-08-28 UTC
- Result: **FAIL**

The candidate builds and its core happy path works locally and offline, and the
live static artifact exactly matches the candidate build. It is not ready to
accept because checkout is unavailable, malformed imports can persist data that
prevents the app from opening, and next-service calculations are wrong for two
representative boundary cases.

## Defects

### High — V-01: production Workshop Pass checkout returns 404

`GET https://api.sociobot.in/api/v1/products/bike-service-timeline/checkout`
returned HTTP 404 with:

```json
{"error":"enabled factory product","status":404}
```

The live “Buy Workshop Pass” link points to this exact endpoint. A new user
cannot buy the US$19 unlock, so unlimited bikes and the brief-required
receipt/photo path cannot be obtained. The verify endpoint itself works:
an invalid token returned HTTP 200 with
`{"expires_at":null,"reason":"invalid","valid":false}`, and its CORS preflight
allowed the live origin.

### High — V-02: a malformed v1 backup is persisted and makes the app unable to open

The import validator checks only the product name, schema version, and whether
the three collections are arrays. A branded v1 backup containing a component
with `installedDate: "not-a-date"` and `intervalMonths: 1` was accepted and
persisted. Opening Bench then raised an uncaught `Invalid time value`; after
reload the only screen was:

```text
The workshop would not open
Invalid time value
```

Reload repeats the failure. The UI provides no way to remove the corrupt
record; recovery requires clearing all site data, potentially discarding valid
records. Malformed JSON and a foreign-product JSON envelope were correctly
rejected, but nested records are not validated before the transaction commits.

### Medium — V-03: month-end service intervals roll into the wrong month

Reproduction: create a component with baseline date 2026-01-31 and a one-month
interval. On 2026-08-28 the app rendered `was due Mar 3, 2026`. A calendar-month
reminder from January 31 should clamp to February 28, not overflow three days
into March. This can delay owner-configured reminders.

### Medium — V-04: a service without mileage rewinds the distance baseline

With installation mileage 1,000 km and a 1,000 km interval:

1. A component service at 1,800 km correctly changed the next trigger to
   2,800 km.
2. A later service for the same component with the optional odometer blank
   changed the trigger to 2,000 km.

The date of the latest service is combined with the old installation mileage.
Distance calculation should retain the latest service mileage that is actually
known. The current result gives an inaccurate next-service view.

### Medium — V-05: several mobile links miss the 44 px touch-target contract

At a 390 × 844 CSS px viewport, measured visible targets included:

- merchant-note `terms`: 38 × 15 px
- footer `Privacy`: 51 × 21 px
- footer `Terms`: 41 × 21 px
- brand link: 126 × 42 px

Primary controls and navigation met the target size. The affected inline and
footer links do not meet this product's explicit 44 × 44 px target requirement.

### Medium — V-06: fingerprinted assets are not served with immutable caching

The live hashed JS and CSS, as well as images, are served with
`Cache-Control: public, must-revalidate, max-age=30`. Fingerprinted assets should
have a long-lived immutable policy. The service worker mitigates repeat loads
after installation, but the deployment does not meet the stated static/PWA
caching contract.

### Low — V-07: response-policy and MIME hardening is incomplete

Live responses include HSTS, `nosniff`, and a referrer policy, but no
`Content-Security-Policy` or `Permissions-Policy`. The manifest and AVIF are
served as `application/octet-stream` rather than their specific MIME types.
Chromium still parsed the manifest, reported no installability errors, and
rendered the AVIF, so this was not a functional blocker in the tested browser.

## Clean-checkout gates

Testing ran in a detached clean worktree at the exact candidate SHA with Node
v22.23.2, npm 10.9.8, Playwright 1.58.2, and Chrome for Testing 145.0.7632.6.
The source worktree remained clean.

| Gate | Result |
| --- | --- |
| `npm ci` | PASS; 59 packages installed, 0 vulnerabilities |
| `npm test` | PASS; 4/4 Vitest tests |
| `npm run build` | PASS; TypeScript check + Vite build + service-worker generation |
| `npm run test:e2e` | PASS; 6 passed, 2 intentional viewport skips |
| `npx tsc --noEmit` | PASS |
| `npm audit --audit-level=moderate` | PASS; 0 vulnerabilities |
| Lint | Not available; no lint script/configuration is present |

The exact production build generated `dist/index.html` and a service worker
with cache name `bike-timeline-ed91834b72` and 16 precached shell files.

## Independent end-to-end evidence

Tested in clean browser contexts on desktop (1440 × 1000) and mobile
(390 × 844):

- Empty state, two-bike free flow, third-bike paywall boundary, and cached paid
  entitlement allowing a third bike.
- Bike/component/service creation; 60-character bike name; zero odometer and
  cost; minimum/maximum interval validation; negative odometer, empty required
  name, future service date, interval zero, and 241-month input rejection and
  recovery.
- Cross-bike component selection, chronological history, search/no-results/
  clear-filter flow, and CSV quoting.
- Malformed JSON and foreign-product import rejection without losing existing
  data; repository backup/delete/restore round trip.
- Invalid attachment MIME, greater-than-4-MB file, greater-than-8-MB total, and
  successful persisted PNG attachment under a cached valid entitlement.
- Free-license invalid-token recovery, return-token URL stripping, localStorage
  persistence, and live verification request.
- Keyboard-only skip link, native form validation, modal focus entry, Escape,
  focus return, and visible focus treatment.
- Light and dark themes, reduced-motion media query, no horizontal overflow,
  one `h1`, one `main`, `lang="en"`, title, image alternative, privacy and terms.
- Axe WCAG A/AA scans of empty, dialog, pass, and populated dark/mobile states:
  **0 serious or critical findings**.
- Fresh-load network capture: only the app origin; no analytics, remote font,
  CDN, or tracking request. User records remained in IndexedDB. Only explicit
  license verification contacted `api.sociobot.in`.
- Console/page-error capture for valid empty, populated, desktop, mobile,
  attachment, and offline flows: **0 errors**.

## PWA, live identity, and offline evidence

- All 17 files in the locally generated `dist/` were downloaded from the live
  URL and compared byte-for-byte with `diff`: no differences.
- Live `index.html`, `sw.js`, and manifest SHA-256 values matched the candidate;
  asset filenames were `main-DM4kEVoh.js` and `main-B1n5gMUv.css`.
- Chromium parsed the manifest with zero errors and
  `Page.getInstallabilityErrors` returned an empty list locally and live.
- Local and live mobile tests installed/controlled the service worker, switched
  the browser offline, reloaded, created an `Offline Bike`, reloaded again, and
  retained the record.
- A disposable copy of the production output was updated with a changed service
  worker. The running app displayed “A fresh app version is ready”; “Update now”
  sent `SKIP_WAITING`, changed controller, and reloaded successfully.
- The returned-license flow removed `license` from the visible live URL and an
  invalid token produced the quiet recoverable notice without blocking free
  records.

## Performance and payloads

Production output, raw / gzip where reported by Vite:

- Initial JS: 38.47 KB / 12.15 KB (budget 200 KB)
- CSS: 22.52 KB / 5.87 KB (budget 50 KB)
- Fonts: 0 KB (budget 120 KB)
- Hero AVIF: 47,133 bytes (budget 300 KB)

Three fresh simulated-mobile Lighthouse runs against the live URL scored
Performance **95, 99, 94** (median **95**). The full-category run scored
Accessibility **100**, Best Practices **100**, and SEO **100**. Median lab
metrics were FCP 0.91 s, LCP 1.80 s, TBT 232 ms, and CLS 0. Lighthouse does not
provide a trustworthy lab INP measurement; no field INP data was available.
One local run was an 82-point/TBT 690 ms outlier, while the live repeated median
met the required score and LCP/CLS budgets.

## Response checks

- HTTPS: HTTP/2, valid certificate, no redirect.
- Present: `Strict-Transport-Security`, `Referrer-Policy:
  strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`.
- Absent: CSP and Permissions Policy (V-07).
- HTML and service worker use 30-second revalidation; hashed assets incorrectly
  use the same policy (V-06).
- Brotli is enabled: the 38,467-byte JS transferred as 12,306 bytes.
- Unknown paths currently return the app shell with HTTP 200, consistent with a
  static SPA fallback.

## Required disposition

Do not release this candidate as PASS. Register/enable and retest the production
billing product, validate every imported record before committing it, correct
the independent date and mileage baselines, meet mobile target sizes, and apply
production asset/header policies. Rerun this verification against the repaired
candidate and live deployment.
