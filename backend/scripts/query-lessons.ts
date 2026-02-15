import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function queryLessonPlans() {
  const result = await client.execute(`
    SELECT id, title, gradeLevel, topic,
           mainContent, objectives, materials,
           activities, discussionQuestions, curriculumConnections
    FROM LessonPlan
    ORDER BY gradeLevel, title
  `);

  console.log("=== ALL LESSON PLANS ===\n");

  for (const row of result.rows) {
    console.log(`\n--- ${row.title} ---`);
    console.log(`ID: ${row.id}`);
    console.log(`Grade: ${row.gradeLevel}`);
    console.log(`Topic: ${row.topic}`);
    console.log(`mainContent length: ${row.mainContent ? String(row.mainContent).length : 0}`);
    console.log(`objectives: ${row.objectives ? 'YES' : 'NO'}`);
    console.log(`materials: ${row.materials ? 'YES' : 'NO'}`);
    console.log(`activities: ${row.activities ? 'YES' : 'NO'}`);
    console.log(`discussionQuestions: ${row.discussionQuestions ? 'YES' : 'NO'}`);
    console.log(`curriculumConnections: ${row.curriculumConnections ? 'YES' : 'NO'}`);
  }

  console.log("\n\n=== TOTAL: " + result.rows.length + " lesson plans ===");
}

queryLessonPlans().catch(console.error);
