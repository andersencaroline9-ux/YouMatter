# DECISIONS

## 2026-10-15 — The Strengths We Bring visitor experience
- The locked public adventure title is “The Strengths We Bring”; “What do you
  bring?” remains the personal practice prompt. Update visitor-facing title
  references consistently without rewriting historical decisions.
- The visitor journey is introduction → short WHY → exactly-three-strength
  practice → optional reflection/submission → approved-only collective stone
  landscape → deeper, cautious science/references → collective meaning and
  existing impact treatment.
- Keep exactly three distinct canonical VIA strengths, no score/ranking or
  assessment claim, and existing ownership, moderation, eligibility, impact,
  permanent sequence, and stone artwork systems. Short plain-English
  descriptions explain the canonical labels but are not database values.
- Disclose that approved strengths, optional reflection, chosen name or
  Anonymous, and optional country may appear publicly after review. Migration
  0009 remains a production deployment prerequisite; do not apply it remotely
  as part of this visitor-facing implementation.

## 2026-10-14 — Final homepage architecture (supersedes the earlier rebuild)
- The latest supplied reference is the approved homepage design. Order is navigation → photographic hero → real Together, so far tally with funding/progress → two-column approved WHY/six ideas → “Here, you don’t just read about these ideas. You try them.” → four adventures → You → Us → World → photographic closing tagline. No separate bottom tree-impact section.
- The homepage carries the main explanation of You Matter. Primary navigation is You Matter. | How are you doing? | Adventures | About. The brand is the home link; Adventures retains the real dropdown. Caroline explicitly requested that unfinished How are you doing? and About destinations be non-interactive labels, with no coming-soon messages, fake links or placeholder pages. Neither destination is built in this task. `/what-is-this` remains intact but is absent from primary navigation.
- Daily Check-in AND Community Tree move off the homepage. Preserve their existing implementations, artwork, API, data, moderation, visitor ownership and equal-value leaf behavior for the future dedicated How Are You Doing? tab/page. Caroline explicitly reaffirmed that BOTH must go into that tab. Future evidence-based wellbeing/happiness tools or links require a separate research/licensing task; none are built here.
- Together, so far consumes the unchanged real impact API: one eligible approved form equals one category entry and one contribution. Check-ins, waitlist and Nature Mosaic remain excluded. Zero statistics stay suppressed; the meaningful zero state remains. Confirmed funded/planted totals are independent of earned commitments. The progress bar/fraction/remaining count use the existing API fields; exact thresholds reset toward the next tree.
- The commitment is funding the planting of one tree for every 50 eligible approved contributions, not automatically confirmed planting. Caroline later requested a short reminder beneath Build something together; use “We fund the planting of one tree for every 50 eligible approved contributions.” This explicit follow-up permits that reminder while retaining no separate impact section.
- Caroline requested a slightly narrower Together, so far presentation during review. Its desktop content now uses 78% width with a 1040px cap; tablet/mobile retain their readable spacing.
- Keep the existing approved forest-path photograph. The new `homepage-final-artwork.png` supplies strictly cropped decorative and photographic fragments from the approved reference, with real HTML copy/controls and real API numbers. The earlier `homepage-approved-artwork.png`, check-in/tree sources and CSS are preserved separately. No adventure/backend/sequence/accounting/migration changes or publication are authorized.

- Caroline’s final review removes the “Explore the adventures” button from the main hero; adventure entry remains in the primary dropdown and the four cards.

## 2026-10-14 — Homepage rebuild from approved visual
- Supersedes the earlier homepage reference composition: the new supplied visual is the homepage design authority. Order is photographic hero → real “Together, so far” tally → paired Daily Check-in / Community Tree → organic divider → approved WHY and six ideas → “You try them” → four adventure cards → YOU → US → WORLD → real tree-funding commitment → closing tagline.
- The homepage now carries the primary explanation of You Matter. Primary navigation says “About”; until a personal About page is commissioned, it links to the homepage WHY (`/#why`). No `/about` route or biography is invented. `/what-is-this` remains intact and is still available from the existing footer.
- Preserve the existing photographic forest hero and Community Tree, live form/API behavior, approved-only check-ins, equal visual value for every leaf, and 12-leaf window. The reference's illustrated tree and mood counters are explicitly excluded from product logic. Include “You don’t have to be flourishing to belong here.”
- The tally uses the unchanged aggregate impact API and suppresses zero categories. Funded/planted trees use their independently confirmed fields, never earned totals. Bottom progress uses the existing next-tree fields. The commitment says: “For every 50 eligible approved contributions, we fund the planting of one tree.” No planting partner or automatic planting claim is added.
- Decorative icons, botanical details, mountains, seedling and photographic card fragments are displayed from the approved reference artwork; all product text, numbers, controls and links are real HTML. Existing adventure routes, stone assets and woodland photographs remain in use. Longer approved WHY text and the functional check-in make the page taller than the compact reference.
- This task permits local presentation edits and review only. No contribution/check-in creation or deletion, API/backend changes, migrations, commit, push, deployment or static GitHub Pages change.


