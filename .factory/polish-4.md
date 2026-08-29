# Polish round 4 — complete finding disposition

- Work order: `bike-service-timeline-polish-4`
- Review source: `09b3cdd0db8e3bedb7add067cb89d3ed7b8e2c3b`
- Final implementation commit: `c974390d5ff60b7d0626b7ca6c58f55e0e79dac3`
- Live URL: <https://bike-service-timeline.sociobot.in>
- Final deployment: `6b57b394-3dca-4f4f-858c-13cdcd8ecfe9`

## Evidence key

- **Clean**: fresh clone `/tmp/bike-service-timeline-polish4-final.K0jTHH` at
  `c974390`; `npm ci`, `npm test` (9 passed), `npm run build`, all 15 exact
  commands in `.factory/claims.json`, and the full browser suite passed.
- **Live suite**: `PLAYWRIGHT_BASE_URL=https://bike-service-timeline.sociobot.in npm run test:e2e`
  scheduled 42 checks: 36 passed and 6 viewport-independent mobile duplicates
  were intentionally skipped. It includes all-route Axe scans, privacy request
  logging, offline reload, exports, routing, dialog focus, and mobile targets.
- **Root**: [cold mobile root](./evidence/polish-4/live-root/screenshot-mobile.png)
  and [verification report](./evidence/polish-4/live-root/verify.json).
- **Demo**: [cold direct `?demo=1`](./evidence/polish-4/live-demo/screenshot-mobile.png)
  and [verification report](./evidence/polish-4/live-demo/verify.json).
- **404**: [mobile 404](./evidence/polish-4/live-404/screenshot-mobile.png),
  [verification report](./evidence/polish-4/live-404/verify.json), and
  [unknown-path response](./evidence/polish-4/live-unknown.html) with
  [HTTP 404 headers](./evidence/polish-4/live-unknown-headers.txt).
- **Headers**: production [root](./evidence/polish-4/live-root-headers.txt),
  [hashed asset](./evidence/polish-4/live-asset-headers.txt),
  [manifest](./evidence/polish-4/live-manifest-headers.txt), and
  [AVIF](./evidence/polish-4/live-avif-headers.txt) responses.
- **Removed pass**: live `/pass` [body](./evidence/polish-4/live-pass.html)
  and [HTTP 404 headers](./evidence/polish-4/live-pass-headers.txt).
- **Performance**: [live Lighthouse report](./evidence/polish-4/lighthouse-live.json)
  scored 98 Performance and 100 for Accessibility, Best Practices, and SEO.

## Review 4

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-4-1 | Replaced the redundant header home link with direct **Demo** and **Privacy** links. App, legal, and 404 headers now expose exactly Demo, All history, Back up and export, and Privacy; the wordmark remains Home. Tightened the phone layout so every link is visible without horizontal scrolling. | `shares direct Demo and Privacy navigation on every route`; `@claim:mobile-targets`; Live suite; Root, Demo, and 404 screenshots; live `/privacy/` → `/demo` check. |

## Review 3

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-3-1 | Kept the registered `multi-bike-history` promise and its real-data flow creating two bikes and two dated service entries in one combined history. | `@claim:multi-bike-history`; Clean; Live suite; live `/history`. |
| F-3-2 | Kept the literal `404 — page not found` label, `Page not found` h1, and direct recovery action. | `sets complete metadata on app, legal, and 404 routes`; 404 evidence; live unknown path returned HTTP 404. |

