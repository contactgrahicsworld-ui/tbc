'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import {
  LayoutDashboard, Users, MapPin, Calendar, Star, FileText, Mail, Download,
  Settings, LogOut, Menu, X, Upload, Trash2, Pencil, Plus, Search, ShieldCheck,
  MessageCircle, Phone, ExternalLink, Image as ImageIcon
} from 'lucide-react'

// ===================== Types =====================
interface Stats {
  chapters: number; members: number; events: number; visitors: number
  applications: number; inquiries: number; testimonials: number
  pendingVisitors: number; pendingApps: number
}
interface Chapter { id: string; name: string; slug: string; location: string; city: string; area?: string | null; meetingDay: string; meetingTime: string; description?: string | null; categories?: string | null; image?: string | null; active: boolean; _count?: { members: number; visitorRequests: number } }
interface Member { id: string; name: string; email: string; phone?: string | null; photo?: string | null; business?: string | null; category?: string | null; profession?: string | null; city?: string | null; description?: string | null; chapterId?: string | null; chapter?: { id: string; name: string } | null; featured: boolean; active: boolean }
interface EventItem { id: string; title: string; slug: string; description?: string | null; image?: string | null; date: string; time?: string | null; location?: string | null; chapterId?: string | null; chapter?: { id: string; name: string } | null; type: string; featured: boolean; active: boolean; _count?: { registrations: number } }
interface Testimonial { id: string; name: string; business?: string | null; category?: string | null; photo?: string | null; quote: string; featured: boolean }
interface Visitor { id: string; name: string; mobile: string; email: string; business?: string | null; profession?: string | null; city?: string | null; chapterId?: string | null; chapter?: { id: string; name: string; city: string } | null; preferredChapter?: string | null; preferredDate?: string | null; message?: string | null; status: string; refNumber: string; createdAt: string }
interface Application { id: string; name: string; email: string; phone: string; business?: string | null; category?: string | null; city?: string | null; preferredChapter?: string | null; refNumber: string; status: string; createdAt: string }
interface Inquiry { id: string; name: string; email: string; phone?: string | null; subject?: string | null; message: string; createdAt: string }
interface AdminUser { id: string; name: string; email: string; mobile: string; role: string; active: boolean; createdAt: string }

const MEETING_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const EVENT_TYPES = ['networking', 'workshop', 'seminar', 'summit']
const BUSINESSES = ['Healthcare', 'Finance', 'Real Estate', 'IT Services', 'Education', 'Construction', 'Hospitality', 'Legal', 'Marketing', 'Automotive', 'Manufacturing', 'Retail', 'Insurance', 'Food & Beverage', 'Technology', 'Agriculture', 'Transport', 'Textiles', 'Energy', 'Engineering', 'Consulting', 'Logistics', 'Steel', 'Metal Works', 'Accounting']

// ===================== Main =====================
export default function AdminPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [me, setMe] = useState<{ id: string; name: string; role: string } | null>(null)
  const [ready, setReady] = useState(false)
  const [section, setSection] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    fetch('/api/admin/me').then(r => r.json()).then(d => {
      if (!d.admin) router.replace('/admin/login')
      else { setMe(d.admin); setReady(true) }
    }).catch(() => router.replace('/admin/login'))
  }, [router])

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.replace('/admin/login')
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-tbc-red border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const NAV = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'visitors', label: 'Chapter Visitors', icon: Users },
    { key: 'applications', label: 'Membership Applications', icon: FileText },
    { key: 'chapters', label: 'Chapters', icon: MapPin },
    { key: 'members', label: 'Members', icon: Star },
    { key: 'events', label: 'Events & Assignment', icon: Calendar },
    { key: 'testimonials', label: 'Testimonials', icon: MessageCircle },
    { key: 'inquiries', label: 'Contact Inquiries', icon: Mail },
    { key: 'export', label: 'Excel Export', icon: Download },
    ...(me?.role === 'superadmin' ? [{ key: 'admins', label: 'Admin Users', icon: ShieldCheck }] : []),
    { key: 'settings', label: 'Settings', icon: Settings },
  ]

  const Sidebar = (
    <div className="flex flex-col h-full bg-tbc-charcoal text-white w-64 shrink-0">
      <div className="flex items-center gap-2 p-4 border-b border-gray-800">
        <Image src="/tbc-logo.png" alt="TBC" width={36} height={36} className="h-9 w-auto" />
        <div>
          <p className="font-bold text-sm">TBC Admin</p>
          <p className="text-[10px] text-gray-400">Source of Truth</p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {NAV.map(item => (
          <button key={item.key} onClick={() => { setSection(item.key); setSidebarOpen(false) }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              section === item.key ? 'bg-tbc-red text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}>
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-gray-800 space-y-1">
        <Link href="/" target="_blank"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800">
          <ExternalLink className="h-4 w-4" /> View Website
        </Link>
        <button onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-gray-800">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:block h-screen sticky top-0">{Sidebar}</div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="relative h-full">{Sidebar}</div>
        </div>
      )}

      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <div className="bg-white border-b sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 sm:px-6 h-14">
            <div className="flex items-center gap-3">
              <button className="lg:hidden p-2 -ml-2" onClick={() => setSidebarOpen(true)} aria-label="Menu">
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="font-bold text-tbc-charcoal text-sm sm:text-base">
                {NAV.find(n => n.key === section)?.label}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-tbc-gray hidden sm:block">{me?.name}</span>
              <div className="h-8 w-8 rounded-full bg-tbc-red text-white flex items-center justify-center text-xs font-bold">
                {me?.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
            </div>
          </div>
        </div>

        <main className="p-4 sm:p-6 max-w-7xl">
          {section === 'dashboard' && <DashboardSection />}
          {section === 'visitors' && <VisitorsSection />}
          {section === 'applications' && <ApplicationsSection />}
          {section === 'chapters' && <ChaptersSection />}
          {section === 'members' && <MembersSection />}
          {section === 'events' && <EventsSection />}
          {section === 'testimonials' && <TestimonialsSection />}
          {section === 'inquiries' && <InquiriesSection />}
          {section === 'export' && <ExportSection />}
          {section === 'admins' && <AdminsSection meRole={me?.role} />}
          {section === 'settings' && <SettingsSection />}
        </main>
      </div>
    </div>
  )
}

// ===================== Shared UI helpers =====================
function StatCard({ icon: Icon, label, value, accent }: { icon: any; label: string; value: number; accent?: string }) {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm">
      <div className={`inline-flex p-2 rounded-lg ${accent || 'bg-tbc-red-light'} mb-3`}>
        <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-tbc-red" />
      </div>
      <p className="text-xl sm:text-2xl font-bold text-tbc-charcoal">{value}</p>
      <p className="text-xs text-tbc-gray">{label}</p>
    </div>
  )
}

function EmptyState({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <div className="text-center py-12">
      <Icon className="h-10 w-10 text-gray-300 mx-auto mb-3" />
      <p className="text-sm text-tbc-gray">{text}</p>
    </div>
  )
}

const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  visited: 'bg-blue-100 text-blue-700',
  rejected: 'bg-red-100 text-red-700',
  reviewing: 'bg-purple-100 text-purple-700',
  approved: 'bg-green-100 text-green-700',
}

