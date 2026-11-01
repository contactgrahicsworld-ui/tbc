import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const events = await db.event.findMany({
    where: { active: true },
    orderBy: { date: 'asc' },
    include: { registrations: { select: { id: true } } },
  })
  return NextResponse.json(events)
}
