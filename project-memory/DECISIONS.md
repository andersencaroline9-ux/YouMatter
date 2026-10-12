# DECISIONS

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
- Prefer human-centered design over optimization or complexity.
- Preserve the original emotional intent of the concept even when the implementation is minimal.

## 2026-10-12 — External links
- The root static homepage retains its original separate hosting links.
- The recovered app has local adventure routes. Admin routes remain protected by Cloudflare Access JWT verification and an administrator email allowlist.
- Local development must not bypass authorization or use live Cloudflare configuration.
