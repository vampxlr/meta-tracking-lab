# Event Deduplication Guide - Complete Reference

**Updated:** January 16, 2026  
**Critical Concept:** How to prevent duplicate event counting when using both Meta Pixel and CAPI

---

## 🎯 THE CORE CHALLENGE

**Question:** How does your server know what `event_id` the client sent to Pixel?

**Answer:** It doesn't - unless you explicitly pass it!

This is the **#1 cause** of failed deduplication in production systems.

---

## ❌ WHAT DOESN'T WORK

### Mistake 1: Generating Separately on Client and Server

```javascript
// CLIENT (Browser)
const eventId = crypto.randomUUID()  // "550e8400-e29b-41d4-a716-446655440000"
fbq('track', 'Purchase', {...}, { eventID: eventId })

// SERVER (Different execution context)
const eventId = crypto.randomUUID()  // "7c9e6679-7425-40de-944b-e07fc1f90ae7" ← DIFFERENT!
sendToCAPI({ event_id: eventId })

// RESULT: Two different UUIDs = Counted twice ✗
```

**Why it fails:** Each `randomUUID()` call generates a unique ID. Client and server have no way to coordinate.

### Mistake 2: Using Timestamps

```javascript
// CLIENT
const eventId = `event_${Date.now()}`  // "event_1768567985422"
fbq('track', 'Purchase', {...}, { eventID: eventId })

// 50ms later on SERVER
const eventId = `event_${Date.now()}`  // "event_1768567985472" ← DIFFERENT!
sendToCAPI({ event_id: eventId })

// RESULT: Even 1ms difference = Different IDs = Counted twice ✗
```

**Why it fails:** Timing differences guarantee different IDs. Network latency, processing time, etc.

---

## ✅ WHAT WORKS: 3 PRODUCTION PATTERNS

### Pattern 1: Client Generates → Server Receives (MOST COMMON)

**Best for:** Real-time events (AddToCart, ViewContent, InitiateCheckout)

**Flow:**
1. Client generates UUID **once**
2. Client sends to Pixel with that UUID
3. Client sends **same UUID** to server via API
4. Server forwards **same UUID** to CAPI

**Implementation:**

```javascript
// ========================================
// CLIENT SIDE (components/ProductCard.tsx)
// ========================================
async function handleAddToCart() {
  // 1. Generate UUID ONCE
  const eventId = crypto.randomUUID()
  // e.g., "550e8400-e29b-41d4-a716-446655440000"
  
  // 2. Send to Pixel immediately
  fbq('track', 'AddToCart', {
    currency: 'USD',
    value: product.price,
    content_ids: [product.id],
    content_type: 'product'
  }, { 
    eventID: eventId  // Use generated UUID
  })
  
  // 3. Send SAME UUID to server
  await fetch('/api/events/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventId: eventId,  // ← Pass the SAME UUID
      eventName: 'AddToCart',
      productId: product.id,
      price: product.price
    })
  })
}

// ========================================
// SERVER SIDE (app/api/events/track/route.ts)
// ========================================
import { NextRequest, NextResponse } from 'next/server'
import { sendToCAPI } from '@/lib/meta/capiClient'

export async function POST(request: NextRequest) {
  try {
    const { eventId, eventName, productId, price } = await request.json()
    
    // 4. Forward to CAPI with the SAME eventId from client
    const response = await sendToCAPI({
      event_id: eventId,  // ← Same UUID client sent
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      user_data: {
        client_ip_address: request.headers.get('x-forwarded-for') || '0.0.0.0',
        client_user_agent: request.headers.get('user-agent') || ''
      },
      custom_data: {
        currency: 'USD',
        value: price,
        content_ids: [productId],
        content_type: 'product'
      }
    })
    
    return NextResponse.json({ success: true, response })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 })
  }
}

// ========================================
// RESULT
// ========================================
// Pixel:  event_id = "550e8400-e29b-41d4-a716-446655440000"
// CAPI:   event_id = "550e8400-e29b-41d4-a716-446655440000"
// Meta sees: SAME ID → Deduplicated! ✓
```

