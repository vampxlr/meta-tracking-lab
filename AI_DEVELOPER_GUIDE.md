# AI Developer Guide - Meta Tracking Lab

**For:** AI Models working on this project
**Updated:** January 15, 2026

---

## 🎯 Quick Context

This is an **interactive educational platform** for Meta Pixel and Conversions API. Each documentation page sends **real events to Meta** and shows complete network transparency.

---

## 📁 Current Architecture

### ✅ What EXISTS Now

```
app/
├── page.tsx                              # Home
├── layout.tsx                            # Root layout
├── globals.css                           # Global styles
├── getting-started/
│   ├── setup-checklist/page.tsx
│   └── demo-controls/page.tsx
├── problems/
│   ├── duplicate-events/page.tsx        # FULLY INTERACTIVE (example)
│   └── missing-events/page.tsx
└── capi-test/page.tsx

components/
├── enhanced-event-playground.tsx        # ✅ CURRENT component
├── page-content.tsx
├── app-shell.tsx
├── setup-status-panel.tsx
└── ui/                                  # shadcn components

content/
└── nav.ts                               # Navigation only
```

### ❌ What NO LONGER EXISTS (DELETED)

```
❌ app/[...slug]/                        # Dynamic route deleted
❌ content/pages-registry.ts             # Registry system deleted
❌ components/demo-panel.tsx             # Old component deleted
❌ components/event-playground.tsx       # Old component deleted
❌ components/locked-event-playground.tsx # Old component deleted
```

---

## 🚀 The Core Component: EnhancedEventPlayground

### Location
`components/enhanced-event-playground.tsx`

### What It Does
- Sends REAL events to Meta Pixel (browser)
- Sends REAL events to CAPI (server)
- Shows Network Inspector (3 tabs)
- Logs event history
- Displays match quality
- Links to Meta Events Manager

### How to Use It

```typescript
import { EnhancedEventPlayground } from "@/components/enhanced-event-playground"
import { Zap } from "lucide-react"

export default function YourPage() {
  const customEvents = [
    {
      name: "Example Event",
      icon: <Zap className="h-4 w-4 text-[#00ff41] icon-spin-hover" />,
      description: "What this demonstrates",
      brokenPayload: {
        event_name: "Purchase",
        // Missing required fields - shows the problem
      },
      fixedPayload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        custom_data: {
          currency: "USD",
          value: 99.99
        }
        // All required fields - shows the solution
      }
    },
    // Add 5-7 more event examples
  ]

  return (
    <PageContent title="Your Title" description="Your description">
      {/* Educational content */}
      
      <EnhancedEventPlayground
        title="Interactive Testing"
        description="Try these scenarios"
        events={customEvents}
        sendToMeta={true}
        sendToBoth={true}
        showNetworkInspector={true}
        showMetaResponse={true}
        testEventCode="TEST_CODE"
        pixelId={process.env.NEXT_PUBLIC_FB_PIXEL_ID}
      />
    </PageContent>
  )
}
```

---

## 📖 Building New Pages

### Step 1: Copy Template
```bash
cp app/problems/duplicate-events/page.tsx app/problems/your-new-page/page.tsx
```

### Step 2: Define 6-8 Custom Events

**Pattern:**
```typescript
const customEvents = [
  {
    name: "Descriptive Name",
    icon: <Icon className="h-4 w-4 text-[#00ff41]" />,
    description: "What this demonstrates",
    brokenPayload: {
      // Shows the problem
    },
    fixedPayload: {
      // Shows the solution
      event_id: `unique_${Date.now()}`,
      event_time: Math.floor(Date.now() / 1000),
      // All required fields
    }
  }
]
```

### Step 3: Update Content
- Title and description
- Problem explanation with examples
- "How It Works" section
- Implementation guide with code
- Best practices
- Related topics

### Step 4: Test
```bash
npm run dev
# Click event buttons
# View Network Inspector
# Check Meta Events Manager
# Verify events appear correctly
```

---

## ⚠️ Common Mistakes to AVOID

### 1. ❌ Using Deleted Components
```typescript
// DON'T DO THIS - Component doesn't exist!
import { DemoPanel } from "@/components/demo-panel"
import { EventPlayground } from "@/components/event-playground"
```

