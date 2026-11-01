/**
 * Cleanup test data created during admin panel verification:
 * - Test admin + sessions + reset codes
 * - Test visitors (Rajesh Kumar, Priya Sharma)
 * - Test event (Test Networking Night)
 * - Test uploaded image
 * After this, /admin/setup becomes available again for the real user.
 */
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function main() {
  // 1. Test admin + cascade sessions/resets
  const admin = await db.admin.findUnique({ where: { email: 'test@tbc.temp' } })
  if (admin) {
    await db.adminSession.deleteMany({ where: { adminId: admin.id } })
    await db.passwordReset.deleteMany({ where: { adminId: admin.id } })
    await db.admin.delete({ where: { id: admin.id } })
    console.log('✓ Test admin deleted')
  } else {
    console.log('- No test admin found')
  }

  // 2. Test visitors created during verification
  const v1 = await db.visitorRequest.deleteMany({ where: { email: 'rajesh@test.com' } })
  const v2 = await db.visitorRequest.deleteMany({ where: { email: 'priya@test.com' } })
  console.log(`✓ Test visitors deleted: ${v1.count + v2.count}`)

  // 3. Test event
  const ev = await db.event.deleteMany({ where: { title: 'Test Networking Night' } })
  console.log(`✓ Test events deleted: ${ev.count}`)

  // 4. Final state check
  const adminCount = await db.admin.count()
  const visitorCount = await db.visitorRequest.count()
  console.log(`\nFinal state: admins=${adminCount} (0 = setup available for real user), visitors=${visitorCount}`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => db.$disconnect())
