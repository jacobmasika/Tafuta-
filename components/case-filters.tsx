'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { KENYA_COUNTIES } from '@/lib/types'
import { useCallback, useState, useTransition } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

export function CaseFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)

  const currentSearch = searchParams.get('search') || ''
  const currentCounty = searchParams.get('county') || ''
  const currentGender = searchParams.get('gender') || ''
  const currentAgeRange = searchParams.get('age') || ''

  const updateFilters = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }, [router, searchParams])

  const clearFilters = useCallback(() => {
    startTransition(() => {
      router.push('/')
    })
    setIsOpen(false)
  }, [router])

  const hasFilters = currentSearch || currentCounty || currentGender || currentAgeRange

  const FilterContent = () => (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">County</label>
        <Select value={currentCounty || 'all'} onValueChange={(v) => updateFilters('county', v)}>
          <SelectTrigger>
            <SelectValue placeholder="All Counties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Counties</SelectItem>
            {KENYA_COUNTIES.map((county) => (
              <SelectItem key={county} value={county}>
                {county}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">Gender</label>
        <Select value={currentGender || 'all'} onValueChange={(v) => updateFilters('gender', v)}>
          <SelectTrigger>
            <SelectValue placeholder="All Genders" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genders</SelectItem>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">Age Range</label>
        <Select value={currentAgeRange || 'all'} onValueChange={(v) => updateFilters('age', v)}>
          <SelectTrigger>
            <SelectValue placeholder="All Ages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ages</SelectItem>
            <SelectItem value="0-12">Child (0-12)</SelectItem>
            <SelectItem value="13-17">Teen (13-17)</SelectItem>
            <SelectItem value="18-35">Young Adult (18-35)</SelectItem>
            <SelectItem value="36-60">Adult (36-60)</SelectItem>
            <SelectItem value="60+">Senior (60+)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          <X className="mr-2 h-4 w-4" />
          Clear All Filters
        </Button>
      )}
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or reference number..."
            value={currentSearch}
            onChange={(e) => updateFilters('search', e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="sr-only">Open filters</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Filter Cases</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden gap-4 lg:flex">
        <Select value={currentCounty || 'all'} onValueChange={(v) => updateFilters('county', v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Counties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Counties</SelectItem>
            {KENYA_COUNTIES.map((county) => (
              <SelectItem key={county} value={county}>
                {county}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={currentGender || 'all'} onValueChange={(v) => updateFilters('gender', v)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Genders" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genders</SelectItem>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        <Select value={currentAgeRange || 'all'} onValueChange={(v) => updateFilters('age', v)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Ages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ages</SelectItem>
            <SelectItem value="0-12">Child (0-12)</SelectItem>
            <SelectItem value="13-17">Teen (13-17)</SelectItem>
            <SelectItem value="18-35">Young Adult (18-35)</SelectItem>
            <SelectItem value="36-60">Adult (36-60)</SelectItem>
            <SelectItem value="60+">Senior (60+)</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="ghost" onClick={clearFilters} size="sm">
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {isPending && (
        <div className="text-sm text-muted-foreground">Updating results...</div>
      )}
    </div>
  )
}
