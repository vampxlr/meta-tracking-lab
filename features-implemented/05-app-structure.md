# App Structure

This document provides a comprehensive overview of the application routing structure and page organization in the Meta Tracking Lab project.

---

## Overview

The project uses Next.js 14 App Router with a dynamic routing system that supports both static pages and catch-all routes for documentation pages. The app directory is organized into logical sections for different content categories.

---

## Directory Structure

```
app/
├── globals.css                    # Global styles
├── layout.tsx                    # Root layout component
├── page.tsx                      # Home page (Overview)
├── [...slug]/                    # Catch-all route for documentation
│   ├── not-found.tsx            # 404 page
│   └── page.tsx                 # Dynamic page renderer
├── api/                         # API routes
│   └── meta/
│       └── capi/
│           └── route.ts         # CAPI endpoint (placeholder)
├── connect/                     # Connection test page
│   └── page.tsx
├── getting-started/             # Getting started section
│   ├── demo-controls/
│   │   └── page.tsx
│   └── setup-checklist/
│       └── page.tsx
├── problems/                    # Problems section
│   ├── aem-domain-issues/
│   │   └── page.tsx
│   ├── cookie-fbp-issues/
│   │   └── page.tsx
│   ├── dedup-misconfigured/
│   │   └── page.tsx
│   ├── duplicate-events/
│   │   └── page.tsx
│   ├── event-order/
│   │   └── page.tsx
│   ├── low-match-quality/
│   │   └── page.tsx
│   ├── missing-event-id/
│   │   └── page.tsx
│   ├── missing-events/
│   │   └── page.tsx
│   ├── purchase-mismatch/
│   │   └── page.tsx
│   ├── testing-debugging/
│   │   └── page.tsx
│   └── wrong-parameters/
│       └── page.tsx
└── server/                      # Server-side section
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

## Route Categories

### 1. Root Routes

#### `/` - Home Page

**File**: [`app/page.tsx`](../app/page.tsx:1)

**Component**: OverviewPage

**Status**: Complete

**Description**: Welcome page introducing the Meta Tracking Lab and its features.

**Features**:
- Project introduction
- Navigation guidance
- Event Playground overview
- Stable status badge

**Component Used**: [`PageShell`](../components/page-shell.tsx:1)

---

### 2. Dynamic Routes

#### `/[...slug]` - Catch-All Route

**File**: [`app/[...slug]/page.tsx`](../app/[...slug]/page.tsx:1)

**Status**: Complete ✅

**Description**: Dynamic route that handles all documentation pages by looking up content in the page registry.

**Component Type**: Client Component (uses `"use client"` directive)

**Features**:
- Dynamic path building from slug array
- Uses React 19's `use()` hook for async params
- Page lookup in registry
- 404 handling for unknown pages
- Transforms registry data to component props
- Renders section blocks with markdown parsing
- Dynamic rendering with [`PageContent`](../components/page-content.tsx:1)

**Implementation Pattern**:
```typescript
"use client"
import { use } from "react"

