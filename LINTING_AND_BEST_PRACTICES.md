# Linting Issues & Best Practices Guide

This document tracks common linting/build issues in this project and provides best practices to avoid them in future development.

---

## Current Known Issues

### Issue 1: React Hook Missing Dependencies

**File:** `app/capi-test/page.tsx`
**Line:** 597
**Error:** `React Hook useCallback has a missing dependency: 'buildRequestBody'`

**Problem:**
```typescript
const updatePreview = useCallback(async () => {
  const requestBody = buildRequestBody()  // buildRequestBody is used but not in deps
  // ... rest of code
}, [eventName, userData, customData, eventId, mode, testEventCode])
```

**Why it happens:**
- `buildRequestBody` is defined as a regular function (not `useCallback`)
- It gets recreated on every render
- React ESLint rule `react-hooks/exhaustive-deps` detects it's missing from deps

**Solutions:**

**Option A (Recommended):** Wrap `buildRequestBody` in `useCallback`
```typescript
const buildRequestBody = useCallback(() => {
  const body: any = {
    event_name: eventName,
    mode,
  }
  // ... rest of function
}, [eventName, mode, eventId, testEventCode, userData, customData])

// Now updatePreview can include it in deps
const updatePreview = useCallback(async () => {
  const requestBody = buildRequestBody()
  // ...
}, [eventName, userData, customData, eventId, mode, testEventCode, buildRequestBody])
```

**Option B (Quicker):** Move logic directly into `updatePreview`
```typescript
const updatePreview = useCallback(async () => {
  const body: any = {
    event_name: eventName,
    mode,
  }
  // ... build logic inline
}, [eventName, userData, customData, eventId, mode, testEventCode])
```

**Option C (Disable Warning - NOT RECOMMENDED):**
```typescript
// eslint-disable-next-line react-hooks/exhaustive-deps
const updatePreview = useCallback(async () => {
  // ...
}, [eventName, userData, customData, eventId, mode, testEventCode])
```

---

### Issue 2: Unescaped Apostrophes in JSX (CRITICAL - Breaks Build)

**Files Affected:**
- `app/roi-calculator/page.tsx` (Line 469)
- `components/locked-event-playground.tsx` (Line 41)
- `app/page.tsx` (Line 100)

**Error:** `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`

**Severity:** ⚠️ **Build-Breaking Error** - Vercel/production builds will FAIL

**Example Problems:**
```jsx
// ❌ WRONG - Will break build
<span>Meta's AI optimization...</span>
<p>What you'll unlock:</p>
<h2>Core Concepts You'll Master</h2>
```

