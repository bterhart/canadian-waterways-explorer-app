import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const fixes = [
  {
    id: "cmliiajbw0004m2u260srsthb",
    title: "A Day at the Trading Post",

    objectives: JSON.stringify([
      "Describe the physical layout and buildings of a trading post and explain each structure's function",
      "Identify different groups at trading posts and analyze their roles, relationships, and relative power",
      "Explain the Made Beaver currency system and calculate relative values of furs and trade goods",
      "Analyze trading as both economic exchange and cultural diplomacy",
      "Compare daily life across different groups at trading posts",
      "Evaluate trading posts as sites of both cultural exchange and colonial power",
      "Use primary sources to reconstruct historical experiences and identify bias"
    ]),

    materials: JSON.stringify([
      "HBC trading post journals and account ledgers",
      "Archaeological reports from excavated posts",
      "Paintings by Paul Kane and Frances Anne Hopkins",
      "Floor plans of York Factory and Fort William",
      "Photographs of reconstructed trading posts",
      "Virtual tours of Fort William and Lower Fort Garry",
      "Made Beaver calculation worksheets",
      "Primary source analysis guides and role-play cards"
    ]),

    activities: JSON.stringify([
      {
        title: "Trading Post Simulation",
        duration: "60 min",
        description: "Students role-play a trading day with assigned roles (Factor, clerks, Indigenous traders, workers). Debrief on power dynamics and cultural differences."
      },
      {
        title: "Made Beaver Economics",
        duration: "30 min",
        description: "Using historical price lists, calculate costs and analyze profit margins. Discuss fairness and exploitation."
      },
      {
        title: "Primary Source Analysis",
        duration: "45 min",
        description: "Examine journal excerpts for routines, relationships, and biases. Compare Company records with Indigenous oral histories."
      },
      {
        title: "Perspective Writing",
        duration: "30 min",
        description: "First-person narratives from different viewpoints describing the same trading day."
      }
    ]),

    discussionQuestions: JSON.stringify([
      "Why were social rituals essential before trading began?",
      "How did women's work sustain trading posts despite being absent from official records?",
      "Can trading posts be sites of both cultural exchange and colonial exploitation? Explain.",
      "How did Indigenous peoples maintain power in trading relationships?",
      "What does the Made Beaver system reveal about cross-cultural negotiation?",
      "What can archaeological evidence reveal that written records hide?"
    ]),

    assessment: JSON.stringify([
      "Formative: Simulation observation, Made Beaver calculations, exit tickets, primary source worksheets",
      "Summative: Research project on a specific trading post (800-1000 words)",
      "Summative: Comparative essay on different perspectives of post life",
      "Summative: Historical journal (10 entries) from a chosen perspective",
      "Summative: Mock trade negotiation demonstrating protocols"
    ]),

    extensions: JSON.stringify([
      "Advanced: Archaeological investigation of a post site",
      "Advanced: Comparative study of HBC vs NWC operations",
      "Advanced: Women's history research using Company records and oral histories",
      "Support: Simplified simulation with visual supports and graphic organizers",
      "Support: Guided primary source analysis with partnered activities",
      "Cross-Curricular: Math (currency calculations), Geography (mapping), Art (historical paintings), Science (preservation)"
    ]),

    curriculumConnections: JSON.stringify({
      "History": "Indigenous-European interactions, fur trade economy, colonial period, primary sources",
      "Geography": "Human-environment interaction, transportation networks, settlement patterns",
      "Economics": "Trade systems, currency, supply and demand",
      "Indigenous Studies": "Economic relationships, cultural adaptation, treaty context",
      "Social Studies": "Cultural encounters, social hierarchies, Metis identity"
    })
  },

  {
    id: "cmliiajbo0001m2u2lltp5xgn",
    title: "Animals of the Fur Trade",

    objectives: JSON.stringify([
      "Identify major fur-bearing species and explain what made each valuable",
      "Analyze why beaver became the foundation species and understand Made Beaver currency",
      "Explain relationships between animal biology and Indigenous trapping techniques",
      "Compare traditional Indigenous harvesting with commercial practices and evaluate sustainability",
      "Assess environmental consequences of large-scale commercial trapping",
      "Understand seasonal cycles in fur quality and how they shaped trapping calendars",
      "Connect historical practices to modern wildlife management and conservation"
    ]),

    materials: JSON.stringify([
      "Images of each major fur species with range maps",
      "Historical paintings showing trapping scenes",
      "HBC account books showing fur quantities and values",
      "Trappers' journals and explorer observations",
      "Historical fur trade statistics for population graphing",
      "Species comparison charts and Made Beaver calculation worksheets"
    ]),

    activities: JSON.stringify([
      {
        title: "Species Research Project",
        duration: "45 min",
        description: "Each student researches one species covering biology, habitat, trapping methods, trade value, and population history. Present species profiles."
      },
      {
        title: "Made Beaver Economics",
        duration: "30 min",
        description: "Calculate relative values across species. Analyze why certain furs commanded premium prices."
      },
      {
        title: "Population Graphing",
        duration: "30 min",
        description: "Graph historical fur statistics to visualize population crashes. Identify patterns and discuss causes."
      },
      {
        title: "Ecosystem Modeling",
        duration: "30 min",
        description: "Create food web diagrams. Model effects of removing beaver or lynx. Discuss cascade effects."
      },
      {
        title: "Traditional vs. Commercial Debate",
        duration: "30 min",
        description: "Examine evidence for sustainable harvesting vs. commercial extraction. Discuss lessons for today."
      }
    ]),

    discussionQuestions: JSON.stringify([
      "What unique property made beaver fur irreplaceable for hat-making?",
      "How did the lynx-hare cycle affect fur trade economics?",
      "Why were winter pelts worth more than summer pelts?",
      "How did Indigenous knowledge give trappers advantages Europeans couldn't replicate?",
      "What evidence shows 'inexhaustible' populations could collapse?",
      "How did removing beavers affect entire ecosystems?",
      "Why did trappers continue overharvesting when they could see populations declining?",
      "What lessons apply to modern resource management?"
    ]),

    assessment: JSON.stringify([
      "Formative: Species identification exercises, Made Beaver calculations, exit tickets, discussion participation",
      "Summative: Species research project with presentation (800-1000 words)",
      "Summative: Comparative essay on traditional vs. commercial harvesting",
      "Summative: Data analysis report documenting population changes",
      "Summative: Ecosystem impact assessment"
    ]),

    extensions: JSON.stringify([
      "Advanced: Population ecology research comparing species vulnerability",
      "Advanced: Economic modeling of boom-bust cycles",
      "Advanced: Current Indigenous trapping rights research",
      "Support: Visual species guides with key facts",
      "Support: Simplified calculations with guided templates",
      "Support: Partnered research projects with graphic organizers",
      "Cross-Curricular: Biology (adaptations, ecology), Math (population graphs), Art (wildlife illustration), Geography (species mapping)"
    ]),

    curriculumConnections: JSON.stringify({
      "Science": "Animal biology, ecology, population dynamics, predator-prey, conservation",
      "Social Studies": "Economic systems, Indigenous knowledge, environmental history, sustainability",
      "Geography": "Species distribution, human-environment interaction, resource exploitation",
      "Indigenous Studies": "Traditional ecological knowledge, sustainable harvesting, colonization impacts",
      "Environmental Education": "Overexploitation, ecosystem services, conservation and recovery"
    })
  }
];

