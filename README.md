# Bike Service Timeline

Bike Service Timeline is a private, offline-first ownership record for people
who maintain more than one bicycle. It answers two practical questions without
opening separate bike profiles: **what happened to this component last?** and
**what should I look at next?**

Live product: <https://bike-service-timeline.sociobot.in>

## What it includes

- Multiple bikes with current odometer readings
- Components with owner-configured date and/or distance reminders
- Chronological, searchable service history across every bike
- Work type, notes, cost, workshop, mileage, receipt, and photo fields
- JSON backup/restore, CSV export, and print-ready history
- IndexedDB persistence, installable PWA manifest, and complete offline app shell
- Light and dark treatments with a responsive 390 px mobile layout
- A useful free bench for two bikes; a US$19 one-time Workshop Pass adds
  unlimited bikes and attachments

Intervals are personal reminders, not diagnostics, manufacturer recommendations,
or safety certification.

## Privacy and data ownership

Bike, component, and service data stays in IndexedDB in the current browser.
There is no account, sync, analytics, advertising, or third-party runtime script.
Users should periodically download a JSON backup because the service cannot
recover data cleared from a device. License tokens are stored in localStorage
and checked against the Sociobot billing API at most once per day.

See the product’s [privacy notice](./privacy/index.html) and
[terms](./terms/index.html).

## Develop

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev
```

Vite serves the app at the URL printed in the terminal. Service workers are
registered only in production builds so development changes remain immediate.

## Test and build

```sh
npm test          # calculation and export unit tests
npm run test:e2e  # production build + desktop/mobile/offline/axe browser tests
npm run build     # exact deploy build; writes dist/index.html
```

Playwright is pinned to 1.58.2. The end-to-end suite expects its Chromium build
to be installed or available through `PLAYWRIGHT_BROWSERS_PATH`.

## Deploy

Deploy the generated `dist/` directory as a static site. Configure clean-path
requests to serve directory indexes (`/privacy/` and `/terms/`). The generated
service worker contains a versioned precache manifest and must be served from
the site root. Do not deploy source maps, environment secrets, or `assets/src/`.

The factory registers the billing product separately. The app uses only the
slug-based Sociobot checkout and verification endpoints; it contains no payment
provider credentials or product IDs.

## Design and provenance

The product-specific paper-cut workshop system, tokens, interaction rules,
motion policy, and generated artwork prompt are documented in
[`.factory/design.md`](./.factory/design.md). The original high-resolution
source and prompt sidecar live in `assets/src/`; optimized AVIF, WebP, and JPEG
variants ship with the app.

## License

MIT — see [LICENSE](./LICENSE).
