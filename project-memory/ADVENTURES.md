# ADVENTURES

The recovered deployed-baseline application in `app/` contains these three
adventures. Their original design and content are preserved from the recovered
source.

## Gratitude Garden
- Visitors enter three gratitudes and may choose a display name.
- Contributions are saved for moderation and remain visible only to the
  submitting browser while pending. Approved contributions appear in the shared
  garden for everyone.
- Uses D1-backed persistence.

## Nature Mosaic
- Visitors submit a nature photograph, caption, and optional display name.
- Contributions are saved for moderation and their photographs remain visible
  only to the submitting browser while pending. Approved photographs appear in
  the shared mosaic for everyone.
- Uses D1 for submission records and R2 for image storage.

## Built From Kindness
- Visitors share a kind act they gave, received, or witnessed.
- Contributions are saved for moderation and remain visible only to the
  submitting browser while pending. Approved acts appear on the shared wall
  for everyone.
- Uses D1-backed persistence.

The local app uses isolated Cloudflare-compatible storage emulation. Admin
moderation remains protected by Cloudflare Access and is not available without
appropriate local identity configuration.
