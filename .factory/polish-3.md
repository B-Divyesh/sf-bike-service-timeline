# Polish round 3 — complete finding disposition

- Work order: `bike-service-timeline-polish-3`
- Review source: `09570dcf83790eb4367f9196796fcd35e8bf2507`
- Repair commit: `6f7913e1c10739048b00d206ddc5b10c34eec0b5`
- Live URL: <https://bike-service-timeline.sociobot.in>
- Deployment: Static Web Apps production deployment `b97acca9-ef28-42ba-8830-c6898e1a4078`

## Evidence key

- **Clean claims**: a fresh clone at `/tmp/bike-service-timeline-clean.tioGQe`
  ran `npm ci`, `npm test`, `npm run build`, and all 15 exact commands in
  `.factory/claims.json` with `set -e`; every command passed.
- **Live suite**: `PLAYWRIGHT_BASE_URL=https://bike-service-timeline.sociobot.in npm run test:e2e`
  passed all 35 runnable browser checks; five viewport-independent checks were
  intentionally skipped in the mobile project. This includes Axe scans, offline
  reload, privacy request logging, routing, metadata, and mobile targets.
- **Screens**: [cold root](./evidence/polish-3/live-root/screenshot-mobile.png),
  [direct demo](./evidence/polish-3/live-demo/screenshot-mobile.png), and
  [unknown route](./evidence/polish-3/live-404-mobile.png).
- **Live basics**: `verify-url.sh` reports are [root](./evidence/polish-3/live-root/verify.json)
  and [direct `?demo=1`](./evidence/polish-3/live-demo/verify.json): each has
  one h1, a main landmark, `lang=en`, no missing image alt, and no console errors.
- **Performance**: [live Lighthouse JSON](./evidence/polish-3/lighthouse-live.json)
  scored 100 Performance, 100 Accessibility, 100 Best Practices, and 100 SEO;
  FCP 0.9 s, LCP 1.5 s, CLS 0, and TBT 0 ms.

## Review 3

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-3-1 | Registered `multi-bike-history` for the landing h1, root title, and README opening. Added a real-data browser flow that creates two bikes, logs dated work on both, and asserts both entries in one reverse-date history. Root title now says “Track service across all bikes.” | `@claim:multi-bike-history`; Clean claims; Live suite; [cold root](./evidence/polish-3/live-root/screenshot-mobile.png); live `/history` check. |
| F-3-2 | Replaced the decorative label with `404 — page not found`, changed the h1 to `Page not found`, and made the recovery sentence literal in both source and deployed 404 shell. | Live `GET /does-not-exist` returned HTTP 404; [404 screen](./evidence/polish-3/live-404-mobile.png); Live suite metadata/mobile/Axe checks. |

