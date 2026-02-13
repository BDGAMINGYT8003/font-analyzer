# Font Downloader

A powerful web tool to discover, inspect, and download fonts from any website. Simply enter a URL to extract all fonts used on the page, preview them live, view their CSS properties, and find legal alternatives.

## ⚠️ Important Legal Disclaimer

**This tool is a developer utility for inspection and research purposes.**

Respect Licenses: Many web fonts are licensed software. Identifying or downloading a font does not grant you a license to use it. You are responsible for ensuring you have the appropriate rights or licenses for any font you reuse.

## Features

- 🔍 **Extract Fonts:** Analyze any website URL to discover all used fonts.
- 📱 **Fully Responsive:** Optimized mobile experience and a robust Masonry grid layout for desktop.
- 🌓 **Dark & Light Mode:** Seamless theme switching with system preference detection.
- 👀 **Live Preview:** Type custom text to preview fonts instantly.
- 💻 **CSS Inspector:** View and copy the `@font-face` CSS code for any font.
- 🧹 **Smart Filtering:** Toggle "Remove Duplicates" to clean up the font list.
- 📥 **Direct Download:** Download WOFF, WOFF2, TTF, and OTF files (with legal consent verification).
- ✅ **Find Alternatives:** Get free Google Fonts suggestions similar to extracted fonts.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Motion (formerly Framer Motion)
- **Font Loading:** Next.js Font Optimization

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/shoryabansalgithub/font-stealer.git
   cd font-stealer
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Routes

- `/api/extract` - POST endpoint to extract fonts from a given URL.
- `/api/font` - GET endpoint to fetch and serve font files securely.
- `/api/match` - POST endpoint to find similar free/open-source font alternatives.

## Supported Font Formats

- WOFF (Web Open Font Format)
- WOFF2 (Web Open Font Format 2)
- TTF (TrueType Font)
- OTF (OpenType Font)

## License

MIT License - See LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Disclaimer

This tool is intended for educational and development purposes only. Users must comply with font licensing agreements and copyright laws. The creators of this tool are not responsible for any misuse or copyright infringement by users.