---

### Pattern 2: Use Existing Order ID (BEST FOR E-COMMERCE)

**Best for:** Purchases, Subscriptions (events with natural transaction IDs)

**Benefit:** Order ID already exists - no need to generate new UUID!

**Implementation:**

```javascript
// ========================================
// CLIENT SIDE (components/CheckoutButton.tsx)
// ========================================
async function handleCheckout() {
  // Complete checkout, get order
  const order = await createOrder(cart)
  
  // Order ID is already a UUID in your database
  const orderId = order.id
  // e.g., "order_7c9e6679-7425-40de-944b-e07fc1f90ae7"
  
  // 1. Track with Pixel using order UUID
  fbq('track', 'Purchase', {
    currency: order.currency,
    value: order.total,
    content_ids: order.items.map(item => item.productId),
    content_type: 'product',
    num_items: order.items.length
  }, { 
    eventID: orderId  // Use order UUID as event_id
  })
  
  // 2. Server-side tracking happens automatically
  // (your order creation endpoint handles it)
}

// ========================================
// SERVER SIDE (app/api/orders/create/route.ts)
// ========================================
export async function POST(request: NextRequest) {
  const { cartItems } = await request.json()
  
  // Create order in database (generates UUID)
  const order = await db.orders.create({
    id: crypto.randomUUID(),  // e.g., "7c9e6679-7425-40de-944b-e07fc1f90ae7"
    items: cartItems,
    total: calculateTotal(cartItems),
    currency: 'USD'
  })
  
  // Send to CAPI with the SAME order UUID
  await sendToCAPI({
    event_id: order.id,  // ← Same order UUID
    event_name: 'Purchase',
    event_time: Math.floor(Date.now() / 1000),
    action_source: 'website',
    custom_data: {
      currency: order.currency,
      value: order.total,
      order_id: order.id,  // Also in custom_data for tracking
      content_ids: order.items.map(item => item.productId)
    }
  })
  
  return NextResponse.json({ order })
}

// ========================================
// RESULT
// ========================================
// Pixel:  event_id = "7c9e6679-7425-40de-944b-e07fc1f90ae7"
// CAPI:   event_id = "7c9e6679-7425-40de-944b-e07fc1f90ae7"
// Meta sees: SAME order UUID → Deduplicated! ✓
// BONUS: Easy to debug - search by order ID in Meta Events Manager!
```

---

### Pattern 3: Server-First (FOR BACKEND EVENTS)

**Best for:** Server-side only events (subscription renewals, webhooks, cron jobs)

**Flow:**
1. Server generates event (e.g., from webhook, cron job)
2. Server sends to CAPI with UUID
3. *Optional:* If client also needs to track, server passes UUID to client

**Implementation:**

```javascript
// ========================================
// SERVER SIDE (webhooks/stripe/route.ts)
// ========================================
export async function POST(request: NextRequest) {
  const event = await request.json()
  
  if (event.type === 'invoice.payment_succeeded') {
    const subscription = event.data.object
    
    // 1. Generate UUID for this event
    const eventId = crypto.randomUUID()
    
    // 2. Send to CAPI
    await sendToCAPI({
      event_id: eventId,
      event_name: 'Subscribe',
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      user_data: {
        em: await hashEmail(subscription.customer.email),
        external_id: subscription.customer.id
      },
      custom_data: {
        currency: subscription.currency,
        value: subscription.amount / 100,
        subscription_id: subscription.id,
        predicted_ltv: subscription.amount * 12  // Annual value
      }
    })
    
    // 3. Store event_id with subscription for tracking
    await db.subscriptions.update({
      id: subscription.id,
      metaEventId: eventId
    })
  }
  
  return NextResponse.json({ received: true })
}

// ========================================
// OPTIONAL: If client later tracks same event
// ========================================
// app/api/subscriptions/[id]/route.ts
export async function GET(request, { params }) {
  const subscription = await db.subscriptions.findById(params.id)
  
  return NextResponse.json({
    subscription,
    metaEventId: subscription.metaEventId  // Pass to client if needed
  })
}

// Client can use this IF it also needs to track:
const { subscription, metaEventId } = await fetch('/api/subscriptions/123')
fbq('track', 'Subscribe', {...}, { eventID: metaEventId })
```

