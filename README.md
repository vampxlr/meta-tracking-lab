# Meta Tracking Lab

Interactive documentation for debugging and validating Meta Pixel events and Conversions API implementations.

## Current Status

**Overall Completion: 94.3%** (50/53 features complete)

The project is in excellent shape with all core features implemented. The remaining 5.7% consists of placeholder implementations for server-side tracking features planned for future development.

**What's Working Now:**
- ✅ 18 complete documentation pages with dynamic routing
- ✅ Interactive demo panel for event testing
- ✅ 16 fully implemented components (7 core + 9 UI)
- ✅ Responsive design with mobile support
- ✅ Dark mode with theme persistence
- ✅ Event logging with JSON preview
- ✅ Toast notifications for feedback
- ✅ Navigation system with sidebar and mobile menu

**Planned for Future:**
- ⏳ Real Meta Pixel integration (currently placeholder)
- ⏳ Conversions API implementation (currently placeholder)
- ⏳ Server-side event queue and retry logic (currently placeholder)

## Features

### Documentation System
- **18 Documentation Pages** covering core tracking problems and server-side reliability
  - Getting Started (3 pages): Overview, Setup Checklist, Demo Controls
  - Core Problems (11 pages): Missing Events, Duplicate Events, Purchase Mismatch, Low Match Quality, Wrong Parameters, Event Order, Missing Event ID, Dedup Misconfigured, Cookie FBP Issues, AEM Domain Issues, Testing & Debugging
  - Server-Side & Reliability (4 pages): First-Party Endpoint, Retry Queue, Schema Guardrails, Security & Privacy
- **Dynamic Page Routing** using Next.js catch-all routes
- **Page Registry System** for centralized content management
- **Consistent Page Structure** with section-based content and status badges

### Interactive Demo Panel
- **Event Mode Switching** (Broken/Fixed) to demonstrate tracking issues
- **Event Triggering** for common e-commerce events (ViewContent, AddToCart, Purchase)
- **Real-time Event Logging** with timestamps
- **JSON Payload Preview** with pretty-printed formatting
- **Copy to Clipboard** functionality for payloads
- **Event History** with scrollable log viewer
- **Clear Logs** functionality

### Component Architecture
- **16 Components** (7 core + 9 UI components)
  - Core Components: AppShell, DemoPanel, FacebookPixel, PageContent, PageShell, ThemeProvider, Toaster
  - UI Components: Badge, Button, Card, Input, ScrollArea, Separator, Sheet, Tabs, Tooltip
- **Responsive Layout** with collapsible sidebar for mobile
- **Dark Mode Support** with system theme detection and persistence
- **Navigation System** with active route highlighting

### User Experience
- **Dark, Modern UI** built with shadcn/ui and Tailwind CSS
- **Responsive Design** optimized for desktop and mobile devices
- **Toast Notifications** using Sonner for user feedback
- **Smooth Animations** and transitions
- **Accessibility** with WCAG compliant components

## Documentation

### Features Implemented
Detailed documentation of all implemented features is available in the [`features-implemented/`](features-implemented/) folder:

- [`01-documentation-pages.md`](features-implemented/01-documentation-pages.md) - Complete list of all 18 documentation pages
- [`02-components.md`](features-implemented/02-components.md) - All 16 components with details
- [`03-utilities.md`](features-implemented/03-utilities.md) - Utility functions and helpers
- [`04-api-routes.md`](features-implemented/04-api-routes.md) - API route implementations
- [`05-app-structure.md`](features-implemented/05-app-structure.md) - Application architecture
- [`06-configuration.md`](features-implemented/06-configuration.md) - Configuration details
- [`07-ui-components.md`](features-implemented/07-ui-components.md) - UI component library
- [`08-summary.md`](features-implemented/08-summary.md) - Comprehensive project summary

### Todos & Future Work
Tracking for remaining work and future enhancements is available in the [`todos/`](todos/) folder:

