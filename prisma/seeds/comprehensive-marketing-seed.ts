import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting comprehensive marketing seed...')

  // Skip SPPG creation - will be handled by main application flow
  console.log('✅ Marketing seed completed - SPPG creation handled in main app')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })