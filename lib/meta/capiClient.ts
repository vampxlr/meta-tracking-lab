import { env } from '../env'
import type { CapiEventRequest, CapiResponse } from './capiTypes'
import { hashUserData } from './capiHelpers'

/**
 * Meta Conversions API Client
 * 
 * Handles sending events to Meta's Conversions API
 */

interface SendCapiEventOptions {
  pixelId: string
  accessToken: string
  apiVersion: string
  testEventCode?: string
  defaultEventSourceUrl?: string
}

interface SendCapiEventResult {
  success: boolean
  response?: CapiResponse
  error?: string
  sanitizedPayload?: any
}

/**
 * Send a CAPI event to Meta's Graph API
 */
export async function sendCapiEvent(
  request: CapiEventRequest,
  options?: Partial<SendCapiEventOptions>
): Promise<SendCapiEventResult> {
  try {
    // Get configuration
    const pixelId = options?.pixelId || env.NEXT_PUBLIC_FB_PIXEL_ID()
    const accessToken = options?.accessToken || env.META_CAPI_ACCESS_TOKEN()
    const apiVersion = options?.apiVersion || env.META_GRAPH_API_VERSION()
    const testEventCode = options?.testEventCode || env.META_TEST_EVENT_CODE()

    // Generate event_id if not provided (for deduplication)
    const eventId = request.event_id || crypto.randomUUID()

    // Build the payload based on mode
    const payload = await buildCapiPayload(request, eventId, accessToken, testEventCode, options?.defaultEventSourceUrl)

    // Send to Meta's Graph API
    const url = `https://graph.facebook.com/${apiVersion}/${pixelId}/events`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return {
        success: false,
        error: `Meta API error: ${response.status} ${response.statusText} - ${errorText}`,
      }
    }

    const responseData = await response.json()

    return {
      success: true,
      response: responseData,
      sanitizedPayload: sanitizePayload(payload),
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Build CAPI payload based on request
 */
async function buildCapiPayload(
  request: CapiEventRequest,
  eventId: string,
  accessToken: string,
  testEventCode?: string,
  defaultEventSourceUrl?: string
): Promise<any> {
  const { event_name, test_event_code, user_data, custom_data, client_ip_address, client_user_agent, event_source_url } = request

  // Base event object
  const event: any = {
    event_name,
    event_time: Math.floor(Date.now() / 1000),
    event_source_url: event_source_url || defaultEventSourceUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://meta-tracking-lab.vercel.app',
    action_source: 'website',
    event_id: eventId,
  }

  // Add custom data if provided
  if (custom_data) {
    event.custom_data = custom_data
  }

  // Build user_data
  if (user_data) {
    // Hash PII
    event.user_data = {
      ...await hashUserData(user_data),
      client_ip_address: client_ip_address || user_data.client_ip_address || '127.0.0.1',
      client_user_agent: client_user_agent || user_data.client_user_agent || 'Mozilla/5.0',
    }
  } else {
    // No user data provided
    event.user_data = {
      client_ip_address: client_ip_address || '127.0.0.1',
      client_user_agent: client_user_agent || 'Mozilla/5.0',
    }
  }

  return {
    data: [event],
    access_token: accessToken,
    test_event_code: test_event_code || testEventCode,
  }
}

/**
 * Sanitize payload to remove sensitive information
 */
function sanitizePayload(payload: any): any {
  const sanitized = { ...payload }

  // Remove access token
  if (sanitized.access_token) {
    sanitized.access_token = 'REDACTED'
  }

  return sanitized
}

/**
 * Check if CAPI is properly configured
 */
export function isCapiConfigured(): boolean {
  try {
    env.META_CAPI_ACCESS_TOKEN()
    env.NEXT_PUBLIC_FB_PIXEL_ID()
    return true
  } catch {
    return false
  }
}
