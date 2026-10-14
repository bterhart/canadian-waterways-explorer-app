import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const mappingCanadaContent = {
  id: "cmligbky9001cm20z3vukcwiq",

  // 300-500 word narrative about Mapping Canada: The Work of David Thompson
  narrativeContent: `David Thompson stands as one of history's greatest cartographers, yet he remains surprisingly obscure. Born in London in 1770 to a poor Welsh family, Thompson was orphaned young and placed in a charity school. At fourteen, the Hudson's Bay Company apprenticed him, sending him to Churchill on Hudson Bay.

## Scientific Methods

Thompson's transformation from fur trader to surveyor began when he met Philip Turnor, the HBC's official surveyor. Turnor recognized Thompson's mathematical genius and taught him astronomical observation, sextant use, and triangulation. These scientific methods set Thompson apart from other explorers. He took observations multiple times daily, cross-checked calculations obsessively, and developed techniques to minimize instrument errors. His precision was extraordinary for the era.

## Scale of Achievement

The scope of Thompson's work remains staggering. Over his career, he traveled nearly 90,000 kilometers through North American wilderness and mapped approximately 1.9 million square miles (3.9 million square kilometers). This exceeds the combined area of most European countries. Every river course, mountain pass, and lake position was meticulously recorded in journals filled with calculations.

## Major Expeditions

In 1797, frustrated with the HBC's lack of exploration interest, Thompson joined the rival North West Company. This decision unleashed his potential. He explored the Saskatchewan River system, mapped the Athabasca region, and in 1807 became the first European to cross the Rocky Mountains via Howse Pass. He established Kootenae House and spent years exploring the Columbia River watershed. His 1811 journey down the entire Columbia to the Pacific completed the mapping of this crucial waterway.

## Charlotte Small

Thompson's wife Charlotte Small proved essential to his success. The daughter of a fur trader and a Cree woman, she married Thompson in 1799 and accompanied him on expeditions while raising their thirteen children. Charlotte served as interpreter, guide, and cultural liaison. Thompson credited her with saving his life multiple times.

## The Great Map

Thompson's masterwork came in 1814: a massive map measuring nearly two by three meters, showing western North America from Hudson Bay to the Pacific. This extraordinary document incorporated years of astronomical observations and remained the most accurate representation of the region for decades.

## Legacy

Despite his achievements, Thompson died in poverty in 1857, his contributions forgotten. Only in the twentieth century did scholars recognize him as "the greatest land geographer who ever lived." His maps established boundaries still used today, including portions of the Canada-United States border. Thompson transformed a vast wilderness into documented knowledge that shaped a nation.`,

  heroImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/David_Thompson_(explorer).jpg?width=800",

  images: [
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/David_Thompson_Map_1814.jpg?width=800",
      caption: "David Thompson's Great Map of 1814, showing western North America from Hudson Bay to the Pacific Ocean",
      credit: "Wikimedia Commons"
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Thompson%27s_sextant.jpg?width=800",
      caption: "A sextant similar to those used by David Thompson for astronomical observations",
      credit: "Wikimedia Commons"
    }
  ],

  keyFigures: [
    {
      name: "David Thompson",
      role: "Explorer and Cartographer",
      years: "1770-1857",
      description: "Called 'the greatest land geographer who ever lived,' Thompson traveled nearly 90,000 kilometers and mapped 1.9 million square miles of North America with extraordinary accuracy",
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
    "Students will understand the scientific surveying methods Thompson used, including astronomical observation, sextant measurements, and triangulation",
    "Students will analyze how Thompson's training under Philip Turnor transformed him from fur trader to master cartographer",
    "Students will evaluate the partnership between Thompson and Charlotte Small, recognizing Indigenous and Metis contributions to exploration",
    "Students will trace Thompson's major expeditions including his Rocky Mountain crossing and Columbia River journey, explaining their significance in mapping western North America",
    "Students will assess the scale of Thompson's achievement (1.9 million square miles mapped) and why his work remained the geographic standard for decades"
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
      title: "Scale of Exploration Activity",
      description: "Using a modern map of Canada, students calculate and visualize the 1.9 million square miles Thompson mapped. Compare this area to familiar regions (provinces, states, European countries) to help students comprehend the enormous scale of his achievement.",
      materials: "Large map of Canada, rulers, calculators, colored markers for marking Thompson's routes",
      duration: "30 minutes"
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
    "How did Philip Turnor's training transform Thompson from a fur trader into a surveyor? What specific skills made his achievements possible?",
    "What role did Charlotte Small play in Thompson's expeditions? How does her contribution challenge common narratives about exploration?",
    "How did Thompson's scientific methods differ from other explorers of his era? Why was his precision so remarkable?",
    "Thompson mapped 1.9 million square miles. How can we comprehend this scale? What modern areas combined equal this size?",
    "Why did Thompson die in poverty despite his extraordinary achievements? What does this tell us about how society values different types of work?",
    "How do Thompson's maps continue to influence Canada today? What boundaries and geographic knowledge can be traced to his work?"
  ],

  teacherNotes: `This lesson examines David Thompson's extraordinary cartographic achievements and the scientific methods that made his work groundbreaking.

Key teaching points:
- Thompson's work was based on rigorous scientific method, not adventure or luck
- His astronomical observations and triangulation techniques represented cutting-edge 18th-century geography
- The scale is staggering: 90,000 kilometers traveled, 1.9 million square miles (3.9 million square kilometers) mapped
- His partnership with Charlotte Small and reliance on Indigenous knowledge were essential to success
- The 1814 Great Map remained the standard reference for western North America for decades

Scientific context:
- Sextants measured angles between celestial bodies and the horizon
- Astronomical tables allowed calculation of longitude from precise timing
- Triangulation used known distances and angles to calculate unknown positions
- Thompson took multiple observations daily and cross-checked for accuracy

Sensitive considerations:
- Acknowledge that Thompson's mapping facilitated colonial expansion and its impacts on Indigenous peoples
- Charlotte Small's contributions should be central to the narrative, not treated as a footnote
- Discuss how Indigenous geographic knowledge was essential but often went unacknowledged
- Thompson himself was more respectful of Indigenous peoples than many contemporaries

Cross-curricular connections:
- Mathematics: celestial navigation, triangulation, calculating distances and positions
- Science: astronomy, geography, scientific observation and error correction
- Art: cartography as both science and craft
- Social Studies: exploration, colonization, the Canada-US border

Assessment ideas:
- Create a simple map using compass and measurement, then evaluate its accuracy
- Calculate the scale of Thompson's mapping using modern map comparisons
- Analyze why Thompson's maps remained accurate for so long despite limited instruments`
};

async function updateMappingCanada() {
  console.log("=== UPDATING 'Mapping Canada: The Work of David Thompson' IN TURSO ===\n");

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
        mappingCanadaContent.narrativeContent,
        mappingCanadaContent.heroImageUrl,
        JSON.stringify(mappingCanadaContent.images),
        JSON.stringify(mappingCanadaContent.keyFigures),
        JSON.stringify(mappingCanadaContent.timeline),
        JSON.stringify(mappingCanadaContent.teacherObjectives),
        JSON.stringify(mappingCanadaContent.teacherActivities),
        JSON.stringify(mappingCanadaContent.teacherQuestions),
        mappingCanadaContent.teacherNotes,
        mappingCanadaContent.id
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
      args: [mappingCanadaContent.id]
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
    console.error("Error updating Mapping Canada: The Work of David Thompson:", error);
    throw error;
  }
}

updateMappingCanada()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to update:", error);
    process.exit(1);
  });
