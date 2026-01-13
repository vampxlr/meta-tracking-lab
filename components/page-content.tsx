"use client"

import * as React from "react"
import { DemoPanel } from "@/components/demo-panel"

interface PageSection {
  heading: string
  body: string
}

interface PageMetadata {
  title: string
  description: string
  badge?: "Stable" | "Draft" | "Beta" | "Experimental"
  sectionBlocks: PageSection[]
  showDemo?: boolean
}

interface PageContentProps {
  pageData: PageMetadata
}

export function PageContent({ pageData }: PageContentProps) {
  const { title, description, badge = "Draft", sectionBlocks, showDemo = false } = pageData

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
              {badge && (
                <span className="shrink-0 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/80">
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className="text-muted-foreground lg:text-lg">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Content Layout */}
        {showDemo ? (
          // Two-column layout with demo panel
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            {/* Main Content */}
            <div className="space-y-8">
              {sectionBlocks.map((block, index) => (
                <div key={index} className="rounded-2xl border bg-card p-6 shadow-sm">
                  <h2 className="mb-3 text-lg font-semibold text-foreground">
                    {block.heading}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {block.body}
                  </p>
                </div>
              ))}

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
        ) : (
          // Centered single-column layout
          <div className="max-w-3xl mx-auto space-y-8">
            {sectionBlocks.map((block, index) => (
              <div key={index} className="rounded-2xl border bg-card p-6 shadow-sm">
                <h2 className="mb-3 text-lg font-semibold text-foreground">
                  {block.heading}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {block.body}
                </p>
              </div>
            ))}

            {/* Notes / References */}
            <div className="rounded-2xl border bg-muted/20 p-6">
              <h3 className="mb-3 font-semibold text-foreground">Notes & References</h3>
              <p className="text-sm text-muted-foreground">
                Additional resources and references will be added as this documentation evolves.
                Check back for updates and expanded examples.
              </p>
            </div>
          </div>
        )}

        {/* Mobile Demo Panel */}
        {showDemo && (
          <div className="mt-8 lg:hidden">
            <DemoPanel />
          </div>
        )}
      </div>
    </div>
  )
}
