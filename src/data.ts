import { AppInfo, ChangelogItem } from "./types";

export const APPS: AppInfo[] = [
  {
    id: "public-site",
    name: "Public Site",
    description: "The face of FundedYouth. Program information, public blogs, and join page.",
    icon: "Globe",
    color: "from-orange-500 to-amber-500",
    status: "active",
    currentVersion: "v2.8.4",
  },
  {
    id: "user-portal",
    name: "User Portal",
    description: "Personal student/founder dashboards, member profiles, and gamified challenges.",
    icon: "User",
    color: "from-pink-500 to-rose-500",
    status: "active",
    currentVersion: "v3.1.2",
  },
  {
    id: "the-vault",
    name: "The Vault",
    description: "Exclusive digital drops, startup contract templates, and funding reserves telemetry.",
    icon: "ShieldAlert",
    color: "from-violet-600 to-purple-600",
    status: "active",
    currentVersion: "v1.4.0",
  },
  {
    id: "docs",
    name: "Docs",
    description: "Self-service knowledge bases, ecosystem API guidelines, and developer toolkits.",
    icon: "BookOpen",
    color: "from-cyan-500 to-blue-500",
    status: "active",
    currentVersion: "v1.12.3",
  },
  {
    id: "curriculum",
    name: "Curriculum",
    description: "Startup builder guides, interactive masterclasses, and project submission steps.",
    icon: "GraduationCap",
    color: "from-emerald-500 to-teal-500",
    status: "active",
    currentVersion: "v2.1.0",
  },
  {
    id: "partner-network",
    name: "Partner Hub",
    description: "Investor matchmaking boards, sponsor deal catalogs, and internship match systems.",
    icon: "Briefcase",
    color: "from-indigo-500 to-purple-500",
    status: "beta",
    currentVersion: "v0.9.5",
  },
];

