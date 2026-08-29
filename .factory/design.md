# Bike Service Timeline — visual thesis

## Direction: the rider's paper workshop

The product is a **paper-cut diorama of a well-kept home workshop**: stacked card
layers become bikes, shelves, service tags, and a continuous paper trail. It is
warm and tactile because maintenance records are an ownership story, while the
timeline itself stays precise and quiet. The metaphor is functional: bikes sit
on one visual bench, component labels resemble workshop tags, and service events
are connected by a single cut-paper rail. It should never resemble a ride
tracker dashboard, generic SaaS gradient, or mechanical diagnostic tool.

## Palette

Light mode is the primary treatment; dark mode becomes an evening workshop.

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| canvas | `#F3EAD8` | `#17221E` | unbleached paper / workshop night |
| surface | `#FFFDF7` | `#223029` | record cards |
| surface-raised | `#FBF5E8` | `#2B3A32` | secondary paper layer |
| ink | `#17372F` | `#F7F0DE` | primary text |
| muted | `#566961` | `#B8C6BC` | supporting text (4.5:1+) |
| pine | `#176B57` | `#78D2B3` | primary action / chain oil |
| pine-contrast | `#FFFFFF` | `#10251E` | text on pine |
| spoke | `#254F70` | `#9AC8E8` | links and informational state |
| marigold | `#E6A327` | `#F4BF54` | due-soon service tags |
| rust | `#A94732` | `#FF9C83` | overdue and destructive action |
| leaf | `#2F7150` | `#81C99E` | completed/current state |
| edge | `#C9BFAE` | `#526158` | borders and cut edges |

Status always includes words and an icon/shape; color never carries meaning
alone. Paper noise is drawn with CSS, not an image payload.

## Typography

- Display: `Georgia`, `Cambria`, serif. Its humanist, printed character makes
  dates and bike names feel like an enduring logbook.
- Utility/body: `Inter`, `Avenir Next`, `Segoe UI`, system sans-serif. No font
  files or third-party requests are shipped, keeping first load and offline use
  lean.
- Scale: 14 / 16 / 18 / 24 / 34 / 52 px; body is never below 16 px. Timeline
  dates and odometers use tabular figures.

## Spacing, shape, and depth

- 4 px base rhythm; working steps are 8, 12, 16, 24, 32, 48, and 64 px.
- Content max width is 1180 px; reading measures stay under 72 characters.
- Corners are deliberately irregular in spirit but consistently implemented:
  18 px for independent sheets, 10 px for controls, pill shapes only for tags.
- Each raised sheet uses a 1 px edge and a short offset shadow (`0 4px 0`) like
  stacked card stock. Primary actions use 48 px height; all targets are at least
  44 px with 8 px separation.
- Phone layout drops the decorative bench background, stacks the overview, and
  keeps the primary “Log service” action within the first viewport.

## Interaction grammar

- Bikes are selected like labelled workshop tags, not tabs floating in chrome.
- The main timeline is the product spine. Each entry has date, bike, component,
  work, mileage, and attachments in a predictable reading order.
- Forms open as centered sheets on desktop and full-height work orders on
  phones. Focus enters the sheet, Escape closes, and focus returns to origin.
- Save/import/delete feedback is announced in a polite live region. Destructive
  deletes name the record in a native confirmation before proceeding.
- Due state is derived from the latest applicable component service plus the
  owner's date/mileage interval. It is guidance only and says so wherever
  schedules are edited.

## Motion policy

Paper sheets enter from their physical origin with 180–240 ms opacity/translate
transitions; timeline additions briefly settle downward. Nothing loops. With
`prefers-reduced-motion: reduce`, transforms and smooth scrolling are removed
and state changes are instant/opacity-only.

## Original asset plan and provenance

The hero scene is an original generated paper-cut illustration of three
different bicycles in one compact workshop, connected by dated maintenance
tags. It explains the cross-bike ownership record at a glance. Small product
icons are hand-authored SVG/CSS line work; no stock or third-party assets.

### Prompt sheet

- Subject: three distinct owner bicycles (road, cargo/commuter, mountain) on one
  workshop bench, connected by a subtle chronological trail of blank service
  tags, tools and component silhouettes.
- World/materials: layered cut paper, card stock fibers, folded tabs, precise
  hand-cut edges, shallow physical depth.
- Light/lens: warm window light from upper left, soft short shadows, front
  three-quarter editorial view, no dramatic perspective.
- Palette words: unbleached cream, deep pine green, muted spoke blue, marigold,
  restrained rust red, charcoal ink.
- Negative list: no people, no text, numbers, logos, brands, watermarks,
  photorealism, gradients, neon, glossy 3D plastic, broken bicycle geometry,
  duplicated wheels, floating tools, unsafe repair depiction.

Generated with the factory Azure OpenAI image deployment (`factory-image`) on
2026-08-28. The generated work is original for this product. Prompt and model
metadata are stored beside the source asset in `assets/src/hero-workshop.json`.
The footer discloses AI-assisted illustration.

The demo's small PDF receipt is a hand-authored local fixture made for this
product. It contains no third-party artwork, brand, or personal information.
