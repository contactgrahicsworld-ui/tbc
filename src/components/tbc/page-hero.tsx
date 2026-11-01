interface PageHeroProps {
  title: string
  subtitle?: string
  badge?: string
}

export function PageHero({ title, subtitle, badge }: PageHeroProps) {
  return (
    <section className="relative pt-24 sm:pt-28 pb-10 sm:pb-12 lg:pt-36 lg:pb-16 bg-tbc-charcoal overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-tbc-charcoal via-tbc-charcoal to-tbc-red/20" />
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-5 right-10 w-40 h-40 rounded-full border border-white/20" />
        <div className="absolute bottom-5 left-10 w-60 h-60 rounded-full border border-white/10" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {badge && (
          <span className="inline-block px-2.5 py-1 sm:px-3 sm:py-1 bg-tbc-red text-white text-[10px] sm:text-xs font-semibold rounded-full mb-3 sm:mb-4 uppercase tracking-wider">
            {badge}
          </span>
        )}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white">{title}</h1>
        {subtitle && (
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-300 max-w-2xl">{subtitle}</p>
        )}
      </div>
    </section>
  )
}
