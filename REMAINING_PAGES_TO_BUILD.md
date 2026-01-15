# Remaining Pages to Build

**Status:** 9 out of 17 pages complete
**Last Updated:** January 15, 2026

---

## ✅ Completed Pages (9)

1. Home (`/`)
2. Setup Checklist (`/getting-started/setup-checklist`)
3. Demo Controls (`/getting-started/demo-controls`)
4. Missing Events (`/problems/missing-events`)
5. Duplicate Events (`/problems/duplicate-events`) - FULLY INTERACTIVE
6. **Low Match Quality (`/problems/low-match-quality`)** - NEW! ✨
7. **Purchase Mismatch (`/problems/purchase-mismatch`)** - NEW! ✨
8. **Wrong Parameters (`/problems/wrong-parameters`)** - NEW! ✨
9. CAPI Test (`/capi-test`)

---

## 🚧 Pages To Build (8)

All templates below are READY TO USE - just copy, paste, and customize!

### 1. Missing Event ID (`/problems/missing-event-id`)

**Focus:** Why event_id is critical beyond deduplication

**8 Examples:**
1. No event_id at all → Can't track individual events
2. Same event_id reused → Can't distinguish between events
3. Non-unique event_id → Deduplication fails
4. event_id in wrong format → Poor debugging
5. Missing event_id on high-value purchase → Can't track ROI properly
6. Using timestamp as event_id (good)
7. Using order ID as event_id (best)
8. Complete event with proper ID structure

**Key Points:**
- Event IDs enable event-level debugging
- Required for deduplication across Pixel + CAPI
- Helps track individual transactions
- Essential for refunds/cancellations
- Enables proper attribution

**Copy this structure:** Same as `duplicate-events/page.tsx` but focus on tracking/debugging aspects

---

### 2. CAPI Setup (`/problems/capi-setup`)

**Focus:** Server-side configuration essentials

**8 Examples:**
1. Missing event_time → Rejected by Meta
2. Missing action_source → Can't attribute properly  
3. Missing event_source_url → Poor attribution
4. Missing user_data → 0% match quality
5. Missing client_ip_address → Lower match quality
6. Missing client_user_agent → Lower match quality
7. Incomplete server-side event (minimal fields)
8. Complete server-side event (all recommended fields)

**Key Points:**
- action_source values: website, app, phone_call, chat, email
- event_time must be Unix timestamp
- event_source_url helps with attribution
- client_ip_address and client_user_agent boost match quality
- user_data is required for good matching

---

### 3. Cookie FBP Issues (`/problems/cookie-fbp-issues`)

**Focus:** First-party cookie configuration

**8 Examples:**
1. Missing _fbp cookie → Poor attribution
2. Missing _fbc cookie → Can't track ad clicks
3. Wrong domain for cookie → Not sent to server
4. httpOnly flag preventing access → Can't read cookie
5. Expired cookie → Tracking breaks
6. Cookie not set before events → Events lack attribution
7. Proper _fbp cookie (from Pixel)
8. Complete cookie setup (fbp + fbc + proper domain)

**Key Points:**
- _fbp = Facebook browser pixel cookie (set by Pixel automatically)
- _fbc = Facebook click cookie (set when user clicks ad)
- Must be first-party cookies on your domain
- Send in user_data.fbp and user_data.fbc for CAPI
- Improves attribution accuracy significantly

---

### 4. Event Order (`/problems/event-order`)

**Focus:** Logical event sequencing

**6 Examples:**
1. Purchase before ViewContent → Illogical, confuses Meta AI
2. AddToCart before ViewContent → Missing funnel context
3. InitiateCheckout before AddToCart → Broken funnel
4. Correct sequence: ViewContent → AddToCart → InitiateCheckout → Purchase
5. Multiple AddToCart events (updating quantity)
6. Complete e-commerce funnel with proper timing

**Key Points:**
- Events should follow logical user journey
- Proper sequence helps Meta understand intent
- Timing between events matters (too fast = suspicious)
- Multiple AddToCart = user is considering products
- Proper funnel = better optimization

---

### 5. Dedup Misconfigured (`/problems/dedup-misconfigured`)

