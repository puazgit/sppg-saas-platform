
import { seedMarketingModels } from './seeds/marketing-hero-seed'

async function main() {
  await seedMarketingModels()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
