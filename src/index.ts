/**
 * anvl-changelog-feed — index.ts
 * Express server that serves /feed.xml and /feed.json
 * OR static generator that writes the files to disk.
 */

import express from "express";
import fs      from "fs";
import path    from "path";
import chalk   from "chalk";
import { generateRSS, generateJSONFeed } from "./feed";

const BASE_URL = process.env.ANVL_BASE_URL ?? "https://anvl.site";
const PORT     = process.env.PORT ?? 3004;
const cmd      = process.argv[2];

// ── Static generate ───────────────────────────────────────────────────────────
if (cmd === "generate") {
  const outDir = process.argv[3] ?? "./dist/feeds";
  fs.mkdirSync(outDir, { recursive: true });

  const rss  = generateRSS(BASE_URL);
  const json = JSON.stringify(generateJSONFeed(BASE_URL), null, 2);

  fs.writeFileSync(path.join(outDir, "feed.xml"),  rss,  "utf8");
  fs.writeFileSync(path.join(outDir, "feed.json"), json, "utf8");

  console.log(chalk.green("\n  ✔ Feeds generated:\n"));
  console.log(`    ${path.join(outDir, "feed.xml")}  (${(Buffer.byteLength(rss)  / 1024).toFixed(1)}KB)`);
  console.log(`    ${path.join(outDir, "feed.json")} (${(Buffer.byteLength(json) / 1024).toFixed(1)}KB)\n`);
  process.exit(0);
}

// ── Live server ───────────────────────────────────────────────────────────────
const app = express();

// CORS — allow any RSS reader or app
app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/feed.xml", (_req, res) => {
  res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=900, stale-while-revalidate=300");
  res.send(generateRSS(BASE_URL));
});

app.get("/feed.json", (_req, res) => {
  res.setHeader("Content-Type", "application/feed+json; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=900, stale-while-revalidate=300");
  res.json(generateJSONFeed(BASE_URL));
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", entries: { changelog: 7, blog: 5 }, ts: new Date().toISOString() });
});

app.get("/", (_req, res) => {
  res.send(`<!DOCTYPE html><html><head><title>ANVL Feed</title></head><body>
    <h2>ANVL Changelog &amp; Blog Feed</h2>
    <p><a href="/feed.xml">RSS Feed (feed.xml)</a></p>
    <p><a href="/feed.json">JSON Feed (feed.json)</a></p>
    <p><a href="https://anvl.site">anvl.site</a></p>
  </body></html>`);
});

app.listen(PORT, () => {
  console.log(`\n  [anvl-changelog-feed] running on port ${PORT}`);
  console.log(`  RSS:  http://localhost:${PORT}/feed.xml`);
  console.log(`  JSON: http://localhost:${PORT}/feed.json\n`);
});
