# Adversarial first-read review 2 — Bike Service Timeline

- Reviewed: 2026-08-29 UTC
- Live URL: <https://bike-service-timeline.sociobot.in>
- Repository commit reviewed: `47b5422db8de1c55d3429e4a053ea105cac1296b`
- Contexts: new Chromium contexts at 390 × 844 and 1440 × 1000; clean local clone for test commands
- Verdict: **FAIL**

This is not a diff-only review. It repeats the cold read, demo, claim, history,
routing, copy, privacy, and live-origin checks.

## Cold first screen

Before scrolling, both phone and desktop answer the three required questions:

| Question | Answer from the first screen |
| --- | --- |
| What does it do? | Tracks service across all of a person's bikes and shows what is due next. |
| For whom? | People who maintain several bikes. |
| What should I click first? | **Try it with sample data** to open three local histories; **Add your first bike** is the real-data alternative. |

The h1, audience sentence, sample action, and factual lines are legible at 390 px
without scrolling. No first-read blocking finding is raised for the landing hero.
The header's green **Add a bike** control is a competing real-data action, but the
body action names both choices and explains their result.

## Findings

### F-2-1 (reopens F-1-4) — BLOCKING — a visitor cannot buy the advertised pass

- **Quote/location:** `/pass`: “US$19 one-time purchase” and **Buy Workshop Pass**.
- **Evidence:** `GET https://api.sociobot.in/api/v1/products/bike-service-timeline/checkout`
  returned HTTP 404 on 2026-08-29 with `{"error":"enabled factory product","status":404}`.
  The source link in `src/license.ts` targets that exact URL.
- **Why this fails:** the product advertises paid unlimited bikes and attachments,
  but no first-time visitor can complete the purchase. This was the unresolved
  external blocker in the prior handoff and remains unfixed.
- **Concrete fix:** enable/register the production product at Sociobot, complete a
  live purchase and return-token test, then add an observable paid-boundary and
  purchase/restore claim test. Until then remove the purchase offer or clearly
  disable it with an honest availability message.

### F-2-2 (reopens F-1-2) — BLOCKING — demo mode reads and writes real license storage

- **Quote/location:** demo banner: “Demo — sample data, nothing is saved”.
- **Evidence:** in a fresh browser context, I set the real-store key
  `sb_license:bike-service-timeline` before opening `/demo`. While the banner was
  visible, `src/license.ts` read that key, requested
  `https://api.sociobot.in/api/v1/products/bike-service-timeline/verify?...`, and
  wrote `sb_license_verdict:bike-service-timeline` in ordinary `localStorage`.
  `src/main.ts` initializes and verifies the license unconditionally in demo mode.
- **Why this fails:** the demo promise is categorical. A demo must not read or
  write real storage or contact the license service because a visitor happened to
  have a real license. The current test only covers a fresh context with no token,
  so it misses this path.
- **Concrete fix:** use a demo-prefixed license namespace and a canned demo
  entitlement, or do not initialize/verify licenses in demo mode. Add a claim
  test that seeds real license keys, opens `/demo`, and asserts they are neither
  read nor changed and no `api.sociobot.in` request occurs.

### F-2-3 — BLOCKING — the CSV claim is not actually tested

- **Quote/location:** claims registry: “Exports service history as CSV.”
- **Evidence:** `@claim:csv-export` only asserts
  `file.suggestedFilename() === 'bike-service-history.csv'` twice. It does not
  read the download, assert a header, or assert one row for each shipped service.
  This contradicts its own `claims.json` sandbox instruction.
- **Why this fails:** a named download can be empty, malformed, or omit history
  while this test passes. The visitor-facing export claim is therefore untested.
- **Concrete fix:** read the downloaded CSV in the test, assert the exact header,
  all demo service rows, expected chronological ordering, and CSV escaping.

### F-2-4 — BLOCKING — the complete-backup claim is not actually tested

- **Quote/location:** claims registry: “Downloads a complete JSON backup.”
- **Evidence:** `@claim:backup-export` only checks the suggested filename twice.
  It never parses the JSON or checks sample bikes, components, services, or the
  backup schema.
