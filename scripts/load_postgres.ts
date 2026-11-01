// @ts-nocheck — one-time migration script (already executed)
/**
 * Load the SQLite dump (JSON) into PostgreSQL via Prisma, preserving IDs.
 * Insert order respects FK dependencies.
 */
import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'

const db = new PrismaClient()

type Row = Record<string, unknown>

function toIso(v: unknown): Date | undefined {
  if (v === null || v === undefined || v === '') return undefined
  const d = new Date(String(v))
  return isNaN(d.getTime()) ? undefined : d
}

function pick(r: Row, keys: string[]): Row {
  const out: Row = {}
  for (const k of keys) if (r[k] !== undefined) out[k] = r[k]
  return out
}

const withDates = (r: Row, dateKeys: string[]) => {
  const out = { ...r }
  for (const k of dateKeys) {
    const d = toIso(r[k])
    if (d) out[k] = d
    else delete out[k]
  }
  return out
}

// SQLite stores booleans as 0/1 — convert known boolean columns
const withBools = (r: Row, boolKeys: string[]) => {
  const out = { ...r }
  for (const k of boolKeys) {
    if (out[k] !== undefined) out[k] = Boolean(out[k])
  }
  return out
}

const b = ['active', 'featured', 'published', 'used']

async function main() {
  const dump = JSON.parse(readFileSync('/tmp/sqlite_dump.json', 'utf-8')) as Record<string, Row[]>
  let total = 0

  for (const r of dump.Chapter ?? []) {
    await db.chapter.create({ data: withBools(pick(r, ['id', 'name', 'slug', 'location', 'city', 'area', 'meetingDay', 'meetingTime', 'description', 'image', 'categories', 'active']), b) })
    total++
  }
  for (const r of dump.Member ?? []) {
    await db.member.create({ data: withBools(withDates(pick(r, ['id', 'name', 'email', 'phone', 'photo', 'business', 'category', 'profession', 'city', 'description', 'location', 'chapterId', 'featured', 'active']), ['createdAt', 'updatedAt']), b) })
    total++
  }
  for (const r of dump.ChapterMembership ?? []) {
    await db.chapterMembership.create({ data: withDates(pick(r, ['id', 'memberId', 'chapterId', 'role']), ['joinedAt', 'createdAt', 'updatedAt']) })
    total++
  }
  for (const r of dump.Event ?? []) {
    await db.event.create({ data: withBools(withDates(pick(r, ['id', 'title', 'slug', 'description', 'image', 'date', 'time', 'location', 'chapterId', 'type', 'featured', 'active']), ['createdAt', 'updatedAt']), b) })
    total++
  }
  for (const r of dump.EventRegistration ?? []) {
    await db.eventRegistration.create({ data: withDates(pick(r, ['id', 'eventId', 'name', 'email', 'phone', 'business', 'message', 'refNumber']), ['createdAt', 'updatedAt']) })
    total++
  }
  for (const r of dump.VisitorRequest ?? []) {
    await db.visitorRequest.create({ data: withDates(pick(r, ['id', 'name', 'mobile', 'email', 'business', 'profession', 'city', 'chapterId', 'preferredChapter', 'preferredDate', 'message', 'status', 'refNumber']), ['createdAt', 'updatedAt']) })
    total++
  }
  for (const r of dump.MembershipApplication ?? []) {
    await db.membershipApplication.create({ data: withDates(pick(r, ['id', 'name', 'email', 'phone', 'business', 'profession', 'category', 'city', 'address', 'preferredChapter', 'experience', 'motivation', 'referral', 'refNumber', 'status', 'step']), ['createdAt', 'updatedAt']) })
    total++
  }
  for (const r of dump.ContactInquiry ?? []) {
    await db.contactInquiry.create({ data: withDates(pick(r, ['id', 'name', 'email', 'phone', 'subject', 'message']), ['createdAt', 'updatedAt']) })
    total++
  }
  for (const r of dump.Article ?? []) {
    await db.article.create({ data: withBools(withDates(pick(r, ['id', 'title', 'slug', 'excerpt', 'content', 'image', 'category', 'author', 'published']), ['createdAt', 'updatedAt']), b) })
    total++
  }
  for (const r of dump.Testimonial ?? []) {
    await db.testimonial.create({ data: withBools(withDates(pick(r, ['id', 'name', 'business', 'category', 'photo', 'quote', 'featured']), ['createdAt', 'updatedAt']), b) })
    total++
  }
  for (const r of dump.SiteConfig ?? []) {
    await db.siteConfig.create({ data: pick(r, ['id', 'key', 'value']) })
    total++
  }
  for (const r of dump.Admin ?? []) {
    await db.admin.create({ data: withDates(pick(r, ['id', 'name', 'email', 'mobile', 'password', 'role', 'active']), ['createdAt', 'updatedAt']) })
    total++
  }

  console.log(`\n✓ Migrated ${total} rows to PostgreSQL`)
  console.log('Counts:', {
    chapters: await db.chapter.count(),
    members: await db.member.count(),
    events: await db.event.count(),
    visitors: await db.visitorRequest.count(),
    testimonials: await db.testimonial.count(),
    siteConfigs: await db.siteConfig.count(),
  })
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => db.$disconnect())
