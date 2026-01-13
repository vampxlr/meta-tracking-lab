# Bug Fixes

This document tracks known issues, bugs, and fixes needed in the Meta Tracking Lab project.

---

## Current Status

**No Critical Bugs Identified** - The project is currently in a stable state with no reported critical issues.

---

## Potential Issues to Monitor

### 1. Placeholder API Routes May Cause Confusion

**Location**: [`app/api/meta/capi/route.ts`](../app/api/meta/capi/route.ts:1)

### Issue Description
The CAPI API route returns 501 Not Implemented, which may confuse users trying to test the functionality.

### Symptoms
- Users attempting to test CAPI functionality receive 501 errors
- Demo panel may show errors when trying to send server-side events
- Connection test page may show unexpected behavior

### Priority
**Medium**

### Estimated Effort
1-2 hours (to add better messaging)

### Dependencies
- None

### Status
**Not Started**

### Proposed Fix
- Add clear messaging in the UI indicating CAPI is not yet implemented
- Update demo panel to skip server-side testing until implemented
- Add documentation about current limitations
- Consider adding a "Coming Soon" badge

### Notes
- This is expected behavior for Day 1 implementation
- Will be resolved in Day 2/3
- Should be clearly communicated to users

---

### 2. Client-Side Placeholder May Log to Console

**Location**: [`lib/meta/client.ts`](../lib/meta/client.ts:1)

### Issue Description
The placeholder `metaClient.trackEvent()` logs events to console, which may clutter browser console during development.

### Symptoms
- Console shows `[Meta Client]` logs for all events
- May confuse developers looking for actual Pixel events
- No actual events are sent to Meta

### Priority
**Low**

### Estimated Effort
1 hour (to add conditional logging)

### Dependencies
- None

### Status
**Not Started**

### Proposed Fix
- Add environment variable to control logging
- Use debug flag for development only
- Add clear prefix to distinguish from real events
- Consider removing console logs in production

### Notes
- Currently expected behavior
- Will be resolved when real implementation is added
- Could add a flag to disable logging

---

### 3. Server-Side Placeholder May Log to Server Console

**Location**: [`lib/server/meta/index.ts`](../lib/server/meta/index.ts:1)

### Issue Description
The placeholder `serverCAPI.sendEvent()` logs events to server console, which may clutter server logs.

### Symptoms
- Server logs show `[Server CAPI]` messages
- May confuse monitoring and debugging
- No actual events are sent to Meta

### Priority
**Low**

### Estimated Effort
1 hour (to add conditional logging)

### Dependencies
- None

### Status
**Not Started**

### Proposed Fix
- Add environment variable to control logging
- Use debug flag for development only
- Add clear prefix to distinguish from real events
- Consider removing console logs in production

### Notes
- Currently expected behavior
- Will be resolved when real implementation is added
- Could add a flag to disable logging

---

### 4. Environment Variables Not Validated

**Location**: Project-wide

### Issue Description
The application doesn't validate required environment variables on startup, which may cause runtime errors.

### Symptoms
- Application may crash if required variables are missing
- Errors may occur at runtime rather than startup
- Unclear error messages for missing configuration

### Priority
**Medium**

### Estimated Effort
2-3 hours

### Dependencies
- None

### Status
**Not Started**

### Proposed Fix
- Add environment variable validation at startup
- Provide clear error messages for missing variables
- Add default values where appropriate
- Create `.env.example` file
- Document all required variables

### Notes
- Important for production deployment
- Should validate both client and server variables
- Could use a library like `dotenv-safe`

---

### 5. No Error Handling for Failed Pixel Loads

**Location**: [`components/facebook-pixel.tsx`](../components/facebook-pixel.tsx:1)

### Issue Description
If the Facebook Pixel fails to load, there's no error handling or user notification.

### Symptoms
- Pixel may fail silently if blocked by ad blockers
- No indication to users that tracking isn't working
- Events may not be sent without user knowledge

### Priority
**Medium**

### Estimated Effort
2-3 hours

### Dependencies
- None

