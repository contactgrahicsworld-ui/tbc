'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock, KeyRound } from 'lucide-react'
import { Suspense } from 'react'

function ResetContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mobile] = useState(searchParams.get('mobile') || '')

  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const doReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (newPassword !== confirm) { setError('Passwords do not match'); return }
    if (newPassword.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/admin/reset', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, code, newPassword }),
      })
      const data = await res.json()
      if (res.ok) { router.replace('/admin') }
      else setError(data.error || 'Reset failed')
    } catch { setError('Network error') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-tbc-charcoal flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-tbc-red mb-4 shadow-xl shadow-tbc-red/30">
            <KeyRound className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Set New Password</h1>
          <p className="text-sm text-gray-400 mt-1">Enter the code from your WhatsApp</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
          <form onSubmit={doReset} className="space-y-3">
            <div>
              <label className="text-xs font-medium text-tbc-charcoal mb-1 block">WhatsApp Mobile</label>
              <Input value={mobile} disabled className="bg-gray-50" />
            </div>
            <div>
              <label className="text-xs font-medium text-tbc-charcoal mb-1 block">6-Digit Reset Code *</label>
              <Input
                placeholder="000000"
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                inputMode="numeric"
                className="text-center text-xl tracking-[0.5em] font-mono"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input className="pl-10" type="password" placeholder="New password (min 8 chars) *"
                value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={8} />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input className="pl-10" type="password" placeholder="Confirm new password *"
                value={confirm} onChange={e => setConfirm(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" disabled={loading || code.length !== 6}
              className="w-full bg-tbc-red hover:bg-tbc-red-dark text-white">
              {loading ? 'Saving…' : 'Set New Password'}
            </Button>
          </form>
          <Link href="/admin/login" className="block text-center text-sm text-tbc-gray hover:text-tbc-red mt-4">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function AdminResetPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-tbc-charcoal flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-tbc-red border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ResetContent />
    </Suspense>
  )
}
