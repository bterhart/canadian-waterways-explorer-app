import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const northwestPassageContent = {
  id: "cmliiajda000dm2u233io4qsk",

  // 300-500 word narrative about the Northwest Passage
  narrativeContent: `For centuries, European nations dreamed of finding a water route through North America to the riches of Asia. This mythical Northwest Passage promised shorter journeys to China and India, bypassing the long voyages around Africa or South America. The search became an obsession that cost countless lives in the frozen Arctic waters.

## Early Explorers

Martin Frobisher launched the quest in 1576, sailing into what he hoped was the passage to China. Instead, he found Baffin Island and brought back worthless iron pyrite he believed was gold. John Davis made three voyages in the 1580s, charting Greenland's coast and reaching 72 degrees north. Henry Hudson explored the strait and bay that bear his name in 1610, searching for a western outlet. When ice trapped his ship for winter, his mutinous crew set Hudson adrift in a small boat, never to be seen again.

## The Harsh Reality

The Arctic proved far deadlier than anyone imagined. Temperatures plunged to minus forty degrees. Ice crushed wooden ships like eggshells. The brief summer sailing season gave way to months of darkness. Scurvy weakened crews. Starvation haunted every expedition. Despite these horrors, explorers kept coming, convinced the passage existed just beyond the next headland.

## The Franklin Disaster

In 1845, Sir John Franklin departed England with two ships, HMS Erebus and Terror, and 129 men. They carried three years of provisions and the latest technology. They were never seen alive by Europeans again. The ships became trapped in ice near King William Island. After Franklin died in 1847, the surviving crew abandoned the vessels and attempted to walk to safety. All perished.

## Indigenous Knowledge

Inuit peoples had lived in the Arctic for thousands of years, developing sophisticated survival techniques Europeans ignored. When Scottish explorer Dr. John Rae investigated Franklin's fate in 1854, Inuit informants told him what happened. They showed him artifacts and described finding bodies. Rae's report, including evidence of cannibalism among the desperate survivors, shocked Victorian England. Many refused to believe him, but the Inuit accounts proved accurate.

## Final Success

Norwegian explorer Roald Amundsen finally conquered the passage between 1903 and 1906. Unlike Franklin's massive expedition, Amundsen used a small vessel and learned from the Inuit. He spent two winters learning Arctic survival skills from local people before completing the journey. His success came not from conquering the Arctic but from respecting it and those who knew it best.

The Northwest Passage claimed hundreds of lives over three centuries. Today, climate change is melting the ice that defeated so many explorers, opening shipping routes that Franklin and others died seeking.`,

  heroImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/HMS_Erebus_and_Terror_in_the_Antarctic_by_John_Wilson_Carmichael.jpg?width=800",

  images: [
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Franklin%27s_lost_expedition_-_HMS_Erebus_and_Terror.jpg?width=800",
      caption: "HMS Erebus and Terror, the ill-fated ships of the Franklin expedition that became trapped in Arctic ice in 1845",
      credit: "Wikimedia Commons"
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/John_Rae_%28explorer%29.jpg?width=800",
      caption: "Dr. John Rae, the Scottish explorer who discovered the fate of the Franklin expedition through Inuit testimony",
      credit: "Wikimedia Commons"
    }
  ],

  keyFigures: [
    {
      name: "Sir John Franklin",
      role: "Royal Navy Officer and Arctic Explorer",
      years: "1786-1847",
      description: "Led the doomed 1845 expedition seeking the Northwest Passage with HMS Erebus and Terror, resulting in the deaths of all 129 crew members",
      explorerId: "cmlhaslq60008m2zhokwxq1v6"
    },
    {
      name: "Dr. John Rae",
      role: "Scottish Explorer and Surveyor",
      years: "1813-1893",
      description: "Discovered the fate of the Franklin expedition in 1854 through Inuit informants, mapping more of the Canadian Arctic than any other explorer",
      explorerId: "cmlhc4gu4000dm2ogqifw8dbk"
    },
    {
      name: "Martin Frobisher",
      role: "English Explorer and Privateer",
      years: "c.1535-1594",
      description: "Made three voyages to the Canadian Arctic in the 1570s, becoming one of the first Europeans to seek the Northwest Passage",
      explorerId: "cmlnewexp002frobisher"
    },
    {
      name: "Henry Hudson",
      role: "English Explorer and Navigator",
      years: "c.1565-1611",
      description: "Explored the Hudson Strait and Bay in 1610-1611, searching for the Northwest Passage until his crew mutinied and set him adrift",
      explorerId: "cmlhc4grp0004m2ogg57dim4b"
    },
    {
      name: "Roald Amundsen",
      role: "Norwegian Explorer",
      years: "1872-1928",
      description: "First to successfully navigate the entire Northwest Passage (1903-1906), learning survival skills from Inuit peoples",
      explorerId: "cmlnewexp001amundsen"
    }
  ],

  timeline: [
    {
      year: 1576,
      title: "Frobisher's First Voyage",
      description: "Martin Frobisher sails to Baffin Island seeking the Northwest Passage, becoming one of the first Europeans to search for the Arctic route to Asia",
      eventId: null
    },
    {
      year: 1610,
      title: "Hudson's Final Voyage",
      description: "Henry Hudson explores the strait and bay bearing his name, searching for a western outlet to the Pacific before his crew mutinies",
      eventId: null
    },
    {
      year: 1845,
      title: "Franklin Expedition Departs",
      description: "Sir John Franklin leaves England with HMS Erebus and Terror and 129 men, beginning the most famous disaster in Arctic exploration history",
      eventId: null
    },
    {
      year: 1854,
      title: "Rae Discovers Franklin's Fate",
      description: "Dr. John Rae learns from Inuit informants what happened to the Franklin expedition, recovering artifacts and documenting the tragedy",
      eventId: null
    },
    {
      year: 1906,
      title: "Amundsen Completes the Passage",
      description: "Roald Amundsen arrives in Alaska after three years navigating through the Arctic, becoming the first to traverse the entire Northwest Passage",
      eventId: null
    }
  ],

  teacherObjectives: [
    "Students will understand why European nations were so determined to find a Northwest Passage to Asia and the economic motivations driving Arctic exploration",
    "Students will analyze the challenges and dangers faced by early Arctic explorers including Frobisher, Davis, and Hudson",
    "Students will evaluate the factors that led to the tragic failure of the Franklin expedition of 1845",
    "Students will recognize the importance of Inuit knowledge and how Indigenous peoples helped solve the mystery of Franklin's fate",
    "Students will compare the different approaches to Arctic exploration and explain why Amundsen succeeded where others failed"
  ],

  teacherActivities: [
    {
      title: "Arctic Survival Challenge",
      description: "Students analyze the supplies and equipment taken by the Franklin expedition versus what Amundsen brought. Compare weights, practicality, and cultural assumptions. Discuss what the Inuit knew that Europeans ignored and why learning from Indigenous peoples was essential for survival.",
      materials: "Supply lists from both expeditions, comparison chart, Arctic environment fact sheet, discussion questions",
      duration: "35 minutes"
    },
    {
      title: "Mystery Investigation: What Happened to Franklin?",
      description: "Present students with the evidence Dr. John Rae collected from Inuit informants. Students work as historical investigators to piece together the timeline of the expedition's fate. Discuss why Victorian England refused to believe Inuit testimony.",
      materials: "Primary source excerpts, artifact photographs, Inuit testimony transcripts, investigation worksheet, timeline template",
      duration: "40 minutes"
    },
    {
      title: "Mapping the Failed Voyages",
      description: "Students trace the routes of Frobisher, Hudson, and Franklin on Arctic maps. Identify where each expedition encountered problems, mark where ships were lost or crews perished, and analyze what geographic knowledge was gained despite the failures.",
      materials: "Blank Arctic maps, expedition route cards, colored markers, geographic feature labels, reflection questions",
      duration: "30 minutes"
    },
    {
      title: "Perspective Writing: Letters Home",
      description: "Students write letters from different perspectives: a crew member on the trapped Erebus, an Inuit observer watching the strangers, or Dr. Rae reporting his findings. Discuss how different viewpoints reveal different aspects of historical events.",
      materials: "Historical context sheets, writing prompts, perspective cards, peer review rubric",
      duration: "35 minutes"
    }
  ],

  teacherQuestions: [
    "Why were European nations willing to send expedition after expedition to find the Northwest Passage despite the terrible death tolls?",
    "What does Henry Hudson's fate tell us about the dangers and desperation of early Arctic exploration?",
    "Why do you think the Franklin expedition failed so catastrophically despite having the best equipment and supplies of its time?",
    "How did Inuit peoples survive and thrive in the same Arctic environment that killed European explorers?",
    "Why did many people in Victorian England refuse to believe Dr. John Rae's report about what happened to Franklin's crew?",
    "What lessons did Roald Amundsen learn from Indigenous peoples that helped him succeed where others had failed?",
    "How has climate change affected the Northwest Passage today, and what would the explorers who died seeking it think about modern shipping routes through the Arctic?"
  ],

  teacherNotes: `This lesson explores one of the most dramatic stories in exploration history, offering opportunities to discuss perseverance, hubris, cultural assumptions, and the value of Indigenous knowledge.

Key teaching approaches:
- Emphasize the human cost of the search for the Northwest Passage without sensationalizing the deaths
- Highlight the contrast between European technological confidence and Inuit practical knowledge
- Use the Franklin expedition as a case study in how assumptions and cultural bias can lead to disaster
- Present Roald Amundsen's success as a lesson in humility and cross-cultural learning

Sensitive considerations:
- The topic includes discussion of death, starvation, and cannibalism among Franklin's crew
- Handle the cannibalism evidence sensitively and age-appropriately
- Avoid portraying Inuit peoples as merely "helpful natives" - they had their own complex societies and reasons for interacting with Europeans
- Discuss how Victorian racism led people to dismiss Inuit testimony about Franklin

Historical accuracy notes:
- HMS Erebus was discovered in 2014 and HMS Terror in 2016, providing new evidence about the expedition
- Recent archaeological evidence has confirmed much of what Inuit oral history preserved for over 150 years
- The Northwest Passage is now navigable in summer due to climate change, adding contemporary relevance

Cross-curricular connections:
- Science: Arctic climate, ice formation, scurvy and nutrition
- Geography: Arctic navigation, map reading, climate change
- Language Arts: Primary source analysis, perspective writing
- Social Studies: Colonial attitudes, Indigenous knowledge systems, cultural bias`
};

async function updateNorthwestPassage() {
  console.log("=== UPDATING 'The Northwest Passage: Dreams and Disasters' IN TURSO ===\n");

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
        northwestPassageContent.narrativeContent,
        northwestPassageContent.heroImageUrl,
        JSON.stringify(northwestPassageContent.images),
        JSON.stringify(northwestPassageContent.keyFigures),
        JSON.stringify(northwestPassageContent.timeline),
        JSON.stringify(northwestPassageContent.teacherObjectives),
        JSON.stringify(northwestPassageContent.teacherActivities),
        JSON.stringify(northwestPassageContent.teacherQuestions),
        northwestPassageContent.teacherNotes,
        northwestPassageContent.id
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
      args: [northwestPassageContent.id]
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
    console.error("Error updating The Northwest Passage: Dreams and Disasters:", error);
    throw error;
  }
}

updateNorthwestPassage()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to update:", error);
    process.exit(1);
  });
