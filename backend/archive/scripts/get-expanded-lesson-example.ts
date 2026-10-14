import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function getExample() {
  const result = await client.execute({
    sql: `SELECT * FROM LessonPlan WHERE id = ?`,
    args: ['cmliiajcq000am2u2h58ck1el'] // Red River Cart
  });

  const lesson = result.rows[0];

  if (!lesson) {
    console.log("Lesson not found");
    return;
  }

  console.log("=== RED RIVER CART LESSON STRUCTURE ===\n");
  console.log("GENERAL USER FIELDS:");
  console.log(`- narrativeContent length: ${lesson.narrativeContent ? String(lesson.narrativeContent).length : 0}`);
  console.log(`- keyFigures: ${lesson.keyFigures ? 'YES' : 'NO'}`);
  console.log(`- timeline: ${lesson.timeline ? 'YES' : 'NO'}`);
  console.log(`- images: ${lesson.images ? 'YES' : 'NO'}`);
  console.log(`- heroImageUrl: ${lesson.heroImageUrl || 'NO'}`);

  console.log("\nTEACHER FIELDS:");
  console.log(`- mainContent length: ${lesson.mainContent ? String(lesson.mainContent).length : 0}`);
  console.log(`- objectives: ${lesson.objectives ? 'YES' : 'NO'}`);
  console.log(`- materials: ${lesson.materials ? 'YES' : 'NO'}`);
  console.log(`- activities: ${lesson.activities ? 'YES' : 'NO'}`);
  console.log(`- discussionQuestions: ${lesson.discussionQuestions ? 'YES' : 'NO'}`);
  console.log(`- assessment: ${lesson.assessment ? 'YES' : 'NO'}`);
  console.log(`- extensions: ${lesson.extensions ? 'YES' : 'NO'}`);
  console.log(`- curriculumConnections: ${lesson.curriculumConnections ? 'YES' : 'NO'}`);

  if (lesson.mainContent) {
    console.log("\n--- Teacher mainContent Preview (first 500 chars) ---");
    console.log(String(lesson.mainContent).substring(0, 500));
  }
}

getExample().catch(console.error);
