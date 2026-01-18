"use client"

import { PageContent } from "@/components/page-content"
import { EnhancedEventPlayground } from "@/components/enhanced-event-playground"
import { DollarSign, AlertCircle, CheckCircle2, XCircle, TrendingDown, Calculator, Globe, Zap, Ban } from "lucide-react"

export default function PurchaseMismatchPage() {
  // Get site URL from environment
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://meta-tracking-lab.vercel.app'

  // Refactored: Flattened list of broken and fixed scenarios
  const purchaseExamples = [
    // 1. Value as String
    {
      name: "Value as String (Broken)",
      icon: <XCircle className="h-4 w-4 text-red-500" />,
      description: "Sends '99.99' as string • Meta rejects",
      payload: {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        custom_data: {
          currency: "USD",
          value: "99.99",
          source_page: "/problems/purchase-mismatch",
          example_name: "Value as String - BROKEN",
          note: "String '99.99' instead of number - Meta may reject",
          test_mode: "broken"
        }
      }
    },
    {
      name: "Value as String (Fixed)",
      icon: <CheckCircle2 className="h-4 w-4 text-[#00ff41]" />,
      description: "Sends 99.99 as number • Correct",
      payload: {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        custom_data: {
          currency: "USD",
          value: 99.99,
          source_page: "/problems/purchase-mismatch",
          example_name: "Value as String - FIXED",
          note: "Number 99.99 - correct type",
          test_mode: "fixed"
        }
      }
    },

    // 2. Missing Currency
    {
      name: "Missing Currency (Broken)",
      icon: <XCircle className="h-4 w-4 text-red-500" />,
      description: "Value without currency • No ROAS",
      payload: {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        custom_data: {
          value: 149.99,
          source_page: "/problems/purchase-mismatch",
          example_name: "Missing Currency - BROKEN",
          note: "No currency - Meta can't calculate ROAS",
          test_mode: "broken"
        }
      }
    },
    {
      name: "Missing Currency (Fixed)",
      icon: <CheckCircle2 className="h-4 w-4 text-[#00ff41]" />,
      description: "Currency USD added • Correct",
      payload: {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        custom_data: {
          currency: "USD",
          value: 149.99,
          source_page: "/problems/purchase-mismatch",
          example_name: "Missing Currency - FIXED",
          note: "Currency added - proper ROAS calculation",
          test_mode: "fixed"
        }
      }
    },

    // 3. Wrong Currency Code
    {
      name: "Wrong Currency Code (Broken)",
      icon: <AlertCircle className="h-4 w-4 text-yellow-500" />,
      description: "Sends 'US' instead of 'USD' • Invalid",
      payload: {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        custom_data: {
          currency: "US",
          value: 199.99,
          source_page: "/problems/purchase-mismatch",
          example_name: "Wrong Currency Code - BROKEN",
          note: "'US' instead of 'USD' - invalid ISO 4217 code",
          test_mode: "broken"
        }
      }
    },
    {
      name: "Wrong Currency Code (Fixed)",
      icon: <CheckCircle2 className="h-4 w-4 text-[#00ff41]" />,
      description: "Sends 'USD' • Correct ISO code",
      payload: {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        custom_data: {
          currency: "USD",
          value: 199.99,
          source_page: "/problems/purchase-mismatch",
          example_name: "Wrong Currency Code - FIXED",
          note: "'USD' - correct ISO 4217 standard",
          test_mode: "fixed"
        }
      }
    },

    // 4. Negative Value
    {
      name: "Negative Value (Broken)",
      icon: <XCircle className="h-4 w-4 text-red-500" />,
      description: "Negative number -50.00 • Invalid",
      payload: {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        custom_data: {
          currency: "USD",
          value: -50.00,
          source_page: "/problems/purchase-mismatch",
          example_name: "Negative Value - INVALID",
          note: "Negative value - Meta rejects",
          test_mode: "broken"
        }
      }
    },
    {
      name: "Negative Value (Fixed)",
      icon: <CheckCircle2 className="h-4 w-4 text-[#00ff41]" />,
      description: "Positive number 50.00 • Correct",
      payload: {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        custom_data: {
          currency: "USD",
          value: 50.00,
          source_page: "/problems/purchase-mismatch",
          example_name: "Negative Value - FIXED",
          note: "Positive value - valid purchase",
          test_mode: "fixed"
        }
      }
    },

    // 5. Excessive Precision
    {
      name: "Excessive Precision (Broken)",
      icon: <AlertCircle className="h-4 w-4 text-yellow-500" />,
      description: "8 decimal places • Rounding errors",
      payload: {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        custom_data: {
          currency: "USD",
          value: 99.999999,
          source_page: "/problems/purchase-mismatch",
          example_name: "Excessive Decimals - SUBOPTIMAL",
          note: "Too many decimals - rounding errors",
          test_mode: "broken"
        }
      }
    },
    {
      name: "Excessive Precision (Fixed)",
      icon: <CheckCircle2 className="h-4 w-4 text-[#00ff41]" />,
      description: "2 decimal places • Standard",
      payload: {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        custom_data: {
          currency: "USD",
          value: 99.99,
          source_page: "/problems/purchase-mismatch",
          example_name: "Excessive Decimals - FIXED",
          note: "2 decimals - standard formatting",
          test_mode: "fixed"
        }
      }
    },

    // 6. Zero Value
    {
      name: "Zero Value (Broken)",
      icon: <AlertCircle className="h-4 w-4 text-yellow-500" />,
      description: "$0.00 Purchase • Not optimized",
      payload: {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        custom_data: {
          currency: "USD",
          value: 0.00,
          source_page: "/problems/purchase-mismatch",
          example_name: "Zero Value - SUBOPTIMAL",
          note: "$0 Purchase event - not used for ROAS",
          test_mode: "broken"
        }
      }
    },
    {
      name: "Free Trial (Fixed)",
      icon: <CheckCircle2 className="h-4 w-4 text-[#00ff41]" />,
      description: "Using 'CompleteRegistration' instead",
      payload: {
        event_name: "CompleteRegistration",
        event_time: Math.floor(Date.now() / 1000),
        custom_data: {
          content_name: "Free Trial Signup",
          content_category: "Trial",
          source_page: "/problems/purchase-mismatch",
          example_name: "Zero Value - FIXED",
          note: "Use CompleteRegistration for $0 conversions, not Purchase",
          test_mode: "fixed"
        }
      }
    },

    // 7. EUR Consistency
    {
      name: "EUR Inconsistent (Broken)",
      icon: <Globe className="h-4 w-4 text-yellow-500" />,
      description: "85.5 (1 decimal) • Inconsistent",
      payload: {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        custom_data: {
          currency: "EUR",
          value: 85.5,
          source_page: "/problems/purchase-mismatch",
          example_name: "EUR Inconsistent Decimals",
          note: "85.5 - inconsistent decimal formatting",
          test_mode: "broken"
        }
      }
    },
    {
      name: "EUR Consistent (Fixed)",
      icon: <Globe className="h-4 w-4 text-[#00ff41]" />,
      description: "85.50 (2 decimals) • Correct",
      payload: {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        custom_data: {
          currency: "EUR",
          value: 85.50,
          source_page: "/problems/purchase-mismatch",
          example_name: "EUR Consistent Decimals - GOOD",
          note: "85.50 - proper 2 decimal formatting",
          test_mode: "fixed"
        }
      }
    }
  ]

  return (
    <PageContent
      title="Purchase Mismatch"
      description="Master purchase event tracking with proper value types, currency codes, and revenue reporting for accurate ROAS calculation"
      status="Stable"
    >

      {/* The Problem */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> The Purchase Value Problem
        </h2>

        <div className="space-y-4">
          <p className="leading-relaxed text-[#8b949e] text-sm md:text-base">
            Purchase value and currency tracking is <span className="text-red-400 font-semibold">the foundation of ROAS calculation</span>. Get it wrong and Meta can&apos;t optimize your campaigns, can&apos;t calculate return on ad spend, and will show your ads to the wrong audiences. The most common mistake? Sending value as a <span className="text-red-400 font-semibold">string instead of a number</span>.
          </p>

          <div className="border-gradient">
            <div className="border-gradient-content glass-strong p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <TrendingDown className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="font-mono text-xl font-bold text-red-400">Revenue Impact</h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="glass hover-glow rounded-lg p-4 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-red-400" />
                    <p className="font-mono font-semibold text-red-400">$0 Revenue Tracked</p>
                  </div>
                  <p className="text-sm text-[#8b949e]">
                    String value &quot;99.99&quot; → Meta sees $0 → No ROAS calculation → Bad optimization
                  </p>
                </div>

                <div className="glass hover-glow rounded-lg p-4 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="h-5 w-5 text-red-400" />
                    <p className="font-mono font-semibold text-red-400">Broken ROAS Reporting</p>
                  </div>
                  <p className="text-sm text-[#8b949e]">
                    Missing currency → Can&apos;t calculate return on ad spend → Inaccurate dashboard metrics
                  </p>
                </div>

                <div className="glass hover-glow rounded-lg p-4 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <p className="font-mono font-semibold text-red-400">Wrong Audience Targeting</p>
                  </div>
                  <p className="text-sm text-[#8b949e]">
                    Meta&apos;s AI uses purchase values to find high-value customers → Wrong data = wrong targeting
                  </p>
                </div>

                <div className="glass hover-glow rounded-lg p-4 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="h-5 w-5 text-red-400" />
                    <p className="font-mono font-semibold text-red-400">Campaign Under-Performance</p>
                  </div>
                  <p className="text-sm text-[#8b949e]">
                    Incorrect values → Meta can&apos;t learn → Wastes budget on low-converting audiences
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Revenue Loss Example */}
          <div className="glass-strong rounded-xl p-6 border border-[#00d9ff]/20">
            <h4 className="font-mono font-semibold text-[#00d9ff] mb-4">Real-World Example: String Value Impact</h4>
            <div className="grid gap-4 md:grid-cols-3 text-center">
              <div className="glass rounded-lg p-4 border border-[#00ff41]/20">
                <p className="text-xs font-mono text-[#8b949e] mb-2">Actual Sales</p>
                <p className="text-2xl font-bold text-[#00ff41]">$10,000</p>
                <p className="text-xs text-[#8b949e] mt-1">100 orders @ $100 each</p>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-2xl text-red-400">→</span>
              </div>
              <div className="glass rounded-lg p-4 border border-red-500/20">
                <p className="text-xs font-mono text-[#8b949e] mb-2">Meta Sees (with string value)</p>
                <p className="text-2xl font-bold text-red-400">$0</p>
                <p className="text-xs text-[#8b949e] mt-1">Meta can&apos;t parse strings</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-red-500/10 rounded border-l-4 border-red-400">
              <p className="text-sm text-red-400">
                <span className="font-semibold">Result:</span> ROAS shows 0x instead of 5x → Campaign marked as failing → Budget wasted
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Type Requirements */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Data Type Requirements
        </h2>

        <div className="space-y-6">
          <p className="leading-relaxed text-[#8b949e] text-sm md:text-base">
            Meta&apos;s API requires <span className="text-[#00ff41] font-semibold">strict data types</span>. JavaScript developers often make the mistake of sending numeric values as strings, especially when pulling from form inputs or databases.
          </p>

          {/* Type Comparison */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Wrong */}
            <div className="glass rounded-xl p-5 border border-red-500/20">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="h-5 w-5 text-red-400" />
                <h3 className="font-mono font-semibold text-red-400">Wrong: String Value</h3>
              </div>

              <div className="bg-[#0d1117] rounded-lg p-4 border border-red-500/20 mb-3">
                <pre className="text-xs font-mono text-red-400 overflow-x-auto">
                  {`{
  "event_name": "Purchase",
  "custom_data": {
    "currency": "USD",
    "value": "99.99"  ← STRING!
  }
}`}
                </pre>
              </div>

              <div className="space-y-2 text-xs text-[#8b949e]">
                <p className="flex items-start gap-2">
                  <span className="text-red-400">❌</span>
                  <span>Meta expects number, receives string</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-red-400">❌</span>
                  <span>Event accepted but value = $0</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-red-400">❌</span>
                  <span>ROAS calculation broken</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-red-400">❌</span>
                  <span>Campaign optimization fails</span>
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="glass rounded-xl p-5 border border-[#00ff41]/20">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-5 w-5 text-[#00ff41]" />
                <h3 className="font-mono font-semibold text-[#00ff41]">Correct: Number Value</h3>
              </div>

              <div className="bg-[#0d1117] rounded-lg p-4 border border-[#00ff41]/20 mb-3">
                <pre className="text-xs font-mono text-[#00ff41] overflow-x-auto">
                  {`{
  "event_name": "Purchase",
  "custom_data": {
    "currency": "USD",
    "value": 99.99  ← NUMBER!
  }
}`}
                </pre>
              </div>

              <div className="space-y-2 text-xs text-[#8b949e]">
                <p className="flex items-start gap-2">
                  <span className="text-[#00ff41]">✓</span>
                  <span>Correct data type</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-[#00ff41]">✓</span>
                  <span>Full $99.99 tracked</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-[#00ff41]">✓</span>
                  <span>ROAS calculated correctly</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-[#00ff41]">✓</span>
                  <span>Campaign optimizes properly</span>
                </p>
              </div>
            </div>
          </div>

          {/* Common Sources of String Values */}
          <div className="glass-strong hover-border-glow rounded-xl border border-[#00ff41]/20 p-6">
            <h4 className="font-mono font-semibold text-[#00ff41] mb-4">Common Sources of String Values (Watch Out!)</h4>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-red-500/10 rounded">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-mono font-semibold text-red-400 text-sm">Form Inputs</p>
                  <code className="text-xs text-[#8b949e]">document.getElementById(&apos;amount&apos;).value → Returns string!</code>
                  <p className="text-xs text-[#8b949e] mt-1">Fix: <code className="text-[#00ff41]">parseFloat(input.value)</code></p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-red-500/10 rounded">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-mono font-semibold text-red-400 text-sm">Database Queries</p>
                  <code className="text-xs text-[#8b949e]">SQL DECIMAL/VARCHAR columns → May return strings</code>
                  <p className="text-xs text-[#8b949e] mt-1">Fix: <code className="text-[#00ff41]">Number(row.total)</code> or <code className="text-[#00ff41]">+row.total</code></p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-red-500/10 rounded">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-mono font-semibold text-red-400 text-sm">JSON Parsing</p>
                  <code className="text-xs text-[#8b949e]">JSON.parse() with incorrect types in source</code>
                  <p className="text-xs text-[#8b949e] mt-1">Fix: Validate and convert after parsing</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-red-500/10 rounded">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-mono font-semibold text-red-400 text-sm">URL Parameters</p>
                  <code className="text-xs text-[#8b949e]">?price=99.99 → Query params are always strings</code>
                  <p className="text-xs text-[#8b949e] mt-1">Fix: <code className="text-[#00ff41]">parseFloat(new URLSearchParams(window.location.search).get(&apos;price&apos;))</code></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Currency Codes */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Currency Codes & Formatting
        </h2>

        <div className="space-y-6">
          <p className="leading-relaxed text-[#8b949e] text-sm md:text-base">
            Meta requires <span className="text-[#00ff41] font-semibold">ISO 4217 currency codes</span> (3-letter codes like USD, EUR, GBP). Using incorrect codes like &quot;US&quot;, &quot;$&quot;, or &quot;Dollar&quot; will cause Meta to reject your events or misinterpret the currency.
          </p>

          {/* Common Currency Codes */}
          <div className="glass-strong rounded-xl border border-[#00ff41]/20 overflow-hidden">
            <div className="p-4 bg-[#00ff41]/10 border-b border-[#00ff41]/20">
              <h4 className="font-mono font-semibold text-[#00ff41]">Common ISO 4217 Currency Codes</h4>
            </div>

            <div className="grid md:grid-cols-3 divide-x divide-y divide-[#00ff41]/10">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[#00d9ff] font-bold">USD</span>
                  <span className="text-xs text-[#8b949e]">2 decimals</span>
                </div>
                <p className="text-sm text-[#e8f4f8]">US Dollar</p>
                <code className="text-xs text-[#00ff41]">99.99</code>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[#00d9ff] font-bold">EUR</span>
                  <span className="text-xs text-[#8b949e]">2 decimals</span>
                </div>
                <p className="text-sm text-[#e8f4f8]">Euro</p>
                <code className="text-xs text-[#00ff41]">85.50</code>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[#00d9ff] font-bold">GBP</span>
                  <span className="text-xs text-[#8b949e]">2 decimals</span>
                </div>
                <p className="text-sm text-[#e8f4f8]">British Pound</p>
                <code className="text-xs text-[#00ff41]">75.99</code>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[#00d9ff] font-bold">JPY</span>
                  <span className="text-xs text-[#8b949e]">0 decimals</span>
                </div>
                <p className="text-sm text-[#e8f4f8]">Japanese Yen</p>
                <code className="text-xs text-[#00ff41]">9999</code>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[#00d9ff] font-bold">CAD</span>
                  <span className="text-xs text-[#8b949e]">2 decimals</span>
                </div>
                <p className="text-sm text-[#e8f4f8]">Canadian Dollar</p>
                <code className="text-xs text-[#00ff41]">129.99</code>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[#00d9ff] font-bold">AUD</span>
                  <span className="text-xs text-[#8b949e]">2 decimals</span>
                </div>
                <p className="text-sm text-[#e8f4f8]">Australian Dollar</p>
                <code className="text-xs text-[#00ff41]">149.99</code>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[#00d9ff] font-bold">CHF</span>
                  <span className="text-xs text-[#8b949e]">2 decimals</span>
                </div>
                <p className="text-sm text-[#e8f4f8]">Swiss Franc</p>
                <code className="text-xs text-[#00ff41]">89.50</code>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[#00d9ff] font-bold">SEK</span>
                  <span className="text-xs text-[#8b949e]">2 decimals</span>
                </div>
                <p className="text-sm text-[#e8f4f8]">Swedish Krona</p>
                <code className="text-xs text-[#00ff41]">999.00</code>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[#00d9ff] font-bold">INR</span>
                  <span className="text-xs text-[#8b949e]">2 decimals</span>
                </div>
                <p className="text-sm text-[#e8f4f8]">Indian Rupee</p>
                <code className="text-xs text-[#00ff41]">7499.00</code>
              </div>
            </div>
          </div>

          {/* Decimal Place Rules */}
          <div className="glass-strong hover-border-glow rounded-xl border border-[#00ff41]/20 p-6">
            <h4 className="font-mono font-semibold text-[#00ff41] mb-4">Decimal Place Rules</h4>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-[#00ff41] font-mono mt-1">•</span>
                <div>
                  <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Most Currencies: 2 decimals</p>
                  <p className="text-xs text-[#8b949e]">USD, EUR, GBP, CAD, AUD, etc. → 99.99</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-[#00ff41] font-mono mt-1">•</span>
                <div>
                  <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Zero Decimal Currencies: 0 decimals</p>
                  <p className="text-xs text-[#8b949e]">JPY (Yen), KRW (Won), VND (Dong) → 9999 (no .00)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-[#00ff41] font-mono mt-1">•</span>
                <div>
                  <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Three Decimal Currencies: 3 decimals</p>
                  <p className="text-xs text-[#8b949e]">BHD (Bahraini Dinar), KWD (Kuwaiti Dinar) → 99.999</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Guide */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Implementation Guide
        </h2>

        <div className="space-y-6">
          {/* Step 1: Type Validation */}
          <div className="glass-strong hover-border-glow rounded-xl p-6 border border-[#00ff41]/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 flex items-center justify-center">
                <span className="font-mono text-[#00ff41] font-bold">1</span>
              </div>
              <h3 className="font-mono text-lg font-semibold text-[#e8f4f8]">Always Validate & Convert Types</h3>
            </div>

            <div className="bg-[#0d1117] rounded-lg p-4 border border-[#00ff41]/20">
              <p className="text-xs font-mono text-[#00ff41] mb-2">TypeScript Helper:</p>
              <pre className="text-xs font-mono text-[#8b949e] overflow-x-auto">
                {`function formatPurchaseValue(rawValue: any): number {
  // Convert to number
  const numValue = typeof rawValue === 'string' 
    ? parseFloat(rawValue) 
    : Number(rawValue)
  
  // Validate
  if (isNaN(numValue) || numValue < 0) {
    console.error('Invalid purchase value:', rawValue)
    return 0
  }
  
  // Round to 2 decimals (for most currencies)
  return Math.round(numValue * 100) / 100
}

// Usage
const purchaseValue = formatPurchaseValue(orderTotal)  // Ensures it's a valid number`}
              </pre>
            </div>
          </div>

          {/* Step 2: Complete Purchase Event */}
          <div className="glass-strong hover-border-glow rounded-xl p-6 border border-[#00ff41]/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 flex items-center justify-center">
                <span className="font-mono text-[#00ff41] font-bold">2</span>
              </div>
              <h3 className="font-mono text-lg font-semibold text-[#e8f4f8]">Build Complete Purchase Event</h3>
            </div>

            <div className="bg-[#0d1117] rounded-lg p-4 border border-[#00ff41]/20">
              <p className="text-xs font-mono text-[#00ff41] mb-2">Example:</p>
              <pre className="text-xs font-mono text-[#8b949e] overflow-x-auto">
                {`const purchaseEvent = {
  event_name: 'Purchase',
  event_id: orderId,  // Use your order ID
  event_time: Math.floor(Date.now() / 1000),
  custom_data: {
    currency: 'USD',  // ISO 4217 code
    value: formatPurchaseValue(orderTotal),  // NUMBER, not string!
    content_ids: productIds,  // Array of product IDs
    content_type: 'product',
    content_name: 'Order ' + orderId,
    num_items: cart.length,
    order_id: orderId
  },
  user_data: {
    em: hashEmail(customerEmail),
    ph: hashPhone(customerPhone)
    // ... other hashed PII
  }
}

// Send to CAPI
await sendToMeta(purchaseEvent)`}
              </pre>
            </div>
          </div>

          {/* Step 3: Multi-Currency Handling */}
          <div className="glass-strong hover-border-glow rounded-xl p-6 border border-[#00ff41]/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 flex items-center justify-center">
                <span className="font-mono text-[#00ff41] font-bold">3</span>
              </div>
              <h3 className="font-mono text-lg font-semibold text-[#e8f4f8]">Handle Multiple Currencies</h3>
            </div>

            <div className="bg-[#0d1117] rounded-lg p-4 border border-[#00ff41]/20">
              <p className="text-xs font-mono text-[#00ff41] mb-2">Currency Configuration:</p>
              <pre className="text-xs font-mono text-[#8b949e] overflow-x-auto">
                {`const CURRENCY_CONFIG = {
  USD: { decimals: 2, symbol: '$' },
  EUR: { decimals: 2, symbol: '€' },
  GBP: { decimals: 2, symbol: '£' },
  JPY: { decimals: 0, symbol: '¥' },  // No decimals!
  // ... more currencies
}

function formatCurrencyValue(value: number, currency: string): number {
  const config = CURRENCY_CONFIG[currency] || { decimals: 2 }
  const multiplier = Math.pow(10, config.decimals)
  return Math.round(value * multiplier) / multiplier
}

// Usage
const value = formatCurrencyValue(99.999, 'USD')  // Returns 100.00
const valueJPY = formatCurrencyValue(9999.5, 'JPY')  // Returns 10000 (no decimals)`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Testing Playground */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[400ms]">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Interactive Purchase Value Testing
        </h2>

        <div className="glass-strong rounded-xl p-6 border border-[#00d9ff]/20 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="h-5 w-5 text-[#00d9ff]" />
            <h4 className="font-mono font-semibold text-[#00d9ff]">Live Revenue Tracking Demonstration</h4>
          </div>
          <p className="text-sm text-[#8b949e] mb-3">
            Each example sends REAL purchase events to Meta. Select a scenario below to populate the JSON builder, then click "Send Event".
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-xs text-[#8b949e]">
              <span className="text-red-400 font-mono mt-0.5">›</span>
              <span><span className="text-red-400 font-semibold">Broken Examples:</span> Demonstrate common mistakes like String values or missing currencies</span>
            </li>
            <li className="flex items-start gap-2 text-xs text-[#8b949e]">
              <span className="text-[#00ff41] font-mono mt-0.5">›</span>
              <span><span className="text-[#00ff41] font-semibold">Fixed Examples:</span> Show the correct implementation</span>
            </li>
          </ul>
        </div>

        <EnhancedEventPlayground
          title="Purchase Value & Currency Test Suite"
          description="Select a scenario to test validation rules."
          events={purchaseExamples}
          showLogs={true}
          sendToMeta={true}
          sendToBoth={true}
          showNetworkInspector={true}
          showMetaResponse={true}
          testEventCode="TEST_PURCHASE"
          pixelId={process.env.NEXT_PUBLIC_FB_PIXEL_ID}
        />
      </section>
    </PageContent>
  )
}
