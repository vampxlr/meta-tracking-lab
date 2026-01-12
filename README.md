# Meta Tracking Lab

Interactive documentation for debugging and validating Meta Pixel events and Conversions API implementations.

## Features

- **18 Documentation Pages** covering core tracking problems and server-side reliability
- **Interactive Demo Panel** to simulate Meta Pixel events in real-time
- **Dark, Modern UI** built with shadcn/ui and Tailwind CSS
- **Responsive Design** with collapsible sidebar for mobile
- **Event Logging** with JSON payload preview and clipboard support
- **Toast Notifications** using Sonner for feedback

## Tech Stack

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** as the primary UI component library
- **lucide-react** for icons
- **sonner** for toast notifications
- **next-themes** for dark mode support

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm

### Installation

1. Install dependencies:
   ```bash
   npm install
   npm i -D autoprefixer postcss tailwindcss
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                          # Next.js app directory
│   ├── api/meta/capi/           # API routes (placeholder)
│   ├── getting-started/         # Getting Started pages
│   ├── problems/                # Core Problems pages
│   ├── server/                  # Server-Side & Reliability pages
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── app-shell.tsx            # Main layout (header + sidebar)
│   ├── demo-panel.tsx           # Interactive event playground
│   ├── page-shell.tsx           # Page wrapper component
│   ├── theme-provider.tsx       # Theme provider
│   └── toaster.tsx              # Toast configuration
├── content/
│   └── nav.ts                   # Sidebar navigation config
├── lib/
│   ├── meta/                    # Client-side Meta helpers (placeholder)
│   ├── server/meta/             # Server-side CAPI helpers (placeholder)
│   └── utils.ts                 # Utility functions
└── package.json
```

## Pages

### Getting Started
- **Overview** - Introduction to Meta Tracking Lab
- **Setup Checklist** - Configuration verification
- **Demo Controls** - How to use the Event Playground

### Core Problems
- Missing Events
- Duplicate Events
- Purchase Mismatch
- Low Match Quality
- Wrong Parameters
- Event Order
- Missing Event ID
- Dedup Misconfigured
- Cookie FBP Issues
- AEM Domain Issues
- Testing & Debugging

### Server-Side & Reliability
- First-Party Endpoint
- Retry Queue
- Schema Guardrails
- Security & Privacy

## Demo Panel Features

The Event Playground allows you to:
- Switch between **Broken** and **Fixed** modes
- Trigger common e-commerce events (ViewContent, AddToCart, Purchase)
- View JSON payloads with pretty-printed formatting
- Copy payloads to clipboard
- View event history with timestamps
- Clear logs

## Future Development (Days 2-3)

- Real Meta Pixel integration
- Conversions API implementation
- Event deduplication
- Server-side event queue
- Advanced testing scenarios

## License

MIT
