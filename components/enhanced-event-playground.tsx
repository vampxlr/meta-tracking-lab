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
  AlertCircle,
  Activity,
  Code,
  Clock,
  Zap,
  ExternalLink,
  RefreshCw,
  Network,
  Server,
  Globe
} from "lucide-react"

interface LogEntry {
  id: string
  timestamp: string
  event: string
  mode: "Broken" | "Fixed"
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
  }
}

interface EventPlaygroundProps {
  title?: string
  description?: string
  events?: Array<{
    name: string
    icon?: React.ReactNode
    brokenPayload?: any
    fixedPayload?: any
    description?: string
  }>
  showModeToggle?: boolean
  showLogs?: boolean
  sendToMeta?: boolean
  sendToBoth?: boolean
  showNetworkInspector?: boolean
  showMetaResponse?: boolean
  enableComparison?: boolean
  testEventCode?: string
  pixelId?: string
}

export function EnhancedEventPlayground({
  title = "Interactive Event Playground",
  description = "Test different event scenarios and see real-time results from Meta",
  events = [],
  showModeToggle = true,
  showLogs = true,
  sendToMeta = true,
  sendToBoth = true,
  showNetworkInspector = true,
  showMetaResponse = true,
  enableComparison = false,
  testEventCode = "",
  pixelId,
}: EventPlaygroundProps) {
  const [mode, setMode] = React.useState<"Broken" | "Fixed">("Broken")
  const [logs, setLogs] = React.useState<LogEntry[]>([])
  const [currentNetwork, setCurrentNetwork] = React.useState<NetworkLog | null>(null)
  const [isSending, setIsSending] = React.useState(false)
  const [autoRefreshMeta, setAutoRefreshMeta] = React.useState(false)
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

  const sendToMetaPixel = async (eventName: string, payload: any, eventId: string) => {
    const startTime = performance.now()
    
    try {
      // Check if fbq is available
      if (typeof window !== 'undefined' && (window as any).fbq) {
        const customData = payload.custom_data || {}
        const userData = payload.user_data || {}
        
        // Send to Meta Pixel
        ;(window as any).fbq('track', eventName, customData, {
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
          mode: mode.toLowerCase(),
          test_event_code: testEventCode || undefined,
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

  const sendEvent = async (event: typeof events[0]) => {
    setIsSending(true)
    const timestamp = new Date().toLocaleTimeString()
    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const payload = mode === "Broken" ? event.brokenPayload : event.fixedPayload
    
    // Initialize network log
    const networkLog: NetworkLog = {}
    
    try {
      let pixelResult: any = null
      let capiResult: any = null
      
      // Send to Pixel if enabled
      if (sendToMeta && sendToBoth) {
        pixelResult = await sendToMetaPixel(event.name, payload, eventId)
        networkLog.pixelRequest = {
          url: pixelResult.url,
          params: pixelResult.params,
          timestamp: Date.now(),
          duration: pixelResult.duration
        }
      }
      
      // Send to CAPI if enabled
      if (sendToMeta && sendToBoth) {
        capiResult = await sendToCAPI(event.name, payload)
        networkLog.capiRequest = {
          url: capiResult.url,
          body: payload,
          timestamp: Date.now(),
          duration: capiResult.duration
        }
        networkLog.capiResponse = {
          status: capiResult.status,
          body: capiResult.body,
          timestamp: Date.now(),
          duration: capiResult.duration
        }
      }
      
      // Create log entry
      const newLog: LogEntry = {
        id: eventId,
        timestamp,
        event: event.name,
        mode,
        pixelPayload: payload,
        capiPayload: payload,
        pixelSent: !!pixelResult?.success,
        capiSent: !!capiResult?.success,
        pixelTime: pixelResult?.duration,
        capiTime: capiResult?.duration,
        capiResponse: capiResult?.body,
        success: mode === "Fixed" && capiResult?.success,
        matchQuality: capiResult?.body?.match_quality || (mode === "Fixed" ? 8.5 : 3.2)
      }
      
      setLogs(prev => [...prev, newLog])
      setCurrentNetwork(networkLog)
      
      // Show success/error toast
      if (capiResult?.success) {
        toast.success(`${event.name} Event Sent Successfully`, {
          description: `Sent to ${sendToBoth ? 'Pixel & CAPI' : 'CAPI only'} • ${Math.round(capiResult.duration)}ms`,
        })
      } else {
        toast.error(`${event.name} Event Failed`, {
          description: capiResult?.error || 'Unknown error',
        })
      }
      
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

  const copyPayload = (payload: any) => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2))
    toast.success('Payload copied to clipboard')
  }

  const openEventsManager = () => {
    const url = `https://business.facebook.com/events_manager2/list/pixel/${pixelId || 'YOUR_PIXEL_ID'}/test_events`
    window.open(url, '_blank')
  }

  return (
    <div className="space-y-6">
      
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
              <Badge variant="outline" className="font-mono text-xs">
                <Zap className="h-3 w-3 mr-1" />
                LIVE
              </Badge>
            )}
          </div>
          <p className="text-sm text-[#8b949e]">{description}</p>
        </div>

        {/* Mode Toggle & Meta Link */}
        <div className="grid gap-4 md:grid-cols-2">
          {showModeToggle && (
            <div className="glass rounded-lg p-4 border border-[#00ff41]/20">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-sm font-medium text-[#e8f4f8]">Event Mode</span>
                <Badge 
                  variant={mode === "Fixed" ? "default" : "destructive"}
                  className="font-mono"
                >
                  {mode}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={mode === "Broken" ? "destructive" : "outline"}
                  onClick={() => setMode("Broken")}
                  className="w-full font-mono text-xs"
                  size="sm"
                  disabled={isSending}
                >
                  Broken
                </Button>
                <Button
                  variant={mode === "Fixed" ? "default" : "outline"}
                  onClick={() => setMode("Fixed")}
                  className="w-full font-mono text-xs"
                  size="sm"
                  disabled={isSending}
                >
                  Fixed
                </Button>
              </div>
              <p className="text-xs text-[#8b949e] mt-2">
                {mode === "Broken" 
                  ? "Events sent with missing or incorrect data" 
                  : "Events sent with proper structure and required fields"}
              </p>
            </div>
          )}

          {/* Meta Events Manager Link */}
          {sendToMeta && pixelId && (
            <div className="glass rounded-lg p-4 border border-[#00d9ff]/20">
              <div className="flex items-center gap-2 mb-2">
                <ExternalLink className="h-4 w-4 text-[#00d9ff]" />
                <span className="font-mono text-sm font-medium text-[#00d9ff]">View in Meta</span>
              </div>
              <p className="text-xs text-[#8b949e] mb-3">
                Events appear within 5-10 seconds
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={openEventsManager}
                className="w-full font-mono text-xs"
              >
                <Globe className="h-3 w-3 mr-1" />
                Open Events Manager
              </Button>
            </div>
          )}
        </div>

        {/* Event Buttons */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-mono text-sm font-medium text-[#e8f4f8]">Test Events</h4>
            <Badge variant="outline" className="font-mono text-xs">
              {events.length} scenarios
            </Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {events.map((event, index) => (
              <button
                key={index}
                onClick={() => sendEvent(event)}
                disabled={isSending}
                className="glass hover-lift rounded-lg p-4 border border-[#00ff41]/20 text-left group transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                {!event.description && (
                  <p className="text-xs text-[#8b949e]">
                    Click to send {mode.toLowerCase()} event
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Network Inspector */}
      {showNetworkInspector && currentNetwork && (
        <div className="glass-strong rounded-xl border border-[#00d9ff]/20 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Network className="h-5 w-5 text-[#00d9ff]" />
            <h4 className="font-mono text-lg font-semibold text-[#00d9ff]">Network Inspector</h4>
          </div>
          
          <Tabs defaultValue="pixel" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
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
                Meta Response
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
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[#8b949e]">No response received yet</p>
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
                  key={log.id}
                  className={`glass rounded-lg p-4 border ${
                    log.success 
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
                      <Badge 
                        variant={log.mode === "Fixed" ? "default" : "destructive"}
                        className="font-mono text-xs"
                      >
                        {log.mode}
                      </Badge>
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
                      View Payload ▼
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
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

    </div>
  )
}
