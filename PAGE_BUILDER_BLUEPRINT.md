# 📘 Page Builder Blueprint - Complete Guide

**Purpose:** Step-by-step guide to build all remaining documentation pages with custom Event Playgrounds

---

## 🎯 What We've Built So Far

### ✅ Completed Pages (5/17)
1. **Home** (`/`) - Overview with hacker theme
2. **Setup Checklist** (`/getting-started/setup-checklist`) - Installation guide
3. **Demo Controls** (`/getting-started/demo-controls`) - Playground tutorial
4. **Missing Events** (`/problems/missing-events`) - Debugging guide
5. **Duplicate Events** (`/problems/duplicate-events`) - Deduplication guide

### ✅ Infrastructure
- Event Playground Component (`components/event-playground.tsx`)
- ROI Calculator removed
- Hacker theme design system
- Navigation updated

---

## 📋 Remaining Pages (12)

### Core Problems (10)
1. ⏳ **Purchase Mismatch** - Value/currency discrepancies
2. ⏳ **Low Match Quality** - PII hashing and normalization
3. ⏳ **Wrong Parameters** - Data type and format errors
4. ⏳ **Event Order** - Timing and sequence issues  
5. ⏳ **Missing Event ID** - Deduplication failures
6. ⏳ **Dedup Misconfigured** - Advanced deduplication setup
7. ⏳ **Cookie FBP Issues** - First-party cookie problems
8. ⏳ **AEM Domain Issues** - Aggregated Event Measurement
9. ⏳ **Testing & Debugging** - Tools and techniques
10. ⏳ **CAPI Setup** - Server-side configuration

### Server-Side & Reliability (4)
1. ⏳ **First-Party Endpoint** - Custom tracking endpoints
2. ⏳ **Retry Queue** - Handling failed events
3. ⏳ **Schema Guardrails** - Data validation
4. ⏳ **Security & Privacy** - Compliance and best practices

---

## 🏗️ Page Template Structure

Every page follows this exact structure:

```tsx
"use client"

import { PageContent } from "@/components/page-content"
import { EventPlayground } from "@/components/event-playground"
import { Icon1, Icon2 } from "lucide-react"

export default function [PageName]Page() {
  // 1. Define custom events for this page's specific concept
  const customEvents = [
    {
      name: "Event Name",
      icon: <Icon1 className="h-4 w-4 text-[#00ff41] icon-spin-hover" />,
      brokenPayload: { /* Demonstrates the problem */ },
      fixedPayload: { /* Shows the solution */ }
    },
    // ... more events
  ]

  return (
    <PageContent
      title="Page Title"
      description="One-line description of the concept"
      status="Stable"
    >
      
      {/* Section 1: The Problem */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> The Problem
        </h2>
        {/* Explanation + examples */}
      </section>

      {/* Section 2: How It Works */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        {/* Technical explanation */}
      </section>

      {/* Section 3: Implementation Guide */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        {/* Step-by-step with code examples */}
      </section>

      {/* Section 4: Common Mistakes */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
        {/* Grid of common errors */}
      </section>

      {/* Section 5: Best Practices */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[400ms]">
        {/* Checklist of best practices */}
      </section>

      {/* Section 6: Interactive Playground */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
        <EventPlayground
          title="Custom Title"
          description="Custom description"
          events={customEvents}
          showModeToggle={true}
          showLogs={true}
        />
      </section>

      {/* Section 7: Related Topics */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[600ms]">
        {/* Links to related pages */}
      </section>

    </PageContent>
  )
}
```

---

## 🎨 Design Component Library

### Headings
```tsx
<h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
  <span className="inline-block animate-pulse">▸</span> Section Title
</h2>
```

### Glass Card
```tsx
<div className="glass hover-lift rounded-xl border border-[#00ff41]/20 p-5">
  {/* Content */}
</div>
```

### Animated Border Card
```tsx
<div className="border-animated glass-strong rounded-xl p-5">
  {/* Content */}
</div>
```

