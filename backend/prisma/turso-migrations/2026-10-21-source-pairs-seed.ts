// Roadmap item 10 (2026-10-21): the primary-source literacy unit. Seeds SourcePair rows for the 44
// seed documents whose quoted passages were stripped on 2026-10-18 (pass 11) and then either
// restored from a published edition (passes 13 and 15, 27 documents) or kept as pointers (17).
// The seed side is read from the pass 11 backup; the published side is the document's live
// transcription and its edition citation, so nothing is copied twice. Also writes three lesson
// plans (one per band from 4-6 up), one printable, and the lessons' curriculum-outcome mappings.
//   bun run prisma/turso-migrations/2026-10-21-source-pairs-seed.ts [--apply]
// Re-runnable: rows are upserted by id. Aborts before writing if a document or outcome id is missing.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

type Kind = "not_in_source" | "partly_in_source" | "paraphrase" | "number_changed" | "date_or_author" | "abbreviation" | "confirmed" | "unverifiable" | "no_such_document";
interface Pair { id: string; documentId: string; kind: Kind; gradeLevel: "4-6" | "7-9" | "10-12"; whatChanged: string }

const TASKS: Record<Kind, string> = {
  not_in_source: "Read both columns. Find three details in the first version that are not in the published text. Then write one sentence saying what a reader who only had the first version would have believed that the book does not say.",
  partly_in_source: "Read both columns and underline every sentence of the first version that also appears, in substance, in the published text. What is left over? Say whether the leftover changes the meaning of the passage.",
  paraphrase: "The first version is a modern summary; the second is what the writer put down. List three things the writer's own words tell you that the summary does not: a tone, a detail, a doubt, a name.",
  number_changed: "Find the number that differs between the two columns. Open the edition at the page cited and confirm which is printed there. Then say what difference the wrong number makes to the story.",
  date_or_author: "The first version named the wrong person, the wrong year, or both. Using the edition cited, find the line that fixes it. Explain how a reader could have caught the error without the book, from the dates alone.",
  abbreviation: "Compare the short form with the full sentence. What is lost in the short form? Who made the short form, and why might a monument and a book say the same thing differently?",
  confirmed: "This one held up. Compare the two columns word by word and list every difference you can find, however small (brackets, spelling, a word order). Then say which differences matter for meaning and which do not.",
  unverifiable: "No published edition of this text could be found, so the passage cannot be checked and the app keeps only a pointer to where the document is held. Write down what you would need to find in order to check it, and where you would look.",
  no_such_document: "No record of this kind exists for this person or place. Read the passage and list the clues that it was written in our time rather than theirs. Then say what a real document from that year and place would look like.",
};

