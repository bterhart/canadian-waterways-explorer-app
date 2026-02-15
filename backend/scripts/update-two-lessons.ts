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
    narrativeContent: `The morning cannon boomed across Hudson Bay at dawn, signaling the start of another day at York Factory—the Hudson's Bay Company's most important trading post. Inside the wooden palisades, the fur trade stirred to life. Indigenous traders arrived with canoes laden with beaver pelts. Voyageurs unloaded freight from interior posts. Clerks hurried between buildings with ledgers. Woodsmoke, tobacco, and cooking hung in the air.

The Factor—the post's chief officer—emerged from the Big House to meet his accountant, warehouse keeper, and boat master. Together they reviewed yesterday's trades and planned the day's work. His word was law for hundreds of miles.

Trading was ceremony as much as commerce. When Cree hunters arrived with furs, clerks didn't immediately haggle. First came tea and tobacco, news from the interior, questions about family and game. Only after these rituals would the clerk examine each pelt and calculate value in "Made Beaver"—the fur trade's currency where one prime beaver pelt was the standard unit.

A hunter might trade his catch for a gun (twelve Made Beaver), blankets (six each), powder and shot, kettles, and tobacco. But these weren't cold transactions. Indigenous traders expected respect and fair treatment. The Company wanted them returning next season rather than visiting rival posts. Credit was extended, gifts exchanged, disputes resolved diplomatically.

While clerks traded, other work filled the day. Coopers built barrels for shipping furs to England. Blacksmiths repaired guns and sharpened axes. Carpenters mended buildings damaged by winter. In the provisions store, workers prepared pemmican and dried fish for canoe brigades heading inland.

Women's work proved equally essential, though rarely recorded in Company ledgers. Indigenous and Metis women prepared food, made clothing, tanned hides, crafted snowshoes and moccasins. They served as cultural interpreters and diplomats, their knowledge of languages and customs invaluable. Their skill at food preservation often meant the difference between survival and starvation.

The post's gardens demanded constant attention during the brief growing season. Potatoes, turnips, and cabbage supplemented diets of salt pork, flour, and wild game. Supplies arrived only once yearly by ship from England—nothing could be wasted.

Midday brought the main meal. Officers dined on finer fare in their mess; common servants ate pemmican, bannock, and whatever fish or game was available. Summer afternoons might see everyone mobilized to unload the annual supply ship. Other seasons meant winter preparation: cutting vast quantities of firewood, repairing buildings, preserving food.

As evening approached, furs were counted, recorded, and locked away. The evening cannon fired at sunset. Guards locked the gates. Officers read by candlelight or wrote letters. Servants played cards, told stories, and made fiddle music. Indigenous families camped nearby tended to their own activities—repairing equipment, telling stories, planning the next stage of their journey.

This cycle of trade, work, and survival repeated year after year, binding Indigenous peoples, European servants, and London merchants in the complex web that shaped northern North America.`,

    mainContent: `## Life at a Fur Trade Post: Comprehensive Teacher Resource

### Physical Layout
Trading posts were fortified, self-sufficient communities. Key structures included defensive palisades and watchtowers; the Big House (Factor's residence and administrative center); the Trade Shop with counter separating traders from goods; secure fur warehouses; workshops (blacksmith, cooperage, carpentry); servants' quarters; and gardens and livestock areas essential for food production.

### People and Roles

**The Factor** held absolute authority as the HBC's representative. Responsible for profitability, Indigenous relations, employee management, and detailed annual reports to London. Usually Scottish, educated, from merchant class.

**Clerks and Officers** maintained financial records, conducted daily trades, learned Indigenous languages. Rose through Company ranks from apprentice positions. Their journals provide our richest historical records.

**Skilled Tradesmen** included blacksmiths, coopers, carpenters, and boat builders—mostly recruited from Scotland's Orkney Islands.

**Common Laborers** performed physical work: loading goods, maintenance, hunting, fishing, cutting firewood. Hardest conditions, lowest pay.

**Indigenous and Metis Women** contributed vitally despite near-absence from official records: food preparation and preservation, clothing manufacture, hide tanning, snowshoe and moccasin making, cultural interpretation, diplomacy, and family maintenance.

**Indigenous Traders** were not employees but essential partners who maintained full autonomy, trading when and where they chose, possessing superior land knowledge, and playing rival companies against each other.

### The Made Beaver Currency System
One prime adult beaver pelt = 1 Made Beaver (MB). All furs and goods measured against this standard:
- Bear skin: 5 MB | Lynx: 2-3 MB | Marten: 0.5 MB | Muskrat: 0.25 MB
- Gun: 12 MB | Blanket: 6 MB | Tobacco (1 lb): 2 MB | Axe: 1 MB

Clerks assessed quality based on season trapped, condition, size, and market conditions.

### Trading Protocols
Social rituals preceded all business: welcoming, sharing tobacco and tea, exchanging news, building relationship. Rushing to business was insulting and could drive traders to competitors. Long-term partners expected fair assessment, reasonable prices, credit extension in poor seasons, gifts recognizing loyalty, and respectful treatment.

### Daily and Seasonal Rhythms
Dawn cannon started the day; evening cannon ended it. Summer focused on the annual supply ship arrival and garden cultivation. Winter meant reduced trading, survival focus, equipment repair, and extreme isolation. The post had to be completely self-sufficient between annual ship visits.

### Key Historical Figures
- George Simpson (Governor, HBC 1820-1860) — transformed HBC operations across North America
- Thanadelthur (Chipewyan diplomat, c.1697-1717) — established peace between Chipewyan and Cree, opened HBC trade
- Matonabbee (Chipewyan leader, c.1737-1782) — guided Samuel Hearne to the Arctic Ocean
- James Douglas (Chief Factor/Governor, 1803-1877) — shaped both HBC operations and early British Columbia

### Timeline Context
- 1670: HBC Charter grants monopoly over Hudson Bay drainage
- 1774: Cumberland House — first HBC inland post, strategic shift from coastal waiting
- 1821: HBC absorbs North West Company, creating continental monopoly
- 1870: Rupert's Land transferred to Canada, ending fur trade era

### Cultural Significance
Trading posts were extraordinary multicultural spaces where Indigenous peoples maintained autonomy while engaging in commerce, where European economic systems met Indigenous social protocols, and where the Metis nation emerged from intermarriage. Many modern Canadian cities (Winnipeg, Edmonton, Vancouver) began as trading posts.`,

    objectives: `1. Describe the physical layout and buildings of a trading post and explain each structure's function
2. Identify different groups at trading posts and analyze their roles, relationships, and relative power
3. Explain the Made Beaver currency system and calculate relative values of furs and trade goods
4. Analyze the trading process as both economic exchange and cultural diplomacy
5. Compare daily life experiences across different groups at trading posts
6. Evaluate trading posts as sites of both cultural exchange and colonial power
7. Use primary sources to reconstruct historical experiences and identify perspective and bias`,

    materials: `**Primary Sources**: HBC trading post journals, account ledgers, archaeological reports, paintings by Paul Kane and Frances Anne Hopkins
**Visual Materials**: Floor plans of York Factory and Fort William, historical paintings of trading scenes, photographs of reconstructed posts
**Interactive**: Virtual tours of restored trading posts (Fort William, Lower Fort Garry)
**Worksheets**: Made Beaver calculation exercises, primary source analysis guides, role-play assignment cards`,

    activities: `**Trading Post Simulation (60 min)**: Students role-play a trading day with assigned roles (Factor, clerks, Indigenous traders, workers). Scenarios require negotiation, cultural sensitivity, and problem-solving. Debrief on power dynamics, cultural differences, and daily challenges.

**Made Beaver Economics (30 min)**: Using historical price lists, calculate costs, compare values, analyze profit margins. Discuss fairness and exploitation in the trading system.

**Primary Source Analysis (45 min)**: Examine trading post journal excerpts for daily routines, relationships, attitudes, and biases. Compare Company records with Indigenous oral histories of the same events.

**Perspective Writing (30 min)**: Write first-person narratives from different viewpoints (Factor, Cree trader, Metis woman, Orkney laborer) describing the same trading day.`,

    discussionQuestions: `1. Why were social rituals (tea, tobacco, conversation) essential before trading began?
2. How did Indigenous and Metis women's work sustain trading posts despite being absent from official records?
3. Can trading posts be sites of both cultural exchange and colonial exploitation simultaneously? Explain.
4. How did Indigenous peoples maintain power and autonomy in trading relationships?
5. What does the Made Beaver system reveal about how different cultures negotiated common ground?
6. How did seasonal cycles shape every aspect of trading post life?
7. What can archaeological evidence from trading posts reveal that written records hide?
8. How did trading post life contribute to the formation of Metis culture?`,

    assessment: `**Formative**: Observation during simulation, Made Beaver calculation checks, exit tickets, primary source analysis worksheets, discussion participation
**Summative**: Research project on a specific trading post using primary sources (800-1000 words); comparative essay on different perspectives of post life; historical journal (10 entries) from a chosen perspective; mock trade negotiation demonstrating protocols and cultural sensitivity`,

    extensions: `**Advanced**: Archaeological investigation of a specific post site; comparative study of HBC vs NWC operations; economic analysis of post profitability; women's history research using both Company records and oral histories
**Support**: Simplified simulation with visual supports; graphic organizers; guided primary source analysis; partnered activities; illustrated trading post maps with labels
**Cross-Curricular**: Math (currency conversion, profit calculations), Geography (mapping posts and routes), Art (recreate historical paintings), Science (fur-bearing animals, preservation techniques)`,

    curriculumConnections: `**History**: Indigenous-European interactions, fur trade economy, colonial period, daily life, primary source analysis
**Geography**: Human-environment interaction, transportation networks, settlement patterns
**Economics**: Trade systems, currency, supply and demand, business operations
**Indigenous Studies**: Economic relationships between nations, cultural adaptation, historical context for treaties
**Social Studies**: Cultural encounters, social hierarchies, women's roles, Metis identity formation`,

    keyFigures: JSON.stringify([
      { name: "George Simpson", explorerId: "cmlijai0q0003m22r2hk84pe9", role: "Governor, HBC", description: "Known as the 'Little Emperor,' transformed HBC operations across North America for four decades" },
      { name: "Thanadelthur", explorerId: "cmlijaiex000mm22rseuv61do", role: "Chipewyan Diplomat", description: "Established peace between Chipewyan and Cree, opening trade relations with the HBC" },
      { name: "Matonabbee", explorerId: "cmlijaiez000nm22r1ou598s9", role: "Chipewyan Leader and Guide", description: "Guided Samuel Hearne to the Arctic Ocean, invaluable to HBC northern operations" },
      { name: "James Douglas", explorerId: "cmlijaicv0005m22r4caohonp", role: "Chief Factor and Governor", description: "Shaped both HBC operations and early British Columbia colonial policy" }
    ]),

    timeline: JSON.stringify([
      { year: 1670, title: "HBC Charter", description: "Hudson's Bay Company granted monopoly over all lands draining into Hudson Bay", waterwayId: "cmlhaslrt001cm2zh9tknhhbe" },
      { year: 1774, title: "Cumberland House", description: "First HBC inland post established by Samuel Hearne, marking strategic shift from coastal operations", locationRef: "Cumberland House" },
      { year: 1821, title: "HBC-NWC Merger", description: "Hudson's Bay Company absorbs North West Company, creating continental monopoly" },
      { year: 1870, title: "Rupert's Land Transfer", description: "HBC surrenders territorial claims to Canada, ending the fur trade era" }
    ]),

    images: JSON.stringify([
      {
        url: "https://commons.wikimedia.org/wiki/Special:FilePath/Paul_Kane_Indians_Trading.jpg?width=800",
        caption: "Paul Kane painting depicting trade negotiations at an HBC post, showing the social complexity of these encounters",
        credit: "Wikimedia Commons"
      }
    ])
  },

  {
    id: "cmliiajbo0001m2u2lltp5xgn",
    title: "Animals of the Fur Trade",
    heroImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/American_Beaver.jpg?width=800",
    narrativeContent: `The beaver transformed world history. This industrious rodent, weighing up to 60 pounds, became the unlikely engine driving European exploration and colonization of northern North America. But the beaver was only one of many fur-bearing animals that fueled three centuries of trade.

Beaver underfur possessed a unique quality: microscopic barbs that interlocked when processed into felt of unparalleled quality for European hat-making. A single beaver hat might cost a skilled worker's monthly wages, yet demand remained insatiable. As European beaver populations collapsed from overhunting, merchants turned to North America's vast supply.

Indigenous peoples possessed deep knowledge of beaver behavior—their seasonal patterns, preferred habitats, and social structures. They knew winter pelts had thicker fur and brought higher prices. This expertise, combined with sophisticated trapping techniques, made Indigenous trappers irreplaceable partners.

Marten, with its luxurious dark fur, was nearly as valued. These small predators live in mature coniferous forests and are notoriously difficult to trap. A prime marten pelt traded for half a Made Beaver—substantial value for a small animal. Marten populations declined rapidly in trapped areas, pushing trappers ever deeper into the interior.

The lynx provided another prized fur. These cats follow snowshoe hare population cycles in a dramatic ten-year boom-bust pattern. When hares thrived, lynx multiplied; when hares crashed, lynx starved. This cycle created wildly variable fur supplies that traders had to navigate.

Foxes varied enormously in value. Common red fox brought modest prices, but silver fox—a rare color variant—could be worth many times more than beaver. Arctic fox, pure white in winter, came from the far north at good prices. Cross fox, with its dark back pattern, fell between.

River otter, muskrat, and bear all contributed to the trade. Muskrat were so numerous that even low prices per pelt added up significantly. Bear skins, worth five or six Made Beaver each, became blankets, coats, and rugs. Smaller animals—ermine, fisher, mink—added diversity to fur shipments.

The environmental impact was profound. Beaver populations crashed across eastern North America by 1700, driving the trade ever westward. Removing beavers didn't just mean fewer beavers—their dam-building creates wetland ecosystems supporting countless species. Losing beavers transformed entire landscapes.

Other species faced similar pressure. Marten and lynx disappeared from heavily trapped regions. Some trappers recognized the problem and attempted selective harvesting, but competitive pressure made sustainability nearly impossible—if you didn't take the furs, someone else would.

Traditional Indigenous harvesting, regulated by cultural practices ensuring sustainability, gave way to maximum extraction under commercial pressure. The lesson remains relevant today: even seemingly inexhaustible wildlife populations can collapse under relentless commercial demand.`,

    mainContent: `## The Animals That Built an Empire: Comprehensive Teacher Resource

### The Beaver: Foundation of the Trade

**Why Beaver Was King**
Beaver underfur features microscopic barbs that interlock when processed, creating felt of unmatched quality for hat-making. European beaver populations were depleted by 1600. North American populations seemed inexhaustible. A single beaver hat cost a skilled worker's monthly wages, driving relentless demand from the 1600s through the 1840s.

**Biology and Behavior**
Largest North American rodent (up to 60 lbs). Semi-aquatic, building dams and lodges from branches and mud. Mates for life, lives in family groups. Most active dawn and dusk. Winter pelts thickest and most valuable (November-April). Found near streams, ponds, and rivers throughout boreal and temperate forests.

**Trapping Methods**
Indigenous trappers used deadfall traps, underwater sets at lodge entrances, baited traps using castoreum (beaver scent glands), and ice-breaking techniques for winter lodges. Each method required detailed knowledge of beaver behavior passed through generations.

**Made Beaver Standard**
One prime adult beaver pelt = 1 Made Beaver (MB). Quality assessment considered season trapped, pelt condition, size, fur thickness, and proper preparation (stretching, drying, cleaning).

### Other Major Species

**Marten (Martes americana)** — Value: 0.5 MB
Small weasel-family predator living in mature coniferous forests. Extremely difficult to trap. Luxurious dark brown fur highly prized. Populations declined rapidly in trapped areas, often first species to disappear locally.

**Lynx (Lynx canadensis)** — Value: 2-3 MB
Medium-sized cat with distinctive ear tufts and huge padded feet. Follows dramatic 10-year snowshoe hare population cycle—boom years produced abundant furs, bust years very few. Soft, dense fur with black markings. Found across boreal forests.

**Fox Species**
- Red Fox: 1-2 MB, common but lower value
- Silver Fox (rare color variant): 20+ MB, extraordinarily valuable
- Cross Fox (partial melanistic): 5-10 MB, distinctive cross pattern on back
- Arctic Fox: 3-5 MB, pure white winter coat from far north

**River Otter** — Value: 2-3 MB
Large aquatic weasel relative. Durable, warm pelts used for clothing. Found along rivers and lakes.

**Muskrat** — Value: 0.25 MB
Smaller beaver relative, extremely abundant. Low individual value but traded in enormous quantities. Accessible to all trappers including beginners and families.

**Bears (Black and Grizzly)** — Value: 5-6 MB
Large pelts used for blankets, coats, rugs. Dangerous to hunt, relatively scarce. Meat also valued.

**Other Species**: Ermine/weasel (luxury trim, winter white), fisher (large weasel relative, valuable), mink (moderate value), seal (coastal only), wolf (variable).

### Seasonal Cycles
Cold weather triggers thick underfur growth, making winter pelts most valuable. Annual trapping cycle: summer (prepare equipment, scout); fall (set traplines as fur improves); winter (peak trapping); spring (last trapping, transport to posts); late spring/summer (trade, resupply, rest).

### Indigenous Knowledge Systems
Indigenous trappers possessed detailed knowledge of seasonal movement patterns, preferred habitats, den locations, breeding cycles, weather responses, and track reading. This knowledge, passed through generations, was irreplaceable. European traders depended entirely on Indigenous expertise for successful harvesting.

### Traditional vs. Commercial Harvesting
Traditional Indigenous practices maintained population health through cultural protocols, spiritual beliefs emphasizing animal respect, generational knowledge, and territorial systems preventing overharvesting. Commercial trade changed everything: demand for maximum extraction, competitive pressure reducing sustainability, areas trapped to near-extinction, economic necessity overriding conservation.

### Environmental Impact
**Beaver population crashes** spread east to west across North America. Eastern populations collapsed by 1700, driving the trade progressively westward.

**Ecosystem-level effects**: Beaver dams create wetland ecosystems. Removing beavers dried out wetlands, altered stream flows, destroyed fish and waterfowl habitat, and transformed landscapes. Removing predators like lynx and fox disrupted prey populations, causing cascading effects through food webs.

### Key Historical Figures
- Alexander Mackenzie — pursued beaver trade routes to both Arctic and Pacific oceans
- Peter Pond — opened the incredibly rich Athabasca beaver country in 1778
- Henry Kelsey — first European to observe prairie wildlife and trade patterns inland

### Timeline Context
- 1600s: European beaver populations depleted, driving demand for North American furs
- 1670: HBC Charter — beaver trade formalized as continental enterprise
- 1700: Eastern beaver populations crashing, trade moves inland
- 1778: Peter Pond reaches Athabasca — richest beaver country discovered
- 1840s: Silk hats replace beaver felt hats in European fashion, ending demand
- Modern: Beaver populations recovering, now Canada's national symbol`,

    objectives: `1. Identify major fur-bearing species and explain what made each valuable in European markets
2. Analyze why beaver became the foundation species and understand the Made Beaver currency
3. Explain the relationship between animal biology/behavior and Indigenous trapping techniques
4. Compare traditional Indigenous harvesting with commercial fur trade practices and evaluate sustainability impacts
5. Assess environmental consequences of large-scale commercial trapping on populations and ecosystems
6. Understand seasonal cycles in fur quality and how this shaped the annual trapping calendar
7. Connect historical fur trade practices to modern wildlife management and conservation`,

    materials: `**Visual Resources**: Images of each major fur species, historical paintings showing trapping, species range maps, fur quality comparison charts
**Primary Sources**: HBC account books showing fur quantities and values, trappers' journals, natural history observations from explorers
**Data**: Historical fur trade statistics showing population changes and price fluctuations
**Videos**: Animal behavior documentaries, beaver dam building footage
**Worksheets**: Species comparison charts, Made Beaver calculation exercises, population graphing activities`,

    activities: `**Species Research Project (45 min)**: Each student/pair researches one fur species covering biology, habitat, trapping methods, trade value, and population history. Create species profile presentations to share.

**Made Beaver Economics (30 min)**: Using historical price lists, calculate relative values of different species. Analyze why certain furs commanded premium prices. Compare trapper earnings across species.

**Population Impact Graphing (30 min)**: Graph historical fur trade statistics to visualize population crashes across regions. Identify patterns, discuss causes and consequences.

**Ecosystem Modeling (30 min)**: Create food web diagrams showing relationships between fur species. Model effects of removing key species like beaver or lynx. Discuss cascade effects.

**Traditional vs. Commercial Debate (30 min)**: Students examine evidence for sustainable Indigenous harvesting vs. commercial extraction. Discuss what factors led to overexploitation and what lessons apply today.`,

    discussionQuestions: `1. What unique property of beaver fur made it so valuable? Why couldn't other furs substitute for hat-making?
2. How did the 10-year lynx-hare cycle affect fur trade economics and Indigenous livelihoods?
3. Why were winter pelts worth more than summer pelts?
4. How did Indigenous knowledge of animal behavior give trappers advantages Europeans couldn't replicate?
5. What evidence shows that "inexhaustible" animal populations could collapse under commercial pressure?
6. How did removing beavers from an ecosystem affect other species and the landscape?
7. Why did some trappers continue overharvesting even when they could see populations declining?
8. What lessons from fur trade overexploitation apply to modern resource management?`,

    assessment: `**Formative**: Species identification exercises, Made Beaver calculations, exit tickets on key concepts, observation during activities, discussion participation
**Summative**: Species research project with presentation (800-1000 words plus visual); comparative essay on traditional vs. commercial harvesting (800-1000 words); data analysis report using fur trade statistics to document population changes; ecosystem impact assessment examining consequences of overharvesting`,

    extensions: `**Advanced**: Population ecology research comparing species vulnerability; economic modeling of boom-bust cycles; current Indigenous trapping rights research; comparative study of fur trade impacts across different ecosystems
**Support**: Visual species guides with key facts; simplified Made Beaver calculations; guided data analysis with templates; partnered research projects; graphic organizers for species comparison
**Cross-Curricular**: Biology (animal adaptations, ecology, population dynamics), Math (population graphs, economic calculations), Art (wildlife illustration), Geography (species range mapping)`,

    curriculumConnections: `**Science**: Animal biology and behavior, ecology, population dynamics, predator-prey relationships, environmental impact, conservation biology
**Social Studies**: Economic systems, Indigenous knowledge systems, environmental history, sustainability, resource management
**Geography**: Species distribution, human-environment interaction, resource exploitation patterns
**Indigenous Studies**: Traditional ecological knowledge, sustainable harvesting, impacts of colonization on traditional practices
**Environmental Education**: Overexploitation case studies, ecosystem services (beaver dams), conservation and recovery`,

    keyFigures: JSON.stringify([
      { name: "Alexander Mackenzie", explorerId: "cmlhaslpq0005m2zhbi5xrrt6", role: "Explorer", description: "Pursued beaver trade routes to both the Arctic and Pacific oceans" },
      { name: "Peter Pond", explorerId: "cmlhc4gt7000bm2ogmjjkr2c4", role: "Trader and Explorer", description: "Opened the incredibly rich Athabasca beaver country in 1778" },
      { name: "Henry Kelsey", explorerId: "cmlhc4gsr0007m2ogrr0m8vqf", role: "Explorer and Trader", description: "First European to observe prairie wildlife and inland trade patterns" }
    ]),

    timeline: JSON.stringify([
      { year: 1600, title: "European Beaver Depletion", description: "European beaver populations exhausted, driving demand for North American furs" },
      { year: 1670, title: "HBC Charter", description: "Beaver trade formalized as continental enterprise under Hudson's Bay Company", waterwayId: "cmlhaslrt001cm2zh9tknhhbe" },
      { year: 1700, title: "Eastern Population Crash", description: "Beaver populations collapse across eastern North America, trade moves inland" },
      { year: 1778, title: "Athabasca Opened", description: "Peter Pond reaches Lake Athabasca — richest beaver country in North America", waterwayId: "cmlhaslrq001am2zhud0snm8t" },
      { year: 1840, title: "End of Beaver Hat Fashion", description: "Silk hats replace beaver felt in European fashion, collapsing demand" }
    ]),

    images: JSON.stringify([
      {
        url: "https://commons.wikimedia.org/wiki/Special:FilePath/Canadian_Lynx_by_Keith_Williams.jpg?width=800",
        caption: "The Canada lynx, with distinctive ear tufts and huge feet — its population followed dramatic 10-year boom-bust cycles tied to snowshoe hare numbers",
        credit: "Wikimedia Commons"
      }
    ])
  }
];