### Gradient Border Wrapper
```tsx
<div className="border-gradient">
  <div className="border-gradient-content glass-strong p-6">
    {/* Content */}
  </div>
</div>
```

### Code Block
```tsx
<div className="bg-[#0d1117] rounded-lg p-4 border border-[#00ff41]/20">
  <p className="text-xs font-mono text-[#00ff41] mb-2">Label:</p>
  <pre className="text-xs font-mono text-[#8b949e] overflow-x-auto">
{`code here`}
  </pre>
</div>
```

### Numbered Step
```tsx
<div className="flex items-center gap-3 mb-4">
  <div className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 flex items-center justify-center">
    <span className="font-mono text-[#00ff41] font-bold">1</span>
  </div>
  <h3 className="font-mono text-lg font-semibold text-[#e8f4f8]">Step Title</h3>
</div>
```

### Best Practice Item
```tsx
<div className="flex items-start gap-3">
  <span className="text-[#00ff41] font-mono mt-1">✓</span>
  <div>
    <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Title</p>
    <p className="text-xs text-[#8b949e] mt-1">Description</p>
  </div>
</div>
```

### Comparison Grid (Broken vs Fixed)
```tsx
<div className="grid gap-6 md:grid-cols-2">
  {/* Broken */}
  <div className="glass rounded-xl p-5 border border-red-500/20">
    <div className="flex items-center gap-2 mb-4">
      <XCircle className="h-5 w-5 text-red-400" />
      <h3 className="font-mono font-semibold text-red-400">Broken</h3>
    </div>
    {/* Content */}
  </div>

  {/* Fixed */}
  <div className="glass rounded-xl p-5 border border-[#00ff41]/20">
    <div className="flex items-center gap-2 mb-4">
      <CheckCircle2 className="h-5 w-5 text-[#00ff41]" />
      <h3 className="font-mono font-semibold text-[#00ff41]">Fixed</h3>
    </div>
    {/* Content */}
  </div>
</div>
```

---

## 📚 Detailed Page Guides

### 1. Low Match Quality (`/problems/low-match-quality`)

**Concept:** PII hashing and normalization for better event matching

**Custom Events:**
```tsx
const customEvents = [
  {
    name: "Lead (Unhashed Email)",
    brokenPayload: {
      event_name: "Lead",
      user_data: {
        email: "User@Example.com"  // NOT HASHED! NOT NORMALIZED!
      }
    },
    fixedPayload: {
      event_name: "Lead",
      event_id: `lead_${Date.now()}`,
      user_data: {
        em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514"  // SHA-256
      }
    }
  },
  {
    name: "Lead (Improper Normalization)",
    brokenPayload: {
      user_data: {
        em: hash(" USER@EXAMPLE.COM ")  // Spaces not trimmed before hashing
      }
    },
    fixedPayload: {
      user_data: {
        em: hash("user@example.com")  // Lowercase + trimmed before hash
      }
    }
  }
]
```

**Key Topics:**
- Why PII must be hashed (privacy compliance)
- Normalization rules (lowercase, trim, remove spaces)
- SHA-256 hashing implementation
- Match rate calculator

---

### 2. Purchase Mismatch (`/problems/purchase-mismatch`)

**Concept:** Value and currency discrepancies causing incorrect revenue tracking

**Custom Events:**
```tsx
const customEvents = [
  {
    name: "Purchase (Wrong Type)",
    brokenPayload: {
      event_name: "Purchase",
      custom_data: {
        currency: "USD",
        value: "99.99"  // STRING! Should be NUMBER
      }
    },
    fixedPayload: {
      custom_data: {
        currency: "USD",
        value: 99.99  // Correct type
      }
    }
  },
  {
    name: "Purchase (Missing Currency)",
    brokenPayload: {
      custom_data: {
        value: 99.99  // Currency required!
      }
    },
    fixedPayload: {
      custom_data: {
        currency: "USD",
        value: 99.99
      }
    }
  }
]
```

