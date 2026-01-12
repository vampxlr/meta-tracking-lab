"use client"

import * as React from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Eye, ShoppingCart, CreditCard, Clipboard, Trash2, Play } from "lucide-react"

interface LogEntry {
  timestamp: string
  event: string
  mode: "Broken" | "Fixed"
  payload: any
}

export function DemoPanel() {
  const [mode, setMode] = React.useState<"Broken" | "Fixed">("Broken")
  const [logs, setLogs] = React.useState<LogEntry[]>([])
  const [lastPayload, setLastPayload] = React.useState<any>(null)
  const scrollAreaRef = React.useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of logs
  React.useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollArea) {
        scrollArea.scrollTop = scrollArea.scrollHeight
      }
    }
  }, [logs])

  const getEventPayload = (eventName: string) => {
    const basePayload = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_source_url: typeof window !== "undefined" ? window.location.href : "http://localhost:3000",
      action_source: "website",
    }

    const eventSpecificPayload: Record<string, any> = {
      "ViewContent": {
        content_ids: ["product_123"],
        content_name: "Example Product",
        content_type: "product",
        value: 99.99,
        currency: "USD",
      },
      "AddToCart": {
        content_ids: ["product_123"],
        content_name: "Example Product",
        content_type: "product",
        value: 99.99,
        currency: "USD",
        num_items: 1,
      },
      "Purchase": {
        content_ids: ["product_123", "product_456"],
        content_name: "Multiple Products",
        content_type: "product",
        value: 199.99,
        currency: "USD",
        num_items: 2,
        order_id: `order_${Math.random().toString(36).substring(7)}`,
      },
    }

    return {
      ...basePayload,
      ...eventSpecificPayload[eventName],
      mode,
    }
  }

  const handleEvent = (eventName: string) => {
    const payload = getEventPayload(eventName)
    
    // Add to logs
    const newLog: LogEntry = {
      timestamp: new Date().toLocaleTimeString(),
      event: eventName,
      mode,
      payload,
    }
    setLogs((prev) => [...prev, newLog])
    setLastPayload(payload)

    // Show toast
    toast.success(eventName, {
      description: `Mode: ${mode}`,
    })
  }

  const clearLogs = () => {
    setLogs([])
    setLastPayload(null)
    toast.info("Logs cleared")
  }

  const copyPayload = () => {
    if (lastPayload) {
      navigator.clipboard.writeText(JSON.stringify(lastPayload, null, 2))
      toast.success("Payload copied to clipboard")
    }
  }

  const getEventIcon = (eventName: string) => {
    switch (eventName) {
      case "ViewContent":
        return <Eye className="h-4 w-4" />
      case "AddToCart":
        return <ShoppingCart className="h-4 w-4" />
      case "Purchase":
        return <CreditCard className="h-4 w-4" />
      default:
        return <Play className="h-4 w-4" />
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Event Playground</span>
          <Badge variant={mode === "Broken" ? "destructive" : "default"} className="text-xs">
            {mode}
          </Badge>
        </CardTitle>
        <CardDescription>
          Test Meta Pixel events with different configurations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="controls" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="controls">Controls</TabsTrigger>
            <TabsTrigger value="logs">Logs ({logs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="controls" className="space-y-4 mt-4">
            {/* Mode Selection */}
            <div className="rounded-lg border bg-muted/20 p-4">
              <p className="mb-3 text-sm font-medium text-foreground">Event Mode</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={mode === "Broken" ? "destructive" : "outline"}
                  onClick={() => setMode("Broken")}
                  className="w-full"
                >
                  Broken
                </Button>
                <Button
                  variant={mode === "Fixed" ? "default" : "outline"}
                  onClick={() => setMode("Fixed")}
                  className="w-full"
                >
                  Fixed
                </Button>
              </div>
            </div>

            {/* Event Buttons */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Trigger Events</p>
              <Button
                onClick={() => handleEvent("ViewContent")}
                className="w-full justify-start gap-2"
                variant="outline"
              >
                {getEventIcon("ViewContent")}
                <span>View Content</span>
              </Button>
              <Button
                onClick={() => handleEvent("AddToCart")}
                className="w-full justify-start gap-2"
                variant="outline"
              >
                {getEventIcon("AddToCart")}
                <span>Add to Cart</span>
              </Button>
              <Button
                onClick={() => handleEvent("Purchase")}
                className="w-full justify-start gap-2"
                variant="outline"
              >
                {getEventIcon("Purchase")}
                <span>Purchase</span>
              </Button>
            </div>

            {/* Last Payload */}
            {lastPayload && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">Last Payload</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={copyPayload}
                    className="h-7 gap-1.5 px-2 text-xs"
                  >
                    <Clipboard className="h-3.5 w-3.5" />
                    Copy
                  </Button>
                </div>
                <ScrollArea className="h-48 rounded-lg border bg-muted/20 p-3">
                  <pre className="text-xs font-mono text-muted-foreground">
                    {JSON.stringify(lastPayload, null, 2)}
                  </pre>
                </ScrollArea>
              </div>
            )}
          </TabsContent>

          <TabsContent value="logs" className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-foreground">Event History</p>
              {logs.length > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={clearLogs}
                  className="h-7 gap-1.5 px-2 text-xs text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear
                </Button>
              )}
            </div>

            {logs.length === 0 ? (
              <div className="flex h-48 items-center justify-center rounded-lg border bg-muted/20">
                <p className="text-sm text-muted-foreground">No events logged yet</p>
              </div>
            ) : (
              <ScrollArea className="h-80 rounded-lg border bg-muted/20 p-3" ref={scrollAreaRef}>
                <div className="space-y-2">
                  {logs.map((log, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getEventIcon(log.event)}
                          <span className="text-sm font-medium text-foreground">
                            {log.event}
                          </span>
                          <Badge
                            variant={log.mode === "Broken" ? "destructive" : "default"}
                            className="text-[10px] px-1.5 py-0"
                          >
                            {log.mode}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {log.timestamp}
                        </span>
                      </div>
                      <ScrollArea className="h-24 rounded-md border bg-background p-2">
                        <pre className="text-[10px] font-mono text-muted-foreground">
                          {JSON.stringify(log.payload, null, 2)}
                        </pre>
                      </ScrollArea>
                      {index < logs.length - 1 && <Separator className="my-2" />}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
