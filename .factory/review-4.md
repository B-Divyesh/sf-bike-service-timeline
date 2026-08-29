# Adversarial first-read review 4 — Bike Service Timeline

- Reviewed: 2026-08-29 UTC
- Live URL: <https://bike-service-timeline.sociobot.in>
- Repository commit: `f640c2be836dcc0028fa3f886f1b3431b1a2ea67`
- Contexts: fresh Chromium at 390 × 844 and 1440 × 1000; fresh clone at `/tmp/bike-service-review-4.KwuiGB`
- Verdict: **FAIL**

PASS requires zero findings. One minor structural finding remains.

## Cold first screen

No scrolling or interaction was used. Both fresh viewports showed the same answer before the fold.

| Question | Answer visible on the first screen |
| --- | --- |
| What does it do? | It tracks service history across a person's bikes and shows what is due next. |
| For whom? | “For people who maintain several bikes…” |
| What should I click first? | **Try it with sample data** to open three histories; **Add your first bike** starts a blank real record. |

The exact copy that supplies those answers is: “Track service across all your bikes”; “For people who maintain several bikes and need one history plus a clear view of what is due next.”; and “The sample opens three bike histories. Adding a bike starts a blank record.” No cold-read blocking finding is raised.

## Findings

### F-4-1 — MINOR — the shared header omits direct Demo and Privacy navigation

- **Quote/location:** the live shared header on `/`, `/demo`, `/history`, `/backup`, `/privacy/`, `/terms/`, and `/404.html` contains only **Bike overview**, **All history**, and **Back up and export**.
- **Why this fails:** after leaving the first screen, including when arriving at a legal page or the designed 404, a visitor has no direct way to enter the one-click sample path. Privacy is only in the footer. This misses the required consistent header pattern of a Demo destination, product sections, and Privacy. The wordmark already returns to the bike overview, so the duplicated **Bike overview** header link does not add the missing path.
- **Concrete fix:** make the shared header contain no more than four useful destinations: **Demo** (`/demo`), **All history**, **Back up and export**, and **Privacy**. Keep the wordmark as the home link and use that same header on app, legal, and 404 pages. Add a route/header test that asserts these links on every route and that **Demo** opens the sample screen.

## Demo, sandbox, and privacy behaviour

**Try it with sample data** opened `/demo` in one click. The first screen already displayed Service status, Aster Road, Maple Cargo, Pine Trail, their odometers, due state, and recent service. The persistent banner read **Demo — sample data, nothing is saved** and provided working **Reset demo** and **Start for real** controls.

The live full browser suite confirmed the demo uses `demo:bike-service-timeline` instead of `bike-service-timeline`; seeded real license keys were neither read nor changed; a demo-only bike was discarded on Start for real; Reset restored exactly the three shipped bikes; and no external request occurred. The fresh live request log across app, demo, legal, and 404 routes contained only the product origin. No raw provider key or model endpoint is present. The generated illustration disclosure is asset provenance, not a runtime AI feature.

The brief does not imply a missing AI feature or sync. User-set service intervals and local exports are deterministic, and CSV/JSON backup already provide the useful portability path.

## Claims and clean-clone execution

In a fresh clone, `npm ci`, `npm test` (9 passed), and `npm run build` passed. Every exact command in `.factory/claims.json` passed from the clean clone. The full deployed-origin run, `PLAYWRIGHT_BASE_URL=https://bike-service-timeline.sociobot.in npm run test:e2e`, passed all 40 tests.

| Claim ID | Result | Observable result checked |
| --- | --- | --- |
| `demo-isolation` | PASS | Demo records and real license keys stayed separate; no external request. |
| `demo-reset` | PASS | Reset returned to the three shipped sample bikes. |
| `sample-content-and-onboarding` | PASS | Three histories, reminders, odometers, notes, receipt, and blank real form appeared. |
| `multi-bike-history` | PASS | Two real bikes’ service entries appeared together in reverse date order. |
| `offline-reload` | PASS | Controlled `/demo` reloaded with the context offline. |
| `csv-export` | PASS | Downloaded CSV had the header, all rows, order, attachment, and escaped note. |
| `json-export` | PASS | Downloaded backup contained the schema and all shipped nested records. |
| `local-records` | PASS | Create, reload, export, and delete stayed on the product origin. |
| `no-third-party-runtime` | PASS | All shipped routes loaded scripts and files only from this site. |
| `date-distance-reminders` | PASS | Date, distance, month-end, leap-year, and missing-mileage fixtures passed. |
| `backup-validation` | PASS | Invalid nested dates, relations, and metadata were rejected before restore. |
| `routed-history` | PASS | Direct URLs, title/canonical, reload, back/forward, and h1 focus worked. |
| `history-search-order` | PASS | Cross-bike reverse order and bike/shop searches worked. |
| `print-history` | PASS | Print opened and print media retained history while hiding navigation. |
| `mobile-targets` | PASS | 390 px app, legal, and 404 routes had no overflow or undersized tested targets. |

