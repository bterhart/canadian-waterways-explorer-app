// The 10-12 pack (owner, 2026-10-21): material written for the senior band, built on the
// documents, figures, places and events already in Turso (ids verified 2026-10-21). Every lesson
// works from sources the app holds and from the Checking the Record pairs; nothing quotes a
// historical author. Applied by ../2026-10-21-senior-band-pack.ts.
import type { PackComparison, PackLesson, PackPrintable, PackQuiz, PackTrip } from "./grade-bands";

const R2 = "https://pub-376806a1556549999cfff53a786882dd.r2.dev";
const commons = (file: string) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=1280`;

const E = {
  hearne: "cmlhaslq40007m2zhtmgblh1t", turnor: "cmliiral50000m2ee409m0fpk", mosesNorton: "cmliirala0002m2ee63e6kdje", wales: "ex_william-wales",
  isham: "ex_james-isham", graham: "ex_andrew-graham", laPerouse: "cmlhci07z000xm2rxus2mmxec", back: "cmlhc4gu9000em2og0kormsuc",
  franklin: "cmlhaslq60008m2zhokwxq1v6", crozier: "ex_francis-crozier", richardson: "ex_sir-john-richardson", rae: "cmlhc4gu4000dm2ogqifw8dbk",
  mcclintock: "ex_sir-francis-leopold-mcclintock", jcRoss: "ex_sir-james-clark-ross", johnRoss: "ex_sir-john-ross", hall: "ex_charles-francis-hall",
  schwatka: "ex_frederick-schwatka", penny: "ex_william-penny",
  cook: "cmlhci07w000wm2rxysby44p6", vancouver: "cmlhci083000ym2rxfv5tb9ex", martinez: "ex_esteban-jose-martinez", meares: "ex_john-meares",
  bodega: "cmlhci07s000vm2rxdmc81idj", perez: "cmlhci07m000tm2rxlrt7r51f", laSalle: "cmlijaieo000jm22r1xve4giy", cartier: "cmlhc4grf0001m2ogp7wnb7ss",
};
const F = {
  matonabbee: "matonabbee_leader", thanadelthur: "cmlhvyhgl0001m2vx6gflkznr", ouligbuck: "nf_ouligbuck", williamOuligbuck: "nf_william_ouligbuck",
  innookpoozhejook: "nf_innookpoozhejook", ebierbing: "nf_ebierbing", tookoolito: "nf_tookoolito", maquinna: "nf_maquinna", wickaninnish: "nf_wickaninnish",
  tattannoeuck: "cmlhvyhh50008m2vxmv1p9bpl", akaitcho: "cmlhvyhh30007m2vxvq25r5hl", donnacona: "nf_donnacona",
};
const W = {
  churchill: "cmlhaslr1000um2zh1ohr52f9", hudsonBay: "cmlhaslrt001cm2zh9tknhhbe", hayes: "cmligbkuv0001m20z88hvpgz2", coppermine: "cmlhbjrqa000dm2mb7n6w7y4w",
  wellington: "ww_wellington-channel", princeRegent: "ww_prince-regent-inlet", victoriaStrait: "ww_victoria-strait", repulse: "ww_repulse-bay",
  simpsonStrait: "ww_simpson-strait", queenMaud: "queen-maud-gulf-waterway", terrorBay: "terror-bay-waterway", backRiver: "back-river-waterway",
  lancaster: "lancaster-sound-waterway", peelSound: "ww_peel-sound",
  nootka: "cmlhci06w000dm2rx3bn9gj7e", clayoquot: "ww_clayoquot-sound", juanDeFuca: "cmlhci078000lm2rxus8do5zj", dixon: "ww_dixon-entrance",
  mississippi: "ww_mississippi-river", gaspe: "cmlhci06l0005m2rxruhm0g4o", stLawrence: "cmlhaslql000km2zhocxl8zbv",
};
const L = {
  princeOfWales: "cmlhcpxik0001m2a32ftvmlnd", yorkFactory: "cmlhasls40021m2zhu35xikyc", cumberlandHouse: "cmlhasls40025m2zh8ceyw7jl", bloodyFalls: "bloody_falls_location",
  beechey: "loc_beechey-island", portLeopold: "loc_port-leopold", victoryPoint: "loc_victory-point", fortHope: "loc_fort-hope", gjoaHaven: "loc_gjoa-haven",
  fortEnterprise: "loc_fort-enterprise",
  friendlyCove: "cmlhci092001fm2rxed77jk9j", sanMiguel: "cmlhci098001jm2rxi0if729k", blighIsland: "cmlhci09b001lm2rxun86l1q7", opitsaht: "loc_opitsaht",
  gaspeCross: "cmlhci08s0019m2rx3b2ipe6i",
};
const T = {
  transit1769: "tev_the-transit-of-venus-at-churchill", yathkyed1770: "tev_hearne-at-yathkyed-lake", cumberland1774: "cmligbkz2001mm20zq12u41re", hbc1670: "cmligbkyo001im20zj2yavaqt",
  beechey1845: "tev_franklin-winters-at-beechey-island", abandoned1848: "tev_erebus-and-terror-abandoned", portLeopold1848: "tev_james-clark-ross-winters-at-port-leopold",
  beecheyFound1850: "tev_franklin-s-winter-camp-found-at-beechey-island", raeHears1854: "tev_rae-hears-of-franklin-s-fate", victoryPoint1859: "tev_the-victory-point-record-found",
  hall1869: "tev_hall-on-king-william-island", raeFortHope1847: "tev_rae-winters-at-fort-hope-and-closes-boothia",
  perez1774: "tev_perez-reaches-haida-gwaii-and-nootka", cook1778: "tev_cook-at-nootka-sound", meares1788: "tev_meares-launches-the-north-west-america",
  crisis1789: "tev_the-nootka-crisis", convention1790: "tev_the-nootka-convention", quimper1790: "tev_quimper-surveys-the-strait-of-juan-de-fuca",
  vancouver1792: "tev_vancouver-surveys-puget-sound", oregon1846: "tev_the-oregon-treaty", cartier1535: "tev_cartier-at-stadacona-and-hochelaga",
};
const IMG = {
  pwfHero: `${R2}/locations/cmlhcpxik0001m2a32ftvmlnd/hero.jpg`, pwfGallery0: `${R2}/locations/cmlhcpxik0001m2a32ftvmlnd/gallery-0.jpg`, pwfGallery1: `${R2}/locations/cmlhcpxik0001m2a32ftvmlnd/gallery-1.jpg`,
  pwfStop: (k: string) => `${R2}/field-trip-stops/${k}/hero.jpg`,
  churchillHero: `${R2}/waterways/cmlhaslr1000um2zh1ohr52f9/hero.jpg`, yorkHero: `${R2}/locations/cmlhasls40021m2zhu35xikyc/hero.jpg`, hudsonBayHero: `${R2}/waterways/cmlhaslrt001cm2zh9tknhhbe/hero.jpg`,
  coppermineHero: `${R2}/waterways/cmlhbjrqa000dm2mb7n6w7y4w/hero.jpg`,
  beechey: commons("2015-09-11 05 Northumberland House, Beechey Island NU Canada.jpg"), beecheyGraves: commons("Beechey Island Graves 1 1997-08-02.jpg"),
  portLeopold: commons("Appearance of the Sky at Port Leopold.jpg"), victoryPoint: commons("Wfm victoria island.jpg"), fortHope: commons("Repulse Bay, Nunavut (13431587334).jpg"),
  gjoaHaven: commons("Gjoa Haven shoreline with Ocean Endeavour moored off-shore, September 2019.jpg"), nattilik: commons("Nattilik Heritage Centre, Gjoa Haven, September 2019.jpg"),
  queenMaudHero: `${R2}/waterways/queen-maud-gulf-waterway/hero.jpg`, terrorBayGallery0: `${R2}/waterways/terror-bay-waterway/gallery-0.jpg`, backRiverHero: `${R2}/waterways/back-river-waterway/hero.jpg`,
  wellington: commons("Wellington Channel Melville Island &c from Admiralty Chart 1862.jpg"),
  nootkaHero: `${R2}/waterways/cmlhci06w000dm2rx3bn9gj7e/hero.jpg`, friendlyCoveHero: `${R2}/locations/cmlhci092001fm2rxed77jk9j/hero.jpg`, sanMiguelHero: `${R2}/locations/cmlhci098001jm2rxi0if729k/hero.jpg`,
  blighHero: `${R2}/locations/cmlhci09b001lm2rxun86l1q7/hero.jpg`, opitsaht: commons("Meares Island (4106098006).jpg"), gaspeCrossHero: `${R2}/locations/cmlhci08s0019m2rx3b2ipe6i/hero.jpg`,
  juanDeFucaHero: `${R2}/waterways/cmlhci078000lm2rxus8do5zj/hero.jpg`,
};
// Stop images of the existing 7-9 Prince of Wales Fort trip (R2 keys verified in Turso 2026-10-21).
const PWF = { starFort: "cmlirhtn7000fm2hceqwlhqd8", batteries: "cmlirhtn7000gm2hcr9luz43a", surrender: "cmlirhtn7000hm2hcehfkh24k", tradePost: "cmlirhtn7000im2hcumhing1m", hearne: "cmlirhtn7000jm2hcrwf5o0m4", today: "cmlirhtn7000km2hcc83reke8" };

// ───────────────────────────────────────────── Lessons ─────────────────────────────────────────────
export const lessons: PackLesson[] = [
  {
    id: "lesson_reading_the_companys_paper", title: "Reading the Company's Paper: Instructions, Journals and Reports", gradeLevel: "10-12", topic: "Primary Sources", estimatedMinutes: 75, readingTimeMinutes: 9,
    description: "The Hudson's Bay Company ran a continent on paper: instructions sent out, journals kept daily, reports sent home. Each kind of document was written by someone, for someone, for a reason. Using the Company papers the app holds for Prince of Wales Fort and York Factory, students learn to ask who wrote it, for whom, and what it leaves out.",
    heroImageUrl: IMG.pwfHero,
    images: [
      { url: IMG.pwfGallery0, caption: "Prince of Wales Fort at the mouth of the Churchill River, where Moses Norton wrote his instructions and reports", credit: "Wikimedia Commons" },
      { url: IMG.yorkHero, caption: "York Factory, the Company's main depot and the source of its longest run of post journals", credit: "Wikimedia Commons" },
      { url: IMG.coppermineHero, caption: "The Coppermine River, the object of Norton's instructions to Hearne in 1770", credit: "Wikimedia Commons" },
      { url: IMG.hudsonBayHero, caption: "Hudson Bay: the Company's ships crossed it once a year, carrying the paper both ways", credit: "Wikimedia Commons" },
    ],
    narrativeContent: `## Three kinds of paper

