"use client"

import { PageContent } from "@/components/page-content"
import { EnhancedEventPlayground } from "@/components/enhanced-event-playground"
import { Layers, Copy, CheckCircle2, CheckCircle, XCircle, AlertTriangle, RefreshCw, Clock, Zap } from "lucide-react"

export default function DuplicateEventsPage() {
  // Get site URL from environment
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://meta-tracking-lab.vercel.app'

  // UUID generator helper
  const generateUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID()
    }
    // Fallback for older browsers
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  // 8 comprehensive examples - each demonstrates ONE specific scenario
  const dedupExamples = [
    {
      name: "No event_id (BROKEN)",
      icon: <XCircle className="h-4 w-4 text-red-400 icon-spin-hover" />,
      description: "Sends to both Pixel & CAPI without event_id → counted twice",
      payload: {
        event_name: "Purchase",
        // PROBLEM: No event_id = duplicate counting!
        custom_data: {
          currency: "USD",
          value: 99.99,
          order_id: "order_001",
          source_page: "/problems/duplicate-events",
          example_name: "No event_id - BROKEN",
          note: "No event_id - counted twice (Pixel + CAPI)"
        }
      }
    },
    {
      name: "Same event_id (FIXED)",
      icon: <CheckCircle2 className="h-4 w-4 text-[#00ff41] icon-spin-hover" />,
      description: "Both platforms use same event_id → deduplication works",
      payload: {
        event_name: "Purchase",
        event_id: "550e8400-e29b-41d4-a716-446655440000", // Static UUID - same on both!
        event_time: Math.floor(Date.now() / 1000),
        custom_data: {
          currency: "USD",
          value: 99.99,
          source_page: "/problems/duplicate-events",
          example_name: "Same event_id - FIXED",
          note: "Static UUID '550e8400...' - deduplication works"
        }
      }
    },
    {
      name: "Different event_ids (BROKEN)",
      icon: <AlertTriangle className="h-4 w-4 text-yellow-400 icon-spin-hover" />,
      description: "Pixel and CAPI send different IDs → both counted",
      payload: {
        event_name: "AddToCart",
        // NO event_id here - let component generate different ones for Pixel & CAPI!
        custom_data: {
          currency: "USD",
          value: 29.99,
          source_page: "/problems/duplicate-events",
          example_name: "Different event_ids - BROKEN",
          note: "Component generates separate UUIDs for Pixel & CAPI - counted twice",
          _force_different_ids: true  // Flag to force different IDs
        }
      }
    },
    {
      name: "Order ID as event_id (BEST PRACTICE)",
      icon: <CheckCircle2 className="h-4 w-4 text-[#00ff41] icon-spin-hover" />,
      description: "Use your internal order ID → naturally unique",
      payload: {
        event_name: "Purchase",
        event_id: "550e8400-e29b-41d4-a716-446655440123", // Order UUID used as event_id!
        event_time: Math.floor(Date.now() / 1000),
        custom_data: {
          currency: "USD",
          value: 149.99,
          order_id: "550e8400-e29b-41d4-a716-446655440123",  // Same UUID in order_id
          source_page: "/problems/duplicate-events",
          example_name: "Order ID as event_id - BEST PRACTICE",
          note: "event_id matches order_id UUID - natural deduplication"
        }
      }
    },
    {
      name: "Multiple Events Same ID (TEST)",
      icon: <RefreshCw className="h-4 w-4 text-[#00d9ff] icon-spin-hover" />,
      description: "Send twice with same event_id → still counted once",
      payload: {
        event_name: "CompleteRegistration",
        event_id: "7c9e6679-7425-40de-944b-e07fc1f90ae7", // Static UUID for multiple sends
        event_time: Math.floor(Date.now() / 1000),
        user_data: { em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514" },
        custom_data: {
          source_page: "/problems/duplicate-events",
          example_name: "Multiple Sends Same ID - RESILIENT",
          note: "Static UUID - click multiple times, still counted once!"
        }
      }
    },
    {
      name: "Delayed CAPI Send (WORKS)",
      icon: <Clock className="h-4 w-4 text-[#00d9ff] icon-spin-hover" />,
      description: "CAPI sends 2s after Pixel → dedup still works",
      payload: {
        event_name: "InitiateCheckout",
        event_id: "f1e2d3c4-b5a6-4978-8abc-def123456789",  // Static UUID
        event_time: Math.floor(Date.now() / 1000),
        custom_data: {
          currency: "USD",
          value: 79.99,
          source_page: "/problems/duplicate-events",
          example_name: "Delayed CAPI Send - WORKS",
          note: "Static UUID - dedup works even with 2s delay",
          _delay_capi: 2000  // Flag to delay CAPI by 2 seconds
        }
      }
    },
    {
      name: "Timestamp Mismatch (STILL WORKS)",
      icon: <CheckCircle2 className="h-4 w-4 text-[#00ff41] icon-spin-hover" />,
      description: "Different timestamps but same event_id → deduplicates",
      payload: {
        event_name: "ViewContent",
        event_id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",  // Static UUID
        event_time: Math.floor(Date.now() / 1000) - 300, // 5 minutes ago for CAPI
        custom_data: {
          content_ids: ["prod_123"],
          source_page: "/problems/duplicate-events",
          example_name: "Timestamp Mismatch - STILL WORKS",
          note: "Same UUID - CAPI timestamp is 5min older, still deduplicates",
          _different_timestamp: true  // Flag to show timestamp difference
        }
      }
    },
    {
      name: "High-Value Purchase (FIXED)",
      icon: <Zap className="h-4 w-4 text-[#00ff41] icon-spin-hover" />,
      description: "Real $999 purchase → proper dedup prevents double counting",
      payload: {
        event_name: "Purchase",
        event_id: "a1b2c3d4-5678-4e9f-a0b1-c2d3e4f56789",  // Valid UUID (fixed invalid hex)
        event_time: Math.floor(Date.now() / 1000),
        custom_data: {
          currency: "USD",
          value: 999.99,
          content_ids: ["premium_prod"],
          order_id: "HIGH_VALUE_001",
          source_page: "/problems/duplicate-events",
          example_name: "High-Value $999 - FIXED",
          note: "Valid UUID event_id - counted correctly as $999.99"
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
                <p className="text-xs text-[#8b949e] mt-1">2 &quot;separate&quot; events</p>
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

      {/* CRITICAL: UUID Requirements */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-red-400 border-l-4 border-red-400 pl-4">
          <span className="inline-block animate-pulse">⚠</span> CRITICAL: event_id MUST Be Valid UUID Format
        </h2>

        <div className="glass-strong rounded-xl p-6 border border-red-500/30 bg-red-500/5">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-mono text-lg font-bold text-red-400 mb-2">Meta Requires UUID v4 Format</h3>
              <p className="text-sm text-[#8b949e] mb-4">
                As of 2024, Meta&apos;s Conversions API <span className="text-red-400 font-mono">REQUIRES</span> event_id to be in UUID format. Simple strings like <code className="text-red-400 bg-[#0d1117] px-2 py-1 rounded">&quot;purchase_123&quot;</code> or <code className="text-red-400 bg-[#0d1117] px-2 py-1 rounded">&quot;order_1705334400&quot;</code> will be <span className="text-red-400 font-bold">REJECTED with 400 error</span>.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-[#0d1117] rounded-lg p-4 border border-red-500/30">
              <p className="text-xs font-mono text-red-400 mb-2">❌ INVALID (Returns 400 Error):</p>
              <pre className="text-xs font-mono text-red-400">
                {`"purchase_1705334400"
"order_123"
"evt_12345"
"lead_abc"`}
              </pre>
              <p className="text-xs text-[#8b949e] mt-2">
                Meta Error: <code className="text-red-400">&quot;Invalid UUID&quot;</code>
              </p>
            </div>

            <div className="bg-[#0d1117] rounded-lg p-4 border border-[#00ff41]/30">
              <p className="text-xs font-mono text-[#00ff41] mb-2">✓ VALID (UUID v4 Format):</p>
              <pre className="text-xs font-mono text-[#00ff41]">
                {`"550e8400-e29b-41d4-a716-446655440000"
"7c9e6679-7425-40de-944b-e07fc1f90ae7"
"a1b2c3d4-5678-4e9f-a0b1-c2d3e4f5g6h7"
"9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"`}
              </pre>
              <p className="text-xs text-[#00ff41] mt-2">
                Format: <code className="text-[#00ff41]">xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx</code>
              </p>
            </div>
          </div>

          <div className="mt-4 bg-[#00ff41]/10 rounded-lg p-4 border border-[#00ff41]/30">
            <p className="font-mono font-semibold text-[#00ff41] mb-2">✓ Generate Valid UUIDs:</p>
            <pre className="text-xs font-mono text-[#8b949e]">
              {`// Browser (modern)
const eventId = crypto.randomUUID()

// Browser (fallback)
const eventId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = Math.random() * 16 | 0
  const v = c === 'x' ? r : (r & 0x3 | 0x8)
  return v.toString(16)
})`}
            </pre>
          </div>
        </div>
      </section>

      {/* Real-World Implementation */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-175">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> How Deduplication Works in Production
        </h2>

        <div className="space-y-6">
          <p className="leading-relaxed text-[#8b949e] text-sm md:text-base">
            The key challenge: <span className="text-[#00ff41] font-mono">How does your server know what event_id the client sent to Pixel?</span> The answer determines your entire deduplication strategy.
          </p>

          {/* Pattern Comparison */}
          <div className="glass-strong rounded-xl p-6 border border-[#00d9ff]/20">
            <h3 className="font-mono text-lg font-bold text-[#00d9ff] mb-4">3 Production Patterns</h3>

            <div className="space-y-6">
              {/* Pattern 1 */}
              <div className="glass hover-border-glow rounded-lg p-5 border border-[#00ff41]/20">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-[#00ff41]" />
                  <h4 className="font-mono font-semibold text-[#00ff41]">Pattern 1: Client Generates → Server Receives (MOST COMMON)</h4>
                </div>

                <div className="bg-[#0d1117] rounded-lg p-4 border border-[#00ff41]/20">
                  <pre className="text-xs font-mono text-[#8b949e] overflow-x-auto">
                    {`// CLIENT SIDE (Browser)
const eventId = crypto.randomUUID()  // Generate ONCE
// e.g., "550e8400-e29b-41d4-a716-446655440000"

// 1. Send to Pixel immediately
fbq('track', 'Purchase', {
  currency: 'USD',
  value: 99.99
}, { 
  eventID: eventId  // Use generated UUID
})

// 2. Send SAME ID to your server
await fetch('/api/track', {
  method: 'POST',
  body: JSON.stringify({
    eventId: eventId,  // ← Pass the SAME UUID
    eventName: 'Purchase',
    currency: 'USD',
    value: 99.99
  })
})

// SERVER SIDE (Your API Route)
export async function POST(request) {
  const { eventId, ...data } = await request.json()
  
  // 3. Forward to CAPI with the SAME eventId from client
  await sendToCAPI({
    event_id: eventId,  // ← Same UUID client sent
    event_name: data.eventName,
    event_time: Math.floor(Date.now() / 1000),
    custom_data: {
      currency: data.currency,
      value: data.value
    }
  })
  
  return Response.json({ success: true })
}

// RESULT: Both Pixel & CAPI use "550e8400..." → Deduplicated! ✓`}
                  </pre>
                </div>
                <p className="text-xs text-[#8b949e] mt-3">
                  <span className="text-[#00ff41] font-bold">Best for:</span> Real-time events (AddToCart, ViewContent, InitiateCheckout)
                </p>
              </div>

              {/* Pattern 2 */}
              <div className="glass hover-border-glow rounded-lg p-5 border border-[#00ff41]/20">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-[#00ff41]" />
                  <h4 className="font-mono font-semibold text-[#00ff41]">Pattern 2: Use Existing Order ID (BEST FOR E-COMMERCE)</h4>
                </div>

                <div className="bg-[#0d1117] rounded-lg p-4 border border-[#00ff41]/20">
                  <pre className="text-xs font-mono text-[#8b949e] overflow-x-auto">
                    {`// When checkout completes, you already have an order UUID
const orderId = order.id  
// e.g., "order_7c9e6679-7425-40de-944b-e07fc1f90ae7"

// CLIENT: Use order ID as event_id
fbq('track', 'Purchase', {
  currency: 'USD',
  value: order.total
}, { 
  eventID: orderId  // Your existing order UUID
})

// Send to server with order ID
await fetch('/api/orders/complete', {
  method: 'POST',
  body: JSON.stringify({ orderId })
})

// SERVER: Use SAME order ID
export async function POST(request) {
  const { orderId } = await request.json()
  const order = await db.orders.findById(orderId)
  
  await sendToCAPI({
    event_id: orderId,  // ← Same order UUID
    event_name: 'Purchase',
    custom_data: {
      currency: order.currency,
      value: order.total,
      order_id: orderId  // Also in custom_data
    }
  })
}

// RESULT: Both use order UUID → Deduplicated! ✓`}
                  </pre>
                </div>
                <p className="text-xs text-[#8b949e] mt-3">
                  <span className="text-[#00ff41] font-bold">Best for:</span> Purchases, Subscriptions (events with natural IDs)
                </p>
              </div>

              {/* Pattern 3 */}
              <div className="glass hover-border-glow rounded-lg p-5 border border-[#00ff41]/20">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-[#00ff41]" />
                  <h4 className="font-mono font-semibold text-[#00ff41]">Pattern 3: Server-First (FOR BACKEND EVENTS)</h4>
                </div>

                <div className="bg-[#0d1117] rounded-lg p-4 border border-[#00ff41]/20">
                  <pre className="text-xs font-mono text-[#8b949e] overflow-x-auto">
                    {`// SERVER generates event (e.g., subscription renewal, webhook)
const eventId = crypto.randomUUID()

// Send to CAPI first
await sendToCAPI({
  event_id: eventId,
  event_name: 'Subscribe',
  custom_data: {
    subscription_id: sub.id,
    value: 29.99
  }
})

// IF you also track client-side later, pass ID to client
return res.json({ 
  success: true,
  eventId: eventId  // Client can use this if needed
})

// CLIENT (optional): Use server's ID
const { eventId } = await response.json()
fbq('track', 'Subscribe', {...}, { eventID: eventId })`}
                  </pre>
                </div>
                <p className="text-xs text-[#8b949e] mt-3">
                  <span className="text-[#00ff41] font-bold">Best for:</span> Server-side events (renewals, webhooks, cron jobs)
                </p>
              </div>
            </div>
          </div>

          {/* Common Mistake */}
          <div className="glass-strong rounded-xl p-6 border border-red-500/30 bg-red-500/5">
            <div className="flex items-start gap-3 mb-4">
              <XCircle className="h-6 w-6 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-mono text-lg font-bold text-red-400 mb-2">❌ Common Mistake: Generating Separately</h3>
                <p className="text-sm text-[#8b949e]">
                  Never generate event_id separately on client and server - timing differences guarantee failure!
                </p>
              </div>
            </div>

            <div className="bg-[#0d1117] rounded-lg p-4 border border-red-500/30">
              <pre className="text-xs font-mono text-red-400">
                {`// CLIENT
const eventId = \`event_\${Date.now()}\`  // "event_1768567985422"
fbq('track', 'Purchase', {...}, { eventID: eventId })

// SERVER (runs 50ms later)
const eventId = \`event_\${Date.now()}\`  // "event_1768567985472" ← DIFFERENT!
sendToCAPI({ event_id: eventId })

// RESULT: Different IDs → Counted twice! ✗`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Guide */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Step-by-Step Implementation
        </h2>

        <div className="space-y-6">
          {/* Step 1: Generate Event ID */}
          <div className="glass-strong hover-border-glow rounded-xl p-6 border border-[#00ff41]/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 flex items-center justify-center">
                <span className="font-mono text-[#00ff41] font-bold">1</span>
              </div>
              <h3 className="font-mono text-lg font-semibold text-[#e8f4f8]">Generate a Valid UUID</h3>
            </div>

            <p className="text-sm text-[#8b949e] mb-4">
              <span className="text-red-400 font-bold">IMPORTANT:</span> Meta requires UUID v4 format. Use <code className="text-[#00ff41] bg-[#0d1117] px-2 py-1 rounded">crypto.randomUUID()</code> or ensure your order IDs are UUIDs.
            </p>

            <div className="bg-[#0d1117] rounded-lg p-4 border border-[#00ff41]/20">
              <p className="text-xs font-mono text-[#00ff41] mb-2">JavaScript (Client-Side):</p>
              <pre className="text-xs font-mono text-[#8b949e] overflow-x-auto">
                {`// ✓ CORRECT: Generate UUID v4
const eventId = crypto.randomUUID()
// Result: "550e8400-e29b-41d4-a716-446655440000"

// ✓ CORRECT: Use UUID from your order system
const eventId = order.uuid  // If your orders use UUIDs
// Result: "7c9e6679-7425-40de-944b-e07fc1f90ae7"

// ❌ WRONG: Simple string (Meta rejects this!)
const eventId = \`purchase_\${Date.now()}\`
// Result: "purchase_1705334400" → 400 Error!`}
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

      {/* Checklist for Successful Deduplication */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[250ms]">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Checklist: Ensuring Deduplication Works
        </h2>

        <div className="glass-strong hover-glow rounded-xl border border-[#00ff41]/30 p-6">
          <div className="space-y-4">
            <p className="text-[#8b949e] text-sm mb-4">
              To guarantee that Meta correctly ignores the duplicate event, <span className="text-[#00ff41] font-bold">ALL</span> of the following must be true:
            </p>

            {/* Application Layer Checklist */}
            <div className="space-y-3">
              <h3 className="font-mono text-[#e8f4f8] font-semibold text-sm uppercase tracking-wider border-b border-[#00ff41]/20 pb-2 mb-3">
                1. Application Layer (Must Match)
              </h3>

              <div className="flex items-start gap-3">
                <div className="mt-1 bg-[#00ff41]/20 p-1 rounded-full">
                  <CheckCircle className="h-3 w-3 text-[#00ff41]" />
                </div>
                <div>
                  <p className="font-mono text-sm font-bold text-[#e8f4f8]">Same event_id</p>
                  <p className="text-xs text-[#8b949e]">Both Pixel and CAPI events must have the exact same string for <code>event_id</code>.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 bg-[#00ff41]/20 p-1 rounded-full">
                  <CheckCircle className="h-3 w-3 text-[#00ff41]" />
                </div>
                <div>
                  <p className="font-mono text-sm font-bold text-[#e8f4f8]">Same event_name</p>
                  <p className="text-xs text-[#8b949e]">The names must match exactly (e.g. &quot;Purchase&quot; vs &quot;Purchase&quot;). &quot;High-Value Purchase&quot; vs &quot;Purchase&quot; will <strong>fail</strong> dedup.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 bg-[#00ff41]/20 p-1 rounded-full">
                  <CheckCircle className="h-3 w-3 text-[#00ff41]" />
                </div>
                <div>
                  <p className="font-mono text-sm font-bold text-[#e8f4f8]">Same event_source_url</p>
                  <p className="text-xs text-[#8b949e]">The URL where the event happened must match. Pixel sends this automatically; CAPI must include <code>event_source_url</code> with the exact same value.</p>
                </div>
              </div>
            </div>

            {/* Timing Layer Checklist */}
            <div className="space-y-3 mt-6">
              <h3 className="font-mono text-[#e8f4f8] font-semibold text-sm uppercase tracking-wider border-b border-[#00ff41]/20 pb-2 mb-3">
                2. Timing (48-Hour Window)
              </h3>

              <div className="flex items-start gap-3">
                <div className="mt-1 bg-[#00ff41]/20 p-1 rounded-full">
                  <CheckCircle className="h-3 w-3 text-[#00ff41]" />
                </div>
                <div>
                  <p className="font-mono text-sm font-bold text-[#e8f4f8]">Sent within 48 Hours</p>
                  <p className="text-xs text-[#8b949e]">The CAPI event must be received by Meta within 48 hours of the Pixel event (based on <code>event_time</code>).</p>
                </div>
              </div>
            </div>

            {/* User Identity Layer Checklist */}
            <div className="space-y-3 mt-6">
              <h3 className="font-mono text-[#e8f4f8] font-semibold text-sm uppercase tracking-wider border-b border-[#00ff41]/20 pb-2 mb-3">
                3. User Identity (Must Overlap)
              </h3>

              <div className="flex items-start gap-3">
                <div className="mt-1 bg-[#00ff41]/20 p-1 rounded-full">
                  <CheckCircle className="h-3 w-3 text-[#00ff41]" />
                </div>
                <div>
                  <p className="font-mono text-sm font-bold text-[#e8f4f8]">Browser Identifiers Included</p>
                  <p className="text-xs text-[#8b949e]">CAPI payload should include <code>fbp</code> (Browser ID) and <code>fbc</code> (Click ID) if available.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 bg-[#00ff41]/20 p-1 rounded-full">
                  <CheckCircle className="h-3 w-3 text-[#00ff41]" />
                </div>
                <div>
                  <p className="font-mono text-sm font-bold text-[#e8f4f8]">Consistent User Data</p>
                  <p className="text-xs text-[#8b949e]">Ensure <code>client_user_agent</code> and other keys like email/phone (hashed) match so Meta sees it as the same user.</p>
                </div>
              </div>
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
            The playground below sends REAL events to Meta. Each button demonstrates exactly what its name describes - no mode switching needed.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-xs text-[#8b949e]">
              <span className="text-[#00ff41] font-mono mt-0.5">›</span>
              <span>Each scenario is self-contained - click to test that specific behavior</span>
            </li>
            <li className="flex items-start gap-2 text-xs text-[#8b949e]">
              <span className="text-[#00ff41] font-mono mt-0.5">›</span>
              <span>View Network Inspector to see exact payloads sent to Pixel and CAPI</span>
            </li>
            <li className="flex items-start gap-2 text-xs text-[#8b949e]">
              <span className="text-[#00ff41] font-mono mt-0.5">›</span>
              <span>BROKEN scenarios show the problem, FIXED/WORKS scenarios show the solution</span>
            </li>
            <li className="flex items-start gap-2 text-xs text-[#8b949e]">
              <span className="text-[#00ff41] font-mono mt-0.5">›</span>
              <span>Try &quot;Multiple Events Same ID&quot; multiple times → still counted once!</span>
            </li>
          </ul>
        </div>

        <EnhancedEventPlayground
          title="Test Events - 8 Real-World Scenarios"
          description="Each button demonstrates exactly what its name says. Click to send REAL events to Meta and see the results."
          events={dedupExamples}
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

    </PageContent >
  )
}
