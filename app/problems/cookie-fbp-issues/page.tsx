"use client"

import { PageContent } from "@/components/page-content"
import { EnhancedEventPlayground } from "@/components/enhanced-event-playground"
import { Cookie, AlertTriangle, CheckCircle, Link2, Clock, Globe, ShieldCheck } from "lucide-react"

export default function CookieFbpIssuesPage() {
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
    // 1. Missing _fbp
    {
      name: "Missing _fbp (PROBLEM)",
      icon: <AlertTriangle className="h-4 w-4 text-red-400" />,
      description: "No _fbp cookie - Meta can't track user across sessions",
      payload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_ip_address: "192.168.1.1",
          client_user_agent: "Mozilla/5.0"
        },
        custom_data: {
          currency: "USD",
          value: 99.99,
          source_page: "/problems/cookie-fbp-issues",
          example_name: "Missing _fbp Cookie - POOR ATTRIBUTION",
          test_mode: "broken",
          note: "No _fbp cookie - can't track user across sessions"
        }
      }
    },
    {
      name: "Fixed: Missing _fbp",
      icon: <CheckCircle className="h-4 w-4 text-[#00ff41]" />,
      description: "Solution: _fbp cookie properly set and included",
      payload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_ip_address: "192.168.1.1",
          client_user_agent: "Mozilla/5.0",
          fbp: "fb.1.1705334567890.1234567890"
        },
        custom_data: {
          currency: "USD",
          value: 99.99,
          source_page: "/problems/cookie-fbp-issues",
          example_name: "Missing _fbp Cookie - FIXED",
          test_mode: "fixed",
          note: "Added _fbp cookie - user tracking enabled"
        }
      }
    },

    // 2. Missing _fbc
    {
      name: "Missing _fbc (PROBLEM)",
      icon: <Link2 className="h-4 w-4 text-yellow-400" />,
      description: "No _fbc cookie - can't attribute conversion to ad click",
      payload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_ip_address: "192.168.1.1",
          client_user_agent: "Mozilla/5.0",
          fbp: "fb.1.1705334567890.1234567890"
        },
        custom_data: {
          currency: "USD",
          value: 149.99,
          source_page: "/problems/cookie-fbp-issues",
          example_name: "Missing _fbc Cookie - NO CLICK ATTRIBUTION",
          test_mode: "broken",
          note: "No _fbc cookie - can't attribute to specific ad click"
        }
      }
    },
    {
      name: "Fixed: Missing _fbc",
      icon: <CheckCircle className="h-4 w-4 text-[#00ff41]" />,
      description: "Solution: _fbc cookie captured from URL parameters",
      payload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_ip_address: "192.168.1.1",
          client_user_agent: "Mozilla/5.0",
          fbp: "fb.1.1705334567890.1234567890",
          fbc: "fb.1.1705334567890.IwAR1a2b3c4d5e6f7g8h9i0j"
        },
        custom_data: {
          currency: "USD",
          value: 149.99,
          source_page: "/problems/cookie-fbp-issues",
          example_name: "Missing _fbc Cookie - FIXED",
          test_mode: "fixed",
          note: "Added _fbc cookie - click attribution enabled"
        }
      }
    },

    // 3. Wrong Cookie Domain
    {
      name: "Wrong Domain (PROBLEM)",
      icon: <Globe className="h-4 w-4 text-red-400" />,
      description: "Cookie on wrong domain - server/subdomains can't read it",
      payload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
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
          source_page: "/problems/cookie-fbp-issues",
          example_name: "Wrong Cookie Domain - NOT ACCESSIBLE",
          test_mode: "broken",
          note: "Cookie on wrong domain - server can't read it"
        }
      }
    },
    {
      name: "Fixed: Cookie Domain",
      icon: <CheckCircle className="h-4 w-4 text-[#00ff41]" />,
      description: "Solution: Cookie set on root domain (.example.com)",
      payload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_ip_address: "192.168.1.1",
          client_user_agent: "Mozilla/5.0",
          fbp: "fb.1.1705334567890.1234567890",
          fbc: "fb.1.1705334567890.IwAR1a2b3c4d5e6f7g8h9i0j"
        },
        custom_data: {
          currency: "USD",
          value: 199.99,
          source_page: "/problems/cookie-fbp-issues",
          example_name: "Wrong Cookie Domain - FIXED",
          test_mode: "fixed",
          note: "Cookie domain=.example.com - accessible on all subdomains"
        }
      }
    },

    // 4. HttpOnly Flag
    {
      name: "HttpOnly Flag (PROBLEM)",
      icon: <ShieldCheck className="h-4 w-4 text-yellow-400" />,
      description: "Cookie has HttpOnly flag - JavaScript can't access it",
      payload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
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
          source_page: "/problems/cookie-fbp-issues",
          example_name: "HttpOnly Flag - CLIENT-SIDE ISSUE",
          test_mode: "broken",
          note: "httpOnly flag blocks JavaScript access to cookie"
        }
      }
    },
    {
      name: "Fixed: HttpOnly Flag",
      icon: <CheckCircle className="h-4 w-4 text-[#00ff41]" />,
      description: "Solution: HttpOnly disabled for client-side access",
      payload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_ip_address: "192.168.1.1",
          client_user_agent: "Mozilla/5.0",
          fbp: "fb.1.1705334567890.1234567890",
          fbc: "fb.1.1705334567890.IwAR1a2b3c4d5e6f7g8h9i0j"
        },
        custom_data: {
          currency: "USD",
          value: 79.99,
          source_page: "/problems/cookie-fbp-issues",
          example_name: "HttpOnly Flag - FIXED",
          test_mode: "fixed",
          note: "No httpOnly flag - JavaScript can access cookie"
        }
      }
    },

    // 5. Expired Cookie
    {
      name: "Expired Cookie (PROBLEM)",
      icon: <Clock className="h-4 w-4 text-red-400" />,
      description: "Cookie expired - user appears as new visitor",
      payload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
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
          source_page: "/problems/cookie-fbp-issues",
          example_name: "Expired Cookie - TRACKING BREAKS",
          test_mode: "broken",
          note: "Cookie expired - user appears as new visitor"
        }
      }
    },
    {
      name: "Fixed: Expired Cookie",
      icon: <CheckCircle className="h-4 w-4 text-[#00ff41]" />,
      description: "Solution: Cookie lifetime extended (90 days)",
      payload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_ip_address: "192.168.1.1",
          client_user_agent: "Mozilla/5.0",
          fbp: "fb.1.1705334567890.1234567890",
          fbc: "fb.1.1705334567890.IwAR1a2b3c4d5e6f7g8h9i0j"
        },
        custom_data: {
          currency: "USD",
          value: 249.99,
          source_page: "/problems/cookie-fbp-issues",
          example_name: "Expired Cookie - FIXED",
          test_mode: "fixed",
          note: "Cookie with 90-day expiration - continuous tracking"
        }
      }
    },

    // 6. Timing Issue
    {
      name: "Timing Issue (PROBLEM)",
      icon: <Clock className="h-4 w-4 text-yellow-400" />,
      description: "Event fired before Pixel loaded/set cookie",
      payload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_ip_address: "192.168.1.1",
          client_user_agent: "Mozilla/5.0"
        },
        custom_data: {
          currency: "USD",
          value: 129.99,
          source_page: "/problems/cookie-fbp-issues",
          example_name: "Cookie Not Set - TIMING ISSUE",
          test_mode: "broken",
          note: "Event fired before Pixel loaded - no cookie yet"
        }
      }
    },
    {
      name: "Fixed: Timing Issue",
      icon: <CheckCircle className="h-4 w-4 text-[#00ff41]" />,
      description: "Solution: Pixel loaded early in <head>",
      payload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_ip_address: "192.168.1.1",
          client_user_agent: "Mozilla/5.0",
          fbp: "fb.1.1705334567890.1234567890",
          fbc: "fb.1.1705334567890.IwAR1a2b3c4d5e6f7g8h9i0j"
        },
        custom_data: {
          currency: "USD",
          value: 129.99,
          source_page: "/problems/cookie-fbp-issues",
          example_name: "Cookie Not Set - FIXED",
          test_mode: "fixed",
          note: "Pixel loaded in <head> - cookie available before events"
        }
      }
    },

    // 7. Good Setup
    {
      name: "Proper _fbp Cookie (GOOD)",
      icon: <Cookie className="h-4 w-4 text-[#00ff41]" />,
      description: "Valid _fbp cookie - enables cross-session tracking",
      payload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          ph: "16505551234567890abcdef0123456789abcdef0123456789abcdef012345",
          fn: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
          ln: "6b23c0d5f35d1b11f9b683f0b0a617355deb11277d91ae091d399c655b87940d",
          client_ip_address: "192.168.1.1",
          client_user_agent: "Mozilla/5.0",
          fbp: "fb.1.1705334567890.1234567890"
        },
        custom_data: {
          currency: "USD",
          value: 179.99,
          source_page: "/problems/cookie-fbp-issues",
          example_name: "Proper _fbp Cookie - GOOD",
          test_mode: "fixed",
          note: "Valid _fbp cookie - cross-session tracking enabled"
        }
      }
    },

    // 8. Perfect Setup
    {
      name: "Complete Cookie Setup (PERFECT)",
      icon: <CheckCircle className="h-4 w-4 text-[#00ff41]" />,
      description: "Both _fbp & _fbc cookies + complete user data",
      payload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
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
          external_id: `user_${Math.floor(Math.random() * 100000)}`,
          client_ip_address: "192.168.1.1",
          client_user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          fbp: "fb.1.1705334567890.1234567890",
          fbc: "fb.1.1705334567890.IwAR1a2b3c4d5e6f7g8h9i0j"
        },
        custom_data: {
          currency: "USD",
          value: 399.99,
          content_ids: ["PROD-123", "PROD-456"],
          content_type: "product",
          num_items: 2,
          source_page: "/problems/cookie-fbp-issues",
          example_name: "Complete Cookie Setup - PERFECT",
          test_mode: "fixed",
          note: "Both _fbp & _fbc cookies + complete user_data - maximum attribution"
        }
      }
    }
  ]

  return (
    <PageContent
      title="Cookie & FBP Issues"
      description="Master first-party cookie configuration for Meta Pixel and CAPI - _fbp, _fbc, domain settings, and cross-session attribution"
      status="Stable"
    >

      {/* Understanding Meta Cookies */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Understanding Meta First-Party Cookies
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {/* _fbp Cookie */}
          <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6">
            <div className="mb-4 flex items-center gap-3">
              <Cookie className="h-6 w-6 text-[#00ff41]" />
              <h3 className="font-mono text-lg font-semibold text-[#00ff41]">_fbp Cookie</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-mono text-[#8b949e] mb-1">Purpose:</p>
                <p className="text-sm text-[#e8f4f8]">Facebook Browser Pixel cookie - identifies user across sessions</p>
              </div>
              <div>
                <p className="text-xs font-mono text-[#8b949e] mb-1">Set By:</p>
                <p className="text-sm text-[#e8f4f8]">Meta Pixel (automatically when Pixel loads)</p>
              </div>
              <div>
                <p className="text-xs font-mono text-[#8b949e] mb-1">Format:</p>
                <code className="text-xs text-[#00ff41] bg-[#00ff41]/10 px-2 py-1 rounded block mt-1">
                  fb.1.1705334567890.1234567890
                </code>
              </div>
              <div>
                <p className="text-xs font-mono text-[#8b949e] mb-1">Expiration:</p>
                <p className="text-sm text-[#e8f4f8]">90 days (renewed on each visit)</p>
              </div>
              <div>
                <p className="text-xs font-mono text-[#8b949e] mb-1">Critical For:</p>
                <ul className="space-y-1 mt-1">
                  <li className="text-sm text-[#8b949e] flex items-start gap-2">
                    <span className="text-[#00ff41]">•</span>
                    <span>Cross-session user identification</span>
                  </li>
                  <li className="text-sm text-[#8b949e] flex items-start gap-2">
                    <span className="text-[#00ff41]">•</span>
                    <span>Attribution across multiple visits</span>
                  </li>
                  <li className="text-sm text-[#8b949e] flex items-start gap-2">
                    <span className="text-[#00ff41]">•</span>
                    <span>Connecting CAPI events to browser sessions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* _fbc Cookie */}
          <div className="glass hover-glow rounded-xl border border-cyan-500/20 p-6">
            <div className="mb-4 flex items-center gap-3">
              <Link2 className="h-6 w-6 text-cyan-400" />
              <h3 className="font-mono text-lg font-semibold text-cyan-400">_fbc Cookie</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-mono text-[#8b949e] mb-1">Purpose:</p>
                <p className="text-sm text-[#e8f4f8]">Facebook Click cookie - stores click ID from ad campaigns</p>
              </div>
              <div>
                <p className="text-xs font-mono text-[#8b949e] mb-1">Set By:</p>
                <p className="text-sm text-[#e8f4f8]">Meta Pixel (when user clicks Facebook ad with fbclid parameter)</p>
              </div>
              <div>
                <p className="text-xs font-mono text-[#8b949e] mb-1">Format:</p>
                <code className="text-xs text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded block mt-1">
                  fb.1.1705334567890.IwAR1a2b3c4d5e6f7g8h9i0j
                </code>
              </div>
              <div>
                <p className="text-xs font-mono text-[#8b949e] mb-1">Expiration:</p>
                <p className="text-sm text-[#e8f4f8]">90 days (set once per click)</p>
              </div>
              <div>
                <p className="text-xs font-mono text-[#8b949e] mb-1">Critical For:</p>
                <ul className="space-y-1 mt-1">
                  <li className="text-sm text-[#8b949e] flex items-start gap-2">
                    <span className="text-cyan-400">•</span>
                    <span>Attributing conversions to specific ad clicks</span>
                  </li>
                  <li className="text-sm text-[#8b949e] flex items-start gap-2">
                    <span className="text-cyan-400">•</span>
                    <span>Campaign performance measurement</span>
                  </li>
                  <li className="text-sm text-[#8b949e] flex items-start gap-2">
                    <span className="text-cyan-400">•</span>
                    <span>ROAS calculation accuracy</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deep Dive: _fbp Anatomy */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[50ms]">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-cyan-400 border-l-4 border-cyan-400 pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Deep Dive: The Anatomy of _fbp
        </h2>

        <div className="space-y-6">
          <div className="glass-strong rounded-xl p-6 border border-cyan-500/20">
            <h3 className="text-lg font-bold text-[#e8f4f8] mb-4">What do the numbers mean?</h3>
            <div className="bg-[#0d1117]/80 rounded-lg p-6 border border-cyan-500/10 font-mono text-sm">
              <p className="text-[#8b949e] mb-4">Example Value: <span className="text-[#00ff41]">fb.1.1705334567890.1234567890</span></p>

              <div className="grid gap-4 md:grid-cols-4 text-center">
                <div className="p-3 rounded border border-cyan-500/20 bg-cyan-500/5">
                  <p className="text-cyan-400 font-bold mb-1">fb</p>
                  <p className="text-[10px] text-[#8b949e]">Prefix (Meta)</p>
                </div>
                <div className="p-3 rounded border border-cyan-500/20 bg-cyan-500/5">
                  <p className="text-cyan-400 font-bold mb-1">1</p>
                  <p className="text-[10px] text-[#8b949e]">Version</p>
                </div>
                <div className="p-3 rounded border border-[#00ff41]/20 bg-[#00ff41]/5">
                  <p className="text-[#00ff41] font-bold mb-1">1705334...</p>
                  <p className="text-[10px] text-[#8b949e]">Creation Timestamp (ms)</p>
                </div>
                <div className="p-3 rounded border border-[#00ff41]/20 bg-[#00ff41]/5">
                  <p className="text-[#00ff41] font-bold mb-1">123456...</p>
                  <p className="text-[10px] text-[#8b949e]">Random ID (The Identity)</p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <h4 className="text-[#e8f4f8] font-bold border-b border-cyan-500/20 pb-2">Under the Hood mechanics:</h4>
              <ul className="space-y-3 text-sm text-[#8b949e]">
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">1. Creation:</span>
                  <span>When a user visits your site, the Pixel JS (`fbevents.js`) checks for `_fbp`. If missing, it generates this value and saves it to `document.cookie`.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">2. Transmission:</span>
                  <span>Every time `fbq(&apos;track&apos;)` runs, it automatically reads this cookie and sends it to Meta servers.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">3. CAPI Requirement:</span>
                  <span><strong>Crucial Point:</strong> Your server does NOT automatically see this cookie unless you extract it. For CAPI deduplication to work, you must manually read this value (from request headers or client JS) and send it as `user_data.fbp`.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Cookie Configuration */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Proper Cookie Configuration
        </h2>

        <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6 space-y-6">
          {/* Domain Configuration */}
          <div>
            <h3 className="font-mono text-lg font-semibold text-[#e8f4f8] mb-3">1. Domain Configuration</h3>
            <div className="space-y-4">
              <div className="glass rounded-lg border border-red-500/20 p-4">
                <p className="font-mono text-sm font-semibold text-red-400 mb-2">❌ Wrong: Specific Subdomain</p>
                <code className="text-xs text-red-400 block mb-2">domain: &quot;www.example.com&quot;</code>
                <p className="text-xs text-[#8b949e]">Cookie only accessible on www subdomain - breaks when user goes to shop.example.com</p>
              </div>
              <div className="glass rounded-lg border border-[#00ff41]/20 p-4">
                <p className="font-mono text-sm font-semibold text-[#00ff41] mb-2">✓ Correct: Root Domain</p>
                <code className="text-xs text-[#00ff41] block mb-2">domain: &quot;.example.com&quot;</code>
                <p className="text-xs text-[#8b949e]">Cookie accessible across all subdomains - works on www, shop, app, etc.</p>
              </div>
            </div>
          </div>

          {/* HttpOnly Flag */}
          <div>
            <h3 className="font-mono text-lg font-semibold text-[#e8f4f8] mb-3">2. HttpOnly Flag (Important!)</h3>
            <div className="space-y-4">
              <div className="glass rounded-lg border border-red-500/20 p-4">
                <p className="font-mono text-sm font-semibold text-red-400 mb-2">❌ Wrong: HttpOnly Enabled</p>
                <code className="text-xs text-red-400 block mb-2">Set-Cookie: _fbp=...; HttpOnly; Secure</code>
                <p className="text-xs text-[#8b949e]">JavaScript cannot read cookie - you can&apos;t pass it to CAPI from client-side</p>
              </div>
              <div className="glass rounded-lg border border-[#00ff41]/20 p-4">
                <p className="font-mono text-sm font-semibold text-[#00ff41] mb-2">✓ Correct: HttpOnly Disabled</p>
                <code className="text-xs text-[#00ff41] block mb-2">Set-Cookie: _fbp=...; Secure; SameSite=Lax</code>
                <p className="text-xs text-[#8b949e]">JavaScript can read cookie - can be passed to CAPI for better matching</p>
              </div>
            </div>
            <div className="mt-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-xs text-yellow-400 flex items-start gap-2">
                <span className="shrink-0">⚠</span>
                <span>Meta&apos;s Pixel automatically sets cookies correctly. Only worry about this if you&apos;re manually setting cookies.</span>
              </p>
            </div>
          </div>

          {/* Expiration */}
          <div>
            <h3 className="font-mono text-lg font-semibold text-[#e8f4f8] mb-3">3. Expiration Period</h3>
            <div className="glass rounded-lg border border-[#00ff41]/20 p-4">
              <p className="font-mono text-sm font-semibold text-[#00ff41] mb-2">Recommended: 90 Days</p>
              <code className="text-xs text-[#00ff41] block mb-2">max-age=7776000  // 90 days in seconds</code>
              <p className="text-xs text-[#8b949e]">Matches Meta&apos;s attribution window and allows for long sales cycles</p>
            </div>
          </div>
        </div>
      </section>

      {/* Common Cookie Problems */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Common Cookie Problems
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="glass hover-lift rounded-xl border border-red-500/20 p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-red-400 font-mono text-lg">1</span>
              <h3 className="font-mono font-semibold text-red-400">Pixel Not Loaded</h3>
            </div>
            <p className="text-sm text-[#8b949e] mb-3">
              Events fire before Pixel has a chance to set _fbp cookie
            </p>
            <div className="text-xs bg-red-500/10 rounded p-2 border border-red-500/20">
              <code className="text-red-400">Solution: Load Pixel in &lt;head&gt; before any event calls</code>
            </div>
          </div>

          <div className="glass hover-lift rounded-xl border border-red-500/20 p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-red-400 font-mono text-lg">2</span>
              <h3 className="font-mono font-semibold text-red-400">Cross-Domain Issues</h3>
            </div>
            <p className="text-sm text-[#8b949e] mb-3">
              User moves from www.site.com to shop.site.com and loses cookies
            </p>
            <div className="text-xs bg-red-500/10 rounded p-2 border border-red-500/20">
              <code className="text-red-400">Solution: Set cookie domain to .site.com</code>
            </div>
          </div>

          <div className="glass hover-lift rounded-xl border border-red-500/20 p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-red-400 font-mono text-lg">3</span>
              <h3 className="font-mono font-semibold text-red-400">Ad Blocker Impact</h3>
            </div>
            <p className="text-sm text-[#8b949e] mb-3">
              Ad blockers prevent Pixel from setting cookies entirely
            </p>
            <div className="text-xs bg-yellow-500/10 rounded p-2 border border-yellow-500/20">
              <code className="text-yellow-400">Mitigation: Use CAPI with server-side IDs</code>
            </div>
          </div>

          <div className="glass hover-lift rounded-xl border border-red-500/20 p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-red-400 font-mono text-lg">4</span>
              <h3 className="font-mono font-semibold text-red-400">Browser Restrictions</h3>
            </div>
            <p className="text-sm text-[#8b949e] mb-3">
              Safari ITP and Firefox ETP limit cookie lifetimes
            </p>
            <div className="text-xs bg-yellow-500/10 rounded p-2 border border-yellow-500/20">
              <code className="text-yellow-400">Mitigation: Combine with CAPI and PII matching</code>
            </div>
          </div>
        </div>
      </section>

      {/* How to Read Cookies */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Reading Cookies for CAPI
        </h2>

        <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6 space-y-6">
          <div>
            <h3 className="font-mono text-[#e8f4f8] font-semibold mb-3">Client-Side: Reading with JavaScript</h3>
            <pre className="overflow-x-auto rounded-lg border border-[#00ff41]/20 bg-[#0d1117] p-4 font-mono text-xs">
              <code className="text-[#00ff41]">{`// Helper function to get cookie value
function getCookie(name) {
  const value = \`; \${document.cookie}\`;
  const parts = value.split(\`; \${name}=\`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// Get Meta cookies
const fbp = getCookie('_fbp');
const fbc = getCookie('_fbc');

console.log('FBP:', fbp); // fb.1.1705334567890.1234567890
console.log('FBC:', fbc); // fb.1.1705334567890.IwAR1a2b3c4d5e6f7g8h9i0j

// Send to CAPI
await fetch('/api/meta/capi', {
  method: 'POST',
  body: JSON.stringify({
    event_name: 'Purchase',
    fbp: fbp,
    fbc: fbc,
    // ... other fields
  })
});`}</code>
            </pre>
          </div>

          <div>
            <h3 className="font-mono text-[#e8f4f8] font-semibold mb-3">Server-Side: Reading from Request</h3>
            <pre className="overflow-x-auto rounded-lg border border-[#00ff41]/20 bg-[#0d1117] p-4 font-mono text-xs">
              <code className="text-[#00ff41]">{`// Next.js API route example
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const cookieStore = cookies()
  
  // Read cookies
  const fbp = cookieStore.get('_fbp')?.value
  const fbc = cookieStore.get('_fbc')?.value
  
  // Use in CAPI event
  const event = {
    event_name: 'Purchase',
    user_data: {
      fbp: fbp,
      fbc: fbc,
      // ... other fields
    }
  }
  
  // Send to Meta...
}`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Interactive Playground */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[400ms]">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Interactive Cookie Examples
        </h2>

        <EnhancedEventPlayground
          title="Cookie Configuration Testing"
          description="Test 8 different cookie scenarios - from missing cookies to perfect setup. See how cookies affect attribution and match quality."
          events={examples}
          showLogs={true}
          sendToMeta={true}
          sendToBoth={true}
          showNetworkInspector={true}
          showMetaResponse={true}
          enableComparison={true}
          testEventCode="TEST_COOKIES"
          pixelId={process.env.NEXT_PUBLIC_FB_PIXEL_ID}
        />
      </section>

      {/* Troubleshooting Checklist */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Cookie Troubleshooting Checklist
        </h2>

        <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 accent-[#00ff41]" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">Verify Pixel is loaded</strong> - check browser console for fbq() is not defined errors
              </span>
            </li>
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 accent-[#00ff41]" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">Check cookies exist</strong> - open DevTools → Application → Cookies
              </span>
            </li>
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 accent-[#00ff41]" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">Verify domain is correct</strong> - should be .yourdomain.com for subdomains
              </span>
            </li>
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 accent-[#00ff41]" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">Check httpOnly flag</strong> - should be false if passing to CAPI client-side
              </span>
            </li>
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 accent-[#00ff41]" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">Verify expiration</strong> - should be 90 days from now
              </span>
            </li>
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 accent-[#00ff41]" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">Test with Meta Pixel Helper</strong> - Chrome extension shows cookie status
              </span>
            </li>
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 accent-[#00ff41]" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">Check ad blocker</strong> - test in incognito without extensions
              </span>
            </li>
          </ul>
        </div>
      </section>

    </PageContent>
  )
}