// The 44 documents, in the order of the pass 11 backup: kind and what changed, from the notes
// written when each was checked (passes 13 and 15) and from the pass 15 header on the 17 pointers.
const PAIRS: Pair[] = [
  { id: "sp_thompson_columbia_1811", documentId: "cmlirhtn9000lm2hc4c00mjfi", kind: "not_in_source", gradeLevel: "7-9",
    whatChanged: "The first version was a field-note entry dated 22 June 1811 with a rapid, a portage and a distance. The published Narrative has no such entry; the descent below the Sanpoil village is in the entries of 4 and 5 July 1811, and those replaced it. The title and date were corrected to the published entries." },
  { id: "sp_hearne_coppermine_1771", documentId: "cmlirhtnb000mm2hcbvv1aoop", kind: "not_in_source", gradeLevel: "4-6",
    whatChanged: "The first version gave the river as thirty yards wide and the mine as yielding several pieces of ore. Neither sentence is in the published Journey. Hearne's own entries for July 1771 say one hundred and eighty yards, three falls in sight, the mine an entire jumble of rocks and gravel, and one piece of copper above four pounds." },
  { id: "sp_york_factory_record_1780", documentId: "cmlirhtoq000nm2hcschn05zl", kind: "no_such_document", gradeLevel: "4-6",
    whatChanged: "No York Factory trade record of this form exists. The figures and the layout were invented for the seed data. The real post journals and account books are in the Hudson's Bay Company Archives in Winnipeg and read nothing like this." },
  { id: "sp_matonabbee_letter_1772", documentId: "cmlirhtos000om2hccuc6ejmy", kind: "no_such_document", gradeLevel: "7-9",
    whatChanged: "Matonabbee wrote no letters; what is known of his words comes through Hearne. A letter from him to Hearne is an invention of the seed data. The document stays as a pointer to Hearne's Journey, where Matonabbee speaks." },
  { id: "sp_mackenzie_fort_fork_1793", documentId: "cmlirhtp0000pm2hcakifpeuc", kind: "not_in_source", gradeLevel: "7-9",
    whatChanged: "The first version had Mackenzie making a speech to the assembled men asking for volunteers. No such speech is in the Voyages. The published close of the Fort Fork chapter and the departure of 9 May 1793, in Mackenzie's own account, replaced it." },
  { id: "sp_mackenzie_rock_1793", documentId: "cmlitwdb60000m2hgkv817kql", kind: "abbreviation", gradeLevel: "4-6",
    whatChanged: "The first version quoted the inscription as it is cut on the monument at Mackenzie Rock: Alex Mackenzie from Canada by land 22d July 1793. That short form is modern. The Voyages give the sentence Mackenzie says he wrote on the rock, in full, with the date spelled out." },
  { id: "sp_mackenzie_crossing_1793", documentId: "cmlitwdbf0001m2hggx0xvb0f", kind: "not_in_source", gradeLevel: "7-9",
    whatChanged: "The first version spoke of a route absolutely impracticable, two bags apiece, and a mood that approached mutiny. None of it is in the Voyages. The entry of 13 June 1793, the wreck of the canoe west of the height of land as Mackenzie told it, replaced it." },
  { id: "sp_saukamappee_1787", documentId: "cmlitwdbj0002m2hgai1yy1dj", kind: "date_or_author", gradeLevel: "7-9",
    whatChanged: "The first version attributed Saukamappee's account to Peter Fidler in the winter of 1792-93. It was told to David Thompson, who wintered in the old man's tent in 1787-88, and is printed in Thompson's Narrative. Title, author, date and explorer link were all corrected, and the wording replaced with the published chapter." },
  { id: "sp_knight_thanadelthur_1717", documentId: "cmlitwdbn0003m2hg64xdxb13", kind: "partly_in_source", gradeLevel: "7-9",
    whatChanged: "The first version was a paragraph dated 1715. Only one sentence of Knight's survives in print, quoted from his York Fort journal in the Dictionary of Canadian Biography, and it was written at Thanadelthur's death on 5 February 1717. The paragraph was reduced to the sentence and the year corrected from 1715 to 1717." },
  { id: "sp_thompson_charlotte_small", documentId: "cmlitwdbs0004m2hgkjbonqnc", kind: "unverifiable", gradeLevel: "7-9",
    whatChanged: "The passages the first version attributed to Thompson about Charlotte Small could not be found in the published Narrative or in the printed journals that could be reached. The document stays as a pointer until a published text is found." },
  { id: "sp_hearne_matonabbee_1770", documentId: "cmlitwdbv0005m2hgtzwozycr", kind: "partly_in_source", gradeLevel: "7-9",
    whatChanged: "Hearne's report of Matonabbee's words, in the entry for October 1770, is in the Journey and was kept. The first version's sentences about seven wives and proper supplies of women were not in that passage and were dropped. Hearne does record, in January 1772, that Matonabbee then had seven wives." },
  { id: "sp_fraser_canyon_1808", documentId: "cmlitwdbx0006m2hgn5412c1p", kind: "partly_in_source", gradeLevel: "7-9",
    whatChanged: "The passage above Spuzzum at the end of June 1808 is in Fraser's journal as Masson printed it in 1889 and was kept. The first version's closing sentences, in which the party was obliged to slide down, are not in that entry and were dropped." },
  { id: "sp_rae_franklin_1854", documentId: "cmlitwdbz0007m2hgq08l4s9b", kind: "paraphrase", gradeLevel: "7-9",
    whatChanged: "The first version was a summary in modern words of what Rae reported. Rae's letter to the Admiralty from Repulse Bay, 29 July 1854, was printed the same year and replaced the summary with his own sentences." },
  { id: "sp_champlain_quebec_1608", documentId: "cmlmsw8t10000m22sjvnsk785", kind: "partly_in_source", gradeLevel: "4-6",
    whatChanged: "The arrival at Quebec and the building of the habitation are in the Voyages of 1613 and were kept in Biggar's translation. The first version's sentences about a dove-cote and gardens are not in those chapters and were dropped." },
  { id: "sp_champlain_place_royale_1611", documentId: "cmlmsw8t70001m22svngult6w", kind: "date_or_author", gradeLevel: "4-6",
    whatChanged: "The first version called the site of Montreal Hochelaga. Champlain named it Place Royale in 1611 and does not use the older name; the title was corrected. His sentences about bark maps and routes in the first version are not in this passage and were dropped. The English and the 1613 French were both put in." },
  { id: "sp_champlain_memorial_1618", documentId: "cmlmsw8tb0002m22sghuc01i2", kind: "partly_in_source", gradeLevel: "7-9",
    whatChanged: "The memorial to the King among the papers of 1618 is in Biggar's edition and was kept, with its French. The first version opened with the art of navigation holding the first rank; that sentence is from the 1632 Traitté de la marine, not the memorial, and was dropped." },
  { id: "sp_cartier_gaspe_1534", documentId: "cmlmsw8te0003m22soy6y49ik", kind: "confirmed", gradeLevel: "7-9",
    whatChanged: "The passage for 24 July 1534 stood up to the check against Biggar's 1924 edition. The published text was put in with Biggar's square brackets and the French printed opposite. One change: the narrative does not name the chief in this passage, so the name the first version supplied is gone; he is Donnacona, named later in the account." },
  { id: "sp_cartier_hochelaga_1535", documentId: "cmlmsw8th0004m22s88763sxz", kind: "partly_in_source", gradeLevel: "7-9",
    whatChanged: "The arrival at Hochelaga on 2 October 1535 and the description of the village are in Biggar's edition and were kept. The first version's sentence about sleeping platforms and hanging fish is not in those passages and was dropped." },
  { id: "sp_cartier_scurvy_1536", documentId: "cmlmsw8tj0005m22s12za2dkq", kind: "confirmed", gradeLevel: "4-6",
    whatChanged: "The account of the sickness of the winter of 1535-36 and of the tree Annedda held up against Biggar's edition. The published text carries the French of the Louvain sentence, and the bracketed year is Biggar's, not the first version's." },
  { id: "sp_la_salle_louisiana_1682", documentId: "cmlmsw8ts0006m22sv0gxap7o", kind: "confirmed", gradeLevel: "10-12",
    whatChanged: "The act of possession of 9 April 1682 is a notarial record, and the first version followed the 1846 translation closely. The published text is that translation in full, as printed in French's Historical Collections of Louisiana." },
  { id: "sp_la_salle_frontenac_1681", documentId: "cmlmsw8tw0007m22s7tg7og5z", kind: "no_such_document", gradeLevel: "7-9",
    whatChanged: "No letter from La Salle to Frontenac of this content and date could be found in the printed collections of his letters. The document stays as a pointer to the collections where his real letters are." },
  { id: "sp_joutel_1687", documentId: "cmlmsw8u10008m22su0raiwnt", kind: "paraphrase", gradeLevel: "4-6",
    whatChanged: "The first version summarized the murder of La Salle in modern words. Joutel's own account in the 1714 English translation, as reprinted in 1906, replaced it." },
  { id: "sp_tyrrell_barren_lands_1893", documentId: "cmlmsw8u50009m22so1t62x1f", kind: "not_in_source", gradeLevel: "7-9",
    whatChanged: "The first version was a journal entry dated 12 July 1893. The Geological Survey report of 1897 prints no such entry; its summary of proceedings and the journal extract for 30 July 1893 at Carey Lake, among the caribou, replaced it." },
  { id: "sp_tyrrell_bone_beds_1884", documentId: "cmlmsw8u9000am22s3rtl5v02", kind: "date_or_author", gradeLevel: "10-12",
    whatChanged: "The first version was a first-person story of finding the skull in September 1884. The published report of 1887 does not describe the skull at all; its account of the Red Deer River valley and the Edmonton series replaced the story, and the title and date now name the report." },
  { id: "sp_tyrrell_klondike_1898", documentId: "cmlmsw8ud000bm22sgvfqzwj6", kind: "unverifiable", gradeLevel: "7-9",
    whatChanged: "No published text of a letter from Tyrrell on the Klondike survey could be reached. The document stays as a pointer." },
  { id: "sp_back_great_fish_1834", documentId: "cmlmsw8uh000cm22swygl2mem", kind: "not_in_source", gradeLevel: "10-12",
    whatChanged: "The first version was an entry of 28 July with the name Thleweechodezeth and a savage grandeur. The Narrative of 1836 has no such entry; Back's own summary of the river, written at its mouth in July 1834, replaced it." },
  { id: "sp_back_fort_reliance_1834", documentId: "cmlmsw8ul000dm22s7mbs616g", kind: "number_changed", gradeLevel: "10-12",
    whatChanged: "The first version had the cold at sixty degrees below zero and spirits frozen. Back records seventy degrees below zero, and the frozen spirits are not in the text. The winter chapter at Fort Reliance before the experiments on the cold replaced the passage." },
  { id: "sp_back_admiralty_1836", documentId: "cmlmsw8us000em22s5zxt7zms", kind: "unverifiable", gradeLevel: "10-12",
    whatChanged: "No published text of a letter from Back to the Admiralty on Franklin relief in 1836 could be reached. The document stays as a pointer." },
  { id: "sp_fidler_athabasca_1791", documentId: "cmlmt06ou0001m2i2o7ofldng", kind: "partly_in_source", gradeLevel: "7-9",
    whatChanged: "Fidler's journal of the Turnor expedition is unpublished. The Dictionary of Canadian Biography prints one sentence from it, and that sentence is what the document now carries. The first version's entry of 15 December with the Shining Mountains cannot be checked and was dropped." },
  { id: "sp_fidler_peigan_1792", documentId: "cmlmt06ox0002m2i2rpgvqlzl", kind: "unverifiable", gradeLevel: "4-6",
    whatChanged: "Fidler's journal of his winter with the Peigan is in the Hudson's Bay Company Archives and has not been published in a text that could be reached. The passage cannot be checked; the document stays as a pointer." },
  { id: "sp_fidler_red_river_1814", documentId: "cmlmt06p00003m2i26pavif2l", kind: "unverifiable", gradeLevel: "7-9",
    whatChanged: "Fidler's Red River survey report of 1814 is unpublished. The passage cannot be checked; the document stays as a pointer." },
  { id: "sp_turnor_engagement_1778", documentId: "cmlmt06p20004m2i2j8xlcbn3", kind: "date_or_author", gradeLevel: "10-12",
    whatChanged: "The first version was a letter from Turnor to the Company proposing a school of practical surveying. The record runs the other way: the Company's engagement of Turnor as surveyor in 1778, quoted in the Dictionary of Canadian Biography from the Company's records. The proposed school is not in the record. Title and author were corrected." },
  { id: "sp_turnor_athabasca_1790", documentId: "cmlmt06p40005m2i2lfcvqccf", kind: "not_in_source", gradeLevel: "7-9",
    whatChanged: "The first version was an entry of 28 June with 47 stations and 1,000 miles. It is not in the published record. The phrases from Turnor's journal of 1790-92 that the Dictionary of Canadian Biography prints replaced it." },
  { id: "sp_turnor_churchill_1792", documentId: "cmlmt06p70006m2i2fz52qscl", kind: "unverifiable", gradeLevel: "7-9",
    whatChanged: "Turnor's report on the Churchill River system could not be reached in a published text. The passage cannot be checked; the document stays as a pointer." },
  { id: "sp_norton_journal_1762", documentId: "cmlmt06p90007m2i2zhi1glpb", kind: "unverifiable", gradeLevel: "7-9",
    whatChanged: "Norton's post journal of 1762 is unpublished. The passage cannot be checked; the document stays as a pointer." },
  { id: "sp_norton_orders_1770", documentId: "cmlmt06pd0008m2i2f1d9y9fl", kind: "paraphrase", gradeLevel: "10-12",
    whatChanged: "The first version summarized Norton's orders to Hearne. Hearne prints the orders for the third journey, dated 7 December 1770, in full in his Journey, and the whole document replaced the summary." },
  { id: "sp_norton_trade_report_1768", documentId: "cmlmt06pi0009m2i2eezgwgfy", kind: "unverifiable", gradeLevel: "10-12",
    whatChanged: "Norton's report to the London Committee of 1768 is unpublished. The passage cannot be checked; the document stays as a pointer." },
  { id: "sp_stuart_note_1715", documentId: "cmlmt06pm000am2i2in6jeh1d", kind: "date_or_author", gradeLevel: "7-9",
    whatChanged: "The first version was a journal entry of September 1715. Stuart does not seem to have kept a journal. What survives is his note of October 1715, carried to York Fort in April 1716 and copied into Knight's journal, which the Dictionary of Canadian Biography prints. The title was corrected to the note." },
  { id: "sp_stuart_peace_mission_1716", documentId: "cmlmt06pq000bm2i2p7824a33", kind: "unverifiable", gradeLevel: "10-12",
    whatChanged: "No report by Stuart on the peace mission exists in print; the mission is known from Knight's journal. The passage cannot be checked; the document stays as a pointer." },
  { id: "sp_stuart_trade_customs", documentId: "cmlmt06pt000cm2i26a6xzaa5", kind: "unverifiable", gradeLevel: "7-9",
    whatChanged: "No account by Stuart of trade customs exists in print. The passage cannot be checked; the document stays as a pointer." },
  { id: "sp_la_perouse_attack_1782", documentId: "cmlmt5k2d0000m2wsuy7232zo", kind: "unverifiable", gradeLevel: "10-12",
    whatChanged: "La Pérouse's campaign report of 1782 could not be reached in a published text. The passage cannot be checked; the document stays as a pointer." },
  { id: "sp_la_perouse_york_1782", documentId: "cmlmt5k2l0001m2ws0zlgxctn", kind: "unverifiable", gradeLevel: "7-9",
    whatChanged: "La Pérouse's report on York Factory could not be reached in a published text. The passage cannot be checked; the document stays as a pointer." },
  { id: "sp_la_perouse_minister_1782", documentId: "cmlmt5k2o0002m2ws76aa3o2r", kind: "unverifiable", gradeLevel: "7-9",
    whatChanged: "La Pérouse's letter to the Minister of Marine on the Hudson Bay campaign could not be reached in a published text. The passage cannot be checked; the document stays as a pointer." },
  { id: "sp_hearne_capture_1782", documentId: "cmlmt5k2q0003m2wso7eebveq", kind: "unverifiable", gradeLevel: "7-9",
    whatChanged: "Hearne's own account of the surrender of Prince of Wales Fort is not in the Journey, and no other published text of it could be reached. The passage cannot be checked; the document stays as a pointer." },
];

