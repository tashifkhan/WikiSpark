# Wiki Spark: Wikipedia Reimagined

Wiki Spark is a modern, beautiful Wikipedia reader and browser extension that transforms your reading experience. It consists of:

- **Web App**: A fast, responsive React + TypeScript app for browsing and reading Wikipedia articles with a better UI.
- **Browser Extension**: Redirects Wikipedia links to Wiki Spark for a seamless, enhanced reading experience everywhere.

---

## Features

### Web App

- Powerful search for Wikipedia articles
- Clean, distraction-free reading interface
- Light/dark mode support
- Fast navigation and instant loading
- Sidebar for easy article navigation
- Shareable article links
- Highly configurable: choose from a wide variety of themes, fonts, and layout options to personalize your reading experience

### Browser Extension

- Automatically redirects all Wikipedia links to Wiki Spark
- Preserves article content and links
- Works on all websites
- Smart detection (won't redirect if already on Wiki Spark)

---

## Everything is Configurable

Wiki Spark is designed for maximum customization. You can choose from many different themes, fonts, and interface options to create your ideal reading environment. Make Wikipedia look and feel exactly how you want.

Additionally, with the browser extension installed, all Wikipedia links you click anywhere on the web will be redirected to Wiki Spark, ensuring a consistent and enhanced reading experience.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **State/Data**: @tanstack/react-query
- **Routing**: react-router-dom
- **UI/UX**: lucide-react, radix-ui, sonner (toasts)
- **Linting**: ESLint, TypeScript ESLint

---

## Monorepo Structure

```
wiki/
  client/      # React web app
  extension/   # Browser extension (Chrome & Firefox)
```

- `client/`: Main web application source code
- `extension/`: Browser extension for redirecting Wikipedia links

---

## Getting Started (Web App)

### Prerequisites

- Node.js (v18+ recommended)
- pnpm, npm, or yarn

### Install dependencies

```bash
cd client
npm install
```

### Run the development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Lint the code

```bash
npm run lint
```

---

## Browser Extension

The extension automatically redirects Wikipedia links to Wiki Spark for a better reading experience.

### Installation

#### Chrome

1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `extension/` folder

#### Firefox

1. Go to `about:debugging`
2. Click "This Firefox"
3. Click "Load Temporary Add-on"
4. Select `manifest-firefox.json` from the `extension/` folder

### Development

- Edit files in `extension/`
- Reload the extension in your browser's extension page after changes

### Building for Distribution

- See `extension/README.md` for Chrome Web Store and Firefox Add-ons instructions

---

## Contributing

Pull requests and issues are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

[GPL-3.0 License](LICENSE)
