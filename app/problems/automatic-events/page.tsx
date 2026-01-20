"use client"

import { PageContent } from "@/components/page-content"
import { AlertTriangle, CheckCircle, Zap, MousePointer, Settings, Eye } from "lucide-react"

export default function AutomaticEventsPage() {
    return (
        <PageContent
            title="Automatic Events (SubscribedButtonClick)"
            description="Understand why you see 'SubscribedButtonClick' events, how Meta's Automatic Configuration works, and how to control it."
            status="Stable"
        >

            {/* What are Automatic Events */}
            <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
                    <span className="inline-block animate-pulse">▸</span> What are Automatic Events?
                </h2>

                <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6">
                    <div className="flex items-start gap-4 mb-4">
                        <Zap className="h-6 w-6 text-yellow-400 mt-1" />
                        <div>
                            <h3 className="font-mono text-lg font-semibold text-[#e8f4f8] mb-2">
                                "SubscribedButtonClick" & "Microdata"
                            </h3>
                            <p className="text-sm text-[#8b949e] leading-relaxed">
                                When you install the Meta Pixel, it enables a feature called <strong>Automatic Configuration (`autoConfig`)</strong> by default.
                                This feature automatically detects valuable actions on your website—like clicking buttons, submitting forms,
                                or navigating between pages—and logs them as events even if you didn't write code for them.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        <div className="glass rounded-lg border border-[#00ff41]/20 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <MousePointer className="h-4 w-4 text-[#00ff41]" />
                                <span className="font-mono text-sm font-semibold text-[#00ff41]">What it Tracks</span>
                            </div>
                            <ul className="text-xs text-[#8b949e] space-y-1 ml-6 list-disc">
                                <li>Button Clicks (`SubscribedButtonClick`)</li>
                                <li>Form Submissions</li>
                                <li>Page Metadata (Microdata)</li>
                                <li>Contextual interactions</li>
                            </ul>
                        </div>

                        <div className="glass rounded-lg border border-yellow-500/20 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                                <span className="font-mono text-sm font-semibold text-yellow-400">Common Confusion</span>
                            </div>
                            <p className="text-xs text-[#8b949e]">
                                These events often clutter debug logs and confuse developers. You might see a "Purchase" event followed by a
                                "SubscribedButtonClick" and think you have a duplicate. <strong>You usually don&apos;t!</strong> They are separate events.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How to Control It */}
            <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
                    <span className="inline-block animate-pulse">▸</span> How to Turn It Off (or On)
                </h2>

                <div className="space-y-6">
                    <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Settings className="h-5 w-5 text-[#00ff41]" />
                            <h3 className="font-mono text-lg font-semibold text-[#e8f4f8]">The Log Cleaner Fix</h3>
                        </div>
                        <p className="text-sm text-[#8b949e] mb-4">
                            To stop these events from cluttering your logs (especially during development vs. production), you can disable `autoConfig`
                            before initializing the pixel.
                        </p>

                        <div className="relative overflow-hidden rounded-lg border border-[#00ff41]/20 bg-[#0d1117]">
                            <div className="flex items-center justify-between border-b border-[#00ff41]/10 bg-[#00ff41]/5 px-4 py-2">
                                <span className="text-xs font-mono text-[#8b949e]">facebook-pixel.js</span>
                                <span className="text-xs font-mono text-[#00ff41]">Recommended Fix</span>
                            </div>
                            <pre className="overflow-x-auto p-4 font-mono text-xs">
                                <code className="text-[#e8f4f8]">
                                    {`// 1. Set autoConfig to FALSE *before* init
fbq('set', 'autoConfig', false, 'YOUR_PIXEL_ID');

// 2. Initialize Pixel
fbq('init', 'YOUR_PIXEL_ID');

// 3. Track PageView
fbq('track', 'PageView');`}
                                </code>
                            </pre>
                        </div>
                    </div>

                    <div className="glass hover-glow rounded-xl border border-cyan-500/20 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Eye className="h-5 w-5 text-cyan-400" />
                            <h3 className="font-mono text-lg font-semibold text-cyan-400">Verifying the Settings</h3>
                        </div>
                        <p className="text-sm text-[#8b949e] mb-4">
                            You can check the current state of `autoConfig` in your browser console or by inspecting the network request.
                        </p>
                        <ul className="space-y-2 text-sm text-[#8b949e]">
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 font-mono">1.</span>
                                <span>Open Chrome DevTools → Network Tab</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 font-mono">2.</span>
                                <span>Filter for `tr?` (Pixel requests)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 font-mono">3.</span>
                                <span>Look for `SubscribedButtonClick` requests. If they are gone, you successfully disabled it.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Under the Hood */}
            <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                <h2 className="mb-6 font-mono text-xl md:text-2xl font-bold text-[#00ff41] border-l-4 border-[#00ff41] pl-4 text-glow-hover">
                    <span className="inline-block animate-pulse">▸</span> Under the Hood: Deduplication Impact
                </h2>

                <div className="glass hover-glow rounded-xl border border-[#00ff41]/20 p-6">
                    <h3 className="font-mono text-lg font-semibold text-[#e8f4f8] mb-4">Do these cause Duplicate Events?</h3>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="glass rounded-lg border border-[#00ff41]/20 p-4 flex flex-col items-center text-center">
                            <CheckCircle className="h-8 w-8 text-[#00ff41] mb-2" />
                            <h4 className="font-mono text-[#00ff41] font-bold mb-2">No, They Don't</h4>
                            <p className="text-xs text-[#8b949e]">
                                `SubscribedButtonClick` is a DIFFERENT event name than `Purchase`. Meta treats them as two separate actions.
                                They do not conflict with your deduplication logic (which only compares events with the same name and ID).
                            </p>
                        </div>

                        <div className="glass rounded-lg border border-yellow-500/20 p-4 flex flex-col items-center text-center">
                            <AlertTriangle className="h-8 w-8 text-yellow-400 mb-2" />
                            <h4 className="font-mono text-yellow-400 font-bold mb-2">But They Can Be Noisy</h4>
                            <p className="text-xs text-[#8b949e]">
                                If you have a "Purchase" button, clicking it might fire BOTH a manual `Purchase` event (from your code) AND
                                an auto `SubscribedButtonClick` (from Meta). This is fine, but can look messy in reports.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

        </PageContent>
    )
}
