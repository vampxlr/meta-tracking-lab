# Fixes & Improvements Log

This document tracks major fixes, improvements, and architectural changes made to the Meta Tracking Lab project.

---

## January 15, 2026 - Dynamic Page Rendering & Architecture Documentation

### Issues Fixed

#### 1. PageContent Component Not Accepting Interactive Props

**Problem:**
- `components/page-content.tsx` was a Server Component by default
- It received `rightPanel` prop containing `SetupStatusPanel` and `DemoPanel`
- Both panels have interactive elements with onClick handlers
- Next.js 15 doesn't allow passing event handlers to Server Components

**Error:**
```
Error: Event handlers cannot be passed to Client Component props.
  <button className=... ref=... onClick={function onClick} children=...>
                                        ^^^^^^^^^^^^^^^^^^
If you need interactivity, consider converting part of this to a Client Component.
```

**Solution:**
- Added `"use client"` directive to `components/page-content.tsx`
- Component can now properly receive and render interactive child components

**Files Changed:**
- `components/page-content.tsx` - Added "use client" directive

---

#### 2. Dynamic Page Not Properly Transforming Registry Data

**Problem:**
- `app/[...slug]/page.tsx` tried to pass `pageData={pagesRegistry[path]}` to `PageContent`
- `PageContent` component doesn't accept a `pageData` prop
- It expects individual props: `title`, `description`, `status`, `rightPanel`, `children`
- Registry data structure didn't match component props

**Previous (Wrong) Implementation:**
```typescript
// ❌ WRONG
export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params
  const path = "/" + slug.join("/")
  const pageData = pagesRegistry[path]
  
  return <PageContent pageData={pageData} />  // This doesn't work!
}
```

**Solution:**
1. Made the page a Client Component (added `"use client"`)
2. Used React 19's `use()` hook to unwrap async params
3. Transformed registry data to individual component props
4. Rendered section blocks as children with markdown parsing

**New (Correct) Implementation:**
```typescript
"use client"

import { use } from "react"

export default function DynamicPage({ params }: PageProps) {
  const { slug } = use(params)  // React 19 use() hook
  const path = "/" + slug.join("/")
  const pageData = pagesRegistry[path]

  if (!pageData) {
    notFound()
  }

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
      {pageData.sectionBlocks.map((section, index) => (
        // Render sections with markdown parsing
      ))}
    </PageContent>
  )
}
```

**Files Changed:**
- `app/[...slug]/page.tsx` - Complete rewrite with proper transformation

---

#### 3. DemoPanel Missing Optional Prop Support

**Problem:**
- `DemoPanel` component didn't properly support optional props
- When called without props `<DemoPanel />`, it would error

**Solution:**
- Added `DemoPanelProps` interface
- Added default empty object parameter: `({ preset }: DemoPanelProps = {})`

**Files Changed:**
- `components/demo-panel.tsx` - Added interface and default value

---

#### 4. Setup Checklist Page Content

**Problem:**
- `/getting-started/setup-checklist` had generic placeholder content
- Didn't include actual setup instructions for cloning the repo
- Missing environment variable configuration details

**Solution:**
- Updated `content/pages-registry.ts` with comprehensive setup guide
- Added step-by-step instructions:
  - Prerequisites
  - Git clone command with GitHub URL
  - npm install instructions
  - Environment variable configuration (`.env.local`)
  - How to get Pixel ID and Access Token
  - Running the dev server
  - Verification steps

**Files Changed:**
- `content/pages-registry.ts` - Updated setup checklist entry

---

### Documentation Added

#### 1. AI Developer Guide (NEW)

**File:** `AI_DEVELOPER_GUIDE.md`

**Purpose:** Quick 30-second reference for AI models and developers

**Contents:**
- 5 critical rules to follow
- Common errors and their fixes
- Quick reference for architecture patterns
- Pre-commit checklist
- Links to detailed documentation

**Why It Matters:**
This document helps AI models (like GPT, Claude, GLM, etc.) and new developers quickly understand the critical architectural patterns without reading extensive documentation first.

---

#### 2. Architecture Patterns Guide (NEW)

**File:** `ARCHITECTURE_PATTERNS.md`

**Purpose:** Comprehensive guide to architectural patterns used in this codebase

**Contents:**
- Next.js 15 App Router patterns (async params)
- Client vs Server Components (when to use each)
- Dynamic page rendering from registry
- Component prop patterns
- Common mistakes & fixes with examples
- Project-specific patterns
- Recent fixes with explanations

