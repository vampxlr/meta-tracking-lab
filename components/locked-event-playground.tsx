"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Eye, 
  ShoppingCart, 
  CreditCard, 
  Lock,
  Play,
  ArrowRight,
  Zap
} from "lucide-react"

export function LockedEventPlayground() {
  const router = useRouter()

  return (
    <Card className="shadow-lg border-yellow-500/20">
      <CardHeader className="bg-yellow-500/10 border-b border-yellow-500/20">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            Event Playground
          </span>
          <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">
            Unlock after setup
          </Badge>
        </CardTitle>
        <CardDescription>
          Complete setup to access interactive event testing and practice scenarios
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preview of what's available */}
        <div className="space-y-4 pt-4">
          <p className="text-sm font-medium text-foreground">
            What you'll unlock:
          </p>

          <div className="grid gap-3">
            {/* ViewContent Event Preview */}
            <div className="flex items-center gap-3 rounded-lg border bg-background/50 p-3">
              <Eye className="h-5 w-5 text-blue-500 shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-foreground">ViewContent Event</p>
                <p className="text-xs text-muted-foreground">
                  Track when users view products or content
                </p>
              </div>
            </div>

            {/* AddToCart Event Preview */}
            <div className="flex items-center gap-3 rounded-lg border bg-background/50 p-3">
              <ShoppingCart className="h-5 w-5 text-green-500 shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-foreground">AddToCart Event</p>
                <p className="text-xs text-muted-foreground">
                  Track when users add items to their cart
                </p>
              </div>
            </div>

            {/* Purchase Event Preview */}
            <div className="flex items-center gap-3 rounded-lg border bg-background/50 p-3">
              <CreditCard className="h-5 w-5 text-purple-500 shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-foreground">Purchase Event</p>
                <p className="text-xs text-muted-foreground">
                  Track completed transactions and revenue
                </p>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
            <div className="mb-3 flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Zap className="h-5 w-5" />
              <p className="font-semibold text-blue-900 dark:text-blue-100">Interactive Features</p>
            </div>
            <ul className="space-y-2 text-sm text-blue-900/80 dark:text-blue-100/80">
              <li className="flex gap-2">
                <Zap className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                <span>Toggle between Broken & Fixed modes to see differences</span>
              </li>
              <li className="flex gap-2">
                <Zap className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                <span>Real-time event logging with JSON payloads</span>
              </li>
              <li className="flex gap-2">
                <Zap className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                <span>Copy event payloads for your implementation</span>
              </li>
              <li className="flex gap-2">
                <Zap className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                <span>Built-in ROI Calculator</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="rounded-lg border-2 border-primary bg-primary/5 p-4">
          <p className="mb-3 font-semibold text-foreground">
            Ready to unlock the full playground?
          </p>
          <Button
            onClick={() => router.push('/getting-started/setup-checklist')}
            className="w-full gap-2"
            size="lg"
          >
            <Play className="h-4 w-4" />
            Run Setup Checklist
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
