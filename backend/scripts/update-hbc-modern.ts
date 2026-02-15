import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const hbcModernContent = {
  id: "cmligbkyc001dm20zsv5hrm6o",

  // 300-500 word narrative about HBC's transformation from fur trade to retail
  narrativeContent: `The Hudson's Bay Company (HBC) holds the distinction of being one of the oldest commercial corporations in the world still operating today. Founded on May 2, 1670, when King Charles II granted a royal charter to "The Governor and Company of Adventurers of England Trading into Hudson's Bay," the company has transformed dramatically over its more than 350-year history.

## The Charter and Rupert's Land

The original charter gave HBC exclusive trading rights over all lands whose rivers and streams drained into Hudson Bay. This enormous territory, named Rupert's Land after the king's cousin Prince Rupert, covered approximately 1.5 million square miles, representing nearly 40 percent of modern Canada. For two centuries, the company functioned not merely as a trading enterprise but as the governing authority over this vast region, administering justice, managing relations with Indigenous peoples, and controlling access to the interior.

## The 1870 Transfer to Canada

The company's role as a quasi-governmental power ended in 1870 when HBC surrendered Rupert's Land to the newly formed Dominion of Canada for 300,000 pounds, plus rights to land around its trading posts and one-twentieth of the fertile prairie belt. This transfer fundamentally changed both the company and the nation, opening western Canada to settlement and forcing HBC to reimagine its purpose.

## Transition to Retail

Following the land transfer, HBC gradually shifted its focus from furs to general merchandise. The company's trading posts evolved into retail stores serving the growing settlements across western Canada. By 1912, HBC had begun constructing grand department stores in major cities. The flagship Calgary store opened in 1913, followed by stores in Vancouver, Victoria, Edmonton, and Winnipeg. These ornate buildings with their distinctive HBC architecture became landmarks in their communities.

## The Iconic Point Blanket

Throughout these changes, certain HBC traditions endured. The famous Hudson's Bay point blanket, introduced around 1800, became a symbol of Canadian heritage. These wool blankets, with their distinctive cream color and green, red, yellow, and indigo stripes, remain popular today. The "points," originally woven into the blanket to indicate size, became part of HBC's enduring identity.

## Modern HBC

The twentieth century brought further transformations. HBC purchased established retailers including Zellers and Simpsons. In 2008, the company became a private enterprise, later returning to public markets. Through multiple ownership changes, including acquisition by NRDC Equity Partners and later by various investment groups, HBC has persisted as a retail presence across Canada. Today, Hudson's Bay stores continue serving customers, connecting a modern shopping experience to a heritage stretching back to the founding of the fur trade itself.`,

  heroImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/HBC_point_blanket.jpg?width=800",

  images: [
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Hudson%27s_Bay_Company_Store_Calgary_1913.jpg?width=800",
      caption: "The Hudson's Bay Company department store in Calgary, opened in 1913, representing HBC's transition from fur trading to modern retail",
      credit: "Wikimedia Commons"
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/HBC_point_blanket.jpg?width=800",
      caption: "The iconic Hudson's Bay point blanket with its distinctive stripes, a tradition dating back to around 1800",
      credit: "Wikimedia Commons"
    }
  ],

  keyFigures: [
    {
      name: "George Simpson",
      role: "Governor of Rupert's Land",
      years: "1786-1860",
      description: "The 'Little Emperor' who governed HBC territories for nearly four decades, overseeing the company during its peak fur trade era and setting the stage for its eventual transformation",
      explorerId: "cmlijai0q0003m22r2hk84pe9"
    },
    {
      name: "James Douglas",
      role: "Chief Factor and Colonial Governor",
      years: "1803-1877",
      description: "Rose through HBC ranks to become Governor of Vancouver Island and British Columbia, embodying the transition from commercial enterprise to colonial government",
      explorerId: "cmlijaicv0005m22r4caohonp"
    },
    {
      name: "Henry Kelsey",
      role: "Explorer and Early Trader",
      years: "1667-1724",
      description: "One of the first HBC employees to venture inland, establishing the patterns of exploration and Indigenous partnership that would define the company for generations",
      explorerId: "cmlhc4gsr0007m2ogrr0m8vqf"
    }
  ],

  timeline: [
    {
      year: 1670,
      title: "HBC Royal Charter",
      description: "King Charles II grants the Hudson's Bay Company exclusive trading rights over Rupert's Land, establishing one of the world's most enduring commercial enterprises",
      eventId: "cmligbkyo001im20zj2yavaqt"
    },
    {
      year: 1821,
      title: "HBC-NWC Merger",
      description: "After decades of fierce competition, the Hudson's Bay Company and North West Company merge, creating a fur trade monopoly across British North America",
      eventId: "cmligbkzk001tm20z7riv5nwi"
    },
    {
      year: 1870,
      title: "Rupert's Land Transfer",
      description: "HBC surrenders its territorial claims to Canada for 300,000 pounds, ending the company's governmental role and beginning its transformation into a retail enterprise",
      eventId: "cmligbkzp001vm20zk567ec16"
    },
    {
      year: 1913,
      title: "First Downtown Department Store",
      description: "HBC opens its grand Calgary department store, marking the company's full transition from frontier trading posts to modern urban retail destinations",
      eventId: null
    },
    {
      year: 1970,
      title: "HBC Celebrates 300 Years",
      description: "The Hudson's Bay Company marks three centuries of continuous operation, one of only a handful of companies worldwide to achieve such longevity",
      eventId: null
    }
  ],

  teacherObjectives: [
    "Students will understand how the 1670 Royal Charter established HBC's control over Rupert's Land and created a unique corporate-governmental hybrid",
    "Students will analyze how the 1870 transfer of Rupert's Land to Canada transformed both the company and the nation",
    "Students will trace HBC's evolution from fur trade to retail, identifying key turning points in this transformation",
    "Students will evaluate the significance of HBC artifacts like the point blanket in maintaining corporate identity across centuries",
    "Students will assess how ownership changes and market forces have shaped HBC's modern identity while preserving historical connections"
  ],

  teacherActivities: [
    {
      title: "Then and Now Comparison",
      description: "Students research and compare HBC trading posts from the fur trade era with modern Hudson's Bay retail stores. Create visual presentations showing architectural changes, product offerings, and customer experiences across different eras.",
      materials: "Historical images of trading posts, photos of modern stores, presentation software, comparison chart templates",
      duration: "45 minutes"
    },
    {
      title: "Point Blanket Design Analysis",
      description: "Students examine the history and symbolism of the HBC point blanket. Discuss how design elements like the stripes and points served practical purposes while becoming symbols of Canadian heritage. Students design their own blanket pattern reflecting their community's heritage.",
      materials: "Images of point blankets, design paper, colored pencils, information sheets about blanket history",
      duration: "35 minutes"
    },
    {
      title: "Corporate Timeline Project",
      description: "Working in groups, students create an illustrated timeline spanning 1670 to present day, highlighting key moments in HBC's transformation. Include fur trade era, land transfer, retail expansion, and modern ownership changes.",
      materials: "Timeline templates, historical reference materials, illustration supplies, corporate history resources",
      duration: "50 minutes"
    },
    {
      title: "Business Transformation Case Study",
      description: "Students analyze HBC as a case study in corporate adaptation. Discuss how the company survived by changing its core business model while maintaining brand identity. Compare with other long-lasting companies.",
      materials: "Case study handouts, discussion questions, examples of other enduring companies (e.g., Lloyd's, Beretta)",
      duration: "40 minutes"
    }
  ],

  teacherQuestions: [
    "Why was the 1670 charter so significant, granting a private company control over territory larger than most European nations?",
    "How did the 1870 transfer of Rupert's Land affect both the Hudson's Bay Company and Indigenous peoples living in the territory?",
    "What factors enabled HBC to successfully transition from fur trading to retail when many similar companies failed?",
    "Why has the HBC point blanket remained popular for over 200 years, and what does it represent to different groups of people?",
    "How did the construction of grand department stores in the early 1900s represent a new chapter in HBC's history?",
    "What challenges has HBC faced in the modern retail environment, and how has the company responded?",
    "What can other businesses learn from HBC's 350-year history of adaptation and survival?"
  ],

  teacherNotes: `This lesson explores how the Hudson's Bay Company transformed from a fur trading monopoly into a modern retail chain, making it one of the world's oldest continuously operating companies.

Key teaching points:
- The 1670 charter created an unprecedented corporate-governmental entity controlling vast North American territory
- The 1870 land transfer marked a fundamental shift from territorial governance to commercial enterprise
- HBC's transition to retail occurred gradually, with trading posts evolving into stores serving settler communities
- The grand department stores of the early 1900s represented HBC's embrace of modern retail culture
- Enduring symbols like the point blanket maintain connections between the company's past and present

Sensitive considerations:
- The original charter granted rights over Indigenous lands without Indigenous consent or consultation
- The 1870 transfer had profound negative consequences for Indigenous peoples and Metis communities
- The point blanket has complex meanings for Indigenous peoples, representing both trade relationships and colonization
- Discuss how Indigenous perspectives on HBC's history may differ from corporate narratives

Cross-curricular connections:
- Business Studies: corporate longevity, business model transformation, brand management
- Geography: Rupert's Land boundaries, Canadian territorial development
- Economics: monopolies, retail evolution, market adaptation
- History: colonialism, Canadian Confederation, Indigenous-European relations
- Design: textile history, brand identity, visual symbolism

Assessment ideas:
- Research project comparing HBC's fur trade era operations with its modern retail business
- Analysis of how the 1870 land transfer affected different stakeholder groups
- Business case study on corporate adaptation and survival strategies
- Creative project designing products that connect HBC's heritage to contemporary markets`
};

async function updateHBCModern() {
  console.log("=== UPDATING 'The Hudson's Bay Company: From Fur Trade to Modern Retail' IN TURSO ===\n");

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
        hbcModernContent.narrativeContent,
        hbcModernContent.heroImageUrl,
        JSON.stringify(hbcModernContent.images),
        JSON.stringify(hbcModernContent.keyFigures),
        JSON.stringify(hbcModernContent.timeline),
        JSON.stringify(hbcModernContent.teacherObjectives),
        JSON.stringify(hbcModernContent.teacherActivities),
        JSON.stringify(hbcModernContent.teacherQuestions),
        hbcModernContent.teacherNotes,
        hbcModernContent.id
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
      args: [hbcModernContent.id]
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
    console.error("Error updating HBC Modern Retail topic:", error);
    throw error;
  }
}

updateHBCModern()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to update:", error);
    process.exit(1);
  });