The Hudson's Bay Company was a trading business with its head office in London and its posts a sea-voyage away on Hudson Bay. It could not see what its men were doing. So it ruled by paper, and three kinds of paper did most of the work.

**Instructions** went outward. The London Committee wrote to its chief factors; a chief factor wrote to the men he sent inland. An instruction tells a reader what to do, and so it tells us what the writer wanted and feared. Moses Norton's instructions to Samuel Hearne in December 1770 are a case: a chief factor at Prince of Wales Fort sending a young man north to find a river of copper, with orders about the route, the guides and the report he must bring back.

**Journals** were kept daily at every post and on every journey. A journal records what happened in the order it happened, which makes it the closest thing to an eyewitness we have. But it was written knowing that the Committee would read it, and a man writing for his employer chooses what to put down. Isham's and Graham's observations on Hudson Bay are post journals grown into books.

**Reports** went homeward: the trade report, the annual accounting of furs, goods and people. Norton's trade report of 1768 is one. A report argues. It explains why returns were low, why rivals were a threat, why more goods were needed. It is the writer's case for himself.

## What each kind leaves out

An instruction leaves out whether it was obeyed. A journal leaves out what the writer did not think worth recording, or did not want his employer to know. A report leaves out whatever weakens the writer's case. And all three leave out most of the people who made the trade work: the Cree homeguard who fed the posts, the Chipewyan leaders such as Matonabbee who guided the journeys, the women whose labour the Company's own records call "country" work. They appear, when they appear, as the writers saw them.

## Checking the record

The app's Checking the Record tool holds three of these documents as pairs: the passage the app once carried beside the sentences as published. Norton's 1770 instructions were a paraphrase; the 1768 trade report could not be verified at all; the Company's 1778 engagement of Philip Turnor as surveyor carried the wrong date. Reading a source means first asking whether the words in front of you are the writer's.`,
    introduction: "Put three documents on the board by title only: Norton's Instructions to Samuel Hearne, December 1770; Isham's Observations on Hudsons Bay, 1743; Norton's Trade Report to the London Committee, 1768. Ask: who is the reader of each, and what does the writer want that reader to do?",
    mainContent: `## The documents in the app (10-12 band)
- Norton's Instructions to Samuel Hearne, December 1770 (letter). Checking the Record: *paraphrase*.
- Norton's Trade Report to the London Committee, 1768 (report). Checking the Record: *unverifiable*.
- The Hudson's Bay Company's Engagement of Philip Turnor as Surveyor, 1778 (letter). Checking the Record: *date or author*.
- Isham's Observations on Hudsons Bay, 1743; Andrew Graham's Observations on Hudson's Bay, 1767-1791 (journals).
- Wales's Journal of a Voyage to Churchill River, 1768-1769 (journal; the transit of Venus).
- La Pérouse's Account of the Attack on Prince of Wales Fort, August 1782 (journal; the other side's paper). Checking the Record: *unverifiable*.

## The frame
For every document: **Origin** (who, when, where, in what office), **Purpose** (what the reader is meant to do or believe), **Audience** (the Committee, a subordinate, posterity), **Silences** (who and what is missing), **Corroboration** (what other paper, or what Indigenous account, speaks to the same event).

## Three outcomes of the frame
1. Instructions reveal intentions; journals reveal events as the writer chose to record them; reports reveal arguments.
2. The Company's paper is one side of a relationship; the Cree and Chipewyan side survives in oral history and, indirectly, in what the Company's writers complain about.
3. Before any of this, the words must be checked against the published edition. The app shows what happens when they are not.`,
    objectives: ["Distinguish instruction, journal and report as genres with different purposes and audiences", "Apply the origin, purpose, audience, silences and corroboration frame to a Company document", "Identify who is absent from the Company's paper and where their account survives", "Explain, with the Checking the Record pairs, why a quotation must be verified before it is used"],
    materials: ["The app: the six documents above, their Checking the Record pairs, the Prince of Wales Fort and York Factory records", "The printable 'Source Analysis Frame: Instructions, Journals and Reports'", "The comparison 'Three Kinds of Company Paper'"],
    activities: [
      { title: "Sort the paper", description: "Students classify the six documents as instruction, journal or report, then justify each with one sentence on who the reader was.", duration: "15 minutes", materials: ["The app"] },
      { title: "Frame one document", description: "In pairs, apply the five-part frame to Norton's instructions to Hearne. Who is told what, why, and what does the letter not say about the Chipewyan guides without whom the journey could not happen?", duration: "20 minutes", materials: ["Source Analysis Frame printable"] },
      { title: "The case for himself", description: "Read the context of Norton's 1768 trade report. List the claims a chief factor would want London to believe, then mark which could be checked against the post journal.", duration: "15 minutes", materials: ["The app"] },
      { title: "Checking the Record", description: "Open the three pairs. For each, state what changed between the app's first version and the published edition, and what a student who cited the first version would have got wrong.", duration: "20 minutes", materials: ["The app"] },
    ],
    discussionQuestions: ["Why would a company that could not see its posts prefer journals to letters?", "What does an instruction tell us that the journey itself does not?", "Where in the Company's paper do Cree and Chipewyan people appear, and in whose words?", "Is an unverifiable passage worthless, or merely unusable as a quotation?", "What would a Chipewyan account of Hearne's departure have recorded that Norton's letter does not?"],
    assessment: "Students complete the frame for two documents of different kinds and write a 300-word comparison of their silences, citing the Checking the Record pair for one of them.",
    extensions: "Compare Norton's instructions with La Pérouse's 1782 account of taking the fort: two sets of paper about one place, written for two governments. Then read Hearne's own account of Matonabbee's leadership (7-9 band) and ask what the Company's paper would look like if Matonabbee had kept the journal.",
    curriculumConnections: [
      { subject: "History", strand: "Historical inquiry: evidence and sources", expectation: "Assess the origin, purpose and reliability of primary sources and identify their silences" },
      { subject: "History", strand: "Colonization and the fur trade", expectation: "Explain how a chartered company governed territory and people through documents" },
      { subject: "English", strand: "Reading and literature studies", expectation: "Analyse how genre and audience shape a text" },
    ],
    teacherObjectives: ["Students will treat genre as evidence: what a document is tells us how to read it", "Students will connect the Company's paper to the people it governed and omitted", "Students will practise verification before interpretation using the app's source pairs"],
    teacherActivities: [
      { title: "Two governments, one fort", description: "Students read the context of La Pérouse's 1782 account and Hearne's account of the capture (7-9 band) and build a table of what each writer needed his readers to believe.", duration: "25 minutes", materials: ["The app"] },
      { title: "Write the missing journal", description: "Students draft a page of the Churchill post journal for a December day in 1770 from the point of view of a Chipewyan guide preparing to leave, then annotate what they had to invent and why the Company's paper cannot supply it.", duration: "30 minutes", materials: ["Paper"] },
    ],
    teacherQuestions: ["What did the Committee gain by making every post keep a daily journal, and what did it lose?", "How should a historian weigh a trade report against the post journal of the same year?", "Why did the app's earlier version paraphrase Norton's instructions, and why does the difference matter?", "What is the ethical difference between reading the Company's paper for what it says and reading it for what it suppresses?"],
    teacherNotes: "The three Checking the Record pairs for this lesson are sp_norton_orders_1770 (paraphrase), sp_norton_trade_report_1768 (unverifiable) and sp_turnor_engagement_1778 (date or author). Moses Norton was chief factor at Prince of Wales Fort from 1762 to his death in 1773; Hearne's third journey left the fort in December 1770 with Matonabbee and reached the Coppermine in July 1771. Keep the lesson on the documents; Hearne's account of the Coppermine, which the 4-6 and 7-9 bands hold, is not the subject here.",
    keyFigures: [
      { name: "Moses Norton", role: "Chief factor, Prince of Wales Fort", years: "c. 1735-1773", description: "Wrote the 1768 trade report and the 1770 instructions to Hearne; the Company's voice on the Churchill.", explorerId: E.mosesNorton },
      { name: "Samuel Hearne", role: "Company servant and traveller", years: "1745-1792", description: "Carried out the instructions of 1770; later chief at the fort and its surrenderer in 1782.", explorerId: E.hearne },
      { name: "Matonabbee", role: "Chipewyan leader", years: "c. 1737-1782", description: "Led the 1770-72 journey to the Coppermine; present in the Company's paper only as the writers saw him.", notableFigureId: F.matonabbee },
      { name: "Philip Turnor", role: "The Company's first surveyor", years: "1751-1799", description: "Engaged in 1778 by a letter whose date the app once carried wrongly.", explorerId: E.turnor },
    ],
    timeline: [
      { year: 1670, title: "Hudson's Bay Company Charter Granted", description: "A royal charter makes the Company the government of the Bay's watershed on paper.", eventId: T.hbc1670 },
      { year: 1769, title: "The Transit of Venus at Churchill", description: "Wales and Dymond observe the transit from the fort; Wales's journal is the scientific face of the Company's paper.", eventId: T.transit1769 },
      { year: 1770, title: "Hearne at Yathkyed Lake", description: "Hearne's second journey fails; Norton's December instructions send him out a third time with Matonabbee.", eventId: T.yathkyed1770 },
      { year: 1774, title: "Cumberland House Founded", description: "Hearne builds the Company's first inland post; the paper now has to travel up the rivers too.", eventId: T.cumberland1774 },
    ],
    relatedWaterwayIds: [W.churchill, W.hudsonBay, W.hayes, W.coppermine],
    relatedLocationIds: [L.princeOfWales, L.yorkFactory, L.cumberlandHouse],
    relatedExplorerIds: [E.mosesNorton, E.hearne, E.turnor, E.isham, E.graham, E.wales, E.laPerouse],
    relatedQuizIds: ["quiz_1012_companys_paper"],
    outcomes: [
      "on_g7_A2.3", "on_g7_A2.5", "on_g7_A2.6", "on_g8_A2.3", "on_g8_A2.6", "on_g7_A3.8", "on_g11_C1.1",
      "bc_g9_bigidea_3", "bc_g9_content_6", "bc_g10_bigidea_3", "qc_hqc_1608_1760_2", "qc_hqc_1608_1760_41", "qc_hqc_1608_1760_43", "qc_hqc_1760_1791_20", "qc_hqc_originsto1608_26",
      "ab_g7_7_1_4_q1", "ab_g7_7_1_4_q3", "sk_g7_PA7_1_a", "sk_g7_PA7_1_b", "sk_g7_DR7_3_c", "mb_g6_6_KL_023",
      "nl_g8_1_1_2", "nl_g8_1_1_6", "nl_g8_1_1_7", "nl_g8_1_2_1", "nl_g8_1_2_3", "nl_g8_1_2_4", "nl_g8_2_3_14",
    ],
  },
  {
    id: "lesson_whose_testimony_counts", title: "Whose Testimony Counts? The Franklin Search, 1854-2016", gradeLevel: "10-12", topic: "Primary Sources", estimatedMinutes: 75, readingTimeMinutes: 9,
    description: "In 1854 John Rae brought home what Inuit hunters had told his interpreter William Ouligbuck about the end of Franklin's expedition. London rejected the testimony. A hundred and sixty years later, Inuit oral history led searchers to the wrecks of Erebus and Terror. A lesson on evidence: who is believed, why, and what it costs to disbelieve.",
    heroImageUrl: IMG.beecheyGraves,
    images: [
      { url: IMG.beechey, caption: "Beechey Island, where Franklin's ships wintered in 1845-46 and the first traces were found in 1850", credit: "Wikimedia Commons" },
      { url: IMG.fortHope, caption: "Repulse Bay, where Rae wintered at Fort Hope and, in 1854, heard the Inuit account", credit: "Wikimedia Commons" },
      { url: IMG.victoryPoint, caption: "King William Island, where the Victory Point record was found in 1859", credit: "Wikimedia Commons" },
      { url: IMG.queenMaudHero, caption: "Queen Maud Gulf, where HMS Erebus was found in 2014", credit: "Wikimedia Commons" },
      { url: IMG.terrorBayGallery0, caption: "Terror Bay, where HMS Terror was found in 2016", credit: "Wikimedia Commons" },
    ],
    narrativeContent: `## Two ships, 129 men, no word

