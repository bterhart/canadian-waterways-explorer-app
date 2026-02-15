import { createClient } from '@libsql/client';
const client = createClient({ url: process.env.TURSO_DATABASE_URL!, authToken: process.env.TURSO_AUTH_TOKEN! });

const fixes = [
  {
    id: "cmliiajbw0004m2u260srsthb",
    title: "A Day at the Trading Post",

    heroImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/York_Factory_1878.jpg/1280px-York_Factory_1878.jpg",

    keyFigures: JSON.stringify([
      { name: "George Simpson", role: "Governor, HBC", years: "1787-1860", description: "Transformed HBC operations across North America for four decades" },
      { name: "Thanadelthur", role: "Chipewyan Diplomat", years: "c.1697-1717", description: "Brokered peace between Chipewyan and Cree, opening HBC trade" },
      { name: "Matonabbee", role: "Chipewyan Leader", years: "c.1737-1782", description: "Guided Samuel Hearne to the Arctic Ocean" },
      { name: "James Douglas", role: "Chief Factor/Governor", years: "1803-1877", description: "Shaped HBC operations and early British Columbia" }
    ]),

    timeline: JSON.stringify([
      { year: 1670, title: "HBC Charter", description: "Monopoly granted over all lands draining into Hudson Bay" },
      { year: 1774, title: "Cumberland House", description: "First HBC inland post, strategic shift from coastal operations" },
      { year: 1821, title: "HBC-NWC Merger", description: "HBC absorbs North West Company, creating continental monopoly" },
      { year: 1870, title: "Rupert's Land Transfer", description: "HBC surrenders territorial claims to Canada" }
    ]),

    images: JSON.stringify([
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Grand_Portage_National_Monument.jpg/1280px-Grand_Portage_National_Monument.jpg",
        caption: "Reconstructed great hall at Grand Portage, showing the scale of a major fur trade gathering place",
        credit: "Wikimedia Commons"
      }
    ]),

    activities: JSON.stringify([
      { name: "Trading Post Simulation", description: "Students role-play a trading day with assigned roles (Factor, clerks, Indigenous traders, workers). Debrief on power dynamics and cultural differences.", duration: "60 minutes" },
      { name: "Made Beaver Economics", description: "Using historical price lists, calculate costs and analyze profit margins. Discuss fairness and exploitation.", duration: "30 minutes" },
      { name: "Primary Source Analysis", description: "Examine journal excerpts for routines, relationships, and biases. Compare Company records with Indigenous oral histories.", duration: "45 minutes" },
      { name: "Perspective Writing", description: "First-person narratives from different viewpoints describing the same trading day.", duration: "30 minutes" }
    ]),

    curriculumConnections: JSON.stringify([
      { subject: "History", strand: "Fur Trade Era", expectation: "Analyze Indigenous-European interactions and fur trade economy" },
      { subject: "Geography", strand: "Human-Environment Interaction", expectation: "Understand how geography influenced transportation networks and settlement patterns" },
      { subject: "Economics", strand: "Trade Systems", expectation: "Explain currency systems, supply and demand in historical trade" },
      { subject: "Indigenous Studies", strand: "Cultural Encounters", expectation: "Examine economic relationships between nations and cultural adaptation" }
    ]),

    assessment: "Research project on a specific trading post using primary sources (800-1000 words); comparative essay on different perspectives of post life; historical journal (10 entries) from a chosen perspective; mock trade negotiation demonstrating protocols.",

    extensions: "Advanced: Archaeological investigation of a post site; comparative study of HBC vs NWC operations; women's history research using Company records and oral histories. Support: Simplified simulation with visual supports; graphic organizers; guided primary source analysis. Cross-Curricular: Math (currency calculations), Geography (mapping posts and routes), Art (historical paintings)."
  },

  {
    id: "cmliiajbo0001m2u2lltp5xgn",
    title: "Animals of the Fur Trade",

    heroImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/North_American_Beaver.jpg/1280px-North_American_Beaver.jpg",

    keyFigures: JSON.stringify([
      { name: "Alexander Mackenzie", role: "Explorer", years: "1764-1820", description: "Pursued beaver trade routes to Arctic and Pacific oceans" },
      { name: "Peter Pond", role: "Trader and Explorer", years: "1740-1807", description: "Opened the rich Athabasca beaver country in 1778" },
      { name: "Henry Kelsey", role: "Explorer", years: "1667-1724", description: "First European to observe inland wildlife and trade patterns" }
    ]),

    timeline: JSON.stringify([
      { year: 1600, title: "European Beaver Depletion", description: "European beaver exhausted, driving North American demand" },
      { year: 1670, title: "HBC Charter", description: "Beaver trade formalized under Hudson's Bay Company" },
      { year: 1778, title: "Athabasca Opened", description: "Peter Pond reaches richest beaver country" },
      { year: 1840, title: "End of Beaver Hat Fashion", description: "Silk hats replace beaver felt, collapsing demand" }
    ]),

    images: JSON.stringify([
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Canada_lynx_by_Michael_Zahra.jpg/1280px-Canada_lynx_by_Michael_Zahra.jpg",
        caption: "Canada lynx — population followed dramatic 10-year cycles tied to snowshoe hare numbers",
        credit: "Wikimedia Commons"
      }
    ]),

    activities: JSON.stringify([
      { name: "Species Research Project", description: "Each student researches one species covering biology, habitat, trapping methods, trade value, and population history. Present species profiles.", duration: "45 minutes" },
      { name: "Made Beaver Economics", description: "Calculate relative values across species. Analyze why certain furs commanded premium prices.", duration: "30 minutes" },
      { name: "Population Graphing", description: "Graph historical fur statistics to visualize population crashes. Identify patterns and discuss causes.", duration: "30 minutes" },
      { name: "Ecosystem Modeling", description: "Create food web diagrams. Model effects of removing beaver or lynx. Discuss cascade effects.", duration: "30 minutes" },
      { name: "Traditional vs. Commercial Debate", description: "Examine evidence for sustainable harvesting vs. commercial extraction. Discuss lessons for today.", duration: "30 minutes" }
    ]),

    curriculumConnections: JSON.stringify([
      { subject: "Science", strand: "Ecology", expectation: "Understand animal biology, population dynamics, and predator-prey relationships" },
      { subject: "Social Studies", strand: "Economic Systems", expectation: "Analyze Indigenous knowledge systems, environmental history, and sustainability" },
      { subject: "Geography", strand: "Resource Exploitation", expectation: "Map species distribution and human-environment interaction patterns" },
      { subject: "Indigenous Studies", strand: "Traditional Knowledge", expectation: "Examine traditional ecological knowledge and impacts of colonization on harvesting practices" },
      { subject: "Environmental Education", strand: "Conservation", expectation: "Study overexploitation case studies, ecosystem services, and recovery" }
    ]),

    assessment: "Species research project with presentation (800-1000 words); comparative essay on traditional vs. commercial harvesting; data analysis report documenting population changes; ecosystem impact assessment.",

    extensions: "Advanced: Population ecology research comparing species vulnerability; economic modeling of boom-bust cycles; current Indigenous trapping rights research. Support: Visual species guides with key facts; simplified calculations with guided templates; partnered research projects. Cross-Curricular: Biology (adaptations, ecology), Math (population graphs), Art (wildlife illustration), Geography (species mapping)."
  }
];

