import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSQL({
  url: 'libsql://canadianwaterwaysexplorer-bterhart.aws-us-east-2.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzExMDYzODEsImlkIjoiMTliZDYzMmMtZjNkYy00YzAwLTg0ODItNzU5YjQ3MmIxMGE0IiwicmlkIjoiZTdiMjljMTYtNGJhZi00YzM3LWEyYzQtZjJmYmViYTcyMjA2In0.Mixg_E1goZM8e0_81rnymYLtKVBbsp3DhQgkKZ4eP0ONcm-oBnRDiZ8dPDHdjUAmg023zpBCoB0d832JlVHPDQ',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // Get all locations
  const locations = await prisma.location.findMany({
    select: { id: true, name: true, imageUrl: true },
    orderBy: { name: 'asc' }
  });
  console.log(`TOTAL_LOCATIONS:${locations.length}`);
  locations.forEach(l => {
    const hasImage = l.imageUrl ? 'HAS_IMAGE' : 'NO_IMAGE';
    console.log(`LOC|${l.id}|${l.name}|${hasImage}`);
  });
  
  // Get all waterways
  const waterways = await prisma.waterway.findMany({
    select: { id: true, name: true, imageUrl: true },
    orderBy: { name: 'asc' }
  });
  console.log(`TOTAL_WATERWAYS:${waterways.length}`);
  waterways.forEach(w => {
    const hasImage = w.imageUrl ? 'HAS_IMAGE' : 'NO_IMAGE';
    console.log(`WAY|${w.id}|${w.name}|${hasImage}`);
  });
}

main().catch(console.error).finally(() => process.exit(0));
