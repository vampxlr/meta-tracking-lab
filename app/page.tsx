"use client"

import { PageContent } from "@/components/page-content"
import { SetupStatusPanel } from "@/components/setup-status-panel"
import { LockedEventPlayground } from "@/components/locked-event-playground"
import { 
  Target, 
  Server, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  BookOpen,
  Code,
  Play,
  Calculator,
  TrendingUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function OverviewPage() {
  return (
    <PageContent
      title="Meta Offline Tracking Guide"
      description="Master Meta Pixel & Conversions API (CAPI) to build accurate, privacy-compliant tracking systems for maximum ad optimization and ROI."
      status="Stable"
      rightPanel={<SetupStatusPanel />}
    >
      {/* Hero Section */}
      <div className="mb-8 space-y-6">
        <div className="rounded-2xl border bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-8">
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            Why Accurate Tracking Matters
          </h2>
          <p className="mb-4 text-lg text-muted-foreground">
            In today&apos;s privacy-first world, traditional browser-based tracking is becoming unreliable. 
            Safari&apos;s ITP, Firefox&apos;s ETP, and other browser restrictions are blocking up to 
            <span className="font-semibold text-foreground"> 40-50% of events</span>, causing:
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border bg-background/50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="font-semibold text-foreground">Inaccurate Attribution</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Can&apos;t tell which ads are actually driving conversions, leading to wasted ad spend
              </p>
            </div>
            <div className="rounded-lg border bg-background/50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="font-semibold text-foreground">Poor Optimization</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Meta&apos;s AI can&apos;t optimize campaigns without accurate conversion data
              </p>
            </div>
          </div>
        </div>

        {/* The Solution */}
        <div className="rounded-2xl border bg-green-500/10 p-8">
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            The Solution: Server-Side Tracking
          </h2>
          <p className="mb-6 text-lg text-muted-foreground">
            By implementing both Meta Pixel (client-side) and Conversions API (server-side), 
            you can recover lost events and build a robust tracking system that&apos;s 
            future-proof against privacy restrictions.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border bg-background/50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="font-semibold text-foreground">95%+ Event Capture</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Recover lost events from browser restrictions
              </p>
            </div>
            <div className="rounded-lg border bg-background/50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="font-semibold text-foreground">Accurate Attribution</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Know exactly which ads drive conversions
              </p>
            </div>
            <div className="rounded-lg border bg-background/50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="font-semibold text-foreground">Better ROAS</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Optimize campaigns with complete data
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Concepts */}
      <div className="mb-8 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Core Concepts You&apos;ll Master</h2>
        
        {/* Meta Pixel */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-blue-500/10 border-b">
            <div className="flex items-center gap-3">
              <Target className="h-6 w-6 text-blue-500" />
              <CardTitle>1. Meta Pixel (Client-Side Tracking)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <CardDescription className="mb-4 text-base">
              A JavaScript code snippet placed on your website that tracks user actions and sends them directly to Meta servers.
            </CardDescription>
            
            <h4 className="mb-2 font-semibold text-foreground">How It Works:</h4>
            <ul className="mb-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                <span>User visits your website → Pixel fires → Event sent to Meta</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                <span>Tracks events like PageView, AddToCart, Purchase, etc.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                <span>Works great when users accept cookies and don&apos;t use ad blockers</span>
              </li>
            </ul>

            <h4 className="mb-2 font-semibold text-foreground">Limitations:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 text-red-500 shrink-0" />
                <span>Browser restrictions (ITP, ETP) block cookies</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 text-red-500 shrink-0" />
                <span>Ad blockers can completely block the pixel</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 text-red-500 shrink-0" />
                <span>Cookies have limited lifespan (7 days to 1 year)</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Conversions API */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-purple-500/10 border-b">
            <div className="flex items-center gap-3">
              <Server className="h-6 w-6 text-purple-500" />
              <CardTitle>2. Conversions API - CAPI (Server-Side Tracking)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <CardDescription className="mb-4 text-base">
              A server-side API that sends events directly from your backend to Meta servers, independent of the user&apos;s browser.
            </CardDescription>
            
            <h4 className="mb-2 font-semibold text-foreground">How It Works:</h4>
            <ul className="mb-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" />
                <span>User takes action → Your server records it → API sends event to Meta</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" />
                <span>Works regardless of browser restrictions or ad blockers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" />
                <span>Can track offline events (in-store purchases, call centers, etc.)</span>
              </li>
            </ul>

            <h4 className="mb-2 font-semibold text-foreground">Advantages:</h4>
            <ul className="mb-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500 shrink-0" />
                <span>Bypasses browser restrictions and ad blockers</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500 shrink-0" />
                <span>More reliable and consistent event delivery</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500 shrink-0" />
                <span>Can send hashed PII for better matching and privacy</span>
              </li>
            </ul>

            <h4 className="mb-2 font-semibold text-foreground">Best Practice:</h4>
            <p className="text-sm text-muted-foreground">
              Use both Pixel and CAPI together for <span className="font-semibold text-foreground">maximum coverage</span>. 
              When both track the same event with matching data, Meta deduplicates them, ensuring accurate attribution.
            </p>
          </CardContent>
        </Card>

        {/* Offline Tracking */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-orange-500/10 border-b">
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-orange-500" />
              <CardTitle>3. Offline Tracking</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <CardDescription className="mb-4 text-base">
              Tracking conversions that happen outside your website, connecting them back to your ad campaigns for complete attribution.
            </CardDescription>
            
            <h4 className="mb-2 font-semibold text-foreground">Use Cases:</h4>
            <ul className="mb-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                <span><strong className="text-foreground">Retail:</strong> In-store purchases linked to online ads</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                <span><strong className="text-foreground">Services:</strong> Phone orders, email conversions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                <span><strong className="text-foreground">Lead Gen:</strong> Offline consultations, appointments booked</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                <span><strong className="text-foreground">B2B:</strong> CRM systems, deal closures</span>
              </li>
            </ul>

            <h4 className="mb-2 font-semibold text-foreground">How It Works:</h4>
            <p className="mb-4 text-sm text-muted-foreground">
              Collect customer information (hashed for privacy) during offline transactions, 
              send it via CAPI, and Meta matches it to ad interactions using:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                <span>Email, phone, name (normalized and hashed)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                <span>IP address and user agent from first touchpoint</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                <span>Click ID or external identifiers</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Attribution */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-green-500/10 border-b">
            <div className="flex items-center gap-3">
              <Target className="h-6 w-6 text-green-500" />
              <CardTitle>4. Attribution & Optimization</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <CardDescription className="mb-4 text-base">
              Understanding which touchpoints lead to conversions and using that data to optimize your ad spend for maximum ROI.
            </CardDescription>
            
            <h4 className="mb-2 font-semibold text-foreground">Attribution Models:</h4>
            <ul className="mb-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                <span><strong className="text-foreground">Last Click:</strong> Credits the last ad interaction</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                <span><strong className="text-foreground">First Click:</strong> Credits the first ad interaction</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                <span><strong className="text-foreground">Multi-touch:</strong> Distributes credit across touchpoints</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                <span><strong className="text-foreground">Data-Driven:</strong> AI determines credit based on patterns</span>
              </li>
            </ul>

            <h4 className="mb-2 font-semibold text-foreground">Optimization Benefits:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500 shrink-0" />
                <span>Target high-value audiences that convert</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500 shrink-0" />
                <span>Optimize bids for conversion events</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500 shrink-0" />
                <span>Scale winning campaigns, cut losers</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500 shrink-0" />
                <span>Achieve 2-5x better ROAS with accurate data</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* What You'll Learn Section */}
      <div className="mb-8 rounded-2xl border bg-card p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-foreground">What You&apos;ll Learn in This Guide</h2>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex gap-3">
            <Code className="mt-1 h-5 w-5 text-blue-500 shrink-0" />
            <div>
              <h4 className="mb-1 font-semibold text-foreground">Hands-on Implementation</h4>
              <p className="text-sm text-muted-foreground">
                Step-by-step guides for implementing Pixel and CAPI in real applications
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Play className="mt-1 h-5 w-5 text-green-500 shrink-0" />
            <div>
              <h4 className="mb-1 font-semibold text-foreground">Interactive Practice</h4>
              <p className="text-sm text-muted-foreground">
                Live demos to test different configurations and see results in real-time
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Target className="mt-1 h-5 w-5 text-purple-500 shrink-0" />
            <div>
              <h4 className="mb-1 font-semibold text-foreground">Best Practices</h4>
              <p className="text-sm text-muted-foreground">
                Industry-standard patterns for privacy compliance and data security
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Zap className="mt-1 h-5 w-5 text-orange-500 shrink-0" />
            <div>
              <h4 className="mb-1 font-semibold text-foreground">Debugging & Troubleshooting</h4>
              <p className="text-sm text-muted-foreground">
                Common issues and how to resolve them effectively
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="rounded-2xl border bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-8">
        <h2 className="mb-4 text-2xl font-bold text-foreground">Ready to Start?</h2>
        <p className="mb-6 text-lg text-muted-foreground">
          This is an open-source project designed for learning and practice. Connect your own 
          Meta Pixel and CAPI to experiment with real tracking data.
        </p>
        
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" className="gap-2">
            <BookOpen className="h-5 w-5" />
            Start Learning
            <ArrowRight className="h-4 w-4" />
          </Button>
          
          <Button size="lg" variant="outline" className="gap-2">
            <Code className="h-5 w-5" />
            View on GitHub
          </Button>
        </div>
        
        <p className="mt-4 text-sm text-muted-foreground">
          🎓 <strong>Note:</strong> This guide is designed for developers, marketers, and business owners 
          who want to build a solid foundation in Meta tracking concepts.
        </p>
      </div>

      {/* ROI Calculator Teaser */}
      <div className="mb-8 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">
        <div className="flex items-start gap-4">
          <div className="hidden h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 sm:flex">
            <TrendingUp className="h-6 w-6 text-blue-500" />
          </div>
          <div className="flex-1">
            <h3 className="mb-2 text-xl font-bold text-foreground">
              Estimate Your ROI Impact
            </h3>
            <p className="mb-4 text-muted-foreground">
              Calculate how much revenue you can recover by improving your Meta tracking implementation. 
              Get personalized estimates based on your ad spend, order value, and current coverage.
            </p>
            <Button
              onClick={() => window.location.pathname = '/roi-calculator'}
              className="gap-2"
              size="lg"
            >
              <Calculator className="h-4 w-4" />
              Open ROI Calculator
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Notes & References */}
      <div className="mt-8 rounded-2xl border bg-muted/20 p-6">
        <h3 className="mb-3 font-semibold text-foreground">Resources & References</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <ArrowRight className="mt-1 h-4 w-4 shrink-0" />
            <a 
              href="https://www.facebook.com/business/help/952192354843755" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Meta Pixel Documentation
            </a>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="mt-1 h-4 w-4 shrink-0" />
            <a 
              href="https://developers.facebook.com/docs/marketing-api/conversions-api/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Conversions API Documentation
            </a>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="mt-1 h-4 w-4 shrink-0" />
            <a 
              href="https://www.facebook.com/business/help/330551581004658" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Offline Conversions Documentation
            </a>
          </li>
        </ul>
      </div>
    </PageContent>
  )
}
