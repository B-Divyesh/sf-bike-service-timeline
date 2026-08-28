# Bike Service Timeline

Track service history and next reminders across every bike you maintain.
It is for people with several bikes who want one local record.

Try the isolated sample at <https://bike-service-timeline.sociobot.in/demo>.

## What it does

- Keeps bikes, components, service work, odometers, costs, and repair shop notes.
- Uses date and distance reminders that you set.
- Shows one searchable service history across bikes.
- Downloads a JSON backup, CSV spreadsheet export, or printable history.
- Stores records in this browser. Export backups before clearing browser data.
- Free: two bikes. US$19 once: unlimited bikes and receipt or photo attachments.

Records remain local unless you export them. There is no account, sync,
analytics, advertising, or third-party script. The optional license check sends
the saved license token to Sociobot.

Reminders are personal planning aids. They are not diagnostics or safety advice.
Read the [privacy notice](./privacy/index.html) and [terms](./terms/index.html).

## Develop

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev
```

## Test and build

```sh
npm test
npm run test:e2e
npm run build
```

Each visitor-facing claim is listed in [`.factory/claims.json`](./.factory/claims.json).
Run every listed command from a clean clone. Playwright 1.58.2 is pinned; its
Chromium browser must be available through `PLAYWRIGHT_BROWSERS_PATH`.

## Deploy

Deploy `dist/` as a static site. `staticwebapp.config.json` supplies the SPA
fallback, designed 404 response, CSP, MIME types, and immutable cache headers.
The app uses Sociobot hosted checkout and license verification only; it contains
no payment-provider credentials.

## Design and license

The paper-workshop visual system and original-image provenance are in
[`.factory/design.md`](./.factory/design.md). Licensed under [MIT](./LICENSE).
