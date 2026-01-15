"use client"

import { PageContent } from "@/components/page-content"
import { EnhancedEventPlayground } from "@/components/enhanced-event-playground"
import { Layers, Copy, CheckCircle2, XCircle, AlertTriangle, RefreshCw, Clock, Zap } from "lucide-react"

export default function DuplicateEventsPage() {
  // 8 comprehensive examples demonstrating deduplication
  const dedupExamples = [
    {
      name: "No event_id (BROKEN)",
      icon: <XCircle className="h-4 w-4 text-red-400 icon-spin-hover" />,
      description: "Sends to both Pixel & CAPI without event_id → counted twice",
      brokenPayload: {
        event_name: "Purchase",
        custom_data: {
          currency: "USD",
          value: 99.99,
          order_id: "order_001"
        }
        // PROBLEM: No event_id = duplicate counting!
      },
      fixedPayload: {
        event_name: "Purchase",
        event_id: `purchase_dedup_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        custom_data: {
          currency: "USD",
          value: 99.99,
          order_id: "order_001"
        }
      }
    },
    {
      name: "Same event_id (FIXED)",
      icon: <CheckCircle2 className="h-4 w-4 text-[#00ff41] icon-spin-hover" />,
      description: "Both platforms use same event_id → deduplication works",
      brokenPayload: {
        event_name: "Purchase",
        event_id: `mismatch_${Math.random()}`, // Different each time!
        custom_data: { currency: "USD", value: 99.99 }
      },
      fixedPayload: {
        event_name: "Purchase",
        event_id: "unified_purchase_123", // Same on both!
        event_time: Math.floor(Date.now() / 1000),
        custom_data: { currency: "USD", value: 99.99 }
      }
    },
    {
      name: "Different event_ids (BROKEN)",
      icon: <AlertTriangle className="h-4 w-4 text-yellow-400 icon-spin-hover" />,
      description: "Pixel and CAPI send different IDs → both counted",
      brokenPayload: {
        event_name: "AddToCart",
        event_id: `pixel_${Date.now()}_${Math.random()}`, // Regenerated!
        custom_data: { currency: "USD", value: 29.99 }
      },
      fixedPayload: {
        event_name: "AddToCart",
        event_id: "cart_shared_456",
        event_time: Math.floor(Date.now() / 1000),
        custom_data: { currency: "USD", value: 29.99 }
      }
    },
    {
      name: "Order ID as event_id (BEST PRACTICE)",
      icon: <CheckCircle2 className="h-4 w-4 text-[#00ff41] icon-spin-hover" />,
      description: "Use your internal order ID → naturally unique",
      brokenPayload: {
        event_name: "Purchase",
        custom_data: { 
          currency: "USD", 
          value: 149.99,
          order_id: "ORD123" // Has order_id but not using as event_id!
        }
      },
      fixedPayload: {
        event_name: "Purchase",
        event_id: "ORD123", // Using order_id as event_id!
        event_time: Math.floor(Date.now() / 1000),
        custom_data: { 
          currency: "USD", 
          value: 149.99,
          order_id: "ORD123"
        }
      }
    },
    {
      name: "Multiple Events Same ID (TEST)",
      icon: <RefreshCw className="h-4 w-4 text-[#00d9ff] icon-spin-hover" />,
      description: "Send twice with same event_id → still counted once",
      brokenPayload: {
        event_name: "Lead",
        // No event_id - each send counts
        user_data: { em: "test_hash" }
      },
      fixedPayload: {
        event_name: "Lead",
        event_id: "lead_test_duplicate_123", // Same ID for multiple sends
        event_time: Math.floor(Date.now() / 1000),
        user_data: { em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514" }
      }
    },
    {
      name: "Delayed CAPI Send",
      icon: <Clock className="h-4 w-4 text-[#00d9ff] icon-spin-hover" />,
      description: "CAPI sends 5s after Pixel → dedup still works",
      brokenPayload: {
        event_name: "InitiateCheckout",
        custom_data: { currency: "USD", value: 79.99 }
        // No event_id - timing doesn't matter, still duplicates
      },
      fixedPayload: {
        event_name: "InitiateCheckout",
        event_id: `checkout_delayed_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        custom_data: { currency: "USD", value: 79.99 }
      }
    },
    {
      name: "Timestamp Mismatch (STILL WORKS)",
      icon: <CheckCircle2 className="h-4 w-4 text-[#00ff41] icon-spin-hover" />,
      description: "Different timestamps but same event_id → deduplicates",
      brokenPayload: {
        event_name: "ViewContent",
        event_time: Math.floor(Date.now() / 1000) - 10, // 10s ago
        // Missing event_id
        custom_data: { content_ids: ["prod_123"] }
      },
      fixedPayload: {
        event_name: "ViewContent",
        event_id: "view_timemismatch_789",
        event_time: Math.floor(Date.now() / 1000), // Now
        custom_data: { content_ids: ["prod_123"] }
      }
    },
    {
      name: "High-Value Purchase Test",
      icon: <Zap className="h-4 w-4 text-[#ff006e] icon-spin-hover" />,
      description: "Real $999 purchase → proper dedup prevents double counting",
      brokenPayload: {
        event_name: "Purchase",
        custom_data: { 
          currency: "USD", 
          value: 999.99,
          content_ids: ["premium_prod"],
          order_id: "HIGH_VALUE_001"
        }
        // No event_id = $1,999.98 counted instead of $999.99!
      },
      fixedPayload: {
        event_name: "Purchase",
        event_id: "HIGH_VALUE_001",
        event_time: Math.floor(Date.now() / 1000),
        custom_data: { 
          currency: "USD", 
          value: 999.99,
          content_ids: ["premium_prod"],
          order_id: "HIGH_VALUE_001"
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

          {/* Visual Example */}
          <div className="glass-strong rounded-xl p-6 border border-[#00d9ff]/20">
            <h4 className="font-mono font-semibold text-[#00d9ff] mb-4">Example: $100 Purchase Without event_id</h4>
            <div className="grid gap-4 md:grid-cols-3 text-center">
              <div className="glass rounded-lg p-4 border border-[#00ff41]/20">
                <p className="text-xs font-mono text-[#8b949e] mb-2">Actual Purchase</p>
                <p className="text-2xl font-bold text-[#00ff41]">$100</p>
                <p className="text-xs text-[#8b949e] mt-1">1 transaction</p>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-2xl text-red-400">→</span>
              </div>
              <div className="glass rounded-lg p-4 border border-red-500/20">
                <p className="text-xs font-mono text-[#8b949e] mb-2">Meta Sees</p>
                <p className="text-2xl font-bold text-red-400">$200</p>
                <p className="text-xs text-[#8b949e] mt-1">2 "separate" events</p>
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
                
                <div className="text-center font-mono text-sm text-red-400 bg-red-500/10 rounded p-2">
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
                
                <div className="text-center font-mono text-sm text-[#00ff41] bg-[#00ff41]/10 rounded p-2">
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

// Or use your order ID (BEST PRACTICE)
const eventId = orderId
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
})

// Send eventId to server for CAPI
await fetch('/api/track', {
  method: 'POST',
  body: JSON.stringify({ eventId, ...eventData })
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
}

// Send to Meta
await fetch(\`https://graph.facebook.com/v19.0/\${PIXEL_ID}/events\`, {
  method: 'POST',
  body: JSON.stringify(eventPayload)
})`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Testing Playground */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Interactive Deduplication Testing
        </h2>
        
        <div className="glass-strong rounded-xl p-6 border border-[#00d9ff]/20 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-[#00d9ff]" />
            <h4 className="font-mono font-semibold text-[#00d9ff]">Live Testing Mode</h4>
          </div>
          <p className="text-sm text-[#8b949e] mb-3">
            The playground below sends REAL events to Meta. Each example demonstrates a specific deduplication scenario. Toggle between Broken and Fixed modes to see the difference in real-time.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-xs text-[#8b949e]">
              <span className="text-[#00ff41] font-mono mt-0.5">›</span>
              <span>Click any event button to send to both Pixel and CAPI</span>
            </li>
            <li className="flex items-start gap-2 text-xs text-[#8b949e]">
              <span className="text-[#00ff41] font-mono mt-0.5">›</span>
              <span>View the Network Inspector to see exact payloads sent</span>
            </li>
            <li className="flex items-start gap-2 text-xs text-[#8b949e]">
              <span className="text-[#00ff41] font-mono mt-0.5">›</span>
              <span>Check Meta Events Manager to verify only 1 event appears (in Fixed mode)</span>
            </li>
            <li className="flex items-start gap-2 text-xs text-[#8b949e]">
              <span className="text-[#00ff41] font-mono mt-0.5">›</span>
              <span>Try sending the same event multiple times with Fixed mode → still counted once!</span>
            </li>
          </ul>
        </div>
        
        <EnhancedEventPlayground
          title="Deduplication Test Suite - 8 Real-World Scenarios"
          description="Each button sends REAL events to Meta. Toggle modes and watch deduplication in action."
          events={dedupExamples}
          showModeToggle={true}
          showLogs={true}
          sendToMeta={true}
          sendToBoth={true}
          showNetworkInspector={true}
          showMetaResponse={true}
          testEventCode="TEST_DEDUP"
          pixelId={process.env.NEXT_PUBLIC_FB_PIXEL_ID}
        />
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
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Use Order ID as event_id for Purchases</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Your internal order ID is perfect - it&apos;s already unique per transaction and easy to sync across platforms
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#00ff41] font-mono mt-1">✓</span>
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Generate event_id on Client, Send to Server</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Client generates UUID, sends to Pixel immediately, then passes to server for CAPI with same ID
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#00ff41] font-mono mt-1">✓</span>
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Store event_id with Transaction Data</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Save the event_id in your database alongside the order for debugging and verification
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#00ff41] font-mono mt-1">✓</span>
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Include event_time for Better Matching</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Unix timestamp helps Meta match events even if they arrive at different times (within 48 hour window)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#00ff41] font-mono mt-1">✓</span>
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Test Deduplication in Events Manager</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Send same event_id from both platforms, verify only 1 event appears in Meta Events Manager
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#00ff41] font-mono mt-1">✓</span>
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Use UUIDs for Non-Transaction Events</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  For events without natural IDs (ViewContent, AddToCart), use crypto.randomUUID() or timestamp-based IDs
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Topics */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Related Topics
        </h2>
        
        <div className="grid gap-4 md:grid-cols-2">
          <a href="/problems/missing-event-id" className="block">
            <div className="glass hover-lift rounded-xl border border-[#00ff41]/20 p-5 h-full">
              <h3 className="font-mono text-[#00ff41] font-semibold mb-2">Missing Event ID</h3>
              <p className="text-sm text-[#8b949e] mb-3">
                Deep dive into why event_id is critical and how to implement it correctly across all events
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
