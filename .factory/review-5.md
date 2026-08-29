# Adversarial first-read review 5 — Bike Service Timeline

- Reviewed: 2026-08-29 UTC
- Live URL: https://bike-service-timeline.sociobot.in
- Repository commit: e680ef5984b8b1b8aa3223234d72a2756fb2c3b0
- Contexts: fresh Chromium at 390 × 844 and 1440 × 1000; fresh clone at /tmp/bike-service-timeline-review5
- Verdict: **PASS**

PASS is appropriate only because this repeat review produced zero blocking or minor findings, and every registered claim was run from the clean clone.

## Cold first screen

No scroll or interaction was used. Both viewports answer the required questions before the fold.

| Question | Answer visible on the first screen |
| --- | --- |
| What does this do? | It tracks service history for all of the visitor's bikes and shows what is due next. |
| For whom? | “For people who maintain several bikes…” |
| What should I click first? | **Try it with sample data** opens three histories; **Add your first bike** starts a blank real record. |

The exact text that supplies those answers is “Track service across all your bikes”; “For people who maintain several bikes and need one history plus a clear view of what is due next.”; and “The sample opens three bike histories. Adding a bike starts a blank record.” The primary demo action, outcome, and real-data alternative are visible and unambiguous at 390 px.

## Demo, sandbox, and privacy checks

The landing action opened /?demo=1 in one click. Its first screen was already in use: **Service status**, Aster Road, Maple Cargo, Pine Trail, distinct odometers, due/upcoming reminders, and recent service work. The persistent banner read **Demo — sample data, nothing is saved** and exposed working **Reset demo** and **Start for real** controls.

In a fresh live context, the only IndexedDB database after entering demo was demo:bike-service-timeline. Reset restored Aster Road, Maple Cargo, and Pine Trail. The live request log during the demo flow contained only https://bike-service-timeline.sociobot.in; there was no runtime model, analytics, billing, or third-party request. The clean-clone @claim:demo-isolation command additionally verifies that seeded real license keys are neither read nor written, a demo-only bike is discarded on real start, and no external request occurs.

The brief does not imply an omitted AI feature or cloud sync. Local service planning is deterministic, and CSV plus complete JSON backup supply the valuable portability path. The AI statement is limited to generated-art provenance; it is not a decorative runtime feature and no provider key is embedded.

## Claims and quality gates

npm ci, npm test (9 tests), and npm run build passed in the fresh clone. The build produced dist/; initial JavaScript is 42.17 kB raw / 13.45 kB gzip. npm run test:e2e completed with a passed Playwright status (42 scheduled checks). Every exact command named by .factory/claims.json passed:

| Claim | Result | Observable result verified |
| --- | --- | --- |
| demo-isolation | PASS | Demo writes and real license keys are isolated. |
| demo-reset | PASS | Reset restores the three shipped bikes. |
| sample-content-and-onboarding | PASS | Three useful histories appear; real onboarding is blank. |
| multi-bike-history | PASS | Two real bikes’ entries appear together in reverse date order. |
| offline-reload | PASS | Controlled demo reloads offline after its first visit. |
| csv-export | PASS | Parsed CSV has its header, sample rows, order, and escaping. |
| json-export | PASS | Parsed backup contains all shipped nested records. |
| local-records | PASS | Demo CRUD, reload, export, and deletion stay on the product origin. |
| no-third-party-runtime | PASS | Shipped routes load only same-origin files and scripts. |
| date-distance-reminders | PASS | Date, distance, leap/month-end, and known-mileage cases pass. |
| backup-validation | PASS | Invalid nested backup records are rejected before restore. |
| routed-history | PASS | Direct URLs, title, canonical, reload, history, and focus work. |
| history-search-order | PASS | Cross-bike search retains reverse date order. |
| print-history | PASS | Printable history opens and print media hides controls. |
| mobile-targets | PASS | 390 px routes have no overflow or undersized tested targets. |

All claim-like landing and README wording maps to these entries. No unlisted visitor claim was found.

## Copy audit

Words are whitespace-delimited. The audit includes headings, controls, captions, footer text, and meaningful alternative text; code-block commands are excluded from README prose. No unit exceeds 22 words. No banned marketing word, unexplained visitor-facing jargon, inconsistent core term, mood heading, or non-result-naming action was found. “This browser”, “service history”, “service entry”, “service work”, “repair shop”, and “backup” remain consistent.

