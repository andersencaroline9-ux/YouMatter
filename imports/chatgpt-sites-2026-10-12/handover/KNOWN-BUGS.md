# Known Bugs and Risks

This file distinguishes verified behavior from Caroline’s reports and from preventive launch requirements.

## Severity 1 — must fix before public launch

### Admin authorization requires Cloudflare Access configuration

**Status:** Guard implemented in both recovered source trees; not configured or deployed.

The admin page, combined submissions API, legacy gratitude moderation API, and admin nature-image API now verify the Cloudflare Access JWT signature, issuer and audience, then check the signed email against a server-side allowlist. The app fails closed when the required configuration is absent or token verification is unavailable.

Before public access, configure the Cloudflare Access application and Worker variables/secrets `CF_ACCESS_TEAM_DOMAIN`, `CF_ACCESS_AUD` and `ADMIN_EMAILS`. Test unauthenticated, authenticated non-admin, and allowlisted admin requests against the deployed Worker. The live private Site has not been changed by this source patch.

### No automated abuse controls

**Status:** Verified absence.

There is no:

- automated text moderation;
- automated image safety screening;
- rate limiting;
- CAPTCHA/bot control;
- visitor report mechanism;
- duplicate/spam detection;
- moderation audit log.

Human approval is necessary but not sufficient for a public service.

### Legal/privacy work is incomplete

**Status:** Known gap.

There is no project-specific privacy notice, retention schedule, deletion request workflow, age policy, community standard or complete photo-content policy.

## Severity 2 — functional/experience bugs

### Pending contributions “disappear” after refresh

**Status:** Verified behavior and matches Caroline’s reported issue.

After POST succeeds, the form inserts the pending record into the browser’s component state. On refresh, GET returns approved records only. The pending entry is therefore no longer visible to the contributor until admin approval.

This does not necessarily mean the D1 row was lost. It is a continuity/feedback bug.

**Options:**

- show a submission receipt and clearly state that it will reappear only after approval;
- save a non-sensitive pending receipt ID locally;
- add visitor accounts and a private “my submissions” view;
- issue a one-time status link;
- avoid adding the pending contribution to the public creation at all and show a separate success state.

### Nature pending preview is session-only

**Status:** Verified.

The client uses URL.createObjectURL to display the just-uploaded pending image. It is local to that page session and disappears on refresh. The successful object URL is not revoked while the component remains active, creating a minor memory leak in long sessions.

### Impact meter at exact multiples of 100 may confuse

**Status:** Verified in unpublished working copy.

The barometer uses total modulo 100. At 100 approved items it reports one completed outcome, then shows 0 / 100 and 100 to go for the next outcome. Mathematically this is coherent but needs clearer copy such as “Next milestone: 0/100.”

### Fetch failures are inconsistently communicated

**Status:** Verified.

Several initial GET requests silently fall back to an empty visual rather than showing a helpful error. POST errors are generally handled better.

### Metadata is stale in the working copy

**Status:** Verified.

The root metadata still describes “gratitude, nature and kindness” even though the working copy homepage says four adventures. It also retains a development preview metadata field.

## Navigation history and reports

### Early Nature and Kindness cards were not links

**Status:** Verified historical issue in version 1; fixed in version 2 source.

The first commit used article elements and “Coming soon” text. Nature and Kindness had no routes.

### Reported incorrect homepage links / broken adventure selection

**Status:** Reported by Caroline; not reproduced in static audit of version 2.

The deployed version 2 source uses:

- /gratitude
- /nature
- /kindness

The working copy also adds /superpower.

All routes were found by the production build. A browser regression is still required because build-time route existence does not prove that every deployed click behaves correctly in every context.

See NAVIGATION-AUDIT.md.

## Moderation and content-integrity limitations

### Genuineness cannot be guaranteed

**Status:** Fundamental limitation.

File checks and human moderation can reduce abuse, but neither can prove that a story is true or that a photograph was taken by the submitter.

### Image validation is format-level, not safety-level

**Status:** Verified.

The server checks magic bytes for JPEG, PNG and WebP and enforces 5 MB. It does not scan for nudity, violence, hate symbols, personal data or manipulated content.

### Text moderation relies entirely on human review

**Status:** Verified.

Text length and enum validation exist. Semantic safety screening does not.

## Technical debt

### No automated tests

No unit, integration or end-to-end test suite was recovered.

### Raw img lint warnings

Three warnings concern raw img elements in nature display/admin. These are warnings, not build failures, but image loading strategy deserves review.

### Unused starter surface

The repository contains many reusable UI primitives and starter scripts that the project does not use directly. They add noise and should be removed only after confirming the portable build remains intact.

### Generic README

README.md is still the Vinext starter README rather than a You Matter onboarding document.

### Legacy admin API

app/api/admin/gratitudes/route.ts remains from the earlier implementation while the combined submissions route is now used. Confirm usage before removing it.

### No database indexes

The current tables have no explicit indexes on status, approved_at or created_at. Fine for a pilot; potentially slow at scale.

### No contributor ownership model

Entries are not tied to a stable user ID. Visitors cannot view, edit or delete their own submissions.

## Unpublished working-copy risks

### Superhero migration is not applied to production

The migration exists and the build passes, but deployment and production migration were deliberately not performed.

### Virtue is derived, not stored

The Superhero UI derives virtue from strength in client code. The database stores only strength and reflection. This is acceptable if mapping remains canonical, but reporting queries must repeat the mapping or add a stored/derived field.

### Real-world impact is not operational

No confirmed planting partner, charity, nature-care partner, payment route, budget or evidence workflow exists. Disabled buttons and “to be confirmed” wording must remain until the promise is real.
