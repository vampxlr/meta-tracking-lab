/**
 * Environment variable validation utilities
 */

export function getRequiredEnvVar(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

export function getOptionalEnvVar(key: string, defaultValue?: string): string | undefined {
  return process.env[key] || defaultValue
}

export function getPublicEnvVar(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required public environment variable: ${key}`)
  }
  return value
}

// CAPI-specific environment variables
export const env = {
  // Public (client-side)
  NEXT_PUBLIC_FB_PIXEL_ID: () => getPublicEnvVar('NEXT_PUBLIC_FB_PIXEL_ID'),
  
  // Server-only (CAPI)
  META_CAPI_ACCESS_TOKEN: () => getRequiredEnvVar('META_CAPI_ACCESS_TOKEN'),
  META_GRAPH_API_VERSION: () => getOptionalEnvVar('META_GRAPH_API_VERSION', 'v19.0'),
  META_TEST_EVENT_CODE: () => getOptionalEnvVar('META_TEST_EVENT_CODE'),
}
