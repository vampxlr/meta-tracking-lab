"use client"

import { PageContent } from "@/components/page-content"
import { EnhancedEventPlayground } from "@/components/enhanced-event-playground"
import { AlertTriangle, ShoppingCart, Eye, CreditCard, CheckCircle, TrendingUp } from "lucide-react"

export default function EventOrderPage() {
  const examples = [
    {
      name: "Purchase Before ViewContent (ILLOGICAL)",
      icon: <AlertTriangle className="h-4 w-4 text-red-400" />,
      description: "User purchases without viewing product - confuses Meta&apos;s AI and breaks funnel analysis",
      brokenPayload: {
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
          value: 99.99,
          content_ids: ["PROD-123"]
        }
      },
      fixedPayload: null
    },
    {
      name: "AddToCart Before ViewContent (BROKEN FUNNEL)",
      icon: <AlertTriangle className="h-4 w-4 text-yellow-400" />,
      description: "User adds to cart without viewing - missing context for optimization",
      brokenPayload: {
        event_name: "AddToCart",
        event_id: `addtocart_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_ip_address: "192.168.1.1"
        },
        custom_data: {
          currency: "USD",
          value: 49.99,
          content_ids: ["PROD-456"]
        }
      },
      fixedPayload: null
    },
    {
      name: "InitiateCheckout Before AddToCart (SKIP STEPS)",
      icon: <AlertTriangle className="h-4 w-4 text-yellow-400" />,
      description: "Checkout started without cart - Meta can&apos;t understand user journey",
      brokenPayload: {
        event_name: "InitiateCheckout",
        event_id: `checkout_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_ip_address: "192.168.1.1"
        },
        custom_data: {
          currency: "USD",
          value: 149.99,
          num_items: 1
        }
      },
      fixedPayload: null
    },
    {
      name: "Correct E-Commerce Sequence (GOOD)",
      icon: <CheckCircle className="h-4 w-4 text-[#00ff41]" />,
      description: "Proper funnel: ViewContent → AddToCart → InitiateCheckout → Purchase",
      brokenPayload: null,
      fixedPayload: {
        event_name: "ViewContent",
        event_id: `view_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_ip_address: "192.168.1.1",
          client_user_agent: "Mozilla/5.0"
        },
        custom_data: {
          content_ids: ["PROD-789"],
          content_type: "product",
          content_name: "Premium Widget",
          currency: "USD",
          value: 79.99
        }
      }
    },
    {
      name: "Multiple AddToCart Events (VALID PATTERN)",
      icon: <ShoppingCart className="h-4 w-4 text-[#00ff41]" />,
      description: "User adds multiple items - shows consideration and intent",
      brokenPayload: null,
      fixedPayload: {
        event_name: "AddToCart",
        event_id: `addtocart_multi_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          client_ip_address: "192.168.1.1",
          client_user_agent: "Mozilla/5.0"
        },
        custom_data: {
          content_ids: ["PROD-101", "PROD-102"],
          content_type: "product",
          currency: "USD",
          value: 159.98,
          num_items: 2
        }
      }
    },
    {
      name: "Complete Funnel with Proper Timing (PERFECT)",
      icon: <TrendingUp className="h-4 w-4 text-[#00ff41]" />,
      description: "Full user journey with realistic timing between events",
      brokenPayload: null,
      fixedPayload: {
        event_name: "Purchase",
        event_id: `purchase_complete_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: "https://example.com/checkout/success",
        action_source: "website",
        user_data: {
          em: "7d3d1b3d5c4e3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c5e3d3c",
          ph: "16505551234567890abcdef0123456789abcdef0123456789abcdef012345",
          fn: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
          ln: "6b23c0d5f35d1b11f9b683f0b0a617355deb11277d91ae091d399c655b87940d",
          client_ip_address: "192.168.1.1",
          client_user_agent: "Mozilla/5.0",
          fbp: "fb.1.1705334567890.1234567890",
          fbc: "fb.1.1705334567890.IwAR1a2b3c4d5e6f7g8h9i0j"
        },
        custom_data: {
          currency: "USD",
          value: 299.99,
          content_ids: ["PROD-789", "PROD-101"],
          content_type: "product",
          num_items: 2,
          order_id: `ORD-2026-${Math.floor(Math.random() * 10000)}`
        }
      }
    }
  ]

  return (
    <PageContent
      title="Event Order & Sequencing"
      description="Master logical event sequencing and user journey tracking for accurate funnel analysis and Meta AI optimization"
      status="Stable"
    >
      
      {/* Why Event Order Matters */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Why Event Order Matters
        </h2>
        
        <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6">
          <p className="text-[#8b949e] text-sm md:text-base leading-relaxed mb-6">
            Meta&apos;s AI uses event sequences to understand user behavior, predict conversion likelihood, and optimize campaign targeting. When events occur in illogical order, it confuses the AI and reduces campaign effectiveness.
          </p>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="glass rounded-lg border border-red-500/20 p-5">
              <h3 className="font-mono text-red-400 font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Wrong Event Order Impact
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-[#8b949e]">
                  <span className="text-red-400 mt-0.5">•</span>
                  <span>Meta AI can&apos;t understand user intent</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-[#8b949e]">
                  <span className="text-red-400 mt-0.5">•</span>
                  <span>Funnel analysis shows incorrect drop-off rates</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-[#8b949e]">
                  <span className="text-red-400 mt-0.5">•</span>
                  <span>Lookalike audiences built on bad patterns</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-[#8b949e]">
                  <span className="text-red-400 mt-0.5">•</span>
                  <span>Campaign optimization targets wrong users</span>
                </li>
              </ul>
            </div>

            <div className="glass rounded-lg border border-[#00ff41]/20 p-5">
              <h3 className="font-mono text-[#00ff41] font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Correct Event Order Benefits
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-[#8b949e]">
                  <span className="text-[#00ff41] mt-0.5">•</span>
                  <span>Clear user journey visualization</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-[#8b949e]">
                  <span className="text-[#00ff41] mt-0.5">•</span>
                  <span>Accurate funnel drop-off identification</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-[#8b949e]">
                  <span className="text-[#00ff41] mt-0.5">•</span>
                  <span>Better lookalike audience quality</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-[#8b949e]">
                  <span className="text-[#00ff41] mt-0.5">•</span>
                  <span>Improved campaign optimization</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Standard E-Commerce Funnel */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Standard E-Commerce Event Sequence
        </h2>
        
        <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6">
          <p className="text-[#8b949e] text-sm mb-6">
            The recommended event sequence for e-commerce sites follows the natural user journey:
          </p>
          
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#00ff41]/20 border-2 border-[#00ff41] flex items-center justify-center shrink-0">
                <span className="font-mono text-[#00ff41] font-bold">1</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Eye className="h-5 w-5 text-[#00ff41]" />
                  <h3 className="font-mono text-[#e8f4f8] font-semibold">PageView / ViewContent</h3>
                </div>
                <p className="text-sm text-[#8b949e] mb-2">
                  User lands on product page and views item details
                </p>
                <code className="text-xs bg-[#0d1117] text-[#00ff41] px-3 py-1 rounded block overflow-x-auto">
                  fbq(&apos;track&apos;, &apos;ViewContent&apos;, {`{content_ids: ['PROD-123'], value: 99.99}`})
                </code>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="h-8 w-0.5 bg-[#00ff41]/30"></div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#00ff41]/20 border-2 border-[#00ff41] flex items-center justify-center shrink-0">
                <span className="font-mono text-[#00ff41] font-bold">2</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <ShoppingCart className="h-5 w-5 text-[#00ff41]" />
                  <h3 className="font-mono text-[#e8f4f8] font-semibold">AddToCart</h3>
                </div>
                <p className="text-sm text-[#8b949e] mb-2">
                  User clicks &quot;Add to Cart&quot; button, showing purchase intent
                </p>
                <code className="text-xs bg-[#0d1117] text-[#00ff41] px-3 py-1 rounded block overflow-x-auto">
                  fbq(&apos;track&apos;, &apos;AddToCart&apos;, {`{content_ids: ['PROD-123'], value: 99.99}`})
                </code>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="h-8 w-0.5 bg-[#00ff41]/30"></div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#00ff41]/20 border-2 border-[#00ff41] flex items-center justify-center shrink-0">
                <span className="font-mono text-[#00ff41] font-bold">3</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard className="h-5 w-5 text-[#00ff41]" />
                  <h3 className="font-mono text-[#e8f4f8] font-semibold">InitiateCheckout</h3>
                </div>
                <p className="text-sm text-[#8b949e] mb-2">
                  User proceeds to checkout page, high conversion intent
                </p>
                <code className="text-xs bg-[#0d1117] text-[#00ff41] px-3 py-1 rounded block overflow-x-auto">
                  fbq(&apos;track&apos;, &apos;InitiateCheckout&apos;, {`{value: 99.99, num_items: 1}`})
                </code>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="h-8 w-0.5 bg-[#00ff41]/30"></div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#00ff41]/20 border-2 border-[#00ff41] flex items-center justify-center shrink-0">
                <span className="font-mono text-[#00ff41] font-bold">4</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="h-5 w-5 text-[#00ff41]" />
                  <h3 className="font-mono text-[#e8f4f8] font-semibold">Purchase</h3>
                </div>
                <p className="text-sm text-[#8b949e] mb-2">
                  User completes payment, conversion achieved
                </p>
                <code className="text-xs bg-[#0d1117] text-[#00ff41] px-3 py-1 rounded block overflow-x-auto">
                  fbq(&apos;track&apos;, &apos;Purchase&apos;, {`{value: 99.99, currency: 'USD'}`}, {`{eventID: 'order_123'}`})
                </code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Timing Best Practices */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Event Timing Considerations
        </h2>
        
        <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6 space-y-6">
          <div>
            <h3 className="font-mono text-lg font-semibold text-[#e8f4f8] mb-3">Realistic Time Gaps</h3>
            <p className="text-sm text-[#8b949e] mb-4">
              Events should have realistic time gaps between them. If ViewContent, AddToCart, and Purchase all happen within 1 second, Meta flags it as suspicious bot activity.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="glass rounded-lg border border-red-500/20 p-4">
                <p className="font-mono text-sm font-semibold text-red-400 mb-2">❌ Suspicious Pattern</p>
                <div className="space-y-1 text-xs font-mono text-[#8b949e]">
                  <div>ViewContent - 14:30:00</div>
                  <div>AddToCart - 14:30:00</div>
                  <div>Purchase - 14:30:01</div>
                </div>
                <p className="text-xs text-red-400 mt-2">All events within 1 second - looks like a bot</p>
              </div>
              <div className="glass rounded-lg border border-[#00ff41]/20 p-4">
                <p className="font-mono text-sm font-semibold text-[#00ff41] mb-2">✓ Natural Pattern</p>
                <div className="space-y-1 text-xs font-mono text-[#8b949e]">
                  <div>ViewContent - 14:30:00</div>
                  <div>AddToCart - 14:32:15</div>
                  <div>Purchase - 14:35:42</div>
                </div>
                <p className="text-xs text-[#00ff41] mt-2">Realistic time gaps show human behavior</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-mono text-lg font-semibold text-[#e8f4f8] mb-3">Multiple Events Are Normal</h3>
            <p className="text-sm text-[#8b949e] mb-3">
              Users often view multiple products, add/remove items from cart, or abandon and return. These patterns are valuable for Meta&apos;s AI.
            </p>
            <div className="glass rounded-lg border border-[#00ff41]/20 p-4">
              <p className="font-mono text-sm font-semibold text-[#00ff41] mb-2">✓ Valid Pattern: Shopping Consideration</p>
              <div className="space-y-1 text-xs font-mono text-[#8b949e]">
                <div>ViewContent (Product A)</div>
                <div>ViewContent (Product B)</div>
                <div>AddToCart (Product A)</div>
                <div>ViewContent (Product C)</div>
                <div>AddToCart (Product C)</div>
                <div>InitiateCheckout</div>
                <div>Purchase</div>
              </div>
              <p className="text-xs text-[#00ff41] mt-2">Shows user comparing options - high-quality signal</p>
            </div>
          </div>
        </div>
      </section>

      {/* Common Mistakes */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Common Event Order Mistakes
        </h2>
        
        <div className="grid gap-4">
          <div className="glass hover-lift rounded-xl border border-red-500/20 p-5">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0">
                <span className="font-mono text-red-400 font-bold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-mono font-semibold text-red-400 mb-2">Firing Purchase Before AddToCart</h3>
                <p className="text-sm text-[#8b949e]">
                  Testing checkout confirmation page and accidentally firing Purchase without preceding funnel events. Always test with test_event_code enabled.
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
                <h3 className="font-mono font-semibold text-red-400 mb-2">All Events Fire Simultaneously</h3>
                <p className="text-sm text-[#8b949e]">
                  Using a tag manager that fires all events on page load instead of on user actions. Events should fire when the actual action occurs.
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
                <h3 className="font-mono font-semibold text-red-400 mb-2">Missing Intermediate Events</h3>
                <p className="text-sm text-[#8b949e]">
                  Only tracking PageView and Purchase - Meta can&apos;t see the full funnel. Include ViewContent, AddToCart, and InitiateCheckout for complete journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Playground */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[400ms]">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Interactive Event Order Examples
        </h2>
        
        <EnhancedEventPlayground
          title="Event Sequence Testing"
          description="Test 6 different event order scenarios from broken funnels to perfect sequences. See how event order affects Meta&apos;s understanding of your user journey."
          events={examples}
          showModeToggle={true}
          showLogs={true}
          sendToMeta={true}
          sendToBoth={true}
          showNetworkInspector={true}
          showMetaResponse={true}
          enableComparison={true}
          testEventCode="TEST_EVENT_ORDER"
          pixelId={process.env.NEXT_PUBLIC_FB_PIXEL_ID}
        />
      </section>

      {/* Implementation Tips */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Implementation Best Practices
        </h2>
        
        <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 flex items-center justify-center shrink-0">
              <span className="font-mono text-[#00ff41] font-bold text-sm">1</span>
            </div>
            <div>
              <h3 className="font-mono text-[#e8f4f8] font-semibold mb-2">Event Listeners on User Actions</h3>
              <p className="text-sm text-[#8b949e] mb-2">
                Attach event tracking to actual user interactions, not page loads
              </p>
              <pre className="overflow-x-auto rounded-lg border border-[#00ff41]/20 bg-[#0d1117] p-3 font-mono text-xs">
                <code className="text-[#00ff41]">{`// Fire when user clicks "Add to Cart"
addToCartButton.addEventListener('click', () => {
  fbq('track', 'AddToCart', {
    content_ids: [productId],
    value: price,
    currency: 'USD'
  });
});`}</code>
              </pre>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 flex items-center justify-center shrink-0">
              <span className="font-mono text-[#00ff41] font-bold text-sm">2</span>
            </div>
            <div>
              <h3 className="font-mono text-[#e8f4f8] font-semibold mb-2">Page-Specific Event Tracking</h3>
              <p className="text-sm text-[#8b949e] mb-2">
                Fire events based on page URL to ensure correct sequencing
              </p>
              <pre className="overflow-x-auto rounded-lg border border-[#00ff41]/20 bg-[#0d1117] p-3 font-mono text-xs">
                <code className="text-[#00ff41]">{`// On product page
if (window.location.pathname.includes('/product/')) {
  fbq('track', 'ViewContent', {...});
}

// On checkout success page
if (window.location.pathname === '/checkout/success') {
  fbq('track', 'Purchase', {...}, {eventID: orderId});
}`}</code>
              </pre>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 flex items-center justify-center shrink-0">
              <span className="font-mono text-[#00ff41] font-bold text-sm">3</span>
            </div>
            <div>
              <h3 className="font-mono text-[#e8f4f8] font-semibold mb-2">Test Full Funnel Regularly</h3>
              <p className="text-sm text-[#8b949e]">
                Go through your entire checkout flow and verify events fire in correct order in Events Manager Test Events tab.
              </p>
            </div>
          </div>
        </div>
      </section>

    </PageContent>
  )
}
