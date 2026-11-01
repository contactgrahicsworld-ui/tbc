import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'

export const runtime = 'nodejs'

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const members = await db.member.findMany({
    include: { chapter: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(members)
}

export async function POST(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const b = await request.json()
    if (!b.name || !b.email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }
    const member = await db.member.create({
      data: {
        name: String(b.name).slice(0, 200),
        email: String(b.email).toLowerCase().trim().slice(0, 200),
        phone: b.phone ? String(b.phone).slice(0, 20) : null,
        photo: b.photo ? String(b.photo).slice(0, 500) : null,
        business: b.business ? String(b.business).slice(0, 200) : null,
        category: b.category ? String(b.category).slice(0, 100) : null,
        profession: b.profession ? String(b.profession).slice(0, 200) : null,
        city: b.city ? String(b.city).slice(0, 100) : null,
        description: b.description ? String(b.description).slice(0, 2000) : null,
        location: b.location ? String(b.location).slice(0, 300) : null,
        chapterId: b.chapterId || null,
        featured: Boolean(b.featured),
        active: b.active !== false,
      },
    })
    return NextResponse.json(member)
  } catch (e: any) {
    if (String(e?.code) === 'P2002') {
      return NextResponse.json({ error: 'A member with this email already exists' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Create failed' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const b = await request.json()
    if (!b.id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const data: any = {}
    for (const k of ['name', 'email', 'phone', 'photo', 'business', 'category', 'profession', 'city', 'description', 'location']) {
      if (b[k] !== undefined) data[k] = b[k] === '' ? null : b[k]
    }
    if (b.chapterId !== undefined) data.chapterId = b.chapterId || null
    if (b.featured !== undefined) data.featured = Boolean(b.featured)
    if (b.active !== undefined) data.active = Boolean(b.active)

    const member = await db.member.update({ where: { id: b.id }, data })
    return NextResponse.json(member)
  } catch (e: any) {
    if (String(e?.code) === 'P2002') {
      return NextResponse.json({ error: 'A member with this email already exists' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  try {
    await db.member.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Delete failed (member may have records)' }, { status: 500 })
  }
}
