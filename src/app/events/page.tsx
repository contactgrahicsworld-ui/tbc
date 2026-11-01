'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PageHero } from '@/components/tbc/page-hero'
import { EventCard } from '@/components/tbc/events-section'
import { Reveal } from '@/components/tbc/reveal'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface Event {
  id: string; title: string; slug: string; date: string; time: string | null; location: string | null; type: string; description: string | null
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')

  useEffect(() => { fetch('/api/events').then(r => r.json()).then(setEvents) }, [])

  const filtered = events.filter(e => {
    const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase()) || (e.location || '').toLowerCase().includes(search.toLowerCase())
    const matchType = !type || e.type === type
    return matchSearch && matchType
  })

  return (
    <>
      <PageHero badge="Events" title="Events & Workshops" subtitle="Join networking meetings, workshops, and seminars to grow your business and expand your network." />

      <section className="py-10 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="relative flex-1 min-w-0 sm:min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-tbc-gray" />
              <Input placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
            <select value={type} onChange={e => setType(e.target.value)} className="px-4 py-2 border rounded-md bg-white text-tbc-charcoal text-sm">
              <option value="">All Types</option>
              <option value="networking">Networking</option>
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
              <option value="summit">Summit</option>
            </select>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filtered.map((event, i) => (
              <Reveal key={event.id} delay={i * 60}>
                <EventCard event={event} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
