import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const explorersShipsContent = {
  id: "cmliiajc30005m2u2rt6xuz2e",

  // 300-500 word narrative about European ships and exploration
  narrativeContent: `The ships that carried European explorers to North America were remarkable vessels that represented the height of maritime technology in their era. These wooden craft, powered by sail and guided by primitive navigation instruments, crossed thousands of miles of open ocean to reach the shores of a continent unknown to Europe. Without these ships and the sailors who manned them, the fur trade and European presence in Canada would never have been possible.

## Types of Exploration Vessels

European explorers used several types of ships depending on their mission. Caravels were small, highly maneuverable vessels favored by early explorers for coastal exploration. They could sail close to the wind and navigate shallow waters. Larger expeditions used galleons, which could carry more supplies and crew for longer voyages. Pinnaces served as smaller support vessels, often carried aboard larger ships and launched for shore exploration or navigating rivers too shallow for the main vessel.

## Famous Ships of Canadian Exploration

John Cabot reached Newfoundland in 1497 aboard the Matthew, a small vessel of only about fifty tons with a crew of eighteen. Jacques Cartier made three voyages to Canada between 1534 and 1542, commanding ships including the Grande Hermine. Henry Hudson sailed into Hudson Bay in 1610 aboard the Discovery, a ship of only fifty-five tons that had already crossed the Atlantic multiple times. Hudson never returned from this voyage, but his ship did, carrying the mutineers who had set him adrift.

## Navigational Challenges

Crossing the Atlantic was a dangerous undertaking. Navigators relied on compasses, astrolabes, and dead reckoning to estimate their position. They had no accurate way to measure longitude, making it difficult to know exactly how far east or west they had traveled. Storms could drive ships hundreds of miles off course. Icebergs posed deadly threats in northern waters. The voyage from England to Hudson Bay typically took two to three months, during which crews faced scurvy, shipwreck, and the ever-present danger of running out of food and fresh water.

## The Hudson's Bay Company Supply Ships

After the Hudson's Bay Company received its charter in 1670, annual supply ships became the lifeline connecting isolated trading posts with England. These vessels departed in summer, navigated through Hudson Strait during the brief ice-free season, delivered trade goods and provisions, loaded furs, and raced to return before ice closed the passage. The entire operation depended on precise timing and favorable weather. Ships that arrived late or encountered early ice might be trapped for the winter or lost entirely.

## Connecting Continents

These vessels served as floating bridges between two worlds. They carried European manufactured goods westward, including metal tools, cloth, and weapons that Indigenous peoples incorporated into their trade networks. Eastward, they transported beaver pelts and other furs that fueled the fashion industry and generated enormous profits. The ships made possible an economic connection that transformed both Indigenous and European societies.`,

  heroImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/The_Matthew_-_geograph.org.uk_-_277751.jpg?width=800",

  images: [
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Mayflower_in_Plymouth_Harbor,_by_William_Halsall.jpg?width=800",
      caption: "A period sailing ship similar to those used by early explorers crossing the Atlantic to North America",
      credit: "Wikimedia Commons"
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/HMS_Discovery_(1874).jpg?width=800",
      caption: "HMS Discovery, representing the tradition of British exploration vessels",
      credit: "Wikimedia Commons"
    }
  ],

  keyFigures: [
    {
      name: "John Cabot",
      role: "Explorer and Navigator",
      years: "c. 1450-1500",
      description: "Italian navigator who sailed the Matthew to reach Newfoundland in 1497, claiming the land for England and opening the North Atlantic fishery",
      explorerId: "cmlhci07j000sm2rxzbx1byj0"
    },
    {
      name: "Jacques Cartier",
      role: "French Explorer",
      years: "1491-1557",
      description: "Made three voyages to Canada between 1534 and 1542, exploring the St. Lawrence River and claiming the region for France",
      explorerId: "cmlhc4grf0001m2ogp7wnb7ss"
    },
    {
      name: "Henry Hudson",
      role: "English Explorer",
      years: "c. 1565-1611",
      description: "Explored Hudson Bay in 1610 aboard the Discovery, searching for the Northwest Passage before being set adrift by mutinous crew",
      explorerId: "cmlhc4grp0004m2ogg57dim4b"
    },
    {
      name: "Martin Frobisher",
      role: "English Explorer and Privateer",
      years: "c. 1535-1594",
      description: "Led three expeditions to the Arctic between 1576 and 1578, searching for the Northwest Passage and establishing early English claims in northern regions",
      explorerId: "cmlnewexp002frobisher"
    },
    {
      name: "Sir John Franklin",
      role: "Royal Navy Officer and Explorer",
      years: "1786-1847",
      description: "Led the ill-fated 1845 expedition to find the Northwest Passage, commanding HMS Erebus and HMS Terror, both of which became trapped in Arctic ice",
      explorerId: "cmlhaslq60008m2zhokwxq1v6"
    }
  ],

  timeline: [
    {
      year: 1497,
      title: "Cabot Reaches Newfoundland",
      description: "John Cabot sails the Matthew across the Atlantic and reaches Newfoundland, beginning English involvement in North America"
    },
    {
      year: 1534,
      title: "Cartier's First Voyage",
      description: "Jacques Cartier makes his first voyage to Canada, exploring the Gulf of St. Lawrence and claiming the land for France"
    },
    {
      year: 1610,
      title: "Hudson's Final Voyage",
      description: "Henry Hudson sails the Discovery into Hudson Bay, searching for the Northwest Passage before being set adrift by his crew"
    },
    {
      year: 1670,
      title: "HBC Charter Granted",
      description: "Hudson's Bay Company receives its royal charter, establishing regular supply ship routes between England and Hudson Bay",
      eventId: "cmligbkyo001im20zj2yavaqt"
    },
    {
      year: 1845,
      title: "Franklin Expedition Departs",
      description: "Sir John Franklin leads HMS Erebus and HMS Terror on his final expedition to find the Northwest Passage, from which no one returned"
    }
  ],

  teacherObjectives: [
    "Students will identify the main types of ships used in European exploration of Canada and explain the advantages of each design",
    "Students will describe the ships used by key explorers including Cabot, Cartier, Hudson, and Franklin and their historical significance",
    "Students will analyze the navigational challenges faced by sailors crossing the Atlantic Ocean in the fifteenth through nineteenth centuries",
    "Students will explain the importance of Hudson's Bay Company supply ships in maintaining the fur trade network",
    "Students will evaluate how maritime technology shaped the timeline and scope of European exploration in North America"
  ],

  teacherActivities: [
    {
      title: "Ship Design Comparison",
      description: "Students compare the characteristics of caravels, galleons, and pinnaces using diagrams and specifications. Create a chart showing the advantages and disadvantages of each type for different exploration missions.",
      materials: "Ship diagrams, comparison charts, exploration scenario cards",
      duration: "35 minutes"
    },
    {
      title: "Navigation Challenge",
      description: "Students attempt to navigate a simulated Atlantic crossing using only a compass, star charts, and dead reckoning. Calculate estimated position after several days of travel with limited information.",
      materials: "Compasses, simplified star charts, navigation worksheets, maps",
      duration: "40 minutes"
    },
    {
      title: "Voyage Planning Exercise",
      description: "Teams plan a supply voyage from England to Hudson Bay, considering timing, ice conditions, cargo capacity, crew needs, and potential hazards. Present plans and discuss trade-offs.",
      materials: "Maps showing ice conditions by month, supply lists, crew requirement sheets",
      duration: "45 minutes"
    },
    {
      title: "Explorer Ship Timeline",
      description: "Students create an illustrated timeline showing the ships of major explorers from Cabot through Franklin. Include key details about each vessel and its fate.",
      materials: "Timeline templates, ship images, colored pencils or markers",
      duration: "30 minutes"
    }
  ],

  teacherQuestions: [
    "Why were smaller ships like caravels often preferred for exploration despite their limited cargo capacity?",
    "What made the annual voyage to Hudson Bay so dangerous, and why did the Hudson's Bay Company continue to send ships despite the risks?",
    "How did navigational technology limit what explorers could accomplish, and how did sailors compensate for these limitations?",
    "What can we learn from the fate of Henry Hudson about the dangers and social dynamics of long sea voyages?",
    "How did the ships themselves shape what explorers could discover and where they could travel?",
    "Why was timing so critical for Hudson's Bay Company supply ships, and what happened when ships arrived late?",
    "How does the Franklin expedition demonstrate both the capabilities and limitations of nineteenth-century maritime technology?"
  ],

  teacherNotes: `This lesson connects maritime technology to the broader story of Canadian exploration and the fur trade. Ships were not just transportation but determined what was possible in terms of exploration, trade, and settlement.

Key teaching points:
- Maritime technology directly limited and enabled exploration possibilities
- Different ship designs served different purposes and had specific advantages
- Navigation was imprecise and dangerous before modern instruments
- The annual supply ship cycle was essential to Hudson's Bay Company operations
- Ship crews faced enormous risks including storms, ice, scurvy, and starvation

Historical context to emphasize:
- Atlantic crossings took months, not the hours of modern flights
- Ships were small by modern standards, carrying crews of only dozens on vessels of fifty to one hundred tons
- Ice in northern waters was a constant threat that limited the sailing season
- The same ships often made multiple voyages over many years

Connections to other topics:
- Link to specific explorer biographies through the keyFigures
- Connect to the HBC Charter timeline event showing how company operations depended on ships
- Discuss how ship technology evolved from Cabot's era to Franklin's time

Discussion extensions:
- Compare maritime exploration to space exploration in terms of risk, isolation, and technology dependence
- Discuss how Indigenous peoples navigated by canoe versus European ocean navigation
- Explore the human stories of sailors and crews on these voyages

Assessment ideas:
- Design a ship suited for a specific exploration mission with justification for choices
- Write a journal entry from the perspective of a sailor on an Atlantic crossing
- Create an infographic comparing ships from different exploration eras`
};

async function updateExplorersShips() {
  console.log("=== UPDATING 'Explorers and Their Ships' IN TURSO ===\n");

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
        explorersShipsContent.narrativeContent,
        explorersShipsContent.heroImageUrl,
        JSON.stringify(explorersShipsContent.images),
        JSON.stringify(explorersShipsContent.keyFigures),
        JSON.stringify(explorersShipsContent.timeline),
        JSON.stringify(explorersShipsContent.teacherObjectives),
        JSON.stringify(explorersShipsContent.teacherActivities),
        JSON.stringify(explorersShipsContent.teacherQuestions),
        explorersShipsContent.teacherNotes,
        explorersShipsContent.id
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
      args: [explorersShipsContent.id]
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
    console.error("Error updating Explorers and Their Ships:", error);
    throw error;
  }
}

updateExplorersShips()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to update:", error);
    process.exit(1);
  });
