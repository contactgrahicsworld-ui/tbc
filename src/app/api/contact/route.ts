import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  const limited = rateLimit(request, 'contact', 10, 60_000)
  if (limited) return limited
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    const inquiry = await db.contactInquiry.create({
      data: {
        name: String(name).slice(0, 200),
        email: String(email).slice(0, 200),
        phone: phone ? String(phone).slice(0, 20) : null,
        subject: subject ? String(subject).slice(0, 200) : null,
        message: String(message).slice(0, 5000),
      },
    })

    return NextResponse.json({ success: true, id: inquiry.id })
  } catch {
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 })
  }
}
