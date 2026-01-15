"use client"

import { PageContent } from "@/components/page-content"
import { DemoPanel } from "@/components/demo-panel"

export default function MissingEventsPage() {
  return (
    <PageContent
      title="Missing Events"
      description="Diagnose why events aren&apos;t appearing in your Events Manager and learn how to fix common causes."
      status="Stable"
      rightPanel={<DemoPanel preset="missing" />}
    >
      
      {/* Common Causes */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4">
          <span className="inline-block animate-pulse">▸</span> Common Causes
        </h2>
        
        <div className="space-y-4">
          <p className="leading-relaxed text-[#8b949e] text-sm md:text-base">
            Events may be missing due to incorrect pixel placement, ad blockers, JavaScript errors, or network connectivity issues. Check that the pixel code is properly installed on all relevant pages.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="font-mono text-red-400 text-lg">✗</span>
                <span className="font-semibold text-red-400 font-mono">Common Issues</span>
              </div>
              <ul className="space-y-2 mt-3">
                <li className="flex items-start gap-3 text-[#8b949e] text-sm">
                  <span className="mt-1 text-red-400 font-mono shrink-0">›</span>
                  <span>Incorrect pixel placement</span>
                </li>
                <li className="flex items-start gap-3 text-[#8b949e] text-sm">
                  <span className="mt-1 text-red-400 font-mono shrink-0">›</span>
                  <span>Ad blockers preventing fires</span>
                </li>
                <li className="flex items-start gap-3 text-[#8b949e] text-sm">
                  <span className="mt-1 text-red-400 font-mono shrink-0">›</span>
                  <span>JavaScript errors on page</span>
                </li>
                <li className="flex items-start gap-3 text-[#8b949e] text-sm">
                  <span className="mt-1 text-red-400 font-mono shrink-0">›</span>
                  <span>Network connectivity issues</span>
                </li>
              </ul>
            </div>
            
            <div className="rounded-xl border border-[#00ff41]/20 bg-[#00ff41]/5 p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="font-mono text-[#00ff41] text-lg">✓</span>
                <span className="font-semibold text-[#00ff41] font-mono">Quick Checks</span>
              </div>
              <ul className="space-y-2 mt-3">
                <li className="flex items-start gap-3 text-[#8b949e] text-sm">
                  <span className="mt-1 text-[#00ff41] font-mono shrink-0">›</span>
                  <span>Verify pixel in &lt;head&gt; tag</span>
                </li>
                <li className="flex items-start gap-3 text-[#8b949e] text-sm">
                  <span className="mt-1 text-[#00ff41] font-mono shrink-0">›</span>
                  <span>Check browser console</span>
                </li>
                <li className="flex items-start gap-3 text-[#8b949e] text-sm">
                  <span className="mt-1 text-[#00ff41] font-mono shrink-0">›</span>
                  <span>Test with Pixel Helper</span>
                </li>
                <li className="flex items-start gap-3 text-[#8b949e] text-sm">
                  <span className="mt-1 text-[#00ff41] font-mono shrink-0">›</span>
                  <span>Review Network tab</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Debugging Steps */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4">
          <span className="inline-block animate-pulse">▸</span> Debugging Steps
        </h2>
        
        <div className="space-y-6">
          <div className="relative pl-8 border-l-2 border-[#00ff41]/30">
            <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-[#00ff41]"/>
            <h3 className="mb-3 font-mono text-lg font-semibold text-[#e8f4f8]">
              Step 1: Check Browser DevTools
            </h3>
            <p className="text-[#8b949e] text-sm md:text-base mb-3">
              Use browser developer tools to check for JavaScript errors. Open the Console tab and look for any error messages related to Meta Pixel or fbq().
            </p>
            <pre className="relative overflow-x-auto rounded-lg border border-[#00ff41]/20 bg-[#0d1117] p-3 font-mono text-xs">
              <code className="text-[#00ff41]">F12 → Console → Check for errors</code>
            </pre>
          </div>
          
          <div className="relative pl-8 border-l-2 border-[#00ff41]/30">
            <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-[#00ff41]"/>
            <h3 className="mb-3 font-mono text-lg font-semibold text-[#e8f4f8]">
              Step 2: Verify Network Requests
            </h3>
            <p className="text-[#8b949e] text-sm md:text-base mb-3">
              Verify that the pixel is firing using the Network tab. Look for requests to facebook.com/tr with your pixel ID.
            </p>
            <pre className="relative overflow-x-auto rounded-lg border border-[#00ff41]/20 bg-[#0d1117] p-3 font-mono text-xs">
              <code className="text-[#00ff41]">F12 → Network → Filter: "facebook.com/tr"</code>
            </pre>
          </div>
          
          <div className="relative pl-8 border-l-2 border-[#00ff41]/30">
            <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-[#00ff41]"/>
            <h3 className="mb-3 font-mono text-lg font-semibold text-[#e8f4f8]">
              Step 3: Use Meta Pixel Helper
            </h3>
            <p className="text-[#8b949e] text-sm md:text-base">
              Test with the Meta Pixel Helper extension to identify configuration issues. Install the browser extension and look for the green checkmark or error messages.
            </p>
          </div>
        </div>
      </section>

      {/* Prevention */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4">
          <span className="inline-block animate-pulse">▸</span> Prevention
        </h2>
        
        <div className="space-y-4">
          <p className="leading-relaxed text-[#8b949e] text-sm md:text-base">
            Implement error handling in your pixel implementation. Set up monitoring to alert you when event volumes drop unexpectedly. Regular testing helps catch issues early.
          </p>
          
          <div className="rounded-xl border border-[#00ff41]/20 bg-[#151b26] p-6">
            <h3 className="font-mono text-[#00ff41] font-semibold mb-4">Best Practices</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-[#8b949e] text-sm">
                <span className="mt-1 text-[#00ff41] font-mono shrink-0">›</span>
                <span>Implement try-catch blocks around pixel code</span>
              </li>
              <li className="flex items-start gap-3 text-[#8b949e] text-sm">
                <span className="mt-1 text-[#00ff41] font-mono shrink-0">›</span>
                <span>Set up monitoring for event volume drops</span>
              </li>
              <li className="flex items-start gap-3 text-[#8b949e] text-sm">
                <span className="mt-1 text-[#00ff41] font-mono shrink-0">›</span>
                <span>Test pixel on all major browsers</span>
              </li>
              <li className="flex items-start gap-3 text-[#8b949e] text-sm">
                <span className="mt-1 text-[#00ff41] font-mono shrink-0">›</span>
                <span>Use CAPI as backup for browser-side events</span>
              </li>
            </ul>
          </div>
          
          <div className="rounded-lg border border-[#00d9ff]/30 bg-[#00d9ff]/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-[#00d9ff] text-lg">💡</span>
              <span className="font-semibold text-[#00d9ff] font-mono">Pro Tip</span>
            </div>
            <p className="text-sm text-[#8b949e]">
              Implement Conversions API alongside Meta Pixel to ensure events are captured even when browser-side tracking fails. This provides redundancy and improves overall tracking reliability.
            </p>
          </div>
        </div>
      </section>

    </PageContent>
  )
}
