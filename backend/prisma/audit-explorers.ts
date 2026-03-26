import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'

const adapter = new PrismaLibSQL({
  url: 'libsql://canadianwaterwaysexplorer-bterhart.aws-us-east-2.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzExMDYzODEsImlkIjoiMTliZDYzMmMtZjNkYy00YzAwLTg0ODItNzU5YjQ3MmIxMGE0IiwicmlkIjoiZTdiMjljMTYtNGJhZi00YzM3LWEyYzQtZjJmYmViYTcyMjA2In0.Mixg_E1goZM8e0_81rnymYLtKVBbsp3DhQgkKZ4eP0ONcm-oBnRDiZ8dPDHdjUAmg023zpBCoB0d832JlVHPDQ',
})
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  const explorers = await prisma.explorer.findMany({
    include: {
      waterways: {
        include: { waterway: true },
        orderBy: { yearExplored: 'asc' }
      }
    },
    orderBy: { name: 'asc' }
  })

  for (const e of explorers) {
    console.log(`\n${'='.repeat(60)}`)
    console.log(`EXPLORER: ${e.name} [${e.id}]`)
    console.log(`  nationality: ${e.nationality}`)
    console.log(`  years: ${e.birthYear}-${e.deathYear}`)
    console.log(`  imageUrl: ${e.imageUrl ? 'YES' : 'MISSING'}`)
    console.log(`  biography length: ${e.biography?.length ?? 0} chars`)
    console.log(`  notableAchievements: ${e.notableAchievements ? `${e.notableAchievements.length} chars` : 'MISSING'}`)
    console.log(`  waterways (${e.waterways.length}):`)
    for (const ew of e.waterways) {
      console.log(`    - ${ew.waterway.name} [year: ${ew.yearExplored}] notes: ${ew.expeditionNotes ? ew.expeditionNotes.substring(0,80) : 'NONE'}`)
    }
  }

  // Also check archaeological discoveries mentioning explorers not in their waterway list
  const discoveries = await prisma.archaeologicalDiscovery.findMany({
    select: { relatedExplorerName: true, waterwayId: true, name: true }
  })
  const discoveryExplorers = new Set(discoveries.map(d => d.relatedExplorerName).filter(Boolean))
  console.log(`\n${'='.repeat(60)}`)
  console.log('EXPLORERS MENTIONED IN DISCOVERIES:', [...discoveryExplorers])
}

main().catch(console.error).finally(() => prisma.$disconnect())
