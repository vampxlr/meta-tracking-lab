/**
 * Helper utilities for Meta Pixel event handling
 */

export type TransportMode = "pixel" | "capi" | "both"
export type EventMode = "Broken" | "Fixed"

export interface EventPayload {
  value?: number
  currency?: string
  contents?: Array<{
    id: string
    quantity: number
    item_price?: number
  }>
  content_ids?: string[]
  content_type?: string
  content_name?: string
  num_items?: number
  order_id?: string
}

export interface LogEntry {
  timestamp: string
  event_name: string
  mode: EventMode
  transport: TransportMode
  event_id: string
  payload: EventPayload
}

/**
 * Generate a unique event ID using timestamp + random
 */
export function generateEventId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
}

/**
 * Create a Broken payload (intentionally incomplete)
 */
export function createBrokenPayload(eventName: string): EventPayload {
  const basePayload: EventPayload = {}

  switch (eventName) {
    case "ViewContent":
      // Missing value and currency
      return {
        content_name: "Example Product",
        content_type: "product",
      }
    case "AddToCart":
      // Missing value and currency
      return {
        content_name: "Example Product",
        content_type: "product",
        num_items: 1,
      }
    case "Purchase":
      // Broken contents array (missing item_price)
      return {
        content_ids: ["product_123", "product_456"],
        content_type: "product",
        contents: [
          { id: "product_123", quantity: 1 },
          { id: "product_456", quantity: 1 },
        ],
        order_id: `order_${Math.random().toString(36).substring(7)}`,
      }
    default:
      return basePayload
  }
}

/**
 * Create a Fixed payload (best practice complete)
 */
export function createFixedPayload(eventName: string): EventPayload {
  switch (eventName) {
    case "ViewContent":
      return {
        value: 99.99,
        currency: "USD",
        content_ids: ["product_123"],
        content_name: "Example Product",
        content_type: "product",
        contents: [
          {
            id: "product_123",
            quantity: 1,
            item_price: 99.99,
          },
        ],
      }
    case "AddToCart":
      return {
        value: 99.99,
        currency: "USD",
        content_ids: ["product_123"],
        content_name: "Example Product",
        content_type: "product",
        num_items: 1,
        contents: [
          {
            id: "product_123",
            quantity: 1,
            item_price: 99.99,
          },
        ],
      }
    case "Purchase":
      return {
        value: 199.99,
        currency: "USD",
        content_ids: ["product_123", "product_456"],
        content_name: "Multiple Products",
        content_type: "product",
        num_items: 2,
        contents: [
          {
            id: "product_123",
            quantity: 1,
            item_price: 99.99,
          },
          {
            id: "product_456",
            quantity: 1,
            item_price: 100.0,
          },
        ],
        order_id: `order_${Math.random().toString(36).substring(7)}`,
      }
    default:
      return {}
  }
}

/**
 * Get payload based on mode (Broken vs Fixed)
 */
export function getEventPayload(eventName: string, mode: EventMode): EventPayload {
  return mode === "Broken"
    ? createBrokenPayload(eventName)
    : createFixedPayload(eventName)
}

/**
 * Format a log entry
 */
export function createLogEntry(
  eventName: string,
  mode: EventMode,
  transport: TransportMode,
  eventId: string,
  payload: EventPayload
): LogEntry {
  return {
    timestamp: new Date().toLocaleTimeString(),
    event_name: eventName,
    mode,
    transport,
    event_id: eventId,
    payload,
  }
}

/**
 * Check if fbq is available in the window
 */
export function isFbqAvailable(): boolean {
  return typeof window !== "undefined" && typeof (window as any).fbq === "function"
}

/**
 * Check if CAPI is configured (has required env vars)
 */
export function isCapiConfigured(): boolean {
  return (
    typeof process !== "undefined" &&
    !!process.env.NEXT_PUBLIC_FB_PIXEL_ID &&
    !!process.env.FB_ACCESS_TOKEN &&
    !!process.env.FB_PIXEL_ID
  )
}
