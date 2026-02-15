import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const fallNewFranceContent = {
  id: "cmliiajdv000jm2u2f2sgv1nj",

  // 300-500 word narrative about the British conquest of New France
  narrativeContent: `The fall of New France in 1760 marked the end of French colonial ambitions in North America and fundamentally transformed the fur trade. This momentous change emerged from the Seven Years' War, a global conflict that pitted Britain against France across multiple continents.

## The Seven Years' War Context

By the 1750s, French and British colonial interests had been clashing for decades. Both powers competed for control of the Ohio Valley, the Great Lakes region, and access to the lucrative fur trade. The Seven Years' War (1756-1763), known in North America as the French and Indian War, would settle this contest definitively. France's colonial holdings, though vast, were thinly populated compared to the British colonies, making defense increasingly difficult.

## The Battle of the Plains of Abraham

The war's decisive moment came on September 13, 1759, when British forces under General James Wolfe scaled the cliffs below Quebec City under cover of darkness. The French commander, the Marquis de Montcalm, chose to engage immediately rather than wait for reinforcements. The battle lasted only fifteen minutes, but both generals fell mortally wounded. British victory on the Plains of Abraham gave them control of Quebec, the heart of New France.

## The Surrender of Montreal

Despite losing Quebec, the French held out for another year. However, surrounded by three converging British armies, Montreal's Governor Vaudreuil surrendered on September 8, 1760. The capitulation transferred all French territory in Canada to British control. The Treaty of Paris in 1763 formalized this conquest, ending French sovereignty in North America except for small fishing islands off Newfoundland.

## Impacts on French Canadians

French Canadians, known as Canadiens, found themselves subjects of a Protestant British Crown. The British initially faced the challenge of governing sixty thousand French-speaking Catholics. The Quebec Act of 1774 eventually guaranteed religious freedom and French civil law, but the conquest created lasting tensions that shaped Canadian identity.

## Impacts on Indigenous Allies

Indigenous nations allied with the French suddenly lost their European partners. The Odawa, Ojibwe, Huron-Wendat, and other nations had maintained balanced relationships with the French, who depended on Indigenous alliances for the fur trade. British policies proved less accommodating, sparking resistance including Pontiac's Rebellion in 1763.

## Transformation of the Fur Trade

The conquest shifted fur trade control from French Montreal merchants to British hands. The Hudson's Bay Company, which had competed with French traders for nearly a century, now faced new Montreal-based British rivals who would form the North West Company. The trade's fundamental structure remained Indigenous-dependent, but management and profits now flowed through British networks.

## Lasting Legacy

The fall of New France created the framework for modern Canada as a nation with dual French-English heritage. Samuel de Champlain's original vision of a French empire in North America ended, but the society he founded endured, adapting to British rule while maintaining distinct language, religion, and customs that persist today.`,

  heroImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Benjamin_West_-_The_Death_of_General_Wolfe_-_WGA25267.jpg?width=800",

  images: [
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/A_view_of_the_taking_of_Quebec_13_September_1759.jpg?width=800",
      caption: "A view of the taking of Quebec, September 13, 1759, showing British ships on the St. Lawrence River",
      credit: "Wikimedia Commons"
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Nouvelle-France_map-en.svg?width=800",
      caption: "Map of New France at its greatest extent, showing the vast territory lost to Britain in 1760",
      credit: "Wikimedia Commons"
    }
  ],

  keyFigures: [
    {
      name: "Samuel de Champlain",
      role: "Founder of New France",
      years: "1567-1635",
      description: "Founded Quebec in 1608, establishing the French presence in North America that would endure for over 150 years until the British conquest",
      explorerId: "cmlhaslpl0004m2zhpjklxgyn"
    },
    {
      name: "Pierre Le Moyne d'Iberville",
      role: "French Military Commander",
      years: "1661-1706",
      description: "The greatest military hero of New France, his earlier victories against the English demonstrated French military capability before the final conquest",
      explorerId: "cmlijaieq000km22rlw2psvbd"
    }
  ],

  timeline: [
    {
      year: 1608,
      title: "Champlain Founds Quebec",
      description: "Samuel de Champlain establishes Quebec City, the capital of New France and center of the French fur trade"
    },
    {
      year: 1670,
      title: "HBC Charter",
      description: "The Hudson's Bay Company receives its royal charter, creating British competition for the French fur trade",
      eventId: "cmligbkyo001im20zj2yavaqt"
    },
    {
      year: 1759,
      title: "Battle of the Plains of Abraham",
      description: "British forces under Wolfe defeat the French under Montcalm outside Quebec City in the war's decisive battle"
    },
    {
      year: 1760,
      title: "Fall of Montreal",
      description: "Governor Vaudreuil surrenders Montreal to British forces, effectively ending French rule in North America"
    },
    {
      year: 1763,
      title: "Treaty of Paris",
      description: "France formally cedes all of Canada to Britain, ending 150 years of French colonial presence except for tiny fishing islands"
    }
  ],

  teacherObjectives: [
    "Students will explain the causes of the Seven Years' War in North America and why it proved decisive for French colonial ambitions",
    "Students will analyze the strategic importance of the Battle of the Plains of Abraham and its impact on the outcome of the war",
    "Students will evaluate the consequences of the British conquest for French Canadians, including cultural, religious, and political changes",
    "Students will assess how the fall of New France affected Indigenous nations who had allied with the French",
    "Students will describe how the conquest transformed the fur trade from French to British control and its implications for future development"
  ],

  teacherActivities: [
    {
      title: "Mapping the Conquest",
      description: "Students create maps showing the three British armies converging on Montreal in 1760, marking Quebec, Montreal, and key routes. Discuss why geographic factors made defense of New France so difficult.",
      materials: "Blank maps of eastern Canada, colored markers, route information cards, historical context handout",
      duration: "35 minutes"
    },
    {
      title: "Perspectives on Conquest",
      description: "Divide students into groups representing British officials, French Canadians, Indigenous allies, and fur traders. Each group writes journal entries describing how the conquest affects their community's future.",
      materials: "Perspective cards, primary source excerpts, writing templates, historical background documents",
      duration: "45 minutes"
    },
    {
      title: "Treaty of Paris Negotiation",
      description: "Students simulate peace negotiations, with teams representing Britain, France, and Indigenous nations. Consider territorial boundaries, religious rights, trade access, and Indigenous land claims.",
      materials: "Role cards with objectives, negotiation guidelines, map of North America, agreement template",
      duration: "50 minutes"
    },
    {
      title: "Before and After Analysis",
      description: "Students create comparison charts showing life in New France before 1760 versus after British rule: government, religion, language, trade, and Indigenous relations. Identify continuities and changes.",
      materials: "Comparison chart templates, information cards for each period, discussion rubric",
      duration: "40 minutes"
    }
  ],

  teacherQuestions: [
    "Why was New France vulnerable to British conquest despite controlling such vast territory in North America?",
    "How did the outcome of the Battle of the Plains of Abraham depend on tactical decisions made by both Wolfe and Montcalm?",
    "What challenges did British authorities face in governing a population that was almost entirely French-speaking and Catholic?",
    "How did Indigenous nations' relationships with European powers change after France was removed as a colonial power?",
    "Why did some aspects of French Canadian society, such as language and religion, survive under British rule while others changed?",
    "How did the conquest affect the structure and organization of the fur trade in the decades following 1760?",
    "What connections can be made between the fall of New France and the later development of Canadian identity as a bilingual nation?"
  ],

  teacherNotes: `This lesson examines one of the most consequential events in Canadian history, with lasting implications for national identity, Indigenous relations, and the fur trade.

Key teaching points:
- The Seven Years' War was a global conflict; the North American theater was only one part of a worldwide struggle
- The Battle of the Plains of Abraham was militarily decisive but the conquest took another year to complete
- French Canadians faced genuine uncertainty about their future under Protestant British rule
- Indigenous nations lost important leverage when they could no longer play French against British interests
- The fur trade continued but under new management, eventually leading to the HBC-NWC rivalry

Sensitive considerations:
- Present the conquest from multiple perspectives, not solely as British triumph
- Acknowledge that French Canadians experienced genuine loss of sovereignty and cultural threat
- Indigenous nations were not passive observers but active participants whose strategic calculations changed dramatically
- Avoid presenting British rule as inevitably better or worse than French rule
- The Quebec Act of 1774 represented compromise, not simply British generosity

Cross-curricular connections:
- World History: the Seven Years' War as the first true "world war"
- Political Science: colonial administration, minority rights, cultural accommodation
- Geography: strategic importance of the St. Lawrence River and Quebec's location
- Canadian Studies: origins of bilingualism and biculturalism

Assessment ideas:
- Write newspaper accounts of the conquest from different colonial perspectives
- Analyze how the Treaty of Paris addressed (or failed to address) Indigenous concerns
- Create a documentary storyboard about the transition from French to British rule
- Compare the fall of New France to other colonial conquests in North American history`
};

