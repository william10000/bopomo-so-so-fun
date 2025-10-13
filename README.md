# bopomo-so-so-fun

BoPoMo Super Fun! A tiny, kid-friendly Zhuyin (Bopomofo ㄅㄆㄇ) learning app with audio, flashcards, and printable worksheets.

Built with React, Vite, and Tailwind CSS. Uses the Web Speech API for text‑to‑speech and `lucide-react` for icons.

— ㄅㄆㄇ・好好玩 —


## Live demo

If GitHub Pages is enabled for this repo, you can try it here: [Live demo](https://william10000.github.io/bopomo-so-so-fun/)


## What is this?

An ultra-simple learning tool for young learners to:

- Learn Bopomofo symbols (filter by starting/ending sounds)
- Hear native-like pronunciations via your device’s Chinese voices
- Practice everyday words with flashcards (Zhuyin, Pinyin, English)
- Print cute worksheets for offline practice


## Features

- Learn Symbols: Browse all 37 symbols, or filter by starting/ending sounds. See symbol, Pinyin, and type.
- Play Sound: Tap Play to hear a symbol or word using your selected voice.
- Flashcards: Kid-friendly everyday words with Zhuyin, Pinyin, and English.
- Worksheets: Print-ready practice sheets with tracing and matching activities.
- Voice Settings: Pick from available Chinese voices (prefers zh-TW). Tips included for better voices.


## Quick start

Requirements:

- Node.js ≥ 18 (Vite 5)
- pnpm (recommended) or npm/yarn

Install and run locally:

```bash
pnpm install
pnpm dev
# open http://localhost:3008
```

Using npm instead of pnpm:

```bash
npm install
npm run dev
# open http://localhost:3008
```


## Usage guide

- Home: Choose Learn Symbols, Flashcards, or Worksheets. Access Voice Settings from the top-right.
- Learn Symbols: Use filters (All / Starting / Ending). Navigate with Previous/Next. Press Play Sound.
- Flashcards: Flip through words, see Zhuyin/Pinyin/English, and tap Play Sound.
- Worksheets: Click Print Worksheet (uses your browser’s print dialog for clean printouts).
- Voice Settings: Select among available Chinese voices on your device (prefers zh‑TW). Test phrases are provided.


## Voice setup tips

The app uses the Web Speech API (system voices). Availability and quality depend on your OS/browser:

- Prefer Traditional Chinese (zh‑TW) for Zhuyin. Examples on macOS include “Meijia” or “Tingting”.
- You may need to download additional voices in your system language settings.
- If no Chinese voices appear, try Chrome (voices often load asynchronously), then reopen Voice Settings.


## Scripts

```bash
# Start dev server (http://localhost:3008)
pnpm dev

# Type-check and build to docs/ (for GitHub Pages)
pnpm build

# Preview the production build locally
pnpm preview

# Type-check only
pnpm typecheck

# Run tests (jsdom)
pnpm test
```


## Project structure (high level)

```
src/                 # React app (BopomofoApp, entry, styles)
docs/                # Production build output (served by GitHub Pages)
vite.config.ts       # Base path '/bopomo-so-so-fun/', outDir=docs, dev server (3008)
tailwind.config.ts   # Tailwind config
postcss.config.js    # Tailwind (v4) via @tailwindcss/postcss
vitest.config.ts     # Vitest setup (jsdom)
```


## Testing

This project uses Vitest with a jsdom environment.

```bash
pnpm test
```

To collect coverage, you can enable coverage via Vitest CLI options (uses `@vitest/coverage-v8`).


## Deploying (GitHub Pages)

The Vite config sets `base` to `/bopomo-so-so-fun/` and outputs to `docs/`.

1) Build the site:

```bash
pnpm build
```

2) Commit and push. Then in GitHub → Settings → Pages:

- Source: Deploy from a branch
- Branch: `main`
- Folder: `/docs`

After Pages finishes deploying, your site should be available at:
`https://<your-username>.github.io/bopomo-so-so-fun/`


## Tech stack

- React 18, TypeScript
- Vite 5 + @vitejs/plugin-react-swc
- Tailwind CSS (v4) via PostCSS
- Web Speech API (text-to-speech)
- Vitest + jsdom
- Husky pre-push (`pnpm typecheck && pnpm build`)


## License

See `LICENSE` for details.


## Acknowledgements

- Icons: `lucide-react`
- Inspiration: making Zhuyin learning playful and printable for little kids ♥