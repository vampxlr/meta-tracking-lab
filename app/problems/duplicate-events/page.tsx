import { PageShell } from "@/components/page-shell"

export default function DuplicateEventsPage() {
  return (
    <PageShell
      title="Duplicate Events"
      description="Identifying and preventing duplicate event submissions that skew your analytics data."
    >
      <div className="space-y-4 text-muted-foreground">
        <p>
          Duplicate events can occur when Pixel fires multiple times for the same user action, 
          or when both Pixel and Conversions API send identical events. This leads to inflated 
          metrics and incorrect attribution.
        </p>
        <p>
          Learn about event ID deduplication, common causes of duplicates, and how to configure 
          proper deduplication strategies.
        </p>
      </div>
    </PageShell>
  )
}
