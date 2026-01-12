import { PageShell } from "@/components/page-shell"

export default function SetupChecklistPage() {
  return (
    <PageShell
      title="Setup Checklist"
      description="A comprehensive checklist to ensure your Meta Pixel and Conversions API are properly configured."
      status="Stable"
    >
      <div className="space-y-4 text-muted-foreground">
        <p>
          Before diving into specific problems, ensure your tracking implementation passes 
          all the fundamental setup requirements. This checklist covers Pixel installation, 
          CAPI configuration, and basic testing procedures.
        </p>
        <p>
          Each item includes verification steps to confirm your implementation is correct.
        </p>
      </div>
    </PageShell>
  )
}
