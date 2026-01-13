# API Routes

This document provides a comprehensive overview of all API routes implemented in the Meta Tracking Lab project.

---

## Overview

The project implements API routes for server-side Meta Pixel integration and Conversions API functionality. All API routes are located in the [`app/api/`](../app/api/) directory.

---

## API Routes Summary

| Route | Method | Status | Purpose |
|-------|--------|--------|---------|
| `/api/meta/capi` | POST | Placeholder | Send events to Conversions API |
| `/api/meta/capi` | GET | Placeholder | Get CAPI status/info |

**Total API Routes**: 1 route with 2 methods

**Complete**: 0

**Placeholder**: 2 (both methods)

---

## API Route Details

### 1. Conversions API Route

**File Location**: [`app/api/meta/capi/route.ts`](../app/api/meta/capi/route.ts:1)

**Route**: `/api/meta/capi`

**Status**: Placeholder (Day 2/3 implementation)

**Description**: API endpoint for server-side Conversions API integration with Meta.

#### POST Method

**Endpoint**: `POST /api/meta/capi`

**Current Implementation**:
```typescript
export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      message: "CAPI route not implemented yet. Will be added in Day 2/3."
    },
    { status: 501 }
  )
}
```

**Status**: Placeholder (HTTP 501 Not Implemented)

**Current Behavior**:
- Returns JSON response with error message
- Returns HTTP 501 status code
- Indicates implementation is planned for Day 2/3

**Planned Features**:
- Accept event data in request body
- Validate event payload
- Send events to Meta's Conversions API
- Handle authentication with access token
- Implement retry logic for failed requests
- Return success/error responses
- Log events for debugging

**Expected Request Format** (Planned):
```json
{
  "event_name": "Purchase",
  "event_time": 1705123456,
  "event_source_url": "https://example.com/checkout",
  "action_source": "website",
  "user_data": {
    "em": "hashed_email@example.com",
    "ph": "hashed_phone_number"
  },
  "custom_data": {
    "value": 99.99,
    "currency": "USD",
    "content_ids": ["product_123"]
  },
  "event_id": "1705123456789_abc123"
}
```

**Expected Response Format** (Planned):
```json
{
  "ok": true,
  "message": "Event sent successfully",
  "event_id": "1705123456789_abc123",
  "fbtrace_id": "trace_id_from_meta"
}
```

**Error Response Format** (Planned):
```json
{
  "ok": false,
  "message": "Failed to send event",
  "error": "Error details",
  "event_id": "1705123456789_abc123"
}
```

**Environment Variables Required** (Planned):
- `FB_ACCESS_TOKEN` - Meta API access token
- `FB_PIXEL_ID` - Meta Pixel ID

---

#### GET Method

**Endpoint**: `GET /api/meta/capi`

**Current Implementation**:
```typescript
export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      "message": "CAPI route not implemented yet. Will be added in Day 2/3."
    },
    { status: 501 }
  )
}
```

**Status**: Placeholder (HTTP 501 Not Implemented)

**Current Behavior**:
- Returns JSON response with error message
- Returns HTTP 501 status code
- Indicates implementation is planned for Day 2/3

**Planned Features**:
- Return CAPI configuration status
- Check if required environment variables are set
- Provide health check for CAPI integration
- Return supported event types
- Show rate limit information

**Expected Response Format** (Planned):
```json
{
  "ok": true,
  "configured": true,
  "pixel_id": "1234567890",
  "supported_events": [
    "ViewContent",
    "AddToCart",
    "Purchase",
    "Lead",
    "CompleteRegistration"
  ],
  "rate_limit": {
    "calls_remaining": 1000,
    "reset_time": "2024-01-14T00:00:00Z"
  }
}
```

---

## API Route Architecture

### Route Structure

```
app/api/
└── meta/
    └── capi/
        └── route.ts
```

### Route Handlers

Each route file exports handler functions for HTTP methods:
- `GET()` - Handle GET requests
- `POST()` - Handle POST requests
- `PUT()` - Handle PUT requests (if needed)
- `DELETE()` - Handle DELETE requests (if needed)

### Response Pattern

All routes use `NextResponse` from Next.js:
```typescript
import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(data, { status: 200 })
}
```

---

## API Route Status

### Current Implementation Status

| Route | Method | Implementation | Status Code | Notes |
|-------|--------|----------------|-------------|-------|
| `/api/meta/capi` | POST | Placeholder | 501 | Day 2/3 implementation |
| `/api/meta/capi` | GET | Placeholder | 501 | Day 2/3 implementation |

### Planned Implementation Timeline

**Day 2/3**:
- Implement POST `/api/meta/capi` for event sending
- Implement GET `/api/meta/capi` for status checks
- Add request validation
- Add error handling
- Add logging
- Add retry logic