## Review 2

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Removed the unavailable purchase, entitlement, and checkout flow instead of advertising an unavailable pass. | Live `/pass` is a 404; Live suite and source/runtime-origin checks. |
| F-2-2 | Demo mode never initializes or touches license storage or a license network path. | `@claim:demo-isolation`; [direct demo](./evidence/polish-3/live-demo/screenshot-mobile.png); live `/?demo=1` check. |
| F-2-3 | CSV claim parses the download, exact header, rows, order, quote escaping, and attachment filename. | `@claim:csv-export`; Clean claims; Live suite. |
| F-2-4 | JSON claim parses schema, export date, every sample bike, component, service, and attachment. | `@claim:json-export`; Clean claims; Live suite. |
| F-2-5 | Seeded demo has three named histories, odometers, reminders, entries, notes, receipt, and blank real onboarding. | `@claim:sample-content-and-onboarding`; [direct demo](./evidence/polish-3/live-demo/screenshot-mobile.png). |
| F-2-6 | Registry `where` fields name landing, screen, Privacy, and README occurrences for offline and both exports. | `tests/contracts.test.ts`; Clean claims. |
| F-2-7 | Removed price, paid boundary, attachment gate, and purchase copy while checkout is unavailable. | Live `/` and `/pass` checks; Live suite. |
| F-2-8 | Added dedicated history/search, print, local-record, and same-origin runtime claims; README maps to them. | `@claim:history-search-order`, `@claim:print-history`, `@claim:local-records`, `@claim:no-third-party-runtime`; Clean claims. |
| F-2-9 | Removed the untestable “Offline forever” promise and pass route. | Live `/pass` HTTP 404; `@claim:offline-reload`. |
| F-2-10 | Replaced the image slogan with a concrete road/cargo/mountain service-history caption. | [cold root](./evidence/polish-3/live-root/screenshot-mobile.png); copy audit. |
| F-2-11 | Replaced workshop-metaphor headings with service-status, bikes, next-service, recent-service, and backup headings. | Live suite route/Axe checks; [direct demo](./evidence/polish-3/live-demo/screenshot-mobile.png). |
| F-2-12 | 404 includes canonical, Apple icon, Open Graph, Twitter, and owned share-art metadata. | Live suite metadata check; live `/404.html`. |
| F-2-13 | 404 shares the app/legal header, footer, navigation, and `polish-3` build identifier. | [404 screen](./evidence/polish-3/live-404-mobile.png); Live suite mobile check. |

