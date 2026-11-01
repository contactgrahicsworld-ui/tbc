import { db } from '@/lib/db'
import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'crypto'
import { cookies } from 'next/headers'

const SESSION_COOKIE = 'tbc_admin_session'
const SESSION_DAYS = 7

// ===== Password hashing (scrypt, no external deps) =====
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const hashBuf = Buffer.from(hash, 'hex')
  const testBuf = scryptSync(password, salt, 64)
  return hashBuf.length === testBuf.length && timingSafeEqual(hashBuf, testBuf)
}

// ===== 6-digit reset code =====
export function generateResetCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export function hashCode(code: string): string {
  return createHash('sha256').update(code).digest('hex')
}

// ===== Sessions =====
export async function createSession(adminId: string): Promise<string> {
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000)
  await db.adminSession.create({ data: { adminId, token, expiresAt } })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
    path: '/',
  })
  return token
}

export async function destroySession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (token) {
    await db.adminSession.deleteMany({ where: { token } })
  }
  cookieStore.delete(SESSION_COOKIE)
}

export async function getAdmin() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE)?.value
    if (!token) return null

    const session = await db.adminSession.findUnique({
      where: { token },
      include: { admin: true },
    })

    if (!session) return null
    if (session.expiresAt < new Date()) {
      await db.adminSession.delete({ where: { id: session.id } }).catch(() => {})
      return null
    }
    if (!session.admin.active) return null

    return {
      id: session.admin.id,
      name: session.admin.name,
      email: session.admin.email,
      mobile: session.admin.mobile,
      role: session.admin.role,
    }
  } catch {
    return null
  }
}

// Guard for API routes — returns admin or null
export async function requireAdmin() {
  return getAdmin()
}

export async function adminExists(): Promise<boolean> {
  const count = await db.admin.count()
  return count > 0
}

// Normalize Indian mobile to digits-only (strip +91, spaces, dashes)
export function normalizeMobile(mobile: string): string {
  let m = String(mobile).replace(/[^\d]/g, '')
  if (m.startsWith('91') && m.length === 12) m = m.slice(2)
  return m
}
