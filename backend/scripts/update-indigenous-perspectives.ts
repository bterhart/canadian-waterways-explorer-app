import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const indigenousPerspectivesContent = {
  id: "cmliiajd7000cm2u2r8ta6amg",

  // 300-500 word narrative about Indigenous perspectives on European contact
  narrativeContent: `Long before European sails appeared on the horizon, Indigenous peoples had built sophisticated trade networks spanning the continent. These networks moved goods, ideas, and technologies across vast distances, connecting nations from the Pacific to the Atlantic. The fur trade did not create Indigenous commerce; it intersected with systems already centuries old.

## Pre-Contact Trade Networks

Indigenous trade routes followed waterways and overland trails linking diverse nations. Copper from Lake Superior reached the Gulf Coast. Obsidian from the Rockies traveled to the Great Plains. Dentalium shells from the Pacific served as currency far inland. These networks demonstrated advanced economic thinking, with specialized production, credit systems, and diplomatic protocols governing exchange between nations.

## First Encounters

Initial European contact brought curiosity, caution, and strategic calculation from Indigenous leaders. Many nations saw opportunities in the newcomers' metal goods, woven cloth, and novel technologies. Indigenous peoples approached trade as diplomatic relationships requiring ceremony, gift exchange, and mutual obligation. Europeans often misunderstood these protocols, interpreting them through their own transactional frameworks.

## Indigenous Agency and Strategy

Indigenous peoples were not passive recipients of European trade. They actively shaped the fur trade's development, directing Europeans to valuable territories, teaching survival skills, and negotiating terms of exchange. Women like Thanadelthur brokered peace between nations to expand trade networks. Leaders like Matonabbee guided expeditions while advancing their own peoples' interests. Chiefs like Peguis and Crowfoot negotiated strategically with competing European powers.

## Cultural Exchange and Exploitation

The fur trade created genuine cultural exchange alongside exploitation. Indigenous peoples adopted useful technologies while maintaining cultural practices. European traders learned Indigenous languages, married Indigenous women, and adopted local customs for survival. However, the relationship was unequal. European diseases devastated populations with no immunity. Alcohol distribution caused social destruction. Missionaries attacked spiritual traditions.

## Impacts on Traditional Life

As the trade intensified, it transformed Indigenous economies. Hunting patterns shifted from subsistence to commercial production. Traditional territories faced pressure as beaver populations declined. Dependency on European goods grew as traditional crafts atrophied. Yet Indigenous peoples adapted continuously, incorporating new elements while preserving core values and relationships with the land.

## Centering Indigenous Voices

Understanding the fur trade requires centering Indigenous perspectives, recognizing Indigenous peoples as historical actors with their own goals, strategies, and agency. They were not simply trading partners or obstacles to European expansion but nations navigating profound change while working to protect their peoples, lands, and futures. Their descendants continue this work today, ensuring their ancestors' stories are told truthfully and respectfully.`,

  heroImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/The_Trapper%27s_Bride_-_Alfred_Jacob_Miller_-_1846.jpg?width=800",

  images: [
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Thanadelthur_plaque.jpg?width=800",
      caption: "Memorial plaque honoring Thanadelthur, the Chipewyan woman who brokered peace between her people and the Cree, enabling HBC expansion",
      credit: "Wikimedia Commons"
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Carte_de_l%27Am%C3%A9rique_septentrionale_et_partie_de_la_m%C3%A9ridionale.jpg?width=800",
      caption: "Early map of North America showing the vast territories where Indigenous trade networks operated long before European contact",
      credit: "Wikimedia Commons"
    }
  ],

  keyFigures: [
    {
      name: "Thanadelthur",
      role: "Chipewyan Peace Ambassador",
      years: "c.1697-1717",
      description: "A remarkable Chipewyan woman who escaped Cree captivity and brokered peace between her people and the Cree, opening northern trade routes for the HBC",
      explorerId: "cmlijaiex000mm22rseuv61do"
    },
    {
      name: "Matonabbee",
      role: "Chipewyan Trade Captain",
      years: "c.1737-1782",
      description: "A skilled diplomat and guide who led Samuel Hearne to the Coppermine River, demonstrating Indigenous geographic knowledge and leadership",
      explorerId: "cmlijaiez000nm22r1ou598s9"
    },
    {
      name: "Chief Peguis",
      role: "Saulteaux Leader",
      years: "c.1774-1864",
      description: "A diplomatic leader who helped Selkirk colonists survive, later advocating strongly for Indigenous land rights as settlement expanded",
      explorerId: "cmlijaifk000sm22rva4ktjom"
    },
    {
      name: "Crowfoot",
      role: "Blackfoot Confederacy Chief",
      years: "c.1830-1890",
      description: "A visionary Siksika chief who navigated the transition from fur trade to treaties, working to secure his people's future during profound change",
      explorerId: "cmlijaifh000rm22rettbduta"
    },
    {
      name: "Akaitcho",
      role: "Yellowknives Dene Leader",
      years: "c.1786-1838",
      description: "A respected chief who guided John Franklin's first Arctic expedition, providing essential knowledge and resources for European exploration",
      explorerId: "cmlijaif2000om22ru83xdxmj"
    }
  ],

  timeline: [
    {
      year: 1000,
      title: "Pre-Contact Trade Networks",
      description: "Indigenous peoples maintain extensive trade networks across North America, exchanging goods, technologies, and ideas between nations",
      eventId: null
    },
    {
      year: 1670,
      title: "HBC Charter Granted",
      description: "The Hudson's Bay Company receives its royal charter, claiming lands Indigenous peoples had inhabited for millennia",
      eventId: "cmligbkyo001im20zj2yavaqt"
    },
    {
      year: 1715,
      title: "Thanadelthur's Peace",
      description: "Thanadelthur brokers peace between the Chipewyan and Cree peoples, demonstrating Indigenous diplomatic agency in shaping the trade",
      eventId: "cmligbkyx001km20z2112at07"
    },
    {
      year: 1821,
      title: "HBC-NWC Merger",
      description: "The merger ends competition that had benefited Indigenous traders, creating a monopoly that reduced Indigenous bargaining power",
      eventId: "cmligbkzk001tm20z7riv5nwi"
    }
  ],

  teacherObjectives: [
    "Students will recognize that Indigenous peoples had sophisticated trade networks and economic systems before European contact",
    "Students will analyze examples of Indigenous agency, strategy, and leadership in shaping the fur trade on their own terms",
    "Students will evaluate both the cultural exchanges and the exploitation that characterized Indigenous-European trade relationships",
    "Students will assess the impacts of the fur trade on traditional Indigenous ways of life, including both adaptations and disruptions",
    "Students will understand the importance of centering Indigenous voices and perspectives when studying this period of history"
  ],

  teacherActivities: [
    {
      title: "Pre-Contact Trade Network Mapping",
      description: "Students research and map Indigenous trade routes that existed before European contact. Identify goods traded (copper, obsidian, shells), the nations involved, and the diplomatic protocols that governed exchange. Compare these networks to European trade systems.",
      materials: "Blank maps of North America, research cards on Indigenous trade goods, colored markers, comparison worksheet",
      duration: "40 minutes"
    },
    {
      title: "Indigenous Leader Profile Project",
      description: "Students research one of the key Indigenous figures (Thanadelthur, Matonabbee, Peguis, Crowfoot, or Akaitcho). Create a presentation from that leader's perspective, explaining their goals, strategies, and how they worked to protect their people's interests.",
      materials: "Biography sources, presentation template, perspective-taking guide, peer evaluation rubric",
      duration: "45 minutes"
    },
    {
      title: "Two-Sided Trade Encounter",
      description: "Role-play a trade encounter from both Indigenous and European perspectives. One group prepares the Indigenous approach (ceremony, gift exchange, relationship building), another the European approach (transaction, profit focus). Discuss differences and misunderstandings.",
      materials: "Role cards, trade goods props, protocol guides for each culture, reflection questions",
      duration: "35 minutes"
    },
    {
      title: "Impact Analysis Timeline",
      description: "Create a timeline showing changes to Indigenous life during the fur trade era. Categorize changes as adaptations (adopted useful technologies), disruptions (disease, alcohol), or resistances (maintaining traditions). Discuss Indigenous resilience.",
      materials: "Timeline template, change category cards, primary source excerpts, discussion guide",
      duration: "40 minutes"
    }
  ],

  teacherQuestions: [
    "What evidence shows that Indigenous peoples had sophisticated trade networks before Europeans arrived, and what can we learn from these systems?",
    "How did Indigenous peoples demonstrate agency and strategic thinking in their interactions with European traders, rather than being passive participants?",
    "Why is Thanadelthur's story significant for understanding the role of Indigenous peoples, and especially Indigenous women, in the fur trade?",
    "How did Indigenous leaders like Matonabbee and Akaitcho use their knowledge and skills to advance their peoples' interests while working with Europeans?",
    "What were the differences between how Indigenous peoples and Europeans understood trade relationships, and how did these differences create misunderstandings?",
    "How did the fur trade both benefit and harm Indigenous communities, and how did Indigenous peoples adapt to these changes while maintaining their cultures?",
    "Why is it important to center Indigenous voices and perspectives when studying the fur trade, and how might the history look different from Indigenous viewpoints?"
  ],

  teacherNotes: `This lesson addresses one of the most important aspects of fur trade history: understanding events from Indigenous perspectives and recognizing Indigenous peoples as active historical agents rather than passive participants.

Key teaching approaches:
- Always present Indigenous peoples as nations with their own sophisticated political, economic, and social systems
- Emphasize Indigenous agency, strategy, and decision-making rather than portraying Indigenous peoples as victims or obstacles
- Use Indigenous names and terminology where possible, and acknowledge the diversity of Indigenous nations
- Recognize that Indigenous perspectives on this history may differ significantly from traditional Euro-Canadian narratives

Sensitive considerations:
- Be aware that Indigenous students may have family and community connections to this history
- Acknowledge ongoing impacts of colonization without reducing Indigenous peoples to victimhood
- Avoid the "noble savage" stereotype as much as the "savage" stereotype
- Recognize that the fur trade contributed to colonization that continues to affect Indigenous peoples today
- Some students may have misconceptions from outdated textbooks or media; address these respectfully

Language guidance:
- Use "Indigenous peoples" rather than "Indians" or "natives"
- Refer to specific nations (Cree, Chipewyan, Saulteaux) when possible rather than generic terms
- Avoid passive constructions that erase Indigenous agency (e.g., say "Indigenous peoples traded" not "furs were obtained from Indians")
- Be careful with terms like "discovery" that imply Indigenous peoples were not already present

Recommended resources:
- Consult with local Indigenous communities or educators about appropriate approaches
- Include Indigenous-authored sources and perspectives wherever possible
- Consider inviting Indigenous guest speakers to share their nations' perspectives
- Connect to contemporary Indigenous issues and communities when appropriate

Cross-curricular connections:
- Social Studies: Indigenous governance, treaty rights, contemporary Indigenous issues
- Geography: Indigenous territories, place names, environmental knowledge
- Economics: comparison of Indigenous and European trade systems
- Art/Culture: Indigenous artistic traditions, material culture, storytelling`
};

async function updateIndigenousPerspectives() {
  console.log("=== UPDATING 'Indigenous Perspectives on European Contact' IN TURSO ===\n");

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
        indigenousPerspectivesContent.narrativeContent,
        indigenousPerspectivesContent.heroImageUrl,
        JSON.stringify(indigenousPerspectivesContent.images),
        JSON.stringify(indigenousPerspectivesContent.keyFigures),
        JSON.stringify(indigenousPerspectivesContent.timeline),
        JSON.stringify(indigenousPerspectivesContent.teacherObjectives),
        JSON.stringify(indigenousPerspectivesContent.teacherActivities),
        JSON.stringify(indigenousPerspectivesContent.teacherQuestions),
        indigenousPerspectivesContent.teacherNotes,
        indigenousPerspectivesContent.id
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
      args: [indigenousPerspectivesContent.id]
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
    console.error("Error updating Indigenous Perspectives on European Contact:", error);
    throw error;
  }
}

updateIndigenousPerspectives()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to update:", error);
    process.exit(1);
  });
