// Roadmap item 9 (2026-10-21): curriculum alignment by province. Seeds CurriculumOutcome from the
// data files beside this script and LessonOutcome from the map below.
//   bun run prisma/turso-migrations/2026-10-21-curriculum-outcomes-seed.ts [--apply]
// Outcome rows (data/curriculum-outcomes-*.json) were generated from the provinces' published
// documents, text as published:
//   ON  Ontario Curriculum, Social Studies Grades 1–6, History and Geography Grades 7–8 (2023 and 2018
//       editions as published on the Ministry's curriculum site), History Grades 7–8 (2026), and
//       NBV3C (First Nations, Métis and Inuit Studies) — read from the Ministry's content API.
//   BC  Social Studies 4, 5, 9 and 10 Big Ideas and Content (curriculum.gov.bc.ca).
//   AB  Social Studies K–6 (2024) grades 2, 3, 4 and 6, and the 2005 Program of Studies Grade 7
//       (7.1 and 7.2) — read from curriculum.learnalberta.ca's public content files.
//   QC  Progression of Learning, Geography, History and Citizenship Education (elementary, 2009)
//       and the History of Québec and Canada program (Secondary III–IV, 2017) — read from the
//       Ministry's PDFs.
// Re-runnable: outcomes are inserted or updated by id; lesson mappings are inserted or updated by
// (lessonPlanId, outcomeId). Nothing is deleted. A lesson whose title in Turso does not match the
// title recorded here aborts the run before any write.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

interface OutcomeRow { id: string; province: string; grade: string; course: string; strand: string | null; code: string | null; text: string; kind: string; sourceTitle: string; sourceUrl: string; sourceYear: string | null; sortOrder: number }

const DATA_FILES = ["curriculum-outcomes-on-bc.json", "curriculum-outcomes-ab.json", "curriculum-outcomes-qc.json"];

