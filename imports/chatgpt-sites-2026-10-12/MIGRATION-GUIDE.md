# Migration Guide

Target repository supplied by Caroline:

andersencaroline9-ux/YouMatter

The target repository already contains a homepage and project-memory files. This export must **not** be copied over it wholesale.

## 1. Choose the source state deliberately

This ZIP contains:

- website-source/deployed-baseline — exact live private version;
- website-source/current-working-copy — later unpublished code.

Recommended default:

1. Import deployed-baseline as the historical/canonical ChatGPT Sites implementation.
2. Import current-working-copy separately as a comparison branch or dated import.
3. Decide feature by feature what belongs in the target repository.

## 2. Create a safety branch

From the existing GitHub repository:

~~~bash
git status
git add -A
git commit -m "Checkpoint before ChatGPT Sites handover"
git switch -c import/chatgpt-sites-handover
~~~

If the repository is not clean, stop and understand the existing changes before continuing.

## 3. Import without overwriting

Safest first import:

~~~text
YouMatter/
├── existing homepage and project memory
└── imports/
    └── chatgpt-sites-2026-10-12/
        ├── deployed-baseline/
        └── current-working-copy/
~~~

Copy the two snapshot folders into that import location. Commit them before attempting integration.

~~~bash
git add imports/chatgpt-sites-2026-10-12
git commit -m "Import ChatGPT Sites source and handover snapshots"
~~~

This preserves provenance and makes all later movement reviewable.

## 4. Compare technology before merging

The recovered implementation uses:

- Node.js 22.13 or later;
- pnpm;
- React 19;
- Next-style App Router;
- Vinext/Vite;
- Cloudflare Workers;
- D1 + Drizzle;
- R2 object storage.

Before merging routes into the repository root, inspect the target repository’s:

- package.json;
- lockfile and package manager;
- framework;
- deployment provider;
- app/src directory convention;
- database/storage approach;
- existing homepage routes;
- project-memory instructions.

Do not replace any of those files until the differences are understood.

## 5. Recommended integration strategies

### Strategy A — Preserve as a standalone application

Best when the existing repository uses a different stack.

Place the recovered app under:

~~~text
apps/you-matter-adventures/
~~~

Then configure the repository as a workspace or run that app independently.

### Strategy B — Merge route by route

Best when the existing repository already uses a compatible Next/App Router structure.

Suggested order:

1. copy brand CSS tokens and shared AdventureShell;
2. integrate the homepage card section without replacing existing homepage memory/content;
3. add /gratitude and its API/storage;
4. add /nature and R2-compatible storage;
5. add /kindness;
6. add /admin only after implementing real authorization;
7. optionally add /superpower;
8. integrate impact barometers only after partner decisions.

### Strategy C — Reimplement the experience in the existing stack

If the target stack is incompatible, treat the recovered JSX/CSS as authoritative reference and rewrite carefully. Document every intentional divergence. Do not call a rewrite “the original implementation.”

## 6. Local setup for the recovered app

From a standalone copy of either snapshot:

~~~bash
corepack enable
pnpm install --frozen-lockfile
pnpm lint
pnpm build
~~~

If package scripts differ after integration, use the target repository’s established commands.

The recovered README describes the Sites/Vinext local runtime in detail. It is a starter README and should eventually be replaced with project-specific setup notes.

## 7. Database migration

Recovered migrations:

1. 0000_large_rocket_raccoon.sql — gratitudes.
2. 0001_heavy_baron_zemo.sql — kindness and nature.
3. 0002_powerful_steve_rogers.sql — superhero entries; unpublished only.

Important:

- Do not mark migration 0002 as production-applied without checking.
- Do not import production visitor rows from this ZIP; they are not included.
- Add indexes if the project grows.
- Decide whether contribution ownership/user IDs are required before public launch.

## 8. Storage migration

Nature photographs currently assume:

- D1 metadata row;
- R2 object key;
- BUCKET binding;
- server-side approval before public delivery.

If moving away from Cloudflare:

- preserve private-by-default upload storage;
- preserve server-side MIME/signature validation;
- preserve rejection deletion;
- serve only approved images publicly;
- never expose storage credentials to the browser.

## 9. Environment and secrets

The ZIP intentionally contains no secret environment values.

The hosting manifest contains only binding names and the Site project identifier. Do not put credentials into that file.

Create the target environment through the chosen host’s secret manager.

## 10. Protect moderation before public access

Both recovered source trees now contain an application-level Cloudflare Access JWT check for the admin page, combined submissions API, legacy gratitude moderation API, and admin nature-image API. The checks validate the assertion signature, issuer and application audience, and then enforce a server-side administrator email allowlist.

Configure these values in the Cloudflare Worker environment; never commit live values or credentials:

- `CF_ACCESS_TEAM_DOMAIN` — the HTTPS team issuer hostname, for example `https://<team-name>.cloudflareaccess.com`;
- `CF_ACCESS_AUD` — the Cloudflare Access application's Audience (AUD) tag;
- `ADMIN_EMAILS` — comma-separated email addresses permitted to administer the site.

Protect the application routes with a Cloudflare Access policy and ensure the Worker receives `Cf-Access-Jwt-Assertion`. Missing configuration denies admin access. Test unauthenticated, non-allowlisted, and allowlisted requests before deployment. This source patch has not been configured or deployed.

Before making any integrated version public:

1. configure and test the Cloudflare Access application and Worker allowlist;
2. retain Access policies as defense in depth on /admin and every admin API/image route;
3. add text and image safety screening;
4. add rate limiting and bot protection;
5. add a report mechanism;
6. write privacy/retention/community policies;
7. test rejection and deletion behavior.

## 11. Resolve the pending-submission experience

Current behavior:

- POST stores a pending row;
- UI displays it immediately;
- refresh fetches approved rows only;
- pending item disappears until approval.

Choose and test a replacement experience before release. See KNOWN-BUGS.md.

## 12. Navigation integration

The current routes are:

- /
- /gratitude
- /nature
- /kindness
- /admin
- /superpower in the working copy.

If the existing repository already owns any route, rename or nest intentionally. Do not silently replace the existing homepage.

Use NAVIGATION-AUDIT.md as the regression checklist.

## 13. GitHub Copilot orientation prompt

After importing the handover, give Copilot this instruction:

> Read README-FIRST.md, MASTER-HANDOVER.md, CURRENT-STATUS.md, KNOWN-BUGS.md, NAVIGATION-AUDIT.md, SOURCE-STATE.md and MIGRATION-GUIDE.md before proposing changes. Preserve established copy, metaphors and safety decisions. Distinguish deployed baseline from unpublished work. Do not overwrite the existing homepage or project-memory files. Do not publish, enable payments or make charitable promises without Caroline’s explicit approval.

## 14. Suggested first pull request

The first PR should contain only:

- the handover documents;
- the two source snapshots under an imports/ folder;
- no route replacement;
- no dependency change;
- no deployment change.

The second PR can document the chosen integration architecture.

The third and later PRs can move one adventure at a time.

## 15. Completion checklist

- [ ] Existing repository checkpointed.
- [ ] Import branch created.
- [ ] Both snapshots added without overwriting.
- [ ] Handover documents committed.
- [ ] Target stack compared.
- [ ] Canonical next baseline chosen.
- [ ] Admin security designed.
- [ ] Pending-submission UX designed.
- [ ] Navigation tests added.
- [ ] Storage/environment plan documented.
- [ ] Caroline approves release scope.
