/**
 * Cleanup ALL test data from the production Neon database after smoke tests.
 * The DB was fresh (0 real records) — this only removes smoke-test rows.
 */
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function main() {
  await db.passwordReset.deleteMany({})
  await db.adminSession.deleteMany({})
  await db.admin.deleteMany({})
  await db.eventRegistration.deleteMany({})
  await db.event.deleteMany({})
  await db.visitorRequest.deleteMany({})
  await db.membershipApplication.deleteMany({})
  await db.contactInquiry.deleteMany({})
  await db.chapterMembership.deleteMany({})
  await db.member.deleteMany({})
  await db.chapter.deleteMany({})
  await db.testimonial.deleteMany({})

  const [admins, sessions, resets, visitors, apps, contacts, chapters, events, regs, members] =
    await Promise.all([
      db.admin.count(),
      db.adminSession.count(),
      db.passwordReset.count(),
      db.visitorRequest.count(),
      db.membershipApplication.count(),
      db.contactInquiry.count(),
      db.chapter.count(),
      db.event.count(),
      db.eventRegistration.count(),
      db.member.count(),
    ])
  console.log('✅ cleanup done — counts:', {
    admins, sessions, resets, visitors, apps, contacts, chapters, events, regs, members,
  })
}

main()
  .catch((e) => { console.error('❌', e); process.exit(1) })
  .finally(() => db.$disconnect())
