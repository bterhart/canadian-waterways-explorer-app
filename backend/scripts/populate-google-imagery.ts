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
  imageUrl: string | null;
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
}

// Search for a place using Google Places API
async function findPlace(name: string, lat: number, lng: number): Promise<string | null> {
  try {
    // Use Find Place from Text API with location bias
    const query = encodeURIComponent(name);
    const locationBias = `point:${lat},${lng}`;
    const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&locationbias=${locationBias}&fields=place_id,name,photos&key=${GOOGLE_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json() as PlaceSearchResult;

    if (data.status === 'OK' && data.candidates.length > 0) {
      const place = data.candidates[0];
      if (place && place.photos && place.photos.length > 0) {
        // Get the photo reference and construct photo URL
        const firstPhoto = place.photos[0];
        if (firstPhoto) {
          const photoRef = firstPhoto.photo_reference;
          const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${GOOGLE_API_KEY}`;
          return photoUrl;
        }
      }
    }
    return null;
  } catch (error) {
    console.error(`  Error searching for ${name}:`, error);
    return null;
  }
}

// Alternative: Use Nearby Search for locations that don't match by name
async function searchNearby(lat: number, lng: number, type?: string): Promise<string | null> {
  try {
    const radius = 5000; // 5km radius
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&key=${GOOGLE_API_KEY}`;

    // Add keyword for location type if provided
    if (type) {
      url += `&keyword=${encodeURIComponent(type)}`;
    }

    const response = await fetch(url);
    const data = await response.json() as { results: Array<{ photos?: Array<{ photo_reference: string }> }>, status: string };

    if (data.status === 'OK' && data.results.length > 0) {
      // Find first result with photos
      for (const result of data.results) {
        if (result.photos && result.photos.length > 0) {
          const firstPhoto = result.photos[0];
          if (firstPhoto) {
            const photoRef = firstPhoto.photo_reference;
            const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${GOOGLE_API_KEY}`;
            return photoUrl;
          }
        }
      }
    }
    return null;
  } catch (error) {
    console.error(`  Error in nearby search:`, error);
    return null;
  }
}

async function main() {
  console.log('=== POPULATE GOOGLE IMAGERY FOR LOCATIONS ===\n');

  // 1. Fetch all locations without images
  console.log('Fetching locations without images...');
  const result = await client.execute({
    sql: `SELECT id, name, latitude, longitude, locationType, imageUrl FROM Location WHERE imageUrl IS NULL OR imageUrl = ''`,
    args: []
  });

  const locations: Location[] = result.rows.map(row => ({
    id: String(row.id),
    name: String(row.name),
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    locationType: String(row.locationType || 'Settlement'),
    imageUrl: row.imageUrl ? String(row.imageUrl) : null
  }));

  console.log(`Found ${locations.length} locations without images\n`);

  if (locations.length === 0) {
    console.log('All locations already have images!');
    return;
  }

  // 2. Process each location
  let successCount = 0;
  let failCount = 0;

  for (const loc of locations) {
    console.log(`Processing: ${loc.name} (${loc.locationType})`);
    console.log(`  Coordinates: ${loc.latitude}, ${loc.longitude}`);

    // Try to find a place by name first
    let imageUrl = await findPlace(loc.name, loc.latitude, loc.longitude);

    // If no result by name, try nearby search with location type
    if (!imageUrl) {
      console.log('  No result by name, trying nearby search...');
      imageUrl = await searchNearby(loc.latitude, loc.longitude, loc.locationType);
    }

    // If still no result, try generic nearby search
    if (!imageUrl) {
      console.log('  Trying generic nearby search...');
      imageUrl = await searchNearby(loc.latitude, loc.longitude);
    }

    if (imageUrl) {
      console.log(`  Found image! Updating database...`);

      // Update the location with the image URL
      const updateResult = await client.execute({
        sql: `UPDATE Location SET imageUrl = ?, updatedAt = datetime('now') WHERE id = ?`,
        args: [imageUrl, loc.id]
      });

      if (updateResult.rowsAffected > 0) {
        console.log('  Successfully updated!');
        successCount++;
      } else {
        console.log('  Warning: No rows affected');
        failCount++;
      }
    } else {
      console.log('  No image found');
      failCount++;
    }

    // Rate limiting - Google has quotas
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log('');
  }

  console.log('=== SUMMARY ===');
  console.log(`Total locations processed: ${locations.length}`);
  console.log(`Successfully updated: ${successCount}`);
  console.log(`Failed/No image found: ${failCount}`);
}

main().catch(console.error);
