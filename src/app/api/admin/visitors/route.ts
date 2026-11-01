import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'

export const runtime = 'nodejs'

// GET /api/admin/visitors?chapterId=xxx&status=xxx&q=xxx
// Complete details of people visiting chapters, incl. ref numbers
export async function GET(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const chapterId = searchParams.get('chapterId')
  const status = searchParams.get('status')
  const q = searchParams.get('q')

  const where: any = {}
  if (chapterId) where.chapterId = chapterId
  if (status) where.status = status
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { mobile: { contains: q } },
      { email: { contains: q } },
      { refNumber: { contains: q } },
    ]
  }

  const visitors = await db.visitorRequest.findMany({
    where,
    include: {
      chapter: { select: { id: true, name: true, city: true, meetingDay: true, meetingTime: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 500,
  })

  return NextResponse.json(visitors)
}

// PATCH /api/admin/visitors — { id, status }
export async function PATCH(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id, status } = await request.json()
    const valid = ['pending', 'confirmed', 'visited', 'rejected']
    if (!id || !valid.includes(status)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }
    const updated = await db.visitorRequest.update({
      where: { id },
      data: { status },
    })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

// DELETE /api/admin/visitors?id=xxx
export async function DELETE(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  try {
    await db.visitorRequest.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
