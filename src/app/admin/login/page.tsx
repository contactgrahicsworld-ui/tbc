'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock, Mail, Phone, User, ShieldCheck, MessageCircle, ArrowLeft } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'loading' | 'setup' | 'login' | 'forgot'>('loading')

  // Setup form
  const [setup, setSetup] = useState({ name: '', email: '', mobile: '', password: '', confirm: '' })
  // Login form
  const [login, setLogin] = useState({ identifier: '', password: '' })
  // Forgot form
  const [forgotMobile, setForgotMobile] = useState('')
  const [forgotResult, setForgotResult] = useState<{ sent: boolean; fallbackLink?: string; message: string } | null>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Already logged in? → dashboard
    fetch('/api/admin/me').then(r => r.json()).then(d => {
      if (d.admin) { router.replace('/admin'); return }
      // No admin → first-time setup
      if (d.setupNeeded) setMode('setup')
      else setMode('login')
    }).catch(() => setMode('login'))
  }, [router])

  const doSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (setup.password !== setup.confirm) { setError('Passwords do not match'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/admin/setup', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(setup),
      })
      const data = await res.json()
      if (res.ok) { router.replace('/admin') }
      else setError(data.error || 'Setup failed')
    } catch { setError('Network error') }
    setLoading(false)
  }

  const doLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(login),
      })
      const data = await res.json()
      if (res.ok) { router.replace('/admin') }
      else setError(data.error || 'Login failed')
    } catch { setError('Network error') }
    setLoading(false)
  }

  const doForgot = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setForgotResult(null)
    setLoading(true)
    try {
      const res = await fetch('/api/admin/forgot', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: forgotMobile }),
      })
      const data = await res.json()
      if (res.ok) setForgotResult(data)
      else setError(data.error || 'Failed')
    } catch { setError('Network error') }
    setLoading(false)
  }

  const inputCls = 'pl-10'

  return (
    <div className="min-h-screen bg-tbc-charcoal flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-tbc-red mb-4 shadow-xl shadow-tbc-red/30">
            <Image src="/tbc-logo.png" alt="TBC" width={40} height={40} className="h-10 w-auto" />
          </div>
          <h1 className="text-2xl font-bold text-white">TBC Admin Panel</h1>
          <p className="text-sm text-gray-400 mt-1">Tailik Business Committee</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
          {mode === 'loading' && (
            <div className="py-12 text-center">
              <div className="w-10 h-10 border-4 border-tbc-red border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-tbc-gray mt-4">Loading…</p>
            </div>
          )}

          {/* ===== FIRST-TIME SETUP ===== */}
          {mode === 'setup' && (
            <>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="h-5 w-5 text-tbc-red" />
                <h2 className="text-lg font-bold text-tbc-charcoal">Create Admin Account</h2>
              </div>
              <p className="text-xs text-tbc-gray mb-6">
                No admin exists yet. Create the first admin account — this screen will
                never appear again. Your credentials are set by you, nothing is predefined.
              </p>
              <form onSubmit={doSetup} className="space-y-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input className={inputCls} placeholder="Full name *" value={setup.name}
                    onChange={e => setSetup({ ...setup, name: e.target.value })} required />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input className={inputCls} type="email" placeholder="Email *" value={setup.email}
                    onChange={e => setSetup({ ...setup, email: e.target.value })} required />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input className={inputCls} placeholder="WhatsApp mobile (10-digit) *" value={setup.mobile}
                    onChange={e => setSetup({ ...setup, mobile: e.target.value })} required />
                </div>
                <p className="text-[11px] text-tbc-gray -mt-1">
                  Reset codes will be delivered to this WhatsApp number.
                </p>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input className={inputCls} type="password" placeholder="Password (min 8 chars) *" value={setup.password}
                    onChange={e => setSetup({ ...setup, password: e.target.value })} required minLength={8} />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input className={inputCls} type="password" placeholder="Confirm password *" value={setup.confirm}
                    onChange={e => setSetup({ ...setup, confirm: e.target.value })} required />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" disabled={loading} className="w-full bg-tbc-red hover:bg-tbc-red-dark text-white">
                  {loading ? 'Creating…' : 'Create Admin Account'}
                </Button>
              </form>
            </>
          )}

          {/* ===== LOGIN ===== */}
          {mode === 'login' && (
            <>
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-5 w-5 text-tbc-red" />
                <h2 className="text-lg font-bold text-tbc-charcoal">Admin Login</h2>
              </div>
              <p className="text-xs text-tbc-gray mb-6">Sign in with your email or mobile number.</p>
              <form onSubmit={doLogin} className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input className={inputCls} placeholder="Email or mobile" value={login.identifier}
                    onChange={e => setLogin({ ...login, identifier: e.target.value })} required />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input className={inputCls} type="password" placeholder="Password" value={login.password}
                    onChange={e => setLogin({ ...login, password: e.target.value })} required />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" disabled={loading} className="w-full bg-tbc-red hover:bg-tbc-red-dark text-white">
                  {loading ? 'Signing in…' : 'Sign In'}
                </Button>
              </form>
              <button onClick={() => { setMode('forgot'); setError(''); setForgotResult(null) }}
                className="w-full text-center text-sm text-tbc-red hover:underline mt-4">
                Forgot password?
              </button>
            </>
          )}

          {/* ===== FORGOT PASSWORD ===== */}
          {mode === 'forgot' && (
            <>
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-bold text-tbc-charcoal">Reset via WhatsApp</h2>
              </div>
              <p className="text-xs text-tbc-gray mb-6">
                Enter your registered mobile number. A 6-digit reset code will be
                delivered to your WhatsApp.
              </p>

              {!forgotResult ? (
                <form onSubmit={doForgot} className="space-y-3">
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input className={inputCls} placeholder="Registered mobile number" value={forgotMobile}
                      onChange={e => setForgotMobile(e.target.value)} required />
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <Button type="submit" disabled={loading} className="w-full bg-tbc-red hover:bg-tbc-red-dark text-white">
                    {loading ? 'Sending…' : 'Send Reset Code'}
                  </Button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800">{forgotResult.message}</p>
                  </div>
                  {forgotResult.fallbackLink && (
                    <>
                      <a
                        href={forgotResult.fallbackLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium text-sm"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Get Code on WhatsApp
                      </a>
                      <p className="text-[11px] text-tbc-gray text-center">
                        Tap the button → WhatsApp opens with your code → press send. The code
                        stays in your WhatsApp chat.
                      </p>
                    </>
                  )}
                  <Link href={`/admin/reset?mobile=${encodeURIComponent(forgotMobile)}`}
                    className="block text-center w-full py-3 rounded-lg bg-tbc-red hover:bg-tbc-red-dark text-white font-medium text-sm">
                    I have the code — Set New Password
                  </Link>
                </div>
              )}

              <button onClick={() => { setMode('login'); setError(''); setForgotResult(null) }}
                className="flex items-center gap-1 text-sm text-tbc-gray hover:text-tbc-red mt-4">
                <ArrowLeft className="h-4 w-4" /> Back to login
              </button>
            </>
          )}
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          <Link href="/" className="hover:text-white">← Back to TBC website</Link>
        </p>
      </div>
    </div>
  )
}
