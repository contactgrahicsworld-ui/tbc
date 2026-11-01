import { Users, Lightbulb, ArrowRightLeft, BookOpen, Handshake } from 'lucide-react'
import { Reveal } from './reveal'

const benefits = [
  {
    icon: <Users className="h-7 w-7 sm:h-8 sm:w-8" />,
    title: 'Build Relationships',
    description: 'Form deep, trust-based professional relationships that go beyond surface-level networking and create lasting business partnerships.',
  },
  {
    icon: <Lightbulb className="h-7 w-7 sm:h-8 sm:w-8" />,
    title: 'Generate Opportunities',
    description: 'Discover business opportunities through structured referral systems where every connection is pre-qualified and trusted.',
  },
  {
    icon: <ArrowRightLeft className="h-7 w-7 sm:h-8 sm:w-8" />,
    title: 'Exchange Referrals',
    description: 'Give and receive quality business referrals through a systematic approach that ensures accountability and measurable results.',
  },
  {
    icon: <BookOpen className="h-7 w-7 sm:h-8 sm:w-8" />,
    title: 'Learn & Grow',
    description: 'Access workshops, seminars, and mentorship from experienced professionals who share knowledge and best practices.',
  },
  {
    icon: <Handshake className="h-7 w-7 sm:h-8 sm:w-8" />,
    title: 'Collaborate',
    description: 'Find collaboration partners across 45+ business categories, creating synergies that amplify individual strengths.',
  },
]

export function Benefits() {
  return (
    <section className="py-12 sm:py-16 lg:py-28 bg-tbc-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <span className="text-tbc-red font-semibold text-xs sm:text-sm uppercase tracking-wider">
              Why TBC
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-tbc-charcoal mt-2 sm:mt-3">
              Benefits of Membership
            </h2>
            <p className="mt-3 sm:mt-4 text-tbc-gray text-sm sm:text-base max-w-2xl mx-auto">
              TBC membership provides a structured framework for professional growth,
              built on trust, accountability, and mutual support.
            </p>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {benefits.map((benefit, i) => (
            <Reveal key={benefit.title} delay={i * 100}>
              <div className="bg-white rounded-xl p-5 sm:p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-300 group border border-gray-100 hover:border-tbc-red/20 h-full">
                <div className="mb-3 sm:mb-4 text-tbc-red group-hover:scale-110 transition-transform inline-block">
                  {benefit.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-tbc-charcoal mb-2 sm:mb-3">
                  {benefit.title}
                </h3>
                <p className="text-tbc-gray text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
