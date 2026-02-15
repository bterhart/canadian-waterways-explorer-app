import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const fortsContent = {
  id: "cmliiajcm0009m2u2xpwxzc17",

  // 300-500 word narrative about Forts of the Fur Trade
  narrativeContent: `Fur trade posts and forts were the physical anchors of a vast commercial network that spanned North America. These establishments ranged from small, crude wintering houses to imposing stone fortifications, each designed to facilitate trade with Indigenous peoples and serve as bases for exploration and transportation. Understanding these posts reveals how geography, competition, and Indigenous preferences shaped the fur trade.

## Types of Posts

The Hudson's Bay Company and North West Company developed distinct approaches to post construction. HBC coastal factories like York Factory were substantial establishments built on permafrost, featuring multiple warehouses, workshops, and residences designed to withstand Arctic conditions. These posts received annual supply ships and served as hubs for the inland trade. The North West Company favored smaller inland posts positioned deep in beaver country, closer to Indigenous trappers. Fort William on Lake Superior became the NWC's grand headquarters, featuring a great hall where partners gathered each summer amid Indigenous encampments numbering thousands.

## Strategic Locations

Post locations were never accidental. Traders built where rivers met, at portage points, and along major travel routes. Cumberland House, established by Samuel Hearne in 1774, marked the HBC's first inland post and sat strategically on the Saskatchewan River system. Fort Chipewyan, founded by Peter Pond in 1788, commanded the entrance to the Athabasca country, the richest beaver territory on the continent. Control of such locations meant control of trade.

## Life Inside the Posts

A typical post contained several key buildings: a trading store where furs were exchanged for goods, warehouses for storing pelts and merchandise, a factor's or bourgeois's residence, quarters for workers, a blacksmith shop, and often a small farm with gardens and livestock. Posts were multicultural spaces where Scots traders, French-Canadian voyageurs, Indigenous women who married traders, and visiting Indigenous families all interacted. Trade ceremonies, gift-giving, and negotiations followed Indigenous protocols that European traders learned to respect.

## Competition and Consolidation

During the fierce competition between 1780 and 1821, rival posts often stood within sight of each other, each trying to intercept Indigenous traders. After the merger of 1821, Governor George Simpson ruthlessly closed redundant posts while strengthening strategic ones. James Douglas later expanded the post system into the Pacific Northwest, building a network that would form the foundation of British Columbia.

## Heritage Sites Today

Several fur trade posts survive as heritage sites. Lower Fort Garry near Winnipeg preserves the only intact stone HBC post. Fort William Historical Park recreates the NWC's grand rendezvous center. Fort Edmonton shows the evolution of a post from palisaded trade center to modern city. These sites offer windows into the daily realities of fur trade life, from the grandeur of the great hall to the cramped quarters of ordinary workers.`,

  heroImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Fort_William_Historical_Park.jpg?width=800",

  images: [
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/York_Factory_1853.jpg?width=800",
      caption: "York Factory on Hudson Bay, the great HBC depot that received annual supply ships from England",
      credit: "Wikimedia Commons"
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Fort_Garry_1884.jpg?width=800",
      caption: "Lower Fort Garry, the only intact stone fort from the fur trade era, near modern Winnipeg",
      credit: "Wikimedia Commons"
    }
  ],

  keyFigures: [
    {
      name: "George Simpson",
      role: "HBC Governor",
      years: "1787-1860",
      description: "As Governor of the HBC after the 1821 merger, Simpson reorganized the fur trade's post system, closing redundant establishments and strengthening strategic locations across the continent.",
      explorerId: "cmlijai0q0003m22r2hk84pe9"
    },
    {
      name: "Samuel Hearne",
      role: "Explorer and Post Builder",
      years: "1745-1792",
      description: "Established Cumberland House in 1774, the HBC's first inland post, breaking the company's reliance on coastal trade and beginning its expansion into the interior.",
      explorerId: "cmlhaslq40007m2zhtmgblh1t"
    },
    {
      name: "Peter Pond",
      role: "Trader and Explorer",
      years: "1740-1807",
      description: "Founded Fort Chipewyan in 1788 at the gateway to the Athabasca country, opening the richest fur territory in North America to systematic trade.",
      explorerId: "cmlhc4gt7000bm2ogmjjkr2c4"
    },
    {
      name: "James Douglas",
      role: "HBC Chief Factor",
      years: "1803-1877",
      description: "Expanded the fur trade post system into the Pacific Northwest, establishing Fort Victoria and other posts that would form the foundation of British Columbia.",
      explorerId: "cmlijaicv0005m22r4caohonp"
    }
  ],

  timeline: [
    {
      year: "1670",
      title: "HBC Charter Granted",
      description: "King Charles II grants the Hudson's Bay Company exclusive trading rights over all lands draining into Hudson Bay, establishing the framework for coastal factory system",
      eventId: "cmligbkyo001im20zj2yavaqt"
    },
    {
      year: "1774",
      title: "Cumberland House Established",
      description: "Samuel Hearne builds the HBC's first inland post on the Saskatchewan River, marking the company's expansion beyond its coastal factories into the interior",
      eventId: "cmligbkz2001mm20zq12u41re"
    },
    {
      year: "1778",
      title: "Fort Chipewyan Founded",
      description: "Peter Pond establishes Fort Chipewyan in the Athabasca country, opening the richest beaver territory on the continent and creating a strategic gateway to the far northwest"
    },
    {
      year: "1803",
      title: "Fort William Headquarters",
      description: "Fort William on Lake Superior becomes the North West Company's grand headquarters, site of annual summer rendezvous where partners, clerks, and Indigenous traders gathered by the thousands"
    },
    {
      year: "1821",
      title: "HBC-NWC Merger",
      description: "The merger of rival companies leads to consolidation of the post system under George Simpson, who closes redundant posts while strengthening strategic locations",
      eventId: "cmligbkzk001tm20z7riv5nwi"
    }
  ],

  teacherObjectives: [
    "Students will identify different types of fur trade posts (coastal factories, inland posts, headquarters) and explain their distinct functions within the trade network",
    "Students will analyze how geographic factors (river confluences, portage points, access to resources) determined post locations",
    "Students will describe the buildings and social organization within a typical fur trade post",
    "Students will evaluate how competition between the HBC and NWC shaped post development and ultimately led to consolidation",
    "Students will connect surviving heritage sites to the historical posts they preserve"
  ],

  teacherActivities: [
    {
      title: "Fort Design Challenge",
      description: "Students design their own fur trade post given a specific location and constraints. They must include essential buildings, consider defense, access to water, and space for Indigenous visitors. Groups present their designs and justify their choices.",
      materials: "Graph paper, colored pencils, list of required buildings, sample fort layouts, topographic map showing proposed location",
      duration: "50 minutes"
    },
    {
      title: "Location Analysis",
      description: "Using maps, students analyze why specific posts were built where they were. They examine Cumberland House, Fort Chipewyan, and Fort William, identifying geographic advantages, trade routes, and strategic considerations.",
      materials: "Historical and modern maps, river system diagrams, compass roses, analysis worksheet",
      duration: "40 minutes"
    },
    {
      title: "Virtual Fort Tour",
      description: "Using online resources from Parks Canada and heritage sites, students take virtual tours of Lower Fort Garry, Fort William Historical Park, and other preserved sites. They create comparison charts noting similarities and differences.",
      materials: "Computer access, virtual tour links, comparison chart template, observation questions",
      duration: "45 minutes"
    },
    {
      title: "Post Life Role Play",
      description: "Students take on roles within a fur trade post (factor, clerk, blacksmith, voyageur, Indigenous trader, fur trade wife) and simulate a day during trading season, experiencing the social dynamics and work of post life.",
      materials: "Role cards with daily responsibilities, trade goods props, trading scenarios, period images",
      duration: "55 minutes"
    }
  ],

  teacherQuestions: [
    "Why did the HBC initially rely on coastal factories while the NWC built posts deep in the interior? What were the advantages and disadvantages of each strategy?",
    "How did Indigenous peoples influence where posts were built and how they operated? Why was this influence so significant?",
    "What does the layout of a fur trade post reveal about social hierarchies and the organization of work?",
    "Why was Fort Chipewyan's location at the entrance to the Athabasca country so strategically important?",
    "How did the competition between HBC and NWC posts affect Indigenous traders? Did competition help or harm them?",
    "After the 1821 merger, why did George Simpson close so many posts? What criteria might he have used to decide which posts to keep?",
    "What can we learn from visiting preserved fur trade posts today that we cannot learn from written records alone?"
  ],

  teacherNotes: `This lesson explores fur trade posts as physical and social spaces that reveal how geography, competition, and cross-cultural relationships shaped the trade.

Key teaching points:
- Post locations were determined by geography (river systems, portage routes) and Indigenous trade patterns
- HBC and NWC developed different post strategies reflecting their different business models
- Posts were multicultural spaces where European, Indigenous, and Metis peoples lived and worked together
- Competition led to redundant posts that were consolidated after the 1821 merger
- Surviving heritage sites offer tangible connections to fur trade history

Sensitive considerations:
- Acknowledge that posts were often built on Indigenous lands without consent
- Discuss the complex roles of Indigenous women who lived in posts as wives and cultural intermediaries
- Present Indigenous peoples as active participants who influenced post operations, not passive recipients of European trade
- Note that some posts became sites of exploitation and disease transmission

Cross-curricular connections:
- Geography: river systems, portage routes, strategic locations, mapping skills
- Architecture: building design, materials, adaptation to climate
- Social Studies: economic systems, cultural interaction, colonialism
- Mathematics: scale drawings, distance calculations, trade ratios

Heritage site connections:
- Lower Fort Garry (Manitoba): Only intact stone HBC post
- Fort William Historical Park (Ontario): Recreated NWC headquarters
- Fort Edmonton Park (Alberta): Shows post evolution over time
- Fort Langley (British Columbia): Pacific coast trade post
- York Factory National Historic Site (Manitoba): Arctic coast factory

Extension activities:
- Research the daily routine of different workers at a fur trade post
- Compare post layouts across different regions and time periods
- Investigate what archaeological excavations have revealed about post life
- Study how Indigenous communities remember and interpret nearby posts

Assessment ideas:
- Design and annotate a fur trade post for a specific location
- Write diary entries from perspectives of different post inhabitants
- Create a timeline showing the evolution of a specific post
- Compare primary sources describing the same post from different perspectives`
};

async function updateForts() {
  console.log("=== UPDATING 'Forts of the Fur Trade' IN TURSO ===\n");

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
        fortsContent.narrativeContent,
        fortsContent.heroImageUrl,
        JSON.stringify(fortsContent.images),
        JSON.stringify(fortsContent.keyFigures),
        JSON.stringify(fortsContent.timeline),
        JSON.stringify(fortsContent.teacherObjectives),
        JSON.stringify(fortsContent.teacherActivities),
        JSON.stringify(fortsContent.teacherQuestions),
        fortsContent.teacherNotes,
        fortsContent.id
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
      args: [fortsContent.id]
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
    console.error("Error updating Forts of the Fur Trade:", error);
    throw error;
  }
}

updateForts()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to update:", error);
    process.exit(1);
  });
