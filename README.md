# FundedYouth Changelog Feed

A fun, interactive, high-energy changelog hub and subscription feed for the FundedYouth community to track updates across Public Site, User Portal, The Vault, Docs, and Curriculum.

<img src="./app-preview.png"/>

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `pnpm install`
2. Run the app:
   `pnpm dev`

## Managing Content

This is a fully static site — all updates are loaded from a single data file
(`public/data/changelog.json`), and the RSS / JSON feeds are generated from it.

See **[HowTo.md](./HowTo.md)** for a full guide on adding updates, managing apps,
writing markdown descriptions, regenerating the feeds, and deploying.

## Deploy to Cloudflare Pages

The site is a static Vite build, so Cloudflare Pages serves it directly with no
server runtime. You can deploy via the dashboard (Git integration) or the CLI.

### Option A — Connect your Git repo (recommended)

1. In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages →
   Connect to Git** and select this repository.
2. Configure the build settings:

   | Setting | Value |
   |---------|-------|
   | Framework preset | `None` (or `Vite`) |
   | Build command | `pnpm build` |
   | Build output directory | `dist` |
   | Production branch | `main` |

3. Add an environment variable so the generated feeds use absolute URLs
   (under **Settings → Environment variables**):

   | Variable | Value |
   |----------|-------|
   | `SITE_URL` | `https://changelog.yourdomain.org` (your production URL) |

   Cloudflare Pages auto-detects the `packageManager` field / `pnpm-lock.yaml`
   and installs with pnpm. If you need to pin it, set `NODE_VERSION` (e.g. `20`)
   as well.

4. Click **Save and Deploy**. Every push to `main` triggers a new production
   deploy; pushes to other branches get preview deployments.

### Option B — Direct upload with Wrangler

Build locally and push the `dist/` folder with the Cloudflare CLI:

```bash
# Build with your production URL baked into the feeds
SITE_URL=https://changelog.yourdomain.org pnpm build

# Publish dist/ to a Pages project (creates it on first run)
npx wrangler pages deploy dist --project-name fy-changelog
```

### Custom domain

After the first deploy, open the Pages project → **Custom domains → Set up a
custom domain** and add your domain (e.g. `changelog.yourdomain.org`).
Cloudflare provisions the TLS certificate automatically. Make sure the
`SITE_URL` value matches this domain so `/feed.xml` and `/feed.json` contain the
correct absolute links.

> **Note:** `pnpm build` runs the feed generator before `vite build`, so the
> deployed site always ships fresh `/feed.xml`, `/feed.json`, and
> `/data/changelog.json`. See [HowTo.md](./HowTo.md#7-deploy) for details.