- **Why this fails:** the claim says *complete*, but its test cannot distinguish a
  complete backup from an empty file.
- **Concrete fix:** parse the download and assert the product/schema fields plus
  every demo record and its required nested fields. Keep the malformed-restore
  test as a separate validation check.

### F-2-5 — MINOR — several landing promises have no matching claims entry

- **Quote/location:** landing: “The sample opens three local bike histories.”;
  “Adding a bike opens a blank record.”; “Sample road, cargo, and mountain bikes
  show due reminders and service history.”; “Keep odometers and notes together.”
- **Why this fails:** none is listed in `.factory/claims.json`; the isolation test
  only checks that Aster Road appears, not the stated three-bike sample, due
  state, blank form, or retained fields.
- **Concrete fix:** add a `sample-content-and-onboarding` claim that asserts all
  three named sample bikes, their visible due/history state, and that the real
  add-bike form starts blank; or remove the promises.

### F-2-6 — MINOR — offline and export claims are unlisted at their landing locations

- **Quote/location:** landing facts: “Works offline after the first visit” and
  “Export JSON or CSV”.
- **Why this fails:** `offline-reload` lists only “README”, while `csv-export`
  lists only “History and backup screens”; neither `where` field lists these
  landing occurrences. There is also no JSON-export claim for the landing fact.
- **Concrete fix:** list every occurrence in the matching `where` fields and add
  a `json-export` claim that parses the JSON result. Strengthen the existing CSV
  test as required by F-2-3.

### F-2-7 — MINOR — paid-tier promises are unlisted and unverified

- **Quote/location:** landing and README: “Free: two bikes. US$19 once:
  unlimited bikes and receipt or photo attachments.”
- **Why this fails:** there is no `free-paid-boundary` or purchase claim. The
  checkout failure in F-2-1 makes the purchase part demonstrably unavailable.
- **Concrete fix:** after enabling billing, add a sandboxed entitlement fixture
  test for the two-bike boundary, unlimited bikes, attachment gate, exact price,
  purchase return, and license restoration. Do not present the paid promise as
  available until that test and live purchase pass.

### F-2-8 — MINOR — README feature and privacy claims lack tests

- **Quote/location:** README: “Shows one searchable service history across
  bikes.”; “Downloads a JSON backup, CSV spreadsheet export, or printable
  history.”; “There is no account, sync, analytics, advertising, or third-party
  script.”; “The optional license check sends the saved license token to
  Sociobot.”
- **Why this fails:** there are no claim entries for search/order, print output,
  the stated no-account/no-sync/no-tracking behavior, or the license-request
  behavior. `local-records` only observes a fresh demo export with no saved
  license; it does not prove these sentences.
- **Concrete fix:** add separate observable tests for cross-bike search and date
  order, print media output, a whole-demo request/script allow-list, and a
  seeded-token license request. Include each README location in `where`.

### F-2-9 — MINOR — pass page makes an untested perpetual-offline promise

- **Quote/location:** `/pass`, included features: “Offline forever”.
- **Why this fails:** no claim entry or test supports the indefinite guarantee.
  Browser storage and service-worker retention are not a perpetual guarantee.
- **Concrete fix:** replace it with “Use the pass offline after it is verified on
  this device,” then test an offline reload with a recorded valid entitlement.

### F-2-10 (reopens F-1-26) — MINOR — landing image caption is a mood slogan

- **Quote/location:** landing hero caption: “One quiet workshop for every
  bicycle you keep.”
- **Why this fails:** it communicates neither a task nor a result and is exactly
  the previously flagged workshop-metaphor copy. The prior polish record said it
  was replaced, but the current live page and `src/main.ts` still contain it.
- **Concrete fix:** delete it, or use `Service history for road, cargo, and
  mountain bikes.`

### F-2-11 — MINOR — active app headings still use unexplained workshop metaphors

