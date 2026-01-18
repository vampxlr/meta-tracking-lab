"use client"

import { PageContent } from "@/components/page-content"
import { EnhancedEventPlayground } from "@/components/enhanced-event-playground"
import { AlertTriangle, CheckCircle, Hash, ShoppingBag, TrendingUp, Package } from "lucide-react"

export default function MissingEventIdPage() {
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
      name: "No Event ID (BROKEN)",
      icon: <AlertTriangle className="h-4 w-4 text-red-400" />,
      description: "Event sent without any event_id - can&apos;t track or debug individual events",
      brokenPayload: {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_user_agent: "Mozilla/5.0",
          client_ip_address: "192.168.1.1"
        },
        custom_data: {
          currency: "USD",
          value: 99.99,
          // Tracking metadata
          source_page: "/problems/missing-event-id",
          example_name: "No Event ID - BROKEN",
          test_mode: "broken",
          note: "Missing event_id field entirely - can't track or deduplicate"
        }
      },
      fixedPayload: null
    },
    {
      name: "Reused Event ID (BROKEN)",
      icon: <AlertTriangle className="h-4 w-4 text-red-400" />,
      description: "Same event_id used for multiple events - can&apos;t distinguish between them",
      brokenPayload: {
        event_name: "Purchase",
        event_id: "static_id_123",
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c"
        },
        custom_data: {
          currency: "USD",
          value: 49.99,
          // Tracking metadata
          source_page: "/problems/missing-event-id",
          example_name: "Reused Event ID - BROKEN",
          test_mode: "broken",
          note: "Same static event_id 'static_id_123' reused - can't distinguish events"
        }
      },
      fixedPayload: null
    },
    {
      name: "Non-Unique Event ID (BROKEN)",
      icon: <AlertTriangle className="h-4 w-4 text-red-400" />,
      description: "Short or predictable event_id - high collision risk, deduplication fails",
      brokenPayload: {
        event_name: "Purchase",
        event_id: "123",
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c"
        },
        custom_data: {
          currency: "USD",
          value: 199.99,
          // Tracking metadata
          source_page: "/problems/missing-event-id",
          example_name: "Non-Unique Event ID - BROKEN",
          test_mode: "broken",
          note: "Short predictable ID '123' - high collision risk"
        }
      },
      fixedPayload: null
    },
    {
      name: "Poor Format Event ID (WORKS BUT SUBOPTIMAL)",
      icon: <Package className="h-4 w-4 text-yellow-400" />,
      description: "Event ID exists but lacks structure - harder to debug and trace",
      brokenPayload: {
        event_name: "Purchase",
        event_id: "abc123xyz",
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c"
        },
        custom_data: {
          currency: "USD",
          value: 149.99,
          // Tracking metadata
          source_page: "/problems/missing-event-id",
          example_name: "Poor Format Event ID - SUBOPTIMAL",
          test_mode: "broken",
          note: "Generic format 'abc123xyz' - works but hard to debug"
        }
      },
      fixedPayload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_user_agent: "Mozilla/5.0",
          client_ip_address: "192.168.1.1"
        },
        custom_data: {
          currency: "USD",
          value: 149.99,
          // Tracking metadata
          source_page: "/problems/missing-event-id",
          example_name: "Poor Format Event ID - FIXED",
          test_mode: "fixed",
          note: "Structured format: purchase_[timestamp]_[random] - unique and traceable"
        }
      }
    },
    {
      name: "High-Value Purchase Without ID (CRITICAL)",
      icon: <TrendingUp className="h-4 w-4 text-red-400" />,
      description: "High-value transaction missing event_id - can&apos;t track ROI or refunds",
      brokenPayload: {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c"
        },
        custom_data: {
          currency: "USD",
          value: 2499.99,
          content_name: "MacBook Pro",
          // Tracking metadata
          source_page: "/problems/missing-event-id",
          example_name: "High-Value Purchase Without ID - CRITICAL",
          test_mode: "broken",
          note: "No event_id on $2499 purchase - can't track ROI or refunds"
        }
      },
      fixedPayload: {
        event_name: "Purchase",
        event_id: `purchase_high_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_user_agent: "Mozilla/5.0",
          client_ip_address: "192.168.1.1"
        },
        custom_data: {
          currency: "USD",
          value: 2499.99,
          content_name: "MacBook Pro",
          // Tracking metadata
          source_page: "/problems/missing-event-id",
          example_name: "High-Value Purchase - FIXED",
          test_mode: "fixed",
          note: "Unique ID purchase_high_[timestamp]_[random] - enables ROI tracking"
        }
      }
    },
    {
      name: "Timestamp-Based ID (GOOD)",
      icon: <CheckCircle className="h-4 w-4 text-[#00ff41]" />,
      description: "Using timestamp ensures uniqueness - simple and effective approach",
      brokenPayload: null,
      fixedPayload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_user_agent: "Mozilla/5.0",
          client_ip_address: "192.168.1.1"
        },
        custom_data: {
          currency: "USD",
          value: 79.99,
          // Tracking metadata
          source_page: "/problems/missing-event-id",
          example_name: "Timestamp-Based ID - GOOD",
          test_mode: "fixed",
          note: "Simple timestamp ensures uniqueness - purchase_[timestamp]"
        }
      }
    },
    {
      name: "Order ID as Event ID (BEST PRACTICE)",
      icon: <ShoppingBag className="h-4 w-4 text-[#00ff41]" />,
      description: "Using actual order ID - enables refund tracking and business reconciliation",
      brokenPayload: null,
      fixedPayload: {
        event_name: "Purchase",
        event_id: `order_ORD-2026-${Math.floor(Math.random() * 10000)}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          ph: "16505551234567890abcdef0123456789abcdef0123456789abcdef012345",
          fn: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
          ln: "6b23c0d5f35d1b11f9b683f0b0a617355deb11277d91ae091d399c655b87940d",
          client_user_agent: "Mozilla/5.0",
          client_ip_address: "192.168.1.1"
        },
        custom_data: {
          currency: "USD",
          value: 299.99,
          order_id: `ORD-2026-${Math.floor(Math.random() * 10000)}`,
          content_ids: ["SKU-001", "SKU-045"],
          content_type: "product",
          num_items: 2,
          // Tracking metadata
          source_page: "/problems/missing-event-id",
          example_name: "Order ID as Event ID - BEST PRACTICE",
          test_mode: "fixed",
          note: "Using actual order ID - enables refund tracking & reconciliation"
        }
      }
    },
    {
      name: "Complete Event Structure (PERFECT)",
      icon: <Hash className="h-4 w-4 text-[#00ff41]" />,
      description: "Comprehensive event with structured event_id and all required fields",
      brokenPayload: null,
      fixedPayload: {
        event_name: "Purchase",
        event_id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: typeof window !== 'undefined' ? window.location.href : SITE_URL,
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          ph: "16505551234567890abcdef0123456789abcdef0123456789abcdef012345",
          fn: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
          ln: "6b23c0d5f35d1b11f9b683f0b0a617355deb11277d91ae091d399c655b87940d",
          ct: "2d5c6b8e6f4c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e",
          st: "3e6d7c9f7g5d6f4e4d6f4e4d6f4e4d6f4e4d6f4e4d6f4e4d6f4e4d6f4e4d6f",
          zp: "94043",
          country: "us",
          external_id: `user_${Math.floor(Math.random() * 100000)}`,
          client_user_agent: "Mozilla/5.0",
          client_ip_address: "192.168.1.1",
          fbp: "fb.1.1234567890123.1234567890",
          fbc: "fb.1.1234567890123.AbCdEfGhIjKlMnOpQrStUvWxYz"
        },
        custom_data: {
          currency: "USD",
          value: 549.99,
          content_ids: ["PROD-123", "PROD-456", "PROD-789"],
          content_type: "product",
          content_name: "Premium Bundle",
          num_items: 3,
          order_id: `ORD-2026-${Math.floor(Math.random() * 10000)}`,
          // Tracking metadata
          source_page: "/problems/missing-event-id",
          example_name: "Complete Event Structure - PERFECT",
          test_mode: "fixed",
          note: "Gold standard: txn_[timestamp]_[random] + comprehensive user_data + all required fields"
        }
      }
    }
  ]

  return (
    <PageContent
      title="Missing Event ID"
      description="Master event_id implementation for proper tracking, debugging, deduplication, and business reconciliation"
      status="Stable"
    >

      {/* Why Event ID Matters */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Why Event ID is Critical
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Critical Issues */}
          <div className="glass hover-glow rounded-xl border border-red-500/20 p-6">
            <div className="mb-4 flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-400" />
              <h3 className="font-mono text-lg font-semibold text-red-400">Without Event ID</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-[#8b949e] text-sm">
                <span className="mt-1 text-red-400 font-mono shrink-0">✗</span>
                <span>Cannot track individual transactions</span>
              </li>
              <li className="flex items-start gap-3 text-[#8b949e] text-sm">
                <span className="mt-1 text-red-400 font-mono shrink-0">✗</span>
                <span>Deduplication between Pixel and CAPI fails</span>
              </li>
              <li className="flex items-start gap-3 text-[#8b949e] text-sm">
                <span className="mt-1 text-red-400 font-mono shrink-0">✗</span>
                <span>Cannot process refunds or cancellations</span>
              </li>
              <li className="flex items-start gap-3 text-[#8b949e] text-sm">
                <span className="mt-1 text-red-400 font-mono shrink-0">✗</span>
                <span>Impossible to debug specific events</span>
              </li>
              <li className="flex items-start gap-3 text-[#8b949e] text-sm">
                <span className="mt-1 text-red-400 font-mono shrink-0">✗</span>
                <span>ROI attribution becomes inaccurate</span>
              </li>
            </ul>
          </div>

          {/* Benefits */}
          <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6">
            <div className="mb-4 flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-[#00ff41]" />
              <h3 className="font-mono text-lg font-semibold text-[#00ff41]">With Proper Event ID</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-[#8b949e] text-sm">
                <span className="mt-1 text-[#00ff41] font-mono shrink-0">✓</span>
                <span>Track every transaction uniquely</span>
              </li>
              <li className="flex items-start gap-3 text-[#8b949e] text-sm">
                <span className="mt-1 text-[#00ff41] font-mono shrink-0">✓</span>
                <span>Perfect deduplication across platforms</span>
              </li>
              <li className="flex items-start gap-3 text-[#8b949e] text-sm">
                <span className="mt-1 text-[#00ff41] font-mono shrink-0">✓</span>
                <span>Enable refund and cancellation events</span>
              </li>
              <li className="flex items-start gap-3 text-[#8b949e] text-sm">
                <span className="mt-1 text-[#00ff41] font-mono shrink-0">✓</span>
                <span>Easy debugging and troubleshooting</span>
              </li>
              <li className="flex items-start gap-3 text-[#8b949e] text-sm">
                <span className="mt-1 text-[#00ff41] font-mono shrink-0">✓</span>
                <span>Accurate ROAS and attribution</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Event ID Best Practices */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Event ID Best Practices
        </h2>

        <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6 space-y-6">
          {/* Uniqueness */}
          <div>
            <h3 className="font-mono text-lg font-semibold text-[#e8f4f8] mb-3">1. Ensure Uniqueness</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="glass rounded-lg border border-red-500/20 p-4">
                <p className="font-mono text-sm font-semibold text-red-400 mb-2">❌ Bad</p>
                <code className="text-xs text-red-400 block">event_id: &quot;purchase_123&quot;</code>
                <p className="text-xs text-[#8b949e] mt-2">Same ID will be reused for different purchases</p>
              </div>
              <div className="glass rounded-lg border border-[#00ff41]/20 p-4">
                <p className="font-mono text-sm font-semibold text-[#00ff41] mb-2">✓ Good</p>
                <code className="text-xs text-[#00ff41] block">event_id: &quot;purchase_1705334567890_abc123&quot;</code>
                <p className="text-xs text-[#8b949e] mt-2">Timestamp + random string ensures uniqueness</p>
              </div>
            </div>
          </div>

          {/* Structure */}
          <div>
            <h3 className="font-mono text-lg font-semibold text-[#e8f4f8] mb-3">2. Use Meaningful Structure</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="glass rounded-lg border border-yellow-500/20 p-4">
                <p className="font-mono text-sm font-semibold text-yellow-400 mb-2">⚠ Suboptimal</p>
                <code className="text-xs text-yellow-400 block">event_id: &quot;xyz789abc&quot;</code>
                <p className="text-xs text-[#8b949e] mt-2">No context or structure</p>
              </div>
              <div className="glass rounded-lg border border-[#00ff41]/20 p-4">
                <p className="font-mono text-sm font-semibold text-[#00ff41] mb-2">✓ Better</p>
                <code className="text-xs text-[#00ff41] block">event_id: &quot;txn_purchase_1705334567890&quot;</code>
                <p className="text-xs text-[#8b949e] mt-2">Event type + timestamp = easy debugging</p>
              </div>
            </div>
          </div>

          {/* Business ID */}
          <div>
            <h3 className="font-mono text-lg font-semibold text-[#e8f4f8] mb-3">3. Use Business IDs When Available</h3>
            <div className="glass rounded-lg border border-[#00ff41]/20 p-4">
              <p className="font-mono text-sm font-semibold text-[#00ff41] mb-2">🏆 Best Practice</p>
              <code className="text-xs text-[#00ff41] block mb-2">event_id: order.id // &quot;ORD-2026-12345&quot;</code>
              <code className="text-xs text-[#00ff41] block">custom_data.order_id: order.id</code>
              <p className="text-xs text-[#8b949e] mt-2">Using actual order ID enables business reconciliation, refund tracking, and customer support queries</p>
            </div>
          </div>

          {/* Consistency */}
          <div>
            <h3 className="font-mono text-lg font-semibold text-[#e8f4f8] mb-3">4. Maintain Consistency Across Platforms</h3>
            <div className="space-y-2">
              <div className="glass rounded-lg border border-[#00ff41]/20 p-4">
                <p className="font-mono text-sm font-semibold text-[#00ff41] mb-2">Critical Rule</p>
                <p className="text-sm text-[#8b949e]">
                  The same event_id must be used for both Pixel and CAPI to enable deduplication. Generate it on the client and pass it to your server.
                </p>
              </div>
              <pre className="relative overflow-x-auto rounded-lg border border-[#00ff41]/20 bg-[#0d1117] p-4 font-mono text-xs">
                <code className="text-[#00ff41]">{`// Client-side (JavaScript)
const eventId = 'purchase_' + Date.now() + '_' + Math.random().toString(36);
fbq('track', 'Purchase', {...}, {eventID: eventId});
await fetch('/api/meta/capi', {
  body: JSON.stringify({event_id: eventId, ...})
});`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Common Mistakes */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Common Mistakes to Avoid
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="glass hover-lift rounded-xl border border-red-500/20 p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-red-400 font-mono text-lg">1</span>
              <h3 className="font-mono font-semibold text-red-400">Missing Completely</h3>
            </div>
            <p className="text-sm text-[#8b949e]">
              Forgetting to include event_id field at all - breaks deduplication and tracking
            </p>
          </div>

          <div className="glass hover-lift rounded-xl border border-red-500/20 p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-red-400 font-mono text-lg">2</span>
              <h3 className="font-mono font-semibold text-red-400">Static ID Reuse</h3>
            </div>
            <p className="text-sm text-[#8b949e]">
              Using the same event_id for multiple events - Meta sees only one event
            </p>
          </div>

          <div className="glass hover-lift rounded-xl border border-red-500/20 p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-red-400 font-mono text-lg">3</span>
              <h3 className="font-mono font-semibold text-red-400">Different IDs for Pixel/CAPI</h3>
            </div>
            <p className="text-sm text-[#8b949e]">
              Generating separate IDs for client and server - prevents deduplication
            </p>
          </div>

          <div className="glass hover-lift rounded-xl border border-red-500/20 p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-red-400 font-mono text-lg">4</span>
              <h3 className="font-mono font-semibold text-red-400">Too Short IDs</h3>
            </div>
            <p className="text-sm text-[#8b949e]">
              Using simple numbers like &quot;123&quot; - high collision risk across users
            </p>
          </div>
        </div>
      </section>

      {/* Impact on Business */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Business Impact
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="glass hover-glow rounded-xl border border-red-500/20 p-6">
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-red-400 mb-2">$0</div>
              <p className="text-sm text-[#8b949e]">Refunds processed without event_id</p>
            </div>
            <p className="text-xs text-[#8b949e] text-center">
              Cannot match refund to original purchase event
            </p>
          </div>

          <div className="glass hover-glow rounded-xl border border-yellow-500/20 p-6">
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-yellow-400 mb-2">2x</div>
              <p className="text-sm text-[#8b949e]">Revenue reported without dedup</p>
            </div>
            <p className="text-xs text-[#8b949e] text-center">
              Both Pixel and CAPI count same purchase
            </p>
          </div>

          <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6">
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-[#00ff41] mb-2">100%</div>
              <p className="text-sm text-[#8b949e]">Accurate tracking with proper event_id</p>
            </div>
            <p className="text-xs text-[#8b949e] text-center">
              Perfect deduplication and attribution
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Playground */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[400ms]">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Interactive Examples
        </h2>

        <EnhancedEventPlayground
          title="Event ID Implementation Testing"
          description="Test 8 different event_id scenarios - from completely missing to best practice implementations. Watch how Meta processes each one."
          events={examples}
          showLogs={true}
          sendToMeta={true}
          sendToBoth={true}
          showNetworkInspector={true}
          showMetaResponse={true}
          enableComparison={true}
          testEventCode="TEST_EVENT_ID"
          pixelId={process.env.NEXT_PUBLIC_FB_PIXEL_ID}
        />
      </section>

      {/* Implementation Guide */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Quick Implementation Guide
        </h2>

        <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 flex items-center justify-center shrink-0">
              <span className="font-mono text-[#00ff41] font-bold text-sm">1</span>
            </div>
            <div>
              <h3 className="font-mono text-[#e8f4f8] font-semibold mb-2">Generate Unique ID</h3>
              <pre className="overflow-x-auto rounded-lg border border-[#00ff41]/20 bg-[#0d1117] p-3 font-mono text-xs">
                <code className="text-[#00ff41]">{`const eventId = 'purchase_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);`}</code>
              </pre>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 flex items-center justify-center shrink-0">
              <span className="font-mono text-[#00ff41] font-bold text-sm">2</span>
            </div>
            <div>
              <h3 className="font-mono text-[#e8f4f8] font-semibold mb-2">Send to Pixel</h3>
              <pre className="overflow-x-auto rounded-lg border border-[#00ff41]/20 bg-[#0d1117] p-3 font-mono text-xs">
                <code className="text-[#00ff41]">{`fbq('track', 'Purchase', {value: 99.99, currency: 'USD'}, {eventID: eventId});`}</code>
              </pre>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 flex items-center justify-center shrink-0">
              <span className="font-mono text-[#00ff41] font-bold text-sm">3</span>
            </div>
            <div>
              <h3 className="font-mono text-[#e8f4f8] font-semibold mb-2">Send to CAPI (with same ID)</h3>
              <pre className="overflow-x-auto rounded-lg border border-[#00ff41]/20 bg-[#0d1117] p-3 font-mono text-xs">
                <code className="text-[#00ff41]">{`await fetch('/api/meta/capi', {
  method: 'POST',
  body: JSON.stringify({event_id: eventId, event_name: 'Purchase', ...})
});`}</code>
              </pre>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 flex items-center justify-center shrink-0">
              <span className="font-mono text-[#00ff41] font-bold text-sm">4</span>
            </div>
            <div>
              <h3 className="font-mono text-[#e8f4f8] font-semibold mb-2">Verify in Events Manager</h3>
              <p className="text-sm text-[#8b949e]">
                Check that only ONE event appears in Meta Events Manager, confirming deduplication worked correctly
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testing Checklist */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '600ms' }}>
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Testing Checklist
        </h2>

        <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 accent-[#00ff41]" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">Verify event_id is included</strong> in all Purchase, AddToCart, and InitiateCheckout events
              </span>
            </li>
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 accent-[#00ff41]" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">Confirm IDs are unique</strong> across different events (no reuse)
              </span>
            </li>
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 accent-[#00ff41]" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">Test deduplication</strong> by sending same event_id to both Pixel and CAPI
              </span>
            </li>
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 accent-[#00ff41]" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">Verify business logic</strong> - can you find specific transactions by event_id?
              </span>
            </li>
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 accent-[#00ff41]" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">Check Events Manager</strong> - only one event appears when sent to both platforms
              </span>
            </li>
          </ul>
        </div>
      </section>

    </PageContent>
  )
}
