import { PageShell } from "@/components/page-shell"

export default function OverviewPage() {
  return (
    <PageShell
      title="Overview"
      description="Welcome to Meta Tracking Lab — your interactive guide to understanding and debugging Meta Pixel events."
      status="Stable"
    >
      <div className="space-y-4 text-muted-foreground">
        <p>
          This documentation provides comprehensive insights into common tracking problems, 
          best practices, and interactive demos to help you build robust event tracking 
          for your e-commerce or SaaS application.
        </p>
        <p>
          Use the navigation sidebar to explore different topics, or try out the Event 
          Playground on the right to simulate various Meta Pixel events in both broken 
          and fixed configurations.
        </p>
      </div>
    </PageShell>
  )
}
