"use client"

import { PageContent } from "@/components/page-content"
import { EnhancedEventPlayground } from "@/components/enhanced-event-playground"
import { AlertTriangle, FileQuestion, CheckCircle2, XCircle, Code2, Layers } from "lucide-react"

export default function WrongParametersPage() {
  // Get site URL from environment
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://meta-tracking-lab.vercel.app'

  const parameterExamples = [
    {
      name: "Wrong Field Name",
      icon: <XCircle className="h-4 w-4 text-red-400 icon-spin-hover" />,
      description: "Using 'price' instead of 'value' → Field ignored by Meta",
      brokenPayload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        custom_data: {
          currency: "USD",
          price: 99.99,  // Wrong! Should be "value"
          items: ["prod_123"],  // Wrong! Should be "content_ids"
          source_page: "/problems/wrong-parameters",
          example_name: "Wrong Field Names",
          test_mode: "broken",
          note: "'price' & 'items' instead of 'value' & 'content_ids'"
        }
      },
      fixedPayload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        custom_data: {
          currency: "USD",
          value: 99.99,  // Correct field name
          content_ids: ["prod_123"],  // Correct field name
          source_page: "/problems/wrong-parameters",
          example_name: "Wrong Field Names - FIXED",
          test_mode: "fixed",
          note: "Correct field names: 'value' & 'content_ids'"
        }
      }
    },
    {
      name: "Wrong Data Type (Array vs String)",
      icon: <AlertTriangle className="h-4 w-4 text-yellow-400 icon-spin-hover" />,
      description: "content_ids as string instead of array → Meta can't parse",
      brokenPayload: {
        event_name: "ViewContent",
        event_id: `view_${Date.now()}`,
        custom_data: {
          content_ids: "product_123",  // String! Should be array
          content_type: "product",
          source_page: "/problems/wrong-parameters",
          example_name: "Wrong Data Type - String not Array",
          test_mode: "broken",
          note: "content_ids as string - should be array"
        }
      },
      fixedPayload: {
        event_name: "ViewContent",
        event_id: `view_${Date.now()}`,
        custom_data: {
          content_ids: ["product_123"],  // Array - correct!
          content_type: "product",
          source_page: "/problems/wrong-parameters",
          example_name: "Wrong Data Type - FIXED",
          test_mode: "fixed",
          note: "content_ids as array - correct format"
        }
      }
    },
    {
      name: "Wrong Nesting Level",
      icon: <Layers className="h-4 w-4 text-yellow-400 icon-spin-hover" />,
      description: "Fields at root instead of in custom_data → Ignored",
      brokenPayload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        currency: "USD",  // Wrong! Should be in custom_data
        value: 149.99,  // Wrong! Should be in custom_data
        custom_data: {
          source_page: "/problems/wrong-parameters",
          example_name: "Wrong Nesting - ROOT LEVEL",
          test_mode: "broken",
          note: "currency & value at root - should be in custom_data"
        }
      },
      fixedPayload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        custom_data: {  // Correct nesting
          currency: "USD",
          value: 149.99,
          source_page: "/problems/wrong-parameters",
          example_name: "Wrong Nesting - FIXED",
          test_mode: "fixed",
          note: "Proper nesting in custom_data"
        }
      }
    },
    {
      name: "Wrong Parameter Name (Snake vs Camel)",
      icon: <Code2 className="h-4 w-4 text-yellow-400 icon-spin-hover" />,
      description: "Using camelCase instead of snake_case → Not recognized",
      brokenPayload: {
        eventName: "Purchase",  // Wrong! Should be event_name
        eventId: `purchase_${Date.now()}`,  // Wrong! Should be event_id
        customData: {  // Wrong! Should be custom_data
          currency: "USD",
          value: 199.99,
          source_page: "/problems/wrong-parameters",
          example_name: "camelCase instead of snake_case",
          test_mode: "broken",
          note: "eventName, eventId, customData - Meta doesn't recognize"
        }
      },
      fixedPayload: {
        event_name: "Purchase",  // snake_case - correct!
        event_id: `purchase_${Date.now()}`,
        custom_data: {
          currency: "USD",
          value: 199.99,
          source_page: "/problems/wrong-parameters",
          example_name: "snake_case - CORRECT",
          test_mode: "fixed",
          note: "event_name, event_id, custom_data - proper snake_case"
        }
      }
    },
    {
      name: "Missing Required Parameters",
      icon: <FileQuestion className="h-4 w-4 text-red-400 icon-spin-hover" />,
      description: "Missing event_name → Event completely rejected",
      brokenPayload: {
        event_id: `event_${Date.now()}`,
        custom_data: {
          currency: "USD",
          value: 99.99,
          source_page: "/problems/wrong-parameters",
          example_name: "Missing event_name - REJECTED",
          test_mode: "broken",
          note: "No event_name - Meta completely rejects event"
        }
        // Missing event_name! Critical error
      },
      fixedPayload: {
        event_name: "Purchase",  // Required!
        event_id: `purchase_${Date.now()}`,
        custom_data: {
          currency: "USD",
          value: 99.99,
          source_page: "/problems/wrong-parameters",
          example_name: "Missing event_name - FIXED",
          test_mode: "fixed",
          note: "event_name added - event accepted"
        }
      }
    },
    {
      name: "Extra Unknown Parameters",
      icon: <AlertTriangle className="h-4 w-4 text-yellow-400 icon-spin-hover" />,
      description: "Custom params not in spec → Silently ignored (not an error but wasteful)",
      brokenPayload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        custom_data: {
          currency: "USD",
          value: 99.99,
          my_custom_field: "ignored",  // Not in Meta spec - ignored
          another_field: 123,  // Also ignored
          source_page: "/problems/wrong-parameters",
          example_name: "Extra Unknown Params - WASTEFUL",
          test_mode: "broken",
          note: "Unknown fields silently ignored - wastes bandwidth"
        }
      },
      fixedPayload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        custom_data: {
          currency: "USD",
          value: 99.99,
          content_name: "Product Name",  // Standard field
          content_category: "Electronics",  // Standard field
          source_page: "/problems/wrong-parameters",
          example_name: "Extra Unknown Params - FIXED",
          test_mode: "fixed",
          note: "Only standard Meta fields - efficient"
        }
      }
    },
    {
      name: "Wrong Event Name Case",
      icon: <Code2 className="h-4 w-4 text-yellow-400 icon-spin-hover" />,
      description: "Lowercase event name → Not recognized as standard event",
      brokenPayload: {
        event_name: "purchase",  // Wrong! Should be PascalCase
        event_id: `purchase_${Date.now()}`,
        custom_data: {
          currency: "USD",
          value: 299.99,
          source_page: "/problems/wrong-parameters",
          example_name: "Lowercase Event Name",
          test_mode: "broken",
          note: "'purchase' lowercase - not recognized as standard event"
        }
      },
      fixedPayload: {
        event_name: "Purchase",  // PascalCase - correct!
        event_id: `purchase_${Date.now()}`,
        custom_data: {
          currency: "USD",
          value: 299.99,
          source_page: "/problems/wrong-parameters",
          example_name: "PascalCase Event Name - CORRECT",
          test_mode: "fixed",
          note: "'Purchase' PascalCase - recognized as standard event"
        }
      }
    },
    {
      name: "Complete vs Incomplete Structure",
      icon: <CheckCircle2 className="h-4 w-4 text-[#00ff41] icon-spin-hover" />,
      description: "Minimal vs complete: more parameters = better optimization",
      brokenPayload: {
        event_name: "AddToCart",
        event_id: `cart_${Date.now()}`,
        custom_data: {
          value: 49.99
          // Minimal data - poor optimization
        }
      },
      fixedPayload: {
        event_name: "AddToCart",
        event_id: `cart_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        custom_data: {
          currency: "USD",
          value: 49.99,
          content_name: "Premium Widget",
          content_category: "Widgets",
          content_ids: ["widget_789"],
          content_type: "product",
          num_items: 1,
          source_page: "/problems/wrong-parameters",
          example_name: "Complete Structure - OPTIMAL",
          test_mode: "fixed",
          note: "All fields + user_data - maximum optimization"
        },
        user_data: {
          client_ip_address: "1.2.3.4",
          client_user_agent: "Mozilla/5.0..."
        }
        // Complete structure = much better optimization!
      }
    }
  ]

  return (
    <PageContent
      title="Wrong Parameters"
      description="Master Meta's event parameter structure with correct field names, data types, nesting, and naming conventions"
      status="Stable"
    >
      
      {/* Problem Section */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> The Wrong Parameters Problem
        </h2>
        
        <p className="leading-relaxed text-[#8b949e] text-sm md:text-base mb-4">
          Using incorrect parameter names, wrong data types, or improper nesting is one of the most common Meta tracking errors. Even a single character difference—like using <code className="text-red-400">price</code> instead of <code className="text-[#00ff41]">value</code>—causes Meta to completely ignore that field, breaking your revenue tracking and optimization.
        </p>

        <div className="border-gradient">
          <div className="border-gradient-content glass-strong p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="glass hover-glow rounded-lg p-4 border border-red-500/20">
                <XCircle className="h-5 w-5 text-red-400 mb-2" />
                <p className="font-mono font-semibold text-red-400 mb-2">Field Name Mistakes</p>
                <p className="text-sm text-[#8b949e]">
                  price vs value, items vs content_ids, eventName vs event_name
                </p>
              </div>
              
              <div className="glass hover-glow rounded-lg p-4 border border-yellow-500/20">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mb-2" />
                <p className="font-mono font-semibold text-yellow-400 mb-2">Type Mismatches</p>
                <p className="text-sm text-[#8b949e]">
                  String instead of array, string instead of number, object instead of string
                </p>
              </div>
              
              <div className="glass hover-glow rounded-lg p-4 border border-yellow-500/20">
                <Code2 className="h-5 w-5 text-yellow-400 mb-2" />
                <p className="font-mono font-semibold text-yellow-400 mb-2">Nesting Errors</p>
                <p className="text-sm text-[#8b949e]">
                  Fields at wrong level, missing custom_data wrapper, flat structure instead of nested
                </p>
              </div>
              
              <div className="glass hover-glow rounded-lg p-4 border border-red-500/20">
                <FileQuestion className="h-5 w-5 text-red-400 mb-2" />
                <p className="font-mono font-semibold text-red-400 mb-2">Case Sensitivity</p>
                <p className="text-sm text-[#8b949e]">
                  purchase vs Purchase, event_name vs eventName, PURCHASE vs Purchase
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Parameter Reference */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Meta Event Parameter Reference
        </h2>
        
        <div className="glass-strong rounded-xl border border-[#00ff41]/20 overflow-hidden">
          <div className="p-4 bg-[#00ff41]/10 border-b border-[#00ff41]/20">
            <h4 className="font-mono font-semibold text-[#00ff41]">Standard Event Parameters</h4>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#00ff41]/5 border-b border-[#00ff41]/20">
                <tr>
                  <th className="text-left p-3 font-mono text-xs text-[#00ff41]">Parameter</th>
                  <th className="text-left p-3 font-mono text-xs text-[#00ff41]">Type</th>
                  <th className="text-left p-3 font-mono text-xs text-[#00ff41]">Required?</th>
                  <th className="text-left p-3 font-mono text-xs text-[#00ff41]">Location</th>
                  <th className="text-left p-3 font-mono text-xs text-[#00ff41]">Example</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#00ff41]/10">
                <tr>
                  <td className="p-3 text-sm font-mono text-[#00d9ff]">event_name</td>
                  <td className="p-3 text-xs text-[#8b949e]">string</td>
                  <td className="p-3 text-xs text-red-400 font-semibold">Yes</td>
                  <td className="p-3 text-xs text-[#8b949e]">Root</td>
                  <td className="p-3 text-xs font-mono text-[#8b949e]">&quot;Purchase&quot;</td>
                </tr>
                <tr className="bg-[#00ff41]/5">
                  <td className="p-3 text-sm font-mono text-[#00d9ff]">event_id</td>
                  <td className="p-3 text-xs text-[#8b949e]">string</td>
                  <td className="p-3 text-xs text-[#00ff41]">Recommended</td>
                  <td className="p-3 text-xs text-[#8b949e]">Root</td>
                  <td className="p-3 text-xs font-mono text-[#8b949e]">&quot;order_123&quot;</td>
                </tr>
                <tr>
                  <td className="p-3 text-sm font-mono text-[#00d9ff]">event_time</td>
                  <td className="p-3 text-xs text-[#8b949e]">number (Unix)</td>
                  <td className="p-3 text-xs text-[#00ff41]">Recommended</td>
                  <td className="p-3 text-xs text-[#8b949e]">Root</td>
                  <td className="p-3 text-xs font-mono text-[#8b949e]">1705334400</td>
                </tr>
                <tr className="bg-[#00ff41]/5">
                  <td className="p-3 text-sm font-mono text-[#00d9ff]">action_source</td>
                  <td className="p-3 text-xs text-[#8b949e]">string</td>
                  <td className="p-3 text-xs text-[#00ff41]">CAPI only</td>
                  <td className="p-3 text-xs text-[#8b949e]">Root</td>
                  <td className="p-3 text-xs font-mono text-[#8b949e]">&quot;website&quot;</td>
                </tr>
                <tr>
                  <td className="p-3 text-sm font-mono text-[#00d9ff]">value</td>
                  <td className="p-3 text-xs text-[#8b949e]">number</td>
                  <td className="p-3 text-xs text-[#00ff41]">Purchase</td>
                  <td className="p-3 text-xs text-[#8b949e]">custom_data</td>
                  <td className="p-3 text-xs font-mono text-[#8b949e]">99.99</td>
                </tr>
                <tr className="bg-[#00ff41]/5">
                  <td className="p-3 text-sm font-mono text-[#00d9ff]">currency</td>
                  <td className="p-3 text-xs text-[#8b949e]">string (ISO)</td>
                  <td className="p-3 text-xs text-[#00ff41]">Purchase</td>
                  <td className="p-3 text-xs text-[#8b949e]">custom_data</td>
                  <td className="p-3 text-xs font-mono text-[#8b949e]">&quot;USD&quot;</td>
                </tr>
                <tr>
                  <td className="p-3 text-sm font-mono text-[#00d9ff]">content_ids</td>
                  <td className="p-3 text-xs text-[#8b949e]">array&lt;string&gt;</td>
                  <td className="p-3 text-xs text-[#8b949e]">Optional</td>
                  <td className="p-3 text-xs text-[#8b949e]">custom_data</td>
                  <td className="p-3 text-xs font-mono text-[#8b949e]">[&quot;prod_123&quot;]</td>
                </tr>
                <tr className="bg-[#00ff41]/5">
                  <td className="p-3 text-sm font-mono text-[#00d9ff]">content_name</td>
                  <td className="p-3 text-xs text-[#8b949e]">string</td>
                  <td className="p-3 text-xs text-[#8b949e]">Optional</td>
                  <td className="p-3 text-xs text-[#8b949e]">custom_data</td>
                  <td className="p-3 text-xs font-mono text-[#8b949e]">&quot;Product Name&quot;</td>
                </tr>
                <tr>
                  <td className="p-3 text-sm font-mono text-[#00d9ff]">content_category</td>
                  <td className="p-3 text-xs text-[#8b949e]">string</td>
                  <td className="p-3 text-xs text-[#8b949e]">Optional</td>
                  <td className="p-3 text-xs text-[#8b949e]">custom_data</td>
                  <td className="p-3 text-xs font-mono text-[#8b949e]">&quot;Electronics&quot;</td>
                </tr>
                <tr className="bg-[#00ff41]/5">
                  <td className="p-3 text-sm font-mono text-[#00d9ff]">content_type</td>
                  <td className="p-3 text-xs text-[#8b949e]">string</td>
                  <td className="p-3 text-xs text-[#8b949e]">Optional</td>
                  <td className="p-3 text-xs text-[#8b949e]">custom_data</td>
                  <td className="p-3 text-xs font-mono text-[#8b949e]">&quot;product&quot;</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Common Mistakes */}
        <div className="mt-6 glass-strong hover-border-glow rounded-xl border border-red-500/20 p-6">
          <h4 className="font-mono font-semibold text-red-400 mb-4">❌ Common Wrong Parameter Names</h4>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-mono text-[#8b949e] mb-2">Wrong:</p>
              <div className="space-y-2">
                <code className="block text-sm text-red-400">price</code>
                <code className="block text-sm text-red-400">amount</code>
                <code className="block text-sm text-red-400">total</code>
                <code className="block text-sm text-red-400">items</code>
                <code className="block text-sm text-red-400">products</code>
                <code className="block text-sm text-red-400">eventName</code>
                <code className="block text-sm text-red-400">eventId</code>
              </div>
            </div>
            
            <div>
              <p className="text-xs font-mono text-[#8b949e] mb-2">Correct:</p>
              <div className="space-y-2">
                <code className="block text-sm text-[#00ff41]">value</code>
                <code className="block text-sm text-[#00ff41]">value</code>
                <code className="block text-sm text-[#00ff41]">value</code>
                <code className="block text-sm text-[#00ff41]">content_ids</code>
                <code className="block text-sm text-[#00ff41]">content_ids</code>
                <code className="block text-sm text-[#00ff41]">event_name</code>
                <code className="block text-sm text-[#00ff41]">event_id</code>
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
          <div className="glass-strong hover-border-glow rounded-xl p-6 border border-[#00ff41]/20">
            <h4 className="font-mono font-semibold text-[#00ff41] mb-4">Correct Event Structure Template</h4>
            
            <div className="bg-[#0d1117] rounded-lg p-4 border border-[#00ff41]/20">
              <pre className="text-xs font-mono text-[#00ff41] overflow-x-auto">
{`// Correct structure for all events
const event = {
  // Root level (snake_case)
  event_name: "Purchase",           // PascalCase event name
  event_id: \`order_\${orderId}\`,      // Unique ID for dedup
  event_time: Math.floor(Date.now() / 1000),  // Unix timestamp
  action_source: "website",         // CAPI only
  
  // Custom data object
  custom_data: {
    currency: "USD",                // ISO 4217 code
    value: 99.99,                   // NUMBER not string
    content_ids: ["prod_123"],      // ARRAY not string
    content_name: "Product Name",   // String
    content_category: "Category",   // String
    content_type: "product",        // product|product_group
    num_items: 1                    // Integer
  },
  
  // User data object (all hashed with SHA-256)
  user_data: {
    em: "hash...",                  // Email hash
    ph: "hash...",                  // Phone hash
    // ... other PII hashes
    client_ip_address: "1.2.3.4",  // Not hashed
    client_user_agent: "Mozilla..." // Not hashed
  }
}`}
              </pre>
            </div>
          </div>

          <div className="glass-strong hover-border-glow rounded-xl p-6 border border-[#00ff41]/20">
            <h4 className="font-mono font-semibold text-[#00ff41] mb-4">TypeScript Type Definitions (Recommended)</h4>
            
            <div className="bg-[#0d1117] rounded-lg p-4 border border-[#00ff41]/20">
              <pre className="text-xs font-mono text-[#00ff41] overflow-x-auto">
{`interface MetaEvent {
  event_name: string
  event_id?: string
  event_time?: number
  action_source?: 'website' | 'app' | 'phone_call' | 'chat' | 'email'
  custom_data?: {
    currency?: string
    value?: number
    content_ids?: string[]
    content_name?: string
    content_category?: string
    content_type?: 'product' | 'product_group'
    num_items?: number
    order_id?: string
  }
  user_data?: {
    em?: string
    ph?: string
    fn?: string
    ln?: string
    ct?: string
    st?: string
    zp?: string
    country?: string
    external_id?: string
    client_ip_address?: string
    client_user_agent?: string
    fbc?: string
    fbp?: string
  }
}

// Usage with type safety
const purchaseEvent: MetaEvent = {
  event_name: "Purchase",
  event_id: \`order_\${orderId}\`,
  custom_data: {
    currency: "USD",
    value: 99.99  // TypeScript ensures this is a number!
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Playground */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Interactive Parameter Testing
        </h2>
        
        <EnhancedEventPlayground
          title="Parameter Structure Test Suite - 8 Common Mistakes"
          description="Real events demonstrating parameter errors. View Network Inspector to see exactly what Meta receives."
          events={parameterExamples}
          showModeToggle={true}
          showLogs={true}
          sendToMeta={true}
          sendToBoth={true}
          showNetworkInspector={true}
          showMetaResponse={true}
          testEventCode="TEST_PARAMS"
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
              <CheckCircle2 className="h-5 w-5 text-[#00ff41] mt-1 shrink-0" />
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Use TypeScript for Type Safety</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  TypeScript interfaces prevent wrong field names and types at compile time
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#00ff41] mt-1 shrink-0" />
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Always Use snake_case for Parameters</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  event_name not eventName, custom_data not customData
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#00ff41] mt-1 shrink-0" />
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Use PascalCase for Event Names</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Purchase not purchase, AddToCart not addToCart
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#00ff41] mt-1 shrink-0" />
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Validate Data Types Before Sending</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Check that value is number, content_ids is array, currency is string
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#00ff41] mt-1 shrink-0" />
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Test in Meta Events Manager</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Use test event codes and verify all fields appear correctly in Events Manager
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#00ff41] mt-1 shrink-0" />
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Reference Meta&apos;s Official Documentation</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Always check current API spec at developers.facebook.com/docs/meta-pixel
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </PageContent>
  )
}