Sir John Franklin sailed from England in May 1845 with HMS Erebus and HMS Terror to complete the Northwest Passage. The ships wintered at Beechey Island, where three men died and were buried. After that, nothing. By 1848 the Admiralty was sending search expeditions; by 1850 a dozen ships were looking. They found the Beechey graves and little else.

## What the hunters said

In the spring of 1854 John Rae, a Hudson's Bay Company surgeon surveying the coast of Boothia, met Inuit near Pelly Bay. Through his interpreter William Ouligbuck he heard that, some years before, hunters had seen about forty white men dragging a boat south along the west coast of King William Island, and later found their bodies near the mouth of the Back River. The hunters had relics: a silver plate with Franklin's crest, officers' silverware, a medal. Some of the bodies, they said, bore signs that the starving men had eaten their dead.

Rae wrote it down, bought the relics and went home. His report reached the Admiralty and the newspapers in October 1854.

## Who is believed

The reaction tells us about the believers. Lady Franklin and much of the press refused the account. Charles Dickens, in his magazine, argued that the testimony of Inuit hunters could not be trusted against the character of British officers, and that the hunters might themselves have killed the men. Rae was attacked for repeating what he had been told without going to see for himself. He was eventually paid the reward for first news of the expedition's fate, but his name was left off the monuments.

Every later finding confirmed the hunters. In 1859 Francis Leopold McClintock's expedition found the Victory Point record on King William Island: the ships beset in September 1846, Franklin dead in June 1847, the ships abandoned in April 1848, 105 men setting out for the Back River. It found a boat with two skeletons where the Inuit had said. Charles Francis Hall in the 1860s, with Tookoolito and Ebierbing interpreting, gathered more Inuit testimony, including that of In-nook-poo-zhe-jook, who had spoken to Rae. Forensic work on bones found in the twentieth century confirmed the cutting marks.

## The ships

The Inuit had also said where the ships were. One, they said, had sunk in deep water off the west coast; the other had drifted south and been found by hunters, who went aboard. The searches of the twentieth century largely looked elsewhere. When Parks Canada began a new search in 2008, it worked with Inuit historians, among them Louie Kamookak of Gjoa Haven, whose records of elders' accounts pointed south. In September 2014 HMS Erebus was found in Queen Maud Gulf, in water the Inuit accounts had described. In 2016 HMS Terror was found in Terror Bay, after Sammy Kogvik, a Gjoa Haven hunter and Canadian Ranger, told the search team of a mast he had seen standing out of the ice years before.

## The lesson

The evidence was there in 1854. What was missing was the willingness to accept it from the people who had it.`,
    introduction: "Give students Rae's position in October 1854 in one sentence: he has relics and an account from Inuit hunters, delivered through his interpreter, and no body. Ask: is this evidence? Then ask what a court would need, and whether that standard was applied equally to all witnesses.",
    mainContent: `## The chain of evidence
