"use client"

import { PageContent } from "@/components/page-content"
import { EnhancedEventPlayground } from "@/components/enhanced-event-playground"
import { RefreshCw, Database, Clock, AlertTriangle, CheckCircle2, XCircle, Zap, TrendingUp } from "lucide-react"

export default function RetryQueuePage() {
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

  const retryExamples = [
    {
      name: "No Retry (EVENTS LOST)",
      icon: <XCircle className="h-4 w-4 text-red-400" />,
      description: "Network failure → Event lost forever → Revenue not tracked",
      brokenPayload: {
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
          value: 999.99,
          source_page: "/server/retry-queue",
          example_name: "No Retry - EVENTS LOST",
          test_mode: "broken",
          note: "Network fails → $999 purchase lost forever"
        }
      },
      fixedPayload: {
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
          value: 999.99,
          source_page: "/server/retry-queue",
          example_name: "With Retry Queue - RECOVERED",
          test_mode: "fixed",
          note: "Network fails → queued → retried → $999 purchase tracked!"
        }
      }
    },
    {
      name: "Immediate Retry (TOO AGGRESSIVE)",
      icon: <AlertTriangle className="h-4 w-4 text-yellow-400" />,
      description: "Retry instantly on failure → Overwhelms Meta API → Gets rate limited",
      brokenPayload: {
        event_name: "AddToCart",
        event_id: `cart_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514"
        },
        custom_data: {
          currency: "USD",
          value: 49.99,
          source_page: "/server/retry-queue",
          example_name: "Immediate Retry - TOO AGGRESSIVE",
          test_mode: "broken",
          note: "Retry 0ms after failure → overwhelms API → rate limited"
        }
      },
      fixedPayload: {
        event_name: "AddToCart",
        event_id: `cart_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514",
          client_ip_address: "192.168.1.1"
        },
        custom_data: {
          currency: "USD",
          value: 49.99,
          source_page: "/server/retry-queue",
          example_name: "Exponential Backoff - SMART",
          test_mode: "fixed",
          note: "Retry after 1s, 2s, 4s, 8s... - respects API limits"
        }
      }
    },
    {
      name: "In-Memory Queue (LOST ON RESTART)",
      icon: <AlertTriangle className="h-4 w-4 text-yellow-400" />,
      description: "Queue in RAM → Server restarts → All queued events lost",
      brokenPayload: {
        event_name: "Purchase",
        event_id: `purchase_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514"
        },
        custom_data: {
          currency: "USD",
          value: 299.99,
          source_page: "/server/retry-queue",
          example_name: "In-Memory Queue - VOLATILE",
          test_mode: "broken",
          note: "Queued in RAM → server restarts → all queued events lost"
        }
      },
      fixedPayload: {
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
          value: 299.99,
          source_page: "/server/retry-queue",
          example_name: "Persistent Queue (DB/Redis) - DURABLE",
          test_mode: "fixed",
          note: "Queued in database/Redis → survives server restarts"
        }
      }
    },
    {
      name: "Max Retries with Exponential Backoff",
      icon: <Clock className="h-4 w-4 text-[#00ff41]" />,
      description: "Smart retry: 1s → 2s → 4s → 8s → 16s → Give up after 5 attempts",
      brokenPayload: null,
      fixedPayload: {
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
          value: 149.99,
          num_items: 2,
          source_page: "/server/retry-queue",
          example_name: "Exponential Backoff - OPTIMAL",
          test_mode: "fixed",
          note: "Retry with delays: 1s, 2s, 4s, 8s, 16s (max 5 attempts)"
        }
      }
    },
    {
      name: "Priority Queue for High-Value Events",
      icon: <TrendingUp className="h-4 w-4 text-[#00ff41]" />,
      description: "Purchases ($999) retry before AddToCart ($49) events",
      brokenPayload: null,
      fixedPayload: {
        event_name: "Purchase",
        event_id: `purchase_priority_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514",
          ph: "254d69f6b8f6a6e9c2b1c573b0885c9b6f3f3f3c8c0f3f3f3f3f3f3f3f3f3f3",
          client_ip_address: "192.168.1.1"
        },
        custom_data: {
          currency: "USD",
          value: 999.99,
          order_id: `ORD-${Date.now()}`,
          source_page: "/server/retry-queue",
          example_name: "Priority Queue - HIGH VALUE FIRST",
          test_mode: "fixed",
          note: "High-value purchases retry before low-value events"
        }
      }
    },
    {
      name: "Dead Letter Queue",
      icon: <Database className="h-4 w-4 text-[#00d9ff]" />,
      description: "After max retries failed → Move to dead letter queue for manual review",
      brokenPayload: null,
      fixedPayload: {
        event_name: "Purchase",
        event_id: `purchase_dlq_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
        action_source: "website",
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514",
          client_ip_address: "192.168.1.1"
        },
        custom_data: {
          currency: "USD",
          value: 599.99,
          source_page: "/server/retry-queue",
          example_name: "Dead Letter Queue - MANUAL REVIEW",
          test_mode: "fixed",
          note: "Failed 5+ times → moved to DLQ → alert sent → manual review"
        }
      }
    },
    {
      name: "Batch Retry for Efficiency",
      icon: <Zap className="h-4 w-4 text-[#00ff41]" />,
      description: "Send 50 failed events in one batch request instead of 50 individual retries",
      brokenPayload: null,
      fixedPayload: {
        event_name: "ViewContent",
        event_id: `view_batch_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: "b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514",
          client_ip_address: "192.168.1.1"
        },
        custom_data: {
          content_ids: ["PROD-789"],
          content_type: "product",
          source_page: "/server/retry-queue",
          example_name: "Batch Retry - EFFICIENT",
          test_mode: "fixed",
          note: "Batch up to 1000 events per retry request - 20x faster"
        }
      }
    },
    {
      name: "Complete Retry System (PRODUCTION READY)",
      icon: <CheckCircle2 className="h-4 w-4 text-[#00ff41]" />,
      description: "Full implementation: Persistent queue + exponential backoff + priority + DLQ + monitoring",
      brokenPayload: null,
      fixedPayload: {
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
          client_ip_address: "192.168.1.1",
          client_user_agent: "Mozilla/5.0"
        },
        custom_data: {
          currency: "USD",
          value: 749.99,
          content_ids: ["PROD-001", "PROD-002"],
          content_type: "product",
          num_items: 2,
          order_id: `ORD-${Date.now()}`,
          source_page: "/server/retry-queue",
          example_name: "Complete Retry System - PRODUCTION READY",
          test_mode: "fixed",
          note: "PostgreSQL queue + exponential backoff + priority + DLQ + alerts"
        }
      }
    }
  ]

  return (
    <PageContent
      title="Retry Queue"
      description="Implement robust retry logic with exponential backoff, persistent storage, and dead letter queues to never lose a conversion event"
      status="Beta"
    >

      {/* Why Retry Queue */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Why You Need a Retry Queue
        </h2>

        <div className="space-y-4">
          <p className="leading-relaxed text-[#8b949e] text-sm md:text-base">
            Network failures, API rate limits, and temporary outages mean some events will fail to reach Meta. Without retry logic, these events are lost forever—potentially costing you thousands in untracked conversions. A retry queue ensures every event eventually reaches Meta.
          </p>

          <div className="border-gradient">
            <div className="border-gradient-content glass-strong p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <XCircle className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="font-mono text-xl font-bold text-red-400">Real-World Failure Scenarios</h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="glass hover-glow rounded-lg p-4 border border-red-500/20">
                  <p className="font-mono font-semibold text-red-400 mb-2">Network Timeout</p>
                  <p className="text-sm text-[#8b949e]">
                    User on slow mobile connection → Event times out → $299 purchase never tracked
                  </p>
                </div>

                <div className="glass hover-glow rounded-lg p-4 border border-red-500/20">
                  <p className="font-mono font-semibold text-red-400 mb-2">Meta API Down</p>
                  <p className="text-sm text-[#8b949e]">
                    Meta&apos;s API experiences temporary outage → All events lost during downtime
                  </p>
                </div>

                <div className="glass hover-glow rounded-lg p-4 border border-red-500/20">
                  <p className="font-mono font-semibold text-red-400 mb-2">Rate Limit Hit</p>
                  <p className="text-sm text-[#8b949e]">
                    Traffic spike → Hit Meta&apos;s rate limit → New events rejected until limit resets
                  </p>
                </div>

                <div className="glass hover-glow rounded-lg p-4 border border-red-500/20">
                  <p className="font-mono font-semibold text-red-400 mb-2">Server Restart</p>
                  <p className="text-sm text-[#8b949e]">
                    Deploy new code → Server restarts → In-flight requests lost
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Retry Queue Works */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> How Retry Queue Works
        </h2>

        <div className="space-y-6">
          {/* Flow Diagram */}
          <div className="glass-strong rounded-xl p-6 border border-[#00ff41]/20">
            <div className="bg-[#0d1117] rounded-lg p-4 border border-[#00ff41]/20">
              <pre className="text-xs font-mono text-[#00ff41] overflow-x-auto">
                {`┌─────────────────────────────────────────────────────────────┐
│ Event Lifecycle with Retry Queue                           │
└─────────────────────────────────────────────────────────────┘

1. Event Created
   ↓
2. Attempt Send to Meta
   ↓
   ├─ SUCCESS ✓ → Event tracked, done
   │
   └─ FAILURE ✗
      ↓
3. Save to Persistent Queue (PostgreSQL/Redis)
   ↓
4. Exponential Backoff Retry
   │
   ├─ Attempt 1: Wait 1s  → Retry
   ├─ Attempt 2: Wait 2s  → Retry
   ├─ Attempt 3: Wait 4s  → Retry
   ├─ Attempt 4: Wait 8s  → Retry
   └─ Attempt 5: Wait 16s → Retry
      ↓
      ├─ SUCCESS ✓ → Remove from queue, event tracked
      │
      └─ STILL FAILING after 5 attempts
         ↓
5. Move to Dead Letter Queue (DLQ)
   ↓
6. Alert DevOps team
   ↓
7. Manual review & retry`}
              </pre>
            </div>
          </div>

          {/* Key Components */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="glass-strong rounded-lg p-4 border border-[#00ff41]/20">
              <div className="flex items-center gap-2 mb-3">
                <Database className="h-5 w-5 text-[#00ff41]" />
                <h4 className="font-mono font-semibold text-[#00ff41]">Persistent Storage</h4>
              </div>
              <p className="text-xs text-[#8b949e]">
                PostgreSQL, Redis, or RabbitMQ to store failed events. Survives server restarts.
              </p>
            </div>

            <div className="glass-strong rounded-lg p-4 border border-[#00ff41]/20">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-5 w-5 text-[#00ff41]" />
                <h4 className="font-mono font-semibold text-[#00ff41]">Exponential Backoff</h4>
              </div>
              <p className="text-xs text-[#8b949e]">
                Wait 1s, 2s, 4s, 8s, 16s between retries. Prevents overwhelming Meta&apos;s API.
              </p>
            </div>

            <div className="glass-strong rounded-lg p-4 border border-[#00ff41]/20">
              <div className="flex items-center gap-2 mb-3">
                <RefreshCw className="h-5 w-5 text-[#00ff41]" />
                <h4 className="font-mono font-semibold text-[#00ff41]">Dead Letter Queue</h4>
              </div>
              <p className="text-xs text-[#8b949e]">
                Events that fail 5+ times move to DLQ for manual investigation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
          <span className="inline-block animate-pulse">▸</span> Implementation Guide
        </h2>

        <div className="space-y-6">
          {/* Database Schema */}
          <div className="glass-strong hover-border-glow rounded-xl p-6 border border-[#00ff41]/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 flex items-center justify-center">
                <span className="font-mono text-[#00ff41] font-bold">1</span>
              </div>
              <h3 className="font-mono text-lg font-semibold text-[#e8f4f8]">Create Queue Table</h3>
            </div>

            <div className="bg-[#0d1117] rounded-lg p-4 border border-[#00ff41]/20">
              <p className="text-xs font-mono text-[#00ff41] mb-2">PostgreSQL Schema:</p>
              <pre className="text-xs font-mono text-[#8b949e] overflow-x-auto">
                {`CREATE TABLE event_queue (
  id SERIAL PRIMARY KEY,
  event_id VARCHAR(255) UNIQUE NOT NULL,
  payload JSONB NOT NULL,
  attempt_count INT DEFAULT 0,
  next_retry_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'pending',
  error_message TEXT,
  priority INT DEFAULT 0 -- Higher = retry first
);

CREATE INDEX idx_next_retry ON event_queue(next_retry_at)
  WHERE status = 'pending';
CREATE INDEX idx_priority ON event_queue(priority DESC);`}
              </pre>
            </div>
          </div>

          {/* Queue Worker */}
          <div className="glass-strong hover-border-glow rounded-xl p-6 border border-[#00ff41]/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 flex items-center justify-center">
                <span className="font-mono text-[#00ff41] font-bold">2</span>
              </div>
              <h3 className="font-mono text-lg font-semibold text-[#e8f4f8]">Background Worker</h3>
            </div>

            <div className="bg-[#0d1117] rounded-lg p-4 border border-[#00ff41]/20">
              <p className="text-xs font-mono text-[#00ff41] mb-2">Retry Worker (runs every 5 seconds):</p>
              <pre className="text-xs font-mono text-[#8b949e] overflow-x-auto">
                {`async function processQueue() {
  // Get events ready for retry
  const events = await db.query(\`
    SELECT * FROM event_queue
    WHERE status = 'pending'
      AND next_retry_at <= NOW()
    ORDER BY priority DESC, created_at ASC
    LIMIT 100
  \`)
  
  for (const event of events) {
    try {
      // Attempt send to Meta
      await sendToMeta(event.payload)
      
      // Success! Remove from queue
      await db.query(\`
        DELETE FROM event_queue WHERE id = $1
      \`, [event.id])
      
    } catch (error) {
      // Failed - calculate next retry
      const attempt = event.attempt_count + 1
      const backoffSeconds = Math.pow(2, attempt) // 2^1, 2^2, 2^3...
      
      if (attempt >= 5) {
        // Max retries reached → Move to DLQ
        await db.query(\`
          UPDATE event_queue 
          SET status = 'dead_letter',
              error_message = $1,
              updated_at = NOW()
          WHERE id = $2
        \`, [error.message, event.id])
        
        // Alert team
        await sendAlert(\`Event \${event.event_id} moved to DLQ\`)
        
      } else {
        // Schedule next retry
        await db.query(\`
          UPDATE event_queue
          SET attempt_count = $1,
              next_retry_at = NOW() + INTERVAL '\${backoffSeconds} seconds',
              error_message = $2,
              updated_at = NOW()
          WHERE id = $3
        \`, [attempt, error.message, event.id])
      }
    }
  }
}

// Run every 5 seconds
setInterval(processQueue, 5000)`}
              </pre>
            </div>
          </div>

          {/* API Route Integration */}
          <div className="glass-strong hover-border-glow rounded-xl p-6 border border-[#00ff41]/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 flex items-center justify-center">
                <span className="font-mono text-[#00ff41] font-bold">3</span>
              </div>
              <h3 className="font-mono text-lg font-semibold text-[#e8f4f8]">Update API Route</h3>
            </div>

            <div className="bg-[#0d1117] rounded-lg p-4 border border-[#00ff41]/20">
              <p className="text-xs font-mono text-[#00ff41] mb-2">Add to your CAPI endpoint:</p>
              <pre className="text-xs font-mono text-[#8b949e] overflow-x-auto">
                {`export async function POST(request: NextRequest) {
  const payload = await request.json()
  
  try {
    // Try to send immediately
    const response = await sendToMeta(payload)
    return NextResponse.json(response)
    
  } catch (error) {
    // Failed - add to retry queue
    const priority = payload.event_name === 'Purchase' 
      ? (payload.custom_data?.value || 0) // Higher value = higher priority
      : 0
    
    await db.query(\`
      INSERT INTO event_queue (event_id, payload, next_retry_at, priority)
      VALUES ($1, $2, NOW() + INTERVAL '1 second', $3)
      ON CONFLICT (event_id) DO NOTHING
    \`, [payload.event_id, payload, priority])
    
    // Return success to client (queued for retry)
    return NextResponse.json({ 
      queued: true, 
      message: 'Event queued for retry' 
    })
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
            <RefreshCw className="h-5 w-5 text-[#00d9ff]" />
            <h4 className="font-mono font-semibold text-[#00d9ff]">Retry Queue Patterns</h4>
          </div>
          <p className="text-sm text-[#8b949e]">
            These examples demonstrate different retry strategies and queue configurations for maximum reliability.
          </p>
        </div>

        <EnhancedEventPlayground
          title="Retry Queue Examples"
          description="See how retry logic prevents lost conversions"
          events={retryExamples}
          showLogs={true}
          sendToMeta={true}
          sendToBoth={false}
          showNetworkInspector={true}
          showMetaResponse={true}
          testEventCode="TEST_RETRY_QUEUE"
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
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Use Exponential Backoff (Not Linear)</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  1s, 2s, 4s, 8s, 16s (exponential) NOT 1s, 2s, 3s, 4s, 5s (linear)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#00ff41] font-mono mt-1">✓</span>
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Persistent Storage is Critical</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Use PostgreSQL, Redis, or RabbitMQ - never just in-memory arrays
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#00ff41] font-mono mt-1">✓</span>
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Prioritize High-Value Events</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Retry $999 Purchases before $49 AddToCart events
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#00ff41] font-mono mt-1">✓</span>
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Set Max Retry Limit</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  5 attempts is reasonable - then move to DLQ for manual review
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#00ff41] font-mono mt-1">✓</span>
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Monitor Queue Depth</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Alert if queue grows &gt;1000 events - indicates systemic issue
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#00ff41] font-mono mt-1">✓</span>
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Batch Retry When Possible</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Send up to 1000 events per request for efficiency
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#00ff41] font-mono mt-1">✓</span>
              <div>
                <p className="font-mono font-semibold text-[#e8f4f8] text-sm">Clean Up Old Events</p>
                <p className="text-xs text-[#8b949e] mt-1">
                  Archive or delete events older than 7 days from DLQ
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </PageContent>
  )
}
