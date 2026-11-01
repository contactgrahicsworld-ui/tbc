'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Reveal } from './reveal'
import { TBC } from '@/lib/tbc'

export function Hero() {
  return (
    <section className="relative min-h-[70vh] sm:min-h-[80vh] lg:min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero.jpg"
          alt="Business professionals networking at TBC event"
          fill
          className="object-cover object-center sm:object-center"
          priority
          quality={90}
        />
        {/* Mobile: darker overlay for readability, Desktop: side gradient */}
        <div className="absolute inset-0 bg-tbc-charcoal/80 sm:bg-gradient-to-r sm:from-tbc-charcoal/90 sm:via-tbc-charcoal/70 sm:to-tbc-red/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-2xl">
          <Reveal direction="up" delay={100}>
            <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 bg-tbc-red text-white text-xs sm:text-sm font-semibold rounded-full mb-4 sm:mb-6 uppercase tracking-wider">
              Business Networking Redefined
            </span>
          </Reveal>

          <Reveal direction="up" delay={200}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-4 sm:mb-6">
              Build Connections.{' '}
              <span className="text-tbc-red">Create Opportunities.</span>{' '}
              Grow Together.
            </h1>
          </Reveal>

          <Reveal direction="up" delay={300}>
            <p className="text-base sm:text-lg lg:text-xl text-gray-200 sm:text-gray-300 leading-relaxed mb-6 sm:mb-8 max-w-xl">
              {TBC.brandName} brings business professionals and entrepreneurs together
              to build trusted relationships, exchange opportunities and grow together.
            </p>
          </Reveal>

          <Reveal direction="up" delay={400}>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <Button
                asChild
                size="lg"
                className="bg-tbc-red hover:bg-tbc-red-dark text-white px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg shadow-xl shadow-tbc-red/20 w-full sm:w-auto"
              >
                <Link href="/join">Join TBC</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-tbc-charcoal px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg bg-white/10 backdrop-blur-sm w-full sm:w-auto"
              >
                <Link href="/chapters">Find a Chapter</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 bg-gradient-to-t from-white to-transparent" />
    </section>
  )
}
