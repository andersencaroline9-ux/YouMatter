// Nature Mosaic is switched off for the public launch. Set to true to revive
// the /nature page and its public submission/viewing APIs.
export const NATURE_MOSAIC_PUBLIC_ENABLED = false;

export function natureMosaicDisabledResponse() {
  return new Response("Not found", { status: 404 });
}
