import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSQL({
  url: 'libsql://canadianwaterwaysexplorer-bterhart.aws-us-east-2.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzExMDYzODEsImlkIjoiMTliZDYzMmMtZjNkYy00YzAwLTg0ODItNzU5YjQ3MmIxMGE0IiwicmlkIjoiZTdiMjljMTYtNGJhZi00YzM3LWEyYzQtZjJmYmViYTcyMjA2In0.Mixg_E1goZM8e0_81rnymYLtKVBbsp3DhQgkKZ4eP0ONcm-oBnRDiZ8dPDHdjUAmg023zpBCoB0d832JlVHPDQ',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const locations = await prisma.location.findMany({
    select: { id: true, name: true, imageUrl: true },
    orderBy: { name: 'asc' }
  });
  
  const waterways = await prisma.waterway.findMany({
    select: { id: true, name: true, imageUrl: true },
    orderBy: { name: 'asc' }
  });
  
  console.log('=== LOCATION imageUrl samples ===');
  locations.slice(0, 5).forEach(l => console.log(`${l.id}|${l.name}|${l.imageUrl}`));
  
  console.log('\n=== WATERWAY imageUrl samples ===');
  waterways.slice(0, 5).forEach(w => console.log(`${w.id}|${w.name}|${w.imageUrl}`));
  
  // Count image types
  const allItems = [...locations.map(l => ({...l, type:'LOC'})), ...waterways.map(w => ({...w, type:'WAY'}))];
  const withImage = allItems.filter(i => i.imageUrl);
  const withPlaceholder = allItems.filter(i => i.imageUrl && i.imageUrl.includes('placeholder'));
  const withWikimedia = allItems.filter(i => i.imageUrl && (i.imageUrl.includes('wikimedia') || i.imageUrl.includes('wikipedia')));
  const withNull = allItems.filter(i => !i.imageUrl);
  
  console.log(`\nTotal: ${allItems.length}`);
  console.log(`Has imageUrl: ${withImage.length}`);
  console.log(`With placeholder: ${withPlaceholder.length}`);
  console.log(`With wikimedia: ${withWikimedia.length}`);
  console.log(`Null/empty: ${withNull.length}`);
}

main().catch(console.error).finally(() => process.exit(0));
