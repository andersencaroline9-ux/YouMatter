# Project status

Last reviewed: 2026-10-12

## Authoritative website

- `app/` is the complete, active website and the sole application development
  target. It is based on the recovered deployed baseline, with local changes
  documented in `DECISIONS.md`.
- The project vision and three adventures are documented in `VISION.md` and
  `ADVENTURES.md`.
- `index.html` and `assets/style.css` are the existing GitHub Pages homepage.
  Keep them intact until the app is safely deployed, verified, and Caroline
  explicitly approves the public-site transition.
- `imports/` contains archival recovery material and both recovered snapshots.
  It is not an active development target.

## Hosting and local architecture

- Cloudflare Workers is the chosen production hosting platform. No production
  Workers, D1, R2, or Cloudflare settings have been connected or changed for
  this local app, and nothing here is deployed.
- Local development runs from `app/` with `pnpm dev`; see `app/README.md` for
  prerequisites and first-time local D1 migration steps.
- The app includes `/`, `/gratitude`, `/nature`, `/kindness`, and `/admin`.
- Local D1 stores contributions and moderation status. Local R2 emulates nature
  photo storage. Their persisted state is under ignored `app/.wrangler/`.
- New contributions are pending and retrievable after refresh by the submitting
  browser through a random HttpOnly visitor cookie. Only its SHA-256 hash is
  stored in D1. Public feeds expose approved items; pending contributions and
  nature images remain private to their submitter and moderators. Approval or
  rejection clears visitor ownership.
- Admin endpoints retain Cloudflare Access JWT validation and an administrator
  email allowlist. Local moderation requires trusted local identity
  configuration; the authorization checks must not be bypassed.
- Pending records created before the visitor-ownership migration have no
  associated visitor and cannot be shown to a contributor retroactively.

## Verified

- The latest app production build succeeded.
- Lint completed with zero errors and three existing raw-`img` optimization
  warnings.
- Browser checks verified homepage navigation among all three adventures,
  section anchors, and return links. The homepage and adventure pages return
  HTTP 200 locally.
- Gratitude, nature, and kindness submissions were confirmed to survive page
  refresh for their submitting browser. A separate visitor did not receive a
  pending kindness submission. Pending items are labelled “Awaiting approval.”
- A local pending kindness submission survived a full dev-server restart for
  its owner and remained unavailable without that visitor cookie. The
  temporary test submission was removed afterward.
- Local D1 migrations, including visitor ownership, have been applied to local
  state only. Local admin APIs fail closed without valid authorization.
- `git diff --check` passed after the latest code changes.

## Still to do before connecting or launching

- Configure and test Cloudflare Workers, D1, R2, secrets, and Cloudflare Access
  in an explicitly approved non-production/staging setup before production.
- Verify moderation approval and rejection with an authorized local identity,
  including public visibility after approval and image behavior.
- Test nature-photo R2 persistence through a full server restart and review
  upload limits and failure behavior.
- Add or run automated end-to-end tests for contribution validation, privacy,
  moderation transitions, and navigation.
- Decide and implement rate limiting, abuse reporting/screening, and other
  public-submission protections.
- Complete privacy, retention/deletion, consent, and age-handling review.
- Confirm operational partners and evidence before making real-world impact
  promises.
- Plan a verified app deployment and public-entry-point transition. Do not
  remove or replace the GitHub Pages homepage before Caroline approves that
  transition.

## Risks and constraints

- Do not treat source-level admin authorization as a deployed security control:
  production Access policy, keys, and Worker values have not been configured
  or tested.
- Do not use production resources during local development or change live
  Cloudflare settings without explicit approval.
- Do not claim an app deployment or GitHub Pages replacement has occurred.
- Preserve Caroline's original creative and design decisions; do not simplify
  or redesign the adventures without permission.
