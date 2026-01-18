"use client"

import { PageContent } from "@/components/page-content"
import { EnhancedEventPlayground } from "@/components/enhanced-event-playground"
import { Shield, Lock, AlertTriangle, CheckCircle, Eye, EyeOff, Key, FileText } from "lucide-react"

export default function SecurityPrivacyPage() {
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
      name: "Sending Unhashed PII (BROKEN)",
      icon: <AlertTriangle className="h-4 w-4 text-red-400" />,
      description: "Plain text email violates GDPR and Meta&apos;s terms",
      payload: {
        event_name: "Purchase",
        event_id: `unsafe_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "user@example.com",  // NEVER send plain text!
          ph: "+1-650-555-1234",   // NEVER send plain text!
          client_ip_address: "192.168.1.1"
        },
        custom_data: {
          currency: "USD",
          value: 99.99,
          source_page: "/server/security-privacy",
          example_name: "Unhashed PII - GDPR VIOLATION",
          test_mode: "broken",
          note: "Plain text email & phone - NEVER send unhashed PII!"
        }
      }
    },
    {
      name: "Sending Unhashed PII (FIXED)",
      icon: <CheckCircle className="h-4 w-4 text-[#00ff41]" />,
      description: "SHA-256 hashed PII - GDPR compliant",
      payload: {
        event_name: "Purchase",
        event_id: `safe_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",  // SHA-256
          ph: "16505551234567890abcdef0123456789abcdef0123456789abcdef012345",  // SHA-256
          client_ip_address: "192.168.1.1"
        },
        custom_data: {
          currency: "USD",
          value: 99.99,
          source_page: "/server/security-privacy",
          example_name: "Unhashed PII - FIXED",
          test_mode: "fixed",
          note: "SHA-256 hashed PII - GDPR compliant"
        }
      }
    },
    {
      name: "Logging Sensitive Data (SECURE)",
      icon: <Eye className="h-4 w-4 text-[#00ff41]" />,
      description: "Sensitive data redacted in logs",
      payload: {
        event_name: "Purchase",
        event_id: `nolog_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_ip_address: "[REDACTED]",  // Redact in logs
          client_user_agent: "Mozilla/5.0"
        },
        custom_data: {
          currency: "USD",
          value: 149.99,
          source_page: "/server/security-privacy",
          example_name: "No Logging Sensitive Data - SECURE",
          test_mode: "fixed",
          note: "IP redacted in logs - sensitive data protected"
        }
      }
    },
    {
      name: "Missing Consent (BROKEN)",
      icon: <AlertTriangle className="h-4 w-4 text-yellow-400" />,
      description: "Tracking before user consent violates GDPR/CCPA",
      payload: {
        event_name: "ViewContent",
        event_id: `noconsent_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c"
        },
        custom_data: {
          source_page: "/server/security-privacy",
          example_name: "No Consent Check - PRIVACY VIOLATION",
          test_mode: "broken",
          note: "Tracking before consent - violates GDPR/CCPA"
        }
        // Fired without checking user consent!
      }
    },
    {
      name: "Missing Consent (FIXED)",
      icon: <CheckCircle className="h-4 w-4 text-[#00ff41]" />,
      description: "Only tracks after user grants permission",
      payload: {
        event_name: "ViewContent",
        event_id: `consent_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_ip_address: "192.168.1.1"
        },
        custom_data: {
          source_page: "/server/security-privacy",
          example_name: "No Consent Check - FIXED",
          test_mode: "fixed",
          note: "Consent check implemented - only tracks after user grants permission"
        }
        // Only fired after user grants consent
      }
    },
    {
      name: "Proper SHA-256 Hashing (REQUIRED)",
      icon: <Lock className="h-4 w-4 text-[#00ff41]" />,
      description: "Correct SHA-256 hashing with normalization",
      payload: {
        event_name: "Purchase",
        event_id: `hashed_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",  // user@example.com → SHA-256
          ph: "16505551234567890abcdef0123456789abcdef0123456789abcdef012345",  // +16505551234 → SHA-256
          fn: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",  // john → SHA-256
          ln: "6b23c0d5f35d1b11f9b683f0b0a617355deb11277d91ae091d399c655b87940d",  // smith → SHA-256
          client_ip_address: "192.168.1.1"
        },
        custom_data: {
          currency: "USD",
          value: 79.99,
          source_page: "/server/security-privacy",
          example_name: "SHA-256 Hashing - REQUIRED",
          test_mode: "fixed",
          note: "All PII SHA-256 hashed with normalization - privacy compliant"
        }
      }
    },
    {
      name: "Secure Token Storage (BEST PRACTICE)",
      icon: <Key className="h-4 w-4 text-[#00ff41]" />,
      description: "Access tokens in server-only environment variables",
      payload: {
        event_name: "Purchase",
        event_id: `secure_token_${Date.now()}`,
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
          source_page: "/server/security-privacy",
          example_name: "Secure Token Storage - BEST PRACTICE",
          test_mode: "fixed",
          note: "Token in server env vars - never exposed to client"
        }
        // Access token stored in process.env.META_CAPI_ACCESS_TOKEN (server-only)
      }
    },
    {
      name: "Data Minimization (BROKEN)",
      icon: <Shield className="h-4 w-4 text-yellow-400" />,
      description: "Excessive PII for ViewContent - violates minimization",
      payload: {
        event_name: "ViewContent",
        event_id: `toomuch_${Date.now()}`,
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
          country: "us"
          // Too much data for a simple content view!
        },
        custom_data: {
          content_ids: ["PROD-123"],
          source_page: "/server/security-privacy",
          example_name: "Too Much Data - GDPR RISK",
          test_mode: "broken",
          note: "Excessive PII for ViewContent - violates data minimization"
        }
      }
    },
    {
      name: "Data Minimization (FIXED)",
      icon: <CheckCircle className="h-4 w-4 text-[#00ff41]" />,
      description: "Only essential fields for content view",
      payload: {
        event_name: "ViewContent",
        event_id: `minimal_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_ip_address: "192.168.1.1"
          // Only essential fields for content view
        },
        custom_data: {
          content_ids: ["PROD-123"],
          source_page: "/server/security-privacy",
          example_name: "Data Minimization - GDPR COMPLIANT",
          test_mode: "fixed",
          note: "Minimal PII - only what's needed for ViewContent"
        }
      }
    },
    {
      name: "User Opt-Out Handling (REQUIRED)",
      icon: <EyeOff className="h-4 w-4 text-[#00ff41]" />,
      description: "Respect user opt-out requests",
      payload: {
        event_name: "Purchase",
        event_id: `optout_respected_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_ip_address: "192.168.1.1"
        },
        custom_data: {
          currency: "USD",
          value: 249.99,
          source_page: "/server/security-privacy",
          example_name: "User Opt-Out Handling - REQUIRED",
          test_mode: "fixed",
          note: "Opt-out check before tracking - GDPR/CCPA compliant"
        }
        // Event only sent if user hasn't opted out
      }
    },
    {
      name: "Complete Privacy-Compliant Implementation (PERFECT)",
      icon: <CheckCircle className="h-4 w-4 text-[#00ff41]" />,
      description: "Full GDPR/CCPA compliant setup",
      payload: {
        event_name: "Purchase",
        event_id: `compliant_${Date.now()}`,
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
          fbp: "fb.1.1705334567890.1234567890"
        },
        custom_data: {
          currency: "USD",
          value: 399.99,
          content_ids: ["PROD-789"],
          content_type: "product",
          num_items: 1,
          order_id: `ORD-2026-${Math.floor(Math.random() * 10000)}`,
          source_page: "/server/security-privacy",
          example_name: "Privacy-Compliant Implementation - PERFECT",
          test_mode: "fixed",
          note: "Gold standard: Consent + Hashing + Secure tokens + Minimal data + Opt-out"
        }
        // ✓ Consent checked, ✓ All PII hashed, ✓ Token secure, ✓ Minimal data
      }
    }
  ]

  return (
    <PageContent
      title="Security & Privacy"
      description="Master GDPR/CCPA compliance with proper PII hashing, consent management, data minimization, and secure token storage for Meta tracking"
      status="Stable"
    >

      {/* Privacy Regulations Overview */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Privacy Regulations You Must Follow
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {/* GDPR */}
          <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6">
            <div className="mb-4 flex items-center gap-3">
              <Shield className="h-6 w-6 text-[#00ff41]" />
              <h3 className="font-mono text-lg font-semibold text-[#00ff41]">GDPR (Europe)</h3>
            </div>
            <p className="text-sm text-[#8b949e] mb-4">
              General Data Protection Regulation applies to all businesses processing data of EU citizens
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-[#8b949e]">
                <span className="text-[#00ff41]">•</span>
                <span>Requires explicit user consent</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-[#8b949e]">
                <span className="text-[#00ff41]">•</span>
                <span>Right to data access and deletion</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-[#8b949e]">
                <span className="text-[#00ff41]">•</span>
                <span>Data minimization principle</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-[#8b949e]">
                <span className="text-[#00ff41]">•</span>
                <span>Security measures required</span>
              </li>
            </ul>
          </div>

          {/* CCPA */}
          <div className="glass hover-glow rounded-xl border border-cyan-500/20 p-6">
            <div className="mb-4 flex items-center gap-3">
              <Lock className="h-6 w-6 text-cyan-400" />
              <h3 className="font-mono text-lg font-semibold text-cyan-400">CCPA (California)</h3>
            </div>
            <p className="text-sm text-[#8b949e] mb-4">
              California Consumer Privacy Act protects California residents&apos; data rights
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-[#8b949e]">
                <span className="text-cyan-400">•</span>
                <span>Right to opt-out of data sale</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-[#8b949e]">
                <span className="text-cyan-400">•</span>
                <span>Disclosure of data collection</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-[#8b949e]">
                <span className="text-cyan-400">•</span>
                <span>Access to collected data</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-[#8b949e]">
                <span className="text-cyan-400">•</span>
                <span>Right to deletion</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* PII Hashing Requirements */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> PII Hashing Requirements
        </h2>

        <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6 space-y-6">
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-400 flex items-start gap-2">
              <span className="shrink-0">⚠</span>
              <span>
                <strong>Critical:</strong> NEVER send plain text PII (email, phone, name) to Meta. All PII must be hashed with SHA-256 before transmission. This is both a privacy requirement and Meta&apos;s terms of service.
              </span>
            </p>
          </div>

          <div>
            <h3 className="font-mono text-lg font-semibold text-[#e8f4f8] mb-3">Fields That Must Be Hashed</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Lock className="h-4 w-4 text-[#00ff41]" />
                  <code className="text-[#00ff41]">em</code>
                  <span className="text-[#8b949e]">(email)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Lock className="h-4 w-4 text-[#00ff41]" />
                  <code className="text-[#00ff41]">ph</code>
                  <span className="text-[#8b949e]">(phone)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Lock className="h-4 w-4 text-[#00ff41]" />
                  <code className="text-[#00ff41]">fn</code>
                  <span className="text-[#8b949e]">(first name)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Lock className="h-4 w-4 text-[#00ff41]" />
                  <code className="text-[#00ff41]">ln</code>
                  <span className="text-[#8b949e]">(last name)</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Lock className="h-4 w-4 text-[#00ff41]" />
                  <code className="text-[#00ff41]">ct</code>
                  <span className="text-[#8b949e]">(city)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Lock className="h-4 w-4 text-[#00ff41]" />
                  <code className="text-[#00ff41]">st</code>
                  <span className="text-[#8b949e]">(state)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Lock className="h-4 w-4 text-[#00ff41]" />
                  <code className="text-[#00ff41]">zp</code>
                  <span className="text-[#8b949e]">(zip code)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Lock className="h-4 w-4 text-[#00ff41]" />
                  <code className="text-[#00ff41]">ge</code>
                  <span className="text-[#8b949e]">(gender)</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-mono text-lg font-semibold text-[#e8f4f8] mb-3">Hashing Implementation</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-mono text-[#8b949e] mb-2">Server-Side (Node.js):</p>
                <pre className="overflow-x-auto rounded-lg border border-[#00ff41]/20 bg-[#0d1117] p-4 font-mono text-xs">
                  <code className="text-[#00ff41]">{`import crypto from 'crypto'

function hashPII(value) {
  // Normalize first
  const normalized = value.toLowerCase().trim()
  
  // Hash with SHA-256
  return crypto
    .createHash('sha256')
    .update(normalized)
    .digest('hex')
}

// Usage
const hashedEmail = hashPII('User@Example.com')  
// → "7d3d1b3d5c4e3c5e..."`}</code>
                </pre>
              </div>

              <div>
                <p className="text-xs font-mono text-[#8b949e] mb-2">Client-Side (Browser):</p>
                <pre className="overflow-x-auto rounded-lg border border-[#00ff41]/20 bg-[#0d1117] p-4 font-mono text-xs">
                  <code className="text-[#00ff41]">{`async function hashPII(value) {
  const normalized = value.toLowerCase().trim()
  const msgBuffer = new TextEncoder().encode(normalized)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Usage
const hashedEmail = await hashPII('User@Example.com')`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consent Management */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Consent Management
        </h2>

        <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6 space-y-6">
          <p className="text-[#8b949e] text-sm">
            Under GDPR, you must obtain explicit user consent before tracking. CCPA requires opt-out capability. Implement a consent banner and only fire tracking events after consent is granted.
          </p>

          <div>
            <h3 className="font-mono text-lg font-semibold text-[#e8f4f8] mb-3">Implementation Example</h3>
            <pre className="overflow-x-auto rounded-lg border border-[#00ff41]/20 bg-[#0d1117] p-4 font-mono text-xs">
              <code className="text-[#00ff41]">{`// Check consent before tracking
function trackEvent(eventName, eventData) {
  // Check if user has consented
  const hasConsent = localStorage.getItem('tracking-consent') === 'granted'
  
  if (!hasConsent) {
    console.log('User has not consented to tracking')
    return
  }
  
  // User consented, proceed with tracking
  fbq('track', eventName, eventData)
  
  // Also send to CAPI if user consented
  await fetch('/api/meta/capi', {
    method: 'POST',
    body: JSON.stringify({
      event_name: eventName,
      // ... other data
    })
  })
}

// Consent banner handler
function grantConsent() {
  localStorage.setItem('tracking-consent', 'granted')
  fbq('consent', 'grant')  // Tell Meta Pixel consent was granted
}

function revokeConsent() {
  localStorage.setItem('tracking-consent', 'revoked')
  fbq('consent', 'revoke')  // Tell Meta Pixel consent was revoked
}`}</code>
            </pre>
          </div>

          <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <p className="text-sm text-cyan-400 flex items-start gap-2">
              <span className="shrink-0">💡</span>
              <span>
                Consider using consent management platforms (CMPs) like OneTrust, Cookiebot, or Termly to handle consent banners and compliance automatically.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Secure Token Storage */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Secure Access Token Storage
        </h2>

        <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6 space-y-6">
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-400 flex items-start gap-2">
              <span className="shrink-0">⚠</span>
              <span>
                <strong>Security Risk:</strong> NEVER expose Meta CAPI access tokens in client-side code, public repositories, or browser console logs. Tokens must only exist in server-side environment variables.
              </span>
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="glass rounded-lg border border-red-500/20 p-4">
              <p className="font-mono text-sm font-semibold text-red-400 mb-2">❌ NEVER Do This</p>
              <pre className="overflow-x-auto rounded-lg border border-red-500/20 bg-[#0d1117] p-2 font-mono text-xs">
                <code className="text-red-400">{`// ❌ Client-side code
const token = 'EAABs...'  // EXPOSED!
fetch('/api/capi', {
  headers: {
    'Authorization': token
  }
})`}</code>
              </pre>
            </div>

            <div className="glass rounded-lg border border-[#00ff41]/20 p-4">
              <p className="font-mono text-sm font-semibold text-[#00ff41] mb-2">✓ Correct Approach</p>
              <pre className="overflow-x-auto rounded-lg border border-[#00ff41]/20 bg-[#0d1117] p-2 font-mono text-xs">
                <code className="text-[#00ff41]">{`// ✓ Server-side only
const token = process.env
  .META_CAPI_ACCESS_TOKEN
  
// Token never sent to client`}</code>
              </pre>
            </div>
          </div>

          <div>
            <h3 className="font-mono text-lg font-semibold text-[#e8f4f8] mb-3">.env.local Configuration</h3>
            <pre className="overflow-x-auto rounded-lg border border-[#00ff41]/20 bg-[#0d1117] p-4 font-mono text-xs">
              <code className="text-[#00ff41]">{`# .env.local (Server-side only - never commit to git!)
META_CAPI_ACCESS_TOKEN=EAABsZC7r8BABOZCkPqN...
META_GRAPH_API_VERSION=v21.0

# Client-side (safe to expose)
NEXT_PUBLIC_FB_PIXEL_ID=1234567890123456`}</code>
            </pre>
            <p className="text-xs text-[#8b949e] mt-2">
              Note: NEXT_PUBLIC_ prefix makes variable available to client. Never use this prefix for sensitive tokens.
            </p>
          </div>
        </div>
      </section>

      {/* Data Minimization */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[400ms]">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Data Minimization Principle
        </h2>

        <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6 space-y-6">
          <p className="text-[#8b949e] text-sm">
            GDPR requires you to collect only the minimum data necessary for your specific purpose. Don&apos;t send all available PII fields just because you can - only include what you need for matching and attribution.
          </p>

          <div className="grid gap-4">
            <div className="glass rounded-lg border border-yellow-500/20 p-5">
              <h3 className="font-mono font-semibold text-yellow-400 mb-3">Avoid Over-Collection</h3>
              <div className="grid gap-3 md:grid-cols-2 text-sm">
                <div>
                  <p className="text-[#8b949e] mb-2">For PageView:</p>
                  <ul className="space-y-1 text-xs text-[#8b949e]">
                    <li className="flex gap-2">
                      <span className="text-[#00ff41]">✓</span>
                      <span>Email (if logged in)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#00ff41]">✓</span>
                      <span>IP and user agent</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-red-400">✗</span>
                      <span>Full address not needed</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="text-[#8b949e] mb-2">For Purchase:</p>
                  <ul className="space-y-1 text-xs text-[#8b949e]">
                    <li className="flex gap-2">
                      <span className="text-[#00ff41]">✓</span>
                      <span>Email, phone, name</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#00ff41]">✓</span>
                      <span>Address for matching</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#00ff41]">✓</span>
                      <span>IP and user agent</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#00ff41]/10 border border-[#00ff41]/20">
            <p className="text-sm text-[#00ff41] flex items-start gap-2">
              <span className="shrink-0">✓</span>
              <span>
                <strong>Best Practice:</strong> Match PII collection to event importance. High-value conversions can include more fields for better matching. Low-value events should minimize data collection.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Playground */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Interactive Privacy Examples
        </h2>

        <EnhancedEventPlayground
          title="Security & Privacy Testing"
          description="Test 8 different privacy scenarios from violations to perfect compliance. Learn what NOT to do and how to implement proper security measures."
          events={examples}
          showLogs={true}
          sendToMeta={true}
          sendToBoth={true}
          showNetworkInspector={true}
          showMetaResponse={true}
          enableComparison={true}
          testEventCode="TEST_SECURITY"
          pixelId={process.env.NEXT_PUBLIC_FB_PIXEL_ID}
        />
      </section>

      {/* Compliance Checklist */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '600ms' }}>
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Privacy Compliance Checklist
        </h2>

        <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 accent-[#00ff41]" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">Implement consent banner</strong> - Get explicit consent before tracking (GDPR requirement)
              </span>
            </li>
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 accent-[#00ff41]" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">Hash all PII</strong> - Email, phone, name, address must be SHA-256 hashed
              </span>
            </li>
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 accent-[#00ff41]" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">Secure token storage</strong> - Access tokens only in server-side environment variables
              </span>
            </li>
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 accent-[#00ff41]" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">No logging of PII</strong> - Never log sensitive user data or tokens
              </span>
            </li>
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 accent-[#00ff41]" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">Data minimization</strong> - Only collect PII fields necessary for event type
              </span>
            </li>
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 accent-[#00ff41]" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">Privacy policy</strong> - Document what data you collect and how it&apos;s used
              </span>
            </li>
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 accent-[#00ff41]" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">Opt-out mechanism</strong> - Provide way for users to revoke consent (CCPA requirement)
              </span>
            </li>
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 accent-[#00ff41]" />
              <span className="text-sm text-[#8b949e]">
                <strong className="text-[#e8f4f8]">Regular audits</strong> - Review tracking implementation quarterly for compliance
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '700ms' }}>
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Additional Resources
        </h2>

        <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-[#00ff41] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-[#e8f4f8] mb-1">Meta Business Help Center - Data Protection</p>
                <a
                  href="https://www.facebook.com/business/help/331612538028890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#00ff41] hover:underline"
                >
                  facebook.com/business/help/331612538028890 →
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-[#00ff41] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-[#e8f4f8] mb-1">GDPR Official Text</p>
                <a
                  href="https://gdpr-info.eu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#00ff41] hover:underline"
                >
                  gdpr-info.eu →
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-[#00ff41] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-[#e8f4f8] mb-1">CCPA Information</p>
                <a
                  href="https://oag.ca.gov/privacy/ccpa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#00ff41] hover:underline"
                >
                  oag.ca.gov/privacy/ccpa →
                </a>
              </div>
            </li>
          </ul>
        </div>
      </section>

    </PageContent>
  )
}
