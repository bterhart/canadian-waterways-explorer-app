import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const voyageurRoutesContent = {
  id: "cmlheagqq0006m28u7nkab8us",

  // 300-500 word narrative for general users
  narrativeContent: `The voyageur routes of Canada formed an astonishing water highway stretching over four thousand miles from Montreal to the Pacific Ocean. These interconnected rivers, lakes, and portage trails allowed birch bark canoes to cross an entire continent, creating the transportation network that made the fur trade possible and ultimately shaped the nation of Canada.

## The Main Arteries

The primary route ran from Montreal up the Ottawa River, across Lake Nipissing, and down the French River into Georgian Bay. From there, voyageurs paddled along the north shore of Lake Superior to Grand Portage, later Fort William. This eastern route was traveled by the mangeurs de lard, or "pork eaters," who transported trade goods west each spring and returned with furs each fall.

From the Lakehead, the route continued westward through Rainy Lake, Lake of the Woods, and along the Winnipeg River system to Lake Winnipeg. The most experienced voyageurs, called hommes du nord or "winterers," pushed further into Athabasca country via the Churchill River system. The crucial link was Methye Portage, a grueling twenty-kilometer carry that crossed the height of land separating waters flowing to Hudson Bay from those draining to the Arctic.

## Indigenous Foundations

Every major voyageur route followed paths that Indigenous peoples had traveled for thousands of years. First Nations not only created these routes but maintained them, clearing portage trails and sharing essential geographic knowledge. Without Indigenous guides, paddlers, and geographical expertise, European traders could never have navigated this vast network.

## The Rendezvous System

Distance and timing created the annual rendezvous, where brigades from east and west met at Grand Portage or Fort William each July. Montreal canoes could not reach Athabasca and return before freeze-up, while interior brigades could not paddle to Montreal and back. The rendezvous solved this by exchanging goods and furs at the midpoint, allowing both brigades to return home before winter.

## Seasonal Rhythms

The routes demanded precise timing. Brigades departed Montreal in early May as ice cleared, racing to reach Grand Portage by mid-July. Athabasca brigades left their wintering grounds as soon as rivers opened, arriving at rendezvous around the same time. After exchanging cargoes, both returned before autumn freeze-up. A late departure or early winter could strand crews hundreds of miles from shelter.

## Lasting Impact

These water highways did not disappear with the fur trade. Many became modern transportation corridors. The voyageur route through the Great Lakes evolved into the St. Lawrence Seaway. The paths to western Canada guided later railway routes and highways. The routes also established patterns of settlement and commerce that shaped provincial boundaries. The voyageurs did not merely travel these waterways; they helped create the geographic framework of modern Canada.`,

  heroImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Canot_de_ma%C3%AEtre.png?width=800",

  images: [
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Voyageur_canoe_route_map_1774.svg?width=800",
      caption: "Map showing the major voyageur canoe routes connecting Montreal to the western interior",
      credit: "Wikimedia Commons"
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Frances_Anne_Hopkins_-_Canoes_in_a_Fog%2C_Lake_Superior_-_Google_Art_Project.jpg?width=800",
      caption: "Canoes in a Fog, Lake Superior by Frances Anne Hopkins, depicting voyageurs navigating the north shore route",
      credit: "Wikimedia Commons"
    }
  ],

  keyFigures: [
    {
      name: "Pierre Gaultier de La Verendrye",
      role: "Explorer",
      years: "1685-1749",
      description: "Opened the western route beyond Lake Superior, establishing posts that extended fur trade routes to Lake Winnipeg and beyond",
      explorerId: "cmlhc4gt00009m2ogntt9le4v"
    },
    {
      name: "Alexander Mackenzie",
      role: "Explorer",
      years: "1764-1820",
      description: "First European to cross North America north of Mexico, proving routes could connect the interior to both Arctic and Pacific oceans",
      explorerId: "cmlhaslpq0005m2zhbi5xrrt6"
    },
    {
      name: "David Thompson",
      role: "Surveyor and Explorer",
      years: "1770-1857",
      description: "Mapped over 1.9 million square miles of routes, creating the most accurate charts of western waterways",
      explorerId: "cmlhaslpx0006m2zhsckolb5o"
    },
    {
      name: "Simon Fraser",
      role: "Explorer",
      years: "1776-1862",
      description: "Explored and mapped the river bearing his name, seeking viable Pacific routes for the fur trade",
      explorerId: "cmlhaslq90009m2zhn28km7lg"
    }
  ],

  timeline: [
    {
      year: 1731,
      title: "La Verendrye Opens Western Route",
      description: "Pierre Gaultier de La Verendrye establishes posts beyond Lake Superior, opening routes to Lake Winnipeg and the western interior",
      eventId: "cmlk1ohud000qm2atevxoympv"
    },
    {
      year: 1778,
      title: "Methye Portage Crossed",
      description: "Peter Pond crosses Methye Portage, opening the crucial link to the rich Athabasca fur country",
      eventId: "cmlk1ohty000nm2att6r3c9dm"
    },
    {
      year: 1784,
      title: "Grand Portage Becomes NWC Headquarters",
      description: "The North West Company establishes Grand Portage as its main depot, the meeting point for eastern and western brigades",
      eventId: "cmlk1ohtu000mm2at49lwsurh"
    },
    {
      year: 1793,
      title: "Mackenzie Reaches Pacific",
      description: "Alexander Mackenzie completes the first crossing of North America north of Mexico, reaching the Pacific Ocean",
      eventId: "cmligbkza001pm20z2hyo4tyq"
    },
    {
      year: 1803,
      title: "Grand Portage Abandoned",
      description: "The North West Company moves its headquarters to Fort William after Grand Portage is confirmed to be in American territory",
      eventId: "cmlk1ohu6000om2at2pu1g41z"
    }
  ],

  teacherObjectives: [
    "Students will identify the major voyageur routes across Canada and explain their geographic logic",
    "Students will understand how Indigenous peoples created and maintained the routes that made the fur trade possible",
    "Students will explain the rendezvous system and why it was necessary given the vast distances involved",
    "Students will analyze how seasonal timing constrained travel and shaped fur trade operations",
    "Students will evaluate how voyageur routes influenced the development of modern Canadian transportation corridors"
  ],

  teacherActivities: [
    {
      title: "Map the Routes",
      description: "Using a large map of Canada, students trace the three main voyageur routes: Montreal to Grand Portage, Lakehead to Athabasca, and routes to the Pacific. Calculate total distances and identify key portages along each route.",
      materials: "Large map of Canada, colored yarn or string, push pins, distance calculator, portage fact cards",
      duration: "30 minutes"
    },
    {
      title: "Rendezvous Simulation",
      description: "Divide class into 'eastern' and 'western' brigades. Each group prepares trade goods lists. Meet at a central 'rendezvous point' to exchange goods, experiencing the logistical challenges of the system.",
      materials: "Trade goods cards, tally sheets, timer, exchange rate charts",
      duration: "25 minutes"
    },
    {
      title: "Seasonal Calendar Challenge",
      description: "Given departure dates and average paddling speeds, students calculate whether brigades can complete round trips before freeze-up. Adjust for portages, weather delays, and rendezvous time.",
      materials: "Calendar sheets, distance charts, speed tables, weather delay cards",
      duration: "25 minutes"
    },
    {
      title: "Then and Now Comparison",
      description: "Students research modern highways, railways, and shipping routes, then overlay them on voyageur route maps. Identify which modern corridors follow historical water routes.",
      materials: "Historical route maps, modern transportation maps, tracing paper, research materials",
      duration: "30 minutes"
    }
  ],

  teacherQuestions: [
    "Why did voyageur routes follow rivers and lakes rather than overland trails?",
    "How did the geographic constraint of freeze-up create the rendezvous system?",
    "What role did Indigenous peoples play in establishing and maintaining these routes?",
    "Why was Methye Portage considered the most important portage in the entire system?",
    "How did the location of Grand Portage on the American side of the border affect the fur trade?",
    "What advantages did water routes have over land travel in this era?",
    "How do modern transportation routes in Canada reflect the paths first traveled by voyageurs?"
  ],

  teacherNotes: `This lesson connects to curriculum outcomes in Canadian history, geography, and Indigenous studies.

Key teaching points:
- Voyageur routes were not European discoveries but Indigenous travel corridors used for millennia
- The routes formed an interconnected system spanning over 4,000 miles from Montreal to the Pacific
- Geographic constraints (freeze-up, portages, distances) shaped the entire structure of the fur trade
- These routes became the template for later Canadian transportation development

Sensitive considerations:
- Emphasize Indigenous priority in creating these routes; Europeans followed existing paths
- Acknowledge that route expansion facilitated colonization and its impacts on Indigenous peoples
- The "opening" of routes by Europeans meant incorporating existing Indigenous knowledge

Cross-curricular connections:
- Geography: Watershed systems, continental divides, seasonal climate patterns
- Mathematics: Distance calculations, travel time problems, logistics planning
- Social Studies: How geography shapes economic and political development
- Indigenous Studies: Traditional travel routes and territorial connections

Assessment ideas:
- Create a travel guide for a specific voyageur route
- Calculate logistics for a hypothetical brigade journey
- Research a specific portage and present its history and significance
- Compare voyageur routes to modern transportation corridors in a visual essay`
};

