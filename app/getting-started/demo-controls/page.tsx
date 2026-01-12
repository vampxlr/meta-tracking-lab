import { PageShell } from "@/components/page-shell"

export default function DemoControlsPage() {
  return (
    <PageShell
      title="Demo Controls"
      description="Learn how to use the Event Playground to simulate and debug Meta Pixel events."
      status="Stable"
    >
      <div className="space-y-4 text-muted-foreground">
        <p>
          The Event Playground allows you to test different event configurations in real-time. 
          Switch between Broken and Fixed modes to see how various tracking issues manifest 
          and how proper solutions correct them.
        </p>
        <p>
          Use this tool to understand event payloads, test different parameters, and validate 
          your tracking implementation before deploying to production.
        </p>
      </div>
    </PageShell>
  )
}
