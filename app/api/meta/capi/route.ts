import { NextRequest, NextResponse } from 'next/server'
import { sendCapiEvent, isCapiConfigured } from '@/lib/meta/capiClient'
import { CapiEventRequestSchema } from '@/lib/meta/capiTypes'

/**
 * POST /api/meta/capi
 * 
 * Send a CAPI event to Meta's Conversions API
 */
export async function POST(request: NextRequest) {
  try {
    // Check if CAPI is configured
    if (!isCapiConfigured()) {
      return NextResponse.json(
        {
          ok: false,
          error: 'CAPI not configured. Missing required environment variables.',
        },
        { status: 500 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validationResult = CapiEventRequestSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Invalid request body',
          details: validationResult.error.issues,
        },
        { status: 400 }
      )
    }

    const validatedRequest = validationResult.data

    // Get referer to use as default event_source_url
    const referer = request.headers.get('referer') || undefined
    const origin = request.headers.get('origin') || undefined

    // Get client IP from headers
    let clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      undefined

    // CRITICAL FIX: In local development, the IP is often '::1' or '127.0.0.1'.
    // If we send this to Meta, it won't match the Pixel's PUBLIC IP.
    // By setting it to undefined here, we let the logic in capiClient decide (or omit it),
    // allowing Meta to assume the connection's source IP (which matches Pixel).
    if (clientIp === '::1' || clientIp === '127.0.0.1') {
      clientIp = undefined
    }

    // Extract other server-side data for better matching
    const userAgent = request.headers.get('user-agent') || undefined
    const fbp = request.cookies.get('_fbp')?.value
    const fbc = request.cookies.get('_fbc')?.value

    console.log('[CAPI Debug] Incoming Request:', {
      referer,
      origin,
      clientIp: clientIp || 'ignored (localhost)',
      userAgent: userAgent ? 'found' : 'missing',
      cookies: { fbp: !!fbp, fbc: !!fbc },
      bodyUrl: validatedRequest.event_source_url
    })

    // Send event to Meta's CAPI
    const result = await sendCapiEvent(validatedRequest, {
      defaultEventSourceUrl: referer || origin,
      clientIp,      // Pass IP to client so it overrides "auto"
      clientUserAgent: userAgent, // Pass real server-side UA
      fbp,           // Pass server-side _fbp
      fbc            // Pass server-side _fbc
    })

    if (!result.success) {
      return NextResponse.json(
        {
          ok: false,
          error: result.error,
        },
        { status: 500 }
      )
    }

    // Return success response with DEBUG info
    return NextResponse.json({
      ok: true,
      data: result.response,
      sanitizedPayload: result.sanitizedPayload,
      debug: {
        ip: clientIp || 'detected_from_connection',
        userAgent: userAgent || 'missing',
        fbp: fbp || 'missing',
        fbc: fbc || 'missing',
        eventId: validatedRequest.event_id
      }
    })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/meta/capi
 * 
 * Check CAPI configuration status
 */
export async function GET() {
  const configured = isCapiConfigured()

  return NextResponse.json({
    ok: true,
    configured,
    message: configured
      ? 'CAPI is properly configured'
      : 'CAPI is not configured. Missing required environment variables.',
  })
}
