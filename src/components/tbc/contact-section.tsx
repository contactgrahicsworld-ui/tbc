'use client'

import { useState } from 'react'
import { Phone, MessageCircle, MapPin, Send } from 'lucide-react'
import { TBC } from '@/lib/tbc'
import { Reveal } from './reveal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

export function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' })
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSent(true)
        toast({ title: 'Message sent successfully! We will get back to you soon.' })
      } else {
        toast({ title: 'Failed to send message. Please try again.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Network error. Please try again.', variant: 'destructive' })
    }
    setLoading(false)
  }

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-28 bg-tbc-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <span className="text-tbc-red font-semibold text-xs sm:text-sm uppercase tracking-wider">
              Get In Touch
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-tbc-charcoal mt-2 sm:mt-3">
              Contact TBC
            </h2>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Contact Info */}
          <Reveal direction="right">
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-tbc-charcoal mb-2">
                  TBC — Tailik Business Committee
                </h3>
                <p className="text-tbc-gray text-sm sm:text-base">
                  We would love to hear from you. Reach out to us through any of the
                  channels below or fill in the contact form.
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-tbc-red-light rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-tbc-red" />
                  </div>
                  <div>
                    <p className="font-medium text-sm sm:text-base text-tbc-charcoal">Address</p>
                    <p className="text-xs sm:text-sm text-tbc-gray">{TBC.address.full}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-tbc-red-light rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-tbc-red" />
                  </div>
                  <div>
                    <p className="font-medium text-sm sm:text-base text-tbc-charcoal">Phone</p>
                    <a href={`tel:${TBC.phone}`} className="text-xs sm:text-sm text-tbc-red hover:underline">
                      {TBC.phone}
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                <Button asChild className="bg-tbc-red hover:bg-tbc-red-dark text-white w-full sm:w-auto">
                  <a href={`tel:${TBC.phone}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    Call TBC
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white w-full sm:w-auto">
                  <a href={`https://wa.me/${TBC.whatsapp}`} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp TBC
                  </a>
                </Button>
              </div>
            </div>
          </Reveal>

          {/* Contact Form */}
          <Reveal direction="left">
            {sent ? (
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100 text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Send className="h-7 w-7 sm:h-8 sm:w-8 text-green-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-tbc-charcoal mb-2">Message Sent!</h3>
                <p className="text-sm sm:text-base text-tbc-gray">Thank you for reaching out. We will get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100 space-y-3 sm:space-y-4">
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-tbc-charcoal mb-1.5 block">Name *</label>
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-tbc-charcoal mb-1.5 block">Email *</label>
                    <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-tbc-charcoal mb-1.5 block">Phone</label>
                    <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-tbc-charcoal mb-1.5 block">Subject</label>
                    <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-tbc-charcoal mb-1.5 block">Message *</label>
                  <Textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-tbc-red hover:bg-tbc-red-dark text-white">
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
