import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const chapters = await db.chapter.findMany({
    where: { active: true },
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(chapters)
}