**Focus:** Advanced deduplication scenarios

**8 Examples:**
1. Different event_ids for Pixel vs CAPI → Both counted
2. event_id generated on client vs server → Mismatch
3. Timestamp-based event_id with slight differences → No dedup
4. event_id sent to Pixel but not CAPI → Partial tracking
5. Multiple events with same event_id (testing dedup resilience)
6. event_time mismatch between Pixel and CAPI (still dedupes!)
7. 48-hour dedup window test (event_id expires)
8. Perfect dedup: same event_id, sent to both platforms, within window

**Key Points:**
- event_id must be IDENTICAL on both platforms
- Generate on client, pass to server
- 48-hour deduplication window
- event_time differences OK if event_id matches
- Test with Meta Events Manager

---

### 6. Testing & Debugging (`/problems/testing-debugging`)

**Focus:** Tools and techniques for troubleshooting

**8 Examples:**
1. Using test_event_code for safe testing
2. Meta Pixel Helper Chrome extension
3. Browser DevTools Network tab inspection
4. Meta Events Manager Test Events view
5. CAPI error response interpretation
6. Match quality score analysis
7. Event deduplication verification
8. Complete debugging workflow

**Key Points:**
- Always use test_event_code in development
- Meta Pixel Helper shows real-time events
- Network tab shows exact payloads
- Test Events tab shows events within minutes
- Check for warnings/errors in Events Manager
- Verify event_id deduplication working

---

### 7. AEM Domain Issues (`/problems/aem-domain-issues`)

**Focus:** Multi-domain and subdomain tracking

**6 Examples:**
1. Tracking across subdomains (www vs app)
2. Cross-domain tracking (site1.com → site2.com)
3. Cookie domain configuration for subdomains
4. event_source_url for multi-domain attribution
5. Aggregated Event Measurement setup
6. Complete multi-domain tracking solution

**Key Points:**
- AEM = Aggregated Event Measurement
- Required when tracking >8 domains per Pixel
- Cookie domain must allow sharing across subdomains
- event_source_url critical for attribution
- Configure in Events Manager > Settings > Aggregated Event Measurement

---

### 8. Security & Privacy (`/server/security-privacy`)

**Focus:** GDPR compliance and data protection

**8 Examples:**
1. Sending unhashed PII → GDPR violation
2. Logging sensitive data → Security risk
3. Missing consent before tracking → Privacy violation
4. Proper SHA-256 hashing implementation
5. Secure storage of access tokens
6. Data minimization (only send necessary fields)
7. User opt-out handling
8. Complete privacy-compliant implementation

**Key Points:**
- GDPR requires consent before tracking
- All PII must be hashed before sending
- Never log plaintext PII
- Store access tokens in environment variables (never in code)
- Implement user opt-out mechanisms
- Data retention policies (7-180 days recommended)
- CCPA compliance for California users

---

## 🎯 How to Build Each Page

### Step 1: Copy Template

```bash
cp app/problems/duplicate-events/page.tsx app/problems/your-page/page.tsx
```

### Step 2: Update Page Info

```typescript
export default function YourPage() {
  const examples = [
    // Your 6-8 examples here (see templates above)
  ]

  return (
    <PageContent
      title="Your Title"
      description="Your description"
      status="Critical|Common|Advanced"
    >
```

### Step 3: Write Educational Sections

Each page should have:
1. **The Problem** - Explain the issue and business impact
2. **How It Works** - Technical explanation with visuals
3. **Implementation Guide** - Step-by-step code examples
4. **Interactive Playground** - 6-8 real examples with EnhancedEventPlayground
5. **Best Practices** - Checklist of do's and don'ts
6. **Related Topics** - Links to other pages

### Step 4: Create Interactive Examples

```typescript
const examples = [
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

### Step 5: Add EnhancedEventPlayground

```typescript
<EnhancedEventPlayground
  title="Your Test Suite Title"
  description="What users will learn"
  events={examples}
  sendToMeta={true}
  sendToBoth={true}
  showNetworkInspector={true}
  pixelId={process.env.NEXT_PUBLIC_FB_PIXEL_ID}
