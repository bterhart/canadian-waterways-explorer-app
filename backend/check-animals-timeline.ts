import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function check() {
  const lesson = await turso.execute({
    sql: "SELECT id, title, timeline FROM LessonPlan WHERE title LIKE '%Animals%'",
    args: []
  });
  
  console.log("Found lessons:", lesson.rows.length);
  lesson.rows.forEach(row => {
    console.log("\nID:", row.id);
    console.log("Title:", row.title);
    console.log("Has timeline:", !!row.timeline);
    if (row.timeline) {
      console.log("Timeline:", JSON.parse(row.timeline as string));
    }
  });
}

check().catch(console.error);
