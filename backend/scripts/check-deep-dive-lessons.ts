import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function checkDeepDives() {
  const result = await client.execute(`
    SELECT id, title, heroImageUrl,
           CASE WHEN narrativeContent IS NOT NULL THEN 'YES' ELSE 'NO' END as hasNarrative
    FROM LessonPlan
    WHERE narrativeContent IS NOT NULL
    ORDER BY title
  `);

  console.log("=== DEEP DIVE LESSONS ===\n");

  for (const row of result.rows) {
    console.log(`Title: ${row.title}`);
    console.log(`ID: ${row.id}`);
    console.log(`Has Narrative: ${row.hasNarrative}`);
    console.log(`Hero Image URL: ${row.heroImageUrl || 'NULL'}`);
    console.log('---');
  }

  console.log(`\nTotal Deep Dive lessons: ${result.rows.length}`);
}

checkDeepDives().catch(console.error);
