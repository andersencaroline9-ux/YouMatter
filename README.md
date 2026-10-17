# You Matter — Choose Your Adventure

You Matter is a warm, evidence-informed wellbeing project about how small,
repeatable actions can contribute to visible collective change. Its guiding
idea is **“You Matter. But this isn't about you.”** The current public
adventures are Gratitude Garden, The Kindness Tree, The Strengths We Bring,
Give Yourself Permission to Dream, and the paid RECONNECT — 30 Days in Nature.
The app also retains the separate Nature Mosaic practice.

## Which website is authoritative?

[`app/`](./app/) is the authoritative, full website and the only active
application development target. The original static GitHub Pages homepage
([`index.html`](./index.html) and [`assets/style.css`](./assets/style.css))
must remain intact until the new site has been safely deployed and its
replacement has been explicitly approved.

Recovered source snapshots and recovery handover documents under
[`imports/`](./imports/) are archival references, not active development
targets. Do not edit or delete them as part of ordinary app work.

## Run locally

Requirements: Node.js 22.13 or newer and pnpm.

```sh
cd app
pnpm install
pnpm dev
```

Open the address printed by the dev server (normally
<http://127.0.0.1:5173/>). Adventure routes are `/gratitude`, `/nature`, and
`/kindness`. See [`app/README.md`](./app/README.md) for fresh local D1 setup,
migrations, and app-specific details.

## Contributions and storage

Contributions are stored locally in Cloudflare-compatible D1; nature photos
use local R2 emulation. A submission starts pending and is shown to its
submitter, including after refresh, through a random HttpOnly browser cookie.
Only its SHA-256 hash is stored in D1. Public feeds show approved contributions;
moderation clears ownership when an item is approved or rejected. Pending nature
photos are private to their submitter and moderators.

Local D1/R2 state lives under ignored `app/.wrangler/` and is separate from
production. Admin routes remain protected by Cloudflare Access JWT validation
and the administrator email allowlist; local moderation needs trusted local
identity configuration. Do not bypass the checks or use production resources
for local development.

## Hosting and current state

Cloudflare Workers is the chosen hosting platform for the full application.
Production Cloudflare resources are not yet connected, and the app has not been
deployed. Keep the GitHub Pages homepage unchanged until the new site is
deployed, verified, and Caroline approves changing the public entry point.

[`project-memory/STATUS.md`](./project-memory/STATUS.md) records verified
behavior, remaining setup, and release risks. [`AGENTS.md`](./AGENTS.md)
contains instructions for future contributors and AI assistants.