async function main() {
  console.log("=== FIXING JSON FIELDS IN TURSO ===\n");

  for (const f of fixes) {
    console.log(`Updating: ${f.title}`);
    const result = await client.execute({
      sql: `UPDATE LessonPlan
            SET objectives = ?,
                materials = ?,
                activities = ?,
                discussionQuestions = ?,
                assessment = ?,
                extensions = ?,
                curriculumConnections = ?
            WHERE id = ?`,
      args: [
        f.objectives, f.materials, f.activities, f.discussionQuestions,
        f.assessment, f.extensions, f.curriculumConnections, f.id
      ]
    });
    console.log(`  Rows affected: ${result.rowsAffected}`);
  }

  // Verify by trying to parse all fields
  console.log("\n=== VERIFYING JSON PARSE ===\n");

  for (const f of fixes) {
    const r = await client.execute({
      sql: `SELECT title, curriculumConnections, objectives, materials, activities, discussionQuestions, assessment, extensions FROM LessonPlan WHERE id = ?`,
      args: [f.id]
    });
    const row = r.rows[0];
    if (!row) { console.log(`NOT FOUND: ${f.id}`); continue; }

    const fields = ['curriculumConnections', 'objectives', 'materials', 'activities', 'discussionQuestions', 'assessment', 'extensions'];
    let allOk = true;
    for (const field of fields) {
      const val = row[field];
      if (val) {
        try {
          JSON.parse(String(val));
        } catch (e) {
          console.log(`  ${row.title} — ${field}: INVALID JSON`);
          allOk = false;
        }
      }
    }
    if (allOk) console.log(`  ${row.title}: All fields valid JSON`);
  }

  console.log("\nDone.");
}

main().catch(console.error);
