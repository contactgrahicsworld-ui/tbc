// @ts-nocheck — one-time migration script (already executed)
/** Final cleanup: remove forgot@test.temp admin, restore setup state. */
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function main() {
  const a = await db.admin.findUnique({ where: { email: 'forgot@test.temp' } })
  if (a) {
    await db.adminSession.deleteMany({ where: { adminId: a.id } })
    await db.passwordReset.deleteMany({ where: { adminId: a.id } })
    await db.admin.delete({ where: { id: a.id } })
    console.log('✓ forgot@test.temp deleted')
  }
  const admins = await db.admin.count()
  console.log('final: admins=', admins, '| setupNeeded:', admins === 0)
  console.log('data: chapters=', await db.chapter.count(), 'members=', await db.member.count(), 'events=', await db.event.count(), 'visitors=', await db.visitorRequest.count())
}

main().finally(() => db.$disconnect())
