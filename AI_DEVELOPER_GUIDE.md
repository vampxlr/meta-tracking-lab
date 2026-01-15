# Quick Reference for AI Models & Developers

**Last Updated:** January 15, 2026

---

## ⚡ Quick Start (30 Second Read)

If you're working on this codebase, here are the **5 critical rules** to follow:

### 1️⃣ Client Component Rule

**ANY component that receives interactive elements MUST have `"use client"`**

```typescript
// ✅ CORRECT
"use client"

import { ReactNode } from "react"

export function PageContent({ rightPanel }: { rightPanel?: ReactNode }) {
  return <div>{rightPanel}</div>
}
```

**Files that MUST be Client Components:**
- ✅ `components/page-content.tsx`
- ✅ `components/setup-status-panel.tsx`
- ✅ `components/demo-panel.tsx`
- ✅ `app/[...slug]/page.tsx`
- ✅ `app/page.tsx`

---

### 2️⃣ Next.js 15 Async Params

**In Next.js 15, `params` is a Promise. Use `use()` hook in Client Components.**

```typescript
"use client"
import { use } from "react"

export default function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = use(params)  // ✅ CORRECT
  // NOT: const { slug } = params  // ❌ WRONG
}
```

---

### 3️⃣ Registry → Props Transformation

**NEVER pass registry objects directly. Transform to component props.**

```typescript
// ❌ WRONG
return <PageContent pageData={pagesRegistry[path]} />

// ✅ CORRECT
const pageData = pagesRegistry[path]
return (
  <PageContent
    title={pageData.title}
    description={pageData.description}
    status={pageData.badge}
    rightPanel={/* ... */}
  >
    {/* render sections */}
  </PageContent>
)
```

---

### 4️⃣ Adding New Documentation Pages

**NO need to create page files! Just update the registry.**

1. Add to `content/pages-registry.ts`:
   ```typescript
   "/your-page": {
     title: "Your Title",
     description: "Description",
     badge: "Stable",
     sectionBlocks: [/* ... */],
     showDemo: false
   }
   ```

2. Add to `content/nav.ts`:
   ```typescript
   {
     title: "Your Page",
     href: "/your-page",
     icon: YourIcon,
     group: "Your Group"
   }
   ```

3. Done! Visit `/your-page`

---

### 5️⃣ Markdown Parsing in Section Bodies

**Section bodies support simple markdown. Parse it properly.**

```typescript
{section.body.split('\n\n').map((para, i) => {
  // Handle code blocks
  if (para.startsWith('```')) {
    const match = para.match(/```(\w+)?\n([\s\S]*?)```/)
    if (match) {
      return <pre key={i}><code>{match[2]}</code></pre>
    }
  }
  
  // Handle inline formatting
  return (
    <div key={i} dangerouslySetInnerHTML={{
      __html: para
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
    }} />
  )
})}
```

---

## 🚫 Common Errors & Fixes

### Error: "Event handlers cannot be passed to Client Component props"

**Cause:** Component is missing `"use client"` directive

**Fix:** Add `"use client"` at the top of the file

---

### Error: "params.slug is not iterable"

**Cause:** Trying to destructure `params` directly (it's a Promise in Next.js 15)

**Fix:** Use `use(params)` in Client Components or `await params` in Server Components

---

### Error: Component receives `pageData` prop but doesn't work

**Cause:** Passing registry object instead of transforming to props

**Fix:** Extract props from registry object and pass individually

---

## 📚 Detailed Documentation

For comprehensive information, see:

- **[ARCHITECTURE_PATTERNS.md](ARCHITECTURE_PATTERNS.md)** - Complete patterns guide
- **[LINTING_AND_BEST_PRACTICES.md](LINTING_AND_BEST_PRACTICES.md)** - ESLint & React best practices

---

## 🏗️ Project Architecture

```
User visits /getting-started/setup-checklist
           ↓
app/[...slug]/page.tsx (Client Component)
           ↓
   use(params) → extract slug
           ↓
   Build path: "/getting-started/setup-checklist"
           ↓
   Lookup in pagesRegistry
           ↓
   Transform to PageContent props
           ↓
components/page-content.tsx (Client Component)
           ↓
   Renders with rightPanel:
     - SetupStatusPanel (if showDemo: false)
     - DemoPanel (if showDemo: true)
```

---

## ✅ Pre-Commit Checklist

Before committing changes:

- [ ] All interactive components have `"use client"`
- [ ] Using `use(params)` for async params in Client Components
- [ ] Registry data transformed to props (not passed directly)
- [ ] Section body markdown parsed correctly
- [ ] Run `npm run lint` to check for errors
- [ ] Test the page in browser

---

## 💡 Key Insights

1. **This is a registry-based system** - Content lives in `content/pages-registry.ts`, not individual page files
2. **Next.js 15 changed params** - They're now Promises, use `use()` hook
3. **Client Components are required** - Because interactive elements are everywhere
4. **Props must be explicit** - Transform registry objects to individual props

---

## 🔗 Quick Links

| File | Purpose | Type |
|------|---------|------|
| [`app/[...slug]/page.tsx`](app/[...slug]/page.tsx) | Dynamic page handler | Client Component ✅ |
| [`components/page-content.tsx`](components/page-content.tsx) | Page layout | Client Component ✅ |
| [`content/pages-registry.ts`](content/pages-registry.ts) | Content registry | Data file |
| [`content/nav.ts`](content/nav.ts) | Navigation config | Data file |

---

## 🤝 Contributing

When adding new features:

1. Follow the patterns in [`ARCHITECTURE_PATTERNS.md`](ARCHITECTURE_PATTERNS.md)
2. Use TypeScript strictly (no `any` without good reason)
3. Add proper interfaces for all props
4. Document new patterns in architecture docs
5. Update this quick reference if adding critical patterns

---

**Remember:** This guide exists because these patterns are non-obvious and easy to get wrong. Following these rules prevents 95% of common errors.
