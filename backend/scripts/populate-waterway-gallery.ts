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
}

interface PlaceSearchResult {
  candidates: Array<{
    place_id: string;
    name: string;
    photos?: PlacePhoto[];
  }>;
  status: string;
}

interface PlaceDetailsResult {
  result: {
    name: string;
    photos?: PlacePhoto[];
  };
  status: string;
}

interface NearbySearchResult {
  results: Array<{
    place_id: string;
    name: string;
    photos?: PlacePhoto[];
  }>;
  status: string;
}

async function verifyImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

function getPhotoUrl(photoReference: string): string {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoReference}&key=${GOOGLE_API_KEY}`;
}

async function findPlacePhotos(name: string, lat: number, lng: number): Promise<{ placeId: string; photos: PlacePhoto[] } | null> {
  try {
    const cleanName = name.replace(/\(.*?\)/g, '').trim();
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

async function searchNearbyPhotos(lat: number, lng: number, keyword?: string): Promise<PlacePhoto[]> {
  try {
    const radius = 15000;
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

async function collectGalleryPhotos(
  name: string,
  lat: number,
  lng: number,
  waterwayType: string
): Promise<GalleryImage[]> {
  const photoRefs = new Set<string>();
  const gallery: GalleryImage[] = [];

  // Strategy 1: Find place directly
  const placeResult = await findPlacePhotos(name, lat, lng);
  if (placeResult) {
    const detailPhotos = await getPlaceDetails(placeResult.placeId);
    for (const photo of detailPhotos) {
      photoRefs.add(photo.photo_reference);
    }
    for (const photo of placeResult.photos) {
      photoRefs.add(photo.photo_reference);
    }
  }

  await new Promise(r => setTimeout(r, 100));

  // Strategy 2: Text search with waterway type
  if (photoRefs.size < 5) {
    const typeSearches = [
      `${name} ${waterwayType} Canada`,
      `${name} scenic`,
      `${name.split(' ')[0]} ${waterwayType}`,
    ];
    for (const search of typeSearches) {
      const photos = await textSearchPhotos(search, lat, lng);
      for (const photo of photos) {
        photoRefs.add(photo.photo_reference);
      }
      if (photoRefs.size >= 5) break;
      await new Promise(r => setTimeout(r, 100));
    }
  }

  // Strategy 3: Nearby search with nature/park keywords
  if (photoRefs.size < 5) {
    const keywords = ['park', 'nature', 'scenic', waterwayType.toLowerCase()];
    for (const keyword of keywords) {
      const photos = await searchNearbyPhotos(lat, lng, keyword);
      for (const photo of photos) {
        photoRefs.add(photo.photo_reference);
      }
      if (photoRefs.size >= 5) break;
      await new Promise(r => setTimeout(r, 100));
    }
  }

  // Strategy 4: Generic nearby
  if (photoRefs.size < 3) {
    const photos = await searchNearbyPhotos(lat, lng);
    for (const photo of photos) {
      photoRefs.add(photo.photo_reference);
    }
  }

  // Convert to gallery (limit 5)
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
  console.log('=== POPULATE GALLERY IMAGES FOR WATERWAYS ===\n');

  // Get waterway type info
  const result = await client.execute(`
    SELECT w.id, w.name, w.latitude, w.longitude, t.name as typeName
    FROM Waterway w
    LEFT JOIN WaterwayType t ON w.typeId = t.id
    ORDER BY w.name
  `);

  console.log(`Found ${result.rows.length} waterways to process\n`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < result.rows.length; i++) {
    const row = result.rows[i];
    if (!row) continue;

    const id = String(row.id);
    const name = String(row.name);
    const lat = Number(row.latitude);
    const lng = Number(row.longitude);
    const typeName = String(row.typeName || 'River');

    console.log(`[${i + 1}/${result.rows.length}] ${name} (${typeName})`);

    const gallery = await collectGalleryPhotos(name, lat, lng, typeName);

    if (gallery.length >= 3) {
      console.log(`  Found ${gallery.length} images`);

      // Set primary imageUrl from first gallery image
      const primaryImage = gallery[0]?.url || null;

      const updateResult = await client.execute({
        sql: `UPDATE Waterway SET imageUrl = ?, galleryImages = ?, updatedAt = datetime('now') WHERE id = ?`,
        args: [primaryImage, JSON.stringify(gallery), id]
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

    await new Promise(r => setTimeout(r, 200));
  }

  console.log('\n=== SUMMARY ===');
  console.log(`Successfully updated: ${successCount}`);
  console.log(`Failed (< 3 images): ${failCount}`);

  // Verify
  const verify = await client.execute('SELECT COUNT(*) as count FROM Waterway WHERE galleryImages IS NOT NULL');
  console.log(`\nWaterways with galleries in Turso: ${verify.rows[0]?.count}`);
}

main().catch(console.error);