## Review 2

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Kept the unavailable purchase, paid gate, checkout URL, and pass route removed. | `@claim:no-third-party-runtime`; Live suite; live `/pass` returns the designed 404. |
| F-2-2 | Demo mode never reads or changes real license keys and never contacts a license service. | `@claim:demo-isolation`; Clean; Demo; Live suite. |
| F-2-3 | CSV verification parses the exact header, all rows, order, escaping, and attachment name. | `@claim:csv-export`; Clean; Live suite. |
| F-2-4 | JSON verification parses the schema and every nested shipped sample record. | `@claim:json-export`; Clean; Live suite. |
| F-2-5 | The sample retains three named bikes, distinct odometers, reminders, history, details, attachment, and blank real onboarding. | `@claim:sample-content-and-onboarding`; Clean; Demo. |
| F-2-6 | Offline, CSV, and JSON registry entries list their landing and documentation locations. | `maps every registered claim to exactly one tagged test`; Clean. |
| F-2-7 | Removed the unverified paid-tier promise and every product gate. | Full create/service browser test; Live suite; live `/pass` 404. |
| F-2-8 | Search/order, print, local-record, and same-origin runtime promises each retain an observable claim test. | `@claim:history-search-order`, `@claim:print-history`, `@claim:local-records`, `@claim:no-third-party-runtime`; Clean. |
| F-2-9 | Removed the unsupported “Offline forever” promise and pass screen. | `@claim:offline-reload`; live `/pass` 404. |
| F-2-10 | Kept the concrete road, cargo, and mountain bike caption. | Root; `.factory/copy-audit.md`. |
| F-2-11 | Kept literal app headings: Service status, Your bikes, Next service, Recent service, and Backup and export. | Demo; all-route Axe test; Live suite. |
| F-2-12 | Kept complete 404 canonical, Apple icon, Open Graph, Twitter, description, and share image metadata. | `sets complete metadata on app, legal, and 404 routes`; 404 evidence. |
| F-2-13 | Synchronized 404 navigation/footer and `polish-4` build identity with the app and legal routes. | Shared-header test; 404 screenshot; Live suite. |

