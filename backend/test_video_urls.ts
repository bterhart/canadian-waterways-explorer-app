import { db } from './src/db';

async function testYouTubeUrl(url: string): Promise<{ status: number; available: boolean; error?: string }> {
  try {
    // Extract video ID
    const match = url.match(/(?:watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (!match || !match[1]) {
      return { status: 0, available: false, error: 'Invalid YouTube URL format' };
    }
    const videoId = match[1];
    
    // Test using YouTube's oEmbed API
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await fetch(oembedUrl, { method: 'GET' });
    
    if (response.status === 200) {
      return { status: 200, available: true };
    } else if (response.status === 401 || response.status === 403) {
      return { status: response.status, available: false, error: 'Video is private or restricted' };
    } else if (response.status === 404) {
      return { status: 404, available: false, error: 'Video not found' };
    } else {
      return { status: response.status, available: false, error: `HTTP ${response.status}` };
    }
  } catch (error) {
    return { status: 0, available: false, error: String(error) };
  }
}

async function main() {
  // Get all video URLs from Location table
  const locations = await db.location.findMany({
    where: {
      videoUrl: { not: null }
    },
    select: { id: true, name: true, videoUrl: true }
  });
  
  // Get all video URLs from Waterway table
  const waterways = await db.waterway.findMany({
    where: {
      videoUrl: { not: null }
    },
    select: { id: true, name: true, videoUrl: true }
  });
  
  const brokenUrls: { type: string; id: string; name: string; url: string; error: string }[] = [];
  
  console.log(`Testing ${locations.length} location videos...\n`);
  
  for (const loc of locations) {
    if (loc.videoUrl) {
      const result = await testYouTubeUrl(loc.videoUrl);
      if (!result.available) {
        console.log(`❌ Location: ${loc.name}`);
        console.log(`   URL: ${loc.videoUrl}`);
        console.log(`   Error: ${result.error}`);
        brokenUrls.push({ type: 'location', id: loc.id, name: loc.name, url: loc.videoUrl, error: result.error || 'Unknown' });
      } else {
        console.log(`✅ Location: ${loc.name}`);
      }
    }
  }
  
  console.log(`\nTesting ${waterways.length} waterway videos...\n`);
  
  for (const ww of waterways) {
    if (ww.videoUrl) {
      const result = await testYouTubeUrl(ww.videoUrl);
      if (!result.available) {
        console.log(`❌ Waterway: ${ww.name}`);
        console.log(`   URL: ${ww.videoUrl}`);
        console.log(`   Error: ${result.error}`);
        brokenUrls.push({ type: 'waterway', id: ww.id, name: ww.name, url: ww.videoUrl, error: result.error || 'Unknown' });
      } else {
        console.log(`✅ Waterway: ${ww.name}`);
      }
    }
  }
  
  console.log(`\n=== SUMMARY ===`);
  console.log(`Total broken video URLs: ${brokenUrls.length}`);
  
  if (brokenUrls.length > 0) {
    console.log(`\n=== BROKEN VIDEO URLs ===\n`);
    for (const b of brokenUrls) {
      console.log(`${b.type.toUpperCase()}: ${b.name}`);
      console.log(`  ID: ${b.id}`);
      console.log(`  URL: ${b.url}`);
      console.log(`  Error: ${b.error}`);
      console.log('');
    }
  }
}

main().catch(console.error);