async function updateVoyageurRoutes() {
  console.log("=== UPDATING 'Voyageur Routes of Canada' IN TURSO ===\n");

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
        voyageurRoutesContent.narrativeContent,
        voyageurRoutesContent.heroImageUrl,
        JSON.stringify(voyageurRoutesContent.images),
        JSON.stringify(voyageurRoutesContent.keyFigures),
        JSON.stringify(voyageurRoutesContent.timeline),
        JSON.stringify(voyageurRoutesContent.teacherObjectives),
        JSON.stringify(voyageurRoutesContent.teacherActivities),
        JSON.stringify(voyageurRoutesContent.teacherQuestions),
        voyageurRoutesContent.teacherNotes,
        voyageurRoutesContent.id
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
      args: [voyageurRoutesContent.id]
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

    console.log(`\n--- teacherActivities ---`);
    const activities = row.teacherActivities ? JSON.parse(String(row.teacherActivities)) : [];
    console.log(`Count: ${activities.length} activity(ies)`);
    activities.forEach((act: any, i: number) => {
      console.log(`  ${i + 1}. ${act.title} (${act.duration})`);
    });

    console.log(`\n--- teacherQuestions ---`);
    const questions = row.teacherQuestions ? JSON.parse(String(row.teacherQuestions)) : [];
    console.log(`Count: ${questions.length} question(s)`);

    console.log(`\n--- teacherNotes ---`);
    console.log(`Set: ${row.teacherNotes ? 'Yes' : 'No'}`);
    if (row.teacherNotes) {
      const notesWordCount = String(row.teacherNotes).split(/\s+/).filter(w => w.length > 0).length;
      console.log(`Word count: ${notesWordCount} words`);
    }

    console.log("\n=== UPDATE COMPLETE ===");

  } catch (error) {
    console.error("Error updating Voyageur Routes of Canada:", error);
    throw error;
  }
}

updateVoyageurRoutes()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to update:", error);
    process.exit(1);
  });
