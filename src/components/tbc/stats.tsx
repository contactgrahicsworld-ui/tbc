'use client'

import { useEffect, useRef, useState } from 'react'
import { Users, MapPin, Briefcase, Handshake, TrendingUp } from 'lucide-react'
import { Reveal } from './reveal'

interface StatItem {
  icon: React.ReactNode
  value: number
  suffix: string
  label: string
}

const STATS: StatItem[] = [
  { icon: <Users className="h-5 w-5 sm:h-6 sm:w-6" />, value: 500, suffix: '+', label: 'Members' },
  { icon: <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />, value: 12, suffix: '', label: 'Chapters' },
  { icon: <Briefcase className="h-5 w-5 sm:h-6 sm:w-6" />, value: 45, suffix: '+', label: 'Categories' },
  { icon: <Handshake className="h-5 w-5 sm:h-6 sm:w-6" />, value: 2500, suffix: '+', label: 'Connections' },
  { icon: <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />, value: 1800, suffix: '+', label: 'Referrals' },
]

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const counted = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true
          const duration = 2000
          const steps = 60
          const increment = target / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= target) {
              setCount(target)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref} className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-tbc-red">
      {count.toLocaleString()}{suffix}
    </span>
  )
}

export function Stats() {
  return (
    <section className="py-10 sm:py-14 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center text-center p-4 sm:p-6 rounded-xl hover:bg-tbc-red-light/50 transition-colors group"
              >
                <div className="mb-2 sm:mb-3 text-tbc-red group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <Counter target={stat.value} suffix={stat.suffix} />
                <span className="mt-1 sm:mt-2 text-xs sm:text-sm text-tbc-gray font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
