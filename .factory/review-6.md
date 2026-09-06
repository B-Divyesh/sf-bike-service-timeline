# Review 6 — Track service across all your bikes

- Reviewed: 2026-09-06 UTC
- Live URL: <https://bike-service-timeline.sociobot.in>
- Implementation candidate: `c974390d5ff60b7d0626b7ca6c58f55e0e79dac3`
- Documentation commit reviewed: `d59c0d1cd6aa17fe246ceb06fa5326707cfb6026`
- Fresh browsers: Chromium at 390 × 844 and 1440 × 1000
- Clean checkout: `/tmp/bike-service-timeline-review6.2ro3fu`
- Verdict: **FAIL**
- Findings: **2**
- Untested claims: **0**

PASS requires zero findings at every severity. All public claims passed their
declared tests, but the live product has one serious dark-mode contrast defect
and one undersized mobile form target.

## First screen before scrolling

No scrolling or interaction was used for this read. Both fresh viewports showed
the same answer within the first screen.

| Question | Answer visible before scrolling |
| --- | --- |
| What is the job? | Track service history across all your bikes and see what is due next. |
| Who is it for? | People who maintain several bikes and need one history. |
| What is the first action? | **Try it with sample data** opens three histories. **Add your first bike** starts a blank real record. |

The job-first h1 is `Track service across all your bikes`. The audience sentence,
both actions, their outcomes, and the three facts about browser storage, offline
use, and export were visible at 390 × 844 and 1440 × 1000.

## Findings

### F-6-1 — HIGH — “Due soon” fails contrast in dark mode

- **Location:** live `/demo`, dark color scheme, `Due soon` status text in the
  Next service list.
- **Evidence:** Axe 4.10.2 reports a serious `color-contrast` violation. The
  foreground is `#825613` on `#2b3a32`, a ratio of **1.87:1** for 12 px bold
  text. WCAG AA requires **4.5:1**.
- **Why this fails:** the status is important service information and is hard to
  read in the documented dark treatment. The accessibility contract requires
  both themes to meet contrast.
- **Cause:** `.due-mark.soon, .status-word.soon` uses the light-mode hard-coded
  brown in dark mode instead of a contrasting dark-mode token.
- **Fix:** set a dark-mode foreground that reaches at least 4.5:1 on the raised
  surface, then run Axe in both light and dark schemes on the populated demo.

### F-6-2 — MEDIUM — restore choices miss the 44 px phone target

- **Location:** live `/backup?demo=1` and `/backup` at 390 px; `Merge with this
  browser` and `Replace this browser` radio choices.
- **Evidence:** each radio is **20 × 20 px**. Its clickable wrapping label is
  **304 × 24 px**. Both are below the required 44 px target height.
- **Why this fails:** restore is a consequential action, and both choices are
  harder to tap than the product's mobile accessibility contract allows.
- **Fix:** give each wrapping label a minimum 44 px height with adequate spacing.
  Extend the mobile target test from header, footer, and demo controls to every
  visible interactive form control.

The declared `mobile-targets` claim is not false: its wording is limited to
navigation and legal links, and those targets pass. F-6-2 is a separate baseline
accessibility defect.

## Sample data and real-data isolation

The first landing action entered the sample in one click. The populated screen
showed Aster Road, Maple Cargo, Pine Trail, distinct odometers, component
reminders, service entries, notes, a repair shop, cost, and a receipt.

The banner `Demo — sample data, nothing is saved` remained visible after route
changes and reload. Reset removed a temporary demo bike and restored the three
shipped bikes. Five repeated browser runs created a real sentinel bike, entered
the sample, changed and reset sample data, selected Start for real, and confirmed
the real sentinel remained unchanged. The real and sample databases stayed
separate, and the complete flow made no request outside the product origin.

## Declared claims

Every exact command in `.factory/claims.json` ran from the clean checkout after
`npm ci`. All 15 passed.

