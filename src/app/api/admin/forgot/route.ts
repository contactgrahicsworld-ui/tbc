import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { generateResetCode, hashCode, normalizeMobile } from '@/lib/admin-auth'
import { sendWhatsApp } from '@/lib/whatsapp'
import { rateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'

// POST /api/admin/forgot — body: { mobile }
// Generates a 6-digit code (valid 10 min) and delivers it to the admin's
// registered WhatsApp number.
export async function POST(request: Request) {
  const limited = rateLimit(request, 'admin-forgot', 5, 5 * 60_000)
  if (limited) return limited
  try {
    const body = await request.json()
    const { mobile } = body
    if (!mobile) {
      return NextResponse.json({ error: 'Enter your registered mobile number' }, { status: 400 })
    }

    const normMobile = normalizeMobile(mobile)
    const admin = await db.admin.findFirst({ where: { mobile: normMobile } })

    // Do not reveal whether the number exists
    if (!admin) {
      return NextResponse.json({
        success: true,
        message: 'If this number is registered, a reset code has been sent to its WhatsApp.',
      })
    }

    // Invalidate previous unused codes
    await db.passwordReset.updateMany({
      where: { adminId: admin.id, used: false },
      data: { used: true },
    })

    const code = generateResetCode()
    await db.passwordReset.create({
      data: {
        adminId: admin.id,
        code: hashCode(code),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    })

    const message =
      `TBC Admin — Password Reset\n\n` +
      `Your reset code is: ${code}\n\n` +
      `This code expires in 10 minutes.\n` +
      `If you did not request this, you can ignore this message.`

    const result = await sendWhatsApp(`91${admin.mobile}`, message)

    if (result.sent) {
      return NextResponse.json({
        success: true,
        sent: true,
        message: 'Reset code sent to your WhatsApp.',
      })
    }

    // Fallback: wa.me self-send link (code delivered to admin's own WhatsApp)
    return NextResponse.json({
      success: true,
      sent: false,
      fallbackLink: result.fallbackLink,
      message:
        'WhatsApp API not configured. Tap the button below to receive the code in your WhatsApp.',
    })
  } catch {
    return NextResponse.json({ error: 'Failed to send reset code' }, { status: 500 })
  }
}
