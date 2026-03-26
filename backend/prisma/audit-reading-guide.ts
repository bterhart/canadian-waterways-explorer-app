import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'

const adapter = new PrismaLibSQL({
  url: 'libsql://canadianwaterwaysexplorer-bterhart.aws-us-east-2.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzExMDYzODEsImlkIjoiMTliZDYzMmMtZjNkYy00YzAwLTg0ODItNzU5YjQ3MmIxMGE0IiwicmlkIjoiZTdiMjljMTYtNGJhZi00YzM3LWEyYzQtZjJmYmViYTcyMjA2In0.Mixg_E1goZM8e0_81rnymYLtKVBbsp3DhQgkKZ4eP0ONcm-oBnRDiZ8dPDHdjUAmg023zpBCoB0d832JlVHPDQ',
})
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  const explorers = await prisma.explorer.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  })
  
  console.log('EXPLORER IDs FROM DATABASE:')
  for (const e of explorers) {
    console.log(`  ${JSON.stringify(e.id)}  // ${e.name}`)
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
