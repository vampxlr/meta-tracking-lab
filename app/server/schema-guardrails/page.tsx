"use client"

import { PageContent } from "@/components/page-content"
import { EnhancedEventPlayground } from "@/components/enhanced-event-playground"
import { Shield, CheckCircle2, XCircle, AlertTriangle, Code2, FileCheck, Zap, Lock } from "lucide-react"

export default function SchemaGuardrailsPage() {
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

  const schemaExamples = [
    {
      name: "No Validation (BROKEN)",
      icon: <XCircle className="h-4 w-4 text-red-400" />,
      description: "Send malformed data to Meta → Meta rejects → Poor analytics",
      payload: {
        event_name: "Purchase",
        event_id: 12345,  // NUMBER instead of STRING!
        custom_data: {
          currency: "US",  // Invalid ISO code
          value: "999.99",  // STRING instead of NUMBER!
          content_ids: "prod_123"  // STRING instead of ARRAY!
        }
      }
    },
    {
      name: "Schema Validated (FIXED)",
      icon: <CheckCircle2 className="h-4 w-4 text-[#00ff41]" />,
      description: "Correct types and formatting",
      payload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,  // STRING ✓
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514",
          client_ip_address: "192.168.1.1"
        },
        custom_data: {
          currency: "USD",  // Valid ISO ✓
          value: 999.99,  // NUMBER ✓
          content_ids: ["prod_123"],  // ARRAY ✓
          source_page: "/server/schema-guardrails",
          example_name: "Schema Validated - CORRECT",
          test_mode: "fixed",
          note: "Zod schema validated before sending - all types correct"
        }
      }
    },
    {
      name: "Missing Required Fields (BROKEN)",
      icon: <AlertTriangle className="h-4 w-4 text-yellow-400" />,
      description: "Forget event_name or event_time → Meta rejects entire event",
      payload: {
        event_id: `purchase_${Date.now()}`,
        // Missing event_name! Critical error
        custom_data: {
          currency: "USD",
          value: 299.99,
          source_page: "/server/schema-guardrails",
          example_name: "Missing Required Fields - REJECTED",
          test_mode: "broken",
          note: "No event_name - caught by schema validation before sending"
        }
      }
    },
    {
      name: "All Required Fields (FIXED)",
      icon: <CheckCircle2 className="h-4 w-4 text-[#00ff41]" />,
      description: "All mandatory fields present",
      payload: {
        event_name: "Purchase",  // REQUIRED ✓
        event_id: `purchase_${Date.now()}`,  // REQUIRED ✓
        event_time: Math.floor(Date.now() / 1000),  // REQUIRED ✓
        action_source: "website",  // REQUIRED ✓
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514",
          client_ip_address: "192.168.1.1"
        },
        custom_data: {
          currency: "USD",
          value: 299.99,
          source_page: "/server/schema-guardrails",
          example_name: "All Required Fields - VALID",
          test_mode: "fixed",
          note: "All required fields present - schema validation passed"
        }
      }
    },
    {
      name: "Wrong Data Types (BROKEN)",
      icon: <Code2 className="h-4 w-4 text-yellow-400" />,
      description: "Value as string, timestamp as string → Type errors cause silent failures",
      payload: {
        event_name: "AddToCart",
        event_id: `cart_${Date.now()}`,
        event_time: "1705334400000",  // STRING instead of NUMBER!
        action_source: "website",
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514"
        },
        custom_data: {
          currency: "USD",
          value: "49.99",  // STRING instead of NUMBER!
          num_items: "2",  // STRING instead of NUMBER!
          source_page: "/server/schema-guardrails",
          example_name: "Wrong Data Types - INVALID",
          test_mode: "broken",
          note: "Strings instead of numbers - schema catches type errors"
        }
      }
    },
    {
      name: "Correct Data Types (FIXED)",
      icon: <CheckCircle2 className="h-4 w-4 text-[#00ff41]" />,
      description: "Numbers are numbers, strings are strings",
      payload: {
        event_name: "AddToCart",
        event_id: `cart_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),  // NUMBER ✓
        action_source: "website",
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514",
          client_ip_address: "192.168.1.1"
        },
        custom_data: {
          currency: "USD",
          value: 49.99,  // NUMBER ✓
          num_items: 2,  // NUMBER ✓
          source_page: "/server/schema-guardrails",
          example_name: "Correct Data Types - VALID",
          test_mode: "fixed",
          note: "All fields use correct types - schema validation passed"
        }
      }
    },
    {
      name: "Invalid Enum Values (BROKEN)",
      icon: <AlertTriangle className="h-4 w-4 text-yellow-400" />,
      description: "Wrong event_name or currency → Meta silently ignores",
      payload: {
        event_name: "BuyNow",  // Invalid! Should be "Purchase"
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "web",  // Invalid! Should be "website"
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514"
        },
        custom_data: {
          currency: "DOLLARS",  // Invalid! Should be "USD"
          value: 149.99,
          source_page: "/server/schema-guardrails",
          example_name: "Invalid Enums - REJECTED",
          test_mode: "broken",
          note: "BuyNow, web, DOLLARS - invalid enum values caught"
        }
      }
    },
    {
      name: "Valid Enums (FIXED)",
      icon: <CheckCircle2 className="h-4 w-4 text-[#00ff41]" />,
      description: "Valid standard values used",
      payload: {
        event_name: "Purchase",  // Valid standard event ✓
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",  // Valid action source ✓
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514",
          client_ip_address: "192.168.1.1"
        },
        custom_data: {
          currency: "USD",  // Valid ISO 4217 ✓
          value: 149.99,
          source_page: "/server/schema-guardrails",
          example_name: "Valid Enums - CORRECT",
          test_mode: "fixed",
          note: "Purchase, website, USD - all valid enum values"
        }
      }
    },
    {
      name: "Email Hashing Validation (BROKEN)",
      icon: <AlertTriangle className="h-4 w-4 text-red-400" />,
      description: "Catch unhashed emails before sending → GDPR compliance",
      payload: {
        event_name: "CompleteRegistration",
        event_id: `lead_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "user@example.com",  // UNHASHED! GDPR violation!
          client_ip_address: "192.168.1.1"
        },
        custom_data: {
          source_page: "/server/schema-guardrails",
          example_name: "Unhashed Email - GDPR VIOLATION",
          test_mode: "broken",
          note: "Plain text email detected by schema - blocked before sending"
        }
      }
    },
    {
      name: "Email Hashing Validation (FIXED)",
      icon: <Lock className="h-4 w-4 text-[#00ff41]" />,
      description: "Hashed email is compliant",
      payload: {
        event_name: "CompleteRegistration",
        event_id: `lead_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514",  // SHA-256 ✓
          client_ip_address: "192.168.1.1"
        },
        custom_data: {
          source_page: "/server/schema-guardrails",
          example_name: "Hashed Email - GDPR COMPLIANT",
          test_mode: "fixed",
          note: "64-char SHA-256 hash validated - privacy protected"
        }
      }
    },
    {
      name: "Value Range Validation (BROKEN)",
      icon: <AlertTriangle className="h-4 w-4 text-yellow-400" />,
      description: "Catch impossible values like negative prices or $1M purchases",
      payload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514"
        },
        custom_data: {
          currency: "USD",
          value: -50.00,  // NEGATIVE! Invalid!
          source_page: "/server/schema-guardrails",
          example_name: "Negative Value - INVALID",
          test_mode: "broken",
          note: "Negative purchase value caught by range validation"
        }
      }
    },
    {
      name: "Value Range Validation (FIXED)",
      icon: <CheckCircle2 className="h-4 w-4 text-[#00ff41]" />,
      description: "Valid positive value",
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
          value: 199.99,  // Positive ✓ (0.01 to 1,000,000)
          source_page: "/server/schema-guardrails",
          example_name: "Valid Range - CORRECT",
          test_mode: "fixed",
          note: "Value within valid range (0.01 - 1,000,000)"
        }
      }
    },
    {
      name: "Automatic Type Coercion (SMART)",
      icon: <Zap className="h-4 w-4 text-[#00ff41]" />,
      description: "Schema can auto-fix common mistakes like string numbers",
      payload: {
        event_name: "InitiateCheckout",
        event_id: `checkout_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514",
          client_ip_address: "192.168.1.1"
        },
        custom_data: {
          currency: "USD",
          value: 79.99,  // Schema auto-converted "79.99" → 79.99
          num_items: 3,  // Schema auto-converted "3" → 3
          source_page: "/server/schema-guardrails",
          example_name: "Auto Type Coercion - SMART",
          test_mode: "fixed",
          note: "Schema coerced string '79.99' → number 79.99 automatically"
        }
      }
    },
    {
      name: "Complete Schema Validation (PRODUCTION READY)",
      icon: <FileCheck className="h-4 w-4 text-[#00ff41]" />,
      description: "Full validation: Types + Required fields + Enums + Ranges + Hashing",
      payload: {
        event_name: "Purchase",
        event_id: `purchase_validated_${Date.now()}`,
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
          client_ip_address: "192.168.1.1",
          client_user_agent: "Mozilla/5.0"
        },
        custom_data: {
          currency: "USD",
          value: 649.99,
          content_ids: ["PROD-001", "PROD-002"],
          content_type: "product",
          content_name: "Premium Bundle",
          content_category: "Electronics",
          num_items: 2,
          order_id: `ORD-${Date.now()}`,
          source_page: "/server/schema-guardrails",
          example_name: "Complete Validation - PRODUCTION READY",
          test_mode: "fixed",
          note: "Zod schema: ✓ Types ✓ Required ✓ Enums ✓ Ranges ✓ Hashing"
        }
      }
    }
  ]

  return (
    <PageContent
      title="Schema Guardrails"
      description="Implement runtime validation with Zod or similar to catch errors before sending to Meta - prevent bad data, GDPR violations, and silent failures"
      status="Beta"
    >

      {/* Why Schema Validation */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Why Schema Validation is Critical
        </h2>

        <div className="space-y-4">
          <p className="leading-relaxed text-[#8b949e] text-sm md:text-base">
            TypeScript provides compile-time type safety, but runtime data from forms, APIs, and user input can still be malformed. Schema validation catches these errors <span className="text-[#00ff41] font-mono">before</span> sending to Meta, preventing silent failures, GDPR violations, and wasted API calls.
          </p>

          <div className="border-gradient">
            <div className="border-gradient-content glass-strong p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#00ff41]/10">
                  <Shield className="h-6 w-6 text-[#00ff41]" />
                </div>
                <h3 className="font-mono text-xl font-bold text-[#00ff41]">What Schema Validation Catches</h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="glass hover-glow rounded-lg p-4 border border-[#00ff41]/20">
                  <p className="font-mono font-semibold text-[#00ff41] mb-2">Type Errors</p>
                  <p className="text-sm text-[#8b949e]">
                    Value as &quot;99.99&quot; (string) instead of 99.99 (number) → Caught before sending
                  </p>
                </div>

                <div className="glass hover-glow rounded-lg p-4 border border-[#00ff41]/20">
                  <p className="font-mono font-semibold text-[#00ff41] mb-2">Missing Fields</p>
                  <p className="text-sm text-[#8b949e]">
                    Forgot event_name or event_time → Error thrown instead of silent failure
                  </p>
                </div>

                <div className="glass hover-glow rounded-lg p-4 border border-[#00ff41]/20">
                  <p className="font-mono font-semibold text-[#00ff41] mb-2">Invalid Enums</p>
                  <p className="text-sm text-[#8b949e]">
                    &quot;BuyNow&quot; instead of &quot;Purchase&quot; → Rejected with clear error message
                  </p>
                </div>

                <div className="glass hover-glow rounded-lg p-4 border border-[#00ff41]/20">
                  <p className="font-mono font-semibold text-[#00ff41] mb-2">GDPR Violations</p>
                  <p className="text-sm text-[#8b949e]">
                    Unhashed email detected → Blocked before exposing PII to logs
                  </p>
                </div>

                <div className="glass hover-glow rounded-lg p-4 border border-[#00ff41]/20">
                  <p className="font-mono font-semibold text-[#00ff41] mb-2">Range Issues</p>
                  <p className="text-sm text-[#8b949e]">
                    Negative prices or $10M purchases → Flagged as suspicious
                  </p>
                </div>

                <div className="glass hover-glow rounded-lg p-4 border border-[#00ff41]/20">
                  <p className="font-mono font-semibold text-[#00ff41] mb-2">Format Errors</p>
                  <p className="text-sm text-[#8b949e]">
                    Invalid UUID, malformed timestamps → Caught with validation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Schema Validation Flow */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> How Schema Validation Works
        </h2>

        <div className="space-y-6">
          {/* Flow Comparison */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Without Validation */}
            <div className="glass rounded-xl p-5 border border-red-500/20">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="h-5 w-5 text-red-400" />
                <h3 className="font-mono font-semibold text-red-400">Without Validation</h3>
              </div>

              <div className="space-y-3">
                <div className="bg-[#0d1117] rounded-lg p-3 border border-red-500/20">
                  <pre className="text-xs font-mono text-red-400">
                    {`User Input → API Endpoint
  ↓
Send to Meta (malformed)
  ↓
❌ Silent failure
❌ Wrong data type ignored
❌ GDPR violation sent
❌ Debugging nightmare`}
                  </pre>
                </div>
              </div>
            </div>

            {/* With Validation */}
            <div className="glass rounded-xl p-5 border border-[#00ff41]/20">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-5 w-5 text-[#00ff41]" />
                <h3 className="font-mono font-semibold text-[#00ff41]">With Schema Validation</h3>
              </div>

              <div className="space-y-3">
                <div className="bg-[#0d1117] rounded-lg p-3 border border-[#00ff41]/20">
                  <pre className="text-xs font-mono text-[#00ff41]">
                    {`User Input → API Endpoint
  ↓
Zod Schema Validation
  ↓
  ├─ ✓ All types correct
  ├─ ✓ Required fields present
  ├─ ✓ Enums valid
  ├─ ✓ Ranges acceptable
  └─ ✓ PII hashed
  ↓
Send to Meta (validated)
  ↓
✓ High success rate
✓ Clear error messages
✓ GDPR compliant
✓ Easy debugging`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation with Zod */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Implementation with Zod
        </h2>

        <div className="space-y-6">
          {/* Install Zod */}
          <div className="glass-strong hover-border-glow rounded-xl p-6 border border-[#00ff41]/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 flex items-center justify-center">
                <span className="font-mono text-[#00ff41] font-bold">1</span>
              </div>
              <h3 className="font-mono text-lg font-semibold text-[#e8f4f8]">Install Zod</h3>
            </div>

            <div className="bg-[#0d1117] rounded-lg p-4 border border-[#00ff41]/20">
              <pre className="text-xs font-mono text-[#8b949e] overflow-x-auto">
                {`npm install zod`}
              </pre>
            </div>
          </div>

          {/* Define Schema */}
          <div className="glass-strong hover-border-glow rounded-xl p-6 border border-[#00ff41]/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 flex items-center justify-center">
                <span className="font-mono text-[#00ff41] font-bold">2</span>
              </div>
              <h3 className="font-mono text-lg font-semibold text-[#e8f4f8]">Define CAPI Schema</h3>
            </div>

            <div className="bg-[#0d1117] rounded-lg p-4 border border-[#00ff41]/20">
              <p className="text-xs font-mono text-[#00ff41] mb-2">lib/schemas/capi.ts:</p>
              <pre className="text-xs font-mono text-[#8b949e] overflow-x-auto">
                {`import { z } from 'zod'

// Standard event names
const StandardEvents = z.enum([
  'ViewContent', 'Search', 'AddToCart', 
  'InitiateCheckout', 'Purchase', 'CompleteRegistration'
])

// ISO 4217 currency codes (subset)
const CurrencyCodes = z.enum([
  'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'
])

// SHA-256 hash validation (64 hex chars)
const SHA256Hash = z.string().regex(/^[a-f0-9]{64}$/, 
  'Must be 64-character SHA-256 hash'
)

// Email validation (must be hashed)
const HashedEmail = SHA256Hash.or(
  z.string().email().transform(async (email) => {
    throw new Error('Email must be SHA-256 hashed before sending!')
  })
)

// User Data Schema
const UserDataSchema = z.object({
  em: HashedEmail.optional(),
  ph: SHA256Hash.optional(),
  fn: SHA256Hash.optional(),
  ln: SHA256Hash.optional(),
  ct: SHA256Hash.optional(),
  st: SHA256Hash.optional(),
  zp: SHA256Hash.optional(),
  country: z.string().length(2).optional(),
  external_id: z.string().optional(),
  fbp: z.string().optional(),
  fbc: z.string().optional(),
  client_ip_address: z.string().ip().optional(),
  client_user_agent: z.string().optional()
}).refine(
  (data) => Object.values(data).some(v => v !== undefined),
  { message: 'At least one user_data field required' }
)

// Custom Data Schema
const CustomDataSchema = z.object({
  currency: CurrencyCodes,
  value: z.number().min(0.01).max(1000000),
  content_ids: z.array(z.string()).optional(),
  content_type: z.string().optional(),
  content_name: z.string().optional(),
  content_category: z.string().optional(),
  num_items: z.number().int().positive().optional(),
  order_id: z.string().optional()
}).partial().refine(
  (data) => {
    if (data.value !== undefined && data.currency === undefined) {
      return false
    }
    return true
  },
  { message: 'currency required when value is present' }
)

// Main Event Schema
export const CAPIEventSchema = z.object({
  event_name: StandardEvents.or(z.string()),
  event_id: z.string().uuid().or(z.string().min(1)),
  event_time: z.number().int().positive(),
  event_source_url: z.string().url().optional(),
  action_source: z.enum(['website', 'app', 'email', 'phone_call']),
  user_data: UserDataSchema,
  custom_data: CustomDataSchema.optional(),
  test_event_code: z.string().optional()
})

export type CAPIEvent = z.infer<typeof CAPIEventSchema>`}
              </pre>
            </div>
          </div>

          {/* Use in API Route */}
          <div className="glass-strong hover-border-glow rounded-xl p-6 border border-[#00ff41]/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 flex items-center justify-center">
                <span className="font-mono text-[#00ff41] font-bold">3</span>
              </div>
              <h3 className="font-mono text-lg font-semibold text-[#e8f4f8]">Validate in API Route</h3>
            </div>

            <div className="bg-[#0d1117] rounded-lg p-4 border border-[#00ff41]/20">
              <p className="text-xs font-mono text-[#00ff41] mb-2">app/api/events/route.ts:</p>
              <pre className="text-xs font-mono text-[#8b949e] overflow-x-auto">
                {`import { CAPIEventSchema } from '@/lib/schemas/capi'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // VALIDATE with Zod schema
    const validatedEvent = CAPIEventSchema.parse(body)
    
    // If we get here, data is valid!
    const response = await sendToMeta(validatedEvent)
    return NextResponse.json(response)
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Detailed validation errors
      return NextResponse.json({
        error: 'Validation failed',
        details: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
          received: e.received
        }))
      }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Examples */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Interactive Examples
        </h2>

        <div className="glass-strong rounded-xl p-6 border border-[#00d9ff]/20 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-5 w-5 text-[#00d9ff]" />
            <h4 className="font-mono font-semibold text-[#00d9ff]">Schema Validation Patterns</h4>
          </div>
          <p className="text-sm text-[#8b949e]">
            These examples demonstrate different validation scenarios and how schema guardrails catch errors before sending to Meta.
          </p>
        </div>

        <EnhancedEventPlayground
          title="Schema Guardrails Examples"
          description="See how runtime validation prevents bad data from reaching Meta"
          events={schemaExamples}
          showLogs={true}
          sendToMeta={true}
          sendToBoth={false}
          showNetworkInspector={true}
          showMetaResponse={true}
          testEventCode="TEST_SCHEMA"
          pixelId={process.env.NEXT_PUBLIC_FB_PIXEL_ID}
        />
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
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Validate BEFORE Sending to Meta</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Catch errors in your API route, not after Meta rejects
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#00ff41] font-mono mt-1">✓</span>
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Return Clear Error Messages</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Tell developers exactly what&apos;s wrong: &quot;currency must be ISO 4217 code&quot;
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#00ff41] font-mono mt-1">✓</span>
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Use Enums for Standard Fields</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  event_name, action_source, currency - restrict to valid values
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#00ff41] font-mono mt-1">✓</span>
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Validate Email Hashing</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Regex check for 64-char SHA-256 hash - block plain text emails
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#00ff41] font-mono mt-1">✓</span>
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Add Range Validation</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Value: 0.01 to 1,000,000 - catch negative or impossible prices
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#00ff41] font-mono mt-1">✓</span>
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Enable Type Coercion Carefully</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Zod can auto-convert &quot;99.99&quot; → 99.99, but be explicit about it
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#00ff41] font-mono mt-1">✓</span>
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Log Validation Failures</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Track which fields fail validation most often - fix root causes
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </PageContent>
  )
}