## Review 1

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | The first screen names the multi-bike job, audience, two actions, outcomes, and three facts. | Root; `@claim:sample-content-and-onboarding`; `@claim:multi-bike-history`. |
| F-1-2 | The primary action now enters exact `/?demo=1` in one click; `/demo` remains a direct route. Demo records use a separate database with persistent banner, reset, and destructive Start for real. | `@claim:demo-isolation`, `@claim:demo-reset`, `@claim:sample-content-and-onboarding`; Demo; Live suite. |
| F-1-3 | The registry contains 15 unique claims and exactly one matching tagged test per claim. | `maps every registered claim to exactly one tagged test`; Clean ran all 15 commands. |
| F-1-4 | Removed the unavailable checkout and paid path. | `@claim:no-third-party-runtime`; live `/pass` 404. |
| F-1-5 | Restore validates every nested record, date, ID, relation, attachment, and export timestamp before writing. | `@claim:backup-validation`; Clean. |
| F-1-6 | Calendar-month reminders clamp to the target month’s last valid day. | `@claim:date-distance-reminders`; Clean. |
| F-1-7 | Date and last-known mileage baselines are selected independently. | `@claim:date-distance-reminders`; Clean. |
| F-1-8 | Header, footer, demo, legal, and 404 targets meet 44 px at 390 px; header links are also asserted inside the viewport. | `@claim:mobile-targets`; Live suite; Root, Demo, and 404 screenshots. |
| F-1-9 | Fingerprinted assets retain one-year immutable caching while HTML and the worker revalidate. | Headers; live hashed JS response. |
| F-1-10 | Production retains CSP, Permissions Policy, nosniff, referrer policy, and correct manifest/AVIF MIME types. | Headers; live root, manifest, and AVIF responses. |
| F-1-11 | Demo, history, and backup retain real URLs, route titles, canonical changes, reload/back/forward state, heading focus, and announcements. | `@claim:routed-history`; Live suite. |
| F-1-12 | Unknown paths return the styled recovery page with HTTP 404. | 404 evidence; live `/does-not-exist-polish-4`. |
| F-1-13 | Landing retains the sample preview, three-step flow, privacy/limits, and backup guidance. | Root; live `/`. |
| F-1-14 | App, legal, and 404 pages retain canonical, OG/Twitter, Apple icon, and owned share art metadata. | Metadata browser test; Root and 404 reports. |
| F-1-15 | App, legal, and 404 retain a linked wordmark, shared four-link header, skip link, product footer, legal links, factory credit, and build ID. | Shared-header test; all-route Axe test; screenshots. |
| F-1-16 | Empty state uses enabled Add a bike actions; no disabled primary action competes. | Root; full create/service browser test. |
| F-1-17 | Privacy h1 remains `Privacy notice`. | Metadata/Axe tests; live `/privacy/`. |
| F-1-18 | Uses `Private service history for all your bikes`. | Root; copy audit. |
| F-1-19 | Uses the job-first h1 `Track service across all your bikes`. | Root; `@claim:multi-bike-history`. |
| F-1-20 | Removed the “whole trail” slogan. | Copy audit; live `/`. |
| F-1-21 | Uses `service work` and `repair shop` consistently. | Copy audit; full create/service browser test. |
| F-1-22 | Removed “little fixes”. | Copy audit; live `/`. |
| F-1-23 | Names due and upcoming reminders directly. | `@claim:date-distance-reminders`; Demo. |
| F-1-24 | Uses `this browser` consistently for visitor-facing storage copy. | `@claim:local-records`; copy audit. |
| F-1-25 | Names JSON and CSV outputs. | `@claim:json-export`, `@claim:csv-export`; Root. |
| F-1-26 | Uses the concrete sample-bike caption. | Root; copy audit. |
| F-1-27 | Uses the observable local-record sentence instead of promotional privacy shorthand. | `@claim:local-records`; Root. |
| F-1-28 | README opens with the user, task, and result in plain words. | `@claim:multi-bike-history`; `.factory/copy-audit.md`; Clean. |
| F-1-29 | README says the owner sets reminders. | `@claim:date-distance-reminders`; Clean. |
| F-1-30 | README names cross-bike reverse-date search. | `@claim:history-search-order`; Clean. |
| F-1-31 | README names CSV, complete JSON backup, and print results. | Export and print claim tests; Clean. |
| F-1-32 | README uses bounded offline-after-first-visit wording. | `@claim:offline-reload`; Clean; Live suite. |
| F-1-33 | Removed implementation-oriented mobile/theme benefit copy. | Copy audit; `@claim:mobile-targets`. |
| F-1-34 | Removed unavailable paid-tier copy. | `@claim:no-third-party-runtime`; live `/pass` 404. |
| F-1-35 | Visitor privacy copy says `this browser`; IndexedDB appears only in technical demo documentation. | `@claim:local-records`; live `/privacy/`. |
| F-1-36 | Uses observable same-origin language instead of runtime jargon. | `@claim:no-third-party-runtime`, `@claim:local-records`; Live suite. |
| F-1-37 | Removed obsolete license behavior and copy. | `@claim:demo-isolation`; Clean. |
| F-1-38 | README deployment wording names direct links, 404, browser safety headers, and caching plainly. | README review; Headers. |
| F-1-39 | Removed unnecessary precache jargon from visitor documentation. | README review; production build. |
| F-1-40 | Removed checkout/provider runtime and copy. | `@claim:no-third-party-runtime`; live CSP `connect-src 'self'`. |
| F-1-41 | Retains plain original-art provenance and source metadata. | `.factory/design.md`; Root footer. |
| F-1-42 | The wordmark is the shared home link; redundant Bike overview navigation was removed to satisfy F-4-1. | Shared-header test; Root. |
| F-1-43 | `Back up and export` remains a descriptive real route link. | `@claim:routed-history`; shared-header test. |
| F-1-44 | Replaced vague ownership marketing with observable browser-storage wording. | `@claim:local-records`; Root. |
| F-1-45 | Component and service fields persist through create and reload flows. | Full create/component/service browser test; Live suite. |
| F-1-46 | Reminder and offline behavior are separate claims. | `@claim:date-distance-reminders`, `@claim:offline-reload`; Clean. |
| F-1-47 | Storage wording maps to a complete request-log flow. | `@claim:local-records`; Live suite. |
| F-1-48 | CSV and JSON tests parse complete downloads, escaping, and attachments. | `@claim:csv-export`, `@claim:json-export`; Clean. |
| F-1-49 | Removed the unsupported ride-tracking promise. | Copy audit; live `/`. |
| F-1-50 | Replaced promotional privacy shorthand with exact local behavior. | `@claim:local-records`; Root. |
| F-1-51 | CRUD, reload, export, and deletion execute under same-origin request logging. | `@claim:local-records`; Live suite. |
| F-1-52 | README promises map to registered multi-bike, local, offline, export, search, and print claims. | Claim registry contract test; Clean. |
| F-1-53 | Sample visibly shows recent work and calculated next reminders. | `@claim:sample-content-and-onboarding`, `@claim:date-distance-reminders`; Demo. |
| F-1-54 | Three sample bikes retain distinct odometers through reload/reset. | `@claim:sample-content-and-onboarding`, `@claim:demo-reset`; Demo. |
| F-1-55 | Date-only, distance-only, either-trigger, leap/non-leap month-end, and missing-mileage fixtures pass. | `@claim:date-distance-reminders`; Clean. |
| F-1-56 | Cross-bike reverse order and bike/shop searches are asserted. | `@claim:history-search-order`; Clean; live `/history?demo=1`. |
| F-1-57 | Work, notes, cost, repair shop, mileage, and attachment persist across reload. | Full create/component/service test; `@claim:sample-content-and-onboarding`; Live suite. |
| F-1-58 | Backup, CSV, print, restore, and malformed input have separate observable coverage. | JSON, CSV, print, and validation claims plus restore browser test; Clean. |
| F-1-59 | Manifest, service worker control, persistence, offline reload, and exports are verified. | Offline/static-host contract test; `@claim:offline-reload`; Clean; Live suite. |
| F-1-60 | Phone routes have no page overflow, no clipped header links, 44 px targets, and no serious/critical Axe violations. | `@claim:mobile-targets`; all-route Axe test; mobile screenshots. |
| F-1-61 | Paid boundaries and attachment gates remain removed; all records are usable. | Full create/service browser test; live `/pass` 404. |
| F-1-62 | IndexedDB CRUD runs while request logging stays same-origin. | `@claim:local-records`; Live suite. |
| F-1-63 | Every shipped route loads scripts and files only from this origin. | `@claim:no-third-party-runtime`; Live suite. |
| F-1-64 | Privacy explains that no server copy exists and backups are needed. | `@claim:local-records`; live `/privacy/`. |
| F-1-65 | Obsolete license-frequency behavior remains absent. | `@claim:demo-isolation`; source and Live suite. |
| F-1-66 | Billing endpoints and payment-provider integration remain absent. | `@claim:no-third-party-runtime`; CSP `connect-src 'self'`; Headers. |

## Earlier verification

| Finding | Change made | Evidence |
| --- | --- | --- |
| V-01 | Same disposition as F-1-4: unavailable purchase path removed. | Live `/pass` 404; `@claim:no-third-party-runtime`. |
| V-02 | Same disposition as F-1-5: malformed nested backups are rejected before storage. | `@claim:backup-validation`; Clean. |
| V-03 | Same disposition as F-1-6: month-end dates clamp. | `@claim:date-distance-reminders`; Clean. |
| V-04 | Same disposition as F-1-7: latest known service mileage is preserved. | `@claim:date-distance-reminders`; Clean. |
| V-05 | Same disposition as F-1-8: mobile targets and visible header links pass. | `@claim:mobile-targets`; Live suite; screenshots. |
| V-06 | Same disposition as F-1-9: fingerprinted asset caching is immutable. | Headers. |
| V-07 | Same disposition as F-1-10: security headers and MIME mappings are live. | Headers. |

No finding from any review, polish record, or earlier verification remains
open. The live cold-check did reveal a clipped mobile Privacy link before the
final deployment; `c974390` fixed it, added a viewport assertion, and the final
screenshots and production suite confirm the correction.
