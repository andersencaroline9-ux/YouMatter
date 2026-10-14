# ADVENTURES

The active application in `app/` contains the adventures below.

## Homepage community check-in
- The check-in infrastructure supports a human 1–10 response to “How are you
  doing today?” with an optional short comment, Anonymous/first-name identity,
  optional country, consent, visitor ownership, and moderation. It is not a
  psychological assessment, scientific measure, or wellbeing score.
- The public API exposes approved check-ins only; pending check-ins are
  retrievable only by their submitting visitor and protected admin reviewers.
- Check-ins remain separate from adventure contributions and do not count
  toward the 50-contribution tree-funding commitment. The product model is
  Share → Witness, with no public replies, likes, or messaging.
- The homepage form and approved-check-in community tree are implemented. They remain separate from the collective impact tally.

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
  story discovery beside the supplied Kindness Tree image.
- Visitors can ask to be shown one approved kindness story at a time.
- Uses D1-backed persistence. Each approved story counts as one impact contribution and one kindness noticed.

## What Do You Bring?
- Visitors select three distinct labels from the 24 canonical character
  strengths they recognise in themselves; this is not a test or assessment.
- One submission stores the three strengths together as one contribution, with
  one optional combined reflection, identity/country choice, and moderation
  decision. Existing single-strength rows remain readable.
- An optional short reflection, Anonymous/first-name identity, optional
  country, consent, moderation, and visitor-owned pending visibility are
  supported.
- Contributions use the shared D1/admin moderation architecture. The supplied
  woodland shelter photograph is installed as the collective visual; individual
  contributions are not yet placed on it. Each valid approved group of three
  strengths counts as one impact contribution and one strength recognised in the tally.

## Live Adventure — 30 Days in Nature
- The public page collects first name and email for a no-commitment waiting
  list; it takes no payment and is not newsletter signup.
- The participant page explains the daily 30-minute nature practice, the
  opening call, optional WhatsApp check-ins, closing call, cautious nature
  context, pilot price, and what happens after joining the list.
- D1 stores up to 20 unique normalized email addresses. The public endpoint
  returns only safe aggregate counts capped at the 15-person cohort target.
- The protected admin page separates the first 15 interested people from
  reserve entries. Interest is not payment or confirmed participation; cohort
  and payment management remain manual.

The local app uses isolated Cloudflare-compatible storage emulation. Admin
moderation remains protected by Cloudflare Access and is not available without
appropriate local identity configuration.
