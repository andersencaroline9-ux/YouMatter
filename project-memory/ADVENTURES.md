# ADVENTURES

The active application in `app/` contains the adventures below.

## Writing
- Writing is a primary website section and a curated collection, not a blog or
  publishing treadmill. Launch with 20 pieces in six editorial chapters; the
  chapters form an editorial journey rather than a taxonomy. Each piece has
  exactly one chapter home, public topic filters are removed, and detailed raw
  theme strings are not shown on the index. Preserve the supplied original
  writing, paragraph rhythm, supported emphasis, punctuation and Unicode.
- The locked chapter assignments are: 01 — WHEN LIFE DOESN'T QUITE FIT (Life
  Is Just 50 Shades of Grey; Money Really Isn’t Everything; When the Fire
  Starts to Fade; Dearest Money, Fuck Ever So Much Off!); 02 — LOVE, HAPPINESS
  & Other Complicated Things (It Was a BAD Morning; Are You Happy, Mommy?; Do
  You Know That Feeling?; Oh How You Love Her. Your Mom.; Today We Choose to
  Appreciate Each Other); 03 — NOTICE WHAT'S HERE (Take a Walk with Your
  Toddler; There’s Gold for Everyone; I Am So Very Grateful; Cursing at Beauty
  While Writing About Beauty); 04 — THE LITTLE CONNECTIONS BETWEEN US (The
  Kindness of Strangers; The Little Conversations That Connect Us; The Little
  Connections Between Us); 05 — THE PURSUIT OF FULFILMENT (By My Own
  Definition, I Am Successful; And So You Leap); 06 — IS THERE SOMETHING
  GREATER THAN US? (Meet Hilda: An Atheist Tries to Understand the Universe;
  You Matter).
- “There’s Gold for Everyone” uses the approved English translation and the
  source document’s coastal sunset photograph; preserve the original Danish as
  a separate version. On the landing page it appears only once, in its Chapter
  03 home; there is no separate featured story.
- Each chapter has one replaceable atmospheric image slot. Use the source
  sunset in Chapter 03 and existing real project photography in Chapter 04;
  Chapters 01, 02, 05, and 06 currently use explicit replaceable placeholders
  until suitable real photographs are provided. These chapter images represent
  chapters, not individual stories. Article pages use a quiet, reading-first
  editorial layout and verified provenance only.
- Writing appears in primary navigation. Keep restrained, genuinely relevant
  links between Writing pieces and the Adventures; do not imply a continuing
  content schedule.

## How Are You Doing? — preserved check-in and Community Tree
- The check-in infrastructure supports a human 1–10 response to “How are you
  doing today?” with an optional short comment, Anonymous/first-name identity,
  optional country, consent, visitor ownership, and moderation. It is not a
  psychological assessment, scientific measure, or wellbeing score.
- The public API exposes approved check-ins only; pending check-ins are
  retrievable only by their submitting visitor and protected admin reviewers.
- Each approved check-in counts as one eligible contribution toward the
  50-contribution tree-funding commitment; pending and rejected check-ins do
  not count. The product model is Share → Witness, with no public replies,
  likes, or messaging.
- The existing check-in form and approved-check-in Community Tree are implemented and preserved, but no longer rendered on the homepage. BOTH are intended for the future dedicated How Are You Doing? tab/page, which is not yet built. Approved check-ins contribute to the shared impact tally.
- Future links/tools for evidence-based wellbeing or happiness measures require separate research and licensing review. No measures or placeholder page are added by the final homepage task.

## Gratitude Garden
- Visitors enter three gratitudes and may choose a display name.
- Contributions are saved for moderation and remain visible only to the
  submitting browser while pending. Approved contributions appear in the shared
  garden for everyone.
- Uses D1-backed persistence. A complete approved group of three gratitudes counts as one impact contribution and one gratitude shared in the tally.

## Nature Mosaic
- Visitors submit a nature photograph, caption, and optional display name.
- Contributions are saved for moderation and their photographs remain visible
  only to the submitting browser while pending. Approved photographs appear in
  the shared mosaic for everyone.
- Uses D1 for submission records and R2 for image storage.

## The Kindness Tree
- Visitors share a kind act they gave, received, or witnessed.
- Contributions are saved for moderation and remain visible only to the
  submitting browser while pending. Approved acts appear in temporary shared
  story discovery as interactive leaves on the supplied Kindness Tree image.
- The tree shows a bounded sample of approved stories, while its displayed
  kindness total comes from the exact aggregate impact endpoint. “Show me a
  kindness” remains available, and pending stories are never shown as leaves.
- Uses D1-backed persistence. Each approved story counts as one impact contribution and one kindness noticed.

## The Strengths We Bring
- Visitors select three distinct labels from the 24 canonical character
  strengths they recognise in themselves; this is not a test or assessment.
- One submission stores the three strengths together as one contribution, with
  one optional combined reflection, identity/country choice, and moderation
  decision. Existing single-strength rows remain readable.
- An optional short reflection, Anonymous/first-name identity, optional
  country, consent, moderation, and visitor-owned pending visibility are
  supported.
- Contributions use the shared D1/admin moderation architecture. Each valid
  approved group of three strengths counts as one impact contribution and one
  strength recognised in the tally, and appears as one stone in the woodland
  wall. Only approved valid three-strength contributions are shown; pending
  submissions remain private to their visitor. A database-backed sequence is
  assigned on approval so a contribution retains its numbered place; the first
  20 sequence positions use the wall's deliberate placements.
- The page explains the reflective (non-assessment) practice and the VIA
  Classification. Visitors can join without taking VIA; the official survey
  link is optional and separate.
- The visitor journey is introduction → short WHY → three-strength practice →
  collective stone landscape → optional deeper science → collective meaning
  and impact. The personal prompt remains “What do you bring?”
- Each canonical strength has a short plain-English description. The optional
  reflection remains 240 characters; consent discloses that approved
  contributions may publicly show strengths, reflection, chosen name or
  Anonymous, and country when provided.

## RECONNECT — 30 Days in Nature
- The public page presents a 30-day guided nature and community experience:
  individual daily nature practice, daily sharing in a private WhatsApp group,
  opening and closing online gatherings, and facilitation throughout the
  month. Nature time is individual; participants do not meet physically for
  the daily practice.
- The pilot is for adults 18+, costs $44 per person, and has a maximum active
  cohort of 10. Joining the waiting list is interest only; it takes no payment
  and is not newsletter signup.
- D1 stores up to 20 unique normalized email addresses. Entries 1–10 are the
  initial cohort interest list; entries 11–20 are reserves. The public
  endpoint returns only safe aggregate counts capped at 10. Existing signup
  records are not changed when the cohort threshold changes.
- Payment and cohort confirmation remain manual; no payment functionality is
  implemented.

The local app uses isolated Cloudflare-compatible storage emulation. Admin
moderation remains protected by Cloudflare Access and is not available without
appropriate local identity configuration.
