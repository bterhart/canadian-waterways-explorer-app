import { createClient } from '@libsql/client';
const client = createClient({ url: process.env.TURSO_DATABASE_URL!, authToken: process.env.TURSO_AUTH_TOKEN! });

const fixes = [
  {
    id: "cmliiajbw0004m2u260srsthb",
    title: "A Day at the Trading Post",
    description: "Explore the daily routines, trading ceremonies, and diverse communities that made fur trade posts the crossroads of North American commerce and culture.",
    heroImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/York_Factory,_Manitoba_(2017).jpg?width=800",
    images: JSON.stringify([
      {
        url: "https://commons.wikimedia.org/wiki/Special:FilePath/Fort_William_Ontario.JPG?width=800",
        caption: "Reconstructed Fort William, showing the scale and complexity of a major fur trade post",
        credit: "Wikimedia Commons"
      }
    ])
  },
  {
    id: "cmliiajbo0001m2u2lltp5xgn",
    title: "Animals of the Fur Trade",
    description: "Discover the fur-bearing animals that drove three centuries of trade — from the beaver whose felt made European hats, to the lynx, marten, and fox that shaped an economy.",
    heroImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/American_Beaver.jpg?width=800",
    images: JSON.stringify([
      {
        url: "https://commons.wikimedia.org/wiki/Special:FilePath/Canada_lynx_by_Michael_Zahra.jpg?width=800",
        caption: "Canada lynx — population followed dramatic 10-year cycles tied to snowshoe hare numbers",
        credit: "Wikimedia Commons"
      }
    ])
  }
];

async function main() {
  console.log("=== FIXING DESCRIPTIONS AND IMAGE URLS ===\n");

  for (const f of fixes) {
    console.log(`Updating: ${f.title}`);
    const result = await client.execute({
      sql: `UPDATE LessonPlan SET description = ?, heroImageUrl = ?, images = ? WHERE id = ?`,
      args: [f.description, f.heroImageUrl, f.images, f.id]
    });
    console.log(`  Rows affected: ${result.rowsAffected}`);
  }

  console.log("\n=== VERIFYING ===\n");

  for (const f of fixes) {
    const r = await client.execute({
      sql: `SELECT title, description, heroImageUrl, images FROM LessonPlan WHERE id = ?`,
      args: [f.id]
    });
    const row = r.rows[0];
    console.log(`${row?.title}:`);
    console.log(`  description: ${row?.description}`);
    console.log(`  heroImageUrl: ${row?.heroImageUrl}`);
    console.log(`  images: ${row?.images}`);
    console.log('');
  }

  console.log("Done.");
}

main().catch(console.error);
