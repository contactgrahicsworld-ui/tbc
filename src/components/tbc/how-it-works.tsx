import Link from 'next/link'
import { Search, Users, TrendingUp } from 'lucide-react'
import { Reveal } from './reveal'
import { Button } from '@/components/ui/button'

const steps = [
  {
    number: '01',
    icon: <Search className="h-8 w-8 sm:h-10 sm:w-10" />,
    title: 'Discover',
    description: 'Find a TBC chapter near you and attend a meeting as a visitor. Experience the structured networking format firsthand and meet professionals from diverse business categories.',
  },
  {
    number: '02',
    icon: <Users className="h-8 w-8 sm:h-10 sm:w-10" />,
    title: 'Connect',
    description: 'Build meaningful professional relationships through weekly meetings, one-to-one interactions, and structured referral activities. Trust grows with every connection you make.',
  },
  {
    number: '03',
    icon: <TrendingUp className="h-8 w-8 sm:h-10 sm:w-10" />,
    title: 'Grow',
    description: 'Create opportunities, receive quality referrals, and collaborate with fellow members. Watch your business grow through the power of a trusted professional network.',
  },
]

export function HowItWorks() {
  return (
    <section className="py-12 sm:py-16 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <span className="text-tbc-red font-semibold text-xs sm:text-sm uppercase tracking-wider">
              The Process
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-tbc-charcoal mt-2 sm:mt-3">
              How TBC Works
            </h2>
            <p className="mt-3 sm:mt-4 text-tbc-gray text-sm sm:text-base max-w-2xl mx-auto">
              Three simple steps to transform your business through the power of
              structured professional networking.
            </p>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 150}>
              <div className="text-center group">
                <div className="relative mx-auto mb-4 sm:mb-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-tbc-red-light flex items-center justify-center mx-auto group-hover:bg-tbc-red transition-colors duration-300">
                    <span className="text-tbc-red group-hover:text-white transition-colors duration-300">
                      {step.icon}
                    </span>
                  </div>
                  <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-7 h-7 sm:w-8 sm:h-8 bg-tbc-red text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-tbc-charcoal mb-2 sm:mb-4">
                  {step.title}
                </h3>
                <p className="text-tbc-gray text-sm sm:text-base leading-relaxed">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={400}>
          <div className="text-center mt-8 sm:mt-12">
            <Button
              asChild
              className="bg-tbc-red hover:bg-tbc-red-dark text-white px-6 sm:px-8 w-full sm:w-auto"
            >
              <Link href="/how-it-works">Learn More About How TBC Works</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
