import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function checkStructure() {
  // Get a lesson with timeline data
  const lesson = await turso.execute({
    sql: "SELECT id, title, timeline FROM LessonPlan WHERE timeline IS NOT NULL LIMIT 1",
    args: []
  });
  
  if (lesson.rows.length > 0) {
    const row = lesson.rows[0];
    console.log("Lesson:", row.title);
    console.log("\nTimeline JSON:");
    const timeline = JSON.parse(row.timeline as string);
    console.log(JSON.stringify(timeline, null, 2));
    
    // Check a TimelineEvent record structure
    console.log("\n\nSample TimelineEvent from database:");
    const event = await turso.execute("SELECT * FROM TimelineEvent LIMIT 1");
    console.log(event.rows[0]);
  }
}

checkStructure().catch(console.error);
