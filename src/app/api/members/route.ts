import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const members = await db.member.findMany({
    where: { active: true },
    orderBy: { name: 'asc' },
    include: { chapter: { select: { name: true, slug: true } } },
  })
  return NextResponse.json(members)
}
