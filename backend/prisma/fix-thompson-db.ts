import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSQL({
  url: 'libsql://canadianwaterwaysexplorer-bterhart.aws-us-east-2.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzExMDYzODEsImlkIjoiMTliZDYzMmMtZjNkYy00YzAwLTg0ODItNzU5YjQ3MmIxMGE0IiwicmlkIjoiZTdiMjljMTYtNGJhZi00YzM3LWEyYzQtZjJmYmViYTcyMjA2In0.Mixg_E1goZM8e0_81rnymYLtKVBbsp3DhQgkKZ4eP0ONcm-oBnRDiZ8dPDHdjUAmg023zpBCoB0d832JlVHPDQ',
});

const prisma = new PrismaClient({ adapter });
const THOMPSON_ID = 'cmlhaslpx0006m2zhsckolb5o';

// Waterways Thompson actually explored
const WATERWAYS_TO_ADD = [
  { waterwayId: 'cmlhbjrpw0003m2mbmmpa8102', yearExplored: 1810, notes: 'Thompson used the Athabasca Pass approach to cross the Rockies in 1810-1811, ascending the Athabasca River to its headwaters.' },
  { waterwayId: 'cmlhaslr1000um2zh1ohr52f9', yearExplored: 1796, notes: 'Thompson surveyed the Churchill River extensively during his time at Cumberland House and surrounding posts for the NWC, 1796-1797.' },
  { waterwayId: 'cmlhaslri0014m2zhlrrx8pqe', yearExplored: 1797, notes: 'Thompson mapped portions of Lake Winnipeg\'s shoreline and connecting waterways during his surveys for the North West Company.' },
  { waterwayId: 'cmlhaslra000ym2zh4pyu55je', yearExplored: 1784, notes: 'Thompson was stationed at Fort William (Grand Portage) on Lake Superior during his early career with the HBC and later NWC, using it as the main depot for western supply routes.' },
  { waterwayId: 'cmlk2w3jm0002m2636jrqvptl', yearExplored: 1798, notes: 'Thompson mapped and surveyed Lake of the Woods while establishing survey control points for the North West Company boundary negotiations.' },
];

async function main() {
  // Step 1: Delete the incorrect Fraser River association
  console.log('Deleting incorrect Thompson-Fraser River link...');
  const deleteResult = await prisma.explorerWaterway.delete({
    where: { id: 'cmlhc4h1s002lm2oga63nrr7y' }
  });
  console.log('Deleted:', deleteResult.id);

  // Step 2: Add correct waterway associations
  for (const w of WATERWAYS_TO_ADD) {
    // Check if already exists
    const existing = await prisma.explorerWaterway.findFirst({
      where: { explorerId: THOMPSON_ID, waterwayId: w.waterwayId }
    });
    if (existing) {
      console.log(`Already exists: ${w.waterwayId}`);
      continue;
    }
    const created = await prisma.explorerWaterway.create({
      data: {
        explorerId: THOMPSON_ID,
        waterwayId: w.waterwayId,
        yearExplored: w.yearExplored,
        expeditionNotes: w.notes,
      }
    });
    console.log('Created:', created.id, 'for waterwayId:', w.waterwayId);
  }

  // Verify final state
  const final = await prisma.explorerWaterway.findMany({
    where: { explorerId: THOMPSON_ID },
    include: { waterway: { select: { name: true } } },
    orderBy: { yearExplored: 'asc' }
  });
  console.log('\nFinal Thompson waterways:');
  final.forEach(r => console.log(`  ${r.yearExplored}: ${r.waterway.name}`));
}

main().catch(console.error).finally(() => process.exit(0));
