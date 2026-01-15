"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { PageContent } from "@/components/page-content"
import { SetupStatusPanel } from "@/components/setup-status-panel"
import { DemoPanel } from "@/components/demo-panel"
import { pagesRegistry } from "@/content/pages-registry"

interface PageProps {
  params: Promise<{
    slug: string[]
  }>
}

export default function DynamicPage({ params }: PageProps) {
  // Use React 19's use() hook to unwrap the promise
  const { slug } = use(params)
  const path = "/" + slug.join("/")
  
  // Look up the page in the registry
  const pageData = pagesRegistry[path]

  // If page not found, return 404
  if (!pageData) {
    notFound()
  }

  return (
    <PageContent
      title={pageData.title}
      description={pageData.description}
      status={pageData.badge}
      rightPanel={pageData.showDemo ? <DemoPanel preset={pageData.demoPreset?.kind} /> : <SetupStatusPanel />}
    >
      {/* Render section blocks */}
      {pageData.sectionBlocks.map((section, index) => (
        <section key={index} className="mb-10">
          <h2 className="mb-4 text-2xl font-bold text-foreground">{section.heading}</h2>
          <div className="space-y-4">
            {section.body.split('\n\n').map((paragraph, pIndex) => {
              const trimmed = paragraph.trim()
              
              // Check if this is a code block
              if (trimmed.startsWith('```')) {
                const codeMatch = trimmed.match(/```(\w+)?\n([\s\S]*?)```/)
                if (codeMatch) {
                  const language = codeMatch[1] || ''
                  const code = codeMatch[2]
                  return (
                    <pre key={pIndex} className="my-4 overflow-x-auto rounded-lg border bg-slate-950 p-4 text-sm">
                      <code className="text-slate-50">{code}</code>
                    </pre>
                  )
                }
              }
              
              // Check if this starts with a list marker or bold text
              if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                // This is a list item
                return (
                  <div key={pIndex} className="text-muted-foreground leading-relaxed">
                    {trimmed}
                  </div>
                )
              }
              
              // Regular paragraph - render with proper text formatting
              return (
                <div 
                  key={pIndex} 
                  className="text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: trimmed
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
                      .replace(/`([^`]+)`/g, '<code class="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">$1</code>')
                  }}
                />
              )
            })}
          </div>
        </section>
      ))}
    </PageContent>
  )
}