// ---- Lesson plans, one per band ----
const LESSON_BASE = {
  topic: "Primary Sources",
  isPublished: true, isCore: false, visibility: "private",
  heroImageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Samuel%20Hearne%20-%20A%20Journey%20from%20Prince%20of%20Wales%27s%20Fort%20in%20Hudson%27s%20Bay%20to%20the%20Northern%20Ocean%20-%20title%20page.jpg?width=1280",
};
const LESSONS = [
  {
    id: "lesson_checking_the_record_4_6", gradeLevel: "4-6", estimatedMinutes: 60, readingTimeMinutes: 6,
    title: "Is It Really What They Wrote? Checking a Quotation",
    description: "A quotation can look right and still not be in the book. Students put a passage that was never checked beside the sentences as the explorer published them, find what is different, and learn the one habit that separates a real quotation from a plausible one: open the edition.",
    objectives: ["Explain what a primary source is and what an edition of one is", "Compare two versions of a passage and find the differences", "Say why a number or a name that is not in the book matters", "Check one sentence against the page it is cited from"],
    materials: ["The app's Checking the Record screen (Learn tab), pairs for grades 4-6", "The printable Checking the Record, six pairs", "A device or screen that can open the Internet Archive page cited on a pair"],
    mainContent: "## Teaching context\n\nThe app itself provides the material. When it was built, 44 of its documents carried quoted passages that read well and had never been checked against a published edition. When they were checked, some turned out to be paraphrase, some had numbers that are not in the book, some were real sentences put under the wrong year or the wrong name, and a few were not in the source at all. The seed passages were kept, and each now sits beside the sentences as published, with the edition named and the page linked.\n\nFor this band, use the pairs marked 4-6: Hearne at the Coppermine (thirty yards became one hundred and eighty), Mackenzie's rock (the monument's short form beside the full sentence), Champlain at Quebec (a dove-cote that is not in the chapter), Cartier's scurvy winter (one that held up), Joutel (a summary beside the writer's words), and Fidler with the Peigan (a journal nobody can check because it was never printed).\n\n## Sequence\n\n1. Read the Hearne pair aloud, both columns. Ask what is different. Students will find the numbers first; let them.\n2. Open the edition at the page cited and find the sentence. Read it from the page.\n3. Hand out the printable. In pairs, students work through the remaining five, sorting each into the kinds on the sheet.\n4. Close with Fidler: a passage that cannot be checked at all. Ask what the app did with it and why.\n\n## Vocabulary\n\nprimary source, edition, quotation, paraphrase, cited, archive.",
    activities: [
      { title: "Spot the difference", duration: "15 min", description: "Both columns of the Hearne pair on the board. Students call out differences; the teacher sorts them into numbers, missing sentences and added sentences.", materials: ["Checking the Record screen"] },
      { title: "Open the book", duration: "15 min", description: "Follow the link on the pair to the edition and find the sentence on the page. Students read it aloud from the scan, long s and all.", materials: ["Internet Archive page cited on the pair"] },
      { title: "Six pairs on paper", duration: "20 min", description: "The printable: six pairs, two columns each, a box to name the kind of difference and one line to say why it matters.", materials: ["Printable: Checking the Record, six pairs"] },
      { title: "The one nobody can check", duration: "10 min", description: "Fidler with the Peigan. The journal is in an archive and was never printed. What should the app do with a passage it cannot check? What did it do?", materials: [] },
    ],
    discussionQuestions: ["If a quotation sounds right, how would you know whether it is really in the book?", "Hearne's river became six times wider when it was checked. Does the wrong number change the story?", "Why does a monument shorten a sentence, and why does a book not?", "What should happen to a passage that nobody can check?"],
    assessment: "Students sort the six printable pairs into the right kinds (at least five of six) and write one sentence for one pair saying what the first version would have made a reader believe that the book does not say.",
    extensions: "Choose any other document in the app that carries a checked transcription and find its sentence on the edition's page.",
    teacherObjectives: ["Students treat an edition page as the thing to check against, not a summary of it", "Students can name the kinds of difference: not in the source, partly in it, paraphrase, wrong number, wrong name or date, short form, confirmed, unverifiable"],
    teacherActivities: [{ title: "Reading from the scan", duration: "10 min", description: "Show the long s and the old spellings on the cited page and let students read a sentence as printed; the point is that the page is the source and the app's text is a transcription of it.", materials: [] }],
    teacherQuestions: ["Which pair surprised the class most, and why?", "Which kind of difference is hardest to spot without the book?"],
    teacherNotes: "Every pair shows the first version as what it was: unverified text that read well. The lesson is about the checking, never about the explorer; keep the discussion on method. The first version is never to be quoted as the explorer's words.",
  },
  {
    id: "lesson_checking_the_record_7_9", gradeLevel: "7-9", estimatedMinutes: 75, readingTimeMinutes: 8,
    title: "Checking the Record: How a Sentence Gets from 1771 to a Screen",
    description: "Students work through pairs of passages, the version the app first carried and the sentences as published, classify each difference, find the sentence on the edition's page, and transcribe one themselves. The habit taught is the one historians use: a quotation is only as good as the edition it is checked against.",
    objectives: ["Distinguish a quotation from a paraphrase and from an invention", "Classify the difference between two versions of a passage", "Locate a cited sentence on a digitized edition and transcribe it exactly", "Explain why attribution (who, when) is part of a source's reliability"],
    materials: ["The app's Checking the Record screen (Learn tab), pairs for grades 7-9", "The printable Checking the Record, six pairs", "Devices that can open the Internet Archive pages cited on the pairs"],
    mainContent: "## Teaching context\n\nThe app's own documents went through a check in October 2026: 44 quoted passages from the original seed data, none of them checked, were put against published editions. Twenty-seven were replaced by the sentences as printed; seventeen could not be checked because no published text exists or could be reached, and stay as pointers. Each pair on the Checking the Record screen shows the first version, the published text, the edition and page, and what changed.\n\nFor this band the richest pairs are Saukamappee's account (attributed to the wrong man in the wrong decade), Knight on Thanadelthur (a paragraph that was really one sentence, two years later), Mackenzie's crossing (a mutiny that is not in the book), Hearne on Matonabbee (real words with invented sentences attached), Cartier at Gaspé (confirmed, but the chief's name supplied where the narrative gives none), and the Matonabbee letter (a document of a kind that does not exist).\n\n## Sequence\n\n1. Saukamappee first: the metadata, not the words, was wrong. Show how the dates alone would have caught it.\n2. Students classify six pairs on the printable, then compare classifications in groups.\n3. Transcription: each student opens the page cited on one pair and transcribes one sentence exactly as printed.\n4. The seventeen pointers: what the app does with a passage nobody can check, and why that is the right answer.\n\n## Vocabulary\n\nedition, transcription, attribution, provenance, paraphrase, archive, unverifiable.",
    activities: [
      { title: "Wrong man, wrong decade", duration: "15 min", description: "The Saukamappee pair. Students work out from the dates in the published chapter why Fidler in 1792 could not be the listener, before being told.", materials: ["Checking the Record screen"] },
      { title: "Classify six", duration: "20 min", description: "The printable's six pairs: name the kind of difference, give one piece of evidence from the published column for each.", materials: ["Printable: Checking the Record, six pairs"] },
      { title: "Transcribe one sentence", duration: "20 min", description: "Open the edition page cited on a pair and copy one sentence exactly: spelling, capitals, long s rendered as s, brackets kept. Compare with the app's transcription.", materials: ["Internet Archive page cited on the pair"] },
      { title: "The pointers", duration: "15 min", description: "Read three unverifiable pairs. For each, students write what would be needed to check it and where it would be found.", materials: [] },
    ],
    discussionQuestions: ["How could a reader have caught the Saukamappee error without the book?", "Hearne really did report Matonabbee's words, and the seed added sentences of its own. Is a half-real quotation worse than an invented one?", "Why did the app keep the seventeen pointers rather than delete them?", "What makes a published edition more trustworthy than a website that quotes it?"],
    assessment: "A completed printable with all six pairs classified and evidenced, and one sentence transcribed from a cited page with no more than two transcription errors.",
    extensions: "Take any quotation attributed to an explorer on a website and try to find it in a published edition. Report what happened.",
    teacherObjectives: ["Students can use an edition's page as evidence and cite it", "Students can explain the difference between a text that failed the check and one that cannot be checked"],
    teacherActivities: [{ title: "Reading the note", duration: "10 min", description: "Every checked document carries a line in its context naming the edition and what, if anything, of the first wording was not in it. Have students find that line on three documents and read it as a historian's footnote.", materials: [] }],
    teacherQuestions: ["Which kind of difference did students find hardest to classify?", "Did any student treat the first version as the explorer's words? Where did that come from?"],
    teacherNotes: "The pairs show both texts as they are, in full. The discussion is about method, not about the writer; nothing in the unit comments on an author's wording. The first version is unverified text and is never to be quoted as the author's words.",
  },
  {
    id: "lesson_checking_the_record_10_12", gradeLevel: "10-12", estimatedMinutes: 90, readingTimeMinutes: 10,
    title: "Provenance: What It Takes to Trust a Quotation",
    description: "Senior students audit the app's own record. Given only a seed passage and the edition it should have come from, they find where it came from, or show that it did not; they classify the failure, reconstruct how it could have been caught, and write a corrections note in the form the app uses.",
    objectives: ["Define provenance and apply it to a quoted passage", "Locate a passage in a digitized edition or demonstrate its absence", "Classify failures of attribution, transcription and invention", "Write a corrections note that names the edition, the page and the change"],
    materials: ["The app's Checking the Record screen (Learn tab), pairs for grades 10-12", "The printable Checking the Record, six pairs", "Devices with the Internet Archive editions cited on the pairs"],
    mainContent: "## Teaching context\n\nThe unit is an audit the app performed on itself in October 2026, repeated by students. Forty-four seed passages were checked against published editions; twenty-seven were replaced by the printed sentences and seventeen could not be checked. For this band use Back's two pairs (a number that is seventy in the book, a river entry that does not exist), La Salle's act of possession (a notarial record that held up), Turnor's engagement (a letter running the wrong way, with a proposed school that is not in the record), Tyrrell's bone beds (a first-person story beside a report that never mentions the skull), Norton's orders (a summary beside the whole document), and three unverifiable pointers.\n\n## Sequence\n\n1. Provenance defined: author, date, medium, edition, page. Apply it to Back at Fort Reliance; the number is the tell.\n2. Blind check: give students the seed passage and the edition only, not the published column. They find the passage or show it is absent. Then reveal.\n3. Classification and the corrections note: for each pair, students write the note the app would carry, in the app's own form (Quotation checked against..., what of the first wording was not in it).\n4. The pointers: what an archive holds that a library does not, and what it costs to check.\n\n## Vocabulary\n\nprovenance, edition, apparatus, transcription, attribution, notarial record, archive, interpolation.",
    activities: [
      { title: "The number is the tell", duration: "15 min", description: "Back at Fort Reliance. Sixty below in the first version, seventy in the book. Students find the page and read the sentence, then say why a wrong number is the easiest failure to catch and the hardest to excuse.", materials: ["Checking the Record screen"] },
      { title: "Blind check", duration: "30 min", description: "Students receive a seed passage and the edition's link only. They search the edition for the passage and report: found (page), partly found (which sentences), or absent. Then they open the pair and compare their finding with the app's.", materials: ["Internet Archive editions"] },
      { title: "Write the corrections note", duration: "25 min", description: "For two pairs, students write the note the document carries, in the app's form: the edition and page, what the first version had, what the book has, and what was done.", materials: ["Printable: Checking the Record, six pairs"] },
      { title: "What archives hold", duration: "15 min", description: "The Hudson's Bay Company Archives references on the unverifiable pairs (B.239/a/1-3). What is there, who can read it, and what would it take to check Fidler's winter with the Peigan.", materials: [] },
    ],
    discussionQuestions: ["Is a passage that cannot be checked different in kind from one that failed the check?", "Turnor's engagement ran from the Company to him, not the reverse. What does the direction of a document tell you about its content?", "The Dictionary of Canadian Biography prints single sentences from unpublished journals. Is a sentence quoted in a biography a primary source?", "What should a reader do with a quotation that cites no edition?"],
    assessment: "Two corrections notes in the app's form, each naming the edition and page, the difference, and the kind of failure; and a blind-check report on one passage with the page found or absence demonstrated.",
    extensions: "Find a quotation attributed to any explorer in a textbook or on a plaque and run the same check. Write the note.",
    teacherObjectives: ["Students can distinguish provenance from plausibility", "Students can produce a citation to an edition and page that another reader could follow"],
    teacherActivities: [{ title: "The apparatus", duration: "15 min", description: "Biggar's square brackets, the long s, the facing French page, the Dictionary of Canadian Biography's archival references: what each piece of apparatus tells a reader and how the app keeps it.", materials: [] }],
    teacherQuestions: ["Which failures could the blind check catch and which needed the published column?", "Did students treat the unverifiable pointers as suspect or as honest? Which is right?"],
    teacherNotes: "Both texts on a pair are shown as they are. The unit comments on checking, never on an author's wording, and the first version is never quoted as the author's words.",
  },
];

