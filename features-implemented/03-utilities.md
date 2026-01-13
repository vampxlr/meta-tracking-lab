# Utilities

This document provides a comprehensive overview of all utility functions and helper modules implemented in the Meta Tracking Lab project.

---

## Overview

The project implements utility functions organized into three main categories:
- **General Utilities** (1): Common helper functions
- **Meta Client Utilities** (1): Client-side Meta Pixel helpers
- **Meta Event Utilities** (1): Event handling and payload generation
- **Server Meta Utilities** (1): Server-side Conversions API helpers

All utilities are located in the [`lib/`](../lib/) directory.

---

## General Utilities

### 1. cn() - Class Name Utility

**File Location**: [`lib/utils.ts`](../lib/utils.ts:1)

**Status**: Complete

**Description**: Utility function for merging Tailwind CSS classes with intelligent deduplication and conditional class handling.

**Function Signature**:
```typescript
export function cn(...inputs: ClassValue[]): string
```

**Key Functionality**:
- Merges multiple class names
- Removes duplicate classes
- Handles conditional classes
- Resolves Tailwind CSS conflicts
- Supports clsx syntax

**Dependencies**:
- `clsx` - Conditional class name utility
- `tailwind-merge` - Tailwind CSS class merging

**Usage Example**:
```typescript
cn("px-4 py-2", isActive && "bg-blue-500", "hover:bg-blue-600")
// Returns: "px-4 py-2 bg-blue-500 hover:bg-blue-600"
```

**Implementation Notes**:
- Used extensively throughout the application
- Standard pattern in shadcn/ui components
- Combines clsx and tailwind-merge for optimal class handling
- Accepts any ClassValue (string, object, array, etc.)

---

## Meta Client Utilities

### 2. metaClient

**File Location**: [`lib/meta/client.ts`](../lib/meta/client.ts:1)

**Status**: Placeholder

**Description**: Client-side Meta Pixel helper module for event tracking (Day 2/3 implementation).

**Current Implementation**:
```typescript
export const metaClient = {
  trackEvent: (eventName: string, params?: Record<string, any>) => {
    console.log('[Meta Client]', eventName, params)
  },
}
```

**Key Functionality**:
- Placeholder for client-side event tracking
- Logs events to console for debugging
- Accepts event name and optional parameters

**Planned Features** (Day 2/3):
- Actual fbq() integration
- Event validation
- Error handling
- Queue management
- Retry logic

**Function Signature**:
```typescript
trackEvent(eventName: string, params?: Record<string, any>): void
```

**Usage Example**:
```typescript
metaClient.trackEvent('Purchase', {
  value: 99.99,
  currency: 'USD',
  content_ids: ['product_123']
})
```

**Implementation Notes**:
- Currently a placeholder for future implementation
- Will integrate with Facebook Pixel's fbq() function
- Will support standard and custom events
- Will include error handling and validation

---

## Meta Event Utilities

### 3. Event Utilities Module

**File Location**: [`lib/meta/event-utils.ts`](../lib/meta/event-utils.ts:1)

**Status**: Complete

**Description**: Comprehensive utility module for Meta Pixel event handling, payload generation, and event management.

#### Types

**TransportMode**:
```typescript
export type TransportMode = "pixel" | "capi" | "both"
```
- `pixel`: Client-side Pixel tracking
- `capi`: Server-side Conversions API
- `both`: Both transport methods

**EventMode**:
```typescript
export type EventMode = "Broken" | "Fixed"
```
- `Broken`: Intentionally incomplete payload for testing
- `Fixed`: Complete, best-practice payload

**EventPayload**:
```typescript
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
```

**LogEntry**:
```typescript
export interface LogEntry {
  timestamp: string
  event_name: string
  mode: EventMode
  transport: TransportMode
  event_id: string
  payload: EventPayload
}
```

#### Functions

##### generateEventId()

**Function Signature**:
```typescript
export function generateEventId(): string
```

**Description**: Generates a unique event ID using timestamp + random string.

**Returns**: String in format `{timestamp}_{random_string}`

**Example**:
```typescript
generateEventId()
// Returns: "1705123456789_abc123def"
```

**Implementation Notes**:
- Uses Date.now() for timestamp
- Generates 9-character random string
- Ensures uniqueness for event deduplication
- Suitable for both client and server-side use

---

##### createBrokenPayload()

**Function Signature**:
```typescript
export function createBrokenPayload(eventName: string): EventPayload
```

**Description**: Creates an intentionally incomplete payload for testing broken event scenarios.

**Supported Events**:
- **ViewContent**: Missing value and currency
- **AddToCart**: Missing value and currency
- **Purchase**: Broken contents array (missing item_price)

**Example**:
```typescript
createBrokenPayload('ViewContent')
// Returns: { content_name: "Example Product", content_type: "product" }
```

**Implementation Notes**:
- Simulates common tracking mistakes
- Used for demonstrating issues in documentation
- Helps users understand what not to do
- Each event type has specific missing fields