### Status
**Not Started**

### Proposed Fix
- Add error handling for Pixel load failures
- Implement retry logic for failed loads
- Add user notification when Pixel fails
- Log errors for debugging
- Provide fallback behavior

### Notes
- Common issue with ad blockers
- Should handle gracefully
- Could provide alternative tracking methods

---

### 6. Demo Panel May Show Stale Data

**Location**: [`components/demo-panel.tsx`](../components/demo-panel.tsx:1)

### Issue Description
The demo panel may show stale event logs if the user navigates away and back.

### Symptoms
- Event logs may persist across page navigation
- May show events from previous sessions
- Could confuse users about current state

### Priority
**Low**

### Estimated Effort
1-2 hours

### Dependencies
- None

### Status
**Not Started**

### Proposed Fix
- Clear event logs on page navigation
- Add session management for demo panel
- Implement proper state cleanup
- Consider using URL state for demo configuration

### Notes
- Minor UX issue
- Could be considered a feature for debugging
- Should be configurable

---

### 7. No Loading States for API Calls

**Location**: Various components

### Issue Description
API calls don't show loading states, which may confuse users about operation status.

### Symptoms
- Users may click buttons multiple times
- No indication that operation is in progress
- May cause duplicate requests

### Priority
**Low**

### Estimated Effort
3-4 hours

### Dependencies
- None

### Status
**Not Started**

### Proposed Fix
- Add loading states to all async operations
- Disable buttons during loading
- Show spinner or progress indicator
- Implement proper error handling

### Notes
- Improves UX
- Should be consistent across all components
- Could use existing UI components

---

### 8. Search Input Placeholder Not Functional

**Location**: [`components/app-shell.tsx`](../components/app-shell.tsx:1)

### Issue Description
The search input in the sidebar is present but not functional.

### Symptoms
- Users may try to use search and get no results
- No indication that search is not implemented
- May cause user frustration

### Priority
**Low**

### Estimated Effort
1 hour (to add placeholder text or disable)

### Dependencies
- None

### Status
**Not Started**

### Proposed Fix
- Add placeholder text indicating search is coming soon
- Disable the input until implemented
- Add a tooltip explaining status
- Consider hiding until implemented

### Notes
- Expected for Day 1
- Will be implemented in future
- Should be clearly communicated

---

### 9. No Offline Handling

**Location**: Project-wide

### Issue Description
The application doesn't handle offline scenarios gracefully.

### Symptoms
- App may show errors when offline
- No indication of offline status
- Events may be lost if sent while offline

### Priority
**Medium**

### Estimated Effort
4-6 hours

### Dependencies
- None

### Status
**Not Started**

### Proposed Fix
- Add offline detection
- Show offline status indicator
- Implement offline queue for events
- Add retry logic when back online
- Cache critical resources

### Notes
- Important for reliability
- Could use service workers
- Should handle gracefully

---

### 10. No Rate Limiting on API Routes

**Location**: [`app/api/meta/capi/route.ts`](../app/api/meta/capi/route.ts:1)

### Issue Description
API routes don't have rate limiting, which could be abused.

### Symptoms
- Potential for abuse or DDoS attacks
- No protection against excessive requests
- Could cause performance issues

### Priority
**Medium**

### Estimated Effort
3-4 hours

### Dependencies
- None (can be added independently)

### Status
**Not Started**

### Proposed Fix
- Implement rate limiting middleware
- Add IP-based limiting
- Implement token bucket or similar algorithm
- Add logging for rate limit violations
- Return appropriate error codes

### Notes
- Important for production
- Could use libraries like `express-rate-limit`
- Should be configurable

---

### 11. No Input Validation on API Routes

**Location**: [`app/api/meta/capi/route.ts`](../app/api/meta/capi/route.ts:1)

### Issue Description
API routes don't validate incoming request data.

### Symptoms
- Invalid data may cause errors
- Security risk from malformed input
- Unclear error messages for bad requests

### Priority
**High**

### Estimated Effort
2-3 hours

### Dependencies
- None

### Status
**Not Started**