All claim-like landing and README copy maps to the entries above. Privacy-route claims map to `demo-isolation`, `local-records`, `no-third-party-runtime`, and `offline-reload`. No unlisted product claim was found.

## Copy audit

Words are whitespace-delimited; headings, controls, labels, captions, and footer copy are included so button and heading rules are checked too. No landing or README unit exceeds 22 words. No banned marketing adjective, jargon, inconsistent core term, mood slogan, or non-result-naming button was found. The only navigation-copy issue is F-4-1.

### Landing page

| Copy unit | Words | Review result |
| --- | ---: | --- |
| Skip to your service timeline | 5 | — |
| Bike Service Timeline | 3 | — |
| Bike overview | 2 | F-4-1 (duplicated home destination) |
| All history | 2 | — |
| Back up and export | 4 | — |
| Add a bike | 3 | — |
| Private service history for all your bikes | 7 | `local-records` |
| Track service across all your bikes | 6 | `multi-bike-history` |
| For people who maintain several bikes and need one history plus a clear view of what is due next. | 18 | — |
| Try it with sample data | 5 | — |
| Add your first bike | 4 | — |
| The sample opens three bike histories. | 6 | `sample-content-and-onboarding` |
| Adding a bike starts a blank record. | 7 | `sample-content-and-onboarding` |
| Stored in this browser | 4 | `local-records` |
| Works offline after the first visit | 6 | `offline-reload` |
| Export JSON or CSV | 4 | `json-export`; `csv-export` |
| Service history for road, cargo, and mountain bikes. | 8 | `sample-content-and-onboarding` |
| See the service view before adding records | 7 | — |
| Sample road, cargo, and mountain bikes show due reminders and service history. | 12 | `sample-content-and-onboarding`; `date-distance-reminders` |
| How it works | 3 | — |
| Add bikes | 2 | — |
| Keep odometers and notes together. | 5 | `sample-content-and-onboarding` |
| Log service | 2 | — |
| Record work, cost, and repair shop details. | 7 | `sample-content-and-onboarding` |
| Check what is due | 4 | — |
| Use your own date and distance reminders. | 7 | `date-distance-reminders` |
| Privacy and limits | 3 | — |
| Records stay in this browser unless you export them. | 9 | `local-records` |
| Reminders are personal planning aids, not safety advice. | 9 | necessary limitation |
| Your records stay portable | 4 | `json-export` |
| Download a complete backup before clearing browser data or changing devices. | 11 | `json-export` |
| Open backup and export | 4 | — |
| Service history for people who maintain more than one bike. | 10 | — |
| Privacy | 1 | F-4-1 (footer-only route) |
| Terms | 1 | — |
| Export backup | 2 | `json-export` |
| Built by Param Factory · build polish-3 | 7 | — |
| Paper-workshop illustration created with AI assistance for this product. | 9 | asset provenance |

### README

| Copy unit | Words | Review result |
| --- | ---: | --- |
| Bike Service Timeline | 3 | — |
| Track service history and next reminders across every bike you maintain. | 11 | `multi-bike-history`; `date-distance-reminders` |
| It is for people with several bikes who want one record in their browser. | 13 | — |
| Try the isolated sample at https://bike-service-timeline.sociobot.in/?demo=1. | 6 | `demo-isolation` |
| What it does | 3 | — |
| Stores bikes, components, service entries, mileage, notes, costs, and repair shop details in this browser. | 15 | `sample-content-and-onboarding`; `local-records` |
| Uses the date and distance reminders you set. | 8 | `date-distance-reminders` |
| Searches service history across bikes in reverse date order. | 9 | `history-search-order` |
| Exports every service entry as CSV and downloads a complete JSON backup. | 12 | `csv-export`; `json-export` |
| Opens a printable service history. | 5 | `print-history` |
| Works offline after the first visit. | 6 | `offline-reload` |
| The demo and real records use separate browser databases. | 9 | `demo-isolation` |
| Starting for real deletes demo changes. | 6 | `demo-isolation` |
| During the tested demo flow, records are not sent to another origin. | 12 | `local-records`; `no-third-party-runtime` |
| Reminders are personal planning aids. | 5 | necessary limitation |
| They are not diagnostics or safety advice. | 7 | necessary limitation |
| Read the privacy notice and terms. | 6 | — |
| Develop | 1 | — |
| Requires Node.js 20 or newer. | 5 | developer prerequisite |
| Test and build | 3 | — |
| Every visitor-facing claim is listed in `.factory/claims.json`. | 7 | registry checked |
| Run each listed command from a clean clone. | 8 | developer instruction |
| Playwright 1.58.2 is pinned and uses the Chromium build from `PLAYWRIGHT_BROWSERS_PATH`. | 11 | developer prerequisite |
| Deploy | 1 | — |
| Deploy `dist/` as a static site. | 5 | developer instruction |
| Use `staticwebapp.config.json` for direct links, the designed 404 page, browser safety headers, and asset caching. | 13 | developer instruction |
| Design and license | 3 | — |
| The paper-workshop visual system and original-image provenance are in `.factory/design.md`. | 11 | repository pointer |
| Licensed under MIT. | 3 | — |