**Key Topics:**
- Data type requirements
- Currency codes (ISO 4217)
- Decimal precision
- Multi-currency handling

---

### 3. Wrong Parameters (`/problems/wrong-parameters`)

**Concept:** Incorrect parameter names, types, or formats

**Custom Events:**
```tsx
const customEvents = [
  {
    name: "Wrong Field Names",
    brokenPayload: {
      event_name: "AddToCart",
      price: 29.99,  // Wrong! Should be "value"
      items: ["prod_123"]  // Wrong! Should be "content_ids"
    },
    fixedPayload: {
      custom_data: {
        value: 29.99,
        content_ids: ["prod_123"]
      }
    }
  },
  {
    name: "Wrong Data Structure",
    brokenPayload: {
      custom_data: {
        content_ids: "prod_123"  // Should be ARRAY
      }
    },
    fixedPayload: {
      custom_data: {
        content_ids: ["prod_123"]  // Correct: array
      }
    }
  }
]
```

---

### 4. Event Order (`/problems/event-order`)

**Concept:** Events must fire in logical sequence

**Custom Events:**
```tsx
const customEvents = [
  {
    name: "Purchase Before PageView",
    brokenPayload: {
      // Demonstrates illogical sequence
      event_sequence: ["Purchase", "PageView", "AddToCart"]
    },
    fixedPayload: {
      event_sequence: ["PageView", "ViewContent", "AddToCart", "Purchase"]
    }
  }
]
```

---

### 5. Missing Event ID (`/problems/missing-event-id`)

**Concept:** Deep dive into event_id importance (extends Duplicate Events)

**Custom Events:**
```tsx
const customEvents = [
  {
    name: "Without event_id",
    brokenPayload: {
      event_name: "Purchase",
      value: 99.99
      // Missing event_id causes:
      // 1. No deduplication
      // 2. Inflated counts
      // 3. Attribution issues
    },
    fixedPayload: {
      event_name: "Purchase",
      event_id: crypto.randomUUID(),
      value: 99.99
    }
  }
]
```

---

### 6. Dedup Misconfigured (`/problems/dedup-misconfigured`)

**Concept:** Advanced deduplication scenarios

**Custom Events:**
```tsx
const customEvents = [
  {
    name: "Different IDs on Each Platform",
    brokenPayload: {
      // Pixel sends: event_id_abc
      // CAPI sends: event_id_xyz
      // Result: 2 events counted
    }
  },
  {
    name: "ID Not Passed to Server",
    brokenPayload: {
      // Client generates ID but doesn't send to backend
    }
  }
]
```

---

### 7. Cookie FBP Issues (`/problems/cookie-fbp-issues`)

**Concept:** First-party _fbp cookie problems

**Custom Events:**
```tsx
const customEvents = [
  {
    name: "Missing FBP Cookie",
    brokenPayload: {
      user_data: {
        // fbp missing - limits attribution
      }
    },
    fixedPayload: {
      user_data: {
        fbp: "_fbp.domain.timestamp.random",
        fbc: "_fbc.domain.timestamp.fbclid"
      }
    }
  }
]
```

**Key Topics:**
- What is _fbp cookie
- How it's generated
- Cookie domain issues
- GDPR compliance

---

### 8. AEM Domain Issues (`/problems/aem-domain-issues`)

**Concept:** Aggregated Event Measurement across multiple domains

**Custom Events:**
```tsx
const customEvents = [
  {
    name: "Wrong Domain Configuration",
    brokenPayload: {
      // Events from subdomain not aggregating
      event_source_url: "shop.example.com"
      // Missing parent domain linkage
    },
    fixedPayload: {
      event_source_url: "shop.example.com",
      // Properly configured AEM domains
    }
  }
]
```

---

### 9. Testing & Debugging (`/problems/testing-debugging`)

**Concept:** Tools and techniques for debugging tracking

**Custom Events:**
```tsx
const customEvents = [
  {
    name: "Test Event (No Test Code)",
    brokenPayload: {
      // Sent to production - pollutes real data
    },
    fixedPayload: {
      test_event_code: "TEST12345"  // Isolated test data
    }
  }
]
```

