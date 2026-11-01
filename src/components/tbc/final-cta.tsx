import Link from 'next/link'
import { Reveal } from './reveal'
import { Button } from '@/components/ui/button'

export function FinalCTA() {
  return (
    <section className="relative py-14 sm:py-20 lg:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-tbc-red" />
      <div className="absolute inset-0 bg-gradient-to-br from-tbc-red via-tbc-red-dark to-tbc-charcoal/80" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full border-2 border-white/20" />
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full border-2 border-white/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-white/10" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Reveal>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mb-4 sm:mb-6">
            Ready to Grow Your Business Through Better Connections?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/80 max-w-2xl mx-auto mb-6 sm:mb-8">
            Join TBC today and become part of a trusted network of professionals
            committed to mutual growth and success.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
            <Button
              asChild
              size="lg"
              className="bg-white text-tbc-red hover:bg-gray-100 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-bold shadow-xl w-full sm:w-auto"
            >
              <Link href="/join">Join TBC</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg bg-white/5 backdrop-blur-sm w-full sm:w-auto"
            >
              <Link href="/chapters">Find a Chapter</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
