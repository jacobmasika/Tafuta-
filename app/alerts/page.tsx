'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { KENYA_COUNTIES } from '@/lib/types'
import { Bell, Loader2, MessageSquare, MapPin, Clock, CheckCircle2 } from 'lucide-react'

export default function AlertsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [formData, setFormData] = useState({
    phone: '',
    county: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.phone) {
      toast.error('Please enter your phone number')
      return
    }

    // Basic phone validation for Kenya
    const phoneRegex = /^(\+254|0)[17]\d{8}$/
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      toast.error('Please enter a valid Kenyan phone number')
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('sms_subscribers')
        .insert({
          phone: formData.phone,
          county: formData.county || null,
          is_active: true,
        })

      if (error) {
        if (error.code === '23505') {
          toast.error('This phone number is already subscribed')
        } else {
          throw error
        }
        return
      }

      setIsSubscribed(true)
      toast.success('Successfully subscribed to SMS alerts!')
    } catch (error) {
      console.error('Error subscribing:', error)
      toast.error('Failed to subscribe. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
              <Bell className="h-8 w-8 text-accent" />
            </div>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">SMS Alert System</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Subscribe to receive SMS notifications when a missing person is reported in your area. 
              Help us spread awareness and bring families back together.
            </p>
          </div>

          {/* Features */}
          <div className="grid gap-6 mb-12 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-accent/10 p-2">
                    <MessageSquare className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Instant Alerts</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Receive immediate SMS when new cases are reported
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-accent/10 p-2">
                    <MapPin className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Location Based</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Get alerts specific to your county or nationwide
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-accent/10 p-2">
                    <Clock className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">24/7 Updates</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Stay informed around the clock for urgent cases
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subscription Form */}
          <Card className="max-w-lg mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Subscribe to Alerts</CardTitle>
              <CardDescription>
                Enter your details to start receiving SMS alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSubscribed ? (
                <div className="text-center py-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">You&apos;re Subscribed!</h3>
                  <p className="mt-2 text-muted-foreground">
                    You will now receive SMS alerts when missing persons are reported
                    {formData.county ? ` in ${formData.county}` : ' across Kenya'}.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-6"
                    onClick={() => {
                      setIsSubscribed(false)
                      setFormData({ phone: '', county: '' })
                    }}
                  >
                    Subscribe Another Number
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+254 7XX XXX XXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Enter your Kenyan mobile number (e.g., 0712345678 or +254712345678)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="county">County (optional)</Label>
                    <Select
                      value={formData.county}
                      onValueChange={(v) => setFormData({ ...formData, county: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Counties (Nationwide)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Counties (Nationwide)</SelectItem>
                        {KENYA_COUNTIES.map((county) => (
                          <SelectItem key={county} value={county}>
                            {county}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Select a county to only receive alerts from that area
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground">
                      By subscribing, you agree to receive SMS alerts about missing persons. 
                      Standard SMS rates may apply. You can unsubscribe at any time by replying STOP.
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Subscribe to Alerts
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
