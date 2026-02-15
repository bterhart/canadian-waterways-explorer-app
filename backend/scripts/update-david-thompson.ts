import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const davidThompsonContent = {
  id: "cmliiajcg0007m2u2po4lyhcw",

  // 300-500 word narrative about David Thompson: Master Mapmaker
  narrativeContent: `David Thompson stands as one of history's most remarkable explorers, yet he remains surprisingly unknown compared to figures who achieved far less. Born in London in 1770 to a poor Welsh family, Thompson was orphaned young and sent to the Grey Coat Hospital charity school. At fourteen, the Hudson's Bay Company apprenticed him, shipping him to the wilderness of Churchill on Hudson Bay.

## From Apprentice to Surveyor

Thompson's early years with the HBC taught him survival skills and the fur trade. A broken leg in 1788 changed everything. During his recovery, he studied surveying and astronomy with Philip Turnor, the company's official surveyor. Turnor recognized Thompson's extraordinary mathematical aptitude and taught him to use a sextant, read astronomical tables, and calculate positions with precision. These skills would define Thompson's life work.

## Joining the North West Company

By 1797, Thompson grew frustrated with the HBC's lack of interest in exploration. He made the bold decision to join the rival North West Company, which encouraged his surveying ambitions. Over the next fifteen years, Thompson undertook expeditions that transformed knowledge of western North America. He traveled the Saskatchewan River system, explored the Athabasca region, and pushed into territories no European had mapped.

## Crossing the Rockies

In 1807, Thompson became the first European to cross the Rocky Mountains via Howse Pass, establishing Kootenae House on the Columbia River's headwaters. He spent years exploring the Columbia watershed, building trading posts and meticulously recording observations. His 1811 journey down the entire Columbia River to the Pacific Ocean completed the mapping of this crucial waterway, though he arrived at the river's mouth just weeks after American traders had established Fort Astoria.

## Charlotte Small: Partner in Exploration

Thompson's wife Charlotte Small, daughter of a fur trader and a Cree woman, proved essential to his success. They married in 1799, and Charlotte accompanied Thompson on many expeditions while raising their thirteen children. She served as interpreter, guide, and cultural liaison. Thompson credited her with saving his life multiple times. Their partnership exemplified how Indigenous and Metis women enabled European exploration.

## The Great Map

Thompson's meticulous astronomical observations, taken daily with sextant and compass, accumulated into an unprecedented geographic record. He traveled nearly 90,000 kilometers and mapped approximately 3.9 million square kilometers. In 1814, he completed his masterpiece: a massive map of western North America measuring nearly two by three meters. This extraordinary document remained the most accurate representation of the region for decades.

## Legacy of Precision

Despite his achievements, Thompson died in poverty in 1857, his contributions largely forgotten. Only in the twentieth century did scholars recognize him as "the greatest land geographer who ever lived." His maps established boundaries still used today, including portions of the Canada-United States border. Thompson's legacy lies not in dramatic tales of adventure but in the quiet precision of his work, transforming a vast wilderness into documented knowledge that shaped a nation.`,

  heroImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/David_Thompson_(explorer).jpg?width=800",

  images: [
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/David_Thompson_Map_1814.jpg?width=800",
      caption: "David Thompson's Great Map of 1814, showing western North America from Hudson Bay to the Pacific Ocean",
      credit: "Wikimedia Commons"
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Howse_Pass.jpg?width=800",
      caption: "Howse Pass in the Rocky Mountains, the route Thompson used for his first crossing in 1807",
      credit: "Wikimedia Commons"
    }
  ],

  keyFigures: [
    {
      name: "David Thompson",
      role: "Explorer and Cartographer",
      years: "1770-1857",
      description: "Called 'the greatest land geographer who ever lived,' Thompson traveled nearly 90,000 kilometers and mapped 3.9 million square kilometers of North America with extraordinary accuracy",
      explorerId: "cmlhaslpx0006m2zhsckolb5o"
    },
    {
      name: "Charlotte Small",
      role: "Explorer's Partner and Interpreter",
      years: "c.1785-1857",
      description: "Thompson's Metis wife who accompanied him on many expeditions, serving as interpreter, guide, and cultural liaison while raising their thirteen children",
      explorerId: "cmlijaift000wm22r5rj3te9y"
    },
    {
      name: "Peter Fidler",
      role: "HBC Surveyor and Trader",
      years: "1769-1822",
      description: "Fellow HBC surveyor trained by Philip Turnor who also contributed significantly to mapping western Canada, though his work remained less comprehensive than Thompson's",
      explorerId: "cmlhc4gtb000cm2ogcw1csu08"
    },
    {
      name: "Philip Turnor",
      role: "HBC Master Surveyor",
      years: "1751-1799",
      description: "The Hudson's Bay Company's official surveyor who recognized Thompson's mathematical talent and taught him the astronomical and surveying skills that made his achievements possible",
      explorerId: "cmliiral50000m2ee409m0fpk"
    }
  ],

  timeline: [
    {
      year: 1784,
      title: "Thompson Arrives at Churchill",
      description: "Fourteen-year-old David Thompson arrives at Churchill on Hudson Bay as an apprentice to the Hudson's Bay Company, beginning his career in the wilderness"
    },
    {
      year: 1797,
      title: "Joins North West Company",
      description: "Frustrated by the HBC's lack of interest in exploration, Thompson joins the rival North West Company, which supports his surveying ambitions"
    },
    {
      year: 1807,
      title: "Crosses Rocky Mountains",
      description: "Thompson becomes the first European to cross the Rockies via Howse Pass, establishing Kootenae House and beginning exploration of the Columbia River system"
    },
    {
      year: 1811,
      title: "Thompson Reaches Pacific via Columbia",
      description: "Thompson completes his journey down the entire Columbia River to the Pacific Ocean, mapping this crucial waterway",
      eventId: "cmligbkzf001rm20zn3mrrtpu"
    },
    {
      year: 1814,
      title: "Completes the Great Map",
      description: "Thompson delivers his monumental map of western North America to the North West Company, the most accurate representation of the region for decades to come"
    }
  ],

  teacherObjectives: [
    "Students will understand the scientific methods Thompson used for surveying, including astronomical observation and triangulation",
    "Students will analyze how Thompson's training under Philip Turnor transformed him from fur trader to master cartographer",
    "Students will evaluate the partnership between Thompson and Charlotte Small, recognizing Indigenous and Metis contributions to exploration",
    "Students will trace Thompson's major expeditions and explain their significance in mapping western North America",
    "Students will assess why Thompson's achievements went unrecognized during his lifetime and how historical reputation develops over time"
  ],

  teacherActivities: [
    {
      title: "Mapping Without GPS",
      description: "Students work in small groups to map the schoolyard using only a compass, measuring tape, and dead reckoning. Compare results to actual maps to understand the challenges Thompson faced and appreciate the accuracy he achieved.",
      materials: "Compasses, measuring tapes, graph paper, clipboards, actual school maps for comparison",
      duration: "45 minutes"
    },
    {
      title: "Celestial Navigation Demonstration",
      description: "Introduce students to basic principles of celestial navigation. Use a simple sextant model or smartphone app to demonstrate how Thompson determined latitude from the sun or stars. Discuss why determining longitude was more challenging.",
      materials: "Sextant model or navigation app, star charts, globe, protractors",
      duration: "35 minutes"
    },
    {
      title: "David Thompson Biography Research",
      description: "Students research different periods of Thompson's life (childhood, HBC years, NWC years, later life) and create illustrated timeline panels. Combine panels into a class display showing Thompson's complete journey.",
      materials: "Research materials, poster board, markers, printed images of Thompson and his maps",
      duration: "50 minutes"
    },
    {
      title: "Comparative Map Analysis",
      description: "Students compare sections of Thompson's 1814 map with modern satellite imagery of the same regions. Identify what Thompson mapped accurately and discuss why certain features were harder to capture than others.",
      materials: "Printed sections of Thompson's map, Google Earth access, overlay transparencies",
      duration: "40 minutes"
    }
  ],

  teacherQuestions: [
    "Why did Thompson leave the Hudson's Bay Company after thirteen years to join the rival North West Company? What does this tell us about his priorities?",
    "How did Philip Turnor's training transform Thompson from a fur trader into a surveyor? What skills did Thompson learn that made his achievements possible?",
    "What role did Charlotte Small play in Thompson's expeditions? How does her contribution challenge common narratives about exploration?",
    "Why is Thompson called 'the greatest land geographer who ever lived'? What evidence supports this claim?",
    "How did Thompson use Indigenous knowledge in his mapping work? Why was this collaboration essential?",
    "Why did Thompson die in poverty despite his extraordinary achievements? What does this tell us about how society values different types of work?",
    "How do Thompson's maps continue to influence Canada today? What boundaries and geographic knowledge can be traced to his work?"
  ],

  teacherNotes: `This lesson examines David Thompson as both a scientific explorer and a figure whose life reveals important truths about historical recognition, Indigenous-European partnerships, and the nature of achievement.

Key teaching points:
- Thompson's work was based on rigorous scientific method, not adventure or luck
- His partnership with Charlotte Small and reliance on Indigenous knowledge were essential to his success
- The scope of his achievement is staggering: 90,000 kilometers traveled, 3.9 million square kilometers mapped
- His maps established boundaries still in use today, including portions of the Canada-US border
- Thompson's lack of recognition during his lifetime raises important questions about how we value different types of contributions

Sensitive considerations:
- Acknowledge that Thompson's mapping facilitated colonial expansion and its impacts on Indigenous peoples
- Charlotte Small's contributions should be central to the narrative, not treated as a footnote
- Discuss how Indigenous geographic knowledge was essential but often went unacknowledged
- Thompson himself was more respectful of Indigenous peoples than many contemporaries

Cross-curricular connections:
- Mathematics: celestial navigation, triangulation, calculating distances and positions
- Science: astronomy, geography, meteorology, scientific observation methods
- Art: cartography as both science and craft, visual representation of landscape
- Social Studies: exploration, colonization, Indigenous-European relations, fur trade

Extension activities:
- Compare Thompson's methods to modern GPS and satellite mapping technology
- Research how Indigenous peoples created and transmitted geographic knowledge
- Study the Canada-US border and trace which sections Thompson helped survey
- Examine how Thompson's maps were used by subsequent explorers and settlers

Assessment ideas:
- Create a simple map using compass and measurement, then evaluate its accuracy
- Write a biographical essay comparing Thompson's recognition then versus now
- Analyze excerpts from Thompson's journals for evidence of his methods and values
- Design a museum exhibit explaining Thompson's achievements to modern visitors`
};

async function updateDavidThompson() {
  console.log("=== UPDATING 'David Thompson: Master Mapmaker' IN TURSO ===\n");

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
        davidThompsonContent.narrativeContent,
        davidThompsonContent.heroImageUrl,
        JSON.stringify(davidThompsonContent.images),
        JSON.stringify(davidThompsonContent.keyFigures),
        JSON.stringify(davidThompsonContent.timeline),
        JSON.stringify(davidThompsonContent.teacherObjectives),
        JSON.stringify(davidThompsonContent.teacherActivities),
        JSON.stringify(davidThompsonContent.teacherQuestions),
        davidThompsonContent.teacherNotes,
        davidThompsonContent.id
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
      args: [davidThompsonContent.id]
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
    console.error("Error updating David Thompson: Master Mapmaker:", error);
    throw error;
  }
}

updateDavidThompson()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to update:", error);
    process.exit(1);
  });