const PRINTABLE_ID = "printable_checking_the_record";
const PRINTABLE_PAIRS = ["sp_hearne_coppermine_1771", "sp_mackenzie_rock_1793", "sp_saukamappee_1787", "sp_back_fort_reliance_1834", "sp_cartier_gaspe_1534", "sp_fidler_peigan_1792"];

// Curriculum outcomes the three lessons meet (ids from the CurriculumOutcome table)
const LESSON_OUTCOMES: Record<string, string[]> = {
  lesson_checking_the_record_4_6: ["on_g5_A2.4", "on_g6_A2.2", "on_g5_A2.2", "ns_g5_o1", "nl_g5_1_0", "nl_g5_1_1", "nl_g5_1_2", "nl_g4_2_1", "sk_g5_IN5_1_c", "mb_g5_5_KH_025"],
  lesson_checking_the_record_7_9: ["on_g7_A2.3", "on_g7_B2.3", "on_g8_A2.3", "on_g7_A2.5", "ns_g5_o1", "ns_g7_o1", "nl_g8_1_1", "nl_g8_1_1_5", "nl_g8_1_1_6", "nl_g8_1_2", "nl_g8_1_2_1", "sk_g8_DR8_3_b", "ab_g7_7_1_3"],
  lesson_checking_the_record_10_12: ["on_g11_C1.1", "on_g8_A2.3", "on_g8_B2.3", "nl_g8_1_1_5", "nl_g8_1_1_6", "nl_g8_1_2_3", "nl_g8_1_2_5", "bc_g10_bigidea_3", "qc_hqc_1608_1760_43"],
};

