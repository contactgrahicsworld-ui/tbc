import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { requireAdmin, hashPassword, normalizeMobile } from '@/lib/admin-auth'

export const runtime = 'nodejs'

// List admins (superadmin can add more admins)
export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admins = await db.admin.findMany({
    select: { id: true, name: true, email: true, mobile: true, role: true, active: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  })
  return NextResponse.json({ admins, me: admin })
}

export async function POST(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (admin.role !== 'superadmin') {
    return NextResponse.json({ error: 'Only superadmin can add admins' }, { status: 403 })
  }

  try {
    const b = await request.json()
    if (!b.name || !b.email || !b.mobile || !b.password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }
    if (String(b.password).length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }
    const normMobile = normalizeMobile(b.mobile)
    if (!/^\d{10}$/.test(normMobile)) {
      return NextResponse.json({ error: 'Enter a valid 10-digit mobile' }, { status: 400 })
    }

    const created = await db.admin.create({
      data: {
        name: String(b.name).slice(0, 100),
        email: String(b.email).toLowerCase().trim(),
        mobile: normMobile,
        password: hashPassword(String(b.password)),
        role: b.role === 'admin' ? 'admin' : 'admin',
      },
      select: { id: true, name: true, email: true, mobile: true, role: true },
    })
    return NextResponse.json(created)
  } catch (e: any) {
    if (String(e?.code) === 'P2002') {
      return NextResponse.json({ error: 'Email or mobile already registered' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Create failed' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (admin.role !== 'superadmin') {
    return NextResponse.json({ error: 'Only superadmin can manage admins' }, { status: 403 })
  }

  try {
    const { id, active } = await request.json()
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    if (id === admin.id) {
      return NextResponse.json({ error: 'You cannot disable your own account' }, { status: 400 })
    }
    const updated = await db.admin.update({
      where: { id },
      data: { active: Boolean(active) },
      select: { id: true, active: true },
    })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (admin.role !== 'superadmin') {
    return NextResponse.json({ error: 'Only superadmin can remove admins' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  if (id === admin.id) {
    return NextResponse.json({ error: 'You cannot remove your own account' }, { status: 400 })
  }

  try {
    await db.admin.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
