import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const environmentalImpactContent = {
  id: "cmliiajds000im2u2op3br5x9",

  // 300-500 word narrative about environmental consequences of the fur trade
  narrativeContent: `The fur trade fundamentally transformed North American ecosystems, leaving environmental impacts that scientists and historians are still documenting today. At the center of this ecological upheaval was the beaver, a species whose near-extinction reshaped watersheds across the continent.

## Beavers as Ecosystem Engineers

Beavers are among nature's most influential ecosystem engineers. Their dams create wetlands that filter water, control flooding, and provide habitat for countless species including fish, waterfowl, amphibians, and insects. Before European contact, an estimated 60 to 400 million beavers inhabited North America, maintaining millions of acres of wetland habitat. The fur trade would reduce this population to fewer than 100,000 animals by the late 1800s.

## The Westward Wave of Depletion

European beaver populations had collapsed by the 1600s, driving demand for North American pelts. The pattern of depletion followed a predictable westward progression. Eastern populations collapsed by the early 1700s. The Great Lakes region was exhausted by mid-century. By the time Peter Pond and Alexander Mackenzie reached the Athabasca country in the 1770s and 1780s, they were accessing the last major beaver frontier. Samuel Hearne's northern explorations similarly opened previously untouched territories to intensive hunting.

## Cascade Effects

As beaver populations collapsed, their dams deteriorated and wetlands drained. This transformed landscapes in profound ways. Streams that had meandered through marshy beaver meadows became faster, narrower channels. Water tables dropped. Species dependent on wetland habitat declined or disappeared locally. Predators like lynx and wolverine that relied on beaver declined in turn. The ecological web unraveled across vast regions.

## Disruption of Indigenous Conservation

Indigenous peoples had developed sustainable harvesting practices over millennia, taking only what they needed and allowing populations to recover. The commercial fur trade disrupted these practices. Competition between the Hudson's Bay Company and North West Company intensified pressure on wildlife. Indigenous hunters found themselves caught between traditional conservation values and the economic necessity of participating in trade.

## Other Species Affected

While beaver felt the greatest impact, other species suffered significantly. Marten populations declined sharply in trapped regions. Fox, lynx, mink, and otter all experienced regional depletions. Sea otter populations on the Pacific coast were nearly exterminated. Even moose and deer faced pressure as hunters sought food supplies for trading posts.

## Lessons for Today

The environmental devastation of the fur trade offers important lessons for modern conservation. It demonstrates how commercial exploitation can rapidly overwhelm ecosystems that had remained stable for millennia. It shows the importance of Indigenous knowledge and sustainable practices. Most significantly, it reveals how the loss of a single keystone species can trigger cascading effects throughout an ecosystem, a lesson increasingly relevant as we face contemporary environmental challenges.`,

  heroImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Beaver_dam_in_Tierra_del_Fuego.jpg?width=800",

  images: [
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/American_Beaver.jpg?width=800",
      caption: "The American beaver, once numbering up to 400 million, was reduced to fewer than 100,000 by intensive fur trade hunting",
      credit: "Wikimedia Commons"
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Beaver_lodge.jpg?width=800",
      caption: "A beaver lodge and dam creating the wetland habitat that supports dozens of other species in the ecosystem",
      credit: "Wikimedia Commons"
    }
  ],

  keyFigures: [
    {
      name: "Alexander Mackenzie",
      role: "Explorer and Trader",
      years: "1764-1820",
      description: "Scottish explorer who opened remote northern and western territories to intensive trapping, accelerating beaver depletion in previously untouched regions",
      explorerId: "cmlhaslpq0005m2zhbi5xrrt6"
    },
    {
      name: "Peter Pond",
      role: "Trader and Map-maker",
      years: "1740-1807",
      description: "American fur trader who pioneered routes to the Athabasca region in 1778, opening the last major beaver frontier to commercial exploitation",
      explorerId: "cmlhc4gt7000bm2ogmjjkr2c4"
    },
    {
      name: "Samuel Hearne",
      role: "Explorer and HBC Factor",
      years: "1745-1792",
      description: "Hudson's Bay Company explorer whose northern expeditions mapped new territories and expanded the reach of the fur trade into remote ecosystems",
      explorerId: "cmlhaslq40007m2zhtmgblh1t"
    }
  ],

  timeline: [
    {
      year: 1600,
      title: "European Beaver Depletion",
      description: "Beaver populations in Europe collapse from centuries of hunting, driving intense demand for North American furs",
      eventId: null
    },
    {
      year: 1670,
      title: "HBC Charter Granted",
      description: "The Hudson's Bay Company receives its royal charter, beginning systematic commercial exploitation of North American beaver populations",
      eventId: "cmligbkyo001im20zj2yavaqt"
    },
    {
      year: 1700,
      title: "Eastern Beaver Collapse",
      description: "Beaver populations in eastern North America collapse from intensive trapping, forcing traders to push westward for new sources",
      eventId: null
    },
    {
      year: 1778,
      title: "Athabasca Opened",
      description: "Peter Pond reaches the Athabasca region, opening the last major beaver frontier to commercial hunting",
      eventId: null
    },
    {
      year: 1840,
      title: "Silk Hats End Beaver Era",
      description: "Changing fashion preferences toward silk hats reduce demand for beaver felt, ending the era of intensive commercial beaver hunting",
      eventId: null
    }
  ],

  teacherObjectives: [
    "Students will understand the concept of keystone species and explain how beavers function as ecosystem engineers that shape entire landscapes",
    "Students will trace the geographic pattern of beaver population collapse from east to west across North America during the fur trade era",
    "Students will analyze the cascade effects of beaver depletion on wetland ecosystems, water systems, and dependent wildlife species",
    "Students will evaluate how the fur trade disrupted Indigenous conservation practices that had maintained sustainable wildlife populations",
    "Students will connect historical environmental impacts of the fur trade to contemporary conservation challenges and principles"
  ],

  teacherActivities: [
    {
      title: "Ecosystem Web Activity",
      description: "Create a food web showing beaver at the center with connections to wetland plants, fish, waterfowl, predators, and insects. Remove the beaver and discuss which connections break and how the ecosystem changes. Students predict cascade effects.",
      materials: "String or yarn, species cards, ecosystem diagram template, cascade effect worksheet",
      duration: "35 minutes"
    },
    {
      title: "Mapping Depletion Patterns",
      description: "Using a timeline and map, students track the westward progression of beaver depletion from 1600-1840. Mark when each region was opened by explorers and when populations collapsed. Identify the pattern and predict consequences.",
      materials: "Blank maps of North America, timeline cards, depletion data sheet, colored markers",
      duration: "40 minutes"
    },
    {
      title: "Before and After Landscape Analysis",
      description: "Compare illustrations or photographs of beaver-maintained wetlands versus the same areas after beaver removal. Students describe visible differences and infer impacts on water, wildlife, and plant communities.",
      materials: "Comparison images, observation worksheet, landscape change checklist, discussion questions",
      duration: "30 minutes"
    },
    {
      title: "Conservation Debate",
      description: "Students debate whether 18th-century traders could or should have anticipated environmental consequences. Consider economic pressures, available knowledge, Indigenous warnings, and responsibility to future generations.",
      materials: "Role cards (trader, Indigenous elder, company official, modern conservationist), debate guidelines, reflection sheet",
      duration: "40 minutes"
    }
  ],

  teacherQuestions: [
    "What makes beavers 'ecosystem engineers' and why does their loss affect so many other species that do not directly interact with them?",
    "Why did beaver populations collapse first in Europe and then follow a predictable east-to-west pattern across North America?",
    "How did competition between the Hudson's Bay Company and North West Company affect the intensity of beaver hunting and speed of population collapse?",
    "What traditional Indigenous practices helped maintain sustainable beaver populations, and how did the commercial fur trade disrupt these practices?",
    "Besides beaver, what other species were significantly affected by the fur trade, and how did their populations change?",
    "How might North American landscapes look different today if the fur trade had never occurred or had been managed sustainably?",
    "What lessons from the environmental impacts of the fur trade apply to modern conservation challenges we face today?"
  ],

  teacherNotes: `This lesson connects historical events to environmental science and contemporary conservation, making it ideal for cross-curricular teaching. The concept of ecosystem engineers and cascade effects can be challenging for younger students but provides powerful insights for understanding ecological relationships.

Key teaching approaches:
- Use visual diagrams and hands-on activities to make abstract ecosystem concepts concrete
- Connect historical beaver depletion to contemporary examples students may know (wolves in Yellowstone, coral reef decline)
- Emphasize that Indigenous peoples understood sustainable harvesting long before European ecology science developed
- Present the fur trade as an early example of commercial exploitation overwhelming natural systems

Scientific concepts to reinforce:
- Keystone species: organisms whose impact on ecosystems is disproportionate to their numbers
- Ecosystem engineers: species that create, modify, or maintain habitat for other species
- Cascade effects: how changes to one species ripple through food webs and ecosystems
- Carrying capacity: how ecosystems can only sustain certain population levels

Sensitive considerations:
- Avoid presenting this solely as a story of European destruction; acknowledge the complex choices Indigenous peoples faced
- Recognize that economic pressures and lack of ecological knowledge contributed to decisions that seem clearly harmful today
- Connect to contemporary environmental issues without being preachy or politicizing the lesson
- Acknowledge ongoing beaver recovery efforts as a hopeful conclusion

Assessment opportunities:
- Ecosystem diagrams showing beaver's role and cascade effects
- Timeline analysis of depletion patterns with geographic understanding
- Written reflection on lessons for modern conservation
- Comparison of Indigenous and commercial approaches to resource management

Extensions for advanced students:
- Research current beaver reintroduction programs and their ecological effects
- Investigate other historical examples of species depletion (bison, passenger pigeon, Atlantic cod)
- Explore how Indigenous ecological knowledge is informing modern conservation practices`
};

async function updateEnvironmentalImpact() {
  console.log("=== UPDATING 'Environmental Impact of the Fur Trade' IN TURSO ===\n");

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
        environmentalImpactContent.narrativeContent,
        environmentalImpactContent.heroImageUrl,
        JSON.stringify(environmentalImpactContent.images),
        JSON.stringify(environmentalImpactContent.keyFigures),
        JSON.stringify(environmentalImpactContent.timeline),
        JSON.stringify(environmentalImpactContent.teacherObjectives),
        JSON.stringify(environmentalImpactContent.teacherActivities),
        JSON.stringify(environmentalImpactContent.teacherQuestions),
        environmentalImpactContent.teacherNotes,
        environmentalImpactContent.id
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
      args: [environmentalImpactContent.id]
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
    console.error("Error updating Environmental Impact of the Fur Trade:", error);
    throw error;
  }
}

updateEnvironmentalImpact()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to update:", error);
    process.exit(1);
  });
