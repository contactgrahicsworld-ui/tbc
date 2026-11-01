// @ts-nocheck — one-time migration script (already executed)
/** One-off cleanup of Postgres test data (PG Test Admin + PG Test User). */
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function main() {
  const admin = await db.admin.findUnique({ where: { email: 'pgadmin@test.temp' } })
  if (admin) {
    await db.adminSession.deleteMany({ where: { adminId: admin.id } })
    await db.passwordReset.deleteMany({ where: { adminId: admin.id } })
    await db.admin.delete({ where: { id: admin.id } })
    console.log('✓ test admin deleted')
  }
  const v = await db.visitorRequest.deleteMany({ where: { email: 'pgtest@test.com' } })
  console.log(`✓ test visitors deleted: ${v.count}`)
  const admins = await db.admin.count()
  console.log('admins:', admins, '| setupNeeded:', admins === 0)
}

main().finally(() => db.$disconnect())
