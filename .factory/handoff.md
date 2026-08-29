# Bike Service Timeline — review 2 handoff

- Work order: `bike-service-timeline-review-2`
- Date: 2026-08-29 UTC

## Done

Performed the requested independent adversarial review. No product code was
modified. Added `.factory/review-2.md` with fresh phone/desktop live evidence,
copy audit, claim-command results, full earlier-finding recheck, routing/404
checks, and final FAIL verdict.

## Verification performed

```sh
npm ci
npm test
npm run build
# every exact command listed in .factory/claims.json
```

All commands exited successfully. A separate clean clone at
`/tmp/bike-service-review-2.YrVpnr` also passed `npm test` (6 tests) and
`npm run test:e2e` (22 passed, 2 intentional skips); the latter produces
`dist/`.

Live checks used fresh Chromium contexts at 390 × 844 and 1440 × 1000, the
production `/demo` flow, direct routes, response headers, request logging, and
the production checkout endpoint.

## Open blockers

1. Production Workshop Pass checkout returns HTTP 404.
2. Demo mode reads/writes ordinary license `localStorage` and requests
   `api.sociobot.in` when a real saved token exists.
3. CSV and JSON-backup claim tests only verify filenames, not exported content.
4. Several landing/README/pass promises lack claims/tests; 404 metadata and
   shell consistency plus residual metaphor copy also remain.
