# Project status

Last reviewed: 2026-10-14

## Counting clarification — one per form

- Caroline confirmed that each eligible approved form counts once in its category and in the total: two Gratitude forms + one Kindness form + one Strengths form = 2 gratitudes shared, 1 kindness noticed, 1 strength recognised and 4 contributions. Removed the category-only multipliers of three; eligibility, total contributions, 50-contribution tree progress, database records and hero design are unchanged. This supersedes the individual-item category totals recorded in the earlier Task 12B checks below.
- Regression tests cover this exact example and verify category counts sum to the total. Impact tests, targeted ESLint, production build and whitespace checks passed. The local homepage was refreshed and verified to show 2 gratitudes, 1 kindness, 1 strength, 4 contributions and 4 / 50. No database records were changed.

## Task 12B — Identity and “Together, so far”

- Homepage identity is now “YOU MATTER.” with “You matter. We matter. What we do matters.” The shared footer and explanation-page primary tagline match. The current WHY text, banner photograph, landscape artwork, check-in/community tree, submission flows, and Live Adventure pricing remain unchanged by this task.
- The approved collective tally sits directly on the forest image beneath the identity. Final tally polish removes icons/dividers and shows positive statistics only, including planted trees only when the stored actual count is positive. At zero it says “We’re just getting started.” and “50 contributions and together we’ll fund our first tree.” The caption is dynamic “n / 50”; loading/unavailable states remain separate. Hero composition, impact calculation, database and contribution data were not changed for this polish.
- Replaced the Gratitude-only 100-threshold API with one authoritative 50-threshold calculation across complete approved three-message Gratitude groups, approved Kindness stories, and valid approved three-strength groups. A single D1 batch reads grouped aggregates without feed limits. Legacy singles/ungrouped rows, incomplete/mixed/invalid groups, pending/rejected activity, check-ins, the waitlist, and Nature Mosaic are excluded. Public output contains aggregate numbers only.
- Trees earned/owed are calculated separately from confirmed trees funded/planted. Migration `app/drizzle/0008_impact_accounting.sql` adds a constrained singleton accounting record initialized at zero. Applied to normal LOCAL D1 ONLY; no remote migration was run. Drizzle snapshot/journal are updated.
- `/api/admin/impact` GET/PATCH and the admin form reuse the shared authorizer for both Cloudflare Access and genuine signed-loopback development. Validation rejects invalid totals. Saving absolute cumulative totals is a minimal manual record, not a partner integration or event/audit ledger.
- Updated Gratitude's active PhysicalImpact presentation to consume the shared totals and 50-contribution rule. It no longer equates earned trees with planted trees or promises unrecorded planting details.
- Helper tests cover 0, 1, 49, 50, 51, 99, 100, and 73; next-tree boundaries; grouped/mixed/incomplete/legacy/malformed cases; separate actual tree counts; and accounting validation. An isolated local API fixture verified 4 Gratitude groups + 6 Kindness stories + 5 Strengths groups = 15 contributions, 12 gratitudes, 6 kindnesses, 15 strengths; excluded category records did not count. Its stored funding/planted values (2/1) remained independent of earned trees (0).
- Verified built admin GET/PATCH reject forged local proof; genuine signed local admin GET, invalid-total rejection, and save of unchanged zero totals pass. No real contribution records were modified or moderated, and no positive tree counts were entered into normal local state.
- Targeted ESLint passed with one existing admin-image warning; production build and diff whitespace checks passed. Full TypeScript diagnostics still fail in existing Nature/R2, admin-auth, and Gratitude helper code; no errors point to Task 12B code. Browser inspection confirmed real local totals (6 gratitudes, 2 kindnesses, 0 strengths, 4 contributions, 0 planted), desktop placement, and no mobile horizontal overflow.
- Final tally polish: targeted ESLint and production build passed; TypeScript diagnostics remain limited to existing unrelated Nature/R2, admin-auth and Gratitude helper errors. Render checks cover zero, one active category, several categories, actual planting and next-tree boundaries. Browser checks confirm the zero state and five positive statistics wrap without horizontal overflow at 390px. Only the tally component/CSS and these STATUS/DECISIONS notes changed for this polish.
- Remaining limitations: confirmed tree totals require manual reconciliation and refresh to appear; there is no partner synchronization or accounting event history. These results do not establish deployment readiness. No commit or deployment occurred.

