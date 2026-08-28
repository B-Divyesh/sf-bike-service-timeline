# Adversarial first-read review 1 — Bike Service Timeline

- Live URL: <https://bike-service-timeline.sociobot.in>
- Repository candidate: `5573fa0b86f23f401280322c6b7cbf8a6e2aca05`
- Reviewed: 2026-08-28 UTC
- Viewports: fresh Chromium contexts at 390 × 844 and 1440 × 1000
- Verdict: **FAIL**

The product has blocking first-read, demo, claims, purchase, data-integrity,
calculation, routing, and deployment defects. The standard for PASS is zero
findings; this review has findings.

## 1. Cold first screen

No scrolling or interaction was used for this read.

| Question | Mobile answer | Desktop answer | Result |
| --- | --- | --- | --- |
| What does this do? | I can infer that it records bike components and repairs, then shows what may need service. | Same. | Partly clear only after reading the supporting copy. |
| For whom? | Not stated. “Every bike” does not identify owners of several bikes. | Not stated. | **BLOCKING** |
| What should I click first? | “Add your first bike.” A competing disabled “Log service” action is more prominent in the header. | “Add your first bike.” The disabled header action still competes. | Action is inferable, but the hierarchy is avoidably ambiguous. |

The exact text that fails is: **“Every bike has a story. Keep the whole
trail.”** It is a metaphor, not the job or audience. **“A service record you
own”** also does not say that the product is for a person maintaining several
bikes.

### F-1-1 — BLOCKING — first screen does not identify its audience

- **Quote/location:** landing h1 and eyebrow: “Every bike has a story. Keep the
  whole trail.” / “A service record you own”.
- **Why this fails:** a first-time visitor cannot answer “for whom?” from either
  viewport. The h1 describes neither the task nor the multi-bike situation from
  the brief.
- **Concrete fix:** use `Track service across all your bikes` as the h1 and
  `For people who maintain several bikes and need one history plus a clear view
  of what is due next.` as the supporting sentence. Put `Try it with sample
  data` beside `Add your first bike`, with a short statement of what each opens.

### F-1-2 — BLOCKING — no one-click, isolated sample-data demo

- **Quote/location:** the first screen offers only “Add your first bike” and
  “Restore a backup”. `/demo` and `/?demo=1` both show the same empty app.
- **Why this fails:** there is no one-click way to see the product in use. There
  is no realistic sample, no “Demo — sample data, nothing is saved” banner, no
  Reset, and no Start for real action.
- **Sandbox evidence:** both candidate demo URLs open the real
  `bike-service-timeline` IndexedDB. A bike added at `/?demo=1` was visible on
  `/` in the same fresh browser context. `src/db.ts` has one fixed database name
  and no demo namespace.
- **Concrete fix:** add a visible `Try it with sample data` action that opens
  `/demo`, seed at least three distinct bikes with realistic components,
  services, due states, costs, and attachments, and use a separate `demo:`
  storage namespace. Add a persistent banner with `Reset demo` and `Start for
  real`; leaving demo must discard demo changes. Document it in
  `.factory/demo.md` and test that demo writes never appear in the real store.

### F-1-3 — BLOCKING — claims registry and claim tests are absent

- **Location:** `.factory/claims.json` does not exist; `rg '@claim:'` finds no
  tagged tests.
- **Why this fails:** none of the landing or README promises can be verified by
  the required commands from a clean sandbox. Existing general tests are not a
  substitute for one observable test per registered claim.
- **Concrete fix:** add `.factory/claims.json`, give every retained product
  claim exactly one `@claim:<id>` test, run each listed command from `/demo`, and
  remove any claim that cannot be tested. The unlisted sentences and required
  tests are enumerated below.

## 2. Earlier finding recheck

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files.
The earlier `.factory/handoff.md` and `.factory/verification.md` contain seven
findings. Each was checked again on the live site and in the current code. All
seven remain unfixed, so each is blocking again and retains its prior ID in the
cross-reference.