| Year | Source | Kind | What it establishes |
|---|---|---|---|
| 1850 | Beechey Island graves (Penny, Austin) | physical | the 1845-46 wintering |
| 1854 | Inuit testimony via William Ouligbuck; relics (Rae's report) | oral, through an interpreter; physical | the men's route, their deaths near the Back River, cannibalism |
| 1859 | The Victory Point record; the boat at Erebus Bay (McClintock) | written; physical | dates of besetment, Franklin's death, abandonment, the march |
| 1864-69 | Inuit testimony gathered by Hall with Tookoolito and Ebierbing | oral, through interpreters | corroboration and detail, including In-nook-poo-zhe-jook's account |
| 1878-80 | Schwatka's search with Ebierbing | physical | graves and relics on King William Island |
| 1980s-90s | Forensic study of bones | scientific | cut marks confirming the 1854 account |
| 2014, 2016 | Erebus and Terror found, guided by Inuit oral history | physical | the ships where the Inuit said |

## Why the testimony was rejected
Three reasons stand in the documents of 1854: the witnesses were Inuit; the account came through an interpreter; and it accused British officers of the unthinkable. None is a rule of evidence. All are rules about who is allowed to be a witness.

## What the app holds
Rae's report on the relics (7-9 band), Richardson's searching expedition (10-12), McClintock's Fox voyage (7-9), Hall's second expedition and the Inuit testimony (10-12), the discoveries of 1850, 1859, 2014 and 2016, and the figures William Ouligbuck, Ouligbuck, In-nook-poo-zhe-jook, Tookoolito and Ebierbing.`,
    objectives: ["Reconstruct the chain of evidence on the Franklin expedition's fate from 1850 to 2016", "Explain why Rae's 1854 report was rejected and on what grounds", "Distinguish rules of evidence from assumptions about witnesses", "Describe the role of Inuit testimony and oral history in the 1859 confirmation and the 2014 and 2016 discoveries"],
    materials: ["The app: the documents, discoveries and notable figures listed above; the field trip 'The Franklin Search: Beechey Island to Terror Bay'", "The printable 'Franklin Search Evidence Table'", "The comparison 'Rae 1854 and McClintock 1859: Two Ways of Finding Out'"],
    activities: [
      { title: "Build the chain", description: "Using the evidence table printable, students place each piece of evidence in order and classify it: oral, written, physical, scientific. Then they mark which pieces depend on an interpreter.", duration: "20 minutes", materials: ["Evidence Table printable"] },
      { title: "The objections of 1854", description: "Students read the context of Rae's report and list the objections raised against it. For each, they decide whether it is a rule of evidence or a judgment about the witness.", duration: "20 minutes", materials: ["The app"] },
      { title: "Two ways of finding out", description: "Using the comparison, students contrast Rae's method (listen, buy the relics, report) with McClintock's (go, dig, bring back the paper) and decide what each could and could not establish.", duration: "15 minutes", materials: ["The app"] },
      { title: "2014", description: "Students trace how the ships were found: the Inuit accounts, the historians who recorded them, the search area, the hunter's mast. They write one paragraph on what changed between 1854 and 2014, and what did not.", duration: "20 minutes", materials: ["The app"] },
    ],
    discussionQuestions: ["Was Rae right to publish the cannibalism account without going to see for himself?", "What would it have taken for London to accept Inuit testimony in 1854?", "Why were Tookoolito, Ebierbing and William Ouligbuck essential, and why do their names appear on so few monuments?", "If the Inuit accounts said where the ships were, why did it take until 2014 to look there?", "What does this case say about who gets to be a witness in history?"],
    assessment: "Students write an evidence brief of 500 words: what was known by 1859, from which sources, and which sources were discounted and why, with a closing paragraph on the 2014 and 2016 finds.",
    extensions: "Compare with the Checking the Record tool: the app's own earlier versions carried unverified passages about several Arctic documents. What is the difference between disbelieving a witness and failing to check a quotation? Then read the 10-12 lesson Two Oceans, One Passage for the larger story of the searches.",
    curriculumConnections: [
      { subject: "History", strand: "Historical inquiry: evidence and perspective", expectation: "Evaluate the credibility of sources and analyse how perspective shaped their reception" },
      { subject: "Indigenous Studies", strand: "Knowledge and ways of knowing", expectation: "Explain the role of Inuit oral history as historical evidence and its treatment by colonial institutions" },
      { subject: "Geography", strand: "Canada's North", expectation: "Locate the sites of the Franklin expedition and its search on the Arctic coast" },
    ],
    teacherObjectives: ["Students will analyse the 1854 controversy as a case of evidence rejected on the grounds of who gave it", "Students will trace Inuit testimony through the record from Rae to Parks Canada", "Students will practise classifying evidence by kind and by its chain of transmission"],
    teacherActivities: [
      { title: "Dickens and Rae", description: "Students research the exchange between Dickens and Rae in Household Words (December 1854) and summarize each side's argument in their own words, then identify the assumptions beneath Dickens's.", duration: "30 minutes", materials: ["Library"] },
      { title: "The interpreters", description: "Students read the notable figure records for William Ouligbuck, Ouligbuck, Tookoolito and Ebierbing and write a short account of the Franklin search as a history of interpreters.", duration: "25 minutes", materials: ["The app"] },
    ],
    teacherQuestions: ["How did the Victorian idea of the heroic explorer shape what counted as evidence?", "Why does the 2014 discovery credit Inuit oral history, and what institutional change does that reflect?", "What is the historian's responsibility when a source was dismissed for its origin rather than its content?", "How should the Franklin story be taught in a Nunavut classroom?"],
    teacherNotes: "Dates follow the Victory Point record (beset 12 September 1846; Franklin died 11 June 1847; ships deserted 22 April 1848; 105 men under Crozier). Rae's report is dated 29 July 1854 at Repulse Bay and reached London in October. Treat the cannibalism evidence factually and briefly; the point of the lesson is the treatment of the witnesses, not the detail. The figures' records in the app carry the spellings used here.",
    keyFigures: [
      { name: "Dr. John Rae", role: "Hudson's Bay Company surgeon and surveyor", years: "1813-1893", description: "Brought home the Inuit account and the relics in 1854; attacked for believing them.", explorerId: E.rae },
      { name: "William Ouligbuck", role: "Interpreter to Rae", years: "fl. 1846-1854", description: "Heard the first account of the expedition's end at Pelly Bay and put it into English.", notableFigureId: F.williamOuligbuck },
      { name: "In-nook-poo-zhe-jook", role: "Netsilik hunter and witness", years: "fl. 1854-1869", description: "Told Rae in 1854 and Hall in 1869 what had happened to the men.", notableFigureId: F.innookpoozhejook },
      { name: "Sir Francis Leopold McClintock", role: "Commander of the Fox", years: "1819-1907", description: "His 1857-59 expedition found the Victory Point record and the boat at Erebus Bay.", explorerId: E.mcclintock },
      { name: "Tookoolito", role: "Interpreter to Charles Francis Hall", years: "c. 1838-1876", description: "Gathered and translated Inuit testimony on three expeditions.", notableFigureId: F.tookoolito },
      { name: "Ebierbing", role: "Hunter, guide and interpreter", years: "c. 1837-c. 1881", description: "Guided Hall and later Schwatka to King William Island.", notableFigureId: F.ebierbing },
    ],
    timeline: [
      { year: 1845, title: "Franklin Winters at Beechey Island", description: "Erebus and Terror winter at Beechey Island; three men die.", eventId: T.beechey1845 },
      { year: 1848, title: "Erebus and Terror Abandoned", description: "The ships are deserted off King William Island; 105 men march for the Back River.", eventId: T.abandoned1848 },
      { year: 1850, title: "Franklin's Winter Camp Found at Beechey Island", description: "Searchers find the three graves and the winter camp.", eventId: T.beecheyFound1850 },
      { year: 1854, title: "Rae Hears of Franklin's Fate", description: "Inuit hunters tell William Ouligbuck and Rae what became of the men.", eventId: T.raeHears1854 },
      { year: 1859, title: "The Victory Point Record Found", description: "McClintock's expedition finds the only written record of the expedition's end.", eventId: T.victoryPoint1859 },
      { year: 1869, title: "Hall on King William Island", description: "Hall reaches the island with Tookoolito and Ebierbing after years of gathering testimony.", eventId: T.hall1869 },
    ],
    relatedWaterwayIds: [W.wellington, W.princeRegent, W.victoriaStrait, W.repulse, W.simpsonStrait, W.queenMaud, W.terrorBay, W.backRiver],
    relatedLocationIds: [L.beechey, L.portLeopold, L.victoryPoint, L.fortHope, L.gjoaHaven],
    relatedExplorerIds: [E.franklin, E.crozier, E.rae, E.mcclintock, E.hall, E.schwatka, E.richardson, E.jcRoss, E.penny],
    relatedQuizIds: ["quiz_1012_franklin_evidence"],
    outcomes: [
      "on_g7_B2.3", "on_g7_B2.6", "on_g8_A2.3", "on_g8_A2.6", "on_g11_B2.2", "on_g11_B3.1", "on_g11_C1.1",
      "bc_g9_bigidea_3", "bc_g9_content_6", "bc_g10_bigidea_3", "bc_g10_bigidea_4", "qc_hqc_originsto1608_10", "qc_hqc_originsto1608_26", "qc_hqc_1945_1980_2",
      "sk_g7_DR7_3_c", "sk_g7_DR7_1_f", "sk_g7_PA7_1_a", "sk_g8_IN8_1_d", "mb_g4_4_KH_036", "mb_g4_4_KL_031",
      "nl_g8_1_1_2", "nl_g8_1_1_6", "nl_g8_1_1_7", "nl_g8_1_2_1", "nl_g8_1_2_4", "ns_g8_o1_i1",
    ],
  },
  {
    id: "lesson_claiming_a_coast", title: "Claiming a Coast: Possession, Law and the Nootka Papers, 1774-1794", gradeLevel: "10-12", topic: "Maritime Discovery", estimatedMinutes: 75, readingTimeMinutes: 9,
    description: "A cross on a beach, a notary's act, a hut and a flag, a memorial to Parliament, a convention between two crowns. Europeans claimed the Pacific coast on paper while the Mowachaht chief Maquinna went on governing it. Using the Nootka documents the app holds, students examine what an act of possession was, what it was worth, and who was never asked.",
    heroImageUrl: IMG.nootkaHero,
    images: [
      { url: IMG.friendlyCoveHero, caption: "Yuquot (Friendly Cove), the Mowachaht summer village where Cook anchored in 1778", credit: "Wikimedia Commons" },
      { url: IMG.sanMiguelHero, caption: "The site of Fort San Miguel, built by Martínez in 1789", credit: "Wikimedia Commons" },
      { url: IMG.blighHero, caption: "Bligh Island in Nootka Sound, where Cook's ships were refitted", credit: "Wikimedia Commons" },
      { url: IMG.gaspeCrossHero, caption: "Gaspé, where Cartier raised a cross in 1534: the oldest act of possession in the app", credit: "Wikimedia Commons" },
      { url: IMG.juanDeFucaHero, caption: "The Strait of Juan de Fuca, surveyed by Quimper in 1790 and by Vancouver in 1792", credit: "Wikimedia Commons" },
    ],
    narrativeContent: `## How Europeans took possession on paper

European powers had a shared set of gestures for claiming land they had not conquered or bought. Raise a cross or a flag. Read a proclamation. Bury a bottle with a document in it. Have a notary write it down and witnesses sign. Cartier's cross at Gaspé in 1534 is one; La Salle's act of possession of Louisiana in 1682, written out by a notary at the mouth of the Mississippi, is another. The act created a claim that other European courts might recognize. It said nothing to, and asked nothing of, the people who lived there.

## Nootka

On the Pacific coast the gestures collided. Juan Pérez reached Nootka Sound in 1774 and traded from his ship without landing. James Cook anchored at Yuquot in 1778, refitted his ships, traded for sea otter pelts and wrote a journal that, when published, sent the fur ships of three nations to the coast. John Meares, a British trader under Portuguese colours, built a hut at Yuquot in 1788 and launched a small ship there. In 1789 the Spanish commander Esteban José Martínez arrived to make Spain's claim good, built Fort San Miguel, seized Meares's ships and arrested his men. A Mowachaht leader, Callicum, was shot dead by Spanish fire.

## The paper war

Meares went to London and in April 1790 laid a memorial before Parliament describing his losses and, by his account, land he had bought from Maquinna. Britain mobilized its fleet. Spain, without an ally, gave way. The Nootka Convention of October 1790 agreed that British subjects could trade and settle on the coast north of Spain's existing settlements and that Meares would be compensated. Two years later George Vancouver and Juan Francisco de la Bodega y Quadra met at Nootka to carry out the restitution and could not agree on what, if anything, Meares had owned. José Mariano Moziño, the Spanish naturalist at Yuquot that summer, wrote the most careful European account of Mowachaht society, including the fact that the land was Maquinna's. Spain withdrew from Nootka in 1795.

## Maquinna

Through all of it, Maquinna governed Yuquot. He traded with each power, hosted their officers, and used their rivalry. The documents record him as a host, a trading partner and a witness to other people's claims. None of them records anyone asking whether the coast was his to be claimed.

## Why it matters

The doctrine that European discovery gave a crown title to Indigenous land underlies the Royal Proclamation of 1763, the treaties of the nineteenth century and the court cases of the twenty-first. Nootka is where it can be watched being made, on paper, with the people it concerned standing on the beach.`,
    introduction: "Show the location record for Cartier's Cross at Gaspé and the document record for La Salle's Act of Possession. Ask: what did these acts create, in whose eyes, and what did they require of the people living there? Then move to Nootka, where two European powers tried the same thing on the same beach.",
    mainContent: `## The documents in the app
- Juan Pérez's Diary of the Santiago, 1774 (10-12).
- Cook's Journal at Nootka Sound, March-April 1778 (10-12).
- Meares's Memorial to Parliament, 30 April 1790 (10-12), and his Voyages (7-9).
- The Nootka Convention and the Official Papers of 1790 (10-12).
- Mozino's Noticias de Nutka, 1792 (10-12).
- Vancouver's Voyage of Discovery, 1798 (7-9).
- For comparison: Cartier's cross (1534, the Gaspé location record) and La Salle's Act of Possession of Louisiana, 1682 (10-12).

## Questions to put to each document
1. What act of possession does it describe or claim, and with what gestures?
2. Whose recognition is it seeking: another crown, Parliament, posterity?
3. Where do the Mowachaht appear, and in what role: host, seller, witness, obstacle?
4. What does it assume about who may own land, and where did that assumption come from?

## The thread forward
Royal Proclamation 1763 → Nootka 1790 → the Oregon Treaty 1846 → the treaties on the plains 1871-77 → the Constitution Act 1982 and the courts. The app's timeline carries the first three and the treaties.`,
    objectives: ["Describe the European conventions of taking possession and what they were meant to achieve", "Sequence the Nootka events of 1774-1795 from the documents", "Analyse Meares's memorial and the Nootka Convention as claims made for an audience", "Explain Maquinna's position and the absence of Mowachaht consent from every document", "Connect the doctrine of discovery at Nootka to later Canadian law"],
    materials: ["The app: the documents above, the Nootka Sound, Friendly Cove, Fort San Miguel and Bligh Island records, Maquinna and Wickaninnish, the field trip Yuquot and the Nootka Crisis of 1789", "The comparison 'Three Empires at Nootka'", "The lesson The Pacific Contest (10-12) for the wider story"],
    activities: [
      { title: "Anatomy of a claim", description: "Students dissect La Salle's 1682 act and Cartier's 1534 cross into gestures, witnesses, intended audience and legal effect, then do the same for Meares's hut and flag of 1788.", duration: "20 minutes", materials: ["The app"] },
      { title: "The memorial", description: "Students read the context of Meares's memorial to Parliament and list every claim in it that Vancouver and Bodega y Quadra later could not verify. What did Parliament need to believe, and why was it willing to?", duration: "20 minutes", materials: ["The app"] },
      { title: "Where is Maquinna?", description: "For each document, students record the role the Mowachaht are given. They then write the paragraph that each document would have needed if Maquinna's consent had been a requirement.", duration: "20 minutes", materials: ["Paper"] },
      { title: "The thread", description: "On the app's timeline, students find the Royal Proclamation, the Nootka Convention, the Oregon Treaty and Treaty 7, and write one sentence on how each inherits the Nootka assumption.", duration: "15 minutes", materials: ["The app"] },
    ],
    discussionQuestions: ["What made a cross on a beach a legal act in European eyes?", "Why did Britain go to the brink of war over a hut at Yuquot?", "Was Meares's claim to have bought land from Maquinna believable, and does it matter?", "What did Moziño see that the diplomats did not?", "Where does the Nootka assumption stand in Canadian law today?"],
    assessment: "Students write a 600-word analysis of one act of possession (Cartier, La Salle, Meares or Martínez) using the four questions, with a final paragraph on what the Mowachaht or St. Lawrence Iroquoian account of the same act would need to include.",
    extensions: "Research the Supreme Court of Canada's treatment of the doctrine of discovery and the Truth and Reconciliation Commission's call to repudiate it. Compare with the 10-12 lesson Indigenous Sovereignty and Treaty Rights.",
    curriculumConnections: [
      { subject: "History", strand: "Colonization and decolonization", expectation: "Explain the doctrine of discovery and its consequences for Indigenous title" },
      { subject: "History", strand: "Historical inquiry: evidence and perspective", expectation: "Analyse official documents as claims made for an audience" },
      { subject: "Law", strand: "Foundations of Canadian law", expectation: "Trace a legal assumption from imperial practice to Canadian jurisprudence" },
    ],
    teacherObjectives: ["Students will read acts of possession as performances for other Europeans", "Students will evaluate Meares's memorial as evidence and as advocacy", "Students will connect eighteenth-century practice to the legal present"],
    teacherActivities: [
      { title: "Moziño's Nootka", description: "Students read the context of the Noticias de Nutka and list what Moziño recorded about Mowachaht governance, property and law, then set it against the Convention's silence.", duration: "25 minutes", materials: ["The app"] },
      { title: "Moot", description: "A moot court on Meares's claim to land at Yuquot, 1792: counsel for Meares, for Spain, and for Maquinna, with the class as the bench. The bench must rule on what evidence each party actually has.", duration: "40 minutes", materials: ["Role cards"] },
    ],
    teacherQuestions: ["How did the sea otter trade turn a legal abstraction into a crisis?", "Why could Vancouver and Bodega y Quadra, both acting in good faith, not agree on what Meares had owned?", "What would an act of possession look like that took Indigenous law seriously?", "How should the Nootka Convention be taught beside the Royal Proclamation?"],
    teacherNotes: "Dates: Pérez at Nootka August 1774; Cook at Yuquot 29 March to 26 April 1778; Meares's hut and the North West America 1788; Martínez's seizures May to July 1789 and Callicum's death; Meares's memorial 30 April 1790; the Convention signed 28 October 1790; the Vancouver and Bodega y Quadra meeting August to September 1792; Spanish withdrawal March 1795. The 10-12 lesson The Pacific Contest tells the four-empire story; this lesson is about the documents and the law. Maquinna's name is spelled as on the figure record.",
    keyFigures: [
      { name: "Maquinna", role: "Chief of the Mowachaht at Yuquot", years: "fl. 1778-1795", description: "Governed Yuquot through every European claim and dealt with each power in turn.", notableFigureId: F.maquinna },
      { name: "John Meares", role: "Fur trader", years: "c. 1756-1809", description: "Built at Yuquot in 1788; his 1790 memorial to Parliament brought Britain and Spain to the edge of war.", explorerId: E.meares },
      { name: "Esteban José Martínez", role: "Spanish naval commander", years: "1742-1798", description: "Occupied Nootka for Spain in 1789 and seized the British ships.", explorerId: E.martinez },
      { name: "Juan Francisco de la Bodega y Quadra", role: "Spanish commissioner at Nootka, 1792", years: "1743-1794", description: "Met Vancouver to carry out the Convention and could not agree with him on what to restore.", explorerId: E.bodega },
      { name: "Captain George Vancouver", role: "British commissioner at Nootka, 1792", years: "1757-1798", description: "Surveyed the coast and negotiated at Yuquot; the restitution was left to the governments.", explorerId: E.vancouver },
      { name: "Captain James Cook", role: "Royal Navy", years: "1728-1779", description: "His month at Yuquot in 1778 and his published journal opened the sea otter trade.", explorerId: E.cook },
    ],
    timeline: [
      { year: 1534, title: "Cartier's cross at Gaspé", description: "The oldest act of possession in the app; Donnacona objected." },
      { year: 1774, title: "Pérez Reaches Haida Gwaii and Nootka", description: "Spain's first voyage to the coast; trade from the ship, no landing.", eventId: T.perez1774 },
      { year: 1778, title: "Cook at Nootka Sound", description: "A month at Yuquot; the journal that sent the fur traders.", eventId: T.cook1778 },
      { year: 1788, title: "Meares Launches the North West America", description: "A hut and a ship at Yuquot become, in 1790, a claim to land.", eventId: T.meares1788 },
      { year: 1789, title: "The Nootka Crisis", description: "Martínez occupies Nootka, builds San Miguel and seizes the British ships.", eventId: T.crisis1789 },
      { year: 1790, title: "The Nootka Convention", description: "Britain and Spain settle the coast between themselves.", eventId: T.convention1790 },
      { year: 1792, title: "Vancouver Surveys Puget Sound", description: "Vancouver's survey season before the meeting with Bodega y Quadra at Nootka.", eventId: T.vancouver1792 },
      { year: 1846, title: "The Oregon Treaty", description: "The coast is divided at the 49th parallel, still without the people who lived there.", eventId: T.oregon1846 },
    ],
    relatedWaterwayIds: [W.nootka, W.clayoquot, W.juanDeFuca, W.dixon, W.gaspe, W.mississippi],
    relatedLocationIds: [L.friendlyCove, L.sanMiguel, L.blighIsland, L.opitsaht, L.gaspeCross],
    relatedExplorerIds: [E.cook, E.vancouver, E.martinez, E.meares, E.bodega, E.perez, E.laSalle, E.cartier],
    relatedQuizIds: ["quiz_1012_acts_of_possession"],
    outcomes: [
      "on_g11_C1.1", "on_g11_C1.3", "on_g7_A2.3", "on_g7_A2.6", "on_g7_A3.3", "on_g8_A3.3",
      "bc_g9_bigidea_3", "bc_g9_content_6", "bc_g10_bigidea_3", "bc_g10_bigidea_4", "bc_g10_content_5",
      "qc_hqc_originsto1608_23", "qc_hqc_originsto1608_26", "qc_hqc_1608_1760_12", "qc_hqc_1608_1760_36", "qc_hqc_1608_1760_37", "qc_hqc_1608_1760_38", "qc_hqc_1760_1791_9", "qc_hqc_from1980toourtimes_9", "qc_hqc_1945_1980_35",
      "ab_g7_7_1_3_q3", "ab_g7_7_1_3_q4", "ab_g7_7_1_3_q9", "ab_g7_7_1_6_q2", "sk_g7_IN7_1_c", "sk_g7_PA7_1_b", "sk_g8_DR8_1_b", "sk_g8_DR8_2_a",
      "mb_g6_6_KP_048", "nl_g7_7_2_2", "nl_g8_1_1_6", "nl_g8_1_2_3",
    ],
  },
];

