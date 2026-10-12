# You Matter

The existing GitHub Pages homepage remains at the repository root in `index.html`.
The recovered deployed-baseline application is set up separately in [`app/`](./app/).

## Run the full website locally

From the repository root:

```sh
cd app
pnpm dev
```

Open <http://localhost:5173/>. The homepage and the Gratitude Garden, Nature
Mosaic, and Built From Kindness adventures are served by this local app.

The app uses local Cloudflare-compatible D1 and R2 emulation. Its development
data is stored under the ignored `app/.wrangler/` directory; it does not connect
to production or change any Cloudflare settings. Contributions are saved for
moderation. The admin area remains protected by Cloudflare Access and needs
separate local identity configuration before it can be used.

See [`app/README.md`](./app/README.md) for local feature and storage details.