/** Lesson plan → outcome ids, with an optional note on how the lesson meets the outcome. Lesson ids and titles as in Turso on 2026-10-21. */
interface LessonMap { id: string; title: string; outcomes: (string | [string, string])[] }
const LESSONS: LessonMap[] = [
  // ---- K-3 ----
  { id: "cmliiajbw0004m2u260srsthb", title: "A Day at the Trading Post", outcomes: [
    "on_g3_A3.3", "on_g3_A3.6", "on_g3_A3.8", "ab_g4_lo4_k3", "ab_g4_lo4_k4", "ab_g4_lo4_sp2", "bc_g4_content_6", "bc_g4_content_5",
    ["qc_prog_C_3_c", "The lesson's post sits at a river confluence."], "qc_prog_C_4_c"] },
  { id: "cmliiajbo0001m2u2lltp5xgn", title: "Animals of the Fur Trade", outcomes: [
    "on_g3_A1.2", "on_g3_B1.1", "ab_g2_lo3_k1", "ab_g4_lo4_k1", "ab_g4_lo2_k7", "bc_g4_bigidea_1", "bc_g4_content_6", "qc_prog_C_3_d"] },
  { id: "cmliiajc30005m2u2rt6xuz2e", title: "Explorers and Their Ships", outcomes: [
    "ab_g4_lo1_k1", "ab_g4_lo1_sp3", "ab_g4_lo1_sp1", "on_g5_A3.3", "qc_prog_B_1_b", "qc_hqc_originsto1608_23", "bc_g4_content_5"] },
  { id: "cmliiajbt0003m2u27u32vbfr", title: "First Nations Canoe Builders", outcomes: [
    "on_g3_A1.2", "on_g3_A3.6", "ab_g2_lo2_sp1", "qc_prog_B_2_3_b", "qc_prog_B_3_d", "qc_hqc_originsto1608_17", "bc_g4_content_10"] },
  { id: "cmliiajbr0002m2u2sj3x76t7", title: "Following the Rivers", outcomes: [
    "on_g3_B3.3", "on_g3_B3.2", "on_g3_A2.3", "ab_g2_lo1_k1", "ab_g2_lo1_k2", "ab_g2_lo1_sp3", "bc_g4_content_11", "qc_prog_B_2_3_c"] },
  { id: "cmliiajbd0000m2u231mzvoiv", title: "Meet the Voyageurs", outcomes: [
    "on_g3_A3.6", "on_g3_A3.2", "on_g3_A1.1", "ab_g4_lo4_k4", "bc_g4_content_6", "qc_prog_C_4_b", "qc_prog_C_2_3_b"] },
  // ---- 4-6 ----
  { id: "cmliiajcg0007m2u2po4lyhcw", title: "David Thompson: Master Mapmaker", outcomes: [
    "on_g5_A2.3", "on_g6_A2.3", "on_g7_A2.4", "ab_g4_lo1_sp3", "ab_g4_lo4_k2", "bc_g4_content_6", "bc_g4_content_11", "qc_hqc_1791_1840_19"] },
  { id: "cmliiajcm0009m2u2xpwxzc17", title: "Forts of the Fur Trade", outcomes: [
    "ab_g4_lo4_k2", "ab_g4_lo4_k3", "on_g5_A3.5", "on_g7_A3.4", "bc_g4_content_6", "qc_prog_C_3_c", "qc_hqc_1608_1760_42", "qc_hqc_1760_1791_20"] },
  { id: "cmliiajcc0006m2u2n93x5b2b", title: "The Hudson's Bay Company", outcomes: [
    "ab_g4_lo4_k2", "ab_g4_lo4_k1", "on_g5_A3.5", "on_g7_A3.4", ["on_g8_A1.1", "The transfer of Rupert's Land, 1870."], "bc_g4_content_6", "bc_g4_bigidea_1", "qc_hqc_1608_1760_1", "qc_hqc_1791_1840_21"] },
  { id: "cmligbkyc001dm20zsv5hrm6o", title: "The Hudson's Bay Company: From Fur Trade to Modern Retail", outcomes: [
    "ab_g4_lo4_k2", "ab_g4_lo4_k1", "on_g5_A3.5", "on_g7_A3.4", ["on_g8_A1.1", "The transfer of Rupert's Land, 1870."], "bc_g4_content_6", "bc_g4_bigidea_1", "qc_hqc_1608_1760_1", "qc_hqc_1791_1840_21"] },
  { id: "cmliiajcj0008m2u2gtcpor3y", title: "The Pemmican Trail", outcomes: [
    "ab_g4_lo4_k4", "ab_g3_lo2_k9", "on_g5_A3.6", ["on_g7_B3.4", "The Pemmican Proclamation of 1814 and the Red River settlement."], "bc_g4_content_6", "qc_hqc_1791_1840_19"] },
  { id: "cmliiajcq000am2u2h58ck1el", title: "The Red River Cart", outcomes: [
    "ab_g3_lo2_k8", "ab_g3_lo2_u2", "ab_g7_7_2_4", "on_g5_A3.6", "on_g6_A1.2", "bc_g4_content_6"] },
  { id: "cmligbky00019m20z21c6dp3y", title: "The Voyageur Life", outcomes: [
    "ab_g4_lo4_k4", "ab_g4_lo4_sp1", "on_g5_A3.5", "on_g7_A3.6", "bc_g4_content_6", "qc_prog_C_4_b", "qc_prog_D_4_b", "qc_hqc_1608_1760_43"] },
  { id: "lesson_river_highways", title: "River Highways: How Indigenous Routes Became the Fur Trade's Roads", outcomes: [
    "on_g5_A3.2", "on_g5_A3.5", "on_g5_A2.3", "ab_g4_lo4_k2", "ab_g4_lo4_k4", "bc_g4_content_5", "bc_g4_content_6",
    "qc_prog_B_2_3_c", "qc_prog_C_2_3_c", "qc_hqc_originsto1608_17", "qc_hqc_originsto1608_16"] },
  // ---- 7-9 ----
  { id: "cmliiajde000em2u2hdx1wen2", title: "Country Marriages and Metis Identity", outcomes: [
    "on_g7_A3.8", "on_g7_A3.5", "on_g5_A3.6", "ab_g7_7_1_3", "ab_g4_lo4_k5", "ab_g7_7_2_4", "bc_g4_content_7", "bc_g9_content_6", "qc_hqc_1608_1760_34"] },
  { id: "cmliiajd7000cm2u2r8ta6amg", title: "Indigenous Perspectives on European Contact", outcomes: [
    "on_g7_A2.1", "on_g7_A2.2", "on_g7_A2.3", "on_g5_A1.1", "on_g5_A1.2", "ab_g7_7_1_3", "ab_g7_7_1_3_q4", "ab_g7_7_1_2",
    "bc_g4_content_5", "bc_g4_bigidea_2", "bc_g9_content_6", "qc_hqc_originsto1608_26", "qc_hqc_originsto1608_25"] },
  { id: "cmligbky2001am20zloxux478", title: "Louis Riel and the Metis Nation", outcomes: [
    "on_g8_A3.1", "on_g8_A3.3", "on_g8_A3.7", "on_g8_A3.8", "ab_g7_7_2_4", "ab_g7_7_2_4_q1", "ab_g7_7_2_4_q2", "bc_g9_content_8", "bc_g9_content_9", "qc_hqc_1840_1896_39"] },
  { id: "lesson_new_france_to_the_gulf", title: "New France to the Gulf: Jolliet, Marquette and La Salle", outcomes: [
    "on_g5_A3.3", "on_g5_A3.4", "on_g7_A3.1", "ab_g7_7_1_3_q6", "ab_g4_lo2_k2", "bc_g4_content_5",
    "qc_prog_D_1_a", "qc_prog_C_4_c", "qc_hqc_1608_1760_42", "qc_hqc_1608_1760_12"] },
  { id: "lesson_atlantic_gateway", title: "The Atlantic Gateway: Where Europe First Met the Northeast", outcomes: [
    "on_g5_A3.1", "on_g5_A3.3", "on_g5_A1.1", "ab_g4_lo1_k1", "ab_g7_7_1_3_q6", "bc_g4_content_5",
    "qc_hqc_originsto1608_23", "qc_hqc_originsto1608_24", "qc_hqc_originsto1608_27", "qc_prog_B_1_b"] },
  { id: "lesson_the_bay", title: "The Bay: Cree, Inuit, Dene and the Company on Hudson Bay", outcomes: [
    "on_g7_A3.4", "on_g7_A3.8", "on_g5_A3.5", "ab_g7_7_1_4", "ab_g7_7_1_4_q1", "ab_g4_lo4_k2", "bc_g4_content_6", "bc_g9_bigidea_2",
    ["qc_hqc_1608_1760_39", "Hudson Bay confirmed to Britain, 1713."], "qc_hqc_1608_1760_37"] },
  { id: "cmliiajd3000bm2u2ya9gqld7", title: "The Great Rivalry: HBC vs NWC", outcomes: [
    "ab_g7_7_1_4", "ab_g7_7_1_4_q3", "on_g7_B3.4", "on_g7_B3.6", "on_g7_B3.1", "bc_g4_content_6", "qc_hqc_1791_1840_19", "qc_hqc_1791_1840_20", "qc_hqc_1791_1840_21"] },
  { id: "cmliiajda000dm2u233io4qsk", title: "The Northwest Passage: Dreams and Disasters", outcomes: [
    ["on_g7_B3.1", "The Franklin expedition of 1845."], "on_g7_B2.4", "on_g5_A3.3", "ab_g4_lo1_sp3", "ab_g7_7_1_3_q8", "bc_g9_bigidea_2"] },
  { id: "lesson_yukon_river_road", title: "The Yukon: A River Road from the Company to the Klondike", outcomes: [
    "on_g8_A3.1", ["on_g8_B3.3", "The Klondike gold rush, 1896–99."], "on_g8_B3.5", "ab_g7_7_2_5", "bc_g4_content_6", "bc_g4_content_8"] },
  { id: "cmlheagqq0006m28u7nkab8us", title: "Voyageur Routes of Canada", outcomes: [
    "on_g7_A2.4", "on_g7_A3.4", "on_g7_B2.4", "ab_g7_7_1_4", "ab_g4_lo4_k2", "bc_g4_content_6", "qc_hqc_1608_1760_42", "qc_hqc_1791_1840_19"] },
  { id: "cmligbky5001bm20zjl63dkn9", title: "Women of the Fur Trade", outcomes: [
    "on_g7_A3.5", "on_g7_A3.8", "on_g7_A3.9", "ab_g4_lo4_k5", "ab_g4_lo4_sp3", "ab_g7_7_1_3_q2", "bc_g4_content_5", "qc_hqc_1608_1760_34"] },
  // ---- 10-12 ----
  { id: "cmliiajds000im2u2op3br5x9", title: "Environmental Impact of the Fur Trade", outcomes: [
    "on_g11_C1.3", "bc_g10_content_6", "bc_g9_bigidea_2", "bc_g4_bigidea_1", "ab_g7_7_1_4_q2", "qc_hqc_1608_1760_41"] },
  { id: "cmliiajdm000gm2u29djof743", title: "Historiography of the Fur Trade", outcomes: [
    "on_g11_C1.1", "on_g7_A2.3", "on_g8_A2.3", "bc_g10_bigidea_3", "bc_g10_bigidea_4", "ab_g7_7_1_4", "qc_hqc_1608_1760_43"] },
  { id: "cmliiajdp000hm2u2p97957m6", title: "Indigenous Sovereignty and Treaty Rights", outcomes: [
    "on_g11_C1.1", "on_g11_C1.2", "on_g11_C1.3", "on_g8_A3.3", "bc_g10_content_5", "bc_g10_content_9", "bc_g10_content_12",
    "ab_g6_lo3_k5", "ab_g4_lo1_k7", "ab_g3_lo1_k3", "ab_g7_7_1_6_q2", "qc_hqc_1760_1791_9"] },
  { id: "cmligbky9001cm20z3vukcwiq", title: "Mapping Canada: The Work of David Thompson", outcomes: [
    "on_g7_B2.4", "on_g7_B3.7", "on_g7_B3.6", "bc_g9_content_11", "ab_g7_7_1_4", "qc_hqc_1791_1840_19"] },
  { id: "cmliiajdk000fm2u2maena1rg", title: "The Economics of Empire: Mercantilism and the Fur Trade", outcomes: [
    "qc_hqc_1608_1760_2", "qc_hqc_1608_1760_1", "qc_hqc_1608_1760_27", "on_g7_A3.4", "on_g5_A3.4", "bc_g4_bigidea_1", "bc_g10_bigidea_2",
    "ab_g7_7_1_4", "ab_g7_7_1_4_q5", "ab_g4_lo4_k1"] },
  { id: "cmliiajdv000jm2u2f2sgv1nj", title: "The Fall of New France: 1760", outcomes: [
    "qc_hqc_1608_1760_63", "qc_hqc_1608_1760_64", "qc_hqc_1608_1760_65", "qc_hqc_1760_1791_6", "on_g7_A3.1", "on_g7_A3.3",
    "ab_g7_7_1_5", "ab_g7_7_1_5_q3", "ab_g4_lo1_k4", "bc_g9_content_9"] },
  { id: "lesson_pacific_contest", title: "The Pacific Contest: Four Empires on the Northwest Coast, 1741-1846", outcomes: [
    "bc_g4_content_8", "bc_g4_bigidea_4", "bc_g4_content_5", "bc_g9_content_6", ["on_g7_B3.1", "The Oregon Treaty of 1846."], "on_g7_B2.4", "ab_g7_7_1_3_q8", "ab_g7_7_1_5"] },
  { id: "lesson_two_oceans_one_passage", title: "Two Oceans, One Passage: The Arctic Searches, 1576-1909", outcomes: [
    ["on_g7_B3.1", "The Franklin expedition of 1845."], ["on_g8_A3.1", "The Franklin searches of 1848–59."], "on_g7_B2.4", "bc_g9_bigidea_2", "ab_g7_7_1_3_q8",
    ["qc_hqc_1945_1980_2", "Amundsen's transit of 1903–06 and the question of Canadian sovereignty that followed."]] },
];

