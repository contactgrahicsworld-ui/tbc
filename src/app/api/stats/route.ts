import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const configs = await db.siteConfig.findMany()
  const stats = Object.fromEntries(configs.map((c) => [c.key, c.value]))
  return NextResponse.json(stats)
}
