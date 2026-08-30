# AchSwap & AchMarket Documentation

Official documentation for AchSwap, AchRWA, and AchMarket.

## Prerequisites

- **Node.js 20.x, 22.x, or 24.x**
- **npm >= 10.0**

## Installation

```bash
npm install
npm run start
npm run build
npm run preview
```

## Project Structure

```
achswap-docs/
├── docs/                    # Documentation files
│   ├── introduction.md
│   ├── getting-started/
│   ├── achswap/
│   ├── achrwa/
│   ├── achmarket/
│   └── technical/
├── src/
│   ├── css/custom.css       # AchSwap brand theme
│   └── pages/               # Custom pages
├── static/                  # Logos, favicons, robots.txt
├── docusaurus.config.js
└── sidebars.js
```

## Writing Documentation

1. Create a `.md` file in `docs/`
2. Add it to `sidebars.js`

## Deployment

### Vercel

1. Connect the repository to Vercel
2. Framework Preset: `Docusaurus`
3. Install Command: `npm install`
4. Build Command: `npm run build`
5. Output Directory: `build`

## Brand

Theme tokens follow the AchSwap brand kit:

- Primary: `#003579`
- Dark background: `#0D1117`
- Surface: `#161B22`
- Muted text: `#8B949E`
- Typeface: Inter

## License

MIT License
