"use client"

import { PageContent } from "@/components/page-content"
import { EnhancedEventPlayground } from "@/components/enhanced-event-playground"
import { Server, Shield, Zap, Globe, CheckCircle2, XCircle, Network, Lock, TrendingUp } from "lucide-react"

export default function FirstPartyEndpointPage() {
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

  // Get cookie helper
  const getCookie = (name: string) => {
    if (typeof document === 'undefined') return null
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(';').shift()
    return null
  }

  const endpointExamples = [
    {
      name: "Direct to Meta (BLOCKED BY AD BLOCKERS)",
      icon: <XCircle className="h-4 w-4 text-red-400" />,
      description: "Client sends directly to Meta → Ad blockers detect and block",
      payload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514",
          client_ip_address: "192.168.1.1"
        },
        custom_data: {
          currency: "USD",
          value: 99.99,
          source_page: "/server/first-party-endpoint",
          example_name: "Direct to Meta - BLOCKED",
          test_mode: "broken",
          note: "Client → graph.facebook.com - ad blockers detect and block"
        }
      }
    },
    {
      name: "Via First-Party Endpoint (BYPASSES BLOCKERS)",
      icon: <CheckCircle2 className="h-4 w-4 text-[#00ff41]" />,
      description: "Client sends to your domain → Server forwards to Meta",
      payload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514",
          client_ip_address: "192.168.1.1",
          fbp: (typeof document !== 'undefined' ? getCookie('_fbp') : undefined) || undefined, // USE REAL COOKIE
          fbc: (typeof document !== 'undefined' ? getCookie('_fbc') : undefined) || undefined  // USE REAL COOKIE
        },
        custom_data: {
          currency: "USD",
          value: 99.99,
          source_page: "/server/first-party-endpoint",
          example_name: "Via First-Party Endpoint - WORKS",
          test_mode: "fixed",
          note: "Client → yourdomain.com/api/events → Meta (bypasses ad blockers)"
        }
      }
    },
    {
      name: "Third-Party Domain Issues (BROKEN)",
      icon: <Globe className="h-4 w-4 text-yellow-400" />,
      description: "Cross-origin requests flagged by browsers and blockers",
      payload: {
        event_name: "ViewContent",
        event_id: `view_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514"
        },
        custom_data: {
          content_ids: ["prod_123"],
          source_page: "/server/first-party-endpoint",
          example_name: "Third-Party Domain - FLAGGED",
          test_mode: "broken",
          note: "Cross-origin to *.facebook.com - browsers restrict cookies/tracking"
        }
      }
    },
    {
      name: "Same-Origin Request (FIXED)",
      icon: <CheckCircle2 className="h-4 w-4 text-[#00ff41]" />,
      description: "Request to own domain avoids cross-origin issues",
      payload: {
        event_name: "ViewContent",
        event_id: `view_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514",
          client_ip_address: "192.168.1.1",
          fbp: (typeof document !== 'undefined' ? getCookie('_fbp') : undefined) || undefined // USE REAL COOKIE
        },
        custom_data: {
          content_ids: ["prod_123"],
          source_page: "/server/first-party-endpoint",
          example_name: "Same-Origin Request - SAFE",
          test_mode: "fixed",
          note: "Same-origin to yourdomain.com - no cross-origin restrictions"
        }
      }
    },
    {
      name: "Cookie Access via Third-Party (BROKEN)",
      icon: <Lock className="h-4 w-4 text-yellow-400" />,
      description: "Third-party context blocks access to _fbp/_fbc cookies",
      payload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514"
          // No fbp/fbc - third-party context blocks cookie access
        },
        custom_data: {
          currency: "USD",
          value: 149.99,
          source_page: "/server/first-party-endpoint",
          example_name: "Third-Party No Cookies",
          test_mode: "broken",
          note: "Can't access _fbp/_fbc in third-party context"
        }
      }
    },
    {
      name: "Cookie Access via First-Party (FIXED)",
      icon: <Lock className="h-4 w-4 text-[#00ff41]" />,
      description: "First-party endpoint can read _fbp/_fbc cookies reliably",
      payload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514",
          fbp: typeof document !== 'undefined' ? getCookie('_fbp') : "fb.1.1705334567890.1234567890", // REAL or FALLBACK
          fbc: typeof document !== 'undefined' ? getCookie('_fbc') : "fb.1.1705334567890.IwAR1a2b3c4d5e6f7g8h9i0j",
          client_ip_address: "192.168.1.1"
        },
        custom_data: {
          currency: "USD",
          value: 149.99,
          source_page: "/server/first-party-endpoint",
          example_name: "First-Party Endpoint with Cookies - GOOD",
          test_mode: "fixed",
          note: "First-party server can read cookies and forward to Meta"
        }
      }
    },
    {
      name: "Server IP Usage (BROKEN)",
      icon: <Network className="h-4 w-4 text-yellow-400" />,
      description: "Using server IP instead of client IP reduces match quality",
      payload: {
        event_name: "CompleteRegistration",
        event_id: `lead_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514",
          client_ip_address: "10.0.0.1"  // Internal server IP - not useful!
        },
        custom_data: {
          source_page: "/server/first-party-endpoint",
          example_name: "Server IP Used - POOR MATCH",
          test_mode: "broken",
          note: "Using server's IP instead of client's real IP"
        }
      }
    },
    {
      name: "Real Client IP Forwarding (FIXED)",
      icon: <Network className="h-4 w-4 text-[#00ff41]" />,
      description: "Server correctly extracts and forwards client IP",
      payload: {
        event_name: "CompleteRegistration",
        event_id: `lead_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514",
          client_ip_address: "203.0.113.45",  // Real client IP from X-Forwarded-For
          client_user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          fbp: (typeof document !== 'undefined' ? getCookie('_fbp') : undefined) || undefined // REAL COOKIE
        },
        custom_data: {
          source_page: "/server/first-party-endpoint",
          example_name: "Real Client IP - HIGH MATCH",
          test_mode: "fixed",
          note: "Extracted real client IP from X-Forwarded-For header"
        }
      }
    },
    {
      name: "Rate Limiting & Security (SECURE)",
      icon: <Shield className="h-4 w-4 text-[#00ff41]" />,
      description: "First-party endpoint can add rate limiting and validation",
      payload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514",
          client_ip_address: "192.168.1.1"
        },
        custom_data: {
          currency: "USD",
          value: 199.99,
          source_page: "/server/first-party-endpoint",
          example_name: "With Rate Limiting - SECURE",
          test_mode: "fixed",
          note: "Server validates, rate limits, and sanitizes before forwarding"
        }
      }
    },
    {
      name: "Request Deduplication Server-Side (EFFICIENT)",
      icon: <Zap className="h-4 w-4 text-[#00ff41]" />,
      description: "Server can deduplicate duplicate requests before sending to Meta",
      payload: {
        event_name: "AddToCart",
        event_id: "cart_dedupe_test_123",  // Static for demo
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514",
          client_ip_address: "192.168.1.1"
        },
        custom_data: {
          currency: "USD",
          value: 79.99,
          source_page: "/server/first-party-endpoint",
          example_name: "Server-Side Dedup - EFFICIENT",
          test_mode: "fixed",
          note: "Server caches event_ids - only forwards unique events to Meta"
        }
      }
    },
    {
      name: "Better Analytics & Logging (OBSERVABLE)",
      icon: <TrendingUp className="h-4 w-4 text-[#00ff41]" />,
      description: "Log all events server-side before forwarding to Meta",
      payload: {
        event_name: "Purchase",
        event_id: `purchase_logged_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514",
          ph: "254d69f6b8f6a6e9c2b1c573b0885c9b6f3f3f3c8c0f3f3f3f3f3f3f3f3f3f3",
          client_ip_address: "192.168.1.1"
        },
        custom_data: {
          currency: "USD",
          value: 299.99,
          order_id: `ORD-${Date.now()}`,
          source_page: "/server/first-party-endpoint",
          example_name: "With Server Logging - OBSERVABLE",
          test_mode: "fixed",
          note: "Event logged to database + forwarded to Meta for debugging"
        }
      }
    },
    {
      name: "Complete First-Party Setup (BEST PRACTICE)",
      icon: <CheckCircle2 className="h-4 w-4 text-[#00ff41]" />,
      description: "Full implementation: bypasses ad blockers, better cookies, secure, logged",
      payload: {
        event_name: "Purchase",
        event_id: `purchase_complete_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: typeof window !== 'undefined' ? window.location.href : SITE_URL,
        action_source: "website",
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514",
          ph: "254d69f6b8f6a6e9c2b1c573b0885c9b6f3f3f3c8c0f3f3f3f3f3f3f3f3f3f3",
          fn: "96d9632f363564cc3032521409cf22a852f2032eec099ed5967c0d000cec607a",
          ln: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
          fbp: "fb.1.1705334567890.1234567890",
          fbc: "fb.1.1705334567890.IwAR1a2b3c4d5e6f7g8h9i0j",
          client_ip_address: "203.0.113.45",
          client_user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        },
        custom_data: {
          currency: "USD",
          value: 499.99,
          content_ids: ["PROD-001", "PROD-002"],
          content_type: "product",
          num_items: 2,
          order_id: `ORD-${Date.now()}`,
          source_page: "/server/first-party-endpoint",
          example_name: "Complete First-Party Setup - PERFECT",
          test_mode: "fixed",
          note: "Gold standard: Bypasses blockers + cookies + security + logging"
        }
      }
    }
  ]

  return (
    <PageContent
      title="First-Party Endpoint"
      description="Build a CAPI proxy on your domain to bypass ad blockers, improve cookie access, and add server-side validation and logging"
      status="Beta"
    >

      {/* Why First-Party Endpoint */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Why First-Party CAPI Endpoint?
        </h2>

        <div className="space-y-4">
          <p className="leading-relaxed text-[#8b949e] text-sm md:text-base">
            Instead of sending events directly from the browser to Meta&apos;s servers (<code className="text-[#00ff41] bg-[#0d1117] px-2 py-1 rounded">graph.facebook.com</code>), route them through your own domain first. This first-party endpoint acts as a proxy that forwards events to Meta, but with significant advantages.
          </p>

          <div className="border-gradient">
            <div className="border-gradient-content glass-strong p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#00ff41]/10">
                  <Server className="h-6 w-6 text-[#00ff41]" />
                </div>
                <h3 className="font-mono text-xl font-bold text-[#00ff41]">Key Benefits</h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="glass hover-glow rounded-lg p-4 border border-[#00ff41]/20">
                  <p className="font-mono font-semibold text-[#00ff41] mb-2">🚫 Bypass Ad Blockers</p>
                  <p className="text-sm text-[#8b949e]">
                    Requests to yourdomain.com/api/events aren&apos;t blocked like graph.facebook.com
                  </p>
                </div>

                <div className="glass hover-glow rounded-lg p-4 border border-[#00ff41]/20">
                  <p className="font-mono font-semibold text-[#00ff41] mb-2">🍪 Better Cookie Access</p>
                  <p className="text-sm text-[#8b949e]">
                    First-party context allows reliable access to _fbp and _fbc cookies
                  </p>
                </div>

                <div className="glass hover-glow rounded-lg p-4 border border-[#00ff41]/20">
                  <p className="font-mono font-semibold text-[#00ff41] mb-2">🔒 Enhanced Security</p>
                  <p className="text-sm text-[#8b949e]">
                    Add rate limiting, validation, and sanitization before forwarding to Meta
                  </p>
                </div>

                <div className="glass hover-glow rounded-lg p-4 border border-[#00ff41]/20">
                  <p className="font-mono font-semibold text-[#00ff41] mb-2">📊 Server Logging</p>
                  <p className="text-sm text-[#8b949e]">
                    Log all events to your database for debugging and analytics
                  </p>
                </div>

                <div className="glass hover-glow rounded-lg p-4 border border-[#00ff41]/20">
                  <p className="font-mono font-semibold text-[#00ff41] mb-2">🌐 Real Client IP</p>
                  <p className="text-sm text-[#8b949e]">
                    Extract actual user IP from headers for better match quality
                  </p>
                </div>

                <div className="glass hover-glow rounded-lg p-4 border border-[#00ff41]/20">
                  <p className="font-mono font-semibold text-[#00ff41] mb-2">⚡ Deduplication</p>
                  <p className="text-sm text-[#8b949e]">
                    Cache event_ids server-side to prevent duplicate sends to Meta
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> How First-Party Proxy Works
        </h2>

        <div className="space-y-6">
          {/* Flow Comparison */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Without First-Party */}
            <div className="glass rounded-xl p-5 border border-red-500/20">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="h-5 w-5 text-red-400" />
                <h3 className="font-mono font-semibold text-red-400">Without First-Party</h3>
              </div>

              <div className="space-y-3">
                <div className="bg-[#0d1117] rounded-lg p-3 border border-red-500/20">
                  <p className="text-xs font-mono text-[#8b949e] mb-1">Browser:</p>
                  <pre className="text-xs font-mono text-red-400">
                    {`Client → graph.facebook.com/events
❌ Blocked by ad blockers
❌ Third-party cookie restrictions  
❌ CORS issues
❌ No server-side control`}
                  </pre>
                </div>
              </div>
            </div>

            {/* With First-Party */}
            <div className="glass rounded-xl p-5 border border-[#00ff41]/20">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-5 w-5 text-[#00ff41]" />
                <h3 className="font-mono font-semibold text-[#00ff41]">With First-Party</h3>
              </div>

              <div className="space-y-3">
                <div className="bg-[#0d1117] rounded-lg p-3 border border-[#00ff41]/20">
                  <p className="text-xs font-mono text-[#8b949e] mb-1">Browser → Your Server → Meta:</p>
                  <pre className="text-xs font-mono text-[#00ff41]">
                    {`Client → yourdomain.com/api/events
  ↓ (Your Server)
  • Validate & sanitize
  • Extract real client IP
  • Read _fbp/_fbc cookies
  • Log to database
  • Deduplicate
  ↓
Meta graph.facebook.com/events
✓ No ad blocker issues
✓ Full cookie access
✓ Complete control`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Example */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Implementation Guide
        </h2>

        <div className="space-y-6">
          {/* Step 1: API Route */}
          <div className="glass-strong hover-border-glow rounded-xl p-6 border border-[#00ff41]/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 flex items-center justify-center">
                <span className="font-mono text-[#00ff41] font-bold">1</span>
              </div>
              <h3 className="font-mono text-lg font-semibold text-[#e8f4f8]">Create API Route</h3>
            </div>

            <div className="bg-[#0d1117] rounded-lg p-4 border border-[#00ff41]/20">
              <p className="text-xs font-mono text-[#00ff41] mb-2">app/api/events/route.ts:</p>
              <pre className="text-xs font-mono text-[#8b949e] overflow-x-auto">
                {`import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Extract real client IP
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                     request.headers.get('x-real-ip') ||
                     '0.0.0.0'
    
    // Read cookies from request
    const fbp = request.cookies.get('_fbp')?.value
    const fbc = request.cookies.get('_fbc')?.value
    
    // Build CAPI payload
    const payload = {
      data: [{
        ...body,
        user_data: {
          ...body.user_data,
          client_ip_address: clientIP,
          fbp,
          fbc
        }
      }]
    }
    
    // Forward to Meta
    const response = await fetch(
      \`https://graph.facebook.com/v19.0/\${PIXEL_ID}/events\`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${ACCESS_TOKEN}\`
        },
        body: JSON.stringify(payload)
      }
    )
    
    const result = await response.json()
    return NextResponse.json(result)
    
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}`}
              </pre>
            </div>
          </div>

          {/* Step 2: Client-Side */}
          <div className="glass-strong hover-border-glow rounded-xl p-6 border border-[#00ff41]/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 flex items-center justify-center">
                <span className="font-mono text-[#00ff41] font-bold">2</span>
              </div>
              <h3 className="font-mono text-lg font-semibold text-[#e8f4f8]">Update Client Code</h3>
            </div>

            <div className="bg-[#0d1117] rounded-lg p-4 border border-[#00ff41]/20">
              <p className="text-xs font-mono text-[#00ff41] mb-2">Change fetch URL to your domain:</p>
              <pre className="text-xs font-mono text-[#8b949e] overflow-x-auto">
                {`// Instead of directly to Meta:
// fetch('https://graph.facebook.com/...')

// Send to your first-party endpoint:
await fetch('/api/events', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    event_name: 'Purchase',
    event_id: crypto.randomUUID(),
    event_time: Math.floor(Date.now() / 1000),
    action_source: 'website',
    user_data: {
      em: hashedEmail
    },
    custom_data: {
      currency: 'USD',
      value: 99.99
    }
  })
})

// Your server handles:
// - Cookie extraction (_fbp/_fbc)
// - Real IP extraction
// - Forwarding to Meta`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Testing */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Interactive Examples
        </h2>

        <div className="glass-strong rounded-xl p-6 border border-[#00d9ff]/20 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Server className="h-5 w-5 text-[#00d9ff]" />
            <h4 className="font-mono font-semibold text-[#00d9ff]">First-Party Endpoint Patterns</h4>
          </div>
          <p className="text-sm text-[#8b949e] mb-3">
            These examples demonstrate different aspects of first-party CAPI endpoints. In production, all events would route through your server.
          </p>
        </div>

        <EnhancedEventPlayground
          title="First-Party Endpoint Examples"
          description="See the benefits of routing CAPI through your own domain"
          events={endpointExamples}
          showLogs={true}
          sendToMeta={true}
          sendToBoth={true}
          showNetworkInspector={true}
          showMetaResponse={true}
          testEventCode="TEST_FIRST_PARTY"
          pixelId={process.env.NEXT_PUBLIC_FB_PIXEL_ID}
        />
      </section>

      {/* FAQ & Architecture Deep Dive */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[350ms]">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Architecture Deep Dive & FAQ
        </h2>

        <div className="grid gap-6">
          {/* Question 1: How it works */}
          <div className="glass-strong rounded-xl p-6 border border-[#00ff41]/20">
            <h3 className="font-mono text-lg font-bold text-[#e8f4f8] mb-3 flex items-center gap-2">
              <Network className="h-5 w-5 text-[#00ff41]" />
              How does the data flow work?
            </h3>
            <div className="space-y-4 text-[#8b949e] text-sm leading-relaxed">
              <p>
                When you use a First-Party Endpoint, the browser does <strong>not</strong> send data directly to Meta. Instead, it sends the event to your own server (e.g., <code className="text-[#00ff41]">yourdomain.com/api/events</code>).
              </p>
              <p>
                Your server then acts as a "proxy" or middleman. It receives the request, processes it (adds IP, cookies, validation), and then makes a <strong>server-to-server</strong> API call (CAPI) to Meta's servers.
              </p>
              <div className="bg-[#0d1117] p-3 rounded border border-[#00ff41]/10 font-mono text-xs">
                Browser ➔ Your Server (First-Party) ➔ Meta (CAPI)
              </div>
              <p>
                <strong>Does Meta see browser requests?</strong> In this specific flow, Meta <em>only</em> receives the CAPI request from your server. They do not see the original browser request directly, because it was sent to <em>your</em> domain, not theirs.
              </p>
            </div>
          </div>

          {/* Question 2: Ad Blockers & Deduplication */}
          <div className="glass-strong rounded-xl p-6 border border-[#00ff41]/20">
            <h3 className="font-mono text-lg font-bold text-[#e8f4f8] mb-3 flex items-center gap-2">
              <Zap className="h-5 w-5 text-[#00ff41]" />
              Ad Blockers & Deduplication
            </h3>
            <div className="space-y-4 text-[#8b949e] text-sm leading-relaxed">
              <div>
                <strong>Scenario: No Ad Blocker</strong><br />
                If you have the details set up to send via <em>both</em> Pixel and First-Party Endpoint:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>The Browser sends a standard Pixel request directly to Meta (if not blocked).</li>
                  <li>The Browser <em>also</em> sends a request to your First-Party Endpoint, which forwards it to Meta as a CAPI event.</li>
                </ul>
              </div>
              <p>
                <strong>This results in 2 events reaching Meta.</strong> To fix this, you send the same <code className="text-[#00ff41]">event_id</code> in both. Meta will verify they are the same event and "deduplicate" them, keeping the one with more data (usually the CAPI one).
              </p>
              <p>
                <strong>Scenario: Server-Side Independent Logic</strong><br />
                If your backend <em>also</em> fires an event independently (e.g., on a webhook) for the same action, that would be a 3rd event. You should avoid this or ensure it shares the exact same <code className="text-[#00ff41]">event_id</code> if it represents the exact same user action.
              </p>
            </div>
          </div>

          {/* Question 3: Cookie Access */}
          <div className="glass-strong rounded-xl p-6 border border-[#00ff41]/20">
            <h3 className="font-mono text-lg font-bold text-[#e8f4f8] mb-3 flex items-center gap-2">
              <Lock className="h-5 w-5 text-[#00ff41]" />
              Cookie Access (_fbp / _fbc)
            </h3>
            <div className="space-y-4 text-[#8b949e] text-sm leading-relaxed">
              <p>
                <strong>Can the server access cookies without the client sending them?</strong>
                <br />
                <span className="text-[#00ff41]">YES</span>, but only if the server and client are on the <strong>same domain</strong> (First-Party).
              </p>
              <p>
                When a browser makes <em>any</em> request to <code className="text-[#00ff41]">yourdomain.com</code>, it automatically includes all cookies set for that domain in the request headers. This means your First-Party Endpoint API route can simply read <code className="text-orange-300">request.cookies.get('_fbp')</code> directly—the client-side code doesn't strictly need to manually extract and send them in the body (though it's often safer to do so to be explicit).
              </p>
            </div>
          </div>

          {/* Question 4: Only First Party Example */}
          <div className="glass-strong rounded-xl p-6 border border-[#00ff41]/20">
            <h3 className="font-mono text-lg font-bold text-[#e8f4f8] mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#00ff41]" />
              Example: Sending ONLY to First-Party Endpoint
            </h3>
            <div className="space-y-4 text-[#8b949e] text-sm leading-relaxed">
              <p>
                If you want to stop using the Facebook SDK/Pixel entirely in the browser and <em>only</em> use your First-Party Endpoint (100% server-side tracking from the client's perspective), you can use a function like this:
              </p>

              <div className="bg-[#0d1117] rounded-lg p-4 border border-[#00ff41]/20">
                <pre className="text-xs font-mono text-[#8b949e] overflow-x-auto">
                  {`// 1. Define a helper that replaces 'fbq()'
const trackFirstParty = async (eventName, params = {}) => {
  // Generate a unique ID for this event
  const eventId = crypto.randomUUID();

  // 2. Send ONLY to your server
  await fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event_name: eventName,
      event_id: eventId,
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      user_data: {
        // Essential for matching since we don't have the Pixel
        em: params.hashed_email,
        ph: params.hashed_phone,
        // Optional: Client could parse cookies, 
        // OR let the server read them automatically from headers
      },
      custom_data: params.custom_data
    })
  });
};

// 3. Usage
trackFirstParty('Purchase', { 
  hashed_email: '...', 
  custom_data: { value: 50.00, currency: 'USD' } 
});`}
                </pre>
              </div>
              <p className="text-xs text-yellow-500/80 mt-2">
                Note: When removing the browser Pixel completely, you lose some of Meta's auto-collected data (button clicks, automatic advanced matching). You must be more diligent about sending high-quality user parameters manually.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[400ms]">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Best Practices
        </h2>

        <div className="glass-strong hover-border-glow rounded-xl border border-[#00ff41]/20 p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-[#00ff41] font-mono mt-1">✓</span>
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Use /api/events or similar generic path</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Avoid obvious names like /facebook or /meta that ad blockers might target
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#00ff41] font-mono mt-1">✓</span>
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Add Rate Limiting</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Prevent abuse with rate limits per IP/user (e.g., 100 events per minute)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#00ff41] font-mono mt-1">✓</span>
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Validate Payloads Server-Side</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Use Zod or similar to validate event structure before forwarding
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#00ff41] font-mono mt-1">✓</span>
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Log Everything</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Store events in your database before forwarding for debugging and analytics
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#00ff41] font-mono mt-1">✓</span>
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Handle Failures Gracefully</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Implement retry logic for failed forwards to Meta (see Retry Queue page)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#00ff41] font-mono mt-1">✓</span>
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Keep Access Token Secure</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Never expose CAPI access token to client - only use on server
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </PageContent>
  )
}
