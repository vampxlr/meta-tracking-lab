# Documentation Pages

This document provides a comprehensive overview of all 18 documentation pages implemented in the Meta Tracking Lab project.

---

## Overview

The project implements a dynamic documentation system with 18 pages covering Meta Pixel tracking, debugging, and best practices. All pages are registered in [`content/pages-registry.ts`](../content/pages-registry.ts:1) and rendered dynamically through the catch-all route [`app/[...slug]/page.tsx`](../app/[...slug]/page.tsx:1).

---

## Page Structure

Each documentation page includes:
- **Title**: Page heading
- **Description**: Brief summary of the page content
- **Badge**: Status indicator (Stable/Draft/Beta/Experimental)
- **Section Blocks**: Multiple content sections with headings and body text
- **Demo Integration**: Optional interactive demo panel
- **Demo Preset**: Configuration for the Event Playground

---

## Documentation Pages

### 1. Overview Page

**File Location**: [`app/page.tsx`](../app/page.tsx:1)

**Route**: `/`

**Status**: Complete

**Description**: Welcome page introducing the Meta Tracking Lab and its interactive tracking documentation features.

**Key Functionality**:
- Project introduction and purpose
- Navigation guidance
- Event Playground overview
- Interactive demo integration

**Implementation Notes**:
- Uses [`PageShell`](../components/page-shell.tsx:1) component
- Static page with custom content
- Includes "Stable" status badge
- Links to other documentation sections

---

### 2. Setup Checklist

**File Location**: [`content/pages-registry.ts`](../content/pages-registry.ts:20) (registered)

**Route**: `/getting-started/setup-checklist`

**Status**: Complete

**Description**: Comprehensive checklist to ensure Meta Pixel is properly configured for accurate event tracking.

**Key Functionality**:
- Pre-implementation requirements
- Installation steps guidance
- Event configuration instructions
- Demo preset: "setup"

**Section Blocks**:
1. Before You Begin - Requirements and prerequisites
2. Installation Steps - Pixel code placement and verification
3. Event Configuration - Standard events and custom events setup

**Demo Integration**: Yes - Shows setup-related event scenarios

---

### 3. Demo Controls

**File Location**: [`content/pages-registry.ts`](../content/pages-registry.ts:42) (registered)

**Route**: `/getting-started/demo-controls`

**Status**: Complete

**Description**: Guide to using the interactive Event Playground for testing Meta Pixel event scenarios.

**Key Functionality**:
- Playground overview and capabilities
- Control panel features explanation
- Testing scenarios documentation
- Demo preset: "demo"

**Section Blocks**:
1. Understanding the Playground - Real-time simulation features
2. Control Panel Features - Event configuration and feedback
3. Testing Scenarios - Common problem simulation

**Demo Integration**: Yes - Demonstrates all playground features

---

### 4. Missing Events

**File Location**: [`content/pages-registry.ts`](../content/pages-registry.ts:64) (registered)

**Route**: `/problems/missing-events`

**Status**: Complete

**Description**: Diagnose why events aren't appearing in Events Manager and learn how to fix common causes.

**Key Functionality**:
- Common causes identification
- Debugging steps and tools
- Prevention strategies
- Demo preset: "missing"

**Section Blocks**:
1. Common Causes - Pixel placement, ad blockers, errors
2. Debugging Steps - Developer tools, Pixel Helper
3. Prevention - Error handling and monitoring

**Demo Integration**: Yes - Simulates missing event scenarios

---

### 5. Duplicate Events

**File Location**: [`content/pages-registry.ts`](../content/pages-registry.ts:86) (registered)

**Route**: `/problems/duplicate-events`

**Status**: Complete

**Description**: Understand why duplicate events occur and how to prevent them from skewing analytics.

**Key Functionality**:
- Root cause analysis
- Detection methods
- Solutions and best practices
- Demo preset: "duplicate"

**Section Blocks**:
1. Why Duplicates Happen - Multiple loading, refreshes
2. Detection Methods - Event count analysis, deduplication
3. Solutions - Event IDs, server-side tracking

