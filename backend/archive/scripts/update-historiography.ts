import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const historiographyContent = {
  id: "cmliiajdm000gm2u29djof743",

  // 300-500 word narrative about how historians have interpreted the fur trade over time
  narrativeContent: `Understanding how historians have interpreted the fur trade reveals as much about the writers as about the past itself. Each generation brings new questions, values, and perspectives to historical study, fundamentally changing what stories get told and whose voices are heard.

## Early Triumphalist Narratives

The first histories of the fur trade, written in the late nineteenth and early twentieth centuries, celebrated European exploration and commerce as triumphant achievements. Explorers like Samuel de Champlain and David Thompson appeared as heroic figures conquering a vast wilderness. Indigenous peoples served merely as helpful guides or dangerous obstacles in these accounts. The fur trade represented European civilization's advance across an empty continent, bringing progress and prosperity.

## Harold Innis and Staples Theory

In 1930, economist Harold Innis transformed fur trade scholarship with "The Fur Trade in Canada." Rather than celebrating individual heroes, Innis analyzed economic structures. His staples theory argued that Canadian history was shaped by the export of raw materials, beginning with fish and furs, to European markets. Geography, transportation, and economics determined national development more than great men or political events. This approach made the fur trade central to understanding Canadian identity.

## The Social History Revolution

During the 1970s and 1980s, historians began asking different questions. Who were the ordinary people involved in the fur trade? What roles did women play? Social historians examined voyageur lives, trading post communities, and the mixed-heritage families that emerged from cultural contact. Sylvia Van Kirk's groundbreaking work revealed how Indigenous women were essential partners, interpreters, and diplomatic links in the trade. Women moved from historical invisibility to recognized agency.

## Indigenous-Centered Perspectives

By the 1990s and 2000s, scholars increasingly centered Indigenous experiences. Rather than viewing the fur trade as something Europeans did to Indigenous peoples, historians recognized Indigenous nations as active participants who shaped trade relationships according to their own interests and cultural practices. Indigenous traders selected which goods they wanted, negotiated terms, and maintained their own economic and diplomatic goals throughout the fur trade era.

## Postcolonial Critiques

Recent scholarship applies postcolonial theory to examine how the fur trade contributed to colonization and its ongoing effects. Historians analyze how trade relationships created dependencies, disrupted traditional economies, and facilitated European territorial claims. Environmental historians study how commercial hunting depleted animal populations and transformed Indigenous relationships with the land.

## Why Interpretation Matters

Understanding historiography helps us recognize that history is not simply facts but stories shaped by who tells them. Each interpretive approach illuminates different aspects of the past while casting shadows over others. Reading multiple perspectives, especially those of Indigenous scholars and communities, provides a fuller understanding of the fur trade's complex legacy that continues to shape our present.`,

  heroImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Harold_Innis.jpg?width=800",

  images: [
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Innis%2C_Harold_Adams_%281894-1952%29.jpg?width=800",
      caption: "Harold Innis, the Canadian economist whose 1930 book 'The Fur Trade in Canada' revolutionized how scholars understood the economic foundations of Canadian history",
      credit: "Wikimedia Commons"
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Champlain%27s_1632_map%2C_published_in_Voyages_de_la_Nouvelle_France.jpg?width=800",
      caption: "Samuel de Champlain's 1632 map of New France, representing the early triumphalist narrative of European exploration and discovery",
      credit: "Wikimedia Commons"
    }
  ],

  keyFigures: [
    {
      name: "David Thompson",
      role: "Mapmaker and Explorer",
      years: "1770-1857",
      description: "Thompson's detailed journals and maps provide primary sources that historians continue to analyze through different interpretive lenses, from heroic explorer to colonial agent to scientific observer",
      explorerId: "cmlhaslpx0006m2zhsckolb5o"
    },
    {
      name: "Samuel de Champlain",
      role: "Explorer and Colonial Administrator",
      years: "1567-1635",
      description: "Champlain's writings established many early narratives about the fur trade and Indigenous peoples that later historians both built upon and critiqued as reflecting colonial perspectives",
      explorerId: "cmlhaslpl0004m2zhpjklxgyn"
    },
    {
      name: "George Simpson",
      role: "HBC Governor",
      years: "1786-1860",
      description: "Simpson's extensive correspondence and journals offer rich sources for economic and social historians studying fur trade administration, labor relations, and colonial governance",
      explorerId: "cmlijai0q0003m22r2hk84pe9"
    }
  ],

  timeline: [
    {
      year: 1670,
      title: "HBC Royal Charter",
      description: "The founding document of the Hudson's Bay Company became a key primary source for historians, interpreted variously as commercial triumph, imperial expansion, or colonial dispossession",
      eventId: "cmligbkyo001im20zj2yavaqt"
    },
    {
      year: 1930,
      title: "Harold Innis Publishes 'The Fur Trade in Canada'",
      description: "This groundbreaking work introduced staples theory and shifted scholarly focus from heroic narratives to economic analysis, making the fur trade central to Canadian historical identity",
      eventId: null
    },
    {
      year: 1980,
      title: "Social History Revolution",
      description: "Sylvia Van Kirk's 'Many Tender Ties' and Jennifer Brown's 'Strangers in Blood' revealed the central roles of women and families in fur trade society, transforming the field",
      eventId: null
    },
    {
      year: 2000,
      title: "Indigenous-Centered Approaches Emerge",
      description: "Scholars increasingly centered Indigenous perspectives, recognizing First Nations as active agents who shaped trade relationships according to their own interests and cultural practices",
      eventId: null
    }
  ],

  teacherObjectives: [
    "Students will define historiography and explain why understanding how history is written matters for critical thinking about the past",
    "Students will compare early triumphalist narratives with later interpretive approaches, identifying what each perspective emphasized and overlooked",
    "Students will analyze Harold Innis's staples theory and evaluate how economic frameworks changed historical understanding of the fur trade",
    "Students will explain how social history expanded fur trade scholarship to include women, families, and ordinary people previously excluded from historical accounts",
    "Students will apply Indigenous-centered perspectives to reinterpret familiar fur trade events and recognize Indigenous agency and decision-making"
  ],

  teacherActivities: [
    {
      title: "Comparing Historical Accounts",
      description: "Students read excerpts from different eras of fur trade scholarship, including an early triumphalist account, Innis's economic analysis, a social history excerpt, and an Indigenous-centered interpretation. They create comparison charts identifying what questions each historian asked, whose perspectives were included, and what aspects were emphasized or omitted.",
      materials: "Primary source excerpts from different historiographical periods, comparison chart templates, discussion prompts",
      duration: "45 minutes"
    },
    {
      title: "Rewriting History Exercise",
      description: "Students take a single fur trade event (such as an exploration journey or trading post establishment) and write three short descriptions from different historiographical perspectives: triumphalist, economic, and Indigenous-centered. Discuss how the same facts can support different narratives.",
      materials: "Event fact sheets, writing templates for each perspective, peer review rubrics",
      duration: "50 minutes"
    },
    {
      title: "Source Analysis Workshop",
      description: "Students examine primary sources (maps, journal entries, company records) and discuss what questions different types of historians might ask of each source. Identify what each source reveals and conceals depending on the historian's interpretive framework.",
      materials: "Reproductions of primary source documents, analysis worksheets, guiding questions for each historiographical approach",
      duration: "40 minutes"
    },
    {
      title: "Whose Story Gets Told?",
      description: "Students investigate whose voices appear in historical records and whose are absent. Research how historians have worked to recover lost perspectives, including oral histories and archaeological evidence, and discuss the challenges of writing history when sources are incomplete.",
      materials: "Examples of different source types, articles about recovering marginalized voices, discussion guides",
      duration: "35 minutes"
    }
  ],

  teacherQuestions: [
    "Why do historians from different eras often tell very different stories about the same historical events and people?",
    "What did early triumphalist narratives emphasize about the fur trade, and whose perspectives did they tend to ignore or minimize?",
    "How did Harold Innis's economic approach change what questions historians asked about the fur trade?",
    "Why was it significant when social historians began studying women, families, and ordinary workers in the fur trade?",
    "How do Indigenous-centered interpretations challenge earlier historical narratives about the fur trade?",
    "What responsibilities do historians have to acknowledge the limitations and biases in their interpretive frameworks?",
    "How might your own background and values influence the historical questions you find most interesting or important?"
  ],

  teacherNotes: `This lesson introduces students to historiography, the study of how history is written. Understanding that historical narratives are constructed by people with particular perspectives, values, and blind spots is essential for critical thinking. The fur trade provides an excellent case study because it has been interpreted so differently across generations.

Key teaching points:
- Historiography examines how and why historical interpretations change over time
- Early fur trade histories celebrated European achievement while minimizing Indigenous contributions
- Harold Innis's staples theory shifted focus from individuals to economic structures and geography
- Social historians expanded the story to include women, families, and ordinary workers
- Indigenous-centered approaches recognize First Nations as active agents, not passive subjects

Pedagogical strategies:
- Use concrete examples from different historiographical periods to make abstract concepts tangible
- Encourage students to identify unstated assumptions in historical accounts
- Model how to read sources critically, asking who wrote them and why
- Create space for students to discuss how their own perspectives shape what they notice in history

Sensitive considerations:
- Acknowledge that some earlier historical interpretations reflected racist attitudes toward Indigenous peoples
- Discuss how Indigenous scholars and communities are reclaiming authority over their own histories
- Be aware that students may have learned triumphalist narratives from earlier education or popular culture
- Emphasize that recognizing bias in past historians does not mean dismissing all historical knowledge

Cross-curricular connections:
- Media Literacy: analyzing how sources shape narratives
- Philosophy: epistemology and how we know what we know about the past
- Indigenous Studies: Indigenous methodologies and knowledge systems
- Sociology: how social position affects perspective and interpretation

Assessment ideas:
- Write a historiographical analysis comparing two interpretations of the same event
- Create a presentation explaining how one historical figure has been portrayed differently across eras
- Develop discussion questions that reveal assumptions in a given historical source
- Reflect on how students' own backgrounds might influence their historical interests and interpretations`
};

async function updateHistoriography() {
  console.log("=== UPDATING 'Historiography of the Fur Trade' IN TURSO ===\n");

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
        historiographyContent.narrativeContent,
        historiographyContent.heroImageUrl,
        JSON.stringify(historiographyContent.images),
        JSON.stringify(historiographyContent.keyFigures),
        JSON.stringify(historiographyContent.timeline),
        JSON.stringify(historiographyContent.teacherObjectives),
        JSON.stringify(historiographyContent.teacherActivities),
        JSON.stringify(historiographyContent.teacherQuestions),
        historiographyContent.teacherNotes,
        historiographyContent.id
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
      args: [historiographyContent.id]
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
    console.error("Error updating Historiography of the Fur Trade:", error);
    throw error;
  }
}

updateHistoriography()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to update:", error);
    process.exit(1);
  });
