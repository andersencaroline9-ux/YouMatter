# File Inventory

This inventory lists every recovered source-snapshot file. “Baseline” and “Working” retain the provenance of the original deployed commit and unpublished local working copy. Both trees now also contain the approved local Cloudflare Access authorization patch. Generated dependency and runtime folders were intentionally excluded.

| File | Baseline | Working | Purpose |
|---|:---:|:---:|---|
| .gitignore | ✓ | ✓ | Git ignore rules; excludes dependencies, builds, local state and environment files. |
| .npmrc | ✓ | ✓ | Project package-manager configuration. |
| .openai/hosting.json | ✓ | ✓ | Sites hosting manifest; declares project ID and D1/R2 binding names. |
| README.md | ✓ | ✓ | Recovered Vinext starter setup and runtime documentation. |
| app/admin/layout.tsx | ✓ | ✓ | Server-side Cloudflare Access authorization gate for /admin. |
| app/admin/page.tsx | ✓ | ✓ | Page route for /admin. |
| app/adventures.css | ✓ | ✓ | Adventure pages, collective creations, moderation and impact styles. |
| app/api/admin/gratitudes/route.ts | ✓ | ✓ | Server API route for admin / gratitudes. |
| app/api/admin/nature/[id]/image/route.ts | ✓ | ✓ | Server API route for admin / nature / [id] / image. |
| app/api/admin/submissions/route.ts | ✓ | ✓ | Server API route for admin / submissions. |
| app/api/gratitudes/route.ts | ✓ | ✓ | Server API route for gratitudes. |
| app/api/impact/route.ts | ✓ | ✓ | Server API route for impact. |
| app/api/kindness/route.ts | ✓ | ✓ | Server API route for kindness. |
| app/api/nature/[id]/image/route.ts | ✓ | ✓ | Server API route for nature / [id] / image. |
| app/api/nature/route.ts | ✓ | ✓ | Server API route for nature. |
| app/api/superheroes/route.ts |  | ✓ | Server API route for superheroes. |
| app/chatgpt-auth.ts | ✓ | ✓ | Optional Sites/ChatGPT identity helper from the starter. |
| app/globals.css | ✓ | ✓ | Global design tokens, homepage, forms, garden and responsive styles. |
| app/gratitude/page.tsx | ✓ | ✓ | Page route for /gratitude. |
| app/kindness/page.tsx | ✓ | ✓ | Page route for /kindness. |
| app/layout.tsx | ✓ | ✓ | Root HTML layout and site metadata. |
| app/nature/page.tsx | ✓ | ✓ | Page route for /nature. |
| app/page.tsx | ✓ | ✓ | Page route for /. |
| app/superpower/page.tsx |  | ✓ | Page route for /superpower. |
| build/connector-preview-plugin.mjs | ✓ | ✓ | Tracked Sites/Vinext build/runtime support. |
| build/connector-preview-worker.mjs | ✓ | ✓ | Tracked Sites/Vinext build/runtime support. |
| build/sites-vite-plugin.LICENSE | ✓ | ✓ | Tracked Sites/Vinext build/runtime support. |
| build/sites-vite-plugin.ts | ✓ | ✓ | Tracked Sites/Vinext build/runtime support. |
| build/sites-worker.ts | ✓ | ✓ | Tracked Sites/Vinext build/runtime support. |
| cloudflare-env.d.ts | ✓ | ✓ | Type declarations for Cloudflare D1/R2 and Cloudflare Access authorization settings. |
| components.json | ✓ | ✓ | Reusable UI component-generator configuration. |
| components/adventure-shell.tsx | ✓ | ✓ | Shared adventure header, THE WHY, research, practice and footer structure. |
| components/connector-error.tsx | ✓ | ✓ | Starter connector error presentation component. |
| components/gratitude-practice.tsx | ✓ | ✓ | Gratitude form, local pending state and visual garden. |
| components/kindness-practice.tsx | ✓ | ✓ | Kindness form, brick wall and detail interaction. |
| components/nature-practice.tsx | ✓ | ✓ | Nature upload form, tree mosaic and photo detail interaction. |
| components/physical-impact.tsx | ✓ | ✓ | Approved-count impact barometer / physical-outcome panel. |
| components/superhero-practice.tsx |  | ✓ | Unpublished VIA strengths reflection and six-virtue Superhero Wall. |
| components/ui/accordion.tsx | ✓ | ✓ | Reusable starter UI primitive: accordion. |
| components/ui/alert-dialog.tsx | ✓ | ✓ | Reusable starter UI primitive: alert-dialog. |
| components/ui/alert.tsx | ✓ | ✓ | Reusable starter UI primitive: alert. |
| components/ui/aspect-ratio.tsx | ✓ | ✓ | Reusable starter UI primitive: aspect-ratio. |
| components/ui/attachment.tsx | ✓ | ✓ | Reusable starter UI primitive: attachment. |
| components/ui/avatar.tsx | ✓ | ✓ | Reusable starter UI primitive: avatar. |
| components/ui/badge.tsx | ✓ | ✓ | Reusable starter UI primitive: badge. |
| components/ui/breadcrumb.tsx | ✓ | ✓ | Reusable starter UI primitive: breadcrumb. |
| components/ui/bubble.tsx | ✓ | ✓ | Reusable starter UI primitive: bubble. |
| components/ui/button-group.tsx | ✓ | ✓ | Reusable starter UI primitive: button-group. |
| components/ui/button.tsx | ✓ | ✓ | Reusable starter UI primitive: button. |
| components/ui/calendar.tsx | ✓ | ✓ | Reusable starter UI primitive: calendar. |
| components/ui/card.tsx | ✓ | ✓ | Reusable starter UI primitive: card. |
| components/ui/carousel.tsx | ✓ | ✓ | Reusable starter UI primitive: carousel. |
| components/ui/chart.tsx | ✓ | ✓ | Reusable starter UI primitive: chart. |
| components/ui/checkbox.tsx | ✓ | ✓ | Reusable starter UI primitive: checkbox. |
| components/ui/collapsible.tsx | ✓ | ✓ | Reusable starter UI primitive: collapsible. |
| components/ui/combobox.tsx | ✓ | ✓ | Reusable starter UI primitive: combobox. |
| components/ui/command.tsx | ✓ | ✓ | Reusable starter UI primitive: command. |
| components/ui/context-menu.tsx | ✓ | ✓ | Reusable starter UI primitive: context-menu. |
| components/ui/dialog.tsx | ✓ | ✓ | Reusable starter UI primitive: dialog. |
| components/ui/direction.tsx | ✓ | ✓ | Reusable starter UI primitive: direction. |
| components/ui/drawer.tsx | ✓ | ✓ | Reusable starter UI primitive: drawer. |
| components/ui/dropdown-menu.tsx | ✓ | ✓ | Reusable starter UI primitive: dropdown-menu. |
| components/ui/empty.tsx | ✓ | ✓ | Reusable starter UI primitive: empty. |
| components/ui/field.tsx | ✓ | ✓ | Reusable starter UI primitive: field. |
| components/ui/form.tsx | ✓ | ✓ | Reusable starter UI primitive: form. |
| components/ui/hover-card.tsx | ✓ | ✓ | Reusable starter UI primitive: hover-card. |
| components/ui/input-group.tsx | ✓ | ✓ | Reusable starter UI primitive: input-group. |
| components/ui/input-otp.tsx | ✓ | ✓ | Reusable starter UI primitive: input-otp. |
| components/ui/input.tsx | ✓ | ✓ | Reusable starter UI primitive: input. |
| components/ui/item.tsx | ✓ | ✓ | Reusable starter UI primitive: item. |
| components/ui/kbd.tsx | ✓ | ✓ | Reusable starter UI primitive: kbd. |
| components/ui/label.tsx | ✓ | ✓ | Reusable starter UI primitive: label. |
| components/ui/marker.tsx | ✓ | ✓ | Reusable starter UI primitive: marker. |
| components/ui/menubar.tsx | ✓ | ✓ | Reusable starter UI primitive: menubar. |
| components/ui/message-scroller.tsx | ✓ | ✓ | Reusable starter UI primitive: message-scroller. |
| components/ui/message.tsx | ✓ | ✓ | Reusable starter UI primitive: message. |
| components/ui/native-select.tsx | ✓ | ✓ | Reusable starter UI primitive: native-select. |
| components/ui/navigation-menu.tsx | ✓ | ✓ | Reusable starter UI primitive: navigation-menu. |
| components/ui/pagination.tsx | ✓ | ✓ | Reusable starter UI primitive: pagination. |
| components/ui/popover.tsx | ✓ | ✓ | Reusable starter UI primitive: popover. |
| components/ui/progress.tsx | ✓ | ✓ | Reusable starter UI primitive: progress. |
| components/ui/radio-group.tsx | ✓ | ✓ | Reusable starter UI primitive: radio-group. |
| components/ui/resizable.tsx | ✓ | ✓ | Reusable starter UI primitive: resizable. |
| components/ui/scroll-area.tsx | ✓ | ✓ | Reusable starter UI primitive: scroll-area. |
| components/ui/select.tsx | ✓ | ✓ | Reusable starter UI primitive: select. |
| components/ui/separator.tsx | ✓ | ✓ | Reusable starter UI primitive: separator. |
| components/ui/sheet.tsx | ✓ | ✓ | Reusable starter UI primitive: sheet. |
| components/ui/sidebar.tsx | ✓ | ✓ | Reusable starter UI primitive: sidebar. |
| components/ui/skeleton.tsx | ✓ | ✓ | Reusable starter UI primitive: skeleton. |
| components/ui/slider.tsx | ✓ | ✓ | Reusable starter UI primitive: slider. |
| components/ui/sonner.tsx | ✓ | ✓ | Reusable starter UI primitive: sonner. |
| components/ui/spinner.tsx | ✓ | ✓ | Reusable starter UI primitive: spinner. |
| components/ui/switch.tsx | ✓ | ✓ | Reusable starter UI primitive: switch. |
| components/ui/table.tsx | ✓ | ✓ | Reusable starter UI primitive: table. |
| components/ui/tabs.tsx | ✓ | ✓ | Reusable starter UI primitive: tabs. |
| components/ui/textarea.tsx | ✓ | ✓ | Reusable starter UI primitive: textarea. |
| components/ui/toggle-group.tsx | ✓ | ✓ | Reusable starter UI primitive: toggle-group. |
| components/ui/toggle.tsx | ✓ | ✓ | Reusable starter UI primitive: toggle. |
| components/ui/tooltip.tsx | ✓ | ✓ | Reusable starter UI primitive: tooltip. |
| db/index.ts | ✓ | ✓ | Creates the Drizzle client from the Cloudflare D1 DB binding. |
| db/schema.ts | ✓ | ✓ | Authoritative Drizzle table definitions. |
| drizzle.config.ts | ✓ | ✓ | Drizzle migration-generation configuration. |
| drizzle/0000_large_rocket_raccoon.sql | ✓ | ✓ | SQL database migration. |
| drizzle/0001_heavy_baron_zemo.sql | ✓ | ✓ | SQL database migration. |
| drizzle/0002_powerful_steve_rogers.sql |  | ✓ | SQL database migration. |
| drizzle/meta/0000_snapshot.json | ✓ | ✓ | Drizzle migration snapshot/journal metadata. |
| drizzle/meta/0001_snapshot.json | ✓ | ✓ | Drizzle migration snapshot/journal metadata. |
| drizzle/meta/0002_snapshot.json |  | ✓ | Drizzle migration snapshot/journal metadata. |
| drizzle/meta/_journal.json | ✓ | ✓ | Drizzle migration snapshot/journal metadata. |
| eslint.config.mjs | ✓ | ✓ | ESLint configuration. |
| examples/d1/app/api/notes/route.ts | ✓ | ✓ | Starter D1 example; not part of the bespoke visitor experience. |
| examples/d1/db/schema.ts | ✓ | ✓ | Starter D1 example; not part of the bespoke visitor experience. |
| hooks/use-mobile.ts | ✓ | ✓ | Reusable responsive/mobile React hook. |
| lib/connector-context.ts | ✓ | ✓ | Sites/connector runtime helper or shared utility. |
| lib/connector-contract.mts | ✓ | ✓ | Sites/connector runtime helper or shared utility. |
| lib/connector-errors.mts | ✓ | ✓ | Sites/connector runtime helper or shared utility. |
| lib/connector-preview.d.ts | ✓ | ✓ | Sites/connector runtime helper or shared utility. |
| lib/connectors.ts | ✓ | ✓ | Sites/connector runtime helper or shared utility. |
| lib/admin-auth.ts | ✓ | ✓ | Verifies Cloudflare Access JWTs and enforces the configured administrator email allowlist. |
| lib/utils.ts | ✓ | ✓ | Sites/connector runtime helper or shared utility. |
| next.config.ts | ✓ | ✓ | Next/Vinext framework configuration. |
| package.json | ✓ | ✓ | Project scripts, runtime constraints and dependency declarations. |
| pnpm-lock.yaml | ✓ | ✓ | Exact pnpm dependency lockfile. |
| pnpm-workspace.yaml | ✓ | ✓ | pnpm workspace configuration. |
| postcss.config.mjs | ✓ | ✓ | PostCSS/Tailwind processing configuration. |
| public/favicon.svg | ✓ | ✓ | Static public asset. |
| public/file.svg | ✓ | ✓ | Static public asset. |
| public/globe.svg | ✓ | ✓ | Static public asset. |
| public/window.svg | ✓ | ✓ | Static public asset. |
| scripts/build-verified.sh | ✓ | ✓ | Tracked installation, environment, preview or build helper. |
| scripts/connector-preview/connector-preview-session.mjs | ✓ | ✓ | Tracked installation, environment, preview or build helper. |
| scripts/connector-preview/host-binding.mjs | ✓ | ✓ | Tracked installation, environment, preview or build helper. |
| scripts/connector-preview/protocol.mjs | ✓ | ✓ | Tracked installation, environment, preview or build helper. |
| scripts/execution-profile.mjs | ✓ | ✓ | Tracked installation, environment, preview or build helper. |
| scripts/install-ci.mjs | ✓ | ✓ | Tracked installation, environment, preview or build helper. |
| scripts/install-ci.sh | ✓ | ✓ | Tracked installation, environment, preview or build helper. |
| scripts/install-pnpm.sh | ✓ | ✓ | Tracked installation, environment, preview or build helper. |
| scripts/npm-install.mjs | ✓ | ✓ | Tracked installation, environment, preview or build helper. |
| scripts/pnpm-install.mjs | ✓ | ✓ | Tracked installation, environment, preview or build helper. |
| scripts/run-framework.mjs | ✓ | ✓ | Tracked installation, environment, preview or build helper. |
| scripts/sites-env.mjs | ✓ | ✓ | Tracked installation, environment, preview or build helper. |
| scripts/sites-env.sh | ✓ | ✓ | Tracked installation, environment, preview or build helper. |
| site.tar.gz | ✓ | ✓ | Tracked historical deployment build archive; not the source of truth. |
| tsconfig.json | ✓ | ✓ | TypeScript compiler configuration. |
| vendor/shadcn-tailwind-4.13.0.LICENSE.md | ✓ | ✓ | Vendored stylesheet or third-party license. |
| vendor/shadcn-tailwind-4.13.0.css | ✓ | ✓ | Vendored stylesheet or third-party license. |
| vite.config.ts | ✓ | ✓ | Vite/Vinext build and local binding configuration. |

## Handover documents

- README-FIRST.md — entry point and reading order.
- MIGRATION-GUIDE.md — safe import into andersencaroline9-ux/YouMatter.
- handover/MASTER-HANDOVER.md — creative, product and technical memory.
- handover/CURRENT-STATUS.md — completed, partial and planned work.
- handover/KNOWN-BUGS.md — triaged bugs, risks and limitations.
- handover/NAVIGATION-AUDIT.md — route/link audit and regression checklist.
- handover/SOURCE-STATE.md — provenance and snapshot distinction.
- handover/ARCHITECTURE.md — data flows, tables, APIs and trust boundaries.
- handover/FILE-INVENTORY.md — this inventory.

## Exclusions

No node_modules, .git directory, .next, dist, .wrangler state, Sites local runtime state, environment files, credentials, D1 rows, R2 image objects or visitor submissions are included.
