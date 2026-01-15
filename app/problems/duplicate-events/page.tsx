"use client"

import { PageContent } from "@/components/page-content"
import { EventPlayground } from "@/components/event-playground"
import { Layers, Copy, CheckCircle2, XCircle, AlertTriangle } from "lucide-react"

export default function DuplicateEventsPage() {
  // Custom events demonstrating deduplication
  const customEvents = [
    {
      name: "Purchase (No Event ID)",
      icon: <XCircle className="h-4 w-4 text-red-400 icon-spin-hover" />,
      brokenPayload: {
        event_name: "Purchase",
        custom_data: {
          currency: "USD",
          value: 99.99,
          order_id: "order_123"
        }
        // PROBLEM: No event_id means Pixel + CAPI = 2 events!
      },
      fixedPayload: {
        event_name: "Purchase",
        event_id: "purchase_20260115_123",  // Consistent ID
        custom_data: {
          currency: "USD",
          value: 99.99,
          order_id: "order_123"
        }
      }
    },
    {
      name: "Purchase (Mismatched IDs)",
      icon: <AlertTriangle className="h-4 w-4 text-yellow-400 icon-spin-hover" />,
      brokenPayload: {
        event_name: "Purchase",
        event_id: `pixel_${Date.now()}`,  // Different on each platform!
        custom_data: {
          currency: "USD",
          value: 99.99
        }
      },
      fixedPayload: {
        event_name: "Purchase",
        event_id: "purchase_unified_12345",  // Same on both platforms
        custom_data: {
          currency: "USD",
          value: 99.99
        }
      }
    },
    {
      name: "AddToCart (Same Event ID)",
      icon: <CheckCircle2 className="h-4 w-4 text-[#00ff41] icon-spin-hover" />,
      brokenPayload: {
        event_name: "AddToCart",
        event_id: "cart_duplicate_test",
        custom_data: { value: 29.99, currency: "USD" }
        // Send twice to show it's counted once
      },
      fixedPayload: {
        event_name: "AddToCart",
        event_id: "cart_deduplicated_456",  // Dedup works!
        custom_data: { value: 29.99, currency: "USD" }
      }
    },
    {
      name: "Lead (With External ID)",
      icon: <CheckCircle2 className="h-4 w-4 text-[#00ff41] icon-spin-hover" />,
      brokenPayload: {
        event_name: "Lead",
        // Missing external_id for offline matching
        user_data: {
          em: "hash_value"
        }
      },
      fixedPayload: {
        event_name: "Lead",
        event_id: `lead_${Date.now()}`,
        user_data: {
          em: "hash_value",
          external_id: "user_12345"  // Links online & offline
        }
      }
    }
  ]

  return (
    <PageContent
      title="Duplicate Events"
      description="Learn how to prevent duplicate event counting when using both Meta Pixel and Conversions API"
      status="Stable"
    >
      
      {/* The Problem */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> The Duplicate Event Problem
        </h2>
        
        <div className="space-y-4">
          <p className="leading-relaxed text-[#8b949e] text-sm md:text-base">
            When you implement both Meta Pixel (client-side) and Conversions API (server-side), the same user action can be tracked twice—once from the browser and once from your server. Without proper deduplication, Meta counts these as two separate events, inflating your metrics and wasting your ad budget.
          </p>
          
          <div className="border-gradient">
            <div className="border-gradient-content glass-strong p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <Layers className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="font-mono text-xl font-bold text-red-400">Real-World Impact</h3>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="glass hover-glow rounded-lg p-4 border border-red-500/20">
                  <p className="font-mono font-semibold text-red-400 mb-2">Inflated Conversion Counts</p>
                  <p className="text-sm text-[#8b949e]">
                    1 purchase shows as 2 conversions, making your campaign appear 2x more successful than it actually is
                  </p>
                </div>
                
                <div className="glass hover-glow rounded-lg p-4 border border-red-500/20">
                  <p className="font-mono font-semibold text-red-400 mb-2">Incorrect ROAS</p>
                  <p className="text-sm text-[#8b949e]">
                    Doubled conversion values lead to inflated ROAS, causing Meta to over-bid on ads
                  </p>
                </div>
                
                <div className="glass hover-glow rounded-lg p-4 border border-red-500/20">
                  <p className="font-mono font-semibold text-red-400 mb-2">Poor Optimization</p>
                  <p className="text-sm text-[#8b949e]">
                    Meta&apos;s AI makes decisions based on false data, leading to inefficient ad delivery
                  </p>
                </div>
                
                <div className="glass hover-glow rounded-lg p-4 border border-red-500/20">
                  <p className="font-mono font-semibold text-red-400 mb-2">Wasted Budget</p>
                  <p className="text-sm text-[#8b949e]">
                    Incorrect metrics lead to poor bidding strategies and inefficient budget allocation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Deduplication Works */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> How Event Deduplication Works
        </h2>
        
        <div className="space-y-6">
          <p className="leading-relaxed text-[#8b949e] text-sm md:text-base">
            Meta uses the <span className="text-[#00ff41] font-mono">event_id</span> parameter to identify duplicate events. When both Pixel and CAPI send events with the same <span className="text-[#00ff41] font-mono">event_id</span>, Meta recognizes them as the same event and counts it only once.
          </p>

          {/* Visual Comparison */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Without Deduplication */}
            <div className="glass rounded-xl p-5 border border-red-500/20">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="h-5 w-5 text-red-400" />
                <h3 className="font-mono font-semibold text-red-400">Without event_id</h3>
              </div>
              
              <div className="space-y-3">
                <div className="bg-[#0d1117] rounded-lg p-3 border border-red-500/20">
                  <p className="text-xs font-mono text-[#8b949e] mb-1">Meta Pixel Sends:</p>
                  <pre className="text-xs font-mono text-red-400">
{`{
  "event_name": "Purchase",
  "value": 99.99
  // No event_id
}`}
                  </pre>
                </div>
                
                <div className="text-center text-[#8b949e] font-mono text-sm">+</div>
                
                <div className="bg-[#0d1117] rounded-lg p-3 border border-red-500/20">
                  <p className="text-xs font-mono text-[#8b949e] mb-1">CAPI Sends:</p>
                  <pre className="text-xs font-mono text-red-400">
{`{
  "event_name": "Purchase",
  "value": 99.99
  // No event_id
}`}
                  </pre>
                </div>
                
                <div className="text-center font-mono text-sm text-red-400">
                  = <span className="font-bold">2 Purchases</span> counted 🚫
                </div>
              </div>
            </div>

            {/* With Deduplication */}
            <div className="glass rounded-xl p-5 border border-[#00ff41]/20">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-5 w-5 text-[#00ff41]" />
                <h3 className="font-mono font-semibold text-[#00ff41]">With event_id</h3>
              </div>
              
              <div className="space-y-3">
                <div className="bg-[#0d1117] rounded-lg p-3 border border-[#00ff41]/20">
                  <p className="text-xs font-mono text-[#8b949e] mb-1">Meta Pixel Sends:</p>
                  <pre className="text-xs font-mono text-[#00ff41]">
{`{
  "event_name": "Purchase",
  "event_id": "ord_123",
  "value": 99.99
}`}
                  </pre>
                </div>
                
                <div className="text-center text-[#8b949e] font-mono text-sm">+</div>
                
                <div className="bg-[#0d1117] rounded-lg p-3 border border-[#00ff41]/20">
                  <p className="text-xs font-mono text-[#8b949e] mb-1">CAPI Sends:</p>
                  <pre className="text-xs font-mono text-[#00ff41]">
{`{
  "event_name": "Purchase",
  "event_id": "ord_123",
  "value": 99.99
}`}
                  </pre>
                </div>
                
                <div className="text-center font-mono text-sm text-[#00ff41]">
                  = <span className="font-bold">1 Purchase</span> counted ✓
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Guide */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Implementation Guide
        </h2>
        
        <div className="space-y-6">
          {/* Step 1: Generate Event ID */}
          <div className="glass-strong hover-border-glow rounded-xl p-6 border border-[#00ff41]/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 flex items-center justify-center">
                <span className="font-mono text-[#00ff41] font-bold">1</span>
              </div>
              <h3 className="font-mono text-lg font-semibold text-[#e8f4f8]">Generate a Unique Event ID</h3>
            </div>
            
            <p className="text-sm text-[#8b949e] mb-4">
              Create a unique identifier for each event. This can be a UUID, timestamp-based ID, or your internal transaction ID.
            </p>
            
            <div className="bg-[#0d1117] rounded-lg p-4 border border-[#00ff41]/20">
              <p className="text-xs font-mono text-[#00ff41] mb-2">JavaScript (Client-Side):</p>
              <pre className="text-xs font-mono text-[#8b949e] overflow-x-auto">
{`// Generate UUID
const eventId = crypto.randomUUID()
// Result: "550e8400-e29b-41d4-a716-446655440000"

// Or use timestamp + random
const eventId = \`event_\${Date.now()}_\${Math.random()}\`
// Result: "event_1705334400000_0.123456"

// Or use your order ID
const eventId = \`order_\${orderId}\`
// Result: "order_12345"`}
              </pre>
            </div>
          </div>

          {/* Step 2: Send from Client */}
          <div className="glass-strong hover-border-glow rounded-xl p-6 border border-[#00ff41]/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 flex items-center justify-center">
                <span className="font-mono text-[#00ff41] font-bold">2</span>
              </div>
              <h3 className="font-mono text-lg font-semibold text-[#e8f4f8]">Send Event with ID from Pixel</h3>
            </div>
            
            <div className="bg-[#0d1117] rounded-lg p-4 border border-[#00ff41]/20">
              <p className="text-xs font-mono text-[#00ff41] mb-2">Meta Pixel (Browser):</p>
              <pre className="text-xs font-mono text-[#8b949e] overflow-x-auto">
{`const eventId = crypto.randomUUID()

fbq('track', 'Purchase', {
  currency: 'USD',
  value: 99.99
}, {
  eventID: eventId  // Pass event_id in options
})`}
              </pre>
            </div>
          </div>

          {/* Step 3: Send from Server */}
          <div className="glass-strong hover-border-glow rounded-xl p-6 border border-[#00ff41]/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 flex items-center justify-center">
                <span className="font-mono text-[#00ff41] font-bold">3</span>
              </div>
              <h3 className="font-mono text-lg font-semibold text-[#e8f4f8]">Send Same ID from CAPI</h3>
            </div>
            
            <div className="bg-[#0d1117] rounded-lg p-4 border border-[#00ff41]/20">
              <p className="text-xs font-mono text-[#00ff41] mb-2">Conversions API (Server):</p>
              <pre className="text-xs font-mono text-[#8b949e] overflow-x-auto">
{`// Server receives the same event_id from client
const eventPayload = {
  data: [{
    event_name: 'Purchase',
    event_id: eventId,  // MUST match Pixel's eventID
    event_time: Math.floor(Date.now() / 1000),
    custom_data: {
      currency: 'USD',
      value: 99.99
    }
  }]
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Common Mistakes */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Common Deduplication Mistakes
        </h2>
        
        <div className="grid gap-4 md:grid-cols-2">
          {/* Mistake 1 */}
          <div className="border-animated glass-strong rounded-xl p-5">
            <h3 className="font-mono text-lg font-semibold text-red-400 mb-3">❌ Generating Different IDs</h3>
            <p className="text-sm text-[#8b949e] mb-3">
              Creating a new event_id on both client and server defeats the purpose of deduplication.
            </p>
            <div className="bg-[#0d1117] rounded p-3">
              <pre className="text-xs font-mono text-red-400">
{`// Client
eventID: crypto.randomUUID()

// Server (Different!)
event_id: crypto.randomUUID()`}
              </pre>
            </div>
          </div>

          {/* Mistake 2 */}
          <div className="border-animated glass-strong rounded-xl p-5">
            <h3 className="font-mono text-lg font-semibold text-red-400 mb-3">❌ Not Passing ID to Server</h3>
            <p className="text-sm text-[#8b949e] mb-3">
              Forgetting to send the event_id from client to server for CAPI to use.
            </p>
            <div className="bg-[#0d1117] rounded p-3">
              <pre className="text-xs font-mono text-red-400">
{`// Client generates but doesn't send
const id = crypto.randomUUID()
fbq('track', 'Purchase', {}, { eventID: id })

// Server never receives it
// No way to deduplicate!`}
              </pre>
            </div>
          </div>

          {/* Mistake 3 */}
          <div className="border-animated glass-strong rounded-xl p-5">
            <h3 className="font-mono text-lg font-semibold text-red-400 mb-3">❌ Using Inconsistent Formats</h3>
            <p className="text-sm text-[#8b949e] mb-3">
              Pixel uses eventID (camelCase) but payload must use event_id (snake_case).
            </p>
            <div className="bg-[#0d1117] rounded p-3">
              <pre className="text-xs font-mono text-red-400">
{`// Correct Pixel format
fbq('track', 'Purchase', {}, {
  eventID: 'abc123'  // camelCase
})

// Correct CAPI format
{
  event_id: 'abc123'  // snake_case
}`}
              </pre>
            </div>
          </div>

          {/* Mistake 4 */}
          <div className="border-animated glass-strong rounded-xl p-5">
            <h3 className="font-mono text-lg font-semibold text-red-400 mb-3">❌ Omitting event_id Entirely</h3>
            <p className="text-sm text-[#8b949e] mb-3">
              The most common mistake: not including event_id at all on either platform.
            </p>
            <div className="bg-[#0d1117] rounded p-3">
              <pre className="text-xs font-mono text-red-400">
{`// No deduplication possible
fbq('track', 'Purchase', {
  currency: 'USD',
  value: 99.99
  // Missing eventID!
})`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[400ms]">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Deduplication Best Practices
        </h2>
        
        <div className="glass-strong hover-border-glow rounded-xl border border-[#00ff41]/20 p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-[#00ff41] font-mono mt-1">✓</span>
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Use UUIDs or Timestamp-Based IDs</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  UUIDs are universally unique. Timestamp + random also works well.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#00ff41] font-mono mt-1">✓</span>
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Store event_id with Transaction</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Save the event_id in your database with the order/transaction for debugging
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#00ff41] font-mono mt-1">✓</span>
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Send ID from Client to Server</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Pass the event_id in the API request so your server can use the same ID for CAPI
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#00ff41] font-mono mt-1">✓</span>
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Use Order IDs for Purchase Events</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Your internal order ID is perfect - it&apos;s already unique per transaction
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#00ff41] font-mono mt-1">✓</span>
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Test Deduplication in Events Manager</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Send same event_id from both Pixel and CAPI, verify only 1 event appears in Meta
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#00ff41] font-mono mt-1">✓</span>
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Include event_time for Better Matching</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Unix timestamp helps Meta match events even if they arrive at different times
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Playground */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Test Event Deduplication
        </h2>
        
        <EventPlayground
          title="Deduplication Testing Playground"
          description="Toggle between broken (no event_id) and fixed (with event_id) to see the difference"
          events={customEvents}
          showModeToggle={true}
          showLogs={true}
        />
      </section>

      {/* Related Topics */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[600ms]">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Related Topics
        </h2>
        
        <div className="grid gap-4 md:grid-cols-2">
          <a href="/problems/missing-event-id" className="block">
            <div className="glass hover-lift rounded-xl border border-[#00ff41]/20 p-5 h-full">
              <h3 className="font-mono text-[#00ff41] font-semibold mb-2">Missing Event ID</h3>
              <p className="text-sm text-[#8b949e] mb-3">
                Deep dive into why event_id is critical and how to implement it correctly
              </p>
              <code className="text-xs text-[#00d9ff] font-mono">→ /problems/missing-event-id</code>
            </div>
          </a>
          
          <a href="/problems/dedup-misconfigured" className="block">
            <div className="glass hover-lift rounded-xl border border-[#00ff41]/20 p-5 h-full">
              <h3 className="font-mono text-[#00ff41] font-semibold mb-2">Dedup Misconfigured</h3>
              <p className="text-sm text-[#8b949e] mb-3">
                Advanced deduplication scenarios and troubleshooting common setup issues
              </p>
              <code className="text-xs text-[#00d9ff] font-mono">→ /problems/dedup-misconfigured</code>
            </div>
          </a>
        </div>
      </section>

    </PageContent>
  )
}
