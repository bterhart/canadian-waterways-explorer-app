import { createClient } from "@libsql/client";
import Database from "bun:sqlite";

// Connect to local SQLite
const localDb = new Database("./prisma/dev.db", { readonly: true });

// Connect to Turso
const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Tables to migrate in order (respecting foreign key constraints)
const tables = [
  "WaterwayType",
  "Waterway",
  "Cartographer",
  "Location",
  "Explorer",
  "ExplorerWaterway",
  "FurTradeInfo",
  "IndigenousNation",
  "UserContribution",
  "AdminUser",
  "ArchaeologicalDiscovery",
  "Quiz",
  "QuizQuestion",
  "QuizAttempt",
  "LessonPlan",
  "TimelineEvent",
  "VirtualFieldTrip",
  "FieldTripStop",
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
];

async function migrateData() {
  console.log("Starting data migration from local SQLite to Turso...\n");

  let totalRows = 0;

  for (const table of tables) {
    try {
      // Get all rows from local database
      const rows = localDb.query(`SELECT * FROM "${table}"`).all() as Record<string, unknown>[];

      if (rows.length === 0) {
        console.log(`⊘ ${table}: 0 rows (empty)`);
        continue;
      }

      // Get column names from first row
      const firstRow = rows[0];
      if (!firstRow) continue;
      const columns = Object.keys(firstRow);

      // Insert each row into Turso
      let insertedCount = 0;
      for (const row of rows) {
        const values = columns.map(col => row[col]);
        const placeholders = columns.map(() => "?").join(", ");
        const columnList = columns.map(c => `"${c}"`).join(", ");

        try {
          await turso.execute({
            sql: `INSERT INTO "${table}" (${columnList}) VALUES (${placeholders})`,
            args: values as any[],
          });
          insertedCount++;
        } catch (error: any) {
          // Skip duplicate key errors (data already migrated)
          if (!error.message?.includes("UNIQUE constraint failed") &&
              !error.message?.includes("PRIMARY KEY constraint failed")) {
            console.error(`  Error inserting into ${table}:`, error.message);
          }
        }
      }

      if (insertedCount > 0) {
        console.log(`✓ ${table}: ${insertedCount}/${rows.length} rows migrated`);
        totalRows += insertedCount;
      } else {
        console.log(`⊘ ${table}: ${rows.length} rows (already exists)`);
      }
    } catch (error: any) {
      // Table might not exist in local DB
      if (error.message?.includes("no such table")) {
        console.log(`⊘ ${table}: table not in local DB`);
      } else {
        console.error(`✗ ${table}: ${error.message}`);
      }
    }
  }

  console.log(`\n✅ Migration complete! Total rows migrated: ${totalRows}`);
  localDb.close();
}

migrateData().catch(console.error);
