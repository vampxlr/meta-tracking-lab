"use client"

import { PageContent } from "@/components/page-content"
import { EnhancedEventPlayground } from "@/components/enhanced-event-playground"
import { Server, Clock, Link, User, MapPin, Monitor, CheckCircle, AlertTriangle } from "lucide-react"

export default function CapiSetupPage() {
  // Get site URL from environment
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://meta-tracking-lab.vercel.app'

  const examples = [
    {
      name: "Missing event_time (REJECTED)",
      icon: <Clock className="h-4 w-4 text-red-400" />,
      description: "Event without timestamp - Meta will reject this entirely",
      brokenPayload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c"
        },
        custom_data: {
          currency: "USD",
          value: 99.99
        }
      },
      fixedPayload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c"
        },
        custom_data: {
          currency: "USD",
          value: 99.99
        }
      }
    },
    {
      name: "Missing action_source (INVALID)",
      icon: <Server className="h-4 w-4 text-red-400" />,
      description: "No action_source - Meta can&apos;t attribute event to correct channel",
      brokenPayload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c"
        },
        custom_data: {
          currency: "USD",
          value: 149.99
        }
      },
      fixedPayload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c"
        },
        custom_data: {
          currency: "USD",
          value: 149.99
        }
      }
    },
    {
      name: "Missing event_source_url (POOR ATTRIBUTION)",
      icon: <Link className="h-4 w-4 text-yellow-400" />,
      description: "No source URL - Meta can&apos;t determine which page drove conversion",
      brokenPayload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c"
        },
        custom_data: {
          currency: "USD",
          value: 79.99
        }
      },
      fixedPayload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: SITE_URL,
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c"
        },
        custom_data: {
          currency: "USD",
          value: 79.99
        }
      }
    },
    {
      name: "Missing user_data (0% MATCH QUALITY)",
      icon: <User className="h-4 w-4 text-red-400" />,
      description: "No user information - Meta can&apos;t match event to any user",
      brokenPayload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: SITE_URL,
        action_source: "website",
        custom_data: {
          currency: "USD",
          value: 199.99
        }
      },
      fixedPayload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: SITE_URL,
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          ph: "16505551234567890abcdef0123456789abcdef0123456789abcdef012345",
          fn: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
          ln: "6b23c0d5f35d1b11f9b683f0b0a617355deb11277d91ae091d399c655b87940d"
        },
        custom_data: {
          currency: "USD",
          value: 199.99
        }
      }
    },
    {
      name: "Missing client_ip_address (LOW MATCH)",
      icon: <MapPin className="h-4 w-4 text-yellow-400" />,
      description: "No IP address - reduces match quality and geo-targeting accuracy",
      brokenPayload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: SITE_URL,
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c"
        },
        custom_data: {
          currency: "USD",
          value: 299.99
        }
      },
      fixedPayload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: SITE_URL,
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_ip_address: "192.168.1.1",
          client_user_agent: "Mozilla/5.0"
        },
        custom_data: {
          currency: "USD",
          value: 299.99
        }
      }
    },
    {
      name: "Missing client_user_agent (REDUCED MATCHING)",
      icon: <Monitor className="h-4 w-4 text-yellow-400" />,
      description: "No user agent - loses device and browser context for matching",
      brokenPayload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: SITE_URL,
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_ip_address: "192.168.1.1"
        },
        custom_data: {
          currency: "USD",
          value: 129.99
        }
      },
      fixedPayload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: SITE_URL,
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_ip_address: "192.168.1.1",
          client_user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        },
        custom_data: {
          currency: "USD",
          value: 129.99
        }
      }
    },
    {
      name: "Minimal Server Event (WORKS BUT LIMITED)",
      icon: <AlertTriangle className="h-4 w-4 text-yellow-400" />,
      description: "Only required fields - event works but attribution and matching suffer",
      brokenPayload: null,
      fixedPayload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c"
        },
        custom_data: {
          currency: "USD",
          value: 59.99
        }
      }
    },
    {
      name: "Complete Server Event (PERFECT)",
      icon: <CheckCircle className="h-4 w-4 text-[#00ff41]" />,
      description: "All recommended fields included - maximum match quality and attribution accuracy",
      brokenPayload: null,
      fixedPayload: {
        event_name: "Purchase",
        event_id: `purchase_complete_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: SITE_URL,
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
          client_ip_address: "192.168.1.1",
          client_user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          fbp: "fb.1.1705334567890.1234567890",
          fbc: "fb.1.1705334567890.AbCdEfGhIjKlMnOpQrStUvWxYz"
        },
        custom_data: {
          currency: "USD",
          value: 449.99,
          content_ids: ["PROD-123", "PROD-456"],
          content_type: "product",
          content_name: "Premium Bundle",
          num_items: 2,
          order_id: `ORD-2026-${Math.floor(Math.random() * 10000)}`
        }
      }
    }
  ]

  return (
    <PageContent
      title="CAPI Setup Essentials"
      description="Master server-side tracking configuration with required fields, action sources, and user data for maximum attribution accuracy"
      status="Stable"
    >
      
      {/* What is CAPI */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> What is Conversions API (CAPI)?
        </h2>
        
        <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6 space-y-4">
          <p className="text-[#8b949e] text-sm md:text-base leading-relaxed">
            Conversions API (CAPI) is Meta&apos;s server-to-server tracking solution that sends events directly from your server to Meta&apos;s servers, bypassing browser limitations like ad blockers, cookie restrictions, and iOS tracking prevention.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <div className="glass rounded-lg border border-[#00ff41]/20 p-4">
              <h3 className="font-mono text-[#00ff41] font-semibold mb-3">Why Use CAPI?</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-[#8b949e]">
                  <span className="text-[#00ff41] mt-1">•</span>
                  <span>Bypasses ad blockers and browser restrictions</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-[#8b949e]">
                  <span className="text-[#00ff41] mt-1">•</span>
                  <span>More reliable than client-side Pixel alone</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-[#8b949e]">
                  <span className="text-[#00ff41] mt-1">•</span>
                  <span>Works with iOS 14.5+ tracking restrictions</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-[#8b949e]">
                  <span className="text-[#00ff41] mt-1">•</span>
                  <span>Improves event accuracy and attribution</span>
                </li>
              </ul>
            </div>

            <div className="glass rounded-lg border border-cyan-500/20 p-4">
              <h3 className="font-mono text-cyan-400 font-semibold mb-3">Best Practice</h3>
              <p className="text-sm text-[#8b949e] mb-3">
                Use <strong className="text-[#e8f4f8]">both Pixel and CAPI together</strong> for maximum coverage and accuracy. The Pixel tracks client-side interactions, while CAPI ensures server-side events are captured even when browsers block the Pixel.
              </p>
              <div className="text-xs font-mono text-cyan-400 bg-cyan-500/10 rounded p-2">
                Pixel + CAPI = 20-30% more events tracked
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Required Fields */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Required vs. Recommended Fields
        </h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Required Fields */}
          <div className="glass hover-glow rounded-xl border border-red-500/20 p-6">
            <div className="mb-4 flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-400" />
              <h3 className="font-mono text-lg font-semibold text-red-400">Required (Event Rejected Without)</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-red-400 font-mono shrink-0">•</span>
                <div>
                  <p className="font-mono text-[#e8f4f8] text-sm font-semibold">event_name</p>
                  <p className="text-xs text-[#8b949e]">The type of event (Purchase, AddToCart, etc.)</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 font-mono shrink-0">•</span>
                <div>
                  <p className="font-mono text-[#e8f4f8] text-sm font-semibold">event_time</p>
                  <p className="text-xs text-[#8b949e]">Unix timestamp when event occurred</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 font-mono shrink-0">•</span>
                <div>
                  <p className="font-mono text-[#e8f4f8] text-sm font-semibold">action_source</p>
                  <p className="text-xs text-[#8b949e]">Where event happened: website, app, phone_call, etc.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 font-mono shrink-0">•</span>
                <div>
                  <p className="font-mono text-[#e8f4f8] text-sm font-semibold">user_data</p>
                  <p className="text-xs text-[#8b949e]">At least one PII field (email, phone, etc.)</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Recommended Fields */}
          <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6">
            <div className="mb-4 flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-[#00ff41]" />
              <h3 className="font-mono text-lg font-semibold text-[#00ff41]">Recommended (Improves Performance)</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-[#00ff41] font-mono shrink-0">•</span>
                <div>
                  <p className="font-mono text-[#e8f4f8] text-sm font-semibold">event_id</p>
                  <p className="text-xs text-[#8b949e]">Enables deduplication with Pixel events</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#00ff41] font-mono shrink-0">•</span>
                <div>
                  <p className="font-mono text-[#e8f4f8] text-sm font-semibold">event_source_url</p>
                  <p className="text-xs text-[#8b949e]">URL where event occurred (helps attribution)</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#00ff41] font-mono shrink-0">•</span>
                <div>
                  <p className="font-mono text-[#e8f4f8] text-sm font-semibold">client_ip_address</p>
                  <p className="text-xs text-[#8b949e]">User&apos;s IP for geo-targeting and matching</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#00ff41] font-mono shrink-0">•</span>
                <div>
                  <p className="font-mono text-[#e8f4f8] text-sm font-semibold">client_user_agent</p>
                  <p className="text-xs text-[#8b949e]">Browser/device info for better matching</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#00ff41] font-mono shrink-0">•</span>
                <div>
                  <p className="font-mono text-[#e8f4f8] text-sm font-semibold">fbp & fbc cookies</p>
                  <p className="text-xs text-[#8b949e]">First-party cookies for attribution</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Action Source Values */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Action Source Values
        </h2>
        
        <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6">
          <p className="text-[#8b949e] text-sm mb-6">
            The <code className="text-[#00ff41] bg-[#00ff41]/10 px-2 py-1 rounded">action_source</code> field tells Meta where the event originated. Choose the correct value:
          </p>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="glass rounded-lg border border-[#00ff41]/20 p-4">
              <code className="text-[#00ff41] font-mono text-sm font-semibold">website</code>
              <p className="text-xs text-[#8b949e] mt-2">Events from your website (most common)</p>
            </div>
            <div className="glass rounded-lg border border-[#00ff41]/20 p-4">
              <code className="text-[#00ff41] font-mono text-sm font-semibold">app</code>
              <p className="text-xs text-[#8b949e] mt-2">Events from mobile or desktop app</p>
            </div>
            <div className="glass rounded-lg border border-[#00ff41]/20 p-4">
              <code className="text-[#00ff41] font-mono text-sm font-semibold">phone_call</code>
              <p className="text-xs text-[#8b949e] mt-2">Conversions from phone calls</p>
            </div>
            <div className="glass rounded-lg border border-[#00ff41]/20 p-4">
              <code className="text-[#00ff41] font-mono text-sm font-semibold">chat</code>
              <p className="text-xs text-[#8b949e] mt-2">Conversions from chat interactions</p>
            </div>
            <div className="glass rounded-lg border border-[#00ff41]/20 p-4">
              <code className="text-[#00ff41] font-mono text-sm font-semibold">email</code>
              <p className="text-xs text-[#8b949e] mt-2">Conversions from email campaigns</p>
            </div>
            <div className="glass rounded-lg border border-[#00ff41]/20 p-4">
              <code className="text-[#00ff41] font-mono text-sm font-semibold">other</code>
              <p className="text-xs text-[#8b949e] mt-2">Other offline or custom sources</p>
            </div>
          </div>
        </div>
      </section>

      {/* Common Mistakes */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Common CAPI Mistakes
        </h2>
        
        <div className="grid gap-4">
          <div className="glass hover-lift rounded-xl border border-red-500/20 p-5">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0">
                <span className="font-mono text-red-400 font-bold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-mono font-semibold text-red-400 mb-2">Forgetting event_time</h3>
                <p className="text-sm text-[#8b949e]">
                  Events without timestamps are <strong>rejected by Meta</strong>. Always include Unix timestamp: <code className="text-red-400 bg-red-500/10 px-2 py-0.5 rounded text-xs">Math.floor(Date.now() / 1000)</code>
                </p>
              </div>
            </div>
          </div>

          <div className="glass hover-lift rounded-xl border border-red-500/20 p-5">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0">
                <span className="font-mono text-red-400 font-bold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-mono font-semibold text-red-400 mb-2">Empty user_data object</h3>
                <p className="text-sm text-[#8b949e]">
                  Sending <code className="text-red-400 bg-red-500/10 px-2 py-0.5 rounded text-xs">user_data: {`{}`}</code> results in 0% match quality. Include at least email (hashed) or phone.
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
                <h3 className="font-mono font-semibold text-red-400 mb-2">Not capturing client IP and user agent</h3>
                <p className="text-sm text-[#8b949e]">
                  Missing these fields reduces match quality by 20-40%. Capture from request headers: <code className="text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded text-xs">req.headers[&apos;x-forwarded-for&apos;]</code> and <code className="text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded text-xs">req.headers[&apos;user-agent&apos;]</code>
                </p>
              </div>
            </div>
          </div>

          <div className="glass hover-lift rounded-xl border border-red-500/20 p-5">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0">
                <span className="font-mono text-red-400 font-bold text-sm">4</span>
              </div>
              <div>
                <h3 className="font-mono font-semibold text-red-400 mb-2">Sending unhashed PII</h3>
                <p className="text-sm text-[#8b949e]">
                  Email and phone must be hashed with SHA-256 before sending. See the &quot;Low Match Quality&quot; page for proper hashing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Playground */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[400ms]">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Interactive CAPI Examples
        </h2>
        
        <EnhancedEventPlayground
          title="CAPI Configuration Testing"
          description="Test 8 different CAPI setups from broken to perfect. See how missing fields affect event processing and match quality."
          events={examples}
          showModeToggle={true}
          showLogs={true}
          sendToMeta={true}
          sendToBoth={false}
          showNetworkInspector={true}
          showMetaResponse={true}
          enableComparison={true}
          testEventCode="TEST_CAPI_SETUP"
          pixelId={process.env.NEXT_PUBLIC_FB_PIXEL_ID}
        />
      </section>

      {/* Implementation Example */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Server-Side Implementation
        </h2>
        
        <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6 space-y-6">
          <div>
            <h3 className="font-mono text-[#e8f4f8] font-semibold mb-3">Node.js / Next.js API Route Example</h3>
            <pre className="overflow-x-auto rounded-lg border border-[#00ff41]/20 bg-[#0d1117] p-4 font-mono text-xs">
              <code className="text-[#00ff41]">{`// app/api/meta/capi/route.ts
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const body = await req.json()
  
  // Capture server-side context
  const clientIp = req.headers.get('x-forwarded-for') || 
                   req.headers.get('x-real-ip') || 
                   'unknown'
  const userAgent = req.headers.get('user-agent') || ''
  
  // Hash email if provided
  const hashedEmail = body.email 
    ? crypto.createHash('sha256').update(body.email.toLowerCase().trim()).digest('hex')
    : null
  
  // Build CAPI event
  const event = {
    event_name: body.event_name,
    event_id: body.event_id, // Pass from client!
    event_time: Math.floor(Date.now() / 1000),
    event_source_url: body.event_source_url,
    action_source: 'website',
    user_data: {
      em: hashedEmail,
      client_ip_address: clientIp,
      client_user_agent: userAgent,
      fbp: body.fbp, // Pass from client cookies
      fbc: body.fbc
    },
    custom_data: body.custom_data
  }
  
  // Send to Meta
  const response = await fetch(
    \`https://graph.facebook.com/v21.0/\${process.env.NEXT_PUBLIC_FB_PIXEL_ID}/events\`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [event],
        access_token: process.env.META_CAPI_ACCESS_TOKEN
      })
    }
  )
  
  return NextResponse.json(await response.json())
}`}</code>
            </pre>
          </div>

          <div>
            <h3 className="font-mono text-[#e8f4f8] font-semibold mb-3">Client-Side Integration</h3>
            <pre className="overflow-x-auto rounded-lg border border-[#00ff41]/20 bg-[#0d1117] p-4 font-mono text-xs">
              <code className="text-[#00ff41]">{`// Client-side purchase event
const eventId = 'purchase_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)

// 1. Send to Pixel
fbq('track', 'Purchase', {
  value: 99.99,
  currency: 'USD'
}, {
  eventID: eventId  // Important: use same ID!
})

// 2. Send to CAPI
await fetch('/api/meta/capi', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    event_name: 'Purchase',
    event_id: eventId,  // Same ID as Pixel!
    event_source_url: window.location.href,
    email: userEmail,  // Will be hashed server-side
    fbp: getCookie('_fbp'),
    fbc: getCookie('_fbc'),
    custom_data: {
      value: 99.99,
      currency: 'USD'
    }
  })
})`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Verification Checklist */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[600ms]">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> CAPI Setup Checklist
        </h2>
        
        <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 accent-[#00ff41]" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">Access token configured</strong> in environment variables (never expose in client code)
              </span>
            </li>
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 accent-[#00ff41]" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">event_time included</strong> as Unix timestamp in every event
              </span>
            </li>
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 accent-[#00ff41]" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">action_source set correctly</strong> (usually &quot;website&quot;)
              </span>
            </li>
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 accent-[#00ff41]" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">user_data populated</strong> with at least email or phone (hashed)
              </span>
            </li>
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 accent-[#00ff41]" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">client_ip_address captured</strong> from request headers
              </span>
            </li>
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 accent-[#00ff41]" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">client_user_agent captured</strong> from request headers
              </span>
            </li>
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 accent-[#00ff41]" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">fbp and fbc cookies</strong> passed from client to server
              </span>
            </li>
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 accent-[#00ff41]" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">event_id consistency</strong> - same ID used for Pixel and CAPI
              </span>
            </li>
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 accent-[#00ff41]" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">Test events verified</strong> in Meta Events Manager Test Events tab
              </span>
            </li>
          </ul>
        </div>
      </section>

    </PageContent>
  )
}
