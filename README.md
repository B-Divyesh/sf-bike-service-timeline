# Bike Service Timeline

Track service history and next reminders across every bike you maintain.
It is for people with several bikes who want one record in their browser.

Try the isolated sample at <https://bike-service-timeline.sociobot.in/?demo=1>.

## What it does

- Stores bikes, components, service entries, mileage, notes, costs, and repair shop details in this browser.
- Uses the date and distance reminders you set.
- Searches service history across bikes in reverse date order.
- Exports every service entry as CSV and downloads a complete JSON backup.
- Opens a printable service history.
- Works offline after the first visit.

The demo and real records use separate browser databases. Starting for real
deletes demo changes. During the tested demo flow, records are not sent to
another origin.

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

Every visitor-facing claim is listed in [`.factory/claims.json`](./.factory/claims.json).
Run each listed command from a clean clone. Playwright 1.58.2 is pinned and uses
the Chromium build from `PLAYWRIGHT_BROWSERS_PATH`.

## Deploy

Deploy `dist/` as a static site. Use `staticwebapp.config.json` for direct
links, the designed 404 page, browser safety headers, and asset caching.

## Design and license

The paper-workshop visual system and original-image provenance are in
[`.factory/design.md`](./.factory/design.md). Licensed under [MIT](./LICENSE).
