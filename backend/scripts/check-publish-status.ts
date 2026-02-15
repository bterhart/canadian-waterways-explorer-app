import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function checkPublishStatus() {
  const result = await client.execute(`
    SELECT id, title, isPublished
    FROM LessonPlan
    ORDER BY gradeLevel, title
  `);

  console.log("=== PUBLISH STATUS ===\n");

  for (const row of result.rows) {
    console.log(`${row.title}: isPublished=${row.isPublished}`);
  }
}

checkPublishStatus().catch(console.error);
