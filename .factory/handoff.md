# Track service across all your bikes — repair 1 handoff

## Result

- Work order: `bike-service-timeline-repair-1`
- Result: **PASS** — the two Review 6 findings are closed and no earlier finding reopened.
- Live URL: <https://bike-service-timeline.sociobot.in>
- Runtime implementation: `b8d441ff74a58771ef2b01276d51550a1bb1daf5`
- Final validation source: `c5a7dd488fa6b95a2eae2df3ae37ea55104b96b5` (test-only; its built runtime artifacts match the deployed implementation byte for byte)
- Documentation and evidence commit: `ed0d8ba58712cb424702b629be66fe05058b825f`
- Production deployment: `973d18a1-076c-4b0a-9803-cd00450e9d19`

## What changed

- `Due soon` now uses a semantic `--due-soon` token. It remains workshop brown
  in light mode and becomes `#F4BF54` in dark mode. On the raised dark surface
  `#2B3A32`, that is **7.08:1**, above the 4.5:1 text requirement.
- Restore radio labels are now real 44 px touch targets with padding and a
  pointer cursor. The live phone measurements are 304 × 44 px for both **Merge
  with this browser** and **Replace this browser**.
- Added outcome-based browser regressions: populated dark-mode Axe coverage,
  all visible backup-form targets measured on a 390 px phone, radio selection
  through the full label, and a demo-isolation flow that preserves a saved real
  sentinel bike through demo edits, reset, and **Start for real**.
- Documented the light/dark Due soon foreground in the product visual thesis.

## Verification

The final detached clean checkout at `c5a7dd4` ran `npm ci`, then:

- `npm test`: **9/9 passed**.
- `npm run build`: passed and produced `dist/`.
- All **15 exact commands** in `.factory/claims.json`: passed.
- `npm run test:e2e`: **38 passed, 8 intentional viewport-duplicate skips**.
- `npm audit --audit-level=moderate`: **0 vulnerabilities**.

The deployed HTTPS origin then passed `PLAYWRIGHT_BASE_URL=https://bike-service-timeline.sociobot.in npm run test:e2e` with **38 passed, 8 intentional skips**. It includes the populated dark-mode Axe regression and the phone restore-target regression.

`verify-url.sh` passed on the root, direct sample, and designed 404 pages with
no console/page errors, one h1, `lang=en`, a main landmark, and complete image
alternatives. [Fresh root screenshots and report](./evidence/repair-1/live-root/),
[fresh sample screenshots and report](./evidence/repair-1/live-demo/), and
[404 screenshots and report](./evidence/repair-1/live-404/) are retained.

Fresh unscrolled browsers confirmed the first screen on both 390 × 844 and
1440 × 1000:

- Job: **Track service across all your bikes**.
- Audience: people who maintain several bikes and need one history.
- First action: **Try it with sample data**.

The demo was checked as populated, visibly labelled **Demo — sample data,
nothing is saved**, resettable, and isolated from a real sentinel record. The
live artifact hashes for index, CSS, JavaScript, service worker, manifest,
Privacy, Terms, and 404 all match the final local `dist/` output. Routes
`/`, `/demo`, `/history`, `/backup`, `/privacy/`, `/terms/`, and `/404.html`
return 200; an unknown route deliberately returns the styled HTTP 404.

Live Lighthouse mobile: **100 Performance, 100 Accessibility, 100 Best
Practices, 100 SEO**; FCP 0.9 s, LCP 1.8 s, TBT 0 ms, CLS 0. The complete report
is [lighthouse-live.json](./evidence/repair-1/lighthouse-live.json).

## Earlier finding disposition

| Earlier findings | Current disposition |
| --- | --- |
| V-01; F-1-4; F-2-1, F-2-7, F-2-9 | The unavailable paid checkout and paid gate remain absent; `/pass` is the designed 404. No unregistered offer or price was invented. |
| V-02–V-04; F-1-5–F-1-7 | Nested backup validation, month-end clamping, and independent latest-known mileage remain covered by the backup and reminder claim tests. |
| V-05; F-1-8; F-1-60 | Original navigation/legal targets remain compliant; the formerly unchecked restore radios now pass the expanded all-form-target check. |
| V-06–V-07; F-1-9–F-1-10 | Immutable asset caching, CSP, Permissions Policy, referrer/nosniff headers, and MIME mappings remain live. |
| F-1-1–F-1-3, F-1-11–F-1-17, F-1-18–F-1-66 | The job-first screen, isolated demo, claims registry, routes, metadata, shared shell, plain copy, browser-local privacy, exports, offline support, search, print, and PWA behavior retain their prior passing coverage. |
| F-2-2–F-2-13; F-3-1–F-3-2; F-4-1 | Demo storage isolation, parsed exports, realistic sample, literal headings/404, complete metadata, and shared Demo/Privacy navigation remain covered by the clean and live suites. |
| F-6-1 | Fixed: populated dark-mode Axe passes, and the live status has `#F4BF54` on `#2B3A32` (7.08:1). |
| F-6-2 | Fixed: live restore labels are 304 × 44 px; all visible backup form targets are measured and the radio choices are operable through their labels. |

## Known gaps and next steps

- There is no advertised paid offer in the current product. The prior checkout
  was removed after the billing service did not register it. Billing registration
  and any future real one-time offer remain a controller dependency; this repair
  did not create a guessed price, checkout, credential, or entitlement claim.
- No functional product or accessibility gaps are known from this repair.

## Run and deploy

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

Run every exact command in `.factory/claims.json` from a clean checkout. Deploy
the generated `dist/` directory with the product’s existing static deployment
configuration.
