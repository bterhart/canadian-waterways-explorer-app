import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSQL({
  url: 'libsql://canadianwaterwaysexplorer-bterhart.aws-us-east-2.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzExMDYzODEsImlkIjoiMTliZDYzMmMtZjNkYy00YzAwLTg0ODItNzU5YjQ3MmIxMGE0IiwicmlkIjoiZTdiMjljMTYtNGJhZi00YzM3LWEyYzQtZjJmYmViYTcyMjA2In0.Mixg_E1goZM8e0_81rnymYLtKVBbsp3DhQgkKZ4eP0ONcm-oBnRDiZ8dPDHdjUAmg023zpBCoB0d832JlVHPDQ',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const thompson = await prisma.explorer.findUnique({
    where: { id: 'cmlhaslpx0006m2zhsckolb5o' },
    include: {
      waterways: {
        include: { waterway: { select: { id: true, name: true } } },
        orderBy: { yearExplored: 'asc' }
      }
    }
  });
  
  if (!thompson) { console.log('Thompson not found'); return; }
  
  console.log('=== David Thompson ===');
  console.log('ID:', thompson.id);
  console.log('Bio length:', thompson.biography?.length);
  console.log('notableAchievements:', thompson.notableAchievements ? 'YES' : 'NONE');
  console.log('imageUrl:', thompson.imageUrl || 'NONE');
  console.log('\nWaterways:');
  thompson.waterways.forEach(w => {
    console.log(`  ${w.id} | ${w.yearExplored || '?'}: ${w.waterway.name} (waterwayId=${w.waterwayId})`);
  });
  
  const allWaterways = await prisma.waterway.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  });
  console.log('\nAll waterways in DB:');
  allWaterways.forEach(w => console.log(`  ${w.id}: ${w.name}`));
}

main().catch(console.error).finally(() => process.exit(0));
