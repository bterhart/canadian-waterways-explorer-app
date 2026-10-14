import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const canoeBuilderContent = {
  id: "cmliiajbt0003m2u27u32vbfr",

  // 300-500 word narrative for general users
  narrativeContent: `The birch bark canoe stands as one of the most sophisticated watercraft ever designed. Developed over thousands of years by First Nations peoples across North America, these vessels were engineering marvels that Europeans could admire but never successfully replicate. Without Indigenous canoe builders and their extraordinary technology, the fur trade as it existed would have been impossible.

## The Art and Science of Canoe Building

Building a birch bark canoe required deep knowledge passed down through generations. Builders selected birch bark in late spring when the sap was running, carefully peeling sheets from living trees without killing them. The bark had to be the right thickness, free from blemishes, and large enough for the intended vessel. This selection process alone required years of experience to master.

The frame came from white cedar, prized for its lightness, flexibility, and resistance to rot. Ribs were steamed and bent to shape, gunwales carved to exact specifications. Spruce roots, gathered and split into thin strands, served as the stitching that held bark panels together. These roots were soaked until pliable, then woven through holes punched along bark edges. Finally, heated spruce gum mixed with animal fat sealed every seam against water.

## Regional Variations

Different First Nations developed canoes suited to their specific waterways. The Mi'kmaq of the Atlantic coast built ocean-going canoes with high bows and sterns to handle rough seas and coastal waves. Ojibwe birch bark canoes of the Great Lakes region were designed for lake travel and portaging, typically lighter and more maneuverable. The West Coast nations built massive dugout canoes from cedar logs, some large enough to carry dozens of paddlers on ocean voyages.

## Why Europeans Needed Indigenous Builders

French and British traders quickly recognized the canoe's superiority to European boats for navigating North American waterways. Canoes were light enough to carry over portages, flexible enough to absorb impacts with rocks, and repairable with materials found in the forest. European boats were too heavy to portage, too rigid for rough waters, and required specialized materials for repairs.

Despite their best efforts, Europeans could not master canoe construction. The process demanded intimate knowledge of natural materials, when to harvest them, and how to work them. Trading companies had no choice but to rely on Indigenous builders for their vessels. This dependency gave First Nations peoples significant economic leverage and ensured their central role in the fur trade.

## A Living Technology

The birch bark canoe represents more than clever engineering. It embodies thousands of years of accumulated knowledge about materials, waterways, and sustainable harvesting. Each canoe was crafted by skilled artisans whose expertise was recognized and valued by their communities. This Indigenous technology made possible the exploration and commerce that shaped North American history.`,

  heroImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Birch_bark_canoe_at_Pimisi_Bay_on_the_Ottawa_River.jpg?width=800",

  images: [
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/The_Canoe_(1_of_2).jpg?width=800",
      caption: "Close-up of birch bark canoe construction showing the detailed stitching and craftsmanship",
      credit: "Wikimedia Commons"
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Canoe_building.jpg?width=800",
      caption: "Traditional canoe building techniques being demonstrated",
      credit: "Wikimedia Commons"
    }
  ],

  keyFigures: [
    {
      name: "Samuel de Champlain",
      role: "Explorer and Governor",
      years: "1567-1635",
      description: "Documented Indigenous canoe construction in detail and recognized the superiority of birch bark canoes for inland travel",
      explorerId: "cmlhaslpl0004m2zhpjklxgyn"
    },
    {
      name: "Pierre-Esprit Radisson",
      role: "Explorer and Trader",
      years: "1636-1710",
      description: "Depended entirely on Indigenous canoes and paddlers for his expeditions into the fur country",
      explorerId: "cmlhc4gsi0005m2ogwruv73d5"
    },
    {
      name: "Henry Kelsey",
      role: "Explorer and Trader",
      years: "1667-1724",
      description: "Traveled by Indigenous canoe into the interior of western Canada, relying on First Nations technology and expertise",
      explorerId: "cmlhc4gsr0007m2ogrr0m8vqf"
    }
  ],

  timeline: [
    {
      year: -3000,
      title: "Ancient Canoe Development",
      description: "Indigenous peoples develop sophisticated birch bark canoe technology over thousands of years of refinement"
    },
    {
      year: 1603,
      title: "Champlain Documents Canoes",
      description: "Samuel de Champlain provides detailed European accounts of Indigenous canoe construction and use"
    },
    {
      year: 1670,
      title: "HBC Charter Granted",
      description: "Hudson's Bay Company established, relying entirely on Indigenous canoe technology for interior trade",
      eventId: "cmligbkyo001im20zj2yavaqt"
    },
    {
      year: 1821,
      title: "HBC-NWC Merger",
      description: "The merged company continues to depend on Indigenous-built canoes for transportation across the fur trade network",
      eventId: "cmligbkzk001tm20z7riv5nwi"
    }
  ],

  teacherObjectives: [
    "Students will understand the sophisticated engineering knowledge required for birch bark canoe construction",
    "Students will identify the specific materials used in canoe building and explain why each was selected",
    "Students will compare regional variations in canoe design and relate them to different environmental conditions",
    "Students will analyze why Europeans could not replicate Indigenous canoe technology despite recognizing its superiority",
    "Students will evaluate how Indigenous technology shaped the economic and social dynamics of the fur trade"
  ],

  teacherActivities: [
    {
      title: "Materials Investigation",
      description: "Students examine samples or images of birch bark, cedar wood, spruce roots, and spruce gum. Discuss the properties of each material and why it was selected for its specific purpose in canoe construction.",
      materials: "Material samples or high-quality images, magnifying glasses, property comparison worksheets",
      duration: "30 minutes"
    },
    {
      title: "Canoe Design Analysis",
      description: "Compare diagrams or models of different regional canoe styles (Mi'kmaq ocean-going, Ojibwe lake, West Coast dugout). Students analyze how each design addressed specific environmental challenges.",
      materials: "Canoe diagrams, maps showing regions, comparison charts",
      duration: "35 minutes"
    },
    {
      title: "Engineering Challenge",
      description: "Students attempt to design a small model boat using only natural materials (paper bark substitute, sticks, grass for binding). Discuss the challenges they encounter and relate them to Indigenous expertise.",
      materials: "Paper, twigs, grass or string, small tubs of water for testing",
      duration: "45 minutes"
    },
    {
      title: "Knowledge Transfer Roleplay",
      description: "Students roleplay a scenario where a European trader asks an Indigenous builder to teach canoe construction. Explore what knowledge could be taught versus what required years of experience.",
      materials: "Scenario cards, discussion prompts",
      duration: "25 minutes"
    }
  ],

  teacherQuestions: [
    "Why did building a birch bark canoe require knowledge that could only be gained through generations of experience?",
    "How did the different environments across North America lead to different canoe designs?",
    "What does it tell us about Indigenous knowledge systems that Europeans could not replicate canoe technology?",
    "How did Indigenous control over canoe construction affect their position in the fur trade economy?",
    "Why is the birch bark canoe considered a marvel of engineering rather than a simple or primitive technology?",
    "What sustainable practices were built into the canoe-building tradition?",
    "How might the fur trade have been different if Europeans had been able to build their own canoes?"
  ],

  teacherNotes: `This lesson highlights Indigenous technology as sophisticated science, countering stereotypes that dismiss Indigenous knowledge as primitive or simple.

Key teaching points:
- Birch bark canoe construction represents accumulated scientific knowledge refined over thousands of years
- The technology required understanding of materials science, engineering, environmental conditions, and sustainable harvesting
- European inability to replicate this technology demonstrates the complexity of Indigenous knowledge systems
- First Nations peoples held significant economic power through their technological expertise

Sensitive considerations:
- Present Indigenous knowledge as science, not folklore or tradition in a dismissive sense
- Avoid language that implies Indigenous peoples were unchanged or frozen in time
- Acknowledge that canoe-building knowledge continues today among Indigenous communities
- Recognize specific nations rather than treating all Indigenous peoples as interchangeable

Cross-curricular connections:
- Science: materials properties, buoyancy, engineering design
- Environmental Studies: sustainable harvesting practices
- Economics: technology as source of economic power
- Art: craftsmanship and aesthetic elements of canoe design

Assessment ideas:
- Create a technical diagram explaining canoe construction
- Write from the perspective of an Indigenous builder explaining their craft to a European
- Compare Indigenous and European boat-building technologies
- Research a specific First Nation's canoe traditions`
};

async function updateCanoeBuilders() {
  console.log("=== UPDATING 'First Nations Canoe Builders' IN TURSO ===\n");

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
        canoeBuilderContent.narrativeContent,
        canoeBuilderContent.heroImageUrl,
        JSON.stringify(canoeBuilderContent.images),
        JSON.stringify(canoeBuilderContent.keyFigures),
        JSON.stringify(canoeBuilderContent.timeline),
        JSON.stringify(canoeBuilderContent.teacherObjectives),
        JSON.stringify(canoeBuilderContent.teacherActivities),
        JSON.stringify(canoeBuilderContent.teacherQuestions),
        canoeBuilderContent.teacherNotes,
        canoeBuilderContent.id
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
      args: [canoeBuilderContent.id]
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
    console.error("Error updating First Nations Canoe Builders:", error);
    throw error;
  }
}

updateCanoeBuilders()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to update:", error);
    process.exit(1);
  });
