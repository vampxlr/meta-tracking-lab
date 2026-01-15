# Meta Tracking Lab 🚀

**Interactive Learning Platform for Meta Pixel and Conversions API**

An educational platform where developers **actually send real events to Meta** and see complete network transparency. Each documentation page includes interactive playgrounds that demonstrate tracking concepts through hands-on experimentation.

---

## 🤖 For AI Models & Developers

**📖 START HERE:** [`.ai-context.md`](.ai-context.md) - Complete architecture overview

**📖 QUICK GUIDE:** [`AI_DEVELOPER_GUIDE.md`](AI_DEVELOPER_GUIDE.md) - Common patterns and mistakes

**📖 IMPLEMENTATION:** [`ENHANCED_INTERACTIVE_GUIDE.md`](ENHANCED_INTERACTIVE_GUIDE.md) - How to build new pages

**Reading these first will save you hours of debugging!**

---

## ✨ What Makes This Special

This isn't just documentation—it's an **interactive learning laboratory**:

- 🔴 **Send REAL Events to Meta** (both Pixel and CAPI)
- 🔍 **Network Inspector** - See exactly what's sent and received
- ⚡ **Instant Verification** - Check Meta Events Manager in real-time
- 🎭 **Broken vs Fixed** - Compare implementations side-by-side
- 📋 **Production Code** - Copy-paste ready examples
- 🎓 **Learn by Doing** - Understand through experimentation

---

## 🎯 Current Status

### ✅ Complete (6 Pages)
1. Home - Project overview
2. Setup Checklist - Installation guide
3. Demo Controls - Playground tutorial
4. Missing Events - Debugging guide
5. **Duplicate Events** - Fully interactive with 8 real scenarios
6. CAPI Test - Interactive server testing

### 🚧 To Build (11 Pages)
Each with 6-8 interactive scenarios and real Meta integration.

See [`ENHANCED_INTERACTIVE_GUIDE.md`](ENHANCED_INTERACTIVE_GUIDE.md) for pre-written examples and implementation guide.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm
- Meta Pixel ID (for real event sending)

### Installation

```bash
# Clone the repository
git clone https://github.com/vampxlr/meta-tracking-lab.git
cd meta-tracking-lab

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Configuration

Edit `.env.local`:

```bash
# Required - Your Meta Pixel ID
NEXT_PUBLIC_FB_PIXEL_ID=your_pixel_id_here

# Optional - For CAPI testing
META_CAPI_ACCESS_TOKEN=your_access_token_here
META_TEST_EVENT_CODE=TEST12345
```

**Where to find these:**
- **Pixel ID**: Meta Business Manager → Events Manager → Data Sources → Pixels
- **Access Token**: Meta Business Manager → Business Settings → System Users → Generate Token (with `ads_management` permission)
- **Test Code**: Events Manager → Test Events tab

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🎓 How to Use

### 1. Visit Any Documentation Page
Start with `/problems/duplicate-events` for a complete example.

### 2. Read the Concept
Each page explains a specific tracking problem or concept.

### 3. Try the Interactive Playground
- Toggle between "Broken" and "Fixed" modes
- Click event buttons to send REAL events to Meta
- View the Network Inspector to see:
  - Pixel Request (browser-side)
  - CAPI Request (server-side)
  - Meta's Response
- Check Event History for all sent events

### 4. Verify in Meta Events Manager
- Click "Open Events Manager" button
- See your events appear within 5-10 seconds
- Verify deduplication works (Fixed mode = 1 event, not 2)

### 5. Copy Production Code
All code examples are production-ready—just copy and paste!

---

## 🏗️ Architecture

### Tech Stack
- **Next.js 15** - App Router
- **React 19** - Latest features
- **TypeScript** - Type safety
- **Tailwind CSS** - Custom hacker theme
- **shadcn/ui** - UI components
- **Meta Pixel** - Real client-side tracking
- **Conversions API** - Real server-side tracking

### Key Component: EnhancedEventPlayground

The core of the interactive experience:

```typescript
<EnhancedEventPlayground
  title="Your Test Suite"
  description="What users will learn"
  events={customEvents}          // 6-8 scenarios
  sendToMeta={true}               // Send real events
  sendToBoth={true}               // Both Pixel & CAPI
  showNetworkInspector={true}     // Show network details
  showMetaResponse={true}         // Show Meta's response
  testEventCode="TEST_CODE"       // Use test mode
  pixelId={process.env.NEXT_PUBLIC_FB_PIXEL_ID}
/>
```

### Project Structure

```
app/
├── page.tsx                              # Home
├── layout.tsx                            # Root layout
├── globals.css                           # Global styles + theme
├── getting-started/
│   ├── setup-checklist/page.tsx         # Setup guide
│   └── demo-controls/page.tsx           # Playground tutorial
├── problems/
│   ├── duplicate-events/page.tsx        # ✅ FULLY INTERACTIVE
│   └── missing-events/page.tsx          # Basic version
├── capi-test/page.tsx                   # CAPI testing
└── api/
    ├── meta/capi/route.ts               # CAPI endpoint
    └── setup-status/route.ts            # Status check