### Proposed Fix
- Add request schema validation
- Validate all input parameters
- Sanitize user input
- Return clear error messages
- Log validation failures

### Notes
- Critical for security
- Should use schema validation library
- Must handle edge cases

---

### 12. No CSRF Protection

**Location**: API routes

### Issue Description
API routes don't have CSRF protection.

### Symptoms
- Vulnerable to cross-site request forgery
- Security risk for authenticated endpoints
- Potential for unauthorized actions

### Priority
**High**

### Estimated Effort
2-3 hours

### Dependencies
- User authentication (if implemented)

### Status
**Not Started**

### Proposed Fix
- Implement CSRF tokens
- Validate tokens on state-changing requests
- Use SameSite cookies
- Add CSRF middleware

### Notes
- Critical for authenticated endpoints
- Less critical for public endpoints
- Should be implemented before auth

---

### 13. No Content Security Policy

**Location**: Project-wide

### Issue Description
The application doesn't implement Content Security Policy headers.

### Symptoms
- Vulnerable to XSS attacks
- No protection against malicious scripts
- Security compliance issue

### Priority
**Medium**

### Estimated Effort
2-3 hours

### Dependencies
- None

### Status
**Not Started**

### Proposed Fix
- Implement CSP headers
- Define allowed sources for scripts, styles, etc.
- Use nonce or hash for inline scripts
- Test CSP in report-only mode first
- Monitor CSP violations

### Notes
- Important for security
- Should be part of security hardening
- May require adjustments to existing code

---

### 14. No Access Control Headers

**Location**: API routes

### Issue Description
API routes don't implement proper CORS headers.

### Symptoms
- May block legitimate cross-origin requests
- Security risk if too permissive
- Issues with external integrations

### Priority
**Medium**

### Estimated Effort
1-2 hours

### Dependencies
- None

### Status
**Not Started**

### Proposed Fix
- Implement proper CORS headers
- Configure allowed origins
- Set appropriate methods and headers
- Handle preflight requests
- Use environment variables for configuration

### Notes
- Important for API security
- Should be configurable
- Need to consider use cases

---

### 15. No Request Logging

**Location**: API routes

### Issue Description
API routes don't log requests for debugging and monitoring.

### Symptoms
- Difficult to debug issues
- No audit trail
- Hard to monitor usage

### Priority
**Low**

### Estimated Effort
2-3 hours

### Dependencies
- None

### Status
**Not Started**

### Proposed Fix
- Implement request logging middleware
- Log request details (method, path, headers)
- Log response status and time
- Sanitize sensitive data
- Use structured logging format

### Notes
- Important for production
- Should use logging library
- Must handle PII properly

---

## Summary

| Bug/Issue | Priority | Effort | Dependencies | Status |
|-----------|----------|--------|-------------|--------|
| API Route 501 Confusion | Medium | 1-2h | None | Not Started |
| Client Console Logging | Low | 1h | None | Not Started |
| Server Console Logging | Low | 1h | None | Not Started |
| Env Variable Validation | Medium | 2-3h | None | Not Started |
| Pixel Load Error Handling | Medium | 2-3h | None | Not Started |
| Demo Panel Stale Data | Low | 1-2h | None | Not Started |
| No Loading States | Low | 3-4h | None | Not Started |
| Search Input Not Functional | Low | 1h | None | Not Started |
| No Offline Handling | Medium | 4-6h | None | Not Started |
| No Rate Limiting | Medium | 3-4h | None | Not Started |
| No Input Validation | High | 2-3h | None | Not Started |
| No CSRF Protection | High | 2-3h | Auth | Not Started |
| No CSP Headers | Medium | 2-3h | None | Not Started |
| No CORS Headers | Medium | 1-2h | None | Not Started |
| No Request Logging | Low | 2-3h | None | Not Started |

**Total Estimated Effort**: 29-42 hours

**High Priority**: Input Validation, CSRF Protection

**Quick Wins**: Search Input, CORS Headers, Console Logging

---

**Last Updated**: January 13, 2026