function loadOutcomes(): OutcomeRow[] {
  const rows: OutcomeRow[] = [];
  for (const f of DATA_FILES) rows.push(...(JSON.parse(readFileSync(resolve(import.meta.dir, "data", f), "utf8")) as OutcomeRow[]));
  return rows;
}

async function main() {
  const outcomes = loadOutcomes();
  const byId = new Map(outcomes.map((o) => [o.id, o]));
  const problems: string[] = [];
  if (byId.size !== outcomes.length) problems.push(`duplicate outcome ids: ${outcomes.length - byId.size}`);
  for (const o of outcomes) if (!o.id || !o.province || !o.grade || !o.course || !o.text || !o.sourceTitle || !o.sourceUrl) problems.push(`incomplete outcome ${o.id}`);

  const lessons = await db.lessonPlan.findMany({ select: { id: true, title: true } });
  const lessonTitle = new Map(lessons.map((l) => [l.id, l.title]));
  const mappings: { lessonPlanId: string; outcomeId: string; note: string | null }[] = [];
  for (const l of LESSONS) {
    const live = lessonTitle.get(l.id);
    if (live !== l.title) problems.push(`lesson ${l.id}: expected "${l.title}", Turso has ${live === undefined ? "no row" : `"${live}"`}`);
    const seen = new Set<string>();
    for (const entry of l.outcomes) {
      const [outcomeId, note] = Array.isArray(entry) ? entry : [entry, null];
      if (!byId.has(outcomeId)) problems.push(`lesson ${l.id}: unknown outcome ${outcomeId}`);
      if (seen.has(outcomeId)) problems.push(`lesson ${l.id}: outcome ${outcomeId} listed twice`);
      seen.add(outcomeId);
      mappings.push({ lessonPlanId: l.id, outcomeId, note });
    }
  }
  const unmapped = lessons.filter((l) => !LESSONS.some((m) => m.id === l.id)).map((l) => `${l.id} ${l.title}`);

  const [existingOutcomes, existingMaps] = await Promise.all([db.curriculumOutcome.findMany(), db.lessonOutcome.findMany()]);
  const backupFile = writeBackup("2026-10-21-curriculum-outcomes-before", { outcomes: existingOutcomes, lessonOutcomes: existingMaps });
  if (problems.length) { report("ABORT", { problems }); process.exitCode = 1; return; }

  const existingById = new Map(existingOutcomes.map((o) => [o.id, o]));
  const toCreate = outcomes.filter((o) => !existingById.has(o.id));
  const toUpdate = outcomes.filter((o) => {
    const e = existingById.get(o.id);
    return e && (e.province !== o.province || e.grade !== o.grade || e.course !== o.course || e.strand !== o.strand || e.code !== o.code || e.text !== o.text || e.kind !== o.kind || e.sourceTitle !== o.sourceTitle || e.sourceUrl !== o.sourceUrl || e.sourceYear !== o.sourceYear || e.sortOrder !== o.sortOrder);
  });
  const mapKey = (m: { lessonPlanId: string; outcomeId: string }) => `${m.lessonPlanId}|${m.outcomeId}`;
  const existingMapByKey = new Map(existingMaps.map((m) => [mapKey(m), m]));
  const mapsToCreate = mappings.filter((m) => !existingMapByKey.has(mapKey(m)));
  const mapsToUpdate = mappings.filter((m) => { const e = existingMapByKey.get(mapKey(m)); return e && e.note !== m.note; });

  const perProvince: Record<string, number> = {};
  for (const o of outcomes) perProvince[o.province] = (perProvince[o.province] ?? 0) + 1;
  report("curriculum outcomes", {
    backupFile, outcomesInFiles: outcomes.length, perProvince, outcomesToCreate: toCreate.length, outcomesToUpdate: toUpdate.length,
    lessonsMapped: LESSONS.length, lessonsUnmapped: unmapped, mappings: mappings.length, mappingsToCreate: mapsToCreate.length, mappingsToUpdate: mapsToUpdate.length,
    perLesson: LESSONS.map((l) => ({ title: l.title, outcomes: l.outcomes.length })),
  });
  if (!APPLY) return;

  const now = new Date();
  for (let i = 0; i < toCreate.length; i += 100) {
    await db.curriculumOutcome.createMany({ data: toCreate.slice(i, i + 100).map((o) => ({ ...o, updatedAt: now })) });
  }
  for (const o of toUpdate) await db.curriculumOutcome.update({ where: { id: o.id }, data: { ...o, updatedAt: now } });
  for (let i = 0; i < mapsToCreate.length; i += 100) {
    await db.lessonOutcome.createMany({ data: mapsToCreate.slice(i, i + 100).map((m) => ({ id: `lo_${m.lessonPlanId}_${m.outcomeId}`, ...m, updatedAt: now })) });
  }
  for (const m of mapsToUpdate) await db.lessonOutcome.updateMany({ where: { lessonPlanId: m.lessonPlanId, outcomeId: m.outcomeId }, data: { note: m.note, updatedAt: now } });

  const [outcomeCount, mapCount, mappedLessons] = await Promise.all([
    db.curriculumOutcome.count(), db.lessonOutcome.count(), db.lessonOutcome.groupBy({ by: ["lessonPlanId"] }),
  ]);
  const provinces = await db.curriculumOutcome.groupBy({ by: ["province"], _count: { _all: true } });
  report("verify", { outcomeCount, mapCount, lessonsWithOutcomes: mappedLessons.length, provinces: provinces.map((p) => ({ province: p.province, outcomes: p._count._all })) });
}

await main();
