import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const indigenousSovereigntyContent = {
  id: "cmliiajdp000hm2u2p97957m6",

  // 300-500 word narrative about Indigenous sovereignty and treaty rights
  narrativeContent: `Before European contact, Indigenous nations exercised full sovereignty over their territories. Each nation maintained its own governance systems, laws, territorial boundaries, and diplomatic relationships with neighboring peoples. The Haudenosaunee Confederacy's Great Law of Peace exemplified sophisticated Indigenous political organization, influencing later democratic thought. Sovereignty was inherent, not granted by outsiders.

## Nation-to-Nation Relationships

When Europeans arrived, they initially recognized Indigenous sovereignty through nation-to-nation diplomacy. Treaties, trade agreements, and military alliances acknowledged Indigenous peoples as independent nations with legitimate territorial claims. The fur trade operated within this framework, with European companies negotiating access to Indigenous lands and requiring Indigenous permission and partnership to conduct business.

## The Royal Proclamation of 1763

Following the Seven Years' War, Britain's Royal Proclamation of 1763 formally recognized Indigenous land rights. It established that only the Crown could purchase Indigenous lands, and only through formal treaty negotiation. This document acknowledged Indigenous peoples as nations with territorial rights, creating a legal foundation for the treaty-making process that followed. It remains constitutionally significant in Canada today.

## The Numbered Treaties

Between 1871 and 1921, the Canadian government negotiated eleven Numbered Treaties covering vast territories from Ontario to the Rocky Mountains and into the North. Indigenous leaders like Crowfoot, Big Bear, and Poundmaker negotiated carefully, seeking to protect their peoples during the devastating collapse of the buffalo economy. These leaders understood treaties as sacred agreements establishing ongoing relationships, not simple land surrenders.

## Treaty Rights and Promises

Treaties promised Indigenous peoples reserves, annual payments, hunting and fishing rights, schools, agricultural assistance, and medical care. Indigenous negotiators emphasized these provisions as recognition of their continuing sovereignty and rights. However, the Canadian government often failed to honor treaty promises, implementing policies of assimilation instead of the partnership treaties implied.

## Continuing Significance

Treaties remain living documents. Section 35 of Canada's Constitution Act, 1982, recognizes and affirms existing Aboriginal and treaty rights. Indigenous peoples continue advocating for treaty implementation, asserting that these agreements established permanent nation-to-nation relationships. The Truth and Reconciliation Commission emphasized that reconciliation requires honoring treaty obligations.

## Contemporary Rights Movements

Today, Indigenous sovereignty movements build on this treaty foundation. Leaders invoke treaty rights in land claims, resource development negotiations, and self-government initiatives. Understanding the fur trade era's treaty-making helps explain contemporary Indigenous rights, revealing that these are not special privileges but agreements made in exchange for sharing the land that built Canada.`,

  heroImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Treaty_No._6_medallion.jpg?width=800",

  images: [
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/A_copy_of_the_Royal_Proclamation_of_1763.jpg?width=800",
      caption: "The Royal Proclamation of 1763, which recognized Indigenous land rights and established the framework for treaty-making with First Nations",
      credit: "Wikimedia Commons"
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Crowfoot_and_family.jpg?width=800",
      caption: "Chief Crowfoot of the Siksika Nation with family members; Crowfoot was a key negotiator of Treaty 7 in 1877",
      credit: "Wikimedia Commons"
    }
  ],

  keyFigures: [
    {
      name: "Crowfoot",
      role: "Siksika Chief and Treaty 7 Negotiator",
      years: "c.1830-1890",
      description: "A visionary Blackfoot Confederacy leader who negotiated Treaty 7 while seeking to protect his people's way of life during the buffalo's disappearance",
      explorerId: "cmlijaifh000rm22rettbduta"
    },
    {
      name: "Big Bear",
      role: "Plains Cree Chief",
      years: "c.1825-1888",
      description: "A principled leader who resisted signing Treaty 6 for years, seeking better terms for his people and warning of the dangers of losing hunting rights",
      explorerId: "cmlijaifd000qm22rsz5ua3as"
    },
    {
      name: "Poundmaker",
      role: "Plains Cree Chief",
      years: "c.1842-1886",
      description: "A skilled diplomat and adopted son of Crowfoot who negotiated for his people's interests and later sought peaceful resolution during the 1885 resistance",
      explorerId: "cmlijaifa000pm22r1zritofi"
    },
    {
      name: "Chief Peguis",
      role: "Saulteaux Leader and Treaty Advocate",
      years: "c.1774-1864",
      description: "A diplomatic leader who initially welcomed settlers but later became a powerful advocate for Indigenous land rights as colonial promises were broken",
      explorerId: "cmlijaifk000sm22rva4ktjom"
    },
    {
      name: "Louis Riel",
      role: "Metis Leader and Rights Advocate",
      years: "1844-1885",
      description: "The founder of Manitoba who led the Red River and Northwest Resistances to defend Metis land rights and self-governance",
      explorerId: "cmlijaifw000xm22ryj4g6yxi"
    }
  ],

  timeline: [
    {
      year: 1670,
      title: "HBC Charter Granted",
      description: "The Hudson's Bay Company receives its royal charter, claiming vast Indigenous territories without Indigenous consent",
      eventId: "cmligbkyo001im20zj2yavaqt"
    },
    {
      year: 1763,
      title: "Royal Proclamation",
      description: "Britain's Royal Proclamation recognizes Indigenous land rights and establishes that only the Crown can negotiate land treaties with Indigenous nations",
      eventId: null
    },
    {
      year: 1870,
      title: "Manitoba Enters Confederation",
      description: "The Red River Resistance leads to Manitoba joining Canada with protections for Metis land rights, though many promises were later broken",
      eventId: "cmligbkzp001vm20zk567ec16"
    },
    {
      year: 1876,
      title: "Treaty 6 Signed",
      description: "Treaty 6 is negotiated at Fort Carlton and Fort Pitt, with Indigenous leaders securing provisions for medicine chest, famine relief, and agricultural assistance",
      eventId: null
    },
    {
      year: 1885,
      title: "Northwest Resistance",
      description: "Metis and some First Nations rise up to defend their rights, leading to military suppression and the execution of Louis Riel",
      eventId: "cmligbkzs001wm20zc5pvz6ki"
    }
  ],

  teacherObjectives: [
    "Students will understand that Indigenous nations exercised full sovereignty with sophisticated governance systems before European contact",
    "Students will analyze the Royal Proclamation of 1763 as a foundational document recognizing Indigenous land rights and its continuing constitutional significance",
    "Students will evaluate the perspectives and strategies of Indigenous leaders like Crowfoot, Big Bear, and Poundmaker during Numbered Treaty negotiations",
    "Students will assess the gap between treaty promises and government implementation, including broken promises and assimilation policies",
    "Students will connect historical treaty-making to contemporary Indigenous rights movements and reconciliation efforts"
  ],

  teacherActivities: [
    {
      title: "Treaty Negotiation Role-Play",
      description: "Students role-play Treaty 6 negotiations from both Indigenous and government perspectives. Indigenous groups prepare their priorities (hunting rights, medicine, education) while government groups prepare their agenda. Debrief by comparing historical outcomes to both sides' goals.",
      materials: "Role cards with historical context, negotiation priority lists, Treaty 6 summary document, debrief questions",
      duration: "45 minutes"
    },
    {
      title: "Royal Proclamation Analysis",
      description: "Students analyze excerpts from the Royal Proclamation of 1763 in small groups. Identify key provisions recognizing Indigenous rights, discuss why Britain made these acknowledgments, and connect to current constitutional protections under Section 35.",
      materials: "Royal Proclamation excerpts (simplified), analysis questions, Constitution Act 1982 Section 35 text, comparison chart",
      duration: "35 minutes"
    },
    {
      title: "Treaty Promises vs. Reality Timeline",
      description: "Create a parallel timeline showing treaty promises alongside actual government actions. Students research specific promises from Treaty 6 (schools, medicine, farming assistance) and document what was actually provided, identifying patterns of broken promises.",
      materials: "Treaty 6 text excerpts, research cards on government actions, dual timeline template, discussion guide",
      duration: "40 minutes"
    },
    {
      title: "Indigenous Leader Perspectives",
      description: "Students research one treaty-era leader (Crowfoot, Big Bear, Poundmaker, Peguis, or Riel) and create a presentation explaining that leader's goals, strategies, and legacy. Include primary source quotes where possible.",
      materials: "Biography resource sheets, primary source quotes, presentation template, peer evaluation rubric",
      duration: "45 minutes"
    }
  ],

  teacherQuestions: [
    "What evidence demonstrates that Indigenous nations had sophisticated governance systems and sovereignty before European contact?",
    "Why did the Royal Proclamation of 1763 recognize Indigenous land rights, and why does this document remain constitutionally significant today?",
    "How did Indigenous leaders like Crowfoot and Big Bear approach treaty negotiations, and what were their primary concerns for their peoples?",
    "Why did Big Bear resist signing Treaty 6 for several years, and what does this tell us about Indigenous perspectives on the treaties?",
    "What is the difference between how Indigenous peoples understood treaties (as sacred ongoing relationships) and how the government often treated them (as land surrenders)?",
    "How did the Canadian government fail to honor treaty promises, and what were the consequences for Indigenous communities?",
    "How do historical treaties connect to contemporary Indigenous rights movements and the work of reconciliation today?"
  ],

  teacherNotes: `This lesson addresses Indigenous sovereignty and treaty rights, topics that are both historically important and directly relevant to contemporary Canada. Approach this material with respect for the ongoing significance of treaties and the continuing work of reconciliation.

Key teaching approaches:
- Emphasize that treaties are nation-to-nation agreements that remain legally binding today
- Present Indigenous leaders as skilled diplomats and negotiators protecting their peoples' interests
- Acknowledge that Indigenous and government understandings of treaties often differed significantly
- Connect historical treaty-making to current events and reconciliation efforts

Handling sensitive topics:
- Acknowledge that treaty promises were often broken, causing intergenerational harm
- Recognize that some students may have personal or family connections to these histories
- Present the 1885 Resistance and Riel's execution with appropriate gravity
- Avoid presenting treaties as ancient history; emphasize they are living documents

Terminology guidance:
- Use "Indigenous sovereignty" rather than terms that minimize Indigenous political authority
- Refer to "treaty rights" as rights, not privileges or gifts from government
- Use specific nation names (Cree, Blackfoot, Saulteaux) when discussing particular treaties
- Say "numbered treaties" rather than "land surrenders" to reflect Indigenous understanding

Connections to reconciliation:
- The Truth and Reconciliation Commission emphasized treaty implementation
- Section 35 of the Constitution recognizes and affirms treaty rights
- Many current land claims and resource negotiations involve treaty interpretation
- Understanding treaties helps students engage with reconciliation as informed citizens

Recommended resources:
- Treaty texts available through Indigenous and Northern Affairs Canada
- Truth and Reconciliation Commission reports and Calls to Action
- Local Indigenous communities may have perspectives on regional treaties
- Consider inviting Indigenous speakers to share their nations' treaty relationships

Cross-curricular connections:
- Civics: Constitutional law, Section 35, Indigenous governance
- Geography: Treaty territories, reserve lands, traditional territories
- Current Events: Land claims, resource development, self-government negotiations
- Ethics: Promise-keeping, justice, reconciliation`
};

async function updateIndigenousSovereignty() {
  console.log("=== UPDATING 'Indigenous Sovereignty and Treaty Rights' IN TURSO ===\n");

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
        indigenousSovereigntyContent.narrativeContent,
        indigenousSovereigntyContent.heroImageUrl,
        JSON.stringify(indigenousSovereigntyContent.images),
        JSON.stringify(indigenousSovereigntyContent.keyFigures),
        JSON.stringify(indigenousSovereigntyContent.timeline),
        JSON.stringify(indigenousSovereigntyContent.teacherObjectives),
        JSON.stringify(indigenousSovereigntyContent.teacherActivities),
        JSON.stringify(indigenousSovereigntyContent.teacherQuestions),
        indigenousSovereigntyContent.teacherNotes,
        indigenousSovereigntyContent.id
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
      args: [indigenousSovereigntyContent.id]
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
    console.error("Error updating Indigenous Sovereignty and Treaty Rights:", error);
    throw error;
  }
}

updateIndigenousSovereignty()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to update:", error);
    process.exit(1);
  });
