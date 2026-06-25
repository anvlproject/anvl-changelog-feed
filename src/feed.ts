/**
 * anvl-changelog-feed — feed.ts
 * RSS 2.0 and JSON Feed generators for ANVL changelog and blog.
 * Data sourced from the public ANVL changelog and blog pages.
 */

// ── Static data (mirrors ANVL's changelog/page.tsx and content/blog/) ─────────

export interface ChangelogEntry {
  date:      string;
  sortDate:  string;
  tag:       "Major" | "Feature" | "Improvement" | "Beta";
  title:     string;
  items:     string[];
}

export interface BlogPost {
  slug:      string;
  title:     string;
  excerpt:   string;
  category:  string;
  date:      string;
  readTime:  number;
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    date: "June 24, 2026", sortDate: "2026-06-24", tag: "Major",
    title: "Grid Bot — Signal-Gated Mode, ICT + Fib Engines",
    items: [
      "Signal-Gated grid: ADX filter, TA gate, ICT Killzone, Fibonacci scalp levels",
      "ATR dynamic grid range, profit trailing, MSS emergency pause",
      "Grid Bot Telegram notifications via ANVL platform bot",
      "Bot Settings page with Binance API credential management",
    ],
  },
  {
    date: "June 22, 2026", sortDate: "2026-06-22", tag: "Feature",
    title: "Forge — Quests, Crafting, Market Forge, Points → $ANVL Conversion",
    items: [
      "Daily quest system: 3 quests per day, progress tracking, reward claims",
      "Crafting system: recipe-based item crafting with rarity tiers (Common → Legendary)",
      "Market Forge: buy/sell items with Forge Points, atomic stored procedure",
      "Points → $ANVL conversion with treasury SPL transfer, 24h cooldown",
      "Forge leaderboard: public endpoint + embeddable widget",
    ],
  },
  {
    date: "June 18, 2026", sortDate: "2026-06-18", tag: "Feature",
    title: "Market Forge v1, Buy Feed, Holder Counter",
    items: [
      "Market Forge: first version of Forge item marketplace",
      "BuyTicker: real on-chain buy feed via Helius (no fabricated data)",
      "HolderCounter: live holder count from Helius for coin sites",
      "Dynamic OG image generation for /coin/[slug] pages",
    ],
  },
  {
    date: "June 14, 2026", sortDate: "2026-06-14", tag: "Major",
    title: "GMGN Integration — 10 Market Intelligence Routes",
    items: [
      "GMGN proxy: trending, trenches, token info, holders, traders, signals, security, kline, portfolio, track",
      "AppShell + sidebar with product pillars",
      "New pages: /trenches, /discover, /wallet",
      "Supabase replaces localStorage as primary project store",
    ],
  },
  {
    date: "June 10, 2026", sortDate: "2026-06-10", tag: "Major",
    title: "Sign-In-With-Solana (SIWS) Auth System",
    items: [
      "Full SIWS: nonce → sign → nacl verify → HMAC session cookie",
      "7-day session TTL, timingSafeEqual for timing-attack prevention",
      "Single-use nonces with 5-minute expiry, auto-deleted after use",
      "Server-side $ANVL balance check on Forge rent (live RPC)",
    ],
  },
  {
    date: "June 5, 2026", sortDate: "2026-06-05", tag: "Feature",
    title: "Forge BETA — Blacksmith Rental, Crafting, Points",
    items: [
      "Forge P2E: rent Blacksmith NFTs, craft for points",
      "Server-side cooldown enforcement from forge_craft_log timestamps",
      "Atomic forge_add_points() stored procedure in PostgreSQL",
      "Three Blacksmith tiers: Apprentice, Journeyman, Master",
    ],
  },
  {
    date: "May 28, 2026", sortDate: "2026-05-28", tag: "Improvement",
    title: "Web Builder — OG Image, Shareable URLs, localStorage Migration",
    items: [
      "Published coin sites now shareable via URL (Supabase-backed)",
      "One-click localStorage → Supabase migration for existing projects",
      "Dynamic Open Graph image for /coin/[slug] (auto-generated)",
      "5 coin site templates: Dark Moon, Cute Frog, Retro Pixel, Premium Gem, Hype Beast",
    ],
  },
];

