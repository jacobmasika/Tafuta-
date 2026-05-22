import { Card, CardContent } from '@/components/ui/card'
import { Users, AlertCircle, Clock, Eye } from 'lucide-react'

interface AdminStatsProps {
  stats: {
    totalCases: number
    activeCases: number
    pendingVerification: number
    totalSightings: number
    unreviewedSightings: number
  }
}

export function AdminStats({ stats }: AdminStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-accent/10 p-3">
              <Users className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Cases</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalCases}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-destructive/10 p-3">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Cases</p>
              <p className="text-2xl font-bold text-foreground">{stats.activeCases}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-yellow-500/10 p-3">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Verification</p>
              <p className="text-2xl font-bold text-foreground">{stats.pendingVerification}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-accent/10 p-3">
              <Eye className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Sightings</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalSightings}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