// ===================== Photo Upload =====================
function PhotoUpload({ value, onChange, label }: { value: string; onChange: (url: string) => void; label: string }) {
  const { toast } = useToast()
  const [uploading, setUploading] = useState(false)

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok) { onChange(data.url); toast({ title: 'Photo uploaded' }) }
      else toast({ title: data.error || 'Upload failed', variant: 'destructive' })
    } catch { toast({ title: 'Upload failed', variant: 'destructive' }) }
    setUploading(false)
    e.target.value = ''
  }

  return (
    <div>
      <label className="text-xs font-medium text-tbc-charcoal mb-1.5 block">{label}</label>
      <div className="flex items-center gap-3">
        {value ? (
          <div className="relative group">
            <img src={value} alt="preview" className="h-16 w-16 rounded-lg object-cover border border-gray-200" />
            <button type="button" onClick={() => onChange('')}
              className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-1 shadow">
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center h-16 w-16 rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-tbc-red hover:text-tbc-red cursor-pointer transition-colors">
            {uploading ? <div className="w-5 h-5 border-2 border-tbc-red border-t-transparent rounded-full animate-spin" /> : <Upload className="h-5 w-5" />}
            <input type="file" accept="image/*" className="hidden" onChange={upload} disabled={uploading} />
          </label>
        )}
        {!value && (
          <label className="text-xs text-tbc-gray cursor-pointer hover:text-tbc-red">
            <Upload className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
            Upload photo
            <input type="file" accept="image/*" className="hidden" onChange={upload} disabled={uploading} />
          </label>
        )}
      </div>
    </div>
  )
}

// ===================== Dashboard =====================
function DashboardSection() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(setStats).catch(() => {})
  }, [])

  if (!stats) return <div className="animate-pulse grid grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(8)].map((_, i) => <div key={i} className="h-28 bg-white rounded-xl" />)}</div>

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={Users} label="Chapter Visitors" value={stats.visitors} />
        <StatCard icon={FileText} label="Membership Applications" value={stats.applications} />
        <StatCard icon={MapPin} label="Active Chapters" value={stats.chapters} />
        <StatCard icon={Star} label="Active Members" value={stats.members} />
        <StatCard icon={Calendar} label="Events" value={stats.events} />
        <StatCard icon={MessageCircle} label="Testimonials" value={stats.testimonials} />
        <StatCard icon={Mail} label="Contact Inquiries" value={stats.inquiries} />
        <StatCard icon={FileText} label="Pending Visitors" value={stats.pendingVisitors} accent="bg-yellow-100" />
      </div>
      <div className="bg-gradient-to-br from-tbc-red to-tbc-red-dark rounded-xl p-5 sm:p-6 text-white">
        <h3 className="font-bold text-lg mb-1">TBC Admin — Source of Truth</h3>
        <p className="text-sm text-white/80">
          Manage chapters, members, events, photos, visitor details — everything from one place.
          Export chapter-wise data to Excel anytime.
        </p>
      </div>
    </div>
  )
}