**Why It Matters:**
This document explains **why** things are structured the way they are and **how** to avoid common mistakes. It's specifically written to help both humans and AI models understand the non-obvious patterns in this codebase.

---

#### 3. Updated Existing Documentation

**Files Updated:**
- `README.md` - Added prominent links to new docs at the top
- `features-implemented/05-app-structure.md` - Updated catch-all route documentation
- `todos/07-active-todos.md` - Marked architecture documentation as 80% complete

---

### Key Learnings

#### 1. Next.js 15 Breaking Change

In Next.js 15, `params` and `searchParams` are now **Promises**:

```typescript
// Next.js 14 (Old)
export default function Page({ params }: PageProps) {
  const { slug } = params  // Direct destructuring
}

// Next.js 15 (New - Server Component)
export default async function Page({ params }: PageProps) {
  const { slug } = await params  // Must await
}

// Next.js 15 (New - Client Component)
"use client"
import { use } from "react"

export default function Page({ params }: PageProps) {
  const { slug } = use(params)  // Use React's use() hook
}
```

#### 2. Client Component Cascade

When a Server Component receives ReactNode props containing interactive elements (onClick, onChange, etc.), it **must** be a Client Component:

```typescript
// ❌ WRONG - Server Component receiving interactive props
export function Layout({ sidebar }) {
  return <div>{sidebar}</div>  // sidebar has buttons with onClick
}

// ✅ CORRECT - Client Component
"use client"
export function Layout({ sidebar }) {
  return <div>{sidebar}</div>
}
```

#### 3. Registry-Based Pattern

This project uses a **registry-based content system**:

- Content is defined in `content/pages-registry.ts`
- Navigation is defined in `content/nav.ts`
- No individual page files needed for documentation pages
- Single catch-all route (`app/[...slug]/page.tsx`) handles all pages
- Registry data must be transformed to component props (not passed directly)

This pattern allows adding new documentation pages without creating new files, but it requires proper transformation logic in the catch-all route.

---

### Preventing Future Issues

#### For AI Models

If you're an AI model working on this codebase:

1. **Always read `AI_DEVELOPER_GUIDE.md` first** (30-second read)
2. **Check `ARCHITECTURE_PATTERNS.md`** for detailed patterns
3. **Remember these 3 rules:**
   - Components receiving interactive props need `"use client"`
   - Use `use(params)` in Client Components (Next.js 15)
   - Transform registry objects to component props

#### For Human Developers

1. **Read the guides:**
   - Start with `AI_DEVELOPER_GUIDE.md` for quick reference
   - Read `ARCHITECTURE_PATTERNS.md` for understanding
   - Check `LINTING_AND_BEST_PRACTICES.md` for code quality

2. **When adding pages:**
   - Update `content/pages-registry.ts` (content)
   - Update `content/nav.ts` (navigation)
   - NO need to create page files!

3. **When creating components:**
   - Ask: "Does this use React hooks or receive interactive props?"
   - If yes → add `"use client"`
   - If no → leave as Server Component

---

### Files Created/Modified

**New Files:**
- ✅ `AI_DEVELOPER_GUIDE.md` - Quick reference
- ✅ `ARCHITECTURE_PATTERNS.md` - Comprehensive patterns guide
- ✅ `FIXES_LOG.md` - This file

**Modified Files:**
- ✅ `components/page-content.tsx` - Added "use client"
- ✅ `components/demo-panel.tsx` - Added props interface
- ✅ `app/[...slug]/page.tsx` - Complete rewrite
- ✅ `content/pages-registry.ts` - Updated setup checklist
- ✅ `README.md` - Added documentation links
- ✅ `features-implemented/05-app-structure.md` - Updated docs
- ✅ `todos/07-active-todos.md` - Marked tasks complete

---

### Testing Performed

✅ Dev server compiles without errors
✅ `/getting-started/setup-checklist` page loads correctly
✅ Setup checklist displays comprehensive instructions
✅ No linter errors in modified files
✅ Pages render with proper styling
✅ Interactive components (SetupStatusPanel, DemoPanel) work correctly

---

### Next Steps

1. **Test all other documentation pages** to ensure they render correctly
2. **Add deployment guide** to complete architecture documentation
3. **Review and test** on different browsers
4. **Consider adding visual diagrams** to architecture docs

---

## Historical Log

### Previous Fixes

*This section will be updated as more fixes are made to the project.*

---

**Log Started:** January 15, 2026
**Last Updated:** January 15, 2026
**Total Fixes Documented:** 4 major fixes
