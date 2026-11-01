'use client'

import Link from 'next/link'
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react'
import { Reveal } from './reveal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface EventCardProps {
  event: {
    id: string
    title: string
    slug: string
    date: string
    time: string | null
    location: string | null
    type: string
    description: string | null
  }
}

const EVENT_TYPE_COLORS: Record<string, string> = {
  networking: 'bg-blue-100 text-blue-700',
  workshop: 'bg-green-100 text-green-700',
  seminar: 'bg-purple-100 text-purple-700',
  summit: 'bg-tbc-red-light text-tbc-red',
}

export function EventCard({ event }: EventCardProps) {
  const dateObj = new Date(event.date)
  const month = dateObj.toLocaleString('en', { month: 'short' }).toUpperCase()
  const day = dateObj.getDate()

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-tbc-red/20 overflow-hidden transition-all duration-300 group h-full flex flex-col">
      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="shrink-0 text-center bg-tbc-red-light rounded-lg p-2 sm:p-3 min-w-[48px] sm:min-w-[56px]">
            <div className="text-[10px] sm:text-xs font-bold text-tbc-red uppercase">{month}</div>
            <div className="text-xl sm:text-2xl font-bold text-tbc-charcoal">{day}</div>
          </div>
          <div className="min-w-0 flex-1">
            <Badge className={`${EVENT_TYPE_COLORS[event.type] || 'bg-gray-100 text-gray-700'} text-[10px] sm:text-xs mb-1.5 sm:mb-2`}>
              {event.type}
            </Badge>
            <h3 className="text-base sm:text-lg font-bold text-tbc-charcoal group-hover:text-tbc-red transition-colors line-clamp-2">
              {event.title}
            </h3>
          </div>
        </div>

        <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 text-xs sm:text-sm text-tbc-gray">
          {event.time && (
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-tbc-red shrink-0" />
              {event.time}
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-tbc-red shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>

        {event.description && (
          <p className="text-xs sm:text-sm text-tbc-gray line-clamp-2 mb-3 sm:mb-4">{event.description}</p>
        )}

        <div className="mt-auto flex gap-2">
          <Button asChild size="sm" variant="outline" className="border-tbc-red text-tbc-red hover:bg-tbc-red hover:text-white flex-1 text-xs sm:text-sm">
            <Link href={`/events/${event.slug}`}>Details</Link>
          </Button>
          <Button asChild size="sm" className="bg-tbc-red hover:bg-tbc-red-dark text-white flex-1 text-xs sm:text-sm">
            <Link href={`/events/${event.slug}`}>Register</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

interface EventsSectionProps {
  events: EventCardProps['event'][]
}

export function EventsSection({ events }: EventsSectionProps) {
  return (
    <section className="py-12 sm:py-16 lg:py-28 bg-tbc-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <span className="text-tbc-red font-semibold text-xs sm:text-sm uppercase tracking-wider">
              Upcoming
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-tbc-charcoal mt-2 sm:mt-3">
              Events & Workshops
            </h2>
            <p className="mt-3 sm:mt-4 text-tbc-gray text-sm sm:text-base max-w-2xl mx-auto">
              Join our networking meetings, workshops, and seminars designed to help
              you grow professionally and expand your business network.
            </p>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {events.slice(0, 3).map((event, i) => (
            <Reveal key={event.id} delay={i * 100}>
              <EventCard event={event} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={300}>
          <div className="text-center mt-8 sm:mt-10">
            <Button asChild variant="outline" className="border-tbc-red text-tbc-red hover:bg-tbc-red hover:text-white w-full sm:w-auto">
              <Link href="/events">
                View All Events <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
