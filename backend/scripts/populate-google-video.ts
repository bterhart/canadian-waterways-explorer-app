import { createClient } from '@libsql/client';

/**
 * Script to populate video URLs for locations and waterways
 *
 * Since Google Places API does NOT provide video content (confirmed via testing),
 * this script uses the Google Street View Static API to check for panoramic imagery.
 *
 * For actual video content, we use Google Maps embed URLs which can show
 * interactive Street View and Maps imagery (which includes aerial/satellite views).
 */

const GOOGLE_API_KEY = 'AIzaSyBWFZXD6ZNybLmcYFfhpusH5iQV207qzqs';

const client = createClient({
  url: 'libsql://canadianwaterwaysexplorer-bterhart.aws-us-east-2.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzExMDYzODEsImlkIjoiMTliZDYzMmMtZjNkYy00YzAwLTg0ODItNzU5YjQ3MmIxMGE0IiwicmlkIjoiZTdiMjljMTYtNGJhZi00YzM3LWEyYzQtZjJmYmViYTcyMjA2In0.Mixg_E1goZM8e0_81rnymYLtKVBbsp3DhQgkKZ4eP0ONcm-oBnRDiZ8dPDHdjUAmg023zpBCoB0d832JlVHPDQ',
});

// Locations that need video URLs (currently null)
const locationsToProcess = [
  'York Factory',
  'Cumberland House',
  'Fort Edmonton',
  'Fort Chipewyan',
  'Methye Portage',
  'Moose Factory',
  'Fort St. James',
  'Prince of Wales Fort',
  'Fort Carlton',
  'Fort Vancouver (HBC)',
  'Fort Astoria / Fort George',
];

// Waterways that need video URLs
const waterwaysToProcess = [
  'Mackenzie River',
  'Saskatchewan River',
  'Churchill River',
  'Lake Winnipeg',
  'Great Slave Lake',
  'Great Bear Lake',
  'Lake Athabasca',
  'Hudson Bay',
  'James Bay',
  'Nelson River',
  'Athabasca River',
  'Peace River',
  'Yukon River',
  'Coppermine River',
  'Hayes River',
  'Lake of the Woods',
  'French River',
];

interface LocationRow {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface WaterwayRow {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface TextSearchResponse {
  places?: Array<{
    id: string;
    displayName?: { text: string };
    formattedAddress?: string;
    location?: { latitude: number; longitude: number };
  }>;
}

interface StreetViewMetadataResponse {
  status: string;
  copyright?: string;
  date?: string;
  location?: { lat: number; lng: number };
  pano_id?: string;
}

// Find place coordinates using Google Places API (New)
async function findPlaceCoordinates(query: string): Promise<{ lat: number; lng: number } | null> {
  const url = 'https://places.googleapis.com/v1/places:searchText';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.location'
      },
      body: JSON.stringify({
        textQuery: query,
        languageCode: 'en'
      })
    });

    const data = await response.json() as TextSearchResponse;

    if (data.places && data.places.length > 0) {
      const firstPlace = data.places[0];
      if (firstPlace && firstPlace.location) {
        return {
          lat: firstPlace.location.latitude,
          lng: firstPlace.location.longitude
        };
      }
    }
  } catch (error) {
    console.error(`  Error finding place: ${error}`);
  }
  return null;
}

// Check if Street View imagery is available at a location
async function checkStreetViewAvailable(lat: number, lng: number): Promise<StreetViewMetadataResponse | null> {
  const url = `https://maps.googleapis.com/maps/api/streetview/metadata?location=${lat},${lng}&key=${GOOGLE_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json() as StreetViewMetadataResponse;

    if (data.status === 'OK') {
      return data;
    }
  } catch (error) {
    console.error(`  Error checking Street View: ${error}`);
  }
  return null;
}

// Generate a Google Maps embed URL for a location
// This provides interactive map/satellite/street view experience
function generateMapsEmbedUrl(lat: number, lng: number, name: string): string {
  // Use the embed API with satellite view and centered on location
  const encodedName = encodeURIComponent(name);
  return `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_API_KEY}&q=${encodedName}&center=${lat},${lng}&zoom=14&maptype=satellite`;
}

// Generate a Street View embed URL if available
function generateStreetViewUrl(panoId: string): string {
  return `https://www.google.com/maps/embed/v1/streetview?key=${GOOGLE_API_KEY}&pano=${panoId}&heading=0&pitch=0&fov=90`;
}

// Alternative: Generate a Google Earth web URL
function generateGoogleEarthUrl(lat: number, lng: number): string {
  // Google Earth web URL format
  return `https://earth.google.com/web/@${lat},${lng},100a,1000d,35y,0h,0t,0r`;
}

