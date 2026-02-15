import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function addIds() {
  // A Day at the Trading Post - add eventId to timeline
  const tradingPostTimeline = [
    { year: 1670, title: "HBC Charter", description: "Hudson's Bay Company receives royal charter, establishing the framework for trading post operations across the territory.", eventId: "cmligbkyo001im20zj2yavaqt" },
    { year: 1774, title: "Cumberland House", description: "First inland HBC post established, becoming a model for trading post operations.", eventId: "cmligbkz2001mm20zq12u41re" },
    { year: 1821, title: "HBC-NWC Merger", description: "Competition ends as companies merge, reorganizing trading post operations across North America.", eventId: "cmligbkzk001tm20z7riv5nwi" },
    { year: 1870, title: "Rupert's Land Transfer", description: "HBC transfers territorial rights to Canada, ending the trading post era.", eventId: "cmligbkzp001vm20zk567ec16" }
  ];

  await turso.execute({
    sql: "UPDATE LessonPlan SET timeline = ? WHERE id = ?",
    args: [JSON.stringify(tradingPostTimeline), "cmliiajbw0004m2u260srsthb"]
  });
  
  console.log("✓ Updated A Day at the Trading Post");

  // Animals of the Fur Trade - check what timeline events exist
  const animalsLesson = await turso.execute({
    sql: "SELECT timeline FROM LessonPlan WHERE id = ?",
    args: ["cmliib1b70005m2u2f6f7xc8g"]
  });
  
  console.log("\nAnimals of the Fur Trade timeline:");
  const animalsTimeline = JSON.parse(animalsLesson.rows[0].timeline as string);
  console.log(JSON.stringify(animalsTimeline, null, 2));
}

addIds().catch(console.error);