| Claim | Result | Observed result |
| --- | --- | --- |
| `demo-isolation` | PASS | Sample writes and real license storage stayed separate. |
| `demo-reset` | PASS | Reset restored the three shipped bikes. |
| `sample-content-and-onboarding` | PASS | Three realistic histories appeared; real onboarding was blank. |
| `multi-bike-history` | PASS | Two real bikes appeared together in reverse date order. |
| `offline-reload` | PASS | The controlled sample reloaded offline after its first visit. |
| `csv-export` | PASS | Parsed CSV contained its header, every row, order, and escaped text. |
| `json-export` | PASS | Parsed backup contained every shipped nested record and field. |
| `local-records` | PASS | Create, reload, export, and delete stayed on the product origin. |
| `no-third-party-runtime` | PASS | All shipped routes loaded only same-origin files and scripts. |
| `date-distance-reminders` | PASS | Date, distance, month-end, leap-year, and known-mileage cases passed. |
| `backup-validation` | PASS | Invalid nested dates, relations, and metadata were rejected before writes. |
| `routed-history` | PASS | Direct URLs, titles, canonical URLs, reload, history, and focus worked. |
| `history-search-order` | PASS | Cross-bike search retained reverse date order. |
| `print-history` | PASS | Print opened and print media kept history while hiding controls. |
| `mobile-targets` | PASS | Its claimed navigation and legal targets met 44 px without overflow. |

Landing, legal, and README claim-like sentences map to this registry. No false,
missing, incomplete, or untested public claim was found. The dark contrast and
restore target defects are not claimed outcomes, so the untested-claim count is
zero.

## Normal, invalid, boundary, and recovery paths

- Creating a bike, component, service entry, attachment, and cross-bike history
  worked and survived reload.
- A blank required bike name and `-1` odometer were rejected by named native
  validation. A zero odometer was accepted.
- Reminder distance `0` and interval `241` months were rejected against the
  documented 1 and 240 bounds.
- A future service date was rejected against the current-date maximum.
- A text attachment and a file over 4 MB produced specific recovery messages.
- A nested backup with an invalid component date was rejected with a record-level
  error. The existing real bike remained after the failed restore.
- Month-end, leap-year, either-trigger, and missing-service-mileage calculations
  passed their unit fixtures.
- Dialog focus entered the first field, Escape closed it, and focus returned to
  the opener. Route changes focused the new h1. The skip link and keyboard
  actions worked in the live suite.
- Text enlarged to 200% at 390 px without horizontal overflow.
- Reduced motion matched the media query, removed smooth scrolling, and reduced
  transitions and animations to 0.01 ms. Nothing loops or flashes.

## Accessibility, routes, privacy, and offline behavior

- The supplied `verify-url.sh` passed `/`, `/demo`, and `/404.html` with no
  console or page errors, one h1, `lang=en`, a main landmark, and no missing alt
  text or unnamed buttons.
- Axe found no WCAG A/AA violations on all checked routes in light mode. Dark
  mode found only F-6-1. The earlier suite's serious/critical checks passed
  because it did not set a dark color scheme.
- All ordinary links collected from app, sample, history, backup, legal, and 404
  pages returned 200. Receipt data and contact mail links were explicit.
- `/`, `/demo`, `/history`, `/backup`, `/privacy/`, `/terms/`, and `/404.html`
  returned 200 with route-specific titles and metadata. An unknown path returned
  the designed recovery page with deliberate HTTP 404; this is expected, not a
  defect.
- CSP, Permissions Policy, `nosniff`, Referrer Policy, correct manifest MIME,
  and immutable caching for fingerprinted assets are live.
- Live runtime requests stayed on the product origin. There is no analytics,
  runtime model, billing, remote font, or third-party script request.
- The service worker controlled the app and reloaded the populated sample
  offline. Chromium reported no installability errors.
- A temporary two-version static host showed the update notice, accepted
  `Update now`, changed controller, reloaded, and reopened the app.

