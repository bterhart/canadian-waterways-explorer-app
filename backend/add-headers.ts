import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function update() {
  // Animals of the Fur Trade - add headers
  const animalsNarrative = `The beaver transformed world history. This industrious rodent, weighing up to 60 pounds, became the unlikely engine driving European exploration and colonization of northern North America. Its underfur possessed a unique quality: microscopic barbs that interlocked when processed into felt of unparalleled quality for hat-making. A single beaver hat might cost a skilled worker's monthly wages. As European beaver populations collapsed, merchants turned to North America's vast supply.

## Indigenous Expertise

Indigenous peoples possessed deep knowledge of beaver behavior—seasonal patterns, preferred habitats, social structures. They knew winter pelts had thicker fur and brought higher prices. This expertise made Indigenous trappers irreplaceable partners in the trade.

## Other Valuable Furs

Marten, with luxurious dark fur, was nearly as valued. These small forest predators are notoriously difficult to trap. A prime pelt traded for half a Made Beaver. Populations declined rapidly in trapped areas, pushing trappers ever deeper into the interior.

The lynx followed snowshoe hare population cycles in a dramatic ten-year boom-bust pattern. When hares thrived, lynx multiplied; when hares crashed, lynx starved. This created wildly variable fur supplies that traders had to navigate.

Foxes varied enormously in value. Common red fox brought modest prices, but silver fox—a rare color variant—could be worth twenty times more than beaver. Arctic fox, pure white in winter, came from the far north. Muskrat were individually cheap but traded in enormous quantities. Bear skins became blankets, coats, and rugs.

## Environmental Impact

The environmental impact was profound. Beaver populations crashed across eastern North America by 1700, driving the trade westward. Removing beavers didn't just mean fewer animals—their dam-building creates wetland ecosystems supporting countless species. Losing beavers transformed entire landscapes.

Traditional Indigenous harvesting, regulated by cultural practices ensuring sustainability, gave way to maximum extraction under commercial pressure. The lesson remains relevant: even seemingly inexhaustible wildlife populations can collapse under relentless commercial demand.`;

  await turso.execute({
    sql: "UPDATE LessonPlan SET narrativeContent = ? WHERE id = ?",
    args: [animalsNarrative, "cmliiajbo0001m2u2lltp5xgn"]
  });
  console.log("✓ Updated Animals of the Fur Trade with headers");

  // A Day at the Trading Post - add headers
  const tradingPostNarrative = `The morning cannon boomed across Hudson Bay, signaling another day at York Factory—the Hudson's Bay Company's most important trading post. Inside the wooden palisades, the fur trade stirred to life. Indigenous traders arrived with canoes laden with beaver pelts. Voyageurs unloaded freight. Clerks hurried between buildings with ledgers. Woodsmoke and tobacco hung in the air.

## The Factor's Authority

The Factor—the post's chief officer—emerged from the Big House to meet his officers. Together they reviewed yesterday's trades and planned the day. His authority was absolute for hundreds of miles in every direction.

## The Trading Ceremony

Trading was ceremony as much as commerce. When Cree hunters arrived with furs, clerks didn't haggle immediately. First came tea and tobacco, news from the interior, questions about family and game. Only after these rituals did the clerk examine pelts and calculate value in "Made Beaver"—the trade's currency where one prime beaver pelt was the standard unit. A gun cost twelve Made Beaver, blankets six each, a pound of tobacco two.

These weren't cold transactions. Indigenous traders expected respect and fair dealing. The Company wanted them returning next season. Credit was extended, gifts exchanged, disputes resolved through diplomacy rather than confrontation.

## Daily Life at the Post

While clerks traded, other work filled the post. Coopers built barrels for shipping furs to England. Blacksmiths repaired guns. Carpenters mended buildings. Women's contributions proved equally vital though rarely recorded—Indigenous and Metis women prepared food, made clothing, tanned hides, crafted snowshoes, and served as interpreters and diplomats.

The post's gardens demanded constant attention during the brief growing season. Supplies arrived only once yearly by ship from England. Summer afternoons might see everyone mobilized to unload that ship. Other seasons meant preparing for winter: cutting vast quantities of firewood, preserving food, repairing buildings.

## Day's End

As evening approached, furs were counted and locked away. The evening cannon fired at sunset. Guards locked the gates. This cycle repeated year after year, binding Indigenous peoples, European servants, and London merchants in the web of exchange that shaped northern North America.`;

  await turso.execute({
    sql: "UPDATE LessonPlan SET narrativeContent = ? WHERE id = ?",
    args: [tradingPostNarrative, "cmliiajbw0004m2u260srsthb"]
  });
  console.log("✓ Updated A Day at the Trading Post with headers");
}

update().catch(console.error);
