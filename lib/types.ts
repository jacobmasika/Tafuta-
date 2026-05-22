export interface MissingPerson {
  id: string
  reference_no: string
  full_name: string
  age_at_disappearance: number | null
  gender: 'male' | 'female' | 'other' | 'unknown' | null
  county: string
  last_seen_location: string | null
  last_seen_date: string | null
  physical_description: string | null
  clothing_description: string | null
  distinguishing_marks: string | null
  ob_number: string | null
  photos: string[] | null
  reporter_name: string
  reporter_phone: string
  reporter_email: string | null
  status: 'active' | 'found' | 'closed'
  is_verified: boolean
  is_sensitive: boolean
  created_at: string
  updated_at: string
}

export interface Sighting {
  id: string
  missing_person_id: string
  description: string
  sighting_location: string
  sighting_county: string | null
  sighting_date: string | null
  sighting_photo: string | null
  submitter_phone: string | null
  is_reviewed: boolean
  created_at: string
}

export interface SmsSubscriber {
  id: string
  phone: string
  county: string | null
  is_active: boolean
  created_at: string
}

export const KENYA_COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa',
  'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
  'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos',
  'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a',
  'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu',
  'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi', 'Trans-Nzoia', 'Turkana',
  'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
] as const

export type KenyaCounty = typeof KENYA_COUNTIES[number]
