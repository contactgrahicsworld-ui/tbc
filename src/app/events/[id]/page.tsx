'use client'

import { useState } from 'react'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { PageHero } from '@/components/tbc/page-hero'
import { Reveal } from '@/components/tbc/reveal'
import { useToast } from '@/hooks/use-toast'

// We need to fetch server-side, but we also need client for form
// So we'll use a wrapper approach
import { useEffect, use } from 'react'

interface EventData {
  id: string; title: string; slug: string; date: string; time: string | null; location: string | null; type: string; description: string | null
}

interface Props { params: Promise<{ id: string }> }

export default function EventDetailPage({ params }: Props) {
  const { id } = use(params)
  const [event, setEvent] = useState<EventData | null>(null)
  const [loading, setLoading] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [refNumber, setRefNumber] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '', business: '', message: '' })
  const { toast } = useToast()

  useEffect(() => {
    fetch(`/api/events`).then(r => r.json()).then((events: EventData[]) => {
      const found = events.find(e => e.slug === id)
      setEvent(found || null)
    })
  }, [id])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!event || !form.name || !form.email) {
      toast({ title: 'Please fill in required fields', variant: 'destructive' })
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/event-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: event.id, ...form }),
      })
      const data = await res.json()
      if (res.ok) {
        setRegistered(true)
        setRefNumber(data.refNumber)
        toast({ title: 'Registration successful!' })
      } else {
        toast({ title: data.error || 'Registration failed', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Network error', variant: 'destructive' })
    }
    setLoading(false)
  }

  if (!event) return <div className="pt-32 text-center text-tbc-gray py-20">Loading...</div>

  const dateObj = new Date(event.date)
  const dateStr = dateObj.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const EVENT_TYPE_LABELS: Record<string, string> = { networking: 'Networking Meeting', workshop: 'Workshop', seminar: 'Seminar', summit: 'Summit' }

  return (
    <>
      <PageHero badge={EVENT_TYPE_LABELS[event.type] || event.type} title={event.title} />

      <section className="py-12 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <Reveal>
            <div className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-gray-100 space-y-4">
              <div className="flex flex-wrap gap-4 text-sm text-tbc-gray">
                <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-tbc-red" />{dateStr}</div>
                {event.time && <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-tbc-red" />{event.time}</div>}
                {event.location && <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-tbc-red" />{event.location}</div>}
              </div>
              {event.description && <p className="text-tbc-gray leading-relaxed mt-4">{event.description}</p>}
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-tbc-charcoal mb-4">Register for This Event</h2>
              {registered ? (
                <div className="text-center py-6">
                  <div className="text-green-600 font-bold text-lg mb-2">Registration Successful!</div>
                  <p className="text-tbc-gray">Reference Number: <span className="font-mono font-bold text-tbc-charcoal">{refNumber}</span></p>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><label className="text-sm font-medium mb-1.5 block">Name *</label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
                    <div><label className="text-sm font-medium mb-1.5 block">Email *</label><Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><label className="text-sm font-medium mb-1.5 block">Phone</label><Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
                    <div><label className="text-sm font-medium mb-1.5 block">Business</label><Input value={form.business} onChange={e => setForm({...form, business: e.target.value})} /></div>
                  </div>
                  <div><label className="text-sm font-medium mb-1.5 block">Message</label><Textarea rows={3} value={form.message} onChange={e => setForm({...form, message: e.target.value})} /></div>
                  <Button type="submit" disabled={loading} className="w-full bg-tbc-red hover:bg-tbc-red-dark text-white">
                    {loading ? 'Registering...' : 'Register Now'}
                  </Button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
