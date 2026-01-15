# Meta Tracking Lab - Page Builder Specification

Use this document as a prompt to ChatGPT when creating or editing individual page files.

---

## Project Context

**Project:** Meta Tracking Lab - Interactive documentation for Meta Pixel & Conversions API
**Framework:** Next.js 15 with App Router, React 19, TypeScript
**Styling:** Tailwind CSS with custom hacker/cyberpunk theme
**Design Philosophy:** Mobile-first, dark theme, terminal aesthetic, subtle animations

---

## Design System Specifications

### Color Palette

```typescript
// Primary Colors
background-primary: #0a0e1a (deep dark blue-black)
background-secondary: #0f1419 (slightly lighter)
background-card: #151b26

// Accent Colors
accent-primary: #00ff41 (neon green - matrix style)
accent-secondary: #00d9ff (cyan/electric blue)
accent-tertiary: #ff006e (pink for errors/warnings)

// Text Colors
text-primary: #e8f4f8 (off-white, high contrast)
text-secondary: #8b949e (muted gray)
text-accent: #00ff41 (green for highlights)
text-code: #00ff41

// Border Colors
border-default: #1f2937 (subtle)
border-accent: #00ff41 with opacity
border-glow: rgba(0, 255, 65, 0.3) for hover states

// Code Block
code-background: #0d1117
code-text: #00ff41
code-border: #00ff41 with 20% opacity
```

### Typography

```typescript
// Font Families
heading-font: 'JetBrains Mono', 'Fira Code', monospace
body-font: 'Inter', system-ui, sans-serif
code-font: 'JetBrains Mono', 'Fira Code', monospace

// Font Sizes (Mobile-First)
h1: text-2xl md:text-4xl (24px → 36px)
h2: text-xl md:text-3xl (20px → 30px)
h3: text-lg md:text-2xl (18px → 24px)
body: text-sm md:text-base (14px → 16px)
code: text-xs md:text-sm (12px → 14px)

// Font Weights
heading-weight: 600-700 (semibold-bold)
body-weight: 400 (regular)
code-weight: 500 (medium)
```

### Animation Guidelines

**Intensity Level:** 5/10 (moderate, balanced)
**Performance:** Use only transform and opacity (GPU accelerated)
**Duration:** 150-300ms for micro-interactions
**Easing:** cubic-bezier(0.4, 0, 0.2, 1) or ease-out

```typescript
// Common Animations
fadeIn: opacity 0 → 1, duration 300ms
slideUp: translateY(10px) → 0, duration 300ms
glowPulse: box-shadow glow effect, duration 2s infinite
scanLine: pseudo-element animation, very subtle
```

### Component Patterns

#### 1. Section Container
```tsx
<section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
  {/* content */}
</section>
```

#### 2. Hacker Heading (with Glow)
```tsx
<h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] 
               border-l-4 border-[#00ff41] pl-4 text-glow-hover
               animate-in fade-in slide-in-from-left-4 duration-300">
  <span className="inline-block animate-pulse">▸</span> Heading Text
</h2>
```

#### 3. Terminal Code Block
```tsx
<pre className="relative overflow-x-auto rounded-lg border border-[#00ff41]/20 
                bg-[#0d1117] p-4 font-mono text-xs md:text-sm">
  <code className="text-[#00ff41]">{code}</code>
</pre>
```

#### 4. Glass Card (Basic)
```tsx
<div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6">
  {/* Card with frosted glass effect and hover glow */}
</div>
```

#### 5. Glass Card (Strong)
```tsx
<div className="glass-strong hover-border-glow rounded-xl border border-[#00ff41]/20 p-6">
  {/* Card with stronger blur and border glow on hover */}
</div>
```

#### 6. Interactive Card with Icon
```tsx
<div className="glass hover-lift rounded-xl border border-[#00ff41]/20 p-5 group">
  <div className="flex items-center gap-3 mb-3">
    <div className="p-2 rounded-lg bg-[#00ff41]/10 group-hover:bg-[#00ff41]/20 transition-colors">
      <Icon className="h-5 w-5 text-[#00ff41] icon-spin-hover" />
    </div>
    <span className="font-mono font-semibold text-[#00ff41]">Title</span>
  </div>
  <p className="text-sm text-[#8b949e]">Description</p>
</div>
```

