import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const louisRielContent = {
  id: "cmligbky2001am20zloxux478",

  // 300-500 word narrative for general users
  narrativeContent: `Louis Riel stands as one of Canada's most significant and controversial historical figures. Born in 1844 at Red River in present-day Manitoba, Riel grew up in the Metis community where French-Canadian and Indigenous cultures merged into a distinct nation. Educated in Montreal, he returned home to find his people's way of life threatened by Canadian expansion.

## The Red River Resistance

In 1869, when Canada purchased Rupert's Land from the Hudson's Bay Company without consulting its inhabitants, the Metis faced an uncertain future. Riel emerged as their leader, organizing a provisional government that negotiated Manitoba's entry into Confederation in 1870. This remarkable achievement secured land rights, language protections, and provincial status for the Metis homeland.

However, the execution of Thomas Scott, an Ontario Orangeman, during the resistance made Riel a wanted man in English Canada. Though elected three times to Parliament, he could never take his seat. He fled into exile, spending years in the United States while his people watched their promised rights erode.

## The Northwest Resistance

By 1884, Metis communities along the Saskatchewan River faced the same pressures their Red River cousins had experienced fifteen years earlier. They summoned Riel from Montana to lead them once again. What began as peaceful petitioning escalated into armed conflict at Duck Lake, Fish Creek, and Batoche in 1885.

Gabriel Dumont, the brilliant Metis military commander, won early victories, but the arrival of Canadian troops via the newly completed railway sealed the resistance's fate. After Batoche fell, Riel surrendered while Dumont escaped to the United States.

## Trial and Legacy

Riel's trial in Regina became a national spectacle. Despite arguments of insanity that might have saved him, Riel insisted on defending his actions as justified. Found guilty of treason, he was hanged on November 16, 1885. His execution inflamed French-English tensions that shaped Canadian politics for generations.

Today, Riel is recognized as the founder of Manitoba and a defender of Metis rights. In 1992, Parliament acknowledged him as a founder of Confederation. His legacy encompasses the ongoing struggle for Indigenous and Metis recognition, the tensions between federal authority and regional rights, and the complex question of who belongs in Canadian history. Louis Riel Day is now celebrated as a statutory holiday in Manitoba.`,

  heroImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Louis_Riel.jpg?width=800",

  images: [
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Louis_Riel_and_his_councillors_1870.jpg?width=800",
      caption: "Louis Riel and his councillors during the Red River Resistance, 1870",
      credit: "Wikimedia Commons"
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Riel_Statue_at_the_Manitoba_Legislative_Building.jpg?width=800",
      caption: "Statue of Louis Riel at the Manitoba Legislative Building, honoring his role as founder of the province",
      credit: "Wikimedia Commons"
    }
  ],

  keyFigures: [
    {
      name: "Louis Riel",
      role: "Metis Leader",
      years: "1844-1885",
      description: "Founder of Manitoba and leader of two Metis resistances, executed for treason in 1885",
      explorerId: "cmlijaifw000xm22ryj4g6yxi"
    },
    {
      name: "Gabriel Dumont",
      role: "Military Commander",
      years: "1837-1906",
      description: "Brilliant Metis military leader during the Northwest Resistance, known for his tactical skills",
      explorerId: "cmlijaifz000ym22rzqy45znk"
    },
    {
      name: "Cuthbert Grant",
      role: "Metis Leader",
      years: "1793-1854",
      description: "Earlier Metis leader who established patterns of resistance and community organization",
      explorerId: "cmlijaig1000zm22rsw2ep9oo"
    },
    {
      name: "Jean-Baptiste Lagimodiere",
      role: "Voyageur and Settler",
      years: "1778-1855",
      description: "Grandfather of Louis Riel, one of the first European settlers at Red River",
      explorerId: "cmlijaig40010m22r2xcwlf62"
    }
  ],

  timeline: [
    {
      year: 1844,
      title: "Riel Born at Red River",
      description: "Louis Riel is born on October 22 in the Red River Settlement, into a prominent Metis family",
      eventId: null
    },
    {
      year: 1869,
      title: "Red River Resistance",
      description: "Riel leads the Metis in establishing a provisional government to negotiate Manitoba's entry into Confederation",
      eventId: "cmligbkzm001um20zw5hmtl3k"
    },
    {
      year: 1870,
      title: "Manitoba Act",
      description: "Manitoba becomes a province with protections for Metis land rights and French language, largely due to Riel's negotiations",
      eventId: "cmligbkzp001vm20zk567ec16"
    },
    {
      year: 1885,
      title: "Northwest Resistance",
      description: "Riel leads Saskatchewan Metis in armed resistance against Canadian government, culminating in the Battle of Batoche",
      eventId: "cmligbkzs001wm20zc5pvz6ki"
    },
    {
      year: 1885,
      title: "Riel Executed",
      description: "After trial in Regina, Louis Riel is hanged for treason on November 16, becoming a martyr for the Metis cause",
      eventId: "cmligbkzu001xm20zlpkn79ve"
    }
  ],

  teacherObjectives: [
    "Students will understand Louis Riel's background and the cultural context of the Metis Nation",
    "Students will analyze the causes and outcomes of the Red River Resistance of 1869-70",
    "Students will evaluate the significance of the Manitoba Act and its implementation",
    "Students will examine the factors leading to the Northwest Resistance of 1885",
    "Students will assess Riel's legacy and the ongoing debates about his place in Canadian history"
  ],

  teacherActivities: [
    {
      title: "Primary Source Analysis",
      description: "Students examine excerpts from Riel's trial speeches and letters. They identify his arguments for Metis rights and analyze how his words reveal his motivations and beliefs.",
      materials: "Excerpts from Riel's trial testimony, his 'Letter to the American People,' analysis worksheet",
      duration: "30 minutes"
    },
    {
      title: "Perspectives Debate",
      description: "Divide class into groups representing different perspectives on Riel: Metis community members, English-Canadian settlers, French-Canadian politicians, and federal government officials. Each group presents their view of Riel's actions.",
      materials: "Role cards with historical context, debate guidelines, primary source quotes for each perspective",
      duration: "35 minutes"
    },
    {
      title: "Timeline Mapping",
      description: "Students create detailed timelines of Riel's life, marking key events in parallel with developments in Canadian expansion, railway construction, and government policy toward Indigenous peoples.",
      materials: "Large paper, markers, event cards, reference materials on Canadian history 1840-1885",
      duration: "25 minutes"
    },
    {
      title: "Legacy Investigation",
      description: "Students research how Riel has been remembered over time: from traitor to hero. They examine monuments, holidays, and parliamentary recognition to trace changing attitudes.",
      materials: "Images of Riel memorials, parliamentary documents, newspaper articles from different eras",
      duration: "30 minutes"
    }
  ],

  teacherQuestions: [
    "Why did the Metis feel threatened by Canadian expansion into their homeland?",
    "How did Riel's education in Montreal shape his ability to lead the resistance movements?",
    "What were the key achievements of the Red River Resistance and the Manitoba Act?",
    "Why did the protections promised in the Manitoba Act fail to materialize for the Metis?",
    "How did the completion of the Canadian Pacific Railway affect the outcome of the Northwest Resistance?",
    "Was Riel a traitor or a hero? How has this perception changed over time?",
    "What does Riel's story reveal about the relationship between Indigenous peoples and the Canadian government?"
  ],

  teacherNotes: `This lesson addresses a sensitive and significant topic in Canadian history. Louis Riel's story involves questions of justice, identity, and reconciliation that remain relevant today.

Key teaching points:
- Riel was a sophisticated political leader, not simply a rebel
- The Metis were a distinct nation with their own culture, language, and political organization
- Both resistances arose from legitimate grievances about land rights and government recognition
- Riel's execution had lasting effects on French-English relations in Canada

Sensitive considerations:
- Approach this topic with awareness that Metis students may have personal connections to this history
- Avoid simplistic hero/villain narratives; encourage students to grapple with complexity
- Acknowledge that debates about Riel continue in Canadian society
- The term "rebellion" reflects a particular perspective; "resistance" is now more commonly used
- Some families and communities still carry trauma from the events of 1885

Cross-curricular connections:
- Civics: Provincial vs. federal jurisdiction, minority rights, political negotiation
- Law: Trial procedures, the insanity defense, treason as a legal concept
- Geography: The impact of the railway on western development and Indigenous displacement
- Indigenous Studies: Metis identity, the Metis Nation's ongoing political status

Assessment ideas:
- Write a letter from Riel's perspective explaining his actions
- Create a museum exhibit proposal on the Red River or Northwest Resistance
- Analyze how textbooks have portrayed Riel across different decades
- Research and present on Louis Riel Day celebrations in Manitoba`
};

async function updateLouisRiel() {
  console.log("=== UPDATING 'Louis Riel and the Metis Nation' IN TURSO ===\n");

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
        louisRielContent.narrativeContent,
        louisRielContent.heroImageUrl,
        JSON.stringify(louisRielContent.images),
        JSON.stringify(louisRielContent.keyFigures),
        JSON.stringify(louisRielContent.timeline),
        JSON.stringify(louisRielContent.teacherObjectives),
        JSON.stringify(louisRielContent.teacherActivities),
        JSON.stringify(louisRielContent.teacherQuestions),
        louisRielContent.teacherNotes,
        louisRielContent.id
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
      args: [louisRielContent.id]
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
    console.error("Error updating Louis Riel and the Metis Nation:", error);
    throw error;
  }
}

updateLouisRiel()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to update:", error);
    process.exit(1);
  });
