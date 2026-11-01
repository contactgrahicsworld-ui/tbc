import Link from 'next/link'
import Image from 'next/image'
import { Phone, MapPin, Mail, ShieldCheck } from 'lucide-react'
import { TBC, NAV_ITEMS } from '@/lib/tbc'

const footerLinks = [
  {
    title: 'Quick Links',
    links: NAV_ITEMS.filter((_, i) => i > 0),
  },
  {
    title: 'Get Involved',
    links: [
      { label: 'Join TBC', href: '/join' },
      { label: 'Visit a Chapter', href: '/visitor' },
      { label: 'Find Members', href: '/members' },
      { label: 'Upcoming Events', href: '/events' },
      { label: 'Resources', href: '/resources' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/privacy' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-tbc-charcoal text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-4">
              <Image
                src="/tbc-logo.png"
                alt="TBC"
                width={44}
                height={44}
                className="h-10 sm:h-12 w-auto"
              />
              <div className="flex flex-col leading-tight">
                <span className="text-xl sm:text-2xl font-bold text-white">TBC</span>
                <span className="text-xs sm:text-sm text-gray-400 leading-none">
                  Tailik Business Committee
                </span>
              </div>
            </Link>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-sm mb-5 sm:mb-6">
              Bringing business professionals and entrepreneurs together to build trusted
              relationships, exchange opportunities, and grow together through the power
              of structured networking.
            </p>
            <div className="space-y-2.5 sm:space-y-3">
              <a
                href={`tel:${TBC.phone}`}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs sm:text-sm"
              >
                <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                {TBC.phone}
              </a>
              <div className="flex items-start gap-2 text-gray-400 text-xs sm:text-sm">
                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 mt-0.5" />
                {TBC.address.full}
              </div>
              <a
                href={`mailto:${TBC.email}`}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs sm:text-sm"
              >
                <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                {TBC.email}
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-white mb-3 sm:mb-4">
                {group.title}
              </h3>
              <ul className="space-y-2 sm:space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
              © {new Date().getFullYear()} TBC — Tailik Business Committee. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href={`https://wa.me/${TBC.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm text-gray-500 hover:text-white transition-colors"
              >
                WhatsApp
              </a>
              <a
                href={`tel:${TBC.phone}`}
                className="text-xs sm:text-sm text-gray-500 hover:text-white transition-colors"
              >
                Call TBC
              </a>
              <Link
                href="/admin"
                className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 hover:text-tbc-red transition-colors border border-gray-700 hover:border-tbc-red rounded-md px-2.5 py-1.5"
                title="TBC Admin Panel"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Admin Panel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
