import Link from 'next/link'
import { Search, Phone, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Search className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">Tafuta</span>
            </Link>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Tafuta is a community-driven platform dedicated to helping find missing persons across Kenya. 
              Together, we can reunite families and bring loved ones home.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Quick Links</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Browse Cases
                </Link>
              </li>
              <li>
                <Link href="/report" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Report Missing Person
                </Link>
              </li>
              <li>
                <Link href="/alerts" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  SMS Alerts
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Emergency Contacts</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>Police: 999 / 112</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>Child Helpline: 116</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>help@tafuta.co.ke</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Tafuta Kenya. All rights reserved. 
            <span className="mx-2">|</span>
            If you have information about a missing person, please contact authorities immediately.
          </p>
        </div>
      </div>
    </footer>
  )
}
