'use client'

import * as React from 'react'
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
  X
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
  const [isConfigured, setIsConfigured] = React.useState(false)
  const [mode, setMode] = React.useState<'broken' | 'fixed'>('broken')
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

  // Check CAPI configuration on mount
  React.useEffect(() => {
    checkConfiguration()
  }, [])

  // Validate form in real-time
  React.useEffect(() => {
    validateForm()
  }, [eventName, userData, customData, eventId, mode])

  const checkConfiguration = async () => {
    try {
      const response = await fetch('/api/meta/capi')
      const data = await response.json()
      setIsConfigured(data.configured)
    } catch (error) {
      setIsConfigured(false)
    }
  }

  const validateForm = () => {
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

    setValidationErrors(errors)
  }

  const buildRequestBody = () => {
    const body: any = {
      event_name: eventName,
      mode,
    }

    if (eventId) {
      body.event_id = eventId
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
  }

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

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${label} copied to clipboard`)
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const getRequestBodyPreview = () => {
    return JSON.stringify(buildRequestBody(), null, 2)
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">CAPI Test</h1>
        <p className="mt-2 text-muted-foreground">
          Test Meta Conversions API server-side event tracking with comprehensive debugging
        </p>
      </div>

      <div className="space-y-6">
        {/* Configuration Status Card */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              {isConfigured ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              )}
              <div>
                <h3 className="font-semibold">CAPI Configuration</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {isConfigured
                    ? 'CAPI is properly configured and ready to send events'
                    : 'CAPI is not configured. Please check your environment variables.'}
                </p>
              </div>
            </div>
            <Badge variant={isConfigured ? 'default' : 'destructive'}>
              {isConfigured ? 'Configured' : 'Not Configured'}
            </Badge>
          </div>

          {!isConfigured && (
            <div className="mt-4 rounded-md bg-yellow-500/10 p-3 border border-yellow-500/20">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-900">Configuration Required</p>
                  <p className="text-yellow-800 mt-1">
                    Set the following environment variables in .env.local:
                  </p>
                  <ul className="mt-2 list-disc list-inside text-yellow-800 space-y-1">
                    <li className="font-mono text-xs">META_CAPI_ACCESS_TOKEN</li>
                    <li className="font-mono text-xs">NEXT_PUBLIC_FB_PIXEL_ID</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Mode Selection Card */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Server className="h-4 w-4" />
              Event Mode
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Choose between broken (demonstrating issues) and fixed (best practices) modes
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={mode === 'broken' ? 'destructive' : 'outline'}
              onClick={() => setMode('broken')}
              className="w-full"
              disabled={isLoading}
            >
              Broken Mode
            </Button>
            <Button
              variant={mode === 'fixed' ? 'default' : 'outline'}
              onClick={() => setMode('fixed')}
              className="w-full"
              disabled={isLoading}
            >
              Fixed Mode
            </Button>
          </div>
          {mode === 'broken' && (
            <div className="mt-4 rounded-md bg-red-500/10 p-3 border border-red-500/20">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-red-900">Broken Mode Warning</p>
                  <p className="text-red-800 mt-1">
                    This mode sends un-hashed PII and missing required fields to demonstrate what NOT to do.
                    Use dummy data only!
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Event Configuration Card */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="font-semibold">Event Configuration</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Configure the event details to send
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Event Name <span className="text-red-500">*</span>
              </label>
              <select
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {SUPPORTED_EVENTS.map(event => (
                  <option key={event} value={event}>{event}</option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                Select from Meta's standard event types
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Event ID (Optional)
              </label>
              <Input
                type="text"
                placeholder="e.g., 550e8400-e29b-41d4-a716-446655440000"
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                UUID for event deduplication. Leave blank for auto-generation.
              </p>
            </div>
          </div>
        </Card>

        {/* User Data Card */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="font-semibold">User Data (Optional)</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Add user data for better matching. In Fixed mode, PII will be hashed.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1 block">Email</label>
              <Input
                type="email"
                placeholder="user@example.com"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Phone</label>
              <Input
                type="tel"
                placeholder="+1234567890"
                value={userData.phone}
                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">First Name</label>
              <Input
                type="text"
                placeholder="John"
                value={userData.first_name}
                onChange={(e) => setUserData({ ...userData, first_name: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Last Name</label>
              <Input
                type="text"
                placeholder="Doe"
                value={userData.last_name}
                onChange={(e) => setUserData({ ...userData, last_name: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">External ID</label>
              <Input
                type="text"
                placeholder="customer_123"
                value={userData.external_id}
                onChange={(e) => setUserData({ ...userData, external_id: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">City</label>
              <Input
                type="text"
                placeholder="New York"
                value={userData.city}
                onChange={(e) => setUserData({ ...userData, city: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Country</label>
              <Input
                type="text"
                placeholder="US"
                value={userData.country}
                onChange={(e) => setUserData({ ...userData, country: e.target.value })}
                disabled={isLoading}
              />
            </div>
          </div>
        </Card>

        {/* Custom Data Card */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="font-semibold">Custom Data (Optional)</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Add event-specific parameters. Required fields vary by event type.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1 block">
                Currency {eventName === 'Purchase' && <span className="text-red-500">*</span>}
              </label>
              <Input
                type="text"
                placeholder="USD"
                value={customData.currency}
                onChange={(e) => setCustomData({ ...customData, currency: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">
                Value {eventName === 'Purchase' && <span className="text-red-500">*</span>}
              </label>
              <Input
                type="number"
                placeholder="99.99"
                value={customData.value}
                onChange={(e) => setCustomData({ ...customData, value: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Content IDs</label>
              <Input
                type="text"
                placeholder="prod_123, prod_456"
                value={customData.content_ids}
                onChange={(e) => setCustomData({ ...customData, content_ids: e.target.value })}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground mt-1">Comma-separated list</p>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Content Type</label>
              <Input
                type="text"
                placeholder="product"
                value={customData.content_type}
                onChange={(e) => setCustomData({ ...customData, content_type: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Content Name</label>
              <Input
                type="text"
                placeholder="Product Name"
                value={customData.content_name}
                onChange={(e) => setCustomData({ ...customData, content_name: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Number of Items</label>
              <Input
                type="number"
                placeholder="1"
                value={customData.num_items}
                onChange={(e) => setCustomData({ ...customData, num_items: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium mb-1 block">Order ID</label>
              <Input
                type="text"
                placeholder="order_12345"
                value={customData.order_id}
                onChange={(e) => setCustomData({ ...customData, order_id: e.target.value })}
                disabled={isLoading}
              />
            </div>
          </div>
        </Card>

        {/* Real-time JSON Preview */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-blue-500" />
              <h3 className="font-semibold">Real-time JSON Preview</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPreviewExpanded(!previewExpanded)}
              className="h-8"
            >
              {previewExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
          {previewExpanded && (
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(getRequestBodyPreview(), 'Request JSON')}
                className="absolute top-2 right-2 h-8 gap-1 z-10"
              >
                <Copy className="h-3 w-3" />
                Copy
              </Button>
              <ScrollArea className="h-64 rounded-md border bg-muted/20 p-3">
                <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                  {getRequestBodyPreview()}
                </pre>
              </ScrollArea>
            </div>
          )}
        </Card>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <Card className={`p-6 ${validationErrors.some(e => e.severity === 'error') ? 'border-red-500/20 bg-red-500/5' : 'border-yellow-500/20 bg-yellow-500/5'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bug className="h-4 w-4" />
                <h3 className="font-semibold">Validation Results</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDebugExpanded(!debugExpanded)}
                className="h-8"
              >
                {debugExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
            {debugExpanded && (
              <div className="space-y-3">
                {validationErrors.map((error, index) => (
                  <div
                    key={index}
                    className={`rounded-md p-3 border ${
                      error.severity === 'error' ? 'bg-red-500/10 border-red-500/20' :
                      error.severity === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20' :
                      'bg-blue-500/10 border-blue-500/20'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {error.severity === 'error' ? (
                        <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      ) : error.severity === 'warning' ? (
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-medium">{error.field}</span>
                          <Badge variant={error.severity === 'error' ? 'destructive' : error.severity === 'warning' ? 'default' : 'secondary'} className="text-xs">
                            {error.severity}
                          </Badge>
                        </div>
                        <p className="text-sm mt-1">{error.message}</p>
                        {error.suggestion && (
                          <p className="text-xs text-muted-foreground mt-1">
                            <span className="font-medium">Suggestion:</span> {error.suggestion}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Actions Card */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={sendTestEvent}
              disabled={!isConfigured || isLoading}
              className="w-full sm:w-auto gap-2"
            >
              <Send className="h-4 w-4" />
              <span>Send Server Test Event</span>
            </Button>
            {lastTestTime && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Last test: {lastTestTime}
              </div>
            )}
          </div>
        </Card>

        {/* Request/Response Display */}
        {(requestDetails || responseDetails) && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Request & Response Details</h3>
              <Button
                onClick={clearResponse}
                variant="outline"
                size="sm"
                className="h-8"
              >
                Clear
              </Button>
            </div>
            
            <Tabs defaultValue="request" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="request">Request</TabsTrigger>
                <TabsTrigger value="response">Response</TabsTrigger>
              </TabsList>
              
              <TabsContent value="request" className="mt-4">
                {requestDetails && (
                  <div className="space-y-4">
                    {/* Request Metadata */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Method:</span>{' '}
                        <Badge variant="outline">{requestDetails.method}</Badge>
                      </div>
                      <div>
                        <span className="text-muted-foreground">URL:</span>{' '}
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{requestDetails.url}</code>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Timestamp:</span>{' '}
                        <span className="text-xs">{requestDetails.timestamp}</span>
                      </div>
                    </div>

                    {/* Request Headers */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">Headers</h4>
                      </div>
                      <ScrollArea className="h-24 rounded-md border bg-muted/20 p-3">
                        <pre className="text-xs font-mono text-muted-foreground">
                          {JSON.stringify(requestDetails.headers, null, 2)}
                        </pre>
                      </ScrollArea>
                    </div>

                    {/* Request Body */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">Body</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(JSON.stringify(requestDetails.body, null, 2), 'Request Body')}
                          className="h-7 gap-1"
                        >
                          <Copy className="h-3 w-3" />
                          Copy
                        </Button>
                      </div>
                      <ScrollArea className="h-64 rounded-md border bg-muted/20 p-3">
                        <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
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
                        <span className="text-muted-foreground">Status:</span>{' '}
                        <Badge variant={responseDetails.status >= 200 && responseDetails.status < 300 ? 'default' : 'destructive'}>
                          {responseDetails.status} {responseDetails.statusText}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Response Time:</span>{' '}
                        <span className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-yellow-500" />
                          {responseDetails.responseTime}ms
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Timestamp:</span>{' '}
                        <span className="text-xs">{responseDetails.timestamp}</span>
                      </div>
                    </div>

                    {/* Response Headers */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">Headers</h4>
                      </div>
                      <ScrollArea className="h-24 rounded-md border bg-muted/20 p-3">
                        <pre className="text-xs font-mono text-muted-foreground">
                          {JSON.stringify(responseDetails.headers, null, 2)}
                        </pre>
                      </ScrollArea>
                    </div>

                    {/* Response Body */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">Body</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(JSON.stringify(responseDetails.body, null, 2), 'Response Body')}
                          className="h-7 gap-1"
                        >
                          <Copy className="h-3 w-3" />
                          Copy
                        </Button>
                      </div>
                      <ScrollArea className="h-64 rounded-md border bg-muted/20 p-3">
                        <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                          {JSON.stringify(responseDetails.body, null, 2)}
                        </pre>
                      </ScrollArea>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        )}

        {/* Instructions Card */}
        <Card className="border-blue-500/20 bg-blue-500/5 p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            How to Verify
          </h3>
          <ol className="space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-medium">
                1
              </span>
              <div>
                <p className="font-medium">Open Meta Events Manager</p>
                <p className="text-muted-foreground">
                  Go to{' '}
                  <a
                    href="https://business.facebook.com/events_manager2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Events Manager
                  </a>{' '}
                  and select your pixel
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-medium">
                2
              </span>
              <div>
                <p className="font-medium">Navigate to Test Events</p>
                <p className="text-muted-foreground">
                  Click on <span className="rounded bg-muted px-1.5 py-0.5">Test Events</span> in the left sidebar
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-medium">
                3
              </span>
              <div>
                <p className="font-medium">Send a Test Event</p>
                <p className="text-muted-foreground">
                  Click the <span className="rounded bg-muted px-1.5 py-0.5">Send Server Test Event</span> button above
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-medium">
                4
              </span>
              <div>
                <p className="font-medium">Verify Event Received</p>
                <p className="text-muted-foreground">
                  Look for your selected event (e.g., <span className="rounded bg-muted px-1.5 py-0.5">{eventName}</span>) in the test events list
                </p>
              </div>
            </li>
          </ol>
        </Card>
      </div>
    </div>
  )
}
