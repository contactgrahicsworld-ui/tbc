import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  const limited = rateLimit(request, 'visitor', 10, 60_000)
  if (limited) return limited
  try {
    const body = await request.json()
    const { name, mobile, email, business, profession, city, chapterId, preferredChapter, preferredDate, message } = body

    if (!name || !mobile || !email) {
      return NextResponse.json(
        { error: 'Name, mobile, and email are required' },
        { status: 400 }
      )
    }

    const refNumber = `TBC-VIS-${randomUUID().slice(0, 8).toUpperCase()}`

    // Server-side safety: derive the chapter name when only chapterId is sent,
    // so records always carry the chapter name even if the client misses it.
    let finalPreferredChapter = preferredChapter ? String(preferredChapter).slice(0, 200) : null
    if (chapterId) {
      const ch = await db.chapter.findUnique({ where: { id: String(chapterId) }, select: { name: true } })
      if (ch) finalPreferredChapter = ch.name
    }

    const visitor = await db.visitorRequest.create({
      data: {
        name: String(name).slice(0, 200),
        mobile: String(mobile).slice(0, 20),
        email: String(email).slice(0, 200),
        business: business ? String(business).slice(0, 200) : null,
        profession: profession ? String(profession).slice(0, 200) : null,
        city: city ? String(city).slice(0, 100) : null,
        chapterId: chapterId ? String(chapterId) : null,
        preferredChapter: finalPreferredChapter,
        preferredDate: preferredDate ? String(preferredDate).slice(0, 50) : null,
        message: message ? String(message).slice(0, 2000) : null,
        refNumber,
      },
    })

    return NextResponse.json({ success: true, refNumber: visitor.refNumber, id: visitor.id })
  } catch {
    return NextResponse.json({ error: 'Failed to submit visitor request' }, { status: 500 })
  }
}

// GET: Lookup visitor applications by mobile or email
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const mobile = searchParams.get('mobile')
    const email = searchParams.get('email')

    if (!mobile && !email) {
      return NextResponse.json({ error: 'Provide mobile or email to lookup' }, { status: 400 })
    }

    const where: any = {}
    if (mobile && email) {
      where.OR = [
        { mobile: { contains: mobile } },
        { email: { contains: email } },
      ]
    } else if (mobile) {
      where.mobile = { contains: mobile }
    } else {
      where.email = { contains: email }
    }

    const applications = await db.visitorRequest.findMany({
      where,
      include: {
        chapter: {
          select: { id: true, name: true, city: true, meetingDay: true, meetingTime: true, location: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    return NextResponse.json(applications)
  } catch {
    return NextResponse.json({ error: 'Failed to lookup applications' }, { status: 500 })
  }
}
