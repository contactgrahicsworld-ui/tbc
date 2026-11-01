import Image from 'next/image'
import Link from 'next/link'
import { PageHero } from '@/components/tbc/page-hero'
import { Reveal } from '@/components/tbc/reveal'
import { Button } from '@/components/ui/button'

export default function AboutPage() {
  return (
    <>
      <PageHero
        badge="About TBC"
        title="Tailik Business Committee"
        subtitle="Building trusted business relationships that drive real results across Chhattisgarh."
      />

      <section className="py-10 sm:py-14 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <Reveal direction="right">
              <div className="aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl">
                <Image src="/images/about.jpg" alt="TBC business meeting" fill className="object-cover object-center" />
              </div>
            </Reveal>
            <Reveal direction="left">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-tbc-charcoal mb-4 sm:mb-6">Our Story</h2>
                <p className="text-tbc-gray text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">
                  Tailik Business Committee was founded with a singular vision: to create a
                  structured ecosystem where business professionals and entrepreneurs in
                  Chhattisgarh could come together, build trusted relationships, and grow
                  their businesses through the power of collective effort and mutual support.
                </p>
                <p className="text-tbc-gray text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">
                  Unlike informal networking groups, TBC operates on a structured referral
                  system where every connection is built on trust, every referral carries
                  personal endorsement, and every member is accountable for the value they
                  bring to the network. This systematic approach ensures consistent,
                  measurable results for all members.
                </p>
                <p className="text-tbc-gray text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
                  Today, TBC spans multiple cities across Chhattisgarh with chapters in
                  Raipur, Bilaspur, Durg, Korba, and Bhilai, connecting professionals from
                  over 45 business categories. Our members consistently report significant
                  business growth through the referrals, partnerships, and opportunities
                  generated within their chapters.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14 lg:py-24 bg-tbc-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-tbc-charcoal">Our Mission & Values</h2>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              { title: 'Trust First', desc: 'Every relationship in TBC is built on a foundation of trust. We believe that trust is the currency of business, and our structured system ensures it is earned and maintained through consistent action and accountability.' },
              { title: 'Givers Gain', desc: 'The principle of "givers gain" is at the core of TBC. Members who actively give referrals, support, and value to others receive the same in return. This creates a virtuous cycle of mutual benefit and collective growth.' },
              { title: 'Accountability', desc: 'TBC holds members accountable through weekly meetings, tracked referrals, and measurable goals. This accountability system ensures that every member is actively contributing and receiving value from their membership.' },
            ].map((val, i) => (
              <Reveal key={val.title} delay={i * 100}>
                <div className="bg-white rounded-xl p-5 sm:p-6 lg:p-8 shadow-sm border border-gray-100 h-full">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-tbc-red rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                    <span className="text-white font-bold text-base sm:text-lg">{i + 1}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-tbc-charcoal mb-2 sm:mb-3">{val.title}</h3>
                  <p className="text-tbc-gray text-sm sm:text-base leading-relaxed">{val.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <Reveal direction="right">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-tbc-charcoal mb-4 sm:mb-6">Leadership & Vision</h2>
                <p className="text-tbc-gray text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">
                  TBC is led by experienced business professionals who understand the
                  challenges of entrepreneurship and the power of structured networking.
                  Our leadership team brings decades of combined business experience across
                  multiple industries, ensuring that TBC&apos;s programs and structure are
                  designed for maximum impact.
                </p>
                <p className="text-tbc-gray text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
                  Each chapter is guided by a dedicated leadership committee that ensures
                  the quality of meetings, facilitates member engagement, and drives the
                  culture of trust and accountability that makes TBC unique.
                </p>
                <Button asChild className="bg-tbc-red hover:bg-tbc-red-dark text-white w-full sm:w-auto">
                  <Link href="/join">Join TBC</Link>
                </Button>
              </div>
            </Reveal>
            <Reveal direction="left">
              <div className="aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl">
                <Image src="/images/networking.jpg" alt="TBC networking" fill className="object-cover object-center" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
