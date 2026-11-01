import { db } from '@/lib/db'

/**
 * WhatsApp sender for TBC admin notifications (password reset etc.)
 *
 * Priority:
 *   1. WhatsApp API config stored in SiteConfig (whatsapp_api_url + whatsapp_api_token)
 *      — set from Admin Panel → Settings. Supports any WhatsApp Cloud API compatible endpoint.
 *   2. Environment variables WHATSAPP_API_URL / WHATSAPP_API_TOKEN
 *   3. Fallback: returns a wa.me deep-link so the code is delivered to the
 *      admin's own WhatsApp (self-send), no credentials needed.
 */

interface SendResult {
  sent: boolean          // true if delivered via API
  fallbackLink?: string  // wa.me self-send link when API not configured
  error?: string
}

async function getConfig(): Promise<{ url: string; token: string } | null> {
  // 1) SiteConfig (DB)
  try {
    const rows = await db.siteConfig.findMany({
      where: { key: { in: ['whatsapp_api_url', 'whatsapp_api_token'] } },
    })
    const map: Record<string, string> = {}
    for (const r of rows) map[r.key] = r.value
    if (map.whatsapp_api_url && map.whatsapp_api_token) {
      return { url: map.whatsapp_api_url, token: map.whatsapp_api_token }
    }
  } catch { /* ignore */ }

  // 2) Env
  if (process.env.WHATSAPP_API_URL && process.env.WHATSAPP_API_TOKEN) {
    return {
      url: process.env.WHATSAPP_API_URL,
      token: process.env.WHATSAPP_API_TOKEN,
    }
  }
  return null
}

export async function sendWhatsApp(to: string, message: string): Promise<SendResult> {
  const config = await getConfig()

  if (config) {
    try {
      // WhatsApp Cloud API format: { messaging_product, to, type: text, text: { body } }
      const res = await fetch(config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.token}`,
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to.replace(/[^\d]/g, ''),
          type: 'text',
          text: { body: message },
        }),
      })
      if (res.ok) return { sent: true }
      return { sent: false, error: `API responded ${res.status}` }
    } catch (e) {
      return { sent: false, error: 'API request failed' }
    }
  }

  // Fallback: wa.me deep link — opens WhatsApp with the message addressed to
  // the admin's own number. Admin taps send → code is in their WhatsApp.
  const digits = to.replace(/[^\d]/g, '')
  const link = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
  return { sent: false, fallbackLink: link }
}

export async function getWhatsAppConfigured(): Promise<boolean> {
  return (await getConfig()) !== null
}