// ===================== Visitors =====================
function VisitorsSection() {
  const { toast } = useToast()
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [chapterId, setChapterId] = useState('')
  const [status, setStatus] = useState('')
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  const [loadTick, setLoadTick] = useState(0)
  const load = useCallback(() => setLoadTick(t => t + 1), [])

  useEffect(() => {
    fetch('/api/admin/chapters').then(r => r.json()).then(d => setChapters(Array.isArray(d) ? d : [])).catch(() => {})
  }, [])

  useEffect(() => {
    let cancelled = false
    const params = new URLSearchParams()
    if (chapterId) params.set('chapterId', chapterId)
    if (status) params.set('status', status)
    if (q) params.set('q', q)
    fetch(`/api/admin/visitors?${params}`)
      .then(r => r.json())
      .then(d => { if (!cancelled) setVisitors(Array.isArray(d) ? d : []) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [chapterId, status, q, loadTick])

  const changeStatus = async (id: string, newStatus: string) => {
    const res = await fetch('/api/admin/visitors', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    })
    if (res.ok) { toast({ title: 'Status updated' }); load() }
    else toast({ title: 'Update failed', variant: 'destructive' })
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this visitor record?')) return
    const res = await fetch(`/api/admin/visitors?id=${id}`, { method: 'DELETE' })
    if (res.ok) { toast({ title: 'Deleted' }); load() }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input className="pl-10" placeholder="Search name / mobile / ref no." value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <select value={chapterId} onChange={e => setChapterId(e.target.value)}
            className="px-3 py-2 border rounded-md bg-white text-sm text-tbc-charcoal">
            <option value="">All Chapters</option>
            {chapters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={status} onChange={e => setStatus(e.target.value)}
            className="px-3 py-2 border rounded-md bg-white text-sm text-tbc-charcoal">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="visited">Visited</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <p className="text-xs text-tbc-gray mt-3">{visitors.length} record(s){chapterId ? ` — ${chapters.find(c => c.id === chapterId)?.name}` : ' — all chapters'}</p>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-white rounded-xl animate-pulse" />)}</div>
      ) : visitors.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100"><EmptyState icon={Users} text="No visitor records found" /></div>
      ) : (
        <div className="space-y-3">
          {visitors.map(v => (
            <div key={v.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 cursor-pointer" onClick={() => setExpanded(expanded === v.id ? null : v.id)}>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-bold text-sm text-tbc-charcoal">{v.name}</p>
                    <Badge className={`${STATUS_BADGE[v.status] || 'bg-gray-100'} text-[10px]`}>{v.status}</Badge>
                  </div>
                  <p className="text-xs text-tbc-gray font-mono">Ref: {v.refNumber}</p>
                  <p className="text-xs text-tbc-gray mt-1 truncate">
                    {v.chapter?.name || v.preferredChapter || 'No chapter'} • {v.mobile} • {v.email}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <select value={v.status} onChange={e => changeStatus(v.id, e.target.value)}
                    className="px-2 py-1.5 border rounded-md bg-white text-xs text-tbc-charcoal">
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="visited">Visited</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <button onClick={() => remove(v.id)} className="p-2 text-gray-400 hover:text-red-500" aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {expanded === v.id && (
                <div className="border-t bg-gray-50 p-4 grid sm:grid-cols-2 gap-x-6 gap-y-2 text-xs sm:text-sm">
                  <div><span className="font-semibold text-tbc-charcoal">Chapter:</span> <span className="text-tbc-gray">{v.chapter?.name || v.preferredChapter || '—'}</span></div>
                  <div><span className="font-semibold text-tbc-charcoal">Ref Number:</span> <span className="text-tbc-gray font-mono">{v.refNumber}</span></div>
                  <div><span className="font-semibold text-tbc-charcoal">Mobile:</span> <span className="text-tbc-gray">{v.mobile}</span></div>
                  <div><span className="font-semibold text-tbc-charcoal">Email:</span> <span className="text-tbc-gray">{v.email}</span></div>
                  <div><span className="font-semibold text-tbc-charcoal">Business:</span> <span className="text-tbc-gray">{v.business || '—'}</span></div>
                  <div><span className="font-semibold text-tbc-charcoal">Profession:</span> <span className="text-tbc-gray">{v.profession || '—'}</span></div>
                  <div><span className="font-semibold text-tbc-charcoal">City:</span> <span className="text-tbc-gray">{v.city || '—'}</span></div>
                  <div><span className="font-semibold text-tbc-charcoal">Preferred Date:</span> <span className="text-tbc-gray">{v.preferredDate || '—'}</span></div>
                  <div className="sm:col-span-2"><span className="font-semibold text-tbc-charcoal">Registered:</span> <span className="text-tbc-gray">{new Date(v.createdAt).toLocaleString('en-IN')}</span></div>
                  {v.message && <div className="sm:col-span-2"><span className="font-semibold text-tbc-charcoal">Message:</span> <span className="text-tbc-gray italic">&ldquo;{v.message}&rdquo;</span></div>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ===================== Applications =====================
function ApplicationsSection() {
  const { toast } = useToast()
  const [items, setItems] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  const [loadTick, setLoadTick] = useState(0)
  const load = useCallback(() => setLoadTick(t => t + 1), [])

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/applications')
      .then(r => r.json())
      .then(d => { if (!cancelled) setItems(Array.isArray(d) ? d : []) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [loadTick])

  const changeStatus = async (id: string, status: string) => {
    const res = await fetch('/api/admin/applications', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    if (res.ok) { toast({ title: 'Status updated' }); load() }
  }

  return loading ? (
    <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-white rounded-xl animate-pulse" />)}</div>
  ) : items.length === 0 ? (
    <div className="bg-white rounded-xl border border-gray-100"><EmptyState icon={FileText} text="No membership applications yet" /></div>
  ) : (
    <div className="space-y-3">
      {items.map(a => (
        <div key={a.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <p className="font-bold text-sm text-tbc-charcoal">{a.name}</p>
                <Badge className={`${STATUS_BADGE[a.status] || 'bg-gray-100'} text-[10px]`}>{a.status}</Badge>
              </div>
              <p className="text-xs text-tbc-gray font-mono">Ref: {a.refNumber}</p>
              <p className="text-xs text-tbc-gray mt-1">{a.email} • {a.phone} {a.preferredChapter ? `• ${a.preferredChapter}` : ''}</p>
              <p className="text-xs text-tbc-gray">{a.business} {a.category ? `— ${a.category}` : ''} {a.city ? `• ${a.city}` : ''}</p>
            </div>
            <select value={a.status} onChange={e => changeStatus(a.id, e.target.value)}
              className="px-2 py-1.5 border rounded-md bg-white text-xs text-tbc-charcoal shrink-0">
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  )
}

// ===================== Chapters =====================
function ChaptersSection() {
  const { toast } = useToast()
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<Chapter> | null>(null)

  const empty = { name: '', location: '', city: '', area: '', meetingDay: 'Monday', meetingTime: '08:00 AM', description: '', categories: '', image: '', active: true }

  const [loadTick, setLoadTick] = useState(0)
  const load = useCallback(() => setLoadTick(t => t + 1), [])

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/chapters')
      .then(r => r.json())
      .then(d => { if (!cancelled) setChapters(Array.isArray(d) ? d : []) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [loadTick])

  const save = async () => {
    if (!editing) return
    const method = editing.id ? 'PATCH' : 'POST'
    const res = await fetch('/api/admin/chapters', {
      method, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    })
    const data = await res.json()
    if (res.ok) {
      toast({ title: editing.id ? 'Chapter updated' : 'Chapter created' })
      setEditing(null); load()
    } else toast({ title: data.error || 'Save failed', variant: 'destructive' })
  }

  const remove = async (id: string) => {
    if (!confirm('Deactivate this chapter? Members stay intact.')) return
    const res = await fetch(`/api/admin/chapters?id=${id}`, { method: 'DELETE' })
    if (res.ok) { toast({ title: 'Chapter deactivated' }); load() }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-tbc-gray">{chapters.length} chapter(s)</p>
        <Button onClick={() => setEditing(empty)} className="bg-tbc-red hover:bg-tbc-red-dark text-white text-sm">
          <Plus className="h-4 w-4 mr-1" /> Add Chapter
        </Button>
      </div>

      {editing && (
        <div className="bg-white rounded-xl p-4 sm:p-6 border-2 border-tbc-red/30 shadow-sm space-y-3">
          <h3 className="font-bold text-tbc-charcoal">{editing.id ? 'Edit Chapter' : 'New Chapter'}</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className="text-xs font-medium block mb-1">Name *</label><Input value={editing.name || ''} onChange={e => setEditing({ ...editing, name: e.target.value })} /></div>
            <div><label className="text-xs font-medium block mb-1">City *</label><Input value={editing.city || ''} onChange={e => setEditing({ ...editing, city: e.target.value })} /></div>
            <div className="sm:col-span-2"><label className="text-xs font-medium block mb-1">Location *</label><Input value={editing.location || ''} onChange={e => setEditing({ ...editing, location: e.target.value })} placeholder="Full address / venue" /></div>
            <div><label className="text-xs font-medium block mb-1">Area</label><Input value={editing.area || ''} onChange={e => setEditing({ ...editing, area: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-medium block mb-1">Day *</label>
                <select value={editing.meetingDay || 'Monday'} onChange={e => setEditing({ ...editing, meetingDay: e.target.value })} className="w-full px-3 py-2 border rounded-md bg-white text-sm">
                  {MEETING_DAYS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div><label className="text-xs font-medium block mb-1">Time *</label><Input value={editing.meetingTime || ''} onChange={e => setEditing({ ...editing, meetingTime: e.target.value })} placeholder="08:00 AM" /></div>
            </div>
            <div className="sm:col-span-2"><label className="text-xs font-medium block mb-1">Categories (comma separated)</label><Input value={editing.categories || ''} onChange={e => setEditing({ ...editing, categories: e.target.value })} placeholder="Healthcare, Finance, Real Estate" /></div>
            <div className="sm:col-span-2"><label className="text-xs font-medium block mb-1">Description</label><Textarea rows={2} value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} /></div>
            <div className="sm:col-span-2"><PhotoUpload label="Chapter Image" value={editing.image || ''} onChange={url => setEditing({ ...editing, image: url })} /></div>
          </div>
          <div className="flex gap-2">
            <Button onClick={save} className="bg-tbc-red hover:bg-tbc-red-dark text-white text-sm">Save</Button>
            <Button onClick={() => setEditing(null)} variant="outline" className="text-sm">Cancel</Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-white rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {chapters.map(c => (
            <div key={c.id} className={`bg-white rounded-xl p-4 border shadow-sm ${!c.active ? 'opacity-60 border-gray-200' : 'border-gray-100'}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-bold text-sm text-tbc-charcoal">{c.name}</p>
                  <p className="text-xs text-tbc-gray mt-0.5">{c.location} • {c.city}</p>
                  <p className="text-xs text-tbc-gray">{c.meetingDay} at {c.meetingTime}</p>
                  <p className="text-[11px] text-tbc-gray mt-1">
                    {c._count?.members ?? 0} members • {c._count?.visitorRequests ?? 0} visitors
                    {!c.active && ' • INACTIVE'}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => setEditing(c)} className="p-2 text-gray-400 hover:text-tbc-red"><Pencil className="h-4 w-4" /></button>
                  {c.active && <button onClick={() => remove(c.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ===================== Members =====================
function MembersSection() {
  const { toast } = useToast()
  const [members, setMembers] = useState<Member[]>([])
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<Member> | null>(null)
  const [q, setQ] = useState('')

  const empty: Partial<Member> = { name: '', email: '', phone: '', photo: '', business: '', category: '', profession: '', city: '', description: '', chapterId: '', active: true, featured: false }

  const [loadTick, setLoadTick] = useState(0)
  const load = useCallback(() => setLoadTick(t => t + 1), [])

  useEffect(() => {
    let cancelled = false
    Promise.all([fetch('/api/admin/members'), fetch('/api/admin/chapters')])
      .then(async ([mr, cr]) => {
        if (mr.ok) { const m = await mr.json(); if (!cancelled) setMembers(Array.isArray(m) ? m : []) }
        if (cr.ok) { const c = await cr.json(); if (!cancelled) setChapters(Array.isArray(c) ? c.filter(Boolean) : []) }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [loadTick])

  const filtered = members.filter(m =>
    !q || m.name.toLowerCase().includes(q.toLowerCase()) || (m.business || '').toLowerCase().includes(q.toLowerCase()) || (m.category || '').toLowerCase().includes(q.toLowerCase())
  )

  const save = async () => {
    if (!editing) return
    const res = await fetch('/api/admin/members', {
      method: editing.id ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    })
    const data = await res.json()
    if (res.ok) { toast({ title: editing.id ? 'Member updated' : 'Member added' }); setEditing(null); load() }
    else toast({ title: data.error || 'Save failed', variant: 'destructive' })
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this member permanently?')) return
    const res = await fetch(`/api/admin/members?id=${id}`, { method: 'DELETE' })
    if (res.ok) { toast({ title: 'Member deleted' }); load() }
    else toast({ title: 'Delete failed — member may have chapter records', variant: 'destructive' })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input className="pl-10" placeholder="Search members…" value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <Button onClick={() => setEditing(empty)} className="bg-tbc-red hover:bg-tbc-red-dark text-white text-sm w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-1" /> Add Member
        </Button>
      </div>

      {editing && (
        <div className="bg-white rounded-xl p-4 sm:p-6 border-2 border-tbc-red/30 shadow-sm space-y-3">
          <h3 className="font-bold text-tbc-charcoal">{editing.id ? 'Edit Member' : 'New Member'}</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className="text-xs font-medium block mb-1">Name *</label><Input value={editing.name || ''} onChange={e => setEditing({ ...editing, name: e.target.value })} /></div>
            <div><label className="text-xs font-medium block mb-1">Email *</label><Input type="email" value={editing.email || ''} onChange={e => setEditing({ ...editing, email: e.target.value })} /></div>
            <div><label className="text-xs font-medium block mb-1">Phone</label><Input value={editing.phone || ''} onChange={e => setEditing({ ...editing, phone: e.target.value })} /></div>
            <div><label className="text-xs font-medium block mb-1">Business</label><Input value={editing.business || ''} onChange={e => setEditing({ ...editing, business: e.target.value })} /></div>
            <div>
              <label className="text-xs font-medium block mb-1">Category</label>
              <select value={editing.category || ''} onChange={e => setEditing({ ...editing, category: e.target.value })} className="w-full px-3 py-2 border rounded-md bg-white text-sm">
                <option value="">Select category</option>
                {BUSINESSES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label className="text-xs font-medium block mb-1">Profession</label><Input value={editing.profession || ''} onChange={e => setEditing({ ...editing, profession: e.target.value })} /></div>
            <div><label className="text-xs font-medium block mb-1">City</label><Input value={editing.city || ''} onChange={e => setEditing({ ...editing, city: e.target.value })} /></div>
            <div>
              <label className="text-xs font-medium block mb-1">Assign Chapter</label>
              <select value={editing.chapterId || ''} onChange={e => setEditing({ ...editing, chapterId: e.target.value })} className="w-full px-3 py-2 border rounded-md bg-white text-sm">
                <option value="">No chapter</option>
                {chapters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2"><label className="text-xs font-medium block mb-1">Description</label><Textarea rows={2} value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} /></div>
            <div className="sm:col-span-2"><PhotoUpload label="Member Photo" value={editing.photo || ''} onChange={url => setEditing({ ...editing, photo: url })} /></div>
          </div>
          <div className="flex gap-2">
            <Button onClick={save} className="bg-tbc-red hover:bg-tbc-red-dark text-white text-sm">Save</Button>
            <Button onClick={() => setEditing(null)} variant="outline" className="text-sm">Cancel</Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-white rounded-xl animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100"><EmptyState icon={Star} text="No members found" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(m => (
            <div key={m.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-start gap-3">
                {m.photo ? (
                  <img src={m.photo} alt={m.name} className="h-12 w-12 rounded-full object-cover border" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-tbc-red-light text-tbc-red flex items-center justify-center font-bold text-sm">
                    {m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm text-tbc-charcoal truncate">{m.name} {!m.active && <span className="text-[10px] text-red-500">(inactive)</span>}</p>
                  <p className="text-xs text-tbc-gray truncate">{m.business || '—'}</p>
                  <p className="text-[11px] text-tbc-gray truncate">{m.chapter?.name || 'No chapter'}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => setEditing(m)} className="p-1.5 text-gray-400 hover:text-tbc-red"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => remove(m.id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ===================== Events =====================
function EventsSection() {
  const { toast } = useToast()
  const [events, setEvents] = useState<EventItem[]>([])
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<EventItem> | null>(null)

  const empty: Partial<EventItem> = { title: '', description: '', image: '', date: '', time: '', location: '', chapterId: '', type: 'networking', featured: false, active: true }

  const [loadTick, setLoadTick] = useState(0)
  const load = useCallback(() => setLoadTick(t => t + 1), [])

  useEffect(() => {
    let cancelled = false
    Promise.all([fetch('/api/admin/events'), fetch('/api/admin/chapters')])
      .then(async ([er, cr]) => {
        if (er.ok) { const e = await er.json(); if (!cancelled) setEvents(Array.isArray(e) ? e : []) }
        if (cr.ok) { const c = await cr.json(); if (!cancelled) setChapters(Array.isArray(c) ? c.filter(Boolean) : []) }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [loadTick])

  const save = async () => {
    if (!editing) return
    const res = await fetch('/api/admin/events', {
      method: editing.id ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    })
    const data = await res.json()
    if (res.ok) { toast({ title: editing.id ? 'Event updated' : 'Event created' }); setEditing(null); load() }
    else toast({ title: data.error || 'Save failed', variant: 'destructive' })
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this event permanently?')) return
    const res = await fetch(`/api/admin/events?id=${id}`, { method: 'DELETE' })
    if (res.ok) { toast({ title: 'Event deleted' }); load() }
    else toast({ title: 'Delete failed — event may have registrations', variant: 'destructive' })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-tbc-gray">{events.length} event(s)</p>
        <Button onClick={() => setEditing(empty)} className="bg-tbc-red hover:bg-tbc-red-dark text-white text-sm">
          <Plus className="h-4 w-4 mr-1" /> Add Event
        </Button>
      </div>

      {editing && (
        <div className="bg-white rounded-xl p-4 sm:p-6 border-2 border-tbc-red/30 shadow-sm space-y-3">
          <h3 className="font-bold text-tbc-charcoal">{editing.id ? 'Edit Event' : 'New Event'}</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2"><label className="text-xs font-medium block mb-1">Title *</label><Input value={editing.title || ''} onChange={e => setEditing({ ...editing, title: e.target.value })} /></div>
            <div><label className="text-xs font-medium block mb-1">Date *</label><Input type="date" value={editing.date || ''} onChange={e => setEditing({ ...editing, date: e.target.value })} /></div>
            <div><label className="text-xs font-medium block mb-1">Time</label><Input value={editing.time || ''} onChange={e => setEditing({ ...editing, time: e.target.value })} placeholder="10:00 AM" /></div>
            <div className="sm:col-span-2"><label className="text-xs font-medium block mb-1">Location</label><Input value={editing.location || ''} onChange={e => setEditing({ ...editing, location: e.target.value })} /></div>
            <div>
              <label className="text-xs font-medium block mb-1">Event Type</label>
              <select value={editing.type || 'networking'} onChange={e => setEditing({ ...editing, type: e.target.value })} className="w-full px-3 py-2 border rounded-md bg-white text-sm">
                {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Assign to Chapter</label>
              <select value={editing.chapterId || ''} onChange={e => setEditing({ ...editing, chapterId: e.target.value })} className="w-full px-3 py-2 border rounded-md bg-white text-sm">
                <option value="">All chapters / none</option>
                {chapters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2"><label className="text-xs font-medium block mb-1">Description</label><Textarea rows={3} value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} /></div>
            <div className="sm:col-span-2"><PhotoUpload label="Event Image" value={editing.image || ''} onChange={url => setEditing({ ...editing, image: url })} /></div>
          </div>
          <div className="flex gap-2">
            <Button onClick={save} className="bg-tbc-red hover:bg-tbc-red-dark text-white text-sm">Save</Button>
            <Button onClick={() => setEditing(null)} variant="outline" className="text-sm">Cancel</Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-white rounded-xl animate-pulse" />)}</div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100"><EmptyState icon={Calendar} text="No events yet" /></div>
      ) : (
        <div className="space-y-3">
          {events.map(ev => (
            <div key={ev.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-start gap-3">
              {ev.image ? (
                <img src={ev.image} alt={ev.title} className="h-14 w-14 rounded-lg object-cover border shrink-0" />
              ) : (
                <div className="h-14 w-14 rounded-lg bg-tbc-red-light text-tbc-red flex items-center justify-center shrink-0">
                  <Calendar className="h-6 w-6" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-sm text-tbc-charcoal truncate">{ev.title}</p>
                  <Badge variant="secondary" className="text-[10px] bg-tbc-red-light text-tbc-red">{ev.type}</Badge>
                  {!ev.active && <span className="text-[10px] text-red-500">(inactive)</span>}
                </div>
                <p className="text-xs text-tbc-gray mt-0.5">
                  {new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  {ev.time ? ` • ${ev.time}` : ''} • {ev._count?.registrations ?? 0} registrations
                </p>
                <p className="text-xs text-tbc-gray">
                  {ev.chapter ? `📍 ${ev.chapter.name}` : '📍 All chapters'} {ev.location ? `• ${ev.location}` : ''}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => setEditing(ev)} className="p-1.5 text-gray-400 hover:text-tbc-red"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => remove(ev.id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ===================== Testimonials =====================
function TestimonialsSection() {
  const { toast } = useToast()
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null)

  const empty: Partial<Testimonial> = { name: '', business: '', category: '', photo: '', quote: '', featured: false }

  const [loadTick, setLoadTick] = useState(0)
  const load = useCallback(() => setLoadTick(t => t + 1), [])

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/testimonials')
      .then(r => r.json())
      .then(d => { if (!cancelled) setItems(Array.isArray(d) ? d : []) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [loadTick])

  const save = async () => {
    if (!editing) return
    const res = await fetch('/api/admin/testimonials', {
      method: editing.id ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    })
    const data = await res.json()
    if (res.ok) { toast({ title: 'Saved' }); setEditing(null); load() }
    else toast({ title: data.error || 'Save failed', variant: 'destructive' })
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return
    const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: 'DELETE' })
    if (res.ok) { toast({ title: 'Deleted' }); load() }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-tbc-gray">{items.length} testimonial(s)</p>
        <Button onClick={() => setEditing(empty)} className="bg-tbc-red hover:bg-tbc-red-dark text-white text-sm">
          <Plus className="h-4 w-4 mr-1" /> Add Testimonial
        </Button>
      </div>

      {editing && (
        <div className="bg-white rounded-xl p-4 sm:p-6 border-2 border-tbc-red/30 shadow-sm space-y-3">
          <h3 className="font-bold text-tbc-charcoal">{editing.id ? 'Edit Testimonial' : 'New Testimonial'}</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className="text-xs font-medium block mb-1">Name *</label><Input value={editing.name || ''} onChange={e => setEditing({ ...editing, name: e.target.value })} /></div>
            <div><label className="text-xs font-medium block mb-1">Business</label><Input value={editing.business || ''} onChange={e => setEditing({ ...editing, business: e.target.value })} /></div>
            <div><label className="text-xs font-medium block mb-1">Category</label><Input value={editing.category || ''} onChange={e => setEditing({ ...editing, category: e.target.value })} /></div>
            <div className="sm:col-span-2"><label className="text-xs font-medium block mb-1">Quote *</label><Textarea rows={3} value={editing.quote || ''} onChange={e => setEditing({ ...editing, quote: e.target.value })} /></div>
            <div className="sm:col-span-2"><PhotoUpload label="Photo" value={editing.photo || ''} onChange={url => setEditing({ ...editing, photo: url })} /></div>
          </div>
          <div className="flex gap-2">
            <Button onClick={save} className="bg-tbc-red hover:bg-tbc-red-dark text-white text-sm">Save</Button>
            <Button onClick={() => setEditing(null)} variant="outline" className="text-sm">Cancel</Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[...Array(2)].map((_, i) => <div key={i} className="h-24 bg-white rounded-xl animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100"><EmptyState icon={MessageCircle} text="No testimonials yet" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {items.map(t => (
            <div key={t.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-start gap-3">
                {t.photo ? (
                  <img src={t.photo} alt={t.name} className="h-10 w-10 rounded-full object-cover border" />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-tbc-red text-white flex items-center justify-center text-xs font-bold">
                    {t.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm text-tbc-charcoal">{t.name}</p>
                  <p className="text-xs text-tbc-gray">{t.business}</p>
                  <p className="text-xs text-tbc-gray italic mt-1 line-clamp-3">&ldquo;{t.quote}&rdquo;</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => setEditing(t)} className="p-1.5 text-gray-400 hover:text-tbc-red"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => remove(t.id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ===================== Inquiries =====================
function InquiriesSection() {
  const { toast } = useToast()
  const [items, setItems] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)

  const [loadTick, setLoadTick] = useState(0)
  const load = useCallback(() => setLoadTick(t => t + 1), [])

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/inquiries')
      .then(r => r.json())
      .then(d => { if (!cancelled) setItems(Array.isArray(d) ? d : []) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [loadTick])

  const remove = async (id: string) => {
    if (!confirm('Delete this inquiry?')) return
    const res = await fetch(`/api/admin/inquiries?id=${id}`, { method: 'DELETE' })
    if (res.ok) { toast({ title: 'Deleted' }); load() }
  }

  return loading ? (
    <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-white rounded-xl animate-pulse" />)}</div>
  ) : items.length === 0 ? (
    <div className="bg-white rounded-xl border border-gray-100"><EmptyState icon={Mail} text="No contact inquiries" /></div>
  ) : (
    <div className="space-y-3">
      {items.map(i => (
        <div key={i.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-bold text-sm text-tbc-charcoal">{i.name} {i.subject && <span className="font-normal text-tbc-gray">— {i.subject}</span>}</p>
              <p className="text-xs text-tbc-gray">{i.email} {i.phone ? `• ${i.phone}` : ''}</p>
              <p className="text-xs text-tbc-gray mt-1.5">{i.message}</p>
              <p className="text-[11px] text-gray-400 mt-1.5">{new Date(i.createdAt).toLocaleString('en-IN')}</p>
            </div>
            <button onClick={() => remove(i.id)} className="p-2 text-gray-400 hover:text-red-500 shrink-0"><Trash2 className="h-4 w-4" /></button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ===================== Export =====================
function ExportSection() {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    fetch('/api/admin/chapters').then(r => r.json()).then(d => setChapters(Array.isArray(d) ? d : [])).catch(() => {})
  }, [])

  const download = (type: string, chapterId?: string) => {
    setBusy(true)
    const url = `/api/admin/export?type=${type}${chapterId ? `&chapterId=${chapterId}` : ''}`
    // Fetch as blob to force download with auth cookie
    fetch(url).then(res => {
      if (!res.ok) throw new Error()
      return res.blob()
    }).then(blob => {
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = ''
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(a.href)
    }).finally(() => setBusy(false))
  }

  return (
    <div className="space-y-4">
      {/* All-together exports */}
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-tbc-charcoal mb-1 flex items-center gap-2">
          <Download className="h-4 w-4 text-tbc-red" /> Download Everything
        </h3>
        <p className="text-xs text-tbc-gray mb-4">All chapters combined in one Excel file, with ref numbers and complete details.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button disabled={busy} onClick={() => download('visitors')} className="bg-tbc-red hover:bg-tbc-red-dark text-white text-sm flex-1">
            <Download className="h-4 w-4 mr-1.5" /> All Visitors (Excel)
          </Button>
          <Button disabled={busy} onClick={() => download('members')} variant="outline" className="border-tbc-red text-tbc-red hover:bg-tbc-red hover:text-white text-sm flex-1">
            <Download className="h-4 w-4 mr-1.5" /> All Members (Excel)
          </Button>
        </div>
      </div>

      {/* Chapter-wise exports */}
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-tbc-charcoal mb-1 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-tbc-red" /> Chapter-wise Download
        </h3>
        <p className="text-xs text-tbc-gray mb-4">Visitors of a specific chapter in one Excel file.</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {chapters.length === 0 ? (
            <p className="text-sm text-tbc-gray">No chapters yet.</p>
          ) : chapters.map(c => (
            <div key={c.id} className="flex items-center justify-between gap-2 p-3 rounded-lg border border-gray-100 hover:border-tbc-red/30 transition-colors">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-tbc-charcoal truncate">{c.name}</p>
                <p className="text-[11px] text-tbc-gray">{c.city} • {c._count?.visitorRequests ?? 0} visitors</p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button disabled={busy} onClick={() => download('visitors', c.id)}
                  className="px-2.5 py-1.5 rounded-md bg-tbc-red/10 text-tbc-red text-xs font-medium hover:bg-tbc-red hover:text-white transition-colors">
                  Visitors
                </button>
                <button disabled={busy} onClick={() => download('members', c.id)}
                  className="px-2.5 py-1.5 rounded-md bg-gray-100 text-tbc-gray text-xs font-medium hover:bg-gray-200 transition-colors">
                  Members
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ===================== Admins =====================
function AdminsSection({ meRole }: { meRole?: string }) {
  const { toast } = useToast()
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [me, setMe] = useState<{ id: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', mobile: '', password: '' })

  const [loadTick, setLoadTick] = useState(0)
  const load = useCallback(() => setLoadTick(t => t + 1), [])

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/admins')
      .then(r => r.json())
      .then(d => {
        if (!cancelled) {
          setAdmins(Array.isArray(d.admins) ? d.admins : [])
          setMe(d.me || null)
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [loadTick])

  const add = async () => {
    const res = await fetch('/api/admin/admins', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAdmin),
    })
    const data = await res.json()
    if (res.ok) { toast({ title: 'Admin added' }); setAdding(false); setNewAdmin({ name: '', email: '', mobile: '', password: '' }); load() }
    else toast({ title: data.error || 'Failed', variant: 'destructive' })
  }

  const toggle = async (id: string, active: boolean) => {
    const res = await fetch('/api/admin/admins', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, active }),
    })
    const data = await res.json()
    if (res.ok) { toast({ title: 'Updated' }); load() }
    else toast({ title: data.error || 'Failed', variant: 'destructive' })
  }

  const remove = async (id: string) => {
    if (!confirm('Remove this admin permanently?')) return
    const res = await fetch(`/api/admin/admins?id=${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (res.ok) { toast({ title: 'Admin removed' }); load() }
    else toast({ title: data.error || 'Failed', variant: 'destructive' })
  }

  if (meRole !== 'superadmin') {
    return <div className="bg-white rounded-xl p-6 border border-gray-100 text-center text-sm text-tbc-gray">Only superadmin can manage admin users.</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-tbc-gray">{admins.length} admin(s)</p>
        <Button onClick={() => setAdding(!adding)} className="bg-tbc-red hover:bg-tbc-red-dark text-white text-sm">
          <Plus className="h-4 w-4 mr-1" /> Add Admin
        </Button>
      </div>

      {adding && (
        <div className="bg-white rounded-xl p-4 sm:p-6 border-2 border-tbc-red/30 shadow-sm space-y-3">
          <h3 className="font-bold text-tbc-charcoal">New Admin</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className="text-xs font-medium block mb-1">Name *</label><Input value={newAdmin.name} onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })} /></div>
            <div><label className="text-xs font-medium block mb-1">Email *</label><Input type="email" value={newAdmin.email} onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })} /></div>
            <div><label className="text-xs font-medium block mb-1">WhatsApp Mobile (10-digit) *</label><Input value={newAdmin.mobile} onChange={e => setNewAdmin({ ...newAdmin, mobile: e.target.value })} /></div>
            <div><label className="text-xs font-medium block mb-1">Password (min 8) *</label><Input type="password" value={newAdmin.password} onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })} /></div>
          </div>
          <div className="flex gap-2">
            <Button onClick={add} className="bg-tbc-red hover:bg-tbc-red-dark text-white text-sm">Add</Button>
            <Button onClick={() => setAdding(false)} variant="outline" className="text-sm">Cancel</Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[...Array(2)].map((_, i) => <div key={i} className="h-20 bg-white rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="space-y-3">
          {admins.map(a => (
            <div key={a.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold text-sm text-tbc-charcoal">
                  {a.name} {a.id === me?.id && <Badge className="bg-tbc-red-light text-tbc-red text-[10px] ml-1">You</Badge>}
                </p>
                <p className="text-xs text-tbc-gray">{a.email} • {a.mobile} • {a.role}</p>
                {!a.active && <p className="text-[11px] text-red-500">disabled</p>}
              </div>
              {a.id !== me?.id && (
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => toggle(a.id, !a.active)}
                    className={`px-2.5 py-1.5 rounded-md text-xs font-medium ${a.active ? 'bg-gray-100 text-tbc-gray hover:bg-gray-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                    {a.active ? 'Disable' : 'Enable'}
                  </button>
                  <button onClick={() => remove(a.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ===================== Settings =====================
function SettingsSection() {
  const { toast } = useToast()
  const [whatsappUrl, setWhatsappUrl] = useState('')
  const [whatsappToken, setWhatsappToken] = useState('')
  const [configured, setConfigured] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(d => {
      if (d.whatsapp_api_url) setWhatsappUrl(d.whatsapp_api_url)
      if (d.whatsapp_api_token) setWhatsappToken('••••••••••••••••')
      setConfigured(Boolean(d.whatsapp_api_url && d.whatsapp_api_token))
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const save = async () => {
    setSaving(true)
    const body: any = { whatsapp_api_url: whatsappUrl }
    if (whatsappToken && !whatsappToken.startsWith('••')) body.whatsapp_api_token = whatsappToken
    const res = await fetch('/api/admin/settings', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    })
    if (res.ok) { toast({ title: 'Settings saved' }); setConfigured(true); setWhatsappToken('••••••••••••••••') }
    else toast({ title: 'Save failed', variant: 'destructive' })
    setSaving(false)
  }

  if (loading) return <div className="h-40 bg-white rounded-xl animate-pulse" />

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-green-600" />
          <h3 className="font-bold text-tbc-charcoal">WhatsApp API (for password reset)</h3>
          {configured && <Badge className="bg-green-100 text-green-700 text-[10px]">Configured</Badge>}
        </div>
        <p className="text-xs text-tbc-gray">
          When configured, password reset codes are delivered automatically to the admin&apos;s
          WhatsApp. Without it, a wa.me self-send link is shown instead (still delivers the code
          to WhatsApp). Works with any WhatsApp Cloud API compatible endpoint.
        </p>
        <div>
          <label className="text-xs font-medium block mb-1">API URL</label>
          <Input value={whatsappUrl} onChange={e => setWhatsappUrl(e.target.value)}
            placeholder="https://graph.facebook.com/v21.0/<phone-id>/messages" />
        </div>
        <div>
          <label className="text-xs font-medium block mb-1">API Token</label>
          <Input type="password" value={whatsappToken} onChange={e => setWhatsappToken(e.target.value)}
            placeholder="Permanent access token" />
        </div>
        <Button onClick={save} disabled={saving} className="bg-tbc-red hover:bg-tbc-red-dark text-white text-sm">
          {saving ? 'Saving…' : 'Save Settings'}
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 sm:p-6">
        <h4 className="font-bold text-sm text-blue-900 mb-2">How password reset works</h4>
        <ol className="text-xs text-blue-800 space-y-1.5 list-decimal list-inside">
          <li>Admin taps &ldquo;Forgot password?&rdquo; on the login screen</li>
          <li>Enters their registered mobile number</li>
          <li>A 6-digit code (valid 10 minutes) is sent to their WhatsApp</li>
          <li>Admin enters the code + sets a new password</li>
          <li>All old sessions are logged out for security</li>
        </ol>
      </div>
    </div>
  )
}