#### 7. Animated Border Card
```tsx
<div className="border-animated glass-strong rounded-xl p-6">
  {/* Card with pulsing border animation */}
</div>
```

#### 8. Gradient Border Card
```tsx
<div className="border-gradient">
  <div className="border-gradient-content">
    {/* Card with rotating rainbow border */}
  </div>
</div>
```

#### 9. Neon Button
```tsx
<button className="button-neon rounded-xl px-6 py-4 flex items-center gap-3">
  <Icon className="h-5 w-5" />
  <span>Button Text</span>
  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
</button>
```

#### 10. Terminal List Item
```tsx
<li className="flex items-start gap-3 text-[#8b949e]">
  <span className="mt-1 text-[#00ff41] font-mono shrink-0">›</span>
  <span>List item text</span>
</li>
```

---

## 🎭 Available CSS Classes

### Glassmorphism
- `glass` - Light blur effect
- `glass-strong` - Heavy blur effect

### Hover Effects
- `hover-glow` - Lifts and glows (for cards)
- `hover-lift` - Lifts and scales (for interactive cards)
- `hover-border-glow` - Border glows on hover
- `text-glow-hover` - Text glows on hover
- `icon-spin-hover` - Icon rotates 15° on hover

### Animations
- `border-animated` - Pulsing border glow
- `border-gradient` - Rotating gradient border
- `pulse-glow` - Continuous glow pulse
- `text-shimmer` - Animated gradient text
- `button-neon` - Cyberpunk button with sweep

### Delays
- `delay-100` through `delay-[600ms]` for staggered animations

---

## Page Template Structure

Every page should follow this structure:

```tsx
"use client"

import { PageContent } from "@/components/page-content"
import { SetupStatusPanel } from "@/components/setup-status-panel"
import { DemoPanel } from "@/components/demo-panel"

export default function PageName() {
  return (
    <PageContent
      title="Page Title"
      description="Page description"
      status="Stable"
      rightPanel={<SetupStatusPanel />} // or <DemoPanel />
    >
      
      {/* Section 1 */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4">
          <span className="inline-block animate-pulse">▸</span> Section Heading
        </h2>
        
        <div className="space-y-4">
          <p className="leading-relaxed text-[#8b949e] text-sm md:text-base">
            Section content goes here...
          </p>
          
          {/* Code block if needed */}
          <pre className="relative overflow-x-auto rounded-lg border border-[#00ff41]/20 bg-[#0d1117] p-4 font-mono text-xs md:text-sm">
            <code className="text-[#00ff41]">
              {`code here`}
            </code>
          </pre>
          
          {/* List if needed */}
          <ul className="space-y-3 mt-4">
            <li className="flex items-start gap-3 text-[#8b949e]">
              <span className="mt-1 text-[#00ff41] font-mono shrink-0">›</span>
              <span>List item</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Section 2, 3, etc. */}
      
    </PageContent>
  )
}
```

---

## File Locations Map

Create these files in the following locations:

```
app/
├── getting-started/
│   ├── setup-checklist/
│   │   └── page.tsx
│   └── demo-controls/
│       └── page.tsx
├── problems/
│   ├── missing-events/
│   │   └── page.tsx
│   ├── duplicate-events/
│   │   └── page.tsx
│   ├── purchase-mismatch/
│   │   └── page.tsx
│   ├── low-match-quality/
│   │   └── page.tsx
│   ├── wrong-parameters/
│   │   └── page.tsx
│   ├── event-order/
│   │   └── page.tsx
│   ├── missing-event-id/
│   │   └── page.tsx
│   ├── dedup-misconfigured/
│   │   └── page.tsx
│   ├── cookie-fbp-issues/
│   │   └── page.tsx
│   ├── aem-domain-issues/
│   │   └── page.tsx
│   ├── testing-debugging/
│   │   └── page.tsx
│   └── capi-setup/
│       └── page.tsx
└── server/
    ├── first-party-endpoint/
    │   └── page.tsx
    ├── retry-queue/
    │   └── page.tsx
    ├── schema-guardrails/
    │   └── page.tsx
    └── security-privacy/
        └── page.tsx
```

---

## Content Source

