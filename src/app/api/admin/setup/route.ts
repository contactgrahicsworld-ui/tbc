import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { adminExists, hashPassword, normalizeMobile } from '@/lib/admin-auth'
import { rateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'

// GET /api/admin/setup → { setupNeeded: boolean }
export async function GET() {
  const exists = await adminExists()
  return NextResponse.json({ setupNeeded: !exists })
}

// POST /api/admin/setup → create first admin (only when none exists)
export async function POST(request: Request) {
  const limited = rateLimit(request, 'admin-setup', 5, 5 * 60_000)
  if (limited) return limited
  try {
    // Hard gate: once an admin exists, this route is permanently disabled
    if (await adminExists()) {
      return NextResponse.json(
        { error: 'Setup already completed. Please log in.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, email, mobile, password } = body

    if (!name || !email || !mobile || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }
    if (String(password).length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const normMobile = normalizeMobile(mobile)
    if (!/^\d{10}$/.test(normMobile)) {
      return NextResponse.json(
        { error: 'Enter a valid 10-digit mobile number' },
        { status: 400 }
      )
    }

    const emailStr = String(email).toLowerCase().trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr)) {
      return NextResponse.json({ error: 'Enter a valid email' }, { status: 400 })
    }

    const admin = await db.admin.create({
      data: {
        name: String(name).slice(0, 100),
        email: emailStr,
        mobile: normMobile,
        password: hashPassword(String(password)),
        role: 'superadmin',
      },
    })

    return NextResponse.json({
      success: true,
      admin: { id: admin.id, name: admin.name, email: admin.email },
    })
  } catch (e: any) {
    if (String(e?.code) === 'P2002') {
      return NextResponse.json(
        { error: 'Email or mobile already registered' },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Setup failed' }, { status: 500 })
  }
}