/>
```

### Step 6: Test

```bash
npm run dev
# Visit page
# Click event buttons
# Check Network Inspector
# Verify in Meta Events Manager
```

---

## 📊 Priority Order

**High Priority (Build First):**
1. Missing Event ID - Extends deduplication concepts
2. CAPI Setup - Foundation for server-side tracking
3. Cookie FBP Issues - Common attribution problem

**Medium Priority:**
4. Event Order - Funnel optimization
5. Dedup Misconfigured - Advanced dedup scenarios

**Lower Priority (But Still Important):**
6. Testing & Debugging - Tools and techniques
7. AEM Domain Issues - Multi-domain setups
8. Security & Privacy - Compliance

---

## 💡 Quick Tips

### Reuse Patterns
- Copy from completed pages (Duplicate Events, Low Match Quality, Purchase Mismatch)
- Reuse visual components (cards, tables, comparisons)
- Follow the same section structure for consistency

### Icon Selection
```typescript
import { 
  AlertTriangle,  // Warnings
  XCircle,        // Errors
  CheckCircle2,   // Success
  Code2,          // Code-related
  Lock,           // Security
  Database,       // Server-side
  Globe,          // Domain/network
  Search,         // Testing/debugging
} from "lucide-react"
```

### Time Estimates
- **Per Page:** 45-60 minutes (including testing)
- **All 8 Pages:** 6-8 hours total

---

## 🎓 Example Page Structure

```typescript
"use client"

import { PageContent } from "@/components/page-content"
import { EnhancedEventPlayground } from "@/components/enhanced-event-playground"
import { Icon1, Icon2 } from "lucide-react"

export default function YourPage() {
  const examples = [
    // 6-8 examples
  ]

  return (
    <PageContent title="..." description="..." status="...">
      
      {/* Section 1: The Problem */}
      <section className="mb-12">
        <h2 className="mb-6 font-mono text-xl font-bold text-[#00ff41]">
          <span className="inline-block animate-pulse">▸</span> The Problem
        </h2>
        {/* Content */}
      </section>

      {/* Section 2: How It Works */}
      <section className="mb-12">
        <h2 className="mb-6 font-mono text-xl font-bold text-[#00ff41]">
          <span className="inline-block animate-pulse">▸</span> How It Works
        </h2>
        {/* Content */}
      </section>

      {/* Section 3: Implementation */}
      <section className="mb-12">
        <h2 className="mb-6 font-mono text-xl font-bold text-[#00ff41]">
          <span className="inline-block animate-pulse">▸</span> Implementation Guide
        </h2>
        {/* Code examples */}
      </section>

      {/* Section 4: Interactive Playground */}
      <section className="mb-12">
        <h2 className="mb-6 font-mono text-xl font-bold text-[#00ff41]">
          <span className="inline-block animate-pulse">▸</span> Interactive Testing
        </h2>
        
        <EnhancedEventPlayground
          title="..."
          description="..."
          events={examples}
          sendToMeta={true}
          sendToBoth={true}
          showNetworkInspector={true}
          pixelId={process.env.NEXT_PUBLIC_FB_PIXEL_ID}
        />
      </section>

      {/* Section 5: Best Practices */}
      <section className="mb-12">
        <h2 className="mb-6 font-mono text-xl font-bold text-[#00ff41]">
          <span className="inline-block animate-pulse">▸</span> Best Practices
        </h2>
        {/* Checklist */}
      </section>

      {/* Section 6: Related Topics */}
      <section className="mb-12">
        <h2 className="mb-6 font-mono text-xl font-bold text-[#00ff41]">
          <span className="inline-block animate-pulse">▸</span> Related Topics
        </h2>
        {/* Links to other pages */}
      </section>

    </PageContent>
  )
}
```

---

## ✅ When Complete

After building all 8 pages:
- ✅ 17 total pages (100% complete!)
- ✅ Every concept covered with interactive examples
- ✅ Real Meta integration on every page
- ✅ Complete learning platform

---

**Current Progress: 9/17 (53%)**  
**Remaining: 8 pages**  
**Total Time Est: 6-8 hours**

**The foundation is solid. The pattern is proven. Now it's just replication!** 🚀