async function processLocations() {
  console.log('\n=== Processing Locations ===\n');

  for (const locationName of locationsToProcess) {
    console.log(`Processing: ${locationName}`);

    // Get location from database
    const result = await client.execute({
      sql: `SELECT id, name, latitude, longitude FROM Location WHERE name = ?`,
      args: [locationName]
    });

    if (result.rows.length === 0) {
      console.log(`  Location not found in database, trying search...`);

      // Try to find via Places API
      const coords = await findPlaceCoordinates(`${locationName} Canada historic site`);
      if (coords) {
        console.log(`  Found coordinates: ${coords.lat}, ${coords.lng}`);
      } else {
        console.log(`  Could not find location`);
        continue;
      }
    }

    const row = result.rows[0];
    if (!row) {
      console.log(`  No row found`);
      continue;
    }

    const location: LocationRow = {
      id: String(row.id),
      name: String(row.name),
      latitude: Number(row.latitude),
      longitude: Number(row.longitude)
    };

    console.log(`  Coordinates: ${location.latitude}, ${location.longitude}`);

    // Check for Street View availability
    const streetViewData = await checkStreetViewAvailable(location.latitude, location.longitude);

    let videoUrl: string;
    if (streetViewData && streetViewData.pano_id) {
      console.log(`  Street View available! Pano ID: ${streetViewData.pano_id}`);
      console.log(`  Date: ${streetViewData.date || 'unknown'}`);
      videoUrl = generateStreetViewUrl(streetViewData.pano_id);
    } else {
      console.log(`  No Street View available, using satellite/maps embed`);
      videoUrl = generateMapsEmbedUrl(location.latitude, location.longitude, location.name);
    }

    console.log(`  Video URL: ${videoUrl}`);

    // Update database
    const updateResult = await client.execute({
      sql: `UPDATE Location SET videoUrl = ?, updatedAt = datetime('now') WHERE id = ?`,
      args: [videoUrl, location.id]
    });

    if (updateResult.rowsAffected > 0) {
      console.log(`  Database updated successfully`);
    } else {
      console.log(`  Warning: No rows affected`);
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('');
  }
}

async function processWaterways() {
  console.log('\n=== Processing Waterways ===\n');

  for (const waterwayName of waterwaysToProcess) {
    console.log(`Processing: ${waterwayName}`);

    // Get waterway from database
    const result = await client.execute({
      sql: `SELECT id, name, latitude, longitude FROM Waterway WHERE name = ?`,
      args: [waterwayName]
    });

    if (result.rows.length === 0) {
      console.log(`  Waterway not found in database`);
      continue;
    }

    const row = result.rows[0];
    if (!row) {
      console.log(`  No row found`);
      continue;
    }

    const waterway: WaterwayRow = {
      id: String(row.id),
      name: String(row.name),
      latitude: Number(row.latitude),
      longitude: Number(row.longitude)
    };

    const lat = waterway.latitude;
    const lng = waterway.longitude;

    console.log(`  Using database coordinates: ${lat}, ${lng}`);

    // Check for Street View availability
    const streetViewData = await checkStreetViewAvailable(lat, lng);

    let videoUrl: string;
    if (streetViewData && streetViewData.pano_id) {
      console.log(`  Street View available! Pano ID: ${streetViewData.pano_id}`);
      videoUrl = generateStreetViewUrl(streetViewData.pano_id);
    } else {
      console.log(`  No Street View available, using satellite/maps embed`);
      videoUrl = generateMapsEmbedUrl(lat, lng, waterway.name);
    }

    console.log(`  Video URL: ${videoUrl}`);

    // Update database
    const updateResult = await client.execute({
      sql: `UPDATE Waterway SET videoUrl = ?, updatedAt = datetime('now') WHERE id = ?`,
      args: [videoUrl, waterway.id]
    });

    if (updateResult.rowsAffected > 0) {
      console.log(`  Database updated successfully`);
    } else {
      console.log(`  Warning: No rows affected`);
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('');
  }
}

async function main() {
  console.log('=== POPULATE GOOGLE VIDEO/IMAGERY URLS ===');
  console.log('');
  console.log('Note: Google Places API does not provide video content.');
  console.log('This script uses:');
  console.log('  1. Street View API for panoramic imagery (when available)');
  console.log('  2. Google Maps Embed API for satellite/map views (fallback)');
  console.log('');

  await processLocations();
  await processWaterways();

  // Summary
  console.log('\n=== SUMMARY ===\n');

  const locWithVideo = await client.execute({
    sql: `SELECT COUNT(*) as count FROM Location WHERE videoUrl IS NOT NULL`,
    args: []
  });
  const watWithVideo = await client.execute({
    sql: `SELECT COUNT(*) as count FROM Waterway WHERE videoUrl IS NOT NULL`,
    args: []
  });

  const locCount = locWithVideo.rows[0];
  const watCount = watWithVideo.rows[0];

  console.log(`Total locations with video URLs: ${locCount?.count || 0}`);
  console.log(`Total waterways with video URLs: ${watCount?.count || 0}`);
}

main().catch(console.error);
