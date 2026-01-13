import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex-1">
      <div className="container py-16">
        <Card className="max-w-2xl mx-auto p-8 text-center">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-foreground mb-2">Page Not Found</h1>
            <p className="text-muted-foreground text-lg">
              The page you{"'"}re looking for doesn{"'"}t exist or hasn{"'"}t been created yet.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="gap-2">
                <Home className="h-4 w-4" />
                Go to Overview
              </Button>
            </Link>
            <Button variant="outline" onClick={() => window.history.back()} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </div>

          <div className="mt-8 p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground">
            <p>
              If you believe this is an error, please check the navigation sidebar or contact support.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