components/
├── enhanced-event-playground.tsx        # ✅ Core interactive component
├── page-content.tsx                     # Page layout wrapper
├── app-shell.tsx                        # Main app layout
├── setup-status-panel.tsx               # Sidebar status
└── ui/                                  # shadcn components

content/
└── nav.ts                               # Navigation config
```

---

## 📖 Documentation Pages

### Getting Started
- **Setup Checklist** - Environment setup and configuration
- **Demo Controls** - How to use the interactive playground

### Core Problems (5 complete, 9 to build)
- ✅ **Missing Events** - Debug missing event issues
- ✅ **Duplicate Events** - Prevent duplicate counting (FULLY INTERACTIVE)
- 🚧 **Low Match Quality** - Improve PII hashing and matching
- 🚧 **Purchase Mismatch** - Fix value and currency issues
- 🚧 **Wrong Parameters** - Correct field names and types
- 🚧 **Event Order** - Logical event sequences
- 🚧 **Missing Event ID** - Deduplication fundamentals
- 🚧 **Dedup Misconfigured** - Advanced dedup scenarios
- 🚧 **Cookie FBP Issues** - First-party cookie setup
- 🚧 **AEM Domain Issues** - Multi-domain tracking
- 🚧 **Testing & Debugging** - Tools and techniques

### Server-Side & Reliability (4 to build)
- 🚧 **CAPI Setup** - Server-side configuration
- 🚧 **First-Party Endpoint** - Custom tracking endpoint
- 🚧 **Retry Queue** - Resilient event sending
- 🚧 **Schema Guardrails** - Event validation
- 🚧 **Security & Privacy** - Data protection

---

## 🎨 Design System

### Theme: Hacker/Cyberpunk
- **Colors**: Neon green (`#00ff41`), Cyan (`#00d9ff`)
- **Fonts**: Inter (body), JetBrains Mono (code)
- **Effects**: Glassmorphism, animated borders, neon glows

### CSS Classes
```css
.glass              /* Light glassmorphism */
.glass-strong       /* Strong glassmorphism */
.hover-glow         /* Glow on hover */
.hover-lift         /* Lift and scale on hover */
.border-animated    /* Pulsing border */
.text-glow-hover    /* Text glow on hover */
.button-neon        /* Cyberpunk button */
```

---

## 🛠️ Building New Pages

### Step 1: Copy Template
```bash
cp app/problems/duplicate-events/page.tsx app/problems/your-page/page.tsx
```

### Step 2: Get Pre-Written Examples
Open [`ENHANCED_INTERACTIVE_GUIDE.md`](ENHANCED_INTERACTIVE_GUIDE.md) and find your page's section. It includes 6-8 pre-written event examples!

### Step 3: Customize Content
- Update title/description
- Replace event definitions
- Update educational sections
- Add code examples

### Step 4: Add to Navigation
```typescript
// content/nav.ts
{
  title: "Your Page",
  href: "/problems/your-page",
  icon: YourIcon,
  group: "Core Problems"
}
```

### Step 5: Test
```bash
npm run dev
# Visit page, send events, check Meta Events Manager
```

**Time:** 30-45 minutes per page using the guide!

---

## 🧪 Testing

### Local Testing
```bash
npm run dev
# Visit http://localhost:3000
# Send events from any interactive playground
# Check browser console and Network tab
```

### Meta Events Manager
1. Open Meta Events Manager
2. Go to Test Events tab
3. Send events from playground
4. See them appear within 5-10 seconds
5. Verify deduplication (Fixed mode)

### Build Test
```bash
npm run build
# Must pass with no errors
```

---

## 📚 Meta Integration

### Client-Side (Meta Pixel)
- Loads via `FacebookPixel` component
- Sends via `fbq('track', eventName, data, { eventID })`
- Automatic page view tracking
- Manual event triggering from playground

### Server-Side (Conversions API)
- API route: `/api/meta/capi`
- Endpoint: `https://graph.facebook.com/v19.0/{pixel-id}/events`
- Access token from environment
- Full request/response logging

### Deduplication
- Both use same `event_id`
- Meta automatically deduplicates
- Within 48-hour window
- Verify in Events Manager

---

## ⚠️ Important Notes

### Security
- Never commit `.env.local` to git (already in `.gitignore`)
- Rotate access tokens periodically
- Use test event codes in development

### Data Privacy
- All PII must be hashed (SHA-256)
- Normalize before hashing (lowercase, trim)
- No plaintext emails, phones, names

### Production
- Remove test event codes
- Use production access tokens
- Enable error monitoring
- Implement retry logic

---

## 🤝 Contributing

Contributions welcome! To add a new page:

1. Read [`ENHANCED_INTERACTIVE_GUIDE.md`](ENHANCED_INTERACTIVE_GUIDE.md)
2. Copy the duplicate-events template
3. Use pre-written examples from guide
4. Test thoroughly
5. Submit PR with:
   - New page file
   - Navigation update
   - Screenshot of working playground

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🌟 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide](https://lucide.dev/) - Icons
- [Meta Graph API](https://developers.facebook.com/docs/graph-api/) - Conversions API

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/vampxlr/meta-tracking-lab/issues)
- **Documentation**: All `.md` files in root directory
- **AI Guide**: [`.ai-context.md`](.ai-context.md) for AI models

---

**Start building interactive tracking education today!** 🚀
