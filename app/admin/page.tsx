import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { AdminCasesTable } from '@/components/admin/cases-table'
import { AdminSightingsTable } from '@/components/admin/sightings-table'
import { AdminStats } from '@/components/admin/stats'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Shield } from 'lucide-react'
import type { MissingPerson, Sighting } from '@/lib/types'

async function getAdminData() {
  const supabase = await createClient()
  
  // Fetch all cases (including unverified)
  const { data: cases } = await supabase
    .from('missing_persons')
    .select('*')
    .order('created_at', { ascending: false })

  // Fetch all sightings
  const { data: sightings } = await supabase
    .from('sightings')
    .select('*, missing_persons(full_name, reference_no)')
    .order('created_at', { ascending: false })

  return {
    cases: (cases || []) as MissingPerson[],
    sightings: (sightings || []) as (Sighting & { missing_persons: { full_name: string; reference_no: string } })[],
  }
}

export default async function AdminPage() {
  const { cases, sightings } = await getAdminData()

  const stats = {
    totalCases: cases.length,
    activeCases: cases.filter(c => c.status === 'active').length,
    pendingVerification: cases.filter(c => !c.is_verified).length,
    totalSightings: sightings.length,
    unreviewedSightings: sightings.filter(s => !s.is_reviewed).length,
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage cases and review sightings</p>
            </div>
          </div>

          <AdminStats stats={stats} />

          <Tabs defaultValue="cases" className="mt-8">
            <TabsList>
              <TabsTrigger value="cases">
                Cases ({stats.totalCases})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending Verification ({stats.pendingVerification})
              </TabsTrigger>
              <TabsTrigger value="sightings">
                Sightings ({stats.totalSightings})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cases" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Cases</CardTitle>
                  <CardDescription>
                    View and manage all missing person cases
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AdminCasesTable cases={cases} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pending" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Verification</CardTitle>
                  <CardDescription>
                    Review and verify new case submissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AdminCasesTable cases={cases.filter(c => !c.is_verified)} showVerifyButton />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sightings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sighting Reports</CardTitle>
                  <CardDescription>
                    Review reported sightings from the community
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AdminSightingsTable sightings={sightings} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
