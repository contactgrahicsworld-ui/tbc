import Link from 'next/link'
import { PageHero } from '@/components/tbc/page-hero'
import { Reveal } from '@/components/tbc/reveal'
import { Button } from '@/components/ui/button'

const steps = [
  { step: 1, title: 'Visit a Chapter', desc: 'Find a TBC chapter near you and attend a meeting as a visitor. Experience the structured format, meet the members, and see firsthand how TBC creates business opportunities through trusted relationships.' },
  { step: 2, title: 'Apply for Membership', desc: 'If you find the right fit, submit your membership application. Each chapter maintains one member per business category, ensuring you have exclusive access to referrals in your profession.' },
  { step: 3, title: 'Attend Weekly Meetings', desc: 'As a member, attend weekly chapter meetings where you will present your business, learn about others, exchange referrals, and build deeper relationships with fellow professionals.' },
  { step: 4, title: 'Build One-to-One Relationships', desc: 'Schedule individual meetings with fellow members outside of chapter meetings. These one-to-one interactions are where trust deepens and the most valuable referrals originate.' },
  { step: 5, title: 'Give & Receive Referrals', desc: 'Actively look for opportunities to refer fellow members to your contacts. The more you give, the more you receive. TBC tracks all referrals, ensuring accountability and measurable results.' },
  { step: 6, title: 'Grow Your Business', desc: 'Watch your business grow through the power of a trusted network. Access workshops, mentorship, and collaborative opportunities that amplify your individual efforts manifold.' },
]

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        badge="The Process"
        title="How TBC Works"
        subtitle="A structured approach to business networking that delivers consistent, measurable results."
      />

      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {steps.map((s, i) => (
              <Reveal key={s.step} delay={i * 80}>
                <div className="flex gap-6 items-start">
                  <div className="shrink-0 w-14 h-14 bg-tbc-red rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-tbc-red/20">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-tbc-charcoal mb-2">{s.title}</h3>
                    <p className="text-tbc-gray leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-tbc-light-gray">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="text-3xl font-bold text-tbc-charcoal mb-6">Ready to Get Started?</h2>
            <p className="text-tbc-gray mb-8 max-w-2xl mx-auto">
              Take the first step toward transforming your business through the power of
              trusted professional networking. Visit a TBC chapter today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild className="bg-tbc-red hover:bg-tbc-red-dark text-white px-8">
                <Link href="/join">Join TBC</Link>
              </Button>
              <Button asChild variant="outline" className="border-tbc-red text-tbc-red hover:bg-tbc-red hover:text-white px-8">
                <Link href="/visitor">Visit a Chapter</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
