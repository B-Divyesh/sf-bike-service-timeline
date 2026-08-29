# Adversarial first-read review 3 — Bike Service Timeline

- Reviewed: 2026-08-29 UTC
- Live URL: <https://bike-service-timeline.sociobot.in>
- Repository commit: `e7efccf`
- Contexts: fresh Chromium contexts at 390 × 844 and 1440 × 1000; fresh local clone at `/tmp/bike-service-review-3.z11z4N`
- Verdict: **FAIL**

This is a complete repeat review, not a diff review. Two minor findings remain. The required verdict is FAIL because PASS requires zero findings and zero untested claims.

## Cold first screen

No scroll or interaction was used for this read. The same result was obtained on phone and desktop.

| Question | Answer visible in the first viewport | Result |
| --- | --- | --- |
| What does it do? | It tracks service across a person's bikes and shows what is due next. | Clear. |
| For whom? | “For people who maintain several bikes…” | Clear. |
| What should I click first? | “Try it with sample data” to open three histories, or “Add your first bike” for a blank real record. | Clear. |

The first phone viewport contains the h1, audience sentence, both explicit choices, their outcomes, and the local/offline/export facts. No cold-read blocking finding is raised.

## Findings

### F-3-1 — MINOR — the core landing promise is not a registered claim

- **Quote/location:** landing h1, and repeated in the root title: “Track service across all your bikes”.
- **Why this fails:** this is a visitor-facing product promise. No `.factory/claims.json` entry names it or lists the landing h1/title. The `sample-content-and-onboarding` test proves the seeded three-bike sample; `history-search-order` proves its search order. Neither proves that a person can record service for more than one of their own bikes and see one combined history. This is an unlisted claim under the claims contract.
- **Concrete fix:** add a `multi-bike-history` claim with `where` naming the landing h1 and root title. From a clean real-data context, its tagged browser test should add two bikes, add a service entry to each, navigate to All history, and assert both entries are present in one reverse-date timeline.

### F-3-2 — MINOR — the 404 retains a decorative workshop metaphor

- **Quote/location:** live unknown-path page and `public/404.html` error tag: “404 · missing service tag”.
- **Why this fails:** “missing service tag” is an invented workshop label, not a plain error name. The h1 and recovery link are clear, but the decorative phrase violates the no-metaphor copy rule and adds no recovery information.
- **Concrete fix:** replace it with `404 — page not found`, or remove the tag.

## Demo, sandbox, and privacy check

The first-screen **Try it with sample data** link opened `/demo` in one click. Its first product screen already showed **Service status**, Aster Road, Maple Cargo, Pine Trail, due state, odometers, and service entries. The persistent banner read **Demo — sample data, nothing is saved** and included working **Reset demo** and **Start for real** controls.

The current source uses `demo:bike-service-timeline` versus `bike-service-timeline` for real data. The clean-clone `demo-isolation` test seeded real license keys, observed no reads/writes of them in demo, observed no external requests, added a demo-only bike, then confirmed Start for real did not carry it into real data. Reset restored the shipped three-bike data.

Fresh live phone and desktop request logs had no external origins and no console errors. The live-origin browser run also passed demo isolation, offline reload, no-third-party-runtime, routed-history, and mobile-target checks.

## Claims execution

Every command in `.factory/claims.json` was run from the fresh clone above; all passed. `npm test`, `npm run build`, and `npm run test:e2e` also passed in the reviewed checkout. The complete end-to-end suite scheduled 38 tests: 33 passed and 5 were intentional viewport skips. The build produced `dist/` with a 42.02 KB raw / 13.44 KB gzip initial JS bundle.

