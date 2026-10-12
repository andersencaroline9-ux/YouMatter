# Technical Architecture

## Request flow

### Text contribution

1. Client form validates required fields and consent.
2. POST request reaches a route handler.
3. Server validates type, length and allowed enum values.
4. Drizzle inserts a D1 row with status pending.
5. Client shows a thank-you message and adds the pending item to local state.
6. Admin reviews the submission.
7. PATCH changes status to approved or rejected.
8. Public GET returns approved rows only.

This flow is used by Gratitude, Kindness and the unpublished Superhero adventure.

### Nature contribution

1. Client submits FormData with image, optional caption/name and consent.
2. Server enforces 5 MB maximum.
3. Server checks JPEG, PNG or WebP magic bytes.
4. Server writes bytes to R2 with a random nature/ object key.
5. Server inserts D1 metadata row with pending status.
6. Client shows a temporary local preview.
7. Admin image route retrieves the pending R2 object for review.
8. Approval makes the public image route available.
9. Rejection deletes the R2 object.

## Main folders

- app — pages, route handlers and global CSS.
- components — bespoke practices, shared shell and starter UI primitives.
- db — Drizzle connection and schema.
- drizzle — SQL migrations and snapshots.
- public — static starter assets/favicon.
- scripts/build/vendor/lib — Sites/Vinext runtime support.
- .openai/hosting.json — binding names and Site project ID.

## Tables

### gratitudes

- id
- message
- display_name
- status
- created_at
- approved_at

One form submission creates three rows.

### nature_entries

- id
- object_key
- caption
- display_name
- status
- created_at
- approved_at

### kindness_entries

- id
- message
- kind
- display_name
- status
- created_at
- approved_at

### superhero_entries — working copy only

- id
- strength
- superpower reflection
- display_name
- status
- created_at
- approved_at

## API inventory

- GET/POST /api/gratitudes
- GET/POST /api/nature
- GET /api/nature/:id/image
- GET/POST /api/kindness
- GET /api/impact
- GET/PATCH /api/admin/submissions
- GET /api/admin/nature/:id/image
- GET/POST /api/superheroes — working copy only
- /api/admin/gratitudes — legacy route; inspect before removal

## Trust boundaries

Current recovered source trees:

- Admin pages and admin APIs verify the Cloudflare Access JWT signature, issuer and application audience, then require an email in the server-side `ADMIN_EMAILS` allowlist.
- Admin authorization fails closed when its configuration or Cloudflare public keys are unavailable.
- Cloudflare Access must protect the application and supply `Cf-Access-Jwt-Assertion`; the application independently verifies that token.
- `CF_ACCESS_TEAM_DOMAIN`, `CF_ACCESS_AUD` and `ADMIN_EMAILS` must be configured in the Worker environment; no values or credentials are included in this import.
- The patch is source-only and has not been deployed or configured against the live Site.
- Form fields are untrusted.
- R2 image bytes are untrusted until review.
- Public display must use approved rows only.

Before public launch, configure and test the Cloudflare Access application and Worker environment. Continue to treat hosting-level Access as defense in depth, not a substitute for the application checks.

## Build/runtime notes

- Runtime is Cloudflare Workers; raw TCP is not expected.
- Database access uses the Worker DB binding.
- Uploads use the Worker BUCKET binding.
- The generated deployment output is not required to understand the source.
- Node modules and local runtime state are intentionally excluded.
