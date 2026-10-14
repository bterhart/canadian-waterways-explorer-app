import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const pemmicanTrailContent = {
  id: "cmliiajcj0008m2u2gtcpor3y",

  // 300-500 word narrative about The Pemmican Trail
  narrativeContent: `Pemmican was the ultimate survival food of the fur trade era, a concentrated mixture of dried buffalo meat, rendered fat, and dried berries that could sustain voyageurs and traders on grueling journeys across the continent. This remarkable food, developed by Indigenous peoples over thousands of years, became so essential to the trade that entire economic systems and violent conflicts revolved around its production and distribution.

## The Perfect Trail Food

Making pemmican was a labor-intensive process, primarily performed by Indigenous and Metis women whose expertise was essential to the fur trade. Buffalo meat was first cut into thin strips and dried over slow fires or in the prairie sun. Once thoroughly dried, the meat was pounded into a fine powder using stone hammers. This powder was then mixed with melted buffalo fat and sometimes saskatoon berries, chokecherries, or cranberries. The mixture was packed into buffalo-hide bags called taureaux, each weighing about forty kilograms.

## Why Pemmican Mattered

The genius of pemmican lay in its concentration. One kilogram of pemmican contained roughly 3,500 calories, more than double the caloric density of fresh meat. It remained edible for years without refrigeration, survived extreme temperatures, and provided complete nutrition. A voyageur could survive on less than a kilogram per day while paddling and portaging from dawn to dusk. No other food could fuel the brigades that carried trade goods thousands of kilometers into the interior.

## The Red River Pemmican Trade

By the late eighteenth century, Red River had become the center of pemmican production. Metis hunters, combining Indigenous buffalo hunting traditions with European trade connections, organized massive twice-yearly hunts. The summer hunt alone might kill thousands of buffalo, producing hundreds of tonnes of pemmican. The North West Company established a sophisticated provisioning system, maintaining depots where brigades could resupply. Without this system, interior trade would have been impossible.

## Conflict Over Pemmican

The importance of pemmican made it a strategic resource. When the Earl of Selkirk established the Red River Colony in 1812, settlers and traders began competing for the same buffalo herds. In 1814, Miles Macdonell, the colony's governor, issued the Pemmican Proclamation, forbidding the export of provisions from the region. This decree threatened the Metis way of life and the North West Company's supply lines.

The conflict escalated into violence. Metis leader Cuthbert Grant emerged as a defender of his people's rights to hunt and trade freely. Tensions culminated in the Battle of Seven Oaks in 1816, where twenty-one colonists died including Governor Robert Semple. Though often portrayed as a massacre, many Metis viewed it as resistance against colonial encroachment. The pemmican conflict demonstrated how control over food resources shaped the fur trade's power dynamics and foreshadowed larger struggles over Indigenous and Metis rights that would continue for generations.`,

  heroImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Paul_Kane_-_Half-Breeds_Running_Buffalo.jpg?width=800",

  images: [
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Pemmican.jpg?width=800",
      caption: "Traditional pemmican made from dried meat, fat, and berries - the food that powered the fur trade",
      credit: "Wikimedia Commons"
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Metis_buffalo_hunt.jpg?width=800",
      caption: "Metis hunters pursuing buffalo on the prairies, the foundation of pemmican production",
      credit: "Wikimedia Commons"
    }
  ],

  keyFigures: [
    {
      name: "Cuthbert Grant",
      role: "Metis Leader",
      years: "1793-1854",
      description: "Captain of the Metis who emerged as a leader during the pemmican conflicts and led his people at the Battle of Seven Oaks. Later served as Warden of the Plains.",
      explorerId: "cmlijaig1000zm22rsw2ep9oo"
    },
    {
      name: "Jean-Baptiste Lagimodiere",
      role: "Plains Hunter and Messenger",
      years: "1778-1855",
      description: "Expert buffalo hunter and one of the first French-Canadian settlers in the Red River region. Famous for his epic winter journey to Montreal to summon help for the colony.",
      explorerId: "cmlijaig40010m22r2xcwlf62"
    },
    {
      name: "George Simpson",
      role: "HBC Governor",
      years: "1787-1860",
      description: "After the 1821 merger, Simpson reorganized the fur trade's provisioning system and recognized the critical importance of pemmican supplies to company operations.",
      explorerId: "cmlijai0q0003m22r2hk84pe9"
    }
  ],

  timeline: [
    {
      year: "Pre-contact",
      title: "Indigenous Pemmican Traditions",
      description: "Indigenous peoples of the Great Plains develop pemmican-making techniques over thousands of years, creating the perfect preserved food for nomadic life and long-distance travel"
    },
    {
      year: "1780s",
      title: "NWC Pemmican Provisioning System",
      description: "The North West Company establishes a systematic pemmican supply network to provision its brigades, with depots at key points along trade routes"
    },
    {
      year: "1814",
      title: "Pemmican Proclamation",
      description: "Governor Miles Macdonell issues the Pemmican Proclamation, forbidding export of provisions from the Red River region, threatening Metis livelihoods and NWC supply lines"
    },
    {
      year: "1816",
      title: "Battle of Seven Oaks",
      description: "Conflict over pemmican and land rights culminates in violence at Seven Oaks, where Metis forces led by Cuthbert Grant clash with colonists",
      eventId: "cmligbkzh001sm20zl3p8vx3z"
    },
    {
      year: "1821",
      title: "HBC-NWC Merger",
      description: "The merger of the Hudson's Bay Company and North West Company reorganizes the pemmican trade under unified control",
      eventId: "cmligbkzk001tm20z7riv5nwi"
    }
  ],

  teacherObjectives: [
    "Students will understand the nutritional science behind pemmican and why it was ideal for long-distance travel",
    "Students will recognize the essential role of Indigenous and Metis women in pemmican production and the fur trade economy",
    "Students will analyze how control over food resources shaped power dynamics in the fur trade",
    "Students will evaluate the causes and consequences of the Pemmican Proclamation and Battle of Seven Oaks",
    "Students will trace the development of Red River as a center of Metis culture and pemmican production"
  ],

  teacherActivities: [
    {
      title: "Pemmican Nutrition Lab",
      description: "Students calculate the caloric density and nutritional value of pemmican versus modern trail foods. Compare calories per kilogram, protein content, and preservation methods. Discuss why pemmican was superior for fur trade conditions.",
      materials: "Nutrition labels from modern energy bars and trail foods, calculators, comparison worksheet, pemmican recipe information",
      duration: "40 minutes"
    },
    {
      title: "Food Preservation Science",
      description: "Explore the science behind pemmican preservation: dehydration, fat sealing, and antimicrobial properties of berries. Students experiment with drying fruit and discuss how these principles apply to modern food science.",
      materials: "Fruit slices, dehydrator or sun-drying setup, magnifying glasses, preservation timeline worksheet",
      duration: "50 minutes"
    },
    {
      title: "Pemmican Trade Simulation",
      description: "Students role-play as Metis hunters, North West Company traders, Red River colonists, and HBC officials. Each group must negotiate for pemmican supplies, experiencing how competition created conflict.",
      materials: "Role cards, trade tokens representing pemmican bags, negotiation rules sheet, map of Red River region",
      duration: "45 minutes"
    },
    {
      title: "Buffalo Hunt Research Project",
      description: "Research the Metis buffalo hunting tradition: communal organization, laws of the hunt, roles of different participants, processing techniques. Create an illustrated guide to the summer hunt.",
      materials: "Research materials, poster board, markers, images of Metis buffalo hunts",
      duration: "55 minutes"
    }
  ],

  teacherQuestions: [
    "Why was pemmican more valuable than gold to fur traders? What made it irreplaceable for long journeys?",
    "How did Indigenous food science enable European exploration and trade in North America?",
    "What do the gendered roles in pemmican production tell us about work, value, and recognition in fur trade society?",
    "Why did Governor Macdonell issue the Pemmican Proclamation, and why did it provoke such strong resistance?",
    "How do Metis perspectives on the Battle of Seven Oaks differ from traditional accounts? Why do these different interpretations matter?",
    "What does the phrase 'food is power' mean in the context of the pemmican trade?",
    "How did the Red River Metis develop a distinct culture around the buffalo hunt and pemmican production?"
  ],

  teacherNotes: `This lesson explores pemmican as both a remarkable food technology and a lens for understanding fur trade economics, Indigenous knowledge systems, Metis identity, and colonial conflict.

Key teaching points:
- Pemmican represents sophisticated Indigenous food science developed over millennia
- Metis women were essential to pemmican production, making them key economic actors often overlooked in traditional histories
- Control over pemmican meant control over the fur trade, making it a strategic resource
- The pemmican conflicts at Red River were about more than food; they concerned land rights, Metis identity, and resistance to colonialism
- The Battle of Seven Oaks remains significant to Metis identity and demonstrates how historical events are interpreted differently by different communities

Sensitive considerations:
- Present Indigenous food technologies as sophisticated science, not primitive survival skills
- Center Metis perspectives when discussing Seven Oaks; avoid framing it solely as a massacre
- Acknowledge the ongoing significance of these events to Metis identity and rights
- Discuss how the destruction of buffalo herds devastated Plains Indigenous peoples and ended the pemmican economy

Cross-curricular connections:
- Science: nutrition, food preservation, dehydration, lipids and proteins
- Mathematics: calculating caloric density, ratios in recipes, provisioning logistics
- Social Studies: Metis culture, fur trade economics, colonial conflicts, Indigenous rights
- Health: nutritional requirements, comparison with modern foods

Extension activities:
- Research modern applications of traditional food preservation techniques
- Compare pemmican to other traditional preserved foods worldwide (jerky, hardtack, etc.)
- Study the ecological relationship between Plains peoples and buffalo herds
- Examine how the near-extinction of buffalo affected Indigenous and Metis peoples

Assessment ideas:
- Calculate and compare nutritional values of historical and modern trail foods
- Write from the perspective of a Metis pemmican maker explaining their work's importance
- Analyze primary sources from both Metis and colonial perspectives on Seven Oaks
- Design a museum exhibit explaining pemmican's role in Canadian history`
};

async function updatePemmicanTrail() {
  console.log("=== UPDATING 'The Pemmican Trail' IN TURSO ===\n");

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
        pemmicanTrailContent.narrativeContent,
        pemmicanTrailContent.heroImageUrl,
        JSON.stringify(pemmicanTrailContent.images),
        JSON.stringify(pemmicanTrailContent.keyFigures),
        JSON.stringify(pemmicanTrailContent.timeline),
        JSON.stringify(pemmicanTrailContent.teacherObjectives),
        JSON.stringify(pemmicanTrailContent.teacherActivities),
        JSON.stringify(pemmicanTrailContent.teacherQuestions),
        pemmicanTrailContent.teacherNotes,
        pemmicanTrailContent.id
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
      args: [pemmicanTrailContent.id]
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
    console.error("Error updating The Pemmican Trail:", error);
    throw error;
  }
}

updatePemmicanTrail()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to update:", error);
    process.exit(1);
  });
