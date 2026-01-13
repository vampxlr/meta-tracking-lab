/**
 * Meta Conversions API Specification
 * 
 * This module documents the CAPI parameters we've chosen to support
 * in the Meta Tracking Lab for educational purposes.
 */

export interface EventParameter {
  name: string
  type: string
  required: boolean
  description: string
}

export interface EventSpec {
  eventName: string
  eventDetailParameters: EventParameter[]
  customerInformationParameters: EventParameter[]
}

export const CAPI_SPEC: EventSpec[] = [
  {
    eventName: 'ViewContent',
    eventDetailParameters: [
      { name: 'action_source', type: 'string', required: true, description: 'Where the event happened (e.g., website, app)' },
      { name: 'event_id', type: 'string', required: true, description: 'Unique identifier for deduplication' },
      { name: 'event_name', type: 'string', required: true, description: 'Name of the event' },
      { name: 'event_source_url', type: 'string', required: true, description: 'URL where the event occurred' },
      { name: 'event_time', type: 'number', required: true, description: 'Unix timestamp of the event' },
    ],
    customerInformationParameters: [
      { name: 'fbp', type: 'string', required: false, description: 'Facebook browser cookie' },
      { name: 'fbc', type: 'string', required: false, description: 'Facebook click cookie' },
      { name: 'client_ip_address', type: 'string', required: false, description: 'User IP address' },
      { name: 'client_user_agent', type: 'string', required: false, description: 'User agent string' },
      { name: 'country', type: 'string', required: false, description: 'Country code' },
      { name: 'city', type: 'string', required: false, description: 'City name' },
      { name: 'email', type: 'string', required: false, description: 'User email (hashed)' },
      { name: 'phone', type: 'string', required: false, description: 'User phone (hashed)' },
      { name: 'external_id', type: 'string', required: false, description: 'External ID (hashed)' },
      { name: 'first_name', type: 'string', required: false, description: 'First name (hashed)' },
      { name: 'last_name', type: 'string', required: false, description: 'Last name (hashed)' },
    ],
  },
  {
    eventName: 'Search',
    eventDetailParameters: [
      { name: 'action_source', type: 'string', required: true, description: 'Where the event happened' },
      { name: 'event_id', type: 'string', required: true, description: 'Unique identifier' },
      { name: 'event_name', type: 'string', required: true, description: 'Name of the event' },
      { name: 'event_source_url', type: 'string', required: true, description: 'URL where the event occurred' },
      { name: 'event_time', type: 'number', required: true, description: 'Unix timestamp' },
    ],
    customerInformationParameters: [
      { name: 'fbp', type: 'string', required: false, description: 'Facebook browser cookie' },
      { name: 'fbc', type: 'string', required: false, description: 'Facebook click cookie' },
      { name: 'client_ip_address', type: 'string', required: false, description: 'User IP address' },
      { name: 'client_user_agent', type: 'string', required: false, description: 'User agent string' },
      { name: 'country', type: 'string', required: false, description: 'Country code' },
      { name: 'city', type: 'string', required: false, description: 'City name' },
      { name: 'email', type: 'string', required: false, description: 'User email (hashed)' },
      { name: 'phone', type: 'string', required: false, description: 'User phone (hashed)' },
      { name: 'external_id', type: 'string', required: false, description: 'External ID (hashed)' },
      { name: 'first_name', type: 'string', required: false, description: 'First name (hashed)' },
      { name: 'last_name', type: 'string', required: false, description: 'Last name (hashed)' },
    ],
  },
  {
    eventName: 'AddToCart',
    eventDetailParameters: [
      { name: 'action_source', type: 'string', required: true, description: 'Where the event happened' },
      { name: 'event_id', type: 'string', required: true, description: 'Unique identifier' },
      { name: 'event_name', type: 'string', required: true, description: 'Name of the event' },
      { name: 'event_source_url', type: 'string', required: true, description: 'URL where the event occurred' },
      { name: 'event_time', type: 'number', required: true, description: 'Unix timestamp' },
    ],
    customerInformationParameters: [
      { name: 'fbp', type: 'string', required: false, description: 'Facebook browser cookie' },
      { name: 'fbc', type: 'string', required: false, description: 'Facebook click cookie' },
      { name: 'client_ip_address', type: 'string', required: false, description: 'User IP address' },
      { name: 'client_user_agent', type: 'string', required: false, description: 'User agent string' },
      { name: 'country', type: 'string', required: false, description: 'Country code' },
      { name: 'city', type: 'string', required: false, description: 'City name' },
      { name: 'email', type: 'string', required: false, description: 'User email (hashed)' },
      { name: 'phone', type: 'string', required: false, description: 'User phone (hashed)' },
      { name: 'external_id', type: 'string', required: false, description: 'External ID (hashed)' },
      { name: 'first_name', type: 'string', required: false, description: 'First name (hashed)' },
      { name: 'last_name', type: 'string', required: false, description: 'Last name (hashed)' },
    ],
  },
  {
    eventName: 'InitiateCheckout',
    eventDetailParameters: [
      { name: 'action_source', type: 'string', required: true, description: 'Where the event happened' },
      { name: 'event_id', type: 'string', required: true, description: 'Unique identifier' },
      { name: 'event_name', type: 'string', required: true, description: 'Name of the event' },
      { name: 'event_source_url', type: 'string', required: true, description: 'URL where the event occurred' },
      { name: 'event_time', type: 'number', required: true, description: 'Unix timestamp' },
    ],
    customerInformationParameters: [
      { name: 'fbp', type: 'string', required: false, description: 'Facebook browser cookie' },
      { name: 'fbc', type: 'string', required: false, description: 'Facebook click cookie' },
      { name: 'client_ip_address', type: 'string', required: false, description: 'User IP address' },
      { name: 'client_user_agent', type: 'string', required: false, description: 'User agent string' },
      { name: 'country', type: 'string', required: false, description: 'Country code' },
      { name: 'city', type: 'string', required: false, description: 'City name' },
      { name: 'email', type: 'string', required: false, description: 'User email (hashed)' },
      { name: 'phone', type: 'string', required: false, description: 'User phone (hashed)' },
      { name: 'external_id', type: 'string', required: false, description: 'External ID (hashed)' },
      { name: 'first_name', type: 'string', required: false, description: 'First name (hashed)' },
      { name: 'last_name', type: 'string', required: false, description: 'Last name (hashed)' },
    ],
  },
  {
    eventName: 'Purchase',
    eventDetailParameters: [
      { name: 'action_source', type: 'string', required: true, description: 'Where the event happened' },
      { name: 'event_id', type: 'string', required: true, description: 'Unique identifier' },
      { name: 'event_name', type: 'string', required: true, description: 'Name of the event' },
      { name: 'event_source_url', type: 'string', required: true, description: 'URL where the event occurred' },
      { name: 'event_time', type: 'number', required: true, description: 'Unix timestamp' },
      { name: 'currency', type: 'string', required: true, description: 'Currency code (e.g., USD)' },
      { name: 'value', type: 'number', required: true, description: 'Purchase value' },
    ],
    customerInformationParameters: [
      { name: 'fbp', type: 'string', required: false, description: 'Facebook browser cookie' },
      { name: 'fbc', type: 'string', required: false, description: 'Facebook click cookie' },
      { name: 'client_ip_address', type: 'string', required: false, description: 'User IP address' },
      { name: 'client_user_agent', type: 'string', required: false, description: 'User agent string' },
      { name: 'country', type: 'string', required: false, description: 'Country code' },
      { name: 'city', type: 'string', required: false, description: 'City name' },
      { name: 'email', type: 'string', required: false, description: 'User email (hashed)' },
      { name: 'phone', type: 'string', required: false, description: 'User phone (hashed)' },
      { name: 'external_id', type: 'string', required: false, description: 'External ID (hashed)' },
      { name: 'first_name', type: 'string', required: false, description: 'First name (hashed)' },
      { name: 'last_name', type: 'string', required: false, description: 'Last name (hashed)' },
    ],
  },
  {
    eventName: 'CompleteRegistration',
    eventDetailParameters: [
      { name: 'action_source', type: 'string', required: true, description: 'Where the event happened' },
      { name: 'event_id', type: 'string', required: true, description: 'Unique identifier' },
      { name: 'event_name', type: 'string', required: true, description: 'Name of the event' },
      { name: 'event_source_url', type: 'string', required: true, description: 'URL where the event occurred' },
      { name: 'event_time', type: 'number', required: true, description: 'Unix timestamp' },
    ],
    customerInformationParameters: [
      { name: 'fbp', type: 'string', required: false, description: 'Facebook browser cookie' },
      { name: 'fbc', type: 'string', required: false, description: 'Facebook click cookie' },
      { name: 'client_ip_address', type: 'string', required: false, description: 'User IP address' },
      { name: 'client_user_agent', type: 'string', required: false, description: 'User agent string' },
      { name: 'country', type: 'string', required: false, description: 'Country code' },
      { name: 'city', type: 'string', required: false, description: 'City name' },
      { name: 'email', type: 'string', required: false, description: 'User email (hashed)' },
      { name: 'phone', type: 'string', required: false, description: 'User phone (hashed)' },
      { name: 'external_id', type: 'string', required: false, description: 'External ID (hashed)' },
      { name: 'first_name', type: 'string', required: false, description: 'First name (hashed)' },
      { name: 'last_name', type: 'string', required: false, description: 'Last name (hashed)' },
    ],
  },
]

export function getEventSpec(eventName: string): EventSpec | undefined {
  return CAPI_SPEC.find(spec => spec.eventName === eventName)
}
