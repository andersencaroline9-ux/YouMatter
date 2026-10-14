# DECISIONS

## 2026-10-14 — Homepage reference composition
- Preserve the original forest “You Matter. / But this isn’t about you.” banner above the welcome. Caroline explicitly confirmed it must remain.
- Match Caroline's supplied reference beneath it: cream background, serif WHY on the left, check-in and community tree on the right; mobile keeps check-in and community before the WHY. Use clean background artwork derived from the reference, with real HTML text/controls and approved-only leaves layered separately.
- Preserve the existing check-in API, consent, moderation, equal leaf styling, and adventure destinations. No publication or public GitHub Pages replacement is authorised.

## 2026-10-14 — Local development admin access
- The local Vite development server may establish admin access only for requests whose Host is localhost/loopback and whose socket peer is loopback. It strips client-supplied marker headers and adds a short-lived HMAC proof using a random per-server secret supplied only to the local Worker runtime.
- The shared admin authorizer accepts the synthetic `local-admin@youmatter.test` identity only when that proof verifies. Admin pages and every admin API continue to call the shared authorizer independently.
- Builds and Vite preview do not install the middleware or configure its secret. Outside genuine local development, admin access remains Cloudflare Access JWT verification plus the `ADMIN_EMAILS` allowlist. This is not a general authentication bypass.

## 2026-10-14 — Homepage welcome and community check-in
- The homepage emotional north star is arriving at your best friend's house: welcome the visitor before explaining the wellbeing proposition. The welcome combines a personal check-in with an immediate glimpse of the community.
- The optional 1–10 homepage check-in is human and social, not a scientific measure, assessment, diagnosis, happiness score, or wellbeing score. Future validated measures belong in a separate “Check in with yourself” area.
- Each approved check-in contributes one equally valued leaf to the community tree. Rating values must not affect leaf appearance. The homepage shares approved voices to witness them; do not add public replies, likes, reactions, advice, or messaging.
- Homepage check-ins are a separate moderated record type and count as zero toward the 50-approved-adventure-contribution tree-funding commitment.
- The homepage front door pairs the title and short positive-psychology WHY with an optional check-in and an approved-only community glimpse before forest entry. Mobile puts check-in and community before the WHY. Pending check-ins are private to their submitter and moderators, never part of the public check-in list.
- Task 12A.12C replaces the temporary glimpse with the existing woodland tree photograph and a deterministic window of up to 12 uniform, interactive leaves for approved check-ins only. Leaves do not encode rating; the tree remains visible with zero check-ins. This pilot window is not an unlimited growth engine.

## 2026-10-14 — Shared public site shell
- Use one shared site header and footer on the homepage and the four launch adventure routes.
- Primary navigation is limited to “What is this?” and “Go straight to the adventures.” The former leads to `/what-is-this`; the latter opens the four launch adventures.
- Adventures contains only Gratitude Garden, The Kindness Tree, What Do You Bring?, and 30 Days in Nature — Live. Do not promote the postponed Nature Mosaic or protected admin route in public navigation/footer.
- Preserve the homepage’s existing “The idea” section and useful page-specific section navigation separately from the global header.
- `/what-is-this` explains the shared wellbeing idea and the individual-to-collective model. State the commitment of one funded tree per 50 approved cross-adventure contributions without claiming any planting has already occurred.

## 2026-10-14 — What Do You Bring? contribution flow
- The Strengths adventure is self-recognition, not a VIA assessment, test, score, ranking, or “top strength” result. One chosen strength is one contribution.
- Define the 24 strength labels once in active app code, grouped by the six virtues; do not include assessment questions or scores.
- Use optional reflection, Anonymous/first-name identity, optional ISO alpha-2 country, required consent, visitor-owned pending visibility, and shared human moderation. Add one Strengths row per contribution.
- Keep Strengths out of `/api/impact` until the separate cross-adventure impact task. Do not add shelter artwork or visual placement data in this task.

