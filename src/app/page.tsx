import { db } from '@/lib/db'
import { Hero } from '@/components/tbc/hero'
import { Stats } from '@/components/tbc/stats'
import { About } from '@/components/tbc/about-section'
import { Benefits } from '@/components/tbc/benefits'
import { HowItWorks } from '@/components/tbc/how-it-works'
import { ChapterFinder } from '@/components/tbc/chapter-finder'
import { MembersShowcase } from '@/components/tbc/members-showcase'
import { BusinessGrowth } from '@/components/tbc/business-growth'
import { EventsSection } from '@/components/tbc/events-section'
import { Testimonials } from '@/components/tbc/testimonials'
import { FinalCTA } from '@/components/tbc/final-cta'
import { ContactSection } from '@/components/tbc/contact-section'

// Always render fresh: the homepage lists live chapters, members, events
// and testimonials managed from the Admin Panel.
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [chapters, members, events, testimonials] = await Promise.all([
    db.chapter.findMany({ where: { active: true }, orderBy: { createdAt: 'asc' } }),
    db.member.findMany({ where: { active: true }, orderBy: { createdAt: 'desc' } }),
    db.event.findMany({ where: { active: true }, orderBy: { date: 'asc' } }),
    db.testimonial.findMany({ orderBy: { createdAt: 'desc' } }),
  ])

  return (
    <>
      <Hero />
      <Stats />
      <About />
      <Benefits />
      <HowItWorks />
      <ChapterFinder chapters={chapters} />
      <MembersShowcase members={members} />
      <BusinessGrowth />
      <EventsSection events={events} />
      <Testimonials testimonials={testimonials} />
      <FinalCTA />
      <ContactSection />
    </>
  )
}