| Review ID | Earlier ID | Live/code confirmation | Why this fails | Status and concrete fix |
| --- | --- | --- | --- | --- |
| F-1-4 | V-01 | `Buy Workshop Pass` still targets `https://api.sociobot.in/api/v1/products/bike-service-timeline/checkout`; it returned HTTP 404 with `{"error":"enabled factory product","status":404}`. | The advertised US$19 purchase and paid attachment path cannot be completed. | **BLOCKING.** Enable the product, then test purchase, return-token removal, entitlement, restore, and refund/revocation on the live deployment. |
| F-1-5 | V-02 | A branded v1 backup with `installedDate: "not-a-date"` was accepted and persisted. Reload then showed “The workshop would not open / Invalid time value”. `parseBackup` still checks only the envelope and array types. | A restore can permanently replace a usable app with a fatal screen and no in-app recovery. | **BLOCKING.** Validate every nested field and relation before opening a write transaction; reject the entire file with a useful record-level error and add a regression test. |
| F-1-6 | V-03 | A component based at 2026-01-31 with a one-month interval still rendered “was due Mar 3, 2026”. `addMonths` still uses overflowing `Date.setMonth`. | The next-service date is later than the interval the owner entered. | **BLOCKING.** Clamp to the final valid day of the target month (2026-02-28 here) and test leap/non-leap month ends. |
| F-1-7 | V-04 | A service at 1,800 km followed by a later service with no odometer still rendered the next trigger at 2,000 km. `computeDueStates` takes mileage only from the latest dated service, then falls back to installation mileage. | The view rewinds known service mileage and shows a false next-service trigger. | **BLOCKING.** Select date and mileage baselines independently; retain the latest known service mileage, producing 2,800 km in this case. Add a regression test. |
| F-1-8 | V-05 | At 390 px, live targets still measured: brand 126 × 42, merchant `terms` 38 × 15, `privacy notice` 92 × 15, footer Privacy 51 × 21, and footer Terms 41 × 21. Legal-page links measured as little as 19–26 px high. | The phone UI makes required legal and navigation links difficult to tap and violates its explicit target-size contract. | **BLOCKING.** Give every interactive target a 44 × 44 CSS-pixel hit area, including inline legal and footer links, and add a mobile bounding-box test. |
| F-1-9 | V-06 | Live hashed JS/CSS and AVIF still return `Cache-Control: public, must-revalidate, max-age=30`. | Content-addressed assets are needlessly revalidated, weakening the promised fast offline-oriented delivery. | **BLOCKING.** Serve fingerprinted assets with a long-lived immutable policy while keeping HTML and the service worker revalidatable; add response-header checks. |
| F-1-10 | V-07 | Root responses still omit CSP and Permissions Policy. Live manifest and AVIF still return `application/octet-stream`. No `staticwebapp.config.json` exists. | The deployment lacks required browser hardening and serves install/image assets under incorrect types. | **BLOCKING.** Add correct response headers and MIME mappings in deployment config; test them on the deployed origin. |

## 3. Routing, structure, and identity

### F-1-11 — BLOCKING — app views are not routes and browser navigation fails

- **Location:** header controls “Bench”, “All history”, “Backup”, and “Workshop
  Pass”; `src/main.ts:93-100`.
- **Evidence:** selecting All history left the URL and title at `/` and “Bike
  Service Timeline — every bike, one service history”. Focus fell to `body`
  because the clicked button was replaced. Pressing Back left the app for
  `about:blank`; it did not restore the prior app view. `popstate` only rerenders
  the in-memory `view` and no `pushState` or route parser exists. The sitemap
  lists only `/`, `/privacy/`, and `/terms/`; it has no demo or app destinations.
- **Why this fails:** `/history`, `/backup`, and `/pass` cannot be deep-linked or
  reloaded, the back button cannot restore place, route titles do not change,
  and focus/announcement requirements are unmet.
- **Concrete fix:** implement real URLs with links and History API state, per-
  route titles, reload/deep-link handling, scroll restoration, focus on the new
  h1, and a polite route announcement. Test direct load, reload, back, forward,
  title, scroll, and focus for every route.

### F-1-12 — BLOCKING — no designed 404

- **Location/evidence:** `/404.html` and `/does-not-exist` return the ordinary
  empty app with HTTP 200 and the home title. No 404 source or deployment
  response override exists.
- **Why this fails:** a mistyped URL looks valid and gives no way to understand
  or recover from the error.
- **Concrete fix:** add a product-styled 404 page with a clear h1 and home link,
  configure a real 404 response rewrite, and test both response status and UI.

### F-1-13 — MINOR — landing page omits the required information structure

