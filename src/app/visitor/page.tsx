'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { PageHero } from '@/components/tbc/page-hero'
import { Reveal } from '@/components/tbc/reveal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Check, Search, MapPin, Calendar, Clock, FileText } from 'lucide-react'
import Link from 'next/link'

interface ChapterOption { id: string; name: string }
interface SavedApplication {
  id: string
  name: string
  mobile: string
  email: string
  business: string | null
  profession: string | null
  city: string | null
  chapterId: string | null
  preferredChapter: string | null
  preferredDate: string | null
  message: string | null
  status: string
  refNumber: string
  createdAt: string
  chapter: { id: string; name: string; city: string; meetingDay: string; meetingTime: string; location: string } | null
}

function VisitorPageContent() {
  const searchParams = useSearchParams()
  const prefillChapterId = searchParams.get('chapterId') || ''

  const [form, setForm] = useState(() => ({
    name: '', mobile: '', email: '', business: '', profession: '',
    city: '', chapterId: prefillChapterId, preferredChapter: '', preferredDate: '', message: ''
  }))
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [refNumber, setRefNumber] = useState('')
  const [chapters, setChapters] = useState<ChapterOption[]>([])
  const { toast } = useToast()

  // Lookup state
  const [lookupMode, setLookupMode] = useState(false)
  const [lookupMobile, setLookupMobile] = useState('')
  const [lookupEmail, setLookupEmail] = useState('')
  const [lookupResults, setLookupResults] = useState<SavedApplication[]>([])
  const [lookupLoading, setLookupLoading] = useState(false)

  useEffect(() => {
    fetch('/api/chapters').then(r => r.json()).then(setChapters)
  }, [])

  const update = (field: string, value: string) =>
    setForm(prev => {
      const next = { ...prev, [field]: value }
      // Keep preferredChapter name in sync with the selected chapter
      if (field === 'chapterId') {
        const ch = chapters.find(c => c.id === value)
        next.preferredChapter = ch ? ch.name : ''
      }
      return next
    })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.mobile || !form.email) {
      toast({ title: 'Name, mobile, and email are required', variant: 'destructive' })
      return
    }
    setLoading(true)
    try {
      // Derive preferredChapter from the selected chapter at submit time
      const ch = chapters.find(c => c.id === form.chapterId)
      const payload = { ...form, preferredChapter: ch ? ch.name : form.preferredChapter }
      const res = await fetch('/api/visitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (res.ok) {
        setSubmitted(true)
        setRefNumber(data.refNumber)
        toast({ title: 'Registration successful!' })
      } else {
        toast({ title: data.error || 'Failed', variant: 'destructive' }) 
      }
    } catch {
      toast({ title: 'Network error', variant: 'destructive' }) 
    }
    setLoading(false)
  }

  const handleLookup = async () => {
    if (!lookupMobile && !lookupEmail) {
      toast({ title: 'Enter mobile or email to search', variant: 'destructive' })
      return
    }
    setLookupLoading(true)
    try {
      const params = new URLSearchParams()
      if (lookupMobile) params.set('mobile', lookupMobile)
      if (lookupEmail) params.set('email', lookupEmail)
      const res = await fetch(`/api/visitor?${params}`)
      const data = await res.json()
      if (res.ok) {
        setLookupResults(data)
        if (data.length === 0) toast({ title: 'No applications found' })
      } else {
        toast({ title: 'Search failed', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Network error', variant: 'destructive' })
    }
    setLookupLoading(false)
  }

  const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    visited: 'bg-blue-100 text-blue-700',
    rejected: 'bg-red-100 text-red-700',
  }

  if (submitted) {
    return (
      <>
        <PageHero badge="Registered" title="Visitor Registration Complete" />
        <section className="py-12 sm:py-16 lg:py-24">
          <div className="max-w-lg mx-auto px-4 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Check className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-tbc-charcoal mb-3 sm:mb-4">Registration Successful!</h2>
            <p className="text-tbc-gray text-sm sm:text-base mb-2">Your reference number is:</p>
            <p className="text-xl sm:text-2xl font-mono font-bold text-tbc-red mb-4 sm:mb-6">{refNumber}</p>
            <p className="text-tbc-gray text-sm sm:text-base mb-6">The chapter will contact you with meeting details. We look forward to meeting you!</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="outline" className="border-tbc-red text-tbc-red hover:bg-tbc-red hover:text-white w-full sm:w-auto">
                <Link href="/chapters">Browse Chapters</Link>
              </Button>
              <Button
                onClick={() => { setSubmitted(false); setLookupMode(true); setLookupMobile(form.mobile); setLookupEmail(form.email); }}
                className="bg-tbc-red hover:bg-tbc-red-dark text-white w-full sm:w-auto"
              >
                View My Applications
              </Button>
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <PageHero badge="Visitor" title="Visit a Chapter" subtitle="Register to attend a TBC chapter meeting as a visitor and experience our networking format firsthand." />

      <section className="py-10 sm:py-12 lg:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Toggle: Register vs Lookup */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setLookupMode(false)}
              className={`flex-1 py-3 rounded-lg font-medium text-sm transition-colors ${
                !lookupMode ? 'bg-tbc-red text-white' : 'bg-white text-tbc-charcoal border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Register as Visitor
            </button>
            <button
              onClick={() => setLookupMode(true)}
              className={`flex-1 py-3 rounded-lg font-medium text-sm transition-colors ${
                lookupMode ? 'bg-tbc-red text-white' : 'bg-white text-tbc-charcoal border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <FileText className="inline h-4 w-4 mr-1.5 -mt-0.5" />
              My Applications
            </button>
          </div>

          {!lookupMode ? (
            /* ===== REGISTRATION FORM ===== */
            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100 space-y-3 sm:space-y-4">
              <div><label className="text-xs sm:text-sm font-medium mb-1.5 block text-tbc-charcoal">Name *</label><Input value={form.name} onChange={e => update('name', e.target.value)} required /></div>
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <div><label className="text-xs sm:text-sm font-medium mb-1.5 block text-tbc-charcoal">Mobile *</label><Input value={form.mobile} onChange={e => update('mobile', e.target.value)} required /></div>
                <div><label className="text-xs sm:text-sm font-medium mb-1.5 block text-tbc-charcoal">Email *</label><Input type="email" value={form.email} onChange={e => update('email', e.target.value)} required /></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <div><label className="text-xs sm:text-sm font-medium mb-1.5 block text-tbc-charcoal">Business</label><Input value={form.business} onChange={e => update('business', e.target.value)} /></div>
                <div><label className="text-xs sm:text-sm font-medium mb-1.5 block text-tbc-charcoal">Profession</label><Input value={form.profession} onChange={e => update('profession', e.target.value)} /></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <div><label className="text-xs sm:text-sm font-medium mb-1.5 block text-tbc-charcoal">City</label><Input value={form.city} onChange={e => update('city', e.target.value)} /></div>
                <div>
                  <label className="text-xs sm:text-sm font-medium mb-1.5 block text-tbc-charcoal">Preferred Chapter</label>
                  <select
                    value={form.chapterId}
                    onChange={e => update('chapterId', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 border rounded-md bg-white text-tbc-charcoal text-sm"
                  >
                    <option value="">Select a chapter</option>
                    {chapters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="text-xs sm:text-sm font-medium mb-1.5 block text-tbc-charcoal">Preferred Meeting Date</label><Input type="date" value={form.preferredDate} onChange={e => update('preferredDate', e.target.value)} /></div>
              <div><label className="text-xs sm:text-sm font-medium mb-1.5 block text-tbc-charcoal">Message</label><Textarea rows={3} value={form.message} onChange={e => update('message', e.target.value)} /></div>
              <Button type="submit" disabled={loading} className="w-full bg-tbc-red hover:bg-tbc-red-dark text-white">
                {loading ? 'Registering...' : 'Register as Visitor'}
              </Button>
            </form>
          ) : (
            /* ===== LOOKUP APPLICATIONS ===== */
            <div className="space-y-6">
              {/* Search Box */}
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-tbc-charcoal">Find Your Applications</h3>
                <p className="text-xs sm:text-sm text-tbc-gray">Enter your mobile number or email to see your saved visitor applications.</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs sm:text-sm font-medium mb-1.5 block text-tbc-charcoal">Mobile</label>
                    <Input
                      placeholder="Your mobile number"
                      value={lookupMobile}
                      onChange={e => setLookupMobile(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium mb-1.5 block text-tbc-charcoal">Email</label>
                    <Input
                      type="email"
                      placeholder="Your email"
                      value={lookupEmail}
                      onChange={e => setLookupEmail(e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleLookup}
                  disabled={lookupLoading}
                  className="w-full bg-tbc-red hover:bg-tbc-red-dark text-white"
                >
                  {lookupLoading ? 'Searching...' : (
                    <><Search className="mr-2 h-4 w-4" />Search Applications</>
                  )}
                </Button>
              </div>

              {/* Results */}
              {lookupResults.length > 0 && (
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-sm sm:text-base font-semibold text-tbc-gray">
                    {lookupResults.length} Application{lookupResults.length > 1 ? 's' : ''} Found
                  </h3>
                  {lookupResults.map((app) => (
                    <div key={app.id} className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:border-tbc-red/20 transition-colors">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <h4 className="font-bold text-sm sm:text-base text-tbc-charcoal">{app.name}</h4>
                          <p className="text-xs text-tbc-gray font-mono">Ref: {app.refNumber}</p>
                        </div>
                        <Badge className={`${STATUS_COLORS[app.status] || 'bg-gray-100 text-gray-700'} text-[10px] sm:text-xs`}>
                          {app.status}
                        </Badge>
                      </div>

                      {/* Chapter Info */}
                      {app.chapter && (
                        <div className="bg-tbc-light-gray rounded-lg p-3 mb-3 space-y-1.5">
                          <p className="text-xs sm:text-sm font-semibold text-tbc-charcoal">{app.chapter.name}</p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-tbc-gray">
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-tbc-red" />{app.chapter.location}</span>
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3 text-tbc-red" />{app.chapter.meetingDay}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-tbc-red" />{app.chapter.meetingTime}</span>
                          </div>
                        </div>
                      )}
                      {!app.chapter && app.preferredChapter && (
                        <div className="bg-tbc-light-gray rounded-lg p-3 mb-3">
                          <p className="text-xs sm:text-sm font-semibold text-tbc-charcoal">{app.preferredChapter}</p>
                        </div>
                      )}

                      {/* Application Details */}
                      <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-tbc-gray mb-2">
                        {app.business && <div><span className="font-medium text-tbc-charcoal">Business:</span> {app.business}</div>}
                        {app.profession && <div><span className="font-medium text-tbc-charcoal">Profession:</span> {app.profession}</div>}
                        {app.city && <div><span className="font-medium text-tbc-charcoal">City:</span> {app.city}</div>}
                        {app.preferredDate && <div><span className="font-medium text-tbc-charcoal">Date:</span> {new Date(app.preferredDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>}
                      </div>

                      {app.message && (
                        <p className="text-xs sm:text-sm text-tbc-gray italic border-t border-gray-100 pt-2 mt-2">&ldquo;{app.message}&rdquo;</p>
                      )}

                      <p className="text-[10px] sm:text-xs text-gray-400 mt-2">
                        Applied on {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default function VisitorPage() {
  return (
    <Suspense fallback={
      <>
        <PageHero badge="Visitor" title="Visit a Chapter" />
        <section className="py-20">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-48 mx-auto" />
              <div className="h-64 bg-gray-100 rounded-xl" />
            </div>
          </div>
        </section>
      </>
    }>
      <VisitorPageContent />
    </Suspense>
  )
}
