# AchSwap & AchMarket Documentation

Welcome to the official documentation for AchSwap v3 and AchMarket.

## Prerequisites

- **Node.js 20.x**
- **npm >= 9.0** (or yarn/pnpm)

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
   - Install Command: `npm install --legacy-peer-deps`
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

- [Docusaurus](https://docusaurus.io/) - Documentation framework
- [React](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
