import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'

export const runtime = 'nodejs'

function slugify(s: string) {
  return String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const events = await db.event.findMany({
    include: {
      chapter: { select: { id: true, name: true } },
      _count: { select: { registrations: true } },
    },
    orderBy: { date: 'asc' },
  })
  return NextResponse.json(events)
}

export async function POST(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const b = await request.json()
    if (!b.title || !b.date) {
      return NextResponse.json({ error: 'Title and date are required' }, { status: 400 })
    }
    let slug = slugify(b.title)
    const exists = await db.event.findUnique({ where: { slug } })
    if (exists) slug = `${slug}-${Date.now().toString(36)}`

    const event = await db.event.create({
      data: {
        title: String(b.title).slice(0, 300),
        slug,
        description: b.description ? String(b.description).slice(0, 5000) : null,
        image: b.image ? String(b.image).slice(0, 500) : null,
        date: String(b.date).slice(0, 50),
        time: b.time ? String(b.time).slice(0, 50) : null,
        location: b.location ? String(b.location).slice(0, 300) : null,
        chapterId: b.chapterId || null,   // ← event → chapter assignment
        type: b.type || 'networking',
        featured: Boolean(b.featured),
        active: b.active !== false,
      },
    })
    return NextResponse.json(event)
  } catch {
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
    for (const k of ['title', 'description', 'image', 'date', 'time', 'location', 'type']) {
      if (b[k] !== undefined) data[k] = b[k] === '' ? null : b[k]
    }
    if (b.chapterId !== undefined) data.chapterId = b.chapterId || null  // re-assign chapter
    if (b.featured !== undefined) data.featured = Boolean(b.featured)
    if (b.active !== undefined) data.active = Boolean(b.active)

    const event = await db.event.update({ where: { id: b.id }, data })
    return NextResponse.json(event)
  } catch {
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
    await db.event.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Delete failed (event may have registrations)' }, { status: 500 })
  }
}
