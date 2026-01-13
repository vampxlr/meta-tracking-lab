"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ExternalLink, AlertCircle, CheckCircle2, Send } from "lucide-react"
import { toast } from "sonner"

// TypeScript declaration for Facebook Pixel
declare global {
  interface Window {
    fbq?: (
      action: string,
      eventName: string,
      parameters?: Record<string, any>
    ) => void
  }
}

export default function ConnectionTestPage() {
  const [isPixelLoaded, setIsPixelLoaded] = React.useState(false)
  const [pixelId, setPixelId] = React.useState<string | null>(null)
  const [lastTestTime, setLastTestTime] = React.useState<string | null>(null)

  React.useEffect(() => {
    // Check if Meta Pixel is loaded
    const checkPixel = () => {
      const loaded = typeof window.fbq === "function"
      setIsPixelLoaded(loaded)
    }

    // Get Pixel ID from environment
    const id = process.env.NEXT_PUBLIC_FB_PIXEL_ID
    setPixelId(id || null)

    // Check immediately and after a short delay to allow pixel to load
    checkPixel()
    const timer = setTimeout(checkPixel, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleSendTestEvent = () => {
    if (!isPixelLoaded || typeof window.fbq !== "function") {
      toast.error("Pixel not detected", {
        description: "Meta Pixel is not loaded on this page. Check your configuration.",
      })
      return
    }

    try {
      const timestamp = Math.floor(Date.now() / 1000)
      window.fbq("trackCustom", "MTL_ConnectionTest", {
        source: "meta-tracking-lab",
        ts: timestamp,
      })

      const timeString = new Date().toLocaleTimeString()
      setLastTestTime(timeString)

      toast.success("Test event sent successfully", {
        description: "Check Events Manager → Test Events for MTL_ConnectionTest.",
      })
    } catch (error) {
      toast.error("Failed to send test event", {
        description: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  const handleOpenEventsManager = () => {
    const url = pixelId
      ? `https://business.facebook.com/events_manager2/list/pixel/${pixelId}/test_events`
      : "https://business.facebook.com/events_manager2"
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Connection Test</h1>
        <p className="mt-2 text-muted-foreground">
          Verify your Meta Pixel connection and send test events
        </p>
      </div>

      <div className="space-y-6">
        {/* Status Section */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Connection Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isPixelLoaded ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="font-medium">Meta Pixel</span>
              </div>
              <Badge
                variant={isPixelLoaded ? "default" : "destructive"}
                className={
                  isPixelLoaded
                    ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                    : ""
                }
              >
                {isPixelLoaded ? "Connected" : "Not Detected"}
              </Badge>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pixel ID</span>
              <code className="rounded bg-muted px-2 py-1 text-sm">
                {pixelId || "Not configured"}
              </code>
            </div>

            {!pixelId && (
              <div className="rounded-lg bg-yellow-500/10 p-3 text-sm text-yellow-600 dark:text-yellow-500">
                <p className="font-medium">Configuration required</p>
                <p className="mt-1 text-xs">
                  Set NEXT_PUBLIC_FB_PIXEL_ID in your .env.local file
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Actions Section */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Test Actions</h2>
          <div className="space-y-4">
            <div>
              <Button
                onClick={handleSendTestEvent}
                disabled={!isPixelLoaded}
                className="w-full gap-2 sm:w-auto"
              >
                <Send className="h-4 w-4" />
                Send Test Event
              </Button>
              {lastTestTime && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Last sent: {lastTestTime}
                </p>
              )}
            </div>

            <Separator />

            <div>
              <Button
                onClick={handleOpenEventsManager}
                variant="outline"
                className="w-full gap-2 sm:w-auto"
              >
                <ExternalLink className="h-4 w-4" />
                Open Events Manager
              </Button>
            </div>
          </div>
        </Card>

        {/* Instructions Section */}
        <Card className="border-blue-500/20 bg-blue-500/5 p-6">
          <h2 className="mb-3 text-lg font-semibold">How to Verify</h2>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="font-semibold text-foreground">1.</span>
              <span>
                Open Meta Events Manager and navigate to your Pixel
              </span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-foreground">2.</span>
              <span>
                Click on <strong>Test Events</strong> tab
              </span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-foreground">3.</span>
              <span>Keep that browser tab open</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-foreground">4.</span>
              <span>
                Click <strong>Send Test Event</strong> button above
              </span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-foreground">5.</span>
              <span>
                Watch for <code className="rounded bg-muted px-1.5 py-0.5">MTL_ConnectionTest</code>{" "}
                event to appear in Events Manager
              </span>
            </li>
          </ol>
          <div className="mt-4 rounded-lg border border-blue-500/20 bg-background/50 p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Note:</p>
            <p className="mt-1">
              Test events typically appear within 1-2 seconds. If you don&apos;t see
              the event, check your browser console for errors and verify your
              Pixel ID is correct.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