- **Location:** `/` ends after the first-run hero and footer.
- **Why this fails:** there is no product-in-use preview, three-step “How it
  works”, limitations/privacy section, or exact paid-tier explanation on the
  landing page. A cold visitor must start entering data or inspect unlabeled app
  controls to learn the workflow and price.
- **Concrete fix:** after the first screen, show the live sample preview, a
  three-step section (`Add bikes`, `Log service`, `Check what is due`), plain
  limitations/privacy, and the exact US$19 entitlement. Keep the existing app
  available as real routed screens.

### F-1-14 — MINOR — canonical and social metadata are missing

- **Location:** root, Privacy, and Terms heads.
- **Evidence:** the root title is correctly patterned and 55 characters; all
  checked pages have one h1, `lang=en`, a description, theme color, and SVG
  favicon. `Privacy — Bike Service Timeline` and `Terms — Bike Service Timeline`
  also follow the route-title pattern. None has a canonical URL, Open Graph
  fields, Twitter card fields, or an apple-touch icon link. There is no 1200 ×
  630 social image.
- **Concrete fix:** add route-specific canonical, OG, and Twitter metadata, an
  original 1200 × 630 share image, and the existing 180/192 asset as an
  apple-touch icon. Test every route's resolved metadata.

### F-1-15 — MINOR — header and footer are inconsistent across routes

- **Location:** app, `/privacy/`, and `/terms/`.
- **Evidence:** the app has four button-based controls and Privacy/Terms footer
  links; legal pages only show “Return to app”. The Privacy footer has no links;
  the Terms footer links only Privacy. No footer has both “Built by Param
  Factory” in the required wording and a version/build ID. Legal pages have no
  skip link.
- **Concrete fix:** use the same linked wordmark, compact route navigation,
  skip link, product one-liner, Privacy, Terms, factory credit, and build ID on
  every route.

### F-1-16 — MINOR — a disabled primary action competes with onboarding

- **Quote/location:** “Log service” in the mobile and desktop header is styled
  as a primary action but disabled before a bike exists.
- **Why this fails:** it appears before “Add your first bike” and provides no
  reason for being unavailable, weakening the answer to “what do I click?”.
- **Concrete fix:** before the first bike exists, replace it with an enabled
  `Add your first bike` action or remove it. After setup, show `Log service`.

### F-1-17 — MINOR — Privacy h1 uses promotional phrasing

- **Quote/location:** `/privacy/`: “Privacy, without fine print”.
- **Why this fails:** “without fine print” is a slogan rather than the page
  name, and the page necessarily contains detailed terms.
- **Concrete fix:** use `Privacy notice`.

### Structure checks with no finding

- Privacy and Terms return HTTP 200; the other non-checkout links crawled from
  the three pages resolve or are explicit `mailto:` links.
- The paper-workshop palette, generated illustration, typography, card-stock
  shapes, and restrained motion form a distinct product identity and match
  `.factory/design.md`; this is not a generic SaaS template.
- Reduced-motion CSS exists. Fresh live pages produced no console errors.
- The initial JS is 38.47 KB raw / 12.15 KB gzip, within budget.

## 4. Copy audit

Counting method: each space-delimited token is one word; hyphenated/em-dash
forms count as one token. Headings, labels, buttons, list items, captions, and
alt text are included because the review explicitly covers them. No audited
unit exceeds 22 words. Landing average: 4.3 words; README average: 9.1 words.

### Landing page — every copy unit

| # | Exact copy | Words | Flag |
| ---: | --- | ---: | --- |
| 1 | Skip to your service timeline | 5 | — |
| 2 | Bike Service Timeline | 3 | — |
| 3 | Bench | 1 | F-1-42 |
| 4 | All history | 2 | — |
| 5 | Backup | 1 | F-1-43 |
| 6 | Workshop Pass | 2 | — |
| 7 | Log service | 2 | F-1-16 (disabled initially) |
| 8 | A service record you own | 5 | F-1-18; unlisted claim F-1-44 |
| 9 | Every bike has a story. | 5 | F-1-19 |
| 10 | Keep the whole trail. | 4 | F-1-20 |
| 11 | Log components, workshop visits, receipts, and the little fixes between them. | 11 | F-1-21, F-1-22; unlisted claim F-1-45 |
| 12 | See what needs attention next, across every bike—even offline. | 9 | F-1-23; unlisted claim F-1-46 |
| 13 | Add your first bike | 4 | —; result-naming verb |
| 14 | Restore a backup | 3 | —; result-naming verb |
| 15 | Stored on your device | 4 | F-1-24; unlisted claim F-1-47 |
| 16 | Export anytime | 2 | F-1-25; unlisted claim F-1-48 |
| 17 | No ride tracking | 3 | unlisted claim F-1-49 |
| 18 | Layered paper workshop with road, cargo, and mountain bikes connected by blank service tags | 14 | —; useful image alt |
| 19 | One quiet workshop for every bicycle you keep. | 8 | F-1-26 |
| 20 | Bike Service Timeline | 3 | — |
| 21 | Private by default. | 3 | F-1-27; unlisted claim F-1-50 |
| 22 | Your records stay in this browser. | 6 | F-1-24; unlisted claim F-1-51 |
| 23 | Privacy | 1 | — |
| 24 | Terms | 1 | — |
| 25 | Export backup | 2 | —; result-naming verb |
| 26 | Paper-workshop illustration created with AI assistance for this product. | 9 | —; provenance, not a runtime AI feature |