**Why it happens:**
- ESLint rule `react/no-unescaped-entities` prevents unescaped HTML entities in JSX
- Apostrophes ('), quotes ("), ampersands (&), and angle brackets (<, >) need escaping
- Works fine in dev, but **FAILS in production builds**

**Solutions (Choose One):**

**Option A (Recommended):** Use HTML entity `&apos;`
```jsx
// ✅ CORRECT
<span>Meta&apos;s AI optimization...</span>
<p>What you&apos;ll unlock:</p>
<h2>Core Concepts You&apos;ll Master</h2>
```

**Option B:** Use `&#39;` (numeric entity)
```jsx
<h2>Core Concepts You&#39;ll Master</h2>
```

**Option C:** Use template literals in curly braces
```jsx
<h2>{`Core Concepts You'll Master`}</h2>
```

**Option D:** Use double quotes (changes meaning slightly)
```jsx
<h2>Core Concepts You"ll Master</h2>
// Note: Different quote style, use only if intentional
```

**🔍 How to Find All Apostrophes:**

Before building, search for unescaped apostrophes:

```bash
# Search for potential issues in JSX
grep -rn ">[^<]*'[^']*<" app/ components/

# Or use ESLint
npm run lint
```

---

### Issue 3: React Hook Missing Dependencies

**File:** `components/setup-status-panel.tsx`
**Line:** 144
**Error:** `React Hook useEffect has a missing dependency: 'getNextStep'`

**Problem:**
```typescript
// ❌ WRONG - Functions used but not in deps array
const getNextStep = (a, b, c, d) => { /* ... */ }
const calculatePercentage = (a, b, c, d) => { /* ... */ }

useEffect(() => {
  const next = getNextStep(x, y, z, w)  // Used here
  const pct = calculatePercentage(x, y, z, w)  // Used here
}, [x, y, z, w])  // Missing getNextStep and calculatePercentage!
```

**Why it happens:**
- Functions defined in component body are recreated on every render
- When used in useEffect/useCallback/useMemo, they should be in dependencies
- React's exhaustive-deps rule detects this

**Solutions:**

**Option A (Recommended):** Wrap functions in `useCallback`
```typescript
// ✅ CORRECT
const getNextStep = useCallback((a, b, c, d) => {
  return /* ... */
}, [/* deps if any */])

const calculatePercentage = useCallback((a, b, c, d) => {
  return /* ... */
}, [])

useEffect(() => {
  const next = getNextStep(x, y, z, w)
  const pct = calculatePercentage(x, y, z, w)
}, [x, y, z, w, getNextStep, calculatePercentage])  // Now includes functions
```

**Option B:** Move functions outside component (if they're pure)
```typescript
// ✅ CORRECT - Pure functions outside component
function calculatePercentage(a, b, c, d) {
  return /* ... */
}

function MyComponent() {
  useEffect(() => {
    const pct = calculatePercentage(x, y, z, w)
  }, [x, y, z, w])  // No need to include function
}
```

**Option C (Not Recommended):** Disable warning
```typescript
// ⚠️ USE ONLY IF YOU'RE SURE
useEffect(() => {
  const next = getNextStep(x, y, z, w)
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [x, y, z, w])
```

---

## General Best Practices to Avoid These Issues

### For React Hooks:

1. **Always use `useCallback` for functions passed to dependencies**
```typescript
// ❌ Wrong - recreated every render
const myFunction = () => { /* ... */ }
useEffect(() => { myFunction() }, [myFunction])

// ✅ Correct - stable reference
const myFunction = useCallback(() => { /* ... */ }, [deps])
useEffect(() => { myFunction() }, [myFunction])
```

2. **Include ALL dependencies in useEffect/useCallback/useMemo**
```typescript
// ❌ Wrong - missing dependencies
useEffect(() => {
  console.log(value1, value2, value3)
}, [value1])

// ✅ Correct - all dependencies included
useEffect(() => {
  console.log(value1, value2, value3)
}, [value1, value2, value3])
```

3. **Use ESLint disable comments sparingly and document why**
```typescript
// Only use disable when there's a genuine reason
// Example: Infinite loop prevention
// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
  if (condition) setData(data)
}, []) // Intentionally empty deps
```

### For JSX/HTML Entities:

1. **Common characters that need escaping in JSX:**
```jsx
// Apostrophe (')
You&apos;ll    // or &lsquo;, &rsquo;, &#39;

// Ampersand (&)
&amp;           // or &amp;

// Less than (<)
&lt;            // or &#60;

// Greater than (>)
&gt;            // or &#62;

// Quotation marks (&quot;)
&quot;           // or &#34;
```

2. **Alternative: Use template literals for complex text**
```jsx
// ❌ Hard to read with many escapes
<h2>Here&apos;s a &quot;great&quot; example&apos;s text</h2>

// ✅ Easier to read
<h2>{`Here's a "great" example's text`}</h2>
```

3. **Check for apostrophes before building**
```bash
# Use grep to find apostrophes in JSX files
grep -r "'" app/page.tsx

