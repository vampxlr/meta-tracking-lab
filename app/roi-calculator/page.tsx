"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  ArrowRight,
  Info,
  CheckCircle2
} from "lucide-react"
import { PageShell } from "@/components/page-shell"

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

export default function ROICalculatorPage() {
  const [roiInputs, setRoiInputs] = React.useState<ROIInputs>({
    monthlyAdSpend: 10000,
    avgOrderValue: 100,
    currentCoverage: 60,
    targetCoverage: 95,
    currentROAS: 2.0,
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

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
  }

  const roiResults = calculateROI()

  return (
    <PageShell
      title="ROI Calculator"
      description="Estimate the impact of improved Meta tracking on your ad performance and revenue."
      status="Stable"
    >
      {/* Intro */}
      <div className="mb-8 rounded-2xl border bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-8">
        <h2 className="mb-4 text-2xl font-bold text-foreground">
          Why Tracking Improvements Boost ROI
        </h2>
        <p className="mb-4 text-lg text-muted-foreground">
          Accurate Meta Pixel and Conversions API tracking recovers lost events, 
          improves match quality, and enables better optimization. This calculator estimates 
          the potential impact on your business.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-background/50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <span className="font-semibold text-foreground">Recover Lost Revenue</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Capture 95%+ of events instead of 40-60% by adding CAPI
            </p>
          </div>
          <div className="rounded-lg border bg-background/50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <span className="font-semibold text-foreground">Improve Optimization</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Better data means Meta can optimize your ads for higher ROAS
            </p>
          </div>
        </div>
      </div>

      {/* Calculator */}
      <div className="mb-8 grid gap-8 lg:grid-cols-3">
        {/* Inputs Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Your Inputs
              </CardTitle>
              <CardDescription>
                Adjust values based on your business metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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

              <Separator />

              {/* Input Fields */}
              <div className="space-y-5">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">Monthly Ad Spend</label>
                    <span className="text-xs font-semibold text-primary">{formatCurrency(roiInputs.monthlyAdSpend)}</span>
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
                    <span className="text-xs font-semibold text-primary">{formatCurrency(roiInputs.avgOrderValue)}</span>
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
                      <span className="text-xs font-semibold text-destructive">{roiInputs.currentCoverage}%</span>
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
                      <span className="text-xs font-semibold text-primary">{roiInputs.targetCoverage}%</span>
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
                    <span className="text-xs font-semibold text-primary">{roiInputs.currentROAS}x</span>
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
            </CardContent>
          </Card>
        </div>

        {/* Results Cards */}
        <div className="lg:col-span-2">
          <Card className="h-full bg-gradient-to-br from-blue-500/5 to-purple-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Estimated Impact
              </CardTitle>
              <CardDescription>
                Based on your inputs and industry best practices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Coverage Improvement */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Event Coverage</span>
                  <span className="font-semibold text-foreground">
                    {roiInputs.currentCoverage}% → {roiInputs.targetCoverage}%
                  </span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-destructive to-primary transition-all duration-300"
                    style={{ width: `${roiInputs.targetCoverage}%` }}
                  />
                </div>
              </div>

              <Separator />

              {/* Key Metrics */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* Lost Revenue */}
                <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4 text-red-500" />
                    <span>Revenue Currently Lost</span>
                  </div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(roiResults.lostRevenue)}/mo
                  </div>
                  <p className="mt-1 text-xs text-red-700/80 dark:text-red-300/80">
                    {Math.round(roiResults.lostConversions)} lost conversions/month
                  </p>
                </div>

                {/* Recovered Revenue */}
                <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span>Revenue Recovered</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(roiResults.recoveredRevenue)}/mo
                  </div>
                  <p className="mt-1 text-xs text-green-700/80 dark:text-green-300/80">
                    By improving tracking coverage
                  </p>
                </div>

                {/* Optimization Savings */}
                <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Calculator className="h-4 w-4 text-blue-500" />
                    <span>Optimization Savings</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(roiResults.optimizationSavings)}/mo
                  </div>
                  <p className="mt-1 text-xs text-blue-700/80 dark:text-blue-300/80">
                    From better ROAS with accurate data
                  </p>
                </div>

                {/* Total Impact - Hero Metric */}
                <div className="rounded-lg border-2 border-primary bg-primary/10 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
                    <Calculator className="h-5 w-5" />
                    <span>Total Monthly Impact</span>
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    {formatCurrency(roiResults.totalImpact)}/mo
                  </div>
                  <p className="mt-2 text-sm text-foreground/80">
                    Yearly projection: <span className="font-semibold text-primary">{formatCurrency(roiResults.yearlyImpact)}/yr</span>
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-6 w-6 text-primary shrink-0" />
                  <div className="flex-1">
                    <p className="mb-2 font-semibold text-foreground">
                      Ready to improve your tracking?
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Follow our setup checklist to implement Meta Pixel and Conversions API, 
                      then use the Event Playground to practice and test your implementation.
                    </p>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button
                        onClick={() => window.location.pathname = '/getting-started/setup-checklist'}
                        className="gap-2"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Start Setup Checklist
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => window.location.pathname = '/getting-started/demo-controls'}
                        className="gap-2"
                      >
                        <Calculator className="h-4 w-4" />
                        Open Event Playground
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Educational Note */}
      <div className="rounded-2xl border bg-yellow-500/10 p-6">
        <div className="mb-4 flex items-center gap-3">
          <Info className="h-6 w-6 text-yellow-600" />
          <h3 className="text-xl font-bold text-foreground">Understanding These Estimates</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Revenue Recovery</h4>
            <p className="text-sm text-muted-foreground">
              Based on the assumption that improving tracking coverage from {roiInputs.currentCoverage}% to {roiInputs.targetCoverage}% 
              recovers lost conversions. Actual results may vary based on your audience, product, and industry.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Optimization Savings</h4>
            <p className="text-sm text-muted-foreground">
              Assumes a 30% ROAS improvement from better data quality and optimization. 
              This is a conservative estimate; actual improvements can be significantly higher.
            </p>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-2xl border bg-muted/20 p-6">
        <h3 className="mb-4 font-semibold text-foreground">Key Takeaways</h3>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500 shrink-0" />
            <span>
              <strong className="text-foreground">Browser restrictions block 40-50% of events</strong> - Safari ITP, Firefox ETP, and ad blockers prevent many events from being tracked
            </span>
          </li>
          <li className="flex gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500 shrink-0" />
            <span>
              <strong className="text-foreground">CAPI recovers most lost events</strong> - Server-side tracking bypasses browser restrictions and ad blockers
            </span>
          </li>
          <li className="flex gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500 shrink-0" />
            <span>
              <strong className="text-foreground">Better data = better optimization</strong> - Meta's AI optimization requires accurate conversion data to perform well
            </span>
          </li>
          <li className="flex gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500 shrink-0" />
            <span>
              <strong className="text-foreground">Deduplication is critical</strong> - Using event IDs prevents double-counting and ensures accurate attribution
            </span>
          </li>
        </ul>
      </div>
    </PageShell>
  )
}
