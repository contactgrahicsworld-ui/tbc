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

  const chapters = await db.chapter.findMany({
    include: { _count: { select: { members: true, visitorRequests: true } } },
    orderBy: { createdAt: 'asc' },
  })
  return NextResponse.json(chapters)
}

export async function POST(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const b = await request.json()
    if (!b.name || !b.location || !b.city || !b.meetingDay || !b.meetingTime) {
      return NextResponse.json({ error: 'Name, location, city, meeting day & time are required' }, { status: 400 })
    }
    let slug = slugify(b.name)
    const exists = await db.chapter.findUnique({ where: { slug } })
    if (exists) slug = `${slug}-${Date.now().toString(36)}`

    const chapter = await db.chapter.create({
      data: {
        name: String(b.name).slice(0, 200),
        slug,
        location: String(b.location).slice(0, 300),
        city: String(b.city).slice(0, 100),
        area: b.area ? String(b.area).slice(0, 200) : null,
        meetingDay: String(b.meetingDay),
        meetingTime: String(b.meetingTime),
        description: b.description ? String(b.description).slice(0, 2000) : null,
        categories: b.categories ? String(b.categories).slice(0, 1000) : null,
        image: b.image ? String(b.image).slice(0, 500) : null,
        active: b.active !== false,
      },
    })
    return NextResponse.json(chapter)
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
    for (const k of ['name', 'location', 'city', 'area', 'meetingDay', 'meetingTime', 'description', 'categories', 'image']) {
      if (b[k] !== undefined) data[k] = b[k] === '' ? null : b[k]
    }
    if (b.active !== undefined) data.active = Boolean(b.active)

    const chapter = await db.chapter.update({ where: { id: b.id }, data })
    return NextResponse.json(chapter)
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
    // Soft-delete: deactivate instead of hard delete to preserve history
    await db.chapter.update({ where: { id }, data: { active: false } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
