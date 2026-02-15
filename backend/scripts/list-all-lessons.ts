import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function listAllLessons() {
  const result = await client.execute(`
    SELECT id, title,
           CASE WHEN narrativeContent IS NOT NULL THEN 'EXPANDED' ELSE 'BASIC' END as status,
           heroImageUrl
    FROM LessonPlan
    ORDER BY title
  `);

  console.log("=== ALL LESSON PLANS ===\n");

  let expanded = 0;
  let basic = 0;

  for (const row of result.rows) {
    console.log(`${row.status === 'EXPANDED' ? '✓' : '○'} ${row.title}`);
    console.log(`  ID: ${row.id}`);
    console.log(`  Hero Image: ${row.heroImageUrl || 'MISSING'}`);
    console.log('');

    if (row.status === 'EXPANDED') expanded++;
    else basic++;
  }

  console.log(`\nTotal: ${result.rows.length} lessons`);
  console.log(`Expanded: ${expanded}`);
  console.log(`Basic: ${basic}`);
}

listAllLessons().catch(console.error);
