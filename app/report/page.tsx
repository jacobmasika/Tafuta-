'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import { Loader2, ArrowLeft, ArrowRight, Check, User, MapPin, FileText, Phone } from 'lucide-react'

const STEPS = [
  { id: 1, name: 'Basic Info', icon: User },
  { id: 2, name: 'Location', icon: MapPin },
  { id: 3, name: 'Description', icon: FileText },
  { id: 4, name: 'Contact', icon: Phone },
]

export default function ReportPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Basic Info
    full_name: '',
    age_at_disappearance: '',
    gender: '',
    // Location
    county: '',
    last_seen_location: '',
    last_seen_date: '',
    // Description
    physical_description: '',
    clothing_description: '',
    distinguishing_marks: '',
    ob_number: '',
    // Contact
    reporter_name: '',
    reporter_phone: '',
    reporter_email: '',
  })

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const generateReferenceNo = () => {
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `TAF-${year}-${random}`
  }

  const handleNext = () => {
    // Validate current step
    if (currentStep === 1) {
      if (!formData.full_name) {
        toast.error('Please enter the missing person\'s name')
        return
      }
    }
    if (currentStep === 2) {
      if (!formData.county) {
        toast.error('Please select a county')
        return
      }
    }
    if (currentStep === 4) {
      if (!formData.reporter_name || !formData.reporter_phone) {
        toast.error('Please provide your contact information')
        return
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 4))
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!formData.reporter_name || !formData.reporter_phone) {
      toast.error('Please provide your contact information')
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('missing_persons')
        .insert({
          reference_no: generateReferenceNo(),
          full_name: formData.full_name,
          age_at_disappearance: formData.age_at_disappearance ? parseInt(formData.age_at_disappearance) : null,
          gender: formData.gender || null,
          county: formData.county,
          last_seen_location: formData.last_seen_location || null,
          last_seen_date: formData.last_seen_date || null,
          physical_description: formData.physical_description || null,
          clothing_description: formData.clothing_description || null,
          distinguishing_marks: formData.distinguishing_marks || null,
          ob_number: formData.ob_number || null,
          reporter_name: formData.reporter_name,
          reporter_phone: formData.reporter_phone,
          reporter_email: formData.reporter_email || null,
          status: 'active',
          is_verified: false,
          is_sensitive: false,
        })

      if (error) throw error

      toast.success('Report submitted successfully! It will be reviewed by our team.')
      router.push('/report/success')
    } catch (error) {
      console.error('Error submitting report:', error)
      toast.error('Failed to submit report. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">Report a Missing Person</h1>
            <p className="mt-2 text-muted-foreground">
              Please provide as much information as possible to help find your loved one.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    currentStep >= step.id 
                      ? 'bg-primary border-primary text-primary-foreground' 
                      : 'border-border text-muted-foreground'
                  }`}>
                    {currentStep > step.id ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`hidden sm:block w-24 h-0.5 mx-2 transition-colors ${
                      currentStep > step.id ? 'bg-primary' : 'bg-border'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {STEPS.map((step) => (
                <span key={step.id} className={`text-xs font-medium hidden sm:block ${
                  currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step.name}
                </span>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                Step {currentStep}: {STEPS[currentStep - 1].name}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && 'Enter basic information about the missing person'}
                {currentStep === 2 && 'Where and when was the person last seen?'}
                {currentStep === 3 && 'Describe the person\'s appearance'}
                {currentStep === 4 && 'Your contact information for follow-up'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <>
                  <div>
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      placeholder="Enter full name"
                      value={formData.full_name}
                      onChange={(e) => updateField('full_name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="age_at_disappearance">Age at Disappearance</Label>
                      <Input
                        id="age_at_disappearance"
                        type="number"
                        placeholder="Age"
                        min="0"
                        max="120"
                        value={formData.age_at_disappearance}
                        onChange={(e) => updateField('age_at_disappearance', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(v) => updateField('gender', v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}

              {/* Step 2: Location */}
              {currentStep === 2 && (
                <>
                  <div>
                    <Label htmlFor="county">County *</Label>
                    <Select
                      value={formData.county}
                      onValueChange={(v) => updateField('county', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select county" />
                      </SelectTrigger>
                      <SelectContent>
                        {KENYA_COUNTIES.map((county) => (
                          <SelectItem key={county} value={county}>
                            {county}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="last_seen_location">Last Seen Location</Label>
                    <Input
                      id="last_seen_location"
                      placeholder="e.g., Near Westlands Mall, Nairobi"
                      value={formData.last_seen_location}
                      onChange={(e) => updateField('last_seen_location', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_seen_date">Last Seen Date</Label>
                    <Input
                      id="last_seen_date"
                      type="date"
                      value={formData.last_seen_date}
                      onChange={(e) => updateField('last_seen_date', e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </>
              )}

              {/* Step 3: Description */}
              {currentStep === 3 && (
                <>
                  <div>
                    <Label htmlFor="physical_description">Physical Description</Label>
                    <Textarea
                      id="physical_description"
                      placeholder="Height, build, skin color, hair color/style, eye color, etc."
                      value={formData.physical_description}
                      onChange={(e) => updateField('physical_description', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="clothing_description">Clothing When Last Seen</Label>
                    <Textarea
                      id="clothing_description"
                      placeholder="Describe what they were wearing"
                      value={formData.clothing_description}
                      onChange={(e) => updateField('clothing_description', e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="distinguishing_marks">Distinguishing Marks</Label>
                    <Textarea
                      id="distinguishing_marks"
                      placeholder="Scars, tattoos, birthmarks, etc."
                      value={formData.distinguishing_marks}
                      onChange={(e) => updateField('distinguishing_marks', e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ob_number">Police OB Number (if reported)</Label>
                    <Input
                      id="ob_number"
                      placeholder="OB number"
                      value={formData.ob_number}
                      onChange={(e) => updateField('ob_number', e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* Step 4: Contact */}
              {currentStep === 4 && (
                <>
                  <div>
                    <Label htmlFor="reporter_name">Your Name *</Label>
                    <Input
                      id="reporter_name"
                      placeholder="Full name"
                      value={formData.reporter_name}
                      onChange={(e) => updateField('reporter_name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="reporter_phone">Your Phone Number *</Label>
                    <Input
                      id="reporter_phone"
                      type="tel"
                      placeholder="+254..."
                      value={formData.reporter_phone}
                      onChange={(e) => updateField('reporter_phone', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="reporter_email">Your Email (optional)</Label>
                    <Input
                      id="reporter_email"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.reporter_email}
                      onChange={(e) => updateField('reporter_email', e.target.value)}
                    />
                  </div>
                  <div className="rounded-lg border border-border bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground">
                      By submitting this report, you confirm that the information provided is accurate to the best of your knowledge. 
                      Your contact details will be shared with authorities and may be displayed publicly to facilitate contact.
                    </p>
                  </div>
                </>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                
                {currentStep < 4 ? (
                  <Button type="button" onClick={handleNext}>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Report
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