function escapeHtml(s: string) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

async function main() {
  const backup = JSON.parse(readFileSync(resolve(import.meta.dir, "backups", "2026-10-18-sweep-11-before.json"), "utf8")) as { documents: { id: string; title: string; transcription: string | null; originalText: string | null }[] };
  const seedById = new Map(backup.documents.map((d) => [d.id, d]));
  const docs = await db.primarySourceDocument.findMany({ where: { id: { in: PAIRS.map((p) => p.documentId) } }, select: { id: true, title: true, author: true, originalYear: true, transcription: true } });
  const docById = new Map(docs.map((d) => [d.id, d]));
  const editions = await db.citation.findMany({ where: { targetType: "document", kind: "edition", targetId: { in: PAIRS.map((p) => p.documentId) } } });
  const editionByDoc = new Map(editions.map((c) => [c.targetId, c]));
  const outcomeIds = new Set((await db.curriculumOutcome.findMany({ select: { id: true } })).map((o) => o.id));

  const problems: string[] = [];
  for (const p of PAIRS) {
    const seed = seedById.get(p.documentId); const doc = docById.get(p.documentId);
    if (!seed) problems.push(`no seed text in backup for ${p.id} (${p.documentId})`);
    else if (!seed.transcription) problems.push(`backup transcription empty for ${p.id}`);
    if (!doc) problems.push(`document missing in Turso for ${p.id} (${p.documentId})`);
    const restored = !["unverifiable", "no_such_document"].includes(p.kind);
    if (doc && restored && !doc.transcription) problems.push(`${p.id} kind ${p.kind} but the document has no published text`);
    if (doc && !restored && doc.transcription) problems.push(`${p.id} kind ${p.kind} but the document carries a transcription`);
    if (restored && !editionByDoc.has(p.documentId)) problems.push(`${p.id} has no edition citation`);
  }
  if (new Set(PAIRS.map((p) => p.id)).size !== PAIRS.length) problems.push("duplicate pair ids");
  if (PAIRS.length !== backup.documents.length) problems.push(`backup has ${backup.documents.length} documents, PAIRS has ${PAIRS.length}`);
  for (const [lid, ids] of Object.entries(LESSON_OUTCOMES)) for (const id of ids) if (!outcomeIds.has(id)) problems.push(`lesson ${lid}: unknown outcome ${id}`);
  for (const id of PRINTABLE_PAIRS) if (!PAIRS.some((p) => p.id === id)) problems.push(`printable pair ${id} unknown`);

  const before = { pairs: await db.sourcePair.findMany(), lessons: await db.lessonPlan.findMany({ where: { id: { in: LESSONS.map((l) => l.id) } } }), printable: await db.printableResource.findUnique({ where: { id: PRINTABLE_ID } }) };
  const backupFile = writeBackup("2026-10-21-source-pairs-before", before);
  if (problems.length) { report("ABORT", { problems }); process.exitCode = 1; return; }

  const kinds: Record<string, number> = {};
  for (const p of PAIRS) kinds[p.kind] = (kinds[p.kind] ?? 0) + 1;
  report("source pairs", { backupFile, pairs: PAIRS.length, kinds, lessons: LESSONS.map((l) => `${l.id} (${l.gradeLevel}, ${LESSON_OUTCOMES[l.id]!.length} outcomes)`), printable: PRINTABLE_ID, existingPairs: before.pairs.length });
  if (!APPLY) return;

  const now = new Date();
  let n = 0;
  for (const p of PAIRS) {
    const seed = seedById.get(p.documentId)!;
    n += 1;
    const data = { documentId: p.documentId, seedTitle: seed.title, seedText: seed.transcription!, kind: p.kind, whatChanged: p.whatChanged, task: TASKS[p.kind], gradeLevel: p.gradeLevel, sortOrder: n, isPublished: true, updatedAt: now };
    await db.sourcePair.upsert({ where: { id: p.id }, create: { id: p.id, ...data }, update: data });
  }
  for (const l of LESSONS) {
    const { id, objectives, materials, activities, discussionQuestions, teacherObjectives, teacherActivities, teacherQuestions, ...rest } = l;
    const data = { ...LESSON_BASE, ...rest, objectives: JSON.stringify(objectives), materials: JSON.stringify(materials), activities: JSON.stringify(activities), discussionQuestions: JSON.stringify(discussionQuestions), teacherObjectives: JSON.stringify(teacherObjectives), teacherActivities: JSON.stringify(teacherActivities), teacherQuestions: JSON.stringify(teacherQuestions), curriculumConnections: JSON.stringify([{ subject: "History", strand: "Historical inquiry", expectation: "Assess the credibility of sources and information" }]), updatedAt: now };
    await db.lessonPlan.upsert({ where: { id }, create: { id, ...data }, update: data });
    for (const oid of LESSON_OUTCOMES[id]!) {
      const existing = await db.lessonOutcome.findFirst({ where: { lessonPlanId: id, outcomeId: oid } });
      if (!existing) await db.lessonOutcome.create({ data: { id: `lo_${id}_${oid}`, lessonPlanId: id, outcomeId: oid, updatedAt: now } });
    }
  }
  // Printable: six pairs, two columns each, a box for the kind and a line for why it matters
  const rowsHtml = PRINTABLE_PAIRS.map((pid, i) => {
    const p = PAIRS.find((x) => x.id === pid)!; const seed = seedById.get(p.documentId)!; const doc = docById.get(p.documentId)!; const ed = editionByDoc.get(p.documentId);
    const published = doc.transcription ? escapeHtml(doc.transcription) : "<em>No published edition could be found for this passage. It cannot be checked.</em>";
    return `<h3>Pair ${i + 1}: ${escapeHtml(doc.title)}</h3><p class="edition">${ed ? `Edition: ${escapeHtml(ed.title)}${ed.year ? ` (${escapeHtml(ed.year)})` : ""}` : "Edition: none found"}</p><table class="pair"><tr><th>As the app first carried it (never checked)</th><th>As published</th></tr><tr><td>${escapeHtml(seed.transcription!)}</td><td>${published}</td></tr></table><p class="box">Kind of difference: &#9744; not in the source &nbsp; &#9744; partly in the source &nbsp; &#9744; paraphrase &nbsp; &#9744; wrong number &nbsp; &#9744; wrong date or author &nbsp; &#9744; short form &nbsp; &#9744; confirmed &nbsp; &#9744; cannot be checked</p><p class="line">Why it matters: ________________________________________________________________</p>`;
  }).join("\n");
  const content = `<style>.pair{width:100%;border-collapse:collapse;margin:8px 0}.pair th,.pair td{border:1px solid #999;padding:6px;vertical-align:top;width:50%;font-size:11pt}.edition{font-size:10pt;color:#444}.box,.line{font-size:10.5pt}</style><h2>Checking the Record</h2><p>Each pair shows a passage as this app first carried it, before anyone had checked it, and the sentences as published in the edition named. Read both columns. Mark the kind of difference and write one line on why it matters. One of the six cannot be checked at all: say what would be needed to check it.</p>\n${rowsHtml}`;
  const printable = { title: "Checking the Record: Six Pairs", description: "Six passages as the app first carried them beside the sentences as published, with a box for the kind of difference and a line for why it matters. One pair cannot be checked, by design.", resourceType: "activity_sheet", gradeLevel: "7-9", topic: "primary_sources", content, teacherNotes: "Pairs the Checking the Record screen (Learn tab) with paper. Answers: Hearne, not in the source (numbers); Mackenzie's rock, short form; Saukamappee, wrong author and date; Back, wrong number (seventy, not sixty); Cartier at Gaspé, confirmed (the chief's name was supplied, the narrative gives none here); Fidler with the Peigan, cannot be checked (the journal is unpublished). The first column is never to be quoted as the author's words.", answerKey: JSON.stringify({ sp_hearne_coppermine_1771: "not_in_source", sp_mackenzie_rock_1793: "abbreviation", sp_saukamappee_1787: "date_or_author", sp_back_fort_reliance_1834: "number_changed", sp_cartier_gaspe_1534: "confirmed", sp_fidler_peigan_1792: "unverifiable" }), isPublished: true, isCore: false, visibility: "private", updatedAt: now };
  await db.printableResource.upsert({ where: { id: PRINTABLE_ID }, create: { id: PRINTABLE_ID, ...printable }, update: printable });

  const verify = { pairs: await db.sourcePair.count(), byKind: await db.sourcePair.groupBy({ by: ["kind"], _count: { _all: true } }), lessons: await db.lessonPlan.count({ where: { id: { in: LESSONS.map((l) => l.id) } } }), lessonOutcomes: await db.lessonOutcome.count({ where: { lessonPlanId: { in: LESSONS.map((l) => l.id) } } }), printable: !!(await db.printableResource.findUnique({ where: { id: PRINTABLE_ID } })) };
  report("verify", verify);
}

await main();