- [`01-placeholder-features.md`](todos/01-placeholder-features.md) - Placeholder implementations
- [`02-future-enhancements.md`](todos/02-future-enhancements.md) - Planned features
- [`03-bug-fixes.md`](todos/03-bug-fixes.md) - Known issues and fixes
- [`04-improvements.md`](todos/04-improvements.md) - Suggested improvements
- [`05-testing.md`](todos/05-testing.md) - Testing requirements
- [`06-documentation.md`](todos/06-documentation.md) - Documentation tasks
- [`07-active-todos.md`](todos/07-active-todos.md) - Active development tasks

## Tech Stack

- **Next.js 15** with App Router
- **React 19** for UI components
- **TypeScript 5** for type safety
- **Tailwind CSS 3.4.19** for styling
- **shadcn/ui** as the primary UI component library (Radix UI based)
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

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Meta Pixel Configuration
NEXT_PUBLIC_FB_PIXEL_ID=your_pixel_id_here

# Conversions API Configuration (Future)
FB_ACCESS_TOKEN=your_access_token_here
FB_PIXEL_ID=your_pixel_id_here
```

## CAPI Setup

This lab includes a functional Conversions API (CAPI) implementation for server-side event tracking. The CAPI Test page allows you to send events directly to Meta's Graph API, bypassing browser restrictions and improving tracking reliability.

### Prerequisites

Before setting up CAPI, ensure you have:

- **Meta Pixel** - A Meta Pixel created in Meta Business Manager
- **Access Token** - A System User Access Token with appropriate permissions

### Setup Steps

1. **Create a Meta Pixel**
   
   Navigate to Meta Business Manager > Events Manager > Pixels and create a new pixel for your app.

2. **Generate a System User Access Token**
   
   Create a System User in Meta Business Manager and generate an access token with the following permissions:
   - `ads_management`
   - `ads_read`

3. **Configure Environment Variables**
   
   Add the following variables to your `.env.local` file:
   
   ```bash
   # Meta CAPI Configuration
   META_CAPI_ACCESS_TOKEN=your_access_token_here
   NEXT_PUBLIC_FB_PIXEL_ID=your_pixel_id_here
   META_GRAPH_API_VERSION=v19.0
   META_TEST_EVENT_CODE=your_test_code_here
   ```
   
   - `META_CAPI_ACCESS_TOKEN` (required) - Your System User Access Token
   - `NEXT_PUBLIC_FB_PIXEL_ID` (required) - Your Meta Pixel ID
   - `META_GRAPH_API_VERSION` (optional) - Graph API version (defaults to v19.0)
   - `META_TEST_EVENT_CODE` (optional) - Test event code for development testing

4. **Run the Development Server**
   
   ```bash
   npm run dev
   ```

5. **Test CAPI**
   
   Navigate to [`/capi-test`](http://localhost:3000/capi-test) to access the CAPI Test page and send test events.

### Testing CAPI

The CAPI Test page provides an interactive interface for testing server-side event tracking:

- **Send Test Events** - Choose between different event types (ViewContent, AddToCart, Purchase)
- **Mode Selection** - Test both "Broken" and "Fixed" implementations to understand common issues
- **Event Logging** - View real-time event logs with JSON payloads
- **Verification** - Use Meta Events Manager's Test Events tab to verify received events

### Important Notes

- **Security** - Never commit `.env.local` to version control. Add it to your `.gitignore` file.
- **Access Tokens** - Keep your access tokens secure and rotate them periodically.
- **Test Events** - Always use test event codes during development to avoid polluting production data.
- **Broken Mode** - The "Broken" mode is for demonstration purposes only and shows common implementation mistakes.
- **Production** - When moving to production, remove test event codes and ensure proper error handling and retry logic.

## Project Structure

```
├── app/                          # Next.js app directory
│   ├── api/meta/capi/           # API routes (placeholder)
│   ├── getting-started/         # Getting Started pages
│   ├── problems/                # Core Problems pages
│   ├── server/                  # Server-Side & Reliability pages
│   ├── connect/                 # Connection test page
│   ├── [...slug]/               # Dynamic routes for documentation
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/
│   ├── ui/                      # shadcn/ui components (9 components)
│   ├── app-shell.tsx            # Main layout (header + sidebar)
│   ├── demo-panel.tsx           # Interactive event playground
│   ├── facebook-pixel.tsx       # Pixel integration
│   ├── page-content.tsx         # Dynamic page renderer
│   ├── page-shell.tsx           # Page wrapper component
│   ├── theme-provider.tsx       # Theme provider
│   └── toaster.tsx              # Toast configuration
├── content/
│   ├── nav.ts                   # Sidebar navigation config
│   └── pages-registry.ts        # Page registry for dynamic routing
├── features-implemented/        # Feature documentation
│   ├── 01-documentation-pages.md
│   ├── 02-components.md
│   ├── 03-utilities.md
│   ├── 04-api-routes.md
│   ├── 05-app-structure.md
│   ├── 06-configuration.md
│   ├── 07-ui-components.md
│   └── 08-summary.md
├── todos/                       # Future work and enhancements
│   ├── 01-placeholder-features.md
│   ├── 02-future-enhancements.md
│   ├── 03-bug-fixes.md
│   ├── 04-improvements.md
│   ├── 05-testing.md
│   ├── 06-documentation.md
│   └── 07-active-todos.md
├── lib/
│   ├── meta/                    # Client-side Meta helpers
│   │   ├── client.ts           # Client utilities
│   │   └── event-utils.ts      # Event utilities
│   ├── server/meta/             # Server-side CAPI helpers
│   │   └── index.ts            # Server utilities
│   └── utils.ts                 # Utility functions
└── package.json
```

## Pages

### Getting Started
- **Overview** - Introduction to Meta Tracking Lab
- **Setup Checklist** - Configuration verification
- **Demo Controls** - How to use the Event Playground

### Core Problems
- **Missing Events** - Diagnose and fix missing event issues
- **Duplicate Events** - Prevent and resolve duplicate events
- **Purchase Mismatch** - Resolve purchase discrepancies
- **Low Match Quality** - Improve attribution accuracy
- **Wrong Parameters** - Fix parameter configuration issues
- **Event Order** - Correct event sequencing
- **Missing Event ID** - Understand event ID importance
- **Dedup Misconfigured** - Fix deduplication problems
- **Cookie FBP Issues** - Resolve cookie-related issues
- **AEM Domain Issues** - Address domain configuration problems
- **Testing & Debugging** - Master debugging tools and techniques

### Server-Side & Reliability
- **First-Party Endpoint** - Implement first-party tracking
- **Retry Queue** - Robust retry mechanism for failed events
- **Schema Guardrails** - Validation and sanitization
- **Security & Privacy** - Best practices for data protection

## Demo Panel Features

The Event Playground allows you to:
- Switch between **Broken** and **Fixed** modes to see tracking issues
- Trigger common e-commerce events (ViewContent, AddToCart, Purchase)
- View JSON payloads with pretty-printed formatting
- Copy payloads to clipboard for testing
- View event history with timestamps
- Clear logs to start fresh
- Test different event configurations in real-time

## Future Development

### Phase 2: Real Integration
The following features are currently placeholders and planned for future implementation:

- **Real Meta Pixel Integration**
  - Actual `fbq()` function integration
  - Event validation and error handling
  - Queue management for failed events

- **Conversions API Implementation**
  - Server-side event submission
  - Event validation and sanitization
  - Response handling and error management

- **Event Deduplication**
  - Client-server deduplication logic
  - Event ID matching
  - Duplicate detection and prevention

- **Server-Side Event Queue**
  - Retry mechanism for failed events
  - Exponential backoff strategy
  - Queue persistence

- **Advanced Testing Scenarios**
  - A/B testing capabilities
  - Load testing tools
  - Performance benchmarking

### Long-term Enhancements

- **Search Functionality** - Full-text search across documentation
- **User Authentication** - Personalized tracking configurations
- **Analytics Dashboard** - View tracking statistics
- **Video Tutorials** - Interactive walkthroughs
- **API Reference** - Complete API documentation
- **Automated Testing** - Unit and integration tests

## License

MIT
