import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const greatRivalryContent = {
  id: "cmliiajd3000bm2u2ya9gqld7",

  // 300-500 word narrative about the fierce competition between HBC and NWC
  narrativeContent: `The fur trade's most dramatic chapter unfolded as two corporate giants battled for supremacy across the Canadian wilderness. The Hudson's Bay Company and the North West Company represented fundamentally different visions of how to dominate the continent's most valuable resource.

## Clashing Business Models

The Hudson's Bay Company, chartered in 1670, operated from coastal forts on Hudson Bay, waiting for Indigenous traders to bring furs to them. This "sleep by the frozen sea" strategy minimized costs but left vast territories unexploited. The North West Company, formed in 1779 by aggressive Montreal merchants, took the opposite approach. Nor'Westers paddled thousands of miles inland, establishing posts deep in Indigenous territory to intercept furs before they reached the bay.

## Different Corporate Cultures

The companies reflected their origins. The HBC was a London-controlled corporation with distant shareholders expecting steady dividends. Decisions moved slowly through layers of hierarchy. The NWC operated as a partnership of wintering partners who shared profits and made decisions in the field. Men like Simon McTavish and William McGillivray in Montreal, and winterers like Alexander Mackenzie and Peter Pond in the wilderness, built a nimble, risk-taking enterprise.

## Flashpoints of Conflict

The Athabasca country became the rivalry's bloodiest battleground. This remote region produced the finest furs, and both companies desperately wanted control. Peter Pond's early explorations gave the NWC advantages that the HBC struggled to overcome. Traders from both sides engaged in espionage, bribery of Indigenous middlemen, and outright violence. Men were murdered, posts burned, and supply brigades ambushed.

## The Pemmican War

Conflict reached its peak with the Pemmican War. When Lord Selkirk established the Red River Colony on HBC land in 1812, the NWC saw an existential threat to their supply routes. Metis hunters, allied with the NWC, clashed repeatedly with colonists. The violence culminated in the Battle of Seven Oaks in 1816, where twenty-one colonists died, including Governor Robert Semple.

## Impact on Indigenous Peoples

The competition initially benefited Indigenous traders, who played the companies against each other for better prices and goods. However, the relentless demand for furs depleted beaver populations and disrupted traditional territories. Both companies distributed alcohol as a trade good, causing devastating social problems in many communities.

## The 1821 Merger

The rivalry proved unsustainable. Both companies hemorrhaged money, fur supplies dwindled, and violence threatened to destroy the trade entirely. The British government pressured a merger, which came in 1821 under the HBC name. George Simpson emerged as the new monopoly's governor, ruthlessly consolidating operations. The great rivalry ended, but its legacy shaped western Canada's boundaries, Metis identity, and Indigenous-European relations for generations.`,

  heroImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Battle_of_seven_oaks.jpg?width=800",

  images: [
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/North_west_company.svg?width=800",
      caption: "The North West Company coat of arms, symbolizing the Montreal-based traders who challenged HBC dominance",
      credit: "Wikimedia Commons"
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Rupert%27s_Land.svg?width=800",
      caption: "Map showing Rupert's Land, the vast HBC territory that the North West Company aggressively penetrated",
      credit: "Wikimedia Commons"
    }
  ],

  keyFigures: [
    {
      name: "George Simpson",
      role: "Governor after 1821 Merger",
      years: "1786-1860",
      description: "Known as the 'Little Emperor,' Simpson ruthlessly consolidated the merged company, eliminating redundant posts and cutting costs across the territory",
      explorerId: "cmlijai0q0003m22r2hk84pe9"
    },
    {
      name: "Simon McTavish",
      role: "NWC Founding Partner",
      years: "1750-1804",
      description: "The 'Marquis' dominated the North West Company from Montreal, building the partnership that challenged the HBC's monopoly",
      explorerId: "cmlijaicy0006m22r639gte9n"
    },
    {
      name: "William McGillivray",
      role: "NWC Chief Director",
      years: "1764-1825",
      description: "McTavish's nephew who led the NWC through its most aggressive expansion and the bitter conflicts with the HBC",
      explorerId: "cmlijaidj000am22rwn4wri55"
    },
    {
      name: "Alexander Mackenzie",
      role: "NWC Explorer and Partner",
      years: "1764-1820",
      description: "First European to cross North America overland, his explorations gave the NWC geographic knowledge the HBC lacked",
      explorerId: "cmlhaslpq0005m2zhbi5xrrt6"
    },
    {
      name: "Peter Pond",
      role: "NWC Explorer and Trader",
      years: "1739-1807",
      description: "Pioneered NWC expansion into the rich Athabasca country, though his violent temperament made him controversial among partners",
      explorerId: "cmlhc4gt7000bm2ogmjjkr2c4"
    }
  ],

  timeline: [
    {
      year: 1670,
      title: "HBC Royal Charter",
      description: "King Charles II grants the Hudson's Bay Company exclusive trading rights over all lands draining into Hudson Bay",
      eventId: "cmligbkyo001im20zj2yavaqt"
    },
    {
      year: 1779,
      title: "North West Company Formed",
      description: "Montreal merchants unite to form the North West Company, creating the first serious challenge to HBC dominance",
      eventId: "cmligbkz5001nm20z0rm0kptu"
    },
    {
      year: 1789,
      title: "Mackenzie Reaches Arctic",
      description: "Alexander Mackenzie descends the river now bearing his name to the Arctic Ocean, extending NWC knowledge and claims",
      eventId: "cmligbkz8001om20zu2i3f3tj"
    },
    {
      year: 1816,
      title: "Battle of Seven Oaks",
      description: "Metis forces allied with the NWC clash with Red River colonists, killing twenty-one including Governor Semple",
      eventId: "cmligbkzh001sm20zl3p8vx3z"
    },
    {
      year: 1821,
      title: "HBC-NWC Merger",
      description: "After decades of ruinous competition, the two companies merge under the HBC name, creating a monopoly under George Simpson",
      eventId: "cmligbkzk001tm20z7riv5nwi"
    }
  ],

  teacherObjectives: [
    "Students will compare and contrast the business models of the HBC (coastal trading posts) and NWC (aggressive inland expansion)",
    "Students will analyze how different corporate structures (London shareholders vs Montreal partnerships) influenced each company's strategies",
    "Students will evaluate the causes and consequences of violent conflicts, including the Pemmican War and Battle of Seven Oaks",
    "Students will assess the impact of corporate competition on Indigenous peoples, including both benefits and harmful consequences",
    "Students will explain how the 1821 merger resolved the rivalry and shaped the future of western Canada"
  ],

  teacherActivities: [
    {
      title: "Corporate Strategy Comparison",
      description: "Divide students into HBC and NWC groups. Each group analyzes their company's strengths and weaknesses, then debates which strategy was superior. Consider costs, risks, Indigenous relationships, and long-term sustainability.",
      materials: "Company profile sheets, map showing trading posts, cost-benefit analysis worksheet, debate scoring rubric",
      duration: "40 minutes"
    },
    {
      title: "Mapping the Rivalry",
      description: "Students create maps showing HBC coastal posts, NWC inland routes, and contested territories like Athabasca. Mark key flashpoints and trace how competition pushed both companies into new regions.",
      materials: "Blank maps of North America, colored markers, historical trading post locations, route information cards",
      duration: "35 minutes"
    },
    {
      title: "Seven Oaks Perspectives",
      description: "Students examine the Battle of Seven Oaks from multiple viewpoints: HBC colonists, NWC traders, Metis hunters, and Indigenous observers. Write diary entries or newspaper reports from each perspective.",
      materials: "Primary source excerpts, perspective cards, writing templates, historical context handout",
      duration: "45 minutes"
    },
    {
      title: "Merger Negotiation Simulation",
      description: "Students role-play the 1821 merger negotiations, with teams representing HBC shareholders, NWC partners, British government officials, and Indigenous leaders affected by the outcome.",
      materials: "Role cards with objectives, negotiation guidelines, historical background documents, agreement template",
      duration: "50 minutes"
    }
  ],

  teacherQuestions: [
    "Why did the HBC initially choose to 'sleep by the frozen sea' rather than establish inland posts, and what were the advantages and disadvantages of this strategy?",
    "How did the NWC's partnership structure give it advantages over the HBC's corporate hierarchy in responding to frontier conditions?",
    "What made the Athabasca country so valuable that both companies risked violence and enormous expense to control it?",
    "How did Indigenous peoples use the rivalry between the companies to their advantage, and when did this strategy stop working?",
    "What role did the Metis play in the conflict, and why did many support the NWC rather than the HBC?",
    "Was the violence of the Pemmican War and Battle of Seven Oaks inevitable, or could the companies have found peaceful solutions?",
    "How did the 1821 merger change life for traders, Indigenous peoples, and Metis communities who had benefited from the competition?"
  ],

  teacherNotes: `This lesson examines one of the most dramatic corporate rivalries in history, with implications far beyond business competition. The HBC-NWC conflict shaped territorial boundaries, Indigenous relations, and Metis identity across western Canada.

Key teaching points:
- The rivalry demonstrates how different business models and corporate cultures produce different outcomes
- Competition initially benefited Indigenous traders but ultimately contributed to resource depletion and social disruption
- The Pemmican War shows how corporate competition can escalate to violence when vital interests are threatened
- The Metis emerged as a distinct people partly through their role in this conflict
- The 1821 merger created a monopoly with profound consequences for Indigenous peoples

Sensitive considerations:
- Avoid glorifying the violence; emphasize its costs to all parties, especially Indigenous communities
- Acknowledge that both companies exploited Indigenous labor and disrupted traditional societies
- The Battle of Seven Oaks remains significant to Metis identity; present multiple perspectives respectfully
- Alcohol distribution by both companies caused lasting harm to Indigenous communities
- The merger's cost-cutting eliminated jobs and closed posts that communities depended upon

Cross-curricular connections:
- Business Studies: corporate structures, competition vs monopoly, partnership vs shareholder models
- Geography: trade routes, resource distribution, territorial control
- Political Science: colonial governance, corporate power, government intervention
- Social Studies: Metis history, Indigenous-European relations, conflict resolution

Assessment ideas:
- Write a business plan for either company explaining how to defeat your rival
- Analyze primary sources from both sides of the Seven Oaks conflict
- Create a documentary storyboard about the rivalry from Indigenous perspectives
- Debate whether government intervention to force the merger was justified`
};

async function updateGreatRivalry() {
  console.log("=== UPDATING 'The Great Rivalry: HBC vs NWC' IN TURSO ===\n");

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
        greatRivalryContent.narrativeContent,
        greatRivalryContent.heroImageUrl,
        JSON.stringify(greatRivalryContent.images),
        JSON.stringify(greatRivalryContent.keyFigures),
        JSON.stringify(greatRivalryContent.timeline),
        JSON.stringify(greatRivalryContent.teacherObjectives),
        JSON.stringify(greatRivalryContent.teacherActivities),
        JSON.stringify(greatRivalryContent.teacherQuestions),
        greatRivalryContent.teacherNotes,
        greatRivalryContent.id
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
      args: [greatRivalryContent.id]
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
    console.error("Error updating The Great Rivalry: HBC vs NWC:", error);
    throw error;
  }
}

updateGreatRivalry()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to update:", error);
    process.exit(1);
  });