// ───────────────────────────────────────────── Quizzes ─────────────────────────────────────────────
export const quizzes: PackQuiz[] = [
  {
    id: "quiz_1012_companys_paper", title: "Reading the Company's Paper", description: "Eight questions on instructions, journals and reports: who wrote them, for whom, and what they leave out.", category: "Fur Trade", gradeLevel: "10-12", difficulty: "hard",
    questions: [
      { questionText: "Moses Norton's instructions to Samuel Hearne in December 1770 are best read as evidence of what?", options: ["What happened on the journey", "What the chief factor wanted and feared before the journey began", "Matonabbee's plans", "The London Committee's opinion of Hearne"], correct: 1, explanation: "An instruction records intentions, not events. It tells us what the writer wanted done and what he worried about, not whether it was done.", sourceType: "explorer", sourceId: E.mosesNorton },
      { questionText: "Why did the Hudson's Bay Company require every post to keep a daily journal?", options: ["To train clerks in handwriting", "Because London could not see its posts and ruled them by paper", "To publish them as books", "Because the Crown demanded it"], correct: 1, explanation: "The Committee sat an ocean away. The journal was its eyes, and its men wrote knowing the Committee would read.", sourceType: "location", sourceId: L.yorkFactory },
      { questionText: "A chief factor's trade report to London is most likely to leave out what?", options: ["The number of furs traded", "Anything that weakens his own case", "The names of the ships", "The date"], correct: 1, explanation: "A report argues. It explains low returns, rivals and needs in the way most favourable to its writer.", sourceType: "location", sourceId: L.princeOfWales },
      { questionText: "In the Company's paper, how do Chipewyan leaders such as Matonabbee usually appear?", options: ["As authors of their own journals", "As the writers saw them, in the writers' words", "Not at all", "As Company employees"], correct: 1, explanation: "The Company's records are one side of a relationship. Matonabbee appears as Hearne and Norton described him, never in his own words.", sourceType: "notable_figure", sourceId: F.matonabbee },
      { questionText: "The app's Checking the Record tool found that its earlier version of Norton's 1770 instructions was a paraphrase. What follows?", options: ["The instructions never existed", "The passage cannot be quoted as Norton's words until checked against the published text", "Hearne made the journey anyway, so it does not matter", "The paraphrase is better than the original"], correct: 1, explanation: "A paraphrase may be accurate in sense, but it is not the writer's words. Verification comes before quotation.", sourceType: "explorer", sourceId: E.mosesNorton },
      { questionText: "What is William Wales's 1768-69 journal at Churchill evidence of?", options: ["The fur returns", "A scientific observation, the transit of Venus, made from a Company fort", "The surrender of 1782", "The route to the Coppermine"], correct: 1, explanation: "Wales and Dymond observed the transit of Venus from Prince of Wales Fort in June 1769; the journal is the scientific face of the Company's paper.", sourceType: "explorer", sourceId: E.wales },
      { questionText: "La Pérouse's 1782 account of taking Prince of Wales Fort and Hearne's account of the same event differ. What is the historian's first question?", options: ["Which writer was braver", "What each writer needed his own government to believe", "Which account is longer", "Which was written first"], correct: 1, explanation: "Two sets of paper about one event, each written for a government. Purpose and audience come before the facts.", sourceType: "explorer", sourceId: E.laPerouse },
      { questionText: "Philip Turnor was engaged as the Company's surveyor in 1778. Why does the app's record of that engagement matter to this lesson?", options: ["Because Turnor mapped the Coppermine", "Because the app once carried the wrong date for the letter, a Checking the Record case", "Because Turnor wrote the trade reports", "Because he was Norton's successor"], correct: 1, explanation: "The engagement letter is in the app's Checking the Record pairs under 'date or author': even the dating of a source has to be verified.", sourceType: "explorer", sourceId: E.turnor },
    ],
  },
  {
    id: "quiz_1012_franklin_evidence", title: "The Franklin Search: Evidence and Testimony", description: "Eight questions on what was known, from whom, and why some witnesses were not believed, 1850 to 2016.", category: "Explorers", gradeLevel: "10-12", difficulty: "hard",
    questions: [
      { questionText: "What did John Rae bring home in 1854?", options: ["Franklin's body", "An Inuit account of the expedition's end, heard through William Ouligbuck, and relics bought from the hunters", "The ships' logbooks", "A map of the passage"], correct: 1, explanation: "Rae had testimony through his interpreter and physical relics, including silver with Franklin's crest. He had not seen the site himself.", sourceType: "explorer", sourceId: E.rae },
      { questionText: "On what grounds was the 1854 account attacked in London?", options: ["The relics were fakes", "The witnesses were Inuit, the account came through an interpreter, and it accused British officers of cannibalism", "Rae had never been to the Arctic", "The Admiralty had already found the ships"], correct: 1, explanation: "None of the objections was a rule of evidence. All were judgments about who may be a witness.", sourceType: "notable_figure", sourceId: F.williamOuligbuck },
      { questionText: "What did the Victory Point record, found in 1859, establish?", options: ["That the Inuit account was false", "The dates of besetment, Franklin's death and the abandonment of the ships, and the march toward the Back River", "The location of the wrecks", "That the men had reached safety"], correct: 1, explanation: "The only written record of the expedition's end confirmed the route the hunters had described.", sourceType: "location", sourceId: L.victoryPoint },
      { questionText: "Who interpreted for Charles Francis Hall as he gathered Inuit testimony in the 1860s?", options: ["William Ouligbuck", "Tookoolito and Ebierbing", "Matonabbee", "Akaitcho"], correct: 1, explanation: "Tookoolito and Ebierbing worked with Hall on three expeditions; Ebierbing later guided Schwatka.", sourceType: "notable_figure", sourceId: F.tookoolito },
      { questionText: "Which witness spoke to both Rae in 1854 and Hall in 1869?", options: ["In-nook-poo-zhe-jook", "Ouligbuck", "Crozier", "Tattannoeuck"], correct: 0, explanation: "In-nook-poo-zhe-jook, a Netsilik hunter, gave his account twice, fifteen years apart.", sourceType: "notable_figure", sourceId: F.innookpoozhejook },
      { questionText: "Where was HMS Erebus found in 2014?", options: ["Beechey Island", "Queen Maud Gulf, where Inuit accounts had placed a ship", "Lancaster Sound", "The Back River"], correct: 1, explanation: "The 2014 search, informed by Inuit oral history, found Erebus in Queen Maud Gulf.", sourceType: "waterway", sourceId: W.queenMaud },
      { questionText: "How was the search area for HMS Terror settled in 2016?", options: ["By satellite", "By a Gjoa Haven hunter's account of a mast he had seen standing out of the ice in Terror Bay", "By the Victory Point record", "By chance"], correct: 1, explanation: "Sammy Kogvik's account took the search team to Terror Bay, where the ship was found.", sourceType: "waterway", sourceId: W.terrorBay },
      { questionText: "What is the lesson of the Franklin evidence for a historian?", options: ["Physical evidence is always better than testimony", "Evidence rejected for who gave it, rather than for what it says, can delay the truth by generations", "Oral history cannot be checked", "Interpreters make sources unreliable"], correct: 1, explanation: "The account of 1854 was correct in every later-tested detail. What was missing was the willingness to accept it from the people who had it.", sourceType: "location", sourceId: L.gjoaHaven },
    ],
  },
  {
    id: "quiz_1012_acts_of_possession", title: "Acts of Possession: Claims on Paper", description: "Eight questions on how Europeans claimed the coast, what the Nootka papers say, and who was never asked.", category: "Maritime History", gradeLevel: "10-12", difficulty: "hard",
    questions: [
      { questionText: "What did a European act of possession, such as Cartier's cross or La Salle's notarized act, create?", options: ["Ownership recognized by the people living there", "A claim that other European courts might recognize", "A treaty", "Nothing at all"], correct: 1, explanation: "The gestures were addressed to other crowns. They asked nothing of the inhabitants.", sourceType: "location", sourceId: L.gaspeCross },
      { questionText: "Why did Cook's 1778 journal matter to the later crisis?", options: ["It claimed Nootka for Britain", "Its publication revealed the sea otter trade and sent the fur ships of three nations to the coast", "It mapped the Northwest Passage", "It recorded Maquinna's consent"], correct: 1, explanation: "Cook's month at Yuquot and the prices his crews got for otter pelts in China started the maritime fur trade.", sourceType: "explorer", sourceId: E.cook },
      { questionText: "What did Esteban José Martínez do at Nootka in 1789?", options: ["Bought the land from Maquinna", "Built Fort San Miguel, seized British ships and arrested their crews", "Signed the Nootka Convention", "Surveyed the Strait of Juan de Fuca"], correct: 1, explanation: "Martínez came to make Spain's claim good; a Mowachaht leader, Callicum, was killed in the confrontation.", sourceType: "location", sourceId: L.sanMiguel },
      { questionText: "What was Meares's memorial to Parliament of April 1790?", options: ["A scientific report", "A statement of his losses and claims, including land he said he had bought from Maquinna, written to move the British government", "A treaty with Spain", "A map"], correct: 1, explanation: "The memorial was advocacy. Britain mobilized on it; Vancouver and Bodega y Quadra later could not verify its land claim.", sourceType: "explorer", sourceId: E.meares },
      { questionText: "What did the Nootka Convention of 1790 settle?", options: ["Mowachaht title to Yuquot", "The coast between Britain and Spain, without reference to its inhabitants", "The boundary at the 49th parallel", "The sea otter price"], correct: 1, explanation: "Two crowns agreed on trade, settlement and compensation. The Mowachaht were not a party.", sourceType: "waterway", sourceId: W.nootka },
      { questionText: "Why could Vancouver and Bodega y Quadra not complete the restitution at Nootka in 1792?", options: ["They never met", "They could not agree on what, if anything, Meares had actually owned", "Spain refused to leave", "Maquinna refused them"], correct: 1, explanation: "Acting in good faith, both commissioners found the memorial's claims impossible to pin to the ground.", sourceType: "explorer", sourceId: E.bodega },
      { questionText: "What did José Mariano Moziño record in 1792 that the diplomats did not?", options: ["The route to China", "A careful account of Mowachaht society, including that the land was Maquinna's", "Meares's purchase", "The weather"], correct: 1, explanation: "The Noticias de Nutka is the most careful European description of Yuquot's people and government.", sourceType: "notable_figure", sourceId: F.maquinna },
      { questionText: "Where does the assumption made at Nootka appear in later Canadian law?", options: ["Nowhere", "In the doctrine that European discovery gave the Crown title, underlying the Royal Proclamation, the treaties and later court cases", "Only in Spanish law", "In the Oregon Treaty alone"], correct: 1, explanation: "The doctrine of discovery runs from the acts of possession through the Proclamation of 1763 to the treaties and the courts; the Truth and Reconciliation Commission called for its repudiation.", sourceType: "location", sourceId: L.friendlyCove },
    ],
  },
];