### Landing page

| Copy unit | Words | Result / claim where applicable |
| --- | ---: | --- |
| Skip to your service timeline | 5 | — |
| Bike Service Timeline | 3 | — |
| Demo | 1 | — |
| All history | 2 | — |
| Back up and export | 4 | — |
| Privacy | 1 | — |
| Add a bike | 3 | — |
| Private service history for all your bikes | 7 | local-records |
| Track service across all your bikes | 6 | multi-bike-history |
| For people who maintain several bikes and need one history plus a clear view of what is due next. | 18 | — |
| Try it with sample data | 5 | — |
| Add your first bike | 4 | — |
| The sample opens three bike histories. | 6 | sample-content-and-onboarding |
| Adding a bike starts a blank record. | 7 | sample-content-and-onboarding |
| Stored in this browser | 4 | local-records |
| Works offline after the first visit | 6 | offline-reload |
| Export JSON or CSV | 4 | json-export; csv-export |
| Layered paper workshop with road, cargo, and mountain bikes connected by blank service tags | 14 | useful image alternative |
| Service history for road, cargo, and mountain bikes. | 8 | sample-content-and-onboarding |
| See the service view before adding records | 7 | — |
| Sample road, cargo, and mountain bikes show due reminders and service history. | 12 | sample-content-and-onboarding; date-distance-reminders |
| How it works | 3 | — |
| Add bikes | 2 | — |
| Keep odometers and notes together. | 5 | sample-content-and-onboarding |
| Log service | 2 | — |
| Record work, cost, and repair shop details. | 7 | sample-content-and-onboarding |
| Check what is due | 4 | — |
| Use your own date and distance reminders. | 7 | date-distance-reminders |
| Privacy and limits | 3 | — |
| Records stay in this browser unless you export them. | 9 | local-records |
| Reminders are personal planning aids, not safety advice. | 9 | necessary limitation |
| Your records stay portable | 4 | json-export |
| Download a complete backup before clearing browser data or changing devices. | 11 | json-export |
| Open backup and export | 4 | — |
| Service history for people who maintain more than one bike. | 10 | — |
| Privacy | 1 | — |
| Terms | 1 | — |
| Export backup | 2 | json-export |
| Built by Param Factory · build polish-4 | 7 | — |
| Paper-workshop illustration created with AI assistance for this product. | 9 | asset provenance |

### README

| Copy unit | Words | Result / claim where applicable |
| --- | ---: | --- |
| Bike Service Timeline | 3 | — |
| Track service history and next reminders across every bike you maintain. | 11 | multi-bike-history; date-distance-reminders |
| It is for people with several bikes who want one record in their browser. | 13 | — |
| Try the isolated sample at https://bike-service-timeline.sociobot.in/?demo=1. | 6 | demo-isolation |
| What it does | 3 | — |
| Stores bikes, components, service entries, mileage, notes, costs, and repair shop details in this browser. | 15 | sample-content-and-onboarding; local-records |
| Uses the date and distance reminders you set. | 8 | date-distance-reminders |
| Searches service history across bikes in reverse date order. | 9 | history-search-order |
| Exports every service entry as CSV and downloads a complete JSON backup. | 12 | csv-export; json-export |
| Opens a printable service history. | 5 | print-history |
| Works offline after the first visit. | 6 | offline-reload |
| The demo and real records use separate browser databases. | 9 | demo-isolation |
| Starting for real deletes demo changes. | 6 | demo-isolation |
| During the tested demo flow, records are not sent to another origin. | 12 | local-records; no-third-party-runtime |
| Reminders are personal planning aids. | 5 | necessary limitation |
| They are not diagnostics or safety advice. | 7 | necessary limitation |
| Read the privacy notice and terms. | 6 | — |
| Develop | 1 | — |
| Requires Node.js 20 or newer. | 5 | developer prerequisite |
| Test and build | 3 | — |
| Every visitor-facing claim is listed in .factory/claims.json. | 7 | registry checked |
| Run each listed command from a clean clone. | 8 | developer instruction |
| Playwright 1.58.2 is pinned and uses the Chromium build from PLAYWRIGHT_BROWSERS_PATH. | 11 | developer prerequisite |
| Deploy | 1 | — |
| Deploy dist/ as a static site. | 5 | developer instruction |
| Use staticwebapp.config.json for direct links, the designed 404 page, browser safety headers, and asset caching. | 13 | developer instruction |
| Design and license | 3 | — |
| The paper-workshop visual system and original-image provenance are in .factory/design.md. | 11 | repository pointer |
| Licensed under MIT. | 3 | — |

