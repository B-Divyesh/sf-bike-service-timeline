# Bike Service Timeline — adversarial review 1 handoff

- Work order: `bike-service-timeline-review-1`
- Candidate: `5573fa0b86f23f401280322c6b7cbf8a6e2aca05`
- Live URL: <https://bike-service-timeline.sociobot.in>
- Reviewed: 2026-08-28 UTC
- Result: **FAIL**

## What was done

Completed a cold first-read review in fresh 390 × 844 and 1440 × 1000 Chromium
contexts; audited every landing/README copy unit and product claim; attempted
`/demo` and `/?demo=1`; checked storage isolation, requests, offline reload,
accessibility, routes, back/focus behavior, metadata, 404 handling, headers,
MIME, caching, links, and visual identity; and reverified every prior V-01
through V-07 defect live and in code.

The full evidence, rewrites, tests to add, and finding IDs are in
`.factory/review-1.md`. Product code was not modified.

## Verification

From a detached clean worktree at the candidate commit:

```sh
npm ci
npm test
npm run build
npm run test:e2e
npx tsc --noEmit
```

- Vitest: 4 passed.
- Build: passed; `dist/` produced.
- Playwright: 6 passed, 2 skipped.
- TypeScript: passed.
- Claims: failed review because `.factory/claims.json` and all `@claim:` tests
  are absent.
- Live axe smoke test: zero serious/critical findings in the checked mobile app
  state.
- Fresh request log: only same-origin requests during initial/demo-attempt flow;
  offline reload worked after first load.

## What remains

All findings in `.factory/review-1.md` remain. Release blockers include unclear
first-screen audience, no sandbox demo, no claims contract, all seven prior
verification defects, non-routed app views, and no designed 404. The deployed
checkout still returns 404. A malformed nested backup still bricks reload;
month-end and missing-mileage reminders remain wrong. Do not mark this product
PASS until a full fresh review returns zero findings and no untested claims.
