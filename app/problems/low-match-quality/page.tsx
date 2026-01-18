"use client"

import { PageContent } from "@/components/page-content"
import { EnhancedEventPlayground } from "@/components/enhanced-event-playground"
import { AlertTriangle, Shield, Hash, CheckCircle2, XCircle, Users, Lock, Zap } from "lucide-react"

export default function LowMatchQualityPage() {
  // Get site URL from environment
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://meta-tracking-lab.vercel.app'

  // 8 comprehensive examples demonstrating PII hashing and normalization
  const matchQualityExamples = [
    {
      name: "Unhashed Email (CRITICAL)",
      icon: <XCircle className="h-4 w-4 text-red-400 icon-spin-hover" />,
      description: "Plaintext email → GDPR violation + 0% match rate",
      brokenPayload: {
        event_name: "CompleteRegistration",
        event_time: Math.floor(Date.now() / 1000),
        user_data: {
          email: "user@example.com"  // NOT HASHED! GDPR violation!
        },
        custom_data: {
          source_page: "/problems/low-match-quality",
          example_name: "Unhashed Email - CRITICAL",
          test_mode: "broken",
          note: "Plain text email - GDPR violation + 0% match"
        }
      },
      fixedPayload: {
        event_name: "CompleteRegistration",
        event_id: `lead_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514"  // SHA-256 hash
        },
        custom_data: {
          source_page: "/problems/low-match-quality",
          example_name: "Unhashed Email - FIXED",
          test_mode: "fixed",
          note: "SHA-256 hashed email - GDPR compliant + high match"
        }
      }
    },
    {
      name: "Not Lowercased Before Hash",
      icon: <AlertTriangle className="h-4 w-4 text-yellow-400 icon-spin-hover" />,
      description: "Email uppercase before hashing → wrong hash → 0% match",
      brokenPayload: {
        event_name: "CompleteRegistration",
        event_id: `lead_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        user_data: {
          // Hash of "USER@EXAMPLE.COM" instead of "user@example.com"
          em: "8d5e957f297893487bd98fa830fa6413a9d6e2a6d51e1e5b3d4230d5d8f5b5c3"  // Wrong hash!
        },
        custom_data: {
          source_page: "/problems/low-match-quality",
          example_name: "Not Lowercased - BROKEN",
          test_mode: "broken",
          note: "Hash of uppercase email - wrong hash = 0% match"
        }
      },
      fixedPayload: {
        event_name: "CompleteRegistration",
        event_id: `lead_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514"  // Correct: lowercase first!
        },
        custom_data: {
          source_page: "/problems/low-match-quality",
          example_name: "Not Lowercased - FIXED",
          test_mode: "fixed",
          note: "Lowercase before hash - correct hash = high match"
        }
      }
    },
    {
      name: "Spaces Not Trimmed",
      icon: <AlertTriangle className="h-4 w-4 text-yellow-400 icon-spin-hover" />,
      description: "Leading/trailing spaces → different hash → no match",
      brokenPayload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        user_data: {
          // Hash of " user@example.com " (with spaces)
          em: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"  // Wrong!
        },
        custom_data: {
          currency: "USD",
          value: 99.99,
          source_page: "/problems/low-match-quality",
          example_name: "Spaces Not Trimmed - BROKEN",
          test_mode: "broken",
          note: "Hash of ' user@example.com ' with spaces - wrong hash"
        }
      },
      fixedPayload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514"  // Trimmed first!
        },
        custom_data: {
          currency: "USD",
          value: 99.99,
          source_page: "/problems/low-match-quality",
          example_name: "Spaces Not Trimmed - FIXED",
          test_mode: "fixed",
          note: "Trimmed before hash - correct match"
        }
      }
    },
    {
      name: "Phone Format Issues",
      icon: <AlertTriangle className="h-4 w-4 text-yellow-400 icon-spin-hover" />,
      description: "Phone with dashes/spaces → wrong hash → no match",
      brokenPayload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        user_data: {
          // Hash of "555-123-4567" instead of "5551234567"
          ph: "c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4"  // Wrong!
        },
        custom_data: {
          currency: "USD",
          value: 149.99,
          source_page: "/problems/low-match-quality",
          example_name: "Phone Format Issues - BROKEN",
          test_mode: "broken",
          note: "Hash of '555-123-4567' with dashes - wrong format"
        }
      },
      fixedPayload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        user_data: {
          ph: "254d69f6b8f6a6e9c2b1c573b0885c9b6f3f3f3c8c0f3f3f3f3f3f3f3f3f3f3"  // Digits only!
        },
        custom_data: {
          currency: "USD",
          value: 149.99,
          source_page: "/problems/low-match-quality",
          example_name: "Phone Format Issues - FIXED",
          test_mode: "fixed",
          note: "Digits only before hash - correct match"
        }
      }
    },
    {
      name: "Single Field Only (Poor)",
      icon: <Users className="h-4 w-4 text-yellow-400 icon-spin-hover" />,
      description: "Only email → Match quality ~3/10",
      brokenPayload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514"
          // Only 1 field = low match quality (3-4/10)
        },
        custom_data: {
          currency: "USD",
          value: 99.99,
          source_page: "/problems/low-match-quality",
          example_name: "Single Field Only - POOR",
          test_mode: "broken",
          note: "Only email - match quality ~3/10"
        }
      },
      fixedPayload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514",
          ph: "254d69f6b8f6a6e9c2b1c573b0885c9b6f3f3f3c8c0f3f3f3f3f3f3f3f3f3f3",
          fn: "96d9632f363564cc3032521409cf22a852f2032eec099ed5967c0d000cec607a",  // "john"
          ln: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"   // "doe"
          // 4 fields = much better match! (7-8/10)
        },
        custom_data: {
          currency: "USD",
          value: 99.99,
          source_page: "/problems/low-match-quality",
          example_name: "Single Field Only - IMPROVED",
          test_mode: "fixed",
          note: "4 PII fields - match quality ~7-8/10"
        }
      }
    },
    {
      name: "Email + Phone (GOOD)",
      icon: <CheckCircle2 className="h-4 w-4 text-[#00ff41] icon-spin-hover" />,
      description: "2 fields → Match quality ~7/10",
      brokenPayload: {
        event_name: "CompleteRegistration",
        event_id: `lead_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514"
          // Only email = 3-4/10 match
        },
        custom_data: {
          source_page: "/problems/low-match-quality",
          example_name: "Email Only - ~3/10 Match",
          test_mode: "broken",
          note: "Only 1 field - low match quality"
        }
      },
      fixedPayload: {
        event_name: "CompleteRegistration",
        event_id: `lead_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514",
          ph: "254d69f6b8f6a6e9c2b1c573b0885c9b6f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3"
          // Email + phone = 7-8/10 match!
        },
        custom_data: {
          source_page: "/problems/low-match-quality",
          example_name: "Email + Phone - ~7/10 Match GOOD",
          test_mode: "fixed",
          note: "2 fields (em + ph) - good match quality"
        }
      }
    },
    {
      name: "Full User Data (BEST)",
      icon: <CheckCircle2 className="h-4 w-4 text-[#00ff41] icon-spin-hover" />,
      description: "All fields → Match quality 9-10/10 (optimal)",
      brokenPayload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514",
          ph: "254d69f6b8f6a6e9c2b1c573b0885c9b6f3f3f3c8c0f3f3f3f3f3f3f3f3f3f3"
          // Only 2 fields = 7/10
        },
        custom_data: {
          currency: "USD",
          value: 199.99,
          source_page: "/problems/low-match-quality",
          example_name: "2 Fields Only - ~7/10 Match",
          test_mode: "broken",
          note: "em + ph only - decent but not optimal"
        }
      },
      fixedPayload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514",      // email
          ph: "254d69f6b8f6a6e9c2b1c573b0885c9b6f3f3f3c8c0f3f3f3f3f3f3f3f3f3f3",      // phone
          fn: "96d9632f363564cc3032521409cf22a852f2032eec099ed5967c0d000cec607a",      // first name
          ln: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",      // last name
          ct: "4e0c3eb61a6d1f9d1e9b0c0d8f5c1f7d8e1f9d1e9b0c0d8f5c1f7d8e1f9d1e",      // city
          st: "8e0c3eb61a6d1f9d1e9b0c0d8f5c1f7d8e1f9d1e9b0c0d8f5c1f7d8e1f9d1e",      // state
          zp: "7e0c3eb61a6d1f9d1e9b0c0d8f5c1f7d8e1f9d1e9b0c0d8f5c1f7d8e1f9d1e",      // zip
          country: "6e0c3eb61a6d1f9d1e9b0c0d8f5c1f7d8e1f9d1e9b0c0d8f5c1f7d8e1f9d1e", // country
          external_id: "user_12345"  // NOT hashed for external_id!
          // All fields = 9-10/10 match quality!
        },
        custom_data: {
          currency: "USD",
          value: 199.99,
          source_page: "/problems/low-match-quality",
          example_name: "Full User Data - BEST ~9-10/10",
          test_mode: "fixed",
          note: "All 9 fields - maximum match quality!"
        }
      }
    },
    {
      name: "External ID (CRM Link)",
      icon: <Lock className="h-4 w-4 text-[#00d9ff] icon-spin-hover" />,
      description: "Links online + offline conversions via your user ID",
      brokenPayload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514"
          // No external_id = can't link to offline conversions
        },
        custom_data: {
          currency: "USD",
          value: 299.99,
          source_page: "/problems/low-match-quality",
          example_name: "No External ID - CRM UNLINKED",
          test_mode: "broken",
          note: "Can't link to offline/CRM data without external_id"
        }
      },
      fixedPayload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514",
          external_id: "crm_user_12345"  // NOT hashed! Use your internal ID
          // Links this online event to offline store purchases, CRM data, etc.
        },
        custom_data: {
          currency: "USD",
          value: 299.99,
          source_page: "/problems/low-match-quality",
          example_name: "External ID - CRM LINKED",
          test_mode: "fixed",
          note: "external_id links online & offline conversions"
        }
      }
    }
  ]

  return (
    <PageContent
      title="Low Match Quality"
      description="Master PII hashing, normalization, and user data optimization for maximum event matching and attribution accuracy"
      status="Stable"
    >

      {/* The Problem */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> The Match Quality Problem
        </h2>

        <div className="space-y-4">
          <p className="leading-relaxed text-[#8b949e] text-sm md:text-base">
            Match quality determines how well Meta can connect your events to real Facebook/Instagram users. Low match quality means Meta can&apos;t attribute conversions correctly, leading to wasted ad spend, poor optimization, and inaccurate reporting. The primary cause? <span className="text-red-400 font-semibold">Incorrect PII handling</span>.
          </p>

          <div className="border-gradient">
            <div className="border-gradient-content glass-strong p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="font-mono text-xl font-bold text-red-400">Business Impact</h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="glass hover-glow rounded-lg p-4 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="h-5 w-5 text-red-400" />
                    <p className="font-mono font-semibold text-red-400">Poor Attribution</p>
                  </div>
                  <p className="text-sm text-[#8b949e]">
                    Match quality 2/10 → 80% of conversions can&apos;t be attributed to the right users
                  </p>
                </div>

                <div className="glass hover-glow rounded-lg p-4 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="h-5 w-5 text-red-400" />
                    <p className="font-mono font-semibold text-red-400">Wasted Ad Spend</p>
                  </div>
                  <p className="text-sm text-[#8b949e]">
                    Meta&apos;s AI can&apos;t optimize properly → shows ads to wrong audiences
                  </p>
                </div>

                <div className="glass hover-glow rounded-lg p-4 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="h-5 w-5 text-red-400" />
                    <p className="font-mono font-semibold text-red-400">Inaccurate ROAS</p>
                  </div>
                  <p className="text-sm text-[#8b949e]">
                    Can&apos;t measure true return on ad spend → bad business decisions
                  </p>
                </div>

                <div className="glass hover-glow rounded-lg p-4 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="h-5 w-5 text-red-400" />
                    <p className="font-mono font-semibold text-red-400">GDPR Violations</p>
                  </div>
                  <p className="text-sm text-[#8b949e]">
                    Sending unhashed PII → potential €20M fines + legal issues
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Match Quality Scale */}
          <div className="glass-strong rounded-xl p-6 border border-[#00d9ff]/20">
            <h4 className="font-mono font-semibold text-[#00d9ff] mb-4">Match Quality Scale</h4>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-mono text-[#8b949e]">Poor (1-3/10) - Email only, unhashed</span>
                  <span className="text-sm font-mono text-red-400">30% match rate</span>
                </div>
                <div className="w-full bg-[#151b26] rounded-full h-3">
                  <div className="bg-red-500 h-3 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-mono text-[#8b949e]">Fair (4-6/10) - Email hashed, 1-2 fields</span>
                  <span className="text-sm font-mono text-yellow-400">60% match rate</span>
                </div>
                <div className="w-full bg-[#151b26] rounded-full h-3">
                  <div className="bg-yellow-500 h-3 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-mono text-[#8b949e]">Good (7-8/10) - Email + phone hashed</span>
                  <span className="text-sm font-mono text-[#00ff41]">80% match rate</span>
                </div>
                <div className="w-full bg-[#151b26] rounded-full h-3">
                  <div className="bg-[#00ff41] h-3 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-mono text-[#8b949e]">Excellent (9-10/10) - All fields hashed</span>
                  <span className="text-sm font-mono text-[#00ff41]">95% match rate</span>
                </div>
                <div className="w-full bg-[#151b26] rounded-full h-3 pulse-glow">
                  <div className="bg-gradient-to-r from-[#00ff41] to-[#00d9ff] h-3 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PII Hashing & Normalization */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> PII Hashing & Normalization
        </h2>

        <div className="space-y-6">
          <p className="leading-relaxed text-[#8b949e] text-sm md:text-base">
            Meta requires all Personally Identifiable Information (PII) to be hashed using SHA-256 before sending. But hashing alone isn&apos;t enough—you must <span className="text-[#00ff41] font-semibold">normalize</span> the data first, or you&apos;ll generate different hashes than Meta&apos;s system, resulting in zero matches.
          </p>

          {/* Normalization Rules */}
          <div className="glass-strong hover-border-glow rounded-xl border border-[#00ff41]/20 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-[#00ff41]/10">
                <Shield className="h-5 w-5 text-[#00ff41]" />
              </div>
              <h3 className="font-mono text-lg font-semibold text-[#00ff41]">Normalization Rules (CRITICAL)</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-[#00ff41] font-mono mt-1">1.</span>
                <div>
                  <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Trim whitespace</p>
                  <code className="text-xs text-[#8b949e]">email.trim()</code>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-[#00ff41] font-mono mt-1">2.</span>
                <div>
                  <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Convert to lowercase</p>
                  <code className="text-xs text-[#8b949e]">email.toLowerCase()</code>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-[#00ff41] font-mono mt-1">3.</span>
                <div>
                  <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Phone: remove all non-digits</p>
                  <code className="text-xs text-[#8b949e]">phone.replace(/\D/g, &apos;&apos;)</code>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-[#00ff41] font-mono mt-1">4.</span>
                <div>
                  <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Hash with SHA-256</p>
                  <code className="text-xs text-[#8b949e]">crypto.createHash(&apos;sha256&apos;).update(normalized).digest(&apos;hex&apos;)</code>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Comparison */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Wrong */}
            <div className="glass rounded-xl p-5 border border-red-500/20">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="h-5 w-5 text-red-400" />
                <h3 className="font-mono font-semibold text-red-400">Wrong Normalization</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-mono text-[#8b949e] mb-1">Input:</p>
                  <code className="text-sm text-red-400">&quot; User@Example.com &quot;</code>
                </div>

                <div>
                  <p className="text-xs font-mono text-[#8b949e] mb-1">Hash directly (WRONG):</p>
                  <pre className="text-xs font-mono text-red-400 bg-[#0d1117] rounded p-2 overflow-x-auto">
                    8d5e957f297893487bd98...
                  </pre>
                </div>

                <div className="bg-red-500/10 rounded p-2">
                  <p className="text-xs text-red-400">❌ Different hash = 0% match</p>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="glass rounded-xl p-5 border border-[#00ff41]/20">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-5 w-5 text-[#00ff41]" />
                <h3 className="font-mono font-semibold text-[#00ff41]">Correct Normalization</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-mono text-[#8b949e] mb-1">Input:</p>
                  <code className="text-sm text-[#00ff41]">&quot; User@Example.com &quot;</code>
                </div>

                <div>
                  <p className="text-xs font-mono text-[#8b949e] mb-1">Normalize then hash:</p>
                  <code className="text-xs text-[#8b949e]">trim() → toLowerCase() → hash()</code>
                </div>

                <div>
                  <p className="text-xs font-mono text-[#8b949e] mb-1">Result:</p>
                  <pre className="text-xs font-mono text-[#00ff41] bg-[#0d1117] rounded p-2 overflow-x-auto">
                    b4c9a289323b21a01c3e...
                  </pre>
                </div>

                <div className="bg-[#00ff41]/10 rounded p-2">
                  <p className="text-xs text-[#00ff41]">✓ Same hash as Meta = 95% match</p>
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
          {/* Step 1: Normalization Function */}
          <div className="glass-strong hover-border-glow rounded-xl p-6 border border-[#00ff41]/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 flex items-center justify-center">
                <span className="font-mono text-[#00ff41] font-bold">1</span>
              </div>
              <h3 className="font-mono text-lg font-semibold text-[#e8f4f8]">Create Normalization Helpers</h3>
            </div>

            <div className="bg-[#0d1117] rounded-lg p-4 border border-[#00ff41]/20">
              <p className="text-xs font-mono text-[#00ff41] mb-2">JavaScript/TypeScript:</p>
              <pre className="text-xs font-mono text-[#8b949e] overflow-x-auto">
                {`import crypto from 'crypto'

// Normalize and hash email
function hashEmail(email: string): string {
  const normalized = email.trim().toLowerCase()
  return crypto.createHash('sha256').update(normalized).digest('hex')
}

// Normalize and hash phone (remove all non-digits, include country code)
function hashPhone(phone: string): string {
  const normalized = phone.replace(/\\D/g, '')  // Remove all non-digits
  return crypto.createHash('sha256').update(normalized).digest('hex')
}

// Normalize and hash name
function hashName(name: string): string {
  const normalized = name.trim().toLowerCase().replace(/\\s+/g, '')  // Remove spaces
  return crypto.createHash('sha256').update(normalized).digest('hex')
}

// Generic hash for city, state, zip, country
function hashField(value: string): string {
  const normalized = value.trim().toLowerCase()
  return crypto.createHash('sha256').update(normalized).digest('hex')
}`}
              </pre>
            </div>
          </div>

          {/* Step 2: Build User Data */}
          <div className="glass-strong hover-border-glow rounded-xl p-6 border border-[#00ff41]/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 flex items-center justify-center">
                <span className="font-mono text-[#00ff41] font-bold">2</span>
              </div>
              <h3 className="font-mono text-lg font-semibold text-[#e8f4f8]">Build Properly Hashed user_data</h3>
            </div>

            <div className="bg-[#0d1117] rounded-lg p-4 border border-[#00ff41]/20">
              <p className="text-xs font-mono text-[#00ff41] mb-2">Example Usage:</p>
              <pre className="text-xs font-mono text-[#8b949e] overflow-x-auto">
                {`const userData = {
  em: hashEmail(userEmail),              // email
  ph: hashPhone(userPhone),              // phone
  fn: hashName(firstName),               // first name
  ln: hashName(lastName),                // last name
  ct: hashField(city),                   // city
  st: hashField(state),                  // state
  zp: hashField(zipCode),                // zip code
  country: hashField(countryCode),       // country (2-letter ISO)
  external_id: userId,                   // DON'T hash external_id!
  client_ip_address: req.ip,             // User's IP (CAPI only)
  client_user_agent: req.headers['user-agent']  // User agent (CAPI only)
}

// Send to Meta
fbq('track', 'Purchase', { value: 99.99, currency: 'USD' }, {
  eventID: eventId,
  em: userData.em,  // Can pass hashed PII to Pixel
  ph: userData.ph
})`}
              </pre>
            </div>
          </div>

          {/* Step 3: Field Priority */}
          <div className="glass-strong hover-border-glow rounded-xl p-6 border border-[#00ff41]/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 flex items-center justify-center">
                <span className="font-mono text-[#00ff41] font-bold">3</span>
              </div>
              <h3 className="font-mono text-lg font-semibold text-[#e8f4f8]">Field Priority (Most → Least Important)</h3>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-[#00ff41]/10 rounded border-l-4 border-[#00ff41]">
                <span className="font-mono text-[#00ff41] font-bold">High</span>
                <span className="text-sm text-[#e8f4f8]">Email (em) + Phone (ph)</span>
                <span className="text-xs text-[#8b949e] ml-auto">→ 7-8/10 match</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#00ff41]/5 rounded border-l-4 border-[#00ff41]/50">
                <span className="font-mono text-[#00ff41] font-bold">Med</span>
                <span className="text-sm text-[#e8f4f8]">First Name (fn) + Last Name (ln)</span>
                <span className="text-xs text-[#8b949e] ml-auto">→ Boost to 8-9/10</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#00ff41]/5 rounded border-l-4 border-[#00ff41]/30">
                <span className="font-mono text-[#00ff41] font-bold">Low</span>
                <span className="text-sm text-[#e8f4f8]">Address (ct, st, zp, country)</span>
                <span className="text-xs text-[#8b949e] ml-auto">→ Boost to 9-10/10</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#00d9ff]/10 rounded border-l-4 border-[#00d9ff]">
                <span className="font-mono text-[#00d9ff] font-bold">Special</span>
                <span className="text-sm text-[#e8f4f8]">External ID (external_id)</span>
                <span className="text-xs text-[#8b949e] ml-auto">→ Links online + offline</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Testing Playground */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Interactive Match Quality Testing
        </h2>

        <div className="glass-strong rounded-xl p-6 border border-[#00d9ff]/20 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Hash className="h-5 w-5 text-[#00d9ff]" />
            <h4 className="font-mono font-semibold text-[#00d9ff]">Live PII Hashing Demonstration</h4>
          </div>
          <p className="text-sm text-[#8b949e] mb-3">
            Each example below sends REAL events to Meta with different levels of PII quality. Watch how match quality changes based on the data you provide!
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-xs text-[#8b949e]">
              <span className="text-[#00ff41] font-mono mt-0.5">›</span>
              <span><span className="text-red-400 font-semibold">Broken mode:</span> Shows common PII mistakes (unhashed, wrong format, missing fields)</span>
            </li>
            <li className="flex items-start gap-2 text-xs text-[#8b949e]">
              <span className="text-[#00ff41] font-mono mt-0.5">›</span>
              <span><span className="text-[#00ff41] font-semibold">Fixed mode:</span> Shows properly hashed and normalized PII</span>
            </li>
            <li className="flex items-start gap-2 text-xs text-[#8b949e]">
              <span className="text-[#00ff41] font-mono mt-0.5">›</span>
              <span>View Network Inspector to see exact hashes being sent</span>
            </li>
            <li className="flex items-start gap-2 text-xs text-[#8b949e]">
              <span className="text-[#00ff41] font-mono mt-0.5">›</span>
              <span>Check Meta Events Manager to verify match quality scores</span>
            </li>
          </ul>
        </div>

        <EnhancedEventPlayground
          title="PII Hashing & Match Quality Test Suite - 8 Scenarios"
          description="Each scenario demonstrates a different aspect of PII handling. Compare broken vs fixed implementations and see real match quality scores."
          events={matchQualityExamples}
          showLogs={true}
          sendToMeta={true}
          sendToBoth={true}
          showNetworkInspector={true}
          showMetaResponse={true}
          testEventCode="TEST_MATCH"
          pixelId={process.env.NEXT_PUBLIC_FB_PIXEL_ID}
        />
      </section>

      {/* Field Reference Table */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[400ms]">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Complete Field Reference
        </h2>

        <div className="glass-strong rounded-xl border border-[#00ff41]/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#00ff41]/10 border-b border-[#00ff41]/20">
                <tr>
                  <th className="text-left p-3 font-mono text-xs text-[#00ff41]">Field</th>
                  <th className="text-left p-3 font-mono text-xs text-[#00ff41]">Parameter</th>
                  <th className="text-left p-3 font-mono text-xs text-[#00ff41]">Normalize?</th>
                  <th className="text-left p-3 font-mono text-xs text-[#00ff41]">Hash?</th>
                  <th className="text-left p-3 font-mono text-xs text-[#00ff41]">Example</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#00ff41]/10">
                <tr>
                  <td className="p-3 text-sm text-[#e8f4f8]">Email</td>
                  <td className="p-3 text-sm font-mono text-[#00d9ff]">em</td>
                  <td className="p-3 text-xs text-[#8b949e]">trim, lowercase</td>
                  <td className="p-3 text-xs text-[#00ff41]">Yes (SHA-256)</td>
                  <td className="p-3 text-xs font-mono text-[#8b949e]">user@example.com</td>
                </tr>
                <tr className="bg-[#00ff41]/5">
                  <td className="p-3 text-sm text-[#e8f4f8]">Phone</td>
                  <td className="p-3 text-sm font-mono text-[#00d9ff]">ph</td>
                  <td className="p-3 text-xs text-[#8b949e]">digits only</td>
                  <td className="p-3 text-xs text-[#00ff41]">Yes (SHA-256)</td>
                  <td className="p-3 text-xs font-mono text-[#8b949e]">15551234567</td>
                </tr>
                <tr>
                  <td className="p-3 text-sm text-[#e8f4f8]">First Name</td>
                  <td className="p-3 text-sm font-mono text-[#00d9ff]">fn</td>
                  <td className="p-3 text-xs text-[#8b949e]">trim, lowercase, no spaces</td>
                  <td className="p-3 text-xs text-[#00ff41]">Yes (SHA-256)</td>
                  <td className="p-3 text-xs font-mono text-[#8b949e]">john</td>
                </tr>
                <tr className="bg-[#00ff41]/5">
                  <td className="p-3 text-sm text-[#e8f4f8]">Last Name</td>
                  <td className="p-3 text-sm font-mono text-[#00d9ff]">ln</td>
                  <td className="p-3 text-xs text-[#8b949e]">trim, lowercase, no spaces</td>
                  <td className="p-3 text-xs text-[#00ff41]">Yes (SHA-256)</td>
                  <td className="p-3 text-xs font-mono text-[#8b949e]">doe</td>
                </tr>
                <tr>
                  <td className="p-3 text-sm text-[#e8f4f8]">City</td>
                  <td className="p-3 text-sm font-mono text-[#00d9ff]">ct</td>
                  <td className="p-3 text-xs text-[#8b949e]">trim, lowercase</td>
                  <td className="p-3 text-xs text-[#00ff41]">Yes (SHA-256)</td>
                  <td className="p-3 text-xs font-mono text-[#8b949e]">new york</td>
                </tr>
                <tr className="bg-[#00ff41]/5">
                  <td className="p-3 text-sm text-[#e8f4f8]">State</td>
                  <td className="p-3 text-sm font-mono text-[#00d9ff]">st</td>
                  <td className="p-3 text-xs text-[#8b949e]">trim, lowercase</td>
                  <td className="p-3 text-xs text-[#00ff41]">Yes (SHA-256)</td>
                  <td className="p-3 text-xs font-mono text-[#8b949e]">ny</td>
                </tr>
                <tr>
                  <td className="p-3 text-sm text-[#e8f4f8]">Zip Code</td>
                  <td className="p-3 text-sm font-mono text-[#00d9ff]">zp</td>
                  <td className="p-3 text-xs text-[#8b949e]">digits only</td>
                  <td className="p-3 text-xs text-[#00ff41]">Yes (SHA-256)</td>
                  <td className="p-3 text-xs font-mono text-[#8b949e]">10001</td>
                </tr>
                <tr className="bg-[#00ff41]/5">
                  <td className="p-3 text-sm text-[#e8f4f8]">Country</td>
                  <td className="p-3 text-sm font-mono text-[#00d9ff]">country</td>
                  <td className="p-3 text-xs text-[#8b949e]">2-letter ISO, lowercase</td>
                  <td className="p-3 text-xs text-[#00ff41]">Yes (SHA-256)</td>
                  <td className="p-3 text-xs font-mono text-[#8b949e]">us</td>
                </tr>
                <tr>
                  <td className="p-3 text-sm text-[#e8f4f8]">External ID</td>
                  <td className="p-3 text-sm font-mono text-[#00d9ff]">external_id</td>
                  <td className="p-3 text-xs text-[#8b949e]">none</td>
                  <td className="p-3 text-xs text-red-400">NO</td>
                  <td className="p-3 text-xs font-mono text-[#8b949e]">user_12345</td>
                </tr>
                <tr className="bg-[#00ff41]/5">
                  <td className="p-3 text-sm text-[#e8f4f8]">Client IP</td>
                  <td className="p-3 text-sm font-mono text-[#00d9ff]">client_ip_address</td>
                  <td className="p-3 text-xs text-[#8b949e]">none</td>
                  <td className="p-3 text-xs text-red-400">NO</td>
                  <td className="p-3 text-xs font-mono text-[#8b949e]">1.2.3.4</td>
                </tr>
                <tr>
                  <td className="p-3 text-sm text-[#e8f4f8]">User Agent</td>
                  <td className="p-3 text-sm font-mono text-[#00d9ff]">client_user_agent</td>
                  <td className="p-3 text-xs text-[#8b949e]">none</td>
                  <td className="p-3 text-xs text-red-400">NO</td>
                  <td className="p-3 text-xs font-mono text-[#8b949e]">Mozilla/5.0...</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Best Practices for Maximum Match Quality
        </h2>

        <div className="glass-strong hover-border-glow rounded-xl border border-[#00ff41]/20 p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#00ff41] mt-1 shrink-0" />
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Always Send Email + Phone Minimum</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  This combination gives you 7-8/10 match quality. Single field = 3-4/10 (unacceptable).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#00ff41] mt-1 shrink-0" />
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Normalize BEFORE Hashing</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Hash(&quot;User@Example.com&quot;) ≠ Hash(&quot;user@example.com&quot;). Normalize first or get 0% matches.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#00ff41] mt-1 shrink-0" />
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Use SHA-256 Only</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Meta requires SHA-256. MD5, SHA-1, or other algorithms won&apos;t work.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#00ff41] mt-1 shrink-0" />
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Include Phone Country Code</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Use full international format: 15551234567 (not 5551234567). Include country code for better matching.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#00ff41] mt-1 shrink-0" />
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Add Full Address When Available</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  City, state, zip, country boost match quality to 9-10/10. Especially important for high-value purchases.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#00ff41] mt-1 shrink-0" />
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Use external_id for CRM Integration</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Links online events to offline conversions, in-store purchases, phone orders, etc. DO NOT hash external_id!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#00ff41] mt-1 shrink-0" />
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Test in Meta Events Manager</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Send test events and check the &quot;Event Match Quality&quot; column. Aim for 8+ consistently.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#00ff41] mt-1 shrink-0" />
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Hash Server-Side When Possible</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Hashing on the server is more secure than client-side. Send plaintext to your server, hash there, then send to CAPI.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Topics */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '600ms' }}>
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Related Topics
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <a href="/problems/duplicate-events" className="block">
            <div className="glass hover-lift rounded-xl border border-[#00ff41]/20 p-5 h-full">
              <h3 className="font-mono text-[#00ff41] font-semibold mb-2">Duplicate Events</h3>
              <p className="text-sm text-[#8b949e] mb-3">
                Learn how to use event_id for deduplication when sending the same event to both Pixel and CAPI
              </p>
              <code className="text-xs text-[#00d9ff] font-mono">→ /problems/duplicate-events</code>
            </div>
          </a>

          <a href="/problems/security-privacy" className="block">
            <div className="glass hover-lift rounded-xl border border-[#00ff41]/20 p-5 h-full">
              <h3 className="font-mono text-[#00ff41] font-semibold mb-2">Security & Privacy</h3>
              <p className="text-sm text-[#8b949e] mb-3">
                Deep dive into GDPR compliance, data retention, and secure PII handling best practices
              </p>
              <code className="text-xs text-[#00d9ff] font-mono">→ /problems/security-privacy</code>
            </div>
          </a>
        </div>
      </section>

    </PageContent>
  )
}
