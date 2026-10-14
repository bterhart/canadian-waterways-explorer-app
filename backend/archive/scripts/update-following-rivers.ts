import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const followingRiversContent = {
  id: "cmliiajbr0002m2u2sj3x76t7",

  // 300-500 word narrative for general users
  narrativeContent: `Long before European roads or railways crossed North America, rivers served as highways through the wilderness. In the fur trade era, these flowing waterways were essential pathways connecting distant communities, carrying canoes laden with beaver pelts and trade goods across thousands of miles of untamed terrain.

## The Great River Network

The St. Lawrence River formed the eastern gateway, linking the Atlantic Ocean to the interior. From Montreal, traders paddled up the Ottawa River, portaging around rapids to reach the Great Lakes. Beyond Lake Superior, the routes branched westward along rivers like the Saskatchewan and the Winnipeg, eventually reaching the Rocky Mountains and beyond. To the north, the Mackenzie River system stretched all the way to the Arctic Ocean, while the Fraser and Columbia rivers offered routes to the Pacific coast.

## Why Rivers Mattered

Without roads through the dense forests and rugged terrain, rivers provided the only practical means of long-distance travel and transport. A single birch bark canoe could carry two tons of cargo across waterways that would be impassable on foot. Fur trading companies built their entire business models around these natural highways. Posts and forts were established at strategic river junctions, portage points, and the confluences of major waterways.

## The Challenge of Rapids and Portages

River travel was far from easy. Rapids, waterfalls, and shallow stretches forced voyageurs to portage, carrying their canoes and heavy cargo overland to calmer waters. Some portages stretched for miles through difficult terrain. The Grand Portage near Lake Superior, measuring nearly nine miles, was legendary for its grueling difficulty. Skilled paddlers developed techniques for running rapids when possible, but misjudging the current could prove fatal.

## Indigenous Knowledge Made It Possible

European traders could never have navigated this complex network without Indigenous guidance. First Nations peoples had traveled these waterways for thousands of years, developing detailed knowledge of every rapid, portage route, and seasonal variation. They shared this knowledge with French and British traders, serving as guides, paddlers, and interpreters. Many rivers still bear Indigenous names that reflect this heritage.

## A Lasting Legacy

The river routes of the fur trade shaped the geography of modern Canada. Cities like Montreal, Ottawa, Winnipeg, and Edmonton grew at strategic water junctions. Provincial boundaries often follow the watersheds that once defined trading territories. Understanding these waterways helps explain why Canada developed the way it did, with communities strung along rivers and lakes rather than spread evenly across the land.`,

  heroImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Frances_Anne_Hopkins_-_Canoes_in_a_Fog%2C_Lake_Superior_-_Google_Art_Project.jpg?width=800",

  images: [
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/MacKenzie_River_delta.jpg?width=800",
      caption: "The Mackenzie River delta, part of the vast river system Alexander Mackenzie followed to the Arctic Ocean",
      credit: "Wikimedia Commons"
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Fraser_River_British_Columbia.jpg?width=800",
      caption: "The Fraser River in British Columbia, explored by Simon Fraser in 1808",
      credit: "Wikimedia Commons"
    }
  ],

  keyFigures: [
    {
      name: "Samuel de Champlain",
      role: "Explorer and Mapmaker",
      years: "1567-1635",
      description: "Mapped the St. Lawrence and Ottawa River systems, establishing the eastern fur trade routes",
      explorerId: "cmlhaslpl0004m2zhpjklxgyn"
    },
    {
      name: "Alexander Mackenzie",
      role: "Explorer",
      years: "1764-1820",
      description: "First European to follow rivers to both the Arctic Ocean (1789) and Pacific Ocean (1793)",
      explorerId: "cmlhaslpq0005m2zhbi5xrrt6"
    },
    {
      name: "David Thompson",
      role: "Surveyor and Mapmaker",
      years: "1770-1857",
      description: "Surveyed and mapped the Columbia River system and countless other western waterways",
      explorerId: "cmlhaslpx0006m2zhsckolb5o"
    },
    {
      name: "Simon Fraser",
      role: "Explorer",
      years: "1776-1862",
      description: "Navigated the treacherous river that now bears his name, seeking a route to the Pacific",
      explorerId: "cmlhaslq90009m2zhn28km7lg"
    },
    {
      name: "Pierre Gaultier de La Verendrye",
      role: "Explorer and Trader",
      years: "1685-1749",
      description: "Expanded French knowledge of the western river systems beyond Lake Superior",
      explorerId: "cmlhc4gt00009m2ogntt9le4v"
    }
  ],

  timeline: [
    {
      year: 1670,
      title: "HBC Charter Granted",
      description: "Hudson's Bay Company receives charter granting trade rights to all rivers draining into Hudson Bay",
      eventId: "cmligbkyo001im20zj2yavaqt"
    },
    {
      year: 1789,
      title: "Mackenzie Reaches Arctic",
      description: "Alexander Mackenzie follows the great river now named for him all the way to the Arctic Ocean",
      eventId: "cmligbkz8001om20zu2i3f3tj"
    },
    {
      year: 1793,
      title: "Mackenzie Reaches Pacific",
      description: "Mackenzie becomes first European to cross North America north of Mexico via river routes",
      eventId: "cmligbkza001pm20z2hyo4tyq"
    },
    {
      year: 1808,
      title: "Fraser River Explored",
      description: "Simon Fraser navigates the dangerous river that now bears his name, hoping to find the Columbia",
      eventId: "cmligbkzd001qm20zzi49yg89"
    },
    {
      year: 1811,
      title: "Thompson Maps Columbia",
      description: "David Thompson completes his survey of the Columbia River from source to mouth",
      eventId: "cmligbkzf001rm20zn3mrrtpu"
    }
  ],

  teacherObjectives: [
    "Students will identify major river systems used in the fur trade and explain their geographic significance",
    "Students will understand why rivers were essential for transportation before modern roads and railways",
    "Students will describe the challenges of river travel including rapids, portages, and seasonal conditions",
    "Students will recognize the crucial role of Indigenous knowledge in enabling European navigation of river networks",
    "Students will connect fur trade river routes to the development of modern Canadian cities and boundaries"
  ],

  teacherActivities: [
    {
      title: "River Route Mapping",
      description: "Students trace major fur trade routes on blank maps of Canada, marking key rivers, portages, and trading posts. Calculate total distances traveled by voyageur brigades between Montreal and Fort Chipewyan.",
      materials: "Blank maps of Canada, colored pencils, atlas or reference maps, rulers, distance scales",
      duration: "35 minutes"
    },
    {
      title: "Build a Watershed Model",
      description: "Using clay or modeling material, students create a 3D model of a watershed showing how rivers connect. Demonstrate how water flows from high ground to low, and discuss why posts were built at river junctions.",
      materials: "Modeling clay or play dough, trays, water, blue food coloring, small flags for marking posts",
      duration: "40 minutes"
    },
    {
      title: "Portage Problem Solving",
      description: "Present students with historical scenarios where they must decide: run the rapids or portage? Discuss the risks and benefits of each choice, the weight of cargo, and time constraints.",
      materials: "Scenario cards describing different rapid conditions, canoe cargo lists, historical accounts",
      duration: "25 minutes"
    },
    {
      title: "Indigenous River Names Research",
      description: "Students research the Indigenous origins of Canadian river names (Ottawa, Saskatchewan, Winnipeg, etc.) and create presentations explaining what the names mean and which nations gave them.",
      materials: "Research materials, computers or tablets, presentation supplies, map of Canada",
      duration: "45 minutes (may span multiple sessions)"
    }
  ],

  teacherQuestions: [
    "Why were rivers called the 'highways' of the fur trade era? What made them more practical than overland routes?",
    "How did the geography of Canadian rivers influence where cities like Montreal, Ottawa, and Winnipeg developed?",
    "What skills would paddlers need to navigate river systems safely? How did they learn these skills?",
    "Why was Indigenous knowledge essential for European traders trying to navigate inland waterways?",
    "How do modern transportation routes (highways, railways) compare to the original fur trade river routes?",
    "What dangers did voyageurs face on rivers, and how did they minimize these risks?",
    "Why did the HBC charter grant rights based on river drainage patterns rather than fixed boundaries?"
  ],

  teacherNotes: `This lesson connects to curriculum outcomes in geography, Canadian history, and Indigenous studies.

Key teaching points:
- Rivers were not just routes but defined the entire geography and economy of the fur trade
- Indigenous peoples had developed sophisticated knowledge of waterways over thousands of years
- Understanding river systems helps explain Canadian settlement patterns and provincial boundaries
- Many place names preserve Indigenous languages and knowledge

Sensitive considerations:
- Indigenous navigation knowledge was often taken without proper credit or compensation
- River routes also brought disease and disruption to Indigenous communities
- Acknowledge that these waterways were Indigenous territories, not empty wilderness

Cross-curricular connections:
- Geography: Watershed concepts, topography, map reading
- Science: Water cycles, erosion, seasonal water levels
- Indigenous Studies: Traditional ecological knowledge, place names, territorial waters
- Math: Distance calculations, scale conversions, travel time estimates

Assessment ideas:
- Create an annotated map of a fur trade river route
- Write a journal entry describing a day of river travel from a voyageur or Indigenous guide's perspective
- Compare historical and modern maps to identify which fur trade routes became modern transportation corridors
- Research project on the Indigenous history of a local river or waterway`
};

async function updateFollowingRivers() {
  console.log("=== UPDATING 'Following the Rivers' IN TURSO ===\n");

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
        followingRiversContent.narrativeContent,
        followingRiversContent.heroImageUrl,
        JSON.stringify(followingRiversContent.images),
        JSON.stringify(followingRiversContent.keyFigures),
        JSON.stringify(followingRiversContent.timeline),
        JSON.stringify(followingRiversContent.teacherObjectives),
        JSON.stringify(followingRiversContent.teacherActivities),
        JSON.stringify(followingRiversContent.teacherQuestions),
        followingRiversContent.teacherNotes,
        followingRiversContent.id
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
      args: [followingRiversContent.id]
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
    console.error("Error updating Following the Rivers:", error);
    throw error;
  }
}

updateFollowingRivers()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to update:", error);
    process.exit(1);
  });