- **Quote/location:** `/demo`: “Your workshop today”, “The rack”, “On the
  bench”, and “Paper trail”; `/backup`: “Portable by design”; `/pass`: “Room for
  the whole workshop”.
- **Why this fails:** these headings do not name their sections when heard alone,
  despite the visually distinctive paper-workshop treatment already doing the
  design work. They slow a cold visitor and screen-reader heading navigation.
- **Concrete fix:** use `Service status`, `Your bikes`, `Next service`, `Recent
  service`, `Backup and export`, and `Unlimited bikes and attachments`.

### F-2-12 (reopens F-1-14) — MINOR — the designed 404 lacks required social/canonical metadata

- **Quote/location:** `/404.html` head.
- **Evidence:** it has a title and description, but no canonical link, Apple
  touch icon, Open Graph fields, Twitter card, or product social image. Root,
  Privacy, and Terms have these fields.
- **Why this fails:** the 404 is a real route but is not represented consistently
  when shared or indexed; the prior metadata repair did not cover this later
  route.
- **Concrete fix:** add the same product-owned social image and route-specific
  canonical, OG, Twitter, and Apple-touch metadata used on the other routes.

### F-2-13 (reopens F-1-15) — MINOR — the 404 shell is inconsistent and reports a stale build

- **Quote/location:** `/404.html` header/footer.
- **Evidence:** its header has only **Demo** and **Privacy**, while legal and app
  routes have **Demo**, **All history**, and **Back up and export**. Its footer
  says `build 5aae0f4`; the app and legal routes say `build a4a2a1e`.
- **Why this fails:** a route reached from a bad link loses the shared navigation
  pattern and exposes conflicting deployment identity.
- **Concrete fix:** use one shared header/footer source or synchronized template
  with the same allowed navigation and one build id on every route.

## Copy audit

Method: visible landing copy was taken from the fresh live root after load;
README prose and bullets were read from the repository. Space-delimited tokens
are words; code commands are excluded. No landing or README unit exceeds 22
words. Flags below identify the copy issues already raised as F-2-5 through
F-2-11; `—` means no plain-words issue beyond any separate claim finding.

### Landing page

| Copy unit | Words | Flag |
| --- | ---: | --- |
| Skip to your service timeline | 5 | — |
| Bike Service Timeline | 3 | — |
| Bike overview | 2 | — |
| All history | 2 | — |
| Back up and export | 4 | — |
| Workshop Pass | 2 | F-2-7: paid destination is unavailable |
| Add a bike | 4 | — |
| Private service history for all your bikes | 7 | — |
| Track service across all your bikes | 6 | — |
| For people who maintain several bikes and need one history plus a clear view of what is due next. | 18 | — |
| Try it with sample data | 5 | — |
| Add your first bike | 4 | — |
| The sample opens three local bike histories. | 7 | F-2-5 |
| Adding a bike opens a blank record. | 6 | F-2-5 |
| Stored in this browser | 4 | — |
| Works offline after the first visit | 6 | F-2-6 |
| Export JSON or CSV | 4 | F-2-6 |
| Layered paper workshop with road, cargo, and mountain bikes connected by blank service tags | 14 | — (useful image alt) |
| One quiet workshop for every bicycle you keep. | 8 | F-2-10 |
| See the service view before adding records | 7 | — |
| Sample road, cargo, and mountain bikes show due reminders and service history. | 12 | F-2-5 |
| How it works | 3 | — |
| Add bikes | 2 | — |
| Keep odometers and notes together. | 5 | F-2-5 |
| Log service | 2 | — |
| Record work, cost, and repair shop details. | 7 | — |
| Check what is due | 5 | — |
| Use your own date and distance reminders. | 7 | — |
| Privacy and limits | 3 | — |
| Records stay in this browser unless you export them. | 9 | — |
| Reminders are personal planning aids, not safety advice. | 9 | — |
| Workshop Pass | 2 | F-2-7 |
| Free: two bikes. US$19 once: unlimited bikes and receipt or photo attachments. | 11 | F-2-7 |
| See Workshop Pass details | 4 | F-2-7 |
| Service history for people who maintain more than one bike. | 10 | — |
| Privacy | 1 | — |
| Terms | 1 | — |
| Export backup | 2 | — |
| Built by Param Factory · build a4a2a1e | 6 | — |
| Paper-workshop illustration created with AI assistance for this product. | 9 | — (provenance, not runtime AI) |

