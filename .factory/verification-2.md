# Track service across all your bikes — verification 2

## Verdict: PASS

- Findings: **0** (blocking 0, major 0, minor 0)
- Untested public claims: **0**
- Live URL: <https://bike-service-timeline.sociobot.in>
- Runtime implementation reviewed: `b8d441ff74a58771ef2b01276d51550a1bb1daf5`
- Documentation/report head reviewed: `374f97b625153b410d866df11816c94e6e721949`
- Test-only follow-up: `c5a7dd488fa6b95a2eae2df3ae37ea55104b96b5`

`374f97b` differs from the runtime commit only by the follow-up browser test
and repair evidence/report commits. The live shell, JavaScript, CSS, worker,
manifest, legal pages, and 404 page match the locally built candidate bytes.

## First screen

Fresh, unscrolled desktop (1440 × 1000) and phone (390 × 844) sessions both
showed the required information before scrolling:

- Job: **Track service across all your bikes**.
- Audience: people who maintain several bikes and need one history and a view
  of what is due next.
- First action: **Try it with sample data**. It explains that it opens three
  bike histories.

Both sessions returned HTTP 200, the root title was `Bike Service Timeline —
Track service across all bikes`, and neither produced a browser console or page
error.

## Clean checkout verification

A separate clean clone at `374f97b` completed `npm ci` with Node 22 and the
documented Playwright 1.58.2 browser. The worktree remained clean.

| Check | Result |
| --- | --- |
| `npm test` | PASS — 9/9 tests |
| `npm run build` | PASS — `dist/` produced; JS 13.45 KB gzip and CSS 6.10 KB gzip |
| `npm audit --audit-level=moderate` | PASS — 0 vulnerabilities |
| Complete local browser suite | PASS |
| Complete live browser suite | PASS — 38 expected, 8 intentional viewport skips, 0 unexpected, 0 flaky |

## Declared public claims

Every exact command from `.factory/claims.json` was run from that clean clone.
All 15 commands passed; none was missing or untested.

| Claim ID | Result | Observable evidence checked by its command |
| --- | --- | --- |
| `demo-isolation` | PASS | Real sentinel record and license keys remain separate through demo edits and exit. |
| `demo-reset` | PASS | Reset restores the three shipped bikes. |
| `sample-content-and-onboarding` | PASS | Three populated histories, reminders, odometers, notes, and blank real onboarding. |
| `multi-bike-history` | PASS | Two real bikes and dated services appear together in reverse date order. |
| `offline-reload` | PASS | Cached demo reloads offline with sample data. |
| `csv-export` | PASS | Parsed CSV contains all rows, order, header, and escaping. |
| `json-export` | PASS | Parsed complete backup contains every shipped record and field. |
| `local-records` | PASS | Create, reload, export, and delete remain on the product origin. |
| `no-third-party-runtime` | PASS | Shipped routes load scripts and files only from this origin. |
| `date-distance-reminders` | PASS | Date-only, distance-only, either trigger, leap/non-leap month ends, and mileage baseline. |
| `backup-validation` | PASS | Invalid nested dates, relations, and export metadata are rejected before restore. |
| `routed-history` | PASS | Direct URLs, titles, canonical URLs, reload/back/forward, and heading focus. |
| `history-search-order` | PASS | Cross-bike reverse-date search by bike and repair shop. |
| `print-history` | PASS | Print action is invoked and print media keeps history while hiding controls. |
| `mobile-targets` | PASS | 390 × 844 routes have no overflow and required targets are at least 44 px. |

## Live product checks

- Fresh phone and desktop root sessions passed. The supplied `verify-url.sh`
  passed root, `?demo=1`, Privacy, Terms, and `/404.html`: each has a title,
  `lang=en`, exactly one h1, main landmark, complete image alternatives, and
  no console/page errors.
- The direct sample loaded realistic Aster Road, Maple Cargo, and Pine Trail
  data, reminders, odometers, services, a repair-shop detail, and a receipt.
  Its persistent label reads **Demo — sample data, nothing is saved**.
- Independent demo flow: a real `Verification sentinel` bike was saved; a
  demo-only bike was added; **Reset demo** removed it and restored exactly
  three sample bikes; **Start for real** retained the sentinel and discarded
  the demo-only bike.