```typescript
// DO THIS - Use current component
import { EnhancedEventPlayground } from "@/components/enhanced-event-playground"
```

### 2. ❌ Using Deleted Registry System
```typescript
// DON'T DO THIS - File doesn't exist!
import { pagesRegistry } from "@/content/pages-registry"
```

```typescript
// DO THIS - Create individual page files
// app/problems/your-page/page.tsx
export default function YourPage() {
  return <PageContent>...</PageContent>
}
```

### 3. ❌ Using Dynamic Route
```typescript
// DON'T DO THIS - Route doesn't exist!
// app/[...slug]/page.tsx
```

```typescript
// DO THIS - Create specific route folders
// app/problems/low-match-quality/page.tsx
// app/problems/purchase-mismatch/page.tsx
```

### 4. ❌ ESLint Errors

**Apostrophes:**
```typescript
// DON'T
<p>It's broken</p>  // Build error!

// DO
<p>It&apos;s broken</p>  // Or use {`It's broken`}
```

**useEffect Dependencies:**
```typescript
// DON'T
useEffect(() => {
  doSomething()  // Missing from deps!
}, [])

// DO
const doSomething = useCallback(() => {
  // ...
}, [])

useEffect(() => {
  doSomething()
}, [doSomething])  // Include in deps
```

---

## 🎨 Design System

### Colors
```typescript
// Primary
"#00ff41"  // Neon green (main accent)
"#00d9ff"  // Cyan (secondary accent)
"#0a0e14"  // Dark background
"#151b26"  // Card background
"#8b949e"  // Text gray
"#e8f4f8"  // Light text
```

### Fonts
- **Inter** - Body text
- **JetBrains Mono** - Code/monospace

### Key CSS Classes
```css
.glass                    /* Light glassmorphism */
.glass-strong             /* Strong glassmorphism */
.hover-glow               /* Glow on hover */
.hover-lift               /* Lift on hover */
.border-animated          /* Pulsing border */
.text-glow-hover          /* Text glow on hover */
.icon-spin-hover          /* Icon spin on hover */
.button-neon              /* Neon button effect */
```

### Component Patterns

**Section:**
```tsx
<section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
  {/* content */}
