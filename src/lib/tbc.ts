export const TBC = {
  name: 'TBC',
  fullName: 'Tailik Business Committee',
  brandName: 'TBC — Tailik Business Committee',
  tagline: 'Build Connections. Create Opportunities. Grow Together.',
  phone: '9301056006',
  whatsapp: '919301056006',
  email: 'info@tbcnetwork.in',
  address: {
    full: 'Gandhi Nagar, Pahari Chowk, Gudhiyari, Raipur (C.G.), India',
    area: 'Gandhi Nagar, Pahari Chowk',
    locality: 'Gudhiyari',
    city: 'Raipur',
    state: 'Chhattisgarh',
    country: 'India',
  },
  social: {
    whatsapp: 'https://wa.me/919301056006',
    facebook: '#',
    instagram: '#',
    linkedin: '#',
  },
  meta: {
    title: 'TBC — Tailik Business Committee | Business Networking & Growth',
    description: 'Tailik Business Committee brings business professionals and entrepreneurs together to build trusted relationships, exchange opportunities and grow together.',
    keywords: 'business networking, referrals, TBC, Tailik Business Committee, Raipur, Chhattisgarh, business growth, professional networking',
  },
  colors: {
    red: '#C41E3A',
    redDark: '#9B1830',
    redLight: '#F8E8EB',
    charcoal: '#1C1C1C',
    gray: '#4A4A4A',
    lightGray: '#F5F5F5',
  },
} as const

export const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Chapters', href: '/chapters' },
  { label: 'Members', href: '/members' },
  { label: 'Events', href: '/events' },
  { label: 'Resources', href: '/resources' },
  { label: 'Contact', href: '/contact' },
] as const

export const BUSINESS_CATEGORIES = [
  'Healthcare', 'Finance', 'Real Estate', 'IT Services', 'Education',
  'Construction', 'Hospitality', 'Legal', 'Marketing', 'Automotive',
  'Manufacturing', 'Retail', 'Insurance', 'Food & Beverage', 'Technology',
  'Agriculture', 'Transport', 'Textiles', 'Energy', 'Engineering',
  'Consulting', 'Logistics', 'Steel', 'Metal Works', 'Accounting',
] as const

export const CITIES = [
  'Raipur', 'Bilaspur', 'Durg', 'Korba', 'Bhilai',
] as const

export const MEETING_DAYS = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
] as const

export const EVENT_TYPES = [
  'networking', 'workshop', 'seminar', 'summit',
] as const
