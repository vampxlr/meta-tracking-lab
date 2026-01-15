"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Target, 
  Server, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Play,
  ExternalLink,
  Zap,
  Loader2
} from "lucide-react"
import { SetupStatus } from "@/lib/setup-check"

interface SetupStatusPanelProps {
  initialStatus?: SetupStatus
}

export function SetupStatusPanel({ initialStatus }: SetupStatusPanelProps) {
  const router = useRouter()
  const [status, setStatus] = React.useState<SetupStatus | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  // Load status from API if not provided
  React.useEffect(() => {
    if (initialStatus) {
      setStatus(initialStatus)
      setIsLoading(false)
      return
    }

    // Fetch status from server API
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/setup-status')
        const data = await response.json()
        setStatus(data)
      } catch (error) {
        console.error('Failed to fetch setup status:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStatus()
  }, [initialStatus])

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Quick Start + Setup Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!status) {
    return null
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Quick Start + Setup Status</span>
          <Badge 
            variant={status.overall.isComplete ? "default" : "secondary"}
            className={status.overall.isComplete ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" : ""}
          >
            {status.overall.percentage}% Complete
          </Badge>
        </CardTitle>
        <CardDescription>
          {status.overall.isComplete 
            ? "Setup complete! Your tracking is ready to use."
            : "Complete the setup to start tracking events and improving your ad performance."
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Setup Status Cards */}
        <div className="space-y-3">
          {/* Pixel Status */}
          <div className="flex items-center justify-between rounded-lg border bg-background/50 p-3">
            <div className="flex items-center gap-3">
              {status.pixel.connected ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              <div>
                <p className="font-medium text-foreground">Meta Pixel</p>
                <p className="text-xs text-muted-foreground">
                  {status.pixel.pixelId || "Not configured"}
                </p>
              </div>
            </div>
            <Badge 
              variant={status.pixel.connected ? "default" : "destructive"}
              className={
                status.pixel.connected
                  ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                  : ""
              }
            >
              {status.pixel.connected ? "Connected" : "Not Connected"}
            </Badge>
          </div>

          {/* CAPI Status */}
          <div className="flex items-center justify-between rounded-lg border bg-background/50 p-3">
            <div className="flex items-center gap-3">
              {status.capi.configured ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              <div className="font-medium text-foreground">Conversions API</div>
            </div>
            <Badge 
              variant={status.capi.configured ? "default" : "destructive"}
              className={
                status.capi.configured
                  ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                  : ""
              }
            >
              {status.capi.configured ? "Configured" : "Not Configured"}
            </Badge>
          </div>

          {/* Test Events Status */}
          <div className="flex items-center justify-between rounded-lg border bg-background/50 p-3">
            <div className="flex items-center gap-3">
              {status.testEvents.verified ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              <div>
                <p className="font-medium text-foreground">Test Events</p>
                {status.testEvents.lastTestTime && (
                  <p className="text-xs text-muted-foreground">
                    Last test: {status.testEvents.lastTestTime}
                  </p>
                )}
              </div>
            </div>
            <Badge 
              variant={status.testEvents.verified ? "default" : "destructive"}
              className={
                status.testEvents.verified
                  ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                  : ""
              }
            >
              {status.testEvents.verified ? "Verified" : "Not Verified"}
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Setup Progress</span>
            <span className="font-medium text-foreground">{status.overall.percentage}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
              style={{ width: `${status.overall.percentage}%` }}
            />
          </div>
        </div>

        {/* Next Step Actions */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Next Steps</p>
          <div className="grid gap-2">
            <Button
              onClick={() => router.push('/getting-started/setup-checklist')}
              className="w-full justify-start gap-2"
              variant="outline"
            >
              <CheckCircle2 className="h-4 w-4" />
              Start Setup Checklist
              <ArrowRight className="ml-auto h-4 w-4" />
            </Button>

            <Button
              onClick={() => router.push('/connect')}
              className="w-full justify-start gap-2"
              variant="outline"
              disabled={!status.pixel.connected}
            >
              <Target className="h-4 w-4" />
              Run Connection Test
              <ArrowRight className="ml-auto h-4 w-4" />
            </Button>

            <Button
              onClick={() => router.push('/capi-test')}
              className="w-full justify-start gap-2"
              variant="outline"
              disabled={!status.capi.configured}
            >
              <Server className="h-4 w-4" />
              Run CAPI Test
              <ArrowRight className="ml-auto h-4 w-4" />
            </Button>

            <Button
              onClick={() => {
                const pixelId = status.pixel.pixelId
                const url = pixelId
                  ? `https://business.facebook.com/events_manager2/list/pixel/${pixelId}/test_events`
                  : "https://business.facebook.com/events_manager2"
                window.open(url, "_blank", "noopener,noreferrer")
              }}
              className="w-full justify-start gap-2"
              variant="outline"
            >
              <ExternalLink className="h-4 w-4" />
              Open Events Manager
              <ArrowRight className="ml-auto h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* What This Unlocks */}
        <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
          <div className="mb-3 flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Zap className="h-5 w-5" />
            <p className="font-semibold text-blue-900 dark:text-blue-100">What This Unlocks</p>
          </div>
          <p className="text-sm text-blue-900/80 dark:text-blue-100/80">
            Once connected, you can:
          </p>
          <ul className="mt-2 space-y-2 text-sm text-blue-900/80 dark:text-blue-100/80">
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
              <span>Practice event deduplication scenarios</span>
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
              <span>Improve match quality with hashed PII</span>
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
              <span>Test offline tracking scenarios</span>
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
              <span>Access interactive Event Playground</span>
            </li>
          </ul>
        </div>

        {/* Setup Complete Message */}
        {status.overall.isComplete && (
          <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <div>
                <p className="font-semibold text-green-900 dark:text-green-100">
                  Setup Complete!
                </p>
                <p className="text-sm text-green-900/80 dark:text-green-100/80">
                  Your tracking system is ready. Start using the Event Playground to practice 
                  and improve your implementation.
                </p>
              </div>
            </div>
            <Button
              onClick={() => router.push('/getting-started/demo-controls')}
              className="mt-3 w-full gap-2"
            >
              <Play className="h-4 w-4" />
              Open Event Playground
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
