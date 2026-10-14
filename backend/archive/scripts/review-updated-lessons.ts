import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function reviewLessons() {
  const ids = [
    'cmliiajbw0004m2u260srsthb', // A Day at the Trading Post
    'cmliiajbo0001m2u2lltp5xgn'  // Animals of the Fur Trade
  ];

  for (const id of ids) {
    const result = await client.execute({
      sql: `SELECT title, narrativeContent, mainContent, heroImageUrl, images FROM LessonPlan WHERE id = ?`,
      args: [id]
    });

    const lesson = result.rows[0];
    if (!lesson) {
      console.log(`Lesson ${id} not found\n`);
      continue;
    }

    console.log("=".repeat(80));
    console.log(`LESSON: ${lesson.title}`);
    console.log("=".repeat(80));

    console.log("\n--- HERO IMAGE ---");
    console.log(lesson.heroImageUrl || "NONE");

    console.log("\n--- GENERAL USER NARRATIVE (narrativeContent) ---");
    console.log(`Length: ${lesson.narrativeContent ? String(lesson.narrativeContent).length : 0} characters`);
    console.log(`Word count: ~${lesson.narrativeContent ? String(lesson.narrativeContent).split(/\s+/).length : 0} words`);
    console.log("\nFull text:");
    console.log(lesson.narrativeContent);

    console.log("\n--- TEACHER CONTENT (mainContent) ---");
    console.log(`Length: ${lesson.mainContent ? String(lesson.mainContent).length : 0} characters`);
    console.log(`Word count: ~${lesson.mainContent ? String(lesson.mainContent).split(/\s+/).length : 0} words`);
    console.log("\nFull text:");
    console.log(lesson.mainContent);

    console.log("\n--- CONTENT IMAGES ---");
    if (lesson.images) {
      const imageArray = JSON.parse(String(lesson.images));
      console.log(JSON.stringify(imageArray, null, 2));
    } else {
      console.log("NONE");
    }

    console.log("\n\n");
  }
}

reviewLessons().catch(console.error);