async function updateFallNewFrance() {
  console.log("=== UPDATING 'The Fall of New France: 1760' IN TURSO ===\n");

  try {
    const result = await client.execute({
      sql: `UPDATE LessonPlan SET
        narrativeContent = ?,
        heroImageUrl = ?,
        images = ?,
        keyFigures = ?,
        timeline = ?,
        teacherObjectives = ?,
        teacherActivities = ?,
        teacherQuestions = ?,
        teacherNotes = ?
      WHERE id = ?`,
      args: [
        fallNewFranceContent.narrativeContent,
        fallNewFranceContent.heroImageUrl,
        JSON.stringify(fallNewFranceContent.images),
        JSON.stringify(fallNewFranceContent.keyFigures),
        JSON.stringify(fallNewFranceContent.timeline),
        JSON.stringify(fallNewFranceContent.teacherObjectives),
        JSON.stringify(fallNewFranceContent.teacherActivities),
        JSON.stringify(fallNewFranceContent.teacherQuestions),
        fallNewFranceContent.teacherNotes,
        fallNewFranceContent.id
      ]
    });

    console.log(`Update result: ${result.rowsAffected} row(s) affected\n`);

    // Verify the update
    console.log("=== VERIFYING UPDATE ===\n");

    const verifyResult = await client.execute({
      sql: `SELECT
        id, title, narrativeContent, heroImageUrl, images,
        keyFigures, timeline, teacherObjectives, teacherActivities,
        teacherQuestions, teacherNotes
      FROM LessonPlan WHERE id = ?`,
      args: [fallNewFranceContent.id]
    });

    const row = verifyResult.rows[0];
    if (!row) {
      console.log("ERROR: Topic not found after update!");
      return;
    }

    console.log(`Title: ${row.title}`);
    console.log(`ID: ${row.id}`);
    console.log(`\n--- narrativeContent ---`);

    const narrativeText = row.narrativeContent ? String(row.narrativeContent) : '';
    const wordCount = narrativeText.split(/\s+/).filter(w => w.length > 0).length;
    console.log(`Word count: ${wordCount} words`);
    console.log(`Status: ${wordCount >= 300 && wordCount <= 500 ? 'PASS (300-500 words)' : 'REVIEW NEEDED'}`);

    console.log(`\n--- heroImageUrl ---`);
    console.log(`Set: ${row.heroImageUrl ? 'Yes' : 'No'}`);
    if (row.heroImageUrl) console.log(`URL: ${row.heroImageUrl}`);

    console.log(`\n--- images ---`);
    const images = row.images ? JSON.parse(String(row.images)) : [];
    console.log(`Count: ${images.length} image(s)`);
    images.forEach((img: any, i: number) => {
      console.log(`  ${i + 1}. ${img.caption}`);
    });

    console.log(`\n--- keyFigures ---`);
    const keyFigures = row.keyFigures ? JSON.parse(String(row.keyFigures)) : [];
    console.log(`Count: ${keyFigures.length} figure(s)`);
    keyFigures.forEach((fig: any, i: number) => {
      console.log(`  ${i + 1}. ${fig.name} (${fig.role}) - explorerId: ${fig.explorerId || 'none'}`);
    });

    console.log(`\n--- timeline ---`);
    const timeline = row.timeline ? JSON.parse(String(row.timeline)) : [];
    console.log(`Count: ${timeline.length} event(s)`);
    timeline.forEach((evt: any, i: number) => {
      console.log(`  ${i + 1}. ${evt.year}: ${evt.title} - eventId: ${evt.eventId || 'none'}`);
    });

    console.log(`\n--- teacherObjectives ---`);
    const objectives = row.teacherObjectives ? JSON.parse(String(row.teacherObjectives)) : [];
    console.log(`Count: ${objectives.length} objective(s)`);
    objectives.forEach((obj: string, i: number) => {
      console.log(`  ${i + 1}. ${obj}`);
    });

    console.log(`\n--- teacherActivities ---`);
    const activities = row.teacherActivities ? JSON.parse(String(row.teacherActivities)) : [];
    console.log(`Count: ${activities.length} activity(ies)`);
    activities.forEach((act: any, i: number) => {
      console.log(`  ${i + 1}. ${act.title} (${act.duration})`);
    });

    console.log(`\n--- teacherQuestions ---`);
    const questions = row.teacherQuestions ? JSON.parse(String(row.teacherQuestions)) : [];
    console.log(`Count: ${questions.length} question(s)`);
    questions.forEach((q: string, i: number) => {
      console.log(`  ${i + 1}. ${q}`);
    });

    console.log(`\n--- teacherNotes ---`);
    console.log(`Set: ${row.teacherNotes ? 'Yes' : 'No'}`);
    if (row.teacherNotes) {
      const notesWordCount = String(row.teacherNotes).split(/\s+/).filter(w => w.length > 0).length;
      console.log(`Word count: ${notesWordCount} words`);
    }

    console.log("\n=== UPDATE COMPLETE ===");

  } catch (error) {
    console.error("Error updating The Fall of New France: 1760:", error);
    throw error;
  }
}

updateFallNewFrance()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to update:", error);
    process.exit(1);
  });