</section>
```

**Heading:**
```tsx
<h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] 
               border-l-4 border-[#00ff41] pl-4 text-glow-hover">
  <span className="inline-block animate-pulse">▸</span> Your Heading
</h2>
```

**Glass Card:**
```tsx
<div className="glass-strong hover-border-glow rounded-xl border border-[#00ff41]/20 p-6">
  {/* content */}
</div>
```

**Code Block:**
```tsx
<pre className="text-xs font-mono text-[#00ff41] bg-[#0d1117] rounded p-4 overflow-x-auto">
  {code}
</pre>
```

---

## 📚 Documentation Reference

### Read These (Current)
1. **`ENHANCED_INTERACTIVE_GUIDE.md`** - Implementation guide with pre-written examples
2. **`INTERACTIVE_TRANSFORMATION_COMPLETE.md`** - Project status
3. **`.ai-context.md`** - Architecture overview (this file's companion)
4. **`LINTING_AND_BEST_PRACTICES.md`** - Code quality

### Ignore These (Deleted/Outdated)
- ❌ Any file with "REFACTOR", "TRANSFORMATION", "VISUAL_ENHANCEMENTS" in name
- ❌ `features-implemented/` folder
- ❌ `CHATGPT_PAGE_BUILDER_PROMPT.md`
- ❌ `PAGE_BUILDER_BLUEPRINT.md`

---

## 🔧 Technical Stack

- **Next.js 15** - App Router, React Server Components
- **React 19** - Latest features
- **TypeScript** - Strict mode
- **Tailwind CSS** - Custom theme
- **shadcn/ui** - Component library
- **Meta Pixel** - `fbq()` integration
- **Conversions API** - Server-side tracking
- **Sonner** - Toast notifications

---

## 🎯 Development Workflow

### Adding a New Page

1. **Check the Guide**
   - Open `ENHANCED_INTERACTIVE_GUIDE.md`
   - Find pre-written events for your page
   - Copy event definitions

2. **Create Page File**
   ```bash
   mkdir -p app/problems/your-page
   cp app/problems/duplicate-events/page.tsx app/problems/your-page/page.tsx
   ```

3. **Update Navigation**
   ```typescript
   // content/nav.ts
   {
     title: "Your Page Title",
     href: "/problems/your-page",
     icon: YourIcon,
     group: "Core Problems"
   }
   ```

4. **Customize Content**
   - Update title, description
   - Replace event examples
   - Update educational sections
   - Add relevant code examples

5. **Test Locally**
   ```bash
   npm run dev
   # Visit http://localhost:3000/problems/your-page
   # Send events, check Meta Events Manager
   ```

---

## 🚨 Build Requirements

### Before Committing
- ✅ No TypeScript errors
- ✅ No ESLint warnings
- ✅ All apostrophes escaped (`&apos;`)
- ✅ All `useEffect` dependencies included
- ✅ Test pages load correctly
- ✅ Test event sending works
- ✅ Mobile responsive

### Build Command
```bash
npm run build
```

**If build fails:**
1. Check ESLint errors in output
2. Fix apostrophes: `'` → `&apos;`
3. Fix missing dependencies in `useEffect`
4. Re-run build

---

## 💡 Pro Tips

### Event ID Generation
```typescript
// Good patterns
`event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
`purchase_${orderId}`
`lead_${userId}_${Date.now()}`
```

### Broken Payload Ideas
- Missing `event_id`
- Missing `event_time`
- Wrong data types (string instead of number)
- Unhashed PII
- Missing required fields
- Wrong field names

### Fixed Payload Checklist
- ✅ `event_id` present and unique
- ✅ `event_time` (Unix timestamp)
- ✅ `event_name` from standard events
- ✅ `custom_data` properly nested
- ✅ All PII hashed (SHA-256)
- ✅ Correct data types
- ✅ All required fields

---

## 🎓 Example: Complete Page Structure

```typescript
"use client"

import { PageContent } from "@/components/page-content"
import { EnhancedEventPlayground } from "@/components/enhanced-event-playground"
import { Icon1, Icon2 } from "lucide-react"

export default function YourPage() {
  const customEvents = [
    // 6-8 event definitions here
  ]

  return (
    <PageContent
      title="Your Page Title"
      description="Brief description"
      status="Stable"
    >
      
      {/* Problem Explanation */}
      <section className="mb-12">
        <h2 className="mb-6 font-mono text-xl font-bold text-[#00ff41]">
          The Problem
        </h2>
        <p>Explanation...</p>
      </section>

      {/* How It Works */}
      <section className="mb-12">
        <h2 className="mb-6 font-mono text-xl font-bold text-[#00ff41]">
          How It Works
        </h2>
        <p>Explanation...</p>
      </section>

      {/* Interactive Playground */}
      <section className="mb-12">
        <h2 className="mb-6 font-mono text-xl font-bold text-[#00ff41]">
          Interactive Testing
        </h2>
        
        <EnhancedEventPlayground
          title="Test Suite"
          description="Try these scenarios"
          events={customEvents}
          sendToMeta={true}
          sendToBoth={true}
          showNetworkInspector={true}
          pixelId={process.env.NEXT_PUBLIC_FB_PIXEL_ID}
        />
      </section>

      {/* Best Practices */}
      <section className="mb-12">
        <h2 className="mb-6 font-mono text-xl font-bold text-[#00ff41]">
          Best Practices
        </h2>
        <ul>...</ul>
      </section>

    </PageContent>
  )
}
```

---

## 🎉 Summary

**What to Do:**
- ✅ Use `enhanced-event-playground` component
- ✅ Create individual page files
- ✅ Follow `ENHANCED_INTERACTIVE_GUIDE.md`
- ✅ Test with real Meta integration
- ✅ Escape apostrophes
- ✅ Include useEffect dependencies

**What NOT to Do:**
- ❌ Use deleted components (demo-panel, event-playground)
- ❌ Reference pages-registry.ts
- ❌ Use dynamic [...slug] route
- ❌ Leave apostrophes unescaped
- ❌ Forget useEffect dependencies

**Result:** Clean, consistent, interactive pages that actually teach users by letting them experiment with real Meta events!
