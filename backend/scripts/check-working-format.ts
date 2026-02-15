import { createClient } from '@libsql/client';
const client = createClient({ url: process.env.TURSO_DATABASE_URL!, authToken: process.env.TURSO_AUTH_TOKEN! });
async function main() {
  // Check Red River Cart (known working)
  const r = await client.execute({ sql: `SELECT keyFigures, timeline, images, curriculumConnections, objectives, materials, activities, discussionQuestions, assessment, extensions FROM LessonPlan WHERE id = ?`, args: ['cmliiajcq000am2u2h58ck1el'] });
  const row = r.rows[0];
  if (!row) { console.log("Not found"); return; }

  console.log("=== RED RIVER CART (WORKING) ===\n");
  console.log("keyFigures:", String(row.keyFigures).substring(0, 300));
  console.log("\ntimeline:", String(row.timeline).substring(0, 300));
  console.log("\nimages:", String(row.images).substring(0, 300));
  console.log("\ncurriculumConnections:", String(row.curriculumConnections).substring(0, 500));
  console.log("\nobjectives:", String(row.objectives).substring(0, 300));
  console.log("\nmaterials:", String(row.materials).substring(0, 300));
  console.log("\nactivities:", String(row.activities).substring(0, 300));
  console.log("\ndiscussionQuestions:", String(row.discussionQuestions).substring(0, 300));
  console.log("\nassessment:", String(row.assessment).substring(0, 300));
  console.log("\nextensions:", String(row.extensions).substring(0, 300));
}
main().catch(console.error);