---

##### createFixedPayload()

**Function Signature**:
```typescript
export function createFixedPayload(eventName: string): EventPayload
```

**Description**: Creates a complete, best-practice payload for Meta Pixel events.

**Supported Events**:
- **ViewContent**: Complete with value, currency, contents
- **AddToCart**: Complete with all required fields
- **Purchase**: Complete with order_id, multiple items

**Example**:
```typescript
createFixedPayload('Purchase')
// Returns: {
//   value: 199.99,
//   currency: "USD",
//   content_ids: ["product_123", "product_456"],
//   content_name: "Multiple Products",
//   content_type: "product",
//   num_items: 2,
//   contents: [
//     { id: "product_123", quantity: 1, item_price: 99.99 },
//     { id: "product_456", quantity: 1, item_price: 100.0 }
//   ],
//   order_id: "order_abc123"
// }
```

**Implementation Notes**:
- Follows Meta's best practices
- Includes all recommended parameters
- Uses realistic sample data
- Suitable for production examples

---

##### getEventPayload()

**Function Signature**:
```typescript
export function getEventPayload(eventName: string, mode: EventMode): EventPayload
```

**Description**: Returns the appropriate payload based on the mode (Broken vs Fixed).

**Parameters**:
- `eventName`: Name of the event (ViewContent, AddToCart, Purchase)
- `mode`: Event mode (Broken or Fixed)

**Returns**: EventPayload object

**Example**:
```typescript
getEventPayload('ViewContent', 'Fixed')
// Returns complete ViewContent payload

getEventPayload('ViewContent', 'Broken')
// Returns incomplete ViewContent payload
```

**Implementation Notes**:
- Convenience wrapper for payload generation
- Used by DemoPanel component
- Simplifies mode-based payload selection
- Returns empty object for unsupported events

---

##### createLogEntry()

**Function Signature**:
```typescript
export function createLogEntry(
  eventName: string,
  mode: EventMode,
  transport: TransportMode,
  eventId: string,
  payload: EventPayload
): LogEntry
```

**Description**: Creates a formatted log entry for event tracking.

**Parameters**:
- `eventName`: Name of the event
- `mode`: Event mode (Broken or Fixed)
- `transport`: Transport method (pixel, capi, both)
- `eventId`: Unique event identifier
- `payload`: Event payload object

**Returns**: LogEntry object with timestamp

**Example**:
```typescript
createLogEntry(
  'Purchase',
  'Fixed',
  'both',
  '1705123456789_abc123',
  { value: 99.99, currency: 'USD' }
)
// Returns: {
//   timestamp: "10:30:45 AM",
//   event_name: "Purchase",
//   mode: "Fixed",
//   transport: "both",
//   event_id: "1705123456789_abc123",
//   payload: { value: 99.99, currency: 'USD' }
// }
```

**Implementation Notes**:
- Formats timestamp using toLocaleTimeString()
- Used for event logging and debugging
- Provides complete event context
- Suitable for display in log viewers

---

##### isFbqAvailable()

**Function Signature**:
```typescript
export function isFbqAvailable(): boolean
```

**Description**: Checks if the Facebook Pixel's fbq function is available in the window object.

**Returns**: Boolean indicating fbq availability

**Example**:
```typescript
if (isFbqAvailable()) {
  fbq('track', 'Purchase', { value: 99.99, currency: 'USD' })
}
```

**Implementation Notes**:
- Checks for window object (SSR-safe)
- Verifies fbq function exists
- Prevents runtime errors
- Used before calling fbq functions

---

##### isCapiConfigured()

**Function Signature**:
```typescript
export function isCapiConfigured(): boolean
```

**Description**: Checks if Conversions API is properly configured with required environment variables.

**Required Environment Variables**:
- `NEXT_PUBLIC_FB_PIXEL_ID`
- `FB_ACCESS_TOKEN`
- `FB_PIXEL_ID`

**Returns**: Boolean indicating CAPI configuration status

**Example**:
```typescript
if (isCapiConfigured()) {
  // Use server-side tracking
} else {
  // Fall back to client-side only
}
```

**Implementation Notes**:
- Checks for process object (SSR-safe)
- Verifies all required env vars are set
- Used for feature detection
- Enables graceful degradation

---

## Server Meta Utilities

### 4. serverCAPI

**File Location**: [`lib/server/meta/index.ts`](../lib/server/meta/index.ts:1)

**Status**: Placeholder

**Description**: Server-side Conversions API helper module for event tracking (Day 2/3 implementation).

**Current Implementation**:
```typescript
export const serverCAPI = {
  sendEvent: async (eventData: any) => {
    console.log('[Server CAPI]', eventData)
    return { ok: false, message: 'Not implemented yet' }
  },
}
```

**Key Functionality**:
- Placeholder for server-side event tracking
- Logs events to console for debugging
- Returns mock response

