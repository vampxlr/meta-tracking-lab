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
 * Normalize and hash state
 * - Trim whitespace
 * - Convert to lowercase
 * - Hash with SHA-256
 */
export async function hashState(state: string): Promise<string> {
  const normalized = state.trim().toLowerCase()
  return await hashString(normalized)
}

/**
 * Normalize and hash zip
 * - Trim whitespace
 * - Convert to lowercase
 * - Remove spaces
 * - Hash with SHA-256
 */
export async function hashZip(zip: string): Promise<string> {
  const normalized = zip.trim().toLowerCase().replace(/\s/g, '')
  return await hashString(normalized)
}

/**
 * Normalize and hash gender
 * - Trim whitespace
 * - Convert to lowercase
 * - Hash with SHA-256
 */
export async function hashGender(gender: string): Promise<string> {
  const normalized = gender.trim().toLowerCase()
  return await hashString(normalized)
}

/**
 * Normalize and hash date of birth
 * - Input should be YYYYMMDD
 * - Trim whitespace
 * - Hash with SHA-256
 */
export async function hashDateOfBirth(dob: string): Promise<string> {
  const normalized = dob.trim()
  return await hashString(normalized)
}

/**
 * Hash a string using SHA-256
 */
async function hashString(str: string): Promise<string> {
  return crypto.createHash('sha256').update(str).digest('hex')
}

/**
 * Hash user data object for CAPI
 */
export async function hashUserData(userData: {
  email?: string
  phone?: string
  first_name?: string
  last_name?: string
  gender?: 'm' | 'f'
  date_of_birth?: string
  city?: string
  state?: string
  zip?: string
  country?: string
  external_id?: string
  client_ip_address?: string
  client_user_agent?: string
  fbc?: string
  fbp?: string
  subscription_id?: string
  fb_login_id?: string
  lead_id?: string
}): Promise<{
  em?: string
  ph?: string
  fn?: string
  ln?: string
  ge?: string
  db?: string
  ct?: string
  st?: string
  zp?: string
  country?: string
  external_id?: string
  client_ip_address?: string
  client_user_agent?: string
  fbc?: string
  fbp?: string
  subscription_id?: string
  fb_login_id?: string
  lead_id?: string
}> {
  const hashed: any = {}

  if (userData.email) hashed.em = await hashEmail(userData.email)
  if (userData.phone) hashed.ph = await hashPhone(userData.phone)
  if (userData.first_name) hashed.fn = await hashFirstName(userData.first_name)
  if (userData.last_name) hashed.ln = await hashLastName(userData.last_name)
  if (userData.gender) hashed.ge = await hashGender(userData.gender)
  if (userData.date_of_birth) hashed.db = await hashDateOfBirth(userData.date_of_birth)
  if (userData.city) hashed.ct = await hashCity(userData.city)
  if (userData.state) hashed.st = await hashState(userData.state)
  if (userData.zip) hashed.zp = await hashZip(userData.zip)
  if (userData.country) hashed.country = await hashCountry(userData.country)
  if (userData.external_id) hashed.external_id = await hashExternalId(userData.external_id)

  // Non-hashed fields
  if (userData.client_ip_address) hashed.client_ip_address = userData.client_ip_address
  if (userData.client_user_agent) hashed.client_user_agent = userData.client_user_agent
  if (userData.fbc) hashed.fbc = userData.fbc
  if (userData.fbp) hashed.fbp = userData.fbp
  if (userData.subscription_id) hashed.subscription_id = userData.subscription_id
  if (userData.fb_login_id) hashed.fb_login_id = userData.fb_login_id
  if (userData.lead_id) hashed.lead_id = userData.lead_id

  return hashed
}