| Claim ID | Result | Observable evidence checked |
| --- | --- | --- |
| `demo-isolation` | PASS | seeded real license keys untouched; demo-only bike discarded; no external request |
| `demo-reset` | PASS | reset returned to exactly three sample bikes |
| `sample-content-and-onboarding` | PASS | three named histories, reminders, service details, and blank real form |
| `offline-reload` | PASS | `/demo` reloaded offline after service-worker control |
| `csv-export` | PASS | parsed header, all three reverse-date rows, quote escaping, attachment name |
| `json-export` | PASS | parsed schema and every seeded bike, component, service, and receipt |
| `local-records` | PASS | create/reload/export/delete flow stayed same-origin |
| `no-third-party-runtime` | PASS | every shipped route loaded only same-origin scripts/files |
| `date-distance-reminders` | PASS | date-only, distance-only, month-end, leap-year, and mileage baseline fixtures |
| `backup-validation` | PASS | invalid dates, relations, and export date rejected before restore |
| `routed-history` | PASS | URLs, titles, canonical, reload, back/forward, and h1 focus |
| `history-search-order` | PASS | cross-bike reverse-date order and bike/shop search |
| `print-history` | PASS | print invocation and print media history visibility |
| `mobile-targets` | PASS | exact mobile-project run; 390 px routes had no overflow or undersized checked controls |

The claims audit found F-3-1 above. All other landing and README product promises map to an existing entry: sample/onboarding, local-records, offline-reload, CSV/JSON export, date-distance-reminders, history-search-order, print-history, demo-isolation, or no-third-party-runtime.

## Copy audit

Counting method: visible copy units, headings, controls, captions, and README prose are counted by space-delimited words. Code commands are excluded. No unit exceeds 22 words. The two flags are F-3-1 and F-3-2; no landing or README sentence contains a banned marketing adjective, unexplained jargon, or a non-result-naming action.

### Landing page

| Copy unit | Words | Review result |
| --- | ---: | --- |
| Skip to your service timeline | 5 | — |
| Bike Service Timeline | 3 | — |
| Bike overview | 2 | — |
| All history | 2 | — |
| Back up and export | 4 | — |
| Add a bike | 3 | — |
| Private service history for all your bikes | 7 | local-records |
| Track service across all your bikes | 6 | F-3-1 |
| For people who maintain several bikes and need one history plus a clear view of what is due next. | 18 | — |
| Try it with sample data | 5 | — |
| Add your first bike | 4 | — |
| The sample opens three bike histories. | 6 | sample-content-and-onboarding |
| Adding a bike starts a blank record. | 7 | sample-content-and-onboarding |
| Stored in this browser | 4 | local-records |
| Works offline after the first visit | 6 | offline-reload |
| Export JSON or CSV | 4 | csv-export; json-export |
| Service history for road, cargo, and mountain bikes. | 8 | sample-content-and-onboarding |
| See the service view before adding records | 7 | — |
| Sample road, cargo, and mountain bikes show due reminders and service history. | 12 | sample-content-and-onboarding |
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
| Built by Param Factory · build polish-2 | 7 | — |
| Paper-workshop illustration created with AI assistance for this product. | 9 | provenance |

### README

| Copy unit | Words | Review result |
| --- | ---: | --- |
| Bike Service Timeline | 3 | — |
| Track service history and next reminders across every bike you maintain. | 11 | F-3-1 |
| It is for people with several bikes who want one record in their browser. | 13 | — |
| Try the isolated sample at the demo URL. | 8 | demo-isolation |
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
| Requires Node.js 20 or newer. | 5 | developer instruction |
| Test and build | 3 | — |
| Every visitor-facing claim is listed in `.factory/claims.json`. | 7 | verified registry except F-3-1 |
| Run each listed command from a clean clone. | 8 | developer instruction |
| Playwright 1.58.2 is pinned and uses the Chromium build from `PLAYWRIGHT_BROWSERS_PATH`. | 11 | developer instruction |
| Deploy | 1 | — |
| Deploy `dist/` as a static site. | 5 | developer instruction |
| Use `staticwebapp.config.json` for direct links, the designed 404 page, browser safety headers, and asset caching. | 13 | developer instruction |
| Design and license | 3 | — |
| The paper-workshop visual system and original-image provenance are in `.factory/design.md`. | 11 | repository pointer |
| Licensed under MIT. | 3 | — |

## Earlier finding recheck

