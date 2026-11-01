'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Phone } from 'lucide-react'
import { TBC, NAV_ITEMS } from '@/lib/tbc'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100'
          : 'bg-white shadow-sm'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Image
              src="/tbc-logo.png"
              alt="TBC — Tailik Business Committee"
              width={56}
              height={56}
              className="h-10 w-auto sm:h-12 lg:h-14"
              priority
            />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-lg sm:text-xl lg:text-2xl font-bold text-tbc-red tracking-tight">TBC</span>
              <span className="text-[9px] sm:text-[10px] lg:text-sm text-tbc-gray font-medium leading-none">Tailik Business Committee</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-tbc-charcoal hover:text-tbc-red transition-colors duration-200 rounded-md hover:bg-tbc-red-light/50"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${TBC.phone}`}
              className="flex items-center gap-1.5 text-sm text-tbc-gray hover:text-tbc-red transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden xl:inline">{TBC.phone}</span>
            </a>
            <Button asChild className="bg-tbc-red hover:bg-tbc-red-dark text-white shadow-md">
              <Link href="/join">Join TBC</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href={`tel:${TBC.phone}`}
              className="p-2 text-tbc-gray hover:text-tbc-red"
              aria-label="Call TBC"
            >
              <Phone className="h-5 w-5" />
            </a>
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button
                  className="p-2 text-tbc-charcoal hover:text-tbc-red"
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[300px] p-0">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/tbc-logo.png"
                        alt="TBC"
                        width={40}
                        height={40}
                        className="h-9 w-auto"
                      />
                      <div className="flex flex-col leading-tight">
                        <span className="text-base font-bold text-tbc-red">TBC</span>
                        <span className="text-[9px] text-tbc-gray font-medium leading-none">Tailik Business Committee</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setMobileOpen(false)}
                      className="p-2 text-tbc-gray hover:text-tbc-red"
                      aria-label="Close menu"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Mobile Nav Links */}
                  <nav className="flex-1 overflow-y-auto p-4">
                    <ul className="space-y-1">
                      {NAV_ITEMS.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className="block px-4 py-3 text-sm sm:text-base font-medium text-tbc-charcoal hover:text-tbc-red hover:bg-tbc-red-light/50 rounded-lg transition-colors"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  {/* Mobile CTA */}
                  <div className="p-4 border-t space-y-3">
                    <Button asChild className="w-full bg-tbc-red hover:bg-tbc-red-dark text-white text-sm">
                      <Link href="/join" onClick={() => setMobileOpen(false)}>
                        Join TBC
                      </Link>
                    </Button>
                    <a
                      href={`https://wa.me/${TBC.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-md border-2 border-tbc-red text-tbc-red text-sm font-medium hover:bg-tbc-red hover:text-white transition-colors"
                    >
                      WhatsApp TBC
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
