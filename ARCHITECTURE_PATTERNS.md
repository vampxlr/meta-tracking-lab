# Architecture Patterns & Common Pitfalls

This document explains the architectural patterns used in the Meta Tracking Lab and documents common mistakes to avoid when working with this codebase.

**Last Updated:** January 15, 2026

---

## Table of Contents

1. [Next.js 15 App Router Patterns](#nextjs-15-app-router-patterns)
2. [Client vs Server Components](#client-vs-server-components)
3. [Dynamic Page Rendering from Registry](#dynamic-page-rendering-from-registry)
4. [Component Prop Patterns](#component-prop-patterns)
5. [Common Mistakes & Fixes](#common-mistakes--fixes)

---

## Next.js 15 App Router Patterns

### Async Params in Server Components

**❌ WRONG - Old Pattern (Next.js 14):**

```typescript
export default function DynamicPage({ params }: PageProps) {
  const { slug } = params  // This won't work in Next.js 15
  // ...
}
```

**✅ CORRECT - Next.js 15 Pattern (Server Component):**

```typescript
interface PageProps {
  params: Promise<{
    slug: string[]
  }>
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params  // Await the promise
  // ...
}
```

**✅ CORRECT - Next.js 15 Pattern (Client Component):**

```typescript
"use client"

import { use } from "react"

export default function DynamicPage({ params }: PageProps) {
  const { slug } = use(params)  // Use React's use() hook
  // ...
}
```

### Why This Matters

In Next.js 15, `params` and `searchParams` are now Promises for better performance and streaming. You must:
- Use `await params` in Server Components
- Use `use(params)` from React 19 in Client Components

**Reference:** [`app/[...slug]/page.tsx`](app/[...slug]/page.tsx)

---

## Client vs Server Components

### The Rule: Event Handlers Require Client Components

**❌ WRONG - Server Component with Interactive Props:**

```typescript
// components/page-content.tsx (Server Component by default)
import { ReactNode } from "react"

export function PageContent({ 
  rightPanel  // This might contain buttons with onClick
}: PageContentProps) {
  return (
    <div>
      {rightPanel}  {/* ERROR: Can't pass event handlers to Server Components */}
    </div>
  )
}
```

**Error you'll see:**
```
Error: Event handlers cannot be passed to Client Component props.
  <button className=... ref=... onClick={function onClick} children=...>
                                        ^^^^^^^^^^^^^^^^^^
If you need interactivity, consider converting part of this to a Client Component.
```

**✅ CORRECT - Client Component:**

```typescript
"use client"  // Add this directive!

import { ReactNode } from "react"

export function PageContent({ 
  rightPanel
}: PageContentProps) {
  return (
    <div>
      {rightPanel}
    </div>
  )
}
```

### When to Use "use client"

Add `"use client"` at the top of a component when:

1. **It receives interactive components as props** (buttons, forms, etc.)
2. **It uses React hooks** (useState, useEffect, useCallback, etc.)
3. **It handles browser events** (onClick, onChange, onSubmit, etc.)
4. **It uses browser APIs** (localStorage, window, document, etc.)

### Component Pattern in This Project

```
AppShell (Client)
  ├── PageContent (Client) ← Must be client to accept rightPanel
  │   ├── children (Content)
  │   └── rightPanel
  │       ├── SetupStatusPanel (Client) ← Has onClick handlers
  │       └── DemoPanel (Client) ← Has interactive features
```

**Files to check:**
- [`components/page-content.tsx`](components/page-content.tsx) - **Must be Client Component**
- [`components/setup-status-panel.tsx`](components/setup-status-panel.tsx) - Client Component
- [`components/demo-panel.tsx`](components/demo-panel.tsx) - Client Component

---

## Dynamic Page Rendering from Registry

### The Pattern: Registry → Props → Render

This project uses a centralized registry system for documentation pages.

**Registry Structure** ([`content/pages-registry.ts`](content/pages-registry.ts)):

```typescript
export const pagesRegistry: Record<string, PageMetadata> = {
  "/getting-started/setup-checklist": {
    title: "Setup Checklist",
    description: "Get the Meta Tracking Lab running locally...",
    badge: "Stable",
    sectionBlocks: [
      {
        heading: "Prerequisites",
        body: "Before getting started, ensure you have..."
      },
      // ... more sections
    ],
    showDemo: false
  }
}
```

### ❌ WRONG - Passing Registry Object Directly

```typescript
// app/[...slug]/page.tsx
export default function DynamicPage({ params }: PageProps) {
  const { slug } = use(params)
  const path = "/" + slug.join("/")
  const pageData = pagesRegistry[path]

  // ❌ WRONG: PageContent doesn't accept pageData prop
  return <PageContent pageData={pageData} />
}
```

**Why this fails:**
- `PageContent` expects props like `title`, `description`, `status`, `rightPanel`
- It doesn't know how to handle a `pageData` object
- You need to transform the registry data into component props

### ✅ CORRECT - Transform Registry to Props

```typescript
"use client"

import { use } from "react"
import { PageContent } from "@/components/page-content"
import { SetupStatusPanel } from "@/components/setup-status-panel"
import { DemoPanel } from "@/components/demo-panel"
import { pagesRegistry } from "@/content/pages-registry"

export default function DynamicPage({ params }: PageProps) {
  const { slug } = use(params)
  const path = "/" + slug.join("/")
  const pageData = pagesRegistry[path]

  if (!pageData) {
    notFound()
  }

  // ✅ CORRECT: Transform registry data to component props
  return (
    <PageContent
      title={pageData.title}
      description={pageData.description}
      status={pageData.badge}
      rightPanel={
        pageData.showDemo 
          ? <DemoPanel preset={pageData.demoPreset?.kind} /> 
          : <SetupStatusPanel />
      }
    >
      {/* Render section blocks as children */}
      {pageData.sectionBlocks.map((section, index) => (
        <section key={index}>
          <h2>{section.heading}</h2>
          <div>{section.body}</div>
        </section>
      ))}
    </PageContent>
  )
}
```

### Content Rendering Pattern

When rendering `body` content from the registry, handle markdown-style formatting:

```typescript
{section.body.split('\n\n').map((paragraph, pIndex) => {
  const trimmed = paragraph.trim()
  
  // Handle code blocks
  if (trimmed.startsWith('```')) {
    const codeMatch = trimmed.match(/```(\w+)?\n([\s\S]*?)```/)
    if (codeMatch) {
      const [, language, code] = codeMatch
      return (
        <pre key={pIndex} className="overflow-x-auto rounded-lg border bg-slate-950 p-4">
          <code>{code}</code>
        </pre>
      )
    }
  }
  
  // Handle regular text with inline formatting
  return (
    <div 
      key={pIndex}
      dangerouslySetInnerHTML={{ 
        __html: trimmed
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/`([^`]+)`/g, '<code>$1</code>')
      }}
    />
  )
})}
```

---

## Component Prop Patterns

### Optional Props with Default Values

**✅ CORRECT Pattern:**

```typescript
interface DemoPanelProps {
  preset?: string  // Optional prop
}

export function DemoPanel({ preset }: DemoPanelProps = {}) {
  // Function receives an object with default empty object
  // This prevents errors when called without props: <DemoPanel />
}
```

**❌ WRONG:**

```typescript
export function DemoPanel({ preset }: DemoPanelProps) {
  // This will error if called as <DemoPanel /> without props
}
```

### ReactNode Props

When accepting rendered components as props:

```typescript
interface PageContentProps {
  title: string
  description?: string
  children?: ReactNode       // Can be any React content
  rightPanel?: ReactNode     // Can be undefined, JSX, or component
}

export function PageContent({ 
  title, 
  description, 
  children,
  rightPanel 
}: PageContentProps) {
  return (
    <div>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
      <div>{children}</div>
      <aside>{rightPanel}</aside>
    </div>
  )
}
```

**Usage:**

```typescript
<PageContent 
  title="My Page"
  description="Page description"
  rightPanel={<SidebarComponent />}
>
  <p>Main content goes here</p>
</PageContent>
```

---

## Common Mistakes & Fixes

### Mistake #1: Forgetting "use client" Directive

**Symptom:**
```
Error: Event handlers cannot be passed to Client Component props.
```

**Cause:**
- Component is a Server Component by default
- It receives or renders interactive elements with event handlers

**Fix:**
```typescript
"use client"  // Add at the very top of the file

import { ... } from "..."

export function MyComponent() {
  // ...
}
```

**Files in this project that MUST be Client Components:**
- ✅ `components/page-content.tsx` - Receives rightPanel with interactive components
- ✅ `components/setup-status-panel.tsx` - Has onClick handlers
- ✅ `components/demo-panel.tsx` - Has interactive features
- ✅ `app/[...slug]/page.tsx` - Uses React's use() hook
- ✅ `app/page.tsx` - Uses interactive components

---

### Mistake #2: Not Transforming Registry Data

**Symptom:**
```
TypeError: pageData is not a valid prop for PageContent
```

**Cause:**
- Passing the entire registry object instead of extracting props
- Component doesn't know how to destructure the registry data

**Fix:**

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
    {/* Render content */}
  </PageContent>
)
```

---

### Mistake #3: Not Handling Async Params

**Symptom:**
```
TypeError: params.slug is not iterable
```

**Cause:**
- Trying to destructure params directly in Next.js 15
- params is now a Promise

**Fix:**

```typescript
// ❌ WRONG
export default function Page({ params }: PageProps) {
  const { slug } = params  // params is a Promise!
}

// ✅ CORRECT (Server Component)
export default async function Page({ params }: PageProps) {
  const { slug } = await params
}

// ✅ CORRECT (Client Component)
"use client"
import { use } from "react"

export default function Page({ params }: PageProps) {
  const { slug } = use(params)
}
```

---

### Mistake #4: Rendering Markdown Without Parsing

**Symptom:**
- Code blocks appear as plain text with backticks
- Markdown formatting (bold, inline code) doesn't render

**Cause:**
- Putting markdown strings directly into JSX without parsing

**Fix:**

```typescript
// ❌ WRONG - Raw markdown appears as text
<div>{section.body}</div>

// ✅ CORRECT - Parse and render appropriately
{section.body.split('\n\n').map((paragraph, index) => {
  if (paragraph.startsWith('```')) {
    // Render as code block
    return <pre key={index}><code>{extractCode(paragraph)}</code></pre>
  }
  // Render as paragraph with inline formatting
  return <p key={index} dangerouslySetInnerHTML={{ 
    __html: formatInlineMarkdown(paragraph) 
  }} />
})}
```

---

## Project-Specific Patterns

### Pattern: Registry-Based Documentation

**How it works:**

1. **Define content in registry** (`content/pages-registry.ts`):
   ```typescript
   "/your-page": {
     title: "Your Page",
     description: "Description",
     badge: "Stable",
     sectionBlocks: [ /* ... */ ],
     showDemo: true,
     demoPreset: { kind: "demo" }
   }
   ```

2. **Add to navigation** (`content/nav.ts`):
   ```typescript
   {
     title: "Your Page",
     href: "/your-page",
     icon: YourIcon,
     group: "Your Group"
   }
   ```

3. **Page automatically renders** via `app/[...slug]/page.tsx`

**No need to create individual page files!** The catch-all route handles everything.

### Pattern: Conditional Right Panel

```typescript
rightPanel={
  pageData.showDemo 
    ? <DemoPanel preset={pageData.demoPreset?.kind} /> 
    : <SetupStatusPanel />
}
```

- **DemoPanel**: Shows when `showDemo: true` in registry
- **SetupStatusPanel**: Shows for non-demo pages (setup instructions)

---

## Quick Reference

### Checklist for Adding New Documentation Pages

- [ ] Add entry to `content/pages-registry.ts`
  - [ ] Define `title`, `description`, `badge`
  - [ ] Write `sectionBlocks` with heading and body
  - [ ] Set `showDemo` and optional `demoPreset`
- [ ] Add navigation entry to `content/nav.ts`
  - [ ] Choose appropriate icon
  - [ ] Assign to correct group
- [ ] No need to create page file - catch-all route handles it!
- [ ] Test by visiting `/your-page-path`

### Checklist for Creating New Components

- [ ] Determine if it needs `"use client"` directive
  - [ ] Does it use React hooks?
  - [ ] Does it handle events (onClick, etc.)?
  - [ ] Does it receive interactive components as props?
- [ ] Define TypeScript interfaces for props
- [ ] Use optional props with defaults when appropriate
- [ ] Test with both interactive and non-interactive usage

---

## Resources

- [Next.js 15 App Router Docs](https://nextjs.org/docs/app/building-your-application/routing)
- [React 19 use() Hook](https://react.dev/reference/react/use)
- [Client vs Server Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [TypeScript with Next.js](https://nextjs.org/docs/app/building-your-application/configuring/typescript)

---

## Recent Fixes

### Fix #1: PageContent Must Be Client Component (Jan 15, 2026)

**Issue:** `PageContent` was a Server Component but received `rightPanel` prop containing `SetupStatusPanel` with onClick handlers.

**Error:** 
```
Error: Event handlers cannot be passed to Client Component props.
```

**Solution:** Added `"use client"` directive to `components/page-content.tsx`.

**Files Changed:**
- `components/page-content.tsx` - Added "use client"

---

### Fix #2: Dynamic Page Not Transforming Registry Data (Jan 15, 2026)

**Issue:** `app/[...slug]/page.tsx` tried to pass `pageData={pageData}` to `PageContent`, but `PageContent` doesn't accept that prop.

**Solution:** 
1. Made `page.tsx` a Client Component
2. Used `use(params)` to unwrap async params
3. Transformed registry data to individual props
4. Rendered section blocks as children

**Files Changed:**
- `app/[...slug]/page.tsx` - Complete rewrite to properly transform registry data

---

### Fix #3: DemoPanel Missing Optional Prop Support (Jan 15, 2026)

**Issue:** `DemoPanel` didn't accept optional props properly.

**Solution:** Added default empty object to function parameter.

```typescript
export function DemoPanel({ preset }: DemoPanelProps = {})
```

**Files Changed:**
- `components/demo-panel.tsx` - Added props interface and default value

---

## For AI Models Reading This

If you're an AI model working on this codebase, pay special attention to:

1. **Always add `"use client"` to components that:**
   - Accept ReactNode props containing interactive elements
   - Use any React hooks
   - Handle browser events

2. **When working with `app/[...slug]/page.tsx`:**
   - It MUST be a Client Component
   - Use `use(params)` from React 19
   - Transform registry data to component props
   - Don't pass `pageData` object directly to PageContent

3. **Registry Pattern:**
   - Content lives in `content/pages-registry.ts`
   - Navigation in `content/nav.ts`
   - No individual page files needed for docs pages

4. **Next.js 15 params are Promises:**
   - Use `await params` in Server Components
   - Use `use(params)` in Client Components

Following these patterns will prevent the most common errors in this codebase.
