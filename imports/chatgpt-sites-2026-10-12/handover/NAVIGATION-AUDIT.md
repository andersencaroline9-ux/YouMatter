# Navigation Audit

Audit basis:

- deployed source commit 54186f1b29d247401d4a922095c8ae25d6b32ce0;
- unpublished working copy;
- successful production build on 12 October 2026;
- static source inspection.

This was not a browser automation run.

## Homepage

| Element | Target | Deployed baseline | Working copy | Assessment |
|---|---|---:|---:|---|
| Brand | #top | Yes | Yes | Same-page return to top |
| Adventures nav | #adventures | Yes | Yes | Correct section ID exists |
| The idea nav | #why | Yes | Yes | Correct section ID exists |
| Choose your adventure button | #adventures | Yes | Yes | Correct |
| Understand the idea button | #why | Yes | Yes | Correct |
| Gratitude card | /gratitude | Yes | Yes | Route exists |
| Nature card | /nature | Yes | Yes | Route exists |
| Kindness card | /kindness | Yes | Yes | Route exists |
| Superpower card | /superpower | No | Yes | Route exists only in unpublished working copy |
| Review submissions | /admin | Yes | Yes | Route exists; must not be public without auth |

## Shared adventure header

Every adventure rendered by AdventureShell contains:

| Element | Target | Assessment |
|---|---|---|
| You Matter brand | / | Correct absolute home link |
| The why | #why | Correct within each adventure |
| The practice | #practice | Correct within each adventure |
| All adventures | / | Correct |
| Back link | / | Correct |

## Shared adventure footer

| Element | Target | Assessment |
|---|---|---|
| Choose another adventure | / | Correct |

## Research links

Research links open in a new tab with noreferrer. Links are encoded in each page’s sources array.

### Gratitude

- DOI link for Emmons & McCullough (2003).
- DOI link for Seligman et al. (2005).

### Nature

- Frontiers article.
- PLOS ONE article.
- Hamann & Ivtzan paper page.

### Kindness

- DOI link for Curry et al. (2018).

### Superpower working copy

- official VIA survey registration page;
- official VIA 24 character strengths page.

## Form and interaction controls

These are buttons rather than navigation:

- garden flowers open gratitude popovers;
- tree tiles open photograph details;
- kindness bricks open action details;
- hero cards open strength reflections;
- close buttons dismiss overlays;
- support-impact buttons are intentionally disabled.

## Historical explanation for “broken adventure-selection links”

In version 1:

- Gratitude used an in-page #garden link;
- Nature and Kindness were article cards rather than anchors;
- their status was “Growing next”;
- they said “Coming soon.”

Therefore a report that the early homepage cards did not open adventures is correct for the original prototype. Version 2 changed them to real links and added real routes.

## What still needs browser testing

1. All homepage cards from the production deployment.
2. Back/forward browser navigation.
3. Sticky header behavior on mobile.
4. In-page anchors under the sticky header.
5. Keyboard focus order.
6. Overlay open/close and Escape behavior.
7. External research links.
8. /admin protection after real authorization is implemented.
9. 404 behavior for unknown paths.
10. Refresh behavior after each submission.

## Recommended regression test

For each viewport (mobile and desktop):

1. Load /.
2. Click every header link.
3. Open every adventure card.
4. On every adventure, use The why, The practice, All adventures and back links.
5. Submit valid and invalid form data in a non-production environment.
6. Refresh after a successful pending submission.
7. Approve it in an authenticated admin session.
8. Return to the adventure and confirm it appears.

