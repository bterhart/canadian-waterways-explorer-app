import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const GOOGLE_API_KEY = 'AIzaSyBWFZXD6ZNybLmcYFfhpusH5iQV207qzqs';

interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  locationType: string;
  imageUrl: string;
}

interface NearbySearchResult {
  results: Array<{
    name: string;
    photos?: Array<{
      photo_reference: string;
    }>;
  }>;
  status: string;
  error_message?: string;
}

// Verify image URL returns HTTP 200
async function verifyImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

// Get photo URL from Google Places photo reference
function getPhotoUrl(photoReference: string): string {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoReference}&key=${GOOGLE_API_KEY}`;
}

// Text search for historical sites
async function textSearchImage(query: string, lat: number, lng: number): Promise<string | null> {
  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodedQuery}&location=${lat},${lng}&radius=50000&key=${GOOGLE_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json() as NearbySearchResult;

    if (data.error_message) {
      console.log(`    API Error: ${data.error_message}`);
      return null;
    }

    if (data.status === 'OK' && data.results.length > 0) {
      for (const result of data.results) {
        if (result.photos && result.photos.length > 0) {
          const firstPhoto = result.photos[0];
          if (firstPhoto) {
            return getPhotoUrl(firstPhoto.photo_reference);
          }
        }
      }
    }
    return null;
  } catch (error) {
    console.log(`    Text search error: ${error}`);
    return null;
  }
}

// Nearby search
async function searchNearbyImage(lat: number, lng: number, keyword?: string): Promise<string | null> {
  try {
    const radius = 15000;
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&key=${GOOGLE_API_KEY}`;

    if (keyword) {
      url += `&keyword=${encodeURIComponent(keyword)}`;
    }

    const response = await fetch(url);
    const data = await response.json() as NearbySearchResult;

    if (data.status === 'OK' && data.results.length > 0) {
      for (const result of data.results) {
        if (result.photos && result.photos.length > 0) {
          const firstPhoto = result.photos[0];
          if (firstPhoto) {
            return getPhotoUrl(firstPhoto.photo_reference);
          }
        }
      }
    }
    return null;
  } catch {
    return null;
  }
}

// Locations that need unique images - we'll keep the first one in each group and update the rest
const locationsToUpdate = [
  // Fort Garry group - keep Lower Fort Garry image for Lower Fort Garry, update others
  { name: 'Fort Garry', needsUpdate: true },
  { name: 'Upper Fort Garry', needsUpdate: true },
  // La Pérouse and La Vase should not use Fort Langley image
  { name: 'La Pérouse Memorial (Lituya Bay)', needsUpdate: true },
  { name: 'La Vase Portages', needsUpdate: true },
  // Sault Ste. Marie - keep one, update other
  { name: 'Sault Ste. Marie Post', needsUpdate: true },
  // Rocky Mountain House - keep one, update other
  { name: 'Rocky Mountain House (NWC)', needsUpdate: true },
  // Churchill - keep Prince of Wales Fort, update Fort Churchill
  { name: 'Fort Churchill', needsUpdate: true },
  // Nootka Sound - update one
  { name: 'Bligh Island (Nootka Sound)', needsUpdate: true },
  // Lake of the Woods - update one
  { name: 'Massacre Island (Lake of the Woods)', needsUpdate: true },
];

async function main() {
  console.log('=== REPLACE REMAINING DUPLICATE IMAGES ===\n');

  let successCount = 0;
  let failCount = 0;

  for (const locInfo of locationsToUpdate) {
    // Fetch the location
    const result = await client.execute({
      sql: 'SELECT id, name, latitude, longitude, locationType, imageUrl FROM Location WHERE name = ?',
      args: [locInfo.name]
    });

    if (result.rows.length === 0) {
      console.log(`\n✗ Location not found: ${locInfo.name}`);
      failCount++;
      continue;
    }

    const row = result.rows[0];
    if (!row) continue;

    const loc: Location = {
      id: String(row.id),
      name: String(row.name),
      latitude: Number(row.latitude),
      longitude: Number(row.longitude),
      locationType: String(row.locationType || 'Fort'),
      imageUrl: String(row.imageUrl || ''),
    };

    console.log(`\n[${locInfo.name}]`);
    console.log(`  Current: ${loc.imageUrl.split('/').pop()}`);
    console.log(`  Coords: ${loc.latitude}, ${loc.longitude}`);

    let imageUrl: string | null = null;

    // Try multiple search strategies
    const searchTerms = [
      loc.name.replace(/\(.*?\)/g, '').trim(),
      `${loc.name} Canada`,
      `${loc.name} historic`,
      `${loc.locationType} ${loc.name.split(' ')[0]}`,
    ];

    for (const term of searchTerms) {
      console.log(`  Searching: "${term}"...`);
      imageUrl = await textSearchImage(term, loc.latitude, loc.longitude);
      if (imageUrl) break;
      await new Promise(r => setTimeout(r, 200));
    }

    // Try nearby search with keywords
    if (!imageUrl) {
      const keywords = [loc.locationType, 'historic', 'landmark', 'park', 'museum'];
      for (const kw of keywords) {
        console.log(`  Nearby search: "${kw}"...`);
        imageUrl = await searchNearbyImage(loc.latitude, loc.longitude, kw);
        if (imageUrl) break;
        await new Promise(r => setTimeout(r, 200));
      }
    }

    // Generic nearby
    if (!imageUrl) {
      console.log('  Generic nearby search...');
      imageUrl = await searchNearbyImage(loc.latitude, loc.longitude);
    }

    if (imageUrl) {
      const isValid = await verifyImageUrl(imageUrl);
      if (isValid) {
        console.log('  ✓ Image verified! Updating...');

        const updateResult = await client.execute({
          sql: 'UPDATE Location SET imageUrl = ?, updatedAt = datetime(\'now\') WHERE id = ?',
          args: [imageUrl, loc.id]
        });

        if (updateResult.rowsAffected > 0) {
          console.log('  ✓ Updated successfully');
          successCount++;
        } else {
          console.log('  ✗ Update failed');
          failCount++;
        }
      } else {
        console.log('  ✗ Image URL invalid');
        failCount++;
      }
    } else {
      console.log('  ✗ No unique image found');
      failCount++;
    }

    await new Promise(r => setTimeout(r, 300));
  }

  console.log('\n\n=== SUMMARY ===');
  console.log(`Updated: ${successCount}`);
  console.log(`Failed: ${failCount}`);

  // Final verification
  console.log('\n=== FINAL DUPLICATE CHECK ===');
  const duplicates = await client.execute(`
    SELECT imageUrl, COUNT(*) as count
    FROM Location
    GROUP BY imageUrl
    HAVING count > 1
    ORDER BY count DESC
  `);

  if (duplicates.rows.length === 0) {
    console.log('No duplicates remaining!');
  } else {
    console.log('Remaining duplicates:');
    for (const row of duplicates.rows) {
      console.log(`  Count: ${row.count} | ${String(row.imageUrl).split('/').pop()}`);
    }
  }
}

main().catch(console.error);
