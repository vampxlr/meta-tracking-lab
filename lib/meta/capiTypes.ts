import { z } from 'zod'

// Supported event types
export const SUPPORTED_EVENTS = [
  'AddPaymentInfo',
  'AddToCart',
  'AddToWishlist',
  'CompleteRegistration',
  'Contact',
  'CustomizeProduct',
  'Donate',
  'FindLocation',
  'InitiateCheckout',
  'Lead',
  'Purchase',
  'Schedule',
  'Search',
  'StartTrial',
  'SubmitApplication',
  'Subscribe',
  'ViewContent',
] as const

export type SupportedEventType = typeof SUPPORTED_EVENTS[number]



// User data schema
export const UserDataSchema = z.object({
  email: z.string().optional(),
  phone: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  gender: z.enum(['m', 'f']).optional(),
  date_of_birth: z.string().optional(), // YYYYMMDD
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
  external_id: z.string().optional(),
  client_ip_address: z.string().optional(),
  client_user_agent: z.string().optional(),
  fbc: z.string().optional(),
  fbp: z.string().optional(),
  subscription_id: z.string().optional(),
  fb_login_id: z.string().optional(),
  lead_id: z.string().optional(),
})

export type UserData = z.infer<typeof UserDataSchema>

// Content Item Schema
export const ContentItemSchema = z.object({
  id: z.string().optional(),
  quantity: z.number().optional(),
  item_price: z.number().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
  delivery_category: z.enum(['home_delivery', 'curbside', 'in_store']).optional(),
})

export type ContentItem = z.infer<typeof ContentItemSchema>

// Custom data schema
export const CustomDataSchema = z.object({
  currency: z.string().optional(),
  value: z.number().optional(),
  content_ids: z.array(z.string()).optional(),
  content_type: z.string().optional(),
  content_name: z.string().optional(), // For PageView or similar
  content_category: z.string().optional(),
  num_items: z.number().optional(),
  order_id: z.string().optional(),
  status: z.boolean().optional(),
  predicted_ltv: z.number().optional(),
  search_string: z.string().optional(),
  delivery_category: z.enum(['home_delivery', 'curbside', 'in_store']).optional(),
  contents: z.array(ContentItemSchema).optional(),
})

export type CustomData = z.infer<typeof CustomDataSchema>

// CAPI event request schema
export const CapiEventRequestSchema = z.object({
  event_name: z.enum(SUPPORTED_EVENTS),
  event_id: z.string().optional(),
  test_event_code: z.string().optional(),
  user_data: UserDataSchema.optional(),
  custom_data: CustomDataSchema.optional(),
  client_ip_address: z.string().optional(),
  client_user_agent: z.string().optional(),
  event_source_url: z.string().url().optional(),
  action_source: z.enum(['website', 'app', 'physical_store', 'system_generated', 'chat', 'other']).optional(),
})

export type CapiEventRequest = z.infer<typeof CapiEventRequestSchema>

// Meta CAPI response schema
export const CapiResponseSchema = z.object({
  events_received: z.number(),
  fbtrace_id: z.string(),
  messages: z.array(z.string()).optional(),
})

export type CapiResponse = z.infer<typeof CapiResponseSchema>