---

## 🔍 DEBUGGING DEDUPLICATION

### Check if Deduplication is Working

1. **Send an event** with both Pixel and CAPI
2. **Go to Meta Events Manager** → Test Events (or Live Events)
3. **Search for your event_id**
4. **Count the events:**
   - ✅ **1 event:** Deduplication working!
   - ❌ **2 events:** Deduplication broken (different IDs)

### Common Debug Steps

```javascript
// Add logging to verify same ID used
console.log('Pixel event_id:', eventId)

// Server-side
console.log('CAPI event_id:', receivedEventId)
console.log('IDs match:', eventId === receivedEventId)  // Should be true!
```

### Use Test Event Code

```javascript
// Both Pixel and CAPI
fbq('track', 'Purchase', {...}, { 
  eventID: eventId,
  test_event_code: 'TEST_DEDUP_123'  // Appears in Test Events tab only
})

sendToCAPI({
  event_id: eventId,
  test_event_code: 'TEST_DEDUP_123',  // Same code
  //...
})
```

---

## 📊 REAL-WORLD STATISTICS

**Without proper deduplication:**
- 1 purchase → Counted as 2 purchases
- $100 revenue → Counted as $200 revenue  
- 50% inflated conversion rate
- Meta AI over-bids on "successful" campaigns
- Wasted ad spend

**With proper deduplication:**
- 1 purchase → Counted as 1 purchase ✓
- Accurate ROAS metrics ✓
- Better AI optimization ✓
- Efficient budget allocation ✓

---

## 💡 PRO TIPS

### Tip 1: Store event_id in Your Database

```javascript
// When creating order
await db.orders.create({
  id: orderId,
  metaEventId: eventId,  // Store for debugging
  //...
})

// Later, you can verify in Meta Events Manager:
// "Did order 550e8400... get tracked?"
// Search Meta for event_id: 550e8400...
```

### Tip 2: Use Order ID for Purchases (Always)

```javascript
// Your order ID should be a UUID
const orderId = crypto.randomUUID()

// Use it as event_id
fbq('track', 'Purchase', {...}, { eventID: orderId })
sendToCAPI({ event_id: orderId, ... })

// Benefits:
// - Natural deduplication
// - Easy debugging (search by order ID)
// - No extra UUID needed
```

### Tip 3: Validate IDs Match in Development

```javascript
// Add assertion in development
if (process.env.NODE_ENV === 'development') {
  if (pixelEventId !== capiEventId) {
    console.error('DEDUPLICATION BROKEN!', {
      pixel: pixelEventId,
      capi: capiEventId
    })
    throw new Error('event_id mismatch - deduplication will fail')
  }
}
```

---

## 🎓 LEARN MORE

- **Interactive Examples:** `/problems/duplicate-events` on this site
- **UUID Requirements:** `UUID_REQUIREMENTS.md` in this project
- **Meta Documentation:** [Conversions API Deduplication](https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events)

---

## 📝 CHECKLIST FOR PRODUCTION

- [ ] Client generates UUID **once** (not multiple times)
- [ ] Client sends **same UUID** to both Pixel and server
- [ ] Server receives UUID from client (not generates new one)
- [ ] Server forwards **same UUID** to CAPI
- [ ] Test in Meta Events Manager (should see 1 event, not 2)
- [ ] Store event_id in database for debugging
- [ ] Use order IDs for purchase events
- [ ] Validate IDs match in development/staging

---

**Remember:** The entire deduplication system depends on **using the exact same UUID** for both Pixel and CAPI. Master this concept, and you'll prevent double-counting forever!