## 2026-10-14 — Task 12B: identity and authoritative collective impact
- Website identity is “You Matter. You matter. We matter. What we do matters.” The former tagline may remain the book title; it is no longer the primary website tagline. This supersedes the tagline in the earlier banner decision, while retaining its forest image and the current WHY copy.
- Caroline approved the reference hero composition: “Together, so far” sits directly on the forest image beneath the identity, with navigation at the upper right. Final tally polish removes icons/dividers, shows only positive statistics, uses “We’re just getting started.” at zero, and shortens the dynamic next-tree progress caption to “n / 50”. The approved hero and welcome composition remain unchanged.
- One fully approved Gratitude form of exactly three rows counts as one contribution and one gratitude shared in the tally. One approved Kindness story is one contribution/kindness noticed. One approved Strengths form containing three distinct canonical strengths counts as one contribution and one strength recognised in the tally. Caroline explicitly confirmed one per form, so the category counts sum to total contributions. Historical ungrouped Gratitude and single-strength records remain unchanged and are excluded from this grouped impact calculation.
- Exclude Daily Check-ins, Live Adventure waiting-list entries, Nature Mosaic, pending/rejected/incomplete/mixed/invalid groups, and all other activity. Exact counts come from database aggregates, independently of visual sampling.
- The single shared impact helper/API uses 50 approved eligible contributions per earned/owed tree. Earned trees use floor(total/50); progress is total modulo 50; remaining is 50 minus progress, including 50 remaining at exact thresholds.
- Keep earned trees separate from manually confirmed funded/planted totals. A singleton D1 accounting record stores cumulative funded and planted totals, initially zero, with non-negative integer constraints and planted no greater than funded. Protected admin controls maintain it using the existing authorizer. Public “trees planted” uses only the stored planted count; confirmed funding is labelled separately. No partner API, planting dates, certificates, or external IDs are invented.
- Task 12B authorises local migration/testing only, with no commit, remote migration, publication, or deployment.

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
- Homepage check-ins are a separate moderated record type; each approved
  check-in counts as one eligible contribution toward the 50-contribution
  tree-funding commitment. Pending and rejected check-ins do not count. This
  supersedes the earlier exclusion from the shared total.
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
- Preserve visitor-owned pending visibility, identity/country handling, and impact integration. The shelter visual noted in the original implementation was later replaced by the Strengths woodland wall (Task 14A).

## 2026-10-14 — Task 14A: Strengths woodland wall
- One eligible approved form containing three distinct canonical strengths represents one contribution and one photorealistic stone, not three stones. Pending contributions never appear in the public wall.
- The wall begins as the supplied empty woodland image and uses 20 deliberate, ordered image positions with the 12 supplied transparent stone assets. The exact approved eligible Strengths tally remains sourced from `/api/impact`, independently of the rendered stones.
- At the time of Task 14A, the API had no permanent sequence and the first 20 slots were mapped by response order. This limitation was resolved by the Strengths permanent homes decision below.

## 2026-10-14 — Strengths permanent homes and WHY
- Supersedes Task 14A's temporary response-order placement: eligible approved Strengths forms receive a unique, persistent contribution sequence. Historical eligible approved forms are backfilled by approval time, then creation time when approval time is absent, with the private row ID as deterministic tie-breaker.
- Future first approvals allocate `MAX(contribution_sequence) + 1` inside the same atomic SQLite update that approves the form. A unique index prevents duplicate sequence values; concurrent writes serialize in D1, and re-approval preserves the original position. Pending and ineligible historical records remain unsequenced. The public API exposes the position only, never the database ID.
- The existing first 20 wall positions are selected by permanent sequence. The exact aggregate still comes from `/api/impact`; sequence positions after 20 remain counted but are not yet rendered. Expanding beyond 20 is a separate visual extension.
- Explain the 24 VIA character strengths without administering the VIA survey or implying a psychological assessment. Offer the official VIA Institute survey only as an optional external link.

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

## 2026-10-14 — Task 13A: Kindness Tree story leaves
- Keep approved Kindness story discovery on the supplied tree photograph using a bounded set of 18 interactive, keyboard-accessible leaf buttons. Leaves represent only approved stories from the existing API response; pending stories remain visitor-private and are not rendered on the tree.
- Preserve “Show me a kindness” as a separate way to discover any approved story in the API response. The displayed category total comes from the exact `/api/impact` aggregate, not the number of visible leaves.
- Do not change the Kindness data contract: it currently has no country/flag field. Do not change the API, database, moderation, submission, or impact accounting for this visual task.
