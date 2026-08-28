# Bike Service Timeline — independent verification handoff

- Work order: `bike-service-timeline-verify-1`
- Candidate: `445eafa245297b837202c292d2118d427d9b8fbc`
- Live URL: <https://bike-service-timeline.sociobot.in>
- Verified: 2026-08-28 UTC
- Final result: **FAIL**

## Outcome

The candidate builds cleanly, passes its repository tests, and the live site is
the exact candidate artifact. Core happy paths, local persistence, exports,
desktop/mobile layouts, keyboard use, axe checks, offline writes/reloads, PWA
installability, and the service-worker update flow were verified successfully.

Release is blocked by these defects:

1. **High:** the live Workshop Pass checkout returns HTTP 404, making unlimited
   bikes and receipt/photo attachments impossible to purchase.
2. **High:** a correctly branded but semantically malformed v1 backup is
   persisted; opening Bench then throws `Invalid time value`, and reloads remain
   on the fatal screen until site data is cleared.
3. **Medium:** 2026-01-31 plus a one-month interval is shown as 2026-03-03 rather
   than clamped to 2026-02-28.
4. **Medium:** a later component service with no odometer rewinds the distance
   baseline to installation mileage (observed 2,800 km becoming 2,000 km).
5. **Medium:** several 390 px mobile legal/footer targets measure only 15–21 px
   high, below the required 44 px.
6. **Medium:** fingerprinted assets are served with 30-second revalidation, not
   long-lived immutable caching.
7. **Low:** CSP and Permissions Policy are absent; manifest and AVIF responses
   use `application/octet-stream`.

Full reproduction steps and evidence are in
[`.factory/verification.md`](./verification.md).

## Verification commands and results

From a detached clean worktree at the candidate SHA:

```sh
npm ci
npm test
npm run build
npm run test:e2e
npx tsc --noEmit
npm audit --audit-level=moderate
```

- Vitest: 4 passed.
- Playwright: 6 passed, 2 intentional viewport skips.
- Build/type check: passed; `dist/index.html` produced.
- Audit: 0 vulnerabilities.
- No lint command exists.
- Axe: 0 serious/critical findings across tested empty, dialog, pass, populated,
  light, dark, desktop, and mobile states.
- Live Lighthouse mobile, three runs: 95/99/94 performance (median 95); full run
  100 accessibility, 100 best practices, 100 SEO; median LCP 1.80 s, CLS 0.
- Payloads: 38.47 KB JS, 22.52 KB CSS, 47.13 KB hero AVIF, no fonts.
- All 17 live deployment files matched the locally generated `dist/`
  byte-for-byte.

## Next steps

Fix V-01 through V-06, deploy the repaired candidate, confirm a complete hosted
test purchase/return/restore flow, and rerun independent verification. Product
source was not modified by this verification; only this handoff and the
verification report were changed.
