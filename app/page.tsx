import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CaseCard } from '@/components/case-card'
import { CaseFilters } from '@/components/case-filters'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, Users, MapPin, Phone } from 'lucide-react'
import type { MissingPerson } from '@/lib/types'

interface PageProps {
  searchParams: Promise<{
    search?: string
    county?: string
    gender?: string
    age?: string
  }>
}

async function getCases(filters: {
  search?: string
  county?: string
  gender?: string
  age?: string
}) {
  const supabase = await createClient()
  
  let query = supabase
    .from('missing_persons')
    .select('*')
    .eq('status', 'active')
    .eq('is_verified', true)
    .order('created_at', { ascending: false })

  if (filters.search) {
    query = query.or(`full_name.ilike.%${filters.search}%,reference_no.ilike.%${filters.search}%`)
  }

  if (filters.county) {
    query = query.eq('county', filters.county)
  }

  if (filters.gender) {
    query = query.eq('gender', filters.gender)
  }

  if (filters.age) {
    const [min, max] = filters.age.split('-').map(Number)
    if (filters.age === '60+') {
      query = query.gte('age_at_disappearance', 60)
    } else if (!isNaN(min) && !isNaN(max)) {
      query = query.gte('age_at_disappearance', min).lte('age_at_disappearance', max)
    }
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching cases:', error)
    return []
  }

  return data as MissingPerson[]
}

function CasesGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-[4/5] w-full rounded-lg" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  )
}

async function CasesGrid({ filters }: { filters: PageProps['searchParams'] }) {
  const resolvedFilters = await filters
  const cases = await getCases(resolvedFilters)

  if (cases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card p-12 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold text-foreground">No cases found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Try adjusting your filters or search terms
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cases.map((person) => (
        <CaseCard key={person.id} person={person} />
      ))}
    </div>
  )
}

export default async function HomePage({ searchParams }: PageProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="text-center">
              <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Kenya Missing Persons Database
              </p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
                Help bring them home
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-pretty">
                Tafuta connects communities across Kenya to help find missing persons. 
                Browse active cases, report sightings, or submit a missing person report.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/report">
                  <Button size="lg" className="w-full sm:w-auto">
                    Report Missing Person
                  </Button>
                </Link>
                <Link href="/alerts">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Subscribe to Alerts
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-card p-6 text-center">
                <Users className="mx-auto h-8 w-8 text-accent" />
                <p className="mt-2 text-2xl font-bold text-foreground">47</p>
                <p className="text-sm text-muted-foreground">Counties Covered</p>
              </div>
              <div className="rounded-lg bg-card p-6 text-center">
                <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
                <p className="mt-2 text-2xl font-bold text-foreground">Active</p>
                <p className="text-sm text-muted-foreground">Missing Cases</p>
              </div>
              <div className="rounded-lg bg-card p-6 text-center">
                <MapPin className="mx-auto h-8 w-8 text-accent" />
                <p className="mt-2 text-2xl font-bold text-foreground">24/7</p>
                <p className="text-sm text-muted-foreground">Sighting Reports</p>
              </div>
              <div className="rounded-lg bg-card p-6 text-center">
                <Phone className="mx-auto h-8 w-8 text-accent" />
                <p className="mt-2 text-2xl font-bold text-foreground">SMS</p>
                <p className="text-sm text-muted-foreground">Alert System</p>
              </div>
            </div>
          </div>
        </section>

        {/* Cases Section */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground">Active Missing Person Cases</h2>
              <p className="mt-2 text-muted-foreground">
                Help us find these missing individuals. Click on a case for more details or to report a sighting.
              </p>
            </div>

            <div className="mb-8">
              <Suspense fallback={<div className="h-10 animate-pulse rounded-md bg-muted" />}>
                <CaseFilters />
              </Suspense>
            </div>

            <Suspense fallback={<CasesGridSkeleton />}>
              <CasesGrid filters={searchParams} />
            </Suspense>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
