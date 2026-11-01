import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { verifyPassword, createSession, normalizeMobile } from '@/lib/admin-auth'
import { rateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'

// POST /api/admin/login — body: { identifier (email or mobile), password }
export async function POST(request: Request) {
  const limited = rateLimit(request, 'admin-login', 10, 5 * 60_000)
  if (limited) return limited
  try {
    const body = await request.json()
    const { identifier, password } = body

    if (!identifier || !password) {
      return NextResponse.json({ error: 'Enter email/mobile and password' }, { status: 400 })
    }

    const idStr = String(identifier).toLowerCase().trim()
    const mobile = normalizeMobile(identifier)

    const admin = await db.admin.findFirst({
      where: { OR: [{ email: idStr }, { mobile }] },
    })

    if (!admin || !verifyPassword(String(password), admin.password)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    if (!admin.active) {
      return NextResponse.json({ error: 'Account disabled' }, { status: 403 })
    }

    await createSession(admin.id)

    return NextResponse.json({
      success: true,
      admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
    })
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