## Review 1 and verification findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | First screen states the job, multi-bike audience, sample action, real action, outcomes, and local/offline/export facts. | [cold root](./evidence/polish-3/live-root/screenshot-mobile.png); `@claim:sample-content-and-onboarding`. |
| F-1-2 | `/demo` and `?demo=1` seed isolated records, show the persistent banner, reset, and discard-on-real-start. | `@claim:demo-isolation`; `@claim:demo-reset`; [direct demo](./evidence/polish-3/live-demo/screenshot-mobile.png). |
| F-1-3 | Claims registry now has 15 entries with exactly one matching tagged test each. | `tests/contracts.test.ts`; Clean claims. |
| F-1-4 | Unavailable paid path was removed from product, docs, and runtime. | Live `/pass` HTTP 404; Live suite runtime-origin check. |
| F-1-5 | Restore validates all nested records, IDs, dates, relations, and metadata before writing. | `@claim:backup-validation`; Clean claims. |
| F-1-6 | Month addition clamps to the final day of the target month. | `@claim:date-distance-reminders`; Clean claims. |
| F-1-7 | Date and mileage baselines are selected independently. | `@claim:date-distance-reminders`; Clean claims. |
| F-1-8 | Header, footer, legal, demo, and 404 links have 44 px targets at 390 px. | `@claim:mobile-targets`; Live suite; all three live mobile screens. |
| F-1-9 | Fingerprinted files use one-year immutable caching while HTML and worker revalidate. | Live header check: JS/AVIF `public, max-age=31536000, immutable`; root `no-cache`. |
| F-1-10 | Static host config supplies CSP, Permissions Policy, nosniff, referrer policy, and manifest/AVIF MIME types. | Live header check confirms all headers and MIME types. |
| F-1-11 | Demo, history, and backup are address-bar routes with titles, canonical URLs, back/forward handling, heading focus, and announcements. | `@claim:routed-history`; Live suite. |
| F-1-12 | Unknown paths return a styled HTTP 404 with a recovery link. | Live `/does-not-exist` HTTP 404; [404 screen](./evidence/polish-3/live-404-mobile.png). |
| F-1-13 | Landing includes in-use preview, three-step flow, privacy/limits, and backup guidance; unavailable pricing was honestly removed. | [cold root](./evidence/polish-3/live-root/screenshot-mobile.png); live `/`. |
| F-1-14 | App, legal, and 404 pages have canonical, OG, Twitter, Apple icon, and owned share art. | Live suite metadata check; live app/legal/404 routes. |
| F-1-15 | App, legal, and 404 routes use shared wordmark, navigation, skip link, legal footer, factory credit, and one build id. | Live suite mobile/Axe check; [404 screen](./evidence/polish-3/live-404-mobile.png). |
| F-1-16 | Empty state presents enabled Add-a-bike actions, never a disabled primary action. | Live suite creation flow; [cold root](./evidence/polish-3/live-root/screenshot-mobile.png). |
| F-1-17 | Privacy h1 is `Privacy notice`. | Live suite route/Axe check; live `/privacy/`. |
| F-1-18 | Replaced vague ownership label with `Private service history for all your bikes`. | `.factory/copy-audit.md`; [cold root](./evidence/polish-3/live-root/screenshot-mobile.png). |
| F-1-19 | Replaced the metaphor h1 with `Track service across all your bikes`. | `@claim:multi-bike-history`; [cold root](./evidence/polish-3/live-root/screenshot-mobile.png). |
| F-1-20 | Removed “Keep the whole trail.” | Copy audit; live `/`. |
| F-1-21 | Uses `service work` and `repair shop` consistently. | Copy audit; service-entry browser flow. |
| F-1-22 | Removed imprecise “little fixes.” | Copy audit; source/live scan. |
| F-1-23 | Names due and upcoming reminders directly. | `@claim:date-distance-reminders`; [direct demo](./evidence/polish-3/live-demo/screenshot-mobile.png). |
| F-1-24 | Uses `this browser` for storage wording. | `@claim:local-records`; copy audit. |
| F-1-25 | Names JSON and CSV export formats and verifies actual output. | `@claim:csv-export`; `@claim:json-export`. |
| F-1-26 | Replaced the mood caption with the concrete sample-bike description. | [cold root](./evidence/polish-3/live-root/screenshot-mobile.png). |
| F-1-27 | Replaced promotional privacy shorthand with the exact browser-record statement. | `@claim:local-records`; live `/`. |
| F-1-28 | README opens in plain user/task language and its core multi-bike promise is now registered. | `@claim:multi-bike-history`; `.factory/copy-audit.md`. |
| F-1-29 | README says reminders are set by the owner. | `@claim:date-distance-reminders`. |
| F-1-30 | README names cross-bike reverse-date search. | `@claim:history-search-order`. |
| F-1-31 | README names CSV, complete JSON backup, and printable history. | `@claim:csv-export`; `@claim:json-export`; `@claim:print-history`. |
| F-1-32 | README uses the bounded offline-after-first-visit wording. | `@claim:offline-reload`. |
| F-1-33 | Removed implementation/mobile-theme benefit jargon. | Copy audit; `@claim:mobile-targets`. |
| F-1-34 | Removed the unavailable paid-tier promise. | Live `/`; live `/pass` HTTP 404. |
| F-1-35 | Visitor privacy copy says `this browser`; technical storage terms stay in technical docs only. | `@claim:local-records`; live `/privacy/`. |
| F-1-36 | Uses observable same-origin language, not broad tracking jargon. | `@claim:no-third-party-runtime`; `@claim:local-records`. |
| F-1-37 | Removed obsolete license storage/network behavior. | `@claim:demo-isolation`; runtime-origin check. |
| F-1-38 | Deploy README explains direct links, 404, safety headers, and asset caching in plain words. | README review; live route/header checks. |
| F-1-39 | Removed unnecessary precache jargon from visitor docs. | README review; build passes. |
| F-1-40 | Removed checkout/provider runtime and copy. | Source scan; `@claim:no-third-party-runtime`. |
| F-1-41 | Documents original-art provenance in plain words. | `.factory/design.md`; live footer. |
| F-1-42 | `Bike overview` is a real shared-header link. | `@claim:routed-history`; `@claim:mobile-targets`. |
| F-1-43 | `Back up and export` is a descriptive shared-header link. | `@claim:routed-history`; `@claim:mobile-targets`. |
| F-1-44 | Replaced vague ownership marketing with an observable browser-storage statement. | `@claim:local-records`. |
| F-1-45 | Core service fields persist through a real create/reload flow. | Full browser create/component/service test; Live suite. |
| F-1-46 | Due reminders and offline behavior are independently claimed and tested. | `@claim:date-distance-reminders`; `@claim:offline-reload`. |
| F-1-47 | Storage wording maps to a full request-log test. | `@claim:local-records`. |
| F-1-48 | CSV and JSON tests parse downloads, including escaping and attachments. | `@claim:csv-export`; `@claim:json-export`. |
| F-1-49 | Removed unsupported ride-tracking promise. | Copy/source scan; live `/`. |
| F-1-50 | Replaced promotional privacy language with exact local behavior. | `@claim:local-records`. |
| F-1-51 | CRUD, reload, export, and delete run under same-origin request logging. | `@claim:local-records`. |
| F-1-52 | README promises map to registered local, offline, export, search, print, and multi-bike claims. | `.factory/claims.json`; Clean claims. |
| F-1-53 | Sample visibly provides recent work and calculated next reminders. | `@claim:sample-content-and-onboarding`; `@claim:date-distance-reminders`. |
| F-1-54 | Three named bikes retain distinct odometers across demo reload. | `@claim:sample-content-and-onboarding`; `@claim:demo-reset`. |
| F-1-55 | Date-only, distance-only, either-trigger, month-end, leap-year, and mileage baseline fixtures pass. | `@claim:date-distance-reminders`. |
| F-1-56 | Cross-bike reverse order and bike/shop searches are asserted. | `@claim:history-search-order`. |
| F-1-57 | Work, notes, cost, repair shop, mileage, and attachment persist across reload. | Full browser create/component/service test; Live suite. |
| F-1-58 | Backup, CSV, print, restore, and malformed-input validation have separate tests. | `@claim:json-export`; `@claim:csv-export`; `@claim:print-history`; `@claim:backup-validation`. |
| F-1-59 | Manifest, service worker control, offline reload, persistence, and exports are verified. | `tests/contracts.test.ts`; `@claim:offline-reload`; Clean claims. |
| F-1-60 | Phone routes have no overflow, 44 px targets, and no serious/critical Axe violations. | `@claim:mobile-targets`; Live suite Axe checks. |
| F-1-61 | Removed unavailable paid boundary and attachment gates; all records remain usable. | Live `/pass` HTTP 404; full creation flow. |
| F-1-62 | IndexedDB CRUD is exercised while request logging stays same-origin. | `@claim:local-records`. |
| F-1-63 | Shipped routes load only same-origin scripts and files. | `@claim:no-third-party-runtime`; Clean claims. |
| F-1-64 | Privacy states the precise no-server-copy/backup limitation. | Live `/privacy/`; `@claim:local-records`. |
| F-1-65 | Removed unavailable license-frequency behavior with the billing runtime. | Source scan; `@claim:demo-isolation`. |
| F-1-66 | Removed billing endpoints and payment-provider integration. | Source scan; CSP `connect-src 'self'`; `@claim:no-third-party-runtime`. |
| V-01 | Same disposition as F-1-4: remove unavailable Workshop Pass rather than expose a broken checkout. | Live `/pass` HTTP 404. |
| V-02 | Same disposition as F-1-5: reject malformed nested backup before storage. | `@claim:backup-validation`. |
| V-03 | Same disposition as F-1-6: clamp month-end dates. | `@claim:date-distance-reminders`. |
| V-04 | Same disposition as F-1-7: preserve latest known service mileage. | `@claim:date-distance-reminders`. |
| V-05 | Same disposition as F-1-8: 44 px mobile targets. | `@claim:mobile-targets`; Live suite. |
| V-06 | Same disposition as F-1-9: immutable cache headers for fingerprinted assets. | Live header check. |
| V-07 | Same disposition as F-1-10: production security and MIME headers. | Live header check. |

No prior review, verification, or polish finding remains unresolved.