This is a static local-first PWA. Backend tenant, health, restart, and 429 checks
do not apply. The brief does not need runtime AI or cloud sync; deterministic
reminders plus CSV and complete JSON backup cover the stated job and portability.

## Build, performance, and live identity

| Check | Result |
| --- | --- |
| `npm ci` | PASS; 61 packages, 0 vulnerabilities |
| `npm test` | PASS; 9/9 |
| `npm run build` | PASS; `dist/` generated |
| `npm run test:e2e` | PASS; 36 passed, 6 intended project skips |
| Live `npm run test:e2e` | PASS; 36 passed, 6 intended project skips |
| Initial JavaScript | 42.17 kB raw / 13.45 kB gzip |
| Initial CSS | 23.76 kB raw / 6.07 kB gzip |
| Lighthouse mobile | Performance 100, Accessibility 100, Best Practices 100, SEO 100 |
| Lighthouse metrics | FCP 0.90 s, LCP 1.80 s, TBT 0 ms, CLS 0 |

Lighthouse used the light root page and therefore does not cancel the populated
dark-mode finding.

The last implementation change is `c974390`. Later commits only add review and
evidence documents. Fresh output from the current documentation head matched
the live `index.html`, hashed CSS, hashed JavaScript, service worker, manifest,
Privacy, Terms, and 404 files byte for byte. A fresh product image is not needed
to explain the two live CSS defects.

## Earlier finding disposition

Every earlier review, polish record, verification report, and handoff was read.
The original failures remain fixed; the two findings above are new coverage.

| Earlier IDs | Current evidence |
| --- | --- |
| `V-01`, `F-1-4`, `F-2-1`, `F-2-7`, `F-2-9` | The unavailable paid pass, checkout, gates, and promises remain absent. `/pass` is the designed 404. |
| `V-02`, `F-1-5` | Malformed nested backups are rejected before storage, and the current record survives. |
| `V-03`, `F-1-6` | Calendar-month reminders clamp to the target month's last valid day. |
| `V-04`, `F-1-7` | Date and latest-known mileage baselines remain independent. |
| `V-05`, `F-1-8` | The originally reported header, footer, demo, and legal targets remain fixed. F-6-2 concerns previously unchecked restore radios. |
| `V-06`, `F-1-9` | Live fingerprinted assets retain one-year immutable caching. |
| `V-07`, `F-1-10` | Browser safety headers and manifest/image MIME mappings remain live. |
| `F-1-1`, `F-1-16`, `F-1-18`–`F-1-27` | The first screen clearly names the job, audience, actions, outcomes, and exact facts with plain, consistent words. |
| `F-1-2`, `F-2-2`, `F-2-5` | One-click sample entry, realistic data, persistent label, reset, discard, and real-record isolation all pass. |
| `F-1-3`, `F-2-3`, `F-2-4`, `F-2-6`, `F-2-8`, `F-3-1` | Fifteen unique claims each retain one tagged test; all exact commands passed. |
| `F-1-11`–`F-1-15`, `F-2-12`, `F-2-13`, `F-3-2`, `F-4-1` | Direct routes, titles, history/focus, designed 404, metadata, shared header/footer, Demo, and Privacy links remain live. |
| `F-1-28`–`F-1-43`, `F-2-10`, `F-2-11` | README and interface wording remain concrete; unavailable payment and visitor-facing implementation jargon remain removed. |
| `F-1-44`–`F-1-66` | Storage, sample content, reminders, exports, search, print, offline use, and request-origin promises are tested or the unsupported promise remains removed. |

Review 5's zero-finding result is superseded by the broader dark-theme Axe scan
and all-control phone target measurement in this review.

## Required next steps

1. Fix F-6-1 and add a populated dark-mode Axe regression.
2. Fix F-6-2 and measure every visible mobile form target.
3. Repeat all 15 claim commands and the full live browser suite before declaring
   PASS.
