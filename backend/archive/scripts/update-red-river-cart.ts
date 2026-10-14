import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const redRiverCartContent = {
  id: "cmliiajcq000am2u2h58ck1el",

  // REWRITTEN: 300-500 word narrative about The Red River Cart
  narrativeContent: `The Red River cart stands as one of the most remarkable innovations of the fur trade era, a testament to Metis ingenuity that transformed transportation across the Canadian prairies. Developed in the early 1800s at the confluence of the Red and Assiniboine rivers, these distinctive vehicles became both essential tools of commerce and enduring symbols of Metis identity.

## Brilliant All-Wood Engineering

The genius of the Red River cart lay in its construction entirely from wood, leather, and rawhide, without a single piece of metal. This was not a limitation but a deliberate design choice. On the vast prairies, far from blacksmiths and iron supplies, a broken cart could be repaired using materials found anywhere: oak or poplar for the frame, and strips of rawhide called shaganappi to bind components together. The massive wheels, standing five to six feet tall, allowed carts to roll over tall prairie grasses, through muddy trails, and across shallow streams. When rivers ran too deep, the entire cart could be disassembled and transformed into a raft, with hide-wrapped wheels serving as flotation devices.

## The Shrieking Sound

The most famous characteristic of these carts was their distinctive shrieking sound, audible from miles away across the open prairie. The wooden axles were deliberately left ungreased because animal fat lubricants would attract dust and grit that quickly destroyed wooden components. This unearthly screech, often described as haunting or ghostly, announced the approach of cart brigades and became inseparable from Metis identity on the plains.

## Cart Trains Across the Prairies

During peak years of the mid-nineteenth century, great cart brigades numbering hundreds of vehicles would traverse the prairies together, stretching for miles across the landscape. Each cart hauled between eight hundred and one thousand pounds of cargo, pulled by a single ox or horse. The Red River trails connecting settlements like the route from Red River to St. Paul, Minnesota were worn so deeply by countless wheels that traces remain visible today.

## The Lifeblood of Trade

These carts were essential to the fur trade economy, transporting pemmican to provision voyageur brigades and carrying furs to distant markets. Without Red River carts, the vast interior trade would have been impossible. The carts also carried the social fabric of Metis life: evening gatherings featured fiddle music, the Red River jig, storytelling, and community bonds strengthened with each journey.

## Legacy and Decline

The arrival of steamboats in the 1870s and railways by 1878 ended the cart era. But the Red River cart endures as a powerful symbol of Metis achievement, representing the creativity of a people who drew upon both Indigenous and European traditions to create something entirely new. Today, cart replicas stand in museums across Canada, reminders of a civilization that once rolled across the prairies on shrieking wooden wheels.`,

  heroImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Red_River_ox_cart.jpg/1280px-Red_River_ox_cart.jpg",

  images: [
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Metis_-_Red_River_cart.jpg/1280px-Metis_-_Red_River_cart.jpg",
      caption: "A preserved Red River cart showing the distinctive large wooden wheels and all-wood construction",
      credit: "Wikimedia Commons"
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Red_River_Trails_map.png/800px-Red_River_Trails_map.png",
      caption: "Map showing the major Red River cart trails connecting settlements across the prairies",
      credit: "Wikimedia Commons"
    }
  ],

  keyFigures: [
    {
      name: "Cuthbert Grant",
      role: "Metis Leader and Captain of the Hunt",
      years: "1793-1854",
      description: "A prominent Metis leader who organized and led many of the great cart brigades. He became the first Warden of the Plains and played a key role in establishing Metis political identity and defending Metis rights.",
      explorerId: "cmlijaig1000zm22rsw2ep9oo"
    },
    {
      name: "Jean-Baptiste Lagimodiere",
      role: "Plains Hunter and Pioneer",
      years: "1778-1855",
      description: "One of the first French-Canadian settlers in the Red River area. Expert buffalo hunter whose journeys across the prairies helped establish early cart routes. His grandson was Louis Riel.",
      explorerId: "cmlijaig40010m22r2xcwlf62"
    },
    {
      name: "Louis Riel",
      role: "Metis Political Leader",
      years: "1844-1885",
      description: "Founder of Manitoba and defender of Metis rights who led the Red River Resistance. The Red River cart was a symbol of the Metis way of life he fought to protect.",
      explorerId: "cmlijaifw000xm22ryj4g6yxi"
    },
    {
      name: "Gabriel Dumont",
      role: "Military Leader and Buffalo Hunter",
      years: "1837-1906",
      description: "Legendary buffalo hunter and skilled cart brigade leader who became Louis Riel's military commander. His knowledge of the prairies and cart trails was unmatched.",
      explorerId: "cmlijaifz000ym22rzqy45znk"
    }
  ],

  timeline: [
    {
      year: "1801",
      title: "First Red River Carts Developed",
      description: "The earliest Red River carts are developed by Metis craftsmen at the confluence of the Red and Assiniboine rivers, combining Indigenous and European design knowledge"
    },
    {
      year: "1820s",
      title: "Cart Trails Established",
      description: "Regular cart trails begin connecting Red River Settlement to trading posts throughout the region, creating a network of routes across the prairies"
    },
    {
      year: "1844",
      title: "Peak of Pemmican Trade",
      description: "The pemmican trade reaches its height, with hundreds of carts transporting the essential provision to fur trade posts across the Northwest"
    },
    {
      year: "1869",
      title: "Red River Resistance",
      description: "The Metis, led by Louis Riel, resist Canadian government attempts to take control of their homeland without negotiation, defending their way of life symbolized by the cart brigades",
      eventId: "cmligbkzm001um20zw5hmtl3k"
    },
    {
      year: "1878",
      title: "Railway Ends Cart Era",
      description: "The first railway reaches Winnipeg, effectively ending the era of the Red River cart as the primary means of prairie transportation"
    }
  ],

  teacherObjectives: [
    "Students will understand the engineering principles behind the all-wood Red River cart design and explain why specific choices like ungreased axles were made",
    "Students will analyze how the Red River cart enabled the fur trade economy and connected distant settlements across the prairies",
    "Students will recognize the Red River cart as a Metis innovation that blended Indigenous and European knowledge traditions",
    "Students will evaluate how the cart served as both practical transportation and a symbol of Metis cultural identity",
    "Students will trace the development and decline of the Red River cart era from 1801 to the arrival of railways"
  ],

  teacherActivities: [
    {
      title: "Build a Model Cart (No Metal Challenge)",
      description: "Students work in groups to construct a small-scale model of a Red River cart using only wooden sticks, string, and cardboard. Challenge them to make functional wheels while following the 'no metal' rule. Discuss the engineering trade-offs the Metis faced.",
      materials: "Wooden popsicle sticks, string, cardboard, scissors, rulers, wooden dowels",
      duration: "45-60 minutes"
    },
    {
      title: "Sound and Friction Experiment",
      description: "Investigate why the carts shrieked by experimenting with friction. Students rub wooden blocks together dry vs. with different lubricants, then discuss why the Metis chose the shrieking sound over greased axles that would wear out faster.",
      materials: "Wooden blocks, vegetable oil, sand, recording device for sounds",
      duration: "30 minutes"
    },
    {
      title: "Cart Trail Route Mapping",
      description: "Using historical maps, students trace Red River cart routes and calculate distances, travel times at 2-3 miles per hour, and estimate how many days a journey from Red River to St. Paul would take.",
      materials: "Historical maps of Red River trails, calculators, graph paper, rulers",
      duration: "40 minutes"
    },
    {
      title: "Cart Brigade Life Roleplay",
      description: "Students take on roles in a cart brigade: drivers, hunters, traders, families. They plan a journey, decide what cargo to carry, and experience the communal decision-making that characterized Metis cart trains.",
      materials: "Role cards, cargo lists, journey planning worksheets, trade goods tokens",
      duration: "45 minutes"
    }
  ],

  teacherQuestions: [
    "Why did the Metis choose to build carts entirely without metal? What advantages and disadvantages did this create for prairie travel?",
    "How did the Red River cart reflect the blending of Indigenous and European knowledge? What elements came from each tradition?",
    "Why was the shrieking sound of the cart wheels considered a feature rather than a flaw? What does this tell us about Metis engineering thinking?",
    "What role did the Red River cart play in transporting pemmican, and why was this essential to the entire fur trade system?",
    "How did the communal nature of cart brigades reflect Metis social values and strengthen community bonds?",
    "Why did the railway end the era of the Red River cart? What was gained and lost in this transition?",
    "How does the Red River cart serve as a symbol of Metis identity today, and why is this historical memory important?"
  ],

  teacherNotes: `This lesson explores the Red River cart as both a remarkable engineering achievement and a symbol of Metis identity and innovation.

Key teaching points:
- The Red River cart was a uniquely Metis invention, reflecting their position between Indigenous and European worlds
- The all-wood, no-metal construction was brilliant engineering for prairie conditions, not a primitive limitation
- The famous shrieking sound was a deliberate trade-off: noise versus durability in environments far from repair facilities
- Cart brigades were not just transportation but mobile communities that reinforced Metis social bonds and cultural practices
- The cart was essential to the pemmican and fur trade that sustained the entire Northwest economy

Sensitive considerations:
- Present the Red River cart as sophisticated technology, not primitive transportation
- The decline of the cart era coincided with significant challenges for Metis communities, including the Red River Resistance
- Connect to Louis Riel and ongoing Metis cultural revival - this is living history, not just the past
- Acknowledge that many Metis communities continue to celebrate these traditions and the cart remains a powerful cultural symbol

Cross-curricular connections:
- Science and Technology: engineering principles, friction, material science, problem-solving with constraints
- Mathematics: calculating distances, travel times, cargo weights, ratios
- Social Studies: Metis culture, fur trade economics, transportation history, community organization
- Geography: prairie terrain, river systems, trade routes, how landscape shapes technology

Extension activities:
- Research modern Metis communities and how they maintain connections to cart brigade heritage
- Compare Red River cart design to other historical transportation solutions worldwide
- Investigate the role of Metis women in the cart brigade economy (pemmican production, shaganappi making)
- Connect to the Red River Resistance and Louis Riel's defense of Metis rights and way of life
- Study the ecological relationship between the cart trade, buffalo herds, and prairie ecosystems

Assessment ideas:
- Design challenge: propose a modification to the cart for a specific terrain challenge, explaining engineering reasoning
- Write from the perspective of a Metis cart driver describing a day on the trail
- Compare and contrast the Red River cart era with modern prairie transportation
- Analyze why the cart became such an important symbol of Metis identity`
};

async function updateRedRiverCart() {
  console.log("=== UPDATING 'The Red River Cart' IN TURSO ===\n");

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
        redRiverCartContent.narrativeContent,
        redRiverCartContent.heroImageUrl,
        JSON.stringify(redRiverCartContent.images),
        JSON.stringify(redRiverCartContent.keyFigures),
        JSON.stringify(redRiverCartContent.timeline),
        JSON.stringify(redRiverCartContent.teacherObjectives),
        JSON.stringify(redRiverCartContent.teacherActivities),
        JSON.stringify(redRiverCartContent.teacherQuestions),
        redRiverCartContent.teacherNotes,
        redRiverCartContent.id
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
      args: [redRiverCartContent.id]
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
    console.error("Error updating The Red River Cart:", error);
    throw error;
  }
}

updateRedRiverCart()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to update:", error);
    process.exit(1);
  });
