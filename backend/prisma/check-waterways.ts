import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSQL({
  url: 'libsql://canadianwaterwaysexplorer-bterhart.aws-us-east-2.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzExMDYzODEsImlkIjoiMTliZDYzMmMtZjNkYy00YzAwLTg0ODItNzU5YjQ3MmIxMGE0IiwicmlkIjoiZTdiMjljMTYtNGJhZi00YzM3LWEyYzQtZjJmYmViYTcyMjA2In0.Mixg_E1goZM8e0_81rnymYLtKVBbsp3DhQgkKZ4eP0ONcm-oBnRDiZ8dPDHdjUAmg023zpBCoB0d832JlVHPDQ',
});

const prisma = new PrismaClient({ adapter });
const THOMPSON_ID = 'cmlhaslpx0006m2zhsckolb5o';

async function main() {
  const checks = [
    { id: 'cmlhbjrpw0003m2mbmmpa8102', name: 'Athabasca River' },
    { id: 'cmlhaslr1000um2zh1ohr52f9', name: 'Churchill River (Saskatchewan)' },
    { id: 'cmlhaslri0014m2zhlrrx8pqe', name: 'Lake Winnipeg' },
    { id: 'cmlhaslra000ym2zh4pyu55je', name: 'Lake Superior' },
    { id: 'cmlk2w3jm0002m2636jrqvptl', name: 'Lake of the Woods' },
  ];
  
  for (const c of checks) {
    const w = await prisma.waterway.findUnique({ where: { id: c.id }, select: { id: true, name: true } });
    console.log(w ? `FOUND: ${w.name}` : `NOT FOUND: ${c.id} (expected ${c.name})`);
  }
  
  const kootenay = await prisma.waterway.findFirst({ where: { name: { contains: 'Kootenay' } }, select: { id: true, name: true } });
  console.log('Kootenay:', kootenay || 'NOT FOUND');
  
  const northSask = await prisma.waterway.findFirst({ where: { name: { contains: 'North Saskatchewan' } }, select: { id: true, name: true } });
  console.log('North Saskatchewan:', northSask || 'NOT FOUND');
  
  const existing = await prisma.explorerWaterway.findMany({
    where: { explorerId: THOMPSON_ID },
    include: { waterway: { select: { name: true } } }
  });
  console.log('\nExisting Thompson waterways:');
  existing.forEach(e => console.log(`  ${e.id}: ${e.yearExplored || '?'} - ${e.waterway.name}`));
}

main().catch(console.error).finally(() => process.exit(0));
