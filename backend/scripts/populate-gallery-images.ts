import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const GOOGLE_API_KEY = 'AIzaSyBWFZXD6ZNybLmcYFfhpusH5iQV207qzqs';

interface GalleryImage {
  url: string;
  caption: string;
  credit: string;
}

interface PlacePhoto {
  photo_reference: string;
  height: number;
  width: number;
  html_attributions?: string[];
}

interface PlaceSearchResult {
  candidates: Array<{
    place_id: string;
    name: string;
    photos?: PlacePhoto[];
  }>;
  status: string;
  error_message?: string;
}

interface PlaceDetailsResult {
  result: {
    name: string;
    photos?: PlacePhoto[];
  };
  status: string;
  error_message?: string;
}

interface NearbySearchResult {
  results: Array<{
    place_id: string;
    name: string;
    photos?: PlacePhoto[];
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

// Find place and get multiple photos
async function findPlacePhotos(name: string, lat: number, lng: number): Promise<{ placeId: string; photos: PlacePhoto[] } | null> {
  try {
    const cleanName = name.replace(/\(.*?\)/g, '').replace(/HBC|NWC|BC/g, '').trim();
    const query = encodeURIComponent(cleanName);
    const locationBias = `point:${lat},${lng}`;
    const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&locationbias=${locationBias}&fields=place_id,name,photos&key=${GOOGLE_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json() as PlaceSearchResult;

    if (data.status === 'OK' && data.candidates.length > 0) {
      const place = data.candidates[0];
      if (place && place.place_id) {
        return { placeId: place.place_id, photos: place.photos || [] };
      }
    }
    return null;
  } catch {
    return null;
  }
}

// Get place details with more photos
async function getPlaceDetails(placeId: string): Promise<PlacePhoto[]> {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,photos&key=${GOOGLE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json() as PlaceDetailsResult;

    if (data.status === 'OK' && data.result?.photos) {
      return data.result.photos;
    }
    return [];
  } catch {
    return [];
  }
}

// Search nearby for additional photos
async function searchNearbyPhotos(lat: number, lng: number, keyword?: string): Promise<PlacePhoto[]> {
  try {
    const radius = 10000;
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&key=${GOOGLE_API_KEY}`;
    if (keyword) {
      url += `&keyword=${encodeURIComponent(keyword)}`;
    }

    const response = await fetch(url);
    const data = await response.json() as NearbySearchResult;

    const allPhotos: PlacePhoto[] = [];
    if (data.status === 'OK' && data.results.length > 0) {
      for (const result of data.results) {
        if (result.photos) {
          allPhotos.push(...result.photos);
        }
        if (allPhotos.length >= 10) break;
      }
    }
    return allPhotos;
  } catch {
    return [];
  }
}

// Text search for historical sites
async function textSearchPhotos(query: string, lat: number, lng: number): Promise<PlacePhoto[]> {
  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodedQuery}&location=${lat},${lng}&radius=50000&key=${GOOGLE_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json() as NearbySearchResult;

    const allPhotos: PlacePhoto[] = [];
    if (data.status === 'OK' && data.results.length > 0) {
      for (const result of data.results) {
        if (result.photos) {
          allPhotos.push(...result.photos);
        }
        if (allPhotos.length >= 10) break;
      }
    }
    return allPhotos;
  } catch {
    return [];
  }
}

// Collect 3-5 unique photos for a location
async function collectGalleryPhotos(
  name: string,
  lat: number,
  lng: number,
  locationType: string
): Promise<GalleryImage[]> {
  const photoRefs = new Set<string>();
  const gallery: GalleryImage[] = [];

  // Strategy 1: Find place and get its photos
  const placeResult = await findPlacePhotos(name, lat, lng);
  if (placeResult) {
    // Get more photos from place details
    const detailPhotos = await getPlaceDetails(placeResult.placeId);
    for (const photo of detailPhotos) {
      if (!photoRefs.has(photo.photo_reference)) {
        photoRefs.add(photo.photo_reference);
      }
    }
    // Also add initial photos
    for (const photo of placeResult.photos) {
      if (!photoRefs.has(photo.photo_reference)) {
        photoRefs.add(photo.photo_reference);
      }
    }
  }

  await new Promise(r => setTimeout(r, 100));

  // Strategy 2: Text search with historical context
  if (photoRefs.size < 5) {
    const historicPhotos = await textSearchPhotos(`${name} historic site Canada`, lat, lng);
    for (const photo of historicPhotos) {
      if (!photoRefs.has(photo.photo_reference)) {
        photoRefs.add(photo.photo_reference);
      }
    }
  }

  await new Promise(r => setTimeout(r, 100));

  // Strategy 3: Nearby search with type keyword
  if (photoRefs.size < 5) {
    const nearbyPhotos = await searchNearbyPhotos(lat, lng, locationType);
    for (const photo of nearbyPhotos) {
      if (!photoRefs.has(photo.photo_reference)) {
        photoRefs.add(photo.photo_reference);
      }
    }
  }

  await new Promise(r => setTimeout(r, 100));

  // Strategy 4: Generic nearby search
  if (photoRefs.size < 3) {
    const genericPhotos = await searchNearbyPhotos(lat, lng);
    for (const photo of genericPhotos) {
      if (!photoRefs.has(photo.photo_reference)) {
        photoRefs.add(photo.photo_reference);
      }
    }
  }

  // Convert to gallery images (limit to 5)
  let index = 0;
  for (const ref of photoRefs) {
    if (gallery.length >= 5) break;

    const url = getPhotoUrl(ref);
    const isValid = await verifyImageUrl(url);

    if (isValid) {
      gallery.push({
        url,
        caption: index === 0 ? `${name}` : `${name} - View ${index + 1}`,
        credit: 'Google Places'
      });
      index++;
    }
  }

  return gallery;
}

async function main() {
  console.log('=== POPULATE GALLERY IMAGES FOR LOCATIONS ===\n');

  // Fetch all locations
  const result = await client.execute('SELECT id, name, latitude, longitude, locationType FROM Location ORDER BY name');

  console.log(`Found ${result.rows.length} locations to process\n`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < result.rows.length; i++) {
    const row = result.rows[i];
    if (!row) continue;

    const id = String(row.id);
    const name = String(row.name);
    const lat = Number(row.latitude);
    const lng = Number(row.longitude);
    const locationType = String(row.locationType || 'Fort');

    console.log(`[${i + 1}/${result.rows.length}] ${name}`);

    const gallery = await collectGalleryPhotos(name, lat, lng, locationType);

    if (gallery.length >= 3) {
      console.log(`  Found ${gallery.length} images`);

      // Update database
      const updateResult = await client.execute({
        sql: `UPDATE Location SET galleryImages = ?, updatedAt = datetime('now') WHERE id = ?`,
        args: [JSON.stringify(gallery), id]
      });

      if (updateResult.rowsAffected > 0) {
        console.log('  ✓ Gallery saved');
        successCount++;
      } else {
        console.log('  ✗ Failed to save');
        failCount++;
      }
    } else {
      console.log(`  ✗ Only found ${gallery.length} images (need 3+)`);
      failCount++;
    }

    // Rate limiting
    await new Promise(r => setTimeout(r, 200));
  }

  console.log('\n=== SUMMARY ===');
  console.log(`Successfully updated: ${successCount}`);
  console.log(`Failed (< 3 images): ${failCount}`);

  // Verify
  const verify = await client.execute('SELECT COUNT(*) as count FROM Location WHERE galleryImages IS NOT NULL');
  console.log(`\nLocations with galleries in Turso: ${verify.rows[0]?.count}`);
}

main().catch(console.error);
