"use client"

import { PageContent } from "@/components/page-content"
import { SetupStatusPanel } from "@/components/setup-status-panel"
import { 
  Target, 
  Server, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Code,
  Activity,
  Shield,
  Sparkles
} from "lucide-react"
import Link from "next/link"

export default function OverviewPage() {
  return (
    <PageContent
      title="Meta Tracking Lab"
      description="Master Meta Pixel & Conversions API (CAPI) to build accurate, privacy-compliant tracking systems for maximum ad optimization and ROI."
      status="Stable"
      rightPanel={<SetupStatusPanel />}
    >
      
      {/* Hero Section with Animated Border */}
      <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="border-gradient">
          <div className="border-gradient-content glass-strong p-8 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-[#00ff41]/10 border border-[#00ff41]/30 pulse-glow">
                <Activity className="h-6 w-6 text-[#00ff41]" />
              </div>
              <h2 className="font-mono text-2xl md:text-3xl font-bold text-shimmer">
                Why Accurate Tracking Matters
              </h2>
            </div>
            
            <p className="mb-6 text-base md:text-lg text-[#8b949e] leading-relaxed">
              In today&apos;s privacy-first world, traditional browser-based tracking is becoming unreliable. 
              Safari&apos;s ITP, Firefox&apos;s ETP, and other browser restrictions are blocking up to 
              <span className="font-semibold text-[#ff006e] text-glow-hover"> 40-50% of events</span>, causing:
            </p>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="glass hover-glow rounded-xl p-5 border border-red-500/20 group">
                <div className="mb-3 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                    <AlertCircle className="h-5 w-5 text-red-400 icon-spin-hover" />
                  </div>
                  <span className="font-mono font-semibold text-red-400">Inaccurate Attribution</span>
                </div>
                <p className="text-sm text-[#8b949e]">
                  Can&apos;t tell which ads are actually driving conversions, leading to wasted ad spend
                </p>
              </div>
              
              <div className="glass hover-glow rounded-xl p-5 border border-red-500/20 group">
                <div className="mb-3 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                    <AlertCircle className="h-5 w-5 text-red-400 icon-spin-hover" />
                  </div>
                  <span className="font-mono font-semibold text-red-400">Poor Optimization</span>
                </div>
                <p className="text-sm text-[#8b949e]">
                  Meta&apos;s AI can&apos;t optimize campaigns without accurate conversion data
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The Solution */}
      <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        <div className="glass-strong rounded-2xl p-8 md:p-10 border border-[#00ff41]/20 hover-border-glow">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-[#00ff41]/10 border border-[#00ff41]/30 pulse-glow">
              <Shield className="h-6 w-6 text-[#00ff41]" />
            </div>
            <h2 className="font-mono text-2xl md:text-3xl font-bold text-[#00ff41]">
              The Solution: Server-Side Tracking
            </h2>
          </div>
          
          <p className="mb-6 text-base md:text-lg text-[#8b949e] leading-relaxed">
            By implementing both Meta Pixel (client-side) and Conversions API (server-side), 
            you can recover lost events and build a robust tracking system that&apos;s 
            future-proof against privacy restrictions.
          </p>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div className="glass hover-lift rounded-xl p-5 border border-[#00ff41]/20 group">
              <div className="mb-3 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#00ff41]/10 group-hover:bg-[#00ff41]/20 transition-colors">
                  <CheckCircle2 className="h-5 w-5 text-[#00ff41] icon-spin-hover" />
                </div>
                <span className="font-mono font-semibold text-[#00ff41]">95%+ Capture</span>
              </div>
              <p className="text-sm text-[#8b949e]">
                Recover lost events from browser restrictions
              </p>
            </div>
            
            <div className="glass hover-lift rounded-xl p-5 border border-[#00ff41]/20 group">
              <div className="mb-3 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#00ff41]/10 group-hover:bg-[#00ff41]/20 transition-colors">
                  <CheckCircle2 className="h-5 w-5 text-[#00ff41] icon-spin-hover" />
                </div>
                <span className="font-mono font-semibold text-[#00ff41]">Accurate Data</span>
              </div>
              <p className="text-sm text-[#8b949e]">
                Know exactly which ads drive conversions
              </p>
            </div>
            
            <div className="glass hover-lift rounded-xl p-5 border border-[#00ff41]/20 group">
              <div className="mb-3 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#00ff41]/10 group-hover:bg-[#00ff41]/20 transition-colors">
                  <CheckCircle2 className="h-5 w-5 text-[#00ff41] icon-spin-hover" />
                </div>
                <span className="font-mono font-semibold text-[#00ff41]">Better ROAS</span>
              </div>
              <p className="text-sm text-[#8b949e]">
                Optimize campaigns with complete data
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Concepts */}
      <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-1 w-12 bg-gradient-to-r from-[#00ff41] to-[#00d9ff] rounded-full"></div>
          <h2 className="font-mono text-2xl md:text-3xl font-bold text-[#e8f4f8]">
            Core Concepts
          </h2>
          <div className="h-1 flex-1 bg-gradient-to-r from-[#00d9ff] to-transparent rounded-full"></div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Meta Pixel */}
          <div className="border-animated glass-strong rounded-2xl p-6 hover-glow group">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#00d9ff]/20 to-[#00ff41]/20 border border-[#00d9ff]/30 group-hover:scale-110 transition-transform">
                <Target className="h-6 w-6 text-[#00d9ff]" />
              </div>
              <div>
                <h3 className="font-mono text-lg md:text-xl font-bold text-[#00d9ff] mb-2">
                  Meta Pixel
                </h3>
                <span className="text-xs font-mono text-[#8b949e] bg-[#0d1117] px-2 py-1 rounded">
                  CLIENT-SIDE
                </span>
              </div>
            </div>
            
            <p className="text-sm text-[#8b949e] mb-4 leading-relaxed">
              JavaScript code snippet that tracks user actions directly from the browser and sends them to Meta servers.
            </p>
            
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-[#00ff41] font-mono mt-0.5">›</span>
                <span className="text-sm text-[#8b949e]">Fires when users visit your website</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#00ff41] font-mono mt-0.5">›</span>
                <span className="text-sm text-[#8b949e]">Tracks PageView, AddToCart, Purchase</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-400 font-mono mt-0.5">⚠</span>
                <span className="text-sm text-[#8b949e]">Blocked by ad blockers & ITP</span>
              </div>
            </div>
          </div>

          {/* Conversions API */}
          <div className="border-animated glass-strong rounded-2xl p-6 hover-glow group">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#ff006e]/20 to-[#00d9ff]/20 border border-[#ff006e]/30 group-hover:scale-110 transition-transform">
                <Server className="h-6 w-6 text-[#ff006e]" />
              </div>
              <div>
                <h3 className="font-mono text-lg md:text-xl font-bold text-[#ff006e] mb-2">
                  Conversions API
                </h3>
                <span className="text-xs font-mono text-[#8b949e] bg-[#0d1117] px-2 py-1 rounded">
                  SERVER-SIDE
                </span>
              </div>
            </div>
            
            <p className="text-sm text-[#8b949e] mb-4 leading-relaxed">
              Server-side API that sends events directly from your backend to Meta, independent of browser restrictions.
            </p>
            
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-[#00ff41] font-mono mt-0.5">✓</span>
                <span className="text-sm text-[#8b949e]">Bypasses ad blockers completely</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#00ff41] font-mono mt-0.5">✓</span>
                <span className="text-sm text-[#8b949e]">Reliable & consistent delivery</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#00ff41] font-mono mt-0.5">✓</span>
                <span className="text-sm text-[#8b949e]">Tracks offline events too</span>
              </div>
            </div>
          </div>

          {/* Offline Tracking */}
          <div className="border-animated glass-strong rounded-2xl p-6 hover-glow group">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#00ff41]/20 to-[#ff006e]/20 border border-[#00ff41]/30 group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6 text-[#00ff41]" />
              </div>
              <div>
                <h3 className="font-mono text-lg md:text-xl font-bold text-[#00ff41] mb-2">
                  Offline Tracking
                </h3>
                <span className="text-xs font-mono text-[#8b949e] bg-[#0d1117] px-2 py-1 rounded">
                  ATTRIBUTION
                </span>
              </div>
            </div>
            
            <p className="text-sm text-[#8b949e] mb-4 leading-relaxed">
              Track conversions outside your website and connect them back to ad campaigns for complete attribution.
            </p>
            
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-[#00ff41] font-mono mt-0.5">›</span>
                <span className="text-sm text-[#8b949e]">In-store purchases</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#00ff41] font-mono mt-0.5">›</span>
                <span className="text-sm text-[#8b949e]">Phone orders & email conversions</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#00ff41] font-mono mt-0.5">›</span>
                <span className="text-sm text-[#8b949e]">CRM integrations</span>
              </div>
            </div>
          </div>

          {/* Optimization */}
          <div className="border-animated glass-strong rounded-2xl p-6 hover-glow group">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#ff006e]/20 to-[#00ff41]/20 border border-[#00d9ff]/30 group-hover:scale-110 transition-transform">
                <Activity className="h-6 w-6 text-[#00d9ff]" />
              </div>
              <div>
                <h3 className="font-mono text-lg md:text-xl font-bold text-[#00d9ff] mb-2">
                  AI Optimization
                </h3>
                <span className="text-xs font-mono text-[#8b949e] bg-[#0d1117] px-2 py-1 rounded">
                  PERFORMANCE
                </span>
              </div>
            </div>
            
            <p className="text-sm text-[#8b949e] mb-4 leading-relaxed">
              Meta&apos;s AI uses complete tracking data to optimize campaigns and maximize return on ad spend.
            </p>
            
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-[#00ff41] font-mono mt-0.5">›</span>
                <span className="text-sm text-[#8b949e]">Target high-value audiences</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#00ff41] font-mono mt-0.5">›</span>
                <span className="text-sm text-[#8b949e]">Optimize bids automatically</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#00ff41] font-mono mt-0.5">›</span>
                <span className="text-sm text-[#8b949e]">2-5x better ROAS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
        <div className="glass-strong rounded-2xl p-8 md:p-10 border border-[#00ff41]/20">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="h-6 w-6 text-[#00ff41] animate-pulse" />
            <h2 className="font-mono text-2xl md:text-3xl font-bold text-[#e8f4f8]">
              Ready to Start?
            </h2>
          </div>
          
          <p className="mb-8 text-base text-[#8b949e]">
            This is an open-source project designed for learning and practice. Connect your own 
            Meta Pixel and CAPI to experiment with real tracking data.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/getting-started/setup-checklist">
              <div className="button-neon rounded-xl px-6 py-4 flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <Code className="h-5 w-5" />
                  <span className="font-mono text-sm md:text-base">Get Started</span>
                </div>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            
            <a href="https://github.com/vampxlr/meta-tracking-lab" target="_blank" rel="noopener noreferrer">
              <div className="glass hover-glow rounded-xl px-6 py-4 flex items-center justify-between border border-[#00d9ff]/30 group cursor-pointer">
                <div className="flex items-center gap-3">
                  <Server className="h-5 w-5 text-[#00d9ff]" />
                  <span className="font-mono text-sm md:text-base text-[#00d9ff]">View on GitHub</span>
                </div>
                <ArrowRight className="h-5 w-5 text-[#00d9ff] group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          </div>
          
          <div className="mt-6 p-4 rounded-lg bg-[#00d9ff]/5 border border-[#00d9ff]/20">
            <p className="text-sm text-[#8b949e]">
              <span className="text-[#00d9ff] font-mono">💡 Note:</span> This guide is designed for developers, marketers, and business owners 
              who want to build a solid foundation in Meta tracking concepts.
            </p>
          </div>
        </div>
      </div>

    </PageContent>
  )
}
