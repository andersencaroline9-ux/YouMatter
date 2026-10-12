# Source State and Provenance

## Live Site

- Title: You Matter — Choose Your Adventure
- Project ID: appgprj_6acce932a7c08191ae969e088d6b7562
- Access at export time: owner-private/custom
- Live version number: 2
- Live commit: 54186f1b29d247401d4a922095c8ae25d6b32ce0
- Earlier commit: 117982d48d0d1e0a45551e504f2561490f37aff3
- Live URL: https://you-matter-adventures.andersen205.chatgpt.site

## Snapshot folders

The two snapshot names retain their original provenance. After recovery, an approved source-only Cloudflare Access authorization patch was applied to both trees. They are therefore no longer byte-for-byte copies of their original source states. The tracked `site.tar.gz` files were not changed.

### website-source/deployed-baseline

Recovered source of live commit 54186f1b29d247401d4a922095c8ae25d6b32ce0, with the noted local admin-authorization patch.

Use this when the priority is reproducing what was actually deployed.

### website-source/current-working-copy

Copy of the local working tree at handover time. It includes uncommitted and untracked source work:

- multi-adventure impact barometers;
- impact count API changes;
- fourth Superpower adventure;
- superhero API, schema and migration;
- grouped VIA virtues;
- admin updates;
- CSS for the new experience.

Use this only after reviewing CURRENT-STATUS.md and KNOWN-BUGS.md.

## Validation recorded at recovery

- pnpm lint: completed with zero errors and three raw-img warnings.
- Sites production build: completed successfully.
- No deployment was performed.

The approved Cloudflare Access authorization patch is a later local change and must be validated separately. Neither patched tree has been deployed.

## Explicit exclusions

- node_modules;
- .git internals;
- local .wrangler state;
- local runtime/cache directories;
- .next and dist build output;
- environment files;
- credentials or secrets;
- database rows;
- R2 image objects;
- visitor submissions;
- transient old packaging archives not part of the selected snapshot.

The deployed baseline may contain a tracked site.tar.gz artifact because it was part of the original Git commit. It is not the source of truth; source files are.
