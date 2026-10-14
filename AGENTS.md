# You Matter — contributor and AI-assistant guide

## Project vision

You Matter is a warm, human, evidence-informed wellbeing project grounded in
positive psychology, connection, contribution, belonging, and collective
wellbeing. Its guiding idea is “You Matter. But this isn't about you.” Preserve
the project's original creative intent: small daily practices become visible
parts of something larger. Avoid corporate or clinical tone, overclaiming
research, toxic positivity, rankings, or unnecessary redesign.

Before substantive work, read:

- `project-memory/VISION.md`
- `project-memory/ADVENTURES.md`
- `project-memory/DECISIONS.md`
- `project-memory/STATUS.md`

Use `README.md` as the repository entry point and `app/README.md` for local
application setup.

## Source of truth and archival material

- `app/` is the authoritative full website and the only active application
  development target.
- `index.html` and `assets/style.css` are the existing GitHub Pages homepage.
  Keep them intact until the full application is safely deployed, verified,
  and Caroline explicitly approves replacing the public entry point.
- `imports/` contains recovered source versions, handovers, and recovery
  material. Treat it as archival and read-only; do not make active fixes there.
- `project-memory/CHATGPT_HANDOVER.md` is a superseded legacy handover. Use the
  current repository guide and memory files instead.

Do not merge the app into the static homepage, publish, deploy, or change live
Cloudflare settings unless Caroline explicitly requests and approves that work.

## Local development and architecture

From `app/`, run `pnpm dev`. See `app/README.md` for prerequisites and
first-time D1 migrations. The local homepage and three adventure routes are:
`/`, `/gratitude`, `/nature`, and `/kindness`.

Cloudflare Workers is the chosen hosting platform. Local development uses
Cloudflare-compatible D1 and R2 emulation under the ignored `app/.wrangler/`
directory; never point local development at production. D1 stores contribution
records and moderation state; R2 stores nature photographs. New contributions
are pending. A random HttpOnly visitor cookie lets the submitter retrieve their
own pending contributions after refresh; only its SHA-256 hash is stored.
Public feeds expose approved items, while pending items and images remain
private to their submitter and moderators. Moderation removes visitor ownership
when approving or rejecting.

Admin routes must continue validating Cloudflare Access JWTs and the
administrator email allowlist outside genuine local development. Local
development may use only the server-established, loopback-verified signed
identity; never accept a browser-selected flag or marker. Production admin
access remains Cloudflare Access plus the administrator email allowlist.

## Working rules

- Make precise, scoped changes and preserve existing appearance and behavior.
- Do not delete, overwrite, or modify archival snapshots or recovery files
  unless explicitly asked.
- Do not commit secrets, credentials, local databases, visitor photographs, or
  development-generated state. Keep `.env*`, `.dev.vars*`, dependencies,
  build output, and Wrangler state out of Git.
- If a change affects product direction or technical decisions, update
  `project-memory/DECISIONS.md` and `project-memory/STATUS.md`.
- Keep `project-memory/STATUS.md` aligned with what has actually been tested;
  distinguish verified behavior from planned work.
- No commit, push, publish, deploy, or production configuration change without
  explicit approval.