## Homepage reference styling — 2026-10-14

- Restored/preserved the original You Matter banner and subtitle above the new welcome composition. Matched the supplied reference's WHY copy, serif scale, cream palette, two-column arrangement, and lower-right tree using a new clean background (`app/public/homepage-welcome-scene.png`). Existing artwork files remain intact.
- Kept check-in submission logic and approved-only community data unchanged. Updated desktop/mobile leaf coordinates for the new artwork; ratings never alter leaf appearance. Expanded form fields have a cream backing for contrast.
- Verified production build, targeted ESLint, and whitespace checks. Browser checks at 1536px desktop, 768px tablet, and 390px mobile confirmed responsive layout; tablet/mobile had no horizontal overflow. Verified restored banner, ten rating options, form expansion, and keyboard opening/closing of an existing approved check-in card. No new submission or moderation was performed.
- No API, database, admin, impact, adventure-route, static homepage, or production configuration changes were made for this styling task. No commit or deployment.

## Homepage check-in infrastructure — 2026-10-14

- Added a separate D1 `homepage_checkins` table for a 1–10 human check-in,
  optional comment, Anonymous/first-name identity, optional country, pending
  moderation status, timestamps, and hashed visitor ownership. A database check
  constraint and API validation both enforce the rating range.
- Added `/api/home-checkins`. Public `checkins` contain approved items and only
  rating, optional comment, display name, and country; a separate `pending`
  collection is returned only for the matching visitor token. No IDs, hashes,
  status, or timestamps are exposed in these API collections.
- Added check-ins to the existing protected admin submissions API and page.
  They use the shared moderation controls and are one record per check-in.
- Generated migration `0007_homepage_checkins` and applied it to local D1 only.
  The existing `0006` Drizzle snapshot had an invalid index-column shape; its
  metadata was corrected so Drizzle can generate future migrations. No
  historical SQL migration was changed, and remote D1 was not accessed.
- Validation created four clearly marked synthetic local check-ins, confirmed
  anonymous/first-name submission, rating/comment/country/consent validation,
  owner-only pending retrieval, approved-only public data, protected admin
  listing, and one test approval through the admin endpoint. All four
  synthetic rows were then deleted; the local check-in table is empty.
- Homepage UI and the community-tree visual were outside this infrastructure
  task. Check-ins do not count toward the 50-contribution commitment;
  `/api/impact` was not changed.
- Targeted ESLint passed with one existing raw-image warning. The production
  build and Drizzle no-change verification passed. Full TypeScript checking
  still reports existing errors in Nature/R2, impact, authentication, and
  Gratitude helper code; no new check-in type errors were reported.
- The local homepage and `/admin` returned HTTP 200. Homepage HTML retained its
  existing forest entrance and contained no check-in UI. Browser CDP navigation
  was unavailable, so visual browser inspection was not completed.

## Homepage front door — 2026-10-14

- Combined the opening “You Matter. / But this isn’t about you.” identity with
  the homepage WHY, optional 1–10 human check-in, and a small approved-only
  “How we’re doing” glimpse in one front-door composition before forest entry.
- Desktop places the short explanation beside the check-in and community
  glimpse. Mobile intentionally stacks check-in, community, then explanation.
  The invitation into the forest follows this welcome.
- The temporary community presentation uses only real approved check-ins and
  shows the first-leaves empty state when none exist. No community tree,
  average, ranking, or rating-based styling was added.
- The form uses `/api/home-checkins` with optional comment, Anonymous by
  default or first name, optional country, and established review consent.
  Pending check-ins are not shown publicly.
