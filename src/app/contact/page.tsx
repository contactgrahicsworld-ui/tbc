'use client'

import { useState } from 'react'
import { Phone, MessageCircle, MapPin, Send } from 'lucide-react'
import { TBC } from '@/lib/tbc'
import { PageHero } from '@/components/tbc/page-hero'
import { Reveal } from '@/components/tbc/reveal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) { toast({ title: 'Please fill in required fields', variant: 'destructive' }); return }
    setLoading(true)
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (res.ok) { setSent(true); toast({ title: 'Message sent!' }) }
      else { toast({ title: 'Failed to send', variant: 'destructive' }) }
    } catch { toast({ title: 'Network error', variant: 'destructive' }) }
    setLoading(false)
  }

  return (
    <>
      <PageHero badge="Contact" title="Contact TBC" subtitle="Reach out to us for any queries about membership, chapters, or events." />

      <section className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <Reveal direction="right">
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
                  <h3 className="text-xl font-bold text-tbc-charcoal">TBC — Tailik Business Committee</h3>
                  <div className="flex items-start gap-3"><MapPin className="h-5 w-5 text-tbc-red shrink-0 mt-0.5" /><p className="text-tbc-gray">{TBC.address.full}</p></div>
                  <div className="flex items-center gap-3"><Phone className="h-5 w-5 text-tbc-red" /><a href={`tel:${TBC.phone}`} className="text-tbc-red hover:underline">{TBC.phone}</a></div>
                </div>
                <div className="flex gap-3">
                  <Button asChild className="bg-tbc-red hover:bg-tbc-red-dark text-white"><a href={`tel:${TBC.phone}`}><Phone className="mr-2 h-4 w-4" />Call TBC</a></Button>
                  <Button asChild variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"><a href={`https://wa.me/${TBC.whatsapp}`} target="_blank" rel="noopener noreferrer"><MessageCircle className="mr-2 h-4 w-4" />WhatsApp TBC</a></Button>
                </div>
                <div className="bg-tbc-light-gray rounded-xl p-6">
                  <h4 className="font-bold text-tbc-charcoal mb-2">Office Hours</h4>
                  <p className="text-sm text-tbc-gray">Monday — Saturday: 9:00 AM — 6:00 PM</p>
                  <p className="text-sm text-tbc-gray">Sunday: Closed</p>
                </div>
              </div>
            </Reveal>

            <Reveal direction="left">
              {sent ? (
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
                  <Send className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-tbc-charcoal mb-2">Message Sent!</h3>
                  <p className="text-tbc-gray">We will get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-gray-100 space-y-4">
                  <h3 className="text-xl font-bold text-tbc-charcoal mb-2">Send a Message</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><label className="text-sm font-medium mb-1.5 block">Name *</label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
                    <div><label className="text-sm font-medium mb-1.5 block">Email *</label><Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><label className="text-sm font-medium mb-1.5 block">Phone</label><Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
                    <div><label className="text-sm font-medium mb-1.5 block">Subject</label><Input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} /></div>
                  </div>
                  <div><label className="text-sm font-medium mb-1.5 block">Message *</label><Textarea rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})} required /></div>
                  <Button type="submit" disabled={loading} className="w-full bg-tbc-red hover:bg-tbc-red-dark text-white">{loading ? 'Sending...' : 'Send Message'}</Button>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