## 2026-10-14 — Grouped What Do You Bring? contributions
- Supersedes the one-strength selection rule above: a visitor now selects exactly three distinct canonical strengths, submitted together as one contribution with one optional combined reflection.
- Preserve one D1 row and one moderation decision per contribution. Store the group in the existing text field as JSON; interpret historical single-strength rows as one-item groups. Do not backfill or discard historical rows.
- Keep the existing visitor-owned pending visibility, identity/country handling, and shelter visual. Do not add individual shelter placements or impact integration.

## 2026-10-14 — Kindness Tree visual shell
- Caroline authorised Task 7B: replace the public brick-wall experience at `/kindness` with The Kindness Tree. Preserve the existing WHY/research/nuance copy and submission, ownership, moderation, and backend behaviour.
- Use the supplied responsive tree image. Do not invent leaves, hotspots, or growth states.
- Approved story discovery uses “Show me a kindness” and selects one real approved story; the visitor's own pending stories remain separate.
- Keep the homepage unchanged for this task. The impact-counting mismatch noted in the prior audit remains separate work.

## 2026-10-14 — Gratitude clearing capacity
- Continue the woodland flower approach with a capacity designed for each photograph, rather than a universal 25-plant limit. Caroline's Copilot capacity review reported nine sensible positions for the current clearing: three background, four middle, two foreground.
- Register only the existing clearing. Its capacity comes from its position list; future clearings may have different capacities. Map future permanent sequences by cumulative capacity, preserving registry order and existing slots once assigned.
- Remove the development bluebell; retain all six approved flower assets. Real contributions are not yet connected to plants. Permanent backend sequence assignment remains a separate task.
- The layout file referenced by the recovered component was missing locally. Nine positions have been reconstructed; their visual placement with all flower variants still needs review before connecting contributions.

## 2026-10-12 — Project direction
- The project is framed around positive psychology, collective wellbeing, and small daily practices.
- The central idea is: "You Matter. But this isn't about you."
- The tone should feel warm, calm, welcoming, and human rather than clinical or corporate.

## 2026-10-12 — Product scope
- The repository root retains the lightweight static homepage for portability and GitHub Pages.
- The recovered deployed-baseline full application is kept separately in `app/` so the root homepage is not overwritten.
- The recovered app contains the three adventure pages, contribution flows, moderation, and storage integration; these are developed and tested in the standalone app.

## 2026-10-12 — Adventure structure
- The project centers on three core practices:
  - Gratitude Garden
  - Nature Mosaic
  - Built From Kindness
- Each adventure is positioned as a small, repeatable action that contributes to a collective whole.

## 2026-10-12 — Technical approach
- Use the recovered deployed-baseline application as the starting point for local full-site development.
- Local development uses Cloudflare-compatible D1/R2 emulation and must not connect to production.
- Keep the app isolated from the root static homepage until an explicit integration decision is made.
- Pending contributions are associated with a random per-browser HttpOnly cookie; D1 stores only its hash. Visitors can see their own pending items; public visitors see approved items only. Ownership hashes are cleared on moderation decisions.
- Prefer human-centered design over optimization or complexity.
- Preserve the original emotional intent of the concept even when the implementation is minimal.

## 2026-10-12 — External links
- The root static homepage retains its original separate hosting links.
- The recovered app has local adventure routes. Admin routes remain protected by Cloudflare Access JWT verification and an administrator email allowlist.
- Local development must not bypass authorization or use live Cloudflare configuration.

## 2026-10-12 — Repository source of truth and hosting
- `app/` is the authoritative full website and the only active application development target. Recovered source snapshots and handover material in `imports/` are archival references.
- Cloudflare Workers is the chosen hosting platform for the full application; production resources have not yet been connected or configured.
- Keep the existing root GitHub Pages homepage (`index.html` and `assets/style.css`) intact until the app is safely deployed, verified, and Caroline explicitly approves changing the public entry point.
- No production connection, deployment, publication, or live Cloudflare settings change is authorized by this decision.