export default function DynamicPage({ params }: PageProps) {
  const { slug } = use(params)  // React 19 use() hook
  const path = "/" + slug.join("/")
  const pageData = pagesRegistry[path]
  
  // Transform registry data to props
  return (
    <PageContent
      title={pageData.title}
      description={pageData.description}
      status={pageData.badge}
      rightPanel={/* conditional panel */}
    >
      {/* Render section blocks */}
    </PageContent>
  )
}
```

**Page Registry**: [`content/pages-registry.ts`](../content/pages-registry.ts:1)

**Supported Routes**: All 17 documentation pages (see below)

---

#### `/[...slug]/not-found` - 404 Page

**File**: [`app/[...slug]/not-found.tsx`](../app/[...slug]/not-found.tsx:1)

**Status**: Complete

**Description**: Custom 404 page for unknown routes.

**Features**:
- User-friendly error message
- Navigation back to home
- Consistent styling with rest of app

---

### 3. API Routes

#### `/api/meta/capi` - Conversions API

**File**: [`app/api/meta/capi/route.ts`](../app/api/meta/capi/route.ts:1)

**Status**: Placeholder (Day 2/3)

**Methods**:
- `POST` - Send events to Conversions API
- `GET` - Get CAPI status

**Current Behavior**: Returns 501 Not Implemented

**Planned Features**:
- Event submission to Meta
- Status checks
- Configuration validation

---

### 4. Utility Routes

#### `/connect` - Connection Test

**File**: [`app/connect/page.tsx`](../app/connect/page.tsx:1)

**Component**: ConnectionTestPage

**Status**: Complete

**Description**: Test page for verifying Meta Pixel connection and sending test events.

**Features**:
- Pixel connection status check
- Pixel ID display
- Test event sending
- Link to Events Manager
- Step-by-step verification instructions

**Key Functionality**:
- Checks if `window.fbq` is available
- Sends `MTL_ConnectionTest` custom event
- Opens Events Manager in new tab
- Displays last test time

---

### 5. Getting Started Routes

#### `/getting-started/setup-checklist`

**Route**: `/getting-started/setup-checklist`

**Status**: Complete

**Description**: Setup checklist for Meta Pixel configuration.

**Demo Preset**: `setup`

**Section Blocks**:
1. Before You Begin
2. Installation Steps
3. Event Configuration

---

#### `/getting-started/demo-controls`

**Route**: `/getting-started/demo-controls`

**Status**: Complete

**Description**: Guide to using the Event Playground.

**Demo Preset**: `demo`

**Section Blocks**:
1. Understanding the Playground
2. Control Panel Features
3. Testing Scenarios

---

### 6. Problems Routes

#### `/problems/missing-events`

**Route**: `/problems/missing-events`

**Status**: Complete

**Description**: Diagnose missing events in Events Manager.

**Demo Preset**: `missing`

**Section Blocks**:
1. Common Causes
2. Debugging Steps
3. Prevention

---

#### `/problems/duplicate-events`

**Route**: `/problems/duplicate-events`

**Status**: Complete

**Description**: Understand and prevent duplicate events.

**Demo Preset**: `duplicate`

**Section Blocks**:
1. Why Duplicates Happen
2. Detection Methods
3. Solutions

---

#### `/problems/purchase-mismatch`

**Route**: `/problems/purchase-mismatch`

**Status**: Complete

**Description**: Resolve purchase event discrepancies.

**Demo Preset**: `mismatch`

**Section Blocks**:
1. Understanding Mismatch
2. Common Issues
3. Best Practices

---

#### `/problems/low-match-quality`

**Route**: `/problems/low-match-quality`

**Status**: Complete

**Description**: Improve user attribution accuracy.

**Demo Preset**: `low-match`

**Section Blocks**:
1. What is Match Quality
2. Factors Affecting Match Quality
3. Improvement Strategies

---

#### `/problems/wrong-parameters`

**Route**: `/problems/wrong-parameters`

**Status**: Complete

**Description**: Fix incorrect or missing parameters.

**Demo Preset**: `wrong-params`

**Section Blocks**:
1. Parameter Importance
2. Common Mistakes
3. Validation

---

#### `/problems/event-order`

**Route**: `/problems/event-order`

**Status**: Complete

**Description**: Understand event sequencing importance.

**Demo Preset**: `event-order`

**Section Blocks**:
1. Why Order Matters
2. Common Order Issues
3. Best Practices

---

#### `/problems/missing-event-id`

**Route**: `/problems/missing-event-id`

**Status**: Complete

**Description**: Learn about event ID importance.

**Demo Preset**: `missing-id`

**Section Blocks**:
1. Event ID Purpose
2. Implementation
3. Best Practices

---

#### `/problems/dedup-misconfigured`

**Route**: `/problems/dedup-misconfigured`

**Status**: Complete

**Description**: Fix event deduplication issues.

**Demo Preset**: `dedup`

**Section Blocks**:
1. Deduplication Overview
2. Common Misconfigurations
3. Correct Setup

---

#### `/problems/cookie-fbp-issues`

**Route**: `/problems/cookie-fbp-issues`

**Status**: Complete

**Description**: Resolve Facebook cookie problems.

**Demo Preset**: `cookie-fbp`

**Section Blocks**:
1. FBP Cookie Purpose
2. Common Problems
3. Solutions

---

#### `/problems/aem-domain-issues`

**Route**: `/problems/aem-domain-issues`

**Status**: Complete

**Description**: Address domain-related tracking issues.

**Demo Preset**: `aem-domain`

**Section Blocks**:
1. Domain Verification
2. Common Issues
3. Resolution Steps

---

#### `/problems/testing-debugging`

**Route**: `/problems/testing-debugging`

**Status**: Complete

**Description**: Master testing and debugging tools.

**Demo Preset**: `testing`

**Section Blocks**:
1. Testing Tools
2. Debugging Workflow
3. Common Debugging Scenarios

---

### 7. Server Routes

#### `/server/first-party-endpoint`

**Route**: `/server/first-party-endpoint`

**Status**: Complete

**Description**: Implement first-party endpoints.

**Demo Preset**: `first-party`

**Section Blocks**:
1. First-Party Benefits
2. Implementation
3. Configuration

---

#### `/server/retry-queue`

**Route**: `/server/retry-queue`

**Status**: Complete

**Description**: Implement retry mechanisms.

**Demo Preset**: `retry`

**Section Blocks**:
1. Why Retry Queues Matter
2. Implementation Strategy
3. Best Practices

---

#### `/server/schema-guardrails`

**Route**: `/server/schema-guardrails`

**Status**: Complete

**Description**: Implement validation and sanitization.

**Demo Preset**: `schema`

**Section Blocks**:
1. Purpose of Guardrails
2. Validation Rules
3. Implementation

---

#### `/server/security-privacy`

**Route**: `/server/security-privacy`

**Status**: Complete

**Description**: Security and privacy best practices.

**Demo Preset**: `security`

**Section Blocks**:
1. Security Considerations
2. Privacy Compliance
3. Data Protection

---

## Route Summary

### Total Routes

| Category | Count | Routes |
|----------|-------|--------|
| Root | 1 | `/` |
| Dynamic | 1 | `/[...slug]` (handles 17 pages) |
| API | 1 | `/api/meta/capi` |
| Utility | 1 | `/connect` |
| Getting Started | 2 | `/getting-started/*` |
| Problems | 11 | `/problems/*` |
| Server | 4 | `/server/*` |
| **Total** | **21** | |

### Page Types

| Type | Count | Description |
|------|-------|-------------|
| Static Pages | 2 | Home, Connect |
| Dynamic Pages | 17 | Documentation pages |
| API Routes | 1 | CAPI endpoint |
| Special Pages | 1 | 404 page |

---

## Routing Architecture

### Root Layout

**File**: [`app/layout.tsx`](../app/layout.tsx:1)

**Status**: Complete

**Description**: Root layout component that wraps all pages.

**Components**:
- [`FacebookPixel`](../components/facebook-pixel.tsx:1) - Meta Pixel integration
- [`ThemeProvider`](../components/theme-provider.tsx:1) - Theme management
- [`AppShell`](../components/app-shell.tsx:1) - Application shell
- [`Toaster`](../components/toaster.tsx:1) - Toast notifications

**Metadata**:
- Title: "Meta Tracking Lab - Debug & Validate Events"
- Description: "Interactive tracking documentation for Meta Pixel and Conversions API debugging"

**Font**: Inter (Google Fonts)

---

### Dynamic Routing System

**File**: [`app/[...slug]/page.tsx`](../app/[...slug]/page.tsx:1)

**How It Works**:

1. **Unwrap Async Params** (Next.js 15):
   ```typescript
   const { slug } = use(params)  // React 19's use() hook
   ```

2. **Path Building**:
   ```typescript
   const path = "/" + slug.join("/")
   ```

3. **Page Lookup**:
   ```typescript
   const pageData = pagesRegistry[path]
   ```

4. **404 Handling**:
   ```typescript
   if (!pageData) {
     notFound()
   }
   ```

5. **Transform & Render**:
   ```typescript
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
         // Render each section with markdown parsing
       ))}
     </PageContent>
   )
   ```

**Benefits**:
- Single route handler for all documentation pages
- Centralized page management
- Easy to add new pages (just update registry)
- Consistent rendering across all docs
- No individual page files needed

**⚠️ Important Notes**:
- This component MUST be a Client Component (`"use client"`)
- Must use `use(params)` from React 19 (not `await params`)
- Must transform registry data to component props (don't pass `pageData` directly)

---

### Page Registry System

**File**: [`content/pages-registry.ts`](../content/pages-registry.ts:1)

**Purpose**: Central registry for all documentation pages.

**Structure**:
```typescript
export const pagesRegistry: Record<string, PageMetadata> = {
  "/path/to/page": {
    title: "Page Title",
    description: "Page description",
    badge: "Stable",
    sectionBlocks: [...],
    showDemo: true,
    demoPreset: { kind: "preset-name" }
  }
}
```

**Advantages**:
- Type-safe page definitions
- Centralized content management
- Easy to maintain
- Supports metadata and demo configuration

---

### Navigation System

**File**: [`content/nav.ts`](../content/nav.ts:1)

**Purpose**: Navigation configuration for sidebar and mobile menu.

**Structure**:
```typescript
export const navItems: NavItem[] = [
  {
    title: "Page Title",
    href: "/path/to/page",
    icon: IconComponent,
    group: "Group Name"
  }
]
```

**Navigation Groups**:
1. Getting Started (3 items)
2. Core Problems (11 items)
3. Server-Side & Reliability (4 items)

**Total Navigation Items**: 18

---

## Route Configuration

### Dynamic Rendering

**Setting**: `dynamic: "force-dynamic"`

**Purpose**: Ensures pages are rendered dynamically on each request.

**Location**: [`app/[...slug]/page.tsx`](../app/[...slug]/page.tsx:12)

**Reason**: Prevents static generation issues with client components and dynamic content.

---

### Client Components

**"use client" Directive**:
- [`app/connect/page.tsx`](../app/connect/page.tsx:1) - Connection test page
- [`app/[...slug]/page.tsx`](../app/[...slug]/page.tsx:1) - Dynamic pages (for state management)

**Server Components**:
- [`app/layout.tsx`](../app/layout.tsx:1) - Root layout
- [`app/page.tsx`](../app/page.tsx:1) - Home page

---

## Route Features

### Common Features

All documentation pages include:
- Title and description
- Status badge (Stable)
- 3 section blocks
- Demo panel integration
- Notes & References section
- Responsive design

### Demo Integration

**Pages with Demo**: All 17 documentation pages

**Demo Presets**: 17 different presets for different scenarios

**Demo Panel**: [`components/demo-panel.tsx`](../components/demo-panel.tsx:1)

---

## Route Status

### Implementation Status

| Route Type | Complete | Partial | Placeholder |
|------------|----------|---------|-------------|
| Static Pages | 2 | 0 | 0 |
| Dynamic Pages | 17 | 0 | 0 |
| API Routes | 0 | 0 | 1 |
| Special Pages | 1 | 0 | 0 |
| **Total** | **20** | **0** | **1** |

---

## Route Dependencies

### Internal Dependencies
- [`components/page-content.tsx`](../components/page-content.tsx:1) - Dynamic page rendering
- [`components/page-shell.tsx`](../components/page-shell.tsx:1) - Static page wrapper
- [`content/pages-registry.ts`](../content/pages-registry.ts:1) - Page data
- [`content/nav.ts`](../content/nav.ts:1) - Navigation configuration

### External Dependencies
- Next.js App Router
- Next.js dynamic routing
- Next.js notFound() function

---

## Route Best Practices

### Implemented Practices

1. **Type Safety**: All routes use TypeScript
2. **Consistent Structure**: All pages follow similar patterns
3. **Responsive Design**: All pages work on mobile and desktop
4. **SEO Friendly**: Proper metadata and semantic HTML
5. **Error Handling**: 404 page for unknown routes
6. **Performance**: Dynamic rendering where needed
7. **Accessibility**: Semantic HTML and ARIA labels

### Future Improvements

1. **Loading States**: Add loading skeletons
2. **Error Boundaries**: Better error handling
3. **Route Guards**: Protected routes if needed
4. **Middleware**: Request/response interception
5. **ISR**: Incremental Static Regeneration
6. **Streaming**: Progressive rendering

---

## Notes

- All routes are fully functional
- Dynamic routing system is production-ready
- Page registry system is well-organized
- Navigation is automatically generated
- Demo integration is consistent across all pages
- All pages support dark mode
- All pages are responsive

---

## Future Enhancements

Potential improvements for app structure:
- Add more static pages (About, Contact, etc.)
- Implement search functionality
- Add page versioning
- Create admin dashboard
- Add user authentication
- Implement analytics tracking
- Add A/B testing capabilities
- Create page templates
- Add internationalization (i18n)
- Implement advanced routing patterns
