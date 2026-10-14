import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function checkIds() {
  // Check the ID being clicked
  const testId = "cmlijaiex000mm22rseuv61do";
  
  console.log("Checking ID:", testId);
  
  // Check Explorer table
  const explorer = await turso.execute({
    sql: "SELECT * FROM Explorer WHERE id = ?",
    args: [testId]
  });
  console.log("\nExplorer result:", explorer.rows);
  
  // Check NotableFigure table
  const figure = await turso.execute({
    sql: "SELECT * FROM NotableFigure WHERE id = ?",
    args: [testId]
  });
  console.log("\nNotableFigure result:", figure.rows);
  
  // Show some Explorer IDs
  const explorers = await turso.execute("SELECT id, name FROM Explorer LIMIT 5");
  console.log("\nSample Explorer IDs:");
  explorers.rows.forEach(row => console.log(row));
}

checkIds().catch(console.error);
