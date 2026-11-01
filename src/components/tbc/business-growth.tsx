import Image from 'next/image'
import Link from 'next/link'
import { Reveal } from './reveal'
import { Button } from '@/components/ui/button'

export function BusinessGrowth() {
  return (
    <section className="py-12 sm:py-16 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Content */}
          <Reveal direction="right">
            <div>
              <span className="text-tbc-red font-semibold text-xs sm:text-sm uppercase tracking-wider">
                Real Results
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-tbc-charcoal mt-2 sm:mt-3 mb-4 sm:mb-6">
                Grow Your Business Through Trusted Connections
              </h2>
              <p className="text-tbc-gray text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">
                TBC members do not just exchange business cards — they build lasting
                partnerships founded on trust and mutual respect. Our structured approach
                to networking ensures that every referral carries the weight of personal
                endorsement, creating significantly higher conversion rates than
                traditional lead generation.
              </p>
              <p className="text-tbc-gray text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">
                Through weekly accountability, members track and measure the real impact
                of their TBC connections. The results speak for themselves: businesses
                in TBC chapters consistently report higher growth rates, stronger client
                relationships, and expanded market reach compared to solo networking efforts.
              </p>
              <p className="text-tbc-gray text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
                Whether you are a seasoned entrepreneur or just starting out, TBC provides
                the ecosystem, mentorship, and professional support system you need to
                take your business to the next level.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                <Button asChild className="bg-tbc-red hover:bg-tbc-red-dark text-white w-full sm:w-auto">
                  <Link href="/join">Join TBC</Link>
                </Button>
                <Button asChild variant="outline" className="border-tbc-red text-tbc-red hover:bg-tbc-red hover:text-white w-full sm:w-auto">
                  <Link href="/visitor">Visit a Chapter</Link>
                </Button>
              </div>
            </div>
          </Reveal>

          {/* Image */}
          <Reveal direction="left">
            <div className="relative">
              <div className="aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl">
                <Image
                  src="/images/business-growth.jpg"
                  alt="Business growth through TBC networking connections"
                  fill
                  className="object-cover object-center"
                  quality={85}
                />
              </div>
              <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 w-16 h-16 sm:w-24 sm:h-24 bg-tbc-red rounded-lg sm:rounded-xl -z-10" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
