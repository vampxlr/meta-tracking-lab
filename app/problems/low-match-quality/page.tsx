import { PageShell } from "@/components/page-shell"

export default function LowMatchQualityPage() {
  return (
    <PageShell
      title="Low Match Quality"
      description="Improving the match rate between Pixel events and user profiles for better ad targeting."
    >
      <div className="space-y-4 text-muted-foreground">
        <p>
          Low match quality means Meta cannot reliably connect Pixel events to user profiles, 
          reducing the effectiveness of your ad campaigns. This often happens when essential 
          user identifiers are missing or inconsistent.
        </p>
        <p>
          Learn about the match quality score, which parameters matter most, and how to improve 
          your event data for better matching.
        </p>
      </div>
    </PageShell>
  )
}
