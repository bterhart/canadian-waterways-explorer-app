import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const economicsEmpireContent = {
  id: "cmliiajdk000fm2u2maena1rg",

  // 300-500 word narrative about mercantilism and the economics of the fur trade
  narrativeContent: `The fur trade operated within a powerful economic theory that shaped European empires for centuries. Mercantilism held that colonies existed primarily to enrich the mother country. Under this system, New France and later British North America served as resource suppliers, sending valuable raw materials to Europe while purchasing finished goods in return. The beaver pelt perfectly fit this mercantilist model.

## Beaver Felt: A Luxury Commodity

European demand for beaver hats drove the entire trade. Beaver underfur possessed unique properties that allowed it to be felted into superior hat material, waterproof and remarkably durable. From the 1600s through the 1830s, beaver felt hats signified wealth and status across Europe. A single fine beaver hat might cost several months' wages for a common laborer, creating enormous profits for merchants who controlled the supply chain.

## The Triangular Trade Pattern

The fur trade followed a triangular pattern linking three continents. Ships sailed from Europe carrying manufactured goods, textiles, metal tools, and weapons. These trade goods reached North American posts where Indigenous trappers exchanged furs for them. The furs then shipped to Europe, where they were processed into luxury items and sold for substantial profits. Each leg of this triangle generated wealth for European merchants and governments.

## Made Beaver Currency

The Hudson's Bay Company developed a sophisticated currency system using the "Made Beaver" (MB) as its standard unit. One Made Beaver equaled one prime adult beaver pelt in good condition. All transactions, whether buying a blanket or selling marten pelts, were calculated in MB. This created a standardized economy across thousands of miles where no European currency circulated. Indigenous traders quickly mastered this system, negotiating skillfully to maximize their returns.

## Credit and Debt

Trading post factors extended credit to Indigenous trappers, providing supplies before the hunting season with repayment expected in furs. This credit system bound trappers to specific trading posts and created ongoing relationships, but also introduced debt that could span generations. Shrewd traders on both sides navigated this credit economy, though the system often disadvantaged Indigenous peoples when fur prices fluctuated or game became scarce.

## Indigenous Economic Agency

Indigenous peoples were not passive participants in this economy. They played competing companies against each other, demanded quality goods at fair prices, and sometimes refused to trade when terms proved unfavorable. Many Indigenous traders traveled hundreds of miles to reach posts offering better deals, demonstrating sophisticated market understanding.

## From Mercantilism to Industrial Capitalism

By the 1840s, the fur trade's economic foundations crumbled. Silk hats replaced beaver felt in European fashion, destroying demand overnight. Simultaneously, industrial capitalism transformed North America. Land, timber, minerals, and agricultural potential became more valuable than furs. The Hudson's Bay Company adapted by diversifying, but the mercantilist fur economy that had shaped two centuries of Canadian history gave way to new economic realities.`,

  heroImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Hudson%27s_Bay_Company_Made_Beaver_Token_1854.png?width=800",

  images: [
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Castor_fiber_-_M%C3%A4naden.jpg?width=800",
      caption: "The European beaver (Castor fiber), whose North American cousin's underfur drove the entire transatlantic fur trade economy",
      credit: "Wikimedia Commons"
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Felt_hat_for_a_gentleman%2C_c._1790%2C_England%2C_beaver_felt_-_Patricia_Harris_Gallery_of_Textiles_%26_Costume%2C_Royal_Ontario_Museum_-_DSC09401.JPG?width=800",
      caption: "A gentleman's beaver felt hat from circa 1790, the luxury item that drove the North American fur trade for two centuries",
      credit: "Wikimedia Commons"
    }
  ],

  keyFigures: [
    {
      name: "George Simpson",
      role: "HBC Governor",
      years: "1786-1860",
      description: "Known as the 'Little Emperor,' Simpson ruthlessly managed the HBC's monopoly after 1821, maximizing profits through cost-cutting and efficient operations across the vast fur trade network",
      explorerId: "cmlijai0q0003m22r2hk84pe9"
    },
    {
      name: "Simon McTavish",
      role: "NWC Founding Partner",
      years: "1750-1804",
      description: "The 'Marquis' built the North West Company into a formidable rival to the HBC, demonstrating how aggressive competition could challenge even royally chartered monopolies",
      explorerId: "cmlijaicy0006m22r639gte9n"
    },
    {
      name: "Pierre-Esprit Radisson",
      role: "Explorer and Trade Pioneer",
      years: "1636-1710",
      description: "His explorations helped convince English investors to establish the HBC, recognizing that Hudson Bay offered the most direct route to access the richest fur territories",
      explorerId: "cmlhc4gsi0005m2ogwruv73d5"
    },
    {
      name: "Medard des Groseilliers",
      role: "Explorer and Trade Pioneer",
      years: "1618-1696",
      description: "Partner to Radisson, his knowledge of Indigenous trade networks and northern geography proved essential in establishing the economic foundations of the HBC",
      explorerId: "cmlijaie0000em22rv287hrll"
    }
  ],

  timeline: [
    {
      year: 1670,
      title: "HBC Royal Charter",
      description: "King Charles II grants the Hudson's Bay Company exclusive trading rights over Rupert's Land, establishing a mercantilist enterprise that would dominate the fur trade for two centuries",
      eventId: "cmligbkyo001im20zj2yavaqt"
    },
    {
      year: 1779,
      title: "North West Company Formed",
      description: "Montreal merchants unite to form the NWC, introducing fierce competition that drove innovation but also depleted fur resources and disrupted the mercantilist system",
      eventId: "cmligbkz5001nm20z0rm0kptu"
    },
    {
      year: 1821,
      title: "HBC-NWC Merger",
      description: "The two rival companies merge under the HBC name, restoring monopoly control and allowing George Simpson to implement strict economic management across the trade",
      eventId: "cmligbkzk001tm20z7riv5nwi"
    },
    {
      year: 1840,
      title: "Silk Hats End Beaver Demand",
      description: "European fashion shifts from beaver felt to silk hats, collapsing demand for beaver pelts and signaling the end of the fur trade's economic dominance in North America",
      eventId: null
    }
  ],

  teacherObjectives: [
    "Students will define mercantilism and explain how the fur trade exemplified this economic theory, with colonies supplying raw materials to enrich European nations",
    "Students will analyze the Made Beaver currency system and describe how it created a standardized economy across the fur trade network",
    "Students will evaluate the credit system used at trading posts and assess its impact on Indigenous trappers and their communities",
    "Students will compare how Indigenous peoples exercised economic agency within the fur trade system, including playing competing companies against each other",
    "Students will explain how changing fashion (silk replacing beaver felt) and the rise of industrial capitalism transformed North American economies"
  ],

  teacherActivities: [
    {
      title: "Made Beaver Trading Simulation",
      description: "Students participate in a hands-on trading simulation using the Made Beaver system. Assign values to various trade goods (blankets, kettles, guns, ammunition) and furs (beaver, marten, fox). Students negotiate trades, learning how this currency system functioned and how both Indigenous and European traders sought advantages.",
      materials: "Trade goods cards with MB values, fur cards with varying quality ratings, negotiation record sheets, price list charts from historical sources",
      duration: "45 minutes"
    },
    {
      title: "Mercantilism Flowchart",
      description: "Students create visual flowcharts tracing the triangular trade pattern. Map the journey of goods from European manufacturers to North American trading posts to Indigenous trappers and back to European consumers. Calculate estimated profits at each stage.",
      materials: "Large paper or digital design tools, maps showing trade routes, historical price data, colored markers for different trade flows",
      duration: "35 minutes"
    },
    {
      title: "Credit System Role-Play",
      description: "Students role-play the credit relationship between a trading post factor and Indigenous trapper families. Experience how credit bound trappers to posts, how debt accumulated, and how changes in fur availability or prices affected families across generations.",
      materials: "Role cards for factors and trappers, credit ledger templates, scenario cards with price fluctuations and game scarcity events",
      duration: "40 minutes"
    },
    {
      title: "Fashion and Economics Research",
      description: "Students research how European hat fashion drove the fur trade economy for two centuries, then investigate how the shift to silk hats collapsed beaver demand. Create presentations connecting consumer fashion choices to economic consequences thousands of miles away.",
      materials: "Historical fashion images, beaver hat photographs, timeline of fashion changes, economic data on fur prices and trade volumes",
      duration: "50 minutes"
    }
  ],

  teacherQuestions: [
    "How did mercantilism as an economic theory shape the relationship between European nations and their North American colonies?",
    "Why were beaver pelts so valuable in Europe, and how did this single commodity drive an entire continental trade network?",
    "How did the Made Beaver currency system create a standardized economy where no European coins circulated?",
    "What were the advantages and disadvantages of the credit system for Indigenous trappers and their families?",
    "How did Indigenous peoples exercise economic agency and negotiating power within the fur trade system?",
    "Why did competition between the HBC and NWC ultimately prove unsustainable for both companies?",
    "How did changing fashion in Europe directly cause economic transformation in North America during the 1840s?"
  ],

  teacherNotes: `This lesson examines the economic structures that drove the fur trade and shaped Indigenous-European relations for over two centuries. Understanding mercantilism helps students see how colonial policies served European interests while creating complex economic relationships with Indigenous peoples.

Key teaching points:
- Mercantilism was the dominant economic theory, viewing colonies as sources of raw materials to enrich mother countries
- Beaver felt hats were luxury status symbols, creating enormous demand and profits in the fur trade
- The Made Beaver system was a sophisticated currency that standardized trade across vast distances
- Credit systems created ongoing relationships but also introduced debt that disadvantaged Indigenous trappers
- Indigenous peoples were active economic agents, not passive participants, and exercised considerable negotiating power

Sensitive considerations:
- Avoid presenting Indigenous peoples as victims without agency; they were skilled traders who often negotiated favorable terms
- Acknowledge that the credit system, while creating mutual obligations, often disadvantaged Indigenous trappers when circumstances changed
- Recognize that the fur trade's decline disrupted Indigenous economies that had adapted to participate in European markets
- The shift from mercantilism to industrial capitalism brought new forms of colonization and land dispossession

Cross-curricular connections:
- Economics: mercantilism vs capitalism, currency systems, supply and demand, market dynamics
- World History: European colonialism, triangular trade, fashion history and its economic impacts
- Geography: trade routes, resource distribution, the significance of Hudson Bay access
- Mathematics: calculating exchange rates in the Made Beaver system, profit margins in triangular trade

Assessment ideas:
- Calculate the profit margins at each stage of the triangular trade using historical price data
- Write a trading post journal entry from the perspective of either a factor or Indigenous trader
- Create an infographic explaining how European fashion choices affected Indigenous communities
- Debate whether the fur trade economy was mutually beneficial or fundamentally exploitative`
};

async function updateEconomicsEmpire() {
  console.log("=== UPDATING 'The Economics of Empire: Mercantilism and the Fur Trade' IN TURSO ===\n");

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
        economicsEmpireContent.narrativeContent,
        economicsEmpireContent.heroImageUrl,
        JSON.stringify(economicsEmpireContent.images),
        JSON.stringify(economicsEmpireContent.keyFigures),
        JSON.stringify(economicsEmpireContent.timeline),
        JSON.stringify(economicsEmpireContent.teacherObjectives),
        JSON.stringify(economicsEmpireContent.teacherActivities),
        JSON.stringify(economicsEmpireContent.teacherQuestions),
        economicsEmpireContent.teacherNotes,
        economicsEmpireContent.id
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
      args: [economicsEmpireContent.id]
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
    console.error("Error updating The Economics of Empire:", error);
    throw error;
  }
}

updateEconomicsEmpire()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to update:", error);
    process.exit(1);
  });
