import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function findMatches() {
  const lessons = await turso.execute({
    sql: "SELECT id, title, timeline FROM LessonPlan WHERE id IN (?, ?)",
    args: ["cmliiajbw0004m2u260srsthb", "cmliib1b70005m2u2f6f7xc8g"]
  });
  
  for (const lesson of lessons.rows) {
    console.log("\n================================================");
    console.log("Lesson:", lesson.title);
    console.log("================================================");
    
    const timeline = JSON.parse(lesson.timeline as string);
    
    for (const event of timeline) {
      const matches = await turso.execute({
        sql: "SELECT id, title, year FROM TimelineEvent WHERE year = ? ORDER BY title",
        args: [event.year]
      });
      
      console.log("\n" + event.year + ": " + event.title);
      if (matches.rows.length > 0) {
        console.log("  Possible matches:");
        matches.rows.forEach(m => {
          console.log("    " + m.id + " - " + m.title);
        });
      } else {
        console.log("  No matching TimelineEvent found");
      }
    }
  }
}

findMatches().catch(console.error);
