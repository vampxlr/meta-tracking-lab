import { PageShell } from "@/components/page-shell"

export default function PurchaseMismatchPage() {
  return (
    <PageShell
      title="Purchase Mismatch"
      description="When purchase events don't match actual transactions, leading to inaccurate revenue tracking."
    >
      <div className="space-y-4 text-muted-foreground">
        <p>
          Purchase mismatch occurs when the recorded purchase value or order ID doesn't align 
          with your actual transaction data. This can happen due to currency conversion issues, 
          incorrect value formatting, or mismatched order IDs.
        </p>
        <p>
          Understand how to ensure purchase events accurately reflect your business transactions 
          and maintain data integrity across systems.
        </p>
      </div>
    </PageShell>
  )
}
