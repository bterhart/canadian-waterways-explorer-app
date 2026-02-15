import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function check() {
  const lessons = await turso.execute({
    sql: "SELECT id, title, narrativeContent FROM LessonPlan WHERE id IN (?, ?)",
    args: ["cmliiajbw0004m2u260srsthb", "cmliiajbo0001m2u2lltp5xgn"]
  });
  
  for (const lesson of lessons.rows) {
    console.log("\n" + "=".repeat(60));
    console.log(lesson.title);
    console.log("=".repeat(60));
    console.log("\nFirst 500 characters:");
    console.log(lesson.narrativeContent?.toString().substring(0, 500));
    console.log("\n...\n");
  }
}

check().catch(console.error);
