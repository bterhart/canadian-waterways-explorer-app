import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const GOOGLE_API_KEY = 'AIzaSyBWFZXD6ZNybLmcYFfhpusH5iQV207qzqs';
const PLACEHOLDER_URL = 'https://commons.wikimedia.org/wiki/Special:FilePath/Fort_William_Ontario.JPG?width=800';

interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  locationType: string;
}

interface PlaceSearchResult {
  candidates: Array<{
    place_id: string;
    name: string;
    photos?: Array<{
      photo_reference: string;
      height: number;
      width: number;
    }>;
  }>;
  status: string;
  error_message?: string;
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
  } catch (error) {
    return false;
  }
}

// Get photo URL from Google Places photo reference
function getPhotoUrl(photoReference: string): string {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoReference}&key=${GOOGLE_API_KEY}`;
}

// Search for a place using Google Places API
async function findPlaceImage(name: string, lat: number, lng: number): Promise<string | null> {
  try {
    // Clean up the name for better search results
    const cleanName = name
      .replace(/\(.*?\)/g, '') // Remove parenthetical notes
      .replace(/HBC|NWC|BC/g, '') // Remove company abbreviations
      .trim();

    const query = encodeURIComponent(cleanName);
    const locationBias = `point:${lat},${lng}`;
    const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&locationbias=${locationBias}&fields=place_id,name,photos&key=${GOOGLE_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json() as PlaceSearchResult;

    if (data.error_message) {
      console.log(`    API Error: ${data.error_message}`);
      return null;
    }

    if (data.status === 'OK' && data.candidates.length > 0) {
      const place = data.candidates[0];
      if (place && place.photos && place.photos.length > 0) {
        const firstPhoto = place.photos[0];
        if (firstPhoto) {
          return getPhotoUrl(firstPhoto.photo_reference);
        }
      }
    }
    return null;
  } catch (error) {
    console.log(`    Fetch error: ${error}`);
    return null;
  }
}

// Try nearby search as fallback
async function searchNearbyImage(lat: number, lng: number, keyword?: string): Promise<string | null> {
  try {
    const radius = 10000; // 10km radius
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&key=${GOOGLE_API_KEY}`;

    if (keyword) {
      url += `&keyword=${encodeURIComponent(keyword)}`;
    }

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
    console.log(`    Nearby search error: ${error}`);
    return null;
  }
}

// Try text search for historical sites
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

async function main() {
  console.log('=== REPLACE PLACEHOLDER IMAGES WITH GOOGLE IMAGERY ===\n');

  // 1. Fetch all locations with the placeholder image
  console.log('Fetching locations with Fort William placeholder...');
  const result = await client.execute({
    sql: `SELECT id, name, latitude, longitude, locationType FROM Location WHERE imageUrl = ?`,
    args: [PLACEHOLDER_URL]
  });

  const locations: Location[] = result.rows.map(row => ({
    id: String(row.id),
    name: String(row.name),
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    locationType: String(row.locationType || 'Fort'),
  }));

  console.log(`Found ${locations.length} locations with placeholder\n`);

  if (locations.length === 0) {
    console.log('No locations need updating!');
    return;
  }

  // 2. Process each location
  let successCount = 0;
  let failCount = 0;
  const results: { name: string; status: string; url?: string }[] = [];

  for (const loc of locations) {
    console.log(`\n[${successCount + failCount + 1}/${locations.length}] ${loc.name}`);
    console.log(`  Type: ${loc.locationType} | Coords: ${loc.latitude}, ${loc.longitude}`);

    let imageUrl: string | null = null;

    // Strategy 1: Direct place search
    console.log('  Trying place search...');
    imageUrl = await findPlaceImage(loc.name, loc.latitude, loc.longitude);

    // Strategy 2: Text search with "historic site" or location type
    if (!imageUrl) {
      console.log('  Trying text search with historic context...');
      const searchTerms = [
        `${loc.name} historic site`,
        `${loc.name} Canada`,
        `${loc.name.replace(/\(.*?\)/g, '').trim()} historical`,
      ];

      for (const term of searchTerms) {
        imageUrl = await textSearchImage(term, loc.latitude, loc.longitude);
        if (imageUrl) break;
      }
    }

    // Strategy 3: Nearby search with type keyword
    if (!imageUrl) {
      console.log('  Trying nearby search...');
      const keywords = [loc.locationType, 'historic', 'museum', 'park'];
      for (const keyword of keywords) {
        imageUrl = await searchNearbyImage(loc.latitude, loc.longitude, keyword);
        if (imageUrl) break;
      }
    }

    // Strategy 4: Generic nearby search (landscape)
    if (!imageUrl) {
      console.log('  Trying generic nearby search...');
      imageUrl = await searchNearbyImage(loc.latitude, loc.longitude);
    }

    if (imageUrl) {
      // Verify the image URL works
      console.log('  Verifying image URL...');
      const isValid = await verifyImageUrl(imageUrl);

      if (isValid) {
        console.log('  ✓ Image verified! Updating database...');

        const updateResult = await client.execute({
          sql: `UPDATE Location SET imageUrl = ?, updatedAt = datetime('now') WHERE id = ?`,
          args: [imageUrl, loc.id]
        });

        if (updateResult.rowsAffected > 0) {
          console.log('  ✓ Database updated successfully');
          successCount++;
          results.push({ name: loc.name, status: 'SUCCESS', url: imageUrl });
        } else {
          console.log('  ✗ Database update failed');
          failCount++;
          results.push({ name: loc.name, status: 'DB_UPDATE_FAILED' });
        }
      } else {
        console.log('  ✗ Image URL returned error');
        failCount++;
        results.push({ name: loc.name, status: 'IMAGE_INVALID' });
      }
    } else {
      console.log('  ✗ No image found');
      failCount++;
      results.push({ name: loc.name, status: 'NO_IMAGE_FOUND' });
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  // 3. Print summary
  console.log('\n\n=== SUMMARY ===');
  console.log(`Total processed: ${locations.length}`);
  console.log(`Successfully updated: ${successCount}`);
  console.log(`Failed: ${failCount}`);

  console.log('\n=== DETAILED RESULTS ===');
  for (const r of results) {
    const icon = r.status === 'SUCCESS' ? '✓' : '✗';
    console.log(`${icon} ${r.name}: ${r.status}`);
  }

  // 4. Verify updates in database
  console.log('\n=== VERIFYING TURSO DB ===');
  const verifyResult = await client.execute({
    sql: `SELECT COUNT(*) as count FROM Location WHERE imageUrl = ?`,
    args: [PLACEHOLDER_URL]
  });
  const remainingCount = verifyResult.rows[0]?.count;
  console.log(`Locations still with placeholder: ${remainingCount}`);
}

main().catch(console.error);
