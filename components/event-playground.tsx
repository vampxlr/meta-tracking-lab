"use client"

import * as React from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Play, 
  Trash2, 
  Copy,
  CheckCircle2,
  AlertCircle,
  Activity,
  Code,
  Clock,
  Zap
} from "lucide-react"

interface LogEntry {
  timestamp: string
  event: string
  mode: "Broken" | "Fixed"
  payload: any
  success?: boolean
}

interface EventPlaygroundProps {
  title?: string
  description?: string
  events?: Array<{
    name: string
    icon?: React.ReactNode
    brokenPayload?: any
    fixedPayload?: any
  }>
  showModeToggle?: boolean
  showLogs?: boolean
  customContent?: React.ReactNode
}

export function EventPlayground({
  title = "Interactive Event Playground",
  description = "Test different event scenarios and see how they're tracked",
  events = [
    { 
      name: "ViewContent",
      brokenPayload: { event_name: "ViewContent", missing: "user_data" },
      fixedPayload: { event_name: "ViewContent", user_data: { em: "hashed@example.com" }, event_id: "123" }
    },
    { 
      name: "AddToCart",
      brokenPayload: { event_name: "AddToCart" },
      fixedPayload: { event_name: "AddToCart", custom_data: { currency: "USD", value: 29.99 }, event_id: "456" }
    },
    { 
      name: "Purchase",
      brokenPayload: { event_name: "Purchase", value: "invalid" },
      fixedPayload: { event_name: "Purchase", custom_data: { currency: "USD", value: 99.99 }, event_id: "789" }
    },
  ],
  showModeToggle = true,
  showLogs = true,
  customContent,
}: EventPlaygroundProps) {
  const [mode, setMode] = React.useState<"Broken" | "Fixed">("Broken")
  const [logs, setLogs] = React.useState<LogEntry[]>([])
  const [lastPayload, setLastPayload] = React.useState<any>(null)
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

  const sendEvent = async (eventName: string, payload: any) => {
    const timestamp = new Date().toLocaleTimeString()
    
    // Simulate event sending (in real implementation, this would call fbq() or CAPI)
    try {
      // Log the event
      const newLog: LogEntry = {
        timestamp,
        event: eventName,
        mode,
        payload,
        success: mode === "Fixed"
      }
      
      setLogs(prev => [...prev, newLog])
      setLastPayload(payload)
      
      // Simulate success/failure based on mode
      if (mode === "Fixed") {
        toast.success(`${eventName} Event Sent`, {
          description: "Event successfully tracked with proper data",
        })
      } else {
        toast.error(`${eventName} Event Issues`, {
          description: "Event sent but missing critical data",
        })
      }
      
      // In real implementation, this would call:
      // if (typeof window !== 'undefined' && window.fbq) {
      //   window.fbq('track', eventName, payload)
      // }
      
    } catch (error) {
      toast.error('Failed to send event', {
        description: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  const handleEventClick = (event: typeof events[0]) => {
    const payload = mode === "Broken" ? event.brokenPayload : event.fixedPayload
    sendEvent(event.name, payload)
  }

  const clearLogs = () => {
    setLogs([])
    setLastPayload(null)
    toast.info('Logs cleared')
  }

  const copyPayload = (payload: any) => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2))
    toast.success('Payload copied to clipboard')
  }

  return (
    <div className="glass-strong hover-border-glow rounded-xl border border-[#00ff41]/20 p-6 space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-[#00ff41]/10 border border-[#00ff41]/30 pulse-glow">
            <Activity className="h-5 w-5 text-[#00ff41]" />
          </div>
          <h3 className="font-mono text-lg font-bold text-[#e8f4f8] text-glow-hover">{title}</h3>
        </div>
        <p className="text-sm text-[#8b949e]">{description}</p>
      </div>

      {/* Mode Toggle */}
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
            >
              Broken
            </Button>
            <Button
              variant={mode === "Fixed" ? "default" : "outline"}
              onClick={() => setMode("Fixed")}
              className="w-full font-mono text-xs"
              size="sm"
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

      {/* Custom Content Area */}
      {customContent && (
        <div className="glass rounded-lg p-4 border border-[#00d9ff]/20">
          {customContent}
        </div>
      )}

      {/* Event Buttons */}
      <div>
        <h4 className="font-mono text-sm font-medium text-[#e8f4f8] mb-3">Test Events</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {events.map((event, index) => (
            <button
              key={index}
              onClick={() => handleEventClick(event)}
              className="glass hover-lift rounded-lg p-4 border border-[#00ff41]/20 text-left group transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                {event.icon || <Zap className="h-4 w-4 text-[#00ff41] icon-spin-hover" />}
                <span className="font-mono text-sm font-semibold text-[#e8f4f8]">
                  {event.name}
                </span>
              </div>
              <p className="text-xs text-[#8b949e]">
                Click to send {mode.toLowerCase()} event
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Event Logs */}
      {showLogs && logs.length > 0 && (
        <div className="glass rounded-lg border border-[#00d9ff]/20">
          <div className="flex items-center justify-between p-4 border-b border-[#00d9ff]/20">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-[#00d9ff]" />
              <h4 className="font-mono text-sm font-medium text-[#00d9ff]">Event Logs</h4>
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
          
          <ScrollArea className="h-64 p-4" ref={scrollAreaRef}>
            <div className="space-y-3">
              {logs.map((log, index) => (
                <div 
                  key={index}
                  className={`glass rounded-lg p-3 border ${
                    log.success 
                      ? 'border-[#00ff41]/20' 
                      : 'border-red-500/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
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
                  
                  <div className="relative">
                    <button
                      onClick={() => copyPayload(log.payload)}
                      className="absolute top-1 right-1 p-1 rounded bg-[#0d1117] hover:bg-[#151b26] transition-colors"
                    >
                      <Copy className="h-3 w-3 text-[#8b949e]" />
                    </button>
                    <pre className="text-xs font-mono text-[#00ff41] bg-[#0d1117] rounded p-2 pr-8 overflow-x-auto">
                      {JSON.stringify(log.payload, null, 2)}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Last Payload Preview */}
      {lastPayload && !showLogs && (
        <div className="glass rounded-lg p-4 border border-[#00d9ff]/20">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-mono text-sm font-medium text-[#00d9ff]">Last Payload</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyPayload(lastPayload)}
              className="h-7 gap-1 font-mono text-xs"
            >
              <Copy className="h-3 w-3" />
              Copy
            </Button>
          </div>
          <pre className="text-xs font-mono text-[#00ff41] bg-[#0d1117] rounded p-3 overflow-x-auto">
            {JSON.stringify(lastPayload, null, 2)}
          </pre>
        </div>
      )}

    </div>
  )
}
