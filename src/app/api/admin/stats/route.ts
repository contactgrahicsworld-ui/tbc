import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'

export const runtime = 'nodejs'

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [chapters, members, events, visitors, applications, inquiries, testimonials, pendingVisitors, pendingApps] =
    await Promise.all([
      db.chapter.count({ where: { active: true } }),
      db.member.count({ where: { active: true } }),
      db.event.count({ where: { active: true } }),
      db.visitorRequest.count(),
      db.membershipApplication.count(),
      db.contactInquiry.count(),
      db.testimonial.count(),
      db.visitorRequest.count({ where: { status: 'pending' } }),
      db.membershipApplication.count({ where: { status: 'pending' } }),
    ])

  return NextResponse.json({
    chapters, members, events, visitors, applications, inquiries, testimonials,
    pendingVisitors, pendingApps,
  })
}