- The final living Community Tree remains future Task 12A.12C. No database,
  API, moderation, impact, or individual adventure behavior was changed.

## Homepage community tree — 2026-10-14

- Replaced the temporary approved-check-in list with a photograph-backed
  community tree using the existing `kindness-tree.png` woodland asset.
- Up to 12 approved check-ins from `/api/home-checkins` are represented by
  same-size, same-colour interactive leaves in deterministic API order.
  Selecting a leaf reveals only its public rating, display name, optional
  country, and optional comment. Pending check-ins are never rendered.
- The tree remains visible with zero approved check-ins; no interactive leaves
  or fake contributions are added in the empty state. This is a first-stage
  window, not an unlimited-growth engine.
- Removed the extra check-in eyebrow/questionnaire explanation and softened
  the divider between the WHY and human check-in areas. No backend, database,
  moderation, or impact behavior changed.

## Local development admin access — 2026-10-14

- Added a Vite development-only middleware that strips any client-provided
  `x-youmatter-local-admin-proof`, verifies a local hostname and loopback
  socket peer, then adds a short-lived HMAC proof signed with a random
  per-server secret.
- The shared admin authorizer accepts `local-admin@youmatter.test` only when
  that proof verifies. The secret and middleware are excluded from production
  builds and Vite preview; all admin routes retain independent authorization.
- Cloudflare Access JWT verification and the `ADMIN_EMAILS` allowlist remain
  unchanged for every request without a valid local proof.
- Verified `/admin` and the protected submission, Gratitude, and Live
  Adventure GET APIs return HTTP 200 at local port 5173; the four public
  adventure pages and homepage also return HTTP 200. A browser load displayed
  the existing admin interface.
- A client-supplied forged proof is replaced on same-origin loopback requests;
  a cross-origin forged request is denied. A direct request to the local
  Worker with a forged proof remains unauthorized.
- Targeted ESLint and the production build pass. The repository-wide
  TypeScript check still reports existing unrelated errors, including existing
  admin-page typing and optional R2 binding diagnostics.
- No contribution moderation was performed and aggregate local D1 row counts
  remained unchanged during the GET-only checks.

## Homepage simplification — 2026-10-14

- Kept the forest entrance, scenic sequence, adventure destinations, and Live
  Adventure pilot facts/link.
- Replaced the desktop-only “path to the left” label with “A quieter path,” and
  removed the static Live Adventure process sentence.
- Removed the redundant “Understand. Practise. Contribute.” section and the
  explanatory paragraph that duplicated `/what-is-this`. Retained
  “Wellbeing is personal. It is also collective.” as a concise bridge with a
  link to the explanation page.
- Removed the blank/placeholder impact progress UI and retained the approved
  50-contribution tree-funding commitment without a current count or progress.
- Static checks and editor diagnostics passed; browser, lint, and build checks
  were unavailable because Node.js and pnpm are not installed.

## What is this? page and navigation language — 2026-10-14

- Added `/what-is-this` as a conceptual explanation of the project, its
  evidence-informed approach, individual-to-collective pattern, four
  adventures, forest metaphor, and invitation to take part.
- Updated shared navigation to “What is this?” and “Go straight to the
  adventures”; the adventure disclosure and responsive/keyboard behavior are
  retained. The new page is also linked from the shared footer.
- Stated the commitment to fund one tree for every 50 approved contributions
  across You Matter without claiming trees have already been funded or planted.
- No Caroline biography, specific new research citations, impact counter,
  adventure behavior, backend, or payment functionality was added or changed.

## Shared site navigation and footer — 2026-10-14

- Added a shared header to the homepage, Gratitude Garden, Kindness Tree,
  What Do You Bring?, and 30 Days in Nature. It provides the four launch
  adventures and a link to the homepage idea section.
- Added a click-operated Adventures disclosure with Escape/outside-click
  dismissal, current-adventure indication, and a responsive mobile menu.
- Replaced duplicated footers with one shared footer linking Home and the four
  launch adventures, with the existing concise wellbeing disclaimer.
