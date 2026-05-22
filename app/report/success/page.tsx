import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, Home, Bell } from 'lucide-react'

export default function ReportSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex flex-1 items-center justify-center bg-background px-4 py-12">
        <Card className="w-full max-w-lg text-center">
          <CardContent className="p-8">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-foreground">Report Submitted Successfully</h1>
            
            <p className="mt-4 text-muted-foreground">
              Thank you for submitting your report. Our team will review the information and verify the case before it goes live on the platform.
            </p>
            
            <div className="mt-6 rounded-lg border border-border bg-muted/50 p-4 text-left">
              <h3 className="font-medium text-foreground">What happens next?</h3>
              <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                <li>1. Our team will review your submission within 24-48 hours</li>
                <li>2. You may be contacted for additional information</li>
                <li>3. Once verified, the case will appear on our public database</li>
                <li>4. We recommend also filing a report with local police if you haven&apos;t already</li>
              </ul>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/">
                <Button variant="outline" className="w-full sm:w-auto">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <Link href="/alerts">
                <Button className="w-full sm:w-auto">
                  <Bell className="mr-2 h-4 w-4" />
                  Subscribe to Alerts
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