- Normal create/component/service/reload, JSON restore, keyboard dialog focus
  return, skip link, route-focus announcement, print, search, and offline
  paths passed in the live suite. Invalid backup and calendar/mileage boundary
  paths passed in the unit claim commands. The designed recovery paths pass:
  offline reload shows its status, malformed backup is rejected, and an
  unknown live URL returns the styled HTTP 404 with `Page not found`.
- The live full browser suite includes Axe WCAG 2 A/AA checks for empty,
  populated dark demo, product routes, legal routes, and 404. It also measures
  the restore controls on a 390 px phone and verifies both radio labels work.
  No serious or critical violations occurred. Dark `Due soon` is `#F4BF54` on
  `#2B3A32` (7.08:1).
- All 13 distinct crawlable site links returned HTTP 200; `mailto:`, fragment,
  and local receipt data links were correctly non-HTTP link types. Unknown
  routes deliberately return HTTP 404, not a broken success page.
- Root security headers include CSP with `frame-ancestors 'none'`, Permissions
  Policy, `nosniff`, and strict referrer policy. Fingerprinted JS and AVIF use
  one-year immutable cache headers; manifest has the correct
  `application/manifest+json` MIME type. The manifest, icons, cached shell,
  offline claim, and update-registration/skip-waiting implementation were
  inspected. No backend health, tenancy, restart, or rate-limit check applies
  to this static local-first PWA.
- Live Lighthouse (mobile): **100 Performance, 100 Accessibility, 100 Best
  Practices, 100 SEO**; FCP 0.9 s, LCP 1.8 s, TBT 0 ms, CLS 0.
- No third-party runtime requests, analytics, remote fonts, backend calls, or
  credentials were observed. Privacy and Terms are live and route-titled.

## Earlier finding disposition

All earlier reports (`verification.md`, `review-1.md` through `review-6.md`,
and `polish-1.md` through `polish-4.md`) were inspected. Each prior finding
has a current passing disposition:

| Earlier IDs | Current disposition and verification |
| --- | --- |
| `V-01`, `F-1-4`, `F-1-34`, `F-1-61`, `F-2-1`, `F-2-7`, `F-2-9` | The unavailable paid checkout, gate, offer, and pass route remain removed; `/pass` is the designed 404. |
| `V-02`–`V-04`, `F-1-5`–`F-1-7` | Backup validation, month-end clamping, and independent latest-known mileage baselines pass their exact claim commands. |
| `V-05`, `F-1-8`, `F-1-60` | Phone targets, visible header links, legal links, and backup controls pass the mobile claim and live suite. |
| `V-06`–`V-07`, `F-1-9`–`F-1-10` | Immutable assets, revalidatable HTML/worker, CSP, Permissions Policy, nosniff/referrer headers, and manifest/AVIF MIME types are live. |
| `F-1-1`–`F-1-3`, `F-1-11`–`F-1-17` | Job-first first screen, one-click isolated demo, registry/tests, real routes, styled 404, structure, metadata, shared shell, enabled onboarding, and literal Privacy heading pass. |
| `F-1-18`–`F-1-43` | All earlier plain-language, terminology, copy, metadata, header/footer, and navigation issues remain resolved; the copy audit has no flagged unit. |
| `F-1-44`–`F-1-66` | Every retained product/privacy/export/offline/search/print/mobile/public claim maps to an exact passing test; unsupported claims and billing behavior remain absent. |
| `F-2-2`–`F-2-13` | Demo license/data isolation, parsed exports, realistic sample, literal headings and 404, complete metadata, mobile/Axe coverage, and shared navigation pass. |
| `F-3-1`–`F-3-2`, `F-4-1` | Real-data combined history, literal styled 404 recovery, and direct Demo/Privacy navigation all pass live. |
| `F-6-1` | Populated dark-mode Axe passes; `Due soon` contrast is 7.08:1. |
| `F-6-2` | Restore choices measure at least 44 px high on phone and are label-clickable. |

## Conclusion

**PASS.** There are zero findings of every severity and zero untested public
claims. The static PWA meets the multi-bike service-history job, sample
sandbox, accessibility, privacy, offline, routing, legal, and artifact checks.
