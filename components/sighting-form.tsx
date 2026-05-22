'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { KENYA_COUNTIES } from '@/lib/types'
import { Loader2 } from 'lucide-react'

interface SightingFormProps {
  missingPersonId: string
}

export function SightingForm({ missingPersonId }: SightingFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    description: '',
    sighting_location: '',
    sighting_county: '',
    sighting_date: '',
    submitter_phone: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.description || !formData.sighting_location) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('sightings')
        .insert({
          missing_person_id: missingPersonId,
          description: formData.description,
          sighting_location: formData.sighting_location,
          sighting_county: formData.sighting_county || null,
          sighting_date: formData.sighting_date || null,
          submitter_phone: formData.submitter_phone || null,
        })

      if (error) throw error

      toast.success('Sighting reported successfully! Thank you for your help.')
      setFormData({
        description: '',
        sighting_location: '',
        sighting_county: '',
        sighting_date: '',
        submitter_phone: '',
      })
      router.refresh()
    } catch (error) {
      console.error('Error submitting sighting:', error)
      toast.error('Failed to submit sighting. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          placeholder="Describe where and when you saw this person, what they were doing, who they were with, etc."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          required
        />
      </div>

      <div>
        <Label htmlFor="sighting_location">Location *</Label>
        <Input
          id="sighting_location"
          placeholder="e.g., Near Westlands Mall, Nairobi"
          value={formData.sighting_location}
          onChange={(e) => setFormData({ ...formData, sighting_location: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="sighting_county">County</Label>
        <Select
          value={formData.sighting_county}
          onValueChange={(v) => setFormData({ ...formData, sighting_county: v })}
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
        <Label htmlFor="sighting_date">Date of Sighting</Label>
        <Input
          id="sighting_date"
          type="date"
          value={formData.sighting_date}
          onChange={(e) => setFormData({ ...formData, sighting_date: e.target.value })}
          max={new Date().toISOString().split('T')[0]}
        />
      </div>

      <div>
        <Label htmlFor="submitter_phone">Your Phone (optional)</Label>
        <Input
          id="submitter_phone"
          type="tel"
          placeholder="+254..."
          value={formData.submitter_phone}
          onChange={(e) => setFormData({ ...formData, submitter_phone: e.target.value })}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          We may contact you for more information
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Submit Sighting Report
      </Button>
    </form>
  )
}
