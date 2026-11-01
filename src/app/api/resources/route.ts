import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const articles = await db.article.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(articles)
}