// ───────────────────────────────────────────── Field trips ─────────────────────────────────────────────
export const fieldTrips: PackTrip[] = [
  {
    id: "trip_franklin_search", title: "The Franklin Search: Beechey Island to Terror Bay", gradeLevel: "10-12", estimatedMinutes: 35, theme: "explorer", coverImageUrl: IMG.beechey,
    description: "Seven stops on the evidence trail of the Franklin expedition, from the graves of 1846 to the wrecks of 2014 and 2016, with a question at each about who found what, from whom, and how it was received.",
    stops: [
      { title: "Beechey Island, 1845-46 and 1850", description: "Erebus and Terror wintered here in 1845-46. Three men died and were buried in the gravel: John Torrington, John Hartnell and William Braine. In August 1850 the searching ships of Penny, Austin and De Haven found the graves, the winter camp and hundreds of empty tins, but no written record of where the expedition meant to go next.", lat: 74.72, lng: -91.85, imageUrl: IMG.beecheyGraves, locationId: L.beechey, waterwayId: W.wellington, funFact: "The three graves were exhumed in the 1980s; the bodies were preserved by permafrost and showed high levels of lead.", thinkQuestion: "The searchers found a camp but no message. What does that tell you about what Franklin expected?" },
      { title: "Port Leopold, 1848-49", description: "James Clark Ross, the first naval search, wintered here in 1848-49 with Enterprise and Investigator. His sledge parties explored the coast of Somerset Island and came within reach of King William Island without knowing it. Ross left caches and a steam launch, and went home with nothing.", lat: 73.83, lng: -90.3, imageUrl: IMG.portLeopold, locationId: L.portLeopold, waterwayId: W.princeRegent, funFact: "Ross's expedition released foxes wearing collars with messages, hoping Franklin's men would catch them.", thinkQuestion: "Why did the Admiralty search north and east before south?" },
      { title: "Repulse Bay and Pelly Bay, 1854", description: "John Rae wintered at Fort Hope on Repulse Bay in 1846-47 and came back through this country in 1853-54 to survey the coast of Boothia. In April 1854, near Pelly Bay, Inuit hunters told his interpreter William Ouligbuck of white men who had died years before near the mouth of a great river to the west. Rae bought the relics they carried and wrote his report at Repulse Bay in July.", lat: 66.53, lng: -86.25, imageUrl: IMG.fortHope, locationId: L.fortHope, waterwayId: W.repulse, funFact: "Rae travelled Inuit-style, in small parties with snow houses, which is why he could winter where naval ships could not.", thinkQuestion: "Rae had testimony and relics but had not seen the site. Was that enough to publish?" },
      { title: "Victory Point, 1848 and 1859", description: "Here, on the northwest coast of King William Island, the expedition left its only written record: a printed Admiralty form with two messages, the second added in April 1848, recording the ships beset since September 1846, Franklin's death on 11 June 1847, and 105 men setting out under Crozier for the Back River. William Hobson of McClintock's expedition found it in a cairn in May 1859.", lat: 69.63, lng: -98.6, imageUrl: IMG.victoryPoint, locationId: L.victoryPoint, waterwayId: W.victoriaStrait, funFact: "The record's first message, from 1847, ends 'All well'. The second, written around its margins a year later, does not.", thinkQuestion: "What could a one-page record establish that five years of Inuit testimony had not, and what could it not?" },
      { title: "The Back River mouth: where the hunters pointed", description: "The hunters of 1854 said the men had died near the mouth of a great river to the south: the Back River, which flows into Chantrey Inlet. McClintock found a boat and skeletons at Erebus Bay on the way; Hall and Schwatka later found graves and relics along the island's south coast. The route the testimony described was the route the bodies lay on.", lat: 66.0, lng: -95.0, imageUrl: IMG.backRiverHero, locationId: null, waterwayId: W.backRiver, funFact: "George Back had descended this river in 1834, twenty years before it became the last hope of Franklin's men.", thinkQuestion: "If the testimony of 1854 placed the men correctly, why was it doubted?" },
      { title: "Queen Maud Gulf, 2014", description: "The Inuit accounts had always said that one ship sank in deep water to the north and the other drifted south, where hunters boarded it. Parks Canada's search from 2008 worked with Inuit historians, among them Louie Kamookak of Gjoa Haven, whose record of elders' accounts pointed here. On 7 September 2014 the wreck of HMS Erebus was found in shallow water in Queen Maud Gulf.", lat: 68.5, lng: -101.0, imageUrl: IMG.queenMaudHero, locationId: null, waterwayId: W.queenMaud, funFact: "The find was narrowed the same week by a Government of Nunavut helicopter crew that spotted an iron davit from the ship on an island.", thinkQuestion: "What changed between 1854 and 2014 in how Inuit knowledge was treated, and what had not changed about the knowledge itself?" },
      { title: "Terror Bay and Gjoa Haven, 2016", description: "In September 2016 the Arctic Research Foundation's ship went into Terror Bay on the word of Sammy Kogvik, a Gjoa Haven hunter and Canadian Ranger, who had seen a mast standing out of the ice there years before. HMS Terror lay on the bottom, almost intact. Gjoa Haven, the Netsilik community nearest both wrecks, holds the Nattilik Heritage Centre, where the story is told by the people who kept it.", lat: 68.63, lng: -95.88, imageUrl: IMG.nattilik, locationId: L.gjoaHaven, waterwayId: W.terrorBay, funFact: "The bay had been named Terror Bay by the searchers of 1910, long before anyone knew the ship was in it.", thinkQuestion: "Who should tell the Franklin story now, and where?" },
    ],
  },
  {
    id: "trip_prince_of_wales_fort_papers", title: "Prince of Wales Fort: The Paper of a Stone Fort, 1717-1782", gradeLevel: "10-12", estimatedMinutes: 30, theme: "fur_trade", coverImageUrl: IMG.pwfHero,
    description: "Six stops at the Hudson's Bay Company's stone fort on the Churchill, each tied to a document the app holds: a trade report, a scientific journal, a set of instructions, a surveyor's engagement and two accounts of a surrender.",
    stops: [
      { title: "The Star Fort", description: "Begun in 1731 and still unfinished forty years later, the fort's stone walls were meant to hold the Churchill against the French. They were built by a handful of men in a short season each year, and the Company's paper is full of complaints about the cost. The Cree and Dene who traded here saw the walls rise over four decades.", lat: 58.768, lng: -94.1653, imageUrl: IMG.pwfStop(PWF.starFort), locationId: L.princeOfWales, waterwayId: W.churchill, funFact: "The walls are up to twelve metres thick at the base; the fort never fired its cannon in anger.", thinkQuestion: "What does the forty-year building record say about what London valued?" },
      { title: "The Trade Report, 1768", description: "Moses Norton, chief factor from 1762, wrote the annual trade report to the London Committee from this post. The 1768 report is in the app's 10-12 documents. A report argues: it explains the year's returns, the competition from Montreal traders inland, and what the post needs. The app's Checking the Record tool could not verify the passage it once carried from it.", lat: 58.7681, lng: -94.1654, imageUrl: IMG.pwfStop(PWF.tradePost), locationId: L.princeOfWales, waterwayId: W.churchill, funFact: "Norton was born at the post; the Company's paper is also a family history.", thinkQuestion: "Who was Norton writing for, and what did he need them to believe?" },
      { title: "The Transit of Venus, 1769", description: "The Royal Society sent William Wales and Joseph Dymond here to observe the transit of Venus on 3 June 1769, one of a worldwide set of observations to measure the distance to the sun. They wintered at the fort and Wales's journal records the cold, the trade and the observation. Science travelled on the Company's ships and lived in the Company's buildings.", lat: 58.7683, lng: -94.1651, imageUrl: IMG.pwfStop(PWF.batteries), locationId: L.princeOfWales, waterwayId: W.churchill, funFact: "Wales later sailed with Cook as astronomer and taught navigation to a boy named Samuel Taylor Coleridge.", thinkQuestion: "How does a scientific journal differ from a trade report written in the same building?" },
      { title: "Norton's Instructions, December 1770", description: "From here, in December 1770, Norton sent Samuel Hearne north for the third time, with written instructions about the copper, the route and the report he was to bring back, and with the Chipewyan leader Matonabbee, without whom the first two attempts had failed. The instructions are in the app; the app's earlier version of them was a paraphrase, since corrected.", lat: 58.7679, lng: -94.1652, imageUrl: IMG.pwfStop(PWF.hearne), locationId: L.princeOfWales, waterwayId: W.churchill, funFact: "Hearne reached the Coppermine in July 1771 and was back at the fort in June 1772, after nearly nineteen months.", thinkQuestion: "What do the instructions reveal that Hearne's own narrative does not, and the reverse?" },
      { title: "The Surveyor's Engagement, 1778", description: "In 1778 the Committee engaged Philip Turnor as the Company's first trained surveyor, to map the rivers inland from York Factory and Churchill. His engagement letter is in the app's 10-12 documents; the app once carried the wrong date for it. Turnor's maps of the 1790s, and his pupils Fidler and Thompson, are the Company's answer to the Montreal traders' knowledge of the interior.", lat: 58.7682, lng: -94.1655, imageUrl: IMG.pwfStop(PWF.today), locationId: L.princeOfWales, waterwayId: W.churchill, funFact: "Turnor trained David Thompson in surveying at Cumberland House in 1789-90.", thinkQuestion: "Why did the Company need its own surveyor a century after its charter?" },
      { title: "The Surrender, August 1782", description: "On 8 August 1782 three French ships under La Pérouse appeared off the fort. Hearne, now chief, had thirty-nine men and surrendered without a shot. La Pérouse's account and Hearne's account of the same day are both in the app, written for two governments. Read together, they are a lesson in purpose and audience; read alone, each is a case for its writer.", lat: 58.7683, lng: -94.1651, imageUrl: IMG.pwfStop(PWF.surrender), locationId: L.princeOfWales, waterwayId: W.churchill, funFact: "La Pérouse returned Hearne's Coppermine journal to him on condition that he publish it. It appeared in 1795, three years after Hearne's death.", thinkQuestion: "Which account would you trust on the number of defenders, and why?" },
    ],
  },
];

