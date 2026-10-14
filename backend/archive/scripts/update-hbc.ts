import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const hbcContent = {
  id: "cmliiajcc0006m2u2n93x5b2b",

  // 300-500 word narrative about the Hudson's Bay Company
  narrativeContent: `The Hudson's Bay Company (HBC) stands as one of the most remarkable enterprises in history. Established by Royal Charter on May 2, 1670, King Charles II granted the company exclusive trading rights over all lands draining into Hudson Bay. This vast territory, named Rupert's Land after the king's cousin Prince Rupert, encompassed approximately 1.5 million square miles, nearly 40 percent of modern Canada.

## Early Coastal Trading Posts

For its first century, the HBC operated primarily from coastal trading posts on Hudson Bay and James Bay. Forts like York Factory, Moose Factory, and Albany became crucial exchange points where Indigenous peoples brought furs, particularly beaver pelts, to trade for European goods. This coastal strategy, known as "sleeping by the frozen sea," allowed the company to minimize expenses while Indigenous traders traveled vast distances to reach them.

## Expansion and Competition

The arrival of aggressive Montreal-based traders, who eventually formed the North West Company in 1779, forced the HBC to change its strategy. The Nor'Westers traveled inland to intercept furs before they reached Hudson Bay. In response, the HBC established Cumberland House in 1774, its first interior post, and began expanding westward. The rivalry between the two companies grew fierce, sometimes violent, until their merger in 1821 created a monopoly over the entire Canadian fur trade.

## The Made Beaver System

The HBC developed a sophisticated currency system using the "Made Beaver" (MB) as its standard unit. One Made Beaver equaled one prime beaver pelt in good condition. All trade goods and furs were valued in MB, creating a consistent economy across the vast trading network. A gun might cost twelve Made Beaver, while blankets or metal tools had their own established rates.

## Governance and Indigenous Relations

The company operated as both a commercial enterprise and a governing authority. Governor George Simpson, who controlled HBC operations from 1821 to 1860, oversaw a territory larger than most European nations. The company's success depended entirely on relationships with Indigenous peoples, who trapped the furs, provided food, and shared essential knowledge about the land. Many traders married Indigenous women, creating the Metis nation and establishing kinship networks that facilitated trade.

## From Furs to Retail

In 1870, the HBC surrendered Rupert's Land to the newly formed Canadian government for 300,000 pounds. The company then transformed itself, gradually shifting from fur trading to retail. Today, the Hudson's Bay Company survives as "The Bay," operating department stores across Canada. From a royal charter to modern retail, the HBC's 350-year journey reflects the transformation of Canada itself.`,

  heroImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Coat_of_arms_of_the_Hudson%27s_Bay_Company.svg?width=800",

  images: [
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/York_Factory_1853.jpg?width=800",
      caption: "York Factory, the Hudson's Bay Company's most important trading post on Hudson Bay, as it appeared in 1853",
      credit: "Wikimedia Commons"
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Hudson%27s_Bay_Company_Made_Beaver_Token_1854.png?width=800",
      caption: "A Hudson's Bay Company Made Beaver token, the currency used throughout the fur trade network",
      credit: "Wikimedia Commons"
    }
  ],

  keyFigures: [
    {
      name: "George Simpson",
      role: "Governor of Rupert's Land",
      years: "1786-1860",
      description: "Known as the 'Little Emperor,' Simpson governed HBC territories for nearly four decades, overseeing operations across a territory larger than Europe",
      explorerId: "cmlijai0q0003m22r2hk84pe9"
    },
    {
      name: "James Douglas",
      role: "Chief Factor and Colonial Governor",
      years: "1803-1877",
      description: "Rose from HBC trader to become the first Governor of British Columbia, bridging the company's commercial and political roles",
      explorerId: "cmlijaicv0005m22r4caohonp"
    },
    {
      name: "Henry Kelsey",
      role: "Explorer and Trader",
      years: "1667-1724",
      description: "First HBC employee to travel inland to the prairies, establishing relationships with Indigenous peoples and exploring the interior",
      explorerId: "cmlhc4gsr0007m2ogrr0m8vqf"
    },
    {
      name: "Samuel Hearne",
      role: "Explorer and Trader",
      years: "1745-1792",
      description: "Led expeditions overland to the Arctic Ocean and established Cumberland House, the HBC's first inland trading post",
      explorerId: "cmlhaslq40007m2zhtmgblh1t"
    },
    {
      name: "Thanadelthur",
      role: "Dene Interpreter and Peacemaker",
      years: "c.1697-1717",
      description: "A Chipewyan woman who brokered peace between the Cree and Dene peoples, enabling HBC expansion into new trading territories",
      explorerId: "cmlijaiex000mm22rseuv61do"
    }
  ],

  timeline: [
    {
      year: 1670,
      title: "HBC Royal Charter",
      description: "King Charles II grants the Hudson's Bay Company exclusive trading rights over all lands draining into Hudson Bay, creating Rupert's Land",
      eventId: "cmligbkyo001im20zj2yavaqt"
    },
    {
      year: 1774,
      title: "Cumberland House Established",
      description: "Samuel Hearne establishes the HBC's first inland trading post, marking the beginning of the company's expansion into the interior",
      eventId: "cmligbkz2001mm20zq12u41re"
    },
    {
      year: 1779,
      title: "North West Company Formed",
      description: "Montreal merchants unite to form the North West Company, creating fierce competition with the HBC for control of the fur trade",
      eventId: "cmligbkz5001nm20z0rm0kptu"
    },
    {
      year: 1821,
      title: "HBC-NWC Merger",
      description: "After years of violent competition, the Hudson's Bay Company and North West Company merge, creating a monopoly over the Canadian fur trade",
      eventId: "cmligbkzk001tm20z7riv5nwi"
    },
    {
      year: 1870,
      title: "Rupert's Land Transfer",
      description: "The HBC surrenders Rupert's Land to Canada for 300,000 pounds, ending the company's territorial governance and paving the way for western expansion",
      eventId: "cmligbkzp001vm20zk567ec16"
    }
  ],

  teacherObjectives: [
    "Students will understand how the 1670 Royal Charter established the HBC's vast territorial claims and trading monopoly",
    "Students will trace the evolution of HBC strategy from coastal trading posts to inland expansion in response to competition",
    "Students will analyze the Made Beaver currency system and explain how it structured the fur trade economy",
    "Students will evaluate the complex relationships between the HBC and Indigenous peoples, including trade partnerships and intermarriage",
    "Students will assess the significance of the 1821 merger and 1870 land transfer in shaping Canadian history"
  ],

  teacherActivities: [
    {
      title: "Mapping Rupert's Land",
      description: "Students use maps to trace the boundaries of Rupert's Land and identify how the watershed concept defined HBC territory. Compare this territory to modern Canadian provinces and discuss how a commercial charter shaped national boundaries.",
      materials: "Maps of Rupert's Land, watershed diagrams, modern Canadian maps, colored pencils for tracing boundaries",
      duration: "35 minutes"
    },
    {
      title: "Made Beaver Trading Simulation",
      description: "Students participate in a trading simulation using the Made Beaver system. Assign values to various goods (blankets, guns, kettles, beaver pelts) and have students negotiate trades, experiencing how this currency system functioned.",
      materials: "Trade goods cards with MB values, beaver pelt tokens, price list chart, trading post setting materials",
      duration: "40 minutes"
    },
    {
      title: "Primary Source Analysis",
      description: "Students examine excerpts from HBC trading post journals, the original 1670 charter, and accounts from company employees. Identify perspectives, biases, and what these sources reveal about daily life in the fur trade.",
      materials: "Printed primary source excerpts, analysis worksheets, guiding questions handout",
      duration: "30 minutes"
    },
    {
      title: "Timeline Construction",
      description: "Working in groups, students create an illustrated timeline of HBC history from 1670 to 1870. Include key events, significant figures, and turning points such as the NWC competition and merger.",
      materials: "Timeline template, illustration supplies, event cards, reference materials",
      duration: "45 minutes"
    }
  ],

  teacherQuestions: [
    "Why did King Charles II grant such vast territorial rights to a private trading company, and what does this reveal about European attitudes toward North American lands?",
    "How did the HBC's initial 'sleeping by the frozen sea' strategy work, and why did it eventually need to change?",
    "What made the Made Beaver system effective as a currency across such a vast trading network?",
    "How did competition with the North West Company transform the HBC's operations and territory?",
    "What roles did Indigenous peoples play in the HBC's success, beyond simply trapping furs?",
    "Why was the 1821 merger significant, and what were its consequences for both the fur trade and Indigenous peoples?",
    "How does the HBC's transformation from fur trading to modern retail reflect broader changes in Canadian society?"
  ],

  teacherNotes: `This lesson examines one of the most influential institutions in Canadian history. The Hudson's Bay Company was not merely a business but a governing authority that shaped territorial boundaries, economic systems, and cultural relations for over two centuries.

Key teaching points:
- The HBC charter granted private commercial control over territory larger than most European nations
- The company's success depended entirely on Indigenous knowledge, labor, and trading partnerships
- The Made Beaver system created one of the first standardized currency systems in North America
- Competition with the North West Company forced innovation but also led to violence and exploitation
- The 1870 land transfer fundamentally changed the relationship between Indigenous peoples and the Canadian state

Sensitive considerations:
- Acknowledge that the charter granted rights over Indigenous lands without Indigenous consent
- Discuss the complex nature of HBC-Indigenous relationships, including both beneficial partnerships and exploitation
- Recognize that many Indigenous communities were negatively impacted by the fur trade's eventual decline
- The Metis people, born from HBC trader-Indigenous marriages, faced significant challenges after 1870

Cross-curricular connections:
- Geography: watersheds, territorial boundaries, mapping concepts
- Economics: monopolies, currency systems, trade networks
- Political Science: colonial governance, charter companies, transfer of sovereignty
- Social Studies: cultural exchange, Metis identity, Indigenous-European relations

Assessment ideas:
- Write a charter for a new trading company, considering what rights and responsibilities it should have
- Compare the HBC and NWC from different perspectives (company, Indigenous trader, Metis family)
- Analyze the long-term consequences of the 1870 land transfer for Indigenous peoples
- Research the modern Hudson's Bay Company and trace connections to its historical origins`
};

async function updateHBC() {
  console.log("=== UPDATING 'The Hudson's Bay Company' IN TURSO ===\n");

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
        hbcContent.narrativeContent,
        hbcContent.heroImageUrl,
        JSON.stringify(hbcContent.images),
        JSON.stringify(hbcContent.keyFigures),
        JSON.stringify(hbcContent.timeline),
        JSON.stringify(hbcContent.teacherObjectives),
        JSON.stringify(hbcContent.teacherActivities),
        JSON.stringify(hbcContent.teacherQuestions),
        hbcContent.teacherNotes,
        hbcContent.id
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
      args: [hbcContent.id]
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
    console.error("Error updating The Hudson's Bay Company:", error);
    throw error;
  }
}

updateHBC()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to update:", error);
    process.exit(1);
  });
