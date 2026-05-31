# How To: Add & Manage Changelog / Feed Data

This site is **fully static**. All content is loaded at runtime from a single
data file, and the RSS / JSON feeds are generated from that same file. There is
no server and no database — to change what the site shows, you edit the data
file and redeploy.

- **Data file:** [`public/data/changelog.json`](public/data/changelog.json)
- **Schema (validation + autocomplete):** [`public/data/changelog.schema.json`](public/data/changelog.schema.json)
- **Generated feeds:** `public/feed.xml`, `public/feed.json` (do not edit by hand)

---

## 1. The data file at a glance

`public/data/changelog.json` has two main arrays:

```jsonc
{
  "apps":    [ /* the products shown in the sidebar */ ],
  "updates": [ /* the changelog entries, newest first */ ]
}
```

The file points at its schema via `"$schema": "./changelog.schema.json"`, so in
VS Code you get **autocomplete, enum hints, and red squiggles** if a field is
missing or has the wrong type.

---

## 2. Add a new update (changelog entry)

Add a new object to the **top** of the `updates` array (newest first). Example:

```json
{
  "id": "update-7",
  "appId": "the-vault",
  "appName": "The Vault",
  "title": "🚀 New Template Marketplace",
  "description": "Short summary.\n\n### Details\n* **First point**: explanation.\n* **Second point**: explanation.",
  "date": "2026-06-01T09:00:00Z",
  "version": "v1.5.0",
  "type": "major",
  "author": {
    "name": "Jordan Lee",
    "role": "Product Engineer",
    "avatarUrl": "https://api.dicebear.com/7.x/bottts/svg?seed=Jordan"
  },
  "tags": ["marketplace", "templates"]
}
```

### Field reference

| Field | Required | Notes |
|-------|----------|-------|
| `id` | yes | Unique string, e.g. `"update-7"`. Used in feed links. |
| `appId` | yes | **Must match an `apps[].id`** (see §3). |
| `appName` | yes | Display name, e.g. `"The Vault"`. |
| `title` | yes | The headline (emoji welcome). |
| `description` | yes | Markdown. See §4 for supported syntax. Use `\n` for line breaks. |
| `date` | yes | ISO 8601 UTC, e.g. `"2026-06-01T09:00:00Z"`. Controls ordering display & feed `pubDate`. |
| `version` | yes | e.g. `"v1.5.0"`. |
| `type` | yes | One of `major`, `minor`, `patch`, `security`. Drives the colored badge & filters. |
| `author.name` | yes | Author display name. |
| `author.role` | yes | Author role/title. |
| `author.avatarUrl` | yes | Image URL. Tip: `https://api.dicebear.com/7.x/bottts/svg?seed=NAME` for an instant avatar. |
| `tags` | yes | Array of strings (searchable). Use `[]` if none. |

> **Ordering:** the site shows updates in the order they appear in the array, so
> put the newest entry first. (`date` is used for display and feeds, not for
> re-sorting.)

---

## 3. Add or edit an app (sidebar product)

Apps live in the `apps` array. Each update references one via `appId`.

```json
{
  "id": "the-vault",
  "name": "The Vault",
  "description": "Short description shown in the header.",
  "icon": "ShieldAlert",
  "color": "from-violet-600 to-purple-600",
  "status": "active",
  "currentVersion": "v1.4.0"
}
```

| Field | Notes |
|-------|-------|
| `id` | Stable slug, referenced by `update.appId`. Don't change it once used. |
| `name` | Display name. |
| `description` | Shown when the app is selected. |
| `icon` | A **Lucide** icon name. Supported by the sidebar: `Globe`, `User`, `ShieldAlert`, `BookOpen`, `GraduationCap`, `Briefcase`. (To use another icon, register it in `ICON_MAP` in `src/App.tsx`.) |
| `color` | A Tailwind gradient used for the card accent, e.g. `"from-orange-500 to-amber-500"`. |
| `status` | One of `active`, `maintenance`, `beta`. |
| `currentVersion` | e.g. `"v1.4.0"`. The Draft tool suggests the next version from this. |

---

## 4. Markdown supported in `description`

The card renderer supports a small, safe subset:

- `### Heading` — section header
- `* item` or `- item` — bullet list
- `**bold**` — bold text
- `` `code` `` — inline code
- Blank line — spacing between blocks

Because it's JSON, write line breaks as `\n`. Example:

```json
"description": "Intro line.\n\n### What changed\n* **Speed**: 2x faster.\n* **Fix**: resolved `null` crash."
```

> Each card opens on the **Hype** view and has a **Technical Log** toggle that
> shows this `description`. The hype text is a built-in template (it is not
> generated per-update).

---

## 5. Update the feeds (RSS + JSON)

The subscribe links serve `/feed.xml` and `/feed.json`. These are **generated
from the data file** — never edit them by hand. After changing
`changelog.json`, regenerate them:

```bash
pnpm gen:feeds
```

This rewrites `public/feed.xml` and `public/feed.json` from the current data.
`pnpm build` also runs this step automatically, so production builds always have
fresh feeds.

### Set the public site URL in the feeds

Feed entries need absolute URLs. The generator defaults to a placeholder domain,
so set `SITE_URL` to your real domain when generating or building:

```bash
SITE_URL=https://changelog.yourdomain.org pnpm gen:feeds
# or for a production build:
SITE_URL=https://changelog.yourdomain.org pnpm build
```

The default lives in [`scripts/generate-feeds.mjs`](scripts/generate-feeds.mjs)
if you'd rather hard-code it.

---

## 6. Validate your changes

```bash
# Type-check the app
pnpm lint

# Preview the production build locally (serves dist/)
pnpm build && pnpm preview
```

If the JSON is malformed, the editor (via the schema) will flag it, and the app
will show an error state instead of the feed.

---

## 7. Deploy

Any static host works (e.g. Cloudflare Pages):

| Setting | Value |
|---------|-------|
| Build command | `pnpm build` (prefix with `SITE_URL=...` for correct feed URLs) |
| Output directory | `dist` |
| Framework preset | None / Vite |

`pnpm build` copies everything in `public/` (the data file, schema, and feeds)
into `dist/`, so the deployed site serves `/data/changelog.json`, `/feed.xml`,
and `/feed.json`.

---

## Note: the in-app "Draft App Change" tool

The Draft drawer in the UI lets you compose an update and see it appear
instantly — but on a static site this is **session-only** and is **not saved**
(a refresh clears it). It's a preview/authoring aid. To publish an update for
real, add it to `public/data/changelog.json` (§2), run `pnpm gen:feeds`, commit,
and redeploy.
