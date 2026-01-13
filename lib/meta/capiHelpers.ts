import crypto from 'crypto'

/**
 * Hashing utilities for Meta Conversions API
 * 
 * Meta requires PII to be hashed using SHA-256 before sending
 */

/**
 * Normalize and hash email
 * - Trim whitespace
 * - Convert to lowercase
 * - Hash with SHA-256
 */
export async function hashEmail(email: string): Promise<string> {
  const normalized = email.trim().toLowerCase()
  return await hashString(normalized)
}

/**
 * Normalize and hash phone
 * - Remove all non-digit characters
 * - Include country code if provided
 * - Hash with SHA-256
 */
export async function hashPhone(phone: string): Promise<string> {
  const normalized = phone.replace(/\D/g, '')
  return await hashString(normalized)
}

/**
 * Normalize and hash first name
 * - Trim whitespace
 * - Convert to lowercase
 * - Hash with SHA-256
 */
export async function hashFirstName(firstName: string): Promise<string> {
  const normalized = firstName.trim().toLowerCase()
  return await hashString(normalized)
}

/**
 * Normalize and hash last name
 * - Trim whitespace
 * - Convert to lowercase
 * - Hash with SHA-256
 */
export async function hashLastName(lastName: string): Promise<string> {
  const normalized = lastName.trim().toLowerCase()
  return await hashString(normalized)
}

/**
 * Hash external ID
 * - Hash as-is (string)
 * - Hash with SHA-256
 */
export async function hashExternalId(externalId: string): Promise<string> {
  return await hashString(externalId)
}

/**
 * Normalize and hash city
 * - Trim whitespace
 * - Convert to lowercase
 * - Hash with SHA-256
 */
export async function hashCity(city: string): Promise<string> {
  const normalized = city.trim().toLowerCase()
  return await hashString(normalized)
}

/**
 * Normalize and hash country
 * - Trim whitespace
 * - Convert to lowercase
 * - Hash with SHA-256
 */
export async function hashCountry(country: string): Promise<string> {
  const normalized = country.trim().toLowerCase()
  return await hashString(normalized)
}

/**
 * Hash a string using SHA-256
 */
async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(str)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

/**
 * Hash user data object for CAPI
 */
export async function hashUserData(userData: {
  email?: string
  phone?: string
  first_name?: string
  last_name?: string
  external_id?: string
  city?: string
  country?: string
}): Promise<{
  em?: string
  ph?: string
  fn?: string
  ln?: string
  external_id?: string
  ct?: string
  country?: string
}> {
  const hashed: any = {}
  
  if (userData.email) {
    hashed.em = await hashEmail(userData.email)
  }
  
  if (userData.phone) {
    hashed.ph = await hashPhone(userData.phone)
  }
  
  if (userData.first_name) {
    hashed.fn = await hashFirstName(userData.first_name)
  }
  
  if (userData.last_name) {
    hashed.ln = await hashLastName(userData.last_name)
  }
  
  if (userData.external_id) {
    hashed.external_id = await hashExternalId(userData.external_id)
  }
  
  if (userData.city) {
    hashed.ct = await hashCity(userData.city)
  }
  
  if (userData.country) {
    hashed.country = await hashCountry(userData.country)
  }
  
  return hashed
}
