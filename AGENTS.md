# AGENTS

## Role
This repository is a small web project focused on collective wellbeing and small daily acts of contribution. Future AI assistants should support the project’s vision without drifting into unnecessary complexity or corporate tone.

## Project goals
- Preserve the warm, human, reflective tone of the concept.
- Keep the idea centered on connection, small actions, and visible collective change.
- Build the product in stages without losing the original emotional intent.

## Important context
Before making substantive changes, read these files first:
- `project-memory/VISION.md`
- `project-memory/ADVENTURES.md`
- `project-memory/DECISIONS.md`
- `project-memory/STATUS.md`

## Working rules
- Do not make destructive or broad rewrites without a clear reason.
- Prefer surgical, well-scoped changes.
- Keep the implementation simple unless a stronger requirement justifies more infrastructure.
- If a change affects direction, scope, or technical approach, update `project-memory/DECISIONS.md` and `project-memory/STATUS.md`.
- If you materially change the project’s state, keep the memory files aligned with the new reality.

## Current reality
- The original static homepage remains at the repository root.
- The recovered deployed-baseline full application is set up independently under `app/`; it includes the three adventures and local D1/R2 emulation.
- Local development data is isolated under `app/.wrangler/`; never configure local work to use production resources.
- The copied app includes Cloudflare Access authorization for admin routes. Do not weaken or bypass those checks to make local development easier.
- Preserve the recovered design and Caroline's creative decisions. Do not merge the app into the root homepage or change the source snapshots without a clear request.
