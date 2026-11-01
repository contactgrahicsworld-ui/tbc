'use client'

import { useState, useEffect } from 'react'
import { PageHero } from '@/components/tbc/page-hero'
import { Reveal } from '@/components/tbc/reveal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Check, ChevronRight, ChevronLeft } from 'lucide-react'

const STEPS = [
  'Personal Information',
  'Business Information',
  'Profession',
  'Contact Details',
  'Preferred Chapter',
  'Additional Information',
  'Review',
]

export default function JoinPage() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [refNumber, setRefNumber] = useState('')
  const [chapters, setChapters] = useState<{ id: string; name: string }[]>([])
  const { toast } = useToast()

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    business: '', category: '', city: '', address: '',
    profession: '',
    preferredChapter: '',
    experience: '', motivation: '', referral: '',
  })

  useEffect(() => {
    fetch('/api/chapters').then(r => r.json()).then(setChapters)
  }, [])

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }))

  const validate = (): boolean => {
    if (step === 0 && (!form.name || !form.email || !form.phone)) { toast({ title: 'Name, email, and phone are required', variant: 'destructive' }); return false }
    if (step === 1 && !form.business) { toast({ title: 'Business name is required', variant: 'destructive' }); return false }
    return true
  }

  const next = () => { if (validate()) setStep(s => Math.min(s + 1, STEPS.length - 1)) }
  const prev = () => setStep(s => Math.max(s - 1, 0))

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        setSubmitted(true)
        setRefNumber(data.refNumber)
        toast({ title: 'Application submitted successfully!' })
      } else {
        toast({ title: data.error || 'Submission failed', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Network error', variant: 'destructive' })
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <>
        <PageHero badge="Application Submitted" title="Welcome to TBC!" />
        <section className="py-16 lg:py-24">
          <div className="max-w-lg mx-auto px-4 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-tbc-charcoal mb-4">Application Submitted!</h2>
            <p className="text-tbc-gray mb-2">Your reference number is:</p>
            <p className="text-2xl font-mono font-bold text-tbc-red mb-6">{refNumber}</p>
            <p className="text-tbc-gray">Our team will review your application and get in touch with you shortly.</p>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <PageHero badge="Join TBC" title="Membership Application" subtitle="Complete the application to join Tailik Business Committee and start growing your business." />

      <section className="py-12 lg:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-tbc-gray">Step {step + 1} of {STEPS.length}</span>
              <span className="text-sm text-tbc-red font-medium">{STEPS[step]}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-tbc-red rounded-full h-2 transition-all duration-300" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-gray-100">
            {/* Step 0: Personal */}
            {step === 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-tbc-charcoal mb-2">Personal Information</h3>
                <div><label className="text-sm font-medium mb-1.5 block">Full Name *</label><Input value={form.name} onChange={e => update('name', e.target.value)} required /></div>
                <div><label className="text-sm font-medium mb-1.5 block">Email *</label><Input type="email" value={form.email} onChange={e => update('email', e.target.value)} required /></div>
                <div><label className="text-sm font-medium mb-1.5 block">Phone *</label><Input value={form.phone} onChange={e => update('phone', e.target.value)} required /></div>
              </div>
            )}

            {/* Step 1: Business */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-tbc-charcoal mb-2">Business Information</h3>
                <div><label className="text-sm font-medium mb-1.5 block">Business Name *</label><Input value={form.business} onChange={e => update('business', e.target.value)} required /></div>
                <div><label className="text-sm font-medium mb-1.5 block">Business Category</label><Input value={form.category} onChange={e => update('category', e.target.value)} placeholder="e.g. Healthcare, Finance, Real Estate" /></div>
                <div><label className="text-sm font-medium mb-1.5 block">City</label><Input value={form.city} onChange={e => update('city', e.target.value)} /></div>
                <div><label className="text-sm font-medium mb-1.5 block">Business Address</label><Textarea value={form.address} onChange={e => update('address', e.target.value)} rows={2} /></div>
              </div>
            )}

            {/* Step 2: Profession */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-tbc-charcoal mb-2">Profession</h3>
                <div><label className="text-sm font-medium mb-1.5 block">Profession / Designation</label><Input value={form.profession} onChange={e => update('profession', e.target.value)} placeholder="e.g. Doctor, Financial Advisor, Lawyer" /></div>
                <p className="text-sm text-tbc-gray">Each TBC chapter maintains one member per business category. This exclusivity ensures you receive focused, quality referrals without internal competition.</p>
              </div>
            )}

            {/* Step 3: Contact Details (already captured) */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-tbc-charcoal mb-2">Contact Details</h3>
                <p className="text-sm text-tbc-gray">Your contact information has been captured in Step 1. Please review:</p>
                <div className="bg-tbc-light-gray rounded-lg p-4 space-y-2 text-sm">
                  <p><strong>Name:</strong> {form.name}</p>
                  <p><strong>Email:</strong> {form.email}</p>
                  <p><strong>Phone:</strong> {form.phone}</p>
                </div>
              </div>
            )}

            {/* Step 4: Preferred Chapter */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-tbc-charcoal mb-2">Preferred Chapter</h3>
                <select value={form.preferredChapter} onChange={e => update('preferredChapter', e.target.value)} className="w-full px-4 py-2 border rounded-md bg-white text-tbc-charcoal">
                  <option value="">Select a chapter</option>
                  {chapters.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
            )}

            {/* Step 5: Additional */}
            {step === 5 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-tbc-charcoal mb-2">Additional Information</h3>
                <div><label className="text-sm font-medium mb-1.5 block">Business Experience</label><Textarea value={form.experience} onChange={e => update('experience', e.target.value)} rows={3} placeholder="Brief description of your business experience" /></div>
                <div><label className="text-sm font-medium mb-1.5 block">Why do you want to join TBC?</label><Textarea value={form.motivation} onChange={e => update('motivation', e.target.value)} rows={3} /></div>
                <div><label className="text-sm font-medium mb-1.5 block">How did you hear about TBC?</label><Input value={form.referral} onChange={e => update('referral', e.target.value)} placeholder="e.g. Friend, Social Media, Event" /></div>
              </div>
            )}

            {/* Step 6: Review */}
            {step === 6 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-tbc-charcoal mb-2">Review Your Application</h3>
                <div className="bg-tbc-light-gray rounded-lg p-4 space-y-2 text-sm">
                  <p><strong>Name:</strong> {form.name}</p>
                  <p><strong>Email:</strong> {form.email}</p>
                  <p><strong>Phone:</strong> {form.phone}</p>
                  <p><strong>Business:</strong> {form.business}</p>
                  <p><strong>Category:</strong> {form.category || '—'}</p>
                  <p><strong>Profession:</strong> {form.profession || '—'}</p>
                  <p><strong>City:</strong> {form.city || '—'}</p>
                  <p><strong>Preferred Chapter:</strong> {form.preferredChapter || '—'}</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={prev} disabled={step === 0}>
                <ChevronLeft className="mr-1 h-4 w-4" /> Previous
              </Button>
              {step < STEPS.length - 1 ? (
                <Button onClick={next} className="bg-tbc-red hover:bg-tbc-red-dark text-white">
                  Next <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading} className="bg-tbc-red hover:bg-tbc-red-dark text-white">
                  {loading ? 'Submitting...' : 'Submit Application'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
