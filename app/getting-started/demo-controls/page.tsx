"use client"

import { PageContent } from "@/components/page-content"
import { EnhancedEventPlayground } from "@/components/enhanced-event-playground"
import { Eye, ShoppingCart, CreditCard, MousePointerClick, UserPlus, Search } from "lucide-react"

export default function DemoControlsPage() {
  // Custom events for this page
  const customEvents = [
    {
      name: "PageView",
      icon: <Eye className="h-4 w-4 text-[#00ff41] icon-spin-hover" />,
      brokenPayload: {
        event_name: "PageView"
        // Missing: event_id, event_time, user_data
      },
      fixedPayload: {
        event_name: "PageView",
        event_id: `view_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: typeof window !== 'undefined' ? window.location.href : 'https://example.com',
        action_source: "website",
        user_data: {
          client_ip_address: "[REDACTED]",
          client_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Mozilla/5.0',
          fbp: "_fbp_cookie_value",
          fbc: "_fbc_cookie_value"
        }
      }
    },
    {
      name: "ViewContent",
      icon: <Search className="h-4 w-4 text-[#00ff41] icon-spin-hover" />,
      brokenPayload: {
        event_name: "ViewContent"
        // Missing: content info, event_id
      },
      fixedPayload: {
        event_name: "ViewContent",
        event_id: `content_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        custom_data: {
          content_ids: ["prod_123"],
          content_type: "product",
          content_name: "Premium Widget",
          currency: "USD",
          value: 29.99
        }
      }
    },
    {
      name: "AddToCart",
      icon: <ShoppingCart className="h-4 w-4 text-[#00ff41] icon-spin-hover" />,
      brokenPayload: {
        event_name: "AddToCart",
        value: "29.99" // Wrong type: should be number
        // Missing: currency, content_ids, event_id
      },
      fixedPayload: {
        event_name: "AddToCart",
        event_id: `cart_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        custom_data: {
          content_ids: ["prod_123"],
          content_type: "product",
          currency: "USD",
          value: 29.99,
          num_items: 1
        }
      }
    },
    {
      name: "InitiateCheckout",
      icon: <MousePointerClick className="h-4 w-4 text-[#00ff41] icon-spin-hover" />,
      brokenPayload: {
        event_name: "InitiateCheckout"
        // Missing: everything except event_name
      },
      fixedPayload: {
        event_name: "InitiateCheckout",
        event_id: `checkout_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        custom_data: {
          content_ids: ["prod_123", "prod_456"],
          currency: "USD",
          value: 149.98,
          num_items: 2
        }
      }
    },
    {
      name: "Purchase",
      icon: <CreditCard className="h-4 w-4 text-[#00ff41] icon-spin-hover" />,
      brokenPayload: {
        event_name: "Purchase",
        currency: "USD"
        // Missing: value (REQUIRED!), event_id, order_id
      },
      fixedPayload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        custom_data: {
          content_ids: ["prod_123", "prod_456"],
          currency: "USD",
          value: 149.98,
          num_items: 2,
          order_id: `order_${Date.now()}`
        }
      }
    },
    {
      name: "Lead",
      icon: <UserPlus className="h-4 w-4 text-[#00ff41] icon-spin-hover" />,
      brokenPayload: {
        event_name: "Lead",
        email: "user@example.com" // NOT HASHED!
        // Security risk: PII should be hashed
      },
      fixedPayload: {
        event_name: "Lead",
        event_id: `lead_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514", // SHA-256 hashed
          ph: "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
          fn: "46070d4bf934fb0d4b06d9e2c46e346944e322444900a435d7d9a95e6d7435f5",
          ln: "8f9bfe9d1345237cb3b2b037656f3490c6f0b6d4a2c8c8b6d7f8e9a0b1c2d3e4"
        }
      }
    }
  ]

  return (
    <PageContent
      title="Demo Controls"
      description="Learn how to use the interactive event playground to understand proper Meta Pixel and CAPI event tracking"
      status="Stable"
    >
      
      {/* Introduction */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> What is the Event Playground?
        </h2>
        
        <div className="space-y-4">
          <p className="leading-relaxed text-[#8b949e] text-sm md:text-base">
            The Event Playground is an interactive tool that helps you understand the difference between broken and properly configured Meta tracking events. You can test different event types and see exactly what data should be included for optimal tracking.
          </p>
          
          <div className="glass hover-glow rounded-xl border border-[#00d9ff]/20 p-5">
            <div className="mb-3 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#00d9ff]/10">
                <Eye className="h-5 w-5 text-[#00d9ff]" />
              </div>
              <span className="font-mono font-semibold text-[#00d9ff]">Key Benefits</span>
            </div>
            <ul className="space-y-2">
              <li className="flex items-start gap-3 text-[#8b949e] text-sm">
                <span className="mt-1 text-[#00ff41] font-mono shrink-0">›</span>
                <span>See real-time examples of broken vs fixed event payloads</span>
              </li>
              <li className="flex items-start gap-3 text-[#8b949e] text-sm">
                <span className="mt-1 text-[#00ff41] font-mono shrink-0">›</span>
                <span>Understand what data is required for each event type</span>
              </li>
              <li className="flex items-start gap-3 text-[#8b949e] text-sm">
                <span className="mt-1 text-[#00ff41] font-mono shrink-0">›</span>
                <span>Learn proper PII hashing and data normalization</span>
              </li>
              <li className="flex items-start gap-3 text-[#8b949e] text-sm">
                <span className="mt-1 text-[#00ff41] font-mono shrink-0">›</span>
                <span>Test events safely without affecting production data</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> How to Use the Playground
        </h2>
        
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Step 1 */}
            <div className="glass hover-lift rounded-xl border border-[#00ff41]/20 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 flex items-center justify-center">
                  <span className="font-mono text-[#00ff41] font-bold">1</span>
                </div>
                <h3 className="font-mono text-[#e8f4f8] font-semibold">Select Mode</h3>
              </div>
              <p className="text-sm text-[#8b949e]">
                Toggle between <span className="text-red-400 font-mono">Broken</span> and <span className="text-[#00ff41] font-mono">Fixed</span> mode to see the difference in event payloads.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass hover-lift rounded-xl border border-[#00ff41]/20 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 flex items-center justify-center">
                  <span className="font-mono text-[#00ff41] font-bold">2</span>
                </div>
                <h3 className="font-mono text-[#e8f4f8] font-semibold">Click Event</h3>
              </div>
              <p className="text-sm text-[#8b949e]">
                Click any event button (ViewContent, AddToCart, Purchase, etc.) to send a test event.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass hover-lift rounded-xl border border-[#00ff41]/20 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 flex items-center justify-center">
                  <span className="font-mono text-[#00ff41] font-bold">3</span>
                </div>
                <h3 className="font-mono text-[#e8f4f8] font-semibold">Review Payload</h3>
              </div>
              <p className="text-sm text-[#8b949e]">
                Examine the event log to see the exact JSON payload that was sent, including all parameters.
              </p>
            </div>

            {/* Step 4 */}
            <div className="glass hover-lift rounded-xl border border-[#00ff41]/20 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 flex items-center justify-center">
                  <span className="font-mono text-[#00ff41] font-bold">4</span>
                </div>
                <h3 className="font-mono text-[#e8f4f8] font-semibold">Compare</h3>
              </div>
              <p className="text-sm text-[#8b949e]">
                Switch modes and click the same event again to compare broken vs fixed implementations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Common Issues */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Common Issues Demonstrated
        </h2>
        
        <div className="grid gap-4 md:grid-cols-2">
          {/* Missing Event ID */}
          <div className="border-animated glass-strong rounded-xl p-5">
            <h3 className="font-mono text-lg font-semibold text-red-400 mb-3">Missing Event ID</h3>
            <p className="text-sm text-[#8b949e] mb-3">
              Without event_id, Meta can&apos;t deduplicate events between Pixel and CAPI, leading to inflated counts.
            </p>
            <div className="bg-[#0d1117] rounded p-3">
              <p className="text-xs font-mono text-red-400">❌ Broken:</p>
              <pre className="text-xs font-mono text-[#8b949e] mt-1">
{`{
  "event_name": "Purchase"
  // Missing event_id!
}`}
              </pre>
            </div>
          </div>

          {/* Wrong Data Types */}
          <div className="border-animated glass-strong rounded-xl p-5">
            <h3 className="font-mono text-lg font-semibold text-red-400 mb-3">Wrong Data Types</h3>
            <p className="text-sm text-[#8b949e] mb-3">
              Value must be a number, not a string. Currency is required with any value field.
            </p>
            <div className="bg-[#0d1117] rounded p-3">
              <p className="text-xs font-mono text-red-400">❌ Broken:</p>
              <pre className="text-xs font-mono text-[#8b949e] mt-1">
{`{
  "event_name": "Purchase",
  "value": "99.99"  // String!
  // Missing currency
}`}
              </pre>
            </div>
          </div>

          {/* Unhashed PII */}
          <div className="border-animated glass-strong rounded-xl p-5">
            <h3 className="font-mono text-lg font-semibold text-red-400 mb-3">Unhashed PII</h3>
            <p className="text-sm text-[#8b949e] mb-3">
              Personal identifiable information (email, phone, name) must be SHA-256 hashed before sending.
            </p>
            <div className="bg-[#0d1117] rounded p-3">
              <p className="text-xs font-mono text-red-400">❌ Broken:</p>
              <pre className="text-xs font-mono text-[#8b949e] mt-1">
{`{
  "user_data": {
    "email": "user@example.com"
    // NOT HASHED!
  }
}`}
              </pre>
            </div>
          </div>

          {/* Missing Required Fields */}
          <div className="border-animated glass-strong rounded-xl p-5">
            <h3 className="font-mono text-lg font-semibold text-red-400 mb-3">Missing Required Fields</h3>
            <p className="text-sm text-[#8b949e] mb-3">
              Purchase events REQUIRE currency and value. Without them, events may be rejected or misattributed.
            </p>
            <div className="bg-[#0d1117] rounded p-3">
              <p className="text-xs font-mono text-red-400">❌ Broken:</p>
              <pre className="text-xs font-mono text-[#8b949e] mt-1">
{`{
  "event_name": "Purchase"
  // Missing currency & value!
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Event Tracking Best Practices
        </h2>
        
        <div className="glass-strong hover-border-glow rounded-xl border border-[#00ff41]/20 p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-[#00ff41] font-mono mt-1">✓</span>
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Always include event_id</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Use UUIDs or unique identifiers to prevent duplicate events between Pixel and CAPI
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#00ff41] font-mono mt-1">✓</span>
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Hash all PII before sending</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Use SHA-256 to hash emails, phones, names - never send plaintext PII
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#00ff41] font-mono mt-1">✓</span>
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Include currency with value</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Always pair currency (USD, EUR) with value field for proper conversion tracking
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#00ff41] font-mono mt-1">✓</span>
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Use correct data types</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Value should be number (99.99), not string (&quot;99.99&quot;)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#00ff41] font-mono mt-1">✓</span>
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Add event_time for CAPI</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Unix timestamp (seconds) ensures proper event ordering and attribution
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#00ff41] font-mono mt-1">✓</span>
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Include content_ids for products</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Product identifiers help Meta optimize for similar audiences and retargeting
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Playground */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[400ms]">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Try It Yourself
        </h2>
        
        <EnhancedEventPlayground
          title="Event Testing Playground"
          description="Toggle between Broken and Fixed modes, then click any event to see the payload difference"
          events={customEvents}
          showModeToggle={true}
          showLogs={true}
          sendToMeta={true}
          sendToBoth={true}
          showNetworkInspector={true}
          showMetaResponse={true}
          testEventCode="TEST_DEMO"
          pixelId={process.env.NEXT_PUBLIC_FB_PIXEL_ID}
        />
      </section>

      {/* Next Steps */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Next Steps
        </h2>
        
        <div className="grid gap-4 md:grid-cols-2">
          <a href="/problems/missing-events" className="block">
            <div className="glass hover-lift rounded-xl border border-[#00ff41]/20 p-5 h-full">
              <h3 className="font-mono text-[#00ff41] font-semibold mb-2">Diagnose Missing Events</h3>
              <p className="text-sm text-[#8b949e] mb-3">
                Learn why events might not be reaching Meta and how to debug tracking issues
              </p>
              <code className="text-xs text-[#00d9ff] font-mono">→ /problems/missing-events</code>
            </div>
          </a>
          
          <a href="/problems/duplicate-events" className="block">
            <div className="glass hover-lift rounded-xl border border-[#00ff41]/20 p-5 h-full">
              <h3 className="font-mono text-[#00ff41] font-semibold mb-2">Fix Duplicate Events</h3>
              <p className="text-sm text-[#8b949e] mb-3">
                Understand event deduplication and how to properly sync Pixel and CAPI events
              </p>
              <code className="text-xs text-[#00d9ff] font-mono">→ /problems/duplicate-events</code>
            </div>
          </a>
        </div>
      </section>

    </PageContent>
  )
}