**Planned Features** (Day 2/3):
- Actual Conversions API integration
- Event validation and sanitization
- Error handling and retry logic
- Queue management
- Response parsing

**Function Signature**:
```typescript
sendEvent(eventData: any): Promise<{ ok: boolean, message: string }>
```

**Usage Example**:
```typescript
const result = await serverCAPI.sendEvent({
  event_name: 'Purchase',
  event_time: Math.floor(Date.now() / 1000),
  user_data: { em: 'hashed_email@example.com' },
  custom_data: { value: 99.99, currency: 'USD' }
})
```

**Implementation Notes**:
- Currently a placeholder for future implementation
- Will integrate with Meta's Conversions API
- Will support event deduplication
- Will include comprehensive error handling

---

## Utility Categories

### Client-Side Utilities
- `metaClient.trackEvent()` - Client event tracking (placeholder)
- `isFbqAvailable()` - Pixel availability check
- `isCapiConfigured()` - CAPI configuration check

### Event Generation Utilities
- `generateEventId()` - Unique ID generation
- `createBrokenPayload()` - Broken payload generation
- `createFixedPayload()` - Fixed payload generation
- `getEventPayload()` - Mode-based payload selection

### Event Management Utilities
- `createLogEntry()` - Log entry formatting

### Server-Side Utilities
- `serverCAPI.sendEvent()` - Server event tracking (placeholder)

### General Utilities
- `cn()` - Class name merging

---

## Utility Status Summary

| Utility | Status | Category | Purpose |
|---------|--------|----------|---------|
| cn() | Complete | General | Class name merging |
| metaClient | Placeholder | Meta Client | Client event tracking |
| generateEventId() | Complete | Event Utils | Unique ID generation |
| createBrokenPayload() | Complete | Event Utils | Broken payload creation |
| createFixedPayload() | Complete | Event Utils | Fixed payload creation |
| getEventPayload() | Complete | Event Utils | Mode-based payload |
| createLogEntry() | Complete | Event Utils | Log entry formatting |
| isFbqAvailable() | Complete | Event Utils | Pixel availability |
| isCapiConfigured() | Complete | Event Utils | CAPI configuration |
| serverCAPI | Placeholder | Server Meta | Server event tracking |

**Total Utilities**: 10

**Complete**: 8

**Placeholder**: 2

---

## Utility Dependencies

### External Libraries
- **clsx**: Conditional class name utility
- **tailwind-merge**: Tailwind CSS class merging

### Internal Dependencies
- Event utilities are used by DemoPanel component
- Client utilities will be used by FacebookPixel component
- Server utilities will be used by API routes

---

## Utility Patterns

### Type Safety
- All utilities use TypeScript interfaces
- Strong typing for parameters and returns
- Type exports for reuse across the project

### SSR Safety
- `isFbqAvailable()` checks for window object
- `isCapiConfigured()` checks for process object
- Safe to use in both client and server contexts

### Error Handling
- Placeholder implementations include logging
- Future implementations will include comprehensive error handling
- Graceful degradation where appropriate

### Consistency
- Consistent naming conventions
- Similar function signatures across related utilities
- Clear separation of concerns

---

## Usage Examples

### Event Tracking Workflow

```typescript
// 1. Generate unique event ID
const eventId = generateEventId()

// 2. Check if Pixel is available
if (isFbqAvailable()) {
  // 3. Create payload
  const payload = getEventPayload('Purchase', 'Fixed')
  
  // 4. Track event
  metaClient.trackEvent('Purchase', payload)
  
  // 5. Create log entry
  const logEntry = createLogEntry(
    'Purchase',
    'Fixed',
    'pixel',
    eventId,
    payload
  )
}
```

### Mode-Based Payload Generation

```typescript
// Broken mode (for testing issues)
const brokenPayload = getEventPayload('ViewContent', 'Broken')
// Missing value and currency

// Fixed mode (best practices)
const fixedPayload = getEventPayload('ViewContent', 'Fixed')
// Complete with all recommended fields
```

### Class Name Merging

```typescript
// Using cn() utility
const className = cn(
  'px-4 py-2 rounded-lg',
  isActive && 'bg-blue-500',
  isDisabled && 'opacity-50',
  'hover:bg-blue-600'
)
```

---

## Notes

- All utilities are written in TypeScript
- Utilities follow functional programming patterns
- Placeholder utilities are marked for Day 2/3 implementation
- Event utilities are production-ready and fully functional
- Utilities are well-documented with JSDoc-style comments
- Utilities are designed for reusability across the project

---

## Future Enhancements

Potential improvements for utilities:
- Add more event types to payload generators
- Implement actual metaClient functionality
- Implement actual serverCAPI functionality
- Add payload validation utilities
- Create event queue management utilities
- Add retry logic utilities
- Implement event deduplication helpers
- Create user data hashing utilities for CAPI
- Add event batching utilities
- Create comprehensive error handling utilities
