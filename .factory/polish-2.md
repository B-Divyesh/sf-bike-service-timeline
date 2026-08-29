# Polish round 2 — cumulative finding disposition

- Work order: `bike-service-timeline-polish-2`
- Repaired candidate: `47b5422db8de1c55d3429e4a053ea105cac1296b`
- Review source: `f10c8bcf820df36330651cb69b3c95f3e71cf68e`
- Repair commits: `50236f3`, `ed1c69c`, `9bbacfc`
- Live URL: <https://bike-service-timeline.sociobot.in>
- Evidence images: [local/mobile home](./evidence/polish-2/local-home-mobile.png), [local/mobile demo](./evidence/polish-2/local-demo-mobile.png), [live/mobile demo](./evidence/polish-2/live-demo/screenshot-mobile.png), [live/mobile 404](./evidence/polish-2/local-404-mobile.png)

Every row below names the implemented change and observable evidence. Browser
claim names refer to `tests/e2e/claims.spec.ts`; unit claim names refer to
`tests/utils.test.ts`.

## Review 2

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 / F-1-4 | Removed the unavailable purchase, paid gate, pass route, checkout URL, and license runtime. Bikes and attachments remain usable. | `/pass` returns 404 live; source allow-list check finds no billing URL; full create/service browser test |
| F-2-2 / F-1-2 | Demo code no longer initializes, reads, writes, or verifies licenses. Start for real deletes the demo database. | `@claim:demo-isolation` seeds real license keys, logs storage access and network, and passes live |
| F-2-3 | CSV verification reads the file and asserts the exact header, every row, reverse date order, attachment name, and quote/comma escaping. | `@claim:csv-export`, passed offline locally and live |
| F-2-4 | JSON verification parses the file and checks product, schema, export date, all bikes, components, services, fields, and the sample receipt. | `@claim:json-export`, passed offline locally and live |
| F-2-5 | Added one claim for all three sample bikes, odometers, notes, service entries, repair shop, cost, due state, attachment, and blank onboarding. | `@claim:sample-content-and-onboarding`; live demo screenshot |
| F-2-6 | Claims registry now lists landing, screen, Privacy, and README occurrences for offline, CSV, and JSON claims. | `.factory/claims.json`; `tests/contracts.test.ts` |
| F-2-7 | Removed price, entitlement, paid-boundary, and attachment-gate promises because production checkout is unavailable. | Live landing has no paid offer; `/pass` returns 404; source scan |
| F-2-8 | Rewrote README around the tested claim set and added search/order, print, local-record, and request/script allow-list claims. | `@claim:history-search-order`, `@claim:print-history`, `@claim:local-records`, `@claim:no-third-party-runtime` |
| F-2-9 | Removed “Offline forever” and the entire unavailable pass page. | Live `/pass` 404; source scan |
| F-2-10 / F-1-26 | Replaced the slogan caption with “Service history for road, cargo, and mountain bikes.” | `.factory/copy-audit.md`; live root screenshot |
| F-2-11 | Replaced metaphor headings with Service status, Your bikes, Next service, Recent service, and Backup and export. | Live demo and `/backup?demo=1`; route/accessibility tests |
| F-2-12 / F-1-14 | Added canonical, Apple touch icon, OG, Twitter, description, and product social image metadata to 404. | metadata browser test; live `/404.html`; 1200×630 image check |
| F-2-13 / F-1-15 | Synchronized 404 navigation/footer and the `polish-2` build ID with app and legal routes. | live 404 screenshot; mobile-target and metadata tests |