**Demo Integration**: Yes - Demonstrates duplicate event patterns

---

### 6. Purchase Mismatch

**File Location**: [`content/pages-registry.ts`](../content/pages-registry.ts:108) (registered)

**Route**: `/problems/purchase-mismatch`

**Status**: Complete

**Description**: Resolve discrepancies between actual sales and reported purchase events in Meta.

**Key Functionality**:
- Mismatch understanding
- Common issues identification
- Best practices for purchase events
- Demo preset: "mismatch"

**Section Blocks**:
1. Understanding Mismatch - Timing, currency, parameters
2. Common Issues - Missing fields, wrong timing
3. Best Practices - Currency, value, server-side tracking

**Demo Integration**: Yes - Shows purchase event mismatches

---

### 7. Low Match Quality

**File Location**: [`content/pages-registry.ts`](../content/pages-registry.ts:130) (registered)

**Route**: `/problems/low-match-quality`

**Status**: Complete

**Description**: Improve user attribution accuracy by addressing low match quality issues.

**Key Functionality**:
- Match quality explanation
- Affecting factors analysis
- Improvement strategies
- Demo preset: "low-match"

**Section Blocks**:
1. What is Match Quality - Attribution accuracy
2. Factors Affecting Match Quality - Cookies, privacy, devices
3. Improvement Strategies - CAPI, identifiers, first-party cookies

**Demo Integration**: Yes - Demonstrates match quality issues

---

### 8. Wrong Parameters

**File Location**: [`content/pages-registry.ts`](../content/pages-registry.ts:152) (registered)

**Route**: `/problems/wrong-parameters`

**Status**: Complete

**Description**: Identify and fix incorrect or missing parameters in Meta Pixel events.

**Key Functionality**:
- Parameter importance
- Common mistakes documentation
- Validation methods
- Demo preset: "wrong-params"

**Section Blocks**:
1. Parameter Importance - Tracking accuracy impact
2. Common Mistakes - Data types, missing fields
3. Validation - Tools and implementation

**Demo Integration**: Yes - Shows parameter errors

---

### 9. Event Order

**File Location**: [`content/pages-registry.ts`](../content/pages-registry.ts:174) (registered)

**Route**: `/problems/event-order`

**Status**: Complete

**Description**: Understand the importance of correct event sequencing and fix order-related issues.

**Key Functionality**:
- Order importance explanation
- Common order issues
- Best practices for sequencing
- Demo preset: "event-order"

**Section Blocks**:
1. Why Order Matters - Attribution and optimization
2. Common Order Issues - Illogical sequences
3. Best Practices - Journey mapping and testing

**Demo Integration**: Yes - Demonstrates event sequencing

---

### 10. Missing Event ID

**File Location**: [`content/pages-registry.ts`](../content/pages-registry.ts:196) (registered)

**Route**: `/problems/missing-event-id`

**Status**: Complete

**Description**: Learn why event IDs are crucial for deduplication and how to implement them correctly.

**Key Functionality**:
- Event ID purpose explanation
- Implementation guidance
- Best practices
- Demo preset: "missing-id"

**Section Blocks**:
1. Event ID Purpose - Deduplication necessity
2. Implementation - UUID and timestamp systems
3. Best Practices - Consistency and uniqueness

**Demo Integration**: Yes - Shows event ID issues

---

### 11. Dedup Misconfigured

**File Location**: [`content/pages-registry.ts`](../content/pages-registry.ts:218) (registered)

**Route**: `/problems/dedup-misconfigured`

**Status**: Complete

**Description**: Fix event deduplication issues that cause inflated metrics and wasted ad spend.

**Key Functionality**:
- Deduplication overview
- Common misconfigurations
- Correct setup guidance
- Demo preset: "dedup"

**Section Blocks**:
1. Deduplication Overview - Preventing duplicate counting
2. Common Misconfigurations - Missing IDs, inconsistent formats
3. Correct Setup - Event IDs and CAPI configuration