### README — every prose unit

Code-block commands are excluded because they are commands, not prose.

| # | Exact copy | Words | Flag |
| ---: | --- | ---: | --- |
| 1 | Bike Service Timeline | 3 | — |
| 2 | Bike Service Timeline is a private, offline-first ownership record for people who maintain more than one bicycle. | 17 | F-1-28; unlisted claim F-1-52 |
| 3 | It answers two practical questions without opening separate bike profiles: | 10 | unlisted claim F-1-53 |
| 4 | what happened to this component last? | 6 | unlisted claim F-1-53 |
| 5 | what should I look at next? | 6 | unlisted claim F-1-53 |
| 6 | Live product: https://bike-service-timeline.sociobot.in | 3 | — |
| 7 | What it includes | 3 | — |
| 8 | Multiple bikes with current odometer readings | 6 | unlisted claim F-1-54 |
| 9 | Components with owner-configured date and/or distance reminders | 7 | F-1-29; unlisted claim F-1-55 |
| 10 | Chronological, searchable service history across every bike | 7 | F-1-30; unlisted claim F-1-56 |
| 11 | Work type, notes, cost, workshop, mileage, receipt, and photo fields | 10 | unlisted claim F-1-57 |
| 12 | JSON backup/restore, CSV export, and print-ready history | 7 | F-1-31; unlisted claim F-1-58 |
| 13 | IndexedDB persistence, installable PWA manifest, and complete offline app shell | 10 | F-1-32; unlisted claim F-1-59 |
| 14 | Light and dark treatments with a responsive 390 px mobile layout | 11 | F-1-33; unlisted claim F-1-60 |
| 15 | A useful free bench for two bikes; a US$19 one-time Workshop Pass adds unlimited bikes and attachments | 17 | F-1-34; unlisted claim F-1-61 |
| 16 | Intervals are personal reminders, not diagnostics, manufacturer recommendations, or safety certification. | 11 | —; necessary limitation |
| 17 | Privacy and data ownership | 4 | — |
| 18 | Bike, component, and service data stays in IndexedDB in the current browser. | 12 | F-1-35; unlisted claim F-1-62 |
| 19 | There is no account, sync, analytics, advertising, or third-party runtime script. | 11 | F-1-36; unlisted claim F-1-63 |
| 20 | Users should periodically download a JSON backup because the service cannot recover data cleared from a device. | 17 | unlisted claim F-1-64 |
| 21 | License tokens are stored in localStorage and checked against the Sociobot billing API at most once per day. | 18 | F-1-37; unlisted claim F-1-65 |
| 22 | See the product’s privacy notice and terms. | 7 | — |
| 23 | Develop | 1 | — |
| 24 | Requires Node.js 20 or newer. | 5 | —; developer prerequisite |
| 25 | Vite serves the app at the URL printed in the terminal. | 11 | —; developer instruction |
| 26 | Service workers are registered only in production builds so development changes remain immediate. | 13 | —; developer instruction, verified in code |
| 27 | Test and build | 3 | — |
| 28 | Playwright is pinned to 1.58.2. | 5 | —; verified in `package.json` |
| 29 | The end-to-end suite expects its Chromium build to be installed or available through PLAYWRIGHT_BROWSERS_PATH. | 14 | —; developer prerequisite |
| 30 | Deploy | 1 | — |
| 31 | Deploy the generated dist/ directory as a static site. | 9 | — |
| 32 | Configure clean-path requests to serve directory indexes (/privacy/ and /terms/). | 10 | F-1-38 |
| 33 | The generated service worker contains a versioned precache manifest and must be served from the site root. | 17 | F-1-39 |
| 34 | Do not deploy source maps, environment secrets, or assets/src/. | 9 | — |
| 35 | The factory registers the billing product separately. | 7 | — |
| 36 | The app uses only the slug-based Sociobot checkout and verification endpoints; it contains no payment provider credentials or product IDs. | 20 | F-1-40; unlisted claim F-1-66 |
| 37 | Design and provenance | 3 | — |
| 38 | The product-specific paper-cut workshop system, tokens, interaction rules, motion policy, and generated artwork prompt are documented in .factory/design.md. | 18 | —; repository documentation pointer |
| 39 | The original high-resolution source and prompt sidecar live in assets/src/; optimized AVIF, WebP, and JPEG variants ship with the app. | 20 | F-1-41 |
| 40 | License | 1 | — |
| 41 | MIT — see LICENSE. | 4 | — |

