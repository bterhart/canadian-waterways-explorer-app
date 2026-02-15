import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function checkContentDepth() {
  const result = await client.execute(`
    SELECT id, title, gradeLevel, topic,
           mainContent, objectives, materials,
           activities, discussionQuestions, curriculumConnections
    FROM LessonPlan
    ORDER BY gradeLevel, title
  `);

  console.log("=== CONTENT DEPTH ANALYSIS ===\n");

  const needsContent: any[] = [];

  for (const row of result.rows) {
    const mainContentLength = row.mainContent ? String(row.mainContent).length : 0;
    const objectives = row.objectives ? JSON.parse(String(row.objectives)) : [];
    const materials = row.materials ? JSON.parse(String(row.materials)) : [];
    const activities = row.activities ? JSON.parse(String(row.activities)) : [];
    const discussionQuestions = row.discussionQuestions ? JSON.parse(String(row.discussionQuestions)) : [];
    const curriculumConnections = row.curriculumConnections ? JSON.parse(String(row.curriculumConnections)) : [];

    const issues: string[] = [];

    if (mainContentLength < 500) {
      issues.push(`mainContent too short (${mainContentLength} chars, need 500+)`);
    }
    if (objectives.length < 3) {
      issues.push(`objectives too few (${objectives.length}, need 3-5)`);
    }
    if (materials.length < 4) {
      issues.push(`materials too few (${materials.length}, need 4-6)`);
    }
    if (activities.length < 3) {
      issues.push(`activities too few (${activities.length}, need 3-5)`);
    }
    if (discussionQuestions.length < 4) {
      issues.push(`discussionQuestions too few (${discussionQuestions.length}, need 4-6)`);
    }
    if (curriculumConnections.length < 2) {
      issues.push(`curriculumConnections too few (${curriculumConnections.length}, need 2-3)`);
    }

    if (issues.length > 0) {
      needsContent.push({
        id: row.id,
        title: row.title,
        grade: row.gradeLevel,
        topic: row.topic,
        issues
      });
    }

    console.log(`\n--- ${row.title} (${row.gradeLevel}) ---`);
    console.log(`  mainContent: ${mainContentLength} chars`);
    console.log(`  objectives: ${objectives.length} items`);
    console.log(`  materials: ${materials.length} items`);
    console.log(`  activities: ${activities.length} items`);
    console.log(`  discussionQuestions: ${discussionQuestions.length} items`);
    console.log(`  curriculumConnections: ${curriculumConnections.length} items`);
    if (issues.length > 0) {
      console.log(`  NEEDS: ${issues.join(', ')}`);
    }
  }

  console.log("\n\n=== LESSONS NEEDING CONTENT ===");
  console.log(JSON.stringify(needsContent, null, 2));
}

checkContentDepth().catch(console.error);