### README

| Copy unit | Words | Flag |
| --- | ---: | --- |
| Bike Service Timeline | 3 | — |
| Track service history and next reminders across every bike you maintain. | 11 | — |
| It is for people with several bikes who want one local record. | 12 | — |
| Try the isolated sample at https://bike-service-timeline.sociobot.in/demo. | 5 | — |
| What it does | 3 | — |
| Keeps bikes, components, service work, odometers, costs, and repair shop notes. | 11 | — |
| Uses date and distance reminders that you set. | 8 | — |
| Shows one searchable service history across bikes. | 7 | F-2-8 |
| Downloads a JSON backup, CSV spreadsheet export, or printable history. | 10 | F-2-8 |
| Stores records in this browser. | 5 | — |
| Export backups before clearing browser data. | 6 | — |
| Free: two bikes. US$19 once: unlimited bikes and receipt or photo attachments. | 11 | F-2-7 |
| Records remain local unless you export them. | 6 | — |
| There is no account, sync, analytics, advertising, or third-party script. | 10 | F-2-8; rewrite `No account, sync, analytics, advertising, or third-party code runs.` |
| The optional license check sends the saved license token to Sociobot. | 11 | F-2-8 |
| Reminders are personal planning aids. | 5 | — |
| They are not diagnostics or safety advice. | 7 | — |
| Read the privacy notice and terms. | 6 | — |
| Develop | 1 | — |
| Requires Node.js 20 or newer. | 5 | — |
| Test and build | 3 | — |
| Each visitor-facing claim is listed in .factory/claims.json. | 7 | F-2-3/F-2-4: listed tests do not prove all claims |
| Run every listed command from a clean clone. | 8 | — |
| Playwright 1.58.2 is pinned; its Chromium browser must be available through PLAYWRIGHT_BROWSERS_PATH. | 11 | — (developer prerequisite) |
| Deploy | 1 | — |
| Deploy dist/ as a static site. | 5 | — |
| staticwebapp.config.json supplies the SPA fallback, designed 404 response, CSP, MIME types, and immutable cache headers. | 12 | Jargon; rewrite `Use staticwebapp.config.json to enable direct links, the 404 page, and browser safety headers.` |
| The app uses Sociobot hosted checkout and license verification only; it contains no payment-provider credentials. | 13 | F-2-1/F-2-8; checkout currently fails |
| Design and license | 3 | — |
| The paper-workshop visual system and original-image provenance are in .factory/design.md. | 10 | — |
| Licensed under MIT. | 3 | — |

Terminology is otherwise consistent: use **service history** for the core
record, **service work** for the activity, **this browser** for storage,
**repair shop** for a provider, and **backup** for the complete JSON file.

## Demo, privacy, and offline checks

- Clicking the first-screen sample action opened `/demo` directly. The first
  product screen showed Maple Cargo, Aster Road, and Pine Trail, due-state UI,
  service history, the persistent demo banner, **Reset demo**, and **Start for
  real**.
- Reset restored the three shipped bikes. Returning to `/` in the same fresh
  context showed the real empty state, so sample bike records themselves are
  separate IndexedDB data.
- Fresh-token demo request logging had no external requests and no console
  errors. The seeded-license reproduction in F-2-2 is the exception and makes
  the demo privacy claim fail.
- The listed offline reload test passed from a fresh demo context after service
  worker control. This confirms the narrow offline claim; it does not justify
  “Offline forever”.

## Claims and local quality gates

`.factory/claims.json` has ten entries. I ran each exact listed command from
the clean candidate checkout; all exited successfully. `npm test`, `npm run
build`, and `npm run test:e2e` also passed in a separate fresh clone
(`/tmp/bike-service-review-2.YrVpnr`): 6 unit tests; 22 Playwright passed and 2
intentional viewport-independent skips; `dist/` was produced. The built initial
JS is 45.91 KB raw / 14.46 KB gzip.

