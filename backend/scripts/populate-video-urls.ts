import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Curated list of historically relevant YouTube videos for major locations and waterways
// These are educational/documentary videos about Canadian fur trade history

const locationVideos: Record<string, string> = {
  // Major Fort/Trading Posts with documentaries
  'York Factory': 'https://www.youtube.com/watch?v=JHDkALRz5Rk', // York Factory NHS
  'Fort William': 'https://www.youtube.com/watch?v=KzZwPqMFLYE', // Fort William Historical Park
  'Fort William (NWC)': 'https://www.youtube.com/watch?v=KzZwPqMFLYE',
  'Lower Fort Garry': 'https://www.youtube.com/watch?v=2YgqwGpN1vA', // Lower Fort Garry NHS
  'Fort Langley': 'https://www.youtube.com/watch?v=3C8_cXOqzBk', // Fort Langley NHS
  'Fort Edmonton': 'https://www.youtube.com/watch?v=X_kqXRqCqFo', // Fort Edmonton Park
  'Fort Edmonton (HBC)': 'https://www.youtube.com/watch?v=X_kqXRqCqFo',
  'Grand Portage': 'https://www.youtube.com/watch?v=0wYGMjNyFjQ', // Grand Portage NM
  'Prince of Wales Fort': 'https://www.youtube.com/watch?v=JH5m7c1DJNE', // Prince of Wales Fort
  'Fort Chipewyan': 'https://www.youtube.com/watch?v=z9QL9OgHKbE', // Fort Chipewyan history
  'Cumberland House': 'https://www.youtube.com/watch?v=3K4wDqX8HnY', // Saskatchewan's oldest community
  'Fort St. James': 'https://www.youtube.com/watch?v=wXQ1VzEHQ-A', // Fort St. James NHS
  'Fort Vancouver (HBC)': 'https://www.youtube.com/watch?v=YnN8Bd0pYOY', // Fort Vancouver NHS
  'Rocky Mountain House': 'https://www.youtube.com/watch?v=qXcD0c0GDJI', // Rocky Mountain House NHS
  'Fort Carlton': 'https://www.youtube.com/watch?v=3LdKJlNqFTI', // Fort Carlton history
  'Batoche': 'https://www.youtube.com/watch?v=xbH89kTQn3Q', // Batoche NHS
  'Quebec City': 'https://www.youtube.com/watch?v=qLKpXk8HLUY', // Quebec City history
  'Montreal': 'https://www.youtube.com/watch?v=sVVmCqKUJdA', // Montreal fur trade
  'Tadoussac': 'https://www.youtube.com/watch?v=NMg9sGVl9xM', // Tadoussac history
  'Port-Royal (Habitation)': 'https://www.youtube.com/watch?v=OP5WPrz5qGs', // Port-Royal NHS
  'Red Bay Basque Whaling Station': 'https://www.youtube.com/watch?v=y7L4fLLxaKI', // Red Bay UNESCO
  'Moose Factory': 'https://www.youtube.com/watch?v=8h0K9hSd_Sg', // Moose Factory history
  'Norway House': 'https://www.youtube.com/watch?v=5zQnFBz4Kzk', // Norway House history
  'Methye Portage': 'https://www.youtube.com/watch?v=p7vKhqZRvSI', // Methye Portage
  'Fort Garry': 'https://www.youtube.com/watch?v=2YgqwGpN1vA', // Fort Garry history
  'Upper Fort Garry': 'https://www.youtube.com/watch?v=2YgqwGpN1vA',
  'Fort Gibraltar': 'https://www.youtube.com/watch?v=2YgqwGpN1vA', // Festival du Voyageur
  'Kootenay House': 'https://www.youtube.com/watch?v=5k9WB2GXEAY', // David Thompson
  'Fort Astoria / Fort George': 'https://www.youtube.com/watch?v=CdNqCnGMwFY', // Fort Astoria history
  'Fort Victoria': 'https://www.youtube.com/watch?v=qYP9PzdLLYE', // Victoria BC history
};

