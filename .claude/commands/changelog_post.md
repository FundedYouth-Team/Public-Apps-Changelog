---
description: Interactively create a new changelog entry (and optionally a new app) in public/data/changelog.json
---

# /changelog_post — Add a changelog entry

You are guiding the user through creating a new changelog entry in
[`public/data/changelog.json`](public/data/changelog.json). Follow these steps
**in order**.

> **Tool note:** the `AskUserQuestion` picker only shows **4 options max** (it
> auto-appends an "Other"). Use it for short, fixed lists (change type, status,
> icon). For the **app list — which can have any number of apps — do NOT use
> `AskUserQuestion`** (it silently drops apps past the 4th). List every app as
> text instead, per Step 1.

## Step 0 — Gather facts (do this silently, in parallel)

1. Read `public/data/changelog.json`. From it, build the current list of apps
   (`apps[].id`, `name`, `icon`, `color`, `status`, `currentVersion`).
2. Get the **real** system date/time and timezone — never guess:
   - UTC timestamp for the `date` field:
     `date -u "+%Y-%m-%dT%H:%M:%SZ"`
   - IANA timezone for the `timezone` field:
     `readlink /etc/localtime | sed 's#.*/zoneinfo/##'`
     (falls back to `America/Los_Angeles` if empty).

## Step 1 — Which app?

List **every** app from the `apps` array as a numbered Markdown list — do not
truncate, and do not use `AskUserQuestion` here (it would hide apps past the
4th). Format each line as:

```
1. **<name>** — `<id>` · <currentVersion>
2. ...
N. ➕ **Create a new app**
```

Then ask the user to reply with the **number or name** of the app. Resolve their
reply to the matching app (or the "create new app" path). If their reply is
ambiguous, re-show the list and ask again.

### If they choose "Create a new app"

Collect the new app's details, then append a new object to the `apps` array:
- `id`: a stable kebab-case slug derived from the name (confirm it).
- `name`: display name (ask).
- `description`: one-line description (ask).
- `icon`: ask, but constrain to the sidebar-supported Lucide icons:
  `Globe`, `User`, `ShieldAlert`, `BookOpen`, `GitCompare`, `GraduationCap`,
  `Briefcase`, `FlaskConical`. Offer these as choices.
- `color`: a Tailwind gradient like `from-orange-500 to-amber-500`. Suggest a
  few unused gradient pairs as options.
- `status`: choose `active`, `maintenance`, or `beta`.
- `currentVersion`: default `v1.0.0` (confirm).

Then continue with this app selected.

## Step 2 — Type of change

Ask the change `type` via choices: **major**, **minor**, **patch**, **security**
(include a short reminder of what each means: major = big/breaking, minor =
new feature, patch = small fix/tweak, security = security fix).

Compute the **next version** by bumping the app's `currentVersion`
(`vMAJOR.MINOR.PATCH`):
- major → bump MAJOR, reset minor & patch to 0
- minor → bump MINOR, reset patch to 0
- patch or security → bump PATCH

Show the computed version and let them override it.

## Step 3 — The change details

Ask the user to describe what changed (free text — bullet points, notes, or a
paragraph are all fine). Also confirm the **author** — default to the most
recent author used in the file (currently *Ryan Jones — Lead Product Engineer &
Designer*, avatar `https://avatars.githubusercontent.com/u/8403768?v=4&size=64`)
and let them change name/role.

## Step 4 — Generate the entry

Turn their raw description into a polished entry that **matches the house style**
of existing entries in `changelog.json`:

- **`title`**: a short, punchy headline that **starts with a relevant emoji**,
  e.g. `📅 Event Registrations Sync to Public Schedule`.
- **`description`**: Markdown using the supported subset, written friendly and
  clear (readable by a 10-year-old). Structure it as:
  - a one-line summary (often ending in a relevant emoji),
  - then `\n\n### What Changed\n`,
  - then `* **✅ Label**: explanation.` bullets (emoji on each bold label is the
    convention). Use `\n` for line breaks and `\n\n` between blocks. The whole
    thing is a single JSON string.
- **`tags`**: 2–5 short lowercase tags relevant to the change and app.
- Derive 3–5 sensible tags.

## Step 5 — Write it

Build the update object with these fields (order matches existing entries):

```json
{
  "appId": "<selected app id>",
  "appName": "<selected app name>",
  "title": "<generated title>",
  "description": "<generated markdown, \\n escaped>",
  "date": "<UTC timestamp from Step 0, e.g. 2026-06-10T16:59:35Z>",
  "timezone": "<IANA tz from Step 0, e.g. America/Los_Angeles>",
  "version": "<computed/confirmed version>",
  "type": "<major|minor|patch|security>",
  "author": {
    "name": "<author name>",
    "role": "<author role>",
    "avatarUrl": "<author avatar url>"
  },
  "tags": [ ... ]
}
```

Then:
1. **Insert it at the TOP** of the `updates` array (newest first).
2. Update that app's `currentVersion` in the `apps` array to the new version.
   (If you created a new app, its `currentVersion` is already the new version.)
3. Preserve the file's existing formatting/indentation (2-space). Do not reorder
   or reformat unrelated entries.

## Step 6 — Validate & finish

1. Run `pnpm gen:feeds` to regenerate `public/feed.xml` and `public/feed.json`.
2. Run `pnpm lint` to type-check.
3. Show the user a summary: app, title, version, type, date (rendered in its
   timezone), and tags. Remind them to commit & redeploy to publish.

Do **not** commit unless the user asks.
