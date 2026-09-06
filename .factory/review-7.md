# Track service across all your bikes — review 7

## Verdict: PASS

- Findings: **0** (blocking 0, high 0, medium 0, minor 0)
- Untested public claims: **0**
- Live URL: <https://bike-service-timeline.sociobot.in>
- Implementation reviewed: `b8d441ff74a58771ef2b01276d51550a1bb1daf5`
- Documentation and test baseline: `e2090dc04580da9a8fd7c5cbd5da48b0503a16c6`

The commits after the implementation contain one test-only regression and
reports/evidence. A clean build at the documentation baseline matches the live
implementation byte for byte.

## First screen before scrolling

Fresh 1440 × 1000 desktop and 390 × 844 phone contexts returned HTTP 200 and
showed all three required answers inside the first viewport:

- Job: **Track service across all your bikes**.
- Audience: people who maintain several bikes and need one history plus a clear
  view of what is due next.
- First action: **Try it with sample data**. The nearby text says the sample
  opens three bike histories.

The root title is `Bike Service Timeline — Track service across all bikes`.
Neither context produced a console or page error.

## Sample and real-data separation

The first action opened `/?demo=1` in one click. The first populated screen
showed Aster Road, Maple Cargo, and Pine Trail; odometers of 4,280 km, 1,860 km,
and 920 km; service reminders; notes; a repair shop; and three service entries.
The persistent label reads **Demo — sample data, nothing is saved** and keeps
**Reset demo** and **Start for real** available.

The clean and live isolation tests saved a real sentinel bike, added a
demo-only bike, reset the sample, and started for real. Reset restored exactly
the three shipped bikes. Starting for real retained the real sentinel and
discarded the demo-only bike. Seeded real license keys were not read or changed,
and no external request occurred in demo mode.

## Clean checkout results

A separate checkout of `e2090dc` used the documented Node setup and pinned
Playwright 1.58.2 browser.

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 61 packages installed; 0 vulnerabilities |
| `npm test` | PASS — 9/9 |
| `npm run build` | PASS — `dist/` produced |
| Initial JavaScript | PASS — 42.17 KB raw, 13.45 KB gzip |
| Initial CSS | PASS — 23.88 KB raw, 6.10 KB gzip |
| `npm audit --audit-level=moderate` | PASS — 0 vulnerabilities |
| Complete local browser suite | PASS — 38 passed, 8 intentional viewport skips |
| Complete live browser suite | PASS — 38 passed, 8 intentional viewport skips |

## Declared claims

Every exact command in `.factory/claims.json` ran from the clean checkout.

| Claim | Result | Observable result |
| --- | --- | --- |
| `demo-isolation` | PASS | Demo edits, storage, requests, reset, and real sentinel separation |
| `demo-reset` | PASS | Reset restores exactly three shipped bikes |
| `sample-content-and-onboarding` | PASS | Named histories, reminders, odometers, notes, and blank real start |
| `multi-bike-history` | PASS | Two real bikes appear together in reverse date order |
| `offline-reload` | PASS | Controlled sample reloads offline with an offline status |
| `csv-export` | PASS | Parsed header, all rows, order, attachment name, and escaping |
| `json-export` | PASS | Parsed schema and every field of every shipped record |
| `local-records` | PASS | Create, reload, export, and delete stay on the product origin |
| `no-third-party-runtime` | PASS | All shipped routes use same-origin scripts and requests |
| `date-distance-reminders` | PASS | Date, distance, either trigger, month ends, leap year, and mileage baseline |
| `backup-validation` | PASS | Invalid nested dates, relations, and metadata are rejected |
| `routed-history` | PASS | Direct URLs, titles, canonicals, reload, history, and heading focus |
| `history-search-order` | PASS | Cross-bike reverse order and bike/shop searches |
| `print-history` | PASS | Print is invoked and print media retains the history |
| `mobile-targets` | PASS | Phone routes have no overflow and required targets are at least 44 px |

The landing page, app routes, Privacy, Terms, README, and copy audit were read
against this registry. No missing, false, incomplete, or untested public claim
was found.

## Normal, invalid, boundary, and recovery paths

- Normal create, component, service, attachment, reload, search, export,
  restore, and print paths pass locally and live.
- An empty required bike name and a negative odometer are rejected by browser
  validation without closing the form or changing the sample.
- A malformed backup reports `Backup validation failed: bike 1 has an invalid
  field.` The original three sample bikes remain intact.
