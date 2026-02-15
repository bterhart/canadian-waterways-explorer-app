import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const womenFurTradeContent = {
  id: "cmligbky5001bm20zjl63dkn9",

  // 300-500 word narrative about women of the fur trade
  narrativeContent: `The fur trade could not have functioned without Indigenous women. Far from being minor figures, they were essential partners whose skills, knowledge, and connections made European trade networks possible. Yet for centuries, their contributions remained largely invisible in historical accounts written by European men.

## Essential Skills and Knowledge

Indigenous women possessed expertise that traders desperately needed. They prepared pemmican, the high-energy food that fueled voyageur brigades across vast distances. They tanned hides, made moccasins and snowshoes, and sewed the birchbark canoes that carried furs to market. Many women served as interpreters, translating not just words but entire cultural systems. Without these contributions, the fur trade would have collapsed.

## Diplomatic Bridges

Country marriages between traders and Indigenous women created kinship ties that bound trading companies to Indigenous nations. Women like Charlotte Small, who married explorer David Thompson, brought family connections that opened doors and ensured safe passage through territories. Her Cree knowledge guided Thompson's famous mapping expeditions across western Canada.

## Remarkable Individuals

Some women left their mark on history despite efforts to erase them. Thanadelthur, a Dene woman, walked for months through winter to reach York Factory, then brokered peace between the Cree and Dene nations in 1715, opening vast new trading territories for the Hudson's Bay Company. Marie-Anne Gaboury became one of the first European women to travel west of the Great Lakes, eventually becoming the grandmother of Louis Riel. Isabel Gunn disguised herself as a man to work at HBC posts for over a year before her discovery in 1807. Shawnadithit, the last known Beothuk person, provided invaluable records of her people's culture and history before her death in 1829.

## Hidden from History

Traditional histories focused on male explorers and company officials, treating women as background figures when they were mentioned at all. Country wives were often abandoned when traders returned east, their contributions forgotten. As the fur trade declined, many Indigenous women and their mixed-heritage children were pushed aside by colonial society.

## Recovering Lost Stories

Today, historians work to uncover women's stories from documents that rarely mentioned them directly. Archaeological evidence, oral histories, and careful reading between the lines of company records reveal the essential roles women played. These efforts restore Indigenous women to their rightful place as founders, builders, and sustainers of the fur trade world. Their legacy lives on in the Metis nation and in a more complete understanding of Canadian history.`,

  heroImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Frances_Anne_Hopkins_-_Canoe_Manned_by_Voyageurs_Passing_a_Waterfall.jpg?width=800",

  images: [
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Frances_Anne_Hopkins_-_Canoes_in_a_Fog,_Lake_Superior.jpg?width=800",
      caption: "Canoes in a Fog, Lake Superior by Frances Anne Hopkins, one of the few artists who depicted women in fur trade scenes",
      credit: "Wikimedia Commons"
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Interior_of_a_Cree_Indian_tent,_1820.jpg?width=800",
      caption: "Interior of a Cree tent showing the domestic space where Indigenous women worked preparing food, clothing, and trade goods",
      credit: "Wikimedia Commons"
    }
  ],

  keyFigures: [
    {
      name: "Thanadelthur",
      role: "Dene Diplomat",
      years: "c.1697-1717",
      description: "A Dene woman who escaped Cree captivity and brokered the historic peace between Cree and Dene nations in 1715, opening new trading territories",
      explorerId: "cmlijaiex000mm22rseuv61do"
    },
    {
      name: "Charlotte Small",
      role: "Cree Guide and Partner",
      years: "c.1785-1857",
      description: "David Thompson's Cree wife whose knowledge and family connections enabled his mapping expeditions across western Canada",
      explorerId: "cmlijaift000wm22r5rj3te9y"
    },
    {
      name: "Marie-Anne Gaboury",
      role: "Western Pioneer",
      years: "1780-1875",
      description: "One of the first European women to travel west of the Great Lakes, grandmother of Louis Riel, and matriarch of a significant Metis family",
      explorerId: "cmlijaifo000um22rf0tkyc67"
    },
    {
      name: "Isabel Gunn",
      role: "HBC Worker",
      years: "c.1780-1861",
      description: "A Scottish woman who disguised herself as a man to work for the Hudson's Bay Company, discovered after giving birth at Pembina in 1807",
      explorerId: "cmlijaifr000vm22rca2sltu0"
    },
    {
      name: "Shawnadithit",
      role: "Last Known Beothuk",
      years: "c.1801-1829",
      description: "The last known member of the Beothuk people who provided invaluable drawings and information about her nation's culture and history",
      explorerId: "cmlijaifm000tm22r6au3gchu"
    }
  ],

  timeline: [
    {
      year: 1715,
      title: "Thanadelthur's Peace",
      description: "Thanadelthur brokers peace between the Cree and Dene nations, opening vast new trading territories for the Hudson's Bay Company",
      eventId: "cmligbkyx001km20z2112at07"
    },
    {
      year: 1799,
      title: "Charlotte Small Marries David Thompson",
      description: "Charlotte Small marries explorer David Thompson in a country marriage; her Cree knowledge and connections will enable his mapping expeditions",
      eventId: null
    },
    {
      year: 1806,
      title: "Marie-Anne Gaboury Travels West",
      description: "Marie-Anne Gaboury becomes one of the first European women to travel west of the Great Lakes, beginning her life on the frontier",
      eventId: null
    },
    {
      year: 1807,
      title: "Isabel Gunn Discovered",
      description: "Isabel Gunn is discovered to be a woman after giving birth at the Pembina HBC post, having worked disguised as a man for over a year",
      eventId: null
    },
    {
      year: 1821,
      title: "HBC-NWC Merger",
      description: "The merger of the Hudson's Bay and North West Companies reshapes the fur trade; many country wives and their families face uncertain futures",
      eventId: "cmligbkzk001tm20z7riv5nwi"
    }
  ],

  teacherObjectives: [
    "Students will identify the essential roles Indigenous women played in the fur trade, including food preparation, clothing production, translation, and diplomatic connections",
    "Students will explain why country marriages were important for creating alliances between European traders and Indigenous nations",
    "Students will analyze specific contributions of notable women including Thanadelthur, Charlotte Small, Marie-Anne Gaboury, Isabel Gunn, and Shawnadithit",
    "Students will evaluate why women have been overlooked in traditional fur trade histories and how historians are working to recover their stories",
    "Students will recognize that the fur trade depended on Indigenous women's knowledge and labor in ways that were rarely acknowledged"
  ],

  teacherActivities: [
    {
      title: "Skills Inventory",
      description: "Students create an inventory of all the skills and knowledge Indigenous women contributed to the fur trade. For each skill (pemmican making, hide tanning, snowshoe construction, language interpretation), research the process and explain why it was essential for trade operations.",
      materials: "Skills chart template, images of items women made, process description sheets",
      duration: "35 minutes"
    },
    {
      title: "Biography Research Stations",
      description: "Set up stations for Thanadelthur, Charlotte Small, Marie-Anne Gaboury, Isabel Gunn, and Shawnadithit. Students rotate through stations, learning about each woman's unique story and contributions. Each station includes primary sources, images, and discussion questions.",
      materials: "Station cards with biographical information, primary source excerpts, reflection questions",
      duration: "40 minutes"
    },
    {
      title: "Hidden History Detective Work",
      description: "Students examine excerpts from fur trade journals and company records. Challenge them to find indirect evidence of women's contributions in documents that rarely mention women directly. Discuss why women were left out of official records and how historians uncover their stories.",
      materials: "Primary source excerpts, detective worksheet, magnifying glasses for effect",
      duration: "35 minutes"
    },
    {
      title: "Women's Voices Creative Writing",
      description: "Students write diary entries or letters from the perspective of a woman in the fur trade. Options include an Indigenous woman teaching a trader to make pemmican, Charlotte Small guiding David Thompson, or Shawnadithit documenting her people's stories.",
      materials: "Writing prompts, historical context cards, diary/letter templates",
      duration: "40 minutes"
    }
  ],

  teacherQuestions: [
    "What specific skills did Indigenous women contribute to the fur trade, and why couldn't European traders succeed without them?",
    "How did country marriages benefit both European trading companies and Indigenous nations beyond personal relationships?",
    "Why was Thanadelthur's diplomatic mission in 1715 so significant for the Hudson's Bay Company, and what does her story tell us about Indigenous women's roles?",
    "How did Charlotte Small's knowledge and family connections enable David Thompson's mapping expeditions?",
    "Why do you think traditional histories focused on male explorers while ignoring women's contributions?",
    "What challenges do historians face when trying to recover the stories of women who were rarely mentioned in official records?",
    "How might our understanding of Canadian history change if women's contributions to the fur trade had been properly documented from the beginning?"
  ],

  teacherNotes: `This lesson addresses a significant gap in traditional fur trade history by centering the essential contributions of Indigenous women. The topic requires sensitivity and careful framing.

Key teaching approaches:
- Present Indigenous women as active agents and essential partners, not passive figures or romantic interests
- Emphasize the practical skills and knowledge that made the fur trade possible
- Show how historical bias erased women's contributions and how scholars work to recover them
- Connect individual stories to larger patterns of women's roles in the fur trade

Important considerations:
- Country marriages were legitimate unions within Indigenous cultural contexts, not informal arrangements
- Many country wives were later abandoned when traders returned east; approach this reality with sensitivity
- Some students may have ancestors who were fur trade women; treat this history with respect
- Avoid romanticizing relationships that often involved significant power imbalances
- Shawnadithit's story involves genocide of her people; handle this with appropriate gravity

Vocabulary guidance:
- Use "country marriage" or "marriage a la facon du pays" rather than terms that delegitimize these unions
- Avoid possessive or diminishing language when describing women's roles
- Use "Indigenous women" rather than outdated terms

Cross-curricular connections:
- Art: Frances Anne Hopkins as a female artist documenting the fur trade
- Science: Skills like pemmican preparation, hide tanning, canoe construction
- Geography: Territories where key figures lived and traveled
- Social Studies: Gender roles in different cultures, historical bias in record-keeping

Assessment ideas:
- Compare treatment of women in different historical sources
- Research project on one notable fur trade woman
- Creative writing from women's perspectives
- Analysis of why certain stories were preserved while others were lost`
};

async function updateWomenFurTrade() {
  console.log("=== UPDATING 'Women of the Fur Trade' IN TURSO ===\n");

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
        womenFurTradeContent.narrativeContent,
        womenFurTradeContent.heroImageUrl,
        JSON.stringify(womenFurTradeContent.images),
        JSON.stringify(womenFurTradeContent.keyFigures),
        JSON.stringify(womenFurTradeContent.timeline),
        JSON.stringify(womenFurTradeContent.teacherObjectives),
        JSON.stringify(womenFurTradeContent.teacherActivities),
        JSON.stringify(womenFurTradeContent.teacherQuestions),
        womenFurTradeContent.teacherNotes,
        womenFurTradeContent.id
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
      args: [womenFurTradeContent.id]
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
    console.error("Error updating Women of the Fur Trade:", error);
    throw error;
  }
}

updateWomenFurTrade()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to update:", error);
    process.exit(1);
  });
