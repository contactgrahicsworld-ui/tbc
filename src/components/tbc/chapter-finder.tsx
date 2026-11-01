'use client'

import Link from 'next/link'
import { MapPin, Clock, Calendar, ArrowRight } from 'lucide-react'
import { Reveal } from './reveal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Chapter } from '@prisma/client'

interface ChapterCardProps {
  chapter: {
    id: string
    name: string
    slug: string
    location: string
    city: string
    area: string | null
    meetingDay: string
    meetingTime: string
    description: string | null
    categories: string | null
  }
}

export function ChapterCard({ chapter }: ChapterCardProps) {
  const categoryList = chapter.categories ? chapter.categories.split(',').slice(0, 4) : []

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-tbc-red/20 overflow-hidden transition-all duration-300 group h-full flex flex-col">
      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        <h3 className="text-base sm:text-lg font-bold text-tbc-charcoal group-hover:text-tbc-red transition-colors mb-2">
          {chapter.name}
        </h3>
        <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 text-xs sm:text-sm text-tbc-gray">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-tbc-red shrink-0" />
            <span className="truncate">{chapter.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-tbc-red shrink-0" />
            {chapter.meetingDay}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-tbc-red shrink-0" />
            {chapter.meetingTime}
          </div>
        </div>
        {chapter.description && (
          <p className="text-xs sm:text-sm text-tbc-gray mb-3 sm:mb-4 line-clamp-2">{chapter.description}</p>
        )}
        {categoryList.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-4">
            {categoryList.map((cat) => (
              <Badge key={cat} variant="secondary" className="text-[10px] sm:text-xs bg-tbc-red-light text-tbc-red hover:bg-tbc-red-light">
                {cat.trim()}
              </Badge>
            ))}
          </div>
        )}
        <div className="mt-auto flex gap-2">
          <Button asChild size="sm" variant="outline" className="border-tbc-red text-tbc-red hover:bg-tbc-red hover:text-white flex-1 text-xs sm:text-sm">
            <Link href={`/chapters/${chapter.slug}`}>Visit</Link>
          </Button>
          <Button asChild size="sm" className="bg-tbc-red hover:bg-tbc-red-dark text-white flex-1 text-xs sm:text-sm">
            <Link href={`/visitor?chapterId=${chapter.id}`}>Apply</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

interface ChapterFinderProps {
  chapters: ChapterCardProps['chapter'][]
}

export function ChapterFinder({ chapters }: ChapterFinderProps) {
  return (
    <section className="py-12 sm:py-16 lg:py-28 bg-tbc-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <span className="text-tbc-red font-semibold text-xs sm:text-sm uppercase tracking-wider">
              Find Your Chapter
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-tbc-charcoal mt-2 sm:mt-3">
              TBC Chapters
            </h2>
            <p className="mt-3 sm:mt-4 text-tbc-gray text-sm sm:text-base max-w-2xl mx-auto">
              Discover a TBC chapter near you and start your journey toward building
              trusted professional relationships.
            </p>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {chapters.slice(0, 6).map((chapter, i) => (
            <Reveal key={chapter.id} delay={i * 100}>
              <ChapterCard chapter={chapter} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={300}>
          <div className="text-center mt-8 sm:mt-10">
            <Button asChild variant="outline" className="border-tbc-red text-tbc-red hover:bg-tbc-red hover:text-white w-full sm:w-auto">
              <Link href="/chapters">
                View All Chapters <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
