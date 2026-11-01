'use client'

import Link from 'next/link'
import { MapPin, ArrowRight } from 'lucide-react'
import { Reveal } from './reveal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface MemberCardProps {
  member: {
    id: string
    name: string
    business: string | null
    category: string | null
    city: string | null
    description: string | null
    photo: string | null
  }
}

export function MemberCard({ member }: MemberCardProps) {
  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-tbc-red/20 p-4 sm:p-6 transition-all duration-300 group h-full flex flex-col">
      <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
        <Avatar className="h-11 w-11 sm:h-14 sm:w-14 shrink-0">
          <AvatarFallback className="bg-tbc-red-light text-tbc-red font-semibold text-sm sm:text-lg">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h3 className="font-bold text-sm sm:text-base text-tbc-charcoal group-hover:text-tbc-red transition-colors truncate">
            {member.name}
          </h3>
          {member.business && (
            <p className="text-xs sm:text-sm text-tbc-gray truncate">{member.business}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 flex-1">
        {member.category && (
          <Badge variant="secondary" className="bg-tbc-red-light text-tbc-red text-[10px] sm:text-xs">
            {member.category}
          </Badge>
        )}
        {member.city && (
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-tbc-gray">
            <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-tbc-red" />
            {member.city}
          </div>
        )}
        {member.description && (
          <p className="text-xs sm:text-sm text-tbc-gray line-clamp-2 mt-1 sm:mt-2">{member.description}</p>
        )}
      </div>

      <Button asChild size="sm" variant="outline" className="border-tbc-red text-tbc-red hover:bg-tbc-red hover:text-white w-full mt-auto text-xs sm:text-sm">
        <Link href={`/members/${member.id}`}>View Profile</Link>
      </Button>
    </div>
  )
}

interface MembersShowcaseProps {
  members: MemberCardProps['member'][]
}

export function MembersShowcase({ members }: MembersShowcaseProps) {
  return (
    <section className="py-12 sm:py-16 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <span className="text-tbc-red font-semibold text-xs sm:text-sm uppercase tracking-wider">
              Our Network
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-tbc-charcoal mt-2 sm:mt-3">
              TBC Members
            </h2>
            <p className="mt-3 sm:mt-4 text-tbc-gray text-sm sm:text-base max-w-2xl mx-auto">
              Meet the professionals who make TBC a powerful business networking force
              across Chhattisgarh.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {members.slice(0, 8).map((member, i) => (
            <Reveal key={member.id} delay={i * 80}>
              <MemberCard member={member} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={300}>
          <div className="text-center mt-8 sm:mt-10">
            <Button asChild variant="outline" className="border-tbc-red text-tbc-red hover:bg-tbc-red hover:text-white w-full sm:w-auto">
              <Link href="/members">
                View All Members <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
