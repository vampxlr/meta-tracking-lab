"use client"

import { PageContent } from "@/components/page-content"
import { EnhancedEventPlayground } from "@/components/enhanced-event-playground"
import { Bug, TestTube, Search, CheckCircle, AlertCircle, Chrome, Network, Activity } from "lucide-react"

export default function TestingDebuggingPage() {
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
      name: "Using test_event_code (SAFE TESTING)",
      icon: <TestTube className="h-4 w-4 text-[#00ff41]" />,
      description: "Events with test_event_code appear in Test Events tab only - won&apos;t affect real campaign data",
      brokenPayload: null,
      fixedPayload: {
        event_name: "Purchase",
        event_id: `test_purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        test_event_code: "TEST_CODE_12345",  // Visible in Test Events tab
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_ip_address: "192.168.1.1",
          client_user_agent: "Mozilla/5.0"
        },
        custom_data: {
          currency: "USD",
          value: 99.99,
          source_page: "/problems/testing-debugging",
          example_name: "test_event_code - SAFE TESTING",
          test_mode: "fixed",
          note: "TEST_CODE_12345 - appears in Test Events tab only"
        }
      }
    },
    {
      name: "Meta Pixel Helper Detection",
      icon: <Chrome className="h-4 w-4 text-[#00ff41]" />,
      description: "Browser extension shows real-time Pixel events with full payload inspection",
      brokenPayload: null,
      fixedPayload: {
        event_name: "ViewContent",
        event_id: `view_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_ip_address: "192.168.1.1"
        },
        custom_data: {
          content_ids: ["PROD-123"],
          content_type: "product",
          currency: "USD",
          value: 49.99,
          source_page: "/problems/testing-debugging",
          example_name: "Meta Pixel Helper - DETECTION",
          test_mode: "fixed",
          note: "Browser extension shows real-time Pixel events"
        }
      }
    },
    {
      name: "DevTools Network Inspection",
      icon: <Network className="h-4 w-4 text-[#00ff41]" />,
      description: "Browser Network tab shows exact requests to facebook.com/tr and your CAPI endpoint",
      brokenPayload: null,
      fixedPayload: {
        event_name: "AddToCart",
        event_id: `cart_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_ip_address: "192.168.1.1",
          client_user_agent: "Mozilla/5.0"
        },
        custom_data: {
          content_ids: ["PROD-456"],
          currency: "USD",
          value: 79.99,
          source_page: "/problems/testing-debugging",
          example_name: "DevTools Network - INSPECTION",
          test_mode: "fixed",
          note: "Network tab shows requests to facebook.com/tr"
        }
      }
    },
    {
      name: "Test Events Tab Visibility",
      icon: <Search className="h-4 w-4 text-[#00ff41]" />,
      description: "Events appear in Test Events within 1-2 minutes with full diagnostics",
      brokenPayload: null,
      fixedPayload: {
        event_name: "InitiateCheckout",
        event_id: `checkout_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        test_event_code: "TEST_CHECKOUT",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          ph: "16505551234567890abcdef0123456789abcdef0123456789abcdef012345",
          client_ip_address: "192.168.1.1"
        },
        custom_data: {
          currency: "USD",
          value: 149.99,
          num_items: 2,
          source_page: "/problems/testing-debugging",
          example_name: "Test Events Tab - VISIBILITY",
          test_mode: "fixed",
          note: "TEST_CHECKOUT - appears in Test Events within 1-2 min"
        }
      }
    },
    {
      name: "CAPI Error Response Interpretation",
      icon: <AlertCircle className="h-4 w-4 text-yellow-400" />,
      description: "Meta returns detailed error codes for malformed CAPI events",
      brokenPayload: {
        event_name: "Purchase",
        // Missing required fields to trigger error
        action_source: "website",
        user_data: {},
        custom_data: {
          source_page: "/problems/testing-debugging",
          example_name: "CAPI Error Response - BROKEN",
          test_mode: "broken",
          note: "Missing required fields - Meta returns detailed error codes"
        }
      },
      fixedPayload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_ip_address: "192.168.1.1"
        },
        custom_data: {
          currency: "USD",
          value: 199.99,
          source_page: "/problems/testing-debugging",
          example_name: "CAPI Error Response - FIXED",
          test_mode: "fixed",
          note: "All required fields included - successful response"
        }
      }
    },
    {
      name: "Match Quality Score Analysis",
      icon: <Activity className="h-4 w-4 text-[#00ff41]" />,
      description: "Events Manager shows match quality score based on PII provided",
      brokenPayload: {
        event_name: "Purchase",
        event_id: `purchase_lowmatch_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c"
          // Only email - low match quality
        },
        custom_data: {
          currency: "USD",
          value: 249.99,
          source_page: "/problems/testing-debugging",
          example_name: "Match Quality - LOW",
          test_mode: "broken",
          note: "Only email - low match quality score"
        }
      },
      fixedPayload: {
        event_name: "Purchase",
        event_id: `purchase_highmatch_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
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
          client_ip_address: "192.168.1.1",
          client_user_agent: "Mozilla/5.0"
          // Multiple PII fields - high match quality
        },
        custom_data: {
          currency: "USD",
          value: 249.99,
          source_page: "/problems/testing-debugging",
          example_name: "Match Quality - HIGH",
          test_mode: "fixed",
          note: "Multiple PII fields - high match quality score"
        }
      }
    },
    {
      name: "Event Deduplication Verification",
      icon: <CheckCircle className="h-4 w-4 text-[#00ff41]" />,
      description: "Test Events shows &quot;Deduplicated&quot; badge when Pixel and CAPI use same event_id",
      brokenPayload: null,
      fixedPayload: {
        event_name: "Purchase",
        event_id: `dedup_verify_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        test_event_code: "TEST_DEDUP_CHECK",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_ip_address: "192.168.1.1",
          client_user_agent: "Mozilla/5.0",
          fbp: "fb.1.1705334567890.1234567890"
        },
        custom_data: {
          currency: "USD",
          value: 299.99,
          source_page: "/problems/testing-debugging",
          example_name: "Deduplication Verification - TEST",
          test_mode: "fixed",
          note: "TEST_DEDUP_CHECK - shows 'Deduplicated' badge in Test Events"
        }
      }
    },
    {
      name: "Complete Debugging Workflow",
      icon: <Bug className="h-4 w-4 text-[#00ff41]" />,
      description: "Full event with test code, proper structure, and all debugging metadata",
      brokenPayload: null,
      fixedPayload: {
        event_name: "Purchase",
        event_id: `complete_test_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: typeof window !== 'undefined' ? window.location.href : SITE_URL,
        action_source: "website",
        test_event_code: "TEST_COMPLETE",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          ph: "16505551234567890abcdef0123456789abcdef0123456789abcdef012345",
          fn: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
          ln: "6b23c0d5f35d1b11f9b683f0b0a617355deb11277d91ae091d399c655b87940d",
          ct: "2d5c6b8e6f4c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e",
          st: "3e6d7c9f7g5d6f4e4d6f4e4d6f4e4d6f4e4d6f4e4d6f4e4d6f4e4d6f4e4d6f",
          zp: "94043",
          country: "us",
          external_id: "test_user_12345",
          client_ip_address: "192.168.1.1",
          client_user_agent: "Mozilla/5.0 (Test Environment)",
          fbp: "fb.1.1705334567890.1234567890",
          fbc: "fb.1.1705334567890.IwAR1a2b3c4d5e6f7g8h9i0j"
        },
        custom_data: {
          currency: "USD",
          value: 399.99,
          content_ids: ["TEST-PROD-001"],
          content_type: "product",
          content_name: "Test Product",
          num_items: 1,
          order_id: "TEST-ORDER-12345",
          source_page: "/problems/testing-debugging",
          example_name: "Complete Debugging Workflow - PERFECT",
          test_mode: "fixed",
          note: "Gold standard testing: test_event_code + full payload + all metadata"
        }
      }
    }
  ]

  return (
    <PageContent
      title="Testing & Debugging"
      description="Master Meta tracking troubleshooting with test event codes, browser tools, Events Manager diagnostics, and systematic debugging workflows"
      status="Stable"
    >
      
      {/* Essential Testing Tools */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Essential Testing Tools
        </h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Meta Pixel Helper */}
          <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6">
            <div className="mb-4 flex items-center gap-3">
              <Chrome className="h-6 w-6 text-[#00ff41]" />
              <h3 className="font-mono text-lg font-semibold text-[#00ff41]">Meta Pixel Helper</h3>
            </div>
            <p className="text-sm text-[#8b949e] mb-4">
              Chrome extension that shows real-time Pixel events as they fire on your page
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2 text-sm text-[#8b949e]">
                <span className="text-[#00ff41]">•</span>
                <span>See all events in real-time</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-[#8b949e]">
                <span className="text-[#00ff41]">•</span>
                <span>Inspect event parameters</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-[#8b949e]">
                <span className="text-[#00ff41]">•</span>
                <span>Detect errors and warnings</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-[#8b949e]">
                <span className="text-[#00ff41]">•</span>
                <span>Verify Pixel ID is correct</span>
              </li>
            </ul>
            <a 
              href="https://chrome.google.com/webstore/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#00ff41] hover:underline"
            >
              Install from Chrome Web Store →
            </a>
          </div>

          {/* Browser DevTools */}
          <div className="glass hover-glow rounded-xl border border-cyan-500/20 p-6">
            <div className="mb-4 flex items-center gap-3">
              <Network className="h-6 w-6 text-cyan-400" />
              <h3 className="font-mono text-lg font-semibold text-cyan-400">Browser DevTools</h3>
            </div>
            <p className="text-sm text-[#8b949e] mb-4">
              Built-in browser tools for inspecting network requests and console logs
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2 text-sm text-[#8b949e]">
                <span className="text-cyan-400">•</span>
                <span>Network tab: filter &quot;facebook.com/tr&quot;</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-[#8b949e]">
                <span className="text-cyan-400">•</span>
                <span>Console: check for JavaScript errors</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-[#8b949e]">
                <span className="text-cyan-400">•</span>
                <span>Application tab: inspect cookies</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-[#8b949e]">
                <span className="text-cyan-400">•</span>
                <span>Copy requests as cURL for testing</span>
              </li>
            </ul>
            <code className="text-xs text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded block">
              F12 or Ctrl+Shift+I (Windows) / Cmd+Opt+I (Mac)
            </code>
          </div>

          {/* Test Events Tab */}
          <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6">
            <div className="mb-4 flex items-center gap-3">
              <TestTube className="h-6 w-6 text-[#00ff41]" />
              <h3 className="font-mono text-lg font-semibold text-[#00ff41]">Test Events Tab</h3>
            </div>
            <p className="text-sm text-[#8b949e] mb-4">
              Meta Events Manager section for viewing test events with full diagnostics
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2 text-sm text-[#8b949e]">
                <span className="text-[#00ff41]">•</span>
                <span>Events appear within 1-2 minutes</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-[#8b949e]">
                <span className="text-[#00ff41]">•</span>
                <span>Shows match quality score</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-[#8b949e]">
                <span className="text-[#00ff41]">•</span>
                <span>Displays deduplication status</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-[#8b949e]">
                <span className="text-[#00ff41]">•</span>
                <span>Lists warnings and errors</span>
              </li>
            </ul>
            <p className="text-xs text-[#8b949e]">
              Events Manager → Your Pixel → Test Events
            </p>
          </div>

          {/* Events Manager Overview */}
          <div className="glass hover-glow rounded-xl border border-cyan-500/20 p-6">
            <div className="mb-4 flex items-center gap-3">
              <Activity className="h-6 w-6 text-cyan-400" />
              <h3 className="font-mono text-lg font-semibold text-cyan-400">Events Manager Overview</h3>
            </div>
            <p className="text-sm text-[#8b949e] mb-4">
              Main dashboard showing all events, their status, and performance metrics
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-[#8b949e]">
                <span className="text-cyan-400">•</span>
                <span>Event count and trends</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-[#8b949e]">
                <span className="text-cyan-400">•</span>
                <span>Event source breakdown (Pixel vs CAPI)</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-[#8b949e]">
                <span className="text-cyan-400">•</span>
                <span>Match quality distribution</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-[#8b949e]">
                <span className="text-cyan-400">•</span>
                <span>Connection health status</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Test Event Code Usage */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Using test_event_code
        </h2>
        
        <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6 space-y-6">
          <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <p className="text-sm text-cyan-400 flex items-start gap-2">
              <span className="shrink-0">💡</span>
              <span>
                <strong>Critical for Development:</strong> Always use <code className="bg-cyan-500/10 px-2 py-0.5 rounded">test_event_code</code> in development and staging environments. This prevents test events from affecting your production pixel data and ad optimization.
              </span>
            </p>
          </div>

          <div>
            <h3 className="font-mono text-lg font-semibold text-[#e8f4f8] mb-3">Getting Your Test Event Code</h3>
            <ol className="space-y-2 text-sm text-[#8b949e]">
              <li className="flex gap-2">
                <span className="text-[#00ff41]">1.</span>
                <span>Go to Meta Events Manager → Your Pixel → Test Events</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#00ff41]">2.</span>
                <span>Look for &quot;Test Events&quot; section at the top</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#00ff41]">3.</span>
                <span>Copy the code (e.g., TEST12345)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#00ff41]">4.</span>
                <span>Add it to your .env.local file</span>
              </li>
            </ol>
          </div>

          <div>
            <h3 className="font-mono text-lg font-semibold text-[#e8f4f8] mb-3">Implementation</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-mono text-[#8b949e] mb-2">Client-Side (Pixel):</p>
                <pre className="overflow-x-auto rounded-lg border border-[#00ff41]/20 bg-[#0d1117] p-3 font-mono text-xs">
                  <code className="text-[#00ff41]">{`// Add to fbq init or track call
fbq('track', 'Purchase', {...}, {
  eventID: orderId,
  test_event_code: process.env.NEXT_PUBLIC_TEST_EVENT_CODE
});`}</code>
                </pre>
              </div>

              <div>
                <p className="text-xs font-mono text-[#8b949e] mb-2">Server-Side (CAPI):</p>
                <pre className="overflow-x-auto rounded-lg border border-[#00ff41]/20 bg-[#0d1117] p-3 font-mono text-xs">
                  <code className="text-[#00ff41]">{`// Add to CAPI event payload
const event = {
  event_name: 'Purchase',
  event_id: orderId,
  event_time: Math.floor(Date.now() / 1000),
  test_event_code: process.env.META_TEST_EVENT_CODE,  // Server-only env
  // ... rest of event data
};`}</code>
                </pre>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <p className="text-sm text-yellow-400 flex items-start gap-2">
              <span className="shrink-0">⚠</span>
              <span>
                <strong>Remember:</strong> Remove or comment out test_event_code before deploying to production. Events with test codes don&apos;t count toward real metrics or affect ad delivery.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Debugging Workflow */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Systematic Debugging Workflow
        </h2>
        
        <div className="space-y-4">
          {/* Step 1 */}
          <div className="glass hover-lift rounded-xl border border-[#00ff41]/20 p-5">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 flex items-center justify-center shrink-0">
                <span className="font-mono text-[#00ff41] font-bold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-mono font-semibold text-[#e8f4f8] mb-2">Check if Pixel is Loading</h3>
                <p className="text-sm text-[#8b949e] mb-2">
                  Open DevTools Console and type: <code className="text-[#00ff41] bg-[#00ff41]/10 px-2 py-0.5 rounded">typeof fbq</code>
                </p>
                <div className="grid gap-2 md:grid-cols-2 text-xs">
                  <div className="bg-red-500/10 rounded p-2 border border-red-500/20">
                    <p className="text-red-400 mb-1">❌ Pixel not loaded:</p>
                    <code className="text-[#8b949e]">&quot;undefined&quot;</code>
                  </div>
                  <div className="bg-[#00ff41]/10 rounded p-2 border border-[#00ff41]/20">
                    <p className="text-[#00ff41] mb-1">✓ Pixel loaded:</p>
                    <code className="text-[#8b949e]">&quot;function&quot;</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="glass hover-lift rounded-xl border border-[#00ff41]/20 p-5">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 flex items-center justify-center shrink-0">
                <span className="font-mono text-[#00ff41] font-bold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-mono font-semibold text-[#e8f4f8] mb-2">Inspect Network Requests</h3>
                <p className="text-sm text-[#8b949e] mb-2">
                  DevTools → Network → Filter by &quot;facebook.com/tr&quot; or &quot;/api/meta/capi&quot;
                </p>
                <ul className="space-y-1 text-sm text-[#8b949e]">
                  <li className="flex gap-2">
                    <span className="text-[#00ff41]">•</span>
                    <span>Verify requests are being sent</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#00ff41]">•</span>
                    <span>Check status codes (200 = success)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#00ff41]">•</span>
                    <span>Inspect request payloads</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#00ff41]">•</span>
                    <span>Look for error responses</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="glass hover-lift rounded-xl border border-[#00ff41]/20 p-5">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 flex items-center justify-center shrink-0">
                <span className="font-mono text-[#00ff41] font-bold text-sm">3</span>
              </div>
              <div>
                <h3 className="font-mono font-semibold text-[#e8f4f8] mb-2">Check Test Events Tab</h3>
                <p className="text-sm text-[#8b949e] mb-2">
                  Events Manager → Test Events (wait 1-2 minutes after sending event)
                </p>
                <ul className="space-y-1 text-sm text-[#8b949e]">
                  <li className="flex gap-2">
                    <span className="text-[#00ff41]">•</span>
                    <span>Confirm event appears</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#00ff41]">•</span>
                    <span>Check match quality score</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#00ff41]">•</span>
                    <span>Verify deduplication status</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#00ff41]">•</span>
                    <span>Review warnings/errors</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="glass hover-lift rounded-xl border border-[#00ff41]/20 p-5">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 flex items-center justify-center shrink-0">
                <span className="font-mono text-[#00ff41] font-bold text-sm">4</span>
              </div>
              <div>
                <h3 className="font-mono font-semibold text-[#e8f4f8] mb-2">Analyze CAPI Response</h3>
                <p className="text-sm text-[#8b949e] mb-2">
                  Check the JSON response from your CAPI endpoint for Meta&apos;s feedback
                </p>
                <pre className="overflow-x-auto rounded-lg border border-[#00ff41]/20 bg-[#0d1117] p-3 font-mono text-xs">
                  <code className="text-[#00ff41]">{`{
  "events_received": 1,
  "fbtrace_id": "ABC123...",
  "messages": ["Event processed successfully"]
}`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Common Issues */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Common Issues & Solutions
        </h2>
        
        <div className="grid gap-4">
          <div className="glass hover-lift rounded-xl border border-red-500/20 p-5">
            <h3 className="font-mono font-semibold text-red-400 mb-2">Events Not Appearing</h3>
            <ul className="space-y-2 text-sm text-[#8b949e]">
              <li className="flex gap-2">
                <span className="text-red-400">→</span>
                <span>Verify Pixel ID is correct in code and .env file</span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-400">→</span>
                <span>Check if ad blocker is active (test in incognito)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-400">→</span>
                <span>Confirm fbq() calls are actually executing (add console.log)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-400">→</span>
                <span>Wait full 2 minutes before checking Test Events tab</span>
              </li>
            </ul>
          </div>

          <div className="glass hover-lift rounded-xl border border-yellow-500/20 p-5">
            <h3 className="font-mono font-semibold text-yellow-400 mb-2">Low Match Quality</h3>
            <ul className="space-y-2 text-sm text-[#8b949e]">
              <li className="flex gap-2">
                <span className="text-yellow-400">→</span>
                <span>Add more PII fields (email, phone, name, address)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-yellow-400">→</span>
                <span>Verify PII is properly hashed (SHA-256)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-yellow-400">→</span>
                <span>Check normalization (lowercase, trim, remove spaces)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-yellow-400">→</span>
                <span>Include fbp and fbc cookies</span>
              </li>
            </ul>
          </div>

          <div className="glass hover-lift rounded-xl border border-yellow-500/20 p-5">
            <h3 className="font-mono font-semibold text-yellow-400 mb-2">Deduplication Not Working</h3>
            <ul className="space-y-2 text-sm text-[#8b949e]">
              <li className="flex gap-2">
                <span className="text-yellow-400">→</span>
                <span>Confirm same event_id sent to both Pixel and CAPI</span>
              </li>
              <li className="flex gap-2">
                <span className="text-yellow-400">→</span>
                <span>Generate ID on client, pass to server (don&apos;t generate twice)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-yellow-400">→</span>
                <span>Check that events are within 48-hour window</span>
              </li>
              <li className="flex gap-2">
                <span className="text-yellow-400">→</span>
                <span>Look for &quot;Deduplicated&quot; badge in Test Events</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Interactive Playground */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[400ms]">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Interactive Testing Examples
        </h2>
        
        <EnhancedEventPlayground
          title="Testing & Debugging Practice"
          description="Test 8 different debugging scenarios. Send test events and practice using browser tools, test_event_code, and Events Manager to diagnose issues."
          events={examples}
          showModeToggle={true}
          showLogs={true}
          sendToMeta={true}
          sendToBoth={true}
          showNetworkInspector={true}
          showMetaResponse={true}
          enableComparison={true}
          testEventCode="TEST_DEBUG"
          pixelId={process.env.NEXT_PUBLIC_FB_PIXEL_ID}
        />
      </section>

      {/* Testing Checklist */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Pre-Launch Testing Checklist
        </h2>
        
        <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 accent-[#00ff41]" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">Install Meta Pixel Helper</strong> and verify green checkmark on all pages
              </span>
            </li>
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 accent-[#00ff41]" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">Complete full checkout flow</strong> with test_event_code and verify all events
              </span>
            </li>
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 accent-[#00ff41]" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">Check deduplication</strong> - confirm &quot;Deduplicated&quot; badge in Test Events
              </span>
            </li>
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 accent-[#00ff41]" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">Verify match quality</strong> - aim for 6.0+ score on test events
              </span>
            </li>
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 accent-[#00ff41]" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">Test with ad blocker</strong> - CAPI should still work when Pixel is blocked
              </span>
            </li>
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 accent-[#00ff41]" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">Check mobile devices</strong> - test on iOS and Android
              </span>
            </li>
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 accent-[#00ff41]" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">Remove test_event_code</strong> before production deployment
              </span>
            </li>
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 accent-[#00ff41]" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">Monitor Events Manager</strong> for first 24 hours after launch
              </span>
            </li>
          </ul>
        </div>
      </section>

    </PageContent>
  )
}
