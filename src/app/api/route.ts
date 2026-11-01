import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ status: 'ok', organization: 'TBC — Tailik Business Committee' })
}
