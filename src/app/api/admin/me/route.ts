import { NextResponse } from 'next/server'
import { getAdmin, adminExists } from '@/lib/admin-auth'

export const runtime = 'nodejs'

export async function GET() {
  const admin = await getAdmin()
  if (!admin) {
    return NextResponse.json({ admin: null, setupNeeded: !(await adminExists()) })
  }
  return NextResponse.json({ admin })
}
