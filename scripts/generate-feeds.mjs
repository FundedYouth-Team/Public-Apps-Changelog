// Generates static RSS (feed.xml) and JSON (feed.json) feeds from the changelog
// data file, so the subscribe links work on a static host with no backend.
//
//   pnpm gen:feeds                 -> uses default site URL
//   SITE_URL=https://x.dev pnpm gen:feeds
//
// Runs automatically before `pnpm build`. Re-run it whenever you edit
// public/data/changelog.json so the feeds stay in sync.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dataPath = join(root, "public", "data", "changelog.json");

const SITE_URL = (process.env.SITE_URL || "https://changelog.fundedyouth.org").replace(/\/$/, "");

const escape = (str) =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const data = JSON.parse(readFileSync(dataPath, "utf8"));
const updates = Array.isArray(data.updates) ? data.updates : [];

// Stable, unique id for an update. Uses an explicit `id` if present, otherwise
// derives one from appId + the date's timestamp. Must match the derivation in
// src/App.tsx so feed permalinks/guids stay consistent with the app.
const updateId = (item) => item.id || `${item.appId}-${new Date(item.date).getTime()}`;

// --- RSS 2.0 ---
let xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>FundedYouth Community App updates</title>
  <link>${SITE_URL}</link>
  <description>The latest official changelogs and software updates across the entire FundedYouth technical ecosystem.</description>
  <language>en-us</language>
  <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
`;
for (const item of updates) {
  const id = updateId(item);
  xml += `  <item>
    <title>${escape(`[${item.appName}] ${item.title}`)}</title>
    <link>${SITE_URL}/?app=${encodeURIComponent(item.appId)}&amp;update=${encodeURIComponent(id)}</link>
    <guid>${SITE_URL}/update/${encodeURIComponent(id)}</guid>
    <pubDate>${new Date(item.date).toUTCString()}</pubDate>
    <description>${escape(item.description)}</description>
    <author>${escape(item.author?.name ?? "")}</author>
    <category>${escape(item.type)}</category>
  </item>
`;
}
xml += `</channel>
</rss>`;

// --- JSON Feed 1.1 ---
const jsonFeed = {
  version: "https://jsonfeed.org/version/1.1",
  title: "FundedYouth App Updates Feed",
  home_page_url: SITE_URL,
  feed_url: `${SITE_URL}/feed.json`,
  description: "Hype updates, releases, and fixes from the FundedYouth developers.",
  items: updates.map((item) => ({
    id: updateId(item),
    url: `${SITE_URL}/?app=${item.appId}&update=${updateId(item)}`,
    title: `[${item.appName}] ${item.title}`,
    content_text: item.description,
    date_published: item.date,
    tags: [item.type, ...(item.tags ?? [])],
    authors: [{ name: item.author?.name ?? "", avatar: item.author?.avatarUrl ?? "" }],
  })),
};

writeFileSync(join(root, "public", "feed.xml"), xml + "\n");
writeFileSync(join(root, "public", "feed.json"), JSON.stringify(jsonFeed, null, 2) + "\n");

console.log(`Generated public/feed.xml and public/feed.json from ${updates.length} updates (site: ${SITE_URL})`);
