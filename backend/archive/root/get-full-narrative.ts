import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function get() {
  const lessons = await turso.execute({
    sql: "SELECT id, title, narrativeContent FROM LessonPlan WHERE id IN (?, ?)",
    args: ["cmliiajbw0004m2u260srsthb", "cmliiajbo0001m2u2lltp5xgn"]
  });
  
  for (const lesson of lessons.rows) {
    console.log("\n" + "=".repeat(70));
    console.log(lesson.title);
    console.log("=".repeat(70));
    console.log(lesson.narrativeContent);
    console.log("\n");
  }
}

get().catch(console.error);