## Review 1

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Job-first h1, audience sentence, sample action, real action, outcomes, and three facts remain on the first screen. | live root screenshot; sample-content claim |
| F-1-2 | Added both `/demo` and `?demo=1`, a separate database, seed, banner, reset, and destructive Start for real. | demo-isolation and demo-reset claims, both live |
| F-1-3 | Expanded the claims registry to 14 entries with exactly one tag and executable command per claim. | `tests/contracts.test.ts`; every command rerun from clean clone |
| F-1-4 | Removed the unavailable paid offer and runtime billing code. | live `/pass` 404; source scan |
| F-1-5 | Validates nested fields, dates, IDs, relations, export timestamp, and attachment data before restore. | `@claim:backup-validation` |
| F-1-6 | Calendar month addition clamps to the last valid target-month day. | `@claim:date-distance-reminders` |
| F-1-7 | Date and mileage baselines are selected independently. | `@claim:date-distance-reminders` |
| F-1-8 | App, legal, demo, and 404 navigation targets are at least 44×44 px with no 390 px overflow. | `@claim:mobile-targets`, passed live |
| F-1-9 | Hashed assets use one-year immutable caching; HTML and `sw.js` revalidate. | live header check |
| F-1-10 | Added CSP, Permissions Policy, nosniff, referrer policy, and correct manifest/AVIF MIME types. | live header and MIME check |
| F-1-11 | History and backup have direct URLs, titles, canonical updates, h1 focus, reload, back, and forward behavior. | `@claim:routed-history`, passed live |
| F-1-12 | Added a designed, recoverable HTTP 404 route. | live unknown path returns 404; 404 screenshot |
| F-1-13 | Landing includes live-product preview, three steps, privacy/limits, and backup guidance. | live root screenshot |
| F-1-14 | Added canonical, OG, Twitter, Apple icon, and original 1200×630 share art on every route. | metadata browser test; image dimension check |
| F-1-15 | App, legal, and 404 routes share wordmark, navigation, skip link, footer links, factory credit, and build ID. | metadata/mobile/accessibility tests |
| F-1-16 | Empty state uses enabled Add a bike actions; no disabled primary action competes. | live root screenshot |
| F-1-17 | Privacy h1 is “Privacy notice.” | live `/privacy/`; accessibility suite |
| F-1-18 | Uses “Private service history for all your bikes.” | copy audit |
| F-1-19 | Uses “Track service across all your bikes.” | copy audit |
| F-1-20 | Removed “Keep the whole trail.” | source scan; copy audit |
| F-1-21 | Uses service work and repair shop consistently. | copy audit |
| F-1-22 | Removed “little fixes.” | source scan |
| F-1-23 | Names due and upcoming reminders directly. | live demo screenshot |
| F-1-24 | Uses “this browser” for storage copy. | copy audit |
| F-1-25 | Names JSON and CSV export formats. | csv-export and json-export claims |
| F-1-26 | Replaced the image slogan with a concrete sample description. | live root screenshot |
| F-1-27 | Replaced “Private by default” with the exact local-record sentence. | local-records claim |
| F-1-28 | README opens with the user, task, and result in plain words. | README; copy audit |
| F-1-29 | README says reminders are set by the user. | date-distance-reminders claim |
| F-1-30 | README names cross-bike reverse-date search. | history-search-order claim |
| F-1-31 | README names CSV, complete backup, and print results. | csv/json/print claims |
| F-1-32 | README uses offline-after-first-visit wording. | offline-reload claim |
| F-1-33 | Removed implementation-oriented mobile/theme benefit copy. | README; copy audit |
| F-1-34 | Removed the unavailable paid-tier sentence. | README/source scan |
| F-1-35 | User privacy copy says “this browser”; IndexedDB remains only in technical demo docs. | README, Privacy, demo docs |
| F-1-36 | Replaced broad privacy jargon with observable same-origin statements. | local-records and no-third-party-runtime claims |
| F-1-37 | Removed license storage/network copy with the removed billing runtime. | source scan |
| F-1-38 | Deployment instructions now say what the host config enables. | README Deploy |
| F-1-39 | Removed precache jargon from visitor documentation. | README |
| F-1-40 | Removed obsolete checkout/verification copy. | README/source scan |
| F-1-41 | Uses plain provenance wording and retains source metadata. | README; design document |
| F-1-42 | Bike overview is a real link in every shared header. | routed-history and mobile-targets claims |
| F-1-43 | Back up and export is a real descriptive link. | routed-history and mobile-targets claims |
| F-1-44 | Replaced ownership marketing with observable local storage wording. | local-records claim |
| F-1-45 | Landing names only visible service fields; browser flow persists work, notes, cost, repair shop, mileage, and attachment. | full create/service browser test |
| F-1-46 | Split due reminder and offline behavior into independently tested claims. | date-distance-reminders and offline-reload |
| F-1-47 | Storage wording maps to a full request-log test. | local-records claim |
| F-1-48 | Offline CSV and JSON downloads are parsed and checked, including escaping and attachments. | csv-export and json-export |
| F-1-49 | Removed the unneeded ride-tracking claim. | copy/source scan |
| F-1-50 | Replaced promotional privacy shorthand with exact behavior. | local-records claim |
| F-1-51 | CRUD, reload, export, and delete run while requests are recorded. | local-records claim |
| F-1-52 | README local and offline claims map to separate tests. | claims registry |
| F-1-53 | Sample displays recent service and calculated next reminders. | sample-content and date-distance claims |
| F-1-54 | Three bikes have distinct odometers and survive demo reload. | sample-content and demo-isolation claims |
| F-1-55 | Date-only, distance-only, either-trigger, month-end, leap-year, and missing-mileage fixtures pass. | date-distance-reminders claim |
| F-1-56 | Cross-bike order and searches by bike and repair shop are asserted. | history-search-order claim |
| F-1-57 | Service flow persists type, notes, cost, repair shop, mileage, and an image attachment through reload. | create/component/service browser test |
| F-1-58 | Separate tests cover complete backup, CSV contents, print behavior, restore, and malformed nested input. | json-export, csv-export, print-history, backup-validation, restore browser test |
| F-1-59 | Manifest, persistence, service-worker control, offline reload, and offline export are verified. | contracts test; offline/csv/json claims |
| F-1-60 | Phone routes have no horizontal overflow, 44 px targets, and zero serious/critical axe violations. | mobile-targets and all-route axe tests |
| F-1-61 | Removed the unavailable two-bike/US$19 promise and all gates. | source scan; third bike and attachments work in browser tests |
| F-1-62 | IndexedDB CRUD is exercised while the request log stays same-origin. | local-records claim |
| F-1-63 | Every shipped route loads only same-origin scripts and files. | no-third-party-runtime claim |
| F-1-64 | Privacy states the precise limitation: there is no server copy, so users should export backups. | Privacy notice; local-records claim |
| F-1-65 | Removed license frequency behavior with the unavailable billing runtime. | source scan |
| F-1-66 | Removed all billing endpoints and provider integration from runtime and docs. | source scan; CSP `connect-src 'self'` |

## Additional verification found during polish

The all-route axe sweep found low contrast on backup panel numbers. They now use
the pine token and the full route sweep has zero serious or critical violations.

The first production deploy revealed that the service worker tried to precache
the deployment-only `staticwebapp.config.json`, which Azure does not expose.
The post-build step now excludes it. The repaired live worker installed and the
offline reload, CSV, and JSON claims passed directly against production.
