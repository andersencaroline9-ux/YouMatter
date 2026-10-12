# STATUS

## Working
- The original GitHub Pages homepage remains at repository root, unchanged by local application setup.
- A standalone copy of the recovered deployed-baseline application is set up in `app/`.
- The local app has the homepage and routes for Gratitude Garden, Nature Mosaic, and Built From Kindness.
- Dependencies are installed and the production build passes.
- Local D1 migrations are applied to Wrangler's local state only; R2 is emulated locally. No production resources were connected.
- Cloudflare Access JWT and admin email allowlist checks remain enabled in the copied app.

## Missing
- Browser verification of all three adventure pages and their navigation is still to be completed.
- Local admin access requires a trusted Cloudflare Access JWT and allowlist configuration; it is intentionally not bypassed.
- Moderation of local pending contributions therefore needs that authorized admin setup or a later approved local-only admin authentication design.
- End-to-end testing of contribution persistence and nature image handling remains outstanding.

## Risks
- The root homepage and standalone app are separate; running the app locally does not alter the root homepage or deploy any changes.
- The approved source-level admin authorization patch is not deployed. Until the Access policy and Worker values are configured and tested, do not treat the live admin area as protected by this change.
- The imported source trees are locally patched and no longer exact copies of their original recovered source states; the original `site.tar.gz` archives were not changed.
- Automated moderation, rate limiting, abuse controls, and privacy/legal review remain incomplete.
- Future work should avoid expanding scope beyond the existing product vision without updating the project memory.

## Navigation audit — 2026-10-12
- The earlier audit checked the root homepage (`index.html`) before the recovered full application was copied into `app/`.
- Homepage header logo returns to the homepage top; homepage section links to `#adventures` and `#why` resolve to existing section IDs.
- The three adventure cards point to the corresponding Gratitude Garden (`/gratitude`), Nature Mosaic (`/nature`), and Built From Kindness (`/kindness`) routes on the separately hosted site. They were left unchanged because they already point to the named adventures.
- The homepage footer brand was plain text rather than a link; it now links to the homepage top.
- The admin link remains pointed at the external `/admin` route.
- The full source is now locally runnable from `app/`. Its internal navigation still needs browser verification, including logo return links, “Choose another adventure” / “All adventures”, section links, back links, and mobile behavior.
- The remote routes are preserved as existing links; this local audit does not verify that the separate host remains available or that its page-internal navigation works.

## Current priority
- Verify the local app in a browser, including adventure navigation, forms, and local persistence.
- Keep the app standalone until there is an explicit decision to integrate it with the root GitHub Pages homepage.
- Keep the existing emotional tone and philosophy while implementing the missing technical functionality.