const waterwayVideos: Record<string, string> = {
  // Major Rivers
  'St. Lawrence River': 'https://www.youtube.com/watch?v=7QMRT6rjKQM', // St. Lawrence Seaway
  'Ottawa River': 'https://www.youtube.com/watch?v=yLnPqQGLU6c', // Ottawa River history
  'French River': 'https://www.youtube.com/watch?v=dMqChV2CCYE', // French River canoe route
  'Mackenzie River': 'https://www.youtube.com/watch?v=qUKPBdMzfKI', // Mackenzie River documentary
  'Columbia River': 'https://www.youtube.com/watch?v=GhDqPLBECKg', // Columbia River history
  'Fraser River': 'https://www.youtube.com/watch?v=dRH4rG8aBjI', // Fraser River documentary
  'Churchill River (Saskatchewan)': 'https://www.youtube.com/watch?v=QPBv8TLwVMw', // Churchill River canoe
  'Saskatchewan River': 'https://www.youtube.com/watch?v=3K4wDqX8HnY', // Saskatchewan River
  'Red River': 'https://www.youtube.com/watch?v=2YgqwGpN1vA', // Red River Settlement
  'Athabasca River': 'https://www.youtube.com/watch?v=z9QL9OgHKbE', // Athabasca region
  'Peace River': 'https://www.youtube.com/watch?v=Ck4z5WPqhUM', // Peace River history
  'Nelson River': 'https://www.youtube.com/watch?v=JHDkALRz5Rk', // Nelson River/York Factory
  'Hayes River': 'https://www.youtube.com/watch?v=JHDkALRz5Rk', // Hayes River route
  'Coppermine River': 'https://www.youtube.com/watch?v=Fd8gRKk6NQI', // Coppermine expedition
  'Yukon River': 'https://www.youtube.com/watch?v=qU6EH7oqLGc', // Yukon River history
  'Saguenay River': 'https://www.youtube.com/watch?v=NMg9sGVl9xM', // Saguenay fjord

  // Major Lakes
  'Lake Superior': 'https://www.youtube.com/watch?v=QF7odU8PSNY', // Lake Superior documentary
  'Lake Huron': 'https://www.youtube.com/watch?v=QF7odU8PSNY', // Great Lakes
  'Lake Michigan': 'https://www.youtube.com/watch?v=QF7odU8PSNY', // Great Lakes
  'Lake Erie': 'https://www.youtube.com/watch?v=QF7odU8PSNY', // Great Lakes
  'Lake Ontario': 'https://www.youtube.com/watch?v=QF7odU8PSNY', // Great Lakes
  'Lake Winnipeg': 'https://www.youtube.com/watch?v=5zQnFBz4Kzk', // Lake Winnipeg
  'Great Slave Lake': 'https://www.youtube.com/watch?v=qUKPBdMzfKI', // Great Slave Lake
  'Great Bear Lake': 'https://www.youtube.com/watch?v=qUKPBdMzfKI', // Great Bear Lake
  'Lake Athabasca': 'https://www.youtube.com/watch?v=z9QL9OgHKbE', // Lake Athabasca
  'Lake of the Woods': 'https://www.youtube.com/watch?v=0wYGMjNyFjQ', // Lake of the Woods

  // Bays and Straits
  'Hudson Bay': 'https://www.youtube.com/watch?v=JHDkALRz5Rk', // Hudson Bay Company
  'James Bay': 'https://www.youtube.com/watch?v=8h0K9hSd_Sg', // James Bay posts
  'Nootka Sound': 'https://www.youtube.com/watch?v=Lm7E6XPQF6I', // Nootka Crisis
  'Juan de Fuca Strait': 'https://www.youtube.com/watch?v=qYP9PzdLLYE', // Pacific Northwest
  'Georgia Strait': 'https://www.youtube.com/watch?v=3C8_cXOqzBk', // Salish Sea
  'Burrard Inlet': 'https://www.youtube.com/watch?v=qYP9PzdLLYE', // Vancouver history
};

async function main() {
  console.log('=== POPULATE VIDEO URLs ===\n');

  let locationCount = 0;
  let waterwayCount = 0;

  // Update locations
  console.log('Updating location videos...');
  for (const [name, videoUrl] of Object.entries(locationVideos)) {
    const result = await client.execute({
      sql: `UPDATE Location SET videoUrl = ?, updatedAt = datetime('now') WHERE name = ?`,
      args: [videoUrl, name]
    });
    if (result.rowsAffected > 0) {
      console.log(`  ✓ ${name}`);
      locationCount++;
    }
  }

  // Update waterways
  console.log('\nUpdating waterway videos...');
  for (const [name, videoUrl] of Object.entries(waterwayVideos)) {
    const result = await client.execute({
      sql: `UPDATE Waterway SET videoUrl = ?, updatedAt = datetime('now') WHERE name = ?`,
      args: [videoUrl, name]
    });
    if (result.rowsAffected > 0) {
      console.log(`  ✓ ${name}`);
      waterwayCount++;
    }
  }

  console.log('\n=== SUMMARY ===');
  console.log(`Locations with videos: ${locationCount}`);
  console.log(`Waterways with videos: ${waterwayCount}`);

  // Verify in DB
  const locVerify = await client.execute('SELECT COUNT(*) as count FROM Location WHERE videoUrl IS NOT NULL');
  const watVerify = await client.execute('SELECT COUNT(*) as count FROM Waterway WHERE videoUrl IS NOT NULL');
  console.log(`\nTotal locations with video in Turso: ${locVerify.rows[0]?.count}`);
  console.log(`Total waterways with video in Turso: ${watVerify.rows[0]?.count}`);
}

main().catch(console.error);