Terminology remains consistent: **service history** (core record), **service entry** (recorded job), **service work** (activity), **this browser** (storage), **repair shop** (provider), and **backup** / **CSV** (exports).

## Structure, accessibility, and live-origin checks

Fresh live checks confirm the following:

- `/`, `/demo`, `/history`, `/backup`, `/privacy/`, `/terms/`, `/404.html`, `robots.txt`, `sitemap.xml`, and `manifest.webmanifest` return 200; an unknown path returns the designed 404 with HTTP 404.
- App, legal, and 404 routes each have one h1 and main landmark, route-pattern title, description, canonical, favicon and Apple icon, OG/Twitter metadata, and the owned 1200 × 630 share image.
- Direct app URLs, reload, browser back/forward, headings/focus, and canonical route state pass on live production. Crawled internal links return 200; the receipt is an explicit `data:` download and contact links are explicit `mailto:` destinations.
- The live response has CSP, Permissions Policy, nosniff, referrer policy, and the expected manifest MIME type. Fresh phone and desktop contexts produced no console errors.
- The 42.02 KB raw / 13.43 KB gzip initial JavaScript bundle remains below the static-product budget. The paper-cut workshop illustration, ink/paper palette, serif display type, cut-card edges, and timeline rail are visibly distinct from a generic SaaS template and match `.factory/design.md`.

## Earlier-finding recheck

Every prior report and handoff was read. The following entries were rechecked against live behavior and current source/tests. “Fixed” means the original failure no longer reproduced; it does not hide F-4-1.

