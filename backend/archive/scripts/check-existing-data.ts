import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function checkData() {
  // 1. Check explorers (key figures)
  console.log("=== EXPLORERS (Key Figures) ===");
  const explorers = await client.execute(`SELECT id, name, birthYear, deathYear, nationality FROM Explorer ORDER BY name`);
  for (const row of explorers.rows) {
    console.log(`  ${row.name} (${row.birthYear}-${row.deathYear}) [ID: ${row.id}]`);
  }

  // 2. Check cartographers
  console.log("\n=== CARTOGRAPHERS ===");
  const carts = await client.execute(`SELECT id, name, birthYear, deathYear FROM Cartographer ORDER BY name`);
  for (const row of carts.rows) {
    console.log(`  ${row.name} (${row.birthYear}-${row.deathYear}) [ID: ${row.id}]`);
  }

  // 3. Check Indigenous nations
  console.log("\n=== INDIGENOUS NATIONS ===");
  const nations = await client.execute(`SELECT id, name FROM IndigenousNation ORDER BY name`);
  for (const row of nations.rows) {
    console.log(`  ${row.name} [ID: ${row.id}]`);
  }

  // 4. Check locations (with images)
  console.log("\n=== LOCATIONS WITH IMAGES (Virtual Tour format) ===");
  const locations = await client.execute(`SELECT id, name, imageUrl FROM Location WHERE imageUrl IS NOT NULL LIMIT 10`);
  for (const row of locations.rows) {
    console.log(`  ${row.name}: ${row.imageUrl}`);
  }

  // 5. Check existing keyFigures and timeline format from expanded lessons
  console.log("\n=== EXISTING KEY FIGURES FORMAT (from Red River Cart) ===");
  const rrc = await client.execute({
    sql: `SELECT keyFigures, timeline FROM LessonPlan WHERE id = ?`,
    args: ['cmliiajcq000am2u2h58ck1el']
  });
  if (rrc.rows[0]) {
    console.log("keyFigures:", String(rrc.rows[0].keyFigures).substring(0, 500));
    console.log("\ntimeline:", String(rrc.rows[0].timeline).substring(0, 500));
  }

  // 6. Check waterways
  console.log("\n=== WATERWAYS ===");
  const waterways = await client.execute(`SELECT id, name FROM Waterway ORDER BY name`);
  for (const row of waterways.rows) {
    console.log(`  ${row.name} [ID: ${row.id}]`);
  }

  // 7. Check fur trade info
  console.log("\n=== FUR TRADE INFO ===");
  const furTrade = await client.execute(`SELECT id, tradingCompany, peakTradePeriod FROM FurTradeInfo`);
  for (const row of furTrade.rows) {
    console.log(`  ${row.tradingCompany} (${row.peakTradePeriod}) [ID: ${row.id}]`);
  }
}

checkData().catch(console.error);
