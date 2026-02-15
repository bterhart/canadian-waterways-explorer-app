import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Only updating mainContent for both lessons

const updates = [
  {
    id: "cmliiajbw0004m2u260srsthb",
    title: "A Day at the Trading Post",
    mainContent: `## Life at a Fur Trade Post: Teacher Resource

### Physical Layout
Trading posts were fortified, self-sufficient communities built for survival in remote locations. Key structures included defensive wooden palisades with watchtowers at corners; the Big House serving as the Factor's residence and administrative center; the Trade Shop with a counter separating Company goods from visiting traders; secure fur warehouses kept locked with the Factor holding keys; workshops including blacksmith forge, cooperage for barrel-making, and carpentry shop; servants' quarters ranging from bunkhouses for single men to small houses for families; and garden plots and livestock areas essential for supplementing food supplies during the brief growing season.

Posts were always positioned near navigable water—rivers or lakes—for transportation access. The physical layout reflected the social hierarchy: officers' quarters near the Big House, laborers further away, and Indigenous camps outside the palisades.

### People and Their Roles
**The Factor** held absolute authority as the HBC representative. Responsible for the post's profitability, all Indigenous trade relationships, employee discipline and management, and producing detailed annual reports sent to the London Committee. Usually Scottish, educated, from merchant backgrounds. Served multi-year terms in remote locations far from family and home.

**Clerks and Officers** formed the administrative backbone. They maintained financial records in the Company's double-entry bookkeeping system, conducted daily trading sessions, learned Indigenous languages (many became fluent in Cree, Ojibwe, or other languages), and kept personal journals that now provide our richest historical records of post operations and daily life.

**Skilled Tradesmen** included blacksmiths who repaired firearms, manufactured and sharpened tools, and created iron hardware; coopers who built watertight barrels for shipping furs to England; carpenters who constructed and maintained all buildings; and boat builders who kept canoes and York boats in working order. Most were recruited from Scotland's Orkney Islands, chosen for their reliability and ability to endure harsh conditions.

**Common Laborers** performed the heaviest physical work: loading and unloading goods from canoes and ships, building and ground maintenance, hunting and fishing for food, and cutting enormous quantities of firewood for heating through long winters. They endured the hardest conditions for the lowest pay.

**Indigenous and Metis Women** contributed vitally despite near-absence from official Company records. Their work included food preparation and preservation (especially pemmican), clothing manufacture and repair using both European and Indigenous materials, hide tanning, snowshoe and moccasin making, serving as cultural interpreters and diplomatic intermediaries, teaching survival skills to European newcomers, and maintaining the family and community relationships that sustained post life. Many were married to Company servants in "country marriages" recognized by Indigenous custom but not European law.

**Indigenous Traders** were not employees but autonomous partners who chose when, where, and with whom to trade. They possessed superior knowledge of the land, resources, travel routes, and survival techniques. They actively played rival companies against each other for better terms and maintained their own political and social structures independent of Company authority.

### The Made Beaver Currency
The entire trade economy operated on this standardized system. One prime adult beaver pelt in perfect condition = 1 Made Beaver (MB). All other furs valued relative to this standard: bear skin 5 MB, lynx 2-3 MB, marten 0.5 MB, muskrat 0.25 MB. All trade goods similarly priced: gun 12 MB, three-point blanket 6 MB, pound of tobacco 2 MB, steel axe 1 MB. Clerks assessed quality based on trapping season, pelt condition, size, and proper preparation.

### Trading Protocols
Social rituals preceded all business and were not optional courtesies—they were essential diplomacy. The process began with formal welcoming, followed by sharing tobacco and tea, exchanging news about conditions in the interior, and building personal relationships. Only then could trading begin. Rushing to business was considered deeply insulting and could drive traders to competitor posts. Long-term trading partners expected fair assessment of furs, reasonable prices, credit extension during poor trapping seasons, gifts recognizing loyalty and relationship, and respectful treatment acknowledging their status and autonomy.

### Seasonal Rhythms
Dawn cannon started each day; evening cannon ended it. Summer was the most intense season—the annual supply ship from England required the entire post to mobilize for loading and unloading before ice returned. Gardens were cultivated and major construction undertaken. Winter brought reduced trading, extreme cold, survival focus, equipment repair, and months of isolation with no outside contact. The post had to be completely self-sufficient between annual ship visits, making preparation the constant theme of daily work.

### Key Figures
- George Simpson (Governor, HBC 1820-1860) — transformed HBC operations across the continent
- Thanadelthur (Chipewyan diplomat, c.1697-1717) — brokered peace between Chipewyan and Cree, opening trade
- Matonabbee (Chipewyan leader, c.1737-1782) — guided Samuel Hearne to the Arctic Ocean
- James Douglas (Chief Factor/Governor, 1803-1877) — shaped HBC operations and early British Columbia

### Timeline Context
- 1670: HBC Charter grants monopoly over Hudson Bay drainage basin
- 1774: Cumberland House — first HBC inland post, marking shift from coastal waiting
- 1821: HBC absorbs North West Company, creating continental monopoly
- 1870: Rupert's Land transferred to Canada, ending the fur trade era

### Cultural Significance
Trading posts were extraordinary multicultural spaces where Indigenous peoples maintained autonomy while engaging in commerce, European economic systems met Indigenous social protocols, multiple languages were spoken daily, and the Metis nation emerged from intermarriage. Many modern Canadian cities—Winnipeg, Edmonton, Calgary, Vancouver—began as trading posts.`
  },

  {
    id: "cmliiajbo0001m2u2lltp5xgn",
    title: "Animals of the Fur Trade",
    mainContent: `## Animals of the Fur Trade: Teacher Resource

### The Beaver: Foundation Species
Beaver underfur features microscopic barbs that interlock when processed, creating felt of unmatched quality for European hat-making. European beaver populations were depleted by 1600, driving merchants to North America's vast supply. The beaver is North America's largest rodent, weighing up to 60 pounds, semi-aquatic, building elaborate dams and lodges from branches and mud. They mate for life and live in family groups. Winter pelts are thickest and most valuable, harvested November through April. Found near streams, ponds, and rivers throughout boreal and temperate forests.

**Trapping Methods**: Indigenous trappers used deadfall traps triggered by bait, underwater sets placed at lodge entrances, baited traps using castoreum (beaver scent glands that attract other beavers), and ice-breaking techniques to access lodges in winter. Each method required detailed knowledge of beaver behavior, habitat preferences, and seasonal patterns—knowledge passed carefully through generations and never fully mastered by European traders.

**Made Beaver Standard**: One prime adult beaver pelt in perfect condition = 1 Made Beaver (MB), the unit against which all furs and trade goods were measured. Quality assessment considered the season trapped (winter best), pelt condition (holes and tears reduced value), overall size and thickness of fur, and proper preparation including stretching, drying, and cleaning.

### Other Major Species

**Marten** (Value: 0.5 MB): Small weasel-family predator inhabiting mature coniferous forests. Extremely difficult to trap due to its agility and wariness. Luxurious dark brown fur highly prized in European markets. Often the first species to disappear locally from overharvesting because of its slow reproduction rate and sensitivity to habitat disturbance.

**Lynx** (Value: 2-3 MB): Medium-sized cat with distinctive ear tufts and huge padded feet adapted for walking on snow. Follows dramatic 10-year snowshoe hare population cycle—boom years produced abundant furs while bust years yielded almost none. This created wildly unpredictable supply that traders had to navigate and plan around. Found across boreal forests from coast to coast.

**Fox Species**: Red fox (1-2 MB) was common but less valuable. Silver fox, a rare melanistic color variant, commanded extraordinary prices of 20+ MB—making a single pelt worth more than most trappers earned in weeks. Cross fox (5-10 MB) displayed a distinctive dark cross pattern on the back. Arctic fox (3-5 MB) came from the far north with pure white winter coats.

**River Otter** (Value: 2-3 MB): Large aquatic relative of the weasel, producing durable warm pelts used primarily for clothing. Found along rivers and lakes across the continent.

**Muskrat** (Value: 0.25 MB): Smaller relative of the beaver, extremely abundant in wetlands everywhere. Though individually worth little, they were traded in enormous quantities—sometimes tens of thousands from a single post annually. Accessible to all trappers including beginners, elders, and families.

**Bears** (Value: 5-6 MB): Both black and grizzly bears produced large pelts used for blankets, coats, and floor rugs. Dangerous to hunt and relatively scarce, limiting their contribution to overall trade volumes. Meat was also valued, particularly by Indigenous communities.

**Other Species**: Ermine or weasel in winter white provided luxury trim for European garments. Fisher, a large weasel relative, was moderately valuable. Mink pelts brought moderate prices. Seal was traded only in coastal regions. Wolf pelts had variable value depending on condition and market demand.

### Seasonal Cycles and Trapping Calendar
Cold weather triggers thick underfur growth, making winter pelts far more valuable than summer ones. The annual trapping cycle followed a strict rhythm: summer for preparing equipment and scouting new locations; fall for setting traplines as fur quality improved; winter as peak trapping season, traveling extensive trapline circuits; spring for final trapping and transporting accumulated furs to trading posts; and late spring through summer for trading, resupplying, resting, and maintaining social and family relationships.

### Indigenous Knowledge vs. Commercial Pressure
Traditional Indigenous harvesting practices maintained healthy animal populations through cultural protocols that limited harvest, spiritual beliefs emphasizing respect for animals and reciprocal relationships, generational knowledge of sustainable yields, and territorial systems preventing any one area from being overharvested. Commercial fur trade changed everything: European demand drove maximum extraction, competitive pressure between rival companies and trappers reduced any single person's incentive to conserve, some areas were trapped to near-extinction within decades, and economic necessity frequently overrode traditional conservation instincts.

### Environmental Impact
Eastern beaver populations collapsed by 1700, driving the trade progressively westward in search of untapped populations. Removing beavers had consequences far beyond one species—their dam-building creates wetland ecosystems supporting fish, waterfowl, amphibians, and countless other species. Without beaver dams, wetlands dried out, stream flows changed, water quality declined, and entire landscapes were transformed. Similarly, removing predators like lynx and fox disrupted prey populations, causing cascading effects throughout food webs.

### Key Figures
- Alexander Mackenzie — pursued beaver trade routes to both the Arctic and Pacific oceans
- Peter Pond — opened the incredibly rich Athabasca beaver country in 1778
- Henry Kelsey — first European to observe inland prairie wildlife and trade patterns

### Timeline Context
- 1600s: European beaver populations exhausted, driving North American demand
- 1670: HBC Charter formalizes beaver trade as continental enterprise
- 1778: Peter Pond reaches Lake Athabasca — richest beaver country discovered
- 1840s: Silk hats replace beaver felt in European fashion, collapsing demand`
  }
];

async function main() {
  console.log("=== UPDATING mainContent ONLY IN TURSO ===\n");

  for (const u of updates) {
    console.log(`Updating: ${u.title}`);
    const result = await client.execute({
      sql: `UPDATE LessonPlan SET mainContent = ? WHERE id = ?`,
      args: [u.mainContent, u.id]
    });
    console.log(`  Rows affected: ${result.rowsAffected}`);
  }

  console.log("\n=== VERIFYING FROM TURSO ===\n");

  for (const u of updates) {
    const r = await client.execute({ sql: `SELECT title, narrativeContent, mainContent FROM LessonPlan WHERE id = ?`, args: [u.id] });
    const row = r.rows[0];
    if (!row) { console.log(`  NOT FOUND: ${u.id}`); continue; }
    const nw = row.narrativeContent ? String(row.narrativeContent).split(/\s+/).length : 0;
    const tw = row.mainContent ? String(row.mainContent).split(/\s+/).length : 0;
    console.log(`  ${row.title}: narrative=${nw} words, teacher mainContent=${tw} words`);
  }

  console.log("\nDone.");
}

main().catch(console.error);
