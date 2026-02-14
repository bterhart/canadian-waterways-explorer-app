import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { execSync } from "child_process";

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL!;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN!;

async function migrateToTurso() {
  console.log("Creating Turso client...");
  const turso = createClient({
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN,
  });

  // Get schema from local SQLite
  console.log("Exporting schema from local SQLite...");
  const schema = execSync("sqlite3 prisma/dev.db '.schema'", { encoding: "utf-8" });

  // Split into individual statements
  const statements: string[] = schema
    .split(";")
    .map((s) => s.trim())
    .filter((s): s is string => s.length > 0)
    .map((s) => s + ";");

  console.log(`Found ${statements.length} statements to execute...`);

  // Execute each statement
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    if (!stmt) continue;
    try {
      await turso.execute(stmt);
      console.log(`[${i + 1}/${statements.length}] OK`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      // Ignore "table already exists" errors
      if (errorMessage.includes("already exists")) {
        console.log(`[${i + 1}/${statements.length}] Skipped (already exists)`);
      } else {
        console.error(`[${i + 1}/${statements.length}] Error:`, errorMessage);
        console.error("Statement:", stmt.substring(0, 100));
      }
    }
  }

  console.log("\nSchema migration complete!");

  // Now migrate the data
  console.log("\n--- Migrating Data ---\n");

  // Get list of tables
  const tables = [
    "WaterwayType",
    "Waterway",
    "Location",
    "Explorer",
    "ExplorerWaterway",
    "FurTradeInfo",
    "Cartographer",
    "IndigenousNation",
    "UserContribution",
    "ArchaeologicalDiscovery",
    "Quiz",
    "QuizQuestion",
    "QuizAttempt",
    "TimelineEvent",
    "VirtualFieldTrip",
    "FieldTripStop",
    "LessonPlan",
    "PrimarySourceDocument",
    "ComparisonTemplate",
    "StudentJournal",
    "JournalEntry",
    "SavedLocation",
    "Teacher",
    "Class",
    "ClassStudent",
    "ClassAssignment",
    "StudentProgress",
    "PrintableResource",
    "PronunciationGuide",
    "IndigenousWord",
    "WordOfTheDay",
    "VocabularyQuiz",
    "IndigenousStory",
    "Achievement",
    "UserAchievement",
    "UserProgress",
    "DailyChallenge",
    "DailyChallengeAttempt",
    "VoyageurJourney",
    "JourneyNode",
    "UserJourneyProgress",
    "HistoricalEvent",
    "UserMapAnnotation",
    "MapPin",
    "MapRoute",
    "MapNote",
    "NotableFigure",
    "AdminUser",
  ];

  for (const table of tables) {
    try {
      // Get data from local SQLite
      const jsonData = execSync(`sqlite3 -json prisma/dev.db "SELECT * FROM ${table}"`, {
        encoding: "utf-8",
      });

      const rows = JSON.parse(jsonData || "[]");
      if (rows.length === 0) {
        console.log(`${table}: No data`);
        continue;
      }

      console.log(`${table}: Migrating ${rows.length} rows...`);

      // Insert each row
      for (const row of rows) {
        const columns = Object.keys(row);
        const values = columns.map((c) => row[c]);
        const placeholders = columns.map(() => "?").join(", ");

        const insertSql = `INSERT OR REPLACE INTO "${table}" (${columns.map((c) => `"${c}"`).join(", ")}) VALUES (${placeholders})`;

        try {
          await turso.execute({
            sql: insertSql,
            args: values,
          });
        } catch (err: any) {
          console.error(`  Error inserting into ${table}:`, err.message);
        }
      }
      console.log(`${table}: Done`);
    } catch (error: any) {
      if (error.message?.includes("no such table")) {
        console.log(`${table}: Table does not exist locally`);
      } else {
        console.error(`${table}: Error - ${error.message}`);
      }
    }
  }

  console.log("\n--- Migration Complete ---");
  turso.close();
}

migrateToTurso().catch(console.error);
