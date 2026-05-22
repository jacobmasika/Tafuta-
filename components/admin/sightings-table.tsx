'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import { Check, Eye, Loader2 } from 'lucide-react'
import type { Sighting } from '@/lib/types'

interface SightingWithCase extends Sighting {
  missing_persons: {
    full_name: string
    reference_no: string
  }
}

interface AdminSightingsTableProps {
  sightings: SightingWithCase[]
}

export function AdminSightingsTable({ sightings }: AdminSightingsTableProps) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleMarkReviewed = async (id: string) => {
    setLoadingId(id)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('sightings')
        .update({ is_reviewed: true })
        .eq('id', id)

      if (error) throw error

      toast.success('Sighting marked as reviewed')
      router.refresh()
    } catch (error) {
      console.error('Error updating sighting:', error)
      toast.error('Failed to update sighting')
    } finally {
      setLoadingId(null)
    }
  }

  if (sightings.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        No sightings reported yet
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Case</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sightings.map((sighting) => (
            <TableRow key={sighting.id}>
              <TableCell>
                <Link
                  href={`/case/${sighting.missing_person_id}`}
                  className="hover:underline"
                >
                  <p className="font-medium">{sighting.missing_persons?.full_name}</p>
                  <p className="text-sm text-muted-foreground font-mono">
                    {sighting.missing_persons?.reference_no}
                  </p>
                </Link>
              </TableCell>
              <TableCell>
                <p>{sighting.sighting_location}</p>
                {sighting.sighting_county && (
                  <p className="text-sm text-muted-foreground">{sighting.sighting_county}</p>
                )}
              </TableCell>
              <TableCell className="max-w-xs">
                <p className="truncate">{sighting.description}</p>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {sighting.sighting_date
                  ? new Date(sighting.sighting_date).toLocaleDateString('en-KE')
                  : 'Not specified'}
              </TableCell>
              <TableCell>
                {sighting.is_reviewed ? (
                  <Badge variant="default" className="bg-green-600">Reviewed</Badge>
                ) : (
                  <Badge variant="outline">Pending</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/case/${sighting.missing_person_id}`}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View case</span>
                    </Link>
                  </Button>
                  {!sighting.is_reviewed && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleMarkReviewed(sighting.id)}
                      disabled={loadingId === sighting.id}
                    >
                      {loadingId === sighting.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      <span className="sr-only">Mark as reviewed</span>
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}