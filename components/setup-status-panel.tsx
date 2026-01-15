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
  const [hasPixelId, setHasPixelId] = React.useState(false)
  const [capiConfigured, setCapiConfigured] = React.useState(false)
  const [pixelLoaded, setPixelLoaded] = React.useState(false)
  const [pixelTestVerified, setPixelTestVerified] = React.useState(false)
  const [capiTestVerified, setCapiTestVerified] = React.useState(false)

  // Check environment on mount
  React.useEffect(() => {
    const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID
    setHasPixelId(!!pixelId)
    
    // We can't reliably check CAPI config from client-side, 
    // so we'll assume it's not configured initially
    setCapiConfigured(false)
    setIsLoading(false)
  }, [])

  // Check if pixel is loaded in browser (poll every 500ms for up to 10 seconds)
  React.useEffect(() => {
    if (!hasPixelId) {
      setPixelLoaded(false)
      return
    }

    let attempts = 0
    const maxAttempts = 20 // 10 seconds worth of checking

    const checkPixel = () => {
      attempts++
      if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        setPixelLoaded(true)
        return
      }

      if (attempts < maxAttempts) {
        setTimeout(checkPixel, 500)
      }
    }

    checkPixel()
  }, [hasPixelId])

  // Poll for test events in localStorage (pixel test)
  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const checkTestEvents = () => {
      const lastTestTime = localStorage.getItem('last_pixel_test_time')
      const verified = !!lastTestTime

      setPixelTestVerified(verified)
    }

    // Check immediately and then every second
    checkTestEvents()
    const interval = setInterval(checkTestEvents, 1000)

    return () => clearInterval(interval)
  }, [])

  // Poll for test events in localStorage (CAPI test)
  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const checkTestEvents = () => {
      const lastTestTime = localStorage.getItem('last_capi_test_time')
      const verified = !!lastTestTime

      setCapiTestVerified(verified)
    }

    // Check immediately and then every second
    checkTestEvents()
    const interval = setInterval(checkTestEvents, 1000)

    return () => clearInterval(interval)
  }, [])

  // Calculate completion percentage helper
  const calculatePercentage = React.useCallback((pixelConnected: boolean, capiConfigured: boolean, pixelTest: boolean, capiTest: boolean): number => {
    const checks = [pixelConnected, capiConfigured, pixelTest || capiTest].filter(Boolean).length
    return Math.round((checks / 3) * 100)
  }, [])

  // Get next step helper
  const getNextStep = React.useCallback((pixelConnected: boolean, capiConfigured: boolean, pixelTest: boolean, capiTest: boolean): string => {
    if (!hasPixelId) return 'Add Pixel ID to environment'
    if (!pixelConnected) return 'Wait for Pixel to load'
    if (!capiConfigured) return 'Configure CAPI'
    if (!(pixelTest || capiTest)) return 'Run Test Events'
    return 'Start using Event Playground'
  }, [hasPixelId])

  // Build current status
  React.useEffect(() => {
    if (isLoading) return

    setStatus({
      pixel: {
        connected: pixelLoaded,
        pixelId: process.env.NEXT_PUBLIC_FB_PIXEL_ID || null
      },
      capi: {
        configured: capiConfigured
      },
      testEvents: {
        verified: pixelTestVerified || capiTestVerified,
        lastTestTime: null // Will be set by individual checks
      },
      overall: {
        isComplete: pixelLoaded && capiConfigured && (pixelTestVerified || capiTestVerified),
        percentage: calculatePercentage(pixelLoaded, capiConfigured, pixelTestVerified, capiTestVerified),
        nextStep: getNextStep(pixelLoaded, capiConfigured, pixelTestVerified, capiTestVerified)
      }
    })
  }, [pixelLoaded, capiConfigured, pixelTestVerified, capiTestVerified, isLoading, calculatePercentage, getNextStep])

  // Load status from API if not provided (for CAPI status)
  React.useEffect(() => {
    if (initialStatus) {
      setStatus(initialStatus)
      setIsLoading(false)
      return
    }

    // Fetch CAPI status from server API (we can check this from client)
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/setup-status')
        const data = await response.json()
        
        // Update CAPI status while preserving client-side pixel detection
        setCapiConfigured(data.capi?.configured || false)
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
    <Card className="glass-strong border-[#00ff41]/20 hover-border-glow shadow-lg max-h-[85vh] overflow-y-auto scrollbar-thin">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 font-mono text-[#00ff41]">
          <Zap className="h-5 w-5 animate-pulse" />
          <span className="text-shimmer">Setup Status</span>
        </CardTitle>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-[#8b949e]">
            {status.overall.percentage}% Complete
          </span>
          <div className="h-1.5 w-24 rounded-full bg-[#0d1117] overflow-hidden border border-[#00ff41]/20">
            <div
              className="h-full bg-gradient-to-r from-[#00ff41] to-[#00d9ff] transition-all duration-500"
              style={{ width: `${status.overall.percentage}%` }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Compact Status Cards */}
        <div className="space-y-2">
          {/* Pixel Status */}
          <div className="flex items-center justify-between glass rounded-lg border border-[#00ff41]/10 p-2.5 hover-glow">
            <div className="flex items-center gap-2">
              {status.pixel.connected ? (
                <CheckCircle2 className="h-4 w-4 text-[#00ff41]" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-400" />
              )}
              <span className="text-sm font-mono text-[#e8f4f8]">Pixel</span>
            </div>
            <span className={`text-xs font-mono ${status.pixel.connected ? 'text-[#00ff41]' : 'text-red-400'}`}>
              {status.pixel.connected ? "●  LIVE" : "○ OFFLINE"}
            </span>
          </div>

          {/* CAPI Status */}
          <div className="flex items-center justify-between glass rounded-lg border border-[#00ff41]/10 p-2.5 hover-glow">
            <div className="flex items-center gap-2">
              {status.capi.configured ? (
                <CheckCircle2 className="h-4 w-4 text-[#00ff41]" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-400" />
              )}
              <span className="text-sm font-mono text-[#e8f4f8]">CAPI</span>
            </div>
            <span className={`text-xs font-mono ${status.capi.configured ? 'text-[#00ff41]' : 'text-red-400'}`}>
              {status.capi.configured ? "●  READY" : "○ NOT SET"}
            </span>
          </div>

          {/* Test Status */}
          <div className="flex items-center justify-between glass rounded-lg border border-[#00ff41]/10 p-2.5 hover-glow">
            <div className="flex items-center gap-2">
              {status.testEvents.verified ? (
                <CheckCircle2 className="h-4 w-4 text-[#00ff41]" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-400" />
              )}
              <span className="text-sm font-mono text-[#e8f4f8]">Tests</span>
            </div>
            <span className={`text-xs font-mono ${status.testEvents.verified ? 'text-[#00ff41]' : 'text-red-400'}`}>
              {status.testEvents.verified ? "●  VERIFIED" : "○ PENDING"}
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2 pt-2">
          <p className="text-xs font-mono text-[#8b949e] uppercase tracking-wider">Quick Actions</p>
          <div className="grid gap-2">
            <Button
              onClick={() => router.push('/getting-started/setup-checklist')}
              className="w-full justify-between button-neon-sm h-9 text-sm"
              variant="outline"
            >
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Setup Guide
              </span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>

            <Button
              onClick={() => router.push('/capi-test')}
              className="w-full justify-between glass border-[#00d9ff]/30 hover-glow h-9 text-sm"
              variant="outline"
              disabled={!status.capi.configured}
            >
              <span className="flex items-center gap-2 text-[#00d9ff]">
                <Server className="h-3.5 w-3.5" />
                Test CAPI
              </span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Setup Complete */}
        {status.overall.isComplete && (
          <div className="rounded-lg border border-[#00ff41]/30 bg-[#00ff41]/5 p-3 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#00ff41] shrink-0 mt-0.5" />
              <div>
                <p className="font-mono text-sm font-semibold text-[#00ff41] mb-1">
                  Ready to Track!
                </p>
                <p className="text-xs text-[#8b949e] mb-2">
                  All systems operational. Start testing with Event Playground.
                </p>
                <Button
                  onClick={() => router.push('/getting-started/demo-controls')}
                  size="sm"
                  className="w-full gap-2 button-neon-sm h-8"
                >
                  <Play className="h-3.5 w-3.5" />
                  <span className="text-xs">Launch Playground</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Next Step Hint */}
        {!status.overall.isComplete && (
          <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3">
            <p className="text-xs font-mono text-yellow-400 flex items-center gap-2">
              <span className="animate-pulse">→</span>
              Next: {status.overall.nextStep}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
