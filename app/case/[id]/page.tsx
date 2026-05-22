import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SightingForm } from '@/components/sighting-form'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  User, 
  Phone,
  Eye,
  Shirt,
  FileText,
  Share2
} from 'lucide-react'
import type { MissingPerson, Sighting } from '@/lib/types'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getCaseWithSightings(id: string) {
  const supabase = await createClient()
  
  const { data: person, error: personError } = await supabase
    .from('missing_persons')
    .select('*')
    .eq('id', id)
    .eq('is_verified', true)
    .single()

  if (personError || !person) {
    return null
  }

  const { data: sightings } = await supabase
    .from('sightings')
    .select('*')
    .eq('missing_person_id', id)
    .order('created_at', { ascending: false })

  return {
    person: person as MissingPerson,
    sightings: (sightings || []) as Sighting[]
  }
}

export default async function CaseDetailPage({ params }: PageProps) {
  const { id } = await params
  const data = await getCaseWithSightings(id)

  if (!data) {
    notFound()
  }

  const { person, sightings } = data
  const photoUrl = person.photos?.[0] || '/placeholder-person.jpg'
  const daysMissing = person.last_seen_date
    ? Math.floor((Date.now() - new Date(person.last_seen_date).getTime()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link href="/" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all cases
          </Link>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hero Card */}
              <Card className="overflow-hidden">
                <div className="md:flex">
                  <div className="relative aspect-[3/4] w-full md:w-72 shrink-0">
                    <Image
                      src={photoUrl}
                      alt={person.full_name}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  <CardContent className="flex-1 p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge 
                          variant={person.status === 'active' ? 'destructive' : 'secondary'}
                        >
                          {person.status === 'active' ? 'Missing' : person.status === 'found' ? 'Found' : 'Closed'}
                        </Badge>
                        <h1 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">
                          {person.full_name}
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                          Reference: {person.reference_no}
                        </p>
                      </div>
                    </div>

                    {daysMissing !== null && daysMissing > 0 && (
                      <div className="mt-4 rounded-lg bg-destructive/10 p-3">
                        <p className="text-sm font-medium text-destructive">
                          Missing for {daysMissing} day{daysMissing !== 1 ? 's' : ''}
                        </p>
                      </div>
                    )}

                    <Separator className="my-4" />

                    <div className="grid gap-4 sm:grid-cols-2">
                      {person.age_at_disappearance && (
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Age at Disappearance</p>
                            <p className="font-medium text-foreground">{person.age_at_disappearance} years</p>
                          </div>
                        </div>
                      )}
                      {person.gender && (
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Gender</p>
                            <p className="font-medium text-foreground capitalize">{person.gender}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Last Seen Location</p>
                          <p className="font-medium text-foreground">{person.last_seen_location || person.county}</p>
                        </div>
                      </div>
                      {person.last_seen_date && (
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Last Seen Date</p>
                            <p className="font-medium text-foreground">
                              {new Date(person.last_seen_date).toLocaleDateString('en-KE', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </div>
              </Card>

              {/* Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {person.physical_description && (
                    <div>
                      <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        Physical Description
                      </h3>
                      <p className="mt-2 text-foreground">{person.physical_description}</p>
                    </div>
                  )}
                  {person.clothing_description && (
                    <div>
                      <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Shirt className="h-4 w-4" />
                        Last Known Clothing
                      </h3>
                      <p className="mt-2 text-foreground">{person.clothing_description}</p>
                    </div>
                  )}
                  {person.distinguishing_marks && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Distinguishing Marks</h3>
                      <p className="mt-2 text-foreground">{person.distinguishing_marks}</p>
                    </div>
                  )}
                  {person.ob_number && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">OB Number</h3>
                      <p className="mt-2 text-foreground">{person.ob_number}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Sightings */}
              <Card>
                <CardHeader>
                  <CardTitle>Reported Sightings ({sightings.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {sightings.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No sightings have been reported yet. If you have seen this person, please submit a sighting report below.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {sightings.map((sighting) => (
                        <div key={sighting.id} className="rounded-lg border border-border p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{sighting.sighting_location}</span>
                              {sighting.sighting_county && (
                                <span className="text-muted-foreground">({sighting.sighting_county})</span>
                              )}
                            </div>
                            {sighting.sighting_date && (
                              <span className="text-sm text-muted-foreground">
                                {new Date(sighting.sighting_date).toLocaleDateString('en-KE')}
                              </span>
                            )}
                          </div>
                          <p className="mt-2 text-foreground">{sighting.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    If you have any information about {person.full_name}, please contact:
                  </p>
                  <div className="space-y-2">
                    <p className="font-medium text-foreground">{person.reporter_name}</p>
                    <a 
                      href={`tel:${person.reporter_phone}`}
                      className="flex items-center gap-2 text-accent hover:underline"
                    >
                      <Phone className="h-4 w-4" />
                      {person.reporter_phone}
                    </a>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <p className="font-medium text-foreground">Police Emergency</p>
                    <a href="tel:999" className="flex items-center gap-2 text-accent hover:underline">
                      <Phone className="h-4 w-4" />
                      999 / 112
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Sighting Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Report a Sighting</CardTitle>
                </CardHeader>
                <CardContent>
                  <SightingForm missingPersonId={person.id} />
                </CardContent>
              </Card>

              {/* Share Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-5 w-5" />
                    Help Spread the Word
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Share this case on social media to help find {person.full_name}.
                  </p>
                  <Button variant="outline" className="w-full">
                    Share Case
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