// ───────────────────────────────────────────── Printables ─────────────────────────────────────────────
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const box = (label: string, lines = 3) => `<div style="margin:10px 0"><div style="font-weight:600;color:#1A3A24;margin-bottom:4px">${esc(label)}</div>${Array.from({ length: lines }, () => `<div style="border-bottom:1px solid #9CA3AF;height:26px"></div>`).join("")}</div>`;

const frameSheet = `<h2>Source Analysis Frame: Instructions, Journals and Reports</h2><p>Name: ______________________ &nbsp; Document: ________________________________</p>
<p>Use one sheet per document. Decide first what kind of paper it is, then answer each part from the document itself, not from what you already know about the event.</p>
<table style="border-collapse:collapse;width:100%;margin:10px 0"><tr><th style="width:33%">Instruction</th><th style="width:33%">Journal</th><th>Report</th></tr><tr><td>Goes outward. Tells a reader what to do. Evidence of intentions.</td><td>Kept daily. Records events in order, as the writer chose to record them. Evidence of what the writer saw and wanted seen.</td><td>Goes homeward. Explains and argues. Evidence of the writer's case.</td></tr></table>
<p><b>This document is a(n):</b> &nbsp; ☐ instruction &nbsp; ☐ journal &nbsp; ☐ report &nbsp; ☐ other: ____________</p>
${box("1. Origin: who wrote it, when, where, and in what office or position?", 3)}
${box("2. Purpose: what is the reader meant to do or believe after reading it?", 3)}
${box("3. Audience: who was it written for, and how does that show in the wording?", 3)}
${box("4. Silences: who and what is missing? (Indigenous partners and guides, women, rivals, failures, costs)", 4)}
${box("5. Corroboration: what other document, or whose oral account, speaks to the same event? Does it agree?", 3)}
${box("6. Verification: has the passage you are using been checked against the published edition? (Checking the Record result, if the app holds one)", 2)}
<h3>One sentence</h3><p>This document is good evidence for ____________________________ and poor evidence for ____________________________ because ____________________________________________.</p>`;

