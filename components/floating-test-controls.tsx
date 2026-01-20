"use client"

import * as React from "react"
import { useTestMode } from "@/components/test-mode-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Beaker, ChevronDown, ChevronUp, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function FloatingTestControls() {
    const { isEnabled, setIsEnabled, testCode, setTestCode } = useTestMode()
    const [isExpanded, setIsExpanded] = React.useState(false)

    // Auto-expand on first visit if enabled? Maybe not, keep it unobtrusive.

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="w-80 rounded-xl border border-[#00ff41]/20 bg-black/90 p-4 shadow-2xl backdrop-blur-md"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Beaker className="h-4 w-4 text-[#00ff41]" />
                                <h3 className="font-mono text-sm font-bold text-[#e8f4f8]">Test Configuration</h3>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-[#8b949e] hover:text-white"
                                onClick={() => setIsExpanded(false)}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="test-mode" className="font-mono text-xs text-[#e8f4f8]">
                                    Enable Test Mode
                                </Label>
                                <Switch
                                    id="test-mode"
                                    checked={isEnabled}
                                    onCheckedChange={setIsEnabled}
                                    className="data-[state=checked]:bg-[#00ff41]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="test-code" className="font-mono text-xs text-[#8b949e]">
                                    Test Event Code
                                </Label>
                                <Input
                                    id="test-code"
                                    placeholder="TEST12345"
                                    value={testCode}
                                    onChange={(e) => setTestCode(e.target.value)}
                                    className="h-8 font-mono text-xs border-[#00ff41]/20 bg-black/50 focus:border-[#00ff41]"
                                    disabled={!isEnabled}
                                />
                                <p className="text-[10px] text-[#8b949e]">
                                    Enter the code from Events Manager &gt; Test Events
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Button
                onClick={() => setIsExpanded(!isExpanded)}
                size="lg"
                className={`rounded-full h-12 w-12 p-0 shadow-lg border transition-all ${isEnabled
                        ? "bg-[#00ff41]/10 border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41]/20"
                        : "bg-black/80 border-white/10 text-[#8b949e] hover:bg-black hover:text-white"
                    }`}
            >
                <div className="relative">
                    <Beaker className="h-5 w-5" />
                    {isEnabled && (
                        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff41] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00ff41]"></span>
                        </span>
                    )}
                </div>
            </Button>
        </div>
    )
}
