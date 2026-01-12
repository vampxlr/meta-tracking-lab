import { PageShell } from "@/components/page-shell"

export default function MissingEventsPage() {
  return (
    <PageShell
      title="Missing Events"
      description="Understanding why events aren't being recorded and how to troubleshoot tracking gaps."
    >
      <div className="space-y-4 text-muted-foreground">
        <p>
          Missing events are one of the most common tracking issues. Events may fail to fire 
          due to browser ad blockers, incorrect Pixel initialization, timing issues, or network 
          problems. This guide helps you identify and resolve these gaps.
        </p>
        <p>
          Learn how to verify event firing, understand common causes, and implement fallback 
          strategies to ensure critical events are captured.
        </p>
      </div>
    </PageShell>
  )
}