async function main() {
  console.log("=== FIXING ALL DATA FORMATS IN TURSO ===\n");

  for (const f of fixes) {
    console.log(`Updating: ${f.title}`);
    const result = await client.execute({
      sql: `UPDATE LessonPlan
            SET heroImageUrl = ?,
                keyFigures = ?,
                timeline = ?,
                images = ?,
                activities = ?,
                curriculumConnections = ?,
                assessment = ?,
                extensions = ?
            WHERE id = ?`,
      args: [
        f.heroImageUrl, f.keyFigures, f.timeline, f.images,
        f.activities, f.curriculumConnections, f.assessment, f.extensions,
        f.id
      ]
    });
    console.log(`  Rows affected: ${result.rowsAffected}`);
  }

  // Verify by parsing all JSON fields
  console.log("\n=== VERIFYING ===\n");

  for (const f of fixes) {
    const r = await client.execute({
      sql: `SELECT title, heroImageUrl, keyFigures, timeline, images, activities, curriculumConnections, assessment, extensions FROM LessonPlan WHERE id = ?`,
      args: [f.id]
    });
    const row = r.rows[0];
    if (!row) { console.log(`NOT FOUND: ${f.id}`); continue; }

    console.log(`${row.title}:`);
    console.log(`  heroImageUrl: ${row.heroImageUrl ? 'YES' : 'MISSING'}`);

    const jsonFields = ['keyFigures', 'timeline', 'images', 'activities', 'curriculumConnections'];
    for (const field of jsonFields) {
      const val = row[field];
      if (val) {
        try {
          const parsed = JSON.parse(String(val));
          console.log(`  ${field}: Valid JSON (${Array.isArray(parsed) ? parsed.length + ' items' : 'object'})`);
        } catch {
          console.log(`  ${field}: INVALID JSON`);
        }
      } else {
        console.log(`  ${field}: NULL`);
      }
    }

    console.log(`  assessment: ${row.assessment ? 'YES (' + String(row.assessment).length + ' chars)' : 'MISSING'}`);
    console.log(`  extensions: ${row.extensions ? 'YES (' + String(row.extensions).length + ' chars)' : 'MISSING'}`);
  }

  console.log("\nDone.");
}

main().catch(console.error);
