import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const voyageurLifeContent = {
  id: "cmligbky00019m20z21c6dp3y",

  // 300-500 word narrative for general users (rewritten from 1469 words)
  narrativeContent: `The voyageurs were the legendary paddlers who powered the Canadian fur trade, transporting goods and furs across thousands of kilometers of lakes and rivers. These French-Canadian and Metis men became symbols of endurance, adventure, and the frontier spirit.

## The Grueling Work

Voyageur life demanded extraordinary physical stamina. Crews paddled eighteen hours daily, maintaining forty to sixty strokes per minute in perfect synchronization. When rivers became impassable, they portaged everything overland, carrying ninety-pound bundles on their backs secured by leather tumplines across their foreheads. The strongest carried multiple loads at a trot. Fur trade companies actually preferred shorter men, under five feet six inches, because they provided equal paddling power while occupying less space in heavily loaded canoes.

## Two Types of Voyageurs

The trade divided voyageurs into two classes. Mangeurs de lard, meaning "pork eaters," worked the route between Montreal and the great inland depot at Grand Portage. They ate salt pork and other preserved foods supplied from settlements. Hommes du nord, the "men of the north," paddled the rugged interior routes to distant trading posts. They wintered in the wilderness, ate pemmican, and held higher status among their peers.

## Culture and Camaraderie

Voyageurs developed a distinctive culture built around songs, bright clothing, and fierce pride. Their paddling songs kept crews synchronized and spirits high during exhausting journeys. Tunes like "En roulant ma boule" echoed across the waterways. They wore red wool caps, colorful woven sashes called ceinture flechee, and leather moccasins. Distances were measured in "pipes," the roughly five miles traveled between smoking breaks.

## Dangers Faced

The work was genuinely dangerous. Rapids claimed canoes and lives. Cold water, unpredictable weather, and exhaustion took their toll. Hernias from carrying heavy loads were common injuries. Many voyageurs died young, their bodies worn out from years of brutal labor.

## Lasting Legacy

The voyageur era peaked between 1780 and 1821, ending when the Hudson's Bay Company absorbed its rival, the North West Company. Railways and steamboats eventually made their skills obsolete. Yet voyageurs left an enduring mark on Canadian identity. Their routes became modern transportation corridors. Their songs survive in folk music traditions. Many descendants became part of the Metis Nation. The voyageur spirit of adventure and perseverance remains central to how Canadians understand their history and national character.`,

  heroImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Frances_Anne_Hopkins_-_Canoes_in_a_Fog%2C_Lake_Superior_-_Google_Art_Project.jpg?width=800",

  images: [
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Voyageurs_at_dawn.jpg?width=800",
      caption: "Voyageurs at Dawn by Frances Anne Hopkins, depicting the early morning departure of a canoe brigade",
      credit: "Frances Anne Hopkins, Wikimedia Commons"
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Shooting_the_Rapids.jpg?width=800",
      caption: "Shooting the Rapids by Frances Anne Hopkins, showing voyageurs navigating dangerous whitewater",
      credit: "Frances Anne Hopkins, Wikimedia Commons"
    }
  ],

  keyFigures: [
    {
      name: "Pierre-Esprit Radisson",
      role: "Explorer and Trader",
      years: "1636-1710",
      description: "One of the earliest voyageur-explorers whose adventures helped establish fur trade routes into the interior",
      explorerId: "cmlhc4gsi0005m2ogwruv73d5"
    },
    {
      name: "Medard des Groseilliers",
      role: "Explorer and Trader",
      years: "1618-1696",
      description: "Partner of Radisson who pioneered routes that voyageurs would follow for generations",
      explorerId: "cmlijaie0000em22rv287hrll"
    },
    {
      name: "Alexander Mackenzie",
      role: "Explorer",
      years: "1764-1820",
      description: "Led voyageur crews on epic journeys to both the Arctic and Pacific oceans",
      explorerId: "cmlhaslpq0005m2zhbi5xrrt6"
    },
    {
      name: "Simon Fraser",
      role: "Explorer and Fur Trader",
      years: "1776-1862",
      description: "Navigated the treacherous river that bears his name with voyageur crews",
      explorerId: "cmlhaslq90009m2zhn28km7lg"
    }
  ],

  timeline: [
    {
      year: 1670,
      title: "HBC Charter Granted",
      description: "Hudson's Bay Company receives its royal charter, establishing the framework for organized fur trade that would employ voyageurs",
      eventId: "cmligbkyo001im20zj2yavaqt"
    },
    {
      year: 1779,
      title: "North West Company Formed",
      description: "Montreal traders unite to form the NWC, which becomes the primary employer of voyageurs",
      eventId: "cmligbkz5001nm20z0rm0kptu"
    },
    {
      year: 1793,
      title: "Mackenzie Reaches Pacific",
      description: "Alexander Mackenzie completes the first recorded transcontinental crossing of North America with his voyageur crew",
      eventId: "cmligbkza001pm20z2hyo4tyq"
    },
    {
      year: 1821,
      title: "HBC-NWC Merger",
      description: "The merger of the two great fur trading companies marks the beginning of the end for the voyageur profession",
      eventId: "cmligbkzk001tm20z7riv5nwi"
    }
  ],

  teacherObjectives: [
    "Students will identify who the voyageurs were and explain their essential role in the fur trade transportation system",
    "Students will describe the physical demands of voyageur work, including paddling rhythms and portaging loads",
    "Students will distinguish between the two types of voyageurs: mangeurs de lard and hommes du nord",
    "Students will analyze the distinctive cultural elements of voyageur life including songs, clothing, and traditions",
    "Students will evaluate the voyageurs' lasting legacy on Canadian identity and Metis heritage"
  ],

  teacherActivities: [
    {
      title: "Paddling Song Workshop",
      description: "Students learn a voyageur song like 'Alouette' and practice singing while making synchronized paddling motions. Discuss how songs coordinated work and boosted morale during eighteen-hour paddling days.",
      materials: "Recordings of voyageur songs, lyrics sheets in French and English, wooden spoons as paddle props",
      duration: "20 minutes"
    },
    {
      title: "Portage Weight Challenge",
      description: "Create a safe relay course where students carry age-appropriate weighted backpacks. Calculate total weight moved and compare to historical voyageur loads of 180+ pounds across rugged terrain.",
      materials: "Weighted backpacks (age-appropriate), obstacle course materials, stopwatch, historical comparison charts",
      duration: "25 minutes"
    },
    {
      title: "Voyageur Route Mapping",
      description: "Using maps, students trace routes from Montreal to Grand Portage and interior posts. Calculate distances and estimate travel time in 'pipes' (five-mile segments between breaks).",
      materials: "Maps showing Canadian waterways, rulers, calculators, colored pencils for route marking",
      duration: "30 minutes"
    },
    {
      title: "Design a Ceinture Flechee",
      description: "Students create their own arrow-pattern sash designs on paper, learning about traditional voyageur colors and patterns. Discuss how sashes served practical purposes and showed cultural identity.",
      materials: "Paper strips, colored pencils or markers, reference images of traditional sashes",
      duration: "25 minutes"
    }
  ],

  teacherQuestions: [
    "Why did fur trade companies prefer shorter men as voyageurs? What does this reveal about practical considerations in historical work?",
    "How did the distinction between mangeurs de lard and hommes du nord reflect status within voyageur culture?",
    "What purposes did voyageur songs serve beyond entertainment during long paddling days?",
    "What skills beyond physical strength would make someone a successful voyageur?",
    "Why would men choose to become voyageurs despite the dangerous and exhausting conditions?",
    "How did voyageur culture blend French-Canadian, Indigenous, and frontier influences?",
    "What connections exist between voyageur history and the development of Metis identity?"
  ],

  teacherNotes: `This lesson connects to curriculum outcomes in Canadian history, cultural studies, and geography.

Key teaching points:
- Voyageurs were the essential transportation workforce of the fur trade, paddling thousands of kilometers between Montreal and interior posts
- Their profession depended heavily on Indigenous technology (birch bark canoes) and knowledge (routes, portages, survival skills)
- The distinction between mangeurs de lard and hommes du nord reveals social hierarchy within voyageur culture
- Songs served practical purposes (synchronizing paddles) as well as building morale and cultural identity

Sensitive considerations:
- The work was genuinely dangerous and exploitative, with many voyageurs dying young from injuries and exhaustion
- Avoid over-romanticizing the voyageur lifestyle while still honoring their remarkable achievements
- Many voyageurs formed families with Indigenous women, and their descendants became part of the Metis Nation
- The decline of voyageur work had significant impacts on communities that depended on this employment

Cross-curricular connections:
- Music: Learn and perform voyageur songs in French, exploring paddling rhythms
- Physical Education: Activities exploring endurance, teamwork, and physical demands
- Geography: Map waterway routes and understand portage challenges
- Art: Study Frances Anne Hopkins paintings as primary historical sources
- French Language: Explore voyageur terminology and song lyrics

Assessment ideas:
- Write a diary entry from either a mangeur de lard or homme du nord perspective
- Compare Frances Anne Hopkins paintings to analyze voyageur life
- Calculate distances and loads to understand physical demands mathematically
- Create a recruitment poster that accurately represents voyageur work`
};

async function updateVoyageurLife() {
  console.log("=== UPDATING 'The Voyageur Life' IN TURSO ===\n");

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
        voyageurLifeContent.narrativeContent,
        voyageurLifeContent.heroImageUrl,
        JSON.stringify(voyageurLifeContent.images),
        JSON.stringify(voyageurLifeContent.keyFigures),
        JSON.stringify(voyageurLifeContent.timeline),
        JSON.stringify(voyageurLifeContent.teacherObjectives),
        JSON.stringify(voyageurLifeContent.teacherActivities),
        JSON.stringify(voyageurLifeContent.teacherQuestions),
        voyageurLifeContent.teacherNotes,
        voyageurLifeContent.id
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
      args: [voyageurLifeContent.id]
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
    console.error("Error updating The Voyageur Life:", error);
    throw error;
  }
}

updateVoyageurLife()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to update:", error);
    process.exit(1);
  });