async function updateLesson(lesson: typeof lessons[0]) {
  console.log(`\nUpdating: ${lesson.title} (${lesson.id})`);

  try {
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
        lesson.narrativeContent,
        lesson.mainContent,
        lesson.objectives,
        lesson.materials,
        lesson.activities,
        lesson.discussionQuestions,
        lesson.assessment,
        lesson.extensions,
        lesson.curriculumConnections,
        lesson.keyFigures,
        lesson.timeline,
        lesson.images,
        lesson.heroImageUrl,
        lesson.id
      ]
    });

    console.log(`  Rows affected: ${result.rowsAffected}`);
    if (result.rowsAffected === 0) {
      console.log(`  WARNING: No rows updated! ID may be incorrect.`);
    }
  } catch (error) {
    console.error(`  ERROR:`, error);
  }
}

async function verifyLesson(id: string) {
  const result = await client.execute({
    sql: `SELECT title,
           LENGTH(narrativeContent) as narrativeLen,
           LENGTH(mainContent) as teacherLen,
           heroImageUrl,
           keyFigures IS NOT NULL as hasKeyFigures,
           timeline IS NOT NULL as hasTimeline,
           images IS NOT NULL as hasImages,
           objectives IS NOT NULL as hasObjectives,
           materials IS NOT NULL as hasMaterials,
           activities IS NOT NULL as hasActivities,
           discussionQuestions IS NOT NULL as hasDiscussionQs,
           assessment IS NOT NULL as hasAssessment,
           extensions IS NOT NULL as hasExtensions,
           curriculumConnections IS NOT NULL as hasCurriculum,
           narrativeContent,
           mainContent
    FROM LessonPlan WHERE id = ?`,
    args: [id]
  });

  const row = result.rows[0];
  if (!row) {
    console.log(`  VERIFY FAILED: Lesson ${id} not found!`);
    return;
  }

  const narrativeWords = row.narrativeContent ? String(row.narrativeContent).split(/\s+/).length : 0;
  const teacherWords = row.mainContent ? String(row.mainContent).split(/\s+/).length : 0;

  console.log(`\n  VERIFIED IN TURSO: ${row.title}`);
  console.log(`  Narrative: ${narrativeWords} words (target: ~750)`);
  console.log(`  Teacher mainContent: ${teacherWords} words (target: 1500-1750)`);
  console.log(`  Hero Image: ${row.heroImageUrl ? 'YES' : 'MISSING'}`);
  console.log(`  Content Images: ${row.hasImages ? 'YES' : 'MISSING'}`);
  console.log(`  Key Figures: ${row.hasKeyFigures ? 'YES' : 'MISSING'}`);
  console.log(`  Timeline: ${row.hasTimeline ? 'YES' : 'MISSING'}`);
  console.log(`  Objectives: ${row.hasObjectives ? 'YES' : 'MISSING'}`);
  console.log(`  Materials: ${row.hasMaterials ? 'YES' : 'MISSING'}`);
  console.log(`  Activities: ${row.hasActivities ? 'YES' : 'MISSING'}`);
  console.log(`  Discussion Qs: ${row.hasDiscussionQs ? 'YES' : 'MISSING'}`);
  console.log(`  Assessment: ${row.hasAssessment ? 'YES' : 'MISSING'}`);
  console.log(`  Extensions: ${row.hasExtensions ? 'YES' : 'MISSING'}`);
  console.log(`  Curriculum: ${row.hasCurriculum ? 'YES' : 'MISSING'}`);
}

async function main() {
  console.log("=== UPDATING 2 LESSONS IN TURSO ===\n");

  for (const lesson of lessons) {
    await updateLesson(lesson);
  }

  console.log("\n\n=== VERIFYING IN TURSO ===");

  for (const lesson of lessons) {
    await verifyLesson(lesson.id);
  }

  console.log("\n\n=== DONE ===");
}

main().catch(console.error);
