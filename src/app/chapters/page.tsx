'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PageHero } from '@/components/tbc/page-hero'
import { ChapterCard } from '@/components/tbc/chapter-finder'
import { Reveal } from '@/components/tbc/reveal'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

interface Chapter {
  id: string; name: string; slug: string; location: string; city: string; area: string | null; meetingDay: string; meetingTime: string; description: string | null; categories: string | null
}

export default function ChaptersPage() {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('')

  useEffect(() => {
    fetch('/api/chapters').then(r => r.json()).then(setChapters)
  }, [])

  const filtered = chapters.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.location.toLowerCase().includes(search.toLowerCase())
    const matchCity = !city || c.city === city
    return matchSearch && matchCity
  })

  const cities = [...new Set(chapters.map(c => c.city))]

  return (
    <>
      <PageHero badge="Chapters" title="TBC Chapters" subtitle="Find a TBC chapter near you and start building trusted business relationships." />

      <section className="py-10 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="relative flex-1 min-w-0 sm:min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-tbc-gray" />
              <Input placeholder="Search chapters..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
            <select value={city} onChange={e => setCity(e.target.value)} className="px-4 py-2 border rounded-md bg-white text-tbc-charcoal text-sm">
              <option value="">All Cities</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filtered.map((chapter, i) => (
              <Reveal key={chapter.id} delay={i * 60}>
                <ChapterCard chapter={chapter} />
              </Reveal>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-tbc-gray">No chapters found matching your criteria.</div>
          )}
        </div>
      </section>
    </>
  )
}
