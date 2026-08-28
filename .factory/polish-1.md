# Polish round 1 — finding disposition

Local evidence is from `npm test`, `npm run test:e2e`, and the exact commands
in `claims.json`. Final live evidence is in `.factory/handoff.md`, with
screenshots under `.factory/evidence/`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Rewrote the first screen with the requested job and audience. | `app.spec.ts`; `/` cold check |
| F-1-2 | Added `/demo` and `?demo=1`, sample bikes, isolated `demo:` database, banner, reset, and real-start link. | `@claim:demo-isolation`, `@claim:demo-reset` |
| F-1-3 | Added claims registry and exactly one tagged test per entry. | every command in `.factory/claims.json` |
| F-1-4 / V-01 | App still uses the required Sociobot hosted checkout endpoint. The external product is not enabled: live endpoint returned 404 before repair. | `curl` evidence in handoff; factory registration required |
| F-1-5 / V-02 | Validated every backup field, date, attachment, ID, and relation before any write transaction. | `@claim:backup-validation` |
| F-1-6 / V-03 | Replaced overflowing month arithmetic with final-day calendar clamping. | `@claim:date-distance-reminders` |
| F-1-7 / V-04 | Selects last date service and last known-mileage service independently. | `@claim:date-distance-reminders` |
| F-1-8 / V-05 | Added 44px link hit areas in navigation, footer, merchant notice, and legal pages. | `@claim:mobile-targets` |
| F-1-9 / V-06 | Added immutable hashed-asset cache policy. | `staticwebapp.config.json`; deployed-header check |
| F-1-10 / V-07 | Added CSP, Permissions Policy, nosniff/referrer headers and AVIF/manifest MIME mappings. | `staticwebapp.config.json`; deployed-header check |
| F-1-11 | Added direct history/backup/pass URLs, History API navigation, titles, focus, and announcements. | `@claim:routed-history` |
| F-1-12 | Added product-styled `404.html` and Static Web Apps response override. | `/404.html`; deployed unknown-path check |
| F-1-13 | Added preview, three-step workflow, privacy/limit, and price sections to the landing screen. | `/` cold check |
| F-1-14 | Added canonical, OG, Twitter, apple-touch metadata, and original 1200×630 share image. | built route head checks |
| F-1-15 | Added matching skip link, wordmark, navigation, legal links, factory credit, and build ID to legal pages. | browser/axe suite |
| F-1-16 | Replaced the disabled header action with enabled Add a bike before setup. | `/` cold check |
| F-1-17 | Renamed the privacy h1 to Privacy notice. | `/privacy/` check |
| F-1-18–F-1-27 | Rewrote or removed every flagged landing phrase; standardized service history, service work, and this browser. | `.factory/copy-audit.md` |
| F-1-28–F-1-41 | Rewrote README benefit, privacy, deploy, and provenance copy in plain words. | `.factory/copy-audit.md`; README review |
| F-1-42–F-1-43 | Changed Bench/Backup button controls to descriptive destination links. | `@claim:routed-history` |
| F-1-44–F-1-66 | Replaced vague promises with a small testable claim set; registered and tested demo, privacy, export, offline, routing, target, calculation, and validation claims. | `.factory/claims.json` and listed commands |

## Per-ID copy and claim cross-reference

| ID | Exact disposition and evidence |
| --- | --- |
| F-1-18 | Replaced with `Private service history for all your bikes`; copy audit. |
| F-1-19 | Replaced h1; copy audit. |
| F-1-20 | Removed; copy audit. |
| F-1-21 | Replaced with `Log service`; copy audit. |
| F-1-22 | Removed imprecise `little fixes`; copy audit. |
| F-1-23 | Replaced with concrete due-reminder wording; copy audit. |
| F-1-24 | Uses `this browser`; `@claim:local-records`. |
| F-1-25 | Names JSON and CSV; `@claim:backup-export`, `@claim:csv-export`. |
| F-1-26 | Replaced with sample-bike explanation; copy audit. |
| F-1-27 | Replaced with exact local-record wording; `@claim:local-records`. |
| F-1-28 | README rewritten in plain words; README audit. |
| F-1-29 | README uses reminders you set; `@claim:date-distance-reminders`. |
| F-1-30 | README uses searchable history in date order; browser suite. |
| F-1-31 | README names backup, spreadsheet export, and print; export claims. |
| F-1-32 | README uses offline-after-first-visit wording; `@claim:offline-reload`. |
| F-1-33 | Removed implementation jargon; mobile browser suite. |
| F-1-34 | Uses exact free/pass price wording; pass UI check. |
| F-1-35 | Uses `this browser`; `@claim:local-records`. |
| F-1-36 | Uses plain privacy wording; request-log claim. |
| F-1-37 | Rewritten as license-token consequence; license unit/browser coverage. |
| F-1-38 | README now names Static Web Apps config; build check. |
| F-1-39 | README avoids precache jargon; build check. |
| F-1-40 | README names Sociobot hosted checkout only; source review. |
| F-1-41 | README uses source-image/prompt metadata wording; README audit. |
| F-1-42 | `Bike overview` destination link; routing claim. |
| F-1-43 | `Back up and export` destination link; routing claim. |
| F-1-44 | Replaced vague ownership wording; `@claim:local-records`. |
| F-1-45 | Retained only fields demonstrated by sample and core flow; browser suite. |
| F-1-46 | Split into offline and reminder claims; `@claim:offline-reload`, date-distance claim. |
| F-1-47 | Reworded to browser storage; local-records claim. |
| F-1-48 | Split JSON/CSV exports; both export claims. |
| F-1-49 | Removed ride-tracking claim. |
| F-1-50 | Replaced promotional privacy copy; local-records claim. |
| F-1-51 | Replaced with registered local-records wording. |
| F-1-52 | README local/offline claims map to local-records/offline tests. |
| F-1-53 | Sample history visibly answers latest work and due view; browser suite. |
| F-1-54 | Demo has three distinct bike odometers; demo-isolation test. |
| F-1-55 | Date/distance regression fixture; date-distance claim. |
| F-1-56 | Global history routes and browser coverage. |
| F-1-57 | Core form/browser coverage; attachments are pass-only copy. |
| F-1-58 | JSON and CSV export claims plus backup validation. |
| F-1-59 | Offline shell claim; manifest/build inspection. |
| F-1-60 | Mobile-target claim and desktop/mobile browser suite. |
| F-1-61 | Exact pass wording retained; checkout remains externally blocked (F-1-4). |
| F-1-62 | Local-records request-log claim. |
| F-1-63 | Local-records request-log claim. |
| F-1-64 | Rewritten as browser-data limitation. |
| F-1-65 | License behavior retained and documented; existing license coverage. |
| F-1-66 | Source uses only Sociobot billing URLs; source review. |