### Copy findings and proposed rewrites — MINOR

Each row is a distinct flag.

| ID | Quote/problem | Proposed rewrite |
| --- | --- | --- |
| F-1-18 | “A service record you own” is vague label copy. | Delete it, or use `Private service history for all your bikes`. |
| F-1-19 | “Every bike has a story.” is metaphor, not the job. | Replace the whole h1 with `Track service across all your bikes`. |
| F-1-20 | “Keep the whole trail.” is metaphor and repeats no useful fact. | Delete it as part of the h1 replacement. |
| F-1-21 | “workshop visits” conflicts with service work, history, and entries; “workshop” also names the app metaphor and a provider field. | `Log components, service work, receipts, and repairs.` |
| F-1-22 | “little fixes” is imprecise. | Use `repairs`. |
| F-1-23 | “needs attention” does not name the output. | `See which components are due for service across all your bikes, even offline.` |
| F-1-24 | “device” and “browser” name the same storage differently. | Use `Stored in this browser` everywhere, then explain device loss in Privacy. |
| F-1-25 | “Export anytime” does not name a result or format. | `Export JSON or CSV`. |
| F-1-26 | “One quiet workshop for every bicycle you keep.” is a mood slogan. | Delete the caption, or use `Service history for road, cargo, and mountain bikes.` |
| F-1-27 | “Private by default.” is unspecific promotional shorthand. | `Records stay in this browser unless you export them.` |
| F-1-28 | “offline-first ownership record” is product jargon. | `Bike Service Timeline keeps service records for people who maintain more than one bike, even without internet after the first visit.` |
| F-1-29 | “owner-configured” is avoidable jargon. | `Components with date or distance reminders you set`. |
| F-1-30 | “Chronological” is less direct than the user task. | `Search service history for every bike in date order`. |
| F-1-31 | JSON/CSV lead with file-format jargon in the benefits list. | `Download a complete backup, export a spreadsheet, or print the history`. |
| F-1-32 | “IndexedDB”, “PWA manifest”, and “app shell” are implementation jargon in a user-benefit list. | `Install it on your phone and keep using it offline after the first visit`. |
| F-1-33 | “treatments” and “responsive 390 px mobile layout” describe implementation, not the usable result. | `Works on phones and supports light and dark themes`. |
| F-1-34 | “useful free bench” is an adjective plus workshop metaphor. | `Free: two bikes. US$19 once: unlimited bikes and attachments.` |
| F-1-35 | “IndexedDB” is unnecessary in the user-facing privacy summary. | `Bike and service data stays in this browser.` |
| F-1-36 | “third-party runtime script” is technical jargon. | `There is no account, sync, analytics, advertising, or third-party script.` |
| F-1-37 | “localStorage” and “billing API” obscure the privacy consequence. | `This browser stores your license token and sends it to Sociobot at most once a day to check it.` |
| F-1-38 | “clean-path requests” and “directory indexes” are needlessly indirect. | `Configure the host so /privacy/ and /terms/ serve their index.html files.` |
| F-1-39 | “versioned precache manifest” is unnecessary deployment jargon. | `Serve sw.js from the site root; it caches the versioned app files.` |
| F-1-40 | “slug-based … endpoints” is unnecessary. | `The app uses only Sociobot checkout and license verification. It contains no payment-provider credentials or product IDs.` |
| F-1-41 | “prompt sidecar” is unexplained jargon. | `The source image and its prompt metadata are in assets/src/. The app ships AVIF, WebP, and JPEG versions.` |
| F-1-42 | The button label “Bench” does not name a result out of context and is not a link. | Make it a link named `Bike overview`. |
| F-1-43 | The button label “Backup” is a noun and does not name the full destination. | Make it a link named `Back up and export`. |

