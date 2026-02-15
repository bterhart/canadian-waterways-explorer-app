import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const countryMarriagesContent = {
  id: "cmliiajde000em2u2hdx1wen2",

  // 300-500 word narrative about country marriages and Metis identity
  narrativeContent: `In the world of the fur trade, relationships between European traders and Indigenous women created something entirely new: the Metis nation. These unions, called country marriages or marriages "a la facon du pays" (in the custom of the country), were far more than personal arrangements. They built bridges between worlds and gave rise to a distinct people with their own culture, language, and identity.

## What Were Country Marriages?

Country marriages followed Indigenous customs rather than European church ceremonies. A trader would offer gifts to a woman's family, often including horses, blankets, and trade goods. If accepted, the couple was considered married according to Indigenous law. These marriages created family ties that bound trading companies to Indigenous nations, forming networks of kinship that made commerce possible.

## Women as Cultural Bridges

Indigenous women brought essential skills to these partnerships. They prepared food, made clothing, processed furs, and translated between languages and cultures. Women like Charlotte Small, who married explorer David Thompson, enabled her husband's mapping expeditions through her Cree knowledge and connections. Marie-Anne Gaboury became one of the first European women to settle permanently in the Northwest, establishing roots that her descendants would carry forward.

## The Birth of a Nation

Children of country marriages inherited knowledge from both parents, speaking multiple languages and moving between Indigenous and European worlds. By the early 1800s, thousands of these mixed-heritage families had settled around the Red River, forming the heart of the Metis nation. They developed distinctive traditions: the Michif language blending Cree and French, the Red River jig combining Scottish and Indigenous dance, and the famous buffalo hunt with its strict laws and organization.

## The Metis Heartland

Red River became the Metis homeland, where families like the Grants and Riels built communities that were neither fully European nor Indigenous but something uniquely their own. Cuthbert Grant led the Battle of Seven Oaks in 1816, an early assertion of Metis identity against colonial interference. Gabriel Dumont became the military genius of Metis resistance, commanding buffalo hunters with legendary skill.

## The Fight for Recognition

As Canada expanded westward, the Metis faced threats to their land and way of life. Louis Riel emerged as the voice of his people, leading the Red River Resistance in 1869-70 that created Manitoba and secured Metis rights. When those promises went unfulfilled, Riel returned in 1885 for the Northwest Resistance. Though Riel was executed, his sacrifice made him a martyr and father of Manitoba. Today, the Metis are recognized as one of Canada's three Indigenous peoples, their distinct nationhood rooted in those country marriages of the fur trade era.`,

  heroImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Metis_buffalo_hunt.jpg?width=800",

  images: [
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Louis_Riel.jpg?width=800",
      caption: "Louis Riel, the father of Manitoba and champion of Metis rights, whose leadership defined the Metis struggle for recognition",
      credit: "Wikimedia Commons"
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Red_River_Carts.jpg?width=800",
      caption: "Red River carts, a Metis innovation that became an iconic symbol of Metis culture and the buffalo hunt economy",
      credit: "Wikimedia Commons"
    }
  ],

  keyFigures: [
    {
      name: "Louis Riel",
      role: "Metis Political Leader",
      years: "1844-1885",
      description: "The father of Manitoba who led both the Red River Resistance and the Northwest Resistance, fighting for Metis land rights and self-governance",
      explorerId: "cmlijaifw000xm22ryj4g6yxi"
    },
    {
      name: "Cuthbert Grant",
      role: "Metis Leader",
      years: "1793-1854",
      description: "Led the Battle of Seven Oaks in 1816, an early assertion of Metis identity, and later served as Warden of the Plains",
      explorerId: "cmlijaig1000zm22rsw2ep9oo"
    },
    {
      name: "Marie-Anne Gaboury",
      role: "Metis Matriarch",
      years: "1780-1875",
      description: "One of the first European women to settle permanently in the Northwest, grandmother of Louis Riel, whose family became central to Metis history",
      explorerId: "cmlijaifo000um22rf0tkyc67"
    },
    {
      name: "Gabriel Dumont",
      role: "Metis Military Leader",
      years: "1837-1906",
      description: "The brilliant military commander and buffalo hunt leader who served as adjutant-general during the Northwest Resistance of 1885",
      explorerId: "cmlijaifz000ym22rzqy45znk"
    },
    {
      name: "Charlotte Small",
      role: "Cree Guide and Partner",
      years: "c.1785-1857",
      description: "David Thompson's Cree wife whose knowledge and family connections enabled his famous mapping expeditions across western Canada",
      explorerId: "cmlijaift000wm22r5rj3te9y"
    }
  ],

  timeline: [
    {
      year: 1700,
      title: "Country Marriages Become Common",
      description: "Marriages 'a la facon du pays' between European traders and Indigenous women become standard practice, creating family networks that enable trade",
      eventId: null
    },
    {
      year: 1816,
      title: "Battle of Seven Oaks",
      description: "Cuthbert Grant leads Metis fighters against Hudson's Bay Company forces in an early assertion of Metis identity and territorial rights",
      eventId: "cmligbkzh001sm20zl3p8vx3z"
    },
    {
      year: 1869,
      title: "Red River Resistance",
      description: "Louis Riel leads the Metis in resisting Canadian annexation of Rupert's Land, establishing a provisional government to negotiate entry into Confederation",
      eventId: "cmligbkzm001um20zw5hmtl3k"
    },
    {
      year: 1870,
      title: "Manitoba Act",
      description: "The Manitoba Act creates Canada's fifth province with provisions for Metis land rights, though these promises would later be broken",
      eventId: "cmligbkzp001vm20zk567ec16"
    },
    {
      year: 1885,
      title: "Northwest Resistance",
      description: "Riel returns to lead the Metis at Batoche; despite Gabriel Dumont's military skill, the resistance is defeated and Riel is executed",
      eventId: "cmligbkzs001wm20zc5pvz6ki"
    }
  ],

  teacherObjectives: [
    "Students will understand what country marriages were and why they were important for creating diplomatic and economic alliances in the fur trade",
    "Students will analyze the essential roles that Indigenous women played as cultural bridges, interpreters, and partners in the fur trade",
    "Students will explain how the children of country marriages formed the distinct Metis nation with its own culture, language, and identity",
    "Students will describe the key events and figures in the Metis struggle for land rights and recognition, including both Red River resistances",
    "Students will recognize the Metis as one of Canada's three Indigenous peoples with a distinct history rooted in the fur trade era"
  ],

  teacherActivities: [
    {
      title: "Country Marriage Ceremony Analysis",
      description: "Students compare and contrast country marriage customs with European church marriages of the same era. Examine the gift exchange, family negotiations, and kinship networks created. Discuss why these marriages were mutually beneficial for both Indigenous nations and trading companies.",
      materials: "Primary source descriptions of country marriages, comparison chart, discussion questions about mutual benefits",
      duration: "35 minutes"
    },
    {
      title: "Metis Culture Gallery Walk",
      description: "Create stations featuring different aspects of Metis culture: Michif language samples, Red River jig music/video, buffalo hunt organization, Red River cart design, Metis sash patterns. Students rotate through stations, recording observations about how each element blends Indigenous and European influences.",
      materials: "Station cards, Michif vocabulary lists, music recordings, buffalo hunt laws, sash images, observation sheets",
      duration: "40 minutes"
    },
    {
      title: "Key Figures Biography Cards",
      description: "Students research and create biography cards for key Metis figures (Riel, Grant, Dumont, Charlotte Small, Marie-Anne Gaboury). Each card should include the person's role in Metis history, their connections to both Indigenous and European worlds, and their lasting legacy.",
      materials: "Biography card templates, research sources, presentation guidelines",
      duration: "45 minutes"
    },
    {
      title: "Timeline of Metis Nationhood",
      description: "Students create an illustrated timeline from the 1700s to 1885 showing the development of Metis identity from country marriages to the Northwest Resistance. Include key events, figures, and cultural developments. Discuss how the Metis went from individuals to a recognized nation.",
      materials: "Timeline template, event cards with dates and descriptions, colored markers, illustration guides",
      duration: "40 minutes"
    }
  ],

  teacherQuestions: [
    "Why were country marriages called marriages 'a la facon du pays,' and how did they differ from European marriage customs?",
    "How did country marriages benefit both European trading companies and Indigenous nations beyond just personal relationships?",
    "What essential roles did Indigenous women like Charlotte Small play in making the fur trade successful, and why have these contributions often been overlooked?",
    "How did the children of country marriages develop a distinct identity that was neither fully European nor fully Indigenous but something new?",
    "Why did the Red River settlement become the heartland of Metis culture, and what distinctive traditions developed there?",
    "How did Louis Riel's leadership reflect the Metis position as a people caught between Indigenous and European worlds?",
    "Why is it significant that the Metis are recognized today as one of Canada's three Indigenous peoples, and what does this recognition mean?"
  ],

  teacherNotes: `This lesson explores the origins and development of the Metis nation, one of Canada's three recognized Indigenous peoples. The topic requires sensitivity to both Indigenous perspectives and the complex history of colonization.

Key teaching approaches:
- Present country marriages as legitimate unions within their cultural context, not as informal or lesser relationships
- Emphasize Indigenous women's agency and essential contributions rather than portraying them as passive partners
- Show how Metis identity emerged organically from generations of mixed families, not as a modern construct
- Connect historical events to the contemporary Metis nation and ongoing issues of recognition and rights

Sensitive considerations:
- Be aware that Metis students may be in your classroom with direct family connections to this history
- Avoid language that delegitimizes country marriages or the children born from them
- Acknowledge that Riel remains a controversial figure, seen as a hero by Metis and many Canadians, but historically vilified
- Recognize that Metis land claims and rights remain contested issues in contemporary Canada
- Some students may confuse Metis identity with simply having mixed heritage; clarify that Metis are a specific Indigenous nation

Language guidance:
- Use "Metis" (with or without the accent) rather than outdated terms like "half-breed"
- Refer to "country marriages" or "marriages a la facon du pays" rather than informal unions
- Use "resistance" rather than "rebellion" for 1869-70 and 1885, as "rebellion" implies illegitimacy
- Be careful with possessive language; the land was Indigenous land before being claimed by Canada

Cultural elements to highlight:
- Michif language as a living symbol of Metis identity
- The Red River jig and fiddle music tradition
- The organized buffalo hunt with its military-like structure and laws
- The Metis sash (ceinture flechee) and its patterns and uses
- Red River carts as Metis innovation and symbol

Cross-curricular connections:
- Social Studies: Treaty rights, Indigenous governance, contemporary Metis politics
- Music/Arts: Metis fiddle tradition, beadwork, finger weaving
- Geography: Red River settlement, Batoche, Metis communities across the Northwest
- Civics: Louis Riel's trial, questions of justice and legitimacy`
};

async function updateCountryMarriages() {
  console.log("=== UPDATING 'Country Marriages and Metis Identity' IN TURSO ===\n");

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
        countryMarriagesContent.narrativeContent,
        countryMarriagesContent.heroImageUrl,
        JSON.stringify(countryMarriagesContent.images),
        JSON.stringify(countryMarriagesContent.keyFigures),
        JSON.stringify(countryMarriagesContent.timeline),
        JSON.stringify(countryMarriagesContent.teacherObjectives),
        JSON.stringify(countryMarriagesContent.teacherActivities),
        JSON.stringify(countryMarriagesContent.teacherQuestions),
        countryMarriagesContent.teacherNotes,
        countryMarriagesContent.id
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
      args: [countryMarriagesContent.id]
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
    console.error("Error updating Country Marriages and Metis Identity:", error);
    throw error;
  }
}

updateCountryMarriages()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to update:", error);
    process.exit(1);
  });
