import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Briefcase, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHero } from '@/components/tbc/page-hero'
import { Reveal } from '@/components/tbc/reveal'

interface Props { params: Promise<{ id: string }> }

export default async function MemberDetailPage({ params }: Props) {
  const { id } = await params
  const member = await db.member.findUnique({
    where: { id },
    include: { chapter: { select: { name: true, slug: true } } },
  })

  if (!member) notFound()

  const initials = member.name.split(' ').map(n => n[0]).join('').slice(0, 2)

  return (
    <>
      <PageHero badge="Member Profile" title={member.name} subtitle={member.business || 'TBC Member'} />

      <section className="py-12 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
                <div className="w-24 h-24 bg-tbc-red rounded-2xl flex items-center justify-center text-white font-bold text-3xl shrink-0">
                  {initials}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-tbc-charcoal">{member.name}</h1>
                  {member.business && <p className="text-tbc-gray">{member.business}</p>}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {member.category && <Badge className="bg-tbc-red-light text-tbc-red">{member.category}</Badge>}
                    {member.chapter && <Badge variant="outline" className="border-tbc-red text-tbc-red">{member.chapter.name}</Badge>}
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                {member.profession && (
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-tbc-red" />
                    <div><p className="text-xs text-tbc-gray">Profession</p><p className="font-medium text-tbc-charcoal">{member.profession}</p></div>
                  </div>
                )}
                {member.city && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-tbc-red" />
                    <div><p className="text-xs text-tbc-gray">Location</p><p className="font-medium text-tbc-charcoal">{member.city}</p></div>
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-tbc-red" />
                    <div><p className="text-xs text-tbc-gray">Phone</p><p className="font-medium text-tbc-charcoal">{member.phone}</p></div>
                  </div>
                )}
                {member.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-tbc-red" />
                    <div><p className="text-xs text-tbc-gray">Email</p><p className="font-medium text-tbc-charcoal">{member.email}</p></div>
                  </div>
                )}
              </div>

              {member.description && (
                <div className="mb-8">
                  <h3 className="font-bold text-tbc-charcoal mb-2">About</h3>
                  <p className="text-tbc-gray leading-relaxed">{member.description}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button asChild className="bg-tbc-red hover:bg-tbc-red-dark text-white">
                  <Link href="/members">Back to Directory</Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
