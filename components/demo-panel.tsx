"use client"

import * as React from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Eye, ShoppingCart, CreditCard, Clipboard, Trash2, Play, Calculator, DollarSign, TrendingUp, AlertCircle, Info } from "lucide-react"

interface LogEntry {
  timestamp: string
  event: string
  mode: "Broken" | "Fixed"
  payload: any
}

interface ROIInputs {
  monthlyAdSpend: number
  avgOrderValue: number
  currentCoverage: number
  targetCoverage: number
  currentROAS: number
}

interface ROIResults {
  currentRevenue: number
  lostConversions: number
  lostRevenue: number
  recoveredRevenue: number
  optimizationSavings: number
  totalImpact: number
  yearlyImpact: number
}

interface DemoPanelProps {
  preset?: string
}

export function DemoPanel({ preset }: DemoPanelProps = {}) {
  const [mode, setMode] = React.useState<"Broken" | "Fixed">("Broken")
  const [logs, setLogs] = React.useState<LogEntry[]>([])
  const [lastPayload, setLastPayload] = React.useState<any>(null)
  const scrollAreaRef = React.useRef<HTMLDivElement>(null)

  // ROI Calculator State
  const [roiInputs, setRoiInputs] = React.useState<ROIInputs>({
    monthlyAdSpend: 10000,
    avgOrderValue: 100,
    currentCoverage: 60,
    targetCoverage: 95,
    currentROAS: 2.0,
  })

  // Calculate ROI results
  const calculateROI = (): ROIResults => {
    const { monthlyAdSpend, avgOrderValue, currentCoverage, targetCoverage, currentROAS } = roiInputs
    
    // Current revenue based on ROAS
    const currentRevenue = monthlyAdSpend * currentROAS
    
    // Total potential conversions (assuming all tracked events)
    const totalPotentialConversions = currentRevenue / avgOrderValue
    
    // Lost conversions due to poor tracking
    const lostConversions = totalPotentialConversions * ((100 - currentCoverage) / 100)
    
    // Revenue lost
    const lostRevenue = lostConversions * avgOrderValue
    
    // Revenue recovered by improving coverage
    const coverageImprovement = targetCoverage - currentCoverage
    const recoverablePortion = coverageImprovement / (100 - currentCoverage)
    const recoveredRevenue = lostRevenue * recoverablePortion
    
    // Optimization savings (assuming better ROAS from better data)
    const improvedROAS = currentROAS * 1.3 // 30% improvement assumption
    const optimizationSavings = (improvedROAS - currentROAS) * monthlyAdSpend
    
    // Total monthly impact
    const totalImpact = recoveredRevenue + optimizationSavings
    
    // Yearly projection
    const yearlyImpact = totalImpact * 12

    return {
      currentRevenue,
      lostConversions,
      lostRevenue,
      recoveredRevenue,
      optimizationSavings,
      totalImpact,
      yearlyImpact,
    }
  }

  const roiResults = calculateROI()

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const handlePreset = (preset: 'small' | 'medium' | 'large') => {
    const presets = {
      small: {
        monthlyAdSpend: 1000,
        avgOrderValue: 50,
        currentCoverage: 50,
        targetCoverage: 90,
        currentROAS: 1.5,
      },
      medium: {
        monthlyAdSpend: 10000,
        avgOrderValue: 100,
        currentCoverage: 60,
        targetCoverage: 95,
        currentROAS: 2.0,
      },
      large: {
        monthlyAdSpend: 100000,
        avgOrderValue: 500,
        currentCoverage: 65,
        targetCoverage: 95,
        currentROAS: 2.5,
      },
    }
    setRoiInputs(presets[preset])
    toast.success('Preset applied', {
      description: `${preset.charAt(0).toUpperCase() + preset.slice(1)} business scenario loaded`,
    })
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="controls">Controls</TabsTrigger>
            <TabsTrigger value="logs">Logs ({logs.length})</TabsTrigger>
            <TabsTrigger value="roi">ROI Calculator</TabsTrigger>
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

          <TabsContent value="roi" className="space-y-4 mt-4">
            {/* Presets */}
            <div className="rounded-lg border bg-muted/20 p-4">
              <p className="mb-3 text-sm font-medium text-foreground">Quick Scenarios</p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreset('small')}
                  className="w-full"
                >
                  Small ($1K/mo)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreset('medium')}
                  className="w-full"
                >
                  Medium ($10K/mo)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreset('large')}
                  className="w-full"
                >
                  Large ($100K/mo)
                </Button>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Monthly Ad Spend</label>
                  <span className="text-xs text-muted-foreground">{formatCurrency(roiInputs.monthlyAdSpend)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200000"
                  step="1000"
                  value={roiInputs.monthlyAdSpend}
                  onChange={(e) => setRoiInputs({ ...roiInputs, monthlyAdSpend: Number(e.target.value) })}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Average Order Value</label>
                  <span className="text-xs text-muted-foreground">{formatCurrency(roiInputs.avgOrderValue)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="10"
                  value={roiInputs.avgOrderValue}
                  onChange={(e) => setRoiInputs({ ...roiInputs, avgOrderValue: Number(e.target.value) })}
                  className="w-full accent-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">Current Coverage</label>
                    <span className="text-xs text-muted-foreground">{roiInputs.currentCoverage}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    step="5"
                    value={roiInputs.currentCoverage}
                    onChange={(e) => setRoiInputs({ ...roiInputs, currentCoverage: Number(e.target.value) })}
                    className="w-full accent-destructive"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">Target Coverage</label>
                    <span className="text-xs text-muted-foreground">{roiInputs.targetCoverage}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="99"
                    step="1"
                    value={roiInputs.targetCoverage}
                    onChange={(e) => setRoiInputs({ ...roiInputs, targetCoverage: Number(e.target.value) })}
                    className="w-full accent-primary"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Current ROAS</label>
                  <span className="text-xs text-muted-foreground">{roiInputs.currentROAS}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.1"
                  value={roiInputs.currentROAS}
                  onChange={(e) => setRoiInputs({ ...roiInputs, currentROAS: Number(e.target.value) })}
                  className="w-full accent-primary"
                />
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4 rounded-lg border bg-gradient-to-br from-blue-500/5 to-purple-500/5 p-4">
              <div className="mb-4 flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-foreground">Estimated Impact</h3>
              </div>

              {/* Coverage Improvement */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Event Coverage</span>
                  <span className="font-medium text-foreground">
                    {roiInputs.currentCoverage}% → {roiInputs.targetCoverage}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-destructive to-primary transition-all"
                    style={{ width: `${roiInputs.targetCoverage}%` }}
                  />
                </div>
              </div>

              {/* Revenue Recovery */}
              <div className="space-y-3">
                <div className="rounded-lg border bg-background/50 p-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <DollarSign className="h-4 w-4 text-red-500" />
                    <span>Revenue Currently Lost</span>
                  </div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(roiResults.lostRevenue)}/mo
                  </div>
                </div>

                <div className="rounded-lg border bg-background/50 p-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span>Revenue Recovered</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(roiResults.recoveredRevenue)}/mo
                  </div>
                </div>

                <div className="rounded-lg border bg-background/50 p-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <DollarSign className="h-4 w-4 text-blue-500" />
                    <span>Optimization Savings</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(roiResults.optimizationSavings)}/mo
                  </div>
                </div>

                {/* Total Impact */}
                <div className="rounded-lg border-2 border-primary bg-primary/5 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-primary mb-2">
                    <Calculator className="h-5 w-5" />
                    <span>Total Monthly Impact</span>
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    {formatCurrency(roiResults.totalImpact)}/mo
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Yearly projection: <span className="font-semibold text-foreground">{formatCurrency(roiResults.yearlyImpact)}/yr</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Educational Note */}
            <div className="flex gap-2 rounded-lg border bg-yellow-500/5 p-3">
              <Info className="mt-0.5 h-4 w-4 text-yellow-600 shrink-0" />
              <div className="text-sm text-muted-foreground">
                <strong className="text-foreground">Why this matters:</strong> Proper tracking ensures Meta can optimize your 
                ads effectively, recover lost conversions, and maximize your return on ad spend.
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