- Kept local Gratitude, Kindness, and Nature section navigation available.
  Nature remains directly accessible, but is not in the primary/footer links;
  `/admin` remains protected and is no longer advertised publicly.
- Editor diagnostics reported no errors for the changed TSX files and
  `git diff --check` passed. Browser, lint, and build checks could not run
  because Node.js and pnpm are unavailable in this environment.

## Live Adventure participant page — 2026-10-14

- Expanded `/live-adventure` with the daily nature practice, opening call,
  private WhatsApp check-ins, closing call, a short cautious nature/wellbeing
  explanation with existing references, clear boundaries, pilot price, and
  waiting-list next steps.
- Kept the temporary trailhead image, waiting-list form placement near the top,
  form component, API, schema, migration, reserve/capacity behavior, and admin
  list unchanged. No payment, newsletter, or cohort automation was introduced.
- Static copy checks, editor diagnostics, and `git diff --check` passed.
  Interactive responsive checks, lint, and build could not run because Node.js
  and pnpm are unavailable.

## Live Adventure waiting list — 2026-10-14

- `/live-adventure` now collects only first name and email for the 30 Days in
  Nature pilot. It explains the 18+ and no-commitment/no-payment conditions.
- A new D1 table stores at most 20 unique normalized email addresses. Its
  public endpoint returns aggregate interest data only, caps the displayed
  count at the 15-person group size, and distinguishes reserve availability.
- The separately protected admin endpoint exposes names, emails, dates, and
  first-15 versus reserve ordering. No participant data is added to the
  contribution moderation queue.
- No visitor-ownership token, newsletter consent, payment fields, Stripe,
  email sending, or cohort automation was added. Payments and confirmation
  remain manual.
- Local source/schema checks are recorded in the task report. Runtime tests,
  lint, and build could not run because Node.js is unavailable.

## What Do You Bring? shelter visual — 2026-10-14

- Installed the supplied 1365 × 768 shelter image unchanged at
  `app/public/strengths-shelter.png`.
- `/strengths` now presents the page invitation first, then a prominent
  semantic, aspect-ratio-preserving shelter photograph and the collective
  message, followed by the existing continuous contribution form and pending
  area.
- The shelter remains visible regardless of contribution count. After the
  contribution feed loads, a brief waiting message appears if it contains no
  approved contributions. No fake contributions or branch placements were
  added.
- The Task 8B form/API/data/moderation and `/api/impact` remain unchanged.
- Confirmed the installed image is byte-identical to the supplied file,
  checked its dimensions, received no editor diagnostics for the Strengths
  page/component, and passed `git diff --check`. Responsive layout is based on
  intrinsic image dimensions; interactive browser checks, lint, and build were
  unavailable because Node.js is not installed in this environment.

## What Do You Bring? contribution flow — 2026-10-14

- Replaced the `/strengths` placeholder with a concise introduction and one
  contribution form. Visitors select one of the 24 canonical character
  strengths, may add a short reflection, choose Anonymous or first name, pick
  an optional country, and must consent before submitting.
- Added `strengths_entries` with one row per contribution and a new D1 migration.
  The public API returns approved entries plus only the requesting visitor's
  pending entries. Visitor token hashes are never returned.
- Added Strengths submissions to the existing protected admin queue with
  country-aware display and approve/reject actions. Both moderation decisions
  clear visitor ownership; approval records its timestamp.
- Pending contributions remain visible to their submitting browser and are
  described as awaiting approval. No shelter artwork, placement fields, or
  impact integration were added. `/api/impact` remains unchanged.
- Verified the migration SQL in SQLite, checked all 24 canonical labels and
  Drizzle snapshot/journal links, checked API privacy/filtering and moderation
  source boundaries, and received no editor diagnostics or diff whitespace
  errors. Lint/build and live API checks could not run because Node.js is not
  available in this environment.

## What Do You Bring? grouped contribution — 2026-10-14