export const INITIAL_CHANGELOGS: ChangelogItem[] = [
  {
    id: "update-1",
    appId: "the-vault",
    appName: "The Vault",
    title: "⚡ Rocket-Fast Secure Assets Delivery Engine (SADE) Live!",
    description: `We've completely overhauled how startup boilerplate legal agreements and media kits are parsed and served.

### What is SADE?
SADE (Secure Assets Delivery Engine) utilizes edge caching and automated key rotation to make downloading templates instantaneous.

### Features
* **Zero-latency downloads**: Boilers load in under **45ms** globally.
* **Smart Watermarking**: Clean PDF watermarking with founder signatures embedded dynamically.
* **Vault Multi-Signatures**: Seed investment paperwork now supports co-founder parallel signing.
    `,
    date: "2026-05-28T14:30:00Z",
    version: "v1.4.0",
    type: "major",
    author: {
      name: "Tasha Chen",
      role: "Lead Platform Engineer",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    },
    tags: ["security", "vault", "performance"],
    comments: [
      {
        id: "c1",
        authorName: "Jordan Sparks",
        authorEmail: "jordan@fundedyouth.org",
        content: "Oh thank goodness, signing the seed papers used to be so clunky. Excellent work team!",
        timestamp: "2026-05-28T15:10:00Z",
      },
    ],
  },
  {
    id: "update-2",
    appId: "curriculum",
    appName: "Curriculum",
    title: "📚 Interactive Startup Builder Masterclass Launched",
    description: `The highly requested Startup Builder track is officially live!

We worked directly with top venture studio partners to assemble **8 hyper-practical interactive lessons** to guide you from problem discovery to your first $10k in ARR.

### Core Modules Added:
1. **The Youth Edge**: Finding arbitrage opportunities as student builders.
2. **Landing Your First 10 Customers**: Tactical cold outreach playbooks.
3. **No-Code Backends**: Launching dynamic websites without writing custom database layers.
4. **The Cap Table Sim**: Interactive slider matching founder divisions.

*Complete all modules to unlock the **Cap-Table Wizard Badge** in your User Portal!*
`,
    date: "2026-05-27T10:15:00Z",
    version: "v2.1.0",
    type: "major",
    author: {
      name: "Alex Patel",
      role: "Head of Education",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    },
    tags: ["curriculum", "lessons", "education"],
    comments: [
      {
        id: "c2",
        authorName: "Maya Lin",
        authorEmail: "maya@fundedyouth.org",
        content: "Just completed Module 1! The cap table slider is so helpful. High schoolers really need this simplified.",
        timestamp: "2026-05-27T12:00:00Z",
      },
    ],
  },
  {
    id: "update-3",
    appId: "user-portal",
    appName: "User Portal",
    title: "🎨 Dark Mode Aesthetic & Interactive Achievements Grid",
    description: `Your Member Profile page got a glow up! We've heard you loud and clear: builders want a dark midnight aesthetic to code in comfort during those 2 AM sessions.

### New Additions
* **Midnight Carbon Palette**: Soft, mathematically accurate contrast ratios for long-night builders.
* **Achievements Showcase Grid**: See your unlocked badges (including the new Cap-Table Wizard Badge!).
* **Live Venture Stats Widget**: Watch your FundedPoints accrue dynamically based on community engagement.
`,
    date: "2026-05-26T18:40:00Z",
    version: "v3.1.2",
    type: "minor",
    author: {
      name: "Marcus Aure\", Principal Designer",
      role: "Lead UX/UI",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    },
    tags: ["design", "portal", "gamification"],
    comments: [],
  },
  {
    id: "update-4",
    appId: "public-site",
    appName: "Public Site",
    title: "🔒 Security Hotfix - Safeguarding Newsletter Form Entrances",
    description: `We identified and patched a minor vulnerability related to input sanitization on our public footer newsletter capture.

### Key Details
* **Vulnerability type**: Form rate-abuse and cross-site scripting risks during peak traffic times.
* **Resolution**: Added cryptographic Cloudflare Turnstile guards and complete server-side input stripping.
* **Impact**: Zero records were exposed; this is a preventative security hardening measure.
`,
    date: "2026-05-25T09:00:00Z",
    version: "v2.8.4",
    type: "security",
    author: {
      name: "Tasha Chen",
      role: "Lead Platform Engineer",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    },
    tags: ["security", "patch", "infrastructure"],
    comments: [],
  },
  {
    id: "update-5",
    appId: "docs",
    appName: "Docs",
    title: "📖 Added 'Building with AI' SDK Reference Manual",
    description: `Our developer docs now contain extensive recipes for integrating LLM features safely inside Sandbox environments.

### Contents:
* **LLM Hook Templates**: Plug-and-play code snippets for initializing Gemini 3.5.
* **Usage Limits Monitor API**: Avoid running over developer quotas when sandbox prototyping.
* **Web-Safe Keys Guidelines**: Best practices for proxying API calls to prevent leakages.
`,
    date: "2026-05-24T15:30:00Z",
    version: "v1.12.3",
    type: "patch",
    author: {
      name: "Sarah Jenkins",
      role: "Developer Relations",
      avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    },
    tags: ["docs", "api", "gemini"],
    comments: [],
  },
  {
    id: "update-6",
    appId: "partner-network",
    appName: "Partner Hub",
    title: "🤝 High-School Startup Investor Board Launch (Beta)",
    description: `We've soft-launched our specialized Venture Board! Eligible teen founders can now upload safe executive summaries to showcase to registered micro-VC funds.

### How it works:
1. Complete your pitch summary in the **User Portal**.
2. Push your summary directly to the **Partner Hub** and set tags like 'Fintech', 'AI', or 'SaaS'.
3. Registered, vet-checked investors can request introduction calls with high-potential FundedYouth projects.
`,
    date: "2026-05-22T11:00:00Z",
    version: "v0.9.5",
    type: "minor",
    author: {
      name: "Elijah Vance",
      role: "Ecosystem Partnerships",
      avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
    },
    tags: ["investors", "beta", "funding"],
    comments: [
      {
        id: "c3",
        authorName: "Zachary Miller",
        authorEmail: "zach@build.com",
        content: "OMG, accessing angels has been the biggest bottleneck. Can't wait to submit our project!",
        timestamp: "2026-05-22T14:15:00Z",
      },
    ],
  },
];
