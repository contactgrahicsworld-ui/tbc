'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PageHero } from '@/components/tbc/page-hero'
import { Reveal } from '@/components/tbc/reveal'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, ArrowRight, BookOpen } from 'lucide-react'

interface Article { id: string; title: string; slug: string; excerpt: string | null; category: string | null; author: string | null; createdAt: string }

export default function ResourcesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => { fetch('/api/resources').then(r => r.json()).then(setArticles) }, [])

  const filtered = articles.filter(a => !search || a.title.toLowerCase().includes(search.toLowerCase()) || (a.excerpt || '').toLowerCase().includes(search.toLowerCase()))

  return (
    <>
      <PageHero badge="Resources" title="Resources & Insights" subtitle="Articles, tips, and insights to help you grow your business and maximize your TBC membership." />

      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative max-w-md mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-tbc-gray" />
            <Input placeholder="Search articles..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((article, i) => (
              <Reveal key={article.id} delay={i * 60}>
                <Link href={`/resources/${article.slug}`} className="group block">
                  <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg border border-gray-100 hover:border-tbc-red/20 transition-all duration-300 h-full">
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="h-4 w-4 text-tbc-red" />
                      {article.category && <Badge variant="secondary" className="bg-tbc-red-light text-tbc-red text-xs">{article.category}</Badge>}
                    </div>
                    <h3 className="text-lg font-bold text-tbc-charcoal group-hover:text-tbc-red transition-colors mb-2 line-clamp-2">{article.title}</h3>
                    {article.excerpt && <p className="text-sm text-tbc-gray line-clamp-3 mb-3">{article.excerpt}</p>}
                    <span className="text-sm text-tbc-red font-medium inline-flex items-center gap-1">
                      Read More <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
