"use client"

import { PageContent } from "@/components/page-content"
import { EnhancedEventPlayground } from "@/components/enhanced-event-playground"
import { AlertTriangle, CheckCircle, Copy, Clock, Hash, Link2Off, Link2, TrendingUp } from "lucide-react"

export default function DedupMisconfiguredPage() {
  // Get site URL from environment
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://meta-tracking-lab.vercel.app'
  // UUID generator helper (Meta requires UUID v4 format)
  const generateUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID()
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  const examples = [
    {
      name: "Different event_ids Pixel vs CAPI (BOTH COUNTED)",
      icon: <AlertTriangle className="h-4 w-4 text-red-400" />,
      description: "Generating separate IDs on client and server - Meta counts as 2 different events",
      brokenPayload: {
        event_name: "Purchase",
        event_id: `pixel_${Date.now()}`,  // Different ID
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c"
        },
        custom_data: {
          currency: "USD",
          value: 99.99,
          source_page: "/problems/dedup-misconfigured",
          example_name: "Different event_ids - BOTH COUNTED",
          test_mode: "broken",
          note: "Pixel & CAPI have different IDs - counted as 2 separate events"
        }
      },
      fixedPayload: null
    },
    {
      name: "Client vs Server Generated IDs (MISMATCH)",
      icon: <Link2Off className="h-4 w-4 text-red-400" />,
      description: "Timestamp generated separately on client and server with slight differences",
      brokenPayload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now() + Math.floor(Math.random() * 100)}`,  // Slightly different
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_ip_address: "192.168.1.1"
        },
        custom_data: {
          currency: "USD",
          value: 149.99,
          source_page: "/problems/dedup-misconfigured",
          example_name: "Client vs Server IDs - MISMATCH",
          test_mode: "broken",
          note: "Timestamp generated separately - slight difference breaks dedup"
        }
      },
      fixedPayload: null
    },
    {
      name: "Timestamp-Based ID with Millisecond Differences (NO DEDUP)",
      icon: <Clock className="h-4 w-4 text-yellow-400" />,
      description: "ID includes milliseconds - client and server generate at slightly different times",
      brokenPayload: {
        event_name: "Purchase",
        event_id: `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`,  // Unique each time
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_ip_address: "192.168.1.1"
        },
        custom_data: {
          currency: "USD",
          value: 79.99,
          source_page: "/problems/dedup-misconfigured",
          example_name: "Millisecond Differences - NO DEDUP",
          test_mode: "broken",
          note: "ID with milliseconds - client/server generate different times"
        }
      },
      fixedPayload: {
        event_name: "Purchase",
        event_id: `order_${Math.floor(Date.now() / 1000)}`,  // Second-precision, same on both
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_ip_address: "192.168.1.1",
          client_user_agent: "Mozilla/5.0"
        },
        custom_data: {
          currency: "USD",
          value: 79.99,
          source_page: "/problems/dedup-misconfigured",
          example_name: "Millisecond Differences - FIXED",
          test_mode: "fixed",
          note: "Second-precision timestamp - same on client & server"
        }
      }
    },
    {
      name: "event_id Sent to Pixel Only (PARTIAL TRACKING)",
      icon: <AlertTriangle className="h-4 w-4 text-yellow-400" />,
      description: "ID used in Pixel but forgotten in CAPI call - deduplication fails",
      brokenPayload: {
        event_name: "Purchase",
        // Missing event_id entirely
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_ip_address: "192.168.1.1"
        },
        custom_data: {
          currency: "USD",
          value: 199.99,
          source_page: "/problems/dedup-misconfigured",
          example_name: "Pixel Only ID - PARTIAL TRACKING",
          test_mode: "broken",
          note: "ID sent to Pixel but missing in CAPI - no deduplication"
        }
      },
      fixedPayload: {
        event_name: "Purchase",
        event_id: `order_complete_${Date.now()}`,  // Same ID sent to both
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_ip_address: "192.168.1.1",
          client_user_agent: "Mozilla/5.0"
        },
        custom_data: {
          currency: "USD",
          value: 199.99,
          source_page: "/problems/dedup-misconfigured",
          example_name: "Pixel Only ID - FIXED",
          test_mode: "fixed",
          note: "Same ID sent to both Pixel & CAPI - deduplication works"
        }
      }
    },
    {
      name: "Multiple Events Same ID (TESTING RESILIENCE)",
      icon: <Copy className="h-4 w-4 text-cyan-400" />,
      description: "Intentionally sending same event_id multiple times - Meta should deduplicate",
      brokenPayload: null,
      fixedPayload: {
        event_name: "Purchase",
        event_id: "test_duplicate_123456",  // Intentionally static
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_ip_address: "192.168.1.1",
          client_user_agent: "Mozilla/5.0"
        },
        custom_data: {
          currency: "USD",
          value: 249.99,
          source_page: "/problems/dedup-misconfigured",
          example_name: "Multiple Events Same ID - RESILIENCE TEST",
          test_mode: "fixed",
          note: "Static ID 'test_duplicate_123456' - Meta deduplicates repeated sends"
        }
      }
    },
    {
      name: "event_time Mismatch (STILL WORKS!)",
      icon: <Clock className="h-4 w-4 text-[#00ff41]" />,
      description: "Different event_time but same event_id - Meta still deduplicates correctly",
      brokenPayload: null,
      fixedPayload: {
        event_name: "Purchase",
        event_id: `order_dedup_test_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000) - 60,  // 1 minute in the past
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_ip_address: "192.168.1.1",
          client_user_agent: "Mozilla/5.0"
        },
        custom_data: {
          currency: "USD",
          value: 129.99,
          source_page: "/problems/dedup-misconfigured",
          example_name: "event_time Mismatch - STILL WORKS",
          test_mode: "fixed",
          note: "Different timestamps OK - event_id is the dedup key"
        }
      }
    },
    {
      name: "48-Hour Window Test (EXPIRES AFTER)",
      icon: <Clock className="h-4 w-4 text-yellow-400" />,
      description: "Events with same ID but >48 hours apart are counted separately",
      brokenPayload: null,
      fixedPayload: {
        event_name: "Purchase",
        event_id: "order_48h_test_123",
        event_time: Math.floor(Date.now() / 1000) - (49 * 60 * 60),  // 49 hours ago
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_ip_address: "192.168.1.1"
        },
        custom_data: {
          currency: "USD",
          value: 349.99,
          source_page: "/problems/dedup-misconfigured",
          example_name: "48-Hour Window - EXPIRES",
          test_mode: "fixed",
          note: "49 hours old - outside dedup window, counted separately"
        }
      }
    },
    {
      name: "Perfect Dedup: Same ID Both Platforms (PERFECT)",
      icon: <Link2 className="h-4 w-4 text-[#00ff41]" />,
      description: "Identical event_id sent to Pixel and CAPI - Meta counts as single event",
      brokenPayload: null,
      fixedPayload: {
        event_name: "Purchase",
        event_id: `perfect_dedup_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: typeof window !== 'undefined' ? window.location.href : SITE_URL,
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          ph: "16505551234567890abcdef0123456789abcdef0123456789abcdef012345",
          fn: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
          ln: "6b23c0d5f35d1b11f9b683f0b0a617355deb11277d91ae091d399c655b87940d",
          client_ip_address: "192.168.1.1",
          client_user_agent: "Mozilla/5.0",
          fbp: "fb.1.1705334567890.1234567890",
          fbc: "fb.1.1705334567890.IwAR1a2b3c4d5e6f7g8h9i0j"
        },
        custom_data: {
          currency: "USD",
          value: 499.99,
          content_ids: ["PROD-789"],
          content_type: "product",
          num_items: 1,
          order_id: `ORD-2026-${Math.floor(Math.random() * 10000)}`,
          source_page: "/problems/dedup-misconfigured",
          example_name: "Perfect Dedup - PERFECT",
          test_mode: "fixed",
          note: "Same event_id to Pixel & CAPI - counted as single event"
        }
      }
    }
  ]

  return (
    <PageContent
      title="Deduplication Misconfigured"
      description="Master advanced deduplication scenarios: event_id generation strategies, timing windows, and cross-platform synchronization"
      status="Stable"
    >

      {/* Understanding Deduplication */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> How Meta Deduplication Works
        </h2>

        <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6 space-y-6">
          <p className="text-[#8b949e] text-sm md:text-base leading-relaxed">
            When you send the same event to both Meta Pixel (client-side) and Conversions API (server-side), Meta automatically deduplicates them using the <code className="text-[#00ff41] bg-[#00ff41]/10 px-2 py-1 rounded">event_id</code> field. This ensures events are counted only once, giving you the reliability of CAPI with the reach of Pixel.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="glass rounded-lg border border-[#00ff41]/20 p-5 text-center">
              <div className="text-3xl font-bold text-[#00ff41] mb-2">48</div>
              <p className="text-sm text-[#8b949e]">Hours deduplication window</p>
            </div>
            <div className="glass rounded-lg border border-[#00ff41]/20 p-5 text-center">
              <div className="text-3xl font-bold text-[#00ff41] mb-2">1</div>
              <p className="text-sm text-[#8b949e]">Event counted per unique ID</p>
            </div>
            <div className="glass rounded-lg border border-[#00ff41]/20 p-5 text-center">
              <div className="text-3xl font-bold text-[#00ff41] mb-2">100%</div>
              <p className="text-sm text-[#8b949e]">Accuracy with proper setup</p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <div className="flex items-start gap-3">
              <Link2 className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-mono text-sm font-semibold text-cyan-400 mb-2">The Golden Rule</p>
                <p className="text-sm text-[#8b949e]">
                  Generate the <code className="text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">event_id</code> once on the client-side, then pass the exact same ID to both Pixel and CAPI. Never generate IDs independently on server.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dedup Process */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> The Deduplication Process
        </h2>

        <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6">
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#00ff41]/20 border-2 border-[#00ff41] flex items-center justify-center shrink-0">
                <span className="font-mono text-[#00ff41] font-bold">1</span>
              </div>
              <div className="flex-1">
                <h3 className="font-mono text-[#e8f4f8] font-semibold mb-2">Generate ID Once</h3>
                <p className="text-sm text-[#8b949e] mb-2">
                  Create event_id on client when event occurs
                </p>
                <code className="text-xs bg-[#0d1117] text-[#00ff41] px-3 py-1 rounded block overflow-x-auto">
                  const eventId = &apos;purchase_&apos; + Date.now() + &apos;_&apos; + Math.random().toString(36)
                </code>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="h-6 w-0.5 bg-[#00ff41]/30"></div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#00ff41]/20 border-2 border-[#00ff41] flex items-center justify-center shrink-0">
                <span className="font-mono text-[#00ff41] font-bold">2</span>
              </div>
              <div className="flex-1">
                <h3 className="font-mono text-[#e8f4f8] font-semibold mb-2">Send to Pixel</h3>
                <p className="text-sm text-[#8b949e] mb-2">
                  Fire Pixel event with event_id in third parameter
                </p>
                <code className="text-xs bg-[#0d1117] text-[#00ff41] px-3 py-1 rounded block overflow-x-auto">
                  fbq(&apos;track&apos;, &apos;Purchase&apos;, {`{value: 99.99}`}, {`{eventID: eventId}`})
                </code>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="h-6 w-0.5 bg-[#00ff41]/30"></div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#00ff41]/20 border-2 border-[#00ff41] flex items-center justify-center shrink-0">
                <span className="font-mono text-[#00ff41] font-bold">3</span>
              </div>
              <div className="flex-1">
                <h3 className="font-mono text-[#e8f4f8] font-semibold mb-2">Send to CAPI (Same ID)</h3>
                <p className="text-sm text-[#8b949e] mb-2">
                  Pass the exact same event_id to your server endpoint
                </p>
                <code className="text-xs bg-[#0d1117] text-[#00ff41] px-3 py-1 rounded block overflow-x-auto">
                  await fetch(&apos;/api/meta/capi&apos;, {`{body: JSON.stringify({event_id: eventId, ...})}`})
                </code>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="h-6 w-0.5 bg-[#00ff41]/30"></div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#00ff41]/20 border-2 border-[#00ff41] flex items-center justify-center shrink-0">
                <span className="font-mono text-[#00ff41] font-bold">4</span>
              </div>
              <div className="flex-1">
                <h3 className="font-mono text-[#e8f4f8] font-semibold mb-2">Meta Deduplicates</h3>
                <p className="text-sm text-[#8b949e]">
                  Meta receives both events, sees matching event_id, counts as single event. You get credit for both tracking methods with accurate count.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Common Dedup Failures */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Common Deduplication Failures
        </h2>

        <div className="grid gap-4">
          <div className="glass hover-lift rounded-xl border border-red-500/20 p-5">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0">
                <span className="font-mono text-red-400 font-bold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-mono font-semibold text-red-400 mb-2">Generating ID Twice</h3>
                <p className="text-sm text-[#8b949e] mb-3">
                  Calling <code className="text-red-400 bg-red-500/10 px-2 py-0.5 rounded">Date.now()</code> separately in client and server code creates different millisecond timestamps.
                </p>
                <div className="grid gap-2 md:grid-cols-2 text-xs">
                  <div className="bg-red-500/10 rounded p-2 border border-red-500/20">
                    <p className="text-red-400 mb-1">Client generates:</p>
                    <code className="text-[#8b949e]">purchase_1705334567890</code>
                  </div>
                  <div className="bg-red-500/10 rounded p-2 border border-red-500/20">
                    <p className="text-red-400 mb-1">Server generates:</p>
                    <code className="text-[#8b949e]">purchase_1705334567923</code>
                  </div>
                </div>
                <p className="text-xs text-red-400 mt-2">Result: Meta sees 2 different events, counts twice</p>
              </div>
            </div>
          </div>

          <div className="glass hover-lift rounded-xl border border-red-500/20 p-5">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0">
                <span className="font-mono text-red-400 font-bold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-mono font-semibold text-red-400 mb-2">Forgetting ID in One Platform</h3>
                <p className="text-sm text-[#8b949e]">
                  Including event_id in Pixel call but forgetting to pass it to CAPI endpoint, or vice versa. Without matching IDs, deduplication is impossible.
                </p>
              </div>
            </div>
          </div>

          <div className="glass hover-lift rounded-xl border border-red-500/20 p-5">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0">
                <span className="font-mono text-red-400 font-bold text-sm">3</span>
              </div>
              <div>
                <h3 className="font-mono font-semibold text-red-400 mb-2">Case Sensitivity Mismatch</h3>
                <p className="text-sm text-[#8b949e] mb-2">
                  Using different casing for event_id field name (eventId vs event_id vs EventID)
                </p>
                <div className="text-xs bg-yellow-500/10 rounded p-2 border border-yellow-500/20">
                  <code className="text-yellow-400">Always use: event_id (lowercase with underscore)</code>
                </div>
              </div>
            </div>
          </div>

          <div className="glass hover-lift rounded-xl border border-yellow-500/20 p-5">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center shrink-0">
                <span className="font-mono text-yellow-400 font-bold text-sm">4</span>
              </div>
              <div>
                <h3 className="font-mono font-semibold text-yellow-400 mb-2">Beyond 48-Hour Window</h3>
                <p className="text-sm text-[#8b949e]">
                  Sending events with same event_id but more than 48 hours apart. Meta&apos;s deduplication window expires, so both events are counted. This is expected behavior for historical event imports.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 48-Hour Window */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> The 48-Hour Deduplication Window
        </h2>

        <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6 space-y-6">
          <p className="text-[#8b949e] text-sm leading-relaxed">
            Meta deduplicates events with matching event_id only if they arrive within 48 hours of each other. This window is based on <code className="text-[#00ff41] bg-[#00ff41]/10 px-2 py-1 rounded">event_time</code>, not when Meta receives the event.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="glass rounded-lg border border-[#00ff41]/20 p-4">
              <h3 className="font-mono text-[#00ff41] font-semibold mb-3">✓ Within Window (Deduplicated)</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#8b949e]">Pixel Event:</span>
                  <code className="text-[#00ff41]">Mon 12:00pm</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8b949e]">CAPI Event:</span>
                  <code className="text-[#00ff41]">Mon 12:05pm</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8b949e]">Time Difference:</span>
                  <code className="text-[#00ff41]">5 minutes</code>
                </div>
                <p className="text-[#00ff41] pt-2 border-t border-[#00ff41]/20">
                  ✓ Counted as 1 event
                </p>
              </div>
            </div>

            <div className="glass rounded-lg border border-yellow-500/20 p-4">
              <h3 className="font-mono text-yellow-400 font-semibold mb-3">✗ Outside Window (Both Counted)</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#8b949e]">Pixel Event:</span>
                  <code className="text-yellow-400">Mon 12:00pm</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8b949e]">CAPI Event:</span>
                  <code className="text-yellow-400">Wed 1:00pm</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8b949e]">Time Difference:</span>
                  <code className="text-yellow-400">49 hours</code>
                </div>
                <p className="text-yellow-400 pt-2 border-t border-yellow-500/20">
                  ✗ Counted as 2 events
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <p className="text-sm text-cyan-400 flex items-start gap-2">
              <span className="shrink-0">💡</span>
              <span>
                <strong>Pro Tip:</strong> For real-time events, deduplication works perfectly since Pixel and CAPI fire within seconds of each other. The 48-hour window is generous for delayed CAPI sends or offline event imports.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Playground */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[400ms]">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Interactive Deduplication Examples
        </h2>

        <EnhancedEventPlayground
          title="Deduplication Testing"
          description="Test 8 different deduplication scenarios from broken to perfect. See how event_id configuration affects duplicate counting in Events Manager."
          events={examples}
          showLogs={true}
          sendToMeta={true}
          sendToBoth={true}
          showNetworkInspector={true}
          showMetaResponse={true}
          enableComparison={true}
          testEventCode="TEST_DEDUP"
          pixelId={process.env.NEXT_PUBLIC_FB_PIXEL_ID}
        />
      </section>

      {/* Verification Guide */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Verifying Deduplication Works
        </h2>

        <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6 space-y-6">
          <div>
            <h3 className="font-mono text-[#e8f4f8] font-semibold mb-3">Method 1: Test Events Tab</h3>
            <ol className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-[#00ff41] font-mono shrink-0">1.</span>
                <span className="text-sm text-[#8b949e]">
                  Go to Meta Events Manager → Your Pixel → Test Events tab
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#00ff41] font-mono shrink-0">2.</span>
                <span className="text-sm text-[#8b949e]">
                  Make a test purchase with test_event_code enabled
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#00ff41] font-mono shrink-0">3.</span>
                <span className="text-sm text-[#8b949e]">
                  Look for &quot;Deduplicated Event&quot; badge next to the event
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#00ff41] font-mono shrink-0">4.</span>
                <span className="text-sm text-[#8b949e]">
                  Click on event to see both Pixel and CAPI sources listed
                </span>
              </li>
            </ol>
          </div>

          <div>
            <h3 className="font-mono text-[#e8f4f8] font-semibold mb-3">Method 2: Network Inspector</h3>
            <p className="text-sm text-[#8b949e] mb-3">
              Use browser DevTools to verify same event_id is sent to both platforms:
            </p>
            <div className="space-y-2">
              <div className="glass rounded-lg border border-[#00ff41]/20 p-3">
                <p className="text-xs font-mono text-[#8b949e] mb-1">Pixel Request (facebook.com/tr):</p>
                <code className="text-xs text-[#00ff41] block">ev=Purchase&amp;eid=order_1705334567890</code>
              </div>
              <div className="glass rounded-lg border border-[#00ff41]/20 p-3">
                <p className="text-xs font-mono text-[#8b949e] mb-1">CAPI Request (your-api.com/capi):</p>
                <code className="text-xs text-[#00ff41] block">{`{event_id: "order_1705334567890", ...}`}</code>
              </div>
              <p className="text-xs text-[#00ff41]">✓ Same event_id confirms deduplication will work</p>
            </div>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '600ms' }}>
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Deduplication Best Practices
        </h2>

        <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-[#00ff41] shrink-0 mt-0.5" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">Generate ID once on client-side</strong> and pass to server - never generate independently
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-[#00ff41] shrink-0 mt-0.5" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">Use order/transaction ID</strong> when available - enables business reconciliation
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-[#00ff41] shrink-0 mt-0.5" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">Test with small values first</strong> - verify dedup works before scaling up
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-[#00ff41] shrink-0 mt-0.5" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">Monitor Events Manager</strong> - check for &quot;Deduplicated&quot; badges regularly
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-[#00ff41] shrink-0 mt-0.5" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">Log event_id in your database</strong> - helps with debugging and reconciliation
              </span>
            </li>
          </ul>
        </div>
      </section>

    </PageContent>
  )
}
