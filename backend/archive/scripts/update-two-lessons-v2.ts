import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const lessons = [
  {
    id: "cmliiajbw0004m2u260srsthb",
    title: "A Day at the Trading Post",
    heroImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/York_Factory,_Manitoba_(2017).jpg?width=800",

    narrativeContent: `The morning cannon boomed across Hudson Bay, signaling another day at York Factory—the Hudson's Bay Company's most important trading post. Inside the wooden palisades, the fur trade stirred to life. Indigenous traders arrived with canoes laden with beaver pelts. Voyageurs unloaded freight. Clerks hurried between buildings with ledgers. Woodsmoke and tobacco hung in the air.

The Factor—the post's chief officer—emerged from the Big House to meet his officers. Together they reviewed yesterday's trades and planned the day. His authority was absolute for hundreds of miles in every direction.

Trading was ceremony as much as commerce. When Cree hunters arrived with furs, clerks didn't haggle immediately. First came tea and tobacco, news from the interior, questions about family and game. Only after these rituals did the clerk examine pelts and calculate value in "Made Beaver"—the trade's currency where one prime beaver pelt was the standard unit. A gun cost twelve Made Beaver, blankets six each, a pound of tobacco two.

These weren't cold transactions. Indigenous traders expected respect and fair dealing. The Company wanted them returning next season. Credit was extended, gifts exchanged, disputes resolved through diplomacy rather than confrontation.

While clerks traded, other work filled the post. Coopers built barrels for shipping furs to England. Blacksmiths repaired guns. Carpenters mended buildings. Women's contributions proved equally vital though rarely recorded—Indigenous and Metis women prepared food, made clothing, tanned hides, crafted snowshoes, and served as interpreters and diplomats.

The post's gardens demanded constant attention during the brief growing season. Supplies arrived only once yearly by ship from England. Summer afternoons might see everyone mobilized to unload that ship. Other seasons meant preparing for winter: cutting vast quantities of firewood, preserving food, repairing buildings.

As evening approached, furs were counted and locked away. The evening cannon fired at sunset. Guards locked the gates. This cycle repeated year after year, binding Indigenous peoples, European servants, and London merchants in the web of exchange that shaped northern North America.`,

    mainContent: `## Life at a Fur Trade Post: Teacher Resource

### Physical Layout
Trading posts were fortified, self-sufficient communities: defensive palisades and watchtowers; the Big House (Factor's residence and administrative center); Trade Shop with counter separating traders from goods; secure fur warehouses; workshops (blacksmith, cooperage, carpentry); servants' quarters; and gardens and livestock areas for food production.

### People and Roles
**The Factor** held absolute authority as the HBC representative—responsible for profitability, Indigenous relations, employee management, and detailed annual reports to London.

**Clerks and Officers** maintained financial records, conducted trades, learned Indigenous languages. Their journals provide our richest historical records of daily post life.

**Skilled Tradesmen** (blacksmiths, coopers, carpenters, boat builders) were mostly recruited from Scotland's Orkney Islands for their reliability and hardiness.

**Common Laborers** performed loading, maintenance, hunting, fishing, and firewood cutting under the hardest conditions for the lowest pay.

**Indigenous and Metis Women** contributed vitally despite near-absence from official records: food preparation and preservation, clothing manufacture, hide tanning, snowshoe making, cultural interpretation, and diplomacy. Their knowledge of languages and customs was irreplaceable.

**Indigenous Traders** maintained full autonomy, trading when and where they chose, possessing superior land knowledge, and playing rival companies against each other for better terms.

### The Made Beaver Currency
One prime adult beaver pelt = 1 Made Beaver (MB). All furs and goods measured against this:
- Bear skin: 5 MB | Lynx: 2-3 MB | Marten: 0.5 MB
- Gun: 12 MB | Blanket: 6 MB | Tobacco (1 lb): 2 MB | Axe: 1 MB

Quality assessment considered season trapped, condition, size, and proper preparation.

### Trading Protocols
Social rituals preceded all business: welcoming, sharing tobacco and tea, exchanging news, building relationship. Rushing to business insulted traders and could drive them to competitors. Long-term partners expected fair prices, credit in poor seasons, gifts recognizing loyalty, and respectful treatment.

### Daily and Seasonal Rhythms
Dawn cannon started the day; evening cannon ended it. Summer focused on the annual supply ship and garden cultivation. Winter meant reduced trading, survival focus, equipment repair, and extreme isolation between annual ship visits.

### Key Figures
- George Simpson (Governor, HBC 1820-1860) — transformed HBC operations continent-wide
- Thanadelthur (Chipewyan diplomat, c.1697-1717) — brokered peace between Chipewyan and Cree
- Matonabbee (Chipewyan leader, c.1737-1782) — guided Samuel Hearne to the Arctic Ocean
- James Douglas (Chief Factor/Governor, 1803-1877) — shaped HBC operations and early British Columbia

### Timeline Context
- 1670: HBC Charter grants monopoly over Hudson Bay drainage
- 1774: Cumberland House — first HBC inland post
- 1821: HBC absorbs North West Company
- 1870: Rupert's Land transferred to Canada

### Cultural Significance
Trading posts were multicultural spaces where Indigenous peoples maintained autonomy, European economic systems met Indigenous protocols, and Metis identity emerged. Many modern Canadian cities began as trading posts.`,

    objectives: `1. Describe the physical layout and buildings of a trading post and explain each structure's function
2. Identify different groups at trading posts and analyze their roles, relationships, and relative power
3. Explain the Made Beaver currency system and calculate relative values of furs and trade goods
4. Analyze trading as both economic exchange and cultural diplomacy
5. Compare daily life across different groups at trading posts
6. Evaluate trading posts as sites of both cultural exchange and colonial power
7. Use primary sources to reconstruct historical experiences and identify bias`,

    materials: `**Primary Sources**: HBC trading post journals, account ledgers, archaeological reports, paintings by Paul Kane and Frances Anne Hopkins
**Visual Materials**: Floor plans of York Factory and Fort William, historical paintings, photographs of reconstructed posts
**Interactive**: Virtual tours of Fort William and Lower Fort Garry
**Worksheets**: Made Beaver calculation exercises, primary source analysis guides, role-play cards`,

    activities: `**Trading Post Simulation (60 min)**: Students role-play a trading day with assigned roles (Factor, clerks, Indigenous traders, workers). Debrief on power dynamics and cultural differences.

**Made Beaver Economics (30 min)**: Using historical price lists, calculate costs and analyze profit margins. Discuss fairness and exploitation.

**Primary Source Analysis (45 min)**: Examine journal excerpts for routines, relationships, and biases. Compare Company records with Indigenous oral histories.

**Perspective Writing (30 min)**: First-person narratives from different viewpoints describing the same trading day.`,

    discussionQuestions: `1. Why were social rituals essential before trading began?
2. How did women's work sustain trading posts despite being absent from official records?
3. Can trading posts be sites of both cultural exchange and colonial exploitation? Explain.
4. How did Indigenous peoples maintain power in trading relationships?
5. What does the Made Beaver system reveal about cross-cultural negotiation?
6. What can archaeological evidence reveal that written records hide?`,

    assessment: `**Formative**: Simulation observation, Made Beaver calculations, exit tickets, primary source worksheets
**Summative**: Research project on a specific trading post (800-1000 words); comparative essay on different perspectives; historical journal (10 entries) from a chosen perspective; mock trade negotiation demonstrating protocols`,

    extensions: `**Advanced**: Archaeological investigation of a post site; comparative study of HBC vs NWC operations; women's history research using Company records and oral histories
**Support**: Simplified simulation with visual supports; graphic organizers; guided primary source analysis; partnered activities
**Cross-Curricular**: Math (currency calculations), Geography (mapping posts and routes), Art (historical paintings), Science (preservation techniques)`,

    curriculumConnections: `**History**: Indigenous-European interactions, fur trade economy, colonial period, primary sources
**Geography**: Human-environment interaction, transportation networks, settlement patterns
**Economics**: Trade systems, currency, supply and demand
**Indigenous Studies**: Economic relationships, cultural adaptation, treaty context
**Social Studies**: Cultural encounters, social hierarchies, Metis identity`,

    keyFigures: JSON.stringify([
      { name: "George Simpson", explorerId: "cmlijai0q0003m22r2hk84pe9", role: "Governor, HBC", description: "Transformed HBC operations across North America for four decades" },
      { name: "Thanadelthur", explorerId: "cmlijaiex000mm22rseuv61do", role: "Chipewyan Diplomat", description: "Brokered peace between Chipewyan and Cree, opening HBC trade" },
      { name: "Matonabbee", explorerId: "cmlijaiez000nm22r1ou598s9", role: "Chipewyan Leader", description: "Guided Samuel Hearne to the Arctic Ocean" },
      { name: "James Douglas", explorerId: "cmlijaicv0005m22r4caohonp", role: "Chief Factor/Governor", description: "Shaped HBC operations and early British Columbia" }
    ]),

    timeline: JSON.stringify([
      { year: 1670, title: "HBC Charter", description: "Monopoly granted over all lands draining into Hudson Bay", waterwayId: "cmlhaslrt001cm2zh9tknhhbe" },
      { year: 1774, title: "Cumberland House", description: "First HBC inland post, strategic shift from coastal operations" },
      { year: 1821, title: "HBC-NWC Merger", description: "HBC absorbs North West Company, creating continental monopoly" },
      { year: 1870, title: "Rupert's Land Transfer", description: "HBC surrenders territorial claims to Canada" }
    ]),

    images: JSON.stringify([
      {
        url: "https://commons.wikimedia.org/wiki/Special:FilePath/Grand_Portage_National_Monument_Great_Hall.jpg?width=800",
        caption: "Reconstructed great hall at Grand Portage, showing the scale of a major fur trade gathering place",
        credit: "Wikimedia Commons"
      }
    ])
  },

  {
    id: "cmliiajbo0001m2u2lltp5xgn",
    title: "Animals of the Fur Trade",
    heroImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/American_Beaver.jpg?width=800",

    narrativeContent: `The beaver transformed world history. This industrious rodent, weighing up to 60 pounds, became the unlikely engine driving European exploration and colonization of northern North America. Its underfur possessed a unique quality: microscopic barbs that interlocked when processed into felt of unparalleled quality for hat-making. A single beaver hat might cost a skilled worker's monthly wages. As European beaver populations collapsed, merchants turned to North America's vast supply.

Indigenous peoples possessed deep knowledge of beaver behavior—seasonal patterns, preferred habitats, social structures. They knew winter pelts had thicker fur and brought higher prices. This expertise made Indigenous trappers irreplaceable partners in the trade.

Marten, with luxurious dark fur, was nearly as valued. These small forest predators are notoriously difficult to trap. A prime pelt traded for half a Made Beaver. Populations declined rapidly in trapped areas, pushing trappers ever deeper into the interior.

The lynx followed snowshoe hare population cycles in a dramatic ten-year boom-bust pattern. When hares thrived, lynx multiplied; when hares crashed, lynx starved. This created wildly variable fur supplies that traders had to navigate.

Foxes varied enormously in value. Common red fox brought modest prices, but silver fox—a rare color variant—could be worth twenty times more than beaver. Arctic fox, pure white in winter, came from the far north. Muskrat were individually cheap but traded in enormous quantities. Bear skins became blankets, coats, and rugs.

The environmental impact was profound. Beaver populations crashed across eastern North America by 1700, driving the trade westward. Removing beavers didn't just mean fewer animals—their dam-building creates wetland ecosystems supporting countless species. Losing beavers transformed entire landscapes.

Traditional Indigenous harvesting, regulated by cultural practices ensuring sustainability, gave way to maximum extraction under commercial pressure. The lesson remains relevant: even seemingly inexhaustible wildlife populations can collapse under relentless commercial demand.`,

    mainContent: `## Animals of the Fur Trade: Teacher Resource

### The Beaver: Foundation Species
Beaver underfur features microscopic barbs creating unmatched felt for hat-making. European beaver depleted by 1600; North American populations seemed inexhaustible. Largest North American rodent (up to 60 lbs), semi-aquatic, building dams and lodges. Mates for life. Winter pelts thickest and most valuable (November-April).

**Trapping Methods**: Deadfall traps, underwater sets at lodge entrances, baited traps using castoreum (scent glands), ice-breaking for winter lodges. Each required detailed knowledge passed through generations.

**Made Beaver Standard**: One prime adult pelt = 1 MB. Quality based on season, condition, size, thickness, and preparation.

### Other Major Species
**Marten** (0.5 MB): Small weasel-family predator in mature coniferous forests. Extremely difficult to trap. Often first species to disappear locally from overharvesting.

**Lynx** (2-3 MB): Medium cat with ear tufts and huge feet. Follows 10-year snowshoe hare cycle—boom years abundant, bust years scarce.

**Fox Species**: Red (1-2 MB, common); Silver (20+ MB, extremely rare); Cross (5-10 MB, distinctive pattern); Arctic (3-5 MB, white winter coat).

**River Otter** (2-3 MB): Large aquatic weasel relative. Durable pelts for clothing.

**Muskrat** (0.25 MB): Extremely abundant, low individual value but enormous trade quantities.

**Bears** (5-6 MB): Large pelts for blankets and coats. Dangerous to hunt, relatively scarce.

**Others**: Ermine (luxury trim), fisher, mink, seal (coastal), wolf (variable).

### Seasonal Cycles
Cold weather triggers thick underfur growth. Annual cycle: summer (prepare equipment); fall (set traplines); winter (peak trapping); spring (transport furs to posts); late spring/summer (trade and resupply).

### Indigenous Knowledge vs. Commercial Pressure
Traditional practices maintained populations through cultural protocols, spiritual beliefs, generational knowledge, and territorial systems. Commercial trade demanded maximum extraction, introduced competitive pressure, and led to areas trapped to near-extinction.

### Environmental Impact
Eastern beaver populations collapsed by 1700, driving trade progressively westward. Beaver dam removal dried wetlands, altered stream flows, destroyed fish and waterfowl habitat. Removing predators like lynx and fox disrupted prey populations with cascading food web effects.

### Key Figures
- Alexander Mackenzie — pursued beaver trade routes to Arctic and Pacific
- Peter Pond — opened Athabasca beaver country in 1778
- Henry Kelsey — first European to observe inland wildlife and trade patterns

### Timeline Context
- 1600s: European beaver depleted, driving North American demand
- 1670: HBC Charter formalizes beaver trade
- 1778: Peter Pond reaches Athabasca — richest beaver country
- 1840s: Silk hats replace beaver felt, ending demand`,

    objectives: `1. Identify major fur-bearing species and explain what made each valuable
2. Analyze why beaver became the foundation species and understand Made Beaver currency
3. Explain relationships between animal biology and Indigenous trapping techniques
4. Compare traditional Indigenous harvesting with commercial practices and evaluate sustainability
5. Assess environmental consequences of large-scale commercial trapping
6. Understand seasonal cycles in fur quality and how they shaped trapping calendars
7. Connect historical practices to modern wildlife management and conservation`,

    materials: `**Visual Resources**: Images of each major fur species, historical trapping paintings, species range maps
**Primary Sources**: HBC account books showing fur quantities and values, trappers' journals, explorer observations
**Data**: Historical fur trade statistics showing population changes and price fluctuations
**Worksheets**: Species comparison charts, Made Beaver calculations, population graphing activities`,

    activities: `**Species Research Project (45 min)**: Each student researches one species covering biology, habitat, trapping methods, trade value, and population history. Present species profiles.

**Made Beaver Economics (30 min)**: Calculate relative values across species. Analyze why certain furs commanded premium prices.

**Population Graphing (30 min)**: Graph historical fur statistics to visualize population crashes. Identify patterns and discuss causes.

**Ecosystem Modeling (30 min)**: Create food web diagrams. Model effects of removing beaver or lynx. Discuss cascade effects.

**Traditional vs. Commercial Debate (30 min)**: Examine evidence for sustainable harvesting vs. commercial extraction. Discuss what lessons apply today.`,

    discussionQuestions: `1. What unique property made beaver fur irreplaceable for hat-making?
2. How did the lynx-hare cycle affect fur trade economics?
3. Why were winter pelts worth more than summer pelts?
4. How did Indigenous knowledge give trappers advantages Europeans couldn't replicate?
5. What evidence shows "inexhaustible" populations could collapse?
6. How did removing beavers affect entire ecosystems?
7. Why did trappers continue overharvesting when they could see populations declining?
8. What lessons apply to modern resource management?`,

    assessment: `**Formative**: Species identification exercises, Made Beaver calculations, exit tickets, discussion participation
**Summative**: Species research project with presentation (800-1000 words); comparative essay on traditional vs. commercial harvesting; data analysis report documenting population changes; ecosystem impact assessment`,

    extensions: `**Advanced**: Population ecology research; economic modeling of boom-bust cycles; current Indigenous trapping rights; comparative study across ecosystems
**Support**: Visual species guides; simplified calculations; guided data analysis; partnered research; graphic organizers
**Cross-Curricular**: Biology (adaptations, ecology), Math (population graphs, economics), Art (wildlife illustration), Geography (species mapping)`,

    curriculumConnections: `**Science**: Animal biology, ecology, population dynamics, predator-prey relationships, conservation
**Social Studies**: Economic systems, Indigenous knowledge, environmental history, sustainability
**Geography**: Species distribution, human-environment interaction, resource exploitation
**Indigenous Studies**: Traditional ecological knowledge, sustainable harvesting, colonization impacts
**Environmental Education**: Overexploitation, ecosystem services, conservation and recovery`,

    keyFigures: JSON.stringify([
      { name: "Alexander Mackenzie", explorerId: "cmlhaslpq0005m2zhbi5xrrt6", role: "Explorer", description: "Pursued beaver trade routes to Arctic and Pacific oceans" },
      { name: "Peter Pond", explorerId: "cmlhc4gt7000bm2ogmjjkr2c4", role: "Trader and Explorer", description: "Opened the rich Athabasca beaver country in 1778" },
      { name: "Henry Kelsey", explorerId: "cmlhc4gsr0007m2ogrr0m8vqf", role: "Explorer", description: "First European to observe inland wildlife and trade patterns" }
    ]),

    timeline: JSON.stringify([
      { year: 1600, title: "European Beaver Depletion", description: "European beaver exhausted, driving North American demand" },
      { year: 1670, title: "HBC Charter", description: "Beaver trade formalized under Hudson's Bay Company", waterwayId: "cmlhaslrt001cm2zh9tknhhbe" },
      { year: 1778, title: "Athabasca Opened", description: "Peter Pond reaches richest beaver country", waterwayId: "cmlhaslrq001am2zhud0snm8t" },
      { year: 1840, title: "End of Beaver Hat Fashion", description: "Silk hats replace beaver felt, collapsing demand" }
    ]),

    images: JSON.stringify([
      {
        url: "https://commons.wikimedia.org/wiki/Special:FilePath/Canadian_Lynx_by_Keith_Williams.jpg?width=800",
        caption: "Canada lynx — population followed dramatic 10-year cycles tied to snowshoe hare numbers",
        credit: "Wikimedia Commons"
      }
    ])
  }
];

