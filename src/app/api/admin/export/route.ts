import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import * as XLSX from 'xlsx'

export const runtime = 'nodejs'

// GET /api/admin/export?type=visitors|members&chapterId=xxx
// Excel download — chapter-wise or all-together
export async function GET(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'visitors'
  const chapterId = searchParams.get('chapterId')

  let sheetName = 'All'
  let rows: Record<string, any>[] = []

  if (type === 'visitors') {
    const where = chapterId ? { chapterId } : {}
    const visitors = await db.visitorRequest.findMany({
      where,
      include: { chapter: { select: { name: true, city: true, meetingDay: true, meetingTime: true } } },
      orderBy: [{ chapter: { name: 'asc' } }, { createdAt: 'desc' }],
    })

    rows = visitors.map((v) => ({
      'Chapter Name': v.chapter?.name || v.preferredChapter || '—',
      'Chapter City': v.chapter?.city || '—',
      'Meeting': v.chapter ? `${v.chapter.meetingDay} ${v.chapter.meetingTime}` : '—',
      'Ref Number': v.refNumber,
      'Name': v.name,
      'Mobile': v.mobile,
      'Email': v.email,
      'Business': v.business || '',
      'Profession': v.profession || '',
      'City': v.city || '',
      'Preferred Date': v.preferredDate || '',
      'Status': v.status,
      'Message': v.message || '',
      'Registered On': v.createdAt.toLocaleString('en-IN'),
    }))

    if (chapterId) {
      const ch = visitors[0]?.chapter
      sheetName = (ch?.name || 'Chapter').slice(0, 30)
    }
  } else if (type === 'members') {
    const where = chapterId ? { chapterId } : {}
    const members = await db.member.findMany({
      where,
      include: { chapter: { select: { name: true } } },
      orderBy: { name: 'asc' },
    })

    rows = members.map((m) => ({
      'Chapter Name': m.chapter?.name || '—',
      'Name': m.name,
      'Email': m.email,
      'Phone': m.phone || '',
      'Business': m.business || '',
      'Category': m.category || '',
      'Profession': m.profession || '',
      'City': m.city || '',
      'Active': m.active ? 'Yes' : 'No',
      'Joined': m.createdAt.toLocaleDateString('en-IN'),
    }))

    if (chapterId) {
      const ch = members[0]?.chapter
      sheetName = (ch?.name || 'Chapter').slice(0, 30)
    }
  } else {
    return NextResponse.json({ error: 'Invalid export type' }, { status: 400 })
  }

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(rows)

  // Auto column widths
  if (rows.length > 0) {
    const headers = Object.keys(rows[0])
    ws['!cols'] = headers.map((h) => {
      const maxLen = Math.max(
        h.length,
        ...rows.map((r) => String(r[h] ?? '').length)
      )
      return { wch: Math.min(Math.max(maxLen + 2, 10), 45) }
    })
  }

  XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31))

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer

  const dateStr = new Date().toISOString().slice(0, 10)
  const filename = `TBC-${type}-${chapterId ? `${sheetName.replace(/\s+/g, '_')}-` : 'All_'}${dateStr}.xlsx`

  return new NextResponse(new Uint8Array(buf), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
