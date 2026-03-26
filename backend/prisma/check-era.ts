import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'

const adapter = new PrismaLibSQL({
  url: 'libsql://canadianwaterwaysexplorer-bterhart.aws-us-east-2.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzExMDYzODEsImlkIjoiMTliZDYzMmMtZjNkYy00YzAwLTg0ODItNzU5YjQ3MmIxMGE0IiwicmlkIjoiZTdiMjljMTYtNGJhZi00YzM3LWEyYzQtZjJmYmViYTcyMjA2In0.Mixg_E1goZM8e0_81rnymYLtKVBbsp3DhQgkKZ4eP0ONcm-oBnRDiZ8dPDHdjUAmg023zpBCoB0d832JlVHPDQ',
})
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  // Sample yearEstablished from locations
  const locs = await prisma.location.findMany({
    select: { id: true, name: true, yearEstablished: true, locationType: true, waterwayId: true },
    orderBy: { yearEstablished: 'asc' }
  })
  console.log('LOCATIONS WITH yearEstablished:')
  locs.forEach(l => console.log(`  ${l.name}: year=${l.yearEstablished} type=${l.locationType} waterwayId=${l.waterwayId}`))
  
  // Check explorer waterways for filtering
  const explorers = await prisma.explorer.findMany({
    select: { id: true, name: true },
    take: 5
  })
  console.log('\nFIRST 5 EXPLORERS (id+name):')
  explorers.forEach(e => console.log(`  ${e.id}: ${e.name}`))
}

main().catch(console.error).finally(() => prisma.$disconnect())
