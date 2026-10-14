import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function update() {
  // Trading Post
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
  console.log("✓ Updated A Day at the Trading Post with eventIds");

  // Animals - keep waterwayId and add eventId
  const animalsTimeline = [
    { year: 1600, title: "European Beaver Depletion", description: "European beaver exhausted, driving North American demand" },
    { year: 1670, title: "HBC Charter", description: "Beaver trade formalized under Hudson's Bay Company", waterwayId: "cmlhaslrt001cm2zh9tknhhbe", eventId: "cmligbkyo001im20zj2yavaqt" },
    { year: 1778, title: "Athabasca Opened", description: "Peter Pond reaches richest beaver country", waterwayId: "cmlhaslrq001am2zhud0snm8t" },
    { year: 1840, title: "End of Beaver Hat Fashion", description: "Silk hats replace beaver felt, collapsing demand" }
  ];

  await turso.execute({
    sql: "UPDATE LessonPlan SET timeline = ? WHERE id = ?",
    args: [JSON.stringify(animalsTimeline), "cmliiajbo0001m2u2lltp5xgn"]
  });
  console.log("✓ Updated Animals of the Fur Trade with eventIds");
}

update().catch(console.error);
