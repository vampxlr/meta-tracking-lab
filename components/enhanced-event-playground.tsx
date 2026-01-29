"use client"

import * as React from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Play,
  Trash2,
  Copy,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Activity,
  Code,
  Clock,
  Zap,
  ExternalLink,
  RefreshCw,
  Network,
  Server,
  Globe,
  Edit,
  Send,
  Shuffle,
  Link2
} from "lucide-react"

interface LogEntry {
  internalId: string // Unique ID for React rendering
  id: string
  timestamp: string
  event: string
  pixelPayload?: any
  capiPayload?: any
  pixelSent: boolean
  capiSent: boolean
  pixelTime?: number
  capiTime?: number
  capiResponse?: any
  success?: boolean
  matchQuality?: number
}

interface NetworkLog {
  pixelRequest?: {
    url: string
    params: any
    timestamp: number
    duration?: number
  }
  capiRequest?: {
    url: string
    body: any
    timestamp: number
    duration?: number
  }
  capiResponse?: {
    status: number
    body: any
    timestamp: number
    duration: number
    debug?: {
      ip: string
      userAgent: string | null
      fbp: string | null
      fbc: string | null
      eventId: string
    }
  }
}

interface EventPlaygroundProps {
  title?: string
  description?: string
  events?: Array<{
    name: string
    icon?: React.ReactNode
    payload?: any  // Single payload mode
    description?: string
  }>
  showLogs?: boolean
  sendToMeta?: boolean
  sendToBoth?: boolean
  showNetworkInspector?: boolean
  showMetaResponse?: boolean
  enableComparison?: boolean
  testEventCode?: string
  pixelId?: string
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

import { useTestMode } from "@/components/test-mode-provider"

export function EnhancedEventPlayground({
  title = "Interactive Event Playground",
  description = "Test different event scenarios and see real-time results from Meta",
  events = [],
  showLogs = true,
  sendToMeta = true,
  sendToBoth = true,
  showNetworkInspector = true,
  showMetaResponse = true,
  enableComparison = false,
  testEventCode = "",
  pixelId,
}: EventPlaygroundProps) {
  const { isEnabled: isGlobalTestEnabled, testCode: globalTestCode } = useTestMode()
  // Use global code if enabled, otherwise prop, otherwise undefined
  const activeTestCode = isGlobalTestEnabled && globalTestCode ? globalTestCode : testEventCode || undefined

  const [logs, setLogs] = React.useState<LogEntry[]>([])
  const [currentNetwork, setCurrentNetwork] = React.useState<NetworkLog | null>(null)
  const [isSending, setIsSending] = React.useState(false)
  const [autoRefreshMeta, setAutoRefreshMeta] = React.useState(false)

  // New State for Live JSON Builder
  const [selectedEventName, setSelectedEventName] = React.useState<string>("")
  const [editableJson, setEditableJson] = React.useState<string>("")
  const [jsonError, setJsonError] = React.useState<string>("")

  const scrollAreaRef = React.useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new log is added
  React.useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [logs])

  // Fetch Live Debug Info on mount
  const [debugInfo, setDebugInfo] = React.useState<{ fbp: string; userAgent: string; ip: string | null }>({
    fbp: 'Loading...',
    userAgent: 'Loading...',
    ip: 'Loading...'
  })

