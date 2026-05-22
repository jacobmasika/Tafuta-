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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { MoreHorizontal, Eye, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import type { MissingPerson } from '@/lib/types'

interface AdminCasesTableProps {
  cases: MissingPerson[]
  showVerifyButton?: boolean
}

export function AdminCasesTable({ cases, showVerifyButton }: AdminCasesTableProps) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleVerify = async (id: string, verify: boolean) => {
    setLoadingId(id)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('missing_persons')
        .update({ is_verified: verify })
        .eq('id', id)

      if (error) throw error

      toast.success(verify ? 'Case verified successfully' : 'Case unverified')
      router.refresh()
    } catch (error) {
      console.error('Error updating case:', error)
      toast.error('Failed to update case')
    } finally {
      setLoadingId(null)
    }
  }

  const handleStatusChange = async (id: string, status: 'active' | 'found' | 'closed') => {
    setLoadingId(id)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('missing_persons')
        .update({ status })
        .eq('id', id)

      if (error) throw error

      toast.success(`Case marked as ${status}`)
      router.refresh()
    } catch (error) {
      console.error('Error updating case:', error)
      toast.error('Failed to update case')
    } finally {
      setLoadingId(null)
    }
  }

  if (cases.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        No cases found
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reference</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>County</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead>Reported</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cases.map((person) => (
            <TableRow key={person.id}>
              <TableCell className="font-mono text-sm">
                {person.reference_no}
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{person.full_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {person.age_at_disappearance ? `${person.age_at_disappearance} yrs` : 'Age unknown'}
                    {person.gender ? `, ${person.gender}` : ''}
                  </p>
                </div>
              </TableCell>
              <TableCell>{person.county}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    person.status === 'active' ? 'destructive' :
                    person.status === 'found' ? 'default' : 'secondary'
                  }
                >
                  {person.status}
                </Badge>
              </TableCell>
              <TableCell>
                {person.is_verified ? (
                  <Badge variant="default" className="bg-green-600">Verified</Badge>
                ) : (
                  <Badge variant="outline">Pending</Badge>
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(person.created_at).toLocaleDateString('en-KE')}
              </TableCell>
              <TableCell className="text-right">
                {loadingId === person.id ? (
                  <Loader2 className="ml-auto h-4 w-4 animate-spin" />
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/case/${person.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Case
                        </Link>
                      </DropdownMenuItem>
                      {!person.is_verified ? (
                        <DropdownMenuItem onClick={() => handleVerify(person.id, true)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Verify Case
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleVerify(person.id, false)}>
                          <XCircle className="mr-2 h-4 w-4" />
                          Unverify Case
                        </DropdownMenuItem>
                      )}
                      {person.status === 'active' && (
                        <DropdownMenuItem onClick={() => handleStatusChange(person.id, 'found')}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Found
                        </DropdownMenuItem>
                      )}
                      {person.status !== 'closed' && (
                        <DropdownMenuItem onClick={() => handleStatusChange(person.id, 'closed')}>
                          <XCircle className="mr-2 h-4 w-4" />
                          Close Case
                        </DropdownMenuItem>
                      )}
                      {person.status !== 'active' && (
                        <DropdownMenuItem onClick={() => handleStatusChange(person.id, 'active')}>
                          <Eye className="mr-2 h-4 w-4" />
                          Reopen Case
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