**Key Topics:**
- Meta Events Manager Test Events
- Browser DevTools Network tab
- Meta Pixel Helper extension
- CAPI test_event_code

---

### 10. CAPI Setup (`/problems/capi-setup`)

**Concept:** Proper Conversions API configuration

**Custom Events:**
```tsx
const customEvents = [
  {
    name: "Missing Required Fields",
    brokenPayload: {
      event_name: "Purchase"
      // Missing: event_time, action_source, etc.
    },
    fixedPayload: {
      event_name: "Purchase",
      event_time: Math.floor(Date.now() / 1000),
      action_source: "website",
      event_source_url: window.location.href,
      user_data: { /* ... */ }
    }
  }
]
```

---

### 11. First-Party Endpoint (`/server/first-party-endpoint`)

**Concept:** Custom tracking endpoints to bypass ad blockers

**Custom Events:**
```tsx
const customEvents = [
  {
    name: "Third-Party Endpoint (Blocked)",
    brokenPayload: {
      // Sends to facebook.com - blocked by adblockers
      endpoint: "https://graph.facebook.com/..."
    },
    fixedPayload: {
      // First-party endpoint
      endpoint: "https://yourdomain.com/api/track"
    }
  }
]
```

---

### 12. Retry Queue (`/server/retry-queue`)

**Concept:** Handling failed CAPI requests

**Custom Events:**
```tsx
const customEvents = [
  {
    name: "Failed Event (No Retry)",
    brokenPayload: {
      // Network error - event lost forever
    },
    fixedPayload: {
      // Queued for retry with exponential backoff
      retry_count: 0,
      next_retry: Date.now() + 1000
    }
  }
]
```

---

### 13. Schema Guardrails (`/server/schema-guardrails`)

**Concept:** Data validation before sending to Meta

**Custom Events:**
```tsx
const customEvents = [
  {
    name: "Invalid Data Types",
    brokenPayload: {
      value: "not a number",
      currency: 123  // Should be string
    },
    fixedPayload: {
      // Validated and corrected
      value: 99.99,
      currency: "USD"
    }
  }
]
```

---

### 14. Security & Privacy (`/server/security-privacy`)

**Concept:** Compliance, PII handling, GDPR

**Custom Events:**
```tsx
const customEvents = [
  {
    name: "Plaintext PII (GDPR Violation)",
    brokenPayload: {
      user_data: {
        email: "user@example.com",  // VIOLATION!
        phone: "+1234567890"
      }
    },
    fixedPayload: {
      user_data: {
        em: "hashed_value",
        ph: "hashed_value"
      }
    }
  }
]
```

---

## 🚀 Quick Start Guide

### For Each New Page:

1. **Create file** in appropriate directory:
   - Core Problems: `app/problems/[slug]/page.tsx`
   - Server-Side: `app/server/[slug]/page.tsx`

2. **Copy template** from above

3. **Research the concept**:
   - Meta's official documentation
   - Common issues in the wild
   - Best practices

4. **Define custom events** specific to that problem

5. **Write sections**:
   - Problem explanation
   - Visual examples
   - Implementation guide
   - Common mistakes
   - Best practices

6. **Test the playground** - make sure events demonstrate the concept

7. **Link to related pages**

---

## ✅ Completion Checklist (Per Page)

- [ ] File created in correct directory
- [ ] Custom events defined
- [ ] All 7 sections included
- [ ] Code examples are copy-paste ready
- [ ] Hacker theme styling applied
- [ ] Event Playground configured
- [ ] Related topics linked
- [ ] Mobile responsive
- [ ] No TypeScript errors
- [ ] No linter errors

---

## 📊 Current Progress

**Completed:** 5/17 (29%)
**Remaining:** 12

**Estimated time per page:** 30-45 minutes
**Total remaining time:** 6-9 hours

---

**Ready to build the complete educational platform!** 🚀