async function updateLesson(lesson: typeof lessons[0]) {
  console.log(`Updating: ${lesson.title} (${lesson.id})`);
  const result = await client.execute({
    sql: `UPDATE LessonPlan
          SET narrativeContent = ?,
              mainContent = ?,
              objectives = ?,
              materials = ?,
              activities = ?,
              discussionQuestions = ?,
              assessment = ?,
              extensions = ?,
              curriculumConnections = ?,
              keyFigures = ?,
              timeline = ?,
              images = ?,
              heroImageUrl = ?
          WHERE id = ?`,
    args: [
      lesson.narrativeContent, lesson.mainContent, lesson.objectives,
      lesson.materials, lesson.activities, lesson.discussionQuestions,
      lesson.assessment, lesson.extensions, lesson.curriculumConnections,
      lesson.keyFigures, lesson.timeline, lesson.images,
      lesson.heroImageUrl, lesson.id
    ]
  });
  console.log(`  Rows affected: ${result.rowsAffected}`);
  if (result.rowsAffected === 0) console.log(`  WARNING: No rows updated!`);
}

async function verify(id: string) {
  const r = await client.execute({ sql: `SELECT title, narrativeContent, mainContent FROM LessonPlan WHERE id = ?`, args: [id] });
  const row = r.rows[0];
  if (!row) { console.log(`  NOT FOUND: ${id}`); return; }
  const nw = row.narrativeContent ? String(row.narrativeContent).split(/\s+/).length : 0;
  const tw = row.mainContent ? String(row.mainContent).split(/\s+/).length : 0;
  console.log(`  ${row.title}: narrative=${nw} words, teacher mainContent=${tw} words`);
}

async function main() {
  console.log("=== UPDATING TURSO ===\n");
  for (const l of lessons) await updateLesson(l);
  console.log("\n=== VERIFYING FROM TURSO ===\n");
  for (const l of lessons) await verify(l.id);
  console.log("\nDone.");
}

main().catch(console.error);