Passing exit statuses do not clear F-2-3 and F-2-4: their assertions do not
observe the promised file contents. The unlisted claims in F-2-5 through
F-2-9 also remain untested.

## Earlier-review recheck

| Earlier finding | Current result |
| --- | --- |
| F-1-1 | Fixed: job, audience, and action are clear on the first screen. |
| F-1-2 | **Reopened as F-2-2:** sample records isolate, but license storage/network does not. |
| F-1-3 | Partly fixed: registry and commands exist, but F-2-3 through F-2-9 show incomplete claim coverage/proof. |
| F-1-4 / V-01 | **Reopened as F-2-1:** checkout remains HTTP 404. |
| F-1-5 / V-02 | Fixed in current source and the tagged validation unit test passes. |
| F-1-6 / V-03 | Fixed in current source and the tagged date/distance test passes. |
| F-1-7 / V-04 | Fixed in current source and the tagged date/distance test passes. |
| F-1-8 / V-05 | Fixed for the selected navigation and legal links; the mobile tagged test passes. |
| F-1-9 / V-06 | Fixed live: hashed JS and AVIF return `Cache-Control: public, max-age=31536000, immutable`. |
| F-1-10 / V-07 | Fixed live: CSP, Permissions Policy, `nosniff`, Referrer Policy, manifest MIME, and AVIF MIME are present. |
| F-1-11 | Fixed: direct demo/history/backup/pass URLs, titles, back navigation, focus, and announcement logic work. |
| F-1-12 | Fixed: unknown live paths return HTTP 404 with a designed recovery page. |
| F-1-13 | Fixed: landing includes product preview, steps, privacy/limits, and price section. |
| F-1-14 | **Reopened as F-2-12:** root/legal metadata is fixed, but the 404 route remains incomplete. |
| F-1-15 | **Reopened as F-2-13:** app/legal shells match, but 404 navigation and build id do not. |
| F-1-16 | Fixed: the empty-state header action is enabled and names its result. |
| F-1-17 | Fixed: the Privacy h1 is `Privacy notice`. |
| F-1-18–F-1-25, F-1-27–F-1-43 | Fixed or removed in the checked landing/README routes, except the resumed F-1-26 caption. |
| F-1-26 | **Reopened as F-2-10:** the exact slogan remains on the landing hero. |
| F-1-44–F-1-66 | Partly fixed only; current unlisted/under-proven claims are enumerated in F-2-3 through F-2-9. |

## Structure, links, and identity

All listed internal routes returned 200 with one h1 and a main landmark, except
the designed unknown route, which correctly returned 404. The SPA routes have
route-specific titles and use history navigation. Root, Privacy, Terms, demo,
history, backup, and pass were deep-linked successfully. Privacy/Terms links,
robots, sitemap, favicon, canonical/social metadata on the non-404 routes, and
the response security headers were present. No live console errors occurred in
the fresh phone or desktop checks.

The hand-built paper workshop illustration, warm paper palette, typography,
irregular card edges, and rail-like timeline form a distinct product identity;
this is not a generic SaaS template. The visual workshop language is successful
without the unnecessary metaphor headings identified in F-2-10 and F-2-11.

No additional AI feature is warranted by the brief: local service records,
interval calculation, and export are deterministic, and runtime model use would
weaken the offline/local-first job. The existing AI disclosure is asset
provenance, not a decorative product AI feature.

## What would make this perfect

Enable and retest the real Workshop Pass checkout; make demo mode wholly
separate from real license storage and the license network path; make every
claim test inspect the promised observable result; register the remaining
landing, README, paid, privacy, search, and print claims; remove the lingering
metaphor copy; and make the 404 use the same metadata and shell as every other
route. Rerun this whole review in fresh phone and desktop contexts. Only zero
findings and zero untested claims qualifies for PASS.
