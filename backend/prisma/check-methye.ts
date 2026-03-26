import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'

const adapter = new PrismaLibSQL({
  url: 'libsql://canadianwaterwaysexplorer-bterhart.aws-us-east-2.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzExMDYzODEsImlkIjoiMTliZDYzMmMtZjNkYy00YzAwLTg0ODItNzU5YjQ3MmIxMGE0IiwicmlkIjoiZTdiMjljMTYtNGJhZi00YzM3LWEyYzQtZjJmYmViYTcyMjA2In0.Mixg_E1goZM8e0_81rnymYLtKVBbsp3DhQgkKZ4eP0ONcm-oBnRDiZ8dPDHdjUAmg023zpBCoB0d832JlVHPDQ',
})
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  const methye = await prisma.location.findFirst({
    where: { name: { contains: 'Methye' } },
    include: {
      waterway: {
        include: {
          explorers: { include: { explorer: true } },
          furTradeInfo: true,
        }
      },
      cartographer: true,
    }
  })
  
  console.log('METHYE PORTAGE LOCATION:')
  console.log(JSON.stringify({
    id: methye?.id,
    name: methye?.name,
    imageUrl: methye?.imageUrl,
    galleryImages: methye?.galleryImages,
    videoUrl: methye?.videoUrl,
    waterwayId: methye?.waterwayId,
    waterwayName: methye?.waterway?.name,
    waterwayExplorers: methye?.waterway?.explorers?.map(e => e.explorer.name),
    furTradeInfo: methye?.waterway?.furTradeInfo,
  }, null, 2))
  
  const athabasca = await prisma.waterway.findFirst({
    where: { name: { contains: 'Athabasca' } },
    include: {
      explorers: { include: { explorer: true } },
      furTradeInfo: true,
      locations: true,
    }
  })
  
  console.log('\nATHABASCA RIVER WATERWAY:')
  console.log(JSON.stringify({
    id: athabasca?.id,
    name: athabasca?.name,
    imageUrl: athabasca?.imageUrl,
    galleryImages: athabasca?.galleryImages?.substring(0, 300),
    explorers: athabasca?.explorers?.map(e => ({ name: e.explorer.name, year: e.yearExplored })),
    furTradeInfo: athabasca?.furTradeInfo,
    locations: athabasca?.locations?.map(l => l.name),
  }, null, 2))
  
  const peterPond = await prisma.explorer.findFirst({
    where: { name: { contains: 'Peter Pond' } },
    include: { waterways: { include: { waterway: true } } }
  })
  console.log('\nPETER POND EXPLORER:')
  console.log(JSON.stringify({
    id: peterPond?.id,
    name: peterPond?.name,
    waterways: peterPond?.waterways?.map(w => w.waterway.name)
  }, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
