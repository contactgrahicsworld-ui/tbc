import { Quote } from 'lucide-react'
import { Reveal } from './reveal'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface TestimonialCardProps {
  testimonial: {
    name: string
    business: string | null
    category: string | null
    quote: string
    photo: string | null
  }
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const initials = testimonial.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8 transition-all duration-300 h-full flex flex-col">
      <Quote className="h-6 w-6 sm:h-8 sm:w-8 text-tbc-red/20 mb-3 sm:mb-4 shrink-0" />
      <blockquote className="text-tbc-gray text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 flex-1 italic">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <div className="flex items-center gap-3 mt-auto">
        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 shrink-0">
          <AvatarFallback className="bg-tbc-red text-white font-semibold text-sm sm:text-base">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="font-bold text-sm sm:text-base text-tbc-charcoal truncate">{testimonial.name}</p>
          {testimonial.business && (
            <p className="text-xs sm:text-sm text-tbc-gray truncate">{testimonial.business}</p>
          )}
          {testimonial.category && (
            <p className="text-[10px] sm:text-xs text-tbc-red font-medium">{testimonial.category}</p>
          )}
        </div>
      </div>
    </div>
  )
}

interface TestimonialsProps {
  testimonials: TestimonialCardProps['testimonial'][]
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section className="py-12 sm:py-16 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <span className="text-tbc-red font-semibold text-xs sm:text-sm uppercase tracking-wider">
              Testimonials
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-tbc-charcoal mt-2 sm:mt-3">
              What Our Members Say
            </h2>
            <p className="mt-3 sm:mt-4 text-tbc-gray text-sm sm:text-base max-w-2xl mx-auto">
              Real experiences from TBC members who have transformed their businesses
              through the power of trusted networking.
            </p>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {testimonials.slice(0, 3).map((t, i) => (
            <Reveal key={t.name} delay={i * 100}>
              <TestimonialCard testimonial={t} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
