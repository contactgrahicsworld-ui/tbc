import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { hashCode, hashPassword, normalizeMobile, createSession } from '@/lib/admin-auth'
import { rateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'

// POST /api/admin/reset — body: { mobile, code, newPassword }
export async function POST(request: Request) {
  const limited = rateLimit(request, 'admin-reset', 10, 5 * 60_000)
  if (limited) return limited
  try {
    const body = await request.json()
    const { mobile, code, newPassword } = body

    if (!mobile || !code || !newPassword) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }
    if (String(newPassword).length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const normMobile = normalizeMobile(mobile)
    const admin = await db.admin.findFirst({ where: { mobile: normMobile } })
    if (!admin) {
      return NextResponse.json({ error: 'Invalid code or expired' }, { status: 400 })
    }

    // Find latest unused reset for this admin
    const reset = await db.passwordReset.findFirst({
      where: { adminId: admin.id, used: false },
      orderBy: { createdAt: 'desc' },
    })

    if (!reset || reset.expiresAt < new Date() || reset.code !== hashCode(String(code))) {
      return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 })
    }

    // Mark code used + set new password
    await db.passwordReset.update({ where: { id: reset.id }, data: { used: true } })
    await db.admin.update({
      where: { id: admin.id },
      data: { password: hashPassword(String(newPassword)) },
    })

    // Kill all existing sessions (force re-login everywhere)
    await db.adminSession.deleteMany({ where: { adminId: admin.id } })

    // Log the admin in with the new password
    await createSession(admin.id)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Reset failed' }, { status: 500 })
  }
}
