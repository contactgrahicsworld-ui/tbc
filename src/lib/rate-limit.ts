import { NextResponse } from 'next/server'

// Simple fixed-window, in-memory rate limiter.
// Per serverless-instance scope — enough to blunt abuse bursts on Vercel
// without adding an external dependency. Limits are generous so real
// users are never blocked.
type Bucket = { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()

export function getClientKey(request: Request): string {
  const fwd = request.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'unknown'
}

/**
 * Returns a 429 NextResponse when the caller exceeded `limit` requests
 * within `windowMs`, otherwise null (request is allowed).
 */
export function rateLimit(
  request: Request,
  name: string,
  limit: number,
  windowMs: number
): NextResponse | null {
  const now = Date.now()
  const key = `${name}:${getClientKey(request)}`

  // Occasional sweep so the map cannot grow unbounded.
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (b.resetAt < now) buckets.delete(k)
  }

  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return null
  }
  bucket.count += 1
  if (bucket.count > limit) {
    const retry = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000))
    return NextResponse.json(
      { error: `Too many requests. Please try again in ${retry}s.` },
      { status: 429, headers: { 'Retry-After': String(retry) } }
    )
  }
  return null
}
