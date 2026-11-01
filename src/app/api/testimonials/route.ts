import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const testimonials = await db.testimonial.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(testimonials)
}