- Date-only, distance-only, either-trigger, leap/non-leap month ends, and a
  later service without mileage pass their unit fixtures.
- Offline reload keeps the sample usable and shows the offline state.
- An unknown live URL returns HTTP 404 with the designed `Page not found`
  screen and a route back. This deliberate 404 is expected, not a defect.

## Accessibility, routes, privacy, and PWA checks

- The supplied `verify-url.sh` passed the root, direct sample, Privacy, Terms,
  and `/404.html`: one h1, `lang=en`, a main landmark, complete image
  alternatives, labels, and no console errors.
- Axe WCAG 2 A/AA passed the empty state, populated dark sample, product routes,
  legal routes, and 404 with zero serious or critical violations.
- Keyboard tests pass for the skip link, dialog entry, Escape close, focus
  return, route heading focus, and radio labels. Focus-visible uses a 3 px ring.
- At 390 px, navigation, legal, demo, backup, and restore targets meet 44 px,
  and there is no horizontal overflow.
- With reduced motion requested, scrolling becomes `auto` and transitions and
  animations reduce to 0.01 ms with one iteration.
- Every crawlable internal link found across seven shipped routes returned 200.
  `mailto:`, fragment, and local receipt data links were correctly treated as
  non-HTTP links. Route titles, canonical links, metadata, legal pages, back and
  forward navigation, and the designed 404 pass.
- Request logging found no analytics, remote font, third-party script, backend
  call, or credential. The privacy and terms pages are live and route-titled.
- The manifest, maskable icon, controlled service worker, cached shell, offline
  fallback, and update prompt/skip-waiting path are present. Production sends
  CSP, Permissions Policy, nosniff, and strict referrer headers. Fingerprinted
  assets use one-year immutable caching.
- This is a static local-first PWA. Backend tenancy, restart persistence,
  health, and 429/Retry-After checks do not apply.

Fresh live Lighthouse mobile scores are **100 Performance, 100 Accessibility,
100 Best Practices, and 100 SEO**. FCP is 0.9 s, LCP is 1.8 s, TBT is 0 ms, and
CLS is 0.

## Earlier finding disposition

Every earlier verification, review, polish report, and handoff was inspected.

| Earlier IDs | Current disposition and fresh evidence |
| --- | --- |
| `V-01`, `F-1-4`, `F-1-34`, `F-1-61`, `F-2-1`, `F-2-7`, `F-2-9` | The unavailable paid offer, checkout, gate, and perpetual-offline copy remain absent. `/pass` reaches the designed 404. |
| `V-02`–`V-04`, `F-1-5`–`F-1-7` | Malformed restore, month-end clamping, and independent latest-mileage behavior pass their exact commands and the live invalid-file check. |
| `V-05`, `F-1-8`, `F-1-60` | Phone navigation, legal, demo, and app targets pass the mobile claim without overflow. |
| `V-06`–`V-07`, `F-1-9`–`F-1-10` | Live immutable caching, CSP, Permissions Policy, referrer/nosniff headers, and manifest/AVIF MIME mappings pass. |
| `F-1-1`–`F-1-3`, `F-1-11`–`F-1-17` | The job-first screen, one-click isolated sample, registry, real routes, designed 404, structure, metadata, shared shell, enabled onboarding, and literal Privacy heading pass. |
| `F-1-18`–`F-1-43` | The plain-language, terminology, metadata, header/footer, and navigation repairs remain present; the copy audit has no flags. |
| `F-1-44`–`F-1-66` | Every retained storage, export, offline, search, print, multi-bike, mobile, and privacy statement maps to passing evidence; unsupported billing claims remain removed. |
| `F-2-2`–`F-2-13` | License/data isolation, parsed exports, realistic sample, literal headings, complete 404 metadata, shared navigation, and Axe/mobile coverage pass. |
| `F-3-1`–`F-3-2`, `F-4-1` | The real two-bike history, literal 404 wording, and direct Demo/Privacy navigation pass live. |
| `F-6-1` | Populated dark-mode Axe passes; `Due soon` uses the repaired contrasting dark token. |
| `F-6-2` | Both restore labels are full 44 px targets and work when their labels are selected. |

No earlier finding reopened. The deterministic service-record job does not need
an AI step. Import/export already covers the brief's portability need, so there
is no missed-leverage finding.

## Conclusion

**PASS.** Review 7 found zero defects of every severity and zero untested public
claims. No product code was changed.