  const refreshDebugInfo = () => {
    if (typeof window !== 'undefined') {
      const fbp = getCookie('_fbp') || 'Not Found (Browser)'
      const userAgent = navigator.userAgent

      setDebugInfo(prev => ({ ...prev, fbp, userAgent }))

      // Fetch IP
      fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => {
          setDebugInfo(prev => ({ ...prev, ip: data.ip }))
        })
        .catch(err => {
          console.error('Failed to fetch IP:', err)
          setDebugInfo(prev => ({ ...prev, ip: 'Failed to fetch' }))
        })
    }
  }

  React.useEffect(() => {
    refreshDebugInfo()
  }, [])

  // Check for cookies on mount to reassure user (matches capi-test behavior)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const fbp = getCookie('_fbp')
      const fbc = getCookie('_fbc')

      // Only toast if we found something, to confirm site-wide fix is active
      if (fbp) toast.success('Loaded _fbp from cookie', { description: fbp })
      if (fbc) toast.success('Loaded _fbc from cookie', { description: fbc })
    }
  }, [])

  // Handle Scenario Click - Populates JSON Builder
  const handleEventSelect = (event: typeof events[0]) => {
    const payload = event.payload
    setSelectedEventName(event.name)
    // Auto-randomize on selection so we always start with fresh IDs
    const randomized = randomizePayload(payload)
    setEditableJson(JSON.stringify(randomized, null, 2))
    setJsonError("")
    setCurrentNetwork(null)
  }

  // Validate JSON
  const validateJson = (): any | null => {
    try {
      const parsed = JSON.parse(editableJson)
      setJsonError("")
      return parsed
    } catch (error) {
      setJsonError(error instanceof Error ? error.message : "Invalid JSON")
      return null
    }
  }

  const sendToMetaPixel = async (eventName: string, payload: any, eventId: string) => {
    const startTime = performance.now()

    try {
      // Check if fbq is available
      if (typeof window !== 'undefined' && (window as any).fbq) {
        const customData = payload.custom_data || {}

          // Send to Meta Pixel
          ; (window as any).fbq('track', eventName, customData, {
            eventID: eventId
          })

        const duration = performance.now() - startTime

        return {
          success: true,
          duration,
          url: `https://www.facebook.com/tr/?id=${pixelId || 'YOUR_PIXEL_ID'}`,
          params: { eventName, customData, eventID: eventId }
        }
      } else {
        // Pixel not loaded - simulate
        const duration = performance.now() - startTime + Math.random() * 100
        return {
          success: true,
          duration,
          url: `https://www.facebook.com/tr/?id=${pixelId || 'YOUR_PIXEL_ID'}`,
          params: { eventName, ...payload, eventID: eventId },
          simulated: true
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: performance.now() - startTime
      }
    }
  }

  const sendToCAPI = async (eventName: string, payload: any) => {
    const startTime = performance.now()

    try {
      const response = await fetch('/api/meta/capi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_name: eventName,
          test_event_code: activeTestCode,
          ...payload
        }),
      })

      const duration = performance.now() - startTime
      const data = await response.json()

      return {
        success: response.ok,
        status: response.status,
        body: data,
        duration,
        url: '/api/meta/capi'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: performance.now() - startTime
      }
    }
  }

  // Send the events using the current JSON State
  const handleSendRequest = async () => {
    const payload = validateJson()
    if (!payload) {
      toast.error('Invalid JSON', {
        description: jsonError,
      })
      return
    }

    if (!selectedEventName) {
      toast.error('No event selected', {
        description: 'Please select an event first',
      })
      return
    }

    setIsSending(true)
    console.log("Starting event send sequence...", { selectedEventName, payload })
    const timestamp = new Date().toLocaleTimeString()

    // Check for special flags
    const forceDifferentIds = payload?.custom_data?._force_different_ids
    const noEventId = payload?.custom_data?._no_event_id
    const delayCapiMs = payload?.custom_data?._delay_capi

    // Generate event IDs
    let pixelEventId: string
    let capiEventId: string

    if (noEventId) {
      // Explicitly send undefined to simulate broken setup
      pixelEventId = undefined as any
      capiEventId = undefined as any
    } else if (forceDifferentIds) {
      // Generate different IDs for Pixel and CAPI to simulate the problem
      pixelEventId = crypto.randomUUID()
      capiEventId = crypto.randomUUID()
    } else {
      // Use event_id from payload if provided, otherwise generate one shared ID
      const sharedId = payload?.event_id || crypto.randomUUID()
      pixelEventId = sharedId
      capiEventId = sharedId
    }

    // Initialize network log
    const networkLog: NetworkLog = {}

    try {
      let pixelResult: any = null
      let capiResult: any = null

      // Send to Pixel if enabled
      if (sendToMeta && sendToBoth) {
        // use payload.event_name (e.g. "Purchase") instead of selectedEventName (e.g. "High-Value Purchase (FIXED)")
        // This ensures Pixel and CAPI event names match for deduplication
        const finalPixelEventName = payload.event_name || selectedEventName
        pixelResult = await sendToMetaPixel(finalPixelEventName, payload, pixelEventId)
        networkLog.pixelRequest = {
          url: pixelResult.url,
          params: pixelResult.params,
          timestamp: Date.now(),
          duration: pixelResult.duration
        }

        // Show Pixel toast immediately
        toast.info(`Pixel Event Sent`, {
          description: `${selectedEventName} • ${Math.round(pixelResult.duration)}ms`,
        })
      }

      // Delay CAPI if requested
      if (delayCapiMs) {
        await new Promise(resolve => setTimeout(resolve, delayCapiMs))
      }

      // Send to CAPI if enabled
      if (sendToMeta && sendToBoth) {
        // Create CAPI payload with correct event_id
        const capiPayload = {
          ...payload,
          event_id: capiEventId
        }

        // AUTO-FIX: Inject real browser data if not explicitly in "broken" mode
        // This ensures "Fixed" examples actually match the real browser session for proper deduplication
        const testMode = payload.custom_data?.test_mode
        if (testMode !== 'broken' && typeof window !== 'undefined') {
          if (!capiPayload.user_data) capiPayload.user_data = {}

          // Inject Real User Agent
          if (!capiPayload.user_data.client_user_agent || capiPayload.user_data.client_user_agent === 'Mozilla/5.0') {
            capiPayload.user_data.client_user_agent = navigator.userAgent
          }

          // Inject Real Cookies
          const fbp = getCookie('_fbp')
          const fbc = getCookie('_fbc')

          if (fbp && (!capiPayload.user_data.fbp || capiPayload.user_data.fbp.startsWith('fb.1.1705334567890'))) {
            capiPayload.user_data.fbp = fbp
          }
          if (fbc && (!capiPayload.user_data.fbc || capiPayload.user_data.fbc.startsWith('fb.1.1705334567890'))) {
            capiPayload.user_data.fbc = fbc
          }

          // Clear hardcoded IP if present (let server/Meta handle it)
          if (capiPayload.user_data.client_ip_address === '192.168.1.1') {
            capiPayload.user_data.client_ip_address = ''
          }
        }

        capiResult = await sendToCAPI(selectedEventName, capiPayload)
        networkLog.capiRequest = {
          url: capiResult.url,
          body: capiPayload,
          timestamp: Date.now(),
          duration: capiResult.duration
        }
        networkLog.capiResponse = {
          status: capiResult.status,
          body: capiResult.body,
          timestamp: Date.now(),
          duration: capiResult.duration,
          debug: capiResult.body?.debug  // Capture debug info from API response
        }

        // Show CAPI toast
        if (capiResult?.success) {
          toast.success(`CAPI Event Sent${delayCapiMs ? ' (delayed)' : ''}`, {
            description: `${selectedEventName} • ${Math.round(capiResult.duration)}ms`,
          })
        } else {
          toast.error(`CAPI Event Failed`, {
            description: capiResult?.error || 'Unknown error',
          })
        }
      }

      // Create log entry
      const newLog: LogEntry = {
        internalId: crypto.randomUUID(), // Guaranteed unique
        id: pixelEventId,
        timestamp,
        event: selectedEventName,
        pixelPayload: { ...payload, event_id: pixelEventId },
        capiPayload: { ...payload, event_id: capiEventId },
        pixelSent: !!pixelResult?.success,
        capiSent: !!capiResult?.success,
        pixelTime: pixelResult?.duration,
        capiTime: capiResult?.duration,
        capiResponse: capiResult?.body,
        success: capiResult?.success,
        matchQuality: capiResult?.body?.match_quality || 7.5
      }

      setLogs(prev => [...prev, newLog])
      setCurrentNetwork(networkLog)

    } catch (error) {
      toast.error('Failed to send event', {
        description: error instanceof Error ? error.message : 'Unknown error',
      })
    } finally {
      setIsSending(false)
    }
  }

  const clearLogs = () => {
    setLogs([])
    setCurrentNetwork(null)
    toast.info('Logs cleared')
  }

  const clearEditor = () => {
    setEditableJson("")
    setSelectedEventName("")
    setJsonError("")
    setCurrentNetwork(null)
  }

  const copyPayload = (payload: any) => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2))
    toast.success('Payload copied to clipboard')
  }

  const copyToClipboard = (content: any) => {
    navigator.clipboard.writeText(JSON.stringify(content, null, 2))
    toast.success('Copied to clipboard')
  }

  const randomizePayload = (payload: any): any => {
    if (!payload || typeof payload !== 'object') return payload

    const newPayload = { ...payload }

    // 1. Randomize event_id if present, OR generate new one if missing
    // FIX: Always ensure event_id is present so it shows up in JSON Builder
    if (newPayload.event_id) {
      newPayload.event_id = crypto.randomUUID()
    } else {
      newPayload.event_id = crypto.randomUUID()
    }

    // 2. Update event_time to now
    if (newPayload.event_time) {
      newPayload.event_time = Math.floor(Date.now() / 1000)
    }

    // 3. Randomize specific custom_data fields
    if (newPayload.custom_data) {
      newPayload.custom_data = { ...newPayload.custom_data }

      // Randomize order_id if present
      if (newPayload.custom_data.order_id) {
        // Check if it looks like a UUID or just a string
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(newPayload.custom_data.order_id)
        if (isUuid) {
          const newUuid = crypto.randomUUID()
          newPayload.custom_data.order_id = newUuid
          // If event_id was also this UUID, keep them in sync (common pattern)
          if (payload.event_id === payload.custom_data.order_id) {
            newPayload.event_id = newUuid
          }
        } else {
          // Simple random suffix
          const prefix = newPayload.custom_data.order_id.split('_')[0] || 'order'
          newPayload.custom_data.order_id = `${prefix}_${Math.floor(Math.random() * 100000)}`
        }
      }

      // Randomize external_id if present
      if (newPayload.custom_data.external_id) {
        newPayload.custom_data.external_id = `user_${Math.floor(Math.random() * 100000)}`
      }
    }

    // 4. Randomize user_data but preserve (and INJECT) browser constants
    if (!newPayload.user_data) {
      newPayload.user_data = {}
    }

    newPayload.user_data = { ...newPayload.user_data }

    // Randomize email if present (but keep format)
    if (newPayload.user_data.em) {
      // Just hashing a new random email simulation
      newPayload.user_data.em = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    }

    // Randomize phone if present
    if (newPayload.user_data.ph) {
      newPayload.user_data.ph = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    }

    // INJECT: Real Browser Data (Critical for Deduplication)
    // SKIP if test_mode is 'broken' (we want to simulate missing data)
    if (typeof window !== 'undefined' && newPayload.custom_data?.test_mode !== 'broken') {
      // 1. User Agent
      if (!newPayload.user_data.client_user_agent) {
        newPayload.user_data.client_user_agent = navigator.userAgent
      }

      // 2. FBP (Browser ID)
      const fbp = getCookie('_fbp')
      if (fbp && !newPayload.user_data.fbp) {
        newPayload.user_data.fbp = fbp
      }

      // 3. FBC (Click ID)
      const fbc = getCookie('_fbc')
      if (fbc && !newPayload.user_data.fbc) {
        newPayload.user_data.fbc = fbc
      }

      // 4. Client IP
      // Inject real public IP if available (critical for localhost deduplication)
      if (debugInfo.ip && debugInfo.ip !== 'Loading...' && (!newPayload.user_data.client_ip_address || newPayload.user_data.client_ip_address === "auto")) {
        newPayload.user_data.client_ip_address = debugInfo.ip
      } else if (newPayload.user_data.client_ip_address === "auto") {
        delete newPayload.user_data.client_ip_address
      }

      // 5. Event Source URL (Must match Pixel URL)
      // Pixel automatically uses current URL, so CAPI must match it for best results
      if (!newPayload.event_source_url) {
        newPayload.event_source_url = window.location.href
      }
    }

    return newPayload
  }

  const handleRandomize = () => {
    try {
      const currentPayload = JSON.parse(editableJson || "{}")
      const randomized = randomizePayload(currentPayload)
      setEditableJson(JSON.stringify(randomized, null, 2))
      setJsonError("")
      toast.success('Values Randomized', {
        description: 'Generated new event_id and timestamps while preserving browser constants.'
      })
    } catch (error) {
      toast.error('Cannot randomize', {
        description: 'Invalid JSON currently in editor'
      })
    }
  }

  const openEventsManager = () => {
    const url = `https://business.facebook.com/events_manager2/list/pixel/${pixelId || 'YOUR_PIXEL_ID'}/test_events`
    window.open(url, '_blank')
  }

  return (
    <div className="space-y-6">

      {/* Live Debug Info Panel */}
      <div className="glass hover-glow rounded-xl border border-[#00d9ff]/20 p-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={refreshDebugInfo}>
            <RefreshCw className="h-3 w-3 text-[#00d9ff]" />
          </Button>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-[#00d9ff]/10">
            <Activity className="h-4 w-4 text-[#00d9ff]" />
          </div>
          <h4 className="font-mono text-sm font-bold text-[#e8f4f8]">Live Debug Info</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* FBP */}
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-[#8b949e] font-mono">Detected _fbp Cookie</p>
            <code className="text-xs font-mono text-[#00ff41] block break-all whitespace-pre-wrap" title={debugInfo.fbp}>
              {debugInfo.fbp}
            </code>
          </div>

          {/* User Agent */}
          <div className="space-y-1 md:col-span-2">
            <p className="text-[10px] uppercase tracking-wider text-[#8b949e] font-mono">Detected User Agent</p>
            <code className="text-xs font-mono text-[#00d9ff] block break-all whitespace-pre-wrap" title={debugInfo.userAgent}>
              {debugInfo.userAgent}
            </code>
          </div>

          {/* IP Address */}
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-[#8b949e] font-mono">Public IP (Detected)</p>
            <code className="text-xs font-mono text-yellow-400 block break-all" title={debugInfo.ip || ''}>
              {debugInfo.ip}
            </code>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-[#00d9ff]/10">
          <p className="text-[10px] text-[#8b949e]">
            * Verify these match exactly what you see in the "Network Inspector" CAPI payload.
          </p>
        </div>
      </div>

      {/* Main Playground Card */}
      <div className="glass-strong hover-border-glow rounded-xl border border-[#00ff41]/20 p-6 space-y-6">

        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-[#00ff41]/10 border border-[#00ff41]/30 pulse-glow">
              <Activity className="h-5 w-5 text-[#00ff41]" />
            </div>
            <h3 className="font-mono text-lg font-bold text-[#e8f4f8] text-glow-hover">{title}</h3>
            {sendToMeta && (
              <Badge variant="outline" className={`font-mono text-xs ${isGlobalTestEnabled ? 'border-[#00ff41] text-[#00ff41] animate-pulse' : ''}`}>
                <Zap className="h-3 w-3 mr-1" />
                {isGlobalTestEnabled ? `TEST MODE: ${activeTestCode}` : 'LIVE'}
              </Badge>
            )}
          </div>
          <p className="text-sm text-[#8b949e]">{description}</p>
        </div>

        {/* Meta Link (Mode toggle removed) */}
        <div className="grid gap-4 md:grid-cols-1">
          {/* Meta Events Manager Link */}
          {sendToMeta && pixelId && (
            <div className="glass rounded-lg p-4 border border-[#00d9ff]/20">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <ExternalLink className="h-4 w-4 text-[#00d9ff]" />
                    <span className="font-mono text-sm font-medium text-[#00d9ff]">View in Meta Events Manager</span>
                  </div>
                  <p className="text-xs text-[#8b949e]">
                    Real-time events appear within 5-10 seconds
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openEventsManager}
                  className="font-mono text-xs"
                >
                  <Globe className="h-3 w-3 mr-1" />
                  Open Manager
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Event Buttons */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-mono text-sm font-medium text-[#e8f4f8]">Select Scenario</h4>
            <Badge variant="outline" className="font-mono text-xs">
              {events.length} scenarios
            </Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {events.map((event, index) => (
              <button
                key={index}
                onClick={() => handleEventSelect(event)}
                disabled={isSending}
                className={`glass hover-lift rounded-lg p-4 border text-left group transition-all disabled:opacity-50 disabled:cursor-not-allowed ${selectedEventName === event.name
                  ? 'border-[#00ff41] bg-[#00ff41]/10'
                  : 'border-[#00ff41]/20'
                  }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {event.icon || <Zap className="h-4 w-4 text-[#00ff41] icon-spin-hover" />}
                  <span className="font-mono text-sm font-semibold text-[#e8f4f8]">
                    {event.name}
                  </span>
                </div>
                {event.description && (
                  <p className="text-xs text-[#8b949e]">
                    {event.description}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live JSON Builder (Editable) */}
      {selectedEventName && (
        <div className="glass-strong rounded-xl border border-[#00d9ff]/20 bg-gray-900/50">
          <div className="border-b border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit className="h-4 w-4 text-[#00d9ff]" />
                <h4 className="font-mono text-sm font-medium text-[#00d9ff]">Live JSON Builder</h4>
                <Badge variant="outline" className="font-mono text-xs border-[#00ff41]/30 text-[#00ff41]">
                  {selectedEventName}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(JSON.parse(editableJson || "{}"))}
                  className="h-7 gap-1 font-mono text-xs"
                  disabled={!!jsonError || !editableJson}
                >
                  <Copy className="h-3 w-3" />
                  Copy
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRandomize}
                  className="h-7 gap-1 font-mono text-xs hover:text-[#00ff41] hover:bg-[#00ff41]/10"
                  disabled={!!jsonError || !editableJson}
                >
                  <Shuffle className="h-3 w-3" />
                  Random
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearEditor}
                  className="h-7 gap-1 font-mono text-xs"
                >
                  <Trash2 className="h-3 w-3" />
                  Clear
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <p className="text-xs text-[#8b949e]">
              Review and edit the event payload below. This is exactly what will be sent to Meta.
            </p>

            <div className="relative">
              <textarea
                value={editableJson}
                onChange={(e) => {
                  setEditableJson(e.target.value)
                  setJsonError("")
                }}
                onBlur={validateJson}
                className={`w-full font-mono text-xs bg-gray-950 rounded-lg p-4 border resize-y min-h-[200px] ${jsonError
                  ? 'border-red-500/50 text-red-500 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-[#00ff41]/20 text-[#00ff41] focus:border-[#00ff41] focus:ring-[#00ff41]/20'
                  } focus:outline-none focus:ring-2`}
                placeholder='{\n  "key": "value"\n}'
                spellCheck={false}
              />
              {jsonError && (
                <div className="mt-2 flex items-start gap-2 text-xs text-red-500">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{jsonError}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button
                onClick={handleSendRequest}
                disabled={isSending || !!jsonError || !editableJson}
                size="lg"
                className="bg-[#00ff41] text-black hover:bg-[#00ff41]/80 font-mono font-bold"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSending ? 'Sending to Meta...' : 'SEND EVENT'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Network Inspector */}
      {showNetworkInspector && currentNetwork && (
        <div className="glass-strong rounded-xl border border-[#00d9ff]/20 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Network className="h-5 w-5 text-[#00d9ff]" />
            <h4 className="font-mono text-lg font-semibold text-[#00d9ff]">Network Inspector</h4>
          </div>

          <Tabs defaultValue="pixel" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pixel" className="font-mono text-xs">
                <Globe className="h-3 w-3 mr-1" />
                Pixel Request
              </TabsTrigger>
              <TabsTrigger value="capi" className="font-mono text-xs">
                <Server className="h-3 w-3 mr-1" />
                CAPI Request
              </TabsTrigger>
              <TabsTrigger value="response" className="font-mono text-xs">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Response
              </TabsTrigger>
              <TabsTrigger value="dedup" className="font-mono text-xs">
                <Link2 className="h-3 w-3 mr-1" />
                Deduplication
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pixel" className="mt-4">
              {currentNetwork.pixelRequest ? (
                <div className="space-y-3">
                  <div className="glass rounded-lg p-3">
                    <p className="text-xs font-mono text-[#8b949e] mb-1">URL:</p>
                    <code className="text-xs font-mono text-[#00d9ff] break-all">
                      {currentNetwork.pixelRequest.url}
                    </code>
                  </div>

                  <div className="glass rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-mono text-[#8b949e]">Parameters:</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyPayload(currentNetwork.pixelRequest?.params)}
                        className="h-6 gap-1"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <pre className="text-xs font-mono text-[#00ff41] overflow-x-auto">
                      {JSON.stringify(currentNetwork.pixelRequest.params, null, 2)}
                    </pre>
                  </div>

                  <div className="flex gap-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {currentNetwork.pixelRequest.duration?.toFixed(0)}ms
                    </Badge>
                    <Badge variant="outline" className="font-mono text-xs">
                      <CheckCircle2 className="h-3 w-3 mr-1 text-[#00ff41]" />
                      Sent
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(currentNetwork.pixelRequest)}
                      className="ml-auto h-6 text-xs font-mono"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy Full Log
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[#8b949e]">No Pixel request sent</p>
              )}
            </TabsContent>

            <TabsContent value="capi" className="mt-4">
              {currentNetwork.capiRequest ? (
                <div className="space-y-3">
                  <div className="glass rounded-lg p-3">
                    <p className="text-xs font-mono text-[#8b949e] mb-1">Endpoint:</p>
                    <code className="text-xs font-mono text-[#00d9ff]">
                      POST {currentNetwork.capiRequest.url}
                    </code>
                  </div>

                  <div className="glass rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-mono text-[#8b949e]">Request Body:</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyPayload(currentNetwork.capiRequest?.body)}
                        className="h-6 gap-1"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <pre className="text-xs font-mono text-[#00ff41] overflow-x-auto">
                      {JSON.stringify(currentNetwork.capiRequest.body, null, 2)}
                    </pre>
                  </div>

                  <div className="flex gap-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {currentNetwork.capiRequest.duration?.toFixed(0)}ms
                    </Badge>
                    <Badge variant="outline" className="font-mono text-xs">
                      <Zap className="h-3 w-3 mr-1 text-yellow-400" />
                      Server-Side
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(currentNetwork.capiRequest)}
                      className="ml-auto h-6 text-xs font-mono"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy Full Log
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[#8b949e]">No CAPI request sent</p>
              )}
            </TabsContent>

            <TabsContent value="response" className="mt-4">
              {currentNetwork.capiResponse ? (
                <div className="space-y-3">
                  <div className="glass rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant={currentNetwork.capiResponse.status === 200 ? "default" : "destructive"}
                        className="font-mono"
                      >
                        {currentNetwork.capiResponse.status}
                      </Badge>
                      <span className="text-xs font-mono text-[#8b949e]">
                        {currentNetwork.capiResponse.status === 200 ? 'Success' : 'Error'}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {currentNetwork.capiResponse.body?.data?.events_received !== undefined && (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[#00ff41]" />
                          <span className="text-sm font-mono text-[#e8f4f8]">
                            Events Received: <span className="text-[#00ff41]">{currentNetwork.capiResponse.body.data.events_received}</span>
                          </span>
                        </div>
                      )}

                      {currentNetwork.capiResponse.body?.data?.fbtrace_id && (
                        <div className="flex items-center gap-2">
                          <Code className="h-4 w-4 text-[#00d9ff]" />
                          <span className="text-xs font-mono text-[#8b949e]">
                            Trace ID: <code className="text-[#00d9ff]">{currentNetwork.capiResponse.body.data.fbtrace_id.substring(0, 16)}...</code>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="glass rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-mono text-[#8b949e]">Full Response:</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyPayload(currentNetwork.capiResponse?.body)}
                        className="h-6 gap-1"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <pre className="text-xs font-mono text-[#00ff41] overflow-x-auto max-h-64">
                      {JSON.stringify(currentNetwork.capiResponse.body, null, 2)}
                    </pre>
                  </div>

                  <div className="flex gap-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {currentNetwork.capiResponse.duration?.toFixed(0)}ms
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(currentNetwork.capiResponse)}
                      className="ml-auto h-6 text-xs font-mono"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy Full Log
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[#8b949e]">No response received yet</p>
              )}
            </TabsContent>

            <TabsContent value="dedup" className="mt-4">
              {currentNetwork?.pixelRequest && currentNetwork?.capiRequest ? (
                (() => {
                  const pixelParams = currentNetwork.pixelRequest?.params as any || {}
                  const pixelId = pixelParams.eventID || pixelParams.event_id
                  const capiBody = currentNetwork.capiRequest?.body as any || {}
                  const capiId = capiBody.event_id

                  const isMatch = pixelId && capiId && pixelId === capiId
                  const pixelName = pixelParams.eventName || pixelParams.event_name
                  const capiName = capiBody.event_name

                  return (
                    <div className="space-y-4">
                      {/* Status Banner */}
                      <div className={`glass rounded-lg p-4 border ${isMatch ? 'border-[#00ff41]/20 bg-[#00ff41]/5' : 'border-red-500/20 bg-red-500/5'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${isMatch ? 'bg-[#00ff41]/10 text-[#00ff41]' : 'bg-red-500/10 text-red-500'}`}>
                            {isMatch ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                          </div>
                          <div>
                            <h4 className={`font-mono font-bold ${isMatch ? 'text-[#00ff41]' : 'text-red-500'}`}>
                              {isMatch ? 'Deduplication Active' : 'Deduplication Failed'}
                            </h4>
                            <p className="text-xs text-[#8b949e]">
                              {isMatch
                                ? 'Event IDs match between Pixel and CAPI.'
                                : 'Pixel and CAPI Event IDs do not match.'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* ID Comparison */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="glass rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Globe className="h-4 w-4 text-[#00d9ff]" />
                            <span className="text-xs font-mono font-bold text-[#00d9ff]">Pixel Event ID</span>
                          </div>
                          <code className="block text-xs font-mono bg-[#0d1117] p-2 rounded text-[#e8f4f8] break-all">
                            {pixelId || 'Missing'}
                          </code>
                        </div>
                        <div className="glass rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Server className="h-4 w-4 text-[#00ff41]" />
                            <span className="text-xs font-mono font-bold text-[#00ff41]">CAPI Event ID</span>
                          </div>
                          <code className="block text-xs font-mono bg-[#0d1117] p-2 rounded text-[#e8f4f8] break-all">
                            {capiId || 'Missing'}
                          </code>
                        </div>
                      </div>

                      {/* Dedup Keys */}
                      <div className="glass rounded-lg p-4">
                        <h5 className="font-mono text-xs font-bold text-[#8b949e] mb-3 uppercase tracking-wider">
                          Deduplication Keys
                        </h5>
                        <div className="space-y-2">
                          {[
                            { label: 'Event ID', match: isMatch, value: pixelId },
                            { label: 'Event Name', match: capiName === pixelName, value: pixelName },
                            { label: 'FBP (Browser ID)', match: !!capiBody.user_data?.fbp, value: 'Advanced Match' },
                            { label: 'FBC (Click ID)', match: !!capiBody.user_data?.fbc, value: 'Advanced Match' },
                            { label: 'External ID', match: !!capiBody.user_data?.external_id, value: 'Advanced Match' }
                          ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between py-1 border-b border-[#00ff41]/10 last:border-0">
                              <span className="text-xs font-mono text-[#e8f4f8]">{item.label}</span>
                              <div className="flex items-center gap-2">
                                {item.match ? (
                                  <Badge variant="outline" className="text-[10px] border-[#00ff41]/30 text-[#00ff41]">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Matched
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-[10px] border-yellow-500/30 text-yellow-500">
                                    {item.label === 'Event Name' ? 'Mismatch' : 'Missing'}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })()
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="p-3 rounded-full bg-[#00ff41]/5 mb-3">
                    <Link2 className="h-6 w-6 text-[#00ff41]/50" />
                  </div>
                  <h4 className="font-mono text-sm font-bold text-[#e8f4f8] mb-1">
                    Waiting for Event Data
                  </h4>
                  <p className="text-xs text-[#8b949e] max-w-[250px]">
                    Send an event to both Pixel and CAPI to analyze deduplication status.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Event Logs */}
      {showLogs && logs.length > 0 && (
        <div className="glass-strong rounded-xl border border-[#00ff41]/20">
          <div className="flex items-center justify-between p-4 border-b border-[#00ff41]/20">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-[#00ff41]" />
              <h4 className="font-mono text-sm font-medium text-[#00ff41]">Event History</h4>
              <Badge variant="outline" className="font-mono text-xs">
                {logs.length}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearLogs}
              className="h-7 gap-1 font-mono text-xs"
            >
              <Trash2 className="h-3 w-3" />
              Clear
            </Button>
          </div>

          <ScrollArea className="h-96 p-4" ref={scrollAreaRef}>
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.internalId}
                  className={`glass rounded-lg p-4 border ${log.success
                    ? 'border-[#00ff41]/20'
                    : 'border-red-500/20'
                    }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {log.success ? (
                        <CheckCircle2 className="h-4 w-4 text-[#00ff41]" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-400" />
                      )}
                      <span className="font-mono text-sm font-semibold text-[#e8f4f8]">
                        {log.event}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#8b949e] font-mono">
                      <Clock className="h-3 w-3" />
                      {log.timestamp}
                    </div>
                  </div>

                  <div className="grid gap-2 md:grid-cols-2 mb-3">
                    {log.pixelSent && (
                      <div className="glass rounded p-2">
                        <div className="flex items-center gap-1 mb-1">
                          <Globe className="h-3 w-3 text-[#00d9ff]" />
                          <span className="text-xs font-mono text-[#00d9ff]">Pixel</span>
                          <Badge variant="outline" className="text-xs font-mono ml-auto">
                            {log.pixelTime?.toFixed(0)}ms
                          </Badge>
                        </div>
                      </div>
                    )}

                    {log.capiSent && (
                      <div className="glass rounded p-2">
                        <div className="flex items-center gap-1 mb-1">
                          <Server className="h-3 w-3 text-[#00ff41]" />
                          <span className="text-xs font-mono text-[#00ff41]">CAPI</span>
                          <Badge variant="outline" className="text-xs font-mono ml-auto">
                            {log.capiTime?.toFixed(0)}ms
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>

                  {showMetaResponse && log.capiResponse && (
                    <div className="glass rounded p-2 mb-2">
                      <p className="text-xs font-mono text-[#8b949e] mb-1">Meta Response:</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-mono">
                          Events: {log.capiResponse.data?.events_received || 0}
                        </Badge>
                        {log.matchQuality && (
                          <Badge variant="outline" className="text-xs font-mono">
                            Match: {log.matchQuality}/10
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <details className="group">
                    <summary className="cursor-pointer text-xs font-mono text-[#00d9ff] hover:text-[#00ff41] transition-colors">
                      View Request Payload ▼
                    </summary>
                    <div className="mt-2 relative">
                      <button
                        onClick={() => copyPayload(log.capiPayload)}
                        className="absolute top-2 right-2 p-1 rounded bg-[#0d1117] hover:bg-[#151b26] transition-colors z-10"
                      >
                        <Copy className="h-3 w-3 text-[#8b949e]" />
                      </button>
                      <pre className="text-xs font-mono text-[#00ff41] bg-[#0d1117] rounded p-3 pr-10 overflow-x-auto max-h-48">
                        {JSON.stringify(log.capiPayload, null, 2)}
                      </pre>
                    </div>
                  </details>

                  {/* New Response Details */}
                  {log.capiResponse && (
                    <details className="group mt-2">
                      <summary className="cursor-pointer text-xs font-mono text-[#00d9ff] hover:text-[#00ff41] transition-colors">
                        View Meta Response ▼
                      </summary>
                      <div className="mt-2 relative">
                        <button
                          onClick={() => copyPayload(log.capiResponse)}
                          className="absolute top-2 right-2 p-1 rounded bg-[#0d1117] hover:bg-[#151b26] transition-colors z-10"
                        >
                          <Copy className="h-3 w-3 text-[#8b949e]" />
                        </button>
                        <pre className="text-xs font-mono text-[#00ff41] bg-[#0d1117] rounded p-3 pr-10 overflow-x-auto max-h-48">
                          {JSON.stringify(log.capiResponse, null, 2)}
                        </pre>
                      </div>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

    </div>
  )
}
