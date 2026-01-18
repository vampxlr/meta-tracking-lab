import { z } from 'zod'

// Supported event types
export const SUPPORTED_EVENTS = [
  'ViewContent',
  'Search',
  'AddToCart',
  'InitiateCheckout',
  'Purchase',
  'CompleteRegistration',
] as const

export type SupportedEventType = typeof SUPPORTED_EVENTS[number]

// Event mode
export type EventMode = 'broken' | 'fixed' | 'test'

// User data schema
export const UserDataSchema = z.object({
  email: z.string().optional(),
  phone: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  external_id: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
})

export type UserData = z.infer<typeof UserDataSchema>

// Custom data schema
export const CustomDataSchema = z.object({
  currency: z.string().optional(),
  value: z.number().optional(),
  content_ids: z.array(z.string()).optional(),
  content_type: z.string().optional(),
  content_name: z.string().optional(),
  num_items: z.number().optional(),
  order_id: z.string().optional(),
})

export type CustomData = z.infer<typeof CustomDataSchema>

// CAPI event request schema
export const CapiEventRequestSchema = z.object({
  event_name: z.enum(SUPPORTED_EVENTS),
  mode: z.enum(['broken', 'fixed', 'test']).default('test'),
  event_id: z.string().optional(),
  test_event_code: z.string().optional(),
  user_data: UserDataSchema.optional(),
  custom_data: CustomDataSchema.optional(),
  client_ip_address: z.string().optional(),
  client_user_agent: z.string().optional(),
  event_source_url: z.string().url().optional(),
})

export type CapiEventRequest = z.infer<typeof CapiEventRequestSchema>

// Meta CAPI response schema
export const CapiResponseSchema = z.object({
  events_received: z.number(),
  fbtrace_id: z.string(),
  messages: z.array(z.string()).optional(),
})

export type CapiResponse = z.infer<typeof CapiResponseSchema>