## Structure, accessibility, links, and identity

Fresh live requests and browser navigation verified /, /demo, /history, /backup, /privacy/, /terms/, and /404.html return 200. Each has one h1, a main landmark, a route-specific title, description, canonical URL, favicon and Apple touch icon, Open Graph/Twitter metadata, and the owned share image. An unknown path returns the styled recovery screen with HTTP 404. All crawled ordinary internal destinations returned 200; legal contact destinations are explicit mailto: links.

Direct URLs, reload, browser back/forward, focus movement to the new h1, and route announcement are covered by routed-history. The shared header provides the wordmark home link plus Demo, All history, Back up and export, and Privacy on app, legal, and 404 screens. Mobile route and Axe checks pass. The root response has CSP, Permissions Policy, nosniff, and referrer policy; fingerprinted assets use immutable caching. Fresh valid-route contexts produced no application console errors.

The warm paper palette, generated workshop illustration, serif display face, cut-card edges, and service timeline rail match .factory/design.md and are visibly product-specific. The mobile demo does not resemble a generic SaaS template.

## Earlier-finding recheck

I read every earlier review-*, polish-*, handoff, and verification record and rechecked the live site, source, and current tests. Each earlier finding is confirmed fixed below; no prior ID reopens.

| Earlier IDs | Current confirmation |
| --- | --- |
| V-01; F-1-4; F-2-1; F-2-7; F-2-9 | The unavailable pass, checkout, billing runtime, paid gate, and associated promises are absent; /pass is the designed 404. |
| V-02; F-1-5 | backup-validation rejects malformed nested fields, dates, relations, and metadata before writes. |
| V-03; F-1-6 | date-distance-reminders confirms calendar-month clamping. |
| V-04; F-1-7 | The same test confirms independent date and latest-known-mileage baselines. |
| V-05; F-1-8 | The mobile claim covers app, demo, legal, and 404 targets and overflow at 390 px. |
| V-06; F-1-9 | Live fingerprinted files use one-year immutable cache headers. |
| V-07; F-1-10 | Live headers and manifest/AVIF MIME mappings are present. |
| F-1-1; F-1-16; F-1-18–F-1-27 | The cold screen names job, audience, choices, and outcomes; actions are enabled and copy is concrete, consistent, and result-naming. |
| F-1-2; F-2-2; F-2-5 | Demo has isolated sample storage, realistic first-screen content, banner, reset, and discard-on-real-start; real license storage and network stay untouched. |
| F-1-3; F-2-3; F-2-4; F-2-6; F-2-8; F-3-1 | The 15 registry entries have exactly one tagged test each; exports are parsed, locations are listed, and the multi-bike promise has a real-data test. |
| F-1-11–F-1-15; F-2-12; F-2-13; F-4-1 | Real routes, history/focus, styled HTTP 404, complete metadata, and the consistent shared header/footer are live. The header includes Demo and Privacy directly. |
| F-1-28–F-1-41 | README uses plain user/task language; visitor promises are registered or necessary limitations; obsolete payment and implementation jargon is absent. |
| F-1-42–F-1-43 | The wordmark is the functional home link and Back up and export is a descriptive real route; removal of redundant Bike overview is not a regression. |
| F-1-44–F-1-66 | Storage, sample content, reminders, exports, search, print, PWA/offline behavior, phone access, and privacy/origin behavior have concrete tests or unsupported promises were removed. |
| F-2-10; F-2-11; F-3-2 | Workshop-mood caption, section headings, and 404 label were replaced with literal, useful wording. |

## What would make this perfect

No missing product capability or repair is indicated by this round. Preserve the one-click isolated demo, exact claim coverage, plain-language first screen, and shared route shell when making future changes, then repeat this full cold-read review before release.

