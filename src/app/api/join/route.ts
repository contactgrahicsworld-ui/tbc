import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  const limited = rateLimit(request, 'join', 10, 60_000)
  if (limited) return limited
  try {
    const body = await request.json()
    const { name, email, phone, business, profession, category, city, address, preferredChapter, experience, motivation, referral } = body

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      )
    }

    const refNumber = `TBC-APP-${randomUUID().slice(0, 8).toUpperCase()}`

    const application = await db.membershipApplication.create({
      data: {
        name: String(name).slice(0, 200),
        email: String(email).slice(0, 200),
        phone: String(phone).slice(0, 20),
        business: business ? String(business).slice(0, 200) : null,
        profession: profession ? String(profession).slice(0, 200) : null,
        category: category ? String(category).slice(0, 100) : null,
        city: city ? String(city).slice(0, 100) : null,
        address: address ? String(address).slice(0, 500) : null,
        preferredChapter: preferredChapter ? String(preferredChapter).slice(0, 200) : null,
        experience: experience ? String(experience).slice(0, 2000) : null,
        motivation: motivation ? String(motivation).slice(0, 2000) : null,
        referral: referral ? String(referral).slice(0, 200) : null,
        refNumber,
      },
    })

    return NextResponse.json({ success: true, refNumber: application.refNumber, id: application.id })
  } catch {
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 })
  }
}