# Find common patterns
grep -rn "you\|You\|it's" app/
```

### Development Workflow:

1. **Always run build before committing**
```bash
npm run build
# OR
npm run lint
```

2. **Use VS Code ESLint extension**
- Install: ESLint extension for VS Code
- Shows errors in real-time
- Fixes many issues automatically

3. **Auto-fix common issues**
```bash
# Fix what can be auto-fixed
npm run lint -- --fix
```

---

## Project-Specific Patterns

### Pattern 1: CAPI Payload Building

**Best Practice for this project:**
```typescript
// ❌ Don't: Create new function each render
const buildRequestBody = () => {
  return { /* ... */ }
}

// ✅ Do: Use useCallback
const buildRequestBody = useCallback(() => {
  return { /* ... */ }
}, [eventName, userData, customData, eventId, mode, testEventCode])

// Then use it in other callbacks
const updatePreview = useCallback(async () => {
  const body = buildRequestBody()
  // ...
}, [buildRequestBody, /* other deps */])
```

### Pattern 2: Handling Apostrophes in Educational Content

**Since this is a teaching project with lots of text:**

**Create a helper function:**
```typescript
// utils/text.ts
export function escapeApostrophes(text: string): string {
  return text.replace(/'/g, '&apos;')
}

// Usage
<h2>{escapeApostrophes("Core Concepts You'll Master")}</h2>
```

**Or use template literals consistently:**
```typescript
// Always use template literals for content with apostrophes
const description = "Here's what you'll learn"
return <p>{description}</p>
```

---

## Pre-Build Checklist

Before running `npm run build`, check:

- [ ] **Run `npm run lint` first** (catches most issues)
- [ ] **Check for apostrophes in ALL JSX content** (use search: `>[^<]*'`)
- [ ] **Verify all useCallback/useEffect dependencies** are complete
- [ ] **Ensure no unused imports**
- [ ] **Check for TypeScript errors:** `npm run type-check` (if available)
- [ ] **Test build locally:** `npm run build` (catches production-only errors)

### 🚨 Critical Build Failures to Avoid

These will **PASS in dev** but **FAIL in production builds:**

1. **Unescaped apostrophes** - Search for `'` in JSX text
2. **Missing React Hook dependencies** - Check all useEffect/useCallback
3. **TypeScript errors** - Even with `any` types
4. **Unused imports** - Clean up imports

### Quick Fix Command

```bash
# Run lint and try auto-fixing
npm run lint -- --fix

# If that doesn't fix everything, check for apostrophes
grep -rn ">[^<]*'[^']*<" app/ components/
```

---

## Quick Reference

### Common ESLint Rules in This Project:

| Rule | What it checks | Common issues |
|-------|----------------|----------------|
| `react-hooks/exhaustive-deps` | Missing dependencies in hooks | Missing functions in useCallback deps |
| `react/no-unescaped-entities` | Unescaped HTML in JSX | Apostrophes, quotes, ampersands |
| `@next/next/no-img-element` | Using `<img>` instead of `<Image>` | Old `<img>` tags |

### Quick Fix Commands:

```bash
# Auto-fix what's possible
npm run lint -- --fix

# Check specific file
npx eslint app/page.tsx

# Check specific rule
npx eslint app/capi-test/page.tsx --rule 'react-hooks/exhaustive-deps'
```

---

## When This Document Was Last Updated

**Date:** January 15, 2026
**Issues Tracked:** 3
**Build Status:** Passing ✅ (All critical issues fixed)

---

## Adding New Issues

When encountering new linting/build issues:

1. Document the issue in this file
2. Include:
   - File and line number
   - Exact error message
   - Code snippet showing the problem
   - Why it happens
   - Multiple solution options
   - Best practice recommendation
3. Update "When This Document Was Last Updated" section
4. Consider adding patterns to "Project-Specific Patterns" section

---

## Resources

- [Next.js ESLint Docs](https://nextjs.org/docs/app/api-reference/config/eslint)
- [React Hooks Rules](https://react.dev/reference/rules/react-hooks-exhaustive-deps)
- [JSX HTML Entities](https://www.w3schools.com/html/html_entities.asp)
- [Zod Validation](https://zod.dev/)
