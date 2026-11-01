import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  const limited = rateLimit(request, 'event-register', 10, 60_000)
  if (limited) return limited
  try {
    const body = await request.json()
    const { eventId, name, email, phone, business, message } = body

    if (!eventId || !name || !email) {
      return NextResponse.json(
        { error: 'Event ID, name, and email are required' },
        { status: 400 }
      )
    }

    const event = await db.event.findUnique({ where: { id: eventId } })
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const refNumber = `TBC-EVT-${randomUUID().slice(0, 8).toUpperCase()}`

    const registration = await db.eventRegistration.create({
      data: {
        eventId: String(eventId),
        name: String(name).slice(0, 200),
        email: String(email).slice(0, 200),
        phone: phone ? String(phone).slice(0, 20) : null,
        business: business ? String(business).slice(0, 200) : null,
        message: message ? String(message).slice(0, 2000) : null,
        refNumber,
      },
    })

    return NextResponse.json({ success: true, refNumber: registration.refNumber, id: registration.id })
  } catch {
    return NextResponse.json({ error: 'Failed to register for event' }, { status: 500 })
  }
}
