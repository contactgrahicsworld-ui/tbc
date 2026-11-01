'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PageHero } from '@/components/tbc/page-hero'
import { MemberCard } from '@/components/tbc/members-showcase'
import { Reveal } from '@/components/tbc/reveal'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface Member {
  id: string; name: string; business: string | null; category: string | null; city: string | null; description: string | null; photo: string | null
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => { fetch('/api/members').then(r => r.json()).then(setMembers) }, [])

  const categories = [...new Set(members.map(m => m.category).filter(Boolean))] as string[]
  const cities = [...new Set(members.map(m => m.city).filter(Boolean))] as string[]

  const filtered = members.filter(m => {
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || (m.business || '').toLowerCase().includes(search.toLowerCase())
    const matchCat = !category || m.category === category
    const matchCity = !cityFilter || m.city === cityFilter
    return matchSearch && matchCat && matchCity
  })

  const perPage = 12
  const paged = filtered.slice(0, page * perPage)

  return (
    <>
      <PageHero badge="Directory" title="Member Directory" subtitle="Browse the TBC member directory and connect with professionals across Chhattisgarh." />

      <section className="py-10 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="relative flex-1 min-w-0 sm:min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-tbc-gray" />
              <Input placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
            <select value={category} onChange={e => setCategory(e.target.value)} className="px-4 py-2 border rounded-md bg-white text-tbc-charcoal text-sm">
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} className="px-4 py-2 border rounded-md bg-white text-tbc-charcoal text-sm">
              <option value="">All Cities</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {paged.map((member, i) => (
              <Reveal key={member.id} delay={i * 40}>
                <MemberCard member={member} />
              </Reveal>
            ))}
          </div>

          {paged.length < filtered.length && (
            <div className="text-center mt-8">
              <button onClick={() => setPage(p => p + 1)} className="px-6 py-2.5 border border-tbc-red text-tbc-red rounded-md hover:bg-tbc-red hover:text-white transition-colors w-full sm:w-auto text-sm">
                Load More
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
