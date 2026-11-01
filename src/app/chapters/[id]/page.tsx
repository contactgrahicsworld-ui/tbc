import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Calendar, Clock, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHero } from '@/components/tbc/page-hero'
import { Reveal } from '@/components/tbc/reveal'

interface Props { params: Promise<{ id: string }> }

export default async function ChapterDetailPage({ params }: Props) {
  const { id } = await params
  const chapter = await db.chapter.findUnique({
    where: { slug: id },
    include: {
      members: { where: { active: true }, orderBy: { name: 'asc' } },
    },
  })

  if (!chapter) notFound()

  const categories = chapter.categories ? chapter.categories.split(',') : []

  return (
    <>
      <PageHero badge="Chapter" title={chapter.name} subtitle={`${chapter.city} — ${chapter.meetingDay} at ${chapter.meetingTime}`} />

      <section className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <Reveal>
                <div className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold text-tbc-charcoal mb-4">About This Chapter</h2>
                  <p className="text-tbc-gray leading-relaxed">{chapter.description || 'Contact us for more details about this chapter.'}</p>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <div className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold text-tbc-charcoal mb-4">Members ({chapter.members.length})</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {chapter.members.map(m => (
                      <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-tbc-light-gray transition-colors">
                        <div className="w-10 h-10 bg-tbc-red-light rounded-full flex items-center justify-center text-tbc-red font-semibold text-sm shrink-0">
                          {m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-tbc-charcoal truncate">{m.name}</p>
                          <p className="text-xs text-tbc-gray truncate">{m.business}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Reveal direction="left">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4 sticky top-24">
                  <h3 className="font-bold text-tbc-charcoal">Meeting Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-tbc-red shrink-0" />{chapter.location}</div>
                    <div className="flex items-center gap-3"><Calendar className="h-4 w-4 text-tbc-red shrink-0" />{chapter.meetingDay}</div>
                    <div className="flex items-center gap-3"><Clock className="h-4 w-4 text-tbc-red shrink-0" />{chapter.meetingTime}</div>
                    <div className="flex items-center gap-3"><Users className="h-4 w-4 text-tbc-red shrink-0" />{chapter.members.length} Members</div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-tbc-charcoal mb-2">Categories</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {categories.map(cat => (
                        <Badge key={cat} variant="secondary" className="bg-tbc-red-light text-tbc-red text-xs">{cat.trim()}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Button asChild className="w-full bg-tbc-red hover:bg-tbc-red-dark text-white">
                      <Link href={`/visitor?chapterId=${chapter.id}`}>Visit This Chapter</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full border-tbc-red text-tbc-red hover:bg-tbc-red hover:text-white">
                      <Link href="/join">Apply for Membership</Link>
                    </Button>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
