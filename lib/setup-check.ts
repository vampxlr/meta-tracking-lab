/**
 * Setup Check Utility
 * Checks the status of Meta Pixel, CAPI, and test event verification
 */

export interface SetupStatus {
  pixel: {
    connected: boolean
    pixelId: string | null
  }
  capi: {
    configured: boolean
  }
  testEvents: {
    verified: boolean
    lastTestTime: string | null
  }
  overall: {
    isComplete: boolean
    percentage: number
    nextStep: string
  }
}

/**
 * Check if Meta Pixel is configured and loaded
 */
export async function checkPixelStatus(): Promise<{ connected: boolean; pixelId: string | null }> {
  // Check for Pixel ID in environment
  const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID || null
  
  if (!pixelId) {
    return { connected: false, pixelId: null }
  }
  
  // Check if pixel is loaded in browser (client-side only)
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    return { connected: true, pixelId }
  }
  
  // Server-side check: we have pixel ID but can't verify it's loaded
  return { connected: false, pixelId }
}

/**
 * Check if CAPI is configured
 */
export async function checkCapiStatus(): Promise<boolean> {
  // Check for required environment variables
  const hasAccessToken = !!process.env.META_CAPI_ACCESS_TOKEN
  const hasPixelId = !!process.env.NEXT_PUBLIC_FB_PIXEL_ID
  
  return hasAccessToken && hasPixelId
}

/**
 * Check test events verification status
 */
export async function checkTestEventsStatus(): Promise<{ verified: boolean; lastTestTime: string | null }> {
  // This would need to check if user has verified test events in Events Manager
  // For now, we'll check localStorage for a timestamp of last successful test
  
  if (typeof window === 'undefined') {
    return { verified: false, lastTestTime: null }
  }
  
  const lastTest = localStorage.getItem('last_pixel_test_time')
  return {
    verified: !!lastTest,
    lastTestTime: lastTest
  }
}

/**
 * Get complete setup status
 */
export async function getSetupStatus(): Promise<SetupStatus> {
  const [pixelStatus, capiConfigured, testEventsStatus] = await Promise.all([
    checkPixelStatus(),
    checkCapiStatus(),
    checkTestEventsStatus(),
  ])
  
  // Calculate overall completion
  const checks = [
    pixelStatus.connected, // Pixel connected
    capiConfigured,       // CAPI configured
    testEventsStatus.verified // Test events verified
  ]
  
  const completedChecks = checks.filter(Boolean).length
  const percentage = Math.round((completedChecks / checks.length) * 100)
  
  // Determine next step
  let nextStep = 'Start Setup Checklist'
  if (!pixelStatus.connected) {
    nextStep = 'Connect Meta Pixel'
  } else if (!capiConfigured) {
    nextStep = 'Configure CAPI'
  } else if (!testEventsStatus.verified) {
    nextStep = 'Run Connection Test'
  } else {
    nextStep = 'Start using Event Playground'
  }
  
  return {
    pixel: pixelStatus,
    capi: {
      configured: capiConfigured,
    },
    testEvents: testEventsStatus,
    overall: {
      isComplete: percentage === 100,
      percentage,
      nextStep,
    },
  }
}