const evidenceRows: [string, string, string, string][] = [
  ["1850", "Beechey Island graves and winter camp (Penny, Austin, De Haven)", "Physical", "The 1845-46 wintering; three deaths; no record of the route ahead"],
  ["1854", "Inuit hunters' account near Pelly Bay, through William Ouligbuck; relics bought by Rae", "Oral, through an interpreter; physical", "About forty men dragging a boat south on King William Island; deaths near the Back River mouth; cannibalism"],
  ["1854", "Rae's report to the Admiralty and the press", "Written, second-hand", "The account above, in Rae's words"],
  ["1854", "Dickens, 'The Lost Arctic Voyagers'", "Written opinion", "That Inuit testimony should not be believed against British character"],
  ["1859", "The Victory Point record (Hobson, McClintock's expedition)", "Written, first-hand, 1847-48", "Beset September 1846; Franklin died 11 June 1847; ships deserted 22 April 1848; 105 men for the Back River"],
  ["1859", "The boat and two skeletons at Erebus Bay", "Physical", "The march south, as the hunters said"],
  ["1864-69", "Inuit testimony gathered by Hall with Tookoolito and Ebierbing, including In-nook-poo-zhe-jook", "Oral, through interpreters", "Corroboration and detail of the deaths and the ships"],
  ["1878-80", "Schwatka's search with Ebierbing", "Physical", "Graves and relics on King William Island"],
  ["1980s-90s", "Forensic study of bones from the island", "Scientific", "Cut marks consistent with the 1854 account"],
  ["2014", "HMS Erebus found in Queen Maud Gulf; Inuit oral history recorded by Louie Kamookak; davit found by a Nunavut helicopter crew", "Physical; oral", "One ship where the accounts had placed it"],
  ["2016", "HMS Terror found in Terror Bay on Sammy Kogvik's account of a mast in the ice", "Physical; oral", "The second ship, intact"],
];
const evidenceSheet = `<h2>Franklin Search Evidence Table</h2><p>Name: ______________________</p>
<p>Eleven pieces of evidence, 1850 to 2016. For each, mark its kind, whether it passed through an interpreter, and how it was received at the time. Then answer the questions.</p>
<table style="border-collapse:collapse;width:100%;font-size:13px"><tr><th style="width:8%">Year</th><th style="width:34%">Evidence</th><th style="width:16%">Kind</th><th>What it claims or establishes</th><th style="width:11%">Interpreter?</th><th style="width:11%">Believed then?</th></tr>${evidenceRows.map(([y, e, k, w]) => `<tr><td>${y}</td><td>${esc(e)}</td><td>${esc(k)}</td><td>${esc(w)}</td><td style="text-align:center">☐ yes ☐ no</td><td style="text-align:center">☐ yes ☐ no</td></tr>`).join("")}</table>
<h3>Questions</h3><ol><li>Which pieces of evidence depend on Inuit witnesses? Mark them. Which were accepted at the time, and which were not?</li><li>What did the Victory Point record establish that the 1854 testimony had not? What did the testimony establish that the record could not?</li><li>Write the rule of evidence that London applied in 1854 in one sentence. Then write the rule it should have applied.</li><li>In 2014 and 2016 the ships were found where the oral accounts had placed them. List what had changed in how the knowledge was treated, and what had not changed about the knowledge.</li></ol>`;

export const printables: PackPrintable[] = [
  {
    id: "printable_1012_source_analysis_frame", title: "Source Analysis Frame: Instructions, Journals and Reports", resourceType: "worksheet", gradeLevel: "10-12", topic: "primary_sources",
    description: "A one-page frame for reading a Company document: genre, origin, purpose, audience, silences, corroboration and verification, with a closing sentence on what the document is and is not evidence for.",
    content: frameSheet,
    teacherNotes: "Companion to Reading the Company's Paper. Use one sheet per document; the six documents named in the lesson are all in the app's 10-12 band. Part 6 points students at the Checking the Record tool, where three of the six have pairs. The closing sentence is the assessment: it forces a claim about evidentiary value rather than a summary.",
    answerKey: JSON.stringify({ genres: { "Norton's Instructions to Samuel Hearne, December 1770": "instruction", "Norton's Trade Report to the London Committee, 1768": "report", "The Hudson's Bay Company's Engagement of Philip Turnor as Surveyor, 1778": "instruction (a letter of engagement)", "Isham's Observations on Hudsons Bay, 1743": "journal", "Wales's Journal of a Voyage to Churchill River, 1768-1769": "journal", "La Pérouse's Account of the Attack on Prince of Wales Fort, August 1782": "journal / report to his government" }, checkingTheRecord: { "Norton 1770": "paraphrase", "Norton 1768": "unverifiable", "Turnor 1778": "date or author", "La Pérouse 1782": "unverifiable" } }),
  },
  {
    id: "printable_1012_franklin_evidence_table", title: "Franklin Search Evidence Table", resourceType: "activity_sheet", gradeLevel: "10-12", topic: "explorers",
    description: "Eleven pieces of evidence on the Franklin expedition's fate, 1850 to 2016, to classify by kind, by transmission through an interpreter, and by how they were received, with four questions.",
    content: evidenceSheet,
    teacherNotes: "Companion to Whose Testimony Counts? The rows are in chronological order; the point is the two right-hand columns. Expected marks: interpreter for the 1854 account, Hall's testimony and, in a different sense, the 2014 and 2016 oral accounts recorded in Inuktitut; believed then: no for 1854 and partly for Hall, yes for 1859 and after. Question 3 should produce something like 'testimony from Inuit witnesses is not evidence against British officers' and 'testimony is weighed by its content and corroboration, not by who gives it'.",
    answerKey: JSON.stringify({ interpreter: ["1854 Inuit account (William Ouligbuck)", "1864-69 Hall (Tookoolito, Ebierbing)", "2014 and 2016 oral accounts (recorded in Inuktitut)"], believedThen: { "1854 account": "no", "1859 record": "yes", "Hall": "partly", "2014/2016": "yes" }, q2: "The record fixed dates and the command decision; the testimony placed the men's deaths and the ships, which the record could not.", q3: "Applied: Inuit witnesses cannot be believed against British officers. Should have applied: weigh testimony by content and corroboration, not by the witness's origin." }),
  },
];

// ───────────────────────────────────────────── Comparisons ─────────────────────────────────────────────
export const comparisons: PackComparison[] = [
  {
    id: "cmp_1012_three_kinds_of_company_paper", title: "Three Kinds of Company Paper: Instruction, Journal, Report", comparisonType: "documents", gradeLevel: "10-12",
    description: "The Hudson's Bay Company's three working genres side by side, each illustrated by a document the app holds from Prince of Wales Fort.",
    items: [
      { name: "Instruction (Norton to Hearne, December 1770)", direction: "Outward: from superior to subordinate", writtenWhen: "Before the event", evidenceOf: "Intentions, priorities, fears", typicalSilence: "Whether it was obeyed; the guides on whom it depended", howToCheck: "Against the journal of the journey and the report that followed" },
      { name: "Journal (Wales at Churchill, 1768-69; Isham, 1743)", direction: "Kept daily, to be read by the Committee", writtenWhen: "During the event", evidenceOf: "What happened as the writer chose to record it", typicalSilence: "What the writer thought unimportant or unwise to record", howToCheck: "Against other journals of the same post or season; against Indigenous accounts" },
      { name: "Report (Norton to the London Committee, 1768)", direction: "Homeward: from post to head office", writtenWhen: "After the event, yearly", evidenceOf: "The writer's case: returns, rivals, needs", typicalSilence: "Anything that weakens the case; the writer's own failures", howToCheck: "Against the post journal and the account books" },
    ],
    criteria: [
      { criterion: "Direction", description: "Who writes to whom?" },
      { criterion: "Written when", description: "Before, during or after the event it concerns?" },
      { criterion: "Evidence of", description: "What can a historian safely take from it?" },
      { criterion: "Typical silence", description: "What does this genre usually leave out?" },
      { criterion: "How to check", description: "What other paper or testimony corroborates it?" },
    ],
    analysisPrompts: ["Which genre is closest to an eyewitness, and why is that not the same as being reliable?", "Why are the Cree and Chipewyan partners of the trade thinly present in all three genres, and where does their account survive?", "Take one event, Hearne's departure in December 1770, and say what each genre would record about it."],
  },
  {
    id: "cmp_1012_rae_and_mcclintock", title: "Rae 1854 and McClintock 1859: Two Ways of Finding Out", comparisonType: "explorers", gradeLevel: "10-12",
    description: "Two searchers who established the fate of the Franklin expedition by different methods: one listened and reported, the other went and dug. What each could prove, and how each was received.",
    items: [
      { name: "Dr. John Rae, 1854", method: "Overland survey in small parties; questioned Inuit hunters through William Ouligbuck; bought the relics", evidence: "Oral testimony through an interpreter; relics with Franklin's crest", established: "The men's route south, their deaths near the Back River, and cannibalism", couldNotEstablish: "Dates, the command decision, the written record", reception: "Attacked in the press and by Dickens; paid the reward in 1856; left off the monuments", whoMadeItPossible: "William Ouligbuck and the Netsilik witnesses, among them In-nook-poo-zhe-jook" },
      { name: "Sir Francis Leopold McClintock, 1857-59", method: "Private expedition in the yacht Fox, funded by Lady Franklin; sledge parties to King William Island", evidence: "The Victory Point record; the boat and skeletons at Erebus Bay; relics; Inuit testimony gathered on the way", established: "Besetment September 1846, Franklin's death June 1847, abandonment April 1848, 105 men for the Back River", couldNotEstablish: "Where the ships came to rest", reception: "Knighted; the record and relics displayed in London", whoMadeItPossible: "Lieutenant William Hobson, who found the record; Inuit informants on Boothia and King William Island" },
    ],
    criteria: [
      { criterion: "Method", description: "How did he search?" },
      { criterion: "Evidence", description: "What kind of evidence did he bring back?" },
      { criterion: "Established", description: "What did it prove?" },
      { criterion: "Could not establish", description: "What was beyond it?" },
      { criterion: "Reception", description: "How was it received in Britain?" },
      { criterion: "Who made it possible", description: "Whose knowledge and labour underlie the result?" },
    ],
    analysisPrompts: ["Rae's findings were correct and McClintock's confirmed them. Why was Rae attacked and McClintock knighted?", "Which method would have found the ships, and why did neither?", "What do the two cases say about the weight given to written evidence over testimony?"],
  },
];
