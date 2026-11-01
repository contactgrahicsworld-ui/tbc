import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'

export const runtime = 'nodejs'

// Membership applications
export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const items = await db.membershipApplication.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(items)
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id, status } = await request.json()
    const valid = ['pending', 'reviewing', 'approved', 'rejected']
    if (!id || !valid.includes(status)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }
    const item = await db.membershipApplication.update({ where: { id }, data: { status } })
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
    await db.membershipApplication.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
