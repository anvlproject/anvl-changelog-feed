# anvl-changelog-feed

RSS 2.0 and JSON Feed (v1.1) generator for [ANVL](https://anvl.site) platform changelog and blog.

Subscribe to ANVL updates in any RSS reader, or use the feeds to power Discord/Telegram notification bots.

## Quick Start

```bash
git clone https://github.com/anvlproject/anvl-changelog-feed
cd anvl-changelog-feed
npm install
npm run build

# Generate static files
npm run generate

# Or run as a live server
npm run serve
```

## Endpoints (live server)

| URL | Description |
|-----|-------------|
| `/feed.xml` | RSS 2.0 feed |
| `/feed.json` | JSON Feed 1.1 |
| `/health` | Health check + entry count |

## Static Generation

Generate static `feed.xml` and `feed.json` to deploy on any CDN:

```bash
ANVL_BASE_URL=https://anvl.site npm run generate ./output
# → ./output/feed.xml
# → ./output/feed.json
```

## Subscribe

Add either URL to your RSS reader of choice:

```
https://anvl.site/feed.xml
https://anvl.site/feed.json
```

Compatible with: Feedly, Inoreader, NetNewsWire, Reeder, Miniflux, FreshRSS, and any standard RSS reader.

## Discord Integration

Use a service like [MonitoRSS](https://monitorss.xyz) or a custom Discord bot to post new entries to your server:

```
Feed URL: https://anvl.site/feed.xml
Channel:  #anvl-updates
Filter:   tag contains "Major" OR "Feature"
```

## Telegram Bot Integration

```js
// Example: check for new entries every hour
const feed = await fetch("https://anvl.site/feed.json").then(r => r.json());
const latest = feed.items[0];
if (latest.date_published > lastChecked) {
  await bot.sendMessage(chatId, `📢 ${latest.title}\n${latest.url}`);
}
```

## What's Included

| Source | Entries |
|--------|---------|
| Changelog | 7 tagged releases (Major, Feature, Improvement, Beta) |
| Blog | 5 posts across Platform, Design, Market, Guide categories |

All items are sorted by date, newest first.

## License

MIT — [github.com/anvlproject](https://github.com/anvlproject)
