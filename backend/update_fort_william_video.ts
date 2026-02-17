import { db } from './src/db';

async function main() {
  // The working Parks Canada Métis video ID
  const workingVideoId = "-gpVOnXMttc";
  const workingVideoUrl = `https://www.youtube.com/watch?v=${workingVideoId}`;
  
  // Get Fort William location
  const fortWilliam = await db.location.findFirst({
    where: { name: 'Fort William' },
    select: { id: true, name: true, videoUrl: true }
  });
  
  if (!fortWilliam) {
    console.log("Fort William not found");
    return;
  }
  
  console.log("=== BEFORE UPDATE ===");
  console.log(`Location: ${fortWilliam.name}`);
  console.log(`Old videoUrl: ${fortWilliam.videoUrl}`);
  
  // Update with working video
  await db.location.update({
    where: { id: fortWilliam.id },
    data: { videoUrl: workingVideoUrl }
  });
  
  // Verify update
  const updated = await db.location.findFirst({
    where: { id: fortWilliam.id },
    select: { id: true, name: true, videoUrl: true }
  });
  
  console.log("\n=== AFTER UPDATE ===");
  console.log(`Location: ${updated?.name}`);
  console.log(`New videoUrl: ${updated?.videoUrl}`);
  
  // Verify the new URL works
  const testResult = await fetch(`https://www.youtube.com/oembed?url=${workingVideoUrl}&format=json`);
  if (testResult.ok) {
    const data = await testResult.json();
    console.log(`\n✅ VIDEO VERIFIED: "${data.title}"`);
  } else {
    console.log(`\n❌ VIDEO VERIFICATION FAILED`);
  }
}

main().catch(console.error);
