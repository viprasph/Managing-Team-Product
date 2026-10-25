# Cross-Silo Radar

For teams where everyone owns their own work and their own decisions. Paste a team update meeting transcript (or fill in a card per person), and the app finds specific places where one person's knowledge answers another person's open question. It returns a radar of who can help whom, match cards with a suggested question to ask, a private digest for each person, isolation flags, and a give-and-receive chart. It recommends conversations, never decisions.

## Run locally

Requires Node.js 18.18 or later.

```bash
npm install
cp .env.example .env.local   # then paste your Anthropic API key into .env.local
npm run dev
```

Open http://localhost:3000. Without a key, the two sample teams still show pre-computed example results; your own data needs the key.

## Deploy (GitHub, then Vercel)

1. Create an empty repo on GitHub, then:
   ```bash
   git remote add origin https://github.com/<you>/cross-silo-radar.git
   git push -u origin main
   ```
2. On vercel.com: Add New, Project, import the repo.
3. Under Environment Variables add `ANTHROPIC_API_KEY`. Optionally add `ANTHROPIC_MODEL` to use a different model.
4. Deploy. Every push to `main` redeploys.

## How it works

- `lib/transcript.ts` cleans Zoom, Teams, and Otter exports into `Speaker: text` lines in the browser.
- `app/api/extract` turns a transcript into editable member cards.
- `app/api/analyze` finds matches, digests, and isolation flags. Knowledge flow is computed from the matches so the chart always agrees with the cards.
- `lib/samples.ts` holds two fictional teams and their example results.

Nothing is stored. Inputs go only to the Anthropic API for analysis.
