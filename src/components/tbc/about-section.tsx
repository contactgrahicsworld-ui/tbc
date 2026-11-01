import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Reveal } from './reveal'

export function About() {
  return (
    <section className="py-12 sm:py-16 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Image */}
          <Reveal direction="right">
            <div className="relative">
              <div className="aspect-[4/3] sm:aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl">
                <Image
                  src="/images/about.jpg"
                  alt="Business professionals at TBC committee meeting"
                  fill
                  className="object-cover object-center"
                  quality={85}
                />
              </div>
              <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 w-16 h-16 sm:w-24 sm:h-24 bg-tbc-red rounded-lg sm:rounded-xl -z-10" />
              <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-10 h-10 sm:w-16 sm:h-16 bg-tbc-red-light rounded-lg sm:rounded-xl -z-10" />
            </div>
          </Reveal>

          {/* Content */}
          <Reveal direction="left">
            <div>
              <span className="text-tbc-red font-semibold text-xs sm:text-sm uppercase tracking-wider">
                About TBC
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-tbc-charcoal mt-2 sm:mt-3 mb-4 sm:mb-6">
                More Than Networking
              </h2>
              <p className="text-tbc-gray text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">
                Tailik Business Committee is not just another networking group — it is a
                structured ecosystem where business professionals and entrepreneurs come
                together with a shared purpose: to build lasting, trust-based relationships
                that drive real business results.
              </p>
              <p className="text-tbc-gray text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">
                Through weekly chapter meetings, structured referral systems, and a culture
                of accountability, TBC members create opportunities for each other that
                go far beyond what individual effort can achieve. Every connection is built
                on trust, every referral is backed by personal reputation, and every
                success is celebrated as a collective achievement.
              </p>
              <p className="text-tbc-gray text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
                Our members represent over 45 business categories across multiple cities,
                ensuring diverse expertise and comprehensive professional coverage. When
                you join TBC, you do not just gain a network — you gain a dedicated team
                of professionals committed to your growth.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                <Button
                  asChild
                  className="bg-tbc-red hover:bg-tbc-red-dark text-white w-full sm:w-auto"
                >
                  <Link href="/about">Learn More</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-tbc-red text-tbc-red hover:bg-tbc-red hover:text-white w-full sm:w-auto"
                >
                  <Link href="/how-it-works">How It Works</Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