### Terminology table

| Concept | Current competing terms | Use consistently |
| --- | --- | --- |
| The core record | service record, ownership record, service history, timeline, trail, paper trail | `service history` |
| A recorded job | workshop visit, little fix, service work, service entry, record | `service entry` (screen object) / `service work` (activity) |
| Storage location | device, current browser, local-first, IndexedDB | `this browser` in user copy; `IndexedDB` only in developer detail |
| Repair business | workshop; also used as the app/brand metaphor | `repair shop` for the provider field; reserve workshop imagery for visuals |
| Portable files | backup, JSON backup, CSV, spreadsheet export | `backup` for complete JSON; `spreadsheet export` for CSV |

## 5. Unlisted claim findings — MINOR

Because `.factory/claims.json` is absent, every product promise below is an
unlisted claim. Each row is a finding and names the minimum observable test.
Equivalent repeated wording may share one claim entry only when the entry's
`where` lists every occurrence.

| ID | Exact claim/location | Concrete fix/test |
| --- | --- | --- |
| F-1-44 | Landing: “A service record you own” | Add `data-ownership`: in demo, record every request and storage write; assert only the isolated local demo store is used. Otherwise delete the claim. |
| F-1-45 | Landing: “Log components, workshop visits, receipts, and the little fixes between them.” | Add `service-fields`: create and reload a sample component/service/receipt and assert every saved value renders. Disclose the paid attachment limit in the sentence. |
| F-1-46 | Landing: “See what needs attention next, across every bike—even offline.” | Split into `due-across-bikes` and `offline-reload`; assert due calculations for several bikes and an offline reload from `/demo`. |
| F-1-47 | Landing: “Stored on your device” | Add `local-storage-only`: capture the full demo flow request log and assert no record payload leaves the origin. |
| F-1-48 | Landing: “Export anytime” | Add JSON and CSV export claims; assert filenames, schemas, all sample rows, escaping, and offline export. |
| F-1-49 | Landing: “No ride tracking” | Add `no-ride-tracking`: inspect permissions, requests, and stored fields during the demo; assert no location/ride collection. |
| F-1-50 | Landing: “Private by default.” | Replace with an exact testable sentence, then cover it with the local-storage/request-log claim. |
| F-1-51 | Landing: “Your records stay in this browser.” | Add `records-stay-local`: create, edit, export, and delete demo records while asserting no record-bearing external request. |
| F-1-52 | README: “private, offline-first ownership record for people who maintain more than one bicycle.” | Register local privacy, offline reload/write, and multiple-bike claims; test each observable result in `/demo`. |
| F-1-53 | README: “It answers two practical questions … what happened … last? … what should I look at next?” | Add `last-service-and-next`: seed multiple component services and assert the latest event and next due state are correct. |
| F-1-54 | README: “Multiple bikes with current odometer readings” | Add `multiple-bikes`: seed/edit distinct odometers and assert each survives reload. |
| F-1-55 | README: “Components with owner-configured date and/or distance reminders” | Add `date-distance-reminders` with date-only, distance-only, either-trigger, month-end, and missing-mileage cases. |
| F-1-56 | README: “Chronological, searchable service history across every bike” | Add `history-search-order`: assert global ordering and matching/nonmatching filters across bikes. |
| F-1-57 | README: “Work type, notes, cost, workshop, mileage, receipt, and photo fields” | Add `service-fields` and assert each field persists and exports; include free/paid behavior for files. |
| F-1-58 | README: “JSON backup/restore, CSV export, and print-ready history” | Add separate backup round-trip, CSV contents, and print-media claims. Validate malformed nested backups as part of restore. |
| F-1-59 | README: “IndexedDB persistence, installable PWA manifest, and complete offline app shell” | Add persistence, installability, and offline navigation/write/reload claim tests. Avoid “complete” unless all routes are cached and asserted. |
| F-1-60 | README: “Light and dark treatments with a responsive 390 px mobile layout” | Add theme and 390 px layout claims; assert both themes, no overflow, no obscured content, and all 44 px targets. |
| F-1-61 | README: “free … two bikes; … US$19 … unlimited bikes and attachments” | Add `free-paid-boundary` and live checkout claims; assert the third-bike boundary, exact price, successful purchase/restore, attachments, and revocation. |
| F-1-62 | README: “data stays in IndexedDB in the current browser” | Add `indexeddb-local-data`: inspect the database plus full request log during CRUD/export. |
| F-1-63 | README: “no account, sync, analytics, advertising, or third-party runtime script” | Add `no-tracking-runtime`: capture all requests and loaded scripts through the full demo; explicitly allow only documented license verification after user action. |
| F-1-64 | README: “the service cannot recover data cleared from a device” | Rewrite as the precise architecture limitation (`There is no account or server copy to restore`) and cover the no-sync/no-upload behavior; do not claim an unknowable universal. |
| F-1-65 | README: “License tokens are stored in localStorage and checked … at most once per day.” | Add `license-check-frequency`: control time, reload repeatedly, inspect localStorage and requests, then assert one request per 24 hours unless the user explicitly retries. |
| F-1-66 | README: “uses only … Sociobot checkout and verification … no payment provider credentials or product IDs.” | Add a static/runtime secret and origin allow-list check; scan built files and assert billing requests use only the documented Sociobot origin. |