export const BLOG_POSTS: BlogPost[] = [
  { slug: "anvl-public-api",          title: "ANVL Public API: Build on Top of the Forge",                  excerpt: "Developers can now integrate ANVL's proxy routes into their own apps. Here's what's available.",  category: "Platform Update",  date: "April 2026", readTime: 5 },
  { slug: "introducing-forge-swap",   title: "Introducing Forge & Swap: Two New Pillars of ANVL",           excerpt: "The Forge turns $ANVL holding into a game. Swap brings Jupiter routing inside the platform.",     category: "Feature Release", date: "March 2026", readTime: 6 },
  { slug: "pixel-design-philosophy",  title: "Why ANVL Uses Pixel Art (And Why It Works for Crypto)",       excerpt: "The pixel art dwarf forge aesthetic isn't decoration — it's a deliberate statement about culture.", category: "Design",          date: "March 2026", readTime: 4 },
  { slug: "solana-memecoins-2025",    title: "Solana Memecoins in 2025: What Changed and What's Coming",    excerpt: "A look at the infrastructure improvements that made Solana the home of the memecoin boom.",         category: "Market",          date: "February 2026", readTime: 7 },
  { slug: "token-launch-guide",       title: "How to Launch a Token on Solana with ANVL (Step by Step)",   excerpt: "From IPFS metadata to pump.fun deployment — a complete walkthrough using the ANVL platform.",       category: "Guide",           date: "February 2026", readTime: 8 },
];

// ── RSS Generator ─────────────────────────────────────────────────────────────

function escXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function generateRSS(baseUrl = "https://anvl.site"): string {
  const now = new Date().toUTCString();
  const items = [
    ...CHANGELOG.map((e) => ({
      title:   `[${e.tag}] ${e.title}`,
      link:    `${baseUrl}/changelog`,
      guid:    `${baseUrl}/changelog#${e.sortDate}`,
      date:    new Date(e.sortDate).toUTCString(),
      desc:    e.items.map((i) => `• ${i}`).join("\n"),
      cat:     `Changelog · ${e.tag}`,
    })),
    ...BLOG_POSTS.map((p) => ({
      title:   p.title,
      link:    `${baseUrl}/blog/${p.slug}`,
      guid:    `${baseUrl}/blog/${p.slug}`,
      date:    new Date(p.date).toUTCString(),
      desc:    p.excerpt,
      cat:     `Blog · ${p.category}`,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ANVL — Platform Updates &amp; Blog</title>
    <link>${baseUrl}</link>
    <description>Latest changelog entries and blog posts from the ANVL memecoin launch platform.</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/anvl-token.png</url>
      <title>ANVL</title>
      <link>${baseUrl}</link>
    </image>
${items.map((item) => `    <item>
      <title>${escXml(item.title)}</title>
      <link>${escXml(item.link)}</link>
      <guid isPermaLink="${item.guid.includes("/blog/") ? "true" : "false"}">${escXml(item.guid)}</guid>
      <pubDate>${item.date}</pubDate>
      <category>${escXml(item.cat)}</category>
      <description>${escXml(item.desc)}</description>
    </item>`).join("\n")}
  </channel>
</rss>`;
}

// ── JSON Feed Generator (JSON Feed 1.1) ───────────────────────────────────────

export function generateJSONFeed(baseUrl = "https://anvl.site"): object {
  const items = [
    ...CHANGELOG.map((e) => ({
      id:             `${baseUrl}/changelog#${e.sortDate}`,
      url:            `${baseUrl}/changelog`,
      title:          `[${e.tag}] ${e.title}`,
      content_text:   e.items.map((i) => `• ${i}`).join("\n"),
      date_published: new Date(e.sortDate).toISOString(),
      tags:           ["changelog", e.tag.toLowerCase()],
    })),
    ...BLOG_POSTS.map((p) => ({
      id:             `${baseUrl}/blog/${p.slug}`,
      url:            `${baseUrl}/blog/${p.slug}`,
      title:          p.title,
      content_text:   p.excerpt,
      date_published: new Date(p.date).toISOString(),
      tags:           ["blog", p.category.toLowerCase()],
    })),
  ].sort((a, b) => new Date(b.date_published).getTime() - new Date(a.date_published).getTime());

  return {
    version:      "https://jsonfeed.org/version/1.1",
    title:        "ANVL — Platform Updates & Blog",
    home_page_url: baseUrl,
    feed_url:     `${baseUrl}/feed.json`,
    description:  "Latest changelog entries and blog posts from the ANVL memecoin launch platform.",
    icon:         `${baseUrl}/icon-512.png`,
    favicon:      `${baseUrl}/favicon.ico`,
    authors:      [{ name: "ANVL Team", url: baseUrl }],
    items,
  };
}