**Future Enhancements**:
- Add batch event support
- Add event queue management
- Add webhook support
- Add analytics endpoint
- Add configuration endpoint

---

## API Route Dependencies

### Next.js Dependencies
- `NextResponse` from `next/server` - Response handling
- Next.js App Router - Route handling

### Internal Dependencies
- `serverCAPI` from [`lib/server/meta/index.ts`](../lib/server/meta/index.ts:1) - Server-side CAPI helpers (placeholder)

### External Dependencies (Planned)
- Meta Conversions API - Event submission
- Node.js fetch - HTTP requests
- Environment variables - Configuration

---

## API Route Security

### Planned Security Measures

**Authentication**:
- Access token validation
- API key verification
- Request origin validation

**Rate Limiting**:
- Per-IP rate limiting
- Per-user rate limiting
- Burst protection

**Input Validation**:
- Schema validation
- Type checking
- Sanitization

**Error Handling**:
- Generic error messages
- No sensitive data in responses
- Proper HTTP status codes

**Logging**:
- Request logging
- Error logging
- Audit trail

---

## API Route Usage Examples

### Current Usage (Placeholder)

```typescript
// Attempting to use the placeholder route
const response = await fetch('/api/meta/capi', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    event_name: 'Purchase',
    // ... other fields
  }),
})

const result = await response.json()
// Returns: { ok: false, message: "CAPI route not implemented yet. Will be added in Day 2/3." }
```

### Planned Usage

```typescript
// Send event to CAPI
const response = await fetch('/api/meta/capi', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    event_name: 'Purchase',
    event_time: Math.floor(Date.now() / 1000),
    event_source_url: window.location.href,
    action_source: 'website',
    user_data: {
      em: hashEmail('user@example.com'),
    },
    custom_data: {
      value: 99.99,
      currency: 'USD',
      content_ids: ['product_123'],
    },
    event_id: generateEventId(),
  }),
})

const result = await response.json()
if (result.ok) {
  console.log('Event sent successfully')
} else {
  console.error('Failed to send event:', result.message)
}
```

### Check CAPI Status

```typescript
// Get CAPI status
const response = await fetch('/api/meta/capi')
const status = await response.json()

if (status.configured) {
  console.log('CAPI is configured')
  console.log('Supported events:', status.supported_events)
} else {
  console.log('CAPI is not configured')
}
```

---

## API Route Error Handling

### Current Error Handling

All placeholder routes return:
- HTTP 501 (Not Implemented)
- JSON response with error message
- Consistent response format

### Planned Error Handling

**Error Response Format**:
```json
{
  "ok": false,
  "message": "Error description",
  "error": "Detailed error information",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-13T10:30:00Z"
}
```

**Error Codes** (Planned):
- `INVALID_REQUEST` - Malformed request
- `UNAUTHORIZED` - Missing or invalid credentials
- `RATE_LIMITED` - Too many requests
- `SERVER_ERROR` - Internal server error
- `META_API_ERROR` - Error from Meta API

---

## API Route Testing

### Current Testing

No automated tests are currently implemented for API routes.

### Planned Testing

**Unit Tests**:
- Request validation
- Response formatting
- Error handling
- Authentication

**Integration Tests**:
- End-to-end event sending
- Meta API integration
- Retry logic
- Queue management

**Load Tests**:
- High volume event handling
- Rate limiting
- Performance benchmarks

---

## API Route Monitoring

### Planned Monitoring

**Metrics to Track**:
- Request volume
- Success rate
- Error rate
- Response time
- Rate limit usage

**Logging**:
- All incoming requests
- All outgoing requests to Meta
- Errors and failures
- Retry attempts

**Alerts**:
- High error rate
- Rate limit exceeded
- Meta API downtime
- Authentication failures

---

## API Route Documentation

### Planned Documentation

**OpenAPI/Swagger**:
- API specification
- Request/response schemas
- Authentication details
- Rate limit information

**Usage Guides**:
- Quick start guide
- Event types reference
- Best practices
- Troubleshooting

**Code Examples**:
- JavaScript/TypeScript
- cURL examples
- Postman collections

---

## Notes

- All API routes are currently placeholders
- Implementation is planned for Day 2/3
- Routes follow Next.js App Router conventions
- Routes use TypeScript for type safety
- Routes return JSON responses
- Routes use appropriate HTTP status codes

---

## Future Enhancements

Potential improvements for API routes:
- Implement actual CAPI integration
- Add batch event support
- Add event queue management
- Add webhook support
- Add analytics endpoint
- Add configuration endpoint
- Implement rate limiting
- Add request validation
- Add comprehensive error handling
- Add logging and monitoring
- Add automated tests
- Add API documentation
- Add retry logic with exponential backoff
- Add event deduplication
- Add user data hashing utilities
- Add support for multiple pixels
- Add event history endpoint
- Add event statistics endpoint