Developer prerequisites, build-tool versions, commands, and repository file
pointers were checked directly and are not treated as visitor-facing product
claims.

## 6. Demo, privacy, offline, and accessibility evidence

- `/demo`: HTTP 200 but ordinary empty app; title remains the home title.
- `/?demo=1`: ordinary empty app; no banner, Reset, Start for real, or sample.
- Storage: both create/open `bike-service-timeline`; a record entered under the
  query URL appeared on the real root URL.
- Network: the cold root and attempted demo flow requested only the product
  origin. No analytics, CDN, remote font, or runtime AI request appeared.
- Offline: after an online first load and service-worker control, a fresh live
  root reload still showed `<main>` while the browser context was offline.
- Axe: the tested live mobile app state had zero serious/critical WCAG A/AA
  violations. This does not cover the separate 44 px target failure.
- No raw Azure/OpenAI/Sociobot model key or model endpoint was found in source.

Privacy and offline behavior are positive observations, but they are not valid
claim verification because there is no claims registry and no isolated demo.

## 7. Clean-checkout test results

Tests ran in detached clean worktree `/tmp/bst-review-clean` at the reviewed
commit after `npm ci`.

| Command/check | Result |
| --- | --- |
| Read `.factory/claims.json` | **FAIL: file missing** |
| Find exactly one `@claim:<id>` test per listed claim | **FAIL: zero tags** |
| Run every listed claim command | **UNTESTABLE: zero listed commands** |
| `npm test` | PASS: 4/4 Vitest tests |
| `npm run build` | PASS: TypeScript + Vite + service worker; `dist/` produced |
| `npm run test:e2e` | PASS: 6 passed, 2 viewport skips |
| `npx tsc --noEmit` | PASS |

The existing suite does not test the sample demo, claim registry, checkout,
nested import validation, month-end clamping, missing-mileage baseline, routed
navigation, 404, route metadata, target sizes, or deployment headers/MIME.

## 8. Missed leverage

No additional AI feature is warranted by the brief. Logging known maintenance
facts, calculating user-set intervals, and exporting records are deterministic
tasks. Runtime model use would add cost and weaken the offline/local-first
contract. The illustration disclosure is provenance, not a decorative runtime
AI feature. JSON restore plus JSON/CSV export and print address the brief's
portable-record requirement; sync is explicitly outside the local-first
smallest useful product. No separate missed-leverage finding is raised.

## What would make this perfect

Resolve every finding above, deploy the repaired build, and rerun this entire
checklist from fresh mobile and desktop contexts. Perfect means: the first
screen states the job and audience; a one-click realistic demo is isolated and
resettable; every retained claim is registered and passes; checkout and all
seven prior defects are fixed; every app screen has a real route, title, focus
transition, and back-button behavior; 404/metadata/site shell are complete;
every copy flag is gone; and the rerun produces zero findings and zero untested
claims. There is no PASS-adjacent exception while any item remains.
