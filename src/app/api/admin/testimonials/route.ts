import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'

export const runtime = 'nodejs'

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const items = await db.testimonial.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(items)
}

export async function POST(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const b = await request.json()
    if (!b.name || !b.quote) {
      return NextResponse.json({ error: 'Name and quote are required' }, { status: 400 })
    }
    const item = await db.testimonial.create({
      data: {
        name: String(b.name).slice(0, 200),
        business: b.business ? String(b.business).slice(0, 200) : null,
        category: b.category ? String(b.category).slice(0, 100) : null,
        photo: b.photo ? String(b.photo).slice(0, 500) : null,
        quote: String(b.quote).slice(0, 2000),
        featured: Boolean(b.featured),
      },
    })
    return NextResponse.json(item)
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
    for (const k of ['name', 'business', 'category', 'photo', 'quote']) {
      if (b[k] !== undefined) data[k] = b[k] === '' ? null : b[k]
    }
    if (b.featured !== undefined) data.featured = Boolean(b.featured)

    const item = await db.testimonial.update({ where: { id: b.id }, data })
    return NextResponse.json(item)
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
    await db.testimonial.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