**Demo Integration**: Yes - Demonstrates deduplication issues

---

### 12. Cookie FBP Issues

**File Location**: [`content/pages-registry.ts`](../content/pages-registry.ts:240) (registered)

**Route**: `/problems/cookie-fbp-issues`

**Status**: Complete

**Description**: Resolve problems related to Facebook browser cookies and their impact on tracking.

**Key Functionality**:
- FBP cookie purpose
- Common problems identification
- Solutions and workarounds
- Demo preset: "cookie-fbp"

**Section Blocks**:
1. FBP Cookie Purpose - Attribution and optimization
2. Common Problems - Consent, privacy, ad blockers
3. Solutions - Consent implementation, server-side tracking

**Demo Integration**: Yes - Shows cookie-related issues

---

### 13. AEM Domain Issues

**File Location**: [`content/pages-registry.ts`](../content/pages-registry.ts:262) (registered)

**Route**: `/problems/aem-domain-issues`

**Status**: Complete

**Description**: Address domain-related problems that affect Meta Pixel tracking and event delivery.

**Key Functionality**:
- Domain verification importance
- Common domain issues
- Resolution steps
- Demo preset: "aem-domain"

**Section Blocks**:
1. Domain Verification - Meta requirements
2. Common Issues - Unverified domains, mismatches
3. Resolution Steps - Verification and configuration

**Demo Integration**: Yes - Demonstrates domain issues

---

### 14. Testing & Debugging

**File Location**: [`content/pages-registry.ts`](../content/pages-registry.ts:284) (registered)

**Route**: `/problems/testing-debugging`

**Status**: Complete

**Description**: Master tools and techniques for effectively testing and debugging Meta Pixel implementation.

**Key Functionality**:
- Testing tools overview
- Debugging workflow
- Common scenarios
- Demo preset: "testing"

**Section Blocks**:
1. Testing Tools - Pixel Helper, Test Events, DevTools
2. Debugging Workflow - Step-by-step process
3. Common Debugging Scenarios - Issue identification and fixes

**Demo Integration**: Yes - Shows testing scenarios

---

### 15. First-Party Endpoint

**File Location**: [`content/pages-registry.ts`](../content/pages-registry.ts:306) (registered)

**Route**: `/server/first-party-endpoint`

**Status**: Complete

**Description**: Implement and configure first-party endpoints for reliable and privacy-compliant tracking.

**Key Functionality**:
- First-party benefits explanation
- Implementation guidance
- Configuration steps
- Demo preset: "first-party"

**Section Blocks**:
1. First-Party Benefits - Reliability and compliance
2. Implementation - Proxy endpoint setup
3. Configuration - Pixel update and testing

**Demo Integration**: Yes - Demonstrates first-party endpoint

---

### 16. Retry Queue

**File Location**: [`content/pages-registry.ts`](../content/pages-registry.ts:328) (registered)

**Route**: `/server/retry-queue`

**Status**: Complete

**Description**: Implement a robust retry mechanism to ensure events are delivered during temporary failures.

**Key Functionality**:
- Retry queue importance
- Implementation strategy
- Best practices
- Demo preset: "retry"

**Section Blocks**:
1. Why Retry Queues Matter - Data completeness
2. Implementation Strategy - Storage and backoff
3. Best Practices - Persistence and monitoring

**Demo Integration**: Yes - Shows retry mechanisms

---

### 17. Schema Guardrails

**File Location**: [`content/pages-registry.ts`](../content/pages-registry.ts:350) (registered)

**Route**: `/server/schema-guardrails`

**Status**: Complete

**Description**: Implement validation and sanitization to ensure properly formatted events reach Meta's servers.

**Key Functionality**:
- Guardrails purpose
- Validation rules
- Implementation guidance
- Demo preset: "schema"

**Section Blocks**:
1. Purpose of Guardrails - Quality control
2. Validation Rules - Event names, parameters
3. Implementation - Schema definitions and middleware

**Demo Integration**: Yes - Demonstrates validation

---

### 18. Security & Privacy