I read `review-1.md`, `review-2.md`, `polish-1.md`, `polish-2.md`, and the previous handoff. The polish documents introduce no additional numbered findings; they disposition the findings below. The table records a fresh live-and-code check of every earlier ID. None reopens as blocking.

| Earlier ID | Current result |
| --- | --- |
| F-1-1 | Fixed: job, audience, choices, and outcomes appear in the first phone viewport. |
| F-1-2 | Fixed: `/demo`/`?demo=1`, separate database, reset, real-start discard, and isolated license keys. |
| F-1-3 | Fixed except the new core-claim gap in F-3-1: 14 existing claims have one tagged test each. |
| F-1-4 | Fixed: unavailable pass, checkout, and paid gate were removed; `/pass` is a 404. |
| F-1-5 | Fixed: nested malformed backups are rejected before restore. |
| F-1-6 | Fixed: month arithmetic clamps to the target month's last day. |
| F-1-7 | Fixed: date and known-mileage baselines are independent. |
| F-1-8 | Fixed: checked 390 px navigation/legal/demo controls meet 44 px contract. |
| F-1-9 | Fixed: hashed live assets have immutable one-year caching. |
| F-1-10 | Fixed: live CSP, Permissions Policy, nosniff, referrer policy, and MIME types are present. |
| F-1-11 | Fixed: demo/history/backup have direct URLs, titles, reload/back/forward, focus, and announcement behavior. |
| F-1-12 | Fixed: unknown live paths return the designed HTTP 404 with recovery. |
| F-1-13 | Fixed: landing has preview, three steps, privacy/limits, and backup guidance. |
| F-1-14 | Fixed: app, legal, and 404 routes have canonical, Apple icon, OG/Twitter, and owned share art. |
| F-1-15 | Fixed: app, legal, and 404 shells share nav/footer and `polish-2` build ID. |
| F-1-16 | Fixed: initial header action is enabled `Add a bike`. |
| F-1-17 | Fixed: privacy h1 is `Privacy notice`. |
| F-1-18 | Fixed: vague ownership phrase replaced with the local-storage statement. |
| F-1-19 | Fixed in wording; claim registration is now F-3-1. |
| F-1-20 | Fixed: “Keep the whole trail” is absent. |
| F-1-21 | Fixed: uses service work/repair shop consistently. |
| F-1-22 | Fixed: imprecise “little fixes” is absent. |
| F-1-23 | Fixed: due reminders are named directly. |
| F-1-24 | Fixed: visitor storage wording is consistently “this browser”. |
| F-1-25 | Fixed: export formats are named and parsed by claim tests. |
| F-1-26 | Fixed: image caption names the sample bike types. |
| F-1-27 | Fixed: promotional privacy shorthand is absent. |
| F-1-28 | Fixed in wording; its related multi-bike promise is F-3-1. |
| F-1-29 | Fixed: README says reminders are set by the owner. |
| F-1-30 | Fixed: README search/order claim is tested. |
| F-1-31 | Fixed: README CSV, backup, and print claims are tested. |
| F-1-32 | Fixed: README uses the tested offline-after-first-visit wording. |
| F-1-33 | Fixed: implementation/mobile-theme benefit copy is absent. |
| F-1-34 | Fixed: unavailable paid-tier copy is absent. |
| F-1-35 | Fixed: user-facing storage wording avoids IndexedDB jargon. |
| F-1-36 | Fixed: request-origin behavior has a dedicated test. |
| F-1-37 | Fixed: obsolete license behavior is absent. |
| F-1-38 | Fixed: deploy wording explains direct links/404/safety headers in plain terms. |
| F-1-39 | Fixed: README avoids precache jargon. |
| F-1-40 | Fixed: obsolete checkout/provider copy is absent. |
| F-1-41 | Fixed: provenance is plain and source metadata remains available. |
| F-1-42 | Fixed: Bike overview is a route link. |
| F-1-43 | Fixed: Back up and export is a descriptive route link. |
| F-1-44 | Fixed: local-records proves the precise browser-storage promise. |
| F-1-45 | Fixed: retained service fields are visible in sample and browser flow. |
| F-1-46 | Fixed: reminder and offline behavior are separate claims. |
| F-1-47 | Fixed: storage wording maps to a request-log test. |
| F-1-48 | Fixed: CSV and JSON outputs are parsed rather than merely downloaded. |
| F-1-49 | Fixed: unsupported ride-tracking claim is absent. |
| F-1-50 | Fixed: promotional privacy shorthand is absent. |
| F-1-51 | Fixed: CRUD/reload/export/delete request behavior is tested. |
| F-1-52 | Fixed except F-3-1: remaining README claims map to entries. |
| F-1-53 | Fixed: sample displays history and due state. |
| F-1-54 | Fixed: three distinct sample bikes and odometers persist in demo. |
| F-1-55 | Fixed: interval edge cases are tagged unit coverage. |
| F-1-56 | Fixed: cross-bike search/order is tagged browser coverage. |
| F-1-57 | Fixed: core service fields and attachment persist through reload. |
| F-1-58 | Fixed: backup, CSV, print, restore, and validation have separate coverage. |
| F-1-59 | Fixed: manifest, service worker, offline reload, and export coverage exist. |
| F-1-60 | Fixed: mobile targets/no-overflow and axe checks pass. |
| F-1-61 | Fixed: paid boundary and gates are removed. |
| F-1-62 | Fixed: IndexedDB CRUD is exercised with same-origin request logging. |
| F-1-63 | Fixed: all shipped routes have same-origin runtime requests/scripts. |
| F-1-64 | Fixed: Privacy explains the lack of server recovery and backup need. |
| F-1-65 | Fixed: license frequency behavior is absent. |
| F-1-66 | Fixed: billing endpoints and provider runtime integration are absent. |
| F-2-1 | Fixed: paid offer and checkout removed. |
| F-2-2 | Fixed: demo no longer accesses real license storage or network path. |
| F-2-3 | Fixed: CSV test parses content, order, fields, and escaping. |
| F-2-4 | Fixed: JSON test parses schema and every seeded nested record. |
| F-2-5 | Fixed: sample/onboarding claim covers the named seeded experience. |
| F-2-6 | Fixed except F-3-1: listed landing export/offline occurrences map to claims. |
| F-2-7 | Fixed: paid-tier promises removed. |
| F-2-8 | Fixed except F-3-1: search, print, local, and origin behavior each have tests. |
| F-2-9 | Fixed: “Offline forever” and pass page removed. |
| F-2-10 | Fixed: landing caption is concrete. |
| F-2-11 | Fixed: app/backup headings name their sections. |
| F-2-12 | Fixed: 404 metadata is complete. |
| F-2-13 | Fixed: 404 header/footer and build ID match other routes. |

## Structure, accessibility, identity, and leverage

The live route sweep of `/`, `/demo`, `/history?demo=1`, `/backup?demo=1`, `/privacy/`, `/terms/`, and `/404.html` found one h1 and one main per route, correct title/description/canonical metadata, and zero serious or critical axe findings. An unknown URL returned HTTP 404 and the recovery screen. All crawled internal links returned 200; `mailto:` and the sample PDF `data:` download were explicit destinations. The expected favicon, manifest, OG/Twitter image, robots, sitemap, header/footer links, mobile focus targets, and response headers are present.

The paper-workshop art, ink/paper palette, serif display type, cut-card depth, and timeline rail are specific to this product and do not resemble a generic SaaS template. The small AI statement is accurate asset provenance, not an unexplained runtime AI feature. The brief does not imply a missing AI step or sync: interval calculation, local records, and export are deterministic; adding model use would make the offline/local-first task worse. JSON/CSV export already supplies the valuable portability path.

## What would make this perfect

Register and test the multi-bike core promise from F-3-1, then remove or plainly rename the 404's decorative “missing service tag” label from F-3-2. Repeat this full fresh phone/desktop, demo, claims, routing, and copy review. Only zero findings and zero untested claims qualifies for PASS.
