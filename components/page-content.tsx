import { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface PageContentProps {
  title: string
  description?: string
  children?: ReactNode
  status?: "Draft" | "Beta" | "Stable" | "Experimental"
  rightPanel?: ReactNode
}

export function PageContent({ 
  title, 
  description, 
  children,
  status = "Draft",
  rightPanel
}: PageContentProps) {
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
            {children && (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {children}
              </div>
            )}
          </div>

          {/* Right Panel - Sticky on desktop */}
          <div className="hidden lg:block">
            <div className="sticky top-4">
              {rightPanel}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