**File Location**: [`content/pages-registry.ts`](../content/pages-registry.ts:372) (registered)

**Route**: `/server/security-privacy`

**Status**: Complete

**Description**: Implement best practices for securing Meta Pixel implementation and protecting user privacy.

**Key Functionality**:
- Security considerations
- Privacy compliance
- Data protection
- Demo preset: "security"

**Section Blocks**:
1. Security Considerations - Authentication and validation
2. Privacy Compliance - GDPR, CCPA, consent
3. Data Protection - Hashing and HTTPS

**Demo Integration**: Yes - Shows security practices

---

## Page Categories

### Getting Started (3 pages)
1. Overview
2. Setup Checklist
3. Demo Controls

### Core Problems (11 pages)
1. Missing Events
2. Duplicate Events
3. Purchase Mismatch
4. Low Match Quality
5. Wrong Parameters
6. Event Order
7. Missing Event ID
8. Dedup Misconfigured
9. Cookie FBP Issues
10. AEM Domain Issues
11. Testing & Debugging

### Server-Side & Reliability (4 pages)
1. First-Party Endpoint
2. Retry Queue
3. Schema Guardrails
4. Security & Privacy

---

## Technical Implementation

### Page Registration System

All pages are registered in [`content/pages-registry.ts`](../content/pages-registry.ts:19) using the `pagesRegistry` object:

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

### Dynamic Routing

Pages are rendered through the catch-all route at [`app/[...slug]/page.tsx`](../app/[...slug]/page.tsx:14):

- Builds path from slug array
- Looks up page data in registry
- Returns 404 if page not found
- Renders using [`PageContent`](../components/page-content.tsx:1) component

### Page Components

- **PageShell**: Used for overview page with custom content
- **PageContent**: Used for registry-based pages with structured content
- **DemoPanel**: Integrated into pages with `showDemo: true`

---

## Navigation Structure

Navigation is defined in [`content/nav.ts`](../content/nav.ts:31) with:
- 18 navigation items
- 3 navigation groups
- Icons for each page
- Group-based organization

---

## Status Summary

| Status | Count | Percentage |
|--------|-------|------------|
| Complete | 18 | 100% |
| Partial | 0 | 0% |
| Placeholder | 0 | 0% |

**Total Pages**: 18

**All pages are complete and fully functional.**

---

## Demo Presets

The following demo presets are available for the Event Playground:

| Preset | Used By | Description |
|--------|---------|-------------|
| setup | Setup Checklist | Setup-related event scenarios |
| demo | Demo Controls | General playground features |
| missing | Missing Events | Missing event scenarios |
| duplicate | Duplicate Events | Duplicate event patterns |
| mismatch | Purchase Mismatch | Purchase event mismatches |
| low-match | Low Match Quality | Match quality issues |
| wrong-params | Wrong Parameters | Parameter error scenarios |
| event-order | Event Order | Event sequencing issues |
| missing-id | Missing Event ID | Event ID problems |
| dedup | Dedup Misconfigured | Deduplication issues |
| cookie-fbp | Cookie FBP Issues | Cookie-related problems |
| aem-domain | AEM Domain Issues | Domain configuration issues |
| testing | Testing & Debugging | Testing scenarios |
| first-party | First-Party Endpoint | First-party tracking |
| retry | Retry Queue | Retry mechanisms |
| schema | Schema Guardrails | Validation scenarios |
| security | Security & Privacy | Security practices |

---

## Notes

- All pages use the "Stable" badge status
- All pages include demo integration
- All pages have 3 section blocks with structured content
- Pages are organized logically by category
- Navigation is automatically generated from nav configuration
- Demo presets allow contextual event simulation for each topic

---

## Future Enhancements

Potential improvements for documentation pages:
- Add search functionality across all pages
- Implement page versioning
- Add user feedback/rating system
- Include code examples in section blocks
- Add video tutorials or interactive walkthroughs
- Implement related pages suggestions
- Add print-friendly versions
- Include downloadable resources (PDFs, checklists)
