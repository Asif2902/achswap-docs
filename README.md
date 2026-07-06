# AchSwap & AchMarket Documentation

Welcome to the official documentation for AchSwap v3 and AchMarket.

## Prerequisites

- **Node.js 20.x, 22.x, or 24.x**
- **npm >= 10.0** (or yarn/pnpm)

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run start

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
achswap-docs/
├── docs/                    # Documentation files
│   ├── introduction.md       # Main introduction
│   ├── getting-started/     # Getting started guides
│   ├── achswap/            # AchSwap v3 documentation
│   ├── achrwa/             # AchRWA documentation
│   ├── achmarket/          # AchMarket documentation
│   └── technical/         # Technical documentation
├── src/
│   ├── css/custom.css      # Custom styles
│   └── pages/             # Custom pages
├── static/                 # Static assets
├── docusaurus.config.js   # Docusaurus configuration
└── sidebars.js            # Sidebar configuration
```

## Writing Documentation

### Adding a New Page

1. Create a `.md` file in `docs/`
2. Add frontmatter:
```markdown
---
sidebar_position: 1
---

# Your Title
```

### Sidebar Configuration

Edit `sidebars.js` to add/remove pages from the sidebar.

## Deployment

### Vercel (Recommended)

1. Connect repository to Vercel
2. Configure build settings:
   - Framework Preset: `Docusaurus`
   - Install Command: `npm install`
   - Build Command: `npm run build`
   - Output Directory: `build`
3. Deploy

### GitHub Pages

```bash
npm run deploy
```

## Customization

### Theming

Edit `src/css/custom.css` to customize:
- Colors
- Fonts
- Layout
- Components

### Configuration

Edit `docusaurus.config.js` for:
- Site title and metadata
- Navigation
- Footer
- Plugins

## Technology Stack

- [Docusaurus 3](https://docusaurus.io/) - Documentation framework
- [React 18](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## AchSwap AI Assistant

A production-grade, documentation-backed AI assistant available on every page.

### Features
- Floating button (uses the official AchSwap logo)
- Full RAG over **all** documentation using Qdrant + free local embeddings (`bge-small-en-v1.5`)
- Intelligent chunking by headings + rich metadata (title, breadcrumbs, URLs)
- All LLM calls go exclusively through a **Cloudflare Worker** (no keys exposed)
- Streaming responses from OpenRouter (LLM router)
- Conversation memory, regenerate, stop, copy, suggested questions
- Current page context awareness
- Premium ChatGPT-like UI (dark/light, mobile responsive)

### Architecture
```
Browser (Docusaurus)
    ↓ only calls
Cloudflare Worker
    ├── Embed query (Workers AI @cf/baai/bge-small-en-v1.5)
    ├── Search entire Qdrant collection
    ├── Build full prompt (system + docs + history + page context)
    └── Stream from OpenRouter → client
```

### Setup & Running

1. **Start Qdrant** (local recommended for development):
   ```bash
   docker run -p 6333:6333 qdrant/qdrant
   ```

2. **Index the documentation** (run whenever docs change):
   ```bash
   cp .env.example .env
   # edit QDRANT_URL (and API key if needed)
   npm run index-docs
   ```

3. **Configure & deploy the Worker**:
   - Easiest for most people: Go to the Cloudflare dashboard → Workers & Pages
   - Connect your repo and select the **`worker`** folder as root directory
   - Add the required **Bindings** (AI) and **Secrets** (CHAT_API) directly in the UI
   - See `worker/README.md` for detailed dashboard steps

   Or using CLI:
   ```bash
   cd worker
   wrangler secret put CHAT_API
   wrangler deploy
   ```

4. **Point frontend at the worker**:
   Edit `src/lib/aiConfig.ts` → `WORKER_URL`

5. **Start everything together (recommended)**:
   ```bash
   npm run dev
   ```
   This starts **both** the documentation site + the AI Worker backend automatically on their respective ports.

   The floating AI button will appear in the bottom-right corner.

   (Alternative: `npm run start` for docs only + `npm run worker:dev` in another terminal)

### Production Notes
- Use a hosted Qdrant (Qdrant Cloud free tier works great).
- Deploy the worker separately to Cloudflare (`cd worker && wrangler deploy`).
- **Update `src/lib/aiConfig.ts` → `WORKER_URL`** to your deployed worker URL before building the docs site.
- Re-index after any documentation updates (`npm run index-docs`).
- The worker contains rate limiting and strict prompt rules against hallucination.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