Get the content from `content/pages-registry.ts` - each entry has:
- `title`: Use as page title
- `description`: Use as page description
- `badge`: Use as status ("Stable", "Beta", etc.)
- `sectionBlocks`: Array of sections with `heading` and `body`
- `showDemo`: If true, use `<DemoPanel />`, else use `<SetupStatusPanel />`

---

## Mobile-First Guidelines

1. **Always write mobile styles first, then add `md:` prefixes for desktop**
2. **Touch targets:** Minimum 44x44px for buttons
3. **Text size:** Never smaller than 14px on mobile
4. **Spacing:** Use 4-6 spacing units on mobile, 8-12 on desktop
5. **Code blocks:** Horizontal scroll on mobile is OK
6. **Sticky headers:** Avoid on mobile, use on desktop

---

## Accessibility Requirements

1. **Color contrast:** All text must have 4.5:1 contrast ratio minimum
2. **Keyboard navigation:** All interactive elements must be keyboard accessible
3. **Screen readers:** Use semantic HTML (nav, main, section, article)
4. **ARIA labels:** Add where needed for icon buttons
5. **Focus states:** Visible focus indicators on all interactive elements

---

## Performance Requirements

1. **Animation performance:** Only use `transform` and `opacity`
2. **Lazy loading:** Use for heavy components
3. **Image optimization:** Use Next.js Image component
4. **Bundle size:** Keep individual pages under 100KB
5. **First paint:** Target under 1 second

---

## Common Patterns Reference

### Pattern: Step-by-Step Guide
```tsx
<div className="space-y-8">
  {/* Step 1 */}
  <div className="relative pl-8 border-l-2 border-[#00ff41]/30">
    <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-[#00ff41]"/>
    <h3 className="mb-3 font-mono text-lg font-semibold text-[#e8f4f8]">
      Step 1: Action
    </h3>
    <p className="text-[#8b949e] text-sm md:text-base">Description...</p>
  </div>
  {/* Step 2, 3, etc */}
</div>
```

### Pattern: Comparison (Broken vs Fixed)
```tsx
<div className="grid gap-6 md:grid-cols-2">
  {/* Broken */}
  <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
    <div className="mb-2 flex items-center gap-2">
      <span className="font-mono text-red-400">✗</span>
      <span className="font-semibold text-red-400">Broken</span>
    </div>
    <pre className="text-xs md:text-sm text-red-300">
      <code>{brokenCode}</code>
    </pre>
  </div>
  
  {/* Fixed */}
  <div className="rounded-lg border border-[#00ff41]/30 bg-[#00ff41]/5 p-4">
    <div className="mb-2 flex items-center gap-2">
      <span className="font-mono text-[#00ff41]">✓</span>
      <span className="font-semibold text-[#00ff41]">Fixed</span>
    </div>
    <pre className="text-xs md:text-sm text-[#00ff41]">
      <code>{fixedCode}</code>
    </pre>
  </div>
</div>
```

### Pattern: Info Box
```tsx
<div className="rounded-lg border border-[#00d9ff]/30 bg-[#00d9ff]/5 p-4">
  <div className="mb-2 flex items-center gap-2">
    <span className="text-[#00d9ff]">ℹ</span>
    <span className="font-semibold text-[#00d9ff]">Important</span>
  </div>
  <p className="text-sm text-[#8b949e]">
    Important information here...
  </p>
</div>
```

### Pattern: Warning Box
```tsx
<div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4">
  <div className="mb-2 flex items-center gap-2">
    <span className="text-yellow-400">⚠</span>
    <span className="font-semibold text-yellow-400">Warning</span>
  </div>
  <p className="text-sm text-[#8b949e]">
    Warning text here...
  </p>
</div>
```

---

## Testing Checklist

After creating each page, verify:

- [ ] Renders correctly on mobile (375px width)
- [ ] Renders correctly on tablet (768px width)
- [ ] Renders correctly on desktop (1280px+ width)
- [ ] All animations are smooth (60fps)
- [ ] Code blocks are scrollable horizontally
- [ ] Keyboard navigation works
- [ ] Colors have sufficient contrast
- [ ] No console errors
- [ ] Links work correctly
- [ ] Panel (Demo or SetupStatus) displays correctly

---

## End of Specification

Use this document to create consistent, accessible, and performant pages with the hacker/cyberpunk aesthetic.
