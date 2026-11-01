import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'

export const runtime = 'nodejs'

// GET /api/admin/settings — WhatsApp API config
export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rows = await db.siteConfig.findMany({
    where: { key: { in: ['whatsapp_api_url', 'whatsapp_api_token'] } },
  })
  const map: Record<string, string> = {}
  for (const r of rows) map[r.key] = r.value

  return NextResponse.json({
    whatsapp_api_url: map.whatsapp_api_url || '',
    whatsapp_api_token: map.whatsapp_api_token || '',
  })
}

// POST /api/admin/settings — { whatsapp_api_url, whatsapp_api_token }
export async function POST(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()

    for (const key of ['whatsapp_api_url', 'whatsapp_api_token'] as const) {
      const value = body[key]
      if (value === undefined) continue
      // Skip masked placeholder (unchanged token)
      if (typeof value === 'string' && value.startsWith('••')) continue
      if (typeof value !== 'string' || value === '') continue

      await db.siteConfig.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Save failed' }, { status: 500 })
  }
}
