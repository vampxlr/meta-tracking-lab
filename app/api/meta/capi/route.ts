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

    // Send event to Meta's CAPI
    const result = await sendCapiEvent(validatedRequest)

    if (!result.success) {
      return NextResponse.json(
        {
          ok: false,
          error: result.error,
        },
        { status: 500 }
      )
    }

    // Return success response
    return NextResponse.json({
      ok: true,
      data: result.response,
      sanitizedPayload: result.sanitizedPayload,
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