- Updated the Strengths experience to require exactly three distinct choices
  from the existing 24 labels. One submission, optional reflection, identity,
  consent, visitor ownership, and moderation remain one logical contribution.
- The three labels are serialized in the existing `strengths_entries.strength`
  text column; no schema or migration change was needed. Historical
  single-strength rows are read as one-item groups and remain unmodified.
- The public API returns sanitized approved contributions and only the
  requesting visitor's pending contributions. The protected admin queue shows
  the group's three labels as one moderation card.
- Read-only local verification found one pre-existing pending Strengths row.
  Its content was not reported, and it was not changed. Invalid API requests
  (one selection, duplicates, or missing consent) returned HTTP 400 and the
  pending count remained unchanged. The admin API returned HTTP 200 and
  decoded the legacy row as one strength.
- Targeted ESLint passed with two existing raw-image warnings. The production
  build passed. Full TypeScript checking still reports existing errors in
  admin, Nature, impact, and shared files; none point to the changed Strengths
  code. `git diff --check` passed. No contribution was submitted or moderated.

## Kindness Tree shell — 2026-10-14

- `/kindness` now presents The Kindness Tree. Removed the rendered wall, bricks, building labels, and wall-specific consent/confirmation copy. Existing WHY, research, nuance, and sources remain unchanged.
- Added a responsive placeholder and temporary approved-story disclosures before the WHY section. The original form follows the WHY section, with a separate own-pending story list. Story disclosures open with Enter/Space and closing restores focus to the trigger.
- The shared AdventureShell has an optional discovery slot; other callers retain their previous structure. The discovery and form sections each read the existing visitor-filtered Kindness API. Selection is reusable through KindnessStories.
- Verified build and lint (zero errors, four existing raw-image warnings elsewhere), `/kindness` and `/api/kindness` HTTP 200, approved-story keyboard selection, local form submission, tree-specific pending confirmation, pending persistence after refresh, and exclusion of that pending story from a request without its owner's cookie.
- Browser QA used a separate local test database and a synthetic approved story. Checked 1280px desktop, 768px tablet, and 390px mobile; tablet/mobile had no horizontal overflow. Captured desktop/mobile screenshots. Stopped the QA server and removed its disposable database afterward; normal local data was untouched.
- Full TypeScript checking still fails in unchanged admin, Nature, Gratitude, impact, and library files. No remaining Kindness type errors were reported after correcting response typings. Vinext build does not replace full TypeScript checking.
- No API, schema, migration, admin, moderation, impact, homepage, or other-adventure source changed for this task. No commit or deployment.
- Still to do: supply/approve the final tree image, integrate artwork, then design story discovery through the tree. No hotspots, leaves, tree growth, permanent positions, or “Show me a kindness” action were implemented.

## Gratitude garden continuation — 2026-10-14

- Restored the missing planting-layout module with nine deliberate positions (3 background, 4 middle, 2 foreground), including mobile coordinates, depth, scale, rotation, and layering.
- Added a registry containing only the current clearing and a pure cumulative-capacity mapping helper. Sequences beyond registered capacity return no location; no future backgrounds or navigation are fabricated.
- Removed the development bluebell and its preview CSS. All six flower PNGs and the variant registry remain intact. The scene reads its background from the clearing registry.
- Verified production build, lint (zero errors, three existing image warnings), mapping boundaries including synthetic unequal capacities, invalid sequence handling, presence of all six assets, and HTTP 200 for `/gratitude`, `/api/gratitudes`, and `/api/impact` using a local built preview on port 5174. Browser inspection confirmed the empty clearing background and absence of the preview flower.
- The nine reconstructed positions have not yet been visually tested with flowers on desktop and mobile. Copilot's nine-plant capacity assessment is reported context, not new visual verification. Permanent contribution sequences, real plant rendering, additional clearing photographs, and walking navigation remain to do.
- No API, database, moderation, ownership, impact, other-adventure, or public homepage changes were made in this continuation. No commit, push, or deployment occurred.

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