| Earlier ID | Current result |
| --- | --- |
| V-01 | Fixed: unavailable checkout and paid path are absent; `/pass` is a 404. |
| V-02 | Fixed: nested malformed backup data is rejected before storage. |
| V-03 | Fixed: month-end intervals clamp to the valid target day. |
| V-04 | Fixed: last known mileage is retained independently of date baseline. |
| V-05 | Fixed: tested 390 px app/legal/demo/404 targets meet the contract. |
| V-06 | Fixed: hashed production assets have immutable one-year caching. |
| V-07 | Fixed: production headers and manifest/AVIF MIME mappings are present. |
| F-1-1 | Fixed: job, audience, actions, and outcomes appear before the fold. |
| F-1-2 | Fixed: isolated one-click demo, sample, banner, reset, and real-start discard work. |
| F-1-3 | Fixed: 15 registered claims each have one tagged executable test. |
| F-1-4 | Fixed: unavailable pass and checkout were removed. |
| F-1-5 | Fixed: restore validates nested records and relations before write. |
| F-1-6 | Fixed: calendar-month arithmetic clamps. |
| F-1-7 | Fixed: date and distance baselines are independent. |
| F-1-8 | Fixed: mobile links and controls pass target-size testing. |
| F-1-9 | Fixed: fingerprinted asset caching is immutable. |
| F-1-10 | Fixed: CSP, Permissions Policy, MIME, and safety headers are live. |
| F-1-11 | Fixed: demo, history, and backup use real URLs with focus and history support. |
| F-1-12 | Fixed: unknown URLs produce a styled HTTP 404 and recovery link. |
| F-1-13 | Fixed: landing has sample preview, steps, limits, and backup guidance. |
| F-1-14 | Fixed: canonical/social/Apple metadata and owned share art are complete. |
| F-1-15 | Fixed: app, legal, and 404 retain the same current header/footer identity. |
| F-1-16 | Fixed: initial action is enabled Add a bike. |
| F-1-17 | Fixed: privacy h1 is literal. |
| F-1-18 | Fixed: local-history label is concrete. |
| F-1-19 | Fixed: h1 names the multi-bike job. |
| F-1-20 | Fixed: trail slogan is absent. |
| F-1-21 | Fixed: service-work and repair-shop terminology is consistent. |
| F-1-22 | Fixed: imprecise “little fixes” is absent. |
| F-1-23 | Fixed: due and upcoming reminders are named directly. |
| F-1-24 | Fixed: visitor copy uses “this browser.” |
| F-1-25 | Fixed: JSON and CSV results are named and parsed by tests. |
| F-1-26 | Fixed: image caption names the sample bike types. |
| F-1-27 | Fixed: privacy wording is observable local-record behavior. |
| F-1-28 | Fixed: README starts with user, job, and result. |
| F-1-29 | Fixed: README says the owner sets reminders. |
| F-1-30 | Fixed: README search/order statement is tested. |
| F-1-31 | Fixed: README CSV, JSON, and print claims are tested. |
| F-1-32 | Fixed: README uses bounded offline wording. |
| F-1-33 | Fixed: implementation benefit jargon was removed. |
| F-1-34 | Fixed: unavailable paid offer is absent. |
| F-1-35 | Fixed: user copy avoids storage implementation jargon. |
| F-1-36 | Fixed: request-origin behavior has a dedicated test. |
| F-1-37 | Fixed: obsolete license behavior is absent. |
| F-1-38 | Fixed: deployment README wording is plain and accurate. |
| F-1-39 | Fixed: obsolete precache jargon is absent. |
| F-1-40 | Fixed: billing/provider runtime and copy are absent. |
| F-1-41 | Fixed: art provenance remains documented. |
| F-1-42 | Fixed: Bike overview is a real shared-header link. |
| F-1-43 | Fixed: Back up and export is a descriptive shared-header link. |
| F-1-44 | Fixed: local-record wording maps to a request-log test. |
| F-1-45 | Fixed: core service fields persist through creation and reload. |
| F-1-46 | Fixed: reminder and offline behavior are separate claims. |
| F-1-47 | Fixed: storage wording has request-log coverage. |
| F-1-48 | Fixed: CSV/JSON tests parse complete downloads. |
| F-1-49 | Fixed: unsupported ride-tracking promise is absent. |
| F-1-50 | Fixed: promotional privacy shorthand is absent. |
| F-1-51 | Fixed: CRUD/reload/export/delete remain same-origin. |
| F-1-52 | Fixed: README promises map to registered claims. |
| F-1-53 | Fixed: sample visibly has history and reminders. |
| F-1-54 | Fixed: three sample bikes retain distinct odometers. |
| F-1-55 | Fixed: reminder edge cases are tested. |
| F-1-56 | Fixed: cross-bike reverse order and search are tested. |
| F-1-57 | Fixed: work, notes, cost, shop, mileage, and attachments persist. |
| F-1-58 | Fixed: backup, CSV, print, restore, and malformed input have coverage. |
| F-1-59 | Fixed: manifest, service worker, persistence, and offline reload are covered. |
| F-1-60 | Fixed: mobile overflow/target/Axe checks pass. |
| F-1-61 | Fixed: paid gates and attachment restriction are absent. |
| F-1-62 | Fixed: IndexedDB CRUD runs under same-origin request logging. |
| F-1-63 | Fixed: shipped routes use only same-origin runtime requests/scripts. |
| F-1-64 | Fixed: Privacy explains no server copy and backup need. |
| F-1-65 | Fixed: license-frequency behavior was removed. |
| F-1-66 | Fixed: billing endpoints and provider integration were removed. |
| F-2-1 | Fixed: paid offer and broken checkout are absent. |
| F-2-2 | Fixed: demo does not touch real license storage or network path. |
| F-2-3 | Fixed: CSV test reads header, rows, order, and escaping. |
| F-2-4 | Fixed: JSON test parses schema and every nested sample record. |
| F-2-5 | Fixed: sample/onboarding claim covers the named experience. |
| F-2-6 | Fixed: landing offline and export occurrences are registered. |
| F-2-7 | Fixed: paid-tier promises are absent. |
| F-2-8 | Fixed: README search, print, local, and origin claims have tests. |
| F-2-9 | Fixed: perpetual-offline and pass copy are absent. |
| F-2-10 | Fixed: image caption is concrete. |
| F-2-11 | Fixed: app and backup headings name their sections. |
| F-2-12 | Fixed: 404 metadata is complete. |
| F-2-13 | Fixed: 404 navigation/footer and build ID match the product shell. |
| F-3-1 | Fixed: multi-bike core promise is registered and browser-tested. |
| F-3-2 | Fixed: 404 uses literal page-not-found wording. |

## What would make this perfect

Resolve F-4-1, then repeat this full cold-read, copy, demo, claims, privacy, route, metadata, accessibility, link, and history review from fresh mobile and desktop contexts. With the header gap closed and all checks still passing, the product can reach PASS.
