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
  Activity
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

export default function CapiTestPage() {
  // Get site URL from environment
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://meta-tracking-lab.vercel.app'
  
  const [isConfigured, setIsConfigured] = React.useState(false)
  const [mode, setMode] = React.useState<'broken' | 'fixed' | 'test'>('broken')
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
    num_items: '',
    order_id: '',
  })

  // Optional user data fields
  const [userData, setUserData] = React.useState({
    email: '',
    phone: '',
    first_name: '',
    last_name: '',
    external_id: '',
    city: '',
    country: '',
  })

  // Request/Response tracking
  const [requestDetails, setRequestDetails] = React.useState<RequestDetails | null>(null)
  const [responseDetails, setResponseDetails] = React.useState<ResponseDetails | null>(null)
  const [validationErrors, setValidationErrors] = React.useState<ValidationError[]>([])

  // UI state
  const [previewExpanded, setPreviewExpanded] = React.useState(true)
  const [requestExpanded, setRequestExpanded] = React.useState(true)
  const [responseExpanded, setResponseExpanded] = React.useState(true)
  const [debugExpanded, setDebugExpanded] = React.useState(true)
  const [previewJson, setPreviewJson] = React.useState('')

  const checkConfiguration = React.useCallback(async () => {
    try {
      const response = await fetch('/api/meta/capi')
      const data = await response.json()
      setIsConfigured(data.configured)
    } catch (error) {
      setIsConfigured(false)
    }
  }, [])

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

    // Warn about broken mode
    if (mode === 'broken') {
      errors.push({
        field: 'mode',
        message: 'Broken mode sends un-hashed PII and missing required fields',
        severity: 'info',
        suggestion: 'Switch to Fixed mode for proper implementation',
      })
    }

    // Validate test event code when in test mode
    if (mode === 'test' && !testEventCode) {
      errors.push({
        field: 'test_event_code',
        message: 'Test event code is required in Test mode',
        severity: 'error',
        suggestion: 'Enter a test event code from Meta Events Manager Test Events tab',
      })
    }

    setValidationErrors(errors)
  }, [eventName, userData, customData, eventId, mode, testEventCode])

  const buildRequestBody = React.useCallback(() => {
    const body: any = {
      event_name: eventName,
      mode,
    }

    if (eventId) {
      body.event_id = eventId
    }

    // Add test_event_code when in test mode
    if (mode === 'test' && testEventCode) {
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
        if (key === 'value' || key === 'num_items') {
          customDataFilled[key] = parseFloat(value) || 0
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
  }, [eventName, mode, eventId, testEventCode, userData, customData])

  const sendTestEvent = async () => {
    setIsLoading(true)
    setLastResponse(null)
    setRequestDetails(null)
    setResponseDetails(null)

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
    setLastResponse(null)
    setLastTestTime(null)
    setRequestDetails(null)
    setResponseDetails(null)
    toast.info('Response cleared')
  }

  // Random data generation functions
  const generateRandomEventId = () => {
    if (mode === 'fixed' || mode === 'test') {
      // Generate valid UUID
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    } else {
      // Broken mode: generate invalid event IDs
      const brokenTypes = [
        '', // Empty
        'not-a-uuid', // Invalid format
        '123', // Too short
        '550e8400-e29b-41d4-a716-446655440000-extra', // Too long
        'invalid-uuid-format', // Wrong format
        'null', // String null
        'undefined', // String undefined
      ]
      return brokenTypes[Math.floor(Math.random() * brokenTypes.length)]
    }
  }

  const generateRandomUserData = () => {
    if (mode === 'fixed' || mode === 'test') {
      // Generate valid user data
      const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily']
      const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Davis']
      const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix']
      const countries = ['US', 'UK', 'CA', 'AU', 'DE']
      
      const randomEmail = `${firstNames[Math.floor(Math.random() * firstNames.length)].toLowerCase()}.${lastNames[Math.floor(Math.random() * lastNames.length)].toLowerCase()}@example.com`
      const randomPhone = `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`
      
      return {
        email: randomEmail,
        phone: randomPhone,
        first_name: firstNames[Math.floor(Math.random() * firstNames.length)],
        last_name: lastNames[Math.floor(Math.random() * lastNames.length)],
        external_id: `customer_${Math.floor(Math.random() * 100000)}`,
        city: cities[Math.floor(Math.random() * cities.length)],
        country: countries[Math.floor(Math.random() * countries.length)],
      }
    } else {
      // Broken mode: generate user data with issues
      const brokenData: any = {}
      const issues = [
        () => ({ ...brokenData, email: 'invalid-email' }), // Invalid email format
        () => ({ ...brokenData, email: '' }), // Empty email
        () => ({ ...brokenData, phone: 1234567890 }), // Wrong type (number instead of string)
        () => ({ ...brokenData, first_name: null }), // Null value
        () => ({ ...brokenData, last_name: undefined }), // Undefined value
        () => ({ ...brokenData, external_id: '' }), // Empty string
        () => ({ ...brokenData, city: 123 }), // Wrong type
        () => ({ ...brokenData, country: 'USA123' }), // Invalid country code
        () => ({ ...brokenData }), // Empty object
        () => ({ ...brokenData, email: 'user@', phone: 'not-a-number' }), // Multiple issues
      ]
      
      const randomIssue = issues[Math.floor(Math.random() * issues.length)]
      return randomIssue()
    }
  }

  const generateRandomCustomData = () => {
    if (mode === 'fixed' || mode === 'test') {
      // Generate valid custom data
      const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
      const contentTypes = ['product', 'product_group', 'destination']
      const contentNames = ['Premium Widget', 'Basic Gadget', 'Advanced Tool', 'Standard Item']
      
      return {
        currency: currencies[Math.floor(Math.random() * currencies.length)],
        value: parseFloat((Math.random() * 1000 + 10).toFixed(2)),
        content_ids: [`prod_${Math.floor(Math.random() * 1000)}`, `prod_${Math.floor(Math.random() * 1000)}`],
        content_type: contentTypes[Math.floor(Math.random() * contentTypes.length)],
        content_name: contentNames[Math.floor(Math.random() * contentNames.length)],
        num_items: Math.floor(Math.random() * 10) + 1,
        order_id: `order_${Math.floor(Math.random() * 100000)}`,
      }
    } else {
      // Broken mode: generate custom data with issues
      const brokenData: any = {}
      const issues = [
        () => ({ ...brokenData, currency: 'INVALID' }), // Invalid currency
        () => ({ ...brokenData, value: 'not-a-number' }), // Wrong type (string instead of number)
        () => ({ ...brokenData, value: '' }), // Empty value
        () => ({ ...brokenData, content_ids: 123 }), // Wrong type (number instead of array)
        () => ({ ...brokenData, content_ids: [] }), // Empty array
        () => ({ ...brokenData, num_items: 'five' }), // Wrong type (string instead of number)
        () => ({ ...brokenData, order_id: null }), // Null value
        () => ({ ...brokenData }), // Empty object
        () => ({ ...brokenData, currency: '', value: '99.99' }), // Multiple issues
        () => ({ ...brokenData, value: -50 }), // Negative value (invalid)
      ]
      
      const randomIssue = issues[Math.floor(Math.random() * issues.length)]
      return randomIssue()
    }
  }

  const handleGenerateEventId = () => {
    const newEventId = generateRandomEventId()
    setEventId(newEventId)
    toast.success('Event ID generated', {
      description: mode === 'broken' ? 'Invalid event ID generated for testing' : 'Valid UUID generated',
    })
  }

  const handleGenerateUserData = () => {
    const newUserData = generateRandomUserData()
    setUserData({
      email: newUserData.email || '',
      phone: newUserData.phone || '',
      first_name: newUserData.first_name || '',
      last_name: newUserData.last_name || '',
      external_id: newUserData.external_id || '',
      city: newUserData.city || '',
      country: newUserData.country || '',
    })
    toast.success('User data filled', {
      description: mode === 'broken' ? 'User data with issues generated for testing' : 'Valid user data generated',
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
      num_items: newCustomData.num_items !== undefined ? String(newCustomData.num_items) : '',
      order_id: newCustomData.order_id || '',
    })
    toast.success('Custom data filled', {
      description: mode === 'broken' ? 'Custom data with issues generated for testing' : 'Valid custom data generated',
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
    
    // Transform to match what the backend actually sends to Meta&apos;s API
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
      
      // Helper function to normalize and hash email
      const hashEmail = async (email: string): Promise<string> => {
        const normalized = email.trim().toLowerCase()
        return await hashString(normalized)
      }
      
      // Helper function to normalize and hash phone
      const hashPhone = async (phone: string): Promise<string> => {
        const normalized = phone.replace(/\D/g, '')
        return await hashString(normalized)
      }
      
      // Helper function to normalize and hash first name
      const hashFirstName = async (firstName: string): Promise<string> => {
        const normalized = firstName.trim().toLowerCase()
        return await hashString(normalized)
      }
      
      // Helper function to normalize and hash last name
      const hashLastName = async (lastName: string): Promise<string> => {
        const normalized = lastName.trim().toLowerCase()
        return await hashString(normalized)
      }
      
      // Helper function to hash external ID
      const hashExternalId = async (externalId: string): Promise<string> => {
        return await hashString(externalId)
      }
      
      // Helper function to normalize and hash city
      const hashCity = async (city: string): Promise<string> => {
        const normalized = city.trim().toLowerCase()
        return await hashString(normalized)
      }
      
      // Helper function to normalize and hash country
      const hashCountry = async (country: string): Promise<string> => {
        const normalized = country.trim().toLowerCase()
        return await hashString(normalized)
      }
      
      if (mode === 'fixed' || mode === 'test') {
        // Fixed and test mode: hash PII and use abbreviated field names
        if (userData.email) transformedUserData.em = await hashEmail(userData.email)
        if (userData.phone) transformedUserData.ph = await hashPhone(userData.phone)
        if (userData.first_name) transformedUserData.fn = await hashFirstName(userData.first_name)
        if (userData.last_name) transformedUserData.ln = await hashLastName(userData.last_name)
        if (userData.external_id) transformedUserData.external_id = await hashExternalId(userData.external_id)
        if (userData.city) transformedUserData.ct = await hashCity(userData.city)
        if (userData.country) transformedUserData.country = await hashCountry(userData.country)
      } else {
        // Broken mode: use abbreviated field names but don't hash
        if (userData.email) transformedUserData.em = userData.email
        if (userData.phone) transformedUserData.ph = userData.phone
        if (userData.first_name) transformedUserData.fn = userData.first_name
        if (userData.last_name) transformedUserData.ln = userData.last_name
        if (userData.external_id) transformedUserData.external_id = userData.external_id
        if (userData.city) transformedUserData.ct = userData.city
        if (userData.country) transformedUserData.country = userData.country
      }
      
      // Add client IP and user agent (these are added by backend)
      transformedUserData.client_ip_address = '127.0.0.1'
      transformedUserData.client_user_agent = 'Mozilla/5.0'
      
      transformedPayload.user_data = transformedUserData
    }
    
    // Add custom data if present
    if (requestBody.custom_data) {
      transformedPayload.custom_data = requestBody.custom_data
    }
    
    // Build the final payload structure that matches Meta&apos;s API expectations
    // test_event_code should be at the top level, not inside the event object
    const finalPayload: any = {
      data: [transformedPayload],
      access_token: 'REDACTED',
    }
    
    // Add test_event_code at the top level if in test mode
    if (requestBody.test_event_code) {
      finalPayload.test_event_code = requestBody.test_event_code
    }
    
    setPreviewJson(JSON.stringify(finalPayload, null, 2))
  }, [buildRequestBody, mode])

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

        {/* Mode Selection Card */}
        <div className="glass-strong hover-glow rounded-xl p-6 border border-[#00ff41]/20 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <div className="mb-4">
            <h3 className="font-mono font-semibold flex items-center gap-2 text-[#e8f4f8] text-glow-hover">
              <Activity className="h-4 w-4 text-[#00ff41]" />
              Event Mode
            </h3>
            <p className="text-sm text-[#8b949e] mt-1">
              Choose between broken (demonstrating issues), fixed (best practices), and test (Meta Events Manager) modes
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant={mode === 'broken' ? 'destructive' : 'outline'}
              onClick={() => setMode('broken')}
              className="w-full font-mono"
              disabled={isLoading}
            >
              BROKEN
            </Button>
            <Button
              variant={mode === 'fixed' ? 'default' : 'outline'}
              onClick={() => setMode('fixed')}
              className="w-full font-mono"
              disabled={isLoading}
            >
              FIXED
            </Button>
            <Button
              variant={mode === 'test' ? 'secondary' : 'outline'}
              onClick={() => setMode('test')}
              className="w-full font-mono"
              disabled={isLoading}
            >
              TEST
            </Button>
          </div>
          <div className={`mt-4 glass rounded-lg p-3 border ${
            mode === 'broken'
              ? 'border-red-500/20'
              : mode === 'test'
              ? 'border-[#00d9ff]/20'
              : 'border-[#00ff41]/20'
          }`}>
            <div className="flex items-start gap-2">
              {mode === 'broken' ? (
                <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5" />
              ) : mode === 'test' ? (
                <Info className="h-4 w-4 text-[#00d9ff] mt-0.5" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-[#00ff41] mt-0.5" />
              )}
              <div className="text-sm">
                <p className={`font-mono font-medium ${
                  mode === 'broken' ? 'text-red-400'
                  : mode === 'test' ? 'text-[#00d9ff]'
                  : 'text-[#00ff41]'
                }`}>
                  {mode === 'broken' ? 'Broken Mode Warning' : mode === 'test' ? 'Test Mode Active' : 'Fixed Mode Active'}
                </p>
                <p className="text-[#8b949e] mt-1">
                  {mode === 'broken'
                    ? 'This mode sends un-hashed PII and missing required fields to demonstrate what NOT to do. Random data will include common issues like wrong types, missing fields, and invalid formats for testing error handling. Use dummy data only!'
                    : mode === 'test'
                    ? 'This mode sends events to Meta Events Manager Test Events tab. Requires a test event code. Random data will be valid and properly formatted.'
                    : 'Random data will be valid and properly formatted for testing successful event tracking.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Event Configuration Card */}
        <div className="glass hover-lift rounded-xl p-6 border border-[#00ff41]/20 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          <div className="mb-4">
            <h3 className="font-mono font-semibold text-[#e8f4f8] text-glow-hover">Event Configuration</h3>
            <p className="text-sm text-[#8b949e] mt-1">
              Configure the event details to send
            </p>
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

        {/* Test Event Code Card - Only visible in Test mode */}
        {mode === 'test' && (
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
                Required in Test mode. Get this code from Meta Events Manager → Test Events tab
              </p>
            </div>
          </div>
        )}

        {/* User Data Card */}
        <div className="glass hover-lift rounded-xl p-6 border border-[#00ff41]/20 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[400ms]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-mono font-semibold text-[#e8f4f8] text-glow-hover">User Data (Optional)</h3>
              <p className="text-sm text-[#8b949e] mt-1">
                Add user data for better matching. In Fixed mode, PII will be hashed.
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">Email</label>
              <Input
                type="email"
                placeholder="user@example.com"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                disabled={isLoading}
                className="font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">Phone</label>
              <Input
                type="tel"
                placeholder="+1234567890"
                value={userData.phone}
                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                disabled={isLoading}
                className="font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">First Name</label>
              <Input
                type="text"
                placeholder="John"
                value={userData.first_name}
                onChange={(e) => setUserData({ ...userData, first_name: e.target.value })}
                disabled={isLoading}
                className="font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">Last Name</label>
              <Input
                type="text"
                placeholder="Doe"
                value={userData.last_name}
                onChange={(e) => setUserData({ ...userData, last_name: e.target.value })}
                disabled={isLoading}
                className="font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">External ID</label>
              <Input
                type="text"
                placeholder="customer_123"
                value={userData.external_id}
                onChange={(e) => setUserData({ ...userData, external_id: e.target.value })}
                disabled={isLoading}
                className="font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">City</label>
              <Input
                type="text"
                placeholder="New York"
                value={userData.city}
                onChange={(e) => setUserData({ ...userData, city: e.target.value })}
                disabled={isLoading}
                className="font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">Country</label>
              <Input
                type="text"
                placeholder="US"
                value={userData.country}
                onChange={(e) => setUserData({ ...userData, country: e.target.value })}
                disabled={isLoading}
                className="font-mono text-sm"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">
                Currency {eventName === 'Purchase' && <span className="text-red-400">*</span>}
              </label>
              <Input
                type="text"
                placeholder="USD"
                value={customData.currency}
                onChange={(e) => setCustomData({ ...customData, currency: e.target.value })}
                disabled={isLoading}
                className="font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">
                Value {eventName === 'Purchase' && <span className="text-red-400">*</span>}
              </label>
              <Input
                type="number"
                placeholder="99.99"
                value={customData.value}
                onChange={(e) => setCustomData({ ...customData, value: e.target.value })}
                disabled={isLoading}
                className="font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">Content IDs</label>
              <Input
                type="text"
                placeholder="prod_123, prod_456"
                value={customData.content_ids}
                onChange={(e) => setCustomData({ ...customData, content_ids: e.target.value })}
                disabled={isLoading}
                className="font-mono text-sm"
              />
              <p className="text-xs text-[#8b949e] mt-1">Comma-separated list</p>
            </div>
            <div>
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">Content Type</label>
              <Input
                type="text"
                placeholder="product"
                value={customData.content_type}
                onChange={(e) => setCustomData({ ...customData, content_type: e.target.value })}
                disabled={isLoading}
                className="font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">Content Name</label>
              <Input
                type="text"
                placeholder="Product Name"
                value={customData.content_name}
                onChange={(e) => setCustomData({ ...customData, content_name: e.target.value })}
                disabled={isLoading}
                className="font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">Number of Items</label>
              <Input
                type="number"
                placeholder="1"
                value={customData.num_items}
                onChange={(e) => setCustomData({ ...customData, num_items: e.target.value })}
                disabled={isLoading}
                className="font-mono text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-mono font-medium mb-1 block text-[#8b949e]">Order ID</label>
              <Input
                type="text"
                placeholder="order_12345"
                value={customData.order_id}
                onChange={(e) => setCustomData({ ...customData, order_id: e.target.value })}
                disabled={isLoading}
                className="font-mono text-sm"
              />
            </div>
          </div>
        </div>

        {/* Real-time JSON Preview */}
        <div className="glass-strong hover-border-glow rounded-xl p-6 border border-[#00d9ff]/20 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[600ms]">
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
                    className={`glass rounded-lg p-3 border ${
                      error.severity === 'error' ? 'border-red-500/20' :
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

        {/* Instructions Card */}
        <div className="glass hover-glow rounded-xl p-6 border border-[#00d9ff]/20 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[800ms]">
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
    </div>
  )
}
