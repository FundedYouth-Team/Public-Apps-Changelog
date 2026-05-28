import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { INITIAL_CHANGELOGS } from "./src/data";
import { ChangelogItem, Comment } from "./src/types";

// In-memory persistence for interactive showcase session
let changelogs: ChangelogItem[] = [...INITIAL_CHANGELOGS];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API 1: Fetch list of changes
  app.get("/api/changes", (req, res) => {
    res.json(changelogs);
  });

  // API 2: Create a new update / changelog
  app.post("/api/changes", (req, res) => {
    const { appId, appName, title, description, version, type, authorName, authorRole, tags } = req.body;

    if (!appId || !appName || !title || !description || !version) {
      return res.status(400).json({ error: "Missing required fields for new changelog item." });
    }

    const newItem: ChangelogItem = {
      id: "update-" + Date.now(),
      appId,
      appName,
      title,
      description,
      date: new Date().toISOString(),
      version,
      type: type || "minor",
      author: {
        name: authorName || "FundedYouth Admin",
        role: authorRole || "Contributor",
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(authorName || "FY")}`,
      },
      tags: Array.isArray(tags) ? tags : [],
      comments: [],
    };

    changelogs.unshift(newItem);
    res.status(201).json(newItem);
  });

  // API 4: Comment on an update
  app.post("/api/changes/comment", (req, res) => {
    const { id, authorName, authorEmail, content } = req.body;
    const item = changelogs.find((cl) => cl.id === id);
    if (!item) {
      return res.status(404).json({ error: "Changelog item not found." });
    }

    if (!authorName || !content) {
      return res.status(400).json({ error: "Name and content are required to comment." });
    }

    const newComment: Comment = {
      id: "comm-" + Date.now(),
      authorName,
      authorEmail: authorEmail || "",
      content,
      timestamp: new Date().toISOString(),
    };

    item.comments.push(newComment);
    res.json(item);
  });

  // API 5: RSS Feed (.xml format)
  app.get("/api/feed.xml", (req, res) => {
    const appUrl = (process.env.APP_URL || `http://localhost:${PORT}`).replace(/\/$/, "");
    
    let xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>FundedYouth Community App updates</title>
  <link>${appUrl}</link>
  <description>The latest official changelogs and software updates across the entire FundedYouth technical ecosystem.</description>
  <language>en-us</language>
  <pubDate>${new Date().toUTCString()}</pubDate>
  <atom:link href="${appUrl}/api/feed.xml" rel="self" type="application/rss+xml" />
`;

    changelogs.forEach((item) => {
      // Escape HTML entities inside titles and description
      const escape = (str: string) =>
        str
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&apos;");

      xml += `  <item>
    <title>${escape(`[${item.appName}] ${item.title}`)}</title>
    <link>${appUrl}/?app=${item.appId}&amp;update=${item.id}</link>
    <guid>${appUrl}/update/${item.id}</guid>
    <pubDate>${new Date(item.date).toUTCString()}</pubDate>
    <description>${escape(item.description)}</description>
    <author>${escape(item.author.name)}</author>
    <category>${escape(item.type)}</category>
  </item>
`;
    });

    xml += `</channel>
</rss>`;

    res.header("Content-Type", "application/xml; charset=utf-8");
    res.send(xml);
  });

  // API 6: JSON Feed (.json format)
  app.get("/api/feed.json", (req, res) => {
    const appUrl = (process.env.APP_URL || `http://localhost:${PORT}`).replace(/\/$/, "");

    const feed = {
      version: "https://jsonfeed.org/version/1.1",
      title: "FundedYouth App Updates Feed",
      home_page_url: appUrl,
      feed_url: `${appUrl}/api/feed.json`,
      description: "Hype updates, releases, and fixes from the FundedYouth developers.",
      items: changelogs.map((item) => ({
        id: item.id,
        url: `${appUrl}/?app=${item.appId}&update=${item.id}`,
        title: `[${item.appName}] ${item.title}`,
        content_text: item.description,
        date_published: item.date,
        tags: [item.type, ...item.tags],
        authors: [
          {
            name: item.author.name,
            avatar: item.author.avatarUrl,
          },
        ],
      })),
    };

    res.json(feed);
  });

  // API 7: AI Hype Generator / Explainer Route (local template engine)
  app.post("/api/ai/hype", async (req, res) => {
    const { rawBullets, appName, version } = req.body;
    if (!rawBullets || !appName) {
      return res.status(400).json({ error: "Missing required raw bullets or app name." });
    }

    // Local FundedYouth drafting template — turns messy bullets into a punchy update post.
    const offlineMarkdown = `⚡ **[AI Hype Generator]**
We've processed your raw ideas with the local FundedYouth high-octane drafting template:

### What's New in ${appName} (${version || "v1.0.0"})
* ${rawBullets.split("\n").filter((l: string) => l.trim()).map((l: string) => l.replace(/^[\*\-\d\.]+\s*/, "")).join("\n* ")}

### Why This Matters
* **Community first**: Designed intentionally to elevate experience for high-school builders.
* **Overwhelming Speed**: Render parameters tweaked for instantaneous frame latency.

#speed #vibe #growth`;

    res.json({ markdown: offlineMarkdown, offline: true });
  });

  // Serve static files in production or bind Vite development middleware
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite development middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Running in static production mode.");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FundedYouth Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Error launching FundedYouth server:", err);
});
