import { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DemoPanel } from "@/components/demo-panel"

interface PageShellProps {
  title: string
  description?: string
  children?: ReactNode
  status?: "Draft" | "Beta" | "Stable" | "Experimental"
}

export function PageShell({ 
  title, 
  description, 
  children,
  status = "Draft" 
}: PageShellProps) {
  const statusColors = {
    Draft: "secondary",
    Beta: "outline",
    Stable: "default",
    Experimental: "destructive",
  } as const

  return (
    <div className="flex-1">
      <div className="container py-8 lg:py-12">
        {/* Page Header */}
        <div className="mb-8 flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
                {title}
              </h1>
              <Badge variant={statusColors[status] as any} className="shrink-0">
                {status}
              </Badge>
            </div>
            {description && (
              <p className="text-muted-foreground lg:text-lg">
                {description}
              </p>
            )}
          </div>
        </div>

        <Separator className="mb-8" />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          {/* Main Content */}
          <div className="space-y-8">
            {/* What You'll Learn */}
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <h2 className="mb-3 text-lg font-semibold text-foreground">
                What you'll learn
              </h2>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span>Common patterns and best practices for this topic</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span>Real-world examples and use cases</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span>Interactive demo to test different scenarios</span>
                </li>
              </ul>
            </div>

            {/* Content */}
            {children && (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {children}
              </div>
            )}

            {/* Notes / References */}
            <div className="rounded-2xl border bg-muted/20 p-6">
              <h3 className="mb-3 font-semibold text-foreground">Notes & References</h3>
              <p className="text-sm text-muted-foreground">
                Additional resources and references will be added as this documentation evolves.
                Check back for updates and expanded examples.
              </p>
            </div>
          </div>

          {/* Demo Panel - Sticky on desktop */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <DemoPanel />
            </div>
          </div>
        </div>

        {/* Mobile Demo Panel */}
        <div className="mt-8 lg:hidden">
          <DemoPanel />
        </div>
      </div>
    </div>
  )
}
