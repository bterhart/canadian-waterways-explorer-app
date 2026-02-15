import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const meetVoyageursContent = {
  id: "cmliiajbd0000m2u231mzvoiv",

  // 300-500 word narrative for general users
  narrativeContent: `Before dawn broke over the northern wilderness, a sound echoed across still waters—voices rising in song, paddles striking the lake in perfect unison. The voyageurs were awake, beginning another eighteen-hour day of paddling that would carry them across the vast network of rivers and lakes connecting Montreal to the distant fur trading posts of the interior.

## Who Were the Voyageurs?

The voyageurs were the professional paddlers of the Canadian fur trade, French-Canadian and Metis men who transported trade goods westward and brought furs back to market. Their name means "travelers" in French, but they were far more than ordinary travelers. They were athletes of extraordinary endurance, navigating thousands of miles through some of North America's most challenging terrain.

## The Physical Demands

The work was brutal. Voyageurs paddled at a pace of forty to sixty strokes per minute, hour after hour, covering up to one hundred miles in a single day. When waterways ended, they carried everything overland on portages—including ninety-pound bundles strapped to their backs with a leather tumpline across the forehead. The strongest men carried multiple loads at a trot. Companies actually preferred shorter men, under five feet six inches, because they generated the same paddling power while taking up less precious space in already heavily loaded canoes.

## The Culture of Song

Songs defined voyageur life. They synchronized paddle strokes, lifted spirits during exhausting work, and made the long hours pass faster. Tunes like "En roulant ma boule" and "Alouette" rang out across the lakes. The best singer, called the chanteur, held a position of honor in the crew. Distances were even measured in "pipes"—the space covered between smoking breaks, typically five miles.

## Their Distinctive Style

Voyageurs were recognizable by their bright clothing: red wool caps, colorful woven sashes called ceinture flechee, and leather moccasins. They developed their own culture with unique rituals and traditions. Crossing into the pays d'en haut—the upper country—for the first time required an initiation ceremony. Boasting about physical feats was expected and encouraged.

## Lasting Legacy

The voyageur era peaked in the late 1700s and early 1800s, declining after the Hudson's Bay Company and North West Company merged in 1821. Steamboats and railways eventually made their skills obsolete. But the voyageurs left an indelible mark on Canadian identity. Their routes became modern transportation corridors. Their songs still echo in Canadian folk music. Their spirit of adventure and endurance remains a symbol of the country's founding era. Many of their descendants became part of the Metis Nation, carrying forward a cultural heritage born on those long-ago waterways.`,

  heroImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Frances_Anne_Hopkins_-_Canoes_in_a_Fog%2C_Lake_Superior_-_Google_Art_Project.jpg?width=800",

  images: [
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Voyageurs_at_dawn.jpg?width=800",
      caption: "Voyageurs at Dawn by Frances Anne Hopkins, showing the early morning departure of a canoe brigade",
      credit: "Wikimedia Commons"
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Shooting_the_Rapids.jpg?width=800",
      caption: "Shooting the Rapids, depicting voyageurs navigating dangerous whitewater",
      credit: "Wikimedia Commons"
    }
  ],

  keyFigures: [
    {
      name: "Pierre-Esprit Radisson",
      role: "Explorer and Trader",
      years: "1636-1710",
      description: "One of the earliest voyageur-explorers, whose adventures helped establish fur trade routes into the interior",
      explorerId: "cmlhc4gsi0005m2ogwruv73d5"
    },
    {
      name: "Medard des Groseilliers",
      role: "Explorer and Trader",
      years: "1618-1696",
      description: "Partner of Radisson who helped pioneer the routes that voyageurs would follow for generations",
      explorerId: "cmlijaie0000em22rv287hrll"
    },
    {
      name: "George Simpson",
      role: "Governor, HBC",
      years: "1787-1860",
      description: "Traveled extensively by voyageur canoe while overseeing HBC operations across North America",
      explorerId: "cmlijai0q0003m22r2hk84pe9"
    },
    {
      name: "Alexander Mackenzie",
      role: "Explorer",
      years: "1764-1820",
      description: "Led voyageur crews on epic journeys to both the Arctic and Pacific oceans",
      explorerId: "cmlhaslpq0005m2zhbi5xrrt6"
    }
  ],

  timeline: [
    {
      year: 1670,
      title: "HBC Charter Granted",
      description: "Hudson's Bay Company receives its royal charter, creating the framework for organized fur trade that would employ voyageurs",
      eventId: "cmligbkyo001im20zj2yavaqt"
    },
    {
      year: 1779,
      title: "North West Company Formed",
      description: "Montreal traders unite to form the NWC, which becomes the primary employer of voyageurs",
      eventId: "cmligbkz5001nm20z0rm0kptu"
    },
    {
      year: 1784,
      title: "Grand Portage Era",
      description: "The great rendezvous point becomes central meeting place for voyageur brigades from Montreal and the interior"
    },
    {
      year: 1821,
      title: "HBC-NWC Merger",
      description: "The merger of the two great fur trading companies begins the decline of the voyageur profession",
      eventId: "cmligbkzk001tm20z7riv5nwi"
    },
    {
      year: 1870,
      title: "End of Voyageur Era",
      description: "The last major voyageur brigades operate as steamboats and railways make traditional canoe transportation obsolete"
    }
  ],

  teacherObjectives: [
    "Students will identify who the voyageurs were and explain their role in the fur trade",
    "Students will describe the physical demands of voyageur work and understand why certain characteristics were valued",
    "Students will recognize the cultural elements of voyageur life including songs, clothing, and traditions",
    "Students will understand how voyageurs connected Indigenous peoples with European markets",
    "Students will evaluate the lasting legacy of voyageurs on Canadian culture and identity"
  ],

  teacherActivities: [
    {
      title: "Voyageur Song Circle",
      description: "Students learn a simple voyageur song like 'Alouette' and practice singing while making paddling motions. Discuss how songs helped coordinate work and pass time on long journeys.",
      materials: "Recordings of voyageur songs, lyrics sheets, optional wooden spoons as paddles",
      duration: "20 minutes"
    },
    {
      title: "Portage Challenge",
      description: "Set up a relay course where students carry backpacks (weighted appropriately for age) over obstacles. Calculate total weight moved and compare to historical voyageur loads of 180+ pounds.",
      materials: "Backpacks with safe weights, obstacle course materials, stopwatch, comparison charts",
      duration: "25 minutes"
    },
    {
      title: "Map the Voyageur Routes",
      description: "Using maps, students trace the routes from Montreal to Fort William and beyond. Calculate distances and estimate how many 'pipes' (5-mile segments) each journey would take.",
      materials: "Maps of Canada showing waterways, rulers, calculators, colored pencils",
      duration: "30 minutes"
    },
    {
      title: "Design a Voyageur Sash",
      description: "Students design their own ceinture flechee pattern on paper, learning about the traditional arrow pattern and colors. Discuss what the sash symbolized and how it was used.",
      materials: "Paper strips, colored pencils or markers, images of traditional sashes",
      duration: "25 minutes"
    }
  ],

  teacherQuestions: [
    "Why were shorter men preferred as voyageurs? What does this tell us about practical considerations in historical work?",
    "How did voyageur songs serve both practical and social purposes?",
    "What skills beyond physical strength would a successful voyageur need?",
    "Why do you think men continued working as voyageurs despite the dangerous and exhausting conditions?",
    "How did voyageur culture blend French-Canadian, Indigenous, and frontier influences?",
    "What modern jobs might be compared to voyageur work in terms of physical demands and teamwork?",
    "How did the voyageur profession contribute to the development of Metis culture?"
  ],

  teacherNotes: `This lesson connects to curriculum outcomes in Canadian history, cultural studies, and geography.

Key teaching points:
- Voyageurs were essential to the fur trade, serving as the transportation link across vast distances
- Their profession depended on Indigenous technology (birch bark canoes) and knowledge (routes, portages)
- Voyageur culture was distinctive and has influenced Canadian identity, particularly in Quebec and among Metis communities
- Songs are an excellent entry point for engaging students with this history

Sensitive considerations:
- Voyageur relationships with Indigenous women created complex family situations—discuss thoughtfully
- The work was genuinely dangerous and exploitative—avoid over-romanticizing
- Many voyageurs' descendants became part of the Metis Nation, an important connection to make

Cross-curricular connections:
- Music: Learn and perform voyageur songs in French and English
- Physical Education: Activities exploring endurance and teamwork
- Geography: Mapping waterway routes across Canada
- Art: Study Frances Anne Hopkins paintings as primary sources

Assessment ideas:
- Create a diary entry from a voyageur's perspective
- Compare primary source images depicting voyageur life
- Design a recruitment poster that would attract voyageurs
- Calculate distances and loads to understand the physical reality`
};

async function updateMeetVoyageurs() {
  console.log("=== UPDATING 'Meet the Voyageurs' IN TURSO ===\n");

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
        meetVoyageursContent.narrativeContent,
        meetVoyageursContent.heroImageUrl,
        JSON.stringify(meetVoyageursContent.images),
        JSON.stringify(meetVoyageursContent.keyFigures),
        JSON.stringify(meetVoyageursContent.timeline),
        JSON.stringify(meetVoyageursContent.teacherObjectives),
        JSON.stringify(meetVoyageursContent.teacherActivities),
        JSON.stringify(meetVoyageursContent.teacherQuestions),
        meetVoyageursContent.teacherNotes,
        meetVoyageursContent.id
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
      args: [meetVoyageursContent.id]
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
    console.error("Error updating Meet the Voyageurs:", error);
    throw error;
  }
}

updateMeetVoyageurs()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to update:", error);
    process.exit(1);
  });
