import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Calendar, User } from 'lucide-react'
import type { MissingPerson } from '@/lib/types'

interface CaseCardProps {
  person: MissingPerson
}

export function CaseCard({ person }: CaseCardProps) {
  const photoUrl = person.photos?.[0] || '/placeholder-person.jpg'
  const daysMissing = person.last_seen_date
    ? Math.floor((Date.now() - new Date(person.last_seen_date).getTime()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <Link href={`/case/${person.id}`}>
      <Card className="group h-full overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-ring">
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          <Image
            src={photoUrl}
            alt={person.full_name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute right-2 top-2">
            <Badge 
              variant={person.status === 'active' ? 'destructive' : 'secondary'}
              className="text-xs font-medium"
            >
              {person.status === 'active' ? 'Missing' : person.status === 'found' ? 'Found' : 'Closed'}
            </Badge>
          </div>
          {daysMissing !== null && daysMissing > 0 && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-8">
              <span className="text-xs font-medium text-white">
                Missing for {daysMissing} day{daysMissing !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-foreground line-clamp-1 text-balance">
            {person.full_name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Ref: {person.reference_no}
          </p>
          
          <div className="mt-3 space-y-2">
            {person.age_at_disappearance && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-3.5 w-3.5 shrink-0" />
                <span className="capitalize">
                  {person.age_at_disappearance} years, {person.gender || 'Unknown'}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="line-clamp-1">{person.county}</span>
            </div>
            {person.last_seen_date && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                <span>{new Date(person.last_seen_date).toLocaleDateString('en-KE', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
