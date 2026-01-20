'use client'

import * as React from 'react'
import { useCallback } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet'
import {
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Server,
  AlertTriangle,
  Copy,
  Code,
  Clock,
  Zap,
  FileText,
  Bug,
  Info,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Shuffle,
  Terminal,
  Activity,
  MousePointer2,
  List
} from 'lucide-react'

import { SUPPORTED_EVENTS } from '@/lib/meta/capiTypes'

interface ApiResponse {
  ok: boolean
  data?: any
  sanitizedPayload?: any
  error?: string
  validationErrors?: ValidationError[]
}

interface ValidationError {
  field: string
  message: string
  severity: 'error' | 'warning' | 'info'
  suggestion?: string
}

interface RequestDetails {
  url: string
  method: string
  headers: Record<string, string>
  body: any
  timestamp: string
}

interface ResponseDetails {
  status: number
  statusText: string
  headers: Record<string, string>
  body: any
  responseTime: number
  timestamp: string
}

interface BrowserEventLog {
  id: string
  eventName: string
  eventId?: string
  params: any
  timestamp: string
  status: 'success' | 'error'
  error?: string
}

export default function CapiTestPage() {
  // Get site URL from environment
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://meta-tracking-lab.vercel.app'

  const [isConfigured, setIsConfigured] = React.useState(false)

  const [testEventCode, setTestEventCode] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [lastResponse, setLastResponse] = React.useState<ApiResponse | null>(null)
  const [lastTestTime, setLastTestTime] = React.useState<string | null>(null)
  const [eventId, setEventId] = React.useState('')
  const [eventName, setEventName] = React.useState('ViewContent')
  const [customData, setCustomData] = React.useState({
    currency: '',
    value: '',
    content_ids: '',
    content_type: '',
    content_name: '',
    content_category: '',
    num_items: '',
    order_id: '',
    status: '',
    predicted_ltv: '',
    search_string: '',
    delivery_category: '',
  })

  // Optional user data fields
  const [userData, setUserData] = React.useState({
    email: '',
    phone: '',
    first_name: '',
    last_name: '',
    gender: '',
    date_of_birth: '', // YYYYMMDD
    city: '',
    state: '',
    zip: '',
    country: '',
    external_id: '',
    client_ip_address: '',
    client_user_agent: '',
    fbc: '',
    fbp: '',
    subscription_id: '',
    fb_login_id: '',
    lead_id: '',
  })

  // Event context state
  const [actionSource, setActionSource] = React.useState('website')
  const [eventSourceUrl, setEventSourceUrl] = React.useState(SITE_URL)
  const [sendBrowserEvent, setSendBrowserEvent] = React.useState(true)
  const [browserEventLog, setBrowserEventLog] = React.useState<BrowserEventLog[]>([])

  // Request/Response tracking
  const [requestDetails, setRequestDetails] = React.useState<RequestDetails | null>(null)
  const [responseDetails, setResponseDetails] = React.useState<ResponseDetails | null>(null)
  const [validationErrors, setValidationErrors] = React.useState<ValidationError[]>([])

  // UI state
  const [previewExpanded, setPreviewExpanded] = React.useState(true)
  const [requestExpanded, setRequestExpanded] = React.useState(true)

  const [responseExpanded, setResponseExpanded] = React.useState(true)
  const [debugExpanded, setDebugExpanded] = React.useState(true)
  const [browserLogExpanded, setBrowserLogExpanded] = React.useState(true)
  const [previewJson, setPreviewJson] = React.useState('')
  const [jsonInput, setJsonInput] = React.useState('')
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)

  // Cookie helper
  const getCookie = (name: string) => {
    if (typeof document === 'undefined') return ''
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(';').shift() || ''
    return ''
  }

  // Auto-fill FBP/FBC from cookies on mount
  React.useEffect(() => {
    const fbp = getCookie('_fbp')
    const fbc = getCookie('_fbc')

    if (fbp || fbc) {
      setUserData(prev => ({
        ...prev,
        fbp: fbp || prev.fbp,
        fbc: fbc || prev.fbc
      }))

      if (fbp) toast.success('Loaded _fbp from cookie', { description: fbp })
      if (fbc) toast.success('Loaded _fbc from cookie', { description: fbc })
    }
  }, [])

  const checkConfiguration = React.useCallback(async () => {
    try {
      const response = await fetch('/api/meta/capi')
      const data = await response.json()
      setIsConfigured(data.configured)
    } catch (error) {
      setIsConfigured(false)
    }
  }, [])

  const fireBrowserEvent = useCallback(() => {
    // Check if fbq exists
    if (typeof window !== 'undefined' && (window as any).fbq) {
      const fbq = (window as any).fbq

      // Map params for browser event
      const browserParams: any = {}

      // Add custom data properties
      if (customData.value) browserParams.value = parseFloat(customData.value)
      if (customData.currency) browserParams.currency = customData.currency
      if (customData.content_ids) browserParams.content_ids = customData.content_ids.split(',').map(s => s.trim()).filter(Boolean)
      if (customData.content_type) browserParams.content_type = customData.content_type
      if (customData.content_name) browserParams.content_name = customData.content_name
      if (customData.content_category) browserParams.content_category = customData.content_category
      if (customData.num_items) browserParams.num_items = parseFloat(customData.num_items)
      if (customData.order_id) browserParams.order_id = customData.order_id
      if (customData.status) browserParams.status = customData.status === 'true'
      if (customData.predicted_ltv) browserParams.predicted_ltv = parseFloat(customData.predicted_ltv)
      if (customData.search_string) browserParams.search_string = customData.search_string
      if (customData.delivery_category) browserParams.delivery_category = customData.delivery_category

      const eventIdParam = eventId ? { eventID: eventId } : {}

      try {
        fbq('track', eventName, browserParams, eventIdParam)

        const logEntry: BrowserEventLog = {
          id: Date.now().toString(),
          eventName,
          eventId,
          params: browserParams,
          timestamp: new Date().toLocaleTimeString(),
          status: 'success'
        }
        setBrowserEventLog(prev => [logEntry, ...prev])

        toast.success('Browser Event Fired', {
          description: `Sent ${eventName} to Pixel with Event ID: ${eventId || 'None'}`
        })
      } catch (err) {
        console.error('Error firing browser event:', err)

        const logEntry: BrowserEventLog = {
          id: Date.now().toString(),
          eventName,
          eventId,
          params: browserParams,
          timestamp: new Date().toLocaleTimeString(),
          status: 'error',
          error: err instanceof Error ? err.message : 'Unknown error'
        }
        setBrowserEventLog(prev => [logEntry, ...prev])

        toast.error('Failed to fire browser event')
      }
    } else {
      toast.warning('Meta Pixel not found', {
        description: 'Make sure your ad blocker is disabled and Pixel is initialized.'
      })
    }
  }, [eventName, customData, eventId])

  const validateForm = useCallback(() => {
    const errors: ValidationError[] = []

    // Validate event name
    if (!SUPPORTED_EVENTS.includes(eventName as any)) {
      errors.push({
        field: 'event_name',
        message: `Invalid event_name "${eventName}". Expected one of: ${SUPPORTED_EVENTS.join(', ')}`,
        severity: 'error',
        suggestion: 'Select a valid event from the dropdown above',
      })
    }

    // Validate event ID format (if provided)
    if (eventId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(eventId)) {
      errors.push({
        field: 'event_id',
        message: 'Invalid event_id format. Expected UUID format (e.g., 550e8400-e29b-41d4-a716-446655440000)',
        severity: 'warning',
        suggestion: 'Generate a valid UUID or leave blank',
      })
    }

    // Validate custom data based on event type
    if (eventName === 'Purchase') {
      if (!customData.currency) {
        errors.push({
          field: 'custom_data.currency',
          message: 'currency is required for Purchase events',
          severity: 'error',
          suggestion: 'Add a currency code (e.g., USD, EUR)',
        })
      }
      if (!customData.value) {
        errors.push({
          field: 'custom_data.value',
          message: 'value is required for Purchase events',
          severity: 'error',
          suggestion: 'Add the purchase value (e.g., 99.99)',
        })
      }
    }

    // Validate email format (if provided)
    if (userData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.push({
        field: 'user_data.email',
        message: 'Invalid email format',
        severity: 'warning',
        suggestion: 'Use a valid email address (e.g., user@example.com)',
      })
    }



    // Validate test event code
    if (!testEventCode) {
      errors.push({
        field: 'test_event_code',
        message: 'Test event code is required',
        severity: 'error',
        suggestion: 'Enter a test event code from Meta Events Manager Test Events tab',
      })
    }

    setValidationErrors(errors)
  }, [eventName, userData, customData, eventId, testEventCode])

  const buildRequestBody = React.useCallback(() => {
    const body: any = {
      event_name: eventName,
      action_source: actionSource,
      event_source_url: eventSourceUrl,
    }

    if (eventId) {
      body.event_id = eventId
    }

    // Add test_event_code
    if (testEventCode) {
      body.test_event_code = testEventCode
    }

    // Add user data if any field is filled
    if (Object.keys(userData).some(key => userData[key as keyof typeof userData])) {
      body.user_data = userData
    }

    // Add custom data if any field is filled
    const customDataFilled: any = {}
    Object.keys(customData).forEach(key => {
      const value = customData[key as keyof typeof customData]
      if (value) {
        // Convert numeric fields
        if (key === 'value' || key === 'num_items' || key === 'predicted_ltv') {
          customDataFilled[key] = parseFloat(value) || 0
        } else if (key === 'status') {
          customDataFilled[key] = value === 'true'
        } else if (key === 'content_ids') {
          customDataFilled[key] = value.split(',').map(s => s.trim()).filter(Boolean)
        } else {
          customDataFilled[key] = value
        }
      }
    })

    if (Object.keys(customDataFilled).length > 0) {
      body.custom_data = customDataFilled
    }

    return body
  }, [eventName, eventId, testEventCode, userData, customData, actionSource, eventSourceUrl])

  const sendTestEvent = async () => {
    setIsLoading(true)
    setLastResponse(null)
    setRequestDetails(null)
    setResponseDetails(null)

    // Fire browser event first if enabled
    if (sendBrowserEvent) {
      fireBrowserEvent()
    }

    const startTime = Date.now()
    const timestamp = new Date().toISOString()

    try {
      const requestBody = buildRequestBody()

      const requestDetails: RequestDetails = {
        url: '/api/meta/capi',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
        timestamp: new Date().toLocaleString(),
      }

      const response = await fetch('/api/meta/capi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const responseTime = Date.now() - startTime
      const data: ApiResponse = await response.json()

      const responseDetails: ResponseDetails = {
        status: response.status,
        statusText: response.statusText,
        headers: {
          'content-type': response.headers.get('content-type') || 'application/json',
        },
        body: data,
        responseTime,
        timestamp: new Date().toLocaleString(),
      }

      setRequestDetails(requestDetails)
      setResponseDetails(responseDetails)
      setLastResponse(data)
      setLastTestTime(new Date().toLocaleTimeString())

      if (data.ok) {
        toast.success('Server Test Event Sent', {
          description: `Events received: ${data.data?.events_received || 0}`,
        })
        // Save CAPI test timestamp for verification tracking
        localStorage.setItem('last_capi_test_time', new Date().toISOString())
      } else {
        toast.error('Failed to Send Event', {
          description: data.error || 'Unknown error',
        })
      }
    } catch (error) {
      const responseTime = Date.now() - startTime
      const errorResponse: ApiResponse = {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }

      const responseDetails: ResponseDetails = {
        status: 0,
        statusText: 'Network Error',
        headers: {},
        body: errorResponse,
        responseTime,
        timestamp: new Date().toLocaleString(),
      }

      setResponseDetails(responseDetails)
      setLastResponse(errorResponse)

      toast.error('Failed to Send Event', {
        description: error instanceof Error ? error.message : 'Unknown error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const clearResponse = () => {
    toast.info('Response cleared')
  }

  const clearBrowserLog = () => {
    setBrowserEventLog([])
    toast.info('Browser logs cleared')
  }

  const handleJsonImport = () => {
    try {
      const parsed = JSON.parse(jsonInput)

      // Populate Event Name
      if (parsed.event_name && SUPPORTED_EVENTS.includes(parsed.event_name)) {
        setEventName(parsed.event_name)
      }

      // Populate Event ID
      if (parsed.event_id) {
        setEventId(parsed.event_id)
      }

      // Populate Custom Data
      const newCustomData = { ...customData }
      const sourceData = parsed.custom_data || parsed

      if (sourceData.currency) newCustomData.currency = sourceData.currency
      if (sourceData.value) newCustomData.value = String(sourceData.value)
      if (sourceData.content_type) newCustomData.content_type = sourceData.content_type
      if (sourceData.content_name) newCustomData.content_name = sourceData.content_name
      if (sourceData.content_category) newCustomData.content_category = sourceData.content_category
      if (sourceData.num_items) newCustomData.num_items = String(sourceData.num_items)
      if (sourceData.order_id) newCustomData.order_id = sourceData.order_id
      if (sourceData.predicted_ltv) newCustomData.predicted_ltv = String(sourceData.predicted_ltv)
      if (sourceData.search_string) newCustomData.search_string = sourceData.search_string
      if (sourceData.delivery_category) newCustomData.delivery_category = sourceData.delivery_category

      if (sourceData.status !== undefined) {
        newCustomData.status = String(sourceData.status)
      }

      if (sourceData.content_ids) {
        if (Array.isArray(sourceData.content_ids)) {
          newCustomData.content_ids = sourceData.content_ids.join(', ')
        } else if (typeof sourceData.content_ids === 'string') {
          newCustomData.content_ids = sourceData.content_ids
            .replace(/[\[\]"']/g, '')
            .replace(/\s/g, '')
            .replace(/,/g, ', ')
        }
      }

      setCustomData(newCustomData)

      // Populate User Data
      const sourceUserData = parsed.user_data || parsed
      const newUserData = { ...userData }

      if (sourceUserData.email) newUserData.email = sourceUserData.email
      if (sourceUserData.phone) newUserData.phone = sourceUserData.phone
      if (sourceUserData.first_name) newUserData.first_name = sourceUserData.first_name
      if (sourceUserData.last_name) newUserData.last_name = sourceUserData.last_name
      if (sourceUserData.fbp) newUserData.fbp = sourceUserData.fbp
      if (sourceUserData.fbc) newUserData.fbc = sourceUserData.fbc
      if (sourceUserData.external_id) newUserData.external_id = sourceUserData.external_id
      if (sourceUserData.client_ip_address) newUserData.client_ip_address = sourceUserData.client_ip_address
      if (sourceUserData.client_user_agent) newUserData.client_user_agent = sourceUserData.client_user_agent

      setUserData(newUserData)

      toast.success('JSON Configuration Imported', {
        description: 'Form fields have been populated from your JSON'
      })
      setIsSheetOpen(false)
    } catch (e) {
      toast.error('Invalid JSON', {
        description: 'Please check your JSON syntax and try again'
      })
    }
  }

  // Random data generation functions
  const generateRandomEventId = () => {
    // Generate valid UUID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  const generateRandomUserData = () => {
    // Generate valid user data
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily']
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Davis']
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix']
    const states = ['NY', 'CA', 'IL', 'TX', 'AZ']
    const countries = ['US', 'UK', 'CA', 'AU', 'DE']
    const zips = ['10001', '90001', '60601', '77001', '85001']

    const randomEmail = `${firstNames[Math.floor(Math.random() * firstNames.length)].toLowerCase()}.${lastNames[Math.floor(Math.random() * lastNames.length)].toLowerCase()}@example.com`
    const randomPhone = `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`
    const year = Math.floor(Math.random() * (2000 - 1970) + 1970)
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')

    return {
      email: randomEmail,
      phone: randomPhone,
      first_name: firstNames[Math.floor(Math.random() * firstNames.length)],
      last_name: lastNames[Math.floor(Math.random() * lastNames.length)],
      gender: Math.random() > 0.5 ? 'm' : 'f',
      date_of_birth: `${year}${month}${day}`,
      city: cities[Math.floor(Math.random() * cities.length)],
      state: states[Math.floor(Math.random() * states.length)],
      zip: zips[Math.floor(Math.random() * zips.length)],
      country: countries[Math.floor(Math.random() * countries.length)],
      external_id: `customer_${Math.floor(Math.random() * 100000)}`,
      client_ip_address: '',
      client_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      fbc: getCookie('_fbc') || '',
      fbp: getCookie('_fbp') || '',
      subscription_id: `sub_${Math.floor(Math.random() * 10000)}`,
      fb_login_id: `fb_login_${Math.floor(Math.random() * 10000)}`,
      lead_id: `lead_${Math.floor(Math.random() * 10000)}`,
    }
  }

  const generateRandomCustomData = () => {
    // Generate valid custom data
    const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
    const contentTypes = ['product', 'product_group', 'destination']
    const contentNames = ['Premium Widget', 'Basic Gadget', 'Advanced Tool', 'Standard Item']
    const categories = ['Electronics', 'Home', 'Apparel']
    const deliveryCategories = ['home_delivery', 'curbside', 'in_store']

    return {
      currency: currencies[Math.floor(Math.random() * currencies.length)],
      value: parseFloat((Math.random() * 1000 + 10).toFixed(2)),
      content_ids: [`prod_${Math.floor(Math.random() * 1000)}`, `prod_${Math.floor(Math.random() * 1000)}`],
      content_type: contentTypes[Math.floor(Math.random() * contentTypes.length)],
      content_name: contentNames[Math.floor(Math.random() * contentNames.length)],
      content_category: categories[Math.floor(Math.random() * categories.length)],
      num_items: Math.floor(Math.random() * 10) + 1,
      order_id: `order_${Math.floor(Math.random() * 100000)}`,
      status: 'active',
      predicted_ltv: Math.floor(Math.random() * 5000),
      search_string: 'best widgets 2024',
      delivery_category: deliveryCategories[Math.floor(Math.random() * deliveryCategories.length)],
    }
  }

  const handleGenerateEventId = () => {
    const newEventId = generateRandomEventId()
    setEventId(newEventId)
    toast.success('Event ID generated', {
      description: 'Valid UUID generated',
    })
  }

  const handleGenerateUserData = () => {
    const newUserData = generateRandomUserData()
    setUserData({
      email: newUserData.email || '',
      phone: newUserData.phone || '',
      first_name: newUserData.first_name || '',
      last_name: newUserData.last_name || '',
      gender: newUserData.gender || '',
      date_of_birth: newUserData.date_of_birth || '',
      city: newUserData.city || '',
      state: newUserData.state || '',
      zip: newUserData.zip || '',
      country: newUserData.country || '',
      external_id: newUserData.external_id || '',
      client_ip_address: newUserData.client_ip_address || '',
      client_user_agent: newUserData.client_user_agent || '',
      fbc: newUserData.fbc || '',
      fbp: newUserData.fbp || '',
      subscription_id: newUserData.subscription_id || '',
      fb_login_id: newUserData.fb_login_id || '',
      lead_id: newUserData.lead_id || '',
    })
    toast.success('User data filled', {
      description: 'Valid user data generated',
    })
  }

  const handleGenerateCustomData = () => {
    const newCustomData = generateRandomCustomData()
    setCustomData({
      currency: newCustomData.currency || '',
      value: newCustomData.value !== undefined ? String(newCustomData.value) : '',
      content_ids: Array.isArray(newCustomData.content_ids) ? newCustomData.content_ids.join(', ') : '',
      content_type: newCustomData.content_type || '',
      content_name: newCustomData.content_name || '',
      content_category: newCustomData.content_category || '',
      num_items: newCustomData.num_items !== undefined ? String(newCustomData.num_items) : '',
      order_id: newCustomData.order_id || '',
      status: newCustomData.status || '',
      predicted_ltv: newCustomData.predicted_ltv !== undefined ? String(newCustomData.predicted_ltv) : '',
      search_string: newCustomData.search_string || '',
      delivery_category: newCustomData.delivery_category || '',
    })
    toast.success('Custom data filled', {
      description: 'Valid custom data generated',
    })
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${label} copied to clipboard`)
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const updatePreview = useCallback(async () => {
    const requestBody = buildRequestBody()

    // Transform to match what the backend actually sends to Meta's API
    const transformedPayload: any = {
      event_name: requestBody.event_name,
      event_time: Math.floor(Date.now() / 1000),
      event_source_url: SITE_URL,
      action_source: 'website',
    }

    if (requestBody.event_id) {
      transformedPayload.event_id = requestBody.event_id
    }

    // Transform user data field names and hash values if in fixed mode
    if (requestBody.user_data) {
      const userData = requestBody.user_data
      const transformedUserData: any = {}

      // Helper function to hash a string (client-side for preview)
      const hashString = async (str: string): Promise<string> => {
        const encoder = new TextEncoder()
        const data = encoder.encode(str)
        const hashBuffer = await crypto.subtle.digest('SHA-256', data)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
        return hashHex
      }

      // Helper functions
      const hashEmail = async (email: string) => await hashString(email.trim().toLowerCase())
      const hashPhone = async (phone: string) => await hashString(phone.replace(/\D/g, ''))
      const hashName = async (name: string) => await hashString(name.trim().toLowerCase())
      const hashGender = async (gender: string) => await hashString(gender.trim().toLowerCase())
      const hashDOB = async (dob: string) => await hashString(dob.trim())
      const hashCity = async (city: string) => await hashString(city.trim().toLowerCase())
      const hashState = async (state: string) => await hashString(state.trim().toLowerCase())
      const hashZip = async (zip: string) => await hashString(zip.trim().toLowerCase().replace(/\s/g, ''))
      const hashCountry = async (country: string) => await hashString(country.trim().toLowerCase())
      const hashExternalId = async (id: string) => await hashString(id)

      // Fixed and test mode: hash PII and use abbreviated field names
      if (userData.email) transformedUserData.em = await hashEmail(userData.email)
      if (userData.phone) transformedUserData.ph = await hashPhone(userData.phone)
      if (userData.first_name) transformedUserData.fn = await hashName(userData.first_name)
      if (userData.last_name) transformedUserData.ln = await hashName(userData.last_name)
      if (userData.gender) transformedUserData.ge = await hashGender(userData.gender)
      if (userData.date_of_birth) transformedUserData.db = await hashDOB(userData.date_of_birth)
      if (userData.city) transformedUserData.ct = await hashCity(userData.city)
      if (userData.state) transformedUserData.st = await hashState(userData.state)
      if (userData.zip) transformedUserData.zp = await hashZip(userData.zip)
      if (userData.country) transformedUserData.country = await hashCountry(userData.country)
      if (userData.external_id) transformedUserData.external_id = await hashExternalId(userData.external_id)

      // Add non-hashed identifiers and context
      if (userData.client_ip_address) transformedUserData.client_ip_address = userData.client_ip_address
      if (userData.client_user_agent) transformedUserData.client_user_agent = userData.client_user_agent
      if (userData.fbc) transformedUserData.fbc = userData.fbc
      if (userData.fbp) transformedUserData.fbp = userData.fbp
      if (userData.subscription_id) transformedUserData.subscription_id = userData.subscription_id
      if (userData.fb_login_id) transformedUserData.fb_login_id = userData.fb_login_id
      if (userData.lead_id) transformedUserData.lead_id = userData.lead_id

      if (!transformedUserData.client_user_agent) transformedUserData.client_user_agent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Mozilla/5.0'

      transformedPayload.user_data = transformedUserData
    }

    // Add custom data if present
    if (requestBody.custom_data) {
      transformedPayload.custom_data = requestBody.custom_data
    }

    // Build the final payload structure that matches Meta's API expectations
    const finalPayload: any = {
      data: [transformedPayload],
      access_token: 'REDACTED',
    }

    // Add test_event_code at the top level
    if (requestBody.test_event_code) {
      finalPayload.test_event_code = requestBody.test_event_code
    }

    setPreviewJson(JSON.stringify(finalPayload, null, 2))
  }, [buildRequestBody, SITE_URL])

  // Check CAPI configuration on mount
  React.useEffect(() => {
    checkConfiguration()
    updatePreview() // Initialize preview on mount
  }, [checkConfiguration, updatePreview])

  // Validate form in real-time
  React.useEffect(() => {
    validateForm()
  }, [validateForm])

  // Update JSON preview in real-time
  React.useEffect(() => {
    updatePreview()
  }, [updatePreview])

  return (
    <div className="container max-w-6xl py-8 px-4 md:px-6">

      {/* Hero Header */}
      <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-[#00d9ff]/10 border border-[#00d9ff]/30 pulse-glow">
            <Terminal className="h-6 w-6 text-[#00d9ff]" />
          </div>
          <h1 className="font-mono text-3xl md:text-4xl font-bold text-shimmer">CAPI Test Lab</h1>
        </div>
        <p className="text-base text-[#8b949e] leading-relaxed">
          Test Meta Conversions API server-side event tracking with comprehensive debugging and real-time validation
        </p>
      </div>

      <div className="space-y-6">

        {/* Configuration Status Card */}
        <div className="glass-strong hover-border-glow rounded-xl p-6 border border-[#00ff41]/20 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${isConfigured ? 'bg-[#00ff41]/10' : 'bg-red-500/10'} transition-colors`}>
                {isConfigured ? (
                  <CheckCircle2 className="h-5 w-5 text-[#00ff41] icon-spin-hover" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500 icon-spin-hover" />
                )}
              </div>
              <div>
                <h3 className="font-mono font-semibold text-[#e8f4f8]">CAPI Configuration</h3>
                <p className="text-sm text-[#8b949e] mt-1">
                  {isConfigured
                    ? 'CAPI is properly configured and ready to send events'
                    : 'CAPI is not configured. Please check your environment variables.'}
                </p>
              </div>
            </div>
            <Badge
              variant={isConfigured ? 'default' : 'destructive'}
              className="font-mono"
            >
              {isConfigured ? 'READY' : 'NOT CONFIGURED'}
            </Badge>
          </div>

          {!isConfigured && (
            <div className="mt-4 glass rounded-lg p-3 border border-yellow-500/20">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5" />
                <div className="text-sm">
                  <p className="font-mono font-medium text-yellow-400">Configuration Required</p>
                  <p className="text-[#8b949e] mt-1">
                    Set the following environment variables in .env.local:
                  </p>
                  <ul className="mt-2 space-y-1">
                    <li className="flex items-center gap-2">
                      <span className="text-[#00ff41] font-mono">›</span>
                      <code className="font-mono text-xs text-[#00ff41]">META_CAPI_ACCESS_TOKEN</code>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#00ff41] font-mono">›</span>
                      <code className="font-mono text-xs text-[#00ff41]">NEXT_PUBLIC_FB_PIXEL_ID</code>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>



        {/* Event Configuration Card */}
        <div className="glass hover-lift rounded-xl p-6 border border-[#00ff41]/20 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-mono font-semibold text-[#e8f4f8] text-glow-hover">Event Configuration</h3>
              <p className="text-sm text-[#8b949e] mt-1">
                Configure the event details to send
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSheetOpen(true)}
              className="h-8 gap-1 font-mono hover:bg-[#00d9ff]/10 hover:text-[#00d9ff] hover:border-[#00d9ff]/30"
            >
              <Code className="h-3.5 w-3.5" />
              Paste JSON
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-mono font-medium mb-1.5 block text-[#e8f4f8]">
                Event Name <span className="text-red-400">*</span>
              </label>
              <select
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-[#00ff41]/20 rounded-md bg-[#0d1117] text-[#e8f4f8] text-sm focus:outline-none focus:ring-2 focus:ring-[#00ff41] focus:border-[#00ff41] font-mono"
                title="Select event type"
              >
                {SUPPORTED_EVENTS.map(event => (
                  <option key={event} value={event}>{event}</option>
                ))}
              </select>
              <p className="text-xs text-[#8b949e] mt-1">
                Select from Meta&apos;s standard event types
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-mono font-medium text-[#e8f4f8]">
                  Event ID (Optional)
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateEventId}
                  disabled={isLoading}
                  className="h-7 gap-1 font-mono"
                >
                  <Shuffle className="h-3 w-3 icon-spin-hover" />
                  Generate
                </Button>
              </div>
              <Input
                type="text"
                placeholder="e.g., 550e8400-e29b-41d4-a716-446655440000"
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                disabled={isLoading}
                className="font-mono text-sm"
              />
              <p className="text-xs text-[#8b949e] mt-1">
                UUID for event deduplication. Leave blank for auto-generation.
              </p>
            </div>
          </div>
        </div>

        {/* Test Event Code Card - Always visible */}
        <div className="glass hover-glow rounded-xl p-6 border border-[#00d9ff]/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-4">
            <h3 className="font-mono font-semibold text-[#00d9ff] text-glow-hover">Test Event Code</h3>
            <p className="text-sm text-[#8b949e] mt-1">
              Enter the test event code from Meta Events Manager Test Events tab
            </p>
          </div>
          <div>
            <Input
              type="text"
              placeholder="e.g., TEST12345"
              value={testEventCode}
              onChange={(e) => setTestEventCode(e.target.value)}
              disabled={isLoading}
              className="font-mono"
            />
            <p className="text-xs text-[#8b949e] mt-1">
              Required. Get this code from Meta Events Manager → Test Events tab
            </p>
          </div>
        </div>

        {/* Event Context Card */}
        <div className="glass hover-lift rounded-xl p-6 border border-[#00ff41]/20 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[350ms]">
          <div className="mb-4">
            <h3 className="font-mono font-semibold text-[#e8f4f8] text-glow-hover">Event Context</h3>
            <p className="text-sm text-[#8b949e] mt-1">
              Configure where the event took place
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">Action Source</label>
              <select
                value={actionSource}
                onChange={(e) => setActionSource(e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-[#00ff41]/20 rounded-md bg-[#0d1117] text-[#e8f4f8] text-xs focus:outline-none focus:ring-2 focus:ring-[#00ff41] focus:border-[#00ff41] font-mono h-9"
              >
                <option value="website">Website</option>
                <option value="physical_store">Physical Store</option>
                <option value="app">App</option>
                <option value="system_generated">System Generated</option>
                <option value="chat">Chat</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">Event Source URL</label>
              <Input
                type="text"
                placeholder="https://example.com"
                value={eventSourceUrl}
                onChange={(e) => setEventSourceUrl(e.target.value)}
                disabled={isLoading}
                className="font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* User Data Card */}
        <div className="glass hover-lift rounded-xl p-6 border border-[#00ff41]/20 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[400ms]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-mono font-semibold text-[#e8f4f8] text-glow-hover">User Data (Optional)</h3>
              <p className="text-sm text-[#8b949e] mt-1">
                Add user data for better matching. PII will be hashed.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateUserData}
              disabled={isLoading}
              className="h-8 gap-1 font-mono"
            >
              <Shuffle className="h-3 w-3 icon-spin-hover" />
              Fill Data
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">Email</label>
              <Input
                type="email"
                placeholder="user@example.com"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                disabled={isLoading}
                className="font-mono text-xs"
              />
            </div>
            <div className="lg:col-span-1">
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">Phone</label>
              <Input
                type="tel"
                placeholder="+1234567890"
                value={userData.phone}
                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                disabled={isLoading}
                className="font-mono text-xs"
              />
            </div>
            <div className="lg:col-span-1">
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">First Name</label>
              <Input
                type="text"
                placeholder="John"
                value={userData.first_name}
                onChange={(e) => setUserData({ ...userData, first_name: e.target.value })}
                disabled={isLoading}
                className="font-mono text-xs"
              />
            </div>
            <div className="lg:col-span-1">
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">Last Name</label>
              <Input
                type="text"
                placeholder="Doe"
                value={userData.last_name}
                onChange={(e) => setUserData({ ...userData, last_name: e.target.value })}
                disabled={isLoading}
                className="font-mono text-xs"
              />
            </div>
            <div className="lg:col-span-1">
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">Gender</label>
              <select
                value={userData.gender}
                onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-[#00ff41]/20 rounded-md bg-[#0d1117] text-[#e8f4f8] text-xs focus:outline-none focus:ring-2 focus:ring-[#00ff41] focus:border-[#00ff41] font-mono h-9"
              >
                <option value="">Select Gender</option>
                <option value="m">Male (m)</option>
                <option value="f">Female (f)</option>
              </select>
            </div>
            <div className="lg:col-span-1">
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">DOB (YYYYMMDD)</label>
              <Input
                type="text"
                placeholder="19900101"
                value={userData.date_of_birth}
                onChange={(e) => setUserData({ ...userData, date_of_birth: e.target.value })}
                disabled={isLoading}
                className="font-mono text-xs"
              />
            </div>

            {/* Location */}
            <div className="lg:col-span-1">
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">City</label>
              <Input
                type="text"
                placeholder="New York"
                value={userData.city}
                onChange={(e) => setUserData({ ...userData, city: e.target.value })}
                disabled={isLoading}
                className="font-mono text-xs"
              />
            </div>
            <div className="lg:col-span-1">
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">State</label>
              <Input
                type="text"
                placeholder="NY"
                value={userData.state}
                onChange={(e) => setUserData({ ...userData, state: e.target.value })}
                disabled={isLoading}
                className="font-mono text-xs"
              />
            </div>
            <div className="lg:col-span-1">
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">Zip Code</label>
              <Input
                type="text"
                placeholder="10001"
                value={userData.zip}
                onChange={(e) => setUserData({ ...userData, zip: e.target.value })}
                disabled={isLoading}
                className="font-mono text-xs"
              />
            </div>
            <div className="lg:col-span-1">
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">Country</label>
              <Input
                type="text"
                placeholder="us"
                value={userData.country}
                onChange={(e) => setUserData({ ...userData, country: e.target.value })}
                disabled={isLoading}
                className="font-mono text-xs"
              />
            </div>

            {/* IDs */}
            <div className="lg:col-span-1">
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">External ID</label>
              <Input
                type="text"
                placeholder="cust_123"
                value={userData.external_id}
                onChange={(e) => setUserData({ ...userData, external_id: e.target.value })}
                disabled={isLoading}
                className="font-mono text-xs"
              />
            </div>
            <div className="lg:col-span-1">
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">fbp (Browser ID)</label>
              <Input
                type="text"
                placeholder="fb.1.123.456"
                value={userData.fbp}
                onChange={(e) => setUserData({ ...userData, fbp: e.target.value })}
                disabled={isLoading}
                className="font-mono text-xs"
              />
            </div>
            <div className="lg:col-span-1">
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">fbc (Click ID)</label>
              <Input
                type="text"
                placeholder="fb.1.123.456"
                value={userData.fbc}
                onChange={(e) => setUserData({ ...userData, fbc: e.target.value })}
                disabled={isLoading}
                className="font-mono text-xs"
              />
            </div>
            <div className="lg:col-span-1">
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">Subscription ID</label>
              <Input
                type="text"
                placeholder="sub_123"
                value={userData.subscription_id}
                onChange={(e) => setUserData({ ...userData, subscription_id: e.target.value })}
                disabled={isLoading}
                className="font-mono text-xs"
              />
            </div>
            <div className="lg:col-span-1">
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">FB Login ID</label>
              <Input
                type="text"
                placeholder="fb_login_123"
                value={userData.fb_login_id}
                onChange={(e) => setUserData({ ...userData, fb_login_id: e.target.value })}
                disabled={isLoading}
                className="font-mono text-xs"
              />
            </div>
            <div className="lg:col-span-1">
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">Lead ID</label>
              <Input
                type="text"
                placeholder="lead_123"
                value={userData.lead_id}
                onChange={(e) => setUserData({ ...userData, lead_id: e.target.value })}
                disabled={isLoading}
                className="font-mono text-xs"
              />
            </div>

            {/* Tech Context */}
            <div className="lg:col-span-1">
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">Client IP</label>
              <Input
                type="text"
                placeholder="192.168.1.1"
                value={userData.client_ip_address}
                onChange={(e) => setUserData({ ...userData, client_ip_address: e.target.value })}
                disabled={isLoading}
                className="font-mono text-xs"
              />
            </div>
            <div className="lg:col-span-3">
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">User Agent</label>
              <Input
                type="text"
                placeholder="Mozilla/5.0..."
                value={userData.client_user_agent}
                onChange={(e) => setUserData({ ...userData, client_user_agent: e.target.value })}
                disabled={isLoading}
                className="font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Custom Data Card */}
        <div className="glass hover-lift rounded-xl p-6 border border-[#00ff41]/20 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-mono font-semibold text-[#e8f4f8] text-glow-hover">Custom Data (Optional)</h3>
              <p className="text-sm text-[#8b949e] mt-1">
                Add event-specific parameters. Required fields vary by event type.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateCustomData}
              disabled={isLoading}
              className="h-8 gap-1 font-mono"
            >
              <Shuffle className="h-3 w-3 icon-spin-hover" />
              Fill Data
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Financial */}
            <div className="lg:col-span-1">
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">
                Currency {eventName === 'Purchase' && <span className="text-red-400">*</span>}
              </label>
              <Input
                type="text"
                placeholder="USD"
                value={customData.currency}
                onChange={(e) => setCustomData({ ...customData, currency: e.target.value })}
                disabled={isLoading}
                className="font-mono text-xs"
              />
            </div>
            <div className="lg:col-span-1">
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">
                Value {eventName === 'Purchase' && <span className="text-red-400">*</span>}
              </label>
              <Input
                type="number"
                placeholder="99.99"
                value={customData.value}
                onChange={(e) => setCustomData({ ...customData, value: e.target.value })}
                disabled={isLoading}
                className="font-mono text-xs"
              />
            </div>
            <div className="lg:col-span-1">
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">Order ID</label>
              <Input
                type="text"
                placeholder="order_12345"
                value={customData.order_id}
                onChange={(e) => setCustomData({ ...customData, order_id: e.target.value })}
                disabled={isLoading}
                className="font-mono text-xs"
              />
            </div>
            <div className="lg:col-span-1">
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">Predicted LTV</label>
              <Input
                type="number"
                placeholder="0.00"
                value={customData.predicted_ltv}
                onChange={(e) => setCustomData({ ...customData, predicted_ltv: e.target.value })}
                disabled={isLoading}
                className="font-mono text-xs"
              />
            </div>

            {/* Content */}
            <div className="lg:col-span-2">
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">Content IDs (comma separated)</label>
              <Input
                type="text"
                placeholder="prod_123, prod_456"
                value={customData.content_ids}
                onChange={(e) => setCustomData({ ...customData, content_ids: e.target.value })}
                disabled={isLoading}
                className="font-mono text-xs"
              />
            </div>
            <div className="lg:col-span-1">
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">Content Type</label>
              <Input
                type="text"
                placeholder="product"
                value={customData.content_type}
                onChange={(e) => setCustomData({ ...customData, content_type: e.target.value })}
                disabled={isLoading}
                className="font-mono text-xs"
              />
            </div>
            <div className="lg:col-span-1">
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">Content Name</label>
              <Input
                type="text"
                placeholder="Product Name"
                value={customData.content_name}
                onChange={(e) => setCustomData({ ...customData, content_name: e.target.value })}
                disabled={isLoading}
                className="font-mono text-xs"
              />
            </div>
            <div className="lg:col-span-1">
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">Content Category</label>
              <Input
                type="text"
                placeholder="Electronics"
                value={customData.content_category}
                onChange={(e) => setCustomData({ ...customData, content_category: e.target.value })}
                disabled={isLoading}
                className="font-mono text-xs"
              />
            </div>
            <div className="lg:col-span-1">
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">Num Items</label>
              <Input
                type="number"
                placeholder="1"
                value={customData.num_items}
                onChange={(e) => setCustomData({ ...customData, num_items: e.target.value })}
                disabled={isLoading}
                className="font-mono text-xs"
              />
            </div>

            {/* Context */}
            <div className="lg:col-span-1">
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">Status</label>
              <Input
                type="text"
                placeholder="completed"
                value={customData.status}
                onChange={(e) => setCustomData({ ...customData, status: e.target.value })}
                disabled={isLoading}
                className="font-mono text-xs"
              />
            </div>
            <div className="lg:col-span-1">
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">Delivery Category</label>
              <select
                value={customData.delivery_category}
                onChange={(e) => setCustomData({ ...customData, delivery_category: e.target.value })}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-[#00ff41]/20 rounded-md bg-[#0d1117] text-[#e8f4f8] text-xs focus:outline-none focus:ring-2 focus:ring-[#00ff41] focus:border-[#00ff41] font-mono h-9"
              >
                <option value="">None</option>
                <option value="home_delivery">Home Delivery</option>
                <option value="curbside">Curbside</option>
                <option value="in_store">In Store</option>
              </select>
            </div>
            <div className="lg:col-span-2">
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">Search String</label>
              <Input
                type="text"
                placeholder="search query"
                value={customData.search_string}
                onChange={(e) => setCustomData({ ...customData, search_string: e.target.value })}
                disabled={isLoading}
                className="font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Real-time JSON Preview */}
        <div className="glass-strong hover-border-glow rounded-xl p-6 border border-[#00d9ff]/20 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '600ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-[#00d9ff] icon-spin-hover" />
              <h3 className="font-mono font-semibold text-[#00d9ff] text-glow-hover">Real-time JSON Preview</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPreviewExpanded(!previewExpanded)}
              className="h-8 font-mono"
            >
              {previewExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
          {previewExpanded && (
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(previewJson, 'Request JSON')}
                className="absolute top-2 right-2 h-8 gap-1 z-10 font-mono"
              >
                <Copy className="h-3 w-3" />
                Copy
              </Button>
              <ScrollArea className="h-64 rounded-md border border-[#00ff41]/20 bg-[#0d1117] p-3">
                <pre className="text-xs font-mono text-[#00ff41] whitespace-pre-wrap">
                  {previewJson}
                </pre>
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className={`glass hover-glow rounded-xl p-6 border ${validationErrors.some(e => e.severity === 'error') ? 'border-red-500/20' : 'border-yellow-500/20'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bug className="h-4 w-4 icon-spin-hover" />
                <h3 className="font-mono font-semibold text-[#e8f4f8]">Validation Results</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDebugExpanded(!debugExpanded)}
                className="h-8 font-mono"
              >
                {debugExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
            {debugExpanded && (
              <div className="space-y-3">
                {validationErrors.map((error, index) => (
                  <div
                    key={index}
                    className={`glass rounded-lg p-3 border ${error.severity === 'error' ? 'border-red-500/20' :
                      error.severity === 'warning' ? 'border-yellow-500/20' :
                        'border-[#00d9ff]/20'
                      }`}
                  >
                    <div className="flex items-start gap-2">
                      {error.severity === 'error' ? (
                        <X className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                      ) : error.severity === 'warning' ? (
                        <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Info className="h-4 w-4 text-[#00d9ff] mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-medium text-[#e8f4f8]">{error.field}</span>
                          <Badge variant={error.severity === 'error' ? 'destructive' : error.severity === 'warning' ? 'default' : 'secondary'} className="text-xs font-mono">
                            {error.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-[#8b949e] mt-1">{error.message}</p>
                        {error.suggestion && (
                          <p className="text-xs text-[#8b949e] mt-1">
                            <span className="font-mono font-medium text-[#00ff41]">Suggestion:</span> {error.suggestion}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions Card */}
        <div className="border-gradient animate-in fade-in slide-in-from-bottom-4 duration-500 delay-700">
          <div className="border-gradient-content glass-strong p-6">
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <button
                onClick={sendTestEvent}
                disabled={!isConfigured || isLoading}
                className="button-neon rounded-xl px-8 py-4 flex items-center gap-3 w-full sm:w-auto group"
              >
                <Send className="h-5 w-5" />
                <span className="font-mono font-semibold">Send Test Event</span>
                {isLoading && <Activity className="h-4 w-4 animate-spin" />}
              </button>
              {lastTestTime && (
                <div className="flex items-center gap-2 text-sm text-[#8b949e] font-mono">
                  <Clock className="h-4 w-4 text-[#00d9ff]" />
                  Last test: <span className="text-[#00ff41]">{lastTestTime}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Request/Response Display */}
        {(requestDetails || responseDetails) && (
          <div className="glass-strong hover-glow rounded-xl p-6 border border-[#00ff41]/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono font-semibold text-[#e8f4f8] text-glow-hover">Request & Response Details</h3>
              <Button
                onClick={clearResponse}
                variant="outline"
                size="sm"
                className="h-8 font-mono"
              >
                Clear
              </Button>
            </div>

            <Tabs defaultValue="request" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="request" className="font-mono">Request</TabsTrigger>
                <TabsTrigger value="response" className="font-mono">Response</TabsTrigger>
              </TabsList>

              <TabsContent value="request" className="mt-4">
                {requestDetails && (
                  <div className="space-y-4">
                    {/* Request Metadata */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-[#8b949e] font-mono">Method:</span>{' '}
                        <Badge variant="outline" className="font-mono">{requestDetails.method}</Badge>
                      </div>
                      <div>
                        <span className="text-[#8b949e] font-mono">URL:</span>{' '}
                        <code className="text-xs bg-[#0d1117] text-[#00ff41] px-1.5 py-0.5 rounded font-mono">{requestDetails.url}</code>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[#8b949e] font-mono">Timestamp:</span>{' '}
                        <span className="text-xs text-[#00d9ff] font-mono">{requestDetails.timestamp}</span>
                      </div>
                    </div>

                    {/* Request Headers */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-mono font-medium text-[#e8f4f8]">Headers</h4>
                      </div>
                      <ScrollArea className="h-24 rounded-md border border-[#00ff41]/20 bg-[#0d1117] p-3">
                        <pre className="text-xs font-mono text-[#00ff41]">
                          {JSON.stringify(requestDetails.headers, null, 2)}
                        </pre>
                      </ScrollArea>
                    </div>

                    {/* Request Body */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-mono font-medium text-[#e8f4f8]">Body</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(JSON.stringify(requestDetails.body, null, 2), 'Request Body')}
                          className="h-7 gap-1 font-mono"
                        >
                          <Copy className="h-3 w-3" />
                          Copy
                        </Button>
                      </div>
                      <ScrollArea className="h-64 rounded-md border border-[#00ff41]/20 bg-[#0d1117] p-3">
                        <pre className="text-xs font-mono text-[#00ff41] whitespace-pre-wrap">
                          {JSON.stringify(requestDetails.body, null, 2)}
                        </pre>
                      </ScrollArea>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="response" className="mt-4">
                {responseDetails && (
                  <div className="space-y-4">
                    {/* Response Metadata */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-[#8b949e] font-mono">Status:</span>{' '}
                        <Badge variant={responseDetails.status >= 200 && responseDetails.status < 300 ? 'default' : 'destructive'} className="font-mono">
                          {responseDetails.status} {responseDetails.statusText}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-[#8b949e] font-mono">Response Time:</span>{' '}
                        <span className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-yellow-400" />
                          <span className="text-[#00ff41] font-mono">{responseDetails.responseTime}ms</span>
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[#8b949e] font-mono">Timestamp:</span>{' '}
                        <span className="text-xs text-[#00d9ff] font-mono">{responseDetails.timestamp}</span>
                      </div>
                    </div>

                    {/* Response Headers */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-mono font-medium text-[#e8f4f8]">Headers</h4>
                      </div>
                      <ScrollArea className="h-24 rounded-md border border-[#00ff41]/20 bg-[#0d1117] p-3">
                        <pre className="text-xs font-mono text-[#00ff41]">
                          {JSON.stringify(responseDetails.headers, null, 2)}
                        </pre>
                      </ScrollArea>
                    </div>

                    {/* Response Body */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-mono font-medium text-[#e8f4f8]">Body</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(JSON.stringify(responseDetails.body, null, 2), 'Response Body')}
                          className="h-7 gap-1 font-mono"
                        >
                          <Copy className="h-3 w-3" />
                          Copy
                        </Button>
                      </div>
                      <ScrollArea className="h-64 rounded-md border border-[#00ff41]/20 bg-[#0d1117] p-3">
                        <pre className="text-xs font-mono text-[#00ff41] whitespace-pre-wrap">
                          {JSON.stringify(responseDetails.body, null, 2)}
                        </pre>
                      </ScrollArea>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Browser Event Logs */}
        {browserEventLog.length > 0 && (
          <div className="glass-strong hover-glow rounded-xl p-6 border border-[#00d9ff]/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <List className="h-4 w-4 text-[#00d9ff]" />
                <h3 className="font-mono font-semibold text-[#e8f4f8] text-glow-hover">Browser Pixel Logs</h3>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={clearBrowserLog}
                  variant="outline"
                  size="sm"
                  className="h-8 font-mono"
                >
                  Clear
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setBrowserLogExpanded(!browserLogExpanded)}
                  className="h-8 font-mono"
                >
                  {browserLogExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {browserLogExpanded && (
              <div className="space-y-3">
                {browserEventLog.map((log) => (
                  <div key={log.id} className="glass rounded-lg p-3 border border-[#00ff41]/10">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={log.status === 'success' ? 'default' : 'destructive'} className="font-mono text-xs">
                          {log.status === 'success' ? 'SENT' : 'ERROR'}
                        </Badge>
                        <span className="font-mono font-semibold text-[#e8f4f8]">{log.eventName}</span>
                        <span className="text-xs text-[#8b949e] font-mono">{log.timestamp}</span>
                      </div>
                      {log.eventId && (
                        <div className="flex items-center gap-1.5 bg-[#0d1117] px-2 py-1 rounded border border-[#00ff41]/20">
                          <span className="text-[10px] text-[#8b949e] uppercase font-mono">Event ID:</span>
                          <code className="text-xs text-[#00ff41] font-mono">{log.eventId}</code>
                        </div>
                      )}
                    </div>

                    {log.error ? (
                      <p className="text-sm text-red-400 font-mono mt-2">{log.error}</p>
                    ) : (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-[#8b949e] uppercase font-mono tracking-wider">Parameters</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(JSON.stringify(log.params, null, 2), 'Parameters')}
                            className="h-5 text-xs gap-1 font-mono px-2"
                          >
                            <Copy className="h-2.5 w-2.5" />
                            Copy
                          </Button>
                        </div>
                        <ScrollArea className="h-24 rounded border border-[#00ff41]/10 bg-[#0d1117]/50 p-2">
                          <pre className="text-[10px] font-mono text-[#00ff41] whitespace-pre-wrap">
                            {JSON.stringify(log.params, null, 2)}
                          </pre>
                        </ScrollArea>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Instructions Card */}
        <div className="glass hover-glow rounded-xl p-6 border border-[#00d9ff]/20 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '800ms' }}>
          <h3 className="font-mono font-semibold mb-4 flex items-center gap-2 text-[#00d9ff] text-glow-hover">
            <ExternalLink className="h-4 w-4" />
            How to Verify
          </h3>
          <ol className="space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 text-[#00ff41] flex items-center justify-center text-xs font-mono font-bold">
                1
              </span>
              <div>
                <p className="font-mono font-medium text-[#e8f4f8]">Open Meta Events Manager</p>
                <p className="text-[#8b949e]">
                  Go to{' '}
                  <a
                    href="https://business.facebook.com/events_manager2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00d9ff] hover:text-[#00ff41] underline transition-colors"
                  >
                    Events Manager
                  </a>{' '}
                  and select your pixel
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 text-[#00ff41] flex items-center justify-center text-xs font-mono font-bold">
                2
              </span>
              <div>
                <p className="font-mono font-medium text-[#e8f4f8]">Navigate to Test Events</p>
                <p className="text-[#8b949e]">
                  Click on <span className="rounded bg-[#0d1117] text-[#00ff41] px-1.5 py-0.5 font-mono">Test Events</span> in the left sidebar
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 text-[#00ff41] flex items-center justify-center text-xs font-mono font-bold">
                3
              </span>
              <div>
                <p className="font-mono font-medium text-[#e8f4f8]">Send a Test Event</p>
                <p className="text-[#8b949e]">
                  Click the <span className="rounded bg-[#0d1117] text-[#00ff41] px-1.5 py-0.5 font-mono">Send Test Event</span> button above
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/30 text-[#00ff41] flex items-center justify-center text-xs font-mono font-bold">
                4
              </span>
              <div>
                <p className="font-mono font-medium text-[#e8f4f8]">Verify Event Received</p>
                <p className="text-[#8b949e]">
                  Look for your selected event (e.g., <span className="rounded bg-[#0d1117] text-[#00ff41] px-1.5 py-0.5 font-mono">{eventName}</span>) in the test events list
                </p>
              </div>
            </li>
          </ol>
        </div>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[500px] sm:w-[540px] border-l-[#00ff41]/20 bg-[#0d1117]/95 backdrop-blur-xl">
          <SheetHeader className="mb-4">
            <SheetTitle className="font-mono text-[#00ff41]">Import JSON Configuration</SheetTitle>
            <SheetDescription className="font-mono text-xs text-[#8b949e]">
              Paste a JSON payload to automatically populate the form fields.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute top-3 right-3 z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-[#8b949e] hover:text-[#e8f4f8]"
                  onClick={() => {
                    const example = {
                      "event_name": "Purchase",
                      "value": 1008.76,
                      "currency": "EUR",
                      "content_ids": ["prod_638", "prod_772"],
                      "user_data": { "email": "user@example.com" }
                    }
                    setJsonInput(JSON.stringify(example, null, 2))
                  }}
                  title="Load Example"
                >
                  <FileText className="h-3.5 w-3.5" />
                </Button>
              </div>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='{ "event_name": "Purchase", ... }'
                className="w-full h-[400px] bg-[#000000]/40 border border-[#00ff41]/20 rounded-md p-4 font-mono text-xs text-[#e8f4f8] focus:outline-none focus:ring-1 focus:ring-[#00ff41] resize-none leading-relaxed"
              />
            </div>
          </div>
          <SheetFooter className="mt-6 flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsSheetOpen(false)} className="font-mono w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleJsonImport} className="font-mono w-full sm:w-auto bg-[#00ff41]/20 text-[#00ff41] hover:bg-[#00ff41]/30 border border-[#00ff41]/50">
              Fill Form
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
