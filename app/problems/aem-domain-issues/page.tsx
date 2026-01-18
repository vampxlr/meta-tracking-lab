"use client"

import { PageContent } from "@/components/page-content"
import { EnhancedEventPlayground } from "@/components/enhanced-event-playground"
import { Globe, Link2, AlertTriangle, CheckCircle, Network, Settings } from "lucide-react"

export default function AemDomainIssuesPage() {
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
      name: "Subdomain Tracking (www vs app)",
      icon: <Globe className="h-4 w-4 text-[#00ff41]" />,
      description: "Tracking across subdomains - cookie domain must allow sharing",
      brokenPayload: null,
      fixedPayload: {
        event_name: "Purchase",
        event_id: `subdomain_purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: "https://app.example.com/checkout",  // Different subdomain
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_ip_address: "192.168.1.1",
          client_user_agent: "Mozilla/5.0",
          fbp: "fb.1.1705334567890.1234567890"  // Cookie set with domain=.example.com
        },
        custom_data: {
          currency: "USD",
          value: 99.99,
          source_page: "/problems/aem-domain-issues",
          example_name: "Subdomain Tracking - GOOD",
          test_mode: "fixed",
          note: "Cookie domain=.example.com - works across www, app, shop subdomains"
        }
      }
    },
    {
      name: "Cross-Domain Tracking (site1 → site2)",
      icon: <Link2 className="h-4 w-4 text-yellow-400" />,
      description: "User moves from one domain to another - event_source_url critical for attribution",
      brokenPayload: {
        event_name: "Purchase",
        event_id: `crossdomain_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        // Missing event_source_url - Meta can't attribute correctly
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_ip_address: "192.168.1.1"
        },
        custom_data: {
          currency: "USD",
          value: 149.99,
          source_page: "/problems/aem-domain-issues",
          example_name: "Cross-Domain Tracking - MISSING URL",
          test_mode: "broken",
          note: "No event_source_url - can't attribute across domains"
        }
      },
      fixedPayload: {
        event_name: "Purchase",
        event_id: `crossdomain_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: "https://checkout.otherdomain.com/success",  // Critical!
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_ip_address: "192.168.1.1",
          client_user_agent: "Mozilla/5.0"
        },
        custom_data: {
          currency: "USD",
          value: 149.99,
          source_page: "/problems/aem-domain-issues",
          example_name: "Cross-Domain Tracking - FIXED",
          test_mode: "fixed",
          note: "event_source_url included - proper cross-domain attribution"
        }
      }
    },
    {
      name: "Cookie Domain Configuration",
      icon: <Settings className="h-4 w-4 text-[#00ff41]" />,
      description: "Setting cookie domain to .example.com allows all subdomains to access",
      brokenPayload: null,
      fixedPayload: {
        event_name: "ViewContent",
        event_id: `cookie_config_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: "https://shop.example.com/products",
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_ip_address: "192.168.1.1",
          fbp: "fb.1.1705334567890.1234567890"  // Accessible across all .example.com subdomains
        },
        custom_data: {
          content_ids: ["PROD-789"],
          content_type: "product",
          currency: "USD",
          value: 79.99,
          source_page: "/problems/aem-domain-issues",
          example_name: "Cookie Domain Config - GOOD",
          test_mode: "fixed",
          note: "domain=.example.com - accessible across all subdomains"
        }
      }
    },
    {
      name: "Multi-Domain Attribution",
      icon: <Network className="h-4 w-4 text-[#00ff41]" />,
      description: "Multiple domains sharing single Pixel - event_source_url enables proper attribution",
      brokenPayload: null,
      fixedPayload: {
        event_name: "Purchase",
        event_id: `multidomain_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: "https://marketplace.partnerdomain.com/checkout",  // Partner domain
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          ph: "16505551234567890abcdef0123456789abcdef0123456789abcdef012345",
          client_ip_address: "192.168.1.1",
          client_user_agent: "Mozilla/5.0"
        },
        custom_data: {
          currency: "USD",
          value: 299.99,
          order_id: `ORD-PARTNER-${Math.floor(Math.random() * 10000)}`,
          source_page: "/problems/aem-domain-issues",
          example_name: "Multi-Domain Attribution - GOOD",
          test_mode: "fixed",
          note: "event_source_url from partner domain - proper attribution"
        }
      }
    },
    {
      name: "Aggregated Event Measurement Setup",
      icon: <Settings className="h-4 w-4 text-cyan-400" />,
      description: "When tracking >8 domains, configure AEM in Events Manager settings",
      brokenPayload: null,
      fixedPayload: {
        event_name: "Purchase",
        event_id: `aem_purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: "https://domain9.example.com/checkout",  // 9th domain requires AEM
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_ip_address: "192.168.1.1",
          client_user_agent: "Mozilla/5.0",
          fbp: "fb.1.1705334567890.1234567890"
        },
        custom_data: {
          currency: "USD",
          value: 199.99,
          source_page: "/problems/aem-domain-issues",
          example_name: "AEM Setup for >8 Domains",
          test_mode: "fixed",
          note: "9th domain - AEM configured in Events Manager"
        }
      }
    },
    {
      name: "Complete Multi-Domain Solution",
      icon: <CheckCircle className="h-4 w-4 text-[#00ff41]" />,
      description: "Perfect cross-domain setup with all attribution fields and proper cookie configuration",
      brokenPayload: null,
      fixedPayload: {
        event_name: "Purchase",
        event_id: `complete_multidomain_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: typeof window !== 'undefined' ? window.location.href : SITE_URL,
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          ph: "16505551234567890abcdef0123456789abcdef0123456789abcdef012345",
          fn: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
          ln: "6b23c0d5f35d1b11f9b683f0b0a617355deb11277d91ae091d399c655b87940d",
          external_id: `user_${Math.floor(Math.random() * 100000)}`,
          client_ip_address: "192.168.1.1",
          client_user_agent: "Mozilla/5.0",
          fbp: "fb.1.1705334567890.1234567890",
          fbc: "fb.1.1705334567890.IwAR1a2b3c4d5e6f7g8h9i0j"
        },
        custom_data: {
          currency: "USD",
          value: 449.99,
          content_ids: ["PROD-123", "PROD-456"],
          content_type: "product",
          num_items: 2,
          order_id: `ORD-2026-${Math.floor(Math.random() * 10000)}`,
          source_page: "/problems/aem-domain-issues",
          example_name: "Complete Multi-Domain Solution - PERFECT",
          test_mode: "fixed",
          note: "Full cross-domain setup: event_source_url + cookies + complete user_data"
        }
      }
    }
  ]

  return (
    <PageContent
      title="Multi-Domain & AEM Issues"
      description="Master cross-domain tracking, subdomain configuration, cookie sharing, and Aggregated Event Measurement for multi-site businesses"
      status="Stable"
    >

      {/* Understanding Multi-Domain Tracking */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Understanding Multi-Domain Tracking
        </h2>

        <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6 space-y-6">
          <p className="text-[#8b949e] text-sm md:text-base leading-relaxed">
            Many businesses operate across multiple domains or subdomains (e.g., marketing site on www.brand.com, shop on shop.brand.com, checkout on secure.payments.com). Proper configuration ensures Meta can track the complete user journey and attribute conversions correctly.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="glass rounded-lg border border-[#00ff41]/20 p-5">
              <div className="mb-3 flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#00ff41]" />
                <h3 className="font-mono text-[#00ff41] font-semibold">Subdomain Tracking</h3>
              </div>
              <p className="text-sm text-[#8b949e] mb-3">
                Multiple subdomains under same root domain (e.g., www.site.com, app.site.com, shop.site.com)
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#00ff41]">✓</span>
                  <span className="text-[#8b949e]">Easier cookie sharing</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#00ff41]">✓</span>
                  <span className="text-[#8b949e]">Single Pixel ID works</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#00ff41]">✓</span>
                  <span className="text-[#8b949e]">Set cookie domain to .site.com</span>
                </div>
              </div>
            </div>

            <div className="glass rounded-lg border border-cyan-500/20 p-5">
              <div className="mb-3 flex items-center gap-2">
                <Link2 className="h-5 w-5 text-cyan-400" />
                <h3 className="font-mono text-cyan-400 font-semibold">Cross-Domain Tracking</h3>
              </div>
              <p className="text-sm text-[#8b949e] mb-3">
                Different root domains (e.g., brand.com, checkout.paymentprovider.com)
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-cyan-400">!</span>
                  <span className="text-[#8b949e]">Cannot share cookies</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-cyan-400">!</span>
                  <span className="text-[#8b949e]">event_source_url critical</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-cyan-400">!</span>
                  <span className="text-[#8b949e]">PII matching more important</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subdomain Configuration */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Subdomain Cookie Configuration
        </h2>

        <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6 space-y-6">
          <p className="text-[#8b949e] text-sm">
            For subdomains, configure cookies to be accessible across all subdomains by setting the domain attribute to the root domain with a leading dot.
          </p>

          <div>
            <h3 className="font-mono text-lg font-semibold text-[#e8f4f8] mb-3">Cookie Domain Setup</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="glass rounded-lg border border-red-500/20 p-4">
                <p className="font-mono text-sm font-semibold text-red-400 mb-2">❌ Wrong: Specific Subdomain</p>
                <code className="text-xs text-red-400 block mb-2">domain: &quot;www.example.com&quot;</code>
                <p className="text-xs text-[#8b949e]">Cookie only works on www subdomain</p>
              </div>
              <div className="glass rounded-lg border border-[#00ff41]/20 p-4">
                <p className="font-mono text-sm font-semibold text-[#00ff41] mb-2">✓ Correct: Root Domain</p>
                <code className="text-xs text-[#00ff41] block mb-2">domain: &quot;.example.com&quot;</code>
                <p className="text-xs text-[#8b949e]">Works on all subdomains</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-mono text-lg font-semibold text-[#e8f4f8] mb-3">Meta Pixel Configuration</h3>
            <p className="text-sm text-[#8b949e] mb-3">
              By default, Meta Pixel automatically sets cookies with the correct domain. However, if you&apos;re manually managing cookies, ensure proper configuration:
            </p>
            <pre className="overflow-x-auto rounded-lg border border-[#00ff41]/20 bg-[#0d1117] p-4 font-mono text-xs">
              <code className="text-[#00ff41]">{`// Meta Pixel handles this automatically, but for reference:
// Cookie: _fbp
// Domain: .example.com (allows www, shop, app, etc.)
// Path: /
// Max-Age: 7776000 (90 days)
// Secure: true
// SameSite: Lax`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* event_source_url Importance */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> event_source_url for Attribution
        </h2>

        <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6 space-y-6">
          <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <p className="text-sm text-cyan-400 flex items-start gap-2">
              <span className="shrink-0">💡</span>
              <span>
                <strong>Critical for Cross-Domain:</strong> The <code className="bg-cyan-500/10 px-2 py-0.5 rounded">event_source_url</code> field tells Meta which domain/page the event occurred on. This is essential for attribution when cookies can&apos;t be shared across domains.
              </span>
            </p>
          </div>

          <div>
            <h3 className="font-mono text-lg font-semibold text-[#e8f4f8] mb-3">Why It Matters</h3>
            <ul className="space-y-2 text-sm text-[#8b949e]">
              <li className="flex gap-2">
                <span className="text-[#00ff41]">•</span>
                <span>Meta uses URL to determine which ad drove the conversion</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#00ff41]">•</span>
                <span>Required for proper attribution across different domains</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#00ff41]">•</span>
                <span>Helps track user journey across multiple properties</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#00ff41]">•</span>
                <span>Essential when cookies are blocked or unavailable</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-lg font-semibold text-[#e8f4f8] mb-3">Implementation</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-mono text-[#8b949e] mb-2">Client-Side (Pixel):</p>
                <pre className="overflow-x-auto rounded-lg border border-[#00ff41]/20 bg-[#0d1117] p-3 font-mono text-xs">
                  <code className="text-[#00ff41]">{`// Pixel automatically captures URL, but for CAPI:
const eventSourceUrl = window.location.href;`}</code>
                </pre>
              </div>
              <div>
                <p className="text-xs font-mono text-[#8b949e] mb-2">Server-Side (CAPI):</p>
                <pre className="overflow-x-auto rounded-lg border border-[#00ff41]/20 bg-[#0d1117] p-3 font-mono text-xs">
                  <code className="text-[#00ff41]">{`const event = {
  event_name: 'Purchase',
  event_source_url: body.event_source_url,  // Pass from client
  // OR capture from referer header
  event_source_url: req.headers.referer,
  // ... other fields
};`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AEM (Aggregated Event Measurement) */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Aggregated Event Measurement (AEM)
        </h2>

        <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6 space-y-6">
          <div>
            <h3 className="font-mono text-lg font-semibold text-[#e8f4f8] mb-3">What is AEM?</h3>
            <p className="text-sm text-[#8b949e] mb-4">
              Aggregated Event Measurement is a protocol required when a single Pixel tracks events across more than 8 different domains. It&apos;s part of iOS 14.5+ privacy changes and applies to all tracking, not just iOS users.
            </p>

            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-sm text-yellow-400 flex items-start gap-2">
                <span className="shrink-0">⚠</span>
                <span>
                  <strong>8-Domain Limit:</strong> If you track on domain1.com, domain2.com, ... domain9.com with one Pixel, you MUST configure AEM to prioritize which 8 domains to optimize for.
                </span>
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-mono text-lg font-semibold text-[#e8f4f8] mb-3">When to Use AEM</h3>
            <ul className="space-y-2 text-sm text-[#8b949e]">
              <li className="flex gap-2">
                <span className="text-[#00ff41]">•</span>
                <span>You have more than 8 domains using the same Pixel</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#00ff41]">•</span>
                <span>You run Facebook ads targeting iOS users</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#00ff41]">•</span>
                <span>You want to prioritize certain domains for optimization</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-lg font-semibold text-[#e8f4f8] mb-3">How to Configure AEM</h3>
            <ol className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-[#00ff41] font-mono shrink-0">1.</span>
                <span className="text-sm text-[#8b949e]">
                  Go to Meta Events Manager → Your Pixel → Settings
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#00ff41] font-mono shrink-0">2.</span>
                <span className="text-sm text-[#8b949e]">
                  Scroll to &quot;Aggregated Event Measurement&quot; section
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#00ff41] font-mono shrink-0">3.</span>
                <span className="text-sm text-[#8b949e]">
                  Click &quot;Configure Web Events&quot;
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#00ff41] font-mono shrink-0">4.</span>
                <span className="text-sm text-[#8b949e]">
                  Add your domains and prioritize the 8 most important ones
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#00ff41] font-mono shrink-0">5.</span>
                <span className="text-sm text-[#8b949e]">
                  Rank your conversion events by priority (Purchase usually #1)
                </span>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[400ms]">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Multi-Domain Best Practices
        </h2>

        <div className="grid gap-4">
          <div className="glass hover-lift rounded-xl border border-[#00ff41]/20 p-5">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 flex items-center justify-center shrink-0">
                <span className="font-mono text-[#00ff41] font-bold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-mono font-semibold text-[#e8f4f8] mb-2">Always Include event_source_url</h3>
                <p className="text-sm text-[#8b949e]">
                  Even for single-domain sites, always send event_source_url in CAPI events. It improves attribution accuracy and prepares for future multi-domain expansion.
                </p>
              </div>
            </div>
          </div>

          <div className="glass hover-lift rounded-xl border border-[#00ff41]/20 p-5">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 flex items-center justify-center shrink-0">
                <span className="font-mono text-[#00ff41] font-bold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-mono font-semibold text-[#e8f4f8] mb-2">Use CAPI for Cross-Domain Conversions</h3>
                <p className="text-sm text-[#8b949e]">
                  When users convert on a third-party domain (payment processor, marketplace), Pixel may not fire reliably. CAPI ensures you capture these conversions server-side.
                </p>
              </div>
            </div>
          </div>

          <div className="glass hover-lift rounded-xl border border-[#00ff41]/20 p-5">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 flex items-center justify-center shrink-0">
                <span className="font-mono text-[#00ff41] font-bold text-sm">3</span>
              </div>
              <div>
                <h3 className="font-mono font-semibold text-[#e8f4f8] mb-2">Prioritize High-Value Domains in AEM</h3>
                <p className="text-sm text-[#8b949e]">
                  If you need AEM, put your main conversion domains in the top 8. Meta will optimize campaigns for these domains first.
                </p>
              </div>
            </div>
          </div>

          <div className="glass hover-lift rounded-xl border border-[#00ff41]/20 p-5">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 flex items-center justify-center shrink-0">
                <span className="font-mono text-[#00ff41] font-bold text-sm">4</span>
              </div>
              <div>
                <h3 className="font-mono font-semibold text-[#e8f4f8] mb-2">Test Cookie Access Across Subdomains</h3>
                <p className="text-sm text-[#8b949e]">
                  After setting cookie domain to .example.com, verify it&apos;s accessible on all subdomains by checking DevTools → Application → Cookies on each subdomain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Playground */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Interactive Multi-Domain Examples
        </h2>

        <EnhancedEventPlayground
          title="Multi-Domain Tracking Testing"
          description="Test 6 different multi-domain scenarios. See how event_source_url, cookie configuration, and AEM affect cross-domain attribution."
          events={examples}
          showLogs={true}
          sendToMeta={true}
          sendToBoth={true}
          showNetworkInspector={true}
          showMetaResponse={true}
          enableComparison={true}
          testEventCode="TEST_MULTIDOMAIN"
          pixelId={process.env.NEXT_PUBLIC_FB_PIXEL_ID}
        />
      </section>

      {/* Troubleshooting */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '600ms' }}>
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Multi-Domain Troubleshooting
        </h2>

        <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-[#e8f4f8] mb-1">Events Not Attributed Correctly</p>
                <p className="text-sm text-[#8b949e]">Check that event_source_url is included in all CAPI events and matches the actual page URL</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-[#e8f4f8] mb-1">Cookies Not Working on Subdomains</p>
                <p className="text-sm text-[#8b949e]">Verify cookie domain is set to .rootdomain.com (with leading dot). Check DevTools → Application → Cookies on each subdomain.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-[#e8f4f8] mb-1">Poor Performance with &gt;8 Domains</p>
                <p className="text-sm text-[#8b949e]">Configure AEM in Events Manager and prioritize your top 8 conversion domains. Consider using separate Pixels for very different business units.</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

    </PageContent>
  )
}
